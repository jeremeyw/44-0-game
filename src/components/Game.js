'use client'
import { useState, useEffect, useRef } from "react";

// ── PLAYER DATABASE ───────────────────────────────────────────────────────────
const PLAYER_DB = [{"id":"aja-wilson_2025_LVA","name":"A'ja Wilson","season":2025,"team":"Las Vegas Aces","pos":"C","pts":23.4,"reb":10.2,"ast":3.0,"stl":1.6,"blk":2.3,"g":40,"off":98.8,"def":95.9},{"id":"aja-wilson_2024_LVA","name":"A'ja Wilson","season":2024,"team":"Las Vegas Aces","pos":"C","pts":26.9,"reb":11.9,"ast":2.3,"stl":1.8,"blk":2.6,"g":38,"off":96.4,"def":94.0},{"id":"aja-wilson_2022_LVA","name":"A'ja Wilson","season":2022,"team":"Las Vegas Aces","pos":"C","pts":19.5,"reb":9.4,"ast":2.1,"stl":1.4,"blk":1.9,"g":36,"off":93.6,"def":94.5},{"id":"aja-wilson_2023_LVA","name":"A'ja Wilson","season":2023,"team":"Las Vegas Aces","pos":"C","pts":22.8,"reb":9.5,"ast":1.6,"stl":1.4,"blk":2.2,"g":40,"off":91.9,"def":95.3},{"id":"aja-wilson_2026_LVA","name":"A'ja Wilson","season":2026,"team":"Las Vegas Aces","pos":"C","pts":24.8,"reb":8.9,"ast":2.7,"stl":1.2,"blk":2.6,"g":9,"off":90.8,"def":82.8},{"id":"aja-wilson_2020_LVA","name":"A'ja Wilson","season":2020,"team":"Las Vegas Aces","pos":"C","pts":20.5,"reb":8.5,"ast":2.0,"stl":1.2,"blk":2.0,"g":22,"off":87.8,"def":83.6},{"id":"natalie-williams_2000_UTA","name":"Natalie Williams","season":2000,"team":"Las Vegas Aces","pos":"C","pts":18.7,"reb":11.6,"ast":1.8,"stl":1.2,"blk":0.6,"g":29,"off":92.5,"def":77.9},{"id":"aja-wilson_2021_LVA","name":"A'ja Wilson","season":2021,"team":"Las Vegas Aces","pos":"C","pts":18.3,"reb":9.3,"ast":3.1,"stl":0.9,"blk":1.2,"g":32,"off":88.9,"def":81.2},{"id":"sophia-young-malcolm_2008_SAS","name":"Sophia Young-Malcolm","season":2008,"team":"Las Vegas Aces","pos":"F","pts":17.5,"reb":5.6,"ast":2.3,"stl":1.6,"blk":0.5,"g":33,"off":90.9,"def":79.0},{"id":"sophia-young-malcolm_2012_SAS","name":"Sophia Young-Malcolm","season":2012,"team":"Las Vegas Aces","pos":"F","pts":16.3,"reb":7.2,"ast":2.1,"stl":2.2,"blk":0.4,"g":33,"off":87.4,"def":81.0},{"id":"natalie-williams_1999_UTA","name":"Natalie Williams","season":1999,"team":"Las Vegas Aces","pos":"C","pts":18.0,"reb":9.2,"ast":0.9,"stl":1.4,"blk":0.8,"g":28,"off":90.1,"def":78.2},{"id":"liz-cambage_2019_LVA","name":"Liz Cambage","season":2019,"team":"Las Vegas Aces","pos":"C","pts":15.9,"reb":8.2,"ast":2.1,"stl":0.6,"blk":1.6,"g":32,"off":85.7,"def":82.4},{"id":"chelsea-gray_2023_LVA","name":"Chelsea Gray","season":2023,"team":"Las Vegas Aces","pos":"G","pts":15.3,"reb":4.0,"ast":7.3,"stl":1.4,"blk":0.6,"g":40,"off":92.2,"def":75.7},{"id":"natalie-williams_2001_UTA","name":"Natalie Williams","season":2001,"team":"Las Vegas Aces","pos":"C","pts":14.2,"reb":9.9,"ast":1.8,"stl":1.3,"blk":0.3,"g":31,"off":88.4,"def":79.4},{"id":"margo-dydek_2002_UTA","name":"Margo Dydek","season":2002,"team":"Las Vegas Aces","pos":"C","pts":13.1,"reb":8.7,"ast":2.4,"stl":0.8,"blk":3.6,"g":30,"off":80.9,"def":86.7},{"id":"liz-cambage_2021_LVA","name":"Liz Cambage","season":2021,"team":"Las Vegas Aces","pos":"C","pts":14.2,"reb":8.2,"ast":1.3,"stl":0.9,"blk":1.6,"g":25,"off":84.3,"def":83.3},{"id":"angel-mccoughtry_2020_LVA","name":"Angel McCoughtry","season":2020,"team":"Las Vegas Aces","pos":"G-F","pts":14.4,"reb":5.1,"ast":2.5,"stl":1.3,"blk":0.3,"g":22,"off":88.9,"def":77.4},{"id":"ann-wauters_2008_SAS","name":"Ann Wauters","season":2008,"team":"Las Vegas Aces","pos":"C","pts":14.7,"reb":7.5,"ast":1.8,"stl":1.1,"blk":1.2,"g":32,"off":84.1,"def":81.6},{"id":"aja-wilson_2018_LVA","name":"A'ja Wilson","season":2018,"team":"Las Vegas Aces","pos":"C","pts":20.7,"reb":8.0,"ast":2.2,"stl":0.8,"blk":1.7,"g":33,"off":84.5,"def":80.0},{"id":"margo-dydek_1999_UTA","name":"Margo Dydek","season":1999,"team":"Las Vegas Aces","pos":"C","pts":12.6,"reb":6.4,"ast":1.8,"stl":0.4,"blk":2.4,"g":32,"off":87.0,"def":77.4},{"id":"chennedy-carter_2026_LVA","name":"Chennedy Carter","season":2026,"team":"Las Vegas Aces","pos":"G","pts":17.5,"reb":2.4,"ast":1.6,"stl":1.2,"blk":0.4,"g":8,"off":90.6,"def":73.2},{"id":"jackie-young_2023_LVA","name":"Jackie Young","season":2023,"team":"Las Vegas Aces","pos":"G","pts":17.6,"reb":4.0,"ast":3.8,"stl":1.3,"blk":0.1,"g":40,"off":92.4,"def":71.2},{"id":"becky-hammon_2009_SAS","name":"Becky Hammon","season":2009,"team":"Las Vegas Aces","pos":"G","pts":19.5,"reb":3.3,"ast":5.0,"stl":1.6,"blk":0.4,"g":31,"off":95.6,"def":67.7},{"id":"jackie-young_2025_LVA","name":"Jackie Young","season":2025,"team":"Las Vegas Aces","pos":"G","pts":16.5,"reb":4.5,"ast":5.1,"stl":1.3,"blk":0.4,"g":44,"off":91.9,"def":70.1},{"id":"margo-dydek_2001_UTA","name":"Margo Dydek","season":2001,"team":"Las Vegas Aces","pos":"C","pts":10.9,"reb":7.6,"ast":2.0,"stl":0.8,"blk":3.5,"g":32,"off":77.7,"def":83.0},{"id":"nneka-ogwumike_2016_LAS","name":"Nneka Ogwumike","season":2016,"team":"Los Angeles Sparks","pos":"F","pts":19.7,"reb":9.1,"ast":3.1,"stl":1.3,"blk":1.2,"g":33,"off":99,"def":89.0},{"id":"lisa-leslie_2006_LAS","name":"Lisa Leslie","season":2006,"team":"Los Angeles Sparks","pos":"C","pts":20.0,"reb":9.5,"ast":3.2,"stl":1.5,"blk":1.7,"g":34,"off":96.2,"def":91.5},{"id":"lisa-leslie_2004_LAS","name":"Lisa Leslie","season":2004,"team":"Los Angeles Sparks","pos":"C","pts":17.6,"reb":9.9,"ast":2.6,"stl":1.5,"blk":2.9,"g":34,"off":92.9,"def":94.0},{"id":"candace-parker_2008_LAS","name":"Candace Parker","season":2008,"team":"Los Angeles Sparks","pos":"F-C","pts":18.5,"reb":9.5,"ast":3.4,"stl":1.3,"blk":2.3,"g":33,"off":97.9,"def":86.7},{"id":"candace-parker_2013_LAS","name":"Candace Parker","season":2013,"team":"Los Angeles Sparks","pos":"F-C","pts":17.9,"reb":8.7,"ast":3.8,"stl":1.3,"blk":1.8,"g":31,"off":96.1,"def":86.4},{"id":"lisa-leslie_2001_LAS","name":"Lisa Leslie","season":2001,"team":"Los Angeles Sparks","pos":"C","pts":19.5,"reb":9.6,"ast":2.4,"stl":1.1,"blk":2.3,"g":31,"off":95.2,"def":85.9},{"id":"candace-parker_2012_LAS","name":"Candace Parker","season":2012,"team":"Los Angeles Sparks","pos":"F-C","pts":17.4,"reb":9.7,"ast":3.3,"stl":1.5,"blk":2.3,"g":33,"off":89.6,"def":91.1},{"id":"lisa-leslie_1998_LAS","name":"Lisa Leslie","season":1998,"team":"Los Angeles Sparks","pos":"C","pts":19.6,"reb":10.2,"ast":2.5,"stl":1.5,"blk":2.1,"g":28,"off":92.1,"def":87.8},{"id":"nneka-ogwumike_2017_LAS","name":"Nneka Ogwumike","season":2017,"team":"Los Angeles Sparks","pos":"F","pts":18.8,"reb":7.7,"ast":2.1,"stl":1.9,"blk":0.5,"g":34,"off":92.0,"def":87.0},{"id":"candace-parker_2015_LAS","name":"Candace Parker","season":2015,"team":"Los Angeles Sparks","pos":"F-C","pts":19.4,"reb":10.1,"ast":6.2,"stl":1.9,"blk":1.8,"g":16,"off":91.5,"def":86.2},{"id":"candace-parker_2017_LAS","name":"Candace Parker","season":2017,"team":"Los Angeles Sparks","pos":"F-C","pts":16.9,"reb":8.4,"ast":4.3,"stl":1.5,"blk":1.7,"g":33,"off":89.7,"def":87.9},{"id":"candace-parker_2020_LAS","name":"Candace Parker","season":2020,"team":"Los Angeles Sparks","pos":"F-C","pts":14.7,"reb":9.7,"ast":4.6,"stl":1.2,"blk":1.2,"g":22,"off":86.4,"def":89.8},{"id":"lisa-leslie_2002_LAS","name":"Lisa Leslie","season":2002,"team":"Los Angeles Sparks","pos":"C","pts":16.9,"reb":10.4,"ast":2.7,"stl":1.5,"blk":2.9,"g":31,"off":87.1,"def":89.0},{"id":"nneka-ogwumike_2023_LAS","name":"Nneka Ogwumike","season":2023,"team":"Los Angeles Sparks","pos":"F","pts":19.1,"reb":8.8,"ast":2.7,"stl":1.7,"blk":0.7,"g":36,"off":88.8,"def":86.9},{"id":"lisa-leslie_2008_LAS","name":"Lisa Leslie","season":2008,"team":"Los Angeles Sparks","pos":"C","pts":15.1,"reb":8.9,"ast":2.4,"stl":1.5,"blk":2.9,"g":33,"off":81.6,"def":94.1},{"id":"nneka-ogwumike_2019_LAS","name":"Nneka Ogwumike","season":2019,"team":"Los Angeles Sparks","pos":"F","pts":16.1,"reb":8.8,"ast":1.8,"stl":1.9,"blk":0.5,"g":32,"off":88.2,"def":87.1},{"id":"candace-parker_2014_LAS","name":"Candace Parker","season":2014,"team":"Los Angeles Sparks","pos":"F-C","pts":19.4,"reb":7.1,"ast":4.3,"stl":1.8,"blk":1.4,"g":30,"off":91.7,"def":83.5},{"id":"lisa-leslie_2000_LAS","name":"Lisa Leslie","season":2000,"team":"Los Angeles Sparks","pos":"C","pts":17.8,"reb":9.6,"ast":1.9,"stl":1.0,"blk":2.3,"g":32,"off":87.8,"def":86.6},{"id":"candace-parker_2018_LAS","name":"Candace Parker","season":2018,"team":"Los Angeles Sparks","pos":"F-C","pts":17.9,"reb":8.2,"ast":4.7,"stl":1.2,"blk":1.1,"g":31,"off":88.6,"def":85.0},{"id":"nneka-ogwumike_2013_LAS","name":"Nneka Ogwumike","season":2013,"team":"Los Angeles Sparks","pos":"F","pts":14.6,"reb":7.6,"ast":1.3,"stl":1.5,"blk":1.0,"g":34,"off":88.8,"def":82.8},{"id":"lisa-leslie_1997_LAS","name":"Lisa Leslie","season":1997,"team":"Los Angeles Sparks","pos":"C","pts":15.9,"reb":9.5,"ast":2.6,"stl":1.4,"blk":2.1,"g":28,"off":82.9,"def":87.3},{"id":"candace-parker_2009_LAS","name":"Candace Parker","season":2009,"team":"Los Angeles Sparks","pos":"F-C","pts":13.1,"reb":9.8,"ast":2.6,"stl":0.6,"blk":2.1,"g":25,"off":84.0,"def":86.0},{"id":"lisa-leslie_1999_LAS","name":"Lisa Leslie","season":1999,"team":"Los Angeles Sparks","pos":"C","pts":15.6,"reb":7.8,"ast":1.8,"stl":1.1,"blk":1.5,"g":32,"off":86.3,"def":83.5},{"id":"nneka-ogwumike_2014_LAS","name":"Nneka Ogwumike","season":2014,"team":"Los Angeles Sparks","pos":"F","pts":15.8,"reb":7.1,"ast":1.5,"stl":1.8,"blk":0.5,"g":33,"off":87.5,"def":81.4},{"id":"lisa-leslie_2005_LAS","name":"Lisa Leslie","season":2005,"team":"Los Angeles Sparks","pos":"C","pts":15.2,"reb":7.3,"ast":2.6,"stl":2.0,"blk":2.1,"g":34,"off":80.2,"def":88.5},{"id":"alyssa-thomas_2025_PHO","name":"Alyssa Thomas","season":2025,"team":"Phoenix Mercury","pos":"F","pts":15.4,"reb":8.8,"ast":9.2,"stl":1.6,"blk":0.4,"g":39,"off":93.2,"def":87.2},{"id":"brittney-griner_2014_PHO","name":"Brittney Griner","season":2014,"team":"Phoenix Mercury","pos":"C","pts":15.6,"reb":8.0,"ast":1.6,"stl":0.6,"blk":3.8,"g":34,"off":91.4,"def":85.0},{"id":"brittney-griner_2021_PHO","name":"Brittney Griner","season":2021,"team":"Phoenix Mercury","pos":"C","pts":20.5,"reb":9.5,"ast":2.7,"stl":0.4,"blk":1.9,"g":30,"off":95.6,"def":80.3},{"id":"brittney-griner_2015_PHO","name":"Brittney Griner","season":2015,"team":"Phoenix Mercury","pos":"C","pts":15.1,"reb":8.1,"ast":1.3,"stl":0.3,"blk":4.0,"g":26,"off":89.5,"def":84.4},{"id":"brittney-griner_2017_PHO","name":"Brittney Griner","season":2017,"team":"Phoenix Mercury","pos":"C","pts":21.9,"reb":7.6,"ast":1.9,"stl":0.7,"blk":2.5,"g":26,"off":92.6,"def":80.6},{"id":"brandy-reed_2000_PHO","name":"Brandy Reed","season":2000,"team":"Phoenix Mercury","pos":"F","pts":19.0,"reb":5.9,"ast":2.7,"stl":2.1,"blk":0.7,"g":32,"off":93.1,"def":79.6},{"id":"diana-taurasi_2009_PHO","name":"Diana Taurasi","season":2009,"team":"Phoenix Mercury","pos":"G","pts":20.4,"reb":5.7,"ast":3.5,"stl":1.2,"blk":1.4,"g":31,"off":99,"def":73.0},{"id":"brittney-griner_2019_PHO","name":"Brittney Griner","season":2019,"team":"Phoenix Mercury","pos":"C","pts":20.7,"reb":7.2,"ast":2.4,"stl":0.7,"blk":2.0,"g":31,"off":92.8,"def":76.4},{"id":"brittney-griner_2018_PHO","name":"Brittney Griner","season":2018,"team":"Phoenix Mercury","pos":"C","pts":20.5,"reb":7.7,"ast":2.1,"stl":0.5,"blk":2.6,"g":34,"off":87.4,"def":81.8},{"id":"jennifer-gillom_1998_PHO","name":"Jennifer Gillom","season":1998,"team":"Phoenix Mercury","pos":"F-C","pts":20.9,"reb":7.3,"ast":1.4,"stl":1.7,"blk":0.3,"g":30,"off":89.8,"def":79.3},{"id":"penny-taylor_2011_PHO","name":"Penny Taylor","season":2011,"team":"Phoenix Mercury","pos":"F","pts":16.7,"reb":4.9,"ast":4.7,"stl":1.7,"blk":0.4,"g":29,"off":95.9,"def":72.3},{"id":"diana-taurasi_2008_PHO","name":"Diana Taurasi","season":2008,"team":"Phoenix Mercury","pos":"G","pts":24.1,"reb":5.1,"ast":3.6,"stl":1.4,"blk":1.4,"g":34,"off":96.8,"def":71.3},{"id":"penny-taylor_2007_PHO","name":"Penny Taylor","season":2007,"team":"Phoenix Mercury","pos":"F","pts":17.8,"reb":6.3,"ast":2.9,"stl":1.5,"blk":0.6,"g":34,"off":94.7,"def":73.3},{"id":"penny-taylor_2016_PHO","name":"Penny Taylor","season":2016,"team":"Phoenix Mercury","pos":"F","pts":12.5,"reb":3.8,"ast":3.6,"stl":1.5,"blk":0.4,"g":25,"off":90.5,"def":76.3},{"id":"dewanna-bonner_2015_PHO","name":"DeWanna Bonner","season":2015,"team":"Phoenix Mercury","pos":"G-F","pts":15.8,"reb":5.7,"ast":3.3,"stl":1.3,"blk":0.8,"g":33,"off":87.6,"def":78.6},{"id":"diana-taurasi_2006_PHO","name":"Diana Taurasi","season":2006,"team":"Phoenix Mercury","pos":"G","pts":25.3,"reb":3.6,"ast":4.1,"stl":1.2,"blk":0.8,"g":34,"off":97.1,"def":68.7},{"id":"maria-stepanova_2001_PHO","name":"Maria Stepanova","season":2001,"team":"Phoenix Mercury","pos":"C","pts":10.4,"reb":6.3,"ast":1.3,"stl":1.3,"blk":2.0,"g":32,"off":81.1,"def":84.0},{"id":"penny-taylor_2004_PHO","name":"Penny Taylor","season":2004,"team":"Phoenix Mercury","pos":"F","pts":13.2,"reb":4.8,"ast":2.5,"stl":1.6,"blk":0.4,"g":33,"off":89.1,"def":75.2},{"id":"candice-dupree_2010_PHO","name":"Candice Dupree","season":2010,"team":"Phoenix Mercury","pos":"F","pts":15.7,"reb":7.6,"ast":1.3,"stl":1.0,"blk":0.8,"g":34,"off":90.1,"def":73.9},{"id":"diana-taurasi_2007_PHO","name":"Diana Taurasi","season":2007,"team":"Phoenix Mercury","pos":"G","pts":19.2,"reb":4.2,"ast":4.3,"stl":1.4,"blk":1.1,"g":32,"off":93.6,"def":70.3},{"id":"diana-taurasi_2018_PHO","name":"Diana Taurasi","season":2018,"team":"Phoenix Mercury","pos":"G","pts":20.7,"reb":3.5,"ast":5.3,"stl":0.9,"blk":0.2,"g":33,"off":96.0,"def":67.4},{"id":"brittney-griner_2024_PHO","name":"Brittney Griner","season":2024,"team":"Phoenix Mercury","pos":"C","pts":17.8,"reb":6.6,"ast":2.3,"stl":0.5,"blk":1.5,"g":30,"off":90.6,"def":72.4},{"id":"brittney-griner_2016_PHO","name":"Brittney Griner","season":2016,"team":"Phoenix Mercury","pos":"C","pts":14.5,"reb":6.5,"ast":1.0,"stl":0.4,"blk":3.1,"g":34,"off":84.4,"def":78.6},{"id":"penny-taylor_2014_PHO","name":"Penny Taylor","season":2014,"team":"Phoenix Mercury","pos":"F","pts":10.5,"reb":3.1,"ast":3.1,"stl":1.2,"blk":0.5,"g":33,"off":86.7,"def":76.2},{"id":"natasha-mack_2026_PHO","name":"Natasha Mack","season":2026,"team":"Phoenix Mercury","pos":"F-C","pts":10.3,"reb":8.2,"ast":1.4,"stl":0.9,"blk":1.5,"g":12,"off":87.1,"def":75.7},{"id":"lauren-jackson_2007_SEA","name":"Lauren Jackson","season":2007,"team":"Seattle Storm","pos":"F-C","pts":23.8,"reb":9.7,"ast":1.3,"stl":1.0,"blk":2.0,"g":31,"off":98.4,"def":88.6},{"id":"breanna-stewart_2018_SEA","name":"Breanna Stewart","season":2018,"team":"Seattle Storm","pos":"F","pts":21.8,"reb":8.4,"ast":2.5,"stl":1.4,"blk":1.4,"g":34,"off":96.6,"def":88.0},{"id":"breanna-stewart_2022_SEA","name":"Breanna Stewart","season":2022,"team":"Seattle Storm","pos":"F","pts":21.8,"reb":7.6,"ast":2.9,"stl":1.6,"blk":0.9,"g":34,"off":94.3,"def":87.0},{"id":"lauren-jackson_2003_SEA","name":"Lauren Jackson","season":2003,"team":"Seattle Storm","pos":"F-C","pts":21.2,"reb":9.3,"ast":1.9,"stl":1.2,"blk":1.9,"g":33,"off":97.2,"def":83.9},{"id":"natasha-howard_2019_SEA","name":"Natasha Howard","season":2019,"team":"Seattle Storm","pos":"F","pts":18.1,"reb":8.2,"ast":2.1,"stl":2.2,"blk":1.7,"g":34,"off":85.3,"def":93.3},{"id":"lauren-jackson_2009_SEA","name":"Lauren Jackson","season":2009,"team":"Seattle Storm","pos":"F-C","pts":19.2,"reb":7.0,"ast":0.8,"stl":1.5,"blk":1.7,"g":26,"off":92.0,"def":86.2},{"id":"lauren-jackson_2010_SEA","name":"Lauren Jackson","season":2010,"team":"Seattle Storm","pos":"F-C","pts":20.5,"reb":8.2,"ast":1.2,"stl":0.9,"blk":1.2,"g":32,"off":94.6,"def":82.3},{"id":"lauren-jackson_2006_SEA","name":"Lauren Jackson","season":2006,"team":"Seattle Storm","pos":"F-C","pts":19.4,"reb":7.6,"ast":1.6,"stl":0.8,"blk":1.7,"g":30,"off":96.3,"def":80.3},{"id":"lauren-jackson_2005_SEA","name":"Lauren Jackson","season":2005,"team":"Seattle Storm","pos":"F-C","pts":17.6,"reb":9.2,"ast":1.7,"stl":1.1,"blk":2.0,"g":34,"off":91.8,"def":84.4},{"id":"breanna-stewart_2016_SEA","name":"Breanna Stewart","season":2016,"team":"Seattle Storm","pos":"F","pts":18.3,"reb":9.3,"ast":3.4,"stl":1.2,"blk":1.9,"g":34,"off":88.0,"def":87.2},{"id":"breanna-stewart_2021_SEA","name":"Breanna Stewart","season":2021,"team":"Seattle Storm","pos":"F","pts":20.3,"reb":9.6,"ast":2.7,"stl":1.2,"blk":1.7,"g":28,"off":89.4,"def":85.1},{"id":"lauren-jackson_2004_SEA","name":"Lauren Jackson","season":2004,"team":"Seattle Storm","pos":"F-C","pts":20.5,"reb":6.7,"ast":1.6,"stl":1.0,"blk":2.0,"g":31,"off":95.0,"def":78.6},{"id":"breanna-stewart_2020_SEA","name":"Breanna Stewart","season":2020,"team":"Seattle Storm","pos":"F","pts":19.7,"reb":8.2,"ast":3.6,"stl":1.6,"blk":1.3,"g":20,"off":89.2,"def":83.6},{"id":"breanna-stewart_2017_SEA","name":"Breanna Stewart","season":2017,"team":"Seattle Storm","pos":"F","pts":19.9,"reb":8.7,"ast":2.7,"stl":1.2,"blk":1.6,"g":33,"off":87.8,"def":83.0},{"id":"natasha-howard_2018_SEA","name":"Natasha Howard","season":2018,"team":"Seattle Storm","pos":"F","pts":13.2,"reb":6.4,"ast":1.0,"stl":1.3,"blk":2.0,"g":34,"off":83.2,"def":87.5},{"id":"nneka-ogwumike_2024_SEA","name":"Nneka Ogwumike","season":2024,"team":"Seattle Storm","pos":"F","pts":16.7,"reb":7.6,"ast":2.3,"stl":1.9,"blk":0.5,"g":37,"off":88.4,"def":81.7},{"id":"lauren-jackson_2008_SEA","name":"Lauren Jackson","season":2008,"team":"Seattle Storm","pos":"F-C","pts":20.2,"reb":7.0,"ast":1.2,"stl":1.5,"blk":1.6,"g":21,"off":86.7,"def":80.2},{"id":"ezi-magbegor_2024_SEA","name":"Ezi Magbegor","season":2024,"team":"Seattle Storm","pos":"F-C","pts":11.7,"reb":8.0,"ast":2.0,"stl":1.1,"blk":2.2,"g":37,"off":81.6,"def":84.0},{"id":"lauren-jackson_2002_SEA","name":"Lauren Jackson","season":2002,"team":"Seattle Storm","pos":"F-C","pts":17.2,"reb":6.8,"ast":1.5,"stl":1.1,"blk":2.9,"g":28,"off":82.2,"def":81.9},{"id":"sue-bird_2004_SEA","name":"Sue Bird","season":2004,"team":"Seattle Storm","pos":"G","pts":12.9,"reb":3.1,"ast":5.4,"stl":1.5,"blk":0.1,"g":34,"off":95.4,"def":68.0},{"id":"lauren-jackson_2001_SEA","name":"Lauren Jackson","season":2001,"team":"Seattle Storm","pos":"F-C","pts":15.2,"reb":6.7,"ast":1.5,"stl":1.9,"blk":2.2,"g":29,"off":79.3,"def":84.1},{"id":"nneka-ogwumike_2025_SEA","name":"Nneka Ogwumike","season":2025,"team":"Seattle Storm","pos":"F","pts":18.3,"reb":7.0,"ast":2.2,"stl":1.1,"blk":0.4,"g":44,"off":86.7,"def":74.9},{"id":"camille-smith_2010_SEA","name":"Camille Smith","season":2010,"team":"Seattle Storm","pos":"F","pts":10.1,"reb":5.2,"ast":1.4,"stl":1.6,"blk":0.6,"g":34,"off":80.4,"def":80.9},{"id":"sue-bird_2002_SEA","name":"Sue Bird","season":2002,"team":"Seattle Storm","pos":"G","pts":14.4,"reb":2.6,"ast":6.0,"stl":1.7,"blk":0.1,"g":32,"off":91.5,"def":69.4},{"id":"sue-bird_2011_SEA","name":"Sue Bird","season":2011,"team":"Seattle Storm","pos":"G","pts":14.7,"reb":2.9,"ast":4.9,"stl":1.4,"blk":0.2,"g":34,"off":91.0,"def":69.6},{"id":"sylvia-fowles_2017_MIN","name":"Sylvia Fowles","season":2017,"team":"Minnesota Lynx","pos":"C","pts":18.9,"reb":10.4,"ast":1.5,"stl":1.3,"blk":2.0,"g":34,"off":96.4,"def":92.3},{"id":"sylvia-fowles_2021_MIN","name":"Sylvia Fowles","season":2021,"team":"Minnesota Lynx","pos":"C","pts":16.0,"reb":10.1,"ast":1.4,"stl":1.8,"blk":1.8,"g":31,"off":89.5,"def":96.6},{"id":"napheesa-collier_2024_MIN","name":"Napheesa Collier","season":2024,"team":"Minnesota Lynx","pos":"F","pts":20.4,"reb":9.7,"ast":3.4,"stl":1.9,"blk":1.4,"g":34,"off":90.6,"def":94.4},{"id":"napheesa-collier_2025_MIN","name":"Napheesa Collier","season":2025,"team":"Minnesota Lynx","pos":"F","pts":22.9,"reb":7.3,"ast":3.2,"stl":1.6,"blk":1.5,"g":33,"off":96.6,"def":85.9},{"id":"maya-moore_2014_MIN","name":"Maya Moore","season":2014,"team":"Minnesota Lynx","pos":"F","pts":23.9,"reb":8.1,"ast":3.4,"stl":1.9,"blk":0.8,"g":34,"off":98.4,"def":81.9},{"id":"sylvia-fowles_2016_MIN","name":"Sylvia Fowles","season":2016,"team":"Minnesota Lynx","pos":"C","pts":13.9,"reb":8.5,"ast":1.2,"stl":1.3,"blk":1.8,"g":34,"off":87.1,"def":92.1},{"id":"sylvia-fowles_2018_MIN","name":"Sylvia Fowles","season":2018,"team":"Minnesota Lynx","pos":"C","pts":17.7,"reb":11.9,"ast":2.2,"stl":1.4,"blk":1.2,"g":34,"off":88.9,"def":90.2},{"id":"maya-moore_2013_MIN","name":"Maya Moore","season":2013,"team":"Minnesota Lynx","pos":"F","pts":18.5,"reb":6.2,"ast":3.0,"stl":1.7,"blk":1.0,"g":34,"off":95.9,"def":80.7},{"id":"nicky-anosike_2009_MIN","name":"Nicky Anosike","season":2009,"team":"Minnesota Lynx","pos":"F-C","pts":13.2,"reb":7.4,"ast":2.7,"stl":2.7,"blk":0.9,"g":30,"off":87.3,"def":88.0},{"id":"maya-moore_2016_MIN","name":"Maya Moore","season":2016,"team":"Minnesota Lynx","pos":"F","pts":19.3,"reb":5.1,"ast":4.2,"stl":1.6,"blk":0.7,"g":34,"off":94.3,"def":79.5},{"id":"sylvia-fowles_2022_MIN","name":"Sylvia Fowles","season":2022,"team":"Minnesota Lynx","pos":"C","pts":14.4,"reb":9.8,"ast":1.2,"stl":1.0,"blk":1.2,"g":30,"off":86.2,"def":87.6},{"id":"maya-moore_2015_MIN","name":"Maya Moore","season":2015,"team":"Minnesota Lynx","pos":"F","pts":20.6,"reb":6.7,"ast":3.5,"stl":1.7,"blk":0.8,"g":33,"off":92.7,"def":79.9},{"id":"courtney-williams_2026_MIN","name":"Courtney Williams","season":2026,"team":"Minnesota Lynx","pos":"G","pts":17.7,"reb":5.4,"ast":4.0,"stl":1.3,"blk":0.5,"g":10,"off":91.6,"def":80.9},{"id":"napheesa-collier_2020_MIN","name":"Napheesa Collier","season":2020,"team":"Minnesota Lynx","pos":"F","pts":16.1,"reb":9.0,"ast":3.3,"stl":1.8,"blk":1.3,"g":22,"off":86.8,"def":85.7},{"id":"napheesa-collier_2023_MIN","name":"Napheesa Collier","season":2023,"team":"Minnesota Lynx","pos":"F","pts":21.5,"reb":8.5,"ast":2.5,"stl":1.6,"blk":1.2,"g":37,"off":87.4,"def":84.8},{"id":"maya-moore_2017_MIN","name":"Maya Moore","season":2017,"team":"Minnesota Lynx","pos":"F","pts":17.3,"reb":5.0,"ast":3.5,"stl":1.9,"blk":0.4,"g":34,"off":91.5,"def":79.7},{"id":"maya-moore_2012_MIN","name":"Maya Moore","season":2012,"team":"Minnesota Lynx","pos":"F","pts":16.4,"reb":6.0,"ast":3.6,"stl":1.5,"blk":0.6,"g":34,"off":92.8,"def":77.7},{"id":"sylvia-fowles_2019_MIN","name":"Sylvia Fowles","season":2019,"team":"Minnesota Lynx","pos":"C","pts":13.6,"reb":8.9,"ast":1.5,"stl":0.9,"blk":1.4,"g":34,"off":85.8,"def":84.6},{"id":"rebekkah-brunson_2013_MIN","name":"Rebekkah Brunson","season":2013,"team":"Minnesota Lynx","pos":"F","pts":10.6,"reb":8.9,"ast":1.5,"stl":1.3,"blk":0.9,"g":33,"off":81.0,"def":84.6},{"id":"napheesa-collier_2019_MIN","name":"Napheesa Collier","season":2019,"team":"Minnesota Lynx","pos":"F","pts":13.1,"reb":6.6,"ast":2.6,"stl":1.9,"blk":0.9,"g":34,"off":84.1,"def":81.1},{"id":"rebekkah-brunson_2012_MIN","name":"Rebekkah Brunson","season":2012,"team":"Minnesota Lynx","pos":"F","pts":11.4,"reb":8.9,"ast":1.2,"stl":1.2,"blk":0.9,"g":31,"off":81.4,"def":83.6},{"id":"rebekkah-brunson_2011_MIN","name":"Rebekkah Brunson","season":2011,"team":"Minnesota Lynx","pos":"F","pts":10.2,"reb":8.9,"ast":1.2,"stl":0.8,"blk":0.5,"g":34,"off":79.8,"def":84.4},{"id":"betty-lennox_2000_MIN","name":"Betty Lennox","season":2000,"team":"Minnesota Lynx","pos":"G","pts":16.9,"reb":5.6,"ast":2.6,"stl":1.7,"blk":0.3,"g":32,"off":85.8,"def":77.7},{"id":"lindsay-whalen_2011_MIN","name":"Lindsay Whalen","season":2011,"team":"Minnesota Lynx","pos":"G","pts":13.6,"reb":3.5,"ast":5.9,"stl":1.1,"blk":0.1,"g":34,"off":94.6,"def":68.0},{"id":"nicky-anosike_2008_MIN","name":"Nicky Anosike","season":2008,"team":"Minnesota Lynx","pos":"F-C","pts":9.2,"reb":6.8,"ast":1.3,"stl":2.2,"blk":1.3,"g":34,"off":78.3,"def":84.2},{"id":"sylvia-fowles_2010_CHI","name":"Sylvia Fowles","season":2010,"team":"Chicago Sky","pos":"C","pts":17.8,"reb":9.9,"ast":1.5,"stl":1.1,"blk":2.6,"g":34,"off":92.7,"def":90.4},{"id":"sylvia-fowles_2011_CHI","name":"Sylvia Fowles","season":2011,"team":"Chicago Sky","pos":"C","pts":20.0,"reb":10.2,"ast":0.6,"stl":1.2,"blk":2.0,"g":34,"off":90.2,"def":91.7},{"id":"sylvia-fowles_2013_CHI","name":"Sylvia Fowles","season":2013,"team":"Chicago Sky","pos":"C","pts":16.3,"reb":11.5,"ast":0.4,"stl":0.9,"blk":2.4,"g":32,"off":89.8,"def":90.7},{"id":"sylvia-fowles_2012_CHI","name":"Sylvia Fowles","season":2012,"team":"Chicago Sky","pos":"C","pts":16.2,"reb":10.4,"ast":0.8,"stl":1.3,"blk":1.2,"g":25,"off":89.5,"def":89.5},{"id":"elena-delle-donne_2015_CHI","name":"Elena Delle Donne","season":2015,"team":"Chicago Sky","pos":"G-F","pts":23.4,"reb":8.4,"ast":1.4,"stl":1.1,"blk":2.0,"g":31,"off":96.3,"def":81.6},{"id":"candace-parker_2022_CHI","name":"Candace Parker","season":2022,"team":"Chicago Sky","pos":"F-C","pts":13.2,"reb":8.6,"ast":4.5,"stl":1.0,"blk":1.0,"g":32,"off":84.3,"def":83.7},{"id":"sylvia-fowles_2014_CHI","name":"Sylvia Fowles","season":2014,"team":"Chicago Sky","pos":"C","pts":13.4,"reb":10.2,"ast":0.6,"stl":1.4,"blk":2.0,"g":20,"off":78.9,"def":88.8},{"id":"kamilla-cardoso_2026_CHI","name":"Kamilla Cardoso","season":2026,"team":"Chicago Sky","pos":"C","pts":12.5,"reb":9.8,"ast":2.4,"stl":0.3,"blk":1.8,"g":10,"off":89.4,"def":78.1},{"id":"emma-meesseman_2022_CHI","name":"Emma Meesseman","season":2022,"team":"Chicago Sky","pos":"F","pts":12.4,"reb":5.6,"ast":3.8,"stl":1.4,"blk":0.8,"g":36,"off":88.5,"def":78.3},{"id":"epiphanny-prince_2012_CHI","name":"Epiphanny Prince","season":2012,"team":"Chicago Sky","pos":"G","pts":18.1,"reb":3.5,"ast":3.1,"stl":1.8,"blk":0.3,"g":26,"off":92.1,"def":73.1},{"id":"elena-delle-donne_2013_CHI","name":"Elena Delle Donne","season":2013,"team":"Chicago Sky","pos":"G-F","pts":18.1,"reb":5.6,"ast":1.8,"stl":0.7,"blk":1.8,"g":30,"off":90.5,"def":74.6},{"id":"elena-delle-donne_2016_CHI","name":"Elena Delle Donne","season":2016,"team":"Chicago Sky","pos":"G-F","pts":21.5,"reb":7.0,"ast":1.9,"stl":0.6,"blk":1.5,"g":28,"off":93.4,"def":71.2},{"id":"angel-reese_2025_CHI","name":"Angel Reese","season":2025,"team":"Chicago Sky","pos":"F","pts":14.7,"reb":12.6,"ast":3.7,"stl":1.5,"blk":0.7,"g":30,"off":78.6,"def":82.5},{"id":"courtney-vandersloot_2015_CHI","name":"Courtney Vandersloot","season":2015,"team":"Chicago Sky","pos":"G","pts":11.4,"reb":3.4,"ast":5.8,"stl":1.3,"blk":0.5,"g":34,"off":90.4,"def":70.6},{"id":"candice-dupree_2008_CHI","name":"Candice Dupree","season":2008,"team":"Chicago Sky","pos":"F","pts":16.3,"reb":7.9,"ast":2.3,"stl":1.0,"blk":1.3,"g":34,"off":81.1,"def":79.5},{"id":"candace-parker_2021_CHI","name":"Candace Parker","season":2021,"team":"Chicago Sky","pos":"F-C","pts":13.3,"reb":8.4,"ast":4.0,"stl":0.8,"blk":1.2,"g":23,"off":81.8,"def":78.7},{"id":"cheyenne-parker-tyus_2020_CHI","name":"Cheyenne Parker-Tyus","season":2020,"team":"Chicago Sky","pos":"F","pts":13.4,"reb":6.4,"ast":1.5,"stl":1.3,"blk":0.9,"g":20,"off":82.3,"def":78.1},{"id":"courtney-vandersloot_2019_CHI","name":"Courtney Vandersloot","season":2019,"team":"Chicago Sky","pos":"G","pts":11.2,"reb":4.3,"ast":9.1,"stl":1.4,"blk":0.5,"g":33,"off":89.0,"def":71.1},{"id":"courtney-vandersloot_2022_CHI","name":"Courtney Vandersloot","season":2022,"team":"Chicago Sky","pos":"G","pts":11.8,"reb":3.9,"ast":6.5,"stl":1.2,"blk":0.5,"g":32,"off":85.9,"def":73.8},{"id":"alanna-smith_2023_CHI","name":"Alanna Smith","season":2023,"team":"Chicago Sky","pos":"F","pts":9.2,"reb":6.6,"ast":1.8,"stl":1.3,"blk":1.3,"g":38,"off":77.3,"def":82.4},{"id":"jia-perkins_2007_CHI","name":"Jia Perkins","season":2007,"team":"Chicago Sky","pos":"G","pts":11.7,"reb":3.3,"ast":2.3,"stl":1.5,"blk":0.2,"g":33,"off":87.0,"def":72.4},{"id":"jia-perkins_2008_CHI","name":"Jia Perkins","season":2008,"team":"Chicago Sky","pos":"G","pts":17.0,"reb":4.1,"ast":2.8,"stl":1.9,"blk":0.3,"g":34,"off":88.1,"def":71.1},{"id":"epiphanny-prince_2013_CHI","name":"Epiphanny Prince","season":2013,"team":"Chicago Sky","pos":"G","pts":15.0,"reb":2.7,"ast":3.0,"stl":1.6,"blk":0.4,"g":31,"off":86.5,"def":72.4},{"id":"courtney-vandersloot_2020_CHI","name":"Courtney Vandersloot","season":2020,"team":"Chicago Sky","pos":"G","pts":13.6,"reb":3.5,"ast":10.0,"stl":1.2,"blk":0.4,"g":22,"off":92.7,"def":66.2},{"id":"courtney-vandersloot_2018_CHI","name":"Courtney Vandersloot","season":2018,"team":"Chicago Sky","pos":"G","pts":12.5,"reb":3.7,"ast":8.6,"stl":1.3,"blk":0.6,"g":30,"off":88.4,"def":69.7},{"id":"elena-delle-donne_2019_WAS","name":"Elena Delle Donne","season":2019,"team":"Washington Mystics","pos":"G-F","pts":19.5,"reb":8.2,"ast":2.2,"stl":0.6,"blk":1.3,"g":31,"off":98.9,"def":79.6},{"id":"elena-delle-donne_2018_WAS","name":"Elena Delle Donne","season":2018,"team":"Washington Mystics","pos":"G-F","pts":20.7,"reb":7.2,"ast":2.3,"stl":0.9,"blk":1.4,"g":29,"off":93.2,"def":78.1},{"id":"latoya-sanders_2018_WAS","name":"LaToya Sanders","season":2018,"team":"Washington Mystics","pos":"F-C","pts":10.2,"reb":6.4,"ast":1.6,"stl":1.2,"blk":1.1,"g":28,"off":87.1,"def":83.3},{"id":"chamique-holdsclaw_2002_WAS","name":"Chamique Holdsclaw","season":2002,"team":"Washington Mystics","pos":"F","pts":19.9,"reb":11.6,"ast":2.2,"stl":1.0,"blk":0.3,"g":20,"off":89.5,"def":79.9},{"id":"alana-beard_2006_WAS","name":"Alana Beard","season":2006,"team":"Washington Mystics","pos":"G-F","pts":19.2,"reb":4.7,"ast":3.1,"stl":1.8,"blk":0.8,"g":32,"off":92.1,"def":77.3},{"id":"chamique-holdsclaw_2003_WAS","name":"Chamique Holdsclaw","season":2003,"team":"Washington Mystics","pos":"F","pts":20.5,"reb":10.9,"ast":3.3,"stl":1.3,"blk":0.6,"g":27,"off":88.5,"def":79.7},{"id":"elena-delle-donne_2017_WAS","name":"Elena Delle Donne","season":2017,"team":"Washington Mystics","pos":"G-F","pts":19.7,"reb":6.8,"ast":1.6,"stl":0.8,"blk":1.4,"g":25,"off":91.9,"def":75.9},{"id":"emma-meesseman_2014_WAS","name":"Emma Meesseman","season":2014,"team":"Washington Mystics","pos":"F","pts":10.1,"reb":6.4,"ast":2.5,"stl":1.4,"blk":1.0,"g":34,"off":85.2,"def":82.0},{"id":"emma-meesseman_2015_WAS","name":"Emma Meesseman","season":2015,"team":"Washington Mystics","pos":"F","pts":11.6,"reb":6.3,"ast":1.7,"stl":0.9,"blk":1.3,"g":34,"off":87.9,"def":79.2},{"id":"elena-delle-donne_2022_WAS","name":"Elena Delle Donne","season":2022,"team":"Washington Mystics","pos":"G-F","pts":17.2,"reb":6.3,"ast":2.3,"stl":0.5,"blk":1.1,"g":25,"off":89.6,"def":76.0},{"id":"emma-meesseman_2016_WAS","name":"Emma Meesseman","season":2016,"team":"Washington Mystics","pos":"F","pts":15.2,"reb":5.6,"ast":2.3,"stl":1.2,"blk":0.7,"g":34,"off":89.0,"def":75.2},{"id":"emily-engstler_2024_WAS","name":"Emily Engstler","season":2024,"team":"Washington Mystics","pos":"F","pts":6.2,"reb":4.0,"ast":1.5,"stl":0.6,"blk":0.8,"g":32,"off":84.1,"def":79.7},{"id":"chamique-holdsclaw_2004_WAS","name":"Chamique Holdsclaw","season":2004,"team":"Washington Mystics","pos":"F","pts":19.0,"reb":8.3,"ast":2.4,"stl":1.7,"blk":0.8,"g":23,"off":81.7,"def":82.0},{"id":"monique-currie_2010_WAS","name":"Monique Currie","season":2010,"team":"Washington Mystics","pos":"F","pts":14.1,"reb":4.8,"ast":1.6,"stl":1.4,"blk":0.4,"g":34,"off":85.2,"def":78.4},{"id":"tina-charles_2021_WAS","name":"Tina Charles","season":2021,"team":"Washington Mystics","pos":"C","pts":23.4,"reb":9.6,"ast":2.1,"stl":0.9,"blk":0.9,"g":27,"off":86.2,"def":76.7},{"id":"crystal-langhorne_2010_WAS","name":"Crystal Langhorne","season":2010,"team":"Washington Mystics","pos":"F-C","pts":16.3,"reb":9.7,"ast":1.1,"stl":0.9,"blk":0.2,"g":34,"off":86.6,"def":76.3},{"id":"myisha-hines-allen_2020_WAS","name":"Myisha Hines-Allen","season":2020,"team":"Washington Mystics","pos":"F","pts":17.0,"reb":8.9,"ast":2.6,"stl":1.4,"blk":0.2,"g":22,"off":84.5,"def":78.2},{"id":"emma-meesseman_2019_WAS","name":"Emma Meesseman","season":2019,"team":"Washington Mystics","pos":"F","pts":13.1,"reb":4.2,"ast":3.2,"stl":0.9,"blk":0.7,"g":23,"off":91.4,"def":71.0},{"id":"chamique-holdsclaw_1999_WAS","name":"Chamique Holdsclaw","season":1999,"team":"Washington Mystics","pos":"F","pts":16.9,"reb":7.9,"ast":2.4,"stl":1.2,"blk":0.9,"g":31,"off":81.6,"def":80.3},{"id":"brittney-sykes_2023_WAS","name":"Brittney Sykes","season":2023,"team":"Washington Mystics","pos":"G","pts":15.9,"reb":5.0,"ast":3.8,"stl":2.1,"blk":0.3,"g":40,"off":81.3,"def":80.5},{"id":"alana-beard_2004_WAS","name":"Alana Beard","season":2004,"team":"Washington Mystics","pos":"G-F","pts":13.1,"reb":4.2,"ast":2.7,"stl":2.0,"blk":1.0,"g":34,"off":81.1,"def":80.0},{"id":"crystal-langhorne_2009_WAS","name":"Crystal Langhorne","season":2009,"team":"Washington Mystics","pos":"F-C","pts":12.0,"reb":7.9,"ast":0.9,"stl":1.0,"blk":0.4,"g":34,"off":82.2,"def":78.5},{"id":"chamique-holdsclaw_2001_WAS","name":"Chamique Holdsclaw","season":2001,"team":"Washington Mystics","pos":"F","pts":16.8,"reb":8.8,"ast":2.3,"stl":1.5,"blk":0.5,"g":29,"off":79.5,"def":80.6},{"id":"kiki-iriafen_2026_WAS","name":"Kiki Iriafen","season":2026,"team":"Washington Mystics","pos":"F","pts":15.0,"reb":10.5,"ast":1.5,"stl":0.6,"blk":0.4,"g":8,"off":81.7,"def":77.7},{"id":"vicky-bullett_2002_WAS","name":"Vicky Bullett","season":2002,"team":"Washington Mystics","pos":"F","pts":8.5,"reb":5.8,"ast":1.7,"stl":1.7,"blk":1.2,"g":32,"off":76.5,"def":82.6},{"id":"liz-cambage_2018_DAL","name":"Liz Cambage","season":2018,"team":"Dallas Wings","pos":"C","pts":23.0,"reb":9.7,"ast":2.3,"stl":0.5,"blk":1.7,"g":32,"off":94.1,"def":81.9},{"id":"cheryl-ford_2006_DET","name":"Cheryl Ford","season":2006,"team":"Dallas Wings","pos":"F","pts":13.8,"reb":11.3,"ast":1.4,"stl":1.2,"blk":0.8,"g":32,"off":86.9,"def":87.5},{"id":"cindy-brown_1998_DET","name":"Cindy Brown","season":1998,"team":"Dallas Wings","pos":"F","pts":11.8,"reb":10.0,"ast":1.8,"stl":1.7,"blk":0.7,"g":30,"off":84.3,"def":86.6},{"id":"satou-sabally_2023_DAL","name":"Satou Sabally","season":2023,"team":"Dallas Wings","pos":"F","pts":18.6,"reb":8.1,"ast":4.4,"stl":1.8,"blk":0.4,"g":38,"off":90.1,"def":77.3},{"id":"liz-cambage_2013_TUL","name":"Liz Cambage","season":2013,"team":"Dallas Wings","pos":"C","pts":16.3,"reb":8.3,"ast":1.1,"stl":0.5,"blk":2.4,"g":20,"off":87.1,"def":79.5},{"id":"swin-cash_2004_DET","name":"Swin Cash","season":2004,"team":"Dallas Wings","pos":"F","pts":16.4,"reb":6.5,"ast":4.2,"stl":1.4,"blk":0.9,"g":32,"off":92.1,"def":74.2},{"id":"deanna-nolan_2007_DET","name":"Deanna Nolan","season":2007,"team":"Dallas Wings","pos":"G-F","pts":16.3,"reb":4.4,"ast":3.9,"stl":1.4,"blk":0.4,"g":34,"off":90.3,"def":73.2},{"id":"skylar-diggins_2017_DAL","name":"Skylar Diggins","season":2017,"team":"Dallas Wings","pos":"G","pts":18.5,"reb":3.5,"ast":5.8,"stl":1.3,"blk":0.8,"g":34,"off":93.0,"def":68.9},{"id":"deanna-nolan_2005_DET","name":"Deanna Nolan","season":2005,"team":"Dallas Wings","pos":"G-F","pts":15.9,"reb":4.7,"ast":3.7,"stl":1.7,"blk":0.4,"g":33,"off":85.4,"def":76.2},{"id":"plenette-pierson_2008_DET","name":"Plenette Pierson","season":2008,"team":"Dallas Wings","pos":"F","pts":11.9,"reb":4.9,"ast":2.2,"stl":0.9,"blk":1.2,"g":28,"off":84.9,"def":76.2},{"id":"kara-braxton_2009_DET","name":"Kara Braxton","season":2009,"team":"Dallas Wings","pos":"F-C","pts":9.0,"reb":6.0,"ast":1.5,"stl":0.7,"blk":0.6,"g":28,"off":81.1,"def":80.0},{"id":"courtney-paris_2014_TUL","name":"Courtney Paris","season":2014,"team":"Dallas Wings","pos":"C","pts":9.2,"reb":10.2,"ast":1.1,"stl":0.8,"blk":1.1,"g":34,"off":81.1,"def":79.8},{"id":"swin-cash_2003_DET","name":"Swin Cash","season":2003,"team":"Dallas Wings","pos":"F","pts":16.6,"reb":5.8,"ast":3.6,"stl":1.3,"blk":0.7,"g":33,"off":86.8,"def":73.9},{"id":"cheryl-ford_2007_DET","name":"Cheryl Ford","season":2007,"team":"Dallas Wings","pos":"F","pts":13.0,"reb":11.2,"ast":1.5,"stl":1.9,"blk":0.7,"g":15,"off":76.8,"def":83.9},{"id":"cheryl-ford_2003_DET","name":"Cheryl Ford","season":2003,"team":"Dallas Wings","pos":"F","pts":10.8,"reb":10.4,"ast":0.8,"stl":1.0,"blk":1.0,"g":32,"off":76.5,"def":84.0},{"id":"paige-bueckers_2025_DAL","name":"Paige Bueckers","season":2025,"team":"Dallas Wings","pos":"G","pts":19.2,"reb":3.9,"ast":5.4,"stl":1.6,"blk":0.5,"g":36,"off":90.8,"def":69.4},{"id":"deanna-nolan_2008_DET","name":"Deanna Nolan","season":2008,"team":"Dallas Wings","pos":"G-F","pts":15.8,"reb":3.9,"ast":4.4,"stl":1.2,"blk":0.3,"g":34,"off":90.3,"def":69.0},{"id":"maddy-siegrist_2026_DAL","name":"Maddy Siegrist","season":2026,"team":"Dallas Wings","pos":"F","pts":7.6,"reb":3.4,"ast":0.8,"stl":0.7,"blk":0.4,"g":10,"off":84.4,"def":74.9},{"id":"isabelle-harrison_2021_DAL","name":"Isabelle Harrison","season":2021,"team":"Dallas Wings","pos":"F","pts":10.9,"reb":5.9,"ast":1.1,"stl":1.1,"blk":0.7,"g":28,"off":80.5,"def":78.3},{"id":"riquna-williams_2015_TUL","name":"Riquna Williams","season":2015,"team":"Dallas Wings","pos":"G","pts":15.6,"reb":3.4,"ast":2.6,"stl":1.5,"blk":0.5,"g":29,"off":85.9,"def":72.8},{"id":"cheryl-ford_2004_DET","name":"Cheryl Ford","season":2004,"team":"Dallas Wings","pos":"F","pts":10.6,"reb":9.6,"ast":1.1,"stl":1.3,"blk":0.8,"g":31,"off":73.1,"def":85.4},{"id":"deanna-nolan_2003_DET","name":"Deanna Nolan","season":2003,"team":"Dallas Wings","pos":"G-F","pts":12.4,"reb":3.3,"ast":2.6,"stl":1.3,"blk":0.4,"g":32,"off":86.5,"def":71.5},{"id":"paige-bueckers_2026_DAL","name":"Paige Bueckers","season":2026,"team":"Dallas Wings","pos":"G","pts":18.3,"reb":3.6,"ast":6.2,"stl":0.5,"blk":0.3,"g":10,"off":96.3,"def":61.1},{"id":"teaira-mccowan_2023_DAL","name":"Teaira McCowan","season":2023,"team":"Dallas Wings","pos":"C","pts":11.9,"reb":9.1,"ast":1.5,"stl":0.5,"blk":1.2,"g":30,"off":80.1,"def":77.2},{"id":"glory-johnson_2013_TUL","name":"Glory Johnson","season":2013,"team":"Dallas Wings","pos":"F","pts":15.0,"reb":8.9,"ast":1.1,"stl":1.0,"blk":0.4,"g":29,"off":80.6,"def":76.5},{"id":"breanna-stewart_2023_NYL","name":"Breanna Stewart","season":2023,"team":"New York Liberty","pos":"F","pts":23.0,"reb":9.3,"ast":3.8,"stl":1.4,"blk":1.6,"g":40,"off":96.6,"def":90.1},{"id":"breanna-stewart_2024_NYL","name":"Breanna Stewart","season":2024,"team":"New York Liberty","pos":"F","pts":20.4,"reb":8.5,"ast":3.5,"stl":1.7,"blk":1.3,"g":38,"off":92.0,"def":88.1},{"id":"jonquel-jones_2024_NYL","name":"Jonquel Jones","season":2024,"team":"New York Liberty","pos":"C","pts":14.2,"reb":9.0,"ast":3.2,"stl":0.8,"blk":1.3,"g":39,"off":89.4,"def":82.2},{"id":"tina-charles_2016_NYL","name":"Tina Charles","season":2016,"team":"New York Liberty","pos":"C","pts":21.5,"reb":9.9,"ast":3.8,"stl":0.8,"blk":0.8,"g":32,"off":88.7,"def":81.3},{"id":"breanna-stewart_2025_NYL","name":"Breanna Stewart","season":2025,"team":"New York Liberty","pos":"F","pts":18.3,"reb":6.5,"ast":3.5,"stl":1.4,"blk":1.4,"g":31,"off":87.3,"def":81.8},{"id":"elena-baranova_2004_NYL","name":"Elena Baranova","season":2004,"team":"New York Liberty","pos":"F","pts":11.6,"reb":7.2,"ast":2.0,"stl":1.1,"blk":1.7,"g":34,"off":85.3,"def":83.2},{"id":"janel-mccarville_2008_NYL","name":"Janel McCarville","season":2008,"team":"New York Liberty","pos":"F-C","pts":13.7,"reb":5.4,"ast":2.1,"stl":1.5,"blk":0.8,"g":31,"off":88.9,"def":79.4},{"id":"tina-charles_2017_NYL","name":"Tina Charles","season":2017,"team":"New York Liberty","pos":"C","pts":19.7,"reb":9.4,"ast":2.6,"stl":0.8,"blk":0.7,"g":34,"off":85.8,"def":82.4},{"id":"tina-charles_2014_NYL","name":"Tina Charles","season":2014,"team":"New York Liberty","pos":"C","pts":17.4,"reb":9.4,"ast":2.2,"stl":1.3,"blk":0.9,"g":34,"off":83.2,"def":84.4},{"id":"janel-mccarville_2009_NYL","name":"Janel McCarville","season":2009,"team":"New York Liberty","pos":"F-C","pts":12.3,"reb":5.5,"ast":2.8,"stl":1.3,"blk":1.4,"g":32,"off":86.0,"def":80.9},{"id":"tina-charles_2015_NYL","name":"Tina Charles","season":2015,"team":"New York Liberty","pos":"C","pts":17.1,"reb":8.5,"ast":2.4,"stl":0.7,"blk":0.7,"g":34,"off":84.3,"def":81.9},{"id":"jonquel-jones_2026_NYL","name":"Jonquel Jones","season":2026,"team":"New York Liberty","pos":"C","pts":13.6,"reb":9.3,"ast":2.6,"stl":0.7,"blk":1.1,"g":10,"off":80.9,"def":84.9},{"id":"cappie-pondexter_2010_NYL","name":"Cappie Pondexter","season":2010,"team":"New York Liberty","pos":"G","pts":21.4,"reb":4.5,"ast":4.9,"stl":0.9,"blk":0.1,"g":34,"off":97.4,"def":68.3},{"id":"nyara-sabally_2024_NYL","name":"Nyara Sabally","season":2024,"team":"New York Liberty","pos":"F","pts":4.9,"reb":4.0,"ast":0.6,"stl":0.9,"blk":0.7,"g":26,"off":80.1,"def":84.5},{"id":"jonquel-jones_2025_NYL","name":"Jonquel Jones","season":2025,"team":"New York Liberty","pos":"C","pts":13.6,"reb":8.1,"ast":2.7,"stl":0.5,"blk":1.1,"g":31,"off":85.5,"def":78.9},{"id":"jonquel-jones_2023_NYL","name":"Jonquel Jones","season":2023,"team":"New York Liberty","pos":"C","pts":11.3,"reb":8.4,"ast":1.8,"stl":0.6,"blk":1.3,"g":40,"off":82.4,"def":81.2},{"id":"kym-hampton_1997_NYL","name":"Kym Hampton","season":1997,"team":"New York Liberty","pos":"C","pts":9.8,"reb":5.8,"ast":1.4,"stl":1.4,"blk":0.7,"g":28,"off":81.1,"def":82.3},{"id":"epiphanny-prince_2015_NYL","name":"Epiphanny Prince","season":2015,"team":"New York Liberty","pos":"G","pts":15.0,"reb":2.9,"ast":3.4,"stl":2.0,"blk":0.2,"g":24,"off":90.6,"def":72.4},{"id":"sabrina-ionescu_2023_NYL","name":"Sabrina Ionescu","season":2023,"team":"New York Liberty","pos":"G","pts":17.0,"reb":5.6,"ast":5.4,"stl":1.0,"blk":0.3,"g":36,"off":90.4,"def":72.2},{"id":"tari-phillips_2000_NYL","name":"Tari Phillips","season":2000,"team":"New York Liberty","pos":"F-C","pts":13.8,"reb":8.0,"ast":0.9,"stl":1.9,"blk":0.7,"g":31,"off":76.7,"def":85.2},{"id":"janel-mccarville_2007_NYL","name":"Janel McCarville","season":2007,"team":"New York Liberty","pos":"F-C","pts":10.4,"reb":4.8,"ast":1.1,"stl":1.2,"blk":0.6,"g":32,"off":81.4,"def":80.2},{"id":"tari-phillips_2001_NYL","name":"Tari Phillips","season":2001,"team":"New York Liberty","pos":"F-C","pts":15.3,"reb":8.0,"ast":1.1,"stl":1.5,"blk":0.5,"g":32,"off":81.0,"def":79.8},{"id":"tari-phillips_2002_NYL","name":"Tari Phillips","season":2002,"team":"New York Liberty","pos":"F-C","pts":14.1,"reb":7.0,"ast":1.3,"stl":1.8,"blk":0.4,"g":32,"off":79.4,"def":81.4},{"id":"emma-meesseman_2025_NYL","name":"Emma Meesseman","season":2025,"team":"New York Liberty","pos":"F","pts":13.4,"reb":5.1,"ast":3.2,"stl":1.2,"blk":0.8,"g":17,"off":86.5,"def":74.0},{"id":"teresa-weatherspoon_1997_NYL","name":"Teresa Weatherspoon","season":1997,"team":"New York Liberty","pos":"G","pts":7.0,"reb":4.1,"ast":6.2,"stl":3.0,"blk":0.1,"g":28,"off":79.7,"def":80.8},{"id":"sheryl-swoopes_2000_HOU","name":"Sheryl Swoopes","season":2000,"team":"Houston Comets","pos":"G-F","pts":20.7,"reb":6.3,"ast":3.8,"stl":2.8,"blk":1.1,"g":31,"off":99,"def":89.4},{"id":"sheryl-swoopes_1999_HOU","name":"Sheryl Swoopes","season":1999,"team":"Houston Comets","pos":"G-F","pts":18.3,"reb":6.3,"ast":4.0,"stl":2.4,"blk":1.4,"g":32,"off":94.6,"def":84.2},{"id":"sheryl-swoopes_2002_HOU","name":"Sheryl Swoopes","season":2002,"team":"Houston Comets","pos":"G-F","pts":18.5,"reb":4.9,"ast":3.3,"stl":2.8,"blk":0.7,"g":32,"off":92.4,"def":86.0},{"id":"sheryl-swoopes_2005_HOU","name":"Sheryl Swoopes","season":2005,"team":"Houston Comets","pos":"G-F","pts":18.6,"reb":3.6,"ast":4.3,"stl":2.0,"blk":0.8,"g":33,"off":97.6,"def":77.1},{"id":"sheryl-swoopes_2003_HOU","name":"Sheryl Swoopes","season":2003,"team":"Houston Comets","pos":"G-F","pts":15.6,"reb":4.6,"ast":3.9,"stl":2.5,"blk":0.8,"g":31,"off":86.0,"def":85.4},{"id":"sancho-lyttle_2008_HOU","name":"Sancho Lyttle","season":2008,"team":"Houston Comets","pos":"F","pts":8.2,"reb":6.1,"ast":0.9,"stl":1.4,"blk":1.0,"g":27,"off":84.9,"def":86.3},{"id":"tina-thompson_2000_HOU","name":"Tina Thompson","season":2000,"team":"Houston Comets","pos":"F","pts":16.9,"reb":7.7,"ast":1.5,"stl":1.5,"blk":0.8,"g":32,"off":88.4,"def":82.1},{"id":"cynthia-cooper_1998_HOU","name":"Cynthia Cooper","season":1998,"team":"Houston Comets","pos":"G","pts":22.7,"reb":3.7,"ast":4.4,"stl":1.6,"blk":0.4,"g":30,"off":99,"def":71.2},{"id":"cynthia-cooper_1997_HOU","name":"Cynthia Cooper","season":1997,"team":"Houston Comets","pos":"G","pts":22.2,"reb":4.0,"ast":4.7,"stl":2.1,"blk":0.2,"g":28,"off":99,"def":70.5},{"id":"sheryl-swoopes_1998_HOU","name":"Sheryl Swoopes","season":1998,"team":"Houston Comets","pos":"G-F","pts":15.6,"reb":5.1,"ast":2.1,"stl":2.5,"blk":0.5,"g":29,"off":88.7,"def":79.4},{"id":"cynthia-cooper_1999_HOU","name":"Cynthia Cooper","season":1999,"team":"Houston Comets","pos":"G","pts":22.1,"reb":2.8,"ast":5.2,"stl":1.4,"blk":0.4,"g":31,"off":99,"def":68.5},{"id":"tina-thompson_1998_HOU","name":"Tina Thompson","season":1998,"team":"Houston Comets","pos":"F","pts":12.7,"reb":7.1,"ast":0.9,"stl":1.1,"blk":0.9,"g":27,"off":84.6,"def":80.4},{"id":"cynthia-cooper_2000_HOU","name":"Cynthia Cooper","season":2000,"team":"Houston Comets","pos":"G","pts":17.7,"reb":2.7,"ast":5.0,"stl":1.3,"blk":0.2,"g":31,"off":95.1,"def":68.3},{"id":"janeth-arcain_2001_HOU","name":"Janeth Arcain","season":2001,"team":"Houston Comets","pos":"G","pts":18.5,"reb":4.2,"ast":2.9,"stl":1.9,"blk":0.1,"g":32,"off":91.9,"def":71.2},{"id":"michelle-snow_2006_HOU","name":"Michelle Snow","season":2006,"team":"Houston Comets","pos":"C","pts":13.0,"reb":7.9,"ast":1.4,"stl":1.0,"blk":1.1,"g":34,"off":80.4,"def":82.6},{"id":"sheryl-swoopes_2006_HOU","name":"Sheryl Swoopes","season":2006,"team":"Houston Comets","pos":"G-F","pts":15.5,"reb":5.9,"ast":3.7,"stl":2.1,"blk":0.3,"g":31,"off":83.1,"def":79.8},{"id":"michelle-snow_2005_HOU","name":"Michelle Snow","season":2005,"team":"Houston Comets","pos":"C","pts":12.0,"reb":6.8,"ast":1.2,"stl":0.6,"blk":1.2,"g":33,"off":85.2,"def":77.3},{"id":"tina-thompson_2002_HOU","name":"Tina Thompson","season":2002,"team":"Houston Comets","pos":"F","pts":16.7,"reb":7.5,"ast":2.1,"stl":0.9,"blk":0.7,"g":29,"off":83.8,"def":78.5},{"id":"tina-thompson_1997_HOU","name":"Tina Thompson","season":1997,"team":"Houston Comets","pos":"F","pts":13.2,"reb":6.6,"ast":1.1,"stl":0.8,"blk":1.0,"g":28,"off":85.7,"def":75.8},{"id":"michelle-snow_2003_HOU","name":"Michelle Snow","season":2003,"team":"Houston Comets","pos":"C","pts":9.2,"reb":7.7,"ast":1.2,"stl":1.0,"blk":1.8,"g":34,"off":77.6,"def":83.9},{"id":"tina-thompson_2001_HOU","name":"Tina Thompson","season":2001,"team":"Houston Comets","pos":"F","pts":19.3,"reb":7.8,"ast":1.9,"stl":1.0,"blk":0.7,"g":30,"off":83.8,"def":76.3},{"id":"sheryl-swoopes_2004_HOU","name":"Sheryl Swoopes","season":2004,"team":"Houston Comets","pos":"G-F","pts":14.8,"reb":4.9,"ast":2.9,"stl":1.5,"blk":0.5,"g":31,"off":84.9,"def":74.5},{"id":"tina-thompson_2004_HOU","name":"Tina Thompson","season":2004,"team":"Houston Comets","pos":"F","pts":20.0,"reb":6.0,"ast":1.8,"stl":0.8,"blk":0.9,"g":26,"off":87.3,"def":71.5},{"id":"sancho-lyttle_2007_HOU","name":"Sancho Lyttle","season":2007,"team":"Houston Comets","pos":"F","pts":5.9,"reb":5.3,"ast":1.0,"stl":1.2,"blk":0.6,"g":31,"off":74.7,"def":83.8},{"id":"tina-thompson_2007_HOU","name":"Tina Thompson","season":2007,"team":"Houston Comets","pos":"F","pts":18.8,"reb":6.7,"ast":2.8,"stl":0.9,"blk":0.7,"g":34,"off":87.0,"def":70.6},{"id":"erika-de-souza_2013_ATL","name":"Erika de Souza","season":2013,"team":"Atlanta Dream","pos":"F-C","pts":12.9,"reb":9.9,"ast":1.3,"stl":1.3,"blk":1.8,"g":34,"off":84.3,"def":88.4},{"id":"angel-mccoughtry_2011_ATL","name":"Angel McCoughtry","season":2011,"team":"Atlanta Dream","pos":"G-F","pts":21.6,"reb":5.2,"ast":2.5,"stl":2.2,"blk":1.0,"g":33,"off":88.1,"def":84.3},{"id":"rhyne-howard_2026_ATL","name":"Rhyne Howard","season":2026,"team":"Atlanta Dream","pos":"G","pts":17.9,"reb":3.9,"ast":3.4,"stl":2.8,"blk":0.6,"g":8,"off":88.8,"def":81.7},{"id":"angel-mccoughtry_2013_ATL","name":"Angel McCoughtry","season":2013,"team":"Atlanta Dream","pos":"G-F","pts":21.5,"reb":5.3,"ast":4.4,"stl":2.7,"blk":0.7,"g":33,"off":87.5,"def":82.7},{"id":"sancho-lyttle_2009_ATL","name":"Sancho Lyttle","season":2009,"team":"Atlanta Dream","pos":"F","pts":13.0,"reb":7.5,"ast":1.5,"stl":2.0,"blk":0.6,"g":34,"off":83.5,"def":86.1},{"id":"angel-mccoughtry_2015_ATL","name":"Angel McCoughtry","season":2015,"team":"Atlanta Dream","pos":"G-F","pts":20.1,"reb":5.3,"ast":2.8,"stl":2.1,"blk":0.5,"g":34,"off":89.0,"def":79.0},{"id":"sancho-lyttle_2010_ATL","name":"Sancho Lyttle","season":2010,"team":"Atlanta Dream","pos":"F","pts":12.8,"reb":9.9,"ast":2.2,"stl":1.7,"blk":0.6,"g":32,"off":82.3,"def":84.9},{"id":"erika-de-souza_2014_ATL","name":"Erika de Souza","season":2014,"team":"Atlanta Dream","pos":"F-C","pts":13.8,"reb":8.7,"ast":1.2,"stl":1.1,"blk":1.4,"g":33,"off":84.0,"def":82.9},{"id":"sancho-lyttle_2014_ATL","name":"Sancho Lyttle","season":2014,"team":"Atlanta Dream","pos":"F","pts":12.2,"reb":9.0,"ast":2.4,"stl":2.2,"blk":0.6,"g":34,"off":77.5,"def":88.3},{"id":"angel-mccoughtry_2016_ATL","name":"Angel McCoughtry","season":2016,"team":"Atlanta Dream","pos":"G-F","pts":19.5,"reb":5.7,"ast":2.8,"stl":1.6,"blk":0.7,"g":33,"off":84.5,"def":81.1},{"id":"erika-de-souza_2009_ATL","name":"Erika de Souza","season":2009,"team":"Atlanta Dream","pos":"F-C","pts":11.8,"reb":9.1,"ast":1.1,"stl":0.9,"blk":1.3,"g":34,"off":81.0,"def":84.5},{"id":"angel-mccoughtry_2012_ATL","name":"Angel McCoughtry","season":2012,"team":"Atlanta Dream","pos":"G-F","pts":21.4,"reb":5.0,"ast":2.9,"stl":2.5,"blk":1.1,"g":24,"off":85.0,"def":80.3},{"id":"angel-mccoughtry_2014_ATL","name":"Angel McCoughtry","season":2014,"team":"Atlanta Dream","pos":"G-F","pts":18.5,"reb":5.2,"ast":3.6,"stl":2.4,"blk":0.4,"g":31,"off":83.1,"def":81.5},{"id":"angel-mccoughtry_2009_ATL","name":"Angel McCoughtry","season":2009,"team":"Atlanta Dream","pos":"G-F","pts":12.8,"reb":3.1,"ast":2.1,"stl":2.2,"blk":0.4,"g":34,"off":85.4,"def":77.9},{"id":"brionna-jones_2025_ATL","name":"Brionna Jones","season":2025,"team":"Atlanta Dream","pos":"F","pts":12.8,"reb":7.2,"ast":2.2,"stl":1.1,"blk":0.8,"g":44,"off":84.6,"def":78.5},{"id":"angel-mccoughtry_2010_ATL","name":"Angel McCoughtry","season":2010,"team":"Atlanta Dream","pos":"G-F","pts":21.1,"reb":4.9,"ast":3.1,"stl":1.9,"blk":0.6,"g":34,"off":84.2,"def":78.7},{"id":"sancho-lyttle_2012_ATL","name":"Sancho Lyttle","season":2012,"team":"Atlanta Dream","pos":"F","pts":14.0,"reb":7.6,"ast":2.5,"stl":2.4,"blk":0.7,"g":34,"off":74.8,"def":88.0},{"id":"erika-de-souza_2010_ATL","name":"Erika de Souza","season":2010,"team":"Atlanta Dream","pos":"F-C","pts":12.4,"reb":8.3,"ast":0.9,"stl":0.8,"blk":1.2,"g":34,"off":80.8,"def":81.5},{"id":"allisha-gray_2025_ATL","name":"Allisha Gray","season":2025,"team":"Atlanta Dream","pos":"G","pts":18.4,"reb":5.3,"ast":3.5,"stl":1.1,"blk":0.4,"g":42,"off":90.7,"def":70.8},{"id":"sancho-lyttle_2015_ATL","name":"Sancho Lyttle","season":2015,"team":"Atlanta Dream","pos":"F","pts":10.3,"reb":8.2,"ast":2.2,"stl":2.2,"blk":0.6,"g":24,"off":77.7,"def":83.1},{"id":"angel-mccoughtry_2018_ATL","name":"Angel McCoughtry","season":2018,"team":"Atlanta Dream","pos":"G-F","pts":16.5,"reb":6.0,"ast":3.0,"stl":1.3,"blk":0.6,"g":29,"off":80.0,"def":80.5},{"id":"cheyenne-parker-tyus_2023_ATL","name":"Cheyenne Parker-Tyus","season":2023,"team":"Atlanta Dream","pos":"F","pts":15.0,"reb":6.7,"ast":1.8,"stl":1.1,"blk":1.5,"g":40,"off":79.2,"def":81.1},{"id":"tiffany-hayes_2018_ATL","name":"Tiffany Hayes","season":2018,"team":"Atlanta Dream","pos":"G","pts":17.2,"reb":3.6,"ast":2.7,"stl":1.2,"blk":0.2,"g":31,"off":86.7,"def":73.4},{"id":"rhyne-howard_2025_ATL","name":"Rhyne Howard","season":2025,"team":"Atlanta Dream","pos":"G","pts":17.5,"reb":4.5,"ast":4.6,"stl":1.5,"blk":0.8,"g":33,"off":83.8,"def":76.2},{"id":"jessica-breland_2018_ATL","name":"Jessica Breland","season":2018,"team":"Atlanta Dream","pos":"F","pts":8.3,"reb":7.9,"ast":2.0,"stl":1.1,"blk":1.9,"g":34,"off":68.9,"def":90.3},{"id":"tamika-catchings_2010_IND","name":"Tamika Catchings","season":2010,"team":"Indiana Fever","pos":"F","pts":18.2,"reb":7.1,"ast":4.0,"stl":2.3,"blk":0.9,"g":34,"off":96.3,"def":89.3},{"id":"tamika-catchings_2006_IND","name":"Tamika Catchings","season":2006,"team":"Indiana Fever","pos":"F","pts":16.3,"reb":7.5,"ast":3.7,"stl":2.9,"blk":1.1,"g":32,"off":91.6,"def":93.3},{"id":"tamika-catchings_2012_IND","name":"Tamika Catchings","season":2012,"team":"Indiana Fever","pos":"F","pts":17.4,"reb":7.6,"ast":3.1,"stl":2.1,"blk":0.9,"g":34,"off":93.3,"def":91.2},{"id":"tamika-catchings_2002_IND","name":"Tamika Catchings","season":2002,"team":"Indiana Fever","pos":"F","pts":18.6,"reb":8.6,"ast":3.7,"stl":2.9,"blk":1.3,"g":32,"off":96.0,"def":88.3},{"id":"tamika-catchings_2003_IND","name":"Tamika Catchings","season":2003,"team":"Indiana Fever","pos":"F","pts":19.7,"reb":8.0,"ast":3.4,"stl":2.1,"blk":1.0,"g":34,"off":95.8,"def":85.2},{"id":"tamika-catchings_2007_IND","name":"Tamika Catchings","season":2007,"team":"Indiana Fever","pos":"F","pts":16.6,"reb":9.0,"ast":4.7,"stl":3.1,"blk":1.0,"g":21,"off":90.3,"def":90.5},{"id":"tamika-catchings_2005_IND","name":"Tamika Catchings","season":2005,"team":"Indiana Fever","pos":"F","pts":14.7,"reb":7.8,"ast":4.2,"stl":2.6,"blk":0.5,"g":34,"off":88.3,"def":92.5},{"id":"tamika-catchings_2011_IND","name":"Tamika Catchings","season":2011,"team":"Indiana Fever","pos":"F","pts":15.5,"reb":7.1,"ast":3.5,"stl":2.0,"blk":0.9,"g":33,"off":94.4,"def":85.7},{"id":"tamika-catchings_2009_IND","name":"Tamika Catchings","season":2009,"team":"Indiana Fever","pos":"F","pts":15.1,"reb":7.2,"ast":3.1,"stl":2.9,"blk":0.5,"g":34,"off":88.9,"def":87.6},{"id":"tamika-catchings_2004_IND","name":"Tamika Catchings","season":2004,"team":"Indiana Fever","pos":"F","pts":16.7,"reb":7.3,"ast":3.4,"stl":2.0,"blk":1.1,"g":34,"off":90.9,"def":84.9},{"id":"tamika-catchings_2013_IND","name":"Tamika Catchings","season":2013,"team":"Indiana Fever","pos":"F","pts":17.7,"reb":7.1,"ast":2.4,"stl":2.8,"blk":1.0,"g":30,"off":87.3,"def":87.9},{"id":"erlana-larkins_2014_IND","name":"Erlana Larkins","season":2014,"team":"Indiana Fever","pos":"F","pts":9.7,"reb":9.2,"ast":2.5,"stl":1.9,"blk":0.8,"g":33,"off":85.4,"def":86.0},{"id":"tamika-catchings_2015_IND","name":"Tamika Catchings","season":2015,"team":"Indiana Fever","pos":"F","pts":13.1,"reb":7.1,"ast":2.2,"stl":1.8,"blk":0.8,"g":30,"off":84.0,"def":86.7},{"id":"aliyah-boston_2026_IND","name":"Aliyah Boston","season":2026,"team":"Indiana Fever","pos":"F-C","pts":16.3,"reb":7.4,"ast":2.5,"stl":1.0,"blk":0.9,"g":8,"off":87.2,"def":83.4},{"id":"aliyah-boston_2025_IND","name":"Aliyah Boston","season":2025,"team":"Indiana Fever","pos":"F-C","pts":15.0,"reb":8.2,"ast":3.7,"stl":1.2,"blk":0.9,"g":44,"off":88.8,"def":81.5},{"id":"tamika-catchings_2008_IND","name":"Tamika Catchings","season":2008,"team":"Indiana Fever","pos":"F","pts":13.3,"reb":6.3,"ast":3.3,"stl":2.0,"blk":0.4,"g":25,"off":86.9,"def":83.4},{"id":"aliyah-boston_2023_IND","name":"Aliyah Boston","season":2023,"team":"Indiana Fever","pos":"F-C","pts":14.5,"reb":8.4,"ast":2.2,"stl":1.3,"blk":1.2,"g":40,"off":86.6,"def":79.3},{"id":"teaira-mccowan_2019_IND","name":"Teaira McCowan","season":2019,"team":"Indiana Fever","pos":"C","pts":10.0,"reb":9.0,"ast":0.2,"stl":0.6,"blk":1.3,"g":34,"off":81.0,"def":84.3},{"id":"tamika-catchings_2016_IND","name":"Tamika Catchings","season":2016,"team":"Indiana Fever","pos":"F","pts":12.7,"reb":4.8,"ast":1.9,"stl":1.8,"blk":0.3,"g":34,"off":83.5,"def":80.8},{"id":"tamika-catchings_2014_IND","name":"Tamika Catchings","season":2014,"team":"Indiana Fever","pos":"F","pts":16.1,"reb":6.4,"ast":1.9,"stl":1.7,"blk":0.8,"g":16,"off":82.1,"def":80.7},{"id":"erlana-larkins_2016_IND","name":"Erlana Larkins","season":2016,"team":"Indiana Fever","pos":"F","pts":8.3,"reb":7.4,"ast":2.1,"stl":0.9,"blk":0.5,"g":33,"off":85.3,"def":76.3},{"id":"teaira-mccowan_2021_IND","name":"Teaira McCowan","season":2021,"team":"Indiana Fever","pos":"C","pts":11.3,"reb":9.6,"ast":1.1,"stl":0.6,"blk":1.6,"g":32,"off":80.7,"def":80.5},{"id":"katie-douglas_2010_IND","name":"Katie Douglas","season":2010,"team":"Indiana Fever","pos":"G-F","pts":13.7,"reb":3.4,"ast":3.3,"stl":1.4,"blk":0.4,"g":34,"off":87.8,"def":72.9},{"id":"natalie-williams_2003_IND","name":"Natalie Williams","season":2003,"team":"Indiana Fever","pos":"C","pts":13.4,"reb":7.5,"ast":1.4,"stl":1.3,"blk":0.6,"g":34,"off":84.0,"def":76.5},{"id":"jessica-davenport_2011_IND","name":"Jessica Davenport","season":2011,"team":"Indiana Fever","pos":"C","pts":10.7,"reb":4.8,"ast":0.5,"stl":0.8,"blk":1.3,"g":34,"off":79.8,"def":80.7},{"id":"jonquel-jones_2021_CON","name":"Jonquel Jones","season":2021,"team":"Connecticut Sun","pos":"C","pts":19.4,"reb":11.2,"ast":2.8,"stl":1.3,"blk":1.3,"g":27,"off":96.3,"def":90.5},{"id":"jonquel-jones_2019_CON","name":"Jonquel Jones","season":2019,"team":"Connecticut Sun","pos":"C","pts":14.6,"reb":9.7,"ast":1.5,"stl":1.3,"blk":2.0,"g":34,"off":85.5,"def":91.9},{"id":"jonquel-jones_2017_CON","name":"Jonquel Jones","season":2017,"team":"Connecticut Sun","pos":"C","pts":15.4,"reb":11.9,"ast":1.5,"stl":0.9,"blk":1.5,"g":34,"off":89.8,"def":86.0},{"id":"alyssa-thomas_2023_CON","name":"Alyssa Thomas","season":2023,"team":"Connecticut Sun","pos":"F","pts":15.5,"reb":9.8,"ast":7.9,"stl":1.8,"blk":0.5,"g":40,"off":86.7,"def":88.1},{"id":"jonquel-jones_2022_CON","name":"Jonquel Jones","season":2022,"team":"Connecticut Sun","pos":"C","pts":14.6,"reb":8.6,"ast":1.8,"stl":1.1,"blk":1.2,"g":33,"off":86.9,"def":85.5},{"id":"tina-charles_2012_CON","name":"Tina Charles","season":2012,"team":"Connecticut Sun","pos":"C","pts":18.0,"reb":10.5,"ast":1.7,"stl":0.5,"blk":1.4,"g":33,"off":88.9,"def":82.7},{"id":"alyssa-thomas_2022_CON","name":"Alyssa Thomas","season":2022,"team":"Connecticut Sun","pos":"F","pts":13.4,"reb":8.2,"ast":6.1,"stl":1.7,"blk":0.2,"g":36,"off":87.2,"def":82.2},{"id":"alyssa-thomas_2020_CON","name":"Alyssa Thomas","season":2020,"team":"Connecticut Sun","pos":"F","pts":15.5,"reb":9.0,"ast":4.8,"stl":2.0,"blk":0.3,"g":21,"off":83.9,"def":85.2},{"id":"lindsay-whalen_2008_CON","name":"Lindsay Whalen","season":2008,"team":"Connecticut Sun","pos":"G","pts":14.0,"reb":5.6,"ast":5.4,"stl":1.5,"blk":0.0,"g":31,"off":94.7,"def":74.4},{"id":"chiney-ogwumike_2018_CON","name":"Chiney Ogwumike","season":2018,"team":"Connecticut Sun","pos":"F-C","pts":14.4,"reb":7.3,"ast":1.0,"stl":1.1,"blk":0.6,"g":31,"off":87.6,"def":81.4},{"id":"tina-charles_2010_CON","name":"Tina Charles","season":2010,"team":"Connecticut Sun","pos":"C","pts":15.5,"reb":11.7,"ast":1.5,"stl":0.7,"blk":1.7,"g":34,"off":84.6,"def":84.3},{"id":"taj-mcwilliams-franklin_2006_CON","name":"Taj McWilliams-Franklin","season":2006,"team":"Connecticut Sun","pos":"F-C","pts":12.8,"reb":9.6,"ast":2.5,"stl":1.1,"blk":1.0,"g":32,"off":84.8,"def":84.1},{"id":"tina-charles_2011_CON","name":"Tina Charles","season":2011,"team":"Connecticut Sun","pos":"C","pts":17.6,"reb":11.0,"ast":1.9,"stl":0.8,"blk":1.8,"g":34,"off":83.6,"def":85.1},{"id":"taj-mcwilliams-franklin_1999_ORL","name":"Taj McWilliams-Franklin","season":1999,"team":"Connecticut Sun","pos":"F-C","pts":13.1,"reb":7.5,"ast":1.6,"stl":1.8,"blk":1.2,"g":32,"off":84.0,"def":84.7},{"id":"brionna-jones_2021_CON","name":"Brionna Jones","season":2021,"team":"Connecticut Sun","pos":"F","pts":14.7,"reb":7.3,"ast":1.8,"stl":1.4,"blk":0.5,"g":32,"off":87.6,"def":79.9},{"id":"taj-mcwilliams-franklin_2005_CON","name":"Taj McWilliams-Franklin","season":2005,"team":"Connecticut Sun","pos":"F-C","pts":13.9,"reb":7.3,"ast":1.9,"stl":1.1,"blk":0.7,"g":34,"off":87.6,"def":79.7},{"id":"alyssa-thomas_2024_CON","name":"Alyssa Thomas","season":2024,"team":"Connecticut Sun","pos":"F","pts":10.6,"reb":8.4,"ast":7.9,"stl":1.6,"blk":0.5,"g":40,"off":85.8,"def":81.1},{"id":"taj-mcwilliams-franklin_2000_ORL","name":"Taj McWilliams-Franklin","season":2000,"team":"Connecticut Sun","pos":"F-C","pts":13.7,"reb":7.6,"ast":1.7,"stl":1.8,"blk":1.0,"g":32,"off":84.1,"def":82.7},{"id":"katie-douglas_2006_CON","name":"Katie Douglas","season":2006,"team":"Connecticut Sun","pos":"G-F","pts":16.4,"reb":3.8,"ast":2.5,"stl":1.9,"blk":0.1,"g":32,"off":91.1,"def":75.3},{"id":"chiney-ogwumike_2014_CON","name":"Chiney Ogwumike","season":2014,"team":"Connecticut Sun","pos":"F-C","pts":15.5,"reb":8.5,"ast":0.6,"stl":1.2,"blk":1.2,"g":31,"off":84.8,"def":80.8},{"id":"chiney-ogwumike_2016_CON","name":"Chiney Ogwumike","season":2016,"team":"Connecticut Sun","pos":"F-C","pts":12.6,"reb":6.7,"ast":0.7,"stl":1.0,"blk":1.0,"g":33,"off":84.6,"def":80.1},{"id":"jonquel-jones_2018_CON","name":"Jonquel Jones","season":2018,"team":"Connecticut Sun","pos":"C","pts":11.8,"reb":5.5,"ast":1.7,"stl":0.4,"blk":1.2,"g":34,"off":86.7,"def":77.9},{"id":"taj-mcwilliams-franklin_2001_ORL","name":"Taj McWilliams-Franklin","season":2001,"team":"Connecticut Sun","pos":"F-C","pts":12.6,"reb":7.6,"ast":2.2,"stl":1.6,"blk":1.6,"g":32,"off":84.5,"def":79.7},{"id":"lindsay-whalen_2007_CON","name":"Lindsay Whalen","season":2007,"team":"Connecticut Sun","pos":"G","pts":13.4,"reb":4.8,"ast":5.0,"stl":2.1,"blk":0.1,"g":34,"off":89.8,"def":74.3},{"id":"margo-dydek_2006_CON","name":"Margo Dydek","season":2006,"team":"Connecticut Sun","pos":"C","pts":9.4,"reb":6.1,"ast":1.2,"stl":0.6,"blk":2.5,"g":34,"off":80.9,"def":82.8},{"id":"brittney-sykes_2026_TOR","name":"Brittney Sykes","season":2026,"team":"Toronto Tempo","pos":"G","pts":19.6,"reb":4.0,"ast":3.8,"stl":1.6,"blk":0.4,"g":10,"off":82.9,"def":72.9},{"id":"marina-mabrey_2026_TOR","name":"Marina Mabrey","season":2026,"team":"Toronto Tempo","pos":"G","pts":18.5,"reb":3.8,"ast":3.6,"stl":1.1,"blk":0.4,"g":10,"off":80.3,"def":71.0},{"id":"nyara-sabally_2026_TOR","name":"Nyara Sabally","season":2026,"team":"Toronto Tempo","pos":"F","pts":11.8,"reb":5.4,"ast":1.9,"stl":1.4,"blk":1.2,"g":8,"off":68.4,"def":76.7},{"id":"julie-allemand_2026_TOR","name":"Julie Allemand","season":2026,"team":"Toronto Tempo","pos":"G","pts":4.6,"reb":2.4,"ast":3.6,"stl":1.8,"blk":0.2,"g":5,"off":68.8,"def":72.0},{"id":"kiki-rice_2026_TOR","name":"Kiki Rice","season":2026,"team":"Toronto Tempo","pos":"G","pts":12.7,"reb":4.7,"ast":2.6,"stl":1.0,"blk":0.1,"g":10,"off":77.3,"def":55.9},{"id":"kia-nurse_2026_TOR","name":"Kia Nurse","season":2026,"team":"Toronto Tempo","pos":"G","pts":4.3,"reb":1.3,"ast":0.5,"stl":0.3,"blk":0.0,"g":10,"off":71.1,"def":61.0},{"id":"laura-ju\u0161kait\u0117_2026_TOR","name":"Laura Ju\u0161kait\u0117","season":2026,"team":"Toronto Tempo","pos":"F","pts":7.9,"reb":3.7,"ast":1.3,"stl":1.1,"blk":0.1,"g":10,"off":67.4,"def":59.4},{"id":"maria-conde_2026_TOR","name":"Maria Conde","season":2026,"team":"Toronto Tempo","pos":"F","pts":7.4,"reb":4.1,"ast":1.0,"stl":0.2,"blk":0.1,"g":10,"off":54.8,"def":51.5},{"id":"yolanda-griffith_1999_SAC","name":"Yolanda Griffith","season":1999,"team":"Sacramento Monarchs","pos":"F-C","pts":18.8,"reb":11.3,"ast":1.6,"stl":2.5,"blk":1.9,"g":29,"off":95.0,"def":96.4},{"id":"yolanda-griffith_2000_SAC","name":"Yolanda Griffith","season":2000,"team":"Sacramento Monarchs","pos":"F-C","pts":16.3,"reb":10.3,"ast":1.5,"stl":2.6,"blk":1.9,"g":32,"off":89.4,"def":91.8},{"id":"yolanda-griffith_2001_SAC","name":"Yolanda Griffith","season":2001,"team":"Sacramento Monarchs","pos":"F-C","pts":16.2,"reb":11.2,"ast":1.7,"stl":2.0,"blk":1.2,"g":32,"off":91.2,"def":87.4},{"id":"yolanda-griffith_2004_SAC","name":"Yolanda Griffith","season":2004,"team":"Sacramento Monarchs","pos":"F-C","pts":14.5,"reb":7.2,"ast":1.2,"stl":2.2,"blk":1.2,"g":34,"off":91.0,"def":87.1},{"id":"yolanda-griffith_2005_SAC","name":"Yolanda Griffith","season":2005,"team":"Sacramento Monarchs","pos":"F-C","pts":13.8,"reb":6.6,"ast":1.5,"stl":1.2,"blk":0.9,"g":34,"off":88.9,"def":84.0},{"id":"yolanda-griffith_2003_SAC","name":"Yolanda Griffith","season":2003,"team":"Sacramento Monarchs","pos":"F-C","pts":13.8,"reb":7.3,"ast":1.4,"stl":1.7,"blk":1.1,"g":34,"off":86.9,"def":83.8},{"id":"yolanda-griffith_2006_SAC","name":"Yolanda Griffith","season":2006,"team":"Sacramento Monarchs","pos":"F-C","pts":12.0,"reb":6.4,"ast":1.6,"stl":1.3,"blk":0.5,"g":34,"off":85.3,"def":81.2},{"id":"rebekkah-brunson_2007_SAC","name":"Rebekkah Brunson","season":2007,"team":"Sacramento Monarchs","pos":"F","pts":11.5,"reb":8.9,"ast":0.7,"stl":1.3,"blk":0.9,"g":33,"off":80.1,"def":85.8},{"id":"demya-walker_2005_SAC","name":"DeMya Walker","season":2005,"team":"Sacramento Monarchs","pos":"F","pts":14.1,"reb":5.3,"ast":2.2,"stl":1.3,"blk":0.6,"g":22,"off":86.2,"def":78.1},{"id":"rebekkah-brunson_2009_SAC","name":"Rebekkah Brunson","season":2009,"team":"Sacramento Monarchs","pos":"F","pts":12.3,"reb":7.0,"ast":0.3,"stl":1.5,"blk":0.6,"g":27,"off":82.1,"def":81.1},{"id":"erin-perperoglou_2006_SAC","name":"Erin Perperoglou","season":2006,"team":"Sacramento Monarchs","pos":"F","pts":9.7,"reb":3.9,"ast":1.0,"stl":1.0,"blk":0.4,"g":34,"off":85.5,"def":75.6},{"id":"nicole-powell_2009_SAC","name":"Nicole Powell","season":2009,"team":"Sacramento Monarchs","pos":"F","pts":16.7,"reb":5.9,"ast":2.3,"stl":1.4,"blk":0.2,"g":34,"off":86.8,"def":72.4},{"id":"nicole-powell_2007_SAC","name":"Nicole Powell","season":2007,"team":"Sacramento Monarchs","pos":"F","pts":12.8,"reb":5.6,"ast":1.7,"stl":1.4,"blk":0.4,"g":34,"off":81.8,"def":76.5},{"id":"ruthie-bolton_1997_SAC","name":"Ruthie Bolton","season":1997,"team":"Sacramento Monarchs","pos":"G","pts":19.4,"reb":5.8,"ast":2.6,"stl":2.3,"blk":0.0,"g":23,"off":87.9,"def":69.1},{"id":"rebekkah-brunson_2008_SAC","name":"Rebekkah Brunson","season":2008,"team":"Sacramento Monarchs","pos":"F","pts":10.9,"reb":7.1,"ast":0.4,"stl":1.2,"blk":0.7,"g":30,"off":77.0,"def":80.0},{"id":"tangela-smith_2000_SAC","name":"Tangela Smith","season":2000,"team":"Sacramento Monarchs","pos":"C","pts":12.1,"reb":5.6,"ast":1.3,"stl":0.9,"blk":2.0,"g":32,"off":78.4,"def":78.2},{"id":"yolanda-griffith_2002_SAC","name":"Yolanda Griffith","season":2002,"team":"Sacramento Monarchs","pos":"F-C","pts":16.9,"reb":8.7,"ast":1.1,"stl":0.9,"blk":0.8,"g":17,"off":84.3,"def":72.3},{"id":"tangela-smith_2003_SAC","name":"Tangela Smith","season":2003,"team":"Sacramento Monarchs","pos":"C","pts":12.6,"reb":5.5,"ast":1.5,"stl":1.3,"blk":0.9,"g":34,"off":76.4,"def":79.9},{"id":"latasha-byears_1999_SAC","name":"Latasha Byears","season":1999,"team":"Sacramento Monarchs","pos":"G-F","pts":9.2,"reb":5.3,"ast":1.0,"stl":1.1,"blk":0.2,"g":32,"off":78.9,"def":76.1},{"id":"ticha-penicheiro_2008_SAC","name":"Ticha Penicheiro","season":2008,"team":"Sacramento Monarchs","pos":"G","pts":8.6,"reb":3.0,"ast":5.2,"stl":2.0,"blk":0.1,"g":33,"off":78.9,"def":76.0},{"id":"nicole-powell_2005_SAC","name":"Nicole Powell","season":2005,"team":"Sacramento Monarchs","pos":"F","pts":10.7,"reb":3.6,"ast":1.8,"stl":1.1,"blk":0.5,"g":34,"off":80.1,"def":74.0},{"id":"latasha-byears_1997_SAC","name":"Latasha Byears","season":1997,"team":"Sacramento Monarchs","pos":"G-F","pts":8.7,"reb":6.9,"ast":1.7,"stl":1.4,"blk":0.3,"g":28,"off":77.3,"def":76.4},{"id":"latasha-byears_2000_SAC","name":"Latasha Byears","season":2000,"team":"Sacramento Monarchs","pos":"G-F","pts":5.7,"reb":3.8,"ast":0.7,"stl":0.9,"blk":0.2,"g":32,"off":76.0,"def":77.1},{"id":"ticha-penicheiro_2000_SAC","name":"Ticha Penicheiro","season":2000,"team":"Sacramento Monarchs","pos":"G","pts":6.9,"reb":3.0,"ast":7.9,"stl":2.3,"blk":0.2,"g":30,"off":79.1,"def":73.8},{"id":"yolanda-griffith_2007_SAC","name":"Yolanda Griffith","season":2007,"team":"Sacramento Monarchs","pos":"F-C","pts":9.0,"reb":4.6,"ast":1.5,"stl":1.0,"blk":0.4,"g":32,"off":77.7,"def":74.6},{"id":"vicky-bullett_1999_CHA","name":"Vicky Bullett","season":1999,"team":"Charlotte Sting","pos":"F","pts":11.5,"reb":6.8,"ast":1.6,"stl":1.9,"blk":1.4,"g":32,"off":83.7,"def":86.3},{"id":"vicky-bullett_1997_CHA","name":"Vicky Bullett","season":1997,"team":"Charlotte Sting","pos":"F","pts":12.8,"reb":6.4,"ast":2.3,"stl":1.9,"blk":2.0,"g":28,"off":83.1,"def":85.2},{"id":"andrea-stinson_2001_CHA","name":"Andrea Stinson","season":2001,"team":"Charlotte Sting","pos":"G","pts":14.1,"reb":4.3,"ast":2.8,"stl":1.3,"blk":0.6,"g":32,"off":91.4,"def":72.5},{"id":"vicky-bullett_1998_CHA","name":"Vicky Bullett","season":1998,"team":"Charlotte Sting","pos":"F","pts":13.3,"reb":6.5,"ast":1.5,"stl":2.2,"blk":1.5,"g":30,"off":78.8,"def":82.9},{"id":"andrea-stinson_2002_CHA","name":"Andrea Stinson","season":2002,"team":"Charlotte Sting","pos":"G","pts":12.8,"reb":5.5,"ast":2.8,"stl":1.2,"blk":0.3,"g":32,"off":86.9,"def":73.7},{"id":"tammy-sutton-brown_2002_CHA","name":"Tammy Sutton-Brown","season":2002,"team":"Charlotte Sting","pos":"C","pts":11.9,"reb":6.0,"ast":0.5,"stl":0.9,"blk":1.1,"g":32,"off":84.3,"def":76.0},{"id":"andrea-stinson_2000_CHA","name":"Andrea Stinson","season":2000,"team":"Charlotte Sting","pos":"G","pts":17.7,"reb":4.2,"ast":3.8,"stl":1.7,"blk":0.7,"g":32,"off":87.7,"def":71.9},{"id":"rhonda-mapp_1997_CHA","name":"Rhonda Mapp","season":1997,"team":"Charlotte Sting","pos":"C","pts":11.6,"reb":5.5,"ast":2.3,"stl":0.8,"blk":0.4,"g":28,"off":87.1,"def":72.1},{"id":"andrea-stinson_1997_CHA","name":"Andrea Stinson","season":1997,"team":"Charlotte Sting","pos":"G","pts":15.7,"reb":5.5,"ast":4.4,"stl":1.5,"blk":0.8,"g":28,"off":85.8,"def":72.9},{"id":"tammy-sutton-brown_2004_CHA","name":"Tammy Sutton-Brown","season":2004,"team":"Charlotte Sting","pos":"C","pts":9.6,"reb":6.2,"ast":0.4,"stl":0.9,"blk":2.1,"g":34,"off":77.2,"def":80.6},{"id":"andrea-stinson_1998_CHA","name":"Andrea Stinson","season":1998,"team":"Charlotte Sting","pos":"G","pts":15.0,"reb":4.6,"ast":4.5,"stl":1.8,"blk":0.5,"g":30,"off":84.6,"def":72.2},{"id":"rhonda-mapp_2000_CHA","name":"Rhonda Mapp","season":2000,"team":"Charlotte Sting","pos":"C","pts":11.9,"reb":6.8,"ast":2.1,"stl":1.0,"blk":0.8,"g":30,"off":82.3,"def":73.7},{"id":"tammy-sutton-brown_2001_CHA","name":"Tammy Sutton-Brown","season":2001,"team":"Charlotte Sting","pos":"C","pts":6.8,"reb":4.4,"ast":0.4,"stl":0.7,"blk":1.3,"g":29,"off":77.4,"def":78.2},{"id":"allison-feaster_2002_CHA","name":"Allison Feaster","season":2002,"team":"Charlotte Sting","pos":"F","pts":11.8,"reb":3.7,"ast":1.9,"stl":1.2,"blk":0.4,"g":32,"off":85.9,"def":68.5},{"id":"rhonda-mapp_1999_CHA","name":"Rhonda Mapp","season":1999,"team":"Charlotte Sting","pos":"C","pts":9.5,"reb":6.4,"ast":1.9,"stl":0.8,"blk":0.4,"g":30,"off":77.7,"def":76.0},{"id":"andrea-stinson_2003_CHA","name":"Andrea Stinson","season":2003,"team":"Charlotte Sting","pos":"G","pts":11.1,"reb":4.1,"ast":2.9,"stl":1.4,"blk":0.1,"g":34,"off":81.6,"def":71.3},{"id":"tammy-sutton-brown_2006_CHA","name":"Tammy Sutton-Brown","season":2006,"team":"Charlotte Sting","pos":"C","pts":11.2,"reb":5.9,"ast":0.7,"stl":0.9,"blk":1.8,"g":30,"off":74.9,"def":77.1},{"id":"shalonda-enis_2003_CHA","name":"Shalonda Enis","season":2003,"team":"Charlotte Sting","pos":"F-C","pts":8.7,"reb":4.3,"ast":0.6,"stl":1.0,"blk":0.1,"g":29,"off":81.1,"def":70.7},{"id":"tracy-reid_1998_CHA","name":"Tracy Reid","season":1998,"team":"Charlotte Sting","pos":"F","pts":13.8,"reb":5.2,"ast":1.5,"stl":1.3,"blk":0.4,"g":30,"off":80.2,"def":70.8},{"id":"kelly-mazzante_2006_CHA","name":"Kelly Mazzante","season":2006,"team":"Charlotte Sting","pos":"G","pts":8.9,"reb":2.9,"ast":1.9,"stl":1.4,"blk":0.2,"g":34,"off":78.2,"def":72.8},{"id":"tangela-smith_2006_CHA","name":"Tangela Smith","season":2006,"team":"Charlotte Sting","pos":"C","pts":13.1,"reb":5.3,"ast":1.5,"stl":1.2,"blk":0.9,"g":34,"off":74.9,"def":75.9},{"id":"tammy-sutton-brown_2005_CHA","name":"Tammy Sutton-Brown","season":2005,"team":"Charlotte Sting","pos":"C","pts":9.4,"reb":5.3,"ast":0.4,"stl":0.9,"blk":1.1,"g":34,"off":74.9,"def":75.0},{"id":"andrea-congreaves_1997_CHA","name":"Andrea Congreaves","season":1997,"team":"Charlotte Sting","pos":"F-C","pts":6.7,"reb":4.8,"ast":1.5,"stl":0.6,"blk":0.2,"g":28,"off":81.5,"def":68.2},{"id":"andrea-stinson_1999_CHA","name":"Andrea Stinson","season":1999,"team":"Charlotte Sting","pos":"G","pts":13.6,"reb":3.5,"ast":2.9,"stl":1.0,"blk":0.6,"g":32,"off":82.6,"def":66.6},{"id":"tangela-smith_2005_CHA","name":"Tangela Smith","season":2005,"team":"Charlotte Sting","pos":"C","pts":13.6,"reb":5.2,"ast":1.3,"stl":1.6,"blk":1.0,"g":31,"off":72.5,"def":76.6},{"id":"emily-engstler_2026_POR","name":"Emily Engstler","season":2026,"team":"Portland Fire","pos":"F","pts":9.2,"reb":4.3,"ast":1.2,"stl":1.3,"blk":2.2,"g":12,"off":74.0,"def":89.3},{"id":"bridget-carleton_2026_POR","name":"Bridget Carleton","season":2026,"team":"Portland Fire","pos":"F","pts":13.9,"reb":3.3,"ast":2.1,"stl":2.0,"blk":0.4,"g":11,"off":79.7,"def":75.3},{"id":"kristin-folkl_2002_POR","name":"Kristin Folkl","season":2002,"team":"Portland Fire","pos":"F","pts":4.8,"reb":4.6,"ast":1.0,"stl":0.6,"blk":0.5,"g":32,"off":76.6,"def":76.7},{"id":"kristin-folkl_2001_POR","name":"Kristin Folkl","season":2001,"team":"Portland Fire","pos":"F","pts":5.6,"reb":7.7,"ast":1.4,"stl":0.6,"blk":1.1,"g":32,"off":72.2,"def":79.7},{"id":"alisa-burras_2002_POR","name":"Alisa Burras","season":2002,"team":"Portland Fire","pos":"C","pts":8.7,"reb":4.6,"ast":0.2,"stl":0.3,"blk":0.2,"g":32,"off":83.1,"def":68.8},{"id":"tamicha-jackson_2002_POR","name":"Tamicha Jackson","season":2002,"team":"Portland Fire","pos":"G","pts":9.8,"reb":1.8,"ast":3.0,"stl":1.7,"blk":0.0,"g":32,"off":78.2,"def":71.3},{"id":"megan-gustafson_2026_POR","name":"Megan Gustafson","season":2026,"team":"Portland Fire","pos":"C","pts":10.3,"reb":3.2,"ast":0.6,"stl":0.1,"blk":0.4,"g":12,"off":87.7,"def":61.2},{"id":"sylvia-crawley_2001_POR","name":"Sylvia Crawley","season":2001,"team":"Portland Fire","pos":"F","pts":9.3,"reb":6.3,"ast":1.7,"stl":0.6,"blk":0.8,"g":32,"off":75.2,"def":72.6},{"id":"demya-walker_2002_POR","name":"DeMya Walker","season":2002,"team":"Portland Fire","pos":"F","pts":10.9,"reb":5.0,"ast":1.6,"stl":0.8,"blk":1.1,"g":31,"off":72.3,"def":75.2},{"id":"sylvia-crawley_2000_POR","name":"Sylvia Crawley","season":2000,"team":"Portland Fire","pos":"F","pts":11.5,"reb":6.0,"ast":1.1,"stl":0.9,"blk":0.8,"g":31,"off":72.8,"def":74.2},{"id":"sophia-witherspoon_2000_POR","name":"Sophia Witherspoon","season":2000,"team":"Portland Fire","pos":"G","pts":16.8,"reb":3.3,"ast":2.1,"stl":1.2,"blk":0.2,"g":32,"off":80.5,"def":66.1},{"id":"tully-bevilaqua_2001_POR","name":"Tully Bevilaqua","season":2001,"team":"Portland Fire","pos":"G","pts":4.9,"reb":2.8,"ast":3.3,"stl":1.9,"blk":0.2,"g":31,"off":73.5,"def":73.1},{"id":"alisa-burras_2000_POR","name":"Alisa Burras","season":2000,"team":"Portland Fire","pos":"C","pts":7.6,"reb":3.5,"ast":0.3,"stl":0.1,"blk":0.3,"g":21,"off":75.1,"def":68.6},{"id":"michelle-marciniak_2000_POR","name":"Michelle Marciniak","season":2000,"team":"Portland Fire","pos":"G","pts":5.5,"reb":1.8,"ast":2.3,"stl":1.2,"blk":0.2,"g":32,"off":69.5,"def":73.3},{"id":"stacey-thomas_2002_POR","name":"Stacey Thomas","season":2002,"team":"Portland Fire","pos":"F","pts":4.5,"reb":2.9,"ast":2.1,"stl":1.3,"blk":0.4,"g":32,"off":66.1,"def":76.7},{"id":"jackie-stiles_2001_POR","name":"Jackie Stiles","season":2001,"team":"Portland Fire","pos":"G","pts":14.9,"reb":2.4,"ast":1.7,"stl":0.8,"blk":0.1,"g":32,"off":82.2,"def":59.8},{"id":"stacey-thomas_2000_POR","name":"Stacey Thomas","season":2000,"team":"Portland Fire","pos":"F","pts":5.1,"reb":3.9,"ast":3.2,"stl":1.7,"blk":0.5,"g":32,"off":66.7,"def":74.9},{"id":"sylvia-crawley_2002_POR","name":"Sylvia Crawley","season":2002,"team":"Portland Fire","pos":"F","pts":8.7,"reb":4.2,"ast":1.5,"stl":0.6,"blk":1.2,"g":32,"off":68.3,"def":73.1},{"id":"tully-bevilaqua_2000_POR","name":"Tully Bevilaqua","season":2000,"team":"Portland Fire","pos":"G","pts":4.8,"reb":3.0,"ast":2.8,"stl":1.3,"blk":0.2,"g":32,"off":70.4,"def":70.9},{"id":"ukari-figgs_2002_POR","name":"Ukari Figgs","season":2002,"team":"Portland Fire","pos":"G","pts":8.5,"reb":2.6,"ast":3.4,"stl":0.8,"blk":0.1,"g":31,"off":77.9,"def":63.2},{"id":"vanessa-nygaard_2000_POR","name":"Vanessa Nygaard","season":2000,"team":"Portland Fire","pos":"F","pts":7.9,"reb":3.8,"ast":0.9,"stl":0.5,"blk":0.2,"g":32,"off":74.3,"def":63.8},{"id":"sophia-witherspoon_2001_POR","name":"Sophia Witherspoon","season":2001,"team":"Portland Fire","pos":"G","pts":12.0,"reb":2.4,"ast":1.7,"stl":1.0,"blk":0.3,"g":31,"off":71.7,"def":64.0},{"id":"carla-leite_2026_POR","name":"Carla Leite","season":2026,"team":"Portland Fire","pos":"G","pts":14.4,"reb":1.6,"ast":5.1,"stl":0.5,"blk":0.0,"g":10,"off":77.2,"def":57.7},{"id":"haley-jones_2026_POR","name":"Haley Jones","season":2026,"team":"Portland Fire","pos":"G-F","pts":5.2,"reb":2.2,"ast":1.0,"stl":0.4,"blk":0.0,"g":5,"off":71.5,"def":59.4},{"id":"demya-walker_2001_POR","name":"DeMya Walker","season":2001,"team":"Portland Fire","pos":"F","pts":5.4,"reb":2.8,"ast":0.5,"stl":0.3,"blk":0.6,"g":21,"off":63.2,"def":66.7},{"id":"elena-baranova_2001_MIA","name":"Elena Baranova","season":2001,"team":"Miami Sol","pos":"F","pts":11.8,"reb":6.0,"ast":2.0,"stl":1.0,"blk":1.8,"g":32,"off":83.3,"def":81.0},{"id":"sheri-sam_2002_MIA","name":"Sheri Sam","season":2002,"team":"Miami Sol","pos":"G-F","pts":14.5,"reb":4.8,"ast":2.6,"stl":2.2,"blk":0.2,"g":32,"off":79.7,"def":76.2},{"id":"debbie-black_2001_MIA","name":"Debbie Black","season":2001,"team":"Miami Sol","pos":"G","pts":5.6,"reb":3.9,"ast":3.8,"stl":2.6,"blk":0.1,"g":32,"off":73.4,"def":81.3},{"id":"sheri-sam_2001_MIA","name":"Sheri Sam","season":2001,"team":"Miami Sol","pos":"G-F","pts":13.9,"reb":4.3,"ast":2.8,"stl":1.7,"blk":0.2,"g":32,"off":80.4,"def":74.0},{"id":"kristen-rasmussen_2002_MIA","name":"Kristen Rasmussen","season":2002,"team":"Miami Sol","pos":"F","pts":5.5,"reb":3.8,"ast":1.3,"stl":0.6,"blk":0.5,"g":31,"off":80.2,"def":73.5},{"id":"debbie-black_2002_MIA","name":"Debbie Black","season":2002,"team":"Miami Sol","pos":"G","pts":4.8,"reb":3.8,"ast":4.3,"stl":1.8,"blk":0.2,"g":32,"off":75.9,"def":75.9},{"id":"marlies-askamp_2000_MIA","name":"Marlies Askamp","season":2000,"team":"Miami Sol","pos":"C","pts":7.8,"reb":7.2,"ast":0.9,"stl":0.5,"blk":0.7,"g":32,"off":71.7,"def":78.8},{"id":"ruth-riley_2001_MIA","name":"Ruth Riley","season":2001,"team":"Miami Sol","pos":"C","pts":6.8,"reb":4.1,"ast":0.8,"stl":0.8,"blk":1.4,"g":32,"off":72.8,"def":76.8},{"id":"sheri-sam_2000_MIA","name":"Sheri Sam","season":2000,"team":"Miami Sol","pos":"G-F","pts":12.8,"reb":4.3,"ast":2.1,"stl":1.1,"blk":0.2,"g":31,"off":76.6,"def":72.3},{"id":"sandy-brondello_2001_MIA","name":"Sandy Brondello","season":2001,"team":"Miami Sol","pos":"G","pts":12.7,"reb":1.7,"ast":2.2,"stl":1.0,"blk":0.1,"g":29,"off":82.7,"def":64.7},{"id":"pollyanna-johns-kimbrough_2002_MIA","name":"Pollyanna Johns Kimbrough","season":2002,"team":"Miami Sol","pos":"C","pts":7.0,"reb":4.5,"ast":1.0,"stl":0.9,"blk":0.5,"g":31,"off":73.3,"def":73.9},{"id":"debbie-black_2000_MIA","name":"Debbie Black","season":2000,"team":"Miami Sol","pos":"G","pts":4.8,"reb":2.9,"ast":3.1,"stl":1.8,"blk":0.0,"g":32,"off":69.7,"def":74.3},{"id":"ruth-riley_2002_MIA","name":"Ruth Riley","season":2002,"team":"Miami Sol","pos":"C","pts":5.7,"reb":3.5,"ast":1.0,"stl":0.4,"blk":1.6,"g":26,"off":65.5,"def":77.4},{"id":"sharon-manning_2000_MIA","name":"Sharon Manning","season":2000,"team":"Miami Sol","pos":"F-C","pts":4.3,"reb":4.2,"ast":0.7,"stl":1.0,"blk":0.2,"g":24,"off":65.1,"def":76.9},{"id":"vanessa-nygaard_2002_MIA","name":"Vanessa Nygaard","season":2002,"team":"Miami Sol","pos":"F","pts":4.1,"reb":2.3,"ast":0.3,"stl":0.4,"blk":0.0,"g":29,"off":72.5,"def":63.4},{"id":"sandy-brondello_2002_MIA","name":"Sandy Brondello","season":2002,"team":"Miami Sol","pos":"G","pts":8.8,"reb":1.4,"ast":1.5,"stl":0.9,"blk":0.1,"g":30,"off":68.6,"def":63.5},{"id":"katrina-colleton_2000_MIA","name":"Katrina Colleton","season":2000,"team":"Miami Sol","pos":"F","pts":8.3,"reb":2.0,"ast":1.6,"stl":0.8,"blk":0.2,"g":32,"off":65.3,"def":66.3},{"id":"shantia-owens_2000_MIA","name":"Shantia Owens","season":2000,"team":"Miami Sol","pos":"F","pts":4.2,"reb":3.1,"ast":0.7,"stl":0.4,"blk":0.8,"g":31,"off":59.1,"def":72.3},{"id":"veronica-burton_2025_GSV","name":"Veronica Burton","season":2025,"team":"Golden State Valkyries","pos":"G","pts":11.9,"reb":4.4,"ast":6.0,"stl":1.1,"blk":0.6,"g":44,"off":85.9,"def":74.2},{"id":"veronica-burton_2026_GSV","name":"Veronica Burton","season":2026,"team":"Golden State Valkyries","pos":"G","pts":13.6,"reb":3.1,"ast":5.8,"stl":0.8,"blk":0.8,"g":10,"off":88.7,"def":67.8},{"id":"gabby-williams_2026_GSV","name":"Gabby Williams","season":2026,"team":"Golden State Valkyries","pos":"F","pts":13.3,"reb":3.7,"ast":2.6,"stl":1.8,"blk":0.3,"g":10,"off":78.1,"def":77.3},{"id":"laeticia-amihere_2025_GSV","name":"Laeticia Amihere","season":2025,"team":"Golden State Valkyries","pos":"F","pts":5.4,"reb":4.3,"ast":0.9,"stl":0.6,"blk":0.4,"g":29,"off":72.6,"def":81.3},{"id":"janelle-sala\u00fcn_2026_GSV","name":"Janelle Sala\u00fcn","season":2026,"team":"Golden State Valkyries","pos":"F","pts":14.2,"reb":3.8,"ast":1.4,"stl":0.8,"blk":0.2,"g":10,"off":78.4,"def":75.2},{"id":"kayla-thornton_2026_GSV","name":"Kayla Thornton","season":2026,"team":"Golden State Valkyries","pos":"F","pts":9.8,"reb":5.2,"ast":0.4,"stl":0.8,"blk":0.4,"g":10,"off":72.2,"def":78.8},{"id":"monique-billings_2025_GSV","name":"Monique Billings","season":2025,"team":"Golden State Valkyries","pos":"F","pts":7.3,"reb":4.5,"ast":0.5,"stl":0.6,"blk":0.8,"g":26,"off":72.0,"def":77.5},{"id":"iliana-rupert_2025_GSV","name":"Iliana Rupert","season":2025,"team":"Golden State Valkyries","pos":"C","pts":9.3,"reb":3.9,"ast":1.6,"stl":0.6,"blk":0.6,"g":21,"off":79.4,"def":68.6},{"id":"temi-fagbenle_2025_GSV","name":"Temi Fagbenle","season":2025,"team":"Golden State Valkyries","pos":"C","pts":7.4,"reb":4.9,"ast":1.6,"stl":0.9,"blk":0.6,"g":39,"off":70.6,"def":75.0},{"id":"kayla-thornton_2025_GSV","name":"Kayla Thornton","season":2025,"team":"Golden State Valkyries","pos":"F","pts":14.0,"reb":7.0,"ast":1.5,"stl":1.3,"blk":0.2,"g":22,"off":70.2,"def":74.5},{"id":"tiffany-hayes_2025_GSV","name":"Tiffany Hayes","season":2025,"team":"Golden State Valkyries","pos":"G","pts":11.7,"reb":3.8,"ast":3.0,"stl":0.5,"blk":0.2,"g":26,"off":78.5,"def":65.2},{"id":"cecilia-zandalasini_2025_GSV","name":"Cecilia Zandalasini","season":2025,"team":"Golden State Valkyries","pos":"F","pts":10.5,"reb":2.9,"ast":1.7,"stl":0.9,"blk":0.2,"g":19,"off":76.4,"def":65.3},{"id":"laeticia-amihere_2026_GSV","name":"Laeticia Amihere","season":2026,"team":"Golden State Valkyries","pos":"F","pts":4.4,"reb":4.0,"ast":1.6,"stl":0.2,"blk":0.9,"g":9,"off":66.0,"def":74.2},{"id":"tiffany-hayes_2026_GSV","name":"Tiffany Hayes","season":2026,"team":"Golden State Valkyries","pos":"G","pts":7.4,"reb":1.4,"ast":2.0,"stl":0.5,"blk":0.0,"g":8,"off":84.4,"def":55.3},{"id":"janelle-sala\u00fcn_2025_GSV","name":"Janelle Sala\u00fcn","season":2025,"team":"Golden State Valkyries","pos":"F","pts":11.3,"reb":5.1,"ast":1.2,"stl":0.6,"blk":0.1,"g":36,"off":70.0,"def":67.1},{"id":"carla-leite_2025_GSV","name":"Carla Leite","season":2025,"team":"Golden State Valkyries","pos":"G","pts":7.2,"reb":1.3,"ast":2.0,"stl":0.7,"blk":0.1,"g":37,"off":68.9,"def":65.6},{"id":"kate-martin_2025_GSV","name":"Kate Martin","season":2025,"team":"Golden State Valkyries","pos":"G","pts":6.2,"reb":2.7,"ast":1.0,"stl":0.4,"blk":0.1,"g":42,"off":62.7,"def":66.2},{"id":"kaila-charles_2026_GSV","name":"Kaila Charles","season":2026,"team":"Golden State Valkyries","pos":"G-F","pts":6.2,"reb":4.9,"ast":1.0,"stl":0.5,"blk":0.2,"g":10,"off":61.1,"def":64.9},{"id":"kaitlyn-chen_2026_GSV","name":"Kaitlyn Chen","season":2026,"team":"Golden State Valkyries","pos":"G","pts":7.1,"reb":1.6,"ast":2.0,"stl":0.1,"blk":0.0,"g":10,"off":73.5,"def":50},{"id":"cecilia-zandalasini_2026_GSV","name":"Cecilia Zandalasini","season":2026,"team":"Golden State Valkyries","pos":"F","pts":9.7,"reb":1.8,"ast":2.0,"stl":1.0,"blk":0.0,"g":6,"off":66.0,"def":55.2},{"id":"just\u0117-jocyt\u0117_2026_GSV","name":"Just\u0117 Jocyt\u0117","season":2026,"team":"Golden State Valkyries","pos":"G-F","pts":4.2,"reb":0.6,"ast":1.2,"stl":0.0,"blk":0.2,"g":5,"off":57.1,"def":53.6},{"id":"janice-braxton_1997_CLE","name":"Janice Braxton","season":1997,"team":"Cleveland Rockers","pos":"F","pts":11.5,"reb":7.6,"ast":2.0,"stl":1.4,"blk":1.1,"g":25,"off":82.0,"def":84.4},{"id":"isabelle-fijalkowski_1998_CLE","name":"Isabelle Fijalkowski","season":1998,"team":"Cleveland Rockers","pos":"F-C","pts":13.7,"reb":6.9,"ast":2.1,"stl":0.6,"blk":1.0,"g":28,"off":88.7,"def":74.4},{"id":"rushia-brown_2001_CLE","name":"Rushia Brown","season":2001,"team":"Cleveland Rockers","pos":"F","pts":8.3,"reb":4.4,"ast":1.2,"stl":1.5,"blk":0.3,"g":30,"off":83.6,"def":78.0},{"id":"janice-braxton_1998_CLE","name":"Janice Braxton","season":1998,"team":"Cleveland Rockers","pos":"F","pts":9.8,"reb":5.6,"ast":2.5,"stl":1.7,"blk":0.5,"g":30,"off":82.5,"def":78.5},{"id":"chasity-melvin_2001_CLE","name":"Chasity Melvin","season":2001,"team":"Cleveland Rockers","pos":"F-C","pts":9.9,"reb":5.7,"ast":1.9,"stl":0.9,"blk":0.6,"g":27,"off":83.9,"def":76.3},{"id":"rushia-brown_1997_CLE","name":"Rushia Brown","season":1997,"team":"Cleveland Rockers","pos":"F","pts":6.3,"reb":4.0,"ast":0.7,"stl":1.2,"blk":0.5,"g":28,"off":81.3,"def":78.8},{"id":"rushia-brown_2000_CLE","name":"Rushia Brown","season":2000,"team":"Cleveland Rockers","pos":"F","pts":8.4,"reb":4.1,"ast":1.5,"stl":1.3,"blk":0.4,"g":30,"off":82.5,"def":77.3},{"id":"penny-taylor_2003_CLE","name":"Penny Taylor","season":2003,"team":"Cleveland Rockers","pos":"F","pts":11.7,"reb":4.4,"ast":2.4,"stl":1.1,"blk":0.3,"g":34,"off":83.9,"def":74.3},{"id":"penny-taylor_2002_CLE","name":"Penny Taylor","season":2002,"team":"Cleveland Rockers","pos":"F","pts":13.0,"reb":5.3,"ast":2.3,"stl":1.2,"blk":0.4,"g":30,"off":84.6,"def":73.1},{"id":"ann-wauters_2001_CLE","name":"Ann Wauters","season":2001,"team":"Cleveland Rockers","pos":"C","pts":9.8,"reb":4.8,"ast":1.5,"stl":0.7,"blk":0.5,"g":24,"off":84.0,"def":73.5},{"id":"chasity-melvin_2003_CLE","name":"Chasity Melvin","season":2003,"team":"Cleveland Rockers","pos":"F-C","pts":13.1,"reb":6.3,"ast":1.5,"stl":0.8,"blk":0.6,"g":34,"off":83.0,"def":73.7},{"id":"penny-taylor_2001_CLE","name":"Penny Taylor","season":2001,"team":"Cleveland Rockers","pos":"F","pts":7.2,"reb":3.5,"ast":1.4,"stl":1.1,"blk":0.3,"g":32,"off":76.6,"def":79.9},{"id":"chasity-melvin_2000_CLE","name":"Chasity Melvin","season":2000,"team":"Cleveland Rockers","pos":"F-C","pts":11.7,"reb":5.4,"ast":1.9,"stl":0.9,"blk":0.6,"g":32,"off":81.8,"def":74.6},{"id":"eva-nemcova_1997_CLE","name":"Eva Nemcova","season":1997,"team":"Cleveland Rockers","pos":"F","pts":13.7,"reb":3.9,"ast":2.4,"stl":1.4,"blk":0.3,"g":28,"off":88.6,"def":67.1},{"id":"ann-wauters_2002_CLE","name":"Ann Wauters","season":2002,"team":"Cleveland Rockers","pos":"C","pts":11.2,"reb":5.0,"ast":1.4,"stl":0.6,"blk":0.8,"g":28,"off":84.5,"def":70.7},{"id":"mery-andrade_2000_CLE","name":"Mery Andrade","season":2000,"team":"Cleveland Rockers","pos":"F","pts":8.3,"reb":3.0,"ast":2.3,"stl":1.3,"blk":0.3,"g":32,"off":80.9,"def":73.7},{"id":"latoya-thomas_2003_CLE","name":"LaToya Thomas","season":2003,"team":"Cleveland Rockers","pos":"F","pts":10.8,"reb":5.1,"ast":1.2,"stl":0.9,"blk":0.4,"g":32,"off":80.3,"def":73.7},{"id":"merlakia-jones_2001_CLE","name":"Merlakia Jones","season":2001,"team":"Cleveland Rockers","pos":"G","pts":13.5,"reb":5.5,"ast":1.5,"stl":1.0,"blk":0.1,"g":30,"off":81.7,"def":71.9},{"id":"ann-wauters_2000_CLE","name":"Ann Wauters","season":2000,"team":"Cleveland Rockers","pos":"C","pts":6.2,"reb":4.0,"ast":1.2,"stl":0.7,"blk":0.8,"g":32,"off":75.1,"def":78.5},{"id":"isabelle-fijalkowski_1997_CLE","name":"Isabelle Fijalkowski","season":1997,"team":"Cleveland Rockers","pos":"F-C","pts":11.9,"reb":5.6,"ast":2.4,"stl":0.6,"blk":0.6,"g":28,"off":84.2,"def":69.3},{"id":"rushia-brown_1998_CLE","name":"Rushia Brown","season":1998,"team":"Cleveland Rockers","pos":"F","pts":6.5,"reb":3.1,"ast":0.9,"stl":1.1,"blk":0.5,"g":30,"off":75.3,"def":77.5},{"id":"eva-nemcova_1998_CLE","name":"Eva Nemcova","season":1998,"team":"Cleveland Rockers","pos":"F","pts":11.9,"reb":3.7,"ast":2.2,"stl":1.1,"blk":0.7,"g":30,"off":83.4,"def":69.0},{"id":"janice-braxton_1999_CLE","name":"Janice Braxton","season":1999,"team":"Cleveland Rockers","pos":"F","pts":5.8,"reb":4.3,"ast":1.3,"stl":0.7,"blk":0.5,"g":26,"off":73.3,"def":78.1},{"id":"suzie-mcconnell-serio_1998_CLE","name":"Suzie McConnell Serio","season":1998,"team":"Cleveland Rockers","pos":"G","pts":8.6,"reb":2.2,"ast":6.4,"stl":1.8,"blk":0.2,"g":28,"off":83.3,"def":67.7},{"id":"chasity-melvin_2002_CLE","name":"Chasity Melvin","season":2002,"team":"Cleveland Rockers","pos":"F-C","pts":12.5,"reb":6.0,"ast":1.8,"stl":0.9,"blk":0.6,"g":32,"off":78.5,"def":69.9}];

const TEAMS = [...new Set(PLAYER_DB.map(p => p.team))].sort();

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
function generateBoard(team,draftedNames=new Set(),hometown=false,size=10,minElite=3){
  const pool=PLAYER_DB.filter(p=>p.team===team);
  const elite=pool.filter(p=>p.off>=80||p.def>=80);
  const regular=pool.filter(p=>p.off<80&&p.def<80);
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
  const BASE=72;
  const ovrs=filled.map(s=>{
    const pen=getPosPenalty(s.player.pos,s.posGroup);
    return{off:Math.max(0,(s.player.off-BASE))*pen,def:Math.max(0,(s.player.def-BASE))*pen,
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
  const weakLink=Math.max(0,(72-Math.min(minOff,minDef))/8);
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

  // Continuous ceiling — peak + depth both required
  let ceiling;
  if(peakQ>=97&&depthScore>=88)      ceiling=44;
  else if(peakQ>=95&&depthScore>=86) ceiling=43;
  else if(peakQ>=93&&depthScore>=84) ceiling=41;
  else if(peakQ>=90&&depthScore>=86) ceiling=41;
  else if(peakQ>=92&&depthScore>=82) ceiling=39;
  else if(peakQ>=90&&depthScore>=84) ceiling=39;
  else if(peakQ>=88&&depthScore>=83) ceiling=37;
  else if(peakQ>=86&&depthScore>=84) ceiling=37;
  else if(peakQ>=88&&depthScore>=80) ceiling=34;
  else if(peakQ>=85&&depthScore>=82) ceiling=34;
  else if(peakQ>=85&&depthScore>=78) ceiling=30;
  else if(peakQ>=82&&depthScore>=80) ceiling=30;
  else if(peakQ>=80&&depthScore>=78) ceiling=26;
  else if(peakQ>=80)                 ceiling=22;
  else if(peakQ>=75)                 ceiling=17;
  else                               ceiling=10;

  const wins=Math.max(0,Math.min(ceiling,Math.round(raw)));
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

  useEffect(()=>{
    const l=document.createElement("link");
    l.href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap";
    l.rel="stylesheet";document.head.appendChild(l);
  },[]);

  const hoopIQ=mode==="hoopiq";
  const filledCount=slots.filter(s=>s.player).length;
  const canConfirm=pick1&&(!pickTwoOn||pick2);
  const tc=currentTeam?teamColor(currentTeam):{primary:"#f59e42",secondary:"#1f2937"};

  function doSpin(opts={}){
    const{exclude=null,hometown=false}=opts;
    setSpinning(true);setSpinLanded(false);setPick1(null);setPick2(null);setSelSlot(null);
    const avail=shuffle(TEAMS.filter(t=>!usedTeams.has(t)&&t!==exclude&&PLAYER_DB.some(p=>p.team===t&&!draftedNames.has(playerBase(p.name)))));
    const pool=hometown&&currentTeam?[currentTeam]:avail;
    if(!pool.length){setSpinning(false);return;}
    const display=hometown?TEAMS:pool;
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
              const canvas=document.createElement("canvas");
              const dpr=Math.min(window.devicePixelRatio||1,2);
              const W=390,H=730;
              canvas.width=W*dpr;canvas.height=H*dpr;
              const ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);
              ctx.fillStyle="#07090f";ctx.fillRect(0,0,W,H);
              ctx.strokeStyle="rgba(255,255,255,0.03)";ctx.lineWidth=1;
              for(let x=0;x<W;x+=24){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
              for(let y=0;y<H;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
              ctx.font="700 10px Arial";ctx.fillStyle="#6b7280";ctx.textAlign="center";ctx.fillText("FINAL RECORD",W/2,48);
              ctx.font="900 88px 'Arial Black',Arial";ctx.fillStyle=tier.color;ctx.textAlign="center";
              ctx.fillText(`${result.wins}-${result.losses}`,W/2,148);
              ctx.font="700 11px Arial";ctx.fillStyle=tier.color;ctx.fillText(tier.label,W/2,172);
              ctx.font="italic 11px Arial";ctx.fillStyle="#6b7280";ctx.fillText(tierMsg,W/2,192);
              [[`OFF ${result.teamOff}`,"#f59e42",18,208],[`DEF ${result.teamDef}`,"#60a5fa",W/2+8,208]].forEach(([t,c,x,y])=>{
                ctx.fillStyle="rgba(255,255,255,0.05)";ctx.beginPath();ctx.roundRect(x,y,W/2-26,62,8);ctx.fill();
                ctx.font="900 26px 'Arial Black',Arial";ctx.fillStyle=c;ctx.textAlign="center";ctx.fillText(t,x+(W/2-26)/2,y+40);
              });
              ctx.font="700 9px Arial";ctx.fillStyle="#6b7280";ctx.textAlign="left";ctx.fillText("YOUR ROSTER",20,288);
              let ry=300;
              slots.filter(s=>s.player).forEach(s=>{
                const p=s.player;const rH=43;
                ctx.fillStyle="rgba(255,255,255,0.04)";ctx.beginPath();ctx.roundRect(20,ry,W-40,rH,7);ctx.fill();
                const posC=p.pos?.startsWith("G")?"#f59e42":p.pos?.startsWith("C")?"#60a5fa":"#4ade80";
                ctx.fillStyle=posC+"33";ctx.beginPath();ctx.arc(45,ry+rH/2,13,0,Math.PI*2);ctx.fill();
                ctx.strokeStyle=posC+"88";ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(45,ry+rH/2,13,0,Math.PI*2);ctx.stroke();
                ctx.font="700 10px Arial";ctx.fillStyle=posC;ctx.textAlign="center";
                ctx.fillText(p.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),45,ry+rH/2+4);
                ctx.font="700 13px Arial";ctx.fillStyle="#f9fafb";ctx.textAlign="left";ctx.fillText(p.name,65,ry+rH/2-3);
                ctx.font="500 9px Arial";ctx.fillStyle="#6b7280";ctx.fillText(`${s.key} · ${p.season}`,65,ry+rH/2+11);
                ctx.font="800 12px 'Arial Black',Arial";ctx.fillStyle="#f9fafb";ctx.textAlign="right";
                ctx.fillText((p.pts+p.reb+p.ast+p.stl+p.blk).toFixed(1),W-24,ry+rH/2+5);
                ry+=rH+4;
              });
              ry+=14;
              ctx.font="600 12px Arial";ctx.fillStyle="#9ca3af";ctx.textAlign="center";
              ctx.fillText(`I went ${result.wins}-${result.losses}, think you can do better?`,W/2,ry+14);
              ctx.font="900 20px 'Arial Black',Arial";ctx.fillStyle="#f59e42";ctx.fillText("44-0.com",W/2,ry+40);
              canvas.toBlob(async(blob)=>{
                const file=new File([blob],"44-0-result.png",{type:"image/png"});
                if(navigator.canShare&&navigator.canShare({files:[file]})){
                  try{await navigator.share({files:[file],title:"44-0 WNBA Draft Game"});}
                  catch{window.open(URL.createObjectURL(blob),"_blank");}
                }else{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="44-0-result.png";a.click();}
              },"image/png");
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
