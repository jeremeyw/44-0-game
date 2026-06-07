'use client'
import { useState, useEffect, useRef } from "react";

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

function generateBoard(team,draftedNames=new Set(),hometown=false,size=10,minElite=3){
  const pool=PLAYER_DB.filter(p=>p.team===team);
  // Don't sort by rating — shuffle for variety, then pick elite separately
  const shuffledPool=shuffle([...pool]);
  const elite=shuffledPool.filter(p=>p.off>=80||p.def>=80);
  const regular=shuffledPool.filter(p=>p.off<80&&p.def<80);
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
  const elitePicks=pickUnique(elite,minElite,boardSeen);
  let regPicks=pickUnique(regular,size-elitePicks.length,boardSeen);
  if(regPicks.length<size-elitePicks.length){
    const extra=elite.filter(p=>!boardSeen.has(playerBase(p.name)));
    regPicks=[...regPicks,...pickUnique(extra,size-elitePicks.length-regPicks.length,boardSeen)];
  }
  return shuffle([...elitePicks,...regPicks]).slice(0,size);
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
  const defMult=teamDef>=22?1.25:teamDef>=17?1.10:teamDef>=12?0.96:teamDef>=7?0.80:teamDef>=3?0.64:0.45;

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

  // Continuous ceiling — peak quality + depth both matter
  // Elite defense can compensate for one weak link (masking applied above)
  // Combined quality score for smoother ceiling
  const combinedQ=(peakQ*0.45+depthScore*0.55);
  let ceiling;
  if(peakQ>=97&&depthScore>=90)       ceiling=44;
  else if(peakQ>=95&&depthScore>=88)  ceiling=43;
  else if(combinedQ>=92&&depthScore>=88) ceiling=43;
  else if(peakQ>=93&&depthScore>=86)  ceiling=41;
  else if(combinedQ>=91&&depthScore>=87) ceiling=41;
  else if(peakQ>=90&&depthScore>=88)  ceiling=41;
  else if(peakQ>=93&&depthScore>=83)  ceiling=39;
  else if(peakQ>=90&&depthScore>=85)  ceiling=39;
  else if(combinedQ>=89&&depthScore>=86) ceiling=39;
  else if(peakQ>=88&&depthScore>=84)  ceiling=37;
  else if(combinedQ>=87&&depthScore>=85) ceiling=37;
  else if(peakQ>=90&&depthScore>=81)  ceiling=34;
  else if(peakQ>=86&&depthScore>=83)  ceiling=34;
  else if(combinedQ>=85&&depthScore>=83) ceiling=34;
  else if(peakQ>=84&&depthScore>=82)  ceiling=30;
  else if(combinedQ>=83&&depthScore>=82) ceiling=30;
  else if(peakQ>=82&&depthScore>=80)  ceiling=26;
  else if(combinedQ>=80&&depthScore>=80) ceiling=26;
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

  const [playersLoaded, setPlayersLoaded] = useState(false);

  useEffect(()=>{
    const l=document.createElement("link");
    l.href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap";
    l.rel="stylesheet";document.head.appendChild(l);
    // Load full player database
    fetch('/players.json')
      .then(r=>r.json())
      .then(data=>{ PLAYER_DB=data; setPlayersLoaded(true); })
      .catch(()=>setPlayersLoaded(true)); // fallback — game still works with empty DB
  },[]);

  const hoopIQ=mode==="hoopiq";
  const filledCount=slots.filter(s=>s.player).length;
  const canConfirm=pick1&&(!pickTwoOn||pick2);
  const tc=currentTeam?teamColor(currentTeam):{primary:"#f59e42",secondary:"#1f2937"};

  function doSpin(opts={}){
    const{exclude=null,hometown=false}=opts;
    setSpinning(true);setSpinLanded(false);setPick1(null);setPick2(null);setSelSlot(null);
    const allTeams=[...new Set(PLAYER_DB.map(p=>p.team))].sort();
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
          setBoard(generateBoard(chosen,draftedNames,hometown));
          setSpinning(false);setPhase("pick");
        },1500);
      }
    },75);
  }

  function doHometown(){
    setHomeUsed(true);setPickTwoOn(false);setPick1(null);setPick2(null);
    setReshuffling(true);setBoard([]);
    setTimeout(()=>{
      setBoard(generateBoard(currentTeam,draftedNames,true));
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
    picks.forEach(p=>{newSlots=smartAutoAssign(p,newSlots);newDrafted.add(playerBase(p.name));});
    const newUsed=new Set([...usedTeams,currentTeam]);
    setSlots(newSlots);setDraftedNames(newDrafted);setUsedTeams(newUsed);
    setPick1(null);setPick2(null);setPickTwoOn(false);setSelSlot(null);
    if(newSlots.filter(s=>s.player).length>=5){
      const res=simulateSeason(newSlots);
      setResult(res);setTierMsg(res?res.tierMessage:"");
      if(res&&res.wins===44){
        const name=username||"Anonymous";
        const entry={username:name,wins:44,losses:0,teamOff:res.teamOff,teamDef:res.teamDef,
          roster:newSlots.filter(s=>s.player).map(s=>({name:s.player.name,season:s.player.season,slot:s.key}))};
        setLeaderboard(prev=>[entry,...prev.filter(e=>e.username!==name)].sort((a,b)=>(b.teamOff+b.teamDef)-(a.teamOff+a.teamDef)).slice(0,10));
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
      <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:0,right:0,bottom:0,width:240,
        background:"#0d1017",borderLeft:"1px solid rgba(255,255,255,0.08)",
        display:"flex",flexDirection:"column",padding:"48px 20px 32px"}}>
        <button onClick={()=>setMenuOpen(false)} style={{position:"absolute",top:16,right:16,
          background:"none",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer",lineHeight:1}}>✕</button>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,marginBottom:28,color:"#f9fafb"}}>
          44<span style={{color:"#f59e42"}}>-</span>0
        </div>
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:10,padding:"10px 12px",marginBottom:24}}>
          <div style={{fontSize:9,color:"#6b7280",letterSpacing:"0.1em",marginBottom:3}}>PLAYING AS</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#f9fafb"}}>{username||"Anonymous"}</div>
          <button onClick={()=>{setMenuOpen(false);setUsernameInput(username);setShowUsernamePrompt(true);}}
            style={{background:"none",border:"none",color:"#f59e42",fontSize:10,cursor:"pointer",padding:0,marginTop:2}}>
            Change username →
          </button>
        </div>
        {[{label:"🏆  Leaderboard",action:()=>{setMenuOpen(false);setShowLeaderboard(true);}},
          {label:"📱  Join App Waitlist",action:()=>{setMenuOpen(false);setShowWaitlist(true);}},
          {label:"🔄  New Game",action:()=>reset(),danger:true}].map(item=>(
          <button key={item.label} onClick={item.action} style={{background:"none",
            border:"none",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"16px 0",
            textAlign:"left",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:14,
            fontWeight:600,color:item.danger?"#f87171":"#e5e7eb"}}>{item.label}</button>
        ))}
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
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900}}>🏆 Leaderboard</div>
          <button onClick={()=>setShowLeaderboard(false)} style={{background:"rgba(255,255,255,0.06)",
            border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 12px",
            color:"#9ca3af",fontSize:12,cursor:"pointer"}}>← Back</button>
        </div>
        <div style={{fontSize:11,color:"#6b7280",letterSpacing:"0.1em",marginBottom:4}}>44-0 TEAMS ONLY · RESETS DAILY 9AM</div>
        <div style={{fontSize:11,color:"#4b5563",marginBottom:20}}>Ranked by combined OFF + DEF rating</div>
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
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:"#4ade80"}}>44-0</div>
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
            <button onClick={()=>{if(waitlistInput.trim())setWaitlistDone(true);}} style={{
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
        <div style={{fontSize:11,letterSpacing:"0.3em",color:"#f59e42",marginBottom:12}}>WNBA · DRAFT GAME</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:96,fontWeight:900,lineHeight:0.88,letterSpacing:"-0.03em"}}>
          44<span style={{color:"#f59e42"}}>-</span>0
        </div>
        {username&&<div style={{fontSize:12,color:"#6b7280",marginTop:10}}>Playing as <span style={{color:"#9ca3af",fontWeight:600}}>{username}</span></div>}
        <div style={{color:"#6b7280",fontSize:13,marginTop:16,marginBottom:40,lineHeight:1.7}}>
          Build the greatest WNBA team of all time.<br/>Can you go undefeated?
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:32}}>
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
              lineHeight:0.9,letterSpacing:"-0.03em",color:tier.color}}>
              {result.wins}<span style={{color:"rgba(255,255,255,0.15)"}}>-</span>{result.losses}
            </div>
            <div style={{fontSize:13,letterSpacing:"0.18em",color:tier.color,marginTop:10,textTransform:"uppercase",fontWeight:700}}>{tier.label}</div>
            <div style={{fontSize:13,color:"#6b7280",marginTop:8,fontStyle:"italic"}}>{tierMsg}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
            {[["TEAM OFF RTG",result.teamOff,"#f59e42"],["TEAM DEF RTG",result.teamDef,"#60a5fa"]].map(([l,v,c])=>(
              <div key={l} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:12,padding:"14px 10px",textAlign:"center"}}>
                <div style={{fontSize:9,color:"#6b7280",letterSpacing:"0.1em",marginBottom:4}}>{l}</div>
                <div style={{fontSize:28,fontWeight:900,color:c,fontFamily:"'Barlow Condensed',sans-serif"}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,color:"#6b7280",letterSpacing:"0.1em",marginBottom:10}}>YOUR ROSTER</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {slots.map(s=>{
                if(!s.player)return null;
                const p=s.player;const c=posColor(p.pos);
                const tot=(p.pts+p.reb+p.ast+p.stl+p.blk).toFixed(1);
                const oop=getPosPenalty(p.pos,s.posGroup)<1.0;
                return(
                  <div key={s.key} style={{display:"flex",alignItems:"center",gap:10,
                    background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
                    borderRadius:12,padding:"11px 13px"}}>
                    <Avatar player={p} size={36}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,
                          color:"#f9fafb",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                        {oop&&<div style={{fontSize:8,color:"#f87171",background:"rgba(248,113,113,0.12)",
                          border:"1px solid rgba(248,113,113,0.25)",borderRadius:3,padding:"1px 4px",
                          letterSpacing:"0.05em",flexShrink:0}}>OOP</div>}
                      </div>
                      <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>
                        <span style={{color:c,fontWeight:600}}>{s.key}</span> · {p.season}
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:14,fontWeight:800,color:"#f9fafb",fontFamily:"'Barlow Condensed',sans-serif"}}>{tot}</div>
                      <div style={{fontSize:9,color:"#6b7280",letterSpacing:"0.06em"}}>TOTAL</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {result.perfectLineup&&(
            <div style={{background:"rgba(74,222,128,0.07)",border:"1px solid rgba(74,222,128,0.18)",
              borderRadius:10,padding:"9px 13px",fontSize:12,color:"#4ade80",textAlign:"center",marginBottom:14}}>
              ✓ Perfect natural lineup 2G/2F/1C — chemistry boost applied
            </div>
          )}
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
              const rtgRow=document.createElement("div");
              rtgRow.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px";
              [["TEAM OFF RTG",result.teamOff,"#f59e42"],["TEAM DEF RTG",result.teamDef,"#60a5fa"]].forEach(function(item){
                const box=document.createElement("div");
                box.style.cssText="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px 10px;text-align:center";
                const bl=document.createElement("div");
                bl.style.cssText="font-size:9px;color:#6b7280;letter-spacing:0.1em;margin-bottom:4px;font-family:Barlow,sans-serif";
                bl.textContent=item[0];
                const bv=document.createElement("div");
                bv.style.cssText="font-size:28px;font-weight:900;color:"+item[2];
                bv.textContent=item[1];
                box.appendChild(bl);box.appendChild(bv);rtgRow.appendChild(box);
              });

              // Roster label
              const rLabel=document.createElement("div");
              rLabel.style.cssText="font-size:10px;color:#6b7280;letter-spacing:0.1em;margin-bottom:10px;font-family:Barlow,sans-serif";
              rLabel.textContent="YOUR ROSTER";

              // Roster rows
              const rosterDiv=document.createElement("div");
              slots.filter(function(s){return s.player;}).forEach(function(s){
                const p=s.player;
                const c=p.pos&&p.pos.startsWith("G")?"#f59e42":p.pos&&p.pos.startsWith("C")?"#60a5fa":"#4ade80";
                const tot=(p.pts+p.reb+p.ast+p.stl+p.blk).toFixed(1);
                const ini=p.name.split(" ").map(function(w){return w[0];}).join("").slice(0,2).toUpperCase();
                const row=document.createElement("div");
                row.style.cssText="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:11px 13px;margin-bottom:7px";
                const av=document.createElement("div");
                av.style.cssText="width:36px;height:36px;border-radius:50%;background:"+c+"22;border:1.5px solid "+c+"66;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:"+c+";flex-shrink:0";
                av.textContent=ini;
                const info=document.createElement("div");
                info.style.cssText="flex:1;min-width:0";
                const nm=document.createElement("div");
                nm.style.cssText="font-size:15px;font-weight:700;color:#f9fafb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
                nm.textContent=p.name;
                const sub=document.createElement("div");
                sub.style.cssText="font-size:10px;color:#6b7280;margin-top:2px;font-family:Barlow,sans-serif";
                sub.textContent=s.key+" · "+p.season;
                info.appendChild(nm);info.appendChild(sub);
                const stat=document.createElement("div");
                stat.style.cssText="text-align:right;flex-shrink:0";
                const sv=document.createElement("div");
                sv.style.cssText="font-size:14px;font-weight:800;color:#f9fafb";
                sv.textContent=tot;
                const sl=document.createElement("div");
                sl.style.cssText="font-size:9px;color:#6b7280;font-family:Barlow,sans-serif";
                sl.textContent="TOTAL";
                stat.appendChild(sv);stat.appendChild(sl);
                row.appendChild(av);row.appendChild(info);row.appendChild(stat);
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
              domain.textContent="44-0.com";
              footer.appendChild(cta);footer.appendChild(domain);

              card.appendChild(hdr);card.appendChild(rtgRow);card.appendChild(rLabel);
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
            <button onClick={()=>reset(true)} style={{width:"100%",background:"#f59e42",color:"#07090f",
              border:"none",borderRadius:14,padding:"16px",fontSize:17,fontWeight:800,
              fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",cursor:"pointer",textTransform:"uppercase"}}>
              Play Again</button>
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
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,letterSpacing:"-0.01em"}}>
            44<span style={{color:"#f59e42"}}>-</span>0
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
              Round {round+1} — Dealing your board
            </div>
            {spinning?(
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700,
                  minHeight:40,color:spinLanded?tc.primary:"#9ca3af",transition:"color 0.4s"}}>{spinLabel}</div>
                {spinLanded&&<div style={{fontSize:11,color:"#4b5563",marginTop:10,letterSpacing:"0.1em"}}>LOADING BOARD...</div>}
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
            <div style={{display:"flex",gap:7,marginBottom:14}}>
              <Lifeline emoji="🔄" name="Fresh Start" desc="New team" used={freshUsed} locked={pickTwoOn}
                onClick={()=>{setFreshUsed(true);setPhase("spin");setCurrentTeam(null);setPickTwoOn(false);doSpin({exclude:currentTeam});}}/>
              <Lifeline emoji="🏠" name="Hometown" desc="Reshuffle" used={homeUsed} locked={pickTwoOn}
                onClick={doHometown}/>
              <Lifeline emoji="2️⃣" name="Pick Two" desc="Draft 2" used={twoUsed} locked={filledCount>=4}
                onClick={()=>{setTwoUsed(true);setPickTwoOn(true);setPick1(null);setPick2(null);}}/>
            </div>
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
