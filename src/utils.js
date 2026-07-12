// Pure utility/helpers extracted from App.jsx so they can be unit-tested in
// isolation. These functions contain no React/JSX and only depend on standard
// browser/JS APIs (Date, DOMParser, Math, string/array methods).

export const PERK_PAIRS = [
  {el:"👕 T-Shirt", en:"👕 T-Shirt"},
  {el:"🏅 Μετάλλιο", en:"🏅 Medal"},
  {el:"🍝 Φαγητό", en:"🍝 Food"},
  {el:"💧 Νερό/Ρόφημα", en:"💧 Water/Drink"},
  {el:"🎒 Goody Bag", en:"🎒 Goody Bag"},
  {el:"📸 Φωτογραφίες", en:"📸 Photos"},
  {el:"🚿 Ντουζιέρες", en:"🚿 Showers"},
  {el:"🏥 Ιατρική Κάλυψη", en:"🏥 Medical"},
  {el:"🎟️ Χρονομέτρηση", en:"🎟️ Timing"},
  {el:"📋 Πιστοποιητικό", en:"📋 Certificate"}
];
export const SUGGESTED_PERKS = PERK_PAIRS.map(p=>p.el);
export function translatePerk(perk, lang){
  for(const p of PERK_PAIRS){if(perk===p.el||perk===p.en)return lang==="en"?p.en:p.el;}
  return perk;
}

export function getDaysUntilRace(date){
  if(!date)return null;
  try{
    const raceDate=new Date(date);
    raceDate.setHours(23,59,59,999);
    const now=new Date();
    const diffMs=raceDate-now;
    return Math.ceil(diffMs/(1000*60*60*24));
  }catch{return null;}
}

export function autoToastType(msg){
  if(!msg)return"info";
  const s=String(msg).toLowerCase();
  if(s.includes("✅")||s.includes("επιτυχ")||s.includes("success")||s.includes("ολοκληρ"))return"success";
  if(s.includes("σφάλμα")||s.includes("error")||s.includes("❌"))return"error";
  if(s.includes("⚠")||s.includes("συμπληρ")||s.includes("warn")||s.includes("μη έγκυρ")||s.includes("invalid"))return"warning";
  return"info";
}

export function validateGreekPhone(phone){
  if(!phone)return{valid:true,clean:""}; // Optional in most cases
  const clean=String(phone).replace(/[\s\-()]/g,"");
  // Greek mobile: starts with 69, 10 digits total. Or +30 69...
  // Greek landline: 10 digits starting with 2
  // International with +30
  if(/^\+30\d{10}$/.test(clean))return{valid:true,clean};
  if(/^00306\d{9}$/.test(clean))return{valid:true,clean};
  if(/^6\d{9}$/.test(clean))return{valid:true,clean}; // Mobile 6XXXXXXXXX (10 digits)
  if(/^2\d{9}$/.test(clean))return{valid:true,clean}; // Landline 2XXXXXXXXX (10 digits)
  return{valid:false,clean,error:"Μη έγκυρος αριθμός. Σωστό format: 69ΧΧΧΧΧΧΧΧ ή 21ΧΧΧΧΧΧΧΧ"};
}

export function validateAMKA(amka){
  if(!amka)return{valid:true,clean:""}; // Optional
  const clean=String(amka).replace(/\D/g,"");
  if(clean.length!==11)return{valid:false,clean,error:"Το ΑΜΚΑ πρέπει να είναι 11 ψηφία"};
  // First 6 digits = birth date DDMMYY
  const day=parseInt(clean.substring(0,2));
  const month=parseInt(clean.substring(2,4));
  if(day<1||day>31||month<1||month>12)return{valid:false,clean,error:"Μη έγκυρο ΑΜΚΑ - λάθος ημερομηνία γέννησης"};
  return{valid:true,clean};
}

export function generateCalendarLinks(race){
  if(!race||!race.date)return null;
  const startDate=new Date(race.date+"T08:00:00");
  const endDate=new Date(race.date+"T14:00:00");
  function fmt(d){return d.toISOString().replace(/[-:]/g,"").split(".")[0]+"Z";}
  const title=encodeURIComponent(race.name);
  const details=encodeURIComponent(`${race.description||""}\n\nracemanagement.gr`);
  const location=encodeURIComponent(race.location||"");
  return{
    google:`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(startDate)}/${fmt(endDate)}&details=${details}&location=${location}`,
    outlook:`https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${details}&location=${location}`,
    ics:`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Race Management//EL\nBEGIN:VEVENT\nUID:${race.id}@racemanagement.gr\nDTSTAMP:${fmt(new Date())}\nDTSTART:${fmt(startDate)}\nDTEND:${fmt(endDate)}\nSUMMARY:${race.name}\nDESCRIPTION:${race.description||""}\nLOCATION:${race.location||""}\nEND:VEVENT\nEND:VCALENDAR`
  };
}

export function parseDistanceKm(d){if(!d)return 0;const m=String(d).match(/(\d+\.?\d*)\s*km/i);if(m)return parseFloat(m[1]);if(/μαραθ/i.test(d)||/marath/i.test(d))return 42.195;if(/ημιμαρ/i.test(d)||/half/i.test(d))return 21.0975;return 0;}

export function truncLoc(loc,max=30){
  if(!loc)return"—";
  const s=String(loc).trim();
  if(s.length<=max)return s;
  return s.slice(0,max-1).trimEnd()+"…";
}

export function timeToSeconds(t){if(!t)return 0;const p=String(t).split(":").map(Number);if(p.length===3)return p[0]*3600+p[1]*60+p[2];if(p.length===2)return p[0]*60+p[1];return 0;}
export function formatTime(t){if(!t)return "—";const p=String(t).split(":").map(x=>x.trim());if(p.length===3)return `${String(parseInt(p[0])||0).padStart(2,"0")}:${String(parseInt(p[1])||0).padStart(2,"0")}:${String(parseInt(p[2])||0).padStart(2,"0")}`;if(p.length===2)return `00:${String(parseInt(p[0])||0).padStart(2,"0")}:${String(parseInt(p[1])||0).padStart(2,"0")}`;return t;}

export function secToChartFormat(sec){
  if(!sec||isNaN(sec))return"0:00";
  const s=Math.abs(Math.round(sec));
  const h=Math.floor(s/3600);
  const m=Math.floor((s%3600)/60);
  const ss=s%60;
  if(h>0)return `${h}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
  return `${m}:${String(ss).padStart(2,"0")}`;
}

export function buildTimeProgressChart(myRegs,races){
  try{
    if(!races||!Array.isArray(races))return null;
    const finished=(myRegs||[]).filter(r=>r&&r.finish_time).map(r=>{
      const race=races.find(rc=>rc&&rc.id===r.race_id);
      return{distance:r.distance,seconds:timeToSeconds(r.finish_time),date:race?.date||"",raceName:race?.name||""};
    }).filter(r=>r.seconds>0&&r.date);
    const byDist={};
    finished.forEach(r=>{if(!byDist[r.distance])byDist[r.distance]=[];byDist[r.distance].push(r);});
    const validDists=Object.keys(byDist).filter(d=>byDist[d].length>=2).sort();
    validDists.forEach(d=>byDist[d].sort((a,b)=>a.date.localeCompare(b.date)));
    return{validDists,byDist};
  }catch(err){
    console.error("Progress charts error:",err);
    return null;
  }
}

export function calculatePrice(race,distance){
  const basePrice=(race.pricing||[]).find(p=>p.distance===distance)?.price||0;
  if(!race.early_bird||!race.early_bird.deadline)return{base:basePrice,final:basePrice,isEarlyBird:false};
  const now=new Date();const deadline=new Date(race.early_bird.deadline);
  if(now<=deadline){const discount=race.early_bird.discount_percent||0;return{base:basePrice,final:basePrice*(1-discount/100),isEarlyBird:true,discount,deadline:race.early_bird.deadline};}
  return{base:basePrice,final:basePrice,isEarlyBird:false};
}

export function parseGPX(gpxText){
  try{
    const parser=new DOMParser();
    const xml=parser.parseFromString(gpxText,"text/xml");
    if(xml.querySelector("parsererror"))return null;
    const trkpts=xml.querySelectorAll("trkpt");
    const points=[];
    trkpts.forEach(pt=>{
      const lat=parseFloat(pt.getAttribute("lat"));
      const lng=parseFloat(pt.getAttribute("lon"));
      const eleEl=pt.querySelector("ele");
      const ele=eleEl?parseFloat(eleEl.textContent):0;
      if(!isNaN(lat)&&!isNaN(lng))points.push([lat,lng,isNaN(ele)?0:ele]);
    });
    return points.length>0?points:null;
  }catch{return null;}
}

export function haversineKm(p1,p2){
  const R=6371;
  const dLat=(p2[0]-p1[0])*Math.PI/180;
  const dLng=(p2[1]-p1[1])*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(p1[0]*Math.PI/180)*Math.cos(p2[0]*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

export function calculateRouteStats(points){
  if(!points||points.length<2)return{totalKm:0,gain:0,loss:0};
  let totalKm=0,gain=0,loss=0;
  for(let i=1;i<points.length;i++){
    totalKm+=haversineKm(points[i-1],points[i]);
    const diff=points[i][2]-points[i-1][2];
    if(diff>0)gain+=diff;else loss+=Math.abs(diff);
  }
  return{totalKm:Math.round(totalKm*100)/100,gain:Math.round(gain),loss:Math.round(loss)};
}

export function escapeXml(s){return String(s||"").replace(/[<>&'"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));}

export function generateGPX(route){
  const pts=(route.points||[]).map(([lat,lng,ele])=>`      <trkpt lat="${lat}" lon="${lng}"><ele>${ele||0}</ele></trkpt>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Race Management" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(route.distance)} Route</name>
  </metadata>
  <trk>
    <name>${escapeXml(route.distance)}</name>
    <trkseg>
${pts}
    </trkseg>
  </trk>
</gpx>`;
}

export function buildElevationData(points){
  if(!points||points.length<2)return[];
  let cumKm=0;
  const data=[{x:0,y:points[0][2]||0}];
  for(let i=1;i<points.length;i++){
    cumKm+=haversineKm(points[i-1],points[i]);
    data.push({x:cumKm,y:points[i][2]||0});
  }
  return data;
}

export function downsampleProfile(data,maxPoints){
  if(data.length<=maxPoints)return data;
  const step=Math.ceil(data.length/maxPoints);
  const out=[];
  for(let i=0;i<data.length;i+=step)out.push(data[i]);
  if(out[out.length-1]!==data[data.length-1])out.push(data[data.length-1]);
  return out;
}

// Greek text normalization for fuzzy matching
export function normalizeText(s){
  if(!s)return"";
  return String(s).toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"") // strip accents
    .replace(/ς/g,"σ") // final sigma to regular
    .replace(/\s+/g," "); // collapse whitespace
}

// Parse CSV (simple, handles quoted values)
export function parseCSV(text){
  const lines=text.split(/\r?\n/).filter(l=>l.trim());
  if(lines.length<2)return[];
  function splitLine(line){
    const out=[];let cur="";let inQuotes=false;
    for(let i=0;i<line.length;i++){
      const c=line[i];
      if(c==='"'){if(inQuotes&&line[i+1]==='"'){cur+='"';i++;}else inQuotes=!inQuotes;}
      else if(c===","&&!inQuotes){out.push(cur);cur="";}
      else cur+=c;
    }
    out.push(cur);
    return out.map(x=>x.trim());
  }
  const headers=splitLine(lines[0]).map(h=>normalizeText(h));
  const rows=[];
  for(let i=1;i<lines.length;i++){
    const values=splitLine(lines[i]);
    const row={};
    headers.forEach((h,j)=>{row[h]=values[j]||"";});
    rows.push(row);
  }
  return{headers,rows};
}

// Map flexible column names to standard fields
export function mapCSVRow(row){
  // Find value by trying multiple column name variants
  function find(...names){
    for(const n of names){if(row[n]!==undefined&&row[n]!=="")return row[n];}
    return"";
  }
  return{
    bib:find("bib_number","bib","αριθμοσ","αριθμός","νουμερο","number","no","#"),
    email:find("email","e-mail","mail","ηλεκτρονικη"),
    first_name:find("first_name","firstname","name","ονομα","όνομα","fname"),
    last_name:find("last_name","lastname","surname","επωνυμο","επώνυμο","lname"),
    club:find("club","team","ομαδα","ομάδα","συλλογοσ","σύλλογος"),
    finish_time:find("finish_time","time","χρονοσ","χρόνος","τερματισμοσ")
  };
}

// Parse time string to seconds (flexible format)
export function parseTimeFlex(s){
  if(!s)return null;
  const v=String(s).trim().toUpperCase();
  if(v==="DNF"||v==="DNS"||v==="DSQ")return v;
  // Format: HH:MM:SS or MM:SS or with .ms
  const m=v.match(/^(\d+):(\d+):(\d+)(?:\.\d+)?$/);
  if(m)return`${m[1].padStart(2,"0")}:${m[2].padStart(2,"0")}:${m[3].padStart(2,"0")}`;
  const m2=v.match(/^(\d+):(\d+)(?:\.\d+)?$/);
  if(m2){const min=parseInt(m2[1]),sec=parseInt(m2[2]);
    const h=Math.floor(min/60);const remainMin=min%60;
    return`${String(h).padStart(2,"0")}:${String(remainMin).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  }
  return null;
}

// Multi-criteria matching: BIB → email → name → name+club
export function matchRunner(csvRow,registrations,runners){
  const mapped=mapCSVRow(csvRow);
  // 1. BIB number (most reliable)
  if(mapped.bib){
    const bib=String(parseInt(mapped.bib,10));
    if(bib&&bib!=="NaN"){
      const match=registrations.find(r=>String(r.bib_number)===bib);
      if(match)return{registration:match,method:"BIB"};
    }
  }
  // 2. Email
  if(mapped.email){
    const email=mapped.email.toLowerCase().trim();
    const runner=runners.find(r=>(r.email||"").toLowerCase().trim()===email);
    if(runner){
      const match=registrations.find(r=>r.runner_id===runner.id);
      if(match)return{registration:match,method:"email"};
    }
  }
  // 3. Full name (normalized)
  if(mapped.first_name&&mapped.last_name){
    const fn=normalizeText(mapped.first_name);
    const ln=normalizeText(mapped.last_name);
    const matches=runners.filter(r=>{
      const rfn=normalizeText(r.first_name);
      const rln=normalizeText(r.last_name);
      return(rfn===fn&&rln===ln)||(rfn===ln&&rln===fn); // also try swapped
    });
    if(matches.length===1){
      const match=registrations.find(r=>r.runner_id===matches[0].id);
      if(match)return{registration:match,method:"name"};
    }
    // 4. Multiple name matches - try with club
    if(matches.length>1&&mapped.club){
      const club=normalizeText(mapped.club);
      const refined=matches.find(r=>normalizeText(r.club).includes(club)||club.includes(normalizeText(r.club)));
      if(refined){
        const match=registrations.find(r=>r.runner_id===refined.id);
        if(match)return{registration:match,method:"name+club"};
      }
      return{ambiguous:true,count:matches.length};
    }
    if(matches.length>1)return{ambiguous:true,count:matches.length};
  }
  return null;
}
