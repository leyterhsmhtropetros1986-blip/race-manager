import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kcqnykjbgqjlgcxmcaro.supabase.co";
const SUPABASE_KEY = "sb_publishable_0dnpl6eFXDjB1Ot26f-qsg_B9IasaUw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── THEME ─────────────────────────────────────────────────────────────────────
const T = {
  bg: "#f5f3ef", bgAlt: "#ffffff", bgInput: "#ffffff",
  border: "#e0ddd6", borderDark: "#c9c5bc",
  text: "#2a2a2e", textMid: "#6b6b73", textLight: "#9a9aa3",
  primary: "#4a5dc7", primaryDark: "#3a4ba8",
  accent: "#2da77f", accentDark: "#1f8862",
  warning: "#d4a017", danger: "#d04545",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
};

const CATEGORIES = ["Γενική","Άνδρες 18-29","Άνδρες 30-39","Άνδρες 40-49","Άνδρες 50+","Γυναίκες 18-29","Γυναίκες 30-39","Γυναίκες 40-49","Γυναίκες 50+","Παίδες U18"];
const TSHIRTS = ["XS","S","M","L","XL","XXL"];
const SUGGESTED_DISTANCES = ["5km","10km","12km","15km","20km","21km","23km","42km","Ημιμαραθώνιος","Μαραθώνιος","Trail","Ορεινός"];
const SUGGESTED_PERKS = ["👕 T-Shirt","🏅 Μετάλλιο","🍝 Φαγητό","💧 Νερό/Ρόφημα","🎒 Goody Bag","📸 Επαγγελματικές Φωτογραφίες","🚿 Ντουζιέρες","🏥 Ιατρική Κάλυψη","🎟️ Ηλεκτρονικός Χρονομέτρης","📋 Πιστοποιητικό Συμμετοχής"];

const css = {
  input:{width:"100%",background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"10px 14px",color:T.text,fontSize:"14px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
  label:{display:"block",color:T.textMid,fontSize:"11px",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"5px",fontWeight:600}
};

function F({label,children}){return <div style={{marginBottom:"14px"}}>{label&&<label style={css.label}>{label}</label>}{children}</div>;}
function In({label,...p}){return <F label={label}><input {...p} style={{...css.input,...p.style}}/></F>;}
function Sel({label,children,...p}){return <F label={label}><select {...p} style={{...css.input,...p.style}}>{children}</select></F>;}
function Btn({children,v="pri",sm,...p}){
  const vs={
    pri:{background:T.primary,color:"#fff",fontWeight:700},
    sec:{background:T.bgAlt,color:T.text,border:`1px solid ${T.border}`},
    red:{background:"#fce8e8",color:T.danger,border:`1px solid ${T.danger}33`},
    grn:{background:"#e1f3ec",color:T.accent,border:`1px solid ${T.accent}44`},
    ghost:{background:"transparent",color:T.textMid,border:`1px solid ${T.border}`}
  };
  return <button {...p} style={{borderRadius:"8px",border:"none",cursor:"pointer",padding:sm?"6px 12px":"10px 20px",fontSize:sm?"12px":"13px",fontFamily:"inherit",...vs[v],...p.style}}>{children}</button>;
}
function Modal({title,onClose,children,wide}){
  return <div style={{position:"fixed",inset:0,background:"rgba(40,40,50,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:"20px"}}>
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"16px",padding:"28px",width:"100%",maxWidth:wide?"780px":"520px",maxHeight:"88vh",overflowY:"auto",boxShadow:"0 10px 40px rgba(0,0,0,0.15)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
        <h2 style={{margin:0,color:T.text,fontSize:"18px"}}>{title}</h2>
        <button onClick={onClose} style={{background:"none",border:"none",color:T.textLight,cursor:"pointer",fontSize:"24px"}}>×</button>
      </div>
      {children}
    </div>
  </div>;
}

// ─── DISTANCES PICKER ─────────────────────────────────────────────────────────
function DistancesPicker({distances,onChange}){
  const [custom,setCustom]=useState("");
  function addDistance(d){if(!distances.includes(d))onChange([...distances,d]);}
  function removeDistance(d){onChange(distances.filter(x=>x!==d));}
  function addCustom(){if(custom.trim()&&!distances.includes(custom.trim())){onChange([...distances,custom.trim()]);setCustom("");}}
  return <F label="Διαδρομές / Αποστάσεις *">
    <div style={{marginBottom:"10px"}}>
      <div style={{color:T.textMid,fontSize:"11px",marginBottom:"6px"}}>Γρήγορη επιλογή:</div>
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
        {SUGGESTED_DISTANCES.map(d=>(
          <button key={d} onClick={()=>addDistance(d)} style={{background:distances.includes(d)?T.primary:T.bgAlt,color:distances.includes(d)?"#fff":T.textMid,border:`1px solid ${distances.includes(d)?T.primary:T.border}`,borderRadius:"6px",padding:"4px 10px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>{d}</button>
        ))}
      </div>
    </div>
    <div style={{display:"flex",gap:"8px",marginBottom:"10px"}}>
      <input value={custom} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustom()} placeholder="Ή γράψε δική σου π.χ. 23.5km" style={{...css.input,flex:1}}/>
      <button onClick={addCustom} style={{background:T.primary,color:"#fff",border:"none",borderRadius:"8px",padding:"0 16px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,whiteSpace:"nowrap"}}>+ Προσθήκη</button>
    </div>
    {distances.length>0&&(
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
        {distances.map((d,i)=>(
          <span key={i} style={{background:`${T.primary}15`,border:`1px solid ${T.primary}33`,borderRadius:"6px",padding:"4px 10px",fontSize:"13px",color:T.text,display:"flex",alignItems:"center",gap:"6px"}}>
            🏃 {d}
            <button onClick={()=>removeDistance(d)} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",fontSize:"16px",padding:0,lineHeight:1}}>×</button>
          </span>
        ))}
      </div>
    )}
  </F>;
}

// ─── PRICING PICKER (τιμές ανά απόσταση) ──────────────────────────────────────
function PricingPicker({distances,pricing,onChange}){
  function updatePrice(distance,price){
    const existing=pricing.find(p=>p.distance===distance);
    if(existing){
      onChange(pricing.map(p=>p.distance===distance?{...p,price:parseFloat(price)||0}:p));
    } else {
      onChange([...pricing,{distance,price:parseFloat(price)||0}]);
    }
  }
  function getPrice(distance){return pricing.find(p=>p.distance===distance)?.price||"";}
  
  if(distances.length===0)return <div style={{background:`${T.warning}15`,border:`1px solid ${T.warning}44`,borderRadius:"8px",padding:"12px",color:T.warning,fontSize:"12px",marginBottom:"14px"}}>⚠️ Πρόσθεσε πρώτα διαδρομές για να βάλεις τιμές</div>;
  
  return <F label="💰 Τιμές Συμμετοχής (€)">
    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {distances.map(d=>(
        <div key={d} style={{display:"flex",gap:"8px",alignItems:"center",background:T.bg,padding:"8px 12px",borderRadius:"8px",border:`1px solid ${T.border}`}}>
          <span style={{flex:1,fontSize:"13px",color:T.text,fontWeight:600}}>🏃 {d}</span>
          <input type="number" min="0" step="0.5" value={getPrice(d)} onChange={e=>updatePrice(d,e.target.value)} placeholder="0" style={{...css.input,width:"100px"}}/>
          <span style={{color:T.textMid,fontSize:"13px"}}>€</span>
        </div>
      ))}
    </div>
  </F>;
}

// ─── PERKS PICKER (παροχές) ───────────────────────────────────────────────────
function PerksPicker({perks,onChange}){
  const [custom,setCustom]=useState("");
  function toggle(p){perks.includes(p)?onChange(perks.filter(x=>x!==p)):onChange([...perks,p]);}
  function addCustom(){if(custom.trim()&&!perks.includes(custom.trim())){onChange([...perks,custom.trim()]);setCustom("");}}
  
  return <F label="🎁 Παροχές που Περιλαμβάνονται">
    <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"10px"}}>
      {SUGGESTED_PERKS.map(p=>(
        <button key={p} onClick={()=>toggle(p)} style={{background:perks.includes(p)?T.accent:T.bgAlt,color:perks.includes(p)?"#fff":T.textMid,border:`1px solid ${perks.includes(p)?T.accent:T.border}`,borderRadius:"6px",padding:"6px 12px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>{p}</button>
      ))}
    </div>
    <div style={{display:"flex",gap:"8px"}}>
      <input value={custom} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustom()} placeholder="Ή πρόσθεσε δική σου παροχή" style={{...css.input,flex:1}}/>
      <button onClick={addCustom} style={{background:T.accent,color:"#fff",border:"none",borderRadius:"8px",padding:"0 16px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,whiteSpace:"nowrap"}}>+ Προσθήκη</button>
    </div>
    {perks.filter(p=>!SUGGESTED_PERKS.includes(p)).length>0&&(
      <div style={{marginTop:"10px",display:"flex",gap:"6px",flexWrap:"wrap"}}>
        {perks.filter(p=>!SUGGESTED_PERKS.includes(p)).map((p,i)=>(
          <span key={i} style={{background:`${T.accent}15`,border:`1px solid ${T.accent}33`,borderRadius:"6px",padding:"4px 10px",fontSize:"13px",color:T.text,display:"flex",alignItems:"center",gap:"6px"}}>
            {p}
            <button onClick={()=>toggle(p)} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",fontSize:"16px",padding:0,lineHeight:1}}>×</button>
          </span>
        ))}
      </div>
    )}
  </F>;
}

// ─── EARLY BIRD PICKER ────────────────────────────────────────────────────────
function EarlyBirdPicker({earlyBird,onChange}){
  const [enabled,setEnabled]=useState(!!earlyBird);
  function update(field,value){
    if(!enabled)return;
    onChange({...earlyBird,[field]:value});
  }
  function toggleEnabled(e){
    const checked=e.target.checked;
    setEnabled(checked);
    if(checked){onChange({deadline:"",discount_percent:10});} else {onChange(null);}
  }
  
  return <F label="⏰ Early Bird Discount">
    <label style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",marginBottom:"10px",fontSize:"13px",color:T.text}}>
      <input type="checkbox" checked={enabled} onChange={toggleEnabled}/>
      Ενεργοποίηση Early Bird (έκπτωση για όσους εγγραφούν νωρίς)
    </label>
    {enabled&&earlyBird&&(
      <div style={{background:`${T.warning}10`,border:`1px solid ${T.warning}44`,borderRadius:"8px",padding:"14px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
          <div>
            <label style={{...css.label,marginBottom:"4px"}}>Λήξη Early Bird</label>
            <input type="date" value={earlyBird.deadline||""} onChange={e=>update("deadline",e.target.value)} style={css.input}/>
          </div>
          <div>
            <label style={{...css.label,marginBottom:"4px"}}>Έκπτωση (%)</label>
            <input type="number" min="1" max="99" value={earlyBird.discount_percent||10} onChange={e=>update("discount_percent",parseInt(e.target.value)||0)} style={css.input}/>
          </div>
        </div>
      </div>
    )}
  </F>;
}

// ─── CUSTOM FIELDS PICKER ─────────────────────────────────────────────────────
function CustomFieldsPicker({fields,onChange}){
  const [newField,setNewField]=useState({label:"",type:"text",required:false,options:""});
  
  function addField(){
    if(!newField.label.trim())return;
    const f={...newField,id:Date.now().toString()};
    if(f.type==="select"){f.options=newField.options.split(",").map(x=>x.trim()).filter(Boolean);} else {delete f.options;}
    onChange([...fields,f]);
    setNewField({label:"",type:"text",required:false,options:""});
  }
  function removeField(id){onChange(fields.filter(f=>f.id!==id));}
  
  return <F label="✨ Custom Πεδία Εγγραφής (προαιρετικά)">
    <div style={{color:T.textMid,fontSize:"12px",marginBottom:"10px"}}>
      Πρόσθεσε επιπλέον πεδία που θέλεις να συμπληρώσουν οι αθλητές κατά την εγγραφή.
    </div>
    {fields.length>0&&(
      <div style={{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"12px"}}>
        {fields.map(f=>(
          <div key={f.id} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"10px 14px",display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{flex:1}}>
              <div style={{color:T.text,fontSize:"13px",fontWeight:600}}>{f.label}{f.required&&" *"}</div>
              <div style={{color:T.textLight,fontSize:"11px"}}>
                {f.type==="text"&&"Κείμενο"}
                {f.type==="number"&&"Αριθμός"}
                {f.type==="checkbox"&&"Ναι/Όχι"}
                {f.type==="select"&&`Επιλογές: ${(f.options||[]).join(", ")}`}
              </div>
            </div>
            <button onClick={()=>removeField(f.id)} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",fontSize:"18px"}}>×</button>
          </div>
        ))}
      </div>
    )}
    <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"14px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 140px",gap:"10px",marginBottom:"10px"}}>
        <input value={newField.label} onChange={e=>setNewField({...newField,label:e.target.value})} placeholder="Ετικέτα πεδίου π.χ. Μέγεθος παπουτσιού" style={css.input}/>
        <select value={newField.type} onChange={e=>setNewField({...newField,type:e.target.value})} style={css.input}>
          <option value="text">📝 Κείμενο</option>
          <option value="number">🔢 Αριθμός</option>
          <option value="checkbox">☑️ Ναι/Όχι</option>
          <option value="select">📋 Επιλογές</option>
        </select>
      </div>
      {newField.type==="select"&&(
        <input value={newField.options} onChange={e=>setNewField({...newField,options:e.target.value})} placeholder="Επιλογές χωρισμένες με κόμμα π.χ. 38,39,40,41,42" style={{...css.input,marginBottom:"10px"}}/>
      )}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <label style={{display:"flex",alignItems:"center",gap:"6px",cursor:"pointer",fontSize:"12px",color:T.textMid}}>
          <input type="checkbox" checked={newField.required} onChange={e=>setNewField({...newField,required:e.target.checked})}/>
          Υποχρεωτικό
        </label>
        <Btn sm onClick={addField}>+ Προσθήκη Πεδίου</Btn>
      </div>
    </div>
  </F>;
}

// ─── LOGIN ──────────────────────────────────────────────────────────────────────
function LoginPage(){
  const [step,setStep]=useState("role");
  const [role,setRole]=useState(null);
  const [mode,setMode]=useState("signup");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  function selectRole(r){setRole(r);setStep("auth");setError("");}
  function backToRole(){setStep("role");setRole(null);setError("");setEmail("");setPassword("");setName("");}

  async function handleSubmit(){
    setError("");
    if(!email||!password){setError("Συμπληρώστε email και κωδικό!");return;}
    if(mode==="signup"&&!name){setError("Συμπληρώστε ονοματεπώνυμο!");return;}
    setLoading(true);

    if(mode==="login"){
      const {error}=await supabase.auth.signInWithPassword({email,password});
      if(error)setError("Λάθος email ή κωδικός!");
      setLoading(false);
      return;
    }

    const {data,error}=await supabase.auth.signUp({email,password});
    if(error){setError(error.message);setLoading(false);return;}
    if(data.user){
      const initialStatus = role === "organizer" ? "pending" : "approved";
      await supabase.from("profiles").insert([{id:data.user.id,email,full_name:name,role:role,status:initialStatus}]);
      if(role === "organizer"){
        setError("✅ Εγγραφή επιτυχής! Ο λογαριασμός σας θα ενεργοποιηθεί μετά από έγκριση admin.");
      } else {
        setError("✅ Ελέγξτε το email σας για επιβεβαίωση!");
      }
    }
    setLoading(false);
  }

  const roleColor=role==="organizer"?T.primary:T.accent;
  const roleIcon=role==="organizer"?"🏟":"🏃";
  const roleLabel=role==="organizer"?"Διοργανωτής":"Αθλητής";

  return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif",padding:"20px"}}>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"20px",padding:"40px",width:"100%",maxWidth:"460px",boxShadow:T.shadow}}>
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <div style={{width:"60px",height:"60px",background:T.primary,borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",margin:"0 auto 16px"}}>🏃</div>
        <h1 style={{color:T.text,fontSize:"22px",fontWeight:900,margin:"0 0 4px"}}>Race Management</h1>
        <p style={{color:T.textMid,fontSize:"13px",margin:0}}>Πλατφόρμα Διαχείρισης Αγώνων</p>
      </div>

      {step==="role"&&(
        <div>
          <h3 style={{color:T.text,textAlign:"center",fontSize:"15px",marginBottom:"6px",fontWeight:600}}>Καλώς ήρθες! 👋</h3>
          <p style={{color:T.textMid,textAlign:"center",fontSize:"13px",marginBottom:"24px"}}>Διάλεξε τον ρόλο σου για να συνεχίσεις</p>
          <button onClick={()=>selectRole("organizer")} style={{width:"100%",background:T.primary,color:"#fff",border:"none",borderRadius:"12px",padding:"20px",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:"12px",textAlign:"left",display:"flex",alignItems:"center",gap:"16px",boxShadow:T.shadow}}>
            <span style={{fontSize:"32px"}}>🏟</span>
            <div><div style={{fontSize:"16px",marginBottom:"3px"}}>Είμαι Διοργανωτής</div><div style={{fontSize:"12px",fontWeight:400,opacity:0.9}}>Δημιουργώ & διαχειρίζομαι αγώνες</div></div>
          </button>
          <button onClick={()=>selectRole("athlete")} style={{width:"100%",background:T.accent,color:"#fff",border:"none",borderRadius:"12px",padding:"20px",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:"16px",boxShadow:T.shadow}}>
            <span style={{fontSize:"32px"}}>🏃</span>
            <div><div style={{fontSize:"16px",marginBottom:"3px"}}>Είμαι Αθλητής</div><div style={{fontSize:"12px",fontWeight:400,opacity:0.9}}>Βλέπω αγώνες & εγγράφομαι</div></div>
          </button>
        </div>
      )}

      {step==="auth"&&(
        <div>
          <div style={{textAlign:"center",marginBottom:"20px"}}>
            <span style={{background:`${roleColor}15`,color:roleColor,border:`1px solid ${roleColor}44`,borderRadius:"99px",padding:"6px 16px",fontSize:"13px",fontWeight:700}}>{roleIcon} {roleLabel}</span>
          </div>
          <div style={{display:"flex",background:T.bg,borderRadius:"10px",padding:"4px",marginBottom:"24px",border:`1px solid ${T.border}`}}>
            <button onClick={()=>{setMode("signup");setError("");}} style={{flex:1,background:mode==="signup"?roleColor:"none",color:mode==="signup"?"#fff":T.textMid,border:"none",borderRadius:"8px",padding:"10px",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✨ Νέα Εγγραφή</button>
            <button onClick={()=>{setMode("login");setError("");}} style={{flex:1,background:mode==="login"?roleColor:"none",color:mode==="login"?"#fff":T.textMid,border:"none",borderRadius:"8px",padding:"10px",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🔑 Σύνδεση</button>
          </div>
          {mode==="signup"&&role==="organizer"&&(
            <div style={{background:`${T.warning}15`,border:`1px solid ${T.warning}44`,borderRadius:"8px",padding:"10px 14px",color:T.warning,fontSize:"12px",marginBottom:"16px",lineHeight:"1.5"}}>⚠️ Ο λογαριασμός Διοργανωτή χρειάζεται έγκριση από admin πριν ενεργοποιηθεί.</div>
          )}
          {mode==="signup"&&<div style={{marginBottom:"14px"}}><label style={css.label}>Ονοματεπώνυμο</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="π.χ. Γιώργος Παπαδόπουλος" style={css.input}/></div>}
          <div style={{marginBottom:"14px"}}><label style={css.label}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={css.input}/></div>
          <div style={{marginBottom:"20px"}}><label style={css.label}>Κωδικός</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={css.input}/></div>
          {error&&<div style={{background:error.startsWith("✅")?`${T.accent}15`:`${T.danger}15`,border:`1px solid ${error.startsWith("✅")?T.accent+"44":T.danger+"44"}`,borderRadius:"8px",padding:"10px 14px",color:error.startsWith("✅")?T.accent:T.danger,fontSize:"13px",marginBottom:"16px",lineHeight:"1.5"}}>{error}</div>}
          <button onClick={handleSubmit} disabled={loading} style={{width:"100%",background:roleColor,color:"#fff",border:"none",borderRadius:"10px",padding:"14px",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:"12px",opacity:loading?0.6:1,boxShadow:T.shadow}}>{loading?"...":(mode==="signup"?`✨ Εγγραφή ως ${roleLabel}`:`🔑 Σύνδεση`)}</button>
          <button onClick={backToRole} style={{width:"100%",background:"none",border:`1px solid ${T.border}`,color:T.textMid,borderRadius:"10px",padding:"10px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>← Αλλαγή ρόλου</button>
        </div>
      )}
    </div>
  </div>;
}

// ─── ΥΠΟΛΟΓΙΣΜΟΣ ΤΙΜΗΣ ─────────────────────────────────────────────────────────
function calculatePrice(race,distance){
  const basePrice=(race.pricing||[]).find(p=>p.distance===distance)?.price||0;
  if(!race.early_bird||!race.early_bird.deadline)return{base:basePrice,final:basePrice,isEarlyBird:false};
  const now=new Date();
  const deadline=new Date(race.early_bird.deadline);
  if(now<=deadline){
    const discount=race.early_bird.discount_percent||0;
    const final=basePrice*(1-discount/100);
    return{base:basePrice,final:final,isEarlyBird:true,discount:discount,deadline:race.early_bird.deadline};
  }
  return{base:basePrice,final:basePrice,isEarlyBird:false};
}

// ─── ΑΘΛΗΤΗΣ - ΚΑΡΤΑ ΑΓΩΝΑ ────────────────────────────────────────────────────
function AthleteRaceCard({race,registrations,runners,session,onRegister}){
  const myReg=registrations.find(r=>r.race_id===race.id&&runners.find(rn=>rn.id===r.runner_id)?.email===session.user.email);
  const totalRegs=registrations.filter(r=>r.race_id===race.id).length;
  const distances=race.distance?race.distance.split(" | "):[];
  const statusColors={upcoming:T.warning,active:T.accent,finished:T.textLight};
  const statusLabels={upcoming:"ΠΡΟΣΕΧΩΣ",active:"ΕΝΕΡΓΟΣ",finished:"ΟΛΟΚΛΗΡΩΘΗΚΕ"};
  const hasEarlyBird=race.early_bird&&race.early_bird.deadline&&new Date()<=new Date(race.early_bird.deadline);

  return <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"20px 24px",boxShadow:T.shadow}}>
    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px",flexWrap:"wrap"}}>
      <span style={{color:T.text,fontWeight:700,fontSize:"16px"}}>{race.name}</span>
      <span style={{background:`${statusColors[race.status]}15`,color:statusColors[race.status],border:`1px solid ${statusColors[race.status]}44`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px",fontWeight:600}}>{statusLabels[race.status]}</span>
      {hasEarlyBird&&<span style={{background:`${T.warning}20`,color:T.warning,border:`1px solid ${T.warning}55`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px",fontWeight:700}}>🏷️ EARLY BIRD -{race.early_bird.discount_percent}%</span>}
      {myReg&&<span style={{background:`${T.accent}15`,color:T.accent,border:`1px solid ${T.accent}44`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px",fontWeight:700}}>✓ ΕΓΓΕΓΡΑΜΜΕΝΟΣ</span>}
    </div>
    <div style={{color:T.textMid,fontSize:"13px",lineHeight:"1.8",marginBottom:"10px"}}>
      📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 👤 {totalRegs} εγγεγραμμένοι
      {race.description&&<><br/>💬 {race.description}</>}
    </div>
    {distances.length>0&&(
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"10px"}}>
        {distances.map((d,i)=>{
          const pr=calculatePrice(race,d);
          return <span key={i} style={{background:`${T.primary}12`,border:`1px solid ${T.primary}33`,borderRadius:"6px",padding:"3px 10px",fontSize:"12px",color:T.primary,fontWeight:500}}>
            🏃 {d}{pr.base>0&&(pr.isEarlyBird?<> · <s style={{opacity:0.5}}>{pr.base}€</s> <strong style={{color:T.warning}}>{pr.final.toFixed(2)}€</strong></>:` · ${pr.base}€`)}
          </span>;
        })}
      </div>
    )}
    {(race.perks||[]).length>0&&(
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
        {race.perks.map((p,i)=>(
          <span key={i} style={{background:`${T.accent}12`,border:`1px solid ${T.accent}33`,borderRadius:"6px",padding:"3px 10px",fontSize:"12px",color:T.accent}}>{p}</span>
        ))}
      </div>
    )}
    {myReg?(
      <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:`${T.accent}10`,borderRadius:"8px",border:`1px solid ${T.accent}33`}}>
        <span style={{background:T.accent,color:"#fff",borderRadius:"6px",padding:"2px 8px",fontWeight:700,fontSize:"13px"}}>#{myReg.bib_number}</span>
        <span style={{color:T.accentDark,fontSize:"13px"}}>Είσαι ήδη εγγεγραμμένος! Διαδρομή: {myReg.distance||"—"}</span>
      </div>
    ):race.status==="upcoming"&&(<Btn onClick={()=>onRegister(race)}>+ Εγγραφή στον Αγώνα</Btn>)}
  </div>;
}

// ─── ΑΘΛΗΤΗΣ - FORM ΕΓΓΡΑΦΗΣ ──────────────────────────────────────────────────
function AthleteRegistrationForm({race,profile,session,onClose,onSuccess}){
  const distances=race.distance?race.distance.split(" | "):[];
  const customFields=race.custom_fields||[];
  const [form,setForm]=useState({distance:distances[0]||"",category:"Γενική",tshirt:"M",phone:"",dob:"",gender:"Άνδρας",club:"",medical_cert:false});
  const [customAnswers,setCustomAnswers]=useState({});
  const [loading,setLoading]=useState(false);

  const priceInfo=calculatePrice(race,form.distance);

  function updateCustom(id,value){setCustomAnswers({...customAnswers,[id]:value});}

  async function submit(){
    if(!form.distance){alert("Επιλέξτε διαδρομή!");return;}
    for(const f of customFields){
      if(f.required&&!customAnswers[f.id]&&customAnswers[f.id]!==false){alert(`Συμπληρώστε: ${f.label}`);return;}
    }
    setLoading(true);
    const fullName=(profile?.full_name||"").trim().split(" ");
    const firstName=fullName[0]||"";
    const lastName=fullName.slice(1).join(" ")||"";
    
    let {data:runner}=await supabase.from("runners").select("*").eq("email",session.user.email).single();
    if(!runner){
      const {data}=await supabase.from("runners").insert([{first_name:firstName,last_name:lastName,email:session.user.email,phone:form.phone,dob:form.dob,gender:form.gender,club:form.club}]).select();
      if(data)runner=data[0];
    }
    if(!runner){setLoading(false);return;}
    
    const {data:existing}=await supabase.from("registrations").select("*").eq("runner_id",runner.id).eq("race_id",race.id);
    if(existing&&existing.length>0){alert("Είσαι ήδη εγγεγραμμένος!");setLoading(false);return;}
    
    const {data:allRegs}=await supabase.from("registrations").select("bib_number").eq("race_id",race.id);
    const maxBib=(allRegs||[]).reduce((mx,r)=>Math.max(mx,parseInt(r.bib_number)||0),0);
    
    await supabase.from("registrations").insert([{
      runner_id:runner.id,race_id:race.id,distance:form.distance,
      category:form.category,tshirt:form.tshirt,medical_cert:form.medical_cert,
      bib_number:(maxBib+1).toString(),
      custom_answers:customAnswers,
      price_paid:priceInfo.final
    }]);
    setLoading(false);
    onSuccess();
  }

  return <Modal title={`Εγγραφή στον ${race.name}`} onClose={onClose} wide>
    <Sel label="Διαδρομή *" value={form.distance} onChange={e=>setForm({...form,distance:e.target.value})}>
      {distances.map(d=><option key={d} value={d}>{d}</option>)}
    </Sel>
    
    {priceInfo.base>0&&(
      <div style={{background:priceInfo.isEarlyBird?`${T.warning}10`:T.bg,border:`1px solid ${priceInfo.isEarlyBird?T.warning+"44":T.border}`,borderRadius:"10px",padding:"14px 18px",marginBottom:"14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:"11px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>💰 Κόστος Συμμετοχής</div>
            {priceInfo.isEarlyBird&&<div style={{fontSize:"11px",color:T.warning,marginTop:"2px",fontWeight:600}}>🏷️ Early Bird έκπτωση -{priceInfo.discount}%</div>}
          </div>
          <div style={{textAlign:"right"}}>
            {priceInfo.isEarlyBird&&<div style={{fontSize:"13px",color:T.textLight,textDecoration:"line-through"}}>{priceInfo.base.toFixed(2)}€</div>}
            <div style={{fontSize:"22px",fontWeight:900,color:priceInfo.isEarlyBird?T.warning:T.text}}>{priceInfo.final.toFixed(2)}€</div>
          </div>
        </div>
      </div>
    )}
    
    <Sel label="Κατηγορία" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</Sel>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
      <Sel label="T-Shirt" value={form.tshirt} onChange={e=>setForm({...form,tshirt:e.target.value})}>{TSHIRTS.map(t=><option key={t}>{t}</option>)}</Sel>
      <In label="Τηλέφωνο" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
      <In label="Ημ. Γέννησης" type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})}/>
      <Sel label="Φύλο" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option>Άνδρας</option><option>Γυναίκα</option><option>Άλλο</option></Sel>
    </div>
    <In label="Σύλλογος" value={form.club} onChange={e=>setForm({...form,club:e.target.value})} placeholder="Προαιρετικό"/>
    
    {customFields.length>0&&(
      <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"16px",marginBottom:"14px"}}>
        <div style={{color:T.text,fontSize:"13px",fontWeight:700,marginBottom:"12px"}}>✨ Επιπλέον Στοιχεία</div>
        {customFields.map(f=>(
          <div key={f.id} style={{marginBottom:"12px"}}>
            <label style={css.label}>{f.label}{f.required&&" *"}</label>
            {f.type==="text"&&<input value={customAnswers[f.id]||""} onChange={e=>updateCustom(f.id,e.target.value)} style={css.input}/>}
            {f.type==="number"&&<input type="number" value={customAnswers[f.id]||""} onChange={e=>updateCustom(f.id,e.target.value)} style={css.input}/>}
            {f.type==="checkbox"&&<label style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",color:T.text}}><input type="checkbox" checked={!!customAnswers[f.id]} onChange={e=>updateCustom(f.id,e.target.checked)}/>Ναι</label>}
            {f.type==="select"&&<select value={customAnswers[f.id]||""} onChange={e=>updateCustom(f.id,e.target.value)} style={css.input}><option value="">— Επιλέξτε —</option>{(f.options||[]).map(o=><option key={o} value={o}>{o}</option>)}</select>}
          </div>
        ))}
      </div>
    )}
    
    <label style={{display:"flex",alignItems:"center",gap:"8px",color:T.textMid,fontSize:"13px",cursor:"pointer",marginBottom:"16px"}}>
      <input type="checkbox" checked={form.medical_cert} onChange={e=>setForm({...form,medical_cert:e.target.checked})}/>
      Έχω ιατρική βεβαίωση καταλληλότητας
    </label>
    <div style={{display:"flex",gap:"10px"}}>
      <Btn onClick={submit} style={{flex:1}} disabled={loading}>{loading?"...":`Επιβεβαίωση Εγγραφής${priceInfo.final>0?` (${priceInfo.final.toFixed(2)}€)`:""}`}</Btn>
      <Btn v="sec" onClick={onClose} style={{flex:1}}>Άκυρο</Btn>
    </div>
  </Modal>;
}

// ─── ΑΘΛΗΤΗΣ DASHBOARD ─────────────────────────────────────────────────────────
function AthleteDashboard({races,registrations,runners,profile,session,onRefresh}){
  const [registerRace,setRegisterRace]=useState(null);
  const [tab,setTab]=useState("available");

  const myRunner=runners.find(r=>r.email===session.user.email);
  const myRegs=myRunner?registrations.filter(r=>r.runner_id===myRunner.id):[];
  const myRaceIds=myRegs.map(r=>r.race_id);
  const availableRaces=races.filter(r=>r.status==="upcoming");
  const myRaces=races.filter(r=>myRaceIds.includes(r.id));

  return <div>
    <div style={{display:"flex",gap:"6px",marginBottom:"24px",flexWrap:"wrap"}}>
      <button onClick={()=>setTab("available")} style={{background:tab==="available"?T.primary:T.bgAlt,color:tab==="available"?"#fff":T.textMid,border:`1px solid ${tab==="available"?T.primary:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="available"?700:500,fontFamily:"inherit"}}>🏟 Διαθέσιμοι Αγώνες ({availableRaces.length})</button>
      <button onClick={()=>setTab("my")} style={{background:tab==="my"?T.primary:T.bgAlt,color:tab==="my"?"#fff":T.textMid,border:`1px solid ${tab==="my"?T.primary:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="my"?700:500,fontFamily:"inherit"}}>📋 Οι Εγγραφές μου ({myRaces.length})</button>
    </div>

    {tab==="available"&&(<div>
      <h2 style={{margin:"0 0 16px",color:T.text,fontSize:"18px"}}>Διαθέσιμοι Αγώνες</h2>
      {availableRaces.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>Δεν υπάρχουν διαθέσιμοι αγώνες</div>}
      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
        {availableRaces.map(race=>(<AthleteRaceCard key={race.id} race={race} registrations={registrations} runners={runners} session={session} onRegister={setRegisterRace}/>))}
      </div>
    </div>)}

    {tab==="my"&&(<div>
      <h2 style={{margin:"0 0 16px",color:T.text,fontSize:"18px"}}>Οι Εγγραφές μου</h2>
      {myRaces.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>Δεν έχεις εγγραφές ακόμα</div>}
      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
        {myRaces.map(race=>{
          const reg=myRegs.find(r=>r.race_id===race.id);
          return <div key={race.id} style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"20px 24px",boxShadow:T.shadow}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px",flexWrap:"wrap"}}>
              <span style={{background:T.accent,color:"#fff",borderRadius:"8px",padding:"4px 12px",fontWeight:700,fontSize:"15px"}}>#{reg.bib_number}</span>
              <span style={{color:T.text,fontWeight:700,fontSize:"16px"}}>{race.name}</span>
              {reg.price_paid>0&&<span style={{color:T.accent,fontSize:"13px",fontWeight:600}}>💰 {parseFloat(reg.price_paid).toFixed(2)}€</span>}
            </div>
            <div style={{color:T.textMid,fontSize:"13px",lineHeight:"1.8"}}>
              📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 🏃 {reg.distance||"—"}<br/>
              Κατηγορία: {reg.category} · T-shirt: {reg.tshirt}{reg.medical_cert?" · ✅ Ιατρική":""}
            </div>
          </div>;
        })}
      </div>
    </div>)}

    {registerRace&&<AthleteRegistrationForm race={registerRace} profile={profile} session={session} onClose={()=>setRegisterRace(null)} onSuccess={()=>{setRegisterRace(null);onRefresh();}}/>}
  </div>;
}

// ─── ΔΙΟΡΓΑΝΩΤΗΣ - ΑΓΩΝΕΣ ──────────────────────────────────────────────────────
function OrganizerRaces({races,setRaces,runners,registrations,session,profile}){
  const [showForm,setShowForm]=useState(false);
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({name:"",date:"",location:"",distances:[],max_runners:"",description:"",pricing:[],perks:[],early_bird:null,custom_fields:[]});

  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);

  function resetForm(){setForm({name:"",date:"",location:"",distances:[],max_runners:"",description:"",pricing:[],perks:[],early_bird:null,custom_fields:[]});}

  async function add(){
    if(!form.name||!form.date){alert("Συμπληρώστε όνομα και ημερομηνία!");return;}
    if(form.distances.length===0){alert("Προσθέστε τουλάχιστον μία διαδρομή!");return;}
    setLoading(true);
    const validPricing=form.pricing.filter(p=>form.distances.includes(p.distance));
    const {data}=await supabase.from("races").insert([{
      name:form.name,date:form.date,location:form.location,
      distance:form.distances.join(" | "),description:form.description,
      max_runners:form.max_runners?parseInt(form.max_runners):null,
      status:"upcoming",user_id:session.user.id,
      pricing:validPricing,perks:form.perks,
      early_bird:form.early_bird,custom_fields:form.custom_fields
    }]).select();
    if(data)setRaces([data[0],...races]);
    setLoading(false);setShowForm(false);resetForm();
  }

  async function del(id){
    if(!confirm("Διαγραφή αγώνα;"))return;
    await supabase.from("races").delete().eq("id",id);
    setRaces(races.filter(r=>r.id!==id));
  }

  async function toggleStatus(race){
    const s=["upcoming","active","finished"];
    const ns=s[(s.indexOf(race.status)+1)%s.length];
    await supabase.from("races").update({status:ns}).eq("id",race.id);
    setRaces(races.map(r=>r.id===race.id?{...r,status:ns}:r));
  }

  function exportCSV(race){
    const regs=registrations.filter(r=>r.race_id===race.id);
    if(!regs.length){alert("Δεν υπάρχουν εγγραφές!");return;}
    const customFieldLabels=(race.custom_fields||[]).map(f=>f.label);
    const headers=["Α/Α","BIB","Όνομα","Επώνυμο","Email","Τηλέφωνο","Διαδρομή","Κατηγορία","T-Shirt","Σύλλογος","Ιατρική","Τιμή",...customFieldLabels];
    const rows=regs.map((reg,i)=>{
      const r=runners.find(x=>x.id===reg.runner_id)||{};
      const customVals=(race.custom_fields||[]).map(f=>{const v=(reg.custom_answers||{})[f.id];return v===true?"ΝΑΙ":v===false?"ΟΧΙ":v||"";});
      return[i+1,reg.bib_number,r.first_name,r.last_name,r.email,r.phone||"",reg.distance||"",reg.category,reg.tshirt,r.club||"",reg.medical_cert?"ΝΑΙ":"ΟΧΙ",reg.price_paid||0,...customVals].join(",");
    });
    const csv=headers.join(",")+"\n"+rows.join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}));a.download=`${race.name.replace(/\s+/g,"-")}.csv`;a.click();
  }

  const statusColors={upcoming:T.warning,active:T.accent,finished:T.textLight};
  const statusLabels={upcoming:"ΠΡΟΣΕΧΩΣ",active:"ΕΝΕΡΓΟΣ",finished:"ΟΛΟΚΛΗΡΩΘΗΚΕ"};

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
      <h2 style={{margin:0,color:T.text,fontSize:"20px"}}>Οι Αγώνες μου {isAdmin&&<span style={{color:T.textMid,fontSize:"13px"}}>(admin — όλοι)</span>}</h2>
      <Btn onClick={()=>setShowForm(true)}>+ Νέος Αγώνας</Btn>
    </div>
    {myRaces.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>Δεν έχεις δημιουργήσει αγώνες ακόμα!</div>}
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      {myRaces.map(race=>{
        const regCount=registrations.filter(r=>r.race_id===race.id).length;
        const distances=race.distance?race.distance.split(" | "):[];
        const totalRevenue=registrations.filter(r=>r.race_id===race.id).reduce((sum,r)=>sum+(parseFloat(r.price_paid)||0),0);
        return <div key={race.id} style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"20px 24px",boxShadow:T.shadow}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px",flexWrap:"wrap"}}>
            <span style={{color:T.text,fontWeight:700,fontSize:"16px"}}>{race.name}</span>
            <span style={{background:`${statusColors[race.status]}15`,color:statusColors[race.status],border:`1px solid ${statusColors[race.status]}44`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px",fontWeight:600}}>{statusLabels[race.status]}</span>
          </div>
          <div style={{color:T.textMid,fontSize:"13px",lineHeight:"1.8",marginBottom:"10px"}}>
            📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 👤 {regCount} εγγεγραμμένοι
            {totalRevenue>0&&<> &nbsp; 💰 {totalRevenue.toFixed(2)}€ συνολικά</>}
          </div>
          {distances.length>0&&(
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
              {distances.map((d,i)=>{const pr=(race.pricing||[]).find(p=>p.distance===d);return <span key={i} style={{background:`${T.primary}12`,border:`1px solid ${T.primary}33`,borderRadius:"6px",padding:"3px 10px",fontSize:"12px",color:T.primary,fontWeight:500}}>🏃 {d}{pr?.price>0?` · ${pr.price}€`:""}</span>;})}
            </div>
          )}
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <Btn sm v="ghost" onClick={()=>toggleStatus(race)}>⟳ Κατάσταση</Btn>
            <Btn sm v="ghost" onClick={()=>exportCSV(race)}>📥 CSV</Btn>
            <Btn sm v="red" onClick={()=>del(race.id)}>✕ Διαγραφή</Btn>
          </div>
        </div>;
      })}
    </div>
    {showForm&&<Modal title="Νέος Αγώνας" onClose={()=>{setShowForm(false);resetForm();}} wide>
      <In label="Όνομα Αγώνα *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="π.χ. Armeno Gate Trail Race 2026"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label="Ημερομηνία *" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
        <In label="Τοποθεσία" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
      </div>
      <DistancesPicker distances={form.distances} onChange={d=>setForm({...form,distances:d})}/>
      <PricingPicker distances={form.distances} pricing={form.pricing} onChange={p=>setForm({...form,pricing:p})}/>
      <PerksPicker perks={form.perks} onChange={p=>setForm({...form,perks:p})}/>
      <EarlyBirdPicker earlyBird={form.early_bird} onChange={eb=>setForm({...form,early_bird:eb})}/>
      <CustomFieldsPicker fields={form.custom_fields} onChange={cf=>setForm({...form,custom_fields:cf})}/>
      <In label="Μέγ. Συμμετοχές" type="number" value={form.max_runners} onChange={e=>setForm({...form,max_runners:e.target.value})} placeholder="Κενό = απεριόριστο"/>
      <F label="Περιγραφή"><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} style={{...css.input,resize:"vertical"}}/></F>
      <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
        <Btn onClick={add} style={{flex:1}} disabled={loading}>{loading?"...":"Δημιουργία Αγώνα"}</Btn>
        <Btn v="sec" onClick={()=>{setShowForm(false);resetForm();}} style={{flex:1}}>Άκυρο</Btn>
      </div>
    </Modal>}
  </div>;
}

function OrganizerRegistrations({races,runners,registrations,session,profile}){
  const [filterRace,setFilterRace]=useState("all");
  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);
  const myRaceIds=myRaces.map(r=>r.id);
  const filtered=registrations.filter(r=>myRaceIds.includes(r.race_id)).filter(r=>filterRace==="all"||r.race_id===filterRace);
  const totalRevenue=filtered.reduce((sum,r)=>sum+(parseFloat(r.price_paid)||0),0);

  return <div>
    <h2 style={{margin:"0 0 20px",color:T.text,fontSize:"20px"}}>Εγγραφές στους Αγώνες μου ({filtered.length}){totalRevenue>0&&<span style={{color:T.accent,fontSize:"15px",marginLeft:"12px"}}>💰 Σύνολο: {totalRevenue.toFixed(2)}€</span>}</h2>
    <Sel value={filterRace} onChange={e=>setFilterRace(e.target.value)}>
      <option value="all">Όλοι οι Αγώνες</option>
      {myRaces.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
    </Sel>
    {filtered.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>Δεν υπάρχουν εγγραφές</div>}
    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {filtered.map(reg=>{
        const runner=runners.find(r=>r.id===reg.runner_id);
        const race=races.find(r=>r.id===reg.race_id);
        if(!runner||!race)return null;
        return <div key={reg.id} style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"14px 18px",display:"flex",alignItems:"center",gap:"12px",boxShadow:T.shadow}}>
          <div style={{background:T.primary,color:"#fff",borderRadius:"8px",padding:"4px 10px",fontWeight:700,fontSize:"16px"}}>#{reg.bib_number}</div>
          <div style={{flex:1}}>
            <div style={{color:T.text,fontWeight:700,fontSize:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
              {runner.first_name} {runner.last_name}
              {reg.price_paid>0&&<span style={{color:T.accent,fontSize:"12px",fontWeight:600}}>💰 {parseFloat(reg.price_paid).toFixed(2)}€</span>}
            </div>
            <div style={{color:T.textMid,fontSize:"12px"}}>{race.name}{reg.distance?` · 🏃 ${reg.distance}`:""} · {reg.category} · T-shirt: {reg.tshirt}{reg.medical_cert?" · ✅ Ιατρική":""}</div>
            <div style={{color:T.textLight,fontSize:"12px"}}>{runner.email}{runner.phone?` · ${runner.phone}`:""}</div>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

// ─── ADMIN PANEL ────────────────────────────────────────────────────────────────
function AdminPanel(){
  const [pendingOrgs,setPendingOrgs]=useState([]);
  const [allOrgs,setAllOrgs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("pending");

  async function fetchOrgs(){
    setLoading(true);
    const {data}=await supabase.from("profiles").select("*").eq("role","organizer").order("id",{ascending:false});
    if(data){setPendingOrgs(data.filter(o=>o.status==="pending"));setAllOrgs(data);}
    setLoading(false);
  }
  useEffect(()=>{fetchOrgs();},[]);

  async function approve(id){await supabase.from("profiles").update({status:"approved"}).eq("id",id);fetchOrgs();}
  async function reject(id){if(!confirm("Απόρριψη;"))return;await supabase.from("profiles").update({status:"rejected"}).eq("id",id);fetchOrgs();}
  async function makeAdmin(id){if(!confirm("Να γίνει admin;"))return;await supabase.from("profiles").update({role:"admin",status:"approved"}).eq("id",id);fetchOrgs();}

  const list=tab==="pending"?pendingOrgs:allOrgs;
  const statusColors={pending:T.warning,approved:T.accent,rejected:T.danger};
  const statusLabels={pending:"⏳ ΣΕ ΑΝΑΜΟΝΗ",approved:"✅ ΕΓΚΡΙΘΗΚΕ",rejected:"❌ ΑΠΟΡΡΙΦΘΗΚΕ"};

  if(loading)return <div style={{textAlign:"center",color:T.textMid,padding:"40px"}}>Φόρτωση...</div>;

  return <div>
    <div style={{display:"flex",gap:"6px",marginBottom:"24px",flexWrap:"wrap"}}>
      <button onClick={()=>setTab("pending")} style={{background:tab==="pending"?T.warning:T.bgAlt,color:tab==="pending"?"#fff":T.textMid,border:`1px solid ${tab==="pending"?T.warning:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="pending"?700:500,fontFamily:"inherit"}}>⏳ Σε Αναμονή ({pendingOrgs.length})</button>
      <button onClick={()=>setTab("all")} style={{background:tab==="all"?T.primary:T.bgAlt,color:tab==="all"?"#fff":T.textMid,border:`1px solid ${tab==="all"?T.primary:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="all"?700:500,fontFamily:"inherit"}}>👥 Όλοι ({allOrgs.length})</button>
    </div>
    <h2 style={{margin:"0 0 16px",color:T.text,fontSize:"18px"}}>{tab==="pending"?"Διοργανωτές σε Αναμονή":"Όλοι οι Διοργανωτές"}</h2>
    {list.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>{tab==="pending"?"🎉 Δεν υπάρχουν σε αναμονή!":"—"}</div>}
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      {list.map(org=>(
        <div key={org.id} style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"20px 24px",boxShadow:T.shadow}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px",flexWrap:"wrap"}}>
            <span style={{color:T.text,fontWeight:700,fontSize:"16px"}}>🏟 {org.full_name||"—"}</span>
            <span style={{background:`${statusColors[org.status]}15`,color:statusColors[org.status],border:`1px solid ${statusColors[org.status]}44`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px",fontWeight:700}}>{statusLabels[org.status]}</span>
          </div>
          <div style={{color:T.textMid,fontSize:"13px",lineHeight:"1.8",marginBottom:"12px"}}>📧 {org.email}</div>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {org.status==="pending"&&<><Btn sm v="grn" onClick={()=>approve(org.id)}>✅ Έγκριση</Btn><Btn sm v="red" onClick={()=>reject(org.id)}>❌ Απόρριψη</Btn></>}
            {org.status==="rejected"&&<Btn sm v="grn" onClick={()=>approve(org.id)}>✅ Επανέγκριση</Btn>}
            {org.status==="approved"&&<Btn sm v="ghost" onClick={()=>makeAdmin(org.id)}>👑 Κάντον Admin</Btn>}
          </div>
        </div>
      ))}
    </div>
  </div>;
}

// ─── MAIN ───────────────────────────────────────────────────────────────────────
export default function App(){
  const [session,setSession]=useState(null);
  const [profile,setProfile]=useState(null);
  const [tab,setTab]=useState("races");
  const [races,setRaces]=useState([]);
  const [runners,setRunners]=useState([]);
  const [registrations,setRegistrations]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>setSession(session));
    supabase.auth.onAuthStateChange((_,session)=>setSession(session));
  },[]);

  async function fetchAll(){
    if(!session)return;
    const [r1,r2,r3,r4]=await Promise.all([
      supabase.from("races").select("*").order("created_at",{ascending:false}),
      supabase.from("runners").select("*"),
      supabase.from("registrations").select("*"),
      supabase.from("profiles").select("*").eq("id",session.user.id).single(),
    ]);
    if(r1.data)setRaces(r1.data);
    if(r2.data)setRunners(r2.data);
    if(r3.data)setRegistrations(r3.data);
    if(r4.data)setProfile(r4.data);
    setLoading(false);
  }

  useEffect(()=>{
    if(!session){setLoading(false);return;}
    fetchAll();
  },[session]);

  if(!session)return <LoginPage/>;
  if(loading)return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.primary,fontFamily:"Inter,sans-serif"}}>Φόρτωση...</div>;

  const isAthlete=profile?.role==="athlete";
  const isOrganizer=(profile?.role==="organizer"||profile?.role==="admin")&&profile?.status==="approved";
  const isPendingOrganizer=profile?.role==="organizer"&&profile?.status==="pending";
  const isRejectedOrganizer=profile?.role==="organizer"&&profile?.status==="rejected";
  const isAdmin=profile?.role==="admin";

  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Inter,sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
    <div style={{borderBottom:`1px solid ${T.border}`,padding:"16px 24px",background:T.bgAlt,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        <div style={{width:"36px",height:"36px",background:isAthlete?T.accent:T.primary,borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>🏃</div>
        <div>
          <div style={{color:T.text,fontWeight:700,fontSize:"16px"}}>Race Management</div>
          <div style={{color:T.textLight,fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase"}}>{isAthlete?"ΠΑΝΕΛ ΑΘΛΗΤΗ":"ΔΙΑΧΕΙΡΙΣΗ ΑΓΩΝΩΝ"}</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
        <span style={{color:T.textMid,fontSize:"13px"}}>{profile?.full_name||session.user.email}</span>
        {profile?.role==="admin"&&<span style={{background:`${T.warning}15`,color:T.warning,border:`1px solid ${T.warning}44`,borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>👑 ADMIN</span>}
        {profile?.role==="organizer"&&profile?.status==="approved"&&<span style={{background:`${T.primary}15`,color:T.primary,border:`1px solid ${T.primary}44`,borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>ΔΙΟΡΓΑΝΩΤΗΣ</span>}
        {profile?.role==="organizer"&&profile?.status==="pending"&&<span style={{background:`${T.warning}15`,color:T.warning,border:`1px solid ${T.warning}44`,borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>⏳ ΣΕ ΑΝΑΜΟΝΗ</span>}
        {profile?.role==="athlete"&&<span style={{background:`${T.accent}15`,color:T.accent,border:`1px solid ${T.accent}44`,borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>ΑΘΛΗΤΗΣ</span>}
        <button onClick={()=>supabase.auth.signOut()} style={{background:`${T.danger}15`,color:T.danger,border:`1px solid ${T.danger}33`,borderRadius:"8px",padding:"6px 12px",cursor:"pointer",fontSize:"12px",fontFamily:"inherit"}}>Αποσύνδεση</button>
      </div>
    </div>

    {isPendingOrganizer&&(<div style={{padding:"40px 28px",maxWidth:"640px",margin:"40px auto"}}>
      <div style={{background:T.bgAlt,border:`1px solid ${T.warning}44`,borderRadius:"16px",padding:"40px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"64px",marginBottom:"20px"}}>⏳</div>
        <h2 style={{color:T.warning,fontSize:"22px",margin:"0 0 12px"}}>Λογαριασμός σε Αναμονή</h2>
        <p style={{color:T.text,fontSize:"15px",lineHeight:"1.7",margin:"0 0 8px"}}>Ο λογαριασμός σας ως <strong>Διοργανωτής</strong> έχει δημιουργηθεί επιτυχώς!</p>
        <p style={{color:T.textMid,fontSize:"13px",lineHeight:"1.7",margin:"0 0 24px"}}>Πρέπει πρώτα να εγκριθεί από admin για να μπορείτε να δημιουργείτε αγώνες.</p>
        <button onClick={()=>supabase.auth.signOut()} style={{background:T.bgAlt,color:T.text,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"10px 20px",cursor:"pointer",fontSize:"13px",fontFamily:"inherit"}}>Αποσύνδεση</button>
      </div>
    </div>)}

    {isRejectedOrganizer&&(<div style={{padding:"40px 28px",maxWidth:"640px",margin:"40px auto"}}>
      <div style={{background:T.bgAlt,border:`1px solid ${T.danger}44`,borderRadius:"16px",padding:"40px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"64px",marginBottom:"20px"}}>❌</div>
        <h2 style={{color:T.danger,fontSize:"22px",margin:"0 0 12px"}}>Η Αίτηση Απορρίφθηκε</h2>
        <p style={{color:T.textMid,fontSize:"13px",lineHeight:"1.7",margin:"0 0 24px"}}>Επικοινωνήστε με τον διαχειριστή.</p>
        <button onClick={()=>supabase.auth.signOut()} style={{background:T.bgAlt,color:T.text,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"10px 20px",cursor:"pointer",fontSize:"13px",fontFamily:"inherit"}}>Αποσύνδεση</button>
      </div>
    </div>)}

    {isAthlete&&(<div style={{padding:"28px",maxWidth:"960px",margin:"0 auto"}}>
      <AthleteDashboard races={races} registrations={registrations} runners={runners} profile={profile} session={session} onRefresh={fetchAll}/>
    </div>)}

    {isOrganizer&&(<>
      <div style={{display:"flex",gap:"4px",padding:"12px 24px",borderBottom:`1px solid ${T.border}`,background:T.bgAlt}}>
        {[{id:"races",label:"🏟 Αγώνες"},{id:"regs",label:"📋 Εγγραφές"},...(isAdmin?[{id:"admin",label:"👑 Admin"}]:[])].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?T.primary:"none",color:tab===t.id?"#fff":T.textMid,border:"none",borderRadius:"8px",padding:"8px 16px",cursor:"pointer",fontSize:"13px",fontWeight:tab===t.id?700:500,fontFamily:"inherit"}}>{t.label}</button>
        ))}
      </div>
      <div style={{padding:"28px",maxWidth:"960px",margin:"0 auto"}}>
        {tab==="races"&&<OrganizerRaces races={races} setRaces={setRaces} runners={runners} registrations={registrations} session={session} profile={profile}/>}
        {tab==="regs"&&<OrganizerRegistrations races={races} runners={runners} registrations={registrations} session={session} profile={profile}/>}
        {tab==="admin"&&isAdmin&&<AdminPanel/>}
      </div>
    </>)}
  </div>;
}
