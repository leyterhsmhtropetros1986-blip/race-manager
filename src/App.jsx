import { useState, useEffect } from "react";

const STORAGE_KEY = "athletin-gr-data";

function loadData() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    return d ? JSON.parse(d) : { races: [], runners: [], registrations: [] };
  } catch { return { races: [], runners: [], registrations: [] }; }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function genId() { return Math.random().toString(36).slice(2, 9); }

const DISTANCES = ["5km","10km","12km","20km","Ημιμαραθώνιος","Μαραθώνιος","Trail","Άλλο"];
const CATEGORIES = ["Γενική","Άνδρες 18-29","Άνδρες 30-39","Άνδρες 40-49","Άνδρες 50+","Γυναίκες 18-29","Γυναίκες 30-39","Γυναίκες 40-49","Γυναίκες 50+","Παίδες U18"];
const TSHIRTS = ["XS","S","M","L","XL","XXL"];

const css = {
  input: {
    width:"100%", background:"#1a1d2e", border:"1px solid #2a2d4a",
    borderRadius:"8px", padding:"10px 14px", color:"#e8eaf6",
    fontSize:"14px", outline:"none", boxSizing:"border-box", fontFamily:"inherit"
  },
  label: {
    display:"block", color:"#5a5f7a", fontSize:"11px",
    letterSpacing:"0.12em", textTransform:"uppercase",
    marginBottom:"5px", fontFamily:"inherit"
  }
};

function Field({ label, children }) {
  return (
    <div style={{marginBottom:"14px"}}>
      {label && <label style={css.label}>{label}</label>}
      {children}
    </div>
  );
}

function Input({ label, ...p }) {
  return <Field label={label}><input {...p} style={{...css.input,...p.style}} /></Field>;
}

function Select({ label, children, ...p }) {
  return <Field label={label}><select {...p} style={{...css.input,...p.style}}>{children}</select></Field>;
}

function Btn({ children, v="pri", sm, ...p }) {
  const vs = {
    pri:  {background:"#5c6bc0", color:"#fff", fontWeight:700},
    sec:  {background:"#1a1d2e", color:"#e8eaf6", border:"1px solid #2a2d4a"},
    red:  {background:"#ff3b5c18", color:"#ff3b5c", border:"1px solid #ff3b5c33"},
    grn:  {background:"#42f5a718", color:"#42f5a7", border:"1px solid #42f5a733"},
    ghost:{background:"none", color:"#5a5f7a", border:"1px solid #2a2d4a"},
  };
  return (
    <button {...p} style={{
      borderRadius:"8px", border:"none", cursor:"pointer",
      padding: sm ? "6px 12px" : "10px 20px",
      fontSize: sm ? "12px" : "13px",
      fontFamily:"inherit", letterSpacing:"0.04em",
      transition:"opacity 0.15s",
      ...vs[v], ...p.style
    }}>{children}</button>
  );
}

function Badge({ c="#5c6bc0", children }) {
  return (
    <span style={{
      background:c+"22", color:c, border:`1px solid ${c}44`,
      borderRadius:"99px", padding:"2px 10px",
      fontSize:"11px", fontFamily:"inherit"
    }}>{children}</span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:999, padding:"20px"
    }}>
      <div style={{
        background:"#0f1117", border:"1px solid #1e2130",
        borderRadius:"16px", padding:"28px", width:"100%",
        maxWidth:"520px", maxHeight:"88vh", overflowY:"auto",
        boxShadow:"0 32px 80px #000a"
      }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"22px"}}>
          <h2 style={{margin:0, color:"#e8eaf6", fontSize:"18px", fontFamily:"inherit"}}>{title}</h2>
          <button onClick={onClose} style={{background:"none", border:"none", color:"#444", cursor:"pointer", fontSize:"24px"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── ΑΓΩΝΕΣ ────────────────────────────────────────────────────────────────────
function RacesTab({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({name:"", date:"", location:"", distance:"10km", maxRunners:"", description:""});

  function add() {
    if (!form.name || !form.date) return;
    const race = { id:genId(), ...form, maxRunners:form.maxRunners?parseInt(form.maxRunners):null, status:"upcoming" };
    const next = {...data, races:[race,...data.races]};
    setData(next); saveData(next); setShowForm(false);
    setForm({name:"", date:"", location:"", distance:"10km", maxRunners:"", description:""});
  }

  function del(id) {
    if (!confirm("Διαγραφή αγώνα και όλων των εγγραφών;")) return;
    const next = {...data, races:data.races.filter(r=>r.id!==id), registrations:data.registrations.filter(r=>r.raceId!==id)};
    setData(next); saveData(next);
  }

  function toggleStatus(race) {
    const s = ["upcoming","active","finished"];
    const ns = s[(s.indexOf(race.status)+1)%s.length];
    const next = {...data, races:data.races.map(r=>r.id===race.id?{...r,status:ns}:r)};
    setData(next); saveData(next);
  }

  function exportCSV(race) {
    const regs = data.registrations.filter(r=>r.raceId===race.id);
    if (!regs.length) { alert("Δεν υπάρχουν εγγραφές"); return; }
    const rows = regs.map((reg,i) => {
      const runner = data.runners.find(r=>r.id===reg.runnerId)||{};
      return [i+1, reg.bibNumber||"", runner.firstName, runner.lastName, runner.email, runner.phone||"", reg.category, reg.tshirt||"", runner.club||"", reg.medicalCert?"ΝΑΙ":"ΟΧΙ"].join(",");
    });
    const csv = "Α/Α,BIB,Όνομα,Επώνυμο,Email,Τηλέφωνο,Κατηγορία,T-Shirt,Σύλλογος,Ιατρική\n" + rows.join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\uFEFF"+csv], {type:"text/csv;charset=utf-8"}));
    a.download = `${race.name.replace(/\s+/g,"-")}.csv`;
    a.click();
  }

  const statusColors = {upcoming:"#f5c842", active:"#42f5a7", finished:"#888"};
  const statusLabels = {upcoming:"ΠΡΟΣΕΧΩΣ", active:"ΕΝΕΡΓΟΣ", finished:"ΟΛΟΚΛΗΡΩΘΗΚΕ"};

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px"}}>
        <h2 style={{margin:0, color:"#e8eaf6", fontSize:"20px"}}>Αγώνες</h2>
        <Btn onClick={()=>setShowForm(true)}>+ Νέος Αγώνας</Btn>
      </div>

      {data.races.length === 0 && (
        <div style={{textAlign:"center", color:"#333", padding:"60px", fontSize:"14px"}}>
          Δεν υπάρχουν αγώνες ακόμα — δημιούργησε τον πρώτο!
        </div>
      )}

      <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
        {data.races.map(race => {
          const regCount = data.registrations.filter(r=>r.raceId===race.id).length;
          const sc = statusColors[race.status];
          return (
            <div key={race.id} style={{background:"#0f1117", border:"1px solid #1e2130", borderRadius:"14px", padding:"20px 24px"}}>
              <div style={{display:"flex", alignItems:"flex-start", gap:"12px", flexWrap:"wrap"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px", flexWrap:"wrap"}}>
                    <span style={{color:"#e8eaf6", fontWeight:700, fontSize:"16px"}}>{race.name}</span>
                    <Badge c={sc}>{statusLabels[race.status]}</Badge>
                  </div>
                  <div style={{color:"#5a5f7a", fontSize:"13px", lineHeight:"1.8"}}>
                    📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 🏃 {race.distance}<br/>
                    👤 {regCount}{race.maxRunners?`/${race.maxRunners}`:""} εγγεγραμμένοι
                    {race.description && <><br/>💬 {race.description}</>}
                  </div>
                </div>
              </div>
              <div style={{display:"flex", gap:"8px", marginTop:"14px", flexWrap:"wrap"}}>
                <Btn sm v="ghost" onClick={()=>toggleStatus(race)}>⟳ Κατάσταση</Btn>
                <Btn sm v="ghost" onClick={()=>exportCSV(race)}>📥 CSV</Btn>
                <Btn sm v="red" onClick={()=>del(race.id)}>✕ Διαγραφή</Btn>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <Modal title="Νέος Αγώνας" onClose={()=>setShowForm(false)}>
          <Input label="Όνομα Αγώνα *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="π.χ. Armeno Gate Trail Race 2026" />
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 12px"}}>
            <Input label="Ημερομηνία *" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
            <Input label="Τοποθεσία" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="π.χ. Στύρα Ευβοίας" />
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 12px"}}>
            <Select label="Απόσταση" value={form.distance} onChange={e=>setForm({...form,distance:e.target.value})}>
              {DISTANCES.map(d=><option key={d}>{d}</option>)}
            </Select>
            <Input label="Μέγ. Συμμετοχές" type="number" value={form.maxRunners} onChange={e=>setForm({...form,maxRunners:e.target.value})} placeholder="Κενό = απεριόριστο" />
          </div>
          <Field label="Περιγραφή">
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} style={{...css.input, resize:"vertical"}} placeholder="Προαιρετική περιγραφή..." />
          </Field>
          <div style={{display:"flex", gap:"10px", marginTop:"8px"}}>
            <Btn onClick={add} style={{flex:1}}>Δημιουργία</Btn>
            <Btn v="sec" onClick={()=>setShowForm(false)} style={{flex:1}}>Άκυρο</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ΕΓΓΡΑΦΕΣ ──────────────────────────────────────────────────────────────────
function RegistrationsTab({ data, setData }) {
  const [showForm, setShowForm] = useState(false);
  const [filterRace, setFilterRace] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    firstName:"", lastName:"", email:"", phone:"", dob:"", gender:"Άνδρας",
    club:"", raceId:"", category:"Γενική", tshirt:"M", medicalCert:false, bibNumber:""
  });

  function add() {
    if (!form.firstName||!form.lastName||!form.raceId) { alert("Συμπληρώστε όνομα, επώνυμο και αγώνα!"); return; }
    let runner = data.runners.find(r=>r.email&&r.email.toLowerCase()===form.email.toLowerCase());
    let newRunners = [...data.runners];
    if (!runner) {
      runner = { id:genId(), firstName:form.firstName, lastName:form.lastName, email:form.email, phone:form.phone, dob:form.dob, gender:form.gender, club:form.club };
      newRunners = [runner, ...data.runners];
    }
    if (data.registrations.find(r=>r.runnerId===runner.id&&r.raceId===form.raceId)) {
      alert("Ο αθλητής είναι ήδη εγγεγραμμένος σε αυτόν τον αγώνα!"); return;
    }
    const maxBib = data.registrations.filter(r=>r.raceId===form.raceId).reduce((mx,r)=>Math.max(mx,parseInt(r.bibNumber)||0),0);
    const reg = { id:genId(), runnerId:runner.id, raceId:form.raceId, category:form.category, tshirt:form.tshirt, medicalCert:form.medicalCert, bibNumber:form.bibNumber||(maxBib+1).toString(), registeredAt:new Date().toISOString() };
    const next = {...data, runners:newRunners, registrations:[reg,...data.registrations]};
    setData(next); saveData(next); setShowForm(false);
    setForm({firstName:"", lastName:"", email:"", phone:"", dob:"", gender:"Άνδρας", club:"", raceId:"", category:"Γενική", tshirt:"M", medicalCert:false, bibNumber:""});
  }

  function del(id) {
    const next = {...data, registrations:data.registrations.filter(r=>r.id!==id)};
    setData(next); saveData(next);
  }

  const filtered = data.registrations
    .filter(r=>filterRace==="all"||r.raceId===filterRace)
    .filter(r=>{
      const runner = data.runners.find(x=>x.id===r.runnerId);
      if (!runner) return false;
      return !search || `${runner.firstName} ${runner.lastName} ${runner.email}`.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
        <h2 style={{margin:0, color:"#e8eaf6", fontSize:"20px"}}>Εγγραφές <span style={{color:"#5a5f7a", fontSize:"14px"}}>({filtered.length})</span></h2>
        <Btn onClick={()=>setShowForm(true)}>+ Νέα Εγγραφή</Btn>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 12px", marginBottom:"8px"}}>
        <Select value={filterRace} onChange={e=>setFilterRace(e.target.value)}>
          <option value="all">Όλοι οι Αγώνες</option>
          {data.races.map(r=><option key={r.id} value={r.id}>{r.name} – {r.date}</option>)}
        </Select>
        <Field>
          <input placeholder="🔍 Αναζήτηση αθλητή..." value={search} onChange={e=>setSearch(e.target.value)} style={css.input} />
        </Field>
      </div>

      {filtered.length===0 && <div style={{textAlign:"center", color:"#333", padding:"60px", fontSize:"14px"}}>Δεν υπάρχουν εγγραφές</div>}

      <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
        {filtered.map(reg=>{
          const runner = data.runners.find(r=>r.id===reg.runnerId);
          const race = data.races.find(r=>r.id===reg.raceId);
          if (!runner||!race) return null;
          return (
            <div key={reg.id} style={{background:"#0f1117", border:"1px solid #1e2130", borderRadius:"12px", padding:"14px 18px", display:"flex", alignItems:"center", gap:"12px"}}>
              {reg.bibNumber && (
                <div style={{background:"#5c6bc0", color:"#fff", borderRadius:"8px", padding:"4px 10px", fontWeight:700, fontSize:"16px", flexShrink:0}}>
                  #{reg.bibNumber}
                </div>
              )}
              <div style={{flex:1}}>
                <div style={{color:"#e8eaf6", fontWeight:700, fontSize:"14px"}}>{runner.firstName} {runner.lastName}</div>
                <div style={{color:"#5a5f7a", fontSize:"12px"}}>
                  {race.name} · {race.date} · {reg.category} · T-shirt: {reg.tshirt}
                  {reg.medicalCert && " · ✅ Ιατρική"}
                </div>
                <div style={{color:"#5a5f7a", fontSize:"12px"}}>{runner.email} {runner.phone?`· ${runner.phone}`:""}</div>
              </div>
              <Badge c={runner.gender==="Άνδρας"?"#5b8fff":"#ff5bce"}>{runner.gender==="Άνδρας"?"♂":"♀"}</Badge>
              <Btn sm v="red" onClick={()=>del(reg.id)}>✕</Btn>
            </div>
          );
        })}
      </div>

      {showForm && (
        <Modal title="Νέα Εγγραφή Αθλητή" onClose={()=>setShowForm(false)}>
          <Select label="Αγώνας *" value={form.raceId} onChange={e=>setForm({...form,raceId:e.target.value})}>
            <option value="">Επιλέξτε αγώνα...</option>
            {data.races.map(r=><option key={r.id} value={r.id}>{r.name} – {r.date}</option>)}
          </Select>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 12px"}}>
            <Input label="Όνομα *" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} />
            <Input label="Επώνυμο *" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 12px"}}>
            <Input label="Τηλέφωνο" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
            <Input label="Ημ. Γέννησης" type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})} />
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 12px"}}>
            <Select label="Φύλο" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
              <option>Άνδρας</option><option>Γυναίκα</option><option>Άλλο</option>
            </Select>
            <Input label="Σύλλογος" value={form.club} onChange={e=>setForm({...form,club:e.target.value})} placeholder="Προαιρετικό" />
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 12px"}}>
            <Select label="Κατηγορία" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </Select>
            <Select label="T-Shirt" value={form.tshirt} onChange={e=>setForm({...form,tshirt:e.target.value})}>
              {TSHIRTS.map(t=><option key={t}>{t}</option>)}
            </Select>
            <Input label="BIB (προαιρ.)" value={form.bibNumber} onChange={e=>setForm({...form,bibNumber:e.target.value})} placeholder="Αυτόματο" />
          </div>
          <label style={{display:"flex", alignItems:"center", gap:"8px", color:"#5a5f7a", fontSize:"13px", cursor:"pointer", marginBottom:"16px"}}>
            <input type="checkbox" checked={form.medicalCert} onChange={e=>setForm({...form,medicalCert:e.target.checked})} />
            Έχει προσκομίσει ιατρική βεβαίωση
          </label>
          <div style={{display:"flex", gap:"10px"}}>
            <Btn onClick={add} style={{flex:1}}>Εγγραφή</Btn>
            <Btn v="sec" onClick={()=>setShowForm(false)} style={{flex:1}}>Άκυρο</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ΑΘΛΗΤΕΣ ───────────────────────────────────────────────────────────────────
function RunnersTab({ data }) {
  const [search, setSearch] = useState("");
  const filtered = data.runners.filter(r =>
    `${r.firstName} ${r.lastName} ${r.email} ${r.club||""}`.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
        <h2 style={{margin:0, color:"#e8eaf6", fontSize:"20px"}}>Αθλητές <span style={{color:"#5a5f7a", fontSize:"14px"}}>({data.runners.length})</span></h2>
      </div>
      <Field><input placeholder="🔍 Αναζήτηση..." value={search} onChange={e=>setSearch(e.target.value)} style={css.input} /></Field>
      {filtered.length===0 && <div style={{textAlign:"center", color:"#333", padding:"60px", fontSize:"14px"}}>Δεν βρέθηκαν αθλητές</div>}
      <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
        {filtered.map(runner=>{
          const races = data.registrations.filter(r=>r.runnerId===runner.id).length;
          return (
            <div key={runner.id} style={{background:"#0f1117", border:"1px solid #1e2130", borderRadius:"12px", padding:"14px 18px", display:"flex", alignItems:"center", gap:"12px"}}>
              <div style={{width:"40px", height:"40px", borderRadius:"50%", background:"#5c6bc022", border:"1px solid #5c6bc044", display:"flex", alignItems:"center", justifyContent:"center", color:"#5c6bc0", fontWeight:700, fontSize:"14px", flexShrink:0}}>
                {runner.firstName?.[0]}{runner.lastName?.[0]}
              </div>
              <div style={{flex:1}}>
                <div style={{color:"#e8eaf6", fontWeight:700, fontSize:"14px"}}>{runner.firstName} {runner.lastName}</div>
                <div style={{color:"#5a5f7a", fontSize:"12px"}}>{runner.email}{runner.phone?` · ${runner.phone}`:""}{runner.club?` · ${runner.club}`:""} · {races} αγώνες</div>
              </div>
              <Badge c={runner.gender==="Άνδρας"?"#5b8fff":runner.gender==="Γυναίκα"?"#ff5bce":"#888"}>{runner.gender}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ΚΥΡΙΑ ΕΦΑΡΜΟΓΗ ────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("races");
  const [data, setData] = useState(loadData());

  const TABS = [
    {id:"races",    label:"🏟 Αγώνες"},
    {id:"regs",     label:"📋 Εγγραφές"},
    {id:"runners",  label:"🏃 Αθλητές"},
  ];

  return (
    <div style={{minHeight:"100vh", background:"#080912", color:"#e8eaf6", fontFamily:"Inter, sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{borderBottom:"1px solid #1a1c2a", padding:"0 24px", background:"#0a0c16", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px"}}>
        <div style={{display:"flex", alignItems:"center", gap:"12px", padding:"16px 0"}}>
          <div style={{width:"36px", height:"36px", background:"#5c6bc0", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px"}}>🏃</div>
          <div>
            <div style={{color:"#e8eaf6", fontWeight:700, fontSize:"16px"}}>RaceManager</div>
            <div style={{color:"#3a3d52", fontSize:"10px", letterSpacing:"0.15em", textTransform:"uppercase"}}>ΔΙΑΧΕΙΡΙΣΗ ΑΓΩΝΩΝ ΔΡΟΜΟΥ</div>
          </div>
        </div>
        <div style={{display:"flex", gap:"4px", flexWrap:"wrap"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              background:tab===t.id?"#5c6bc0":"none",
              color:tab===t.id?"#fff":"#5a5f7a",
              border:"none", borderRadius:"8px", padding:"8px 16px",
              cursor:"pointer", fontFamily:"inherit", fontSize:"13px",
              fontWeight:tab===t.id?700:400, transition:"all 0.15s"
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{display:"flex", gap:"1px", borderBottom:"1px solid #1a1c2a", background:"#1a1c2a"}}>
        {[
          {l:"Αγώνες",   v:data.races.length,         c:"#5c6bc0"},
          {l:"Αθλητές",  v:data.runners.length,        c:"#42f5a7"},
          {l:"Εγγραφές", v:data.registrations.length,  c:"#f5c842"},
        ].map(s=>(
          <div key={s.l} style={{flex:1, background:"#080912", padding:"14px 20px"}}>
            <div style={{color:s.c, fontSize:"26px", fontWeight:900}}>{s.v}</div>
            <div style={{color:"#3a3d52", fontSize:"10px", letterSpacing:"0.1em", textTransform:"uppercase"}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{padding:"28px", maxWidth:"960px", margin:"0 auto"}}>
        {tab==="races"   && <RacesTab data={data} setData={setData} />}
        {tab==="regs"    && <RegistrationsTab data={data} setData={setData} />}
        {tab==="runners" && <RunnersTab data={data} />}
      </div>
    </div>
  );
}
