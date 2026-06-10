'use client'
import { useState, useEffect, useRef } from "react";

// ── SUPABASE CLIENT ───────────────────────────────────────────────────────────
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function supaFetch(path, opts={}) {
  if(!SUPA_URL||!SUPA_KEY){
    console.error("[Supabase] Missing URL or KEY", {url:SUPA_URL?'OK':'MISSING', key:SUPA_KEY?'OK':'MISSING'});
    return null;
  }
  try {
    const url=SUPA_URL+"/rest/v1/"+path;
    console.log("[Supabase]", opts.method||"GET", url);
    const r = await fetch(url, {
      headers: { "apikey": SUPA_KEY, "Authorization": "Bearer "+SUPA_KEY,
        "Content-Type": "application/json", "Prefer": "return=representation", ...opts.headers },
      ...opts
    });
    console.log("[Supabase] response status:", r.status);
    if(!r.ok){
      const errText=await r.text();
      console.error("[Supabase] error:", errText);
      return null;
    }
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  } catch(e) {
    console.error("[Supabase] fetch error:", e);
    return null;
  }
}

// ── PLAYER DATABASE (loaded from /players.json) ───────────────────────────────
// PLAYER_DB is populated at runtime via fetch
let PLAYER_DB = [];

// TEAMS computed dynamically after players load — see component

// ── TEAM COLORS ───────────────────────────────────────────────────────────────
const TEAM_COLORS = {
  "Las Vegas Aces":         { primary:"#C8102E", secondary:"#000000" },
  "New York Liberty":       { primary:"#86CEBC", secondary:"#000000" },
  "Seattle Storm":          { primary:"#2C5234", secondary:"#FBE122" },
  "Minnesota Lynx":         { primary:"#236192", secondary:"#79A342" },
  "Connecticut Sun":        { primary:"#E35205", secondary:"#FFC426" },
  "Indiana Fever":          { primary:"#C8102E", secondary:"#002D62" },
  "Phoenix Mercury":        { primary:"#CB6015", secondary:"#1D1160" },
  "Los Angeles Sparks":     { primary:"#702F8A", secondary:"#FFC72C" },
  "Houston Comets":         { primary:"#C8102E", secondary:"#00529B" },
  "Chicago Sky":            { primary:"#418FDE", secondary:"#FFCD00" },
  "Washington Mystics":     { primary:"#C8102E", secondary:"#002B5C" },
  "Atlanta Dream":          { primary:"#C8102E", secondary:"#418FDE" },
  "Dallas Wings":           { primary:"#0057B8", secondary:"#C4D600" },
  "Golden State Valkyries": { primary:"#006BB6", secondary:"#FFC72C" },
  "Toronto Tempo":          { primary:"#CE1141", secondary:"#000000" },
  "Sacramento Monarchs":    { primary:"#5A2D81", secondary:"#63727A" },
  "Charlotte Sting":        { primary:"#00843D", secondary:"#9EA2A2" },
  "Cleveland Rockers":      { primary:"#041E42", secondary:"#C8102E" },
  "Miami Sol":              { primary:"#98002E", secondary:"#F5A800" },
  "Portland Fire":          { primary:"#C8102E", secondary:"#000000" },
};
function teamColor(t){ return TEAM_COLORS[t]||{primary:"#f59e42",secondary:"#1f2937"}; }

// ── RESULT TIERS ─────────────────────────────────────────────────────────────
const TIERS = [
  { min:44, max:44, label:"UNDEFEATED",         color:"#f59e42",
    messages:["The GOAT lineup. Literally unbeatable. 🏆"] },
  { min:40, max:43, label:"DYNASTY SQUAD",       color:"#4ade80",
    messages:["This team runs the league for a decade.",
              "Multiple rings. No debate.",
              "The blueprint. Other GMs are taking notes."] },
  { min:37, max:39, label:"ALL-TIME GREAT",      color:"#4ade80",
    messages:["Hall of Fame roster. Just not quite perfect.",
              "One piece away from immortality.",
              "They're hanging a banner. Maybe two."] },
  { min:34, max:36, label:"CHAMPIONSHIP CONTENDER", color:"#60a5fa",
    messages:["Deep playoff run. Finals is right there.",
              "Scary come playoff time. Very scary.",
              "On paper? Terrifying. On the court? Find out."] },
  { min:30, max:33, label:"PLAYOFF BOUND",       color:"#60a5fa",
    messages:["First round and done, probably. But they made it.",
              "Sneaky dangerous in the right matchup.",
              "Middle seed energy. Dangerous? Maybe."] },
  { min:26, max:29, label:"MIDDLE OF THE PACK",  color:"#a78bfa",
    messages:["Perfectly average. Which is fine. It\'s fine.",
              "The vibes were there at least.",
              "Not bad. Not good. Just... there."] },
  { min:22, max:25, label:"BARELY HANGING ON",   color:"#a78bfa",
    messages:["Playing out the string. Respectfully.",
              "The front office is having meetings right now.",
              "At least the locker room probably had good chemistry."] },
  { min:18, max:21, label:"LOTTERY WATCH",       color:"#f87171",
    messages:["Tank mode unlocked. Draft picks incoming.",
              "The future is bright. The present is not.",
              "Somebody call the ping pong balls."] },
  { min:14, max:17, label:"ROUGH SEASON",        color:"#f87171",
    messages:["Have you considered coaching instead?",
              "The film sessions must be brutal.",
              "Improvement is a journey. This is step one."] },
  { min:10, max:13, label:"HISTORIC STRUGGLE",   color:"#f87171",
    messages:["League Pass may be a good investment.",
              "Every loss is a learning experience. So many learnings.",
              "They showed up every night. That counts for something."] },
  { min:5,  max:9,  label:"ACTUALLY TRY",        color:"#f87171",
    messages:["Okay now actually try this time.",
              "Even the expansion teams are looking at this funny.",
              "Bold strategy. Let\'s see if it pays off next time."] },
  { min:1,  max:4,  label:"HISTORICALLY BAD",    color:"#f87171",
    messages:["Somehow worse than an expansion team.",
              "This roster should be illegal in 12 states.",
              "The scouts have been fired. All of them."] },
  { min:0,  max:0,  label:"IMPRESSIVE ACTUALLY", color:"#f59e42",
    messages:["Honestly this is more impressive than 44-0.",
              "Going 0-44 takes a special kind of talent. Respect.",
              "You have to TRY to be this bad. Respect the commitment."] },
];

function getTier(wins){
  return TIERS.find(t=>wins>=t.min&&wins<=t.max)||TIERS[TIERS.length-1];
}
function getTierMessage(wins){
  const tier=getTier(wins);
  const msgs=tier.messages;
  return msgs[Math.floor(Math.random()*msgs.length)];
}

// ── SLOTS ─────────────────────────────────────────────────────────────────────
const SLOTS=[
  {key:"PG",posGroup:"G"},{key:"SG",posGroup:"G"},
  {key:"SF",posGroup:"F"},{key:"PF",posGroup:"F"},
  {key:"C", posGroup:"C"},
];

// ── MOCK LEADERBOARD ──────────────────────────────────────────────────────────
const MOCK_LB=[
  {username:"wnbageek99",wins:44,losses:0,teamOff:97,teamDef:94,
   roster:[{name:"A'ja Wilson",season:2025,slot:"C"},{name:"Breanna Stewart",season:2018,slot:"PF"},
           {name:"Maya Moore",season:2014,slot:"SF"},{name:"Cynthia Cooper",season:1998,slot:"SG"},
           {name:"Sylvia Fowles",season:2017,slot:"PG"}]},
  {username:"hoophead_liz",wins:44,losses:0,teamOff:95,teamDef:96,
   roster:[{name:"A'ja Wilson",season:2024,slot:"C"},{name:"Napheesa Collier",season:2024,slot:"PF"},
           {name:"Lauren Jackson",season:2007,slot:"SF"},{name:"Diana Taurasi",season:2008,slot:"SG"},
           {name:"Tamika Catchings",season:2009,slot:"PG"}]},
  {username:"courtside_k",wins:44,losses:0,teamOff:96,teamDef:93,
   roster:[{name:"A'ja Wilson",season:2025,slot:"C"},{name:"Sylvia Fowles",season:2017,slot:"PF"},
           {name:"Elena Delle Donne",season:2015,slot:"SF"},{name:"Cynthia Cooper",season:1997,slot:"SG"},
           {name:"Sue Bird",season:2004,slot:"PG"}]},
  {username:"wnba_oracle",wins:44,losses:0,teamOff:99,teamDef:91,
   roster:[{name:"Cynthia Cooper",season:1998,slot:"PG"},{name:"Diana Taurasi",season:2006,slot:"SG"},
           {name:"Maya Moore",season:2014,slot:"SF"},{name:"Tamika Catchings",season:2009,slot:"PF"},
           {name:"Lisa Leslie",season:2001,slot:"C"}]},
  {username:"ballislife22",wins:44,losses:0,teamOff:94,teamDef:97,
   roster:[{name:"Lauren Jackson",season:2007,slot:"C"},{name:"Tamika Catchings",season:2006,slot:"PF"},
           {name:"Breanna Stewart",season:2023,slot:"SF"},{name:"Sheryl Swoopes",season:2000,slot:"SG"},
           {name:"Lindsey Whalen",season:2013,slot:"PG"}]},
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function playerBase(n){return n.toLowerCase().trim();}
function initials(n){return n.split(" ").filter(Boolean).map(w=>w[0]).join("").slice(0,2).toUpperCase();}
function shortLabel(p){if(!p)return null;const yr=String(p.season).slice(2);const last=p.name.split(" ").pop();return `'${yr} ${last}`;}
function playerPosGroups(pos){if(!pos)return["F"];if(pos.includes("-"))return[...new Set(pos.split("-"))];return[pos];}
function getPosPenalty(pos,slotGroup){
  const g=playerPosGroups(pos);
  if(g.includes(slotGroup))return 1.0;
  const adj={G:["F"],F:["G","C"],C:["F"]};
  if(adj[g[0]]?.includes(slotGroup))return 0.95;
  return 0.85;
}
const POS_COLOR={G:"#f59e42",F:"#4ade80",C:"#60a5fa"};
function posColor(pos){if(!pos)return"#6b7280";if(pos.startsWith("G"))return POS_COLOR.G;if(pos.startsWith("C"))return POS_COLOR.C;return POS_COLOR.F;}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

// ── BOARD GENERATION ──────────────────────────────────────────────────────────
// Franchise tiers for weighting
const TEAM_TIERS={
  "Las Vegas Aces":2,"Indiana Fever":2,"New York Liberty":2,
  "Seattle Storm":2,"Minnesota Lynx":2,"Phoenix Mercury":2,
  "Los Angeles Sparks":1,"Connecticut Sun":1,"Atlanta Dream":1,
  "Chicago Sky":1,"Washington Mystics":1,"Dallas Wings":1,
  "Houston Comets":1,"Sacramento Monarchs":1,"Charlotte Sting":1,
  "Cleveland Rockers":1,
  "Golden State Valkyries":0,"Toronto Tempo":0,"Miami Sol":0,"Portland Fire":0,
};

// ── LEAGUE CONFIG ──────────────────────────────────────────────────────────────
const LEAGUES={
  wnba:{name:"WNBA",emoji:"🏀",record:"44-0",games:44,active:true,color:"#f59e42"},
  nba:{name:"NBA",emoji:"🏀",record:"82-0",games:82,active:false,color:"#f97316"},
  nfl:{name:"NFL",emoji:"🏈",record:"17-0",games:17,active:false,color:"#22c55e"},
  mlb:{name:"MLB",emoji:"⚾",record:"162-0",games:162,active:false,color:"#3b82f6"},
};

// ── DAILY CHALLENGE LOGIC ─────────────────────────────────────────────────────
function getDailyKey(){
  const d=new Date();
  return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();
}

function seededRand(seed){
  let s=seed;
  return function(){s=Math.imul(48271,s)|0;return((s&0x7fffffff)/0x7fffffff);};
}
function fisherYates(arr,rand){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(rand()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function getDailyBoards(){
  if(!PLAYER_DB.length) return [];
  const key=getDailyKey();
  const rand=seededRand(key);

  // Step 1: Guarantee at least one All-Timer franchise in the daily
  const allTimerTeams=[...new Set(PLAYER_DB.filter(p=>p.off>=95||p.def>=95).map(p=>p.team))];
  const shuffledAT=fisherYates([...allTimerTeams].sort(),rand);
  const anchorTeam=shuffledAT[0];
  const allTeams=[...new Set(PLAYER_DB.map(p=>p.team))].sort();
  const others=fisherYates(allTeams.filter(t=>t!==anchorTeam),rand);
  return[anchorTeam,...others.slice(0,4)];
}

function getDailyBoardsFull(){
  if(!PLAYER_DB.length) return [];
  const teams=getDailyBoards();
  const key=getDailyKey();
  const boards=[];
  const globalSeen=new Set(); // No duplicates across all 5 boards

  teams.forEach((team,ti)=>{
    const rand=seededRand(key*31+ti*7);
    const pool=PLAYER_DB.filter(p=>p.team===team&&!globalSeen.has(playerBase(p.name)));
    const sorted=[...pool].sort((a,b)=>b.off+b.def-(a.off+a.def));
    const elite=sorted.filter(p=>p.off>=80||p.def>=80);
    const rest=sorted.filter(p=>p.off<80&&p.def<80);
    // Deduplicate by player name within this board
    const boardNameSeen=new Set();
    const eliteDeduped=fisherYates(elite,rand).filter(p=>{
      const b=playerBase(p.name);if(boardNameSeen.has(b))return false;boardNameSeen.add(b);return true;
    }).slice(0,3);
    const restDeduped=fisherYates(rest,rand).filter(p=>{
      const b=playerBase(p.name);if(boardNameSeen.has(b))return false;boardNameSeen.add(b);return true;
    }).slice(0,7);
    const board=[...eliteDeduped,...restDeduped].slice(0,10);
    // Register all picked players globally
    board.forEach(p=>globalSeen.add(playerBase(p.name)));
    boards.push({team,board});
  });
  return boards;
}

// ── MULTIPLAYER HELPERS ────────────────────────────────────────────────────────
function generateRoomCode(){
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code="";
  for(let i=0;i<4;i++)code+=chars[Math.floor(Math.random()*chars.length)];
  return code;
}

function generateMultiBoards(seed){
  if(!PLAYER_DB.length)return[];
  const rand=seededRand(seed);
  const allTeams=[...new Set(PLAYER_DB.map(p=>p.team))].sort();
  const teams=fisherYates(allTeams,rand).slice(0,5);
  const boards=[];
  const globalSeen=new Set();
  teams.forEach((team,ti)=>{
    const r2=seededRand(seed*31+ti*7+13);
    const pool=PLAYER_DB.filter(p=>p.team===team&&!globalSeen.has(playerBase(p.name)));
    const sorted=[...pool].sort((a,b)=>{
      const c=(b.off+b.def)-(a.off+a.def);
      if(c!==0)return c;
      return(a.name+a.season).localeCompare(b.name+b.season);
    });
    const elite=sorted.filter(p=>p.off>=80||p.def>=80);
    const rest=sorted.filter(p=>p.off<80&&p.def<80);
    const boardNameSeen=new Set();
    const eliteDeduped=fisherYates(elite,r2).filter(p=>{
      const b=playerBase(p.name);if(boardNameSeen.has(b))return false;boardNameSeen.add(b);return true;
    }).slice(0,3);
    const restDeduped=fisherYates(rest,r2).filter(p=>{
      const b=playerBase(p.name);if(boardNameSeen.has(b))return false;boardNameSeen.add(b);return true;
    }).slice(0,7);
    const board=[...eliteDeduped,...restDeduped].slice(0,10);
    board.forEach(p=>globalSeen.add(playerBase(p.name)));
    boards.push({team,board});
  });
  return boards;
}

function calcDailyGrade(userWins,maxWins){
  const pct=maxWins>0?userWins/maxWins:0;
  if(pct>=0.99)return{grade:"A+",label:"Perfect Draft",color:"#f59e42"};
  if(pct>=0.93)return{grade:"A",label:"Elite Draft",color:"#f59e42"};
  if(pct>=0.85)return{grade:"B+",label:"Great Draft",color:"#4ade80"};
  if(pct>=0.75)return{grade:"B",label:"Good Draft",color:"#4ade80"};
  if(pct>=0.65)return{grade:"C+",label:"Solid Draft",color:"#60a5fa"};
  if(pct>=0.55)return{grade:"C",label:"Average Draft",color:"#60a5fa"};
  if(pct>=0.40)return{grade:"D",label:"Rough Draft",color:"#a78bfa"};
  return{grade:"F",label:"Better luck tomorrow",color:"#f87171"};
}

function getCountdown(){
  const now=new Date();
  const tomorrow=new Date(now);
  tomorrow.setDate(tomorrow.getDate()+1);
  tomorrow.setHours(0,0,0,0);
  const diff=tomorrow-now;
  const h=Math.floor(diff/3600000);
  const m=Math.floor((diff%3600000)/60000);
  const s=Math.floor((diff%60000)/1000);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function generateBoard(team,draftedNames=new Set(),hometown=false,size=10,minElite=3){
  const pool=PLAYER_DB.filter(p=>p.team===team);
  function pickUnique(candidates,n,boardSeen=new Set()){
    const shuffled=shuffle(candidates);
    const result=[];
    for(const p of shuffled){
      const base=playerBase(p.name);
      if(!hometown&&draftedNames.has(base))continue;
      if(boardSeen.has(base))continue;
      boardSeen.add(base);
      result.push(p);
      if(result.length>=n)break;
    }
    return result;
  }
  const boardSeen=new Set();

  // Step 1: Guarantee 2-3 modern era players (2022-2026) if available
  const modern=shuffle(pool.filter(p=>p.season>=2022));
  const modernElite=modern.filter(p=>p.off>=80||p.def>=80);
  const modernOther=modern.filter(p=>p.off<80&&p.def<80);
  const modernPicks=pickUnique(modernElite.length?modernElite:modernOther,Math.min(3,modern.length),boardSeen);

  // Step 2: Fill elite slots (80+ rating) from any era
  const allElite=shuffle(pool.filter(p=>p.off>=80||p.def>=80));
  const eliteNeeded=Math.max(0,minElite-modernPicks.filter(p=>p.off>=80||p.def>=80).length);
  const elitePicks=pickUnique(allElite,eliteNeeded,boardSeen);

  // Step 3: Fill remaining with random mix — slight modern bias
  const remaining=size-modernPicks.length-elitePicks.length;
  const remainPool=shuffle(pool.filter(p=>!boardSeen.has(playerBase(p.name))));
  // Weight modern players 2x in remaining pool
  const weightedRemain=[];
  remainPool.forEach(function(p){
    if(!hometown&&draftedNames.has(playerBase(p.name)))return;
    if(boardSeen.has(playerBase(p.name)))return;
    weightedRemain.push(p);
    if(p.season>=2022)weightedRemain.push(p); // double entry for modern
  });
  const regPicks=pickUnique(shuffle(weightedRemain),remaining,boardSeen);

  return shuffle([...modernPicks,...elitePicks,...regPicks]).slice(0,size);
}

// ── SIMULATION ────────────────────────────────────────────────────────────────
function simulateSeason(rosterSlots){
  const filled=rosterSlots.filter(s=>s.player);
  if(filled.length<5)return null;
  const BASE=68; // Lowered from 72 — makes average defenders neutral not negative
  const ovrs=filled.map(s=>{
    const pen=getPosPenalty(s.player.pos,s.posGroup);
    const g=s.player.g||30;
    const season=s.player.season||2000;
    const is2026=season===2026;
    // Dramatically softened durability — only tiny penalty for very short non-2026 seasons
    const durPen=is2026?1.0:g<10?0.97:g<15?0.99:1.0;
    return{off:Math.max(0,(s.player.off-BASE))*pen*durPen,
           def:Math.max(0,(s.player.def-BASE))*pen*durPen,
           offRaw:s.player.off,defRaw:s.player.def};
  });
  const offSlots=[1.00,0.65,0.42,0.25,0.12];
  const defSlots=[1.00,0.68,0.46,0.28,0.14];
  const offS=[...ovrs].sort((a,b)=>b.off-a.off);
  const defS=[...ovrs].sort((a,b)=>b.def-a.def);
  const teamOff=offS.reduce((s,p,i)=>s+p.off*offSlots[i],0);
  const teamDef=defS.reduce((s,p,i)=>s+p.def*defSlots[i],0);
  const avgOff=ovrs.reduce((s,o)=>s+o.offRaw,0)/5;
  const avgDef=ovrs.reduce((s,o)=>s+o.defRaw,0)/5;
  const minOff=Math.min(...ovrs.map(o=>o.offRaw));
  const minDef=Math.min(...ovrs.map(o=>o.defRaw));
  // Weak link — capped and maskable by elite defenders
  const rawWeakLink=Math.max(0,(72-Math.min(minOff,minDef))/8);
  // Defensive masking: elite defenders cover for weak link
  const defRatings=ovrs.map(o=>o.defRaw).sort((a,b)=>b-a);
  const eliteDefenders=defRatings.filter(d=>d>=88).length;
  const goodDefenders=defRatings.filter(d=>d>=82).length;
  const maskFactor=eliteDefenders>=3?0.75:eliteDefenders>=2?0.55:goodDefenders>=3?0.35:goodDefenders>=2?0.20:0;
  const weakLink=rawWeakLink*(1-maskFactor);
  const peakQ=Math.max(...ovrs.map(o=>Math.max(o.offRaw,o.defRaw)));
  const depthScore=(avgOff+avgDef)/2;

  // Defense multiplier — real gate to 40+ wins
  // Softened — offensive teams penalized less, elite defense still rewarded
  const defMult=teamDef>=22?1.25:teamDef>=17?1.12:teamDef>=12?1.00:teamDef>=7?0.88:teamDef>=3?0.75:0.58;

  // Positional balance
  const natGroups=filled.map(s=>playerPosGroups(s.player.pos)[0]);
  const gN=natGroups.filter(x=>x==="G").length;
  const fN=natGroups.filter(x=>x==="F").length;
  const cN=natGroups.filter(x=>x==="C").length;
  const perfectLineup=gN===2&&fN===2&&cN===1;

  let score=Math.max(0,teamOff)*defMult+Math.max(0,teamDef)*0.28;
  if(perfectLineup)score*=1.05;
  score=Math.max(0,score-weakLink);
  const allContribute=ovrs.every(o=>o.offRaw>BASE&&o.defRaw>BASE-5);
  if(allContribute)score*=1.04;

  // Steeper curve — genuinely hard to reach 38+
  let raw;
  if(score<3)  raw=0+(score/3)*3;
  else if(score<7)  raw=3+((score-3)/4)*4;
  else if(score<12) raw=7+((score-7)/5)*4;
  else if(score<18) raw=11+((score-12)/6)*5;
  else if(score<26) raw=16+((score-18)/8)*5;
  else if(score<36) raw=21+((score-26)/10)*6;
  else if(score<48) raw=27+((score-36)/12)*6;
  else if(score<62) raw=33+((score-48)/14)*5;
  else if(score<78) raw=38+((score-62)/16)*4;
  else              raw=42+Math.min(2,(score-78)/10);

  // Continuous ceiling — loosened so 44-0 is achievable with smart drafting
  const combinedQ=(peakQ*0.45+depthScore*0.55);
  let ceiling;
  if(peakQ>=97&&depthScore>=87)       ceiling=44;
  else if(peakQ>=95&&depthScore>=85)  ceiling=44;
  else if(combinedQ>=93&&depthScore>=86) ceiling=44;
  else if(peakQ>=93&&depthScore>=86)  ceiling=43;
  else if(combinedQ>=91&&depthScore>=85) ceiling=43;
  else if(peakQ>=90&&depthScore>=86)  ceiling=41;
  else if(combinedQ>=89&&depthScore>=85) ceiling=41;
  else if(peakQ>=93&&depthScore>=81)  ceiling=39;
  else if(peakQ>=90&&depthScore>=83)  ceiling=39;
  else if(combinedQ>=88&&depthScore>=83) ceiling=39;
  else if(peakQ>=88&&depthScore>=82)  ceiling=37;
  else if(combinedQ>=86&&depthScore>=83) ceiling=37;
  else if(peakQ>=90&&depthScore>=79)  ceiling=34;
  else if(peakQ>=86&&depthScore>=81)  ceiling=34;
  else if(combinedQ>=84&&depthScore>=81) ceiling=34;
  else if(peakQ>=84&&depthScore>=80)  ceiling=30;
  else if(combinedQ>=82&&depthScore>=80) ceiling=30;
  else if(peakQ>=82&&depthScore>=78)  ceiling=26;
  else if(combinedQ>=80&&depthScore>=78) ceiling=26;
  else if(peakQ>=80)                  ceiling=22;
  else if(peakQ>=75)                  ceiling=17;
  else                                ceiling=12;

  // Star carry floor — superstars can't drag a team below a floor
  const allTimers=ovrs.filter(o=>o.offRaw>=95||o.defRaw>=95).length;
  const superstars=ovrs.filter(o=>o.offRaw>=90||o.defRaw>=90).length;
  const starFloor=allTimers>=2?28:allTimers>=1&&superstars>=1?26:allTimers>=1?23:superstars>=2?21:0;
  const wins=Math.max(starFloor,Math.min(ceiling,Math.round(raw)));
  return{
    wins,losses:44-wins,
    teamOff:Math.round(avgOff),teamDef:Math.round(avgDef),
    ceiling,perfectLineup,
    tierMessage:getTierMessage(wins),
  };
}

// ── SMART AUTO ASSIGN ─────────────────────────────────────────────────────────
function smartAutoAssign(player,currentSlots){
  const groups=playerPosGroups(player.pos);
  const emptySlots=currentSlots.filter(s=>!s.player);
  const filledCounts={G:0,F:0,C:0};
  currentSlots.filter(s=>s.player).forEach(s=>{filledCounts[s.posGroup]=(filledCounts[s.posGroup]||0)+1;});
  const candidates=emptySlots.filter(s=>groups.includes(s.posGroup));
  if(candidates.length>0){
    candidates.sort((a,b)=>(filledCounts[a.posGroup]||0)-(filledCounts[b.posGroup]||0));
    const slot=candidates[0];
    return currentSlots.map(s=>s.key===slot.key?{...s,player}:s);
  }
  const overflowOrder={G:["F","C"],F:["C","G"],C:["F","G"]};
  const primaryGroup=groups[0];
  for(const fb of(overflowOrder[primaryGroup]||[])){
    const slot=emptySlots.find(s=>s.posGroup===fb);
    if(slot)return currentSlots.map(s=>s.key===slot.key?{...s,player}:s);
  }
  const any=emptySlots[0];
  if(any)return currentSlots.map(s=>s.key===any.key?{...s,player}:s);
  return currentSlots;
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function Avatar({player,size=40}){
  const c=player?posColor(player.pos):"#1f2937";
  return(
    <div style={{width:size,height:size,borderRadius:"50%",background:c+"25",border:`1.5px solid ${c}60`,
      display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.30,
      fontWeight:800,color:c,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.03em",
      flexShrink:0,userSelect:"none"}}>
      {player?initials(player.name):""}
    </div>
  );
}

function StatPill({label,value}){
  return(
    <div style={{textAlign:"center",flex:1}}>
      <div style={{fontSize:17,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:"#f9fafb",lineHeight:1}}>{value.toFixed(1)}</div>
      <div style={{fontSize:9,color:"#6b7280",letterSpacing:"0.08em",marginTop:2}}>{label}</div>
    </div>
  );
}

function PlayerCard({player,selected,secondSel,onClick,pickTwo,hoopIQ}){
  const c=posColor(player.pos);
  const border=selected?"#f59e42":secondSel?"#4ade80":"rgba(255,255,255,0.08)";
  const bg=selected?"rgba(249,158,66,0.10)":secondSel?"rgba(74,222,128,0.08)":"rgba(255,255,255,0.03)";
  const badge=selected?(pickTwo?"1ST":"✓"):secondSel?"2ND":null;
  return(
    <div onClick={onClick} style={{background:bg,border:`1.5px solid ${border}`,borderRadius:14,
      padding:"12px 13px",cursor:"pointer",position:"relative",transition:"border-color 0.15s",
      WebkitTapHighlightColor:"transparent"}}>
      {badge&&<div style={{position:"absolute",top:10,right:12,fontSize:11,fontWeight:800,
        color:selected?"#f59e42":"#4ade80",letterSpacing:"0.06em"}}>{badge}</div>}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:hoopIQ?0:11}}>
        <Avatar player={player} size={38}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,
            color:"#f9fafb",lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{player.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}>
            <div style={{background:c+"1e",border:`1px solid ${c}44`,borderRadius:4,
              padding:"1px 6px",fontSize:9,color:c,fontWeight:700,letterSpacing:"0.08em"}}>{player.pos}</div>
            <div style={{fontSize:10,color:"#6b7280"}}>{player.season} · {player.team}</div>
          </div>
        </div>
      </div>
      {!hoopIQ&&(
        <div style={{display:"flex",gap:3,background:"rgba(0,0,0,0.3)",borderRadius:9,padding:"9px 6px"}}>
          <StatPill label="PPG" value={player.pts}/>
          <div style={{width:1,background:"rgba(255,255,255,0.06)",alignSelf:"stretch"}}/>
          <StatPill label="RPG" value={player.reb}/>
          <div style={{width:1,background:"rgba(255,255,255,0.06)",alignSelf:"stretch"}}/>
          <StatPill label="APG" value={player.ast}/>
          <div style={{width:1,background:"rgba(255,255,255,0.06)",alignSelf:"stretch"}}/>
          <StatPill label="SPG" value={player.stl}/>
          <div style={{width:1,background:"rgba(255,255,255,0.06)",alignSelf:"stretch"}}/>
          <StatPill label="BPG" value={player.blk}/>
        </div>
      )}
    </div>
  );
}

function Lifeline({emoji,name,desc,used,onClick,locked=false}){
  const disabled=used||locked;
  return(
    <button onClick={!disabled?onClick:undefined} style={{
      flex:1,background:disabled?"rgba(255,255,255,0.01)":"rgba(255,255,255,0.04)",
      border:`1px solid ${disabled?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.12)"}`,
      borderRadius:11,padding:"9px 4px",cursor:disabled?"default":"pointer",
      opacity:disabled?0.25:1,textAlign:"center",WebkitTapHighlightColor:"transparent"}}>
      <div style={{fontSize:17,marginBottom:3}}>{disabled?"✗":emoji}</div>
      <div style={{fontSize:10,fontWeight:700,color:disabled?"#374151":"#e5e7eb",letterSpacing:"0.04em",marginBottom:1}}>{name}</div>
      <div style={{fontSize:9,color:"#4b5563",lineHeight:1.3}}>{desc}</div>
    </button>
  );
}

function CelebrationScreen({onContinue}){
  const [frame,setFrame]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setFrame(f=>f+1),600);return()=>clearTimeout(t);},[frame]);
  return(
    <div style={{position:"fixed",inset:0,background:"#07090f",zIndex:999,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      fontFamily:"'Barlow Condensed',sans-serif"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center, rgba(249,158,66,0.18) 0%, transparent 70%)",
        opacity:frame>=1?1:0,transition:"opacity 0.8s ease"}}/>
      {frame>=1&&Array.from({length:24}).map((_,i)=>(
        <div key={i} style={{position:"absolute",
          top:`${5+Math.random()*90}%`,left:`${5+Math.random()*90}%`,
          width:i%3===0?6:4,height:i%3===0?6:4,borderRadius:"50%",
          background:["#f59e42","#4ade80","#60a5fa","#f9fafb","#a78bfa"][i%5],
          animation:`fall ${0.8+Math.random()*1.8}s ease-out forwards`,
          animationDelay:`${Math.random()*0.6}s`,opacity:0}}/>
      ))}
      <div style={{textAlign:"center",position:"relative"}}>
        <div style={{fontSize:13,letterSpacing:"0.3em",color:"#6b7280",marginBottom:20,
          opacity:frame>=0?1:0,transition:"opacity 0.5s"}}>FINAL RECORD</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:108,fontWeight:900,
          letterSpacing:"-0.03em",color:"#f59e42",lineHeight:1,
          textShadow:"0 0 80px rgba(249,158,66,0.5)",
          opacity:frame>=1?1:0,transform:frame>=1?"scale(1)":"scale(0.7)",
          transition:"all 0.6s cubic-bezier(0.34,1.56,0.64,1)"}}>
          44<span style={{color:"rgba(255,255,255,0.2)"}}>-</span>0
        </div>
        <div style={{fontSize:15,letterSpacing:"0.25em",color:"#f59e42",marginTop:14,
          opacity:frame>=2?1:0,transition:"opacity 0.5s 0.1s"}}>UNDEFEATED 🏆</div>
        <div style={{fontSize:13,color:"#9ca3af",marginTop:8,
          opacity:frame>=3?1:0,transition:"opacity 0.5s"}}>
          The GOAT lineup. Literally unbeatable.
        </div>
        <button onClick={onContinue} style={{marginTop:40,background:"#f59e42",color:"#07090f",
          border:"none",borderRadius:14,padding:"14px 40px",fontSize:16,fontWeight:800,
          cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase",
          opacity:frame>=3?1:0,transition:"opacity 0.5s",WebkitTapHighlightColor:"transparent"}}>
          See Your Team
        </button>
      </div>
      <style>{`@keyframes fall{0%{opacity:1;transform:translateY(-20px) scale(1) rotate(0deg)}100%{opacity:0;transform:translateY(80px) scale(0.3) rotate(180deg)}}`}</style>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Game(){
  const [mode,setMode]=useState(null);
  const [phase,setPhase]=useState("spin");
  const [round,setRound]=useState(0);
  const [currentTeam,setCurrentTeam]=useState(null);
  const [board,setBoard]=useState([]);
  const [slots,setSlots]=useState(SLOTS.map(s=>({...s,player:null})));
  const [draftedNames,setDraftedNames]=useState(new Set());
  const [usedTeams,setUsedTeams]=useState(new Set());
  const [pick1,setPick1]=useState(null);
  const [pick2,setPick2]=useState(null);
  const [result,setResult]=useState(null);
  const [tierMsg,setTierMsg]=useState("");
  const [spinning,setSpinning]=useState(false);
  const [spinLabel,setSpinLabel]=useState("");
  const [spinLanded,setSpinLanded]=useState(false);
  const [reshuffling,setReshuffling]=useState(false);
  const [pickTwoOn,setPickTwoOn]=useState(false);
  const [freshUsed,setFreshUsed]=useState(false);
  const [homeUsed,setHomeUsed]=useState(false);
  const [twoUsed,setTwoUsed]=useState(false);
  const [selSlot,setSelSlot]=useState(null);
  const [showCelebration,setShowCelebration]=useState(false);
  const [username,setUsername]=useState(()=>{try{return localStorage.getItem("44o_user")||"";}catch{return "";}});
  const [usernameInput,setUsernameInput]=useState("");
  const [showUsernamePrompt,setShowUsernamePrompt]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [showLeaderboard,setShowLeaderboard]=useState(false);
  const [showWaitlist,setShowWaitlist]=useState(false);
  const [waitlistInput,setWaitlistInput]=useState("");
  const [waitlistDone,setWaitlistDone]=useState(false);
  const [leaderboard,setLeaderboard]=useState(MOCK_LB);
  const [showConfirmReset,setShowConfirmReset]=useState(false);
  const [currentLeague,setCurrentLeague]=useState("wnba");
  const [showComingSoon,setShowComingSoon]=useState(null);
  const [showGameInfo,setShowGameInfo]=useState(false);
  const [showDaily,setShowDaily]=useState(false);
  const [dailyComplete,setDailyComplete]=useState(false);
  const [dailyResult,setDailyResult]=useState(null);
  const [dailySlots,setDailySlots]=useState(null);
  const [dailyGrade,setDailyGrade]=useState(null);
  const [dailyReveal,setDailyReveal]=useState(false);
  const [dailyBestRoster,setDailyBestRoster]=useState(null);
  const [dailyCountdown,setDailyCountdown]=useState("");
  const [dailyMsg,setDailyMsg]=useState("");

  const [playersLoaded, setPlayersLoaded] = useState(false);

  useEffect(()=>{
    const l=document.createElement("link");
    l.href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap";
    l.rel="stylesheet";document.head.appendChild(l);
    // Load full player database
    fetch('/players.json')
      .then(r=>r.json())
      .then(data=>{
        PLAYER_DB=data;
        setPlayersLoaded(true);
        // Check daily completion
        const todayKey=String(getDailyKey());
        try{
          const stored=JSON.parse(localStorage.getItem("44o_daily")||"{}");
          if(stored.key===todayKey&&stored.result){
            setDailyComplete(true);
            setDailyResult(stored.result);
            setDailySlots(stored.slots||null);
            setDailyGrade(stored.grade||null);
            setDailyMsg(stored.msg||"");
            if(stored.bestRoster) setDailyBestRoster(stored.bestRoster);
          }
        }catch{}
        // Load real leaderboard from Supabase
        supaFetch("leaderboard?league=eq.wnba&order=wins.desc,team_off.desc&limit=10&select=username,wins,losses,team_off,team_def,roster")
          .then(data=>{
            if(data&&Array.isArray(data)&&data.length>0){
              setLeaderboard(data.map(e=>({
                username:e.username||"Anonymous", wins:e.wins||44, losses:e.losses||0,
                teamOff:e.team_off||0, teamDef:e.team_def||0,
                roster:Array.isArray(e.roster)?e.roster:[]
              })));
            }
          }).catch(()=>{});
      })
      .catch(()=>setPlayersLoaded(true));
    // Countdown timer
    const iv=setInterval(()=>setDailyCountdown(getCountdown()),1000);
    setDailyCountdown(getCountdown());
    return()=>clearInterval(iv);
  },[]);

  // Multiplayer polling — only active when in a room
  const [showMultiplayer,setShowMultiplayer]=useState(false);
  const [multiRoom,setMultiRoom]=useState(null);
  const [multiPlayers,setMultiPlayers]=useState([]);
  const [multiReady,setMultiReady]=useState(false);
  const [multiPhase,setMultiPhase]=useState("join"); // join | lobby | playing | waiting | results
  const [multiResults,setMultiResults]=useState([]);
  const [roomCodeInput,setRoomCodeInput]=useState("");
  const [multiBoards,setMultiBoards]=useState(null);
  const [multiMode,setMultiMode]=useState("classic");

  const multiPollRef=useRef(null);
  useEffect(()=>{
    if(multiPollRef.current)clearInterval(multiPollRef.current);
    if(!showMultiplayer||!multiRoom||multiPhase==="join"||multiPhase==="results")return;
    multiPollRef.current=setInterval(async()=>{
      try{
        const data=await supaFetch("rooms?room_code=eq."+multiRoom+"&select=*");
        if(data&&Array.isArray(data)&&data[0]){
          const room=data[0];
          setMultiPlayers(room.players||[]);
          if(room.status==="playing"&&multiPhase==="lobby"){
            setMultiBoards(generateMultiBoards(room.board_seed));
            setMultiPhase("playing");setMode(multiMode);
          }
          if(room.status==="results"&&multiPhase==="waiting"){
            setMultiResults(room.players||[]);
            setMultiPhase("results");
          }
        }
      }catch(e){}
    },2000);
    return()=>{if(multiPollRef.current)clearInterval(multiPollRef.current);};
  },[showMultiplayer,multiRoom,multiPhase]);

  const hoopIQ=mode==="hoopiq";
  const isDailyMode=showDaily&&!dailyComplete;
  const [boostUsed,setBoostUsed]=useState(false);
  const [pendingBoost,setPendingBoost]=useState(false);
  // Multiplayer states
  const filledCount=slots.filter(s=>s.player).length;
  const canConfirm=pick1&&(!pickTwoOn||pick2);
  const tc=currentTeam?teamColor(currentTeam):{primary:"#f59e42",secondary:"#1f2937"};

  function doSpin(opts={}){
    const{exclude=null,hometown=false}=opts;
    setSpinning(true);setSpinLanded(false);setPick1(null);setPick2(null);setSelSlot(null);
    // Daily mode uses pre-seeded board list
    const dailyBoardsFull=isDailyMode?getDailyBoardsFull():null;
    const dailyTeamsList=dailyBoardsFull?dailyBoardsFull.map(b=>b.team):null;
    const multiTeamsList=showMultiplayer&&multiBoards?multiBoards.map(b=>b.team):null;
    const allTeams=dailyTeamsList||multiTeamsList||[...new Set(PLAYER_DB.map(p=>p.team))].sort();
    // Load recently seen teams from localStorage
    let recentTeams=[];
    try{recentTeams=JSON.parse(localStorage.getItem("44o_recent")||"[]");}catch{}
    // Hard exclude last 8 teams for rounds 0-2, soften after
    const hardExcludeCount=round<3?8:4;
    const hardExcluded=new Set(recentTeams.slice(0,hardExcludeCount));
    // Thin franchises (tier 0) max once per session
    const thinTeams=new Set(Object.entries(TEAM_TIERS).filter(([,v])=>v===0).map(([k])=>k));
    const thinUsed=[...usedTeams].filter(t=>thinTeams.has(t)).length;
    const avail=allTeams.filter(t=>{
      if(usedTeams.has(t)||t===exclude) return false;
      if(!PLAYER_DB.some(p=>p.team===t&&!draftedNames.has(playerBase(p.name)))) return false;
      if(hardExcluded.has(t)&&allTeams.filter(t2=>!usedTeams.has(t2)&&!hardExcluded.has(t2)).length>2) return false;
      if(thinTeams.has(t)&&thinUsed>=1) return false;
      return true;
    });
    // Weight by tier: Tier 2 = 3 entries, Tier 1 = 2 entries, Tier 0 = 1 entry
    const weighted=[];
    avail.forEach(t=>{
      const tier=TEAM_TIERS[t]!==undefined?TEAM_TIERS[t]:1;
      const w=tier===2?3:tier===1?2:1;
      for(let i=0;i<w;i++) weighted.push(t);
    });
    const shuffledW=shuffle(weighted);
    const deduped=[];const seenT=new Set();
    shuffledW.forEach(t=>{if(!seenT.has(t)){seenT.add(t);deduped.push(t);}});
    const pool=hometown&&currentTeam?[currentTeam]:(deduped.length?deduped:avail);
    if(!pool.length){setSpinning(false);return;}
    const allTeams2=[...new Set(PLAYER_DB.map(p=>p.team))].sort();
    const display=hometown?allTeams2:pool;
    let ticks=0;
    const iv=setInterval(()=>{
      ticks++;
      setSpinLabel(display[Math.floor(Math.random()*display.length)]);
      if(ticks>=(hometown?8:16)){
        clearInterval(iv);
        const chosen=pool[Math.floor(Math.random()*pool.length)];
        setSpinLabel(chosen);setSpinLanded(true);
        setTimeout(()=>{
          setCurrentTeam(chosen);
          // Daily mode or multiplayer: use pre-seeded deterministic board
          if(isDailyMode&&dailyBoardsFull){
            const dailyBoard=dailyBoardsFull.find(b=>b.team===chosen);
            const filteredBoard=dailyBoard?dailyBoard.board.filter(p=>!draftedNames.has(playerBase(p.name))):[];
            setBoard(filteredBoard.length?filteredBoard:generateBoard(chosen,draftedNames,false));
          } else if(showMultiplayer&&multiBoards){
            const mBoard=multiBoards.find(b=>b.team===chosen);
            const filteredBoard=mBoard?mBoard.board.filter(p=>!draftedNames.has(playerBase(p.name))):[];
            setBoard(filteredBoard.length?filteredBoard:generateBoard(chosen,draftedNames,false));
          } else {
            setBoard(generateBoard(chosen,draftedNames,hometown));
          }
          setSpinning(false);setPhase("pick");
        },1500);
      }
    },75);
  }

  function doHometown(){
    setHomeUsed(true);setPickTwoOn(false);setPick1(null);setPick2(null);
    setReshuffling(true);setBoard([]);
    setTimeout(()=>{
      // Force fresh board — use different random seed each call
      const freshSeed=Date.now();
      const pool=PLAYER_DB.filter(p=>p.team===currentTeam);
      // Shuffle completely fresh
      const freshShuffled=[...pool].sort(()=>Math.random()-0.5);
      // Guarantee at least some different seasons from current board
      const currentOnBoard=new Set(board.map(p=>p.season+"_"+p.name));
      const different=freshShuffled.filter(p=>!currentOnBoard.has(p.season+"_"+p.name));
      const same=freshShuffled.filter(p=>currentOnBoard.has(p.season+"_"+p.name));
      // Mix: prefer different players/seasons first
      const elite=different.filter(p=>p.off>=80||p.def>=80);
      const eliteSame=same.filter(p=>p.off>=80||p.def>=80);
      const rest=different.filter(p=>p.off<80&&p.def<80);
      const allElite=[...elite,...eliteSame].slice(0,3);
      const allRest=[...rest,...same.filter(p=>p.off<80&&p.def<80)].slice(0,7);
      const newBoard=[...allElite,...allRest].slice(0,10);
      setBoard(newBoard.length>=3?newBoard:generateBoard(currentTeam,draftedNames,true));
      setReshuffling(false);
    },600);
  }

  function handleCardClick(p){
    if(pickTwoOn){
      if(pick1?.id===p.id){setPick1(null);return;}
      if(pick2?.id===p.id){setPick2(null);return;}
      if(!pick1){setPick1(p);return;}
      if(!pick2){setPick2(p);return;}
    }else{setPick1(prev=>prev?.id===p.id?null:p);}
  }

  function confirmPick(){
    const picks=pickTwoOn?[pick1,pick2].filter(Boolean):[pick1].filter(Boolean);
    if(!pick1||(pickTwoOn&&!pick2))return;
    let newSlots=[...slots];
    const newDrafted=new Set([...draftedNames]);
    picks.forEach(p=>{
      let player=p;
      // Apply boost in daily mode
      if(isDailyMode&&pendingBoost&&!boostUsed&&picks[0]===p){
        const baseRating=(p.off+p.def)/2;
        const boost=baseRating>=90?2:baseRating>=82?4:baseRating>=74?6:8;
        player={...p,off:Math.min(99,p.off+boost),def:Math.min(99,p.def+boost),boosted:true};
        setBoostUsed(true);setPendingBoost(false);
      }
      newSlots=smartAutoAssign(player,newSlots);newDrafted.add(playerBase(p.name));
    });
    const newUsed=new Set([...usedTeams,currentTeam]);
    setSlots(newSlots);setDraftedNames(newDrafted);setUsedTeams(newUsed);
    setPick1(null);setPick2(null);setPickTwoOn(false);setSelSlot(null);
    if(newSlots.filter(s=>s.player).length>=5){
      const res=simulateSeason(newSlots);

      // Daily challenge completion
      if(isDailyMode){
        const todayKey=String(getDailyKey());
        const grade=calcDailyGrade(res.wins,44);
        setDailyResult(res);
        setDailySlots(newSlots);
        setDailyGrade(grade);
        setDailyComplete(true);
        // Best possible team — one player per board (5 boards = 5 picks)
        const fullBoards2=getDailyBoardsFull();
        // For each board, find best player (by combined off+def)
        const bestPerBoard=fullBoards2.map(b=>{
          const sorted=[...b.board].sort((a,c)=>(c.off+c.def)-(a.off+a.def));
          return sorted[0]||null;
        }).filter(Boolean);
        setDailyBestRoster(bestPerBoard);
        // Save to localStorage
        const saveBest=getDailyBoardsFull().map(b=>[...b.board].sort((a,c)=>(c.off+c.def)-(a.off+a.def))[0]).filter(Boolean);
        try{localStorage.setItem("44o_daily",JSON.stringify({key:todayKey,result:res,slots:newSlots,grade,msg:res.tierMessage,bestRoster:saveBest}));}catch{}
        // Submit to Supabase daily leaderboard
        supaFetch("leaderboard",{method:"POST",body:JSON.stringify({
          username:username||"Anonymous",wins:res.wins,losses:res.losses,
          team_off:res.teamOff,team_def:res.teamDef,
          roster:newSlots.filter(s=>s.player).map(s=>({name:s.player.name,season:s.player.season,slot:s.key})),
          league:"wnba_daily",grade:grade.grade
        })});
        setPhase("result");return;
      }

      setResult(res);setTierMsg(res?res.tierMessage:"");
      // If multiplayer, submit result to room
      if(showMultiplayer&&multiRoom){
        const name2=username||"Anonymous";
        const myResult={wins:res.wins,losses:res.losses,teamOff:res.teamOff,teamDef:res.teamDef,
          roster:newSlots.filter(s=>s.player).map(s=>({name:s.player.name,season:s.player.season,slot:s.key}))};
        supaFetch("rooms?room_code=eq."+multiRoom+"&select=players").then(data=>{
          if(data&&data[0]){
            const updatedPlayers=(data[0].players||[]).map(p=>
              p.username===name2?{...p,result:myResult}:p
            );
            const allDone=updatedPlayers.every(p=>p.result);
            supaFetch("rooms?room_code=eq."+multiRoom,{method:"PATCH",body:JSON.stringify({
              players:updatedPlayers,status:allDone?"results":"playing"
            })});
            setMultiPlayers(updatedPlayers);
          }
        });
        setMultiPhase("waiting");setPhase("result");
        setResult(res);setTierMsg(res?res.tierMessage:"");
        return;
      }
      // Submit every result to Supabase leaderboard
      const name=username||"Anonymous";
      const rosterData=newSlots.filter(s=>s.player).map(s=>({name:s.player.name,season:s.player.season,slot:s.key}));
      supaFetch("leaderboard",{method:"POST",body:JSON.stringify({
        username:name,wins:res.wins,losses:res.losses,team_off:res.teamOff,team_def:res.teamDef,
        roster:rosterData,league:"wnba",created_at:new Date().toISOString()
      })});
      // Update local leaderboard
      const entry={username:name,wins:res.wins,losses:res.losses,teamOff:res.teamOff,teamDef:res.teamDef,roster:rosterData};
      setLeaderboard(prev=>{
        const updated=[entry,...prev.filter(e=>e.username!==name)];
        return updated.sort((a,b)=>b.wins!==a.wins?b.wins-a.wins:(b.teamOff+b.teamDef)-(a.teamOff+a.teamDef)).slice(0,10);
      });
      if(res&&res.wins===44){
        setShowCelebration(true);
      }else{setPhase("result");}
    }else{setRound(r=>r+1);setPhase("spin");setCurrentTeam(null);}
  }

  function handleSlotTap(key){
    if(!selSlot){const slot=slots.find(s=>s.key===key);if(slot?.player)setSelSlot(key);}
    else{
      if(selSlot===key){setSelSlot(null);return;}
      const a=slots.find(s=>s.key===selSlot);const b=slots.find(s=>s.key===key);
      setSlots(slots.map(s=>{if(s.key===selSlot)return{...s,player:b.player};if(s.key===key)return{...s,player:a.player};return s;}));
      setSelSlot(null);
    }
  }

  function saveUsername(){
    const u=usernameInput.trim();if(!u)return;
    setUsername(u);try{localStorage.setItem("44o_user",u);}catch{}
    setShowUsernamePrompt(false);setUsernameInput("");
  }

  function reset(force=false){
    if(!force&&phase!=="result"&&filledCount>0){setShowConfirmReset(true);return;}
    // Save teams from this game to recent history (keep last 10)
    if(usedTeams.size>0){
      try{
        const prev=JSON.parse(localStorage.getItem("44o_recent")||"[]");
        const updated=[...usedTeams,...prev].slice(0,10);
        localStorage.setItem("44o_recent",JSON.stringify([...new Set(updated)]));
      }catch{}
    }
    setMode(null);setPhase("spin");setRound(0);setCurrentTeam(null);
    setBoard([]);setSlots(SLOTS.map(s=>({...s,player:null})));
    setDraftedNames(new Set());setUsedTeams(new Set());
    setPick1(null);setPick2(null);setResult(null);setTierMsg("");
    setSpinning(false);setSpinLanded(false);setPickTwoOn(false);setSelSlot(null);
    setFreshUsed(false);setHomeUsed(false);setTwoUsed(false);
    setBoostUsed(false);setPendingBoost(false);setShowDaily(false);
    setShowMultiplayer(false);setMultiRoom(null);setMultiPlayers([]);
    setMultiReady(false);setMultiPhase("join");setMultiResults([]);
    setRoomCodeInput("");setMultiBoards(null);
    setMenuOpen(false);setShowConfirmReset(false);setShowCelebration(false);
  }

  const wrap={minHeight:"100vh",background:"#07090f",color:"#f9fafb",
    fontFamily:"'Barlow',sans-serif",display:"flex",flexDirection:"column",
    alignItems:"center",padding:"0 16px",maxWidth:480,margin:"0 auto"};

  const HBurg=()=>(
    <button onClick={()=>setMenuOpen(true)} style={{background:"none",border:"none",cursor:"pointer",
      padding:"4px 6px",display:"flex",flexDirection:"column",gap:4,WebkitTapHighlightColor:"transparent"}}>
      {[0,1,2].map(i=><div key={i} style={{width:18,height:2,background:"#9ca3af",borderRadius:2}}/>)}
    </button>
  );

  const MenuOverlay=()=>(
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex"}} onClick={()=>setMenuOpen(false)}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)"}}/>
      <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:0,right:0,bottom:0,width:260,
        background:"#0d1017",borderLeft:"1px solid rgba(255,255,255,0.08)",
        display:"flex",flexDirection:"column",padding:"48px 20px 32px",overflowY:"auto"}}>
        <button onClick={()=>setMenuOpen(false)} style={{position:"absolute",top:16,right:16,
          background:"none",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer",lineHeight:1}}>✕</button>

        {/* Drafted branding */}
        <div style={{marginBottom:24}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:"#f9fafb",letterSpacing:"0.02em"}}>
            DRAFTED
          </div>
          <div style={{fontSize:10,color:"#4b5563",letterSpacing:"0.1em",marginTop:2}}>drafted.games</div>
        </div>

        {/* Username */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:10,padding:"10px 12px",marginBottom:20}}>
          <div style={{fontSize:9,color:"#6b7280",letterSpacing:"0.1em",marginBottom:3}}>PLAYING AS</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#f9fafb"}}>{username||"Anonymous"}</div>
          <button onClick={()=>{setMenuOpen(false);setUsernameInput(username);setShowUsernamePrompt(true);}}
            style={{background:"none",border:"none",color:"#f59e42",fontSize:10,cursor:"pointer",padding:0,marginTop:2}}>
            Change username →
          </button>
        </div>

        {/* New Game */}
        <button onClick={()=>reset()} style={{background:"none",border:"none",
          borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"14px 0",
          textAlign:"left",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:14,
          fontWeight:600,color:"#f87171"}}>🔄  New Game</button>

        {/* Leagues */}
        <div style={{fontSize:9,color:"#6b7280",letterSpacing:"0.14em",marginTop:20,marginBottom:10,fontWeight:700}}>LEAGUES</div>
        {Object.entries(LEAGUES).map(function(entry){
          const key=entry[0];const lg=entry[1];
          const isActive=key===currentLeague;
          return(
            <button key={key} onClick={()=>{
              if(lg.active){setCurrentLeague(key);setMenuOpen(false);}
              else{setMenuOpen(false);setShowComingSoon(key);}
            }} style={{
              background:isActive?"rgba(255,255,255,0.06)":"none",
              border:isActive?"1px solid rgba(255,255,255,0.12)":"none",
              borderBottom:isActive?"none":"1px solid rgba(255,255,255,0.04)",
              borderRadius:isActive?8:0,
              padding:"12px 10px",textAlign:"left",cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:isActive?800:600,
              color:isActive?lg.color:"#9ca3af",letterSpacing:"0.04em",
              display:"flex",alignItems:"center",justifyContent:"space-between",
              boxShadow:isActive?"0 0 12px "+lg.color+"22":"none",
            }}>
              <span>{lg.emoji}  {lg.name}</span>
              {isActive&&<span style={{fontSize:9,color:lg.color,fontWeight:800,letterSpacing:"0.1em"}}>{lg.record}</span>}
              {!lg.active&&<span style={{fontSize:9,color:"#374151",letterSpacing:"0.06em"}}>SOON</span>}
            </button>
          );
        })}

        {/* Leaderboard */}
        <button onClick={()=>{setMenuOpen(false);setShowLeaderboard(true);}} style={{
          background:"none",border:"none",borderBottom:"1px solid rgba(255,255,255,0.06)",
          padding:"14px 0",textAlign:"left",cursor:"pointer",fontFamily:"'Barlow',sans-serif",
          fontSize:14,fontWeight:600,color:"#e5e7eb",marginTop:16}}>🏆  Leaderboard</button>

        {/* Game Info */}
        <button onClick={()=>{setMenuOpen(false);setShowGameInfo(true);}} style={{
          background:"none",border:"none",borderBottom:"1px solid rgba(255,255,255,0.06)",
          padding:"14px 0",textAlign:"left",cursor:"pointer",fontFamily:"'Barlow',sans-serif",
          fontSize:14,fontWeight:600,color:"#e5e7eb"}}>ℹ️  How Ratings Work</button>
        {/* Waitlist */}
        <button onClick={()=>{setMenuOpen(false);setShowWaitlist(true);}} style={{
          background:"none",border:"none",borderBottom:"1px solid rgba(255,255,255,0.06)",
          padding:"14px 0",textAlign:"left",cursor:"pointer",fontFamily:"'Barlow',sans-serif",
          fontSize:14,fontWeight:600,color:"#e5e7eb"}}>📱  Join App Waitlist</button>
      </div>
    </div>
  );

  // Loading state while player DB fetches
  if(!playersLoaded) return (
    <div style={{minHeight:"100vh",background:"#07090f",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif"}}>
      <div style={{fontSize:48,fontWeight:900,letterSpacing:"-0.02em",color:"#f9fafb",marginBottom:16}}>
        44<span style={{color:"#f59e42"}}>-</span>0
      </div>
      <div style={{fontSize:12,color:"#4b5563",letterSpacing:"0.14em"}}>LOADING...</div>
    </div>
  );

  // ── GAME INFO PAGE ───────────────────────────────────────────────────────────
  if(showGameInfo) return(
    <div style={wrap}>
      {menuOpen&&<MenuOverlay/>}
      <div style={{width:"100%",paddingTop:20,paddingBottom:80}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900}}>How Ratings Work</div>
            <div style={{fontSize:11,color:"#4b5563",marginTop:2}}>The system behind every player-season</div>
          </div>
          <button onClick={()=>setShowGameInfo(false)} style={{background:"rgba(255,255,255,0.06)",
            border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 12px",
            color:"#9ca3af",fontSize:12,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>← Back</button>
        </div>
        {[
          {title:"THE RATING SYSTEM",color:"#f59e42",emoji:"",items:[
            {h:"Two ratings per season",b:"Every player-season has an Offense Rating and a Defense Rating. These are calculated independently based on that specific year — not career reputation."},
            {h:"Season specificity matters",b:"The same player can appear across multiple seasons. Drafting the right year is just as important as drafting the right player."},
            {h:"Era context",b:"Players are compared to their peers in that season. A dominant 2002 scorer is rated against 2002 competition, not all-time averages."},
          ]},
          {title:"OFFENSE RATING",color:"#f59e42",emoji:"⚡ ",items:[
            {h:"Scoring & efficiency",b:"Raw points per game combined with how efficiently a player scored. High volume with poor efficiency doesn't tell the full story."},
            {h:"Playmaking",b:"Assists and the ability to create offense for teammates, not just yourself."},
            {h:"Overall offensive impact",b:"Advanced metrics that capture total offensive contribution relative to teammates and era."},
          ]},
          {title:"DEFENSE RATING",color:"#60a5fa",emoji:"🛡 ",items:[
            {h:"Stops & disruption",b:"Steals and blocks carry significant weight. Elite shot-blockers and pickpockets are rewarded accordingly."},
            {h:"Rebounding",b:"Defensive rebounding ends possessions and limits second chances. Elite rebounders get a meaningful boost."},
            {h:"Defensive efficiency",b:"How well a player's team defended with them on the floor — captures things raw stats don't always show."},
          ]},
          {title:"AWARD BOOSTS",color:"#a78bfa",emoji:"🏆 ",items:[
            {h:"MVP & All-WNBA",b:"MVP winners and All-WNBA selections receive an offensive boost. First team earns more than second team."},
            {h:"DPOY & All-Defense",b:"Defensive Player of the Year and All-Defensive selections receive a defensive boost."},
            {h:"Why awards matter",b:"Hardware signals elite performance that advanced stats don't always fully capture."},
          ]},
          {title:"SEASON & DURABILITY",color:"#4ade80",emoji:"📅 ",items:[
            {h:"Games played",b:"Players with very few games in a season may have their rating adjusted slightly — small sample sizes are less reliable."},
            {h:"2026 is live",b:"Current season players carry their real stats as they stand today. No durability penalty for an ongoing season."},
            {h:"Historical eras",b:"The league has evolved significantly since 1997. The system accounts for era differences when calculating ratings."},
          ]},
          {title:"BUILDING YOUR TEAM",color:"#f9fafb",emoji:"🏀 ",items:[
            {h:"Balance wins",b:"A team of five elite scorers with no defenders won't go 44-0. You need both sides of the ball."},
            {h:"Elite defenders cover for scorers",b:"Three elite defenders can mask a pure scorer's defensive weaknesses — just like in real basketball."},
            {h:"Position matters",b:"Playing a player out of position comes with a penalty. Natural lineups earn a chemistry boost."},
            {h:"Star power has a floor",b:"Even with weak role players, true stars will carry a team to a winning record. But going 44-0 requires quality throughout."},
          ]},
        ].map((section,si)=>(
          <div key={si} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:14,padding:"16px",marginBottom:10}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
              letterSpacing:"0.16em",color:section.color,marginBottom:12}}>{section.emoji}{section.title}</div>
            {section.items.map((item,ii)=>(
              <div key={ii} style={{display:"flex",gap:10,marginBottom:ii<section.items.length-1?10:0}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:section.color,marginTop:6,flexShrink:0}}/>
                <div style={{fontSize:13,color:"#9ca3af",lineHeight:1.55,fontFamily:"'Barlow',sans-serif"}}>
                  <span style={{color:"#e5e7eb",fontWeight:600}}>{item.h} — </span>{item.b}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div style={{background:"rgba(245,158,66,0.06)",border:"1px solid rgba(245,158,66,0.18)",
          borderRadius:14,padding:"16px",textAlign:"center",marginTop:4}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,fontWeight:900,
            color:"#f59e42",letterSpacing:"-0.02em",marginBottom:6}}>44-0</div>
          <div style={{fontSize:12,color:"#9ca3af",lineHeight:1.6,fontFamily:"'Barlow',sans-serif"}}>
            Going undefeated requires elite players at multiple positions on both ends of the floor. Every slot on your roster needs to contribute. The right season matters as much as the right player.
          </div>
        </div>
      </div>
    </div>
  );

  // ── DAILY CHALLENGE RESULT SCREEN ──────────────────────────────────────────
  // Priority: overlay screens win over daily
  if(showDaily&&(showLeaderboard||showWaitlist||showGameInfo||showComingSoon||showConfirmReset)){
    // Fall through to those screens below
  } else if(showDaily&&dailyComplete&&dailyResult){
    const grade=dailyGrade||calcDailyGrade(dailyResult.wins,44);
    const tier=getTier(dailyResult.wins);
    const teamAbbrMap={"Las Vegas Aces":"LVA","New York Liberty":"NYL","Seattle Storm":"SEA","Minnesota Lynx":"MIN","Connecticut Sun":"CON","Indiana Fever":"IND","Phoenix Mercury":"PHX","Los Angeles Sparks":"LAL","Houston Comets":"HOU","Chicago Sky":"CHI","Washington Mystics":"WAS","Atlanta Dream":"ATL","Dallas Wings":"DAL","Golden State Valkyries":"GSV","Toronto Tempo":"TOR","Sacramento Monarchs":"SAC","Charlotte Sting":"CHA","Cleveland Rockers":"CLE","Miami Sol":"MIA","Portland Fire":"POR"};
    const rosterSlots=dailySlots||[];
    return(
      <div style={wrap}>
        {menuOpen&&<MenuOverlay/>}
        <div style={{width:"100%",paddingTop:20,paddingBottom:100}}>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}><HBurg/></div>

          {/* Daily header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div>
              <div style={{fontSize:9,color:"#f59e42",letterSpacing:"0.2em",fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif"}}>DRAFTED · DAILY</div>
              <div style={{fontSize:10,color:"#4b5563",fontFamily:"'Barlow',sans-serif",marginTop:1}}>{new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:9,color:"#6b7280",letterSpacing:"0.08em",fontFamily:"'Barlow',sans-serif"}}>NEXT DRAFT IN</div>
              <div style={{fontSize:13,fontWeight:800,color:"#f9fafb",fontFamily:"'Barlow Condensed',sans-serif"}}>{dailyCountdown}</div>
            </div>
          </div>

          {/* Record + Grade */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div style={{background:"rgba(74,222,128,0.06)",border:`1px solid ${tier.color}30`,borderRadius:12,padding:"14px",textAlign:"center"}}>
              <div style={{fontSize:8,color:"#6b7280",letterSpacing:"0.1em",marginBottom:6,fontFamily:"'Barlow',sans-serif"}}>RECORD</div>
              <div style={{fontSize:48,fontWeight:900,lineHeight:0.9,letterSpacing:"-0.02em",color:tier.color,fontFamily:"'Barlow Condensed',sans-serif"}}>{dailyResult.wins}-{dailyResult.losses}</div>
              <div style={{fontSize:8,color:tier.color,marginTop:6,letterSpacing:"0.1em",fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif"}}>{tier.label}</div>
            </div>
            <div style={{background:"rgba(245,158,66,0.06)",border:"1px solid rgba(245,158,66,0.18)",borderRadius:12,padding:"14px",textAlign:"center"}}>
              <div style={{fontSize:8,color:"#6b7280",letterSpacing:"0.1em",marginBottom:6,fontFamily:"'Barlow',sans-serif"}}>DRAFT GRADE</div>
              <div style={{fontSize:48,fontWeight:900,lineHeight:0.9,color:grade.color,fontFamily:"'Barlow Condensed',sans-serif"}}>{grade.grade}</div>
              <div style={{display:"flex",alignItems:"center",gap:4,marginTop:8}}>
                <div style={{fontSize:7,color:"#4b5563",fontFamily:"'Barlow',sans-serif"}}>F</div>
                <div style={{flex:1,height:3,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:grade.grade==="A+"?"100%":grade.grade==="A"?"92%":grade.grade==="B+"?"83%":grade.grade==="B"?"73%":grade.grade==="C+"?"63%":grade.grade==="C"?"53%":grade.grade==="D"?"38%":"15%",background:grade.color,borderRadius:2}}/>
                </div>
                <div style={{fontSize:7,color:"#4b5563",fontFamily:"'Barlow',sans-serif"}}>A+</div>
              </div>
            </div>
          </div>

          {/* Team stats */}
          {rosterSlots.length>0&&(()=>{
            const tot5d=(stat)=>rosterSlots.reduce((sum,s)=>sum+(s.player?.[stat]||0),0);
            return(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"12px",marginBottom:14}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",textAlign:"center",gap:4}}>
                  {[["PPG","pts"],["RPG","reb"],["APG","ast"],["SPG","stl"],["BPG","blk"]].map(([lbl,key])=>(
                    <div key={lbl}>
                      <div style={{fontSize:16,fontWeight:900,color:"#f9fafb",fontFamily:"'Barlow Condensed',sans-serif"}}>{tot5d(key).toFixed(1)}</div>
                      <div style={{fontSize:8,color:"#6b7280",fontFamily:"'Barlow',sans-serif",marginTop:2}}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Roster */}
          <div style={{fontSize:9,color:"#6b7280",letterSpacing:"0.1em",marginBottom:8,fontFamily:"'Barlow',sans-serif"}}>YOUR PICKS</div>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:14}}>
            {["PG","SG","SF","PF","C"].map(slotKey=>{
              const s=rosterSlots.find(sl=>sl.key===slotKey);
              if(!s||!s.player)return null;
              const p=s.player;const c=posColor(p.pos);
              const tot=(p.pts+p.reb+p.ast+p.stl+p.blk).toFixed(1);
              const abbr=teamAbbrMap[p.team]||p.team.slice(0,3).toUpperCase();
              return(
                <div key={slotKey} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"8px 10px"}}>
                  <Avatar player={p} size={30}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#f9fafb",fontFamily:"'Barlow Condensed',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}{s.boosted&&<span style={{fontSize:9,color:"#f59e42",marginLeft:5}}>⚡</span>}</div>
                    <div style={{fontSize:9,color:"#6b7280",fontFamily:"'Barlow',sans-serif"}}><span style={{color:c,fontWeight:700}}>{slotKey}</span> · {abbr} · {p.season}</div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Reveal best team */}
          {!dailyReveal?(
            <button onClick={()=>setDailyReveal(true)} style={{width:"100%",background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"11px",textAlign:"center",
              marginBottom:14,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:12,fontWeight:700,color:"#6b7280",letterSpacing:"0.08em",
              WebkitTapHighlightColor:"transparent"}}>
              👁 REVEAL BEST POSSIBLE TEAM
            </button>
          ):(
            <div style={{background:"rgba(245,158,66,0.05)",border:"1px solid rgba(245,158,66,0.15)",
              borderRadius:12,padding:"14px",marginBottom:14}}>
              <div style={{fontSize:9,color:"#f59e42",letterSpacing:"0.14em",fontWeight:700,marginBottom:10,fontFamily:"'Barlow Condensed',sans-serif"}}>BEST POSSIBLE TEAM TODAY</div>
              {dailyBestRoster&&dailyBestRoster.map((p,i)=>p&&(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(245,158,66,0.15)",
                    border:"1px solid rgba(245,158,66,0.3)",display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:8,fontWeight:800,color:"#f59e42",flexShrink:0,
                    fontFamily:"'Barlow Condensed',sans-serif"}}>
                    {p.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <div style={{flex:1,fontSize:12,color:"#e5e7eb",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600}}>{p.name}</div>
                  <div style={{fontSize:9,color:"#6b7280",fontFamily:"'Barlow',sans-serif"}}>{p.season}</div>
                </div>
              ))}
            </div>
          )}

          {/* Share button */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={async()=>{
              if(!window.html2canvas){
                await new Promise((res,rej)=>{
                  const s=document.createElement("script");
                  s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
                  s.onload=res;s.onerror=rej;document.head.appendChild(s);
                });
              }
              const tAbbr={"Las Vegas Aces":"LVA","New York Liberty":"NYL","Seattle Storm":"SEA","Minnesota Lynx":"MIN","Connecticut Sun":"CON","Indiana Fever":"IND","Phoenix Mercury":"PHX","Los Angeles Sparks":"LAL","Houston Comets":"HOU","Chicago Sky":"CHI","Washington Mystics":"WAS","Atlanta Dream":"ATL","Dallas Wings":"DAL","Golden State Valkyries":"GSV","Toronto Tempo":"TOR","Sacramento Monarchs":"SAC","Charlotte Sting":"CHA","Cleveland Rockers":"CLE","Miami Sol":"MIA","Portland Fire":"POR"};
              const dStr=new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
              const dc=document.createElement("div");
              dc.style.cssText="position:fixed;left:-9999px;top:0;width:390px;background:#07090f;color:#f9fafb;padding:20px 16px 24px;box-sizing:border-box;font-family:Barlow Condensed,sans-serif;";
              function el(tag,css,txt){const e=document.createElement(tag);if(css)e.style.cssText=css;if(txt!==undefined)e.textContent=txt;return e;}
              function ap(parent,...children){children.forEach(c=>parent.appendChild(c));return parent;}
              // Header row
              const topRow=el("div","display:flex;align-items:center;justify-content:space-between;margin-bottom:14px");
              ap(topRow,ap(el("div"),el("div","font-size:9px;color:#f59e42;letter-spacing:0.2em;font-weight:700","DRAFTED · DAILY"),el("div","font-size:10px;color:#4b5563;font-family:Barlow,sans-serif",dStr)),ap(el("div","text-align:right"),el("div","font-size:8px;color:#6b7280;font-family:Barlow,sans-serif","NEXT DRAFT IN"),el("div","font-size:12px;font-weight:800;color:#f9fafb",dailyCountdown)));
              // Record + Grade
              const rgRow=el("div","display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px");
              const rb=ap(el("div","background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.18);border-radius:12px;padding:12px;text-align:center"),el("div","font-size:8px;color:#6b7280;letter-spacing:0.1em;font-family:Barlow,sans-serif","RECORD"),el("div","font-size:42px;font-weight:900;line-height:0.9;color:"+tier.color,dailyResult.wins+"-"+dailyResult.losses),el("div","font-size:8px;color:"+tier.color+";margin-top:5px;letter-spacing:0.1em;font-weight:700",tier.label));
              const grPct2=grade.grade==="A+"?"100%":grade.grade==="A"?"92%":grade.grade==="B+"?"83%":grade.grade==="B"?"73%":grade.grade==="C+"?"63%":grade.grade==="C"?"53%":grade.grade==="D"?"38%":"15%";
              const grBarDiv=el("div","display:flex;align-items:center;gap:4px;margin-top:8px");
              const grBarF=el("div","font-size:7px;color:#4b5563;font-family:Barlow,sans-serif","F");
              const grBarTrack=el("div","flex:1;height:3px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden");
              const grBarFill=el("div","height:100%;width:"+grPct2+";background:"+grade.color+";border-radius:2px");
              grBarTrack.appendChild(grBarFill);
              const grBarA=el("div","font-size:7px;color:#4b5563;font-family:Barlow,sans-serif","A+");
              ap(grBarDiv,grBarF,grBarTrack,grBarA);
              const gb=ap(el("div","background:rgba(245,158,66,0.06);border:1px solid rgba(245,158,66,0.18);border-radius:12px;padding:12px;text-align:center"),el("div","font-size:8px;color:#6b7280;letter-spacing:0.1em;font-family:Barlow,sans-serif","DRAFT GRADE"),el("div","font-size:42px;font-weight:900;line-height:0.9;color:"+grade.color,grade.grade),grBarDiv);
              ap(rgRow,rb,gb);
              // Stats
              const sr=el("div","background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:9px;margin-bottom:10px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;text-align:center");
              const fp3=rosterSlots.filter(s=>s.player);
              [["PPG","pts"],["RPG","reb"],["APG","ast"],["SPG","stl"],["BPG","blk"]].forEach(sk=>{
                const tot=(fp3.reduce(function(sum,s){return sum+(s.player?s.player[sk[1]]||0:0);},0)).toFixed(1);
                ap(sr,ap(el("div"),el("div","font-size:13px;font-weight:800;color:#f9fafb",tot),el("div","font-size:8px;color:#6b7280;font-family:Barlow,sans-serif;margin-top:1px",sk[0])));
              });
              // Roster
              const rl=el("div","font-size:9px;color:#6b7280;letter-spacing:0.1em;margin-bottom:7px;font-family:Barlow,sans-serif","YOUR PICKS");
              const rd=el("div");
              ["PG","SG","SF","PF","C"].forEach(sk=>{
                const s=rosterSlots.find(sl=>sl.key===sk);if(!s||!s.player)return;
                const p=s.player;const c=p.pos&&p.pos.startsWith("G")?"#f59e42":p.pos&&p.pos.startsWith("C")?"#60a5fa":"#4ade80";
                const ini=p.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
                const abbr=tAbbr[p.team]||p.team.slice(0,3).toUpperCase();
                const row=ap(el("div","display:flex;align-items:center;gap:7px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:9px;padding:7px 9px;margin-bottom:4px"),
                  el("div","width:26px;height:26px;border-radius:50%;background:"+c+"22;border:1px solid "+c+"55;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:"+c+";flex-shrink:0",ini),
                  ap(el("div","flex:1;min-width:0"),el("div","font-size:12px;font-weight:700;color:#f9fafb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis",p.name+(s.boosted?" ⚡":"")),el("div","font-size:8px;color:#6b7280;font-family:Barlow,sans-serif",sk+" · "+abbr+" · "+p.season)));
                rd.appendChild(row);
              });
              // CTA
              const cta=ap(el("div","margin-top:12px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);padding-top:12px"),el("div","font-size:11px;color:#9ca3af;font-family:Barlow,sans-serif;margin-bottom:4px","Can you beat my draft grade?"),el("div","font-size:19px;font-weight:900;color:#f59e42","drafted.games"));
              ap(dc,topRow,rgRow,sr,rl,rd,cta);
              document.body.appendChild(dc);
              try{
                await document.fonts.ready;
                const cnv=await window.html2canvas(dc,{backgroundColor:"#07090f",scale:2,width:390,windowWidth:430});
                document.body.removeChild(dc);
                cnv.toBlob(async blob=>{
                  const file=new File([blob],"drafted-daily.png",{type:"image/png"});
                  if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:"Drafted Daily"});}catch{window.open(URL.createObjectURL(blob),"_blank");}}
                  else{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="drafted-daily.png";a.click();}
                },"image/png");
              }catch(e){if(document.body.contains(dc))document.body.removeChild(dc);}
            }} style={{width:"100%",background:"rgba(255,255,255,0.06)",color:"#f9fafb",
              border:"1px solid rgba(255,255,255,0.15)",borderRadius:14,padding:"14px",fontSize:15,
              fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",
              cursor:"pointer",textTransform:"uppercase",WebkitTapHighlightColor:"transparent"}}>↑ Share Result</button>
            <button onClick={()=>{
              setShowDaily(false);setMode(null);setPhase("spin");setRound(0);
              setBoard([]);setSlots(SLOTS.map(s=>({...s,player:null})));
              setDraftedNames(new Set());setUsedTeams(new Set());
              setPick1(null);setPick2(null);setResult(null);setTierMsg("");
              setSpinning(false);setSpinLanded(false);setPickTwoOn(false);setSelSlot(null);
              setFreshUsed(false);setHomeUsed(false);setTwoUsed(false);
              setBoostUsed(false);setPendingBoost(false);
            }} style={{width:"100%",background:"#f59e42",color:"#07090f",
              border:"none",borderRadius:14,padding:"16px",fontSize:17,fontWeight:800,
              fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",cursor:"pointer",
              textTransform:"uppercase",WebkitTapHighlightColor:"transparent"}}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  // ── DAILY CHALLENGE GAME FLOW ───────────────────────────────────────────────
  if(showDaily&&!dailyComplete&&playersLoaded){
    // Daily game uses same flow but with seeded boards, no lifelines, one boost
    // We reuse the main game flow by setting mode="daily"
    // This is handled in the main game render below via isDailyMode check
  }

  // ── MULTIPLAYER SCREENS ──────────────────────────────────────────────────────


  if(showMultiplayer){

    // JOIN / CREATE ROOM
    if(multiPhase==="join") return(
      <div style={wrap}>
        <div style={{width:"100%",paddingTop:40,paddingBottom:80,textAlign:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,marginBottom:6}}>Play with Friends</div>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:32}}>Same boards. Different picks. Who drafts best?</div>

          {/* Mode selector */}
          <div style={{display:"flex",gap:8,marginBottom:24,justifyContent:"center"}}>
            {[["classic","Classic"],["hoopiq","HoopIQ"]].map(([key,label])=>(
              <button key={key} onClick={()=>setMultiMode(key)} style={{
                padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",
                background:multiMode===key?"#f59e42":"rgba(255,255,255,0.06)",
                color:multiMode===key?"#07090f":"#9ca3af",
                fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,
                letterSpacing:"0.06em",textTransform:"uppercase",
                WebkitTapHighlightColor:"transparent"
              }}>{label}</button>
            ))}
          </div>

          {/* Create room */}
          <button onClick={async()=>{
            const code=generateRoomCode();
            const seed=Math.floor(Math.random()*999999)+1;
            const created=await supaFetch("rooms",{method:"POST",body:JSON.stringify({
              room_code:code,host_username:username||"Anonymous",board_seed:seed,
              game_mode:multiMode,status:"lobby",
              players:[{username:username||"Anonymous",ready:false,result:null}]
            })});
            console.log("[Multiplayer] Room created:", created);
            if(created&&created[0]){
              setMultiRoom(code);setMultiPhase("lobby");
              setMultiPlayers([{username:username||"Anonymous",ready:false,result:null}]);
            } else {
              alert("Failed to create room. Check console for details.");
            }
          }} style={{width:"100%",background:"#f59e42",color:"#07090f",border:"none",
            borderRadius:14,padding:"16px",fontSize:17,fontWeight:800,
            fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",
            cursor:"pointer",textTransform:"uppercase",marginBottom:16,
            WebkitTapHighlightColor:"transparent"}}>
            Create Room
          </button>

          {/* Join room */}
          <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>or enter a room code</div>
          <input value={roomCodeInput} onChange={e=>setRoomCodeInput(e.target.value.toUpperCase().slice(0,4))}
            placeholder="XXXX" maxLength={4}
            style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.15)",
              borderRadius:12,padding:"14px 16px",fontSize:20,color:"#f9fafb",outline:"none",
              boxSizing:"border-box",marginBottom:10,fontFamily:"'Barlow Condensed',sans-serif",
              textAlign:"center",letterSpacing:"0.3em"}}/>
          <button onClick={async()=>{
            if(roomCodeInput.length!==4)return;
            const data=await supaFetch("rooms?room_code=eq."+roomCodeInput+"&select=*");
            if(data&&data[0]){
              const room=data[0];
              const newPlayers=[...(room.players||[]),{username:username||"Anonymous",ready:false,result:null}];
              await supaFetch("rooms?room_code=eq."+roomCodeInput,{method:"PATCH",headers:{"Prefer":"return=representation"},body:JSON.stringify({players:newPlayers})});
              setMultiRoom(roomCodeInput);setMultiPlayers(newPlayers);
              setMultiMode(room.game_mode||"classic");
              setMultiPhase(room.status==="playing"?"spectator":"lobby");
            } else {
              alert("Room not found. Check your code.");
            }
          }} style={{width:"100%",background:"rgba(255,255,255,0.06)",color:"#f9fafb",
            border:"1px solid rgba(255,255,255,0.15)",borderRadius:14,padding:"14px",
            fontSize:15,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",
            letterSpacing:"0.08em",cursor:"pointer",textTransform:"uppercase",
            marginBottom:24,WebkitTapHighlightColor:"transparent"}}>
            Join Room
          </button>

          <button onClick={()=>{setShowMultiplayer(false);setMultiPhase("join");setRoomCodeInput("");}}
            style={{background:"none",border:"none",color:"#6b7280",fontSize:12,cursor:"pointer"}}>← Back</button>
        </div>
      </div>
    );

    // LOBBY
    if(multiPhase==="lobby") return(
      <div style={wrap}>
        <div style={{width:"100%",paddingTop:40,paddingBottom:80,textAlign:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,marginBottom:6}}>Game Lobby</div>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:20}}>{multiMode==="hoopiq"?"HoopIQ Mode":"Classic Mode"}</div>

          {/* Room code display */}
          <div style={{background:"rgba(245,158,66,0.08)",border:"1px solid rgba(245,158,66,0.2)",
            borderRadius:14,padding:"16px",marginBottom:24}}>
            <div style={{fontSize:9,color:"#6b7280",letterSpacing:"0.14em",marginBottom:6}}>ROOM CODE</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:42,fontWeight:900,
              color:"#f59e42",letterSpacing:"0.2em"}}>{multiRoom}</div>
            <div style={{fontSize:11,color:"#6b7280",marginTop:6}}>Share this code with friends</div>
          </div>

          {/* Players list */}
          <div style={{fontSize:9,color:"#6b7280",letterSpacing:"0.14em",marginBottom:10,textAlign:"left"}}>
            PLAYERS ({multiPlayers.length}/8)
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:24}}>
            {multiPlayers.map((player,idx)=>(
              <div key={idx} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:10,padding:"11px 14px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(245,158,66,0.15)",
                    border:"1px solid rgba(245,158,66,0.3)",display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:10,fontWeight:800,color:"#f59e42",
                    fontFamily:"'Barlow Condensed',sans-serif"}}>
                    {(player.username||"A").slice(0,2).toUpperCase()}
                  </div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#f9fafb"}}>{player.username}</div>
                  {idx===0&&<div style={{fontSize:8,color:"#f59e42",background:"rgba(245,158,66,0.1)",
                    border:"1px solid rgba(245,158,66,0.2)",borderRadius:3,padding:"1px 5px",
                    letterSpacing:"0.06em"}}>HOST</div>}
                </div>
                <div style={{fontSize:11,fontWeight:700,color:player.ready?"#4ade80":"#6b7280",
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em"}}>
                  {player.ready?"READY":"NOT READY"}
                </div>
              </div>
            ))}
          </div>

          {/* Ready / Start buttons */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={async()=>{
              const newPlayers=multiPlayers.map(p=>
                p.username===(username||"Anonymous")?{...p,ready:!p.ready}:p
              );
              setMultiPlayers(newPlayers);setMultiReady(!multiReady);
              await supaFetch("rooms?room_code=eq."+multiRoom,{method:"PATCH",headers:{"Prefer":"return=representation"},body:JSON.stringify({players:newPlayers})});
            }} style={{width:"100%",background:multiReady?"rgba(74,222,128,0.15)":"rgba(255,255,255,0.06)",
              color:multiReady?"#4ade80":"#f9fafb",
              border:`1px solid ${multiReady?"rgba(74,222,128,0.3)":"rgba(255,255,255,0.15)"}`,
              borderRadius:14,padding:"14px",fontSize:15,fontWeight:700,
              fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",
              cursor:"pointer",textTransform:"uppercase",WebkitTapHighlightColor:"transparent"}}>
              {multiReady?"✓ Ready":"Set Ready"}
            </button>

            {multiPlayers[0]?.username===(username||"Anonymous")&&multiPlayers.filter(p=>p.ready).length>=2&&(
              <button onClick={async()=>{
                await supaFetch("rooms?room_code=eq."+multiRoom,{method:"PATCH",body:JSON.stringify({status:"playing"})});
              }} style={{width:"100%",background:"#f59e42",color:"#07090f",border:"none",
                borderRadius:14,padding:"16px",fontSize:17,fontWeight:800,
                fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",
                cursor:"pointer",textTransform:"uppercase",WebkitTapHighlightColor:"transparent"}}>
                Start Game ({multiPlayers.filter(p=>p.ready).length} players)
              </button>
            )}

            <button onClick={()=>{setShowMultiplayer(false);setMultiPhase("join");setMultiRoom(null);setRoomCodeInput("");}}
              style={{background:"none",border:"none",color:"#6b7280",fontSize:12,cursor:"pointer"}}>Leave Room</button>
          </div>
        </div>
      </div>
    );

    // WAITING — user finished, waiting for others
    if(multiPhase==="waiting") return(
      <div style={wrap}>
        <div style={{width:"100%",paddingTop:80,textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:16}}>⏳</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,marginBottom:8}}>Draft Complete!</div>
          <div style={{fontSize:13,color:"#6b7280",marginBottom:24}}>
            Waiting on {multiPlayers.filter(p=>!p.result).length} player{multiPlayers.filter(p=>!p.result).length!==1?"s":""} to finish drafting...
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {multiPlayers.map((player,idx)=>(
              <div key={idx} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:10,padding:"10px 14px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#f9fafb"}}>{player.username}</div>
                <div style={{fontSize:11,fontWeight:700,color:player.result?"#4ade80":"#f59e42",
                  fontFamily:"'Barlow Condensed',sans-serif"}}>
                  {player.result?"DONE":"DRAFTING..."}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // RESULTS — simultaneous reveal
    if(multiPhase==="results") return(
      <div style={wrap}>
        <div style={{width:"100%",paddingTop:30,paddingBottom:80}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,marginBottom:6}}>🏆 Final Standings</div>
            <div style={{fontSize:12,color:"#6b7280"}}>Room {multiRoom}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[...multiResults].filter(function(p){return p&&p.result;}).sort(function(a,b){
              var aw=(a.result&&a.result.wins)||0,bw=(b.result&&b.result.wins)||0;
              if(bw!==aw)return bw-aw;
              var aTotal=((a.result&&a.result.teamOff)||0)+((a.result&&a.result.teamDef)||0);
              var bTotal=((b.result&&b.result.teamOff)||0)+((b.result&&b.result.teamDef)||0);
              return bTotal-aTotal;
            }).map((player,idx)=>{
              const medal=idx===0?"🥇":idx===1?"🥈":idx===2?"🥉":null;
              const r=player.result||{};
              const tier=getTier(r.wins||0);
              return(
                <div key={idx} style={{background:idx===0?"rgba(245,158,66,0.06)":"rgba(255,255,255,0.03)",
                  border:`1px solid ${idx===0?"rgba(245,158,66,0.2)":"rgba(255,255,255,0.07)"}`,
                  borderRadius:14,padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:900,
                        color:"#6b7280",minWidth:24}}>{medal||`${idx+1}`}</div>
                      <div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:800,color:"#f9fafb"}}>{player.username}</div>
                        <div style={{fontSize:10,color:tier.color,fontWeight:700,marginTop:1}}>{tier.label}</div>
                      </div>
                    </div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:900,color:tier.color}}>
                      {r.wins||0}-{r.losses||0}
                    </div>
                  </div>
                  {/* Roster preview */}
                  {r.roster&&(
                    <div style={{display:"flex",gap:6}}>
                      {r.roster.map((rp,ri)=>(
                        <div key={ri} style={{flex:1,textAlign:"center"}}>
                          <div style={{fontSize:8,color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(rp.name||"").split(" ").pop()}</div>
                          <div style={{fontSize:8,color:"#4b5563"}}>'{String(rp.season).slice(2)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:20}}>
            <button onClick={()=>{setShowMultiplayer(false);setMultiPhase("join");setMultiRoom(null);
              setMultiResults([]);setMode(null);reset(true);}}
              style={{width:"100%",background:"#f59e42",color:"#07090f",border:"none",
                borderRadius:14,padding:"16px",fontSize:17,fontWeight:800,
                fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",
                cursor:"pointer",textTransform:"uppercase",WebkitTapHighlightColor:"transparent"}}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );

    // SPECTATOR — joined late
    if(multiPhase==="spectator") return(
      <div style={wrap}>
        <div style={{width:"100%",paddingTop:80,textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:16}}>👁</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,marginBottom:8}}>Spectating</div>
          <div style={{fontSize:13,color:"#6b7280",marginBottom:24}}>Game in progress. You'll see results when everyone finishes.</div>
          <button onClick={()=>{setShowMultiplayer(false);setMultiPhase("join");}}
            style={{background:"none",border:"none",color:"#6b7280",fontSize:12,cursor:"pointer"}}>← Leave</button>
        </div>
      </div>
    );
  }

  // ── COMING SOON PAGE ────────────────────────────────────────────────────────
  if(showComingSoon){
    const csLg=LEAGUES[showComingSoon];
    return(
      <div style={{...wrap,justifyContent:"center",minHeight:"100vh"}}>
        <div style={{width:"100%",textAlign:"center"}}>
          <div style={{fontSize:56,marginBottom:16}}>{csLg.emoji}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:42,fontWeight:900,
            color:csLg.color,letterSpacing:"-0.02em",marginBottom:4}}>{csLg.record}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,
            color:"#f9fafb",letterSpacing:"0.04em",marginBottom:8}}>{csLg.name} DRAFT GAME</div>
          <div style={{fontSize:13,color:"#6b7280",marginBottom:32,lineHeight:1.6}}>
            Build the greatest {csLg.name} team of all time.<br/>Coming soon to drafted.games
          </div>

          {/* Waitlist inline */}
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:14,padding:"20px",marginBottom:24,textAlign:"center"}}>
            <div style={{fontSize:12,color:"#9ca3af",marginBottom:14}}>Get notified when {csLg.name} drops</div>
            {!waitlistDone?(
              <>
                <input value={waitlistInput} onChange={function(e){setWaitlistInput(e.target.value);}}
                  placeholder="Email or phone number"
                  style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.15)",
                    borderRadius:12,padding:"14px 16px",fontSize:15,color:"#f9fafb",outline:"none",
                    boxSizing:"border-box",marginBottom:10,fontFamily:"'Barlow',sans-serif"}}/>
                <button onClick={function(){
                  if(!waitlistInput.trim())return;
                  fetch("https://formspree.io/f/xrevqzgk",{
                    method:"POST",headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({contact:waitlistInput.trim(),source:"drafted.games",league:csLg.name})
                  }).catch(function(){});
                  setWaitlistDone(true);
                }} style={{
                  width:"100%",background:csLg.color,color:"#07090f",border:"none",borderRadius:12,
                  padding:"14px",fontSize:15,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",
                  letterSpacing:"0.08em",cursor:"pointer",textTransform:"uppercase",marginBottom:6}}>Notify Me</button>
              </>
            ):(
              <div style={{background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",
                borderRadius:12,padding:"16px"}}>
                <div style={{color:"#4ade80",fontWeight:700}}>You're on the list!</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>We'll notify you when {csLg.name} launches.</div>
              </div>
            )}
          </div>

          <button onClick={function(){setShowComingSoon(null);setWaitlistDone(false);setWaitlistInput("");}}
            style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:12,padding:"12px 28px",color:"#f9fafb",fontSize:14,fontWeight:700,
              cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em",
              textTransform:"uppercase"}}>← Back to WNBA</button>
        </div>
      </div>
    );
  }

  if(showCelebration)return <CelebrationScreen onContinue={()=>{setShowCelebration(false);setPhase("result");}}/>;

  if(showUsernamePrompt)return(
    <div style={{...wrap,justifyContent:"center",minHeight:"100vh"}}>
      <div style={{width:"100%",textAlign:"center",padding:"0 0 40px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:48,fontWeight:900,marginBottom:8}}>
          44<span style={{color:"#f59e42"}}>-</span>0
        </div>
        <div style={{fontSize:14,color:"#9ca3af",marginBottom:8,lineHeight:1.6}}>Choose a username for the leaderboard.</div>
        <div style={{fontSize:11,color:"#6b7280",marginBottom:28}}>Just for display — no account needed. Change anytime by refreshing.</div>
        <input value={usernameInput} onChange={e=>setUsernameInput(e.target.value.slice(0,20))}
          onKeyDown={e=>e.key==="Enter"&&saveUsername()} placeholder="e.g. wnbageek99" maxLength={20}
          style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.15)",
            borderRadius:12,padding:"14px 16px",fontSize:16,color:"#f9fafb",outline:"none",
            boxSizing:"border-box",marginBottom:10,fontFamily:"'Barlow',sans-serif"}} autoFocus/>
        <button onClick={saveUsername} disabled={!usernameInput.trim()} style={{
          width:"100%",background:usernameInput.trim()?"#f59e42":"rgba(255,255,255,0.06)",
          color:usernameInput.trim()?"#07090f":"#4b5563",border:"none",borderRadius:12,padding:"14px",
          fontSize:15,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",
          cursor:usernameInput.trim()?"pointer":"default",textTransform:"uppercase",marginBottom:12}}>Set Username</button>
        <button onClick={()=>{setUsername("Anonymous");setShowUsernamePrompt(false);}}
          style={{background:"none",border:"none",color:"#6b7280",fontSize:12,cursor:"pointer"}}>Skip for now</button>
      </div>
    </div>
  );

  if(showLeaderboard)return(
    <div style={wrap}>
      {menuOpen&&<MenuOverlay/>}
      <div style={{width:"100%",paddingTop:20,paddingBottom:80}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900}}>🏆 Leaderboard</div>
          <button onClick={()=>setShowLeaderboard(false)} style={{background:"rgba(255,255,255,0.06)",
            border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 12px",
            color:"#9ca3af",fontSize:12,cursor:"pointer"}}>← Back</button>
        </div>
        {/* League tabs */}
        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {Object.entries(LEAGUES).map(function(entry){
            const key=entry[0];const lg=entry[1];
            const isSel=key==="wnba";
            return(
              <button key={key} style={{
                flex:1,padding:"8px 4px",borderRadius:8,border:"none",cursor:lg.active?"pointer":"default",
                background:isSel?lg.color+"22":"rgba(255,255,255,0.03)",
                color:isSel?lg.color:lg.active?"#6b7280":"#374151",
                fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:isSel?800:600,
                letterSpacing:"0.06em",opacity:lg.active?1:0.5,
              }}>{lg.name}</button>
            );
          })}
        </div>
        <div style={{fontSize:11,color:"#6b7280",letterSpacing:"0.1em",marginBottom:4}}>TOP TEAMS · RESETS DAILY 9AM</div>
        <div style={{fontSize:11,color:"#4b5563",marginBottom:20}}>Ranked by wins, then combined team rating</div>
        {leaderboard.map((entry,idx)=>{
          const medal=idx===0?"🥇":idx===1?"🥈":idx===2?"🥉":null;
          return(
            <div key={idx} style={{background:"rgba(255,255,255,0.03)",
              border:`1px solid ${idx<3?"rgba(249,158,66,0.2)":"rgba(255,255,255,0.06)"}`,
              borderRadius:14,padding:"14px 16px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:900,color:"#6b7280",minWidth:24}}>{medal||`${idx+1}`}</div>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:800,color:"#f9fafb"}}>{entry.username}</div>
                    <div style={{fontSize:10,color:"#6b7280",marginTop:1}}>
                      <span style={{color:"#f59e42",fontWeight:700}}>OFF {entry.teamOff}</span>
                      <span style={{margin:"0 6px",color:"#374151"}}>·</span>
                      <span style={{color:"#60a5fa",fontWeight:700}}>DEF {entry.teamDef}</span>
                    </div>
                  </div>
                </div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,
                  color:entry.wins>=44?"#f59e42":entry.wins>=37?"#4ade80":entry.wins>=30?"#60a5fa":"#a78bfa"}}>
                  {entry.wins}-{entry.losses}</div>
              </div>
              <div style={{display:"flex",gap:6}}>
                {entry.roster.map((p,i)=>{
                  const ini=p.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
                  return(
                    <div key={i} style={{flex:1,textAlign:"center"}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.08)",
                        border:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",
                        justifyContent:"center",fontSize:10,fontWeight:700,color:"#9ca3af",
                        fontFamily:"'Barlow Condensed',sans-serif",margin:"0 auto 3px"}}>{ini}</div>
                      <div style={{fontSize:8,color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name.split(" ").pop()}</div>
                      <div style={{fontSize:8,color:"#374151"}}>'{String(p.season).slice(2)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {leaderboard.length===0&&<div style={{textAlign:"center",color:"#4b5563",padding:60,fontSize:14}}>No 44-0 teams yet today.<br/>Be the first! 🏆</div>}
      </div>
    </div>
  );

  if(showWaitlist)return(
    <div style={{...wrap,justifyContent:"center",minHeight:"100vh"}}>
      <div style={{width:"100%",textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:12}}>📱</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,marginBottom:8}}>App Coming Soon</div>
        <div style={{fontSize:13,color:"#9ca3af",marginBottom:28,lineHeight:1.6}}>
          Get notified when the 44-0 app drops.<br/><span style={{fontSize:11,color:"#6b7280"}}>No spam, just a one-time notification.</span>
        </div>
        {!waitlistDone?(
          <>
            <input value={waitlistInput} onChange={e=>setWaitlistInput(e.target.value)}
              placeholder="Email or phone number"
              style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.15)",
                borderRadius:12,padding:"14px 16px",fontSize:15,color:"#f9fafb",outline:"none",
                boxSizing:"border-box",marginBottom:10,fontFamily:"'Barlow',sans-serif"}}/>
            <button onClick={()=>{
              if(!waitlistInput.trim())return;
              fetch("https://formspree.io/f/xrevqzgk",{
                method:"POST",headers:{"Content-Type":"application/json"},
                body:JSON.stringify({contact:waitlistInput.trim(),source:"drafted.games"})
              }).catch(function(){});
              setWaitlistDone(true);
            }} style={{
              width:"100%",background:"#f59e42",color:"#07090f",border:"none",borderRadius:12,
              padding:"14px",fontSize:15,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",
              letterSpacing:"0.08em",cursor:"pointer",textTransform:"uppercase",marginBottom:12}}>Notify Me</button>
          </>
        ):(
          <div style={{background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",
            borderRadius:12,padding:"20px",marginBottom:16}}>
            <div style={{fontSize:20,marginBottom:6}}>✓</div>
            <div style={{color:"#4ade80",fontWeight:700}}>You're on the list!</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>We'll reach out when the app drops.</div>
          </div>
        )}
        <button onClick={()=>{setShowWaitlist(false);setWaitlistDone(false);setWaitlistInput("");}}
          style={{background:"none",border:"none",color:"#6b7280",fontSize:12,cursor:"pointer"}}>← Back</button>
      </div>
    </div>
  );

  if(showConfirmReset)return(
    <div style={{...wrap,justifyContent:"center",minHeight:"100vh"}}>
      <div style={{width:"100%",textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:800,marginBottom:12}}>Start Over?</div>
        <div style={{fontSize:13,color:"#9ca3af",marginBottom:28}}>Your current draft will be lost.</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setShowConfirmReset(false)} style={{flex:1,background:"rgba(255,255,255,0.06)",
            border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"14px",fontSize:14,
            fontWeight:700,color:"#f9fafb",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
            letterSpacing:"0.06em",textTransform:"uppercase"}}>Cancel</button>
          <button onClick={()=>reset(true)} style={{flex:1,background:"#f87171",border:"none",borderRadius:12,
            padding:"14px",fontSize:14,fontWeight:800,color:"#fff",cursor:"pointer",
            fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase"}}>New Game</button>
        </div>
      </div>
    </div>
  );

  if(!mode)return(
    <div style={wrap}>
      {menuOpen&&<MenuOverlay/>}
      <div style={{position:"fixed",top:20,right:20,zIndex:10}}><HBurg/></div>
      <div style={{width:"100%",paddingTop:56,paddingBottom:80,textAlign:"center"}}>
        <div style={{fontSize:10,letterSpacing:"0.3em",color:"#6b7280",marginBottom:6}}>drafted.games</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:64,fontWeight:900,lineHeight:0.88,letterSpacing:"-0.01em",marginBottom:6}}>
          DRAFTED
        </div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,fontWeight:900,color:"#f59e42",letterSpacing:"-0.02em"}}>
          44<span style={{color:"rgba(255,255,255,0.2)"}}>-</span>0
        </div>
        <div style={{fontSize:11,letterSpacing:"0.2em",color:"#f59e42",marginTop:6}}>WNBA DRAFT GAME</div>
        {username&&<div style={{fontSize:12,color:"#6b7280",marginTop:10}}>Playing as <span style={{color:"#9ca3af",fontWeight:600}}>{username}</span></div>}
        <div style={{color:"#6b7280",fontSize:13,marginTop:16,marginBottom:40,lineHeight:1.7}}>
          Build the greatest WNBA team of all time.<br/>Can you go undefeated?
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:32}}>
          {/* Daily Challenge — top, time-sensitive */}
          <button onClick={()=>{
            if(!username){setShowUsernamePrompt(true);setTimeout(()=>setShowDaily(true),50);}
            else if(dailyComplete){setShowDaily(true);}
            else{setShowDaily(true);setMode("classic");}
          }} style={{background:"rgba(245,158,66,0.08)",color:"#f9fafb",
            border:"1px solid rgba(245,158,66,0.25)",borderRadius:14,padding:"16px 24px",
            cursor:"pointer",display:"flex",flexDirection:"column",gap:4,textAlign:"left",
            WebkitTapHighlightColor:"transparent",position:"relative"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:"#f59e42"}}>Daily Challenge</span>
              {dailyComplete&&<span style={{fontSize:9,color:"#4ade80",background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:4,padding:"2px 6px",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>DONE ✓</span>}
            </div>
            <span style={{fontSize:12,opacity:0.6}}>Everyone gets the same 5 boards · No lifelines · One boost</span>
            <div style={{fontSize:10,color:"#6b7280",marginTop:2,fontFamily:"'Barlow',sans-serif"}}>Next draft in {dailyCountdown}</div>
          </button>

          {/* Classic + HoopIQ */}
          {[["Classic","Stats visible · Make informed picks","classic",true],
            ["HoopIQ","Stats hidden · Draft from memory","hoopiq",false]].map(([l,s,m,a])=>(
            <button key={m} onClick={()=>{if(!username){setShowUsernamePrompt(true);setTimeout(()=>setMode(m),50);}else setMode(m);}}
              style={{background:a?"#f59e42":"rgba(255,255,255,0.05)",color:a?"#07090f":"#f9fafb",
                border:a?"none":"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"16px 24px",
                cursor:"pointer",display:"flex",flexDirection:"column",gap:4,textAlign:"left",
                WebkitTapHighlightColor:"transparent"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase"}}>{l}</span>
              <span style={{fontSize:12,opacity:0.6}}>{s}</span>
            </button>
          ))}

          {/* Play with Friends */}
          <button onClick={()=>{
            if(!username){setShowUsernamePrompt(true);setTimeout(()=>setShowMultiplayer(true),50);}
            else setShowMultiplayer(true);
          }} style={{background:"rgba(255,255,255,0.05)",color:"#f9fafb",
            border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"16px 24px",
            cursor:"pointer",display:"flex",flexDirection:"column",gap:4,textAlign:"left",
            WebkitTapHighlightColor:"transparent"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase"}}>Play with Friends</span>
            <span style={{fontSize:12,opacity:0.6}}>Same boards · Different picks · One boost each</span>
          </button>
        </div>
        <div style={{background:"rgba(255,255,255,0.025)",borderRadius:14,padding:"18px 20px",
          textAlign:"left",border:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{fontSize:11,color:"#f59e42",letterSpacing:"0.14em",marginBottom:12,fontWeight:700}}>HOW TO PLAY</div>
          {["Spin a random WNBA franchise board each round",
            "Pick one player-season — each player only once",
            "Fill 5 slots: PG · SG · SF · PF · C",
            "Tap the lineup bar to swap positions",
            "Balance offense AND defense",
            "Star power required — role players can't go 44-0"].map((t,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:7,fontSize:12,color:"#9ca3af"}}>
              <span style={{color:"#f59e42",minWidth:16,fontWeight:700}}>{i+1}.</span><span>{t}</span>
            </div>
          ))}
          <div style={{marginTop:14,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:14}}>
            <div style={{fontSize:11,color:"#60a5fa",letterSpacing:"0.12em",marginBottom:10,fontWeight:700}}>LIFELINES (1 use each)</div>
            {[["🔄","Fresh Start","New franchise"],
              ["🏠","Hometown Hero","Reshuffle same team — diff seasons can appear"],
              ["2️⃣","Pick Two","Draft 2 players from this board"]].map(([e,l,d])=>(
              <div key={l} style={{display:"flex",gap:10,marginBottom:7,fontSize:12,color:"#9ca3af"}}>
                <span>{e}</span><span><span style={{color:"#e5e7eb",fontWeight:600}}>{l}</span> — {d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if(phase==="result"&&result){
    const tier=getTier(result.wins);
    return(
      <div style={wrap}>
        {menuOpen&&<MenuOverlay/>}
        <div style={{width:"100%",paddingTop:20,paddingBottom:120}}>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}><HBurg/></div>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{fontSize:11,letterSpacing:"0.2em",color:"#6b7280",marginBottom:10}}>FINAL RECORD</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:88,fontWeight:900,
              lineHeight:0.9,letterSpacing:"-0.02em",color:tier.color}}>
              {result.wins}<span style={{color:"rgba(255,255,255,0.15)"}}>-</span>{result.losses}
            </div>
            <div style={{fontSize:13,letterSpacing:"0.18em",color:tier.color,marginTop:10,textTransform:"uppercase",fontWeight:700}}>{tier.label}</div>
            <div style={{fontSize:13,color:"#6b7280",marginTop:8,fontStyle:"italic"}}>{tierMsg}</div>
          </div>

          {/* Team combined stats */}
          {(()=>{
            const filled=slots.filter(s=>s.player);
            const tot5=(stat)=>filled.reduce((sum,s)=>sum+(s.player[stat]||0),0);
            return(
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:12,padding:"14px",marginBottom:14}}>
                <div style={{fontSize:9,color:"#6b7280",letterSpacing:"0.14em",marginBottom:12,fontFamily:"'Barlow',sans-serif"}}>TEAM STATS</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:4,textAlign:"center",marginBottom:12}}>
                  {[["PPG","pts"],["RPG","reb"],["APG","ast"],["SPG","stl"],["BPG","blk"]].map(([lbl,key])=>(
                    <div key={lbl}>
                      <div style={{fontSize:18,fontWeight:900,color:"#f9fafb",fontFamily:"'Barlow Condensed',sans-serif"}}>{tot5(key).toFixed(1)}</div>
                      <div style={{fontSize:9,color:"#6b7280",fontFamily:"'Barlow',sans-serif",marginTop:2}}>{lbl}</div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })()}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,color:"#6b7280",letterSpacing:"0.1em",marginBottom:10,fontFamily:"'Barlow',sans-serif"}}>YOUR ROSTER</div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {["PG","SG","SF","PF","C"].map(slotKey=>{
                const s=slots.find(sl=>sl.key===slotKey);
                if(!s||!s.player)return null;
                const p=s.player;const c=posColor(p.pos);
                const teamAbbr={"Las Vegas Aces":"LVA","New York Liberty":"NYL","Seattle Storm":"SEA",
                  "Minnesota Lynx":"MIN","Connecticut Sun":"CON","Indiana Fever":"IND",
                  "Phoenix Mercury":"PHX","Los Angeles Sparks":"LAL","Houston Comets":"HOU",
                  "Chicago Sky":"CHI","Washington Mystics":"WAS","Atlanta Dream":"ATL",
                  "Dallas Wings":"DAL","Golden State Valkyries":"GSV","Toronto Tempo":"TOR",
                  "Sacramento Monarchs":"SAC","Charlotte Sting":"CHA","Cleveland Rockers":"CLE",
                  "Miami Sol":"MIA","Portland Fire":"POR"};
                const abbr=teamAbbr[p.team]||p.team.slice(0,3).toUpperCase();
                return(
                  <div key={s.key} style={{display:"flex",alignItems:"center",gap:8,
                    background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",
                    borderRadius:11,padding:"9px 11px"}}>
                    <Avatar player={p} size={34}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,
                        color:"#f9fafb",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                      <div style={{fontSize:10,color:"#6b7280",marginTop:1,fontFamily:"'Barlow',sans-serif"}}>
                        <span style={{color:c,fontWeight:700}}>{s.key}</span> · {abbr} · {p.season}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={async()=>{
              if(!window.html2canvas){
                await new Promise((res,rej)=>{
                  const s=document.createElement("script");
                  s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
                  s.onload=res;s.onerror=rej;document.head.appendChild(s);
                });
              }
              // Build share card using DOM API (no template literal conflicts)
              const card=document.createElement("div");
              const cs=card.style;
              cs.position="fixed";cs.left="-9999px";cs.top="0";cs.width="390px";
              cs.background="#07090f";cs.color="#f9fafb";cs.padding="40px 20px 32px";
              cs.boxSizing="border-box";cs.fontFamily="'Barlow Condensed',sans-serif";

              // Header
              const hdr=document.createElement("div");
              hdr.style.cssText="text-align:center;margin-bottom:24px";
              const lbl=document.createElement("div");
              lbl.style.cssText="font-size:11px;letter-spacing:0.2em;color:#6b7280;margin-bottom:10px;font-family:Barlow,sans-serif";
              lbl.textContent="FINAL RECORD";
              const rec=document.createElement("div");
              rec.style.cssText="font-size:88px;font-weight:900;line-height:0.9;letter-spacing:-0.03em;color:"+tier.color;
              rec.textContent=result.wins+"-"+result.losses;
              const tierLbl=document.createElement("div");
              tierLbl.style.cssText="font-size:13px;letter-spacing:0.18em;font-weight:700;margin-top:10px;text-transform:uppercase;color:"+tier.color;
              tierLbl.textContent=tier.label;
              const msg=document.createElement("div");
              msg.style.cssText="font-size:12px;color:#6b7280;margin-top:6px;font-style:italic;font-family:Barlow,sans-serif";
              msg.textContent=tierMsg;
              hdr.appendChild(lbl);hdr.appendChild(rec);hdr.appendChild(tierLbl);hdr.appendChild(msg);

              // Ratings
              // Team stats row
              const statsRow=document.createElement("div");
              statsRow.style.cssText="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:10px;margin-bottom:10px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;text-align:center";
              const filledPlayers=slots.filter(function(s){return s.player;});
              [["PPG","pts"],["RPG","reb"],["APG","ast"],["SPG","stl"],["BPG","blk"]].forEach(function(sk){
                const avg=(filledPlayers.reduce(function(sum,s){return sum+(s.player[sk[1]]||0);},0)).toFixed(1);
                const cell=document.createElement("div");
                const vDiv=document.createElement("div");
                vDiv.style.cssText="font-size:15px;font-weight:800;color:#f9fafb;font-family:Barlow Condensed,sans-serif";
                vDiv.textContent=avg;
                const lDiv=document.createElement("div");
                lDiv.style.cssText="font-size:8px;color:#6b7280;font-family:Barlow,sans-serif;margin-top:2px";
                lDiv.textContent=sk[0];
                cell.appendChild(vDiv);cell.appendChild(lDiv);statsRow.appendChild(cell);
              });

              // Roster label
              const rLabel=document.createElement("div");
              rLabel.style.cssText="font-size:10px;color:#6b7280;letter-spacing:0.1em;margin-bottom:10px;font-family:Barlow,sans-serif";
              rLabel.textContent="YOUR ROSTER";

              // Roster rows
              const rosterDiv=document.createElement("div");
              const teamAbbrMap={"Las Vegas Aces":"LVA","New York Liberty":"NYL","Seattle Storm":"SEA","Minnesota Lynx":"MIN","Connecticut Sun":"CON","Indiana Fever":"IND","Phoenix Mercury":"PHX","Los Angeles Sparks":"LAL","Houston Comets":"HOU","Chicago Sky":"CHI","Washington Mystics":"WAS","Atlanta Dream":"ATL","Dallas Wings":"DAL","Golden State Valkyries":"GSV","Toronto Tempo":"TOR","Sacramento Monarchs":"SAC","Charlotte Sting":"CHA","Cleveland Rockers":"CLE","Miami Sol":"MIA","Portland Fire":"POR"};
              const slotOrder=["PG","SG","SF","PF","C"];
              slotOrder.forEach(function(slotKey){
                const s=slots.find(function(sl){return sl.key===slotKey;});
                if(!s||!s.player)return;
                const p=s.player;
                const c=p.pos&&p.pos.startsWith("G")?"#f59e42":p.pos&&p.pos.startsWith("C")?"#60a5fa":"#4ade80";
                const ini=p.name.split(" ").map(function(w){return w[0];}).join("").slice(0,2).toUpperCase();
                const abbr=teamAbbrMap[p.team]||p.team.slice(0,3).toUpperCase();
                const row=document.createElement("div");
                row.style.cssText="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:9px 11px;margin-bottom:5px";
                const av=document.createElement("div");
                av.style.cssText="width:32px;height:32px;border-radius:50%;background:"+c+"22;border:1px solid "+c+"55;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:"+c+";flex-shrink:0";
                av.textContent=ini;
                const info=document.createElement("div");
                info.style.cssText="flex:1;min-width:0";
                const nm=document.createElement("div");
                nm.style.cssText="font-size:14px;font-weight:700;color:#f9fafb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:Barlow Condensed,sans-serif";
                nm.textContent=p.name;
                const sub=document.createElement("div");
                sub.style.cssText="font-size:9px;color:#6b7280;margin-top:1px;font-family:Barlow,sans-serif";
                sub.textContent=slotKey+" · "+abbr+" · "+p.season;
                info.appendChild(nm);info.appendChild(sub);
                row.appendChild(av);row.appendChild(info);
                rosterDiv.appendChild(row);
              });

              // Footer CTA
              const footer=document.createElement("div");
              footer.style.cssText="margin-top:20px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px";
              const cta=document.createElement("div");
              cta.style.cssText="font-size:12px;color:#9ca3af;margin-bottom:6px;font-family:Barlow,sans-serif";
              cta.textContent="I went "+result.wins+"-"+result.losses+", think you can do better?";
              const domain=document.createElement("div");
              domain.style.cssText="font-size:22px;font-weight:900;color:#f59e42;letter-spacing:-0.01em";
              domain.textContent="drafted.games";
              footer.appendChild(cta);footer.appendChild(domain);

              card.appendChild(hdr);card.appendChild(statsRow);card.appendChild(rLabel);
              card.appendChild(rosterDiv);card.appendChild(footer);
              document.body.appendChild(card);

              try{
                await document.fonts.ready;
                const canvas=await window.html2canvas(card,{
                  backgroundColor:"#07090f",scale:2,width:390,windowWidth:430
                });
                document.body.removeChild(card);
                canvas.toBlob(async function(blob){
                  const file=new File([blob],"44-0-result.png",{type:"image/png"});
                  if(navigator.canShare&&navigator.canShare({files:[file]})){
                    try{await navigator.share({files:[file],title:"44-0 WNBA Draft Game"});}
                    catch(e2){window.open(URL.createObjectURL(blob),"_blank");}
                  }else{
                    const a=document.createElement("a");
                    a.href=URL.createObjectURL(blob);a.download="44-0-result.png";a.click();
                  }
                },"image/png");
              }catch(e){
                if(document.body.contains(card))document.body.removeChild(card);
                console.error("Share failed:",e);
              }
            }} style={{width:"100%",background:"rgba(255,255,255,0.06)",color:"#f9fafb",
              border:"1px solid rgba(255,255,255,0.15)",borderRadius:14,padding:"14px",fontSize:15,
              fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",
              cursor:"pointer",textTransform:"uppercase",display:"flex",alignItems:"center",
              justifyContent:"center",gap:8}}>↑ Share Result</button>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{
                const currentMode=mode;
                setMode(null);setPhase("spin");setRound(0);setCurrentTeam(null);
                setBoard([]);setSlots(SLOTS.map(s=>({...s,player:null})));
                setDraftedNames(new Set());setUsedTeams(new Set());
                setPick1(null);setPick2(null);setResult(null);setTierMsg("");
                setSpinning(false);setSpinLanded(false);setPickTwoOn(false);setSelSlot(null);
                setFreshUsed(false);setHomeUsed(false);setTwoUsed(false);
                setBoostUsed(false);setPendingBoost(false);setShowDaily(false);
    setShowMultiplayer(false);setMultiRoom(null);setMultiPlayers([]);
    setMultiReady(false);setMultiPhase("join");setMultiResults([]);
    setRoomCodeInput("");setMultiBoards(null);
                setShowConfirmReset(false);setShowCelebration(false);
                setMode(currentMode);
              }} style={{flex:2,background:"#f59e42",color:"#07090f",
                border:"none",borderRadius:14,padding:"16px",fontSize:17,fontWeight:800,
                fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",cursor:"pointer",
                textTransform:"uppercase",WebkitTapHighlightColor:"transparent"}}>
                Play Again
              </button>
              <button onClick={()=>{
                const newMode=mode==="classic"?"hoopiq":"classic";
                setPhase("spin");setRound(0);setCurrentTeam(null);
                setBoard([]);setSlots(SLOTS.map(s=>({...s,player:null})));
                setDraftedNames(new Set());setUsedTeams(new Set());
                setPick1(null);setPick2(null);setResult(null);setTierMsg("");
                setSpinning(false);setSpinLanded(false);setPickTwoOn(false);setSelSlot(null);
                setFreshUsed(false);setHomeUsed(false);setTwoUsed(false);
                setBoostUsed(false);setPendingBoost(false);
                setMode(newMode);
              }} style={{flex:1,background:"rgba(255,255,255,0.06)",color:"#9ca3af",
                border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"16px",fontSize:12,
                fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em",
                cursor:"pointer",textTransform:"uppercase",WebkitTapHighlightColor:"transparent"}}>
                {mode==="classic"?"Try HoopIQ":"Try Classic"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{...wrap,paddingBottom:0}}>
      <div style={{width:"100%",flex:1}}>
        {menuOpen&&<MenuOverlay/>}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"16px 0 12px",position:"sticky",top:0,background:"#07090f",
          zIndex:10,borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <div onClick={()=>{
            if(filledCount>0){
              if(window.confirm("Go back to Home? You will lose your current draft.")){reset(true);}
            } else {reset(true);}
          }} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,letterSpacing:"0.02em",display:"flex",alignItems:"center",gap:8,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
            <span>DRAFTED</span>
            <span style={{fontSize:12,color:"#f59e42",fontWeight:700}}>44-0</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{background:hoopIQ?"rgba(167,139,250,0.13)":"rgba(249,158,66,0.12)",
              border:`1px solid ${hoopIQ?"#a78bfa33":"#f59e4233"}`,borderRadius:20,
              padding:"3px 10px",fontSize:10,color:hoopIQ?"#a78bfa":"#f59e42",letterSpacing:"0.08em",fontWeight:700}}>
              {hoopIQ?"HOOPIQ":"CLASSIC"}
            </div>
            <div style={{fontSize:11,color:"#6b7280"}}>{filledCount}/5</div>
            <HBurg/>
          </div>
        </div>

        {phase==="spin"&&(
          <div style={{textAlign:"center",padding:"64px 0"}}>
            <div style={{fontSize:11,color:"#374151",letterSpacing:"0.14em",marginBottom:24,textTransform:"uppercase"}}>
              {isDailyMode?"Daily Challenge · ":""}Round {round+1} — Dealing your board
            </div>
            {spinning?(
              <div>
                <div key={spinLabel} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700,
                  minHeight:40,color:spinLanded?tc.primary:"#9ca3af",
                  transition:"color 0.4s, transform 0.08s",
                  transform:"translateX(0)",
                  animation:spinLanded?"none":"slideIn 0.08s ease-out"}}>{spinLabel}</div>
                {spinLanded&&<div style={{fontSize:11,color:"#4b5563",marginTop:10,letterSpacing:"0.1em",
                  animation:"fadeIn 0.3s ease-out"}}>LOADING BOARD...</div>}
                <style>{`
                  @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
                  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
                `}</style>
              </div>
            ):(
              <button onClick={()=>doSpin()} style={{background:"#f59e42",color:"#07090f",border:"none",
                borderRadius:14,padding:"18px 56px",fontSize:19,fontWeight:800,
                fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.07em",cursor:"pointer",
                textTransform:"uppercase",WebkitTapHighlightColor:"transparent"}}>Spin Board</button>
            )}
          </div>
        )}

        {phase==="pick"&&currentTeam&&(
          <div style={{paddingBottom:170}}>
            <div style={{paddingTop:14,paddingBottom:12,borderBottom:`2px solid ${tc.primary}44`,marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:4,height:28,borderRadius:2,background:tc.primary,flexShrink:0}}/>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#f9fafb"}}>{currentTeam}</div>
                  <div style={{fontSize:11,color:"#6b7280",marginTop:1}}>
                    {reshuffling?"Reshuffling board...":`${board.length} players · Round ${round+1}`}
                    {pickTwoOn&&!reshuffling&&<span style={{color:"#4ade80",marginLeft:8}}>· Pick 2</span>}
                  </div>
                </div>
              </div>
            </div>
            {!isDailyMode&&!showMultiplayer&&<div style={{display:"flex",gap:7,marginBottom:14}}>
              <Lifeline emoji="🔄" name="Fresh Start" desc="New team" used={freshUsed} locked={pickTwoOn}
                onClick={()=>{setFreshUsed(true);setPhase("spin");setCurrentTeam(null);setPickTwoOn(false);doSpin({exclude:currentTeam});}}/>
              <Lifeline emoji="🏠" name="Hometown" desc="Reshuffle" used={homeUsed} locked={pickTwoOn}
                onClick={doHometown}/>
              <Lifeline emoji="2️⃣" name="Pick Two" desc="Draft 2" used={twoUsed} locked={filledCount>=4}
                onClick={()=>{setTwoUsed(true);setPickTwoOn(true);setPick1(null);setPick2(null);}}/>
            </div>}
            {(isDailyMode||showMultiplayer)&&(
              <div style={{display:"flex",gap:7,marginBottom:14}}>
                <button onClick={()=>{if(!boostUsed)setPendingBoost(b=>!b);}} style={{
                  flex:1,background:pendingBoost?"rgba(245,158,66,0.15)":boostUsed?"rgba(255,255,255,0.01)":"rgba(255,255,255,0.04)",
                  border:`1px solid ${pendingBoost?"rgba(245,158,66,0.4)":boostUsed?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.12)"}`,
                  borderRadius:11,padding:"9px 4px",cursor:boostUsed?"default":"pointer",
                  opacity:boostUsed?0.25:1,textAlign:"center",WebkitTapHighlightColor:"transparent"}}>
                  <div style={{fontSize:17,marginBottom:3}}>{boostUsed?"✗":"⚡"}</div>
                  <div style={{fontSize:10,fontWeight:700,color:pendingBoost?"#f59e42":boostUsed?"#374151":"#e5e7eb",letterSpacing:"0.04em",marginBottom:1}}>BOOST</div>
                  <div style={{fontSize:9,color:"#4b5563",lineHeight:1.3}}>{boostUsed?"Used":pendingBoost?"Select player":"Apply to next pick"}</div>
                </button>
                <div style={{flex:4,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:11,padding:"9px 10px",display:"flex",alignItems:"center"}}>
                  <div style={{fontSize:11,color:"#6b7280",fontFamily:"'Barlow',sans-serif",lineHeight:1.4}}>
                    {boostUsed?"Boost used this draft.":pendingBoost?"⚡ Tap a player to apply your boost":"No lifelines in Daily Challenge. One boost available — higher-rated players get a smaller boost."}
                  </div>
                </div>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:9,
              opacity:reshuffling?0:1,transform:reshuffling?"translateY(8px)":"translateY(0)",
              transition:"opacity 0.3s, transform 0.3s"}}>
              {board.length===0&&!reshuffling?(
                <div style={{textAlign:"center",color:"#6b7280",padding:40}}>No eligible players</div>
              ):board.map(p=>(
                <PlayerCard key={p.id} player={p} hoopIQ={hoopIQ}
                  selected={pick1?.id===p.id} secondSel={pick2?.id===p.id}
                  pickTwo={pickTwoOn} onClick={()=>handleCardClick(p)}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {(phase==="pick"||phase==="spin")&&(
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
          width:"100%",maxWidth:480,background:"rgba(7,9,15,0.97)",
          borderTop:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(16px)",zIndex:50}}>
          {phase==="pick"&&(
            <div style={{padding:canConfirm?"10px 16px 6px":"0 16px",
              maxHeight:canConfirm?60:0,overflow:"hidden",
              transition:"max-height 0.25s ease, padding 0.25s ease"}}>
              <button onClick={confirmPick} style={{width:"100%",
                background:tc.primary||"#f59e42",color:"#07090f",border:"none",
                borderRadius:11,padding:"12px",fontSize:14,fontWeight:800,
                fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em",
                cursor:"pointer",textTransform:"uppercase",WebkitTapHighlightColor:"transparent"}}>
                {!pick1?pickTwoOn?"Select 1st player":"Select a player"
                 :pickTwoOn&&!pick2?`${pick1.name} — pick 2nd`
                 :pickTwoOn?`Draft ${pick1.name} + ${pick2.name}`
                 :`Draft ${pick1.name} (${pick1.season})`}
              </button>
            </div>
          )}
          <div style={{padding:"8px 12px 20px"}}>
            <div style={{display:"flex",gap:5}}>
              {slots.map(slot=>{
                const p=slot.player;const c=p?posColor(p.pos):"#374151";
                const isSel=selSlot===slot.key;const label=shortLabel(p);
                return(
                  <div key={slot.key} onClick={()=>handleSlotTap(slot.key)}
                    style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                      gap:3,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                    <div style={{fontSize:9,color:p?"#9ca3af":"transparent",
                      letterSpacing:"0.03em",fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:600,height:11,lineHeight:"11px",whiteSpace:"nowrap",
                      textAlign:"center",maxWidth:60,overflow:"hidden",textOverflow:"ellipsis"}}>
                      {label||"·"}
                    </div>
                    <div style={{position:"relative"}}>
                      <Avatar player={p} size={38}/>
                      {isSel&&<div style={{position:"absolute",inset:-2,borderRadius:"50%",
                        border:"2px solid #f59e42",pointerEvents:"none"}}/>}
                    </div>
                    <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",
                      color:isSel?"#f59e42":p?c:"#374151",fontFamily:"'Barlow Condensed',sans-serif"}}>
                      {slot.key}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
