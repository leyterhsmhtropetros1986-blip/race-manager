import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kcqnykjbgqjlgcxmcaro.supabase.co";
const SUPABASE_KEY = "sb_publishable_0dnpl6eFXDjB1Ot26f-qsg_B9IasaUw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CATEGORIES = ["Γενική","Άνδρες 18-29","Άνδρες 30-39","Άνδρες 40-49","Άνδρες 50+","Γυναίκες 18-29","Γυναίκες 30-39","Γυναίκες 40-49","Γυναίκες 50+","Παίδες U18"];
const TSHIRTS = ["XS","S","M","L","XL","XXL"];
const SUGGESTED_DISTANCES = ["5km","10km","12km","15km","20km","21km","23km","42km","Ημιμαραθώνιος","Μαραθώνιος","Trail","Ορεινός"];

const css = {
  input:{width:"100%",background:"#1a1d2e",border:"1px solid #2a2d4a",borderRadius:"8px",padding:"10px 14px",color:"#e8eaf6",fontSize:"14px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
  label:{display:"block",color:"#5a5f7a",fontSize:"11px",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"5px"}
};

function F({label,children}){return <div style={{marginBottom:"14px"}}>{label&&<label style={css.label}>{label}</label>}{children}</div>;}
function In({label,...p}){return <F label={label}><input {...p} style={{...css.input,...p.style}}/></F>;}
function Sel({label,children,...p}){return <F label={label}><select {...p} style={{...css.input,...p.style}}>{children}</select></F>;}
function Btn({children,v="pri",sm,...p}){
  const vs={
    pri:{background:"#5c6bc0",color:"#fff",fontWeight:700},
    sec:{background:"#1a1d2e",color:"#e8eaf6",border:"1px solid #2a2d4a"},
    red:{background:"#ff3b5c18",color:"#ff3b5c",border:"1px solid #ff3b5c33"},
    grn:{background:"#42f5a718",color:"#42f5a7",border:"1px solid #42f5a733"},
    ghost:{background:"none",color:"#5a5f7a",border:"1px solid #2a2d4a"}
  };
  return <button {...p} style={{borderRadius:"8px",border:"none",cursor:"pointer",padding:sm?"6px 12px":"10px 20px",fontSize:sm?"12px":"13px",fontFamily:"inherit",...vs[v],...p.style}}>{children}</button>;
}
function Modal({title,onClose,children,wide}){
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:"20px"}}>
    <div style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"16px",padding:"28px",width:"100%",maxWidth:wide?"700px":"520px",maxHeight:"88vh",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
        <h2 style={{margin:0,color:"#e8eaf6",fontSize:"18px"}}>{title}</h2>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:"24px"}}>×</button>
      </div>
      {children}
    </div>
  </div>;
}

function DistancesPicker({distances,onChange}){
  const [custom,setCustom]=useState("");
  function addDistance(d){if(!distances.includes(d))onChange([...distances,d]);}
  function removeDistance(d){onChange(distances.filter(x=>x!==d));}
  function addCustom(){if(custom.trim()&&!distances.includes(custom.trim())){onChange([...distances,custom.trim()]);setCustom("");}}
  return <F label="Διαδρομές / Αποστάσεις *">
    <div style={{marginBottom:"10px"}}>
      <div style={{color:"#5a5f7a",fontSize:"11px",marginBottom:"6px"}}>Γρήγορη επιλογή:</div>
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
        {SUGGESTED_DISTANCES.map(d=>(
          <button key={d} onClick={()=>addDistance(d)} style={{background:distances.includes(d)?"#5c6bc0":"#1a1d2e",color:distances.includes(d)?"#fff":"#5a5f7a",border:`1px solid ${distances.includes(d)?"#5c6bc0":"#2a2d4a"}`,borderRadius:"6px",padding:"4px 10px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>{d}</button>
        ))}
      </div>
    </div>
    <div style={{display:"flex",gap:"8px",marginBottom:"10px"}}>
      <input value={custom} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustom()} placeholder="Ή γράψε δική σου π.χ. 23.5km" style={{...css.input,flex:1}}/>
      <button onClick={addCustom} style={{background:"#5c6bc0",color:"#fff",border:"none",borderRadius:"8px",padding:"0 16px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,whiteSpace:"nowrap"}}>+ Προσθήκη</button>
    </div>
    {distances.length>0&&(
      <div>
        <div style={{color:"#5a5f7a",fontSize:"11px",marginBottom:"6px"}}>Επιλεγμένες:</div>
        <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
          {distances.map((d,i)=>(
            <span key={i} style={{background:"#5c6bc022",border:"1px solid #5c6bc044",borderRadius:"6px",padding:"4px 10px",fontSize:"13px",color:"#e8eaf6",display:"flex",alignItems:"center",gap:"6px"}}>
              🏃 {d}
              <button onClick={()=>removeDistance(d)} style={{background:"none",border:"none",color:"#ff3b5c",cursor:"pointer",fontSize:"16px",padding:0,lineHeight:1}}>×</button>
            </span>
          ))}
        </div>
      </div>
    )}
  </F>;
}

// ─── LOGIN — ΝΕΑ ΞΕΚΑΘΑΡΗ ΡΟΗ ──────────────────────────────────────────────────
function LoginPage(){
  // step: "role" → "auth" (αφού διαλέξει ρόλο)
  const [step,setStep]=useState("role");
  const [role,setRole]=useState(null); // "organizer" ή "athlete"
  const [mode,setMode]=useState("signup"); // "signup" ή "login"
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  function selectRole(r){
    setRole(r);
    setStep("auth");
    setError("");
  }

  function backToRole(){
    setStep("role");
    setRole(null);
    setError("");
    setEmail("");setPassword("");setName("");
  }

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

    // SIGNUP
    const {data,error}=await supabase.auth.signUp({email,password});
    if(error){setError(error.message);setLoading(false);return;}
    if(data.user){
      await supabase.from("profiles").insert([{id:data.user.id,email,full_name:name,role:role}]);
      setError("✅ Ελέγξτε το email σας για επιβεβαίωση!");
    }
    setLoading(false);
  }

  const roleColor=role==="organizer"?"#5c6bc0":"#42f5a7";
  const roleColorText=role==="organizer"?"#fff":"#0a0c16";
  const roleIcon=role==="organizer"?"🏟":"🏃";
  const roleLabel=role==="organizer"?"Διοργανωτής":"Αθλητής";

  return <div style={{minHeight:"100vh",background:"#080912",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif",padding:"20px"}}>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet"/>
    <div style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"20px",padding:"40px",width:"100%",maxWidth:"460px"}}>

      {/* HEADER */}
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <div style={{width:"60px",height:"60px",background:"#5c6bc0",borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",margin:"0 auto 16px"}}>🏃</div>
        <h1 style={{color:"#e8eaf6",fontSize:"22px",fontWeight:900,margin:"0 0 4px"}}>Race Management</h1>
        <p style={{color:"#5a5f7a",fontSize:"13px",margin:0}}>Πλατφόρμα Διαχείρισης Αγώνων</p>
      </div>

      {/* ─── ΒΗΜΑ 1: ΕΠΙΛΟΓΗ ΡΟΛΟΥ ───────────────────────────── */}
      {step==="role"&&(
        <div>
          <h3 style={{color:"#e8eaf6",textAlign:"center",fontSize:"15px",marginBottom:"6px",fontWeight:600}}>Καλώς ήρθες! 👋</h3>
          <p style={{color:"#5a5f7a",textAlign:"center",fontSize:"13px",marginBottom:"24px"}}>Διάλεξε τον ρόλο σου για να συνεχίσεις</p>

          <button onClick={()=>selectRole("organizer")} style={{width:"100%",background:"#5c6bc0",color:"#fff",border:"none",borderRadius:"12px",padding:"20px",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:"12px",textAlign:"left",display:"flex",alignItems:"center",gap:"16px"}}>
            <span style={{fontSize:"32px"}}>🏟</span>
            <div>
              <div style={{fontSize:"16px",marginBottom:"3px"}}>Είμαι Διοργανωτής</div>
              <div style={{fontSize:"12px",fontWeight:400,opacity:0.85}}>Δημιουργώ & διαχειρίζομαι αγώνες</div>
            </div>
          </button>

          <button onClick={()=>selectRole("athlete")} style={{width:"100%",background:"#42f5a7",color:"#0a0c16",border:"none",borderRadius:"12px",padding:"20px",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:"16px"}}>
            <span style={{fontSize:"32px"}}>🏃</span>
            <div>
              <div style={{fontSize:"16px",marginBottom:"3px"}}>Είμαι Αθλητής</div>
              <div style={{fontSize:"12px",fontWeight:400,opacity:0.85}}>Βλέπω αγώνες & εγγράφομαι</div>
            </div>
          </button>
        </div>
      )}

      {/* ─── ΒΗΜΑ 2: SIGNUP / LOGIN ──────────────────────────── */}
      {step==="auth"&&(
        <div>
          {/* Badge ρόλου */}
          <div style={{textAlign:"center",marginBottom:"20px"}}>
            <span style={{background:roleColor+"22",color:roleColor,border:`1px solid ${roleColor}55`,borderRadius:"99px",padding:"6px 16px",fontSize:"13px",fontWeight:700,display:"inline-flex",alignItems:"center",gap:"6px"}}>
              {roleIcon} {roleLabel}
            </span>
          </div>

          {/* Tabs: Εγγραφή / Σύνδεση */}
          <div style={{display:"flex",background:"#1a1d2e",borderRadius:"10px",padding:"4px",marginBottom:"24px"}}>
            <button onClick={()=>{setMode("signup");setError("");}} style={{flex:1,background:mode==="signup"?roleColor:"none",color:mode==="signup"?roleColorText:"#5a5f7a",border:"none",borderRadius:"8px",padding:"10px",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              ✨ Νέα Εγγραφή
            </button>
            <button onClick={()=>{setMode("login");setError("");}} style={{flex:1,background:mode==="login"?roleColor:"none",color:mode==="login"?roleColorText:"#5a5f7a",border:"none",borderRadius:"8px",padding:"10px",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              🔑 Σύνδεση
            </button>
          </div>

          {/* Επεξήγηση */}
          <p style={{color:"#5a5f7a",fontSize:"12px",textAlign:"center",marginBottom:"20px",lineHeight:"1.5"}}>
            {mode==="signup"
              ? `Δημιούργησε νέο λογαριασμό ως ${roleLabel.toLowerCase()}`
              : `Σύνδεση με υπάρχοντα λογαριασμό ${roleLabel.toLowerCase()}`}
          </p>

          {/* Πεδία */}
          {mode==="signup"&&(
            <div style={{marginBottom:"14px"}}>
              <label style={{display:"block",color:"#5a5f7a",fontSize:"11px",textTransform:"uppercase",marginBottom:"6px",letterSpacing:"0.1em"}}>Ονοματεπώνυμο</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="π.χ. Γιώργος Παπαδόπουλος" style={css.input}/>
            </div>
          )}
          <div style={{marginBottom:"14px"}}>
            <label style={{display:"block",color:"#5a5f7a",fontSize:"11px",textTransform:"uppercase",marginBottom:"6px",letterSpacing:"0.1em"}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={css.input}/>
          </div>
          <div style={{marginBottom:"20px"}}>
            <label style={{display:"block",color:"#5a5f7a",fontSize:"11px",textTransform:"uppercase",marginBottom:"6px",letterSpacing:"0.1em"}}>Κωδικός</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={css.input}/>
          </div>

          {error&&<div style={{background:error.startsWith("✅")?"#42f5a718":"#ff3b5c18",border:`1px solid ${error.startsWith("✅")?"#42f5a733":"#ff3b5c33"}`,borderRadius:"8px",padding:"10px 14px",color:error.startsWith("✅")?"#42f5a7":"#ff3b5c",fontSize:"13px",marginBottom:"16px"}}>{error}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{width:"100%",background:roleColor,color:roleColorText,border:"none",borderRadius:"10px",padding:"14px",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:"12px",opacity:loading?0.6:1}}>
            {loading?"...":(mode==="signup"?`✨ Εγγραφή ως ${roleLabel}`:`🔑 Σύνδεση`)}
          </button>

          <button onClick={backToRole} style={{width:"100%",background:"none",border:"1px solid #2a2d4a",color:"#5a5f7a",borderRadius:"10px",padding:"10px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>
            ← Αλλαγή ρόλου
          </button>
        </div>
      )}
    </div>
  </div>;
}

// ─── ΑΘΛΗΤΗΣ - ΕΓΓΡΑΦΗ ΣΕ ΑΓΩΝΑ ──────────────────────────────────────────────
function AthleteRaceCard({race,registrations,runners,profile,session,onRegister}){
  const myReg=registrations.find(r=>r.race_id===race.id&&runners.find(rn=>rn.id===r.runner_id)?.email===session.user.email);
  const totalRegs=registrations.filter(r=>r.race_id===race.id).length;
  const distances=race.distance?race.distance.split(" | "):[];
  const statusColors={upcoming:"#f5c842",active:"#42f5a7",finished:"#888"};
  const statusLabels={upcoming:"ΠΡΟΣΕΧΩΣ",active:"ΕΝΕΡΓΟΣ",finished:"ΟΛΟΚΛΗΡΩΘΗΚΕ"};

  return <div style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"14px",padding:"20px 24px"}}>
    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px",flexWrap:"wrap"}}>
      <span style={{color:"#e8eaf6",fontWeight:700,fontSize:"16px"}}>{race.name}</span>
      <span style={{background:statusColors[race.status]+"22",color:statusColors[race.status],border:`1px solid ${statusColors[race.status]}44`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px"}}>{statusLabels[race.status]}</span>
      {myReg&&<span style={{background:"#42f5a722",color:"#42f5a7",border:"1px solid #42f5a744",borderRadius:"99px",padding:"2px 10px",fontSize:"11px",fontWeight:700}}>✓ ΕΓΓΕΓΡΑΜΜΕΝΟΣ</span>}
    </div>
    <div style={{color:"#5a5f7a",fontSize:"13px",lineHeight:"1.8",marginBottom:"10px"}}>
      📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 👤 {totalRegs} εγγεγραμμένοι
      {race.description&&<><br/>💬 {race.description}</>}
    </div>
    {distances.length>0&&(
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
        {distances.map((d,i)=>(
          <span key={i} style={{background:"#5c6bc022",border:"1px solid #5c6bc044",borderRadius:"6px",padding:"3px 10px",fontSize:"12px",color:"#a0a8e8"}}>🏃 {d}</span>
        ))}
      </div>
    )}
    {myReg?(
      <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:"#42f5a712",borderRadius:"8px",border:"1px solid #42f5a722"}}>
        <span style={{background:"#42f5a7",color:"#0a0c16",borderRadius:"6px",padding:"2px 8px",fontWeight:700,fontSize:"13px"}}>#{myReg.bib_number}</span>
        <span style={{color:"#42f5a7",fontSize:"13px"}}>Είσαι ήδη εγγεγραμμένος! Διαδρομή: {myReg.distance||"—"}</span>
      </div>
    ):race.status==="upcoming"&&(
      <Btn onClick={()=>onRegister(race)}>+ Εγγραφή στον Αγώνα</Btn>
    )}
  </div>;
}

function AthleteRegistrationForm({race,profile,session,onClose,onSuccess}){
  const distances=race.distance?race.distance.split(" | "):[];
  const [form,setForm]=useState({distance:distances[0]||"",category:"Γενική",tshirt:"M",phone:"",dob:"",gender:"Άνδρας",club:"",medical_cert:false});
  const [loading,setLoading]=useState(false);

  async function submit(){
    if(!form.distance){alert("Επιλέξτε διαδρομή!");return;}
    setLoading(true);
    const fullName=(profile?.full_name||"").trim().split(" ");
    const firstName=fullName[0]||"";
    const lastName=fullName.slice(1).join(" ")||"";
    
    let {data:runner}=await supabase.from("runners").select("*").eq("email",session.user.email).single();
    if(!runner){
      const {data}=await supabase.from("runners").insert([{
        first_name:firstName,last_name:lastName,email:session.user.email,
        phone:form.phone,dob:form.dob,gender:form.gender,club:form.club
      }]).select();
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
      bib_number:(maxBib+1).toString()
    }]);
    setLoading(false);
    onSuccess();
  }

  return <Modal title={`Εγγραφή στον ${race.name}`} onClose={onClose}>
    <Sel label="Διαδρομή *" value={form.distance} onChange={e=>setForm({...form,distance:e.target.value})}>
      {distances.map(d=><option key={d} value={d}>{d}</option>)}
    </Sel>
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
    <label style={{display:"flex",alignItems:"center",gap:"8px",color:"#5a5f7a",fontSize:"13px",cursor:"pointer",marginBottom:"16px"}}>
      <input type="checkbox" checked={form.medical_cert} onChange={e=>setForm({...form,medical_cert:e.target.checked})}/>
      Έχω ιατρική βεβαίωση καταλληλότητας
    </label>
    <div style={{display:"flex",gap:"10px"}}>
      <Btn onClick={submit} style={{flex:1}} disabled={loading}>{loading?"...":"Επιβεβαίωση Εγγραφής"}</Btn>
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
      <button onClick={()=>setTab("available")} style={{background:tab==="available"?"#5c6bc0":"#1a1d2e",color:tab==="available"?"#fff":"#5a5f7a",border:"none",borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="available"?700:400,fontFamily:"inherit"}}>🏟 Διαθέσιμοι Αγώνες ({availableRaces.length})</button>
      <button onClick={()=>setTab("my")} style={{background:tab==="my"?"#5c6bc0":"#1a1d2e",color:tab==="my"?"#fff":"#5a5f7a",border:"none",borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="my"?700:400,fontFamily:"inherit"}}>📋 Οι Εγγραφές μου ({myRaces.length})</button>
    </div>

    {tab==="available"&&(
      <div>
        <h2 style={{margin:"0 0 16px",color:"#e8eaf6",fontSize:"18px"}}>Διαθέσιμοι Αγώνες</h2>
        {availableRaces.length===0&&<div style={{textAlign:"center",color:"#333",padding:"60px",fontSize:"14px"}}>Δεν υπάρχουν διαθέσιμοι αγώνες</div>}
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          {availableRaces.map(race=>(
            <AthleteRaceCard key={race.id} race={race} registrations={registrations} runners={runners} profile={profile} session={session} onRegister={setRegisterRace}/>
          ))}
        </div>
      </div>
    )}

    {tab==="my"&&(
      <div>
        <h2 style={{margin:"0 0 16px",color:"#e8eaf6",fontSize:"18px"}}>Οι Εγγραφές μου</h2>
        {myRaces.length===0&&<div style={{textAlign:"center",color:"#333",padding:"60px",fontSize:"14px"}}>Δεν έχεις εγγραφές ακόμα</div>}
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          {myRaces.map(race=>{
            const reg=myRegs.find(r=>r.race_id===race.id);
            return <div key={race.id} style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"14px",padding:"20px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px"}}>
                <span style={{background:"#42f5a7",color:"#0a0c16",borderRadius:"8px",padding:"4px 12px",fontWeight:700,fontSize:"15px"}}>#{reg.bib_number}</span>
                <span style={{color:"#e8eaf6",fontWeight:700,fontSize:"16px"}}>{race.name}</span>
              </div>
              <div style={{color:"#5a5f7a",fontSize:"13px",lineHeight:"1.8"}}>
                📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 🏃 {reg.distance||"—"}<br/>
                Κατηγορία: {reg.category} · T-shirt: {reg.tshirt}{reg.medical_cert?" · ✅ Ιατρική":""}
              </div>
            </div>;
          })}
        </div>
      </div>
    )}

    {registerRace&&<AthleteRegistrationForm race={registerRace} profile={profile} session={session} onClose={()=>setRegisterRace(null)} onSuccess={()=>{setRegisterRace(null);onRefresh();}}/>}
  </div>;
}

// ─── ΔΙΟΡΓΑΝΩΤΗΣ - ΑΓΩΝΕΣ ──────────────────────────────────────────────────────
function OrganizerRaces({races,setRaces,runners,registrations,session,profile}){
  const [showForm,setShowForm]=useState(false);
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({name:"",date:"",location:"",distances:[],max_runners:"",description:""});

  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);

  async function add(){
    if(!form.name||!form.date){alert("Συμπληρώστε όνομα και ημερομηνία!");return;}
    if(form.distances.length===0){alert("Προσθέστε τουλάχιστον μία διαδρομή!");return;}
    setLoading(true);
    const {data}=await supabase.from("races").insert([{name:form.name,date:form.date,location:form.location,distance:form.distances.join(" | "),description:form.description,max_runners:form.max_runners?parseInt(form.max_runners):null,status:"upcoming",user_id:session.user.id}]).select();
    if(data)setRaces([data[0],...races]);
    setLoading(false);setShowForm(false);
    setForm({name:"",date:"",location:"",distances:[],max_runners:"",description:""});
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
    const rows=regs.map((reg,i)=>{const r=runners.find(x=>x.id===reg.runner_id)||{};return[i+1,reg.bib_number,r.first_name,r.last_name,r.email,r.phone||"",reg.distance||"",reg.category,reg.tshirt,r.club||"",reg.medical_cert?"ΝΑΙ":"ΟΧΙ"].join(",");});
    const csv="Α/Α,BIB,Όνομα,Επώνυμο,Email,Τηλέφωνο,Διαδρομή,Κατηγορία,T-Shirt,Σύλλογος,Ιατρική\n"+rows.join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}));a.download=`${race.name.replace(/\s+/g,"-")}.csv`;a.click();
  }

  const statusColors={upcoming:"#f5c842",active:"#42f5a7",finished:"#888"};
  const statusLabels={upcoming:"ΠΡΟΣΕΧΩΣ",active:"ΕΝΕΡΓΟΣ",finished:"ΟΛΟΚΛΗΡΩΘΗΚΕ"};

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
      <h2 style={{margin:0,color:"#e8eaf6",fontSize:"20px"}}>Οι Αγώνες μου {isAdmin&&<span style={{color:"#5a5f7a",fontSize:"13px"}}>(admin — όλοι)</span>}</h2>
      <Btn onClick={()=>setShowForm(true)}>+ Νέος Αγώνας</Btn>
    </div>
    {myRaces.length===0&&<div style={{textAlign:"center",color:"#333",padding:"60px",fontSize:"14px"}}>Δεν έχεις δημιουργήσει αγώνες ακόμα!</div>}
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      {myRaces.map(race=>{
        const regCount=registrations.filter(r=>r.race_id===race.id).length;
        const distances=race.distance?race.distance.split(" | "):[];
        return <div key={race.id} style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"14px",padding:"20px 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px",flexWrap:"wrap"}}>
            <span style={{color:"#e8eaf6",fontWeight:700,fontSize:"16px"}}>{race.name}</span>
            <span style={{background:statusColors[race.status]+"22",color:statusColors[race.status],border:`1px solid ${statusColors[race.status]}44`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px"}}>{statusLabels[race.status]}</span>
          </div>
          <div style={{color:"#5a5f7a",fontSize:"13px",lineHeight:"1.8",marginBottom:"10px"}}>📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 👤 {regCount} εγγεγραμμένοι</div>
          {distances.length>0&&(
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
              {distances.map((d,i)=>(<span key={i} style={{background:"#5c6bc022",border:"1px solid #5c6bc044",borderRadius:"6px",padding:"3px 10px",fontSize:"12px",color:"#a0a8e8"}}>🏃 {d}</span>))}
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
    {showForm&&<Modal title="Νέος Αγώνας" onClose={()=>setShowForm(false)} wide>
      <In label="Όνομα Αγώνα *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="π.χ. Armeno Gate Trail Race 2026"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label="Ημερομηνία *" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
        <In label="Τοποθεσία" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
      </div>
      <DistancesPicker distances={form.distances} onChange={d=>setForm({...form,distances:d})}/>
      <In label="Μέγ. Συμμετοχές" type="number" value={form.max_runners} onChange={e=>setForm({...form,max_runners:e.target.value})} placeholder="Κενό = απεριόριστο"/>
      <F label="Περιγραφή"><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} style={{...css.input,resize:"vertical"}}/></F>
      <div style={{display:"flex",gap:"10px"}}>
        <Btn onClick={add} style={{flex:1}} disabled={loading}>{loading?"...":"Δημιουργία"}</Btn>
        <Btn v="sec" onClick={()=>setShowForm(false)} style={{flex:1}}>Άκυρο</Btn>
      </div>
    </Modal>}
  </div>;
}

function OrganizerRegistrations({races,runners,registrations,session,profile}){
  const [filterRace,setFilterRace]=useState("all");
  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);
  const myRaceIds=myRaces.map(r=>r.id);
  
  const filtered=registrations
    .filter(r=>myRaceIds.includes(r.race_id))
    .filter(r=>filterRace==="all"||r.race_id===filterRace);

  return <div>
    <h2 style={{margin:"0 0 20px",color:"#e8eaf6",fontSize:"20px"}}>Εγγραφές στους Αγώνες μου ({filtered.length})</h2>
    <Sel value={filterRace} onChange={e=>setFilterRace(e.target.value)}>
      <option value="all">Όλοι οι Αγώνες</option>
      {myRaces.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
    </Sel>
    {filtered.length===0&&<div style={{textAlign:"center",color:"#333",padding:"60px",fontSize:"14px"}}>Δεν υπάρχουν εγγραφές</div>}
    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {filtered.map(reg=>{
        const runner=runners.find(r=>r.id===reg.runner_id);
        const race=races.find(r=>r.id===reg.race_id);
        if(!runner||!race)return null;
        return <div key={reg.id} style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"12px",padding:"14px 18px",display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{background:"#5c6bc0",color:"#fff",borderRadius:"8px",padding:"4px 10px",fontWeight:700,fontSize:"16px"}}>#{reg.bib_number}</div>
          <div style={{flex:1}}>
            <div style={{color:"#e8eaf6",fontWeight:700,fontSize:"14px"}}>{runner.first_name} {runner.last_name}</div>
            <div style={{color:"#5a5f7a",fontSize:"12px"}}>{race.name}{reg.distance?` · 🏃 ${reg.distance}`:""} · {reg.category} · T-shirt: {reg.tshirt}{reg.medical_cert?" · ✅ Ιατρική":""}</div>
            <div style={{color:"#5a5f7a",fontSize:"12px"}}>{runner.email}{runner.phone?` · ${runner.phone}`:""}</div>
          </div>
        </div>;
      })}
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
  if(loading)return <div style={{minHeight:"100vh",background:"#080912",display:"flex",alignItems:"center",justifyContent:"center",color:"#5c6bc0",fontFamily:"Inter,sans-serif"}}>Φόρτωση...</div>;

  const isAthlete=profile?.role==="athlete";
  const isOrganizer=profile?.role==="organizer"||profile?.role==="admin";

  return <div style={{minHeight:"100vh",background:"#080912",color:"#e8eaf6",fontFamily:"Inter,sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet"/>
    <div style={{borderBottom:"1px solid #1a1c2a",padding:"16px 24px",background:"#0a0c16",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        <div style={{width:"36px",height:"36px",background:isAthlete?"#42f5a7":"#5c6bc0",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>🏃</div>
        <div>
          <div style={{color:"#e8eaf6",fontWeight:700,fontSize:"16px"}}>Race Management</div>
          <div style={{color:"#3a3d52",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase"}}>{isAthlete?"ΠΑΝΕΛ ΑΘΛΗΤΗ":"ΔΙΑΧΕΙΡΙΣΗ ΑΓΩΝΩΝ"}</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
        <span style={{color:"#5a5f7a",fontSize:"13px"}}>{profile?.full_name||session.user.email}</span>
        {profile?.role==="admin"&&<span style={{background:"#f5c84222",color:"#f5c842",border:"1px solid #f5c84244",borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>ADMIN</span>}
        {profile?.role==="organizer"&&<span style={{background:"#5c6bc022",color:"#5c6bc0",border:"1px solid #5c6bc044",borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>ΔΙΟΡΓΑΝΩΤΗΣ</span>}
        {profile?.role==="athlete"&&<span style={{background:"#42f5a722",color:"#42f5a7",border:"1px solid #42f5a744",borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>ΑΘΛΗΤΗΣ</span>}
        <button onClick={()=>supabase.auth.signOut()} style={{background:"#ff3b5c18",color:"#ff3b5c",border:"1px solid #ff3b5c33",borderRadius:"8px",padding:"6px 12px",cursor:"pointer",fontSize:"12px",fontFamily:"inherit"}}>Αποσύνδεση</button>
      </div>
    </div>

    {isAthlete&&(
      <div style={{padding:"28px",maxWidth:"960px",margin:"0 auto"}}>
        <AthleteDashboard races={races} registrations={registrations} runners={runners} profile={profile} session={session} onRefresh={fetchAll}/>
      </div>
    )}

    {isOrganizer&&(<>
      <div style={{display:"flex",gap:"4px",padding:"12px 24px",borderBottom:"1px solid #1a1c2a",background:"#0a0c16"}}>
        {[{id:"races",label:"🏟 Αγώνες"},{id:"regs",label:"📋 Εγγραφές"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?"#5c6bc0":"none",color:tab===t.id?"#fff":"#5a5f7a",border:"none",borderRadius:"8px",padding:"8px 16px",cursor:"pointer",fontSize:"13px",fontWeight:tab===t.id?700:400,fontFamily:"inherit"}}>{t.label}</button>
        ))}
      </div>
      <div style={{padding:"28px",maxWidth:"960px",margin:"0 auto"}}>
        {tab==="races"&&<OrganizerRaces races={races} setRaces={setRaces} runners={runners} registrations={registrations} session={session} profile={profile}/>}
        {tab==="regs"&&<OrganizerRegistrations races={races} runners={runners} registrations={registrations} session={session} profile={profile}/>}
      </div>
    </>)}
  </div>;
}

