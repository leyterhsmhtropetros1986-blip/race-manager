import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kcqnykjbgqjlgcxmcaro.supabase.co";
const SUPABASE_KEY = "sb_publishable_0dnpl6eFXDjB1Ot26f-qsg_B9IasaUw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DISTANCES = ["5km","10km","12km","20km","Ημιμαραθώνιος","Μαραθώνιος","Trail","Άλλο"];
const CATEGORIES = ["Γενική","Άνδρες 18-29","Άνδρες 30-39","Άνδρες 40-49","Άνδρες 50+","Γυναίκες 18-29","Γυναίκες 30-39","Γυναίκες 40-49","Γυναίκες 50+","Παίδες U18"];
const TSHIRTS = ["XS","S","M","L","XL","XXL"];

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
function Modal({title,onClose,children}){
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:"20px"}}>
    <div style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"16px",padding:"28px",width:"100%",maxWidth:"520px",maxHeight:"88vh",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
        <h2 style={{margin:0,color:"#e8eaf6",fontSize:"18px"}}>{title}</h2>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:"24px"}}>×</button>
      </div>
      {children}
    </div>
  </div>;
}

// ─── LOGIN ──────────────────────────────────────────────────────────────────────
function LoginPage(){
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function handleLogin(){
    setLoading(true);setError("");
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error)setError("Λάθος email ή κωδικός!");
    setLoading(false);
  }

  async function handleSignup(){
    setLoading(true);setError("");
    const {data,error}=await supabase.auth.signUp({email,password});
    if(error){setError(error.message);setLoading(false);return;}
    if(data.user){
      await supabase.from("profiles").insert([{id:data.user.id,email,full_name:name,role:"organizer"}]);
      setError("✅ Ελέγξτε το email σας για επιβεβαίωση!");
    }
    setLoading(false);
  }

  const inp={width:"100%",background:"#1a1d2e",border:"1px solid #2a2d4a",borderRadius:"8px",padding:"10px 14px",color:"#e8eaf6",fontSize:"14px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};

  return <div style={{minHeight:"100vh",background:"#080912",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet"/>
    <div style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"20px",padding:"40px",width:"100%",maxWidth:"400px"}}>
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <div style={{width:"60px",height:"60px",background:"#5c6bc0",borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",margin:"0 auto 16px"}}>🏃</div>
        <h1 style={{color:"#e8eaf6",fontSize:"22px",fontWeight:900,margin:"0 0 4px"}}>Race Management</h1>
        <p style={{color:"#5a5f7a",fontSize:"13px",margin:0}}>Πλατφόρμα Διαχείρισης Αγώνων</p>
      </div>
      <div style={{display:"flex",gap:"8px",marginBottom:"24px"}}>
        {["login","signup"].map(m=>(
          <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"10px",borderRadius:"8px",border:"none",cursor:"pointer",background:mode===m?"#5c6bc0":"#1a1d2e",color:mode===m?"#fff":"#5a5f7a",fontFamily:"inherit",fontWeight:mode===m?700:400,fontSize:"13px"}}>
            {m==="login"?"Σύνδεση":"Εγγραφή"}
          </button>
        ))}
      </div>
      {mode==="signup"&&<div style={{marginBottom:"14px"}}><label style={{display:"block",color:"#5a5f7a",fontSize:"11px",textTransform:"uppercase",marginBottom:"6px"}}>Ονοματεπώνυμο</label><input value={name} onChange={e=>setName(e.target.value)} style={inp}/></div>}
      <div style={{marginBottom:"14px"}}><label style={{display:"block",color:"#5a5f7a",fontSize:"11px",textTransform:"uppercase",marginBottom:"6px"}}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inp}/></div>
      <div style={{marginBottom:"20px"}}><label style={{display:"block",color:"#5a5f7a",fontSize:"11px",textTransform:"uppercase",marginBottom:"6px"}}>Κωδικός</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inp}/></div>
      {error&&<div style={{background:"#ff3b5c18",border:"1px solid #ff3b5c33",borderRadius:"8px",padding:"10px 14px",color:"#ff3b5c",fontSize:"13px",marginBottom:"16px"}}>{error}</div>}
      <button onClick={mode==="login"?handleLogin:handleSignup} disabled={loading} style={{width:"100%",background:"#5c6bc0",color:"#fff",border:"none",borderRadius:"8px",padding:"12px",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
        {loading?"...":(mode==="login"?"Σύνδεση":"Εγγραφή")}
      </button>
    </div>
  </div>;
}

// ─── ΔΗΜΟΣΙΑ ΣΕΛΙΔΑ ΑΓΩΝΑ ──────────────────────────────────────────────────────
function PublicRacePage({race,registrations,runners,onBack}){
  const regCount=registrations.filter(r=>r.race_id===race.id).length;
  const statusColors={upcoming:"#f5c842",active:"#42f5a7",finished:"#888"};
  const statusLabels={upcoming:"ΠΡΟΣΕΧΩΣ",active:"ΕΝΕΡΓΟΣ",finished:"ΟΛΟΚΛΗΡΩΘΗΚΕ"};

  return <div style={{minHeight:"100vh",background:"#080912",fontFamily:"Inter,sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet"/>
    <div style={{background:"#0a0c16",borderBottom:"1px solid #1a1c2a",padding:"16px 24px",display:"flex",alignItems:"center",gap:"12px"}}>
      <button onClick={onBack} style={{background:"none",border:"1px solid #2a2d4a",color:"#5a5f7a",borderRadius:"8px",padding:"6px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}>← Πίσω</button>
      <div style={{width:"32px",height:"32px",background:"#5c6bc0",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px"}}>🏃</div>
      <span style={{color:"#e8eaf6",fontWeight:700}}>Race Management</span>
    </div>

    <div style={{maxWidth:"800px",margin:"40px auto",padding:"0 24px"}}>
      <div style={{background:"linear-gradient(135deg,#1a1d2e,#0f1117)",border:"1px solid #2a2d4a",borderRadius:"20px",padding:"40px",marginBottom:"24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px"}}>
          <span style={{background:statusColors[race.status]+"22",color:statusColors[race.status],border:`1px solid ${statusColors[race.status]}44`,borderRadius:"99px",padding:"4px 14px",fontSize:"12px",fontWeight:700}}>{statusLabels[race.status]}</span>
        </div>
        <h1 style={{color:"#e8eaf6",fontSize:"clamp(24px,4vw,36px)",fontWeight:900,margin:"0 0 16px"}}>{race.name}</h1>
        <div style={{display:"flex",gap:"24px",flexWrap:"wrap",marginBottom:"20px"}}>
          <div style={{color:"#5a5f7a",fontSize:"15px"}}>📅 {race.date}</div>
          <div style={{color:"#5a5f7a",fontSize:"15px"}}>📍 {race.location||"—"}</div>
          <div style={{color:"#5a5f7a",fontSize:"15px"}}>🏃 {race.distance}</div>
          <div style={{color:"#5a5f7a",fontSize:"15px"}}>👤 {regCount} εγγεγραμμένοι</div>
        </div>
        {race.description&&<p style={{color:"#8a8faa",fontSize:"15px",lineHeight:"1.7",margin:0}}>{race.description}</p>}
      </div>

      <div style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"16px",padding:"28px"}}>
        <h2 style={{color:"#e8eaf6",fontSize:"18px",margin:"0 0 20px"}}>Λίστα Εγγεγραμμένων ({regCount})</h2>
        {regCount===0&&<div style={{textAlign:"center",color:"#333",padding:"40px",fontSize:"14px"}}>Δεν υπάρχουν εγγραφές ακόμα</div>}
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {registrations.filter(r=>r.race_id===race.id).map((reg,i)=>{
            const runner=runners.find(r=>r.id===reg.runner_id);
            if(!runner)return null;
            return <div key={reg.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0",borderBottom:"1px solid #1a1c2a"}}>
              <span style={{color:"#3a3d52",fontSize:"14px",width:"30px"}}>{i+1}</span>
              <span style={{background:"#5c6bc0",color:"#fff",borderRadius:"6px",padding:"2px 8px",fontWeight:700,fontSize:"14px"}}>#{reg.bib_number}</span>
              <span style={{color:"#e8eaf6",fontWeight:600,fontSize:"14px",flex:1}}>{runner.first_name} {runner.last_name}</span>
              <span style={{color:"#5a5f7a",fontSize:"12px"}}>{reg.category}</span>
            </div>;
          })}
        </div>
      </div>
    </div>
  </div>;
}

// ─── ΑΓΩΝΕΣ TAB ────────────────────────────────────────────────────────────────
function RacesTab({races,setRaces,runners,registrations,session,profile,onViewPublic}){
  const [showForm,setShowForm]=useState(false);
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({name:"",date:"",location:"",distance:"10km",max_runners:"",description:""});

  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);

  async function add(){
    if(!form.name||!form.date)return;
    setLoading(true);
    const {data}=await supabase.from("races").insert([{
      name:form.name,date:form.date,location:form.location,
      distance:form.distance,description:form.description,
      max_runners:form.max_runners?parseInt(form.max_runners):null,
      status:"upcoming",user_id:session.user.id
    }]).select();
    if(data)setRaces([data[0],...races]);
    setLoading(false);setShowForm(false);
    setForm({name:"",date:"",location:"",distance:"10km",max_runners:"",description:""});
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
    const rows=regs.map((reg,i)=>{const r=runners.find(x=>x.id===reg.runner_id)||{};return[i+1,reg.bib_number,r.first_name,r.last_name,r.email,r.phone||"",reg.category,reg.tshirt].join(",");});
    const csv="Α/Α,BIB,Όνομα,Επώνυμο,Email,Τηλέφωνο,Κατηγορία,T-Shirt\n"+rows.join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}));a.download=`${race.name.replace(/\s+/g,"-")}.csv`;a.click();
  }

  const statusColors={upcoming:"#f5c842",active:"#42f5a7",finished:"#888"};
  const statusLabels={upcoming:"ΠΡΟΣΕΧΩΣ",active:"ΕΝΕΡΓΟΣ",finished:"ΟΛΟΚΛΗΡΩΘΗΚΕ"};

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
      <h2 style={{margin:0,color:"#e8eaf6",fontSize:"20px"}}>
        Αγώνες {isAdmin&&<span style={{color:"#5a5f7a",fontSize:"13px"}}>(όλοι)</span>}
      </h2>
      <Btn onClick={()=>setShowForm(true)}>+ Νέος Αγώνας</Btn>
    </div>
    {myRaces.length===0&&<div style={{textAlign:"center",color:"#333",padding:"60px",fontSize:"14px"}}>Δεν υπάρχουν αγώνες ακόμα!</div>}
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      {myRaces.map(race=>{
        const regCount=registrations.filter(r=>r.race_id===race.id).length;
        return <div key={race.id} style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"14px",padding:"20px 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px",flexWrap:"wrap"}}>
            <span style={{color:"#e8eaf6",fontWeight:700,fontSize:"16px"}}>{race.name}</span>
            <span style={{background:statusColors[race.status]+"22",color:statusColors[race.status],border:`1px solid ${statusColors[race.status]}44`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px"}}>{statusLabels[race.status]}</span>
          </div>
          <div style={{color:"#5a5f7a",fontSize:"13px",lineHeight:"1.8"}}>
            📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 🏃 {race.distance} &nbsp; 👤 {regCount} εγγεγραμμένοι
            {race.description&&<><br/>💬 {race.description}</>}
          </div>
          <div style={{display:"flex",gap:"8px",marginTop:"14px",flexWrap:"wrap"}}>
            <Btn sm v="ghost" onClick={()=>onViewPublic(race)}>🌐 Δημόσια Σελίδα</Btn>
            <Btn sm v="ghost" onClick={()=>toggleStatus(race)}>⟳ Κατάσταση</Btn>
            <Btn sm v="ghost" onClick={()=>exportCSV(race)}>📥 CSV</Btn>
            <Btn sm v="red" onClick={()=>del(race.id)}>✕ Διαγραφή</Btn>
          </div>
        </div>;
      })}
    </div>
    {showForm&&<Modal title="Νέος Αγώνας" onClose={()=>setShowForm(false)}>
      <In label="Όνομα *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label="Ημερομηνία *" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
        <In label="Τοποθεσία" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <Sel label="Απόσταση" value={form.distance} onChange={e=>setForm({...form,distance:e.target.value})}>{DISTANCES.map(d=><option key={d}>{d}</option>)}</Sel>
        <In label="Μέγ. Συμμετοχές" type="number" value={form.max_runners} onChange={e=>setForm({...form,max_runners:e.target.value})}/>
      </div>
      <F label="Περιγραφή"><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} style={{...css.input,resize:"vertical"}}/></F>
      <div style={{display:"flex",gap:"10px"}}>
        <Btn onClick={add} style={{flex:1}} disabled={loading}>{loading?"...":"Δημιουργία"}</Btn>
        <Btn v="sec" onClick={()=>setShowForm(false)} style={{flex:1}}>Άκυρο</Btn>
      </div>
    </Modal>}
  </div>;
}

// ─── ΕΓΓΡΑΦΕΣ TAB ──────────────────────────────────────────────────────────────
function RegistrationsTab({races,runners,setRunners,registrations,setRegistrations,session,profile}){
  const [showForm,setShowForm]=useState(false);
  const [filterRace,setFilterRace]=useState("all");
  const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({first_name:"",last_name:"",email:"",phone:"",dob:"",gender:"Άνδρας",club:"",race_id:"",category:"Γενική",tshirt:"M",medical_cert:false,bib_number:""});

  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);

  async function add(){
    if(!form.first_name||!form.last_name||!form.race_id){alert("Συμπληρώστε τα υποχρεωτικά πεδία!");return;}
    setLoading(true);
    let runner=runners.find(r=>r.email&&r.email.toLowerCase()===form.email.toLowerCase());
    if(!runner){
      const {data}=await supabase.from("runners").insert([{first_name:form.first_name,last_name:form.last_name,email:form.email,phone:form.phone,dob:form.dob,gender:form.gender,club:form.club}]).select();
      if(data){runner=data[0];setRunners([runner,...runners]);}
    }
    if(!runner){setLoading(false);return;}
    const maxBib=registrations.filter(r=>r.race_id===form.race_id).reduce((mx,r)=>Math.max(mx,parseInt(r.bib_number)||0),0);
    const {data}=await supabase.from("registrations").insert([{runner_id:runner.id,race_id:form.race_id,category:form.category,tshirt:form.tshirt,medical_cert:form.medical_cert,bib_number:form.bib_number||(maxBib+1).toString()}]).select();
    if(data)setRegistrations([data[0],...registrations]);
    setLoading(false);setShowForm(false);
    setForm({first_name:"",last_name:"",email:"",phone:"",dob:"",gender:"Άνδρας",club:"",race_id:"",category:"Γενική",tshirt:"M",medical_cert:false,bib_number:""});
  }

  function exportCSV(raceId){
    const race=races.find(r=>r.id===raceId);
    const regs=registrations.filter(r=>r.race_id===raceId);
    if(!regs.length){alert("Δεν υπάρχουν εγγραφές!");return;}
    const rows=regs.map((reg,i)=>{const r=runners.find(x=>x.id===reg.runner_id)||{};return[i+1,reg.bib_number,r.first_name,r.last_name,r.email,r.phone||"",reg.category,reg.tshirt,r.club||"",reg.medical_cert?"ΝΑΙ":"ΟΧΙ"].join(",");});
    const csv="Α/Α,BIB,Όνομα,Επώνυμο,Email,Τηλέφωνο,Κατηγορία,T-Shirt,Σύλλογος,Ιατρική\n"+rows.join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}));a.download=`${race?.name.replace(/\s+/g,"-")||"εγγραφες"}.csv`;a.click();
  }

  const filtered=registrations
    .filter(r=>filterRace==="all"||r.race_id===filterRace)
    .filter(r=>{
      const runner=runners.find(x=>x.id===r.runner_id);
      return!search||`${runner?.first_name} ${runner?.last_name} ${runner?.email}`.toLowerCase().includes(search.toLowerCase());
    });

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
      <h2 style={{margin:0,color:"#e8eaf6",fontSize:"20px"}}>Εγγραφές ({filtered.length})</h2>
      <div style={{display:"flex",gap:"8px"}}>
        {filterRace!=="all"&&<Btn sm v="ghost" onClick={()=>exportCSV(filterRace)}>📥 CSV</Btn>}
        <Btn onClick={()=>setShowForm(true)}>+ Νέα Εγγραφή</Btn>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px",marginBottom:"8px"}}>
      <Sel value={filterRace} onChange={e=>setFilterRace(e.target.value)}>
        <option value="all">Όλοι οι Αγώνες</option>
        {myRaces.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
      </Sel>
      <F><input placeholder="🔍 Αναζήτηση..." value={search} onChange={e=>setSearch(e.target.value)} style={css.input}/></F>
    </div>
    {filtered.length===0&&<div style={{textAlign:"center",color:"#333",padding:"60px",fontSize:"14px"}}>Δεν υπάρχουν εγγραφές</div>}
    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {filtered.map(reg=>{
        const runner=runners.find(r=>r.id===reg.runner_id);
        const race=races.find(r=>r.id===reg.race_id);
        if(!runner||!race)return null;
        return <div key={reg.id} style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"12px",padding:"14px 18px",display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{background:"#5c6bc0",color:"#fff",borderRadius:"8px",padding:"4px 10px",fontWeight:700,fontSize:"16px",flexShrink:0}}>#{reg.bib_number}</div>
          <div style={{flex:1}}>
            <div style={{color:"#e8eaf6",fontWeight:700,fontSize:"14px"}}>{runner.first_name} {runner.last_name}</div>
            <div style={{color:"#5a5f7a",fontSize:"12px"}}>{race.name} · {reg.category} · T-shirt: {reg.tshirt}{reg.medical_cert?" · ✅ Ιατρική":""}</div>
            <div style={{color:"#5a5f7a",fontSize:"12px"}}>{runner.email}{runner.phone?` · ${runner.phone}`:""}</div>
          </div>
        </div>;
      })}
    </div>
    {showForm&&<Modal title="Νέα Εγγραφή Αθλητή" onClose={()=>setShowForm(false)}>
      <Sel label="Αγώνας *" value={form.race_id} onChange={e=>setForm({...form,race_id:e.target.value})}>
        <option value="">Επιλέξτε αγώνα...</option>
        {myRaces.map(r=><option key={r.id} value={r.id}>{r.name} – {r.date}</option>)}
      </Sel>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label="Όνομα *" value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})}/>
        <In label="Επώνυμο *" value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})}/>
      </div>
      <In label="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label="Τηλέφωνο" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        <In label="Ημ. Γέννησης" type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <Sel label="Φύλο" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option>Άνδρας</option><option>Γυναίκα</option><option>Άλλο</option></Sel>
        <In label="Σύλλογος" value={form.club} onChange={e=>setForm({...form,club:e.target.value})} placeholder="Προαιρετικό"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 12px"}}>
        <Sel label="Κατηγορία" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</Sel>
        <Sel label="T-Shirt" value={form.tshirt} onChange={e=>setForm({...form,tshirt:e.target.value})}>{TSHIRTS.map(t=><option key={t}>{t}</option>)}</Sel>
        <In label="BIB" value={form.bib_number} onChange={e=>setForm({...form,bib_number:e.target.value})} placeholder="Αυτόματο"/>
      </div>
      <label style={{display:"flex",alignItems:"center",gap:"8px",color:"#5a5f7a",fontSize:"13px",cursor:"pointer",marginBottom:"16px"}}>
        <input type="checkbox" checked={form.medical_cert} onChange={e=>setForm({...form,medical_cert:e.target.checked})}/>
        Έχει προσκομίσει ιατρική βεβαίωση
      </label>
      <div style={{display:"flex",gap:"10px"}}>
        <Btn onClick={add} style={{flex:1}} disabled={loading}>{loading?"...":"Εγγραφή"}</Btn>
        <Btn v="sec" onClick={()=>setShowForm(false)} style={{flex:1}}>Άκυρο</Btn>
      </div>
    </Modal>}
  </div>;
}

// ─── ΠΡΟΦΙΛ ΑΘΛΗΤΗ ─────────────────────────────────────────────────────────────
function RunnerProfile({runner,races,registrations,onBack}){
  const myRegs=registrations.filter(r=>r.runner_id===runner.id);
  const myRaces=myRegs.map(reg=>({reg,race:races.find(r=>r.id===reg.race_id)})).filter(x=>x.race);

  return <div style={{minHeight:"100vh",background:"#080912",fontFamily:"Inter,sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet"/>
    <div style={{background:"#0a0c16",borderBottom:"1px solid #1a1c2a",padding:"16px 24px",display:"flex",alignItems:"center",gap:"12px"}}>
      <button onClick={onBack} style={{background:"none",border:"1px solid #2a2d4a",color:"#5a5f7a",borderRadius:"8px",padding:"6px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}>← Πίσω</button>
      <span style={{color:"#e8eaf6",fontWeight:700}}>Προφίλ Αθλητή</span>
    </div>
    <div style={{maxWidth:"700px",margin:"40px auto",padding:"0 24px"}}>
      <div style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"20px",padding:"32px",marginBottom:"24px",display:"flex",alignItems:"center",gap:"20px"}}>
        <div style={{width:"70px",height:"70px",borderRadius:"50%",background:"#5c6bc022",border:"2px solid #5c6bc044",display:"flex",alignItems:"center",justifyContent:"center",color:"#5c6bc0",fontWeight:900,fontSize:"24px",flexShrink:0}}>
          {runner.first_name?.[0]}{runner.last_name?.[0]}
        </div>
        <div>
          <h1 style={{color:"#e8eaf6",fontSize:"22px",fontWeight:900,margin:"0 0 6px"}}>{runner.first_name} {runner.last_name}</h1>
          <div style={{color:"#5a5f7a",fontSize:"13px"}}>{runner.email}{runner.phone?` · ${runner.phone}`:""}{runner.club?` · ${runner.club}`:""}</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px",marginBottom:"24px"}}>
        {[
          {l:"Αγώνες",v:myRaces.length,c:"#5c6bc0"},
          {l:"Φύλο",v:runner.gender||"—",c:"#42f5a7"},
          {l:"Σύλλογος",v:runner.club||"—",c:"#f5c842"},
        ].map(s=>(
          <div key={s.l} style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"12px",padding:"16px",textAlign:"center"}}>
            <div style={{color:s.c,fontSize:"20px",fontWeight:900}}>{s.v}</div>
            <div style={{color:"#3a3d52",fontSize:"10px",textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"4px"}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"16px",padding:"24px"}}>
        <h2 style={{color:"#e8eaf6",fontSize:"16px",margin:"0 0 16px"}}>Ιστορικό Αγώνων</h2>
        {myRaces.length===0&&<div style={{textAlign:"center",color:"#333",padding:"30px",fontSize:"14px"}}>Δεν υπάρχουν αγώνες</div>}
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {myRaces.map(({reg,race})=>(
            <div key={reg.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px",background:"#1a1d2e",borderRadius:"10px"}}>
              <div style={{background:"#5c6bc0",color:"#fff",borderRadius:"6px",padding:"2px 8px",fontWeight:700,fontSize:"14px"}}>#{reg.bib_number}</div>
              <div style={{flex:1}}>
                <div style={{color:"#e8eaf6",fontWeight:600,fontSize:"14px"}}>{race.name}</div>
                <div style={{color:"#5a5f7a",fontSize:"12px"}}>📅 {race.date} · 🏃 {race.distance} · {reg.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>;
}

// ─── ΑΘΛΗΤΕΣ TAB ───────────────────────────────────────────────────────────────
function RunnersTab({runners,races,registrations}){
  const [search,setSearch]=useState("");
  const [selectedRunner,setSelectedRunner]=useState(null);

  if(selectedRunner)return <RunnerProfile runner={selectedRunner} races={races} registrations={registrations} onBack={()=>setSelectedRunner(null)}/>;

  const filtered=runners.filter(r=>`${r.first_name} ${r.last_name} ${r.email||""} ${r.club||""}`.toLowerCase().includes(search.toLowerCase()));

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
      <h2 style={{margin:0,color:"#e8eaf6",fontSize:"20px"}}>Αθλητές ({runners.length})</h2>
    </div>
    <F><input placeholder="🔍 Αναζήτηση..." value={search} onChange={e=>setSearch(e.target.value)} style={css.input}/></F>
    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {filtered.map(runner=>{
        const raceCount=registrations.filter(r=>r.runner_id===runner.id).length;
        return <div key={runner.id} onClick={()=>setSelectedRunner(runner)} style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:"12px",padding:"14px 18px",display:"flex",alignItems:"center",gap:"12px",cursor:"pointer",transition:"border-color 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#5c6bc0"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="#1e2130"}>
          <div style={{width:"40px",height:"40px",borderRadius:"50%",background:"#5c6bc022",border:"1px solid #5c6bc044",display:"flex",alignItems:"center",justifyContent:"center",color:"#5c6bc0",fontWeight:700,fontSize:"14px",flexShrink:0}}>
            {runner.first_name?.[0]}{runner.last_name?.[0]}
          </div>
          <div style={{flex:1}}>
            <div style={{color:"#e8eaf6",fontWeight:700,fontSize:"14px"}}>{runner.first_name} {runner.last_name}</div>
            <div style={{color:"#5a5f7a",fontSize:"12px"}}>{runner.email}{runner.club?` · ${runner.club}`:""} · {raceCount} αγώνες</div>
          </div>
          <span style={{color:"#3a3d52",fontSize:"18px"}}>›</span>
        </div>;
      })}
    </div>
  </div>;
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────────
export default function App(){
  const [session,setSession]=useState(null);
  const [profile,setProfile]=useState(null);
  const [tab,setTab]=useState("races");
  const [races,setRaces]=useState([]);
  const [runners,setRunners]=useState([]);
  const [registrations,setRegistrations]=useState([]);
  const [loading,setLoading]=useState(true);
  const [publicRace,setPublicRace]=useState(null);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>setSession(session));
    supabase.auth.onAuthStateChange((_,session)=>setSession(session));
  },[]);

  useEffect(()=>{
    if(!session){setLoading(false);return;}
    async function fetchAll(){
      const [r1,r2,r3,r4]=await Promise.all([
        supabase.from("races").select("*").order("created_at",{ascending:false}),
        supabase.from("runners").select("*").order("created_at",{ascending:false}),
        supabase.from("registrations").select("*"),
        supabase.from("profiles").select("*").eq("id",session.user.id).single(),
      ]);
      if(r1.data)setRaces(r1.data);
      if(r2.data)setRunners(r2.data);
      if(r3.data)setRegistrations(r3.data);
      if(r4.data)setProfile(r4.data);
      setLoading(false);
    }
    fetchAll();
  },[session]);

  if(publicRace)return <PublicRacePage race={publicRace} registrations={registrations} runners={runners} onBack={()=>setPublicRace(null)}/>;
  if(!session)return <LoginPage/>;
  if(loading)return <div style={{minHeight:"100vh",background:"#080912",display:"flex",alignItems:"center",justifyContent:"center",color:"#5c6bc0",fontFamily:"Inter,sans-serif"}}>Φόρτωση...</div>;

  const TABS=[{id:"races",label:"🏟 Αγώνες"},{id:"regs",label:"📋 Εγγραφές"},{id:"runners",label:"🏃 Αθλητές"}];

  return <div style={{minHeight:"100vh",background:"#080912",color:"#e8eaf6",fontFamily:"Inter,sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet"/>
    <div style={{borderBottom:"1px solid #1a1c2a",padding:"16px 24px",background:"#0a0c16",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        <div style={{width:"36px",height:"36px",background:"#5c6bc0",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>🏃</div>
        <div>
          <div style={{color:"#e8eaf6",fontWeight:700,fontSize:"16px"}}>Race Management</div>
          <div style={{color:"#3a3d52",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase"}}>ΔΙΑΧΕΙΡΙΣΗ ΑΓΩΝΩΝ</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
        <span style={{color:"#5a5f7a",fontSize:"13px"}}>{session.user.email}</span>
        {profile?.role==="admin"&&<span style={{background:"#f5c84222",color:"#f5c842",border:"1px solid #f5c84244",borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>ADMIN</span>}
        <button onClick={()=>supabase.auth.signOut()} style={{background:"#ff3b5c18",color:"#ff3b5c",border:"1px solid #ff3b5c33",borderRadius:"8px",padding:"6px 12px",cursor:"pointer",fontSize:"12px",fontFamily:"inherit"}}>Αποσύνδεση</button>
      </div>
    </div>
    <div style={{display:"flex",gap:"4px",padding:"12px 24px",borderBottom:"1px solid #1a1c2a",background:"#0a0c16"}}>
      {TABS.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?"#5c6bc0":"none",color:tab===t.id?"#fff":"#5a5f7a",border:"none",borderRadius:"8px",padding:"8px 16px",cursor:"pointer",fontSize:"13px",fontWeight:tab===t.id?700:400,fontFamily:"inherit"}}>{t.label}</button>
      ))}
    </div>
    <div style={{padding:"28px",maxWidth:"960px",margin:"0 auto"}}>
      {tab==="races"&&<RacesTab races={races} setRaces={setRaces} runners={runners} registrations={registrations} session={session} profile={profile} onViewPublic={setPublicRace}/>}
      {tab==="regs"&&<RegistrationsTab races={races} runners={runners} setRunners={setRunners} registrations={registrations} setRegistrations={setRegistrations} session={session} profile={profile}/>}
      {tab==="runners"&&<RunnersTab runners={runners} races={races} registrations={registrations}/>}
    </div>
  </div>;
}

