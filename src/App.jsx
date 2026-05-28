import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kcqnykjbgqjlgcxmcaro.supabase.co";
const SUPABASE_KEY = "sb_publishable_0dnpl6eFXDjB1Ot26f-qsg_B9IasaUw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ═══════════════════════════════════════════════════════════════════════════════
// ΜΕΤΑΦΡΑΣΕΙΣ (ΕΛ / ΕΝ)
// ═══════════════════════════════════════════════════════════════════════════════
const STR = {
  el: {
    appName:"Race Management", tagline:"Πλατφόρμα Διαχείρισης Αγώνων",
    welcome:"Καλώς ήρθες! 👋", chooseRole:"Διάλεξε τον ρόλο σου για να συνεχίσεις",
    imOrganizer:"Είμαι Διοργανωτής", organizerDesc:"Δημιουργώ & διαχειρίζομαι αγώνες",
    imAthlete:"Είμαι Αθλητής", athleteDesc:"Βλέπω αγώνες & εγγράφομαι",
    organizer:"Διοργανωτής", athlete:"Αθλητής",
    signup:"Νέα Εγγραφή", login:"Σύνδεση",
    signupAs:"Δημιούργησε νέο λογαριασμό ως", loginAs:"Σύνδεση με υπάρχοντα λογαριασμό",
    orgNeedsApproval:"⚠️ Ο λογαριασμός Διοργανωτή χρειάζεται έγκριση από admin πριν ενεργοποιηθεί.",
    fullName:"Ονοματεπώνυμο", email:"Email", password:"Κωδικός",
    fillEmailPass:"Συμπληρώστε email και κωδικό!", fillName:"Συμπληρώστε ονοματεπώνυμο!",
    wrongCreds:"Λάθος email ή κωδικός!",
    signupOk:"✅ Εγγραφή επιτυχής! Ο λογαριασμός σας θα ενεργοποιηθεί μετά από έγκριση admin.",
    checkEmail:"✅ Ελέγξτε το email σας για επιβεβαίωση!",
    changeRole:"← Αλλαγή ρόλου", signupBtn:"✨ Εγγραφή ως", loginBtn:"🔑 Σύνδεση",
    logout:"Αποσύνδεση", adminPanel:"ΔΙΑΧΕΙΡΙΣΗ ΑΓΩΝΩΝ", athletePanel:"ΠΑΝΕΛ ΑΘΛΗΤΗ",
    loading:"Φόρτωση...",
    pendingTitle:"Λογαριασμός σε Αναμονή",
    pendingMsg1:"Ο λογαριασμός σας ως Διοργανωτής έχει δημιουργηθεί επιτυχώς!",
    pendingMsg2:"Πρέπει πρώτα να εγκριθεί από admin για να μπορείτε να δημιουργείτε αγώνες.",
    rejectedTitle:"Η Αίτηση Απορρίφθηκε", rejectedMsg:"Επικοινωνήστε με τον διαχειριστή.",
    tabRaces:"🏟 Αγώνες", tabRegs:"📋 Εγγραφές", tabAdmin:"👑 Admin",
    availableRaces:"🏟 Διαθέσιμοι Αγώνες", myRegs:"📋 Οι Εγγραφές μου",
    availableRacesTitle:"Διαθέσιμοι Αγώνες", noAvailable:"Δεν υπάρχουν διαθέσιμοι αγώνες",
    myRegsTitle:"Οι Εγγραφές μου", noRegs:"Δεν έχεις εγγραφές ακόμα",
    registered:"εγγεγραμμένοι", alreadyReg:"Είσαι ήδη εγγεγραμμένος! Διαδρομή:",
    regBtn:"+ Εγγραφή στον Αγώνα", regForRace:"Εγγραφή στον",
    statusUpcoming:"ΠΡΟΣΕΧΩΣ", statusActive:"ΕΝΕΡΓΟΣ", statusFinished:"ΟΛΟΚΛΗΡΩΘΗΚΕ",
    regEarlyBird:"ΕΓΓΕΓΡΑΜΜΕΝΟΣ",
    distance:"Διαδρομή", category:"Κατηγορία", tshirt:"T-Shirt", phone:"Τηλέφωνο",
    dob:"Ημ. Γέννησης", gender:"Φύλο", club:"Σύλλογος", optional:"Προαιρετικό",
    male:"Άνδρας", female:"Γυναίκα", other:"Άλλο",
    medicalCert:"Έχω ιατρική βεβαίωση καταλληλότητας",
    cost:"💰 Κόστος Συμμετοχής", earlyBirdDiscount:"🏷️ Early Bird έκπτωση",
    confirmReg:"Επιβεβαίωση Εγγραφής", cancel:"Άκυρο",
    selectDistance:"Επιλέξτε διαδρομή!", alreadyRegAlert:"Είσαι ήδη εγγεγραμμένος!",
    extraInfo:"✨ Επιπλέον Στοιχεία", pleaseComplete:"Συμπληρώστε:", select:"— Επιλέξτε —", yes:"Ναι",
    myRacesTitle:"Οι Αγώνες μου", adminAll:"(admin — όλοι)", newRace:"+ Νέος Αγώνας",
    noRacesYet:"Δεν έχεις δημιουργήσει αγώνες ακόμα!",
    totalRev:"συνολικά", statusBtn:"⟳ Κατάσταση", excelBtn:"📊 Excel", pdfBtn:"📄 PDF", deleteBtn:"✕ Διαγραφή",
    deleteConfirm:"Διαγραφή αγώνα;", noRegsCsv:"Δεν υπάρχουν εγγραφές!",
    newRaceTitle:"Νέος Αγώνας", editRaceTitle:"Επεξεργασία Αγώνα", editBtn:"✏️ Επεξεργασία", saveChanges:"Αποθήκευση Αλλαγών", raceName:"Όνομα Αγώνα *", date:"Ημερομηνία *",
    location:"Τοποθεσία", fillNameDate:"Συμπληρώστε όνομα και ημερομηνία!",
    addDistance:"Προσθέστε τουλάχιστον μία διαδρομή!",
    maxRunners:"Μέγ. Συμμετοχές", maxRunnersPlaceholder:"Κενό = απεριόριστο",
    description:"Περιγραφή", createRace:"Δημιουργία Αγώνα",
    distancesLabel:"Διαδρομές / Αποστάσεις *", quickSelect:"Γρήγορη επιλογή:",
    customDistance:"Ή γράψε δική σου π.χ. 23.5km", add:"+ Προσθήκη",
    pricingLabel:"💰 Τιμές Συμμετοχής (€)", addDistancesFirst:"⚠️ Πρόσθεσε πρώτα διαδρομές για να βάλεις τιμές",
    perksLabel:"🎁 Παροχές που Περιλαμβάνονται", customPerk:"Ή πρόσθεσε δική σου παροχή",
    earlyBirdLabel:"⏰ Early Bird Discount",
    enableEarlyBird:"Ενεργοποίηση Early Bird (έκπτωση για όσους εγγραφούν νωρίς)",
    earlyBirdDeadline:"Λήξη Early Bird", earlyBirdPercent:"Έκπτωση (%)",
    customFieldsLabel:"✨ Custom Πεδία Εγγραφής (προαιρετικά)",
    customFieldsDesc:"Πρόσθεσε επιπλέον πεδία που θέλεις να συμπληρώσουν οι αθλητές κατά την εγγραφή.",
    fieldLabel:"Ετικέτα πεδίου π.χ. Νούμερο κάλτσας",
    typeText:"📝 Κείμενο", typeNumber:"🔢 Αριθμός", typeCheckbox:"☑️ Ναι/Όχι", typeSelect:"📋 Επιλογές",
    selectOptions:"Επιλογές χωρισμένες με κόμμα π.χ. 38,39,40,41,42",
    required:"Υποχρεωτικό", addField:"+ Προσθήκη Πεδίου",
    regsTitle:"Εγγραφές στους Αγώνες μου", total:"Σύνολο:", allRaces:"Όλοι οι Αγώνες", noRegsList:"Δεν υπάρχουν εγγραφές",
    pendingTab:"⏳ Σε Αναμονή", allTab:"👥 Όλοι", allOrgsTab:"👥 Όλοι οι Διοργανωτές",
    pendingOrgsTitle:"Διοργανωτές σε Αναμονή", allOrgsTitle:"Όλοι οι Διοργανωτές",
    noPending:"🎉 Δεν υπάρχουν σε αναμονή!",
    approve:"✅ Έγκριση", reject:"❌ Απόρριψη", reApprove:"✅ Επανέγκριση", makeAdminBtn:"👑 Κάντον Admin",
    rejectConfirm:"Απόρριψη;", makeAdminConfirm:"Να γίνει admin;",
    statusPending:"⏳ ΣΕ ΑΝΑΜΟΝΗ", statusApproved:"✅ ΕΓΚΡΙΘΗΚΕ", statusRejected:"❌ ΑΠΟΡΡΙΦΘΗΚΕ",
    badgeAdmin:"👑 ADMIN", badgeOrganizer:"ΔΙΟΡΓΑΝΩΤΗΣ", badgePending:"⏳ ΣΕ ΑΝΑΜΟΝΗ", badgeAthlete:"ΑΘΛΗΤΗΣ",
  },
  en: {
    appName:"Race Management", tagline:"Race Management Platform",
    welcome:"Welcome! 👋", chooseRole:"Choose your role to continue",
    imOrganizer:"I'm an Organizer", organizerDesc:"Create & manage races",
    imAthlete:"I'm an Athlete", athleteDesc:"Browse races & register",
    organizer:"Organizer", athlete:"Athlete",
    signup:"Sign Up", login:"Log In",
    signupAs:"Create a new account as", loginAs:"Log in with existing account",
    orgNeedsApproval:"⚠️ Organizer accounts require admin approval before activation.",
    fullName:"Full Name", email:"Email", password:"Password",
    fillEmailPass:"Please fill in email and password!", fillName:"Please fill in your full name!",
    wrongCreds:"Wrong email or password!",
    signupOk:"✅ Sign up successful! Your account will be activated after admin approval.",
    checkEmail:"✅ Check your email for confirmation!",
    changeRole:"← Change role", signupBtn:"✨ Sign up as", loginBtn:"🔑 Log In",
    logout:"Log out", adminPanel:"RACE MANAGEMENT", athletePanel:"ATHLETE PANEL",
    loading:"Loading...",
    pendingTitle:"Account Pending",
    pendingMsg1:"Your Organizer account has been created successfully!",
    pendingMsg2:"It must first be approved by an admin so you can create races.",
    rejectedTitle:"Application Rejected", rejectedMsg:"Please contact the administrator.",
    tabRaces:"🏟 Races", tabRegs:"📋 Registrations", tabAdmin:"👑 Admin",
    availableRaces:"🏟 Available Races", myRegs:"📋 My Registrations",
    availableRacesTitle:"Available Races", noAvailable:"No available races",
    myRegsTitle:"My Registrations", noRegs:"You have no registrations yet",
    registered:"registered", alreadyReg:"You're already registered! Distance:",
    regBtn:"+ Register for Race", regForRace:"Register for",
    statusUpcoming:"UPCOMING", statusActive:"ACTIVE", statusFinished:"FINISHED",
    regEarlyBird:"REGISTERED",
    distance:"Distance", category:"Category", tshirt:"T-Shirt", phone:"Phone",
    dob:"Date of Birth", gender:"Gender", club:"Club", optional:"Optional",
    male:"Male", female:"Female", other:"Other",
    medicalCert:"I have a medical fitness certificate",
    cost:"💰 Registration Cost", earlyBirdDiscount:"🏷️ Early Bird discount",
    confirmReg:"Confirm Registration", cancel:"Cancel",
    selectDistance:"Select a distance!", alreadyRegAlert:"You're already registered!",
    extraInfo:"✨ Additional Information", pleaseComplete:"Please complete:", select:"— Select —", yes:"Yes",
    myRacesTitle:"My Races", adminAll:"(admin — all)", newRace:"+ New Race",
    noRacesYet:"You haven't created any races yet!",
    totalRev:"total", statusBtn:"⟳ Status", excelBtn:"📊 Excel", pdfBtn:"📄 PDF", deleteBtn:"✕ Delete",
    deleteConfirm:"Delete race?", noRegsCsv:"No registrations!",
    newRaceTitle:"New Race", editRaceTitle:"Edit Race", editBtn:"✏️ Edit", saveChanges:"Save Changes", raceName:"Race Name *", date:"Date *",
    location:"Location", fillNameDate:"Please fill in name and date!",
    addDistance:"Please add at least one distance!",
    maxRunners:"Max Participants", maxRunnersPlaceholder:"Empty = unlimited",
    description:"Description", createRace:"Create Race",
    distancesLabel:"Routes / Distances *", quickSelect:"Quick select:",
    customDistance:"Or type your own e.g. 23.5km", add:"+ Add",
    pricingLabel:"💰 Registration Prices (€)", addDistancesFirst:"⚠️ Add distances first to set prices",
    perksLabel:"🎁 Included Perks", customPerk:"Or add your own perk",
    earlyBirdLabel:"⏰ Early Bird Discount",
    enableEarlyBird:"Enable Early Bird (discount for those who register early)",
    earlyBirdDeadline:"Early Bird Deadline", earlyBirdPercent:"Discount (%)",
    customFieldsLabel:"✨ Custom Registration Fields (optional)",
    customFieldsDesc:"Add extra fields you want athletes to fill in during registration.",
    fieldLabel:"Field label e.g. Sock size",
    typeText:"📝 Text", typeNumber:"🔢 Number", typeCheckbox:"☑️ Yes/No", typeSelect:"📋 Options",
    selectOptions:"Options separated by commas e.g. 38,39,40,41,42",
    required:"Required", addField:"+ Add Field",
    regsTitle:"Registrations in My Races", total:"Total:", allRaces:"All Races", noRegsList:"No registrations",
    pendingTab:"⏳ Pending", allTab:"👥 All", allOrgsTab:"👥 All Organizers",
    pendingOrgsTitle:"Pending Organizers", allOrgsTitle:"All Organizers",
    noPending:"🎉 No pending organizers!",
    approve:"✅ Approve", reject:"❌ Reject", reApprove:"✅ Re-approve", makeAdminBtn:"👑 Make Admin",
    rejectConfirm:"Reject?", makeAdminConfirm:"Make admin?",
    statusPending:"⏳ PENDING", statusApproved:"✅ APPROVED", statusRejected:"❌ REJECTED",
    badgeAdmin:"👑 ADMIN", badgeOrganizer:"ORGANIZER", badgePending:"⏳ PENDING", badgeAthlete:"ATHLETE",
  }
};

const LangContext = createContext({lang:"el", t:STR.el, setLang:()=>{}});
function useLang(){return useContext(LangContext);}

// ─── THEME ─────────────────────────────────────────────────────────────────────
const T = {
  bg:"#f5f3ef", bgAlt:"#ffffff", bgInput:"#ffffff",
  border:"#e0ddd6", borderDark:"#c9c5bc",
  text:"#2a2a2e", textMid:"#6b6b73", textLight:"#9a9aa3",
  primary:"#4a5dc7", primaryDark:"#3a4ba8",
  accent:"#2da77f", accentDark:"#1f8862",
  warning:"#d4a017", danger:"#d04545",
  shadow:"0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
};

const CATEGORIES = ["Γενική","Άνδρες 18-29","Άνδρες 30-39","Άνδρες 40-49","Άνδρες 50+","Γυναίκες 18-29","Γυναίκες 30-39","Γυναίκες 40-49","Γυναίκες 50+","Παίδες U18"];
const TSHIRTS = ["XS","S","M","L","XL","XXL"];
const SUGGESTED_DISTANCES = ["5km","10km","12km","15km","20km","21km","23km","42km","Ημιμαραθώνιος","Μαραθώνιος","Trail","Ορεινός"];
const SUGGESTED_PERKS = ["👕 T-Shirt","🏅 Μετάλλιο","🍝 Φαγητό","💧 Νερό/Ρόφημα","🎒 Goody Bag","📸 Φωτογραφίες","🚿 Ντουζιέρες","🏥 Ιατρική Κάλυψη","🎟️ Χρονομέτρηση","📋 Πιστοποιητικό"];

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

// ─── LANGUAGE TOGGLE ──────────────────────────────────────────────────────────
function LangToggle(){
  const {lang,setLang}=useLang();
  return <div style={{display:"flex",background:T.bg,borderRadius:"8px",padding:"3px",border:`1px solid ${T.border}`}}>
    <button onClick={()=>setLang("el")} style={{background:lang==="el"?T.primary:"none",color:lang==="el"?"#fff":T.textMid,border:"none",borderRadius:"6px",padding:"4px 10px",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🇬🇷 ΕΛ</button>
    <button onClick={()=>setLang("en")} style={{background:lang==="en"?T.primary:"none",color:lang==="en"?"#fff":T.textMid,border:"none",borderRadius:"6px",padding:"4px 10px",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🇬🇧 EN</button>
  </div>;
}

// ─── PICKERS ──────────────────────────────────────────────────────────────────
function DistancesPicker({distances,onChange}){
  const {t}=useLang();
  const [custom,setCustom]=useState("");
  function addDistance(d){if(!distances.includes(d))onChange([...distances,d]);}
  function removeDistance(d){onChange(distances.filter(x=>x!==d));}
  function addCustom(){if(custom.trim()&&!distances.includes(custom.trim())){onChange([...distances,custom.trim()]);setCustom("");}}
  return <F label={t.distancesLabel}>
    <div style={{marginBottom:"10px"}}>
      <div style={{color:T.textMid,fontSize:"11px",marginBottom:"6px"}}>{t.quickSelect}</div>
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
        {SUGGESTED_DISTANCES.map(d=>(
          <button key={d} onClick={()=>addDistance(d)} style={{background:distances.includes(d)?T.primary:T.bgAlt,color:distances.includes(d)?"#fff":T.textMid,border:`1px solid ${distances.includes(d)?T.primary:T.border}`,borderRadius:"6px",padding:"4px 10px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>{d}</button>
        ))}
      </div>
    </div>
    <div style={{display:"flex",gap:"8px",marginBottom:"10px"}}>
      <input value={custom} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustom()} placeholder={t.customDistance} style={{...css.input,flex:1}}/>
      <button onClick={addCustom} style={{background:T.primary,color:"#fff",border:"none",borderRadius:"8px",padding:"0 16px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,whiteSpace:"nowrap"}}>{t.add}</button>
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

function PricingPicker({distances,pricing,onChange}){
  const {t}=useLang();
  function updatePrice(distance,price){
    const existing=pricing.find(p=>p.distance===distance);
    if(existing){onChange(pricing.map(p=>p.distance===distance?{...p,price:parseFloat(price)||0}:p));}
    else{onChange([...pricing,{distance,price:parseFloat(price)||0}]);}
  }
  function getPrice(distance){return pricing.find(p=>p.distance===distance)?.price||"";}
  if(distances.length===0)return <div style={{background:`${T.warning}15`,border:`1px solid ${T.warning}44`,borderRadius:"8px",padding:"12px",color:T.warning,fontSize:"12px",marginBottom:"14px"}}>{t.addDistancesFirst}</div>;
  return <F label={t.pricingLabel}>
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

function PerksPicker({perks,onChange}){
  const {t}=useLang();
  const [custom,setCustom]=useState("");
  function toggle(p){perks.includes(p)?onChange(perks.filter(x=>x!==p)):onChange([...perks,p]);}
  function addCustom(){if(custom.trim()&&!perks.includes(custom.trim())){onChange([...perks,custom.trim()]);setCustom("");}}
  return <F label={t.perksLabel}>
    <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"10px"}}>
      {SUGGESTED_PERKS.map(p=>(
        <button key={p} onClick={()=>toggle(p)} style={{background:perks.includes(p)?T.accent:T.bgAlt,color:perks.includes(p)?"#fff":T.textMid,border:`1px solid ${perks.includes(p)?T.accent:T.border}`,borderRadius:"6px",padding:"6px 12px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>{p}</button>
      ))}
    </div>
    <div style={{display:"flex",gap:"8px"}}>
      <input value={custom} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustom()} placeholder={t.customPerk} style={{...css.input,flex:1}}/>
      <button onClick={addCustom} style={{background:T.accent,color:"#fff",border:"none",borderRadius:"8px",padding:"0 16px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,whiteSpace:"nowrap"}}>{t.add}</button>
    </div>
    {perks.filter(p=>!SUGGESTED_PERKS.includes(p)).length>0&&(
      <div style={{marginTop:"10px",display:"flex",gap:"6px",flexWrap:"wrap"}}>
        {perks.filter(p=>!SUGGESTED_PERKS.includes(p)).map((p,i)=>(
          <span key={i} style={{background:`${T.accent}15`,border:`1px solid ${T.accent}33`,borderRadius:"6px",padding:"4px 10px",fontSize:"13px",color:T.text,display:"flex",alignItems:"center",gap:"6px"}}>
            {p}<button onClick={()=>toggle(p)} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",fontSize:"16px",padding:0,lineHeight:1}}>×</button>
          </span>
        ))}
      </div>
    )}
  </F>;
}

function EarlyBirdPicker({earlyBird,onChange}){
  const {t}=useLang();
  const [enabled,setEnabled]=useState(!!earlyBird);
  function update(field,value){if(!enabled)return;onChange({...earlyBird,[field]:value});}
  function toggleEnabled(e){const checked=e.target.checked;setEnabled(checked);if(checked){onChange({deadline:"",discount_percent:10});}else{onChange(null);}}
  return <F label={t.earlyBirdLabel}>
    <label style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",marginBottom:"10px",fontSize:"13px",color:T.text}}>
      <input type="checkbox" checked={enabled} onChange={toggleEnabled}/>{t.enableEarlyBird}
    </label>
    {enabled&&earlyBird&&(
      <div style={{background:`${T.warning}10`,border:`1px solid ${T.warning}44`,borderRadius:"8px",padding:"14px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
          <div><label style={{...css.label,marginBottom:"4px"}}>{t.earlyBirdDeadline}</label><input type="date" value={earlyBird.deadline||""} onChange={e=>update("deadline",e.target.value)} style={css.input}/></div>
          <div><label style={{...css.label,marginBottom:"4px"}}>{t.earlyBirdPercent}</label><input type="number" min="1" max="99" value={earlyBird.discount_percent||10} onChange={e=>update("discount_percent",parseInt(e.target.value)||0)} style={css.input}/></div>
        </div>
      </div>
    )}
  </F>;
}

function CustomFieldsPicker({fields,onChange}){
  const {t}=useLang();
  const [newField,setNewField]=useState({label:"",type:"text",required:false,options:""});
  function addField(){
    if(!newField.label.trim())return;
    const f={...newField,id:Date.now().toString()};
    if(f.type==="select"){f.options=newField.options.split(",").map(x=>x.trim()).filter(Boolean);}else{delete f.options;}
    onChange([...fields,f]);
    setNewField({label:"",type:"text",required:false,options:""});
  }
  function removeField(id){onChange(fields.filter(f=>f.id!==id));}
  return <F label={t.customFieldsLabel}>
    <div style={{color:T.textMid,fontSize:"12px",marginBottom:"10px"}}>{t.customFieldsDesc}</div>
    {fields.length>0&&(
      <div style={{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"12px"}}>
        {fields.map(f=>(
          <div key={f.id} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"10px 14px",display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{flex:1}}>
              <div style={{color:T.text,fontSize:"13px",fontWeight:600}}>{f.label}{f.required&&" *"}</div>
              <div style={{color:T.textLight,fontSize:"11px"}}>
                {f.type==="text"&&t.typeText}{f.type==="number"&&t.typeNumber}{f.type==="checkbox"&&t.typeCheckbox}{f.type==="select"&&`${t.typeSelect}: ${(f.options||[]).join(", ")}`}
              </div>
            </div>
            <button onClick={()=>removeField(f.id)} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",fontSize:"18px"}}>×</button>
          </div>
        ))}
      </div>
    )}
    <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"14px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 140px",gap:"10px",marginBottom:"10px"}}>
        <input value={newField.label} onChange={e=>setNewField({...newField,label:e.target.value})} placeholder={t.fieldLabel} style={css.input}/>
        <select value={newField.type} onChange={e=>setNewField({...newField,type:e.target.value})} style={css.input}>
          <option value="text">{t.typeText}</option><option value="number">{t.typeNumber}</option><option value="checkbox">{t.typeCheckbox}</option><option value="select">{t.typeSelect}</option>
        </select>
      </div>
      {newField.type==="select"&&(<input value={newField.options} onChange={e=>setNewField({...newField,options:e.target.value})} placeholder={t.selectOptions} style={{...css.input,marginBottom:"10px"}}/>)}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <label style={{display:"flex",alignItems:"center",gap:"6px",cursor:"pointer",fontSize:"12px",color:T.textMid}}><input type="checkbox" checked={newField.required} onChange={e=>setNewField({...newField,required:e.target.checked})}/>{t.required}</label>
        <Btn sm onClick={addField}>{t.addField}</Btn>
      </div>
    </div>
  </F>;
}

// ─── LOGIN ──────────────────────────────────────────────────────────────────────
function LoginPage(){
  const {t}=useLang();
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
    if(!email||!password){setError(t.fillEmailPass);return;}
    if(mode==="signup"&&!name){setError(t.fillName);return;}
    setLoading(true);
    if(mode==="login"){
      const {error}=await supabase.auth.signInWithPassword({email,password});
      if(error)setError(t.wrongCreds);
      setLoading(false);return;
    }
    const {data,error}=await supabase.auth.signUp({email,password});
    if(error){setError(error.message);setLoading(false);return;}
    if(data.user){
      const initialStatus=role==="organizer"?"pending":"approved";
      await supabase.from("profiles").insert([{id:data.user.id,email,full_name:name,role:role,status:initialStatus}]);
      setError(role==="organizer"?t.signupOk:t.checkEmail);
    }
    setLoading(false);
  }

  const roleColor=role==="organizer"?T.primary:T.accent;
  const roleIcon=role==="organizer"?"🏟":"🏃";
  const roleLabel=role==="organizer"?t.organizer:t.athlete;

  return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif",padding:"20px",position:"relative"}}>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
    <div style={{position:"absolute",top:"20px",right:"20px"}}><LangToggle/></div>
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"20px",padding:"40px",width:"100%",maxWidth:"460px",boxShadow:T.shadow}}>
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <div style={{width:"60px",height:"60px",background:T.primary,borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",margin:"0 auto 16px"}}>🏃</div>
        <h1 style={{color:T.text,fontSize:"22px",fontWeight:900,margin:"0 0 4px"}}>{t.appName}</h1>
        <p style={{color:T.textMid,fontSize:"13px",margin:0}}>{t.tagline}</p>
      </div>
      {step==="role"&&(
        <div>
          <h3 style={{color:T.text,textAlign:"center",fontSize:"15px",marginBottom:"6px",fontWeight:600}}>{t.welcome}</h3>
          <p style={{color:T.textMid,textAlign:"center",fontSize:"13px",marginBottom:"24px"}}>{t.chooseRole}</p>
          <button onClick={()=>selectRole("organizer")} style={{width:"100%",background:T.primary,color:"#fff",border:"none",borderRadius:"12px",padding:"20px",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:"12px",textAlign:"left",display:"flex",alignItems:"center",gap:"16px",boxShadow:T.shadow}}>
            <span style={{fontSize:"32px"}}>🏟</span><div><div style={{fontSize:"16px",marginBottom:"3px"}}>{t.imOrganizer}</div><div style={{fontSize:"12px",fontWeight:400,opacity:0.9}}>{t.organizerDesc}</div></div>
          </button>
          <button onClick={()=>selectRole("athlete")} style={{width:"100%",background:T.accent,color:"#fff",border:"none",borderRadius:"12px",padding:"20px",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",alignItems:"center",gap:"16px",boxShadow:T.shadow}}>
            <span style={{fontSize:"32px"}}>🏃</span><div><div style={{fontSize:"16px",marginBottom:"3px"}}>{t.imAthlete}</div><div style={{fontSize:"12px",fontWeight:400,opacity:0.9}}>{t.athleteDesc}</div></div>
          </button>
        </div>
      )}
      {step==="auth"&&(
        <div>
          <div style={{textAlign:"center",marginBottom:"20px"}}>
            <span style={{background:`${roleColor}15`,color:roleColor,border:`1px solid ${roleColor}44`,borderRadius:"99px",padding:"6px 16px",fontSize:"13px",fontWeight:700}}>{roleIcon} {roleLabel}</span>
          </div>
          <div style={{display:"flex",background:T.bg,borderRadius:"10px",padding:"4px",marginBottom:"24px",border:`1px solid ${T.border}`}}>
            <button onClick={()=>{setMode("signup");setError("");}} style={{flex:1,background:mode==="signup"?roleColor:"none",color:mode==="signup"?"#fff":T.textMid,border:"none",borderRadius:"8px",padding:"10px",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✨ {t.signup}</button>
            <button onClick={()=>{setMode("login");setError("");}} style={{flex:1,background:mode==="login"?roleColor:"none",color:mode==="login"?"#fff":T.textMid,border:"none",borderRadius:"8px",padding:"10px",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🔑 {t.login}</button>
          </div>
          {mode==="signup"&&role==="organizer"&&(<div style={{background:`${T.warning}15`,border:`1px solid ${T.warning}44`,borderRadius:"8px",padding:"10px 14px",color:T.warning,fontSize:"12px",marginBottom:"16px",lineHeight:"1.5"}}>{t.orgNeedsApproval}</div>)}
          {mode==="signup"&&<div style={{marginBottom:"14px"}}><label style={css.label}>{t.fullName}</label><input value={name} onChange={e=>setName(e.target.value)} style={css.input}/></div>}
          <div style={{marginBottom:"14px"}}><label style={css.label}>{t.email}</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={css.input}/></div>
          <div style={{marginBottom:"20px"}}><label style={css.label}>{t.password}</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={css.input}/></div>
          {error&&<div style={{background:error.startsWith("✅")?`${T.accent}15`:`${T.danger}15`,border:`1px solid ${error.startsWith("✅")?T.accent+"44":T.danger+"44"}`,borderRadius:"8px",padding:"10px 14px",color:error.startsWith("✅")?T.accent:T.danger,fontSize:"13px",marginBottom:"16px",lineHeight:"1.5"}}>{error}</div>}
          <button onClick={handleSubmit} disabled={loading} style={{width:"100%",background:roleColor,color:"#fff",border:"none",borderRadius:"10px",padding:"14px",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:"12px",opacity:loading?0.6:1,boxShadow:T.shadow}}>{loading?"...":(mode==="signup"?`${t.signupBtn} ${roleLabel}`:t.loginBtn)}</button>
          <button onClick={backToRole} style={{width:"100%",background:"none",border:`1px solid ${T.border}`,color:T.textMid,borderRadius:"10px",padding:"10px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>{t.changeRole}</button>
        </div>
      )}
    </div>
  </div>;
}

// ─── ΥΠΟΛΟΓΙΣΜΟΣ ΤΙΜΗΣ ─────────────────────────────────────────────────────────
function calculatePrice(race,distance){
  const basePrice=(race.pricing||[]).find(p=>p.distance===distance)?.price||0;
  if(!race.early_bird||!race.early_bird.deadline)return{base:basePrice,final:basePrice,isEarlyBird:false};
  const now=new Date();const deadline=new Date(race.early_bird.deadline);
  if(now<=deadline){const discount=race.early_bird.discount_percent||0;return{base:basePrice,final:basePrice*(1-discount/100),isEarlyBird:true,discount,deadline:race.early_bird.deadline};}
  return{base:basePrice,final:basePrice,isEarlyBird:false};
}

// ─── ΑΘΛΗΤΗΣ - ΚΑΡΤΑ ΑΓΩΝΑ ────────────────────────────────────────────────────
function AthleteRaceCard({race,registrations,runners,session,onRegister}){
  const {t}=useLang();
  const myReg=registrations.find(r=>r.race_id===race.id&&runners.find(rn=>rn.id===r.runner_id)?.email===session.user.email);
  const totalRegs=registrations.filter(r=>r.race_id===race.id).length;
  const distances=race.distance?race.distance.split(" | "):[];
  const statusColors={upcoming:T.warning,active:T.accent,finished:T.textLight};
  const statusLabels={upcoming:t.statusUpcoming,active:t.statusActive,finished:t.statusFinished};
  const hasEarlyBird=race.early_bird&&race.early_bird.deadline&&new Date()<=new Date(race.early_bird.deadline);
  return <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"20px 24px",boxShadow:T.shadow}}>
    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px",flexWrap:"wrap"}}>
      <span style={{color:T.text,fontWeight:700,fontSize:"16px"}}>{race.name}</span>
      <span style={{background:`${statusColors[race.status]}15`,color:statusColors[race.status],border:`1px solid ${statusColors[race.status]}44`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px",fontWeight:600}}>{statusLabels[race.status]}</span>
      {hasEarlyBird&&<span style={{background:`${T.warning}20`,color:T.warning,border:`1px solid ${T.warning}55`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px",fontWeight:700}}>🏷️ EARLY BIRD -{race.early_bird.discount_percent}%</span>}
      {myReg&&<span style={{background:`${T.accent}15`,color:T.accent,border:`1px solid ${T.accent}44`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px",fontWeight:700}}>✓ {t.regEarlyBird}</span>}
    </div>
    <div style={{color:T.textMid,fontSize:"13px",lineHeight:"1.8",marginBottom:"10px"}}>
      📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 👤 {totalRegs} {t.registered}
      {race.description&&<><br/>💬 {race.description}</>}
    </div>
    {distances.length>0&&(
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"10px"}}>
        {distances.map((d,i)=>{const pr=calculatePrice(race,d);return <span key={i} style={{background:`${T.primary}12`,border:`1px solid ${T.primary}33`,borderRadius:"6px",padding:"3px 10px",fontSize:"12px",color:T.primary,fontWeight:500}}>🏃 {d}{pr.base>0&&(pr.isEarlyBird?<> · <s style={{opacity:0.5}}>{pr.base}€</s> <strong style={{color:T.warning}}>{pr.final.toFixed(2)}€</strong></>:` · ${pr.base}€`)}</span>;})}
      </div>
    )}
    {(race.perks||[]).length>0&&(<div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>{race.perks.map((p,i)=>(<span key={i} style={{background:`${T.accent}12`,border:`1px solid ${T.accent}33`,borderRadius:"6px",padding:"3px 10px",fontSize:"12px",color:T.accent}}>{p}</span>))}</div>)}
    {myReg?(
      <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:`${T.accent}10`,borderRadius:"8px",border:`1px solid ${T.accent}33`}}>
        <span style={{background:T.accent,color:"#fff",borderRadius:"6px",padding:"2px 8px",fontWeight:700,fontSize:"13px"}}>#{myReg.bib_number}</span>
        <span style={{color:T.accentDark,fontSize:"13px"}}>{t.alreadyReg} {myReg.distance||"—"}</span>
      </div>
    ):race.status==="upcoming"&&(<Btn onClick={()=>onRegister(race)}>{t.regBtn}</Btn>)}
  </div>;
}

// ─── ΑΘΛΗΤΗΣ - FORM ΕΓΓΡΑΦΗΣ ──────────────────────────────────────────────────
function AthleteRegistrationForm({race,profile,session,onClose,onSuccess}){
  const {t}=useLang();
  const distances=race.distance?race.distance.split(" | "):[];
  const customFields=race.custom_fields||[];
  const profileName=(profile?.full_name||"").trim().split(" ");
  const [form,setForm]=useState({
    first_name:profileName[0]||"",
    last_name:profileName.slice(1).join(" ")||"",
    distance:distances[0]||"",category:"Γενική",tshirt:"M",phone:"",
    dob:"",gender:t.male,club:"",amka:"",city:"",
    emergency_name:"",emergency_phone:"",medical_cert:false
  });
  const [customAnswers,setCustomAnswers]=useState({});
  const [loading,setLoading]=useState(false);
  const priceInfo=calculatePrice(race,form.distance);
  function updateCustom(id,value){setCustomAnswers({...customAnswers,[id]:value});}
  function set(k,v){setForm({...form,[k]:v});}

  async function submit(){
    if(!form.first_name.trim()||!form.last_name.trim()){alert("Συμπληρώστε Όνομα και Επώνυμο!");return;}
    if(!form.distance){alert(t.selectDistance);return;}
    for(const f of customFields){if(f.required&&!customAnswers[f.id]&&customAnswers[f.id]!==false){alert(`${t.pleaseComplete} ${f.label}`);return;}}
    setLoading(true);
    let {data:runner}=await supabase.from("runners").select("*").eq("email",session.user.email).single();
    const runnerData={
      first_name:form.first_name.trim(),last_name:form.last_name.trim(),
      email:session.user.email,phone:form.phone,dob:form.dob||null,
      gender:form.gender,club:form.club,amka:form.amka,city:form.city,
      emergency_name:form.emergency_name,emergency_phone:form.emergency_phone
    };
    if(!runner){
      const {data,error}=await supabase.from("runners").insert([runnerData]).select();
      if(error){alert("Σφάλμα: "+error.message);setLoading(false);return;}
      if(data)runner=data[0];
    } else {
      await supabase.from("runners").update(runnerData).eq("id",runner.id);
    }
    if(!runner){setLoading(false);return;}
    const {data:existing}=await supabase.from("registrations").select("*").eq("runner_id",runner.id).eq("race_id",race.id);
    if(existing&&existing.length>0){alert(t.alreadyRegAlert);setLoading(false);return;}
    const {data:allRegs}=await supabase.from("registrations").select("bib_number").eq("race_id",race.id);
    const maxBib=(allRegs||[]).reduce((mx,r)=>Math.max(mx,parseInt(r.bib_number)||0),0);
    const bibNum=(maxBib+1).toString();
    const {error:regError}=await supabase.from("registrations").insert([{runner_id:runner.id,race_id:race.id,distance:form.distance,category:form.category,tshirt:form.tshirt,medical_cert:form.medical_cert,bib_number:bibNum,custom_answers:customAnswers,price_paid:priceInfo.final}]);
    if(regError){alert("Σφάλμα εγγραφής: "+regError.message);setLoading(false);return;}
    // Αποστολή email επιβεβαίωσης (μέσω Edge Function)
    try{
      let organizerEmail=null;
      if(race.user_id){
        const {data:org}=await supabase.from("profiles").select("email").eq("id",race.user_id).single();
        organizerEmail=org?.email||null;
      }
      await supabase.functions.invoke("send-registration-email",{
        body:{
          athleteEmail:session.user.email,
          athleteName:`${form.first_name} ${form.last_name}`,
          raceName:race.name,
          raceDate:race.date,
          distance:form.distance,
          bibNumber:bibNum,
          organizerEmail:organizerEmail
        }
      });
    }catch(e){console.log("Email error (μη κρίσιμο):",e);}
    setLoading(false);
    alert("✅ Η εγγραφή ολοκληρώθηκε! BIB #"+bibNum+"\n📧 Σου στείλαμε email επιβεβαίωσης.");
    onSuccess();
  }

  return <Modal title={`${t.regForRace} ${race.name}`} onClose={onClose} wide>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
      <In label="Όνομα *" value={form.first_name} onChange={e=>set("first_name",e.target.value)} placeholder="π.χ. Γιώργος"/>
      <In label="Επώνυμο *" value={form.last_name} onChange={e=>set("last_name",e.target.value)} placeholder="π.χ. Παπαδόπουλος"/>
    </div>
    <In label="Email" value={session.user.email} disabled style={{opacity:0.6,cursor:"not-allowed"}}/>
    <Sel label={t.distance+" *"} value={form.distance} onChange={e=>set("distance",e.target.value)}>{distances.map(d=><option key={d} value={d}>{d}</option>)}</Sel>
    {priceInfo.base>0&&(
      <div style={{background:priceInfo.isEarlyBird?`${T.warning}10`:T.bg,border:`1px solid ${priceInfo.isEarlyBird?T.warning+"44":T.border}`,borderRadius:"10px",padding:"14px 18px",marginBottom:"14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:"11px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>{t.cost}</div>{priceInfo.isEarlyBird&&<div style={{fontSize:"11px",color:T.warning,marginTop:"2px",fontWeight:600}}>{t.earlyBirdDiscount} -{priceInfo.discount}%</div>}</div>
          <div style={{textAlign:"right"}}>{priceInfo.isEarlyBird&&<div style={{fontSize:"13px",color:T.textLight,textDecoration:"line-through"}}>{priceInfo.base.toFixed(2)}€</div>}<div style={{fontSize:"22px",fontWeight:900,color:priceInfo.isEarlyBird?T.warning:T.text}}>{priceInfo.final.toFixed(2)}€</div></div>
        </div>
      </div>
    )}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
      <Sel label={t.category} value={form.category} onChange={e=>set("category",e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</Sel>
      <Sel label={t.tshirt} value={form.tshirt} onChange={e=>set("tshirt",e.target.value)}>{TSHIRTS.map(ts=><option key={ts}>{ts}</option>)}</Sel>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
      <In label={t.phone+" *"} value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="69..."/>
      <In label="ΑΜΚΑ" value={form.amka} onChange={e=>set("amka",e.target.value)} placeholder="Προαιρετικό"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
      <In label={t.dob} type="date" value={form.dob} onChange={e=>set("dob",e.target.value)}/>
      <Sel label={t.gender} value={form.gender} onChange={e=>set("gender",e.target.value)}><option>{t.male}</option><option>{t.female}</option><option>{t.other}</option></Sel>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
      <In label={t.club} value={form.club} onChange={e=>set("club",e.target.value)} placeholder={t.optional}/>
      <In label="Πόλη" value={form.city} onChange={e=>set("city",e.target.value)} placeholder={t.optional}/>
    </div>
    <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"16px",marginBottom:"14px"}}>
      <div style={{color:T.text,fontSize:"13px",fontWeight:700,marginBottom:"12px"}}>🆘 Επαφή Έκτακτης Ανάγκης</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label="Ονοματεπώνυμο" value={form.emergency_name} onChange={e=>set("emergency_name",e.target.value)} placeholder={t.optional}/>
        <In label="Τηλέφωνο" value={form.emergency_phone} onChange={e=>set("emergency_phone",e.target.value)} placeholder={t.optional}/>
      </div>
    </div>
    {customFields.length>0&&(
      <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"16px",marginBottom:"14px"}}>
        <div style={{color:T.text,fontSize:"13px",fontWeight:700,marginBottom:"12px"}}>{t.extraInfo}</div>
        {customFields.map(f=>(
          <div key={f.id} style={{marginBottom:"12px"}}>
            <label style={css.label}>{f.label}{f.required&&" *"}</label>
            {f.type==="text"&&<input value={customAnswers[f.id]||""} onChange={e=>updateCustom(f.id,e.target.value)} style={css.input}/>}
            {f.type==="number"&&<input type="number" value={customAnswers[f.id]||""} onChange={e=>updateCustom(f.id,e.target.value)} style={css.input}/>}
            {f.type==="checkbox"&&<label style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",color:T.text}}><input type="checkbox" checked={!!customAnswers[f.id]} onChange={e=>updateCustom(f.id,e.target.checked)}/>{t.yes}</label>}
            {f.type==="select"&&<select value={customAnswers[f.id]||""} onChange={e=>updateCustom(f.id,e.target.value)} style={css.input}><option value="">{t.select}</option>{(f.options||[]).map(o=><option key={o} value={o}>{o}</option>)}</select>}
          </div>
        ))}
      </div>
    )}
    <label style={{display:"flex",alignItems:"center",gap:"8px",color:T.textMid,fontSize:"13px",cursor:"pointer",marginBottom:"16px"}}><input type="checkbox" checked={form.medical_cert} onChange={e=>set("medical_cert",e.target.checked)}/>{t.medicalCert}</label>
    <div style={{display:"flex",gap:"10px"}}>
      <Btn onClick={submit} style={{flex:1}} disabled={loading}>{loading?"...":`${t.confirmReg}${priceInfo.final>0?` (${priceInfo.final.toFixed(2)}€)`:""}`}</Btn>
      <Btn v="sec" onClick={onClose} style={{flex:1}}>{t.cancel}</Btn>
    </div>
  </Modal>;
}

function AthleteDashboard({races,registrations,runners,profile,session,onRefresh}){
  const {t}=useLang();
  const [registerRace,setRegisterRace]=useState(null);
  const [tab,setTab]=useState("available");
  const myRunner=runners.find(r=>r.email===session.user.email);
  const myRegs=myRunner?registrations.filter(r=>r.runner_id===myRunner.id):[];
  const myRaceIds=myRegs.map(r=>r.race_id);
  const availableRaces=races.filter(r=>r.status==="upcoming");
  const myRaces=races.filter(r=>myRaceIds.includes(r.id));
  return <div>
    <div style={{display:"flex",gap:"6px",marginBottom:"24px",flexWrap:"wrap"}}>
      <button onClick={()=>setTab("available")} style={{background:tab==="available"?T.primary:T.bgAlt,color:tab==="available"?"#fff":T.textMid,border:`1px solid ${tab==="available"?T.primary:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="available"?700:500,fontFamily:"inherit"}}>{t.availableRaces} ({availableRaces.length})</button>
      <button onClick={()=>setTab("my")} style={{background:tab==="my"?T.primary:T.bgAlt,color:tab==="my"?"#fff":T.textMid,border:`1px solid ${tab==="my"?T.primary:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="my"?700:500,fontFamily:"inherit"}}>{t.myRegs} ({myRaces.length})</button>
    </div>
    {tab==="available"&&(<div>
      <h2 style={{margin:"0 0 16px",color:T.text,fontSize:"18px"}}>{t.availableRacesTitle}</h2>
      {availableRaces.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>{t.noAvailable}</div>}
      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>{availableRaces.map(race=>(<AthleteRaceCard key={race.id} race={race} registrations={registrations} runners={runners} session={session} onRegister={setRegisterRace}/>))}</div>
    </div>)}
    {tab==="my"&&(<div>
      <h2 style={{margin:"0 0 16px",color:T.text,fontSize:"18px"}}>{t.myRegsTitle}</h2>
      {myRaces.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>{t.noRegs}</div>}
      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
        {myRaces.map(race=>{
          const reg=myRegs.find(r=>r.race_id===race.id);
          return <div key={race.id} style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"20px 24px",boxShadow:T.shadow}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px",flexWrap:"wrap"}}>
              <span style={{background:T.accent,color:"#fff",borderRadius:"8px",padding:"4px 12px",fontWeight:700,fontSize:"15px"}}>#{reg.bib_number}</span>
              <span style={{color:T.text,fontWeight:700,fontSize:"16px"}}>{race.name}</span>
              {reg.price_paid>0&&<span style={{color:T.accent,fontSize:"13px",fontWeight:600}}>💰 {parseFloat(reg.price_paid).toFixed(2)}€</span>}
            </div>
            <div style={{color:T.textMid,fontSize:"13px",lineHeight:"1.8"}}>📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 🏃 {reg.distance||"—"}<br/>{t.category}: {reg.category} · {t.tshirt}: {reg.tshirt}{reg.medical_cert?" · ✅":""}</div>
          </div>;
        })}
      </div>
    </div>)}
    {registerRace&&<AthleteRegistrationForm race={registerRace} profile={profile} session={session} onClose={()=>setRegisterRace(null)} onSuccess={()=>{setRegisterRace(null);onRefresh();}}/>}
  </div>;
}

// ─── ΔΙΟΡΓΑΝΩΤΗΣ - ΑΓΩΝΕΣ ──────────────────────────────────────────────────────
function OrganizerRaces({races,setRaces,runners,registrations,session,profile}){
  const {t}=useLang();
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState(null);
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({name:"",date:"",location:"",distances:[],max_runners:"",description:"",pricing:[],perks:[],early_bird:null,custom_fields:[]});
  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);
  function resetForm(){setEditId(null);setForm({name:"",date:"",location:"",distances:[],max_runners:"",description:"",pricing:[],perks:[],early_bird:null,custom_fields:[]});}
  function openEdit(race){setEditId(race.id);setForm({name:race.name||"",date:race.date||"",location:race.location||"",distances:race.distance?race.distance.split(" | "):[],max_runners:race.max_runners?String(race.max_runners):"",description:race.description||"",pricing:race.pricing||[],perks:race.perks||[],early_bird:race.early_bird||null,custom_fields:race.custom_fields||[]});setShowForm(true);}

  async function save(){
    if(!form.name||!form.date){alert(t.fillNameDate);return;}
    if(form.distances.length===0){alert(t.addDistance);return;}
    setLoading(true);
    const validPricing=form.pricing.filter(p=>form.distances.includes(p.distance));
    const payload={name:form.name,date:form.date,location:form.location,distance:form.distances.join(" | "),description:form.description,max_runners:form.max_runners?parseInt(form.max_runners):null,pricing:validPricing,perks:form.perks,early_bird:form.early_bird,custom_fields:form.custom_fields};
    if(editId){
      const {data,error}=await supabase.from("races").update(payload).eq("id",editId).select();
      if(error){alert("Σφάλμα: "+error.message);setLoading(false);return;}
      if(data)setRaces(races.map(r=>r.id===editId?data[0]:r));
    } else {
      const {data,error}=await supabase.from("races").insert([{...payload,status:"upcoming",user_id:session.user.id}]).select();
      if(error){alert("Σφάλμα: "+error.message);setLoading(false);return;}
      if(data)setRaces([data[0],...races]);
    }
    setLoading(false);setShowForm(false);resetForm();
  }
  async function del(id){if(!confirm(t.deleteConfirm))return;await supabase.from("races").delete().eq("id",id);setRaces(races.filter(r=>r.id!==id));}
  async function toggleStatus(race){const s=["upcoming","active","finished"];const ns=s[(s.indexOf(race.status)+1)%s.length];await supabase.from("races").update({status:ns}).eq("id",race.id);setRaces(races.map(r=>r.id===race.id?{...r,status:ns}:r));}
  function getRegData(race){
    const regs=registrations.filter(r=>r.race_id===race.id);
    return regs.map((reg,i)=>{
      const r=runners.find(x=>x.id===reg.runner_id)||{};
      const cv={};(race.custom_fields||[]).forEach(f=>{const v=(reg.custom_answers||{})[f.id];cv[f.label]=v===true?"ΝΑΙ":v===false?"ΟΧΙ":(v||"");});
      return {
        "Α/Α":i+1,"BIB":reg.bib_number,"Όνομα":r.first_name||"","Επώνυμο":r.last_name||"",
        "Email":r.email||"","Τηλέφωνο":r.phone||"","ΑΜΚΑ":r.amka||"","Πόλη":r.city||"",
        "Ημ.Γέννησης":r.dob||"","Φύλο":r.gender||"","Διαδρομή":reg.distance||"",
        "Κατηγορία":reg.category||"","T-Shirt":reg.tshirt||"","Σύλλογος":r.club||"",
        "Επαφή Ανάγκης":r.emergency_name||"","Τηλ Ανάγκης":r.emergency_phone||"",
        "Ιατρική":reg.medical_cert?"ΝΑΙ":"ΟΧΙ","Τιμή (€)":reg.price_paid||0,...cv
      };
    });
  }

  async function exportExcel(race){
    const data=getRegData(race);
    if(!data.length){alert(t.noRegsCsv);return;}
    if(!window.XLSX){
      await new Promise((res,rej)=>{const sc=document.createElement("script");sc.src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";sc.onload=res;sc.onerror=rej;document.head.appendChild(sc);});
    }
    const XLSX=window.XLSX;
    const ws=XLSX.utils.json_to_sheet(data);
    const cols=Object.keys(data[0]).map(k=>({wch:Math.max(k.length,12)}));
    ws["!cols"]=cols;
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Εγγραφές");
    XLSX.writeFile(wb,`${race.name.replace(/\s+/g,"-")}.xlsx`);
  }

  async function exportPDF(race){
    const regs=registrations.filter(r=>r.race_id===race.id);
    if(!regs.length){alert(t.noRegsCsv);return;}
    function loadScript(src){return new Promise((res,rej)=>{const sc=document.createElement("script");sc.src=src;sc.onload=res;sc.onerror=()=>rej(new Error("blocked"));document.head.appendChild(sc);});}
    try{
      if(!window.jspdf){
        try{await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");}
        catch(e){await loadScript("https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js");}
      }
    }catch(e){alert("⚠️ Δεν φόρτωσε η βιβλιοθήκη PDF. Κλείσε το AdBlock ή χρησιμοποίησε Excel.");return;}
    try{
      const {jsPDF}=window.jspdf;
      const doc=new jsPDF({orientation:"landscape"});
      // Ελληνική γραμματοσειρά
      let gf=false;
      try{
        if(!window.__greekFont){
          const urls=["https://cdn.jsdelivr.net/fontsource/fonts/noto-sans@latest/greek-400-normal.ttf"];
          for(const u of urls){try{const resp=await fetch(u);if(resp.ok){const buf=await resp.arrayBuffer();let bin="";const b=new Uint8Array(buf);for(let i=0;i<b.length;i++)bin+=String.fromCharCode(b[i]);window.__greekFont=btoa(bin);break;}}catch(e){}}
        }
        if(window.__greekFont){doc.addFileToVFS("Greek.ttf",window.__greekFont);doc.addFont("Greek.ttf","GreekFont","normal");doc.setFont("GreekFont");gf=true;}
      }catch(e){gf=false;}
      const grMap={"Α":"A","Β":"V","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"I","Θ":"TH","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"X","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"CH","Ψ":"PS","Ω":"O","ά":"a","έ":"e","ή":"i","ί":"i","ό":"o","ύ":"y","ώ":"o","α":"a","β":"v","γ":"g","δ":"d","ε":"e","ζ":"z","η":"i","θ":"th","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"x","ο":"o","π":"p","ρ":"r","σ":"s","ς":"s","τ":"t","υ":"y","φ":"f","χ":"ch","ψ":"ps","ω":"o","ΐ":"i","ϊ":"i","ϋ":"y"};
      const fix=(txt)=>{if(gf)return String(txt==null?"":txt);return String(txt==null?"":txt).split("").map(c=>grMap[c]!==undefined?grMap[c]:c).join("");};

      // Στήλες (landscape = 297mm πλάτος, χρησιμοποιούμε 14..283)
      const columns=[
        {h:"A/A",w:12},
        {h:"BIB",w:14},
        {h:fix("Όνομα"),w:32},
        {h:fix("Επώνυμο"),w:38},
        {h:fix("Τηλέφωνο"),w:28},
        {h:fix("Διαδρομή"),w:30},
        {h:fix("Κατηγορία"),w:32},
        {h:"T-Shirt",w:16},
        {h:fix("Σύλλογος"),w:34},
        {h:fix("Πόλη"),w:26},
        {h:fix("Email"),w:0}
      ];
      // υπολογισμός x θέσεων
      let xpos=14;columns.forEach(c=>{c.x=xpos;if(c.w===0)c.w=283-xpos;xpos+=c.w;});

      // Τίτλος
      doc.setFontSize(15);doc.setTextColor(40);
      doc.text(fix(race.name),14,16);
      doc.setFontSize(9);doc.setTextColor(110);
      doc.text(fix(`Ημ/νία: ${race.date}   Τοποθεσία: ${race.location||"-"}   Σύνολο εγγραφών: ${regs.length}`),14,23);

      let y=30;
      // Header
      doc.setFillColor(74,93,199);doc.rect(14,y,269,8,"F");
      doc.setTextColor(255);doc.setFontSize(8);
      columns.forEach(c=>doc.text(String(c.h),c.x+1.5,y+5.5));
      y+=8;
      // Γραμμές
      doc.setFontSize(8);
      regs.forEach((reg,i)=>{
        const r=runners.find(x=>x.id===reg.runner_id)||{};
        if(i%2===0){doc.setFillColor(245,243,239);doc.rect(14,y,269,7,"F");}
        doc.setTextColor(40);
        const vals=[
          String(i+1),
          String(reg.bib_number||""),
          fix(r.first_name||""),
          fix(r.last_name||""),
          String(r.phone||""),
          fix(reg.distance||""),
          fix(reg.category||""),
          String(reg.tshirt||""),
          fix(r.club||""),
          fix(r.city||""),
          String(r.email||"")
        ];
        columns.forEach((c,ci)=>{
          let txt=vals[ci];
          const maxChars=Math.floor(c.w/1.7);
          if(txt.length>maxChars)txt=txt.slice(0,maxChars-1)+"..";
          doc.text(txt,c.x+1.5,y+5);
        });
        y+=7;
        if(y>195){doc.addPage();y=20;}
      });
      doc.save(`${race.name.replace(/\s+/g,"-")}.pdf`);
    }catch(e){
      alert("⚠️ Σφάλμα PDF: "+e.message+"\n\nΔοκίμασε το κουμπί Excel.");
    }
  }

  const statusColors={upcoming:T.warning,active:T.accent,finished:T.textLight};
  const statusLabels={upcoming:t.statusUpcoming,active:t.statusActive,finished:t.statusFinished};

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
      <h2 style={{margin:0,color:T.text,fontSize:"20px"}}>{t.myRacesTitle} {isAdmin&&<span style={{color:T.textMid,fontSize:"13px"}}>{t.adminAll}</span>}</h2>
      <Btn onClick={()=>setShowForm(true)}>{t.newRace}</Btn>
    </div>
    {myRaces.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>{t.noRacesYet}</div>}
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
          <div style={{color:T.textMid,fontSize:"13px",lineHeight:"1.8",marginBottom:"10px"}}>📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 👤 {regCount} {t.registered}{totalRevenue>0&&<> &nbsp; 💰 {totalRevenue.toFixed(2)}€ {t.totalRev}</>}</div>
          {distances.length>0&&(<div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"8px"}}>{distances.map((d,i)=>{const pr=(race.pricing||[]).find(p=>p.distance===d);return <span key={i} style={{background:`${T.primary}12`,border:`1px solid ${T.primary}33`,borderRadius:"6px",padding:"3px 10px",fontSize:"12px",color:T.primary,fontWeight:500}}>🏃 {d}{pr?.price>0?` · ${pr.price}€`:""}</span>;})}</div>)}
          {(race.perks||[]).length>0&&(<div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>{race.perks.map((p,i)=>(<span key={i} style={{background:`${T.accent}12`,border:`1px solid ${T.accent}33`,borderRadius:"6px",padding:"3px 10px",fontSize:"12px",color:T.accent}}>{p}</span>))}</div>)}
          {race.early_bird&&race.early_bird.deadline&&(<div style={{marginBottom:"12px"}}><span style={{background:`${T.warning}15`,color:T.warning,border:`1px solid ${T.warning}44`,borderRadius:"6px",padding:"3px 10px",fontSize:"12px",fontWeight:600}}>🏷️ Early Bird -{race.early_bird.discount_percent}% (έως {race.early_bird.deadline})</span></div>)}
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <Btn sm v="ghost" onClick={()=>toggleStatus(race)}>{t.statusBtn}</Btn>
            <Btn sm v="sec" onClick={()=>openEdit(race)}>{t.editBtn}</Btn>
            <Btn sm v="grn" onClick={()=>exportExcel(race)}>{t.excelBtn}</Btn>
            <Btn sm v="ghost" onClick={()=>exportPDF(race)}>{t.pdfBtn}</Btn>
            <Btn sm v="red" onClick={()=>del(race.id)}>{t.deleteBtn}</Btn>
          </div>
        </div>;
      })}
    </div>
    {showForm&&<Modal title={editId?t.editRaceTitle:t.newRaceTitle} onClose={()=>{setShowForm(false);resetForm();}} wide>
      <In label={t.raceName} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label={t.date} type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
        <In label={t.location} value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
      </div>
      <DistancesPicker distances={form.distances} onChange={d=>setForm({...form,distances:d})}/>
      <PricingPicker distances={form.distances} pricing={form.pricing} onChange={p=>setForm({...form,pricing:p})}/>
      <PerksPicker perks={form.perks} onChange={p=>setForm({...form,perks:p})}/>
      <EarlyBirdPicker earlyBird={form.early_bird} onChange={eb=>setForm({...form,early_bird:eb})}/>
      <CustomFieldsPicker fields={form.custom_fields} onChange={cf=>setForm({...form,custom_fields:cf})}/>
      <In label={t.maxRunners} type="number" value={form.max_runners} onChange={e=>setForm({...form,max_runners:e.target.value})} placeholder={t.maxRunnersPlaceholder}/>
      <F label={t.description}><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} style={{...css.input,resize:"vertical"}}/></F>
      <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
        <Btn onClick={save} style={{flex:1}} disabled={loading}>{loading?"...":(editId?t.saveChanges:t.createRace)}</Btn>
        <Btn v="sec" onClick={()=>{setShowForm(false);resetForm();}} style={{flex:1}}>{t.cancel}</Btn>
      </div>
    </Modal>}
  </div>;
}

function OrganizerRegistrations({races,runners,registrations,session,profile}){
  const {t}=useLang();
  const [filterRace,setFilterRace]=useState("all");
  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);
  const myRaceIds=myRaces.map(r=>r.id);
  const filtered=registrations.filter(r=>myRaceIds.includes(r.race_id)).filter(r=>filterRace==="all"||r.race_id===filterRace);
  const totalRevenue=filtered.reduce((sum,r)=>sum+(parseFloat(r.price_paid)||0),0);
  return <div>
    <h2 style={{margin:"0 0 20px",color:T.text,fontSize:"20px"}}>{t.regsTitle} ({filtered.length}){totalRevenue>0&&<span style={{color:T.accent,fontSize:"15px",marginLeft:"12px"}}>💰 {t.total} {totalRevenue.toFixed(2)}€</span>}</h2>
    <Sel value={filterRace} onChange={e=>setFilterRace(e.target.value)}><option value="all">{t.allRaces}</option>{myRaces.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</Sel>
    {filtered.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>{t.noRegsList}</div>}
    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {filtered.map(reg=>{
        const runner=runners.find(r=>r.id===reg.runner_id);const race=races.find(r=>r.id===reg.race_id);
        if(!runner||!race)return null;
        return <div key={reg.id} style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"14px 18px",display:"flex",alignItems:"center",gap:"12px",boxShadow:T.shadow}}>
          <div style={{background:T.primary,color:"#fff",borderRadius:"8px",padding:"4px 10px",fontWeight:700,fontSize:"16px"}}>#{reg.bib_number}</div>
          <div style={{flex:1}}>
            <div style={{color:T.text,fontWeight:700,fontSize:"14px",display:"flex",alignItems:"center",gap:"8px"}}>{runner.first_name} {runner.last_name}{reg.price_paid>0&&<span style={{color:T.accent,fontSize:"12px",fontWeight:600}}>💰 {parseFloat(reg.price_paid).toFixed(2)}€</span>}</div>
            <div style={{color:T.textMid,fontSize:"12px"}}>{race.name}{reg.distance?` · 🏃 ${reg.distance}`:""} · {reg.category} · {reg.tshirt}{reg.medical_cert?" · ✅":""}</div>
            <div style={{color:T.textLight,fontSize:"12px"}}>{runner.email}{runner.phone?` · ${runner.phone}`:""}</div>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

// ─── ADMIN PANEL ────────────────────────────────────────────────────────────────
function AdminPanel(){
  const {t}=useLang();
  const [pendingOrgs,setPendingOrgs]=useState([]);
  const [allOrgs,setAllOrgs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("pending");
  async function fetchOrgs(){setLoading(true);const {data}=await supabase.from("profiles").select("*").eq("role","organizer").order("id",{ascending:false});if(data){setPendingOrgs(data.filter(o=>o.status==="pending"));setAllOrgs(data);}setLoading(false);}
  useEffect(()=>{fetchOrgs();},[]);
  async function approve(id){await supabase.from("profiles").update({status:"approved"}).eq("id",id);fetchOrgs();}
  async function reject(id){if(!confirm(t.rejectConfirm))return;await supabase.from("profiles").update({status:"rejected"}).eq("id",id);fetchOrgs();}
  async function makeAdmin(id){if(!confirm(t.makeAdminConfirm))return;await supabase.from("profiles").update({role:"admin",status:"approved"}).eq("id",id);fetchOrgs();}
  const list=tab==="pending"?pendingOrgs:allOrgs;
  const statusColors={pending:T.warning,approved:T.accent,rejected:T.danger};
  const statusLabels={pending:t.statusPending,approved:t.statusApproved,rejected:t.statusRejected};
  if(loading)return <div style={{textAlign:"center",color:T.textMid,padding:"40px"}}>{t.loading}</div>;
  return <div>
    <div style={{display:"flex",gap:"6px",marginBottom:"24px",flexWrap:"wrap"}}>
      <button onClick={()=>setTab("pending")} style={{background:tab==="pending"?T.warning:T.bgAlt,color:tab==="pending"?"#fff":T.textMid,border:`1px solid ${tab==="pending"?T.warning:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="pending"?700:500,fontFamily:"inherit"}}>{t.pendingTab} ({pendingOrgs.length})</button>
      <button onClick={()=>setTab("all")} style={{background:tab==="all"?T.primary:T.bgAlt,color:tab==="all"?"#fff":T.textMid,border:`1px solid ${tab==="all"?T.primary:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="all"?700:500,fontFamily:"inherit"}}>{t.allOrgsTab} ({allOrgs.length})</button>
    </div>
    <h2 style={{margin:"0 0 16px",color:T.text,fontSize:"18px"}}>{tab==="pending"?t.pendingOrgsTitle:t.allOrgsTitle}</h2>
    {list.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>{tab==="pending"?t.noPending:"—"}</div>}
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      {list.map(org=>(
        <div key={org.id} style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"20px 24px",boxShadow:T.shadow}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px",flexWrap:"wrap"}}>
            <span style={{color:T.text,fontWeight:700,fontSize:"16px"}}>🏟 {org.full_name||"—"}</span>
            <span style={{background:`${statusColors[org.status]}15`,color:statusColors[org.status],border:`1px solid ${statusColors[org.status]}44`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px",fontWeight:700}}>{statusLabels[org.status]}</span>
          </div>
          <div style={{color:T.textMid,fontSize:"13px",lineHeight:"1.8",marginBottom:"12px"}}>📧 {org.email}</div>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {org.status==="pending"&&<><Btn sm v="grn" onClick={()=>approve(org.id)}>{t.approve}</Btn><Btn sm v="red" onClick={()=>reject(org.id)}>{t.reject}</Btn></>}
            {org.status==="rejected"&&<Btn sm v="grn" onClick={()=>approve(org.id)}>{t.reApprove}</Btn>}
            {org.status==="approved"&&<Btn sm v="ghost" onClick={()=>makeAdmin(org.id)}>{t.makeAdminBtn}</Btn>}
          </div>
        </div>
      ))}
    </div>
  </div>;
}

// ─── MAIN ───────────────────────────────────────────────────────────────────────
function AppContent(){
  const {t}=useLang();
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
    if(r1.data)setRaces(r1.data);if(r2.data)setRunners(r2.data);if(r3.data)setRegistrations(r3.data);if(r4.data)setProfile(r4.data);
    setLoading(false);
  }
  useEffect(()=>{if(!session){setLoading(false);return;}fetchAll();},[session]);

  if(!session)return <LoginPage/>;
  if(loading)return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.primary,fontFamily:"Inter,sans-serif"}}>{t.loading}</div>;

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
        <div><div style={{color:T.text,fontWeight:700,fontSize:"16px"}}>{t.appName}</div><div style={{color:T.textLight,fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase"}}>{isAthlete?t.athletePanel:t.adminPanel}</div></div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
        <LangToggle/>
        <span style={{color:T.textMid,fontSize:"13px"}}>{profile?.full_name||session.user.email}</span>
        {profile?.role==="admin"&&<span style={{background:`${T.warning}15`,color:T.warning,border:`1px solid ${T.warning}44`,borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>{t.badgeAdmin}</span>}
        {profile?.role==="organizer"&&profile?.status==="approved"&&<span style={{background:`${T.primary}15`,color:T.primary,border:`1px solid ${T.primary}44`,borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>{t.badgeOrganizer}</span>}
        {profile?.role==="organizer"&&profile?.status==="pending"&&<span style={{background:`${T.warning}15`,color:T.warning,border:`1px solid ${T.warning}44`,borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>{t.badgePending}</span>}
        {profile?.role==="athlete"&&<span style={{background:`${T.accent}15`,color:T.accent,border:`1px solid ${T.accent}44`,borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>{t.badgeAthlete}</span>}
        <button onClick={()=>supabase.auth.signOut()} style={{background:`${T.danger}15`,color:T.danger,border:`1px solid ${T.danger}33`,borderRadius:"8px",padding:"6px 12px",cursor:"pointer",fontSize:"12px",fontFamily:"inherit"}}>{t.logout}</button>
      </div>
    </div>

    {isPendingOrganizer&&(<div style={{padding:"40px 28px",maxWidth:"640px",margin:"40px auto"}}>
      <div style={{background:T.bgAlt,border:`1px solid ${T.warning}44`,borderRadius:"16px",padding:"40px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"64px",marginBottom:"20px"}}>⏳</div>
        <h2 style={{color:T.warning,fontSize:"22px",margin:"0 0 12px"}}>{t.pendingTitle}</h2>
        <p style={{color:T.text,fontSize:"15px",lineHeight:"1.7",margin:"0 0 8px"}}>{t.pendingMsg1}</p>
        <p style={{color:T.textMid,fontSize:"13px",lineHeight:"1.7",margin:"0 0 24px"}}>{t.pendingMsg2}</p>
        <button onClick={()=>supabase.auth.signOut()} style={{background:T.bgAlt,color:T.text,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"10px 20px",cursor:"pointer",fontSize:"13px",fontFamily:"inherit"}}>{t.logout}</button>
      </div>
    </div>)}

    {isRejectedOrganizer&&(<div style={{padding:"40px 28px",maxWidth:"640px",margin:"40px auto"}}>
      <div style={{background:T.bgAlt,border:`1px solid ${T.danger}44`,borderRadius:"16px",padding:"40px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"64px",marginBottom:"20px"}}>❌</div>
        <h2 style={{color:T.danger,fontSize:"22px",margin:"0 0 12px"}}>{t.rejectedTitle}</h2>
        <p style={{color:T.textMid,fontSize:"13px",lineHeight:"1.7",margin:"0 0 24px"}}>{t.rejectedMsg}</p>
        <button onClick={()=>supabase.auth.signOut()} style={{background:T.bgAlt,color:T.text,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"10px 20px",cursor:"pointer",fontSize:"13px",fontFamily:"inherit"}}>{t.logout}</button>
      </div>
    </div>)}

    {isAthlete&&(<div style={{padding:"28px",maxWidth:"960px",margin:"0 auto"}}>
      <AthleteDashboard races={races} registrations={registrations} runners={runners} profile={profile} session={session} onRefresh={fetchAll}/>
    </div>)}

    {isOrganizer&&(<>
      <div style={{display:"flex",gap:"4px",padding:"12px 24px",borderBottom:`1px solid ${T.border}`,background:T.bgAlt}}>
        {[{id:"races",label:t.tabRaces},{id:"regs",label:t.tabRegs},...(isAdmin?[{id:"admin",label:t.tabAdmin}]:[])].map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{background:tab===tb.id?T.primary:"none",color:tab===tb.id?"#fff":T.textMid,border:"none",borderRadius:"8px",padding:"8px 16px",cursor:"pointer",fontSize:"13px",fontWeight:tab===tb.id?700:500,fontFamily:"inherit"}}>{tb.label}</button>
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

export default function App(){
  const [lang,setLang]=useState("el");
  return <LangContext.Provider value={{lang,t:STR[lang],setLang}}>
    <AppContent/>
  </LangContext.Provider>;
}
