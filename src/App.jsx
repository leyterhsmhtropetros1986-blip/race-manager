import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kcqnykjbgqjlgcxmcaro.supabase.co";
const SUPABASE_KEY = "sb_publishable_0dnpl6eFXDjB1Ot26f-qsg_B9IasaUw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
    myRegsTitle:"Οι Εγγραφές μου", noRegs:"Δεν έχεις εγγραφές ακόμα", bibCardBtn:"🎟️ BIB Card", bibCardLoading:"Δημιουργία...",
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
    profileTab:"👤 Προφίλ", profileTitle:"Το Προφίλ μου",
    publicRacesTitle:"🏟 Διαθέσιμοι Αγώνες", publicRacesSub:"Δείτε τους αγώνες & εγγραφείτε",
    publicRegisterBtn:"+ Εγγραφή", publicNoRaces:"Δεν υπάρχουν διαθέσιμοι αγώνες αυτή τη στιγμή",
    publicLoginToReg:"Συνδεθείτε για εγγραφή", backToRaces:"← Πίσω στους Αγώνες",
    importResultsBtn:"📥 Import Αποτελεσμάτων", importResultsTitle:"Εισαγωγή Αποτελεσμάτων από CSV",
    importResultsDesc:"Το CSV πρέπει να έχει στήλες: bib_number, finish_time.",
    importResultsBtn2:"⬆️ Επιλογή Αρχείου CSV", importResultsProcessing:"Επεξεργασία...",
    importResultsDone:"✅ Ενημερώθηκαν %N αποτελέσματα!", importResultsErr:"❌ Σφάλμα στο αρχείο.",
    viewResultsBtn:"🏆 Αποτελέσματα", resultsPageTitle:"Αποτελέσματα Αγώνα",
    resultsNoData:"Δεν υπάρχουν αποτελέσματα ακόμα", resultsRank:"Θέση", resultsBib:"BIB",
    resultsName:"Αθλητής", resultsTime:"Χρόνος", resultsClub:"Σύλλογος", resultsCat:"Κατηγορία",
    backToHome:"← Αρχική",
    bannerLabel:"🖼️ Αφίσα/Banner Αγώνα", bannerHint:"Προτεινόμενο: 1600x600px",
    bannerUpload:"📷 Ανέβασμα Αφίσας", bannerRemove:"🗑 Αφαίρεση",
    bannerUploading:"Ανέβασμα...", heroTitle:"Βρες τον αγώνα σου",
    heroSubtitle:"Εγγραφή σε αγώνες σε όλη την Ελλάδα",
    galleryTitle:"📸 Φωτογραφίες",
    searchPlaceholder:"🔍 Αναζήτηση αγώνα (όνομα, τοποθεσία)...",
    pendingApprovals:"εκκρεμείς εγκρίσεις",
    notFound:"Δεν βρέθηκαν αγώνες",
    statsTab:"📊 Στατιστικά", statsTitle:"Στατιστικά Διοργανωτή",
    statsTotalRaces:"Συνολικοί Αγώνες", statsTotalRegs:"Συνολικές Εγγραφές",
    statsTotalRevenue:"Συνολικά Έσοδα", statsAvgPerRace:"Μ.Ο. ανά Αγώνα",
    statsRegsPerRace:"Εγγραφές ανά Αγώνα", statsRevPerRace:"Έσοδα ανά Αγώνα",
    statsLast7Days:"Εγγραφές τελευταίες 7 ημέρες", statsNoData:"Δεν υπάρχουν δεδομένα",
    paymentStatus:"Πληρωμή", paymentPaid:"✅ Πληρωμένο", paymentPending:"⏳ Εκκρεμές",
    paymentRefunded:"↩️ Επιστροφή", paymentMarkPaid:"Σήμανση Πληρωμένο", paymentMarkPending:"Σήμανση Εκκρεμές",
    publicRunnersToggle:"👥 Δημόσια λίστα εγγεγραμμένων", publicRunnersHint:"Οι εγγεγραμμένοι αθλητές θα φαίνονται στη δημόσια σελίδα",
    publicRunnersList:"👥 Εγγεγραμμένοι Αθλητές", showRunnersBtn:"👥 Δες Εγγεγραμμένους",
    welcomeEmailSubject:"Επιβεβαίωση Εγγραφής - %RACE%",
    forgotPassword:"Ξέχασα τον κωδικό μου;", resetPasswordTitle:"Επαναφορά Κωδικού",
    resetPasswordDesc:"Δώσε το email σου και θα σου στείλουμε σύνδεσμο για επαναφορά κωδικού.",
    resetPasswordBtn:"📧 Αποστολή Email Επαναφοράς", resetPasswordSent:"✅ Σου στείλαμε email με τις οδηγίες!",
    resetPasswordCancel:"← Επιστροφή στη Σύνδεση", profileInfo:"📋 Στοιχεία μου", profileStats:"🏆 Στατιστικά",
    profileHistory:"📅 Ιστορικό Αγώνων", profileSave:"💾 Αποθήκευση", profileSaved:"✅ Αποθηκεύτηκε!",
    statTotalRaces:"Σύνολο Αγώνων", statFinished:"Ολοκληρωμένοι", statUpcoming:"Σε Αναμονή", statTotalKm:"Σύνολο km",
    prsTitle:"🏅 Personal Records", prsNone:"Δεν υπάρχουν χρόνοι ακόμα", overallRank:"Γενική Κατάταξη", catRank:"Κατάταξη Κατηγορίας",
    finishTime:"⏱️ Χρόνος Τερματισμού", finishTimePh:"Μορφή: ΩΩ:ΛΛ:ΔΔ", noTime:"—",
    avatarUpload:"📷 Φωτογραφία Προφίλ", avatarChange:"Αλλαγή", uploadingAvatar:"Ανέβασμα...",
    setTimeBtn:"⏱️ Χρόνος", setTimeTitle:"Καταχώρηση Χρόνου", overallRankPh:"π.χ. 5", catRankPh:"π.χ. 2",
    notes:"Σημειώσεις", notesPh:"Προσωπικές σημειώσεις...",
    clickToRegister:"👆 Κάντε κλικ για εγγραφή", myDistance:"✓ Η διαδρομή σου",
  },
  en: {
    appName:"Race Management", tagline:"Race Management Platform",
    welcome:"Welcome! 👋", chooseRole:"Choose your role to continue",
    imOrganizer:"I'm an Organizer", organizerDesc:"Create & manage races",
    imAthlete:"I'm an Athlete", athleteDesc:"Browse races & register",
    organizer:"Organizer", athlete:"Athlete",
    signup:"Sign Up", login:"Log In",
    signupAs:"Create a new account as", loginAs:"Log in with existing account",
    orgNeedsApproval:"⚠️ Organizer accounts require admin approval.",
    fullName:"Full Name", email:"Email", password:"Password",
    fillEmailPass:"Please fill in email and password!", fillName:"Please fill in your full name!",
    wrongCreds:"Wrong email or password!",
    signupOk:"✅ Sign up successful!", checkEmail:"✅ Check your email!",
    changeRole:"← Change role", signupBtn:"✨ Sign up as", loginBtn:"🔑 Log In",
    logout:"Log out", adminPanel:"RACE MANAGEMENT", athletePanel:"ATHLETE PANEL",
    loading:"Loading...",
    pendingTitle:"Account Pending", pendingMsg1:"Your account was created!", pendingMsg2:"Must be approved by admin.",
    rejectedTitle:"Application Rejected", rejectedMsg:"Contact administrator.",
    tabRaces:"🏟 Races", tabRegs:"📋 Registrations", tabAdmin:"👑 Admin",
    availableRaces:"🏟 Available Races", myRegs:"📋 My Registrations",
    availableRacesTitle:"Available Races", noAvailable:"No available races",
    myRegsTitle:"My Registrations", noRegs:"No registrations", bibCardBtn:"🎟️ BIB Card", bibCardLoading:"Generating...",
    registered:"registered", alreadyReg:"Already registered! Distance:",
    regBtn:"+ Register", regForRace:"Register for",
    statusUpcoming:"UPCOMING", statusActive:"ACTIVE", statusFinished:"FINISHED",
    regEarlyBird:"REGISTERED",
    distance:"Distance", category:"Category", tshirt:"T-Shirt", phone:"Phone",
    dob:"Date of Birth", gender:"Gender", club:"Club", optional:"Optional",
    male:"Male", female:"Female", other:"Other",
    medicalCert:"I have medical certificate",
    cost:"💰 Cost", earlyBirdDiscount:"🏷️ Early Bird",
    confirmReg:"Confirm", cancel:"Cancel",
    selectDistance:"Select distance!", alreadyRegAlert:"Already registered!",
    extraInfo:"✨ Extra Info", pleaseComplete:"Complete:", select:"— Select —", yes:"Yes",
    myRacesTitle:"My Races", adminAll:"(admin — all)", newRace:"+ New Race",
    noRacesYet:"No races yet!",
    totalRev:"total", statusBtn:"⟳ Status", excelBtn:"📊 Excel", pdfBtn:"📄 PDF", deleteBtn:"✕ Delete",
    deleteConfirm:"Delete?", noRegsCsv:"No registrations!",
    newRaceTitle:"New Race", editRaceTitle:"Edit Race", editBtn:"✏️ Edit", saveChanges:"Save", raceName:"Name *", date:"Date *",
    location:"Location", fillNameDate:"Fill name and date!", addDistance:"Add a distance!",
    maxRunners:"Max", maxRunnersPlaceholder:"Empty = unlimited",
    description:"Description", createRace:"Create",
    distancesLabel:"Distances *", quickSelect:"Quick:",
    customDistance:"Custom e.g. 23.5km", add:"+ Add",
    pricingLabel:"💰 Prices (€)", addDistancesFirst:"⚠️ Add distances first",
    perksLabel:"🎁 Perks", customPerk:"Custom perk",
    earlyBirdLabel:"⏰ Early Bird",
    enableEarlyBird:"Enable Early Bird",
    earlyBirdDeadline:"Deadline", earlyBirdPercent:"Discount %",
    customFieldsLabel:"✨ Custom Fields", customFieldsDesc:"Extra fields.",
    fieldLabel:"Label",
    typeText:"📝 Text", typeNumber:"🔢 Number", typeCheckbox:"☑️ Yes/No", typeSelect:"📋 Options",
    selectOptions:"Comma-separated",
    required:"Required", addField:"+ Add Field",
    regsTitle:"Registrations", total:"Total:", allRaces:"All", noRegsList:"No registrations",
    pendingTab:"⏳ Pending", allTab:"👥 All", allOrgsTab:"👥 All Organizers",
    pendingOrgsTitle:"Pending", allOrgsTitle:"All Organizers",
    noPending:"🎉 None pending!",
    approve:"✅ Approve", reject:"❌ Reject", reApprove:"✅ Re-approve", makeAdminBtn:"👑 Make Admin",
    rejectConfirm:"Reject?", makeAdminConfirm:"Make admin?",
    statusPending:"⏳ PENDING", statusApproved:"✅ APPROVED", statusRejected:"❌ REJECTED",
    badgeAdmin:"👑 ADMIN", badgeOrganizer:"ORGANIZER", badgePending:"⏳ PENDING", badgeAthlete:"ATHLETE",
    profileTab:"👤 Profile", profileTitle:"My Profile",
    publicRacesTitle:"🏟 Available Races", publicRacesSub:"Browse & sign up",
    publicRegisterBtn:"+ Register", publicNoRaces:"No races",
    publicLoginToReg:"Log in to register", backToRaces:"← Back",
    importResultsBtn:"📥 Import", importResultsTitle:"Import CSV",
    importResultsDesc:"CSV columns required.",
    importResultsBtn2:"⬆️ Choose CSV", importResultsProcessing:"Processing...",
    importResultsDone:"✅ %N updated!", importResultsErr:"❌ Error.",
    viewResultsBtn:"🏆 Results", resultsPageTitle:"Results",
    resultsNoData:"No results", resultsRank:"Rank", resultsBib:"BIB",
    resultsName:"Athlete", resultsTime:"Time", resultsClub:"Club", resultsCat:"Category",
    backToHome:"← Home",
    bannerLabel:"🖼️ Banner", bannerHint:"1600x600px",
    bannerUpload:"📷 Upload", bannerRemove:"🗑 Remove",
    bannerUploading:"Uploading...", heroTitle:"Find Your Race",
    heroSubtitle:"Sign up for races",
    galleryTitle:"📸 Photos",
    searchPlaceholder:"🔍 Search...",
    pendingApprovals:"pending",
    notFound:"No races found",
    statsTab:"📊 Stats", statsTitle:"Stats",
    statsTotalRaces:"Total Races", statsTotalRegs:"Total Registrations",
    statsTotalRevenue:"Total Revenue", statsAvgPerRace:"Avg per Race",
    statsRegsPerRace:"Per Race", statsRevPerRace:"Revenue",
    statsLast7Days:"Last 7 days", statsNoData:"No data",
    paymentStatus:"Payment", paymentPaid:"✅ Paid", paymentPending:"⏳ Pending",
    paymentRefunded:"↩️ Refunded", paymentMarkPaid:"Mark Paid", paymentMarkPending:"Mark Pending",
    publicRunnersToggle:"👥 Public list", publicRunnersHint:"Show registrations",
    publicRunnersList:"👥 Registered", showRunnersBtn:"👥 View",
    welcomeEmailSubject:"Confirmation - %RACE%",
    forgotPassword:"Forgot password?", resetPasswordTitle:"Reset Password",
    resetPasswordDesc:"Email reset link.",
    resetPasswordBtn:"📧 Send", resetPasswordSent:"✅ Email sent!",
    resetPasswordCancel:"← Back", profileInfo:"📋 Info", profileStats:"🏆 Stats",
    profileHistory:"📅 History", profileSave:"💾 Save", profileSaved:"✅ Saved!",
    statTotalRaces:"Total", statFinished:"Finished", statUpcoming:"Upcoming", statTotalKm:"Total km",
    prsTitle:"🏅 Records", prsNone:"No times", overallRank:"Overall", catRank:"Category",
    finishTime:"⏱️ Time", finishTimePh:"HH:MM:SS", noTime:"—",
    avatarUpload:"📷 Photo", avatarChange:"Change", uploadingAvatar:"Uploading...",
    setTimeBtn:"⏱️ Time", setTimeTitle:"Set Time", overallRankPh:"e.g. 5", catRankPh:"e.g. 2",
    notes:"Notes", notesPh:"Notes...",
    clickToRegister:"👆 Click to register", myDistance:"✓ Your distance",
  }
};

const LangContext = createContext({lang:"el", t:STR.el, setLang:()=>{}});
function useLang(){return useContext(LangContext);}

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
const PERK_PAIRS = [
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
const SUGGESTED_PERKS = PERK_PAIRS.map(p=>p.el);
function translatePerk(perk, lang){
  for(const p of PERK_PAIRS){if(perk===p.el||perk===p.en)return lang==="en"?p.en:p.el;}
  return perk;
}

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

function LangToggle(){
  const {lang,setLang}=useLang();
  return <div style={{display:"flex",background:T.bg,borderRadius:"8px",padding:"3px",border:`1px solid ${T.border}`}}>
    <button onClick={()=>setLang("el")} style={{background:lang==="el"?T.primary:"none",color:lang==="el"?"#fff":T.textMid,border:"none",borderRadius:"6px",padding:"4px 10px",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🇬🇷 ΕΛ</button>
    <button onClick={()=>setLang("en")} style={{background:lang==="en"?T.primary:"none",color:lang==="en"?"#fff":T.textMid,border:"none",borderRadius:"6px",padding:"4px 10px",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🇬🇧 EN</button>
  </div>;
}

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

function parseDistanceKm(d){if(!d)return 0;const m=String(d).match(/(\d+\.?\d*)\s*km/i);if(m)return parseFloat(m[1]);if(/μαραθ/i.test(d)||/marath/i.test(d))return 42.195;if(/ημιμαρ/i.test(d)||/half/i.test(d))return 21.0975;return 0;}
function timeToSeconds(t){if(!t)return 0;const p=String(t).split(":").map(Number);if(p.length===3)return p[0]*3600+p[1]*60+p[2];if(p.length===2)return p[0]*60+p[1];return 0;}
function formatTime(t){if(!t)return "—";const p=String(t).split(":").map(x=>x.trim());if(p.length===3)return `${String(parseInt(p[0])||0).padStart(2,"0")}:${String(parseInt(p[1])||0).padStart(2,"0")}:${String(parseInt(p[2])||0).padStart(2,"0")}`;if(p.length===2)return `00:${String(parseInt(p[0])||0).padStart(2,"0")}:${String(parseInt(p[1])||0).padStart(2,"0")}`;return t;}
function validateTime(t){if(!t||!t.trim())return null;const clean=t.trim();if(!/^\d+(:\d+)?(:\d+)?$/.test(clean))return null;const p=clean.split(":").map(x=>parseInt(x)||0);if(p.length===3){if(p[1]>=60||p[2]>=60)return null;return `${String(p[0]).padStart(2,"0")}:${String(p[1]).padStart(2,"0")}:${String(p[2]).padStart(2,"0")}`;}if(p.length===2){if(p[1]>=60)return null;return `00:${String(p[0]).padStart(2,"0")}:${String(p[1]).padStart(2,"0")}`;}if(p.length===1){return `00:00:${String(p[0]).padStart(2,"0")}`;}return null;}

function calculatePrice(race,distance){
  const basePrice=(race.pricing||[]).find(p=>p.distance===distance)?.price||0;
  if(!race.early_bird||!race.early_bird.deadline)return{base:basePrice,final:basePrice,isEarlyBird:false};
  const now=new Date();const deadline=new Date(race.early_bird.deadline);
  if(now<=deadline){const discount=race.early_bird.discount_percent||0;return{base:basePrice,final:basePrice*(1-discount/100),isEarlyBird:true,discount,deadline:race.early_bird.deadline};}
  return{base:basePrice,final:basePrice,isEarlyBird:false};
}

function PublicHomePage(){
  const {t,lang}=useLang();
  const [showLogin,setShowLogin]=useState(false);
  const [viewResults,setViewResults]=useState(null);
  const [publicRaces,setPublicRaces]=useState([]);
  const [loading,setLoading]=useState(true);
  const [searchQuery,setSearchQuery]=useState("");
  const [viewRunners,setViewRunners]=useState(null);

  useEffect(()=>{
    function handlePop(){
      if(viewRunners){setViewRunners(null);return;}
      if(viewResults){setViewResults(null);return;}
      if(showLogin){setShowLogin(false);return;}
    }
    window.addEventListener("popstate",handlePop);
    return()=>window.removeEventListener("popstate",handlePop);
  },[showLogin,viewResults,viewRunners]);

  function openLogin(){window.history.pushState({view:"login"},"");setShowLogin(true);}
  function openResults(id){window.history.pushState({view:"results",id},"");setViewResults(id);}
  function openRunners(id){window.history.pushState({view:"runners",id},"");setViewRunners(id);}
  function closeView(){if(window.history.state)window.history.back();}
  useEffect(()=>{
    (async()=>{
      const {data}=await supabase.from("races").select("*").in("status",["upcoming","active"]).order("date",{ascending:true});
      setPublicRaces(data||[]);
      setLoading(false);
    })();
  },[]);
  if(viewRunners)return <PublicRunnersPage raceId={viewRunners} onBack={closeView}/>;
  if(viewResults)return <PublicResultsPage raceId={viewResults} onBack={closeView}/>;
  if(showLogin)return <LoginPage onBack={closeView}/>;
  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:"Inter,sans-serif",padding:"24px 16px"}}>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
    <div style={{maxWidth:"960px",margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"28px",flexWrap:"wrap",gap:"12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
          <img src="/11085.png" alt="Race Management" style={{width:"50px",height:"50px",borderRadius:"50%",objectFit:"cover"}}/>
          <div>
            <div style={{color:T.text,fontWeight:900,fontSize:"20px"}}>{t.appName}</div>
            <div style={{color:T.textLight,fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase"}}>{t.tagline}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap"}}>
          <LangToggle/>
          <Btn onClick={()=>openLogin()}>🔑 {t.login} / {t.signup}</Btn>
        </div>
      </div>

      <div style={{background:`linear-gradient(135deg, ${T.primary} 0%, ${T.accent} 100%)`,borderRadius:"20px",padding:"clamp(28px, 6vw, 48px) clamp(20px, 4vw, 32px)",textAlign:"center",marginBottom:"32px",color:"#fff",boxShadow:"0 8px 32px rgba(74,93,199,0.25)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-40px",right:"-40px",width:"180px",height:"180px",borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
        <div style={{position:"absolute",bottom:"-60px",left:"-60px",width:"220px",height:"220px",borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:"clamp(32px, 8vw, 48px)",marginBottom:"10px"}}>🏃‍♂️💨</div>
          <h1 style={{fontSize:"clamp(22px, 6vw, 34px)",fontWeight:900,margin:"0 0 10px",letterSpacing:"-0.02em"}}>{t.heroTitle}</h1>
          <p style={{fontSize:"15px",margin:0,opacity:0.95}}>{t.heroSubtitle}</p>
        </div>
      </div>
      <div style={{textAlign:"left",marginBottom:"16px"}}>
        <h2 style={{color:T.text,fontSize:"22px",fontWeight:900,margin:"0 0 4px"}}>{t.publicRacesTitle}</h2>
        <p style={{color:T.textMid,fontSize:"13px",margin:0}}>{t.publicRacesSub}</p>
      </div>
      <div style={{marginBottom:"20px"}}>
        <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} style={{width:"100%",padding:"12px 16px",fontSize:"14px",borderRadius:"10px",border:`1px solid ${T.border}`,background:T.bgAlt,color:T.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
      </div>

      {loading?(
        <div style={{textAlign:"center",color:T.textMid,padding:"60px"}}>{t.loading}</div>
      ):(()=>{
        const q=searchQuery.trim().toLowerCase();
        const filtered=q?publicRaces.filter(r=>(r.name||"").toLowerCase().includes(q)||(r.location||"").toLowerCase().includes(q)):publicRaces;
        if(publicRaces.length===0)return <div style={{textAlign:"center",color:T.textLight,padding:"60px",background:T.bgAlt,borderRadius:"12px",border:`1px solid ${T.border}`}}>{t.publicNoRaces}</div>;
        if(filtered.length===0)return <div style={{textAlign:"center",color:T.textLight,padding:"60px",background:T.bgAlt,borderRadius:"12px",border:`1px solid ${T.border}`}}>{t.notFound}</div>;
        return (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"18px"}}>
          {filtered.map(race=>{
            const distances=race.distance?race.distance.split(" | "):[];
            const hasEarlyBird=race.early_bird&&race.early_bird.deadline&&new Date()<=new Date(race.early_bird.deadline);
            const statusConfig={
              upcoming:{label:t.statusUpcoming,bg:"rgba(16,185,129,0.92)"},
              active:{label:t.statusActive,bg:"rgba(59,130,246,0.92)"},
              finished:{label:t.statusFinished,bg:"rgba(107,114,128,0.92)"}
            };
            const status=statusConfig[race.status]||statusConfig.upcoming;
            return <div key={race.id} onClick={()=>openLogin()} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openLogin();}}} style={{background:T.bgAlt,borderRadius:"20px",overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",transition:"transform 0.2s ease, box-shadow 0.2s ease"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 28px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)";}}>
              <div style={{position:"relative",width:"100%",aspectRatio:"16/10",background:`linear-gradient(135deg,${T.primary},${T.accent})`,overflow:"hidden"}}>
                {race.banner_url&&<img src={race.banner_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>}
                <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)"}}/>
                <div style={{position:"absolute",top:"14px",right:"14px",display:"flex",gap:"8px",alignItems:"center"}}>
                  {hasEarlyBird&&<span style={{background:"rgba(212,160,23,0.95)",backdropFilter:"blur(8px)",color:"#fff",padding:"5px 11px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.04em"}}>🏷 -{race.early_bird.discount_percent}%</span>}
                  <span style={{background:status.bg,backdropFilter:"blur(8px)",color:"#fff",padding:"6px 13px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase"}}>{status.label}</span>
                </div>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"24px 22px 18px"}}>
                  <h3 style={{margin:"0 0 8px",color:"#fff",fontSize:"clamp(20px,4vw,24px)",fontWeight:900,letterSpacing:"-0.02em",lineHeight:1.15,textShadow:"0 2px 12px rgba(0,0,0,0.4)"}}>{race.name}</h3>
                  <div style={{display:"flex",alignItems:"center",gap:"14px",color:"rgba(255,255,255,0.95)",fontSize:"13px",fontWeight:500,flexWrap:"wrap",textShadow:"0 1px 4px rgba(0,0,0,0.5)"}}>
                    <span>📅 {race.date}</span>
                    <span>📍 {race.location||"—"}</span>
                  </div>
                </div>
              </div>
              <div style={{padding:"18px 22px 20px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",flexWrap:"wrap",marginBottom:"14px"}}>
                  <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                    {distances.slice(0,4).map((d,i)=>(<span key={i} style={{background:T.bg,color:T.text,fontSize:"12px",fontWeight:700,padding:"5px 11px",borderRadius:"8px"}}>{d}</span>))}
                    {distances.length>4&&<span style={{color:T.textMid,fontSize:"12px",fontWeight:600,padding:"5px 4px"}}>+{distances.length-4}</span>}
                  </div>
                </div>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>openLogin()} style={{flex:1,minWidth:"120px",background:T.primary,color:"#fff",border:"none",borderRadius:"10px",padding:"10px 16px",fontSize:"13px",fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 12px rgba(74,93,199,0.25)"}}>{t.clickToRegister}</button>
                  <button onClick={()=>openResults(race.id)} style={{background:T.bg,color:T.text,border:"none",borderRadius:"10px",padding:"10px 14px",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.viewResultsBtn}</button>
                  {race.public_runners_list&&<button onClick={()=>openRunners(race.id)} style={{background:T.bg,color:T.text,border:"none",borderRadius:"10px",padding:"10px 14px",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.showRunnersBtn}</button>}
                </div>
              </div>
            </div>;
          })}
        </div>);
      })()}

      <div style={{textAlign:"center",marginTop:"40px",color:T.textLight,fontSize:"12px"}}>
        © {new Date().getFullYear()} {t.appName}
      </div>
    </div>
  </div>;
}

function PublicResultsPage({raceId,onBack}){
  const {t}=useLang();
  const [race,setRace]=useState(null);
  const [results,setResults]=useState([]);
  const [runners,setRunners]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filterDistance,setFilterDistance]=useState("all");
  const [isMobile,setIsMobile]=useState(typeof window!=="undefined"&&window.innerWidth<640);
  useEffect(()=>{const fn=()=>setIsMobile(window.innerWidth<640);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);
  useEffect(()=>{
    (async()=>{
      const [r1,r2,r3]=await Promise.all([
        supabase.from("races").select("*").eq("id",raceId).single(),
        supabase.from("registrations").select("*").eq("race_id",raceId),
        supabase.from("runners").select("*")
      ]);
      if(r1.data)setRace(r1.data);
      if(r2.data)setResults(r2.data);
      if(r3.data)setRunners(r3.data);
      setLoading(false);
    })();
  },[raceId]);
  if(loading)return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.textMid,fontFamily:"Inter,sans-serif"}}>{t.loading}</div>;
  if(!race)return <div style={{minHeight:"100vh",background:T.bg,padding:"40px",fontFamily:"Inter,sans-serif",textAlign:"center"}}>—</div>;

  const distances=race.distance?race.distance.split(" | "):[];
  const filtered=results.filter(r=>r.finish_time).filter(r=>filterDistance==="all"||r.distance===filterDistance).sort((a,b)=>{if(a.overall_rank&&b.overall_rank)return a.overall_rank-b.overall_rank;return timeToSeconds(a.finish_time)-timeToSeconds(b.finish_time);});

  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:"Inter,sans-serif",padding:"24px 16px"}}>
    <div style={{maxWidth:"960px",margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.textMid,cursor:"pointer",fontSize:"13px",fontFamily:"inherit"}}>{t.backToHome}</button>
        <LangToggle/>
      </div>
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"16px",overflow:"hidden",marginBottom:"20px",boxShadow:T.shadow}}>
        {race.banner_url&&<img src={race.banner_url} alt="" style={{width:"100%",height:"200px",objectFit:"cover",display:"block"}}/>}
        <div style={{padding:"24px"}}>
          <h1 style={{margin:"0 0 6px",color:T.text,fontSize:"24px",fontWeight:900}}>🏆 {race.name}</h1>
          <div style={{color:T.textMid,fontSize:"14px"}}>📅 {race.date} · 📍 {race.location||"—"} · 👤 {filtered.length} {t.registered}</div>
        </div>
      </div>
      {distances.length>1&&(
        <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"16px"}}>
          <button onClick={()=>setFilterDistance("all")} style={{background:filterDistance==="all"?T.primary:T.bgAlt,color:filterDistance==="all"?"#fff":T.textMid,border:`1px solid ${filterDistance==="all"?T.primary:T.border}`,borderRadius:"8px",padding:"8px 14px",cursor:"pointer",fontSize:"13px",fontWeight:600,fontFamily:"inherit"}}>{t.allRaces}</button>
          {distances.map(d=><button key={d} onClick={()=>setFilterDistance(d)} style={{background:filterDistance===d?T.primary:T.bgAlt,color:filterDistance===d?"#fff":T.textMid,border:`1px solid ${filterDistance===d?T.primary:T.border}`,borderRadius:"8px",padding:"8px 14px",cursor:"pointer",fontSize:"13px",fontWeight:600,fontFamily:"inherit"}}>🏃 {d}</button>)}
        </div>
      )}
      {filtered.length===0?(
        <div style={{textAlign:"center",color:T.textLight,padding:"60px",background:T.bgAlt,borderRadius:"12px",border:`1px solid ${T.border}`}}>{t.resultsNoData}</div>
      ):(
        <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",overflow:"hidden",boxShadow:T.shadow}}>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"40px 50px 44px 1fr 80px":"60px 60px 50px 1fr 100px 120px",background:T.primary,color:"#fff",padding:"10px 12px",fontSize:isMobile?"10px":"12px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",gap:"6px"}}>
            <div>{t.resultsRank}</div><div>{t.resultsBib}</div><div></div><div>{t.resultsName}</div>{!isMobile&&<div>{t.resultsCat}</div>}<div style={{textAlign:"right"}}>{t.resultsTime}</div>
          </div>
          {filtered.map((reg,i)=>{
            const r=runners.find(x=>x.id===reg.runner_id)||{};
            const rank=reg.overall_rank||(i+1);
            return <div key={reg.id} style={{display:"grid",gridTemplateColumns:isMobile?"40px 50px 44px 1fr 80px":"60px 60px 50px 1fr 100px 120px",padding:isMobile?"10px 12px":"12px 14px",fontSize:isMobile?"12px":"13px",background:i%2===0?T.bg:T.bgAlt,borderTop:`1px solid ${T.border}`,alignItems:"center",gap:"6px"}}>
              <div style={{fontWeight:900,color:rank<=3?T.warning:T.text,fontSize:rank<=3?(isMobile?"16px":"18px"):"14px"}}>{rank<=3?(rank===1?"🥇":rank===2?"🥈":"🥉"):rank}</div>
              <div style={{color:T.textMid,fontWeight:600,fontSize:isMobile?"11px":"13px"}}>#{reg.bib_number}</div>
              <div>{r.avatar_url?(<img src={r.avatar_url} alt="" style={{width:isMobile?"32px":"36px",height:isMobile?"32px":"36px",borderRadius:"50%",objectFit:"cover",border:`2px solid ${rank<=3?T.warning:T.border}`}}/>):(<div style={{width:isMobile?"32px":"36px",height:isMobile?"32px":"36px",borderRadius:"50%",background:T.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:isMobile?"12px":"14px",border:`2px solid ${rank<=3?T.warning:T.border}`}}>{(r.first_name?.[0]||"?").toUpperCase()}</div>)}</div>
              <div style={{minWidth:0,overflow:"hidden"}}><div style={{color:T.text,fontWeight:600,fontSize:isMobile?"12px":"13px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.first_name} {r.last_name}</div><div style={{color:T.textLight,fontSize:isMobile?"10px":"11px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{isMobile?(reg.category||r.club||reg.distance||""):`${r.club||""}${r.club&&reg.distance?" · ":""}${reg.distance||""}`}</div></div>
              {!isMobile&&<div style={{color:T.textMid,fontSize:"12px"}}>{reg.category||"—"}</div>}
              <div style={{textAlign:"right",fontFamily:"monospace",fontWeight:700,color:T.text,fontSize:isMobile?"12px":"14px"}}>{formatTime(reg.finish_time)}</div>
            </div>;
          })}
        </div>
      )}
    </div>
  </div>;
}

function PublicRunnersPage({raceId,onBack}){
  const {t}=useLang();
  const [race,setRace]=useState(null);
  const [regs,setRegs]=useState([]);
  const [runners,setRunners]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filterDistance,setFilterDistance]=useState("all");
  const [search,setSearch]=useState("");
  useEffect(()=>{
    (async()=>{
      const [r1,r2,r3]=await Promise.all([
        supabase.from("races").select("*").eq("id",raceId).single(),
        supabase.from("registrations").select("*").eq("race_id",raceId),
        supabase.from("runners").select("id,first_name,last_name,city,club,avatar_url")
      ]);
      if(r1.data)setRace(r1.data);
      if(r2.data)setRegs(r2.data);
      if(r3.data)setRunners(r3.data);
      setLoading(false);
    })();
  },[raceId]);
  if(loading)return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.textMid,fontFamily:"Inter,sans-serif"}}>{t.loading}</div>;
  if(!race)return <div style={{minHeight:"100vh",background:T.bg,padding:"40px",fontFamily:"Inter,sans-serif",textAlign:"center"}}>—</div>;

  const distances=race.distance?race.distance.split(" | "):[];
  const sq=search.trim().toLowerCase();
  const filtered=regs.filter(r=>filterDistance==="all"||r.distance===filterDistance).map(r=>{const runner=runners.find(x=>x.id===r.runner_id)||{};return{...r,runner};}).filter(r=>!sq||((r.runner.first_name||"")+" "+(r.runner.last_name||"")).toLowerCase().includes(sq)).sort((a,b)=>(a.bib_number||0)-(b.bib_number||0));

  return <div style={{minHeight:"100vh",background:T.bg,fontFamily:"Inter,sans-serif",padding:"24px 16px"}}>
    <div style={{maxWidth:"960px",margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.textMid,cursor:"pointer",fontSize:"13px",fontFamily:"inherit"}}>{t.backToHome}</button>
        <LangToggle/>
      </div>
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"16px",overflow:"hidden",marginBottom:"20px",boxShadow:T.shadow}}>
        {race.banner_url&&<img src={race.banner_url} alt="" style={{width:"100%",height:"200px",objectFit:"cover",display:"block"}}/>}
        <div style={{padding:"24px"}}>
          <h1 style={{margin:"0 0 6px",color:T.text,fontSize:"24px",fontWeight:900}}>👥 {race.name}</h1>
          <div style={{color:T.textMid,fontSize:"14px"}}>📅 {race.date} · 📍 {race.location||"—"} · 👤 {filtered.length} {t.registered}</div>
        </div>
      </div>
      <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Αναζήτηση αθλητή..." style={{width:"100%",padding:"12px 16px",fontSize:"14px",borderRadius:"10px",border:`1px solid ${T.border}`,background:T.bgAlt,color:T.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:"14px"}}/>
      {distances.length>1&&(
        <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"16px"}}>
          <button onClick={()=>setFilterDistance("all")} style={{background:filterDistance==="all"?T.primary:T.bgAlt,color:filterDistance==="all"?"#fff":T.textMid,border:`1px solid ${filterDistance==="all"?T.primary:T.border}`,borderRadius:"8px",padding:"8px 14px",cursor:"pointer",fontSize:"13px",fontWeight:600,fontFamily:"inherit"}}>{t.allRaces}</button>
          {distances.map(d=><button key={d} onClick={()=>setFilterDistance(d)} style={{background:filterDistance===d?T.primary:T.bgAlt,color:filterDistance===d?"#fff":T.textMid,border:`1px solid ${filterDistance===d?T.primary:T.border}`,borderRadius:"8px",padding:"8px 14px",cursor:"pointer",fontSize:"13px",fontWeight:600,fontFamily:"inherit"}}>🏃 {d}</button>)}
        </div>
      )}
      {filtered.length===0?(
        <div style={{textAlign:"center",color:T.textLight,padding:"60px",background:T.bgAlt,borderRadius:"12px",border:`1px solid ${T.border}`}}>{t.notFound}</div>
      ):(
        <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",overflow:"hidden",boxShadow:T.shadow}}>
          {filtered.map((reg,i)=>(
            <div key={reg.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 16px",borderTop:i?`1px solid ${T.border}`:"none",background:i%2===0?T.bg:T.bgAlt}}>
              <div style={{background:T.primary,color:"#fff",borderRadius:"8px",padding:"4px 10px",fontWeight:700,fontSize:"13px",minWidth:"45px",textAlign:"center"}}>#{reg.bib_number}</div>
              {reg.runner.avatar_url?(<img src={reg.runner.avatar_url} alt="" style={{width:"40px",height:"40px",borderRadius:"50%",objectFit:"cover"}}/>):(<div style={{width:"40px",height:"40px",borderRadius:"50%",background:T.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{(reg.runner.first_name?.[0]||"?").toUpperCase()}</div>)}
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:T.text,fontWeight:700,fontSize:"14px"}}>{reg.runner.first_name} {reg.runner.last_name}</div>
                <div style={{color:T.textLight,fontSize:"12px"}}>{reg.runner.club||""}{reg.runner.club&&reg.distance?" · ":""}{reg.distance||""}{reg.runner.city?` · ${reg.runner.city}`:""}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>;
}

function LoginPage({onBack}){
  const {t}=useLang();
  const [step,setStep]=useState("role");
  const [role,setRole]=useState(null);
  const [mode,setMode]=useState("signup");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [forgotMode,setForgotMode]=useState(false);
  async function sendResetEmail(){
    setError("");
    if(!email){setError(t.fillEmailPass);return;}
    setLoading(true);
    const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
    if(error)setError(error.message);
    else setError(t.resetPasswordSent);
    setLoading(false);
  }
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
    <div style={{position:"absolute",top:"20px",right:"20px"}}><LangToggle/></div>
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"20px",padding:"40px",width:"100%",maxWidth:"460px",boxShadow:T.shadow}}>
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <img src="/11085.png" alt="Race Management" style={{width:"80px",height:"80px",borderRadius:"50%",margin:"0 auto 16px",display:"block",objectFit:"cover"}}/>
        <h1 style={{color:T.text,fontSize:"22px",fontWeight:900,margin:"0 0 4px"}}>{t.appName}</h1>
        <p style={{color:T.textMid,fontSize:"13px",margin:0}}>{t.tagline}</p>
      </div>
      {onBack&&<button onClick={onBack} style={{background:"none",border:"none",color:T.textMid,cursor:"pointer",fontSize:"13px",marginBottom:"14px",padding:"4px 0",fontFamily:"inherit"}}>{t.backToRaces}</button>}
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
      {step==="auth"&&forgotMode&&(
        <div>
          <div style={{textAlign:"center",marginBottom:"20px"}}>
            <h3 style={{color:T.text,fontSize:"16px",margin:"0 0 8px",fontWeight:700}}>{t.resetPasswordTitle}</h3>
            <p style={{color:T.textMid,fontSize:"13px",margin:0}}>{t.resetPasswordDesc}</p>
          </div>
          <div style={{marginBottom:"14px"}}><label style={css.label}>{t.email}</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={css.input}/></div>
          {error&&<div style={{background:error.startsWith("✅")?`${T.accent}15`:`${T.danger}15`,border:`1px solid ${error.startsWith("✅")?T.accent+"44":T.danger+"44"}`,borderRadius:"8px",padding:"10px 14px",color:error.startsWith("✅")?T.accent:T.danger,fontSize:"13px",marginBottom:"16px",lineHeight:"1.5"}}>{error}</div>}
          <button onClick={sendResetEmail} disabled={loading} style={{width:"100%",background:T.primary,color:"#fff",border:"none",borderRadius:"10px",padding:"14px",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:"12px",opacity:loading?0.6:1,boxShadow:T.shadow}}>{loading?"...":t.resetPasswordBtn}</button>
          <button onClick={()=>{setForgotMode(false);setError("");}} style={{width:"100%",background:"none",border:`1px solid ${T.border}`,color:T.textMid,borderRadius:"10px",padding:"10px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>{t.resetPasswordCancel}</button>
        </div>
      )}
      {step==="auth"&&!forgotMode&&(
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
          {mode==="login"&&!forgotMode&&<button onClick={()=>{setForgotMode(true);setError("");}} style={{width:"100%",background:"none",border:"none",color:T.primary,cursor:"pointer",fontSize:"12px",fontFamily:"inherit",marginBottom:"8px",textDecoration:"underline"}}>{t.forgotPassword}</button>}
          <button onClick={backToRole} style={{width:"100%",background:"none",border:`1px solid ${T.border}`,color:T.textMid,borderRadius:"10px",padding:"10px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>{t.changeRole}</button>
        </div>
      )}
    </div>
  </div>;
}

function AthleteRaceCard({race,registrations,runners,session,onSelect}){
  const {t}=useLang();
  const myReg=registrations.find(r=>r.race_id===race.id&&runners.find(rn=>rn.id===r.runner_id)?.email===session.user.email);
  const totalRegs=registrations.filter(r=>r.race_id===race.id).length;
  const distances=race.distance?race.distance.split(" | "):[];
  const statusConfig={
    upcoming:{label:t.statusUpcoming,bg:"rgba(16,185,129,0.92)"},
    active:{label:t.statusActive,bg:"rgba(59,130,246,0.92)"},
    finished:{label:t.statusFinished,bg:"rgba(107,114,128,0.92)"}
  };
  const status=statusConfig[race.status]||statusConfig.upcoming;
  const hasEarlyBird=race.early_bird&&race.early_bird.deadline&&new Date()<=new Date(race.early_bird.deadline);
  return <div onClick={()=>onSelect(race)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onSelect(race);}}} style={{background:T.bgAlt,borderRadius:"20px",overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",transition:"transform 0.2s ease, box-shadow 0.2s ease"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 28px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)";}}>
    <div style={{position:"relative",width:"100%",aspectRatio:"16/10",background:`linear-gradient(135deg,${T.primary},${T.accent})`,overflow:"hidden"}}>
      {race.banner_url&&<img src={race.banner_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)"}}/>
      <div style={{position:"absolute",top:"14px",right:"14px",display:"flex",gap:"8px",alignItems:"center"}}>
        {hasEarlyBird&&<span style={{background:"rgba(212,160,23,0.95)",backdropFilter:"blur(8px)",color:"#fff",padding:"5px 11px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.04em"}}>🏷 -{race.early_bird.discount_percent}%</span>}
        <span style={{background:status.bg,backdropFilter:"blur(8px)",color:"#fff",padding:"6px 13px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase"}}>{status.label}</span>
      </div>
      {myReg&&<div style={{position:"absolute",top:"14px",left:"14px",background:"rgba(255,255,255,0.95)",backdropFilter:"blur(8px)",color:T.accent,padding:"6px 12px",borderRadius:"999px",fontSize:"11px",fontWeight:800}}>✓ BIB #{myReg.bib_number}</div>}
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"24px 22px 18px"}}>
        <h3 style={{margin:"0 0 8px",color:"#fff",fontSize:"clamp(20px,4vw,24px)",fontWeight:900,letterSpacing:"-0.02em",lineHeight:1.15,textShadow:"0 2px 12px rgba(0,0,0,0.4)"}}>{race.name}</h3>
        <div style={{display:"flex",alignItems:"center",gap:"14px",color:"rgba(255,255,255,0.95)",fontSize:"13px",fontWeight:500,flexWrap:"wrap",textShadow:"0 1px 4px rgba(0,0,0,0.5)"}}>
          <span>📅 {race.date}</span>
          <span>📍 {race.location||"—"}</span>
        </div>
      </div>
    </div>
    <div style={{padding:"18px 22px 20px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
          {distances.slice(0,4).map((d,i)=>(<span key={i} style={{background:T.bg,color:T.text,fontSize:"12px",fontWeight:700,padding:"5px 11px",borderRadius:"8px"}}>{d}</span>))}
          {distances.length>4&&<span style={{color:T.textMid,fontSize:"12px",fontWeight:600,padding:"5px 4px"}}>+{distances.length-4}</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"6px",color:T.textMid,fontSize:"12px",fontWeight:600}}><span style={{fontSize:"14px"}}>👤</span>{totalRegs}</div>
      </div>
    </div>
  </div>;
}

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
    setLoading(false);
    alert("✅ Η εγγραφή ολοκληρώθηκε! BIB #"+bibNum);
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

function AthleteProfile({runners,registrations,races,session,onRefresh}){
  const {t}=useLang();
  const myRunner=runners.find(r=>r.email===session.user.email);
  const myRegs=myRunner?registrations.filter(r=>r.runner_id===myRunner.id):[];
  const [form,setForm]=useState({
    first_name:myRunner?.first_name||"",last_name:myRunner?.last_name||"",
    phone:myRunner?.phone||"",dob:myRunner?.dob||"",gender:myRunner?.gender||"",
    club:myRunner?.club||"",amka:myRunner?.amka||"",city:myRunner?.city||"",
    emergency_name:myRunner?.emergency_name||"",emergency_phone:myRunner?.emergency_phone||"",
    notes:myRunner?.notes||""
  });
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [uploading,setUploading]=useState(false);
  function set(k,v){setForm({...form,[k]:v});setSaved(false);}
  async function save(){
    if(!myRunner)return;
    setSaving(true);
    const {error}=await supabase.from("runners").update(form).eq("id",myRunner.id);
    if(error)alert("Σφάλμα: "+error.message);
    else{setSaved(true);onRefresh();setTimeout(()=>setSaved(false),3000);}
    setSaving(false);
  }
  async function uploadAvatar(e){
    const file=e.target.files?.[0];
    if(!file||!myRunner)return;
    setUploading(true);
    const ext=file.name.split(".").pop();
    const path=`${myRunner.id}-${Date.now()}.${ext}`;
    const {error:upErr}=await supabase.storage.from("avatars").upload(path,file,{upsert:true});
    if(upErr){alert("Σφάλμα: "+upErr.message);setUploading(false);return;}
    const {data:{publicUrl}}=supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("runners").update({avatar_url:publicUrl}).eq("id",myRunner.id);
    onRefresh();setUploading(false);
  }

  const totalRaces=myRegs.length;
  const finishedCount=myRegs.filter(r=>r.finish_time).length;
  const upcomingCount=myRegs.filter(r=>{const race=races.find(rc=>rc.id===r.race_id);return race&&race.status==="upcoming";}).length;
  const totalKm=myRegs.reduce((sum,r)=>sum+parseDistanceKm(r.distance),0);
  const prs={};
  myRegs.filter(r=>r.finish_time).forEach(r=>{
    const km=parseDistanceKm(r.distance);
    if(km<=0)return;
    const secs=timeToSeconds(r.finish_time);
    if(secs<=0)return;
    if(!prs[r.distance]||secs<timeToSeconds(prs[r.distance].finish_time)){
      const race=races.find(rc=>rc.id===r.race_id);
      prs[r.distance]={...r,raceName:race?.name||"-",raceDate:race?.date||""};
    }
  });
  const prList=Object.values(prs).sort((a,b)=>parseDistanceKm(a.distance)-parseDistanceKm(b.distance));
  const history=myRegs.map(r=>{const race=races.find(rc=>rc.id===r.race_id)||{};return{...r,race};}).sort((a,b)=>(b.race.date||"").localeCompare(a.race.date||""));

  if(!myRunner)return <div style={{textAlign:"center",color:T.textLight,padding:"60px"}}>—</div>;

  return <div>
    <h2 style={{margin:"0 0 20px",color:T.text,fontSize:"20px"}}>{t.profileTitle}</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:"10px",marginBottom:"20px"}}>
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"16px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"24px",fontWeight:900,color:T.primary}}>{totalRaces}</div>
        <div style={{fontSize:"11px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"4px"}}>{t.statTotalRaces}</div>
      </div>
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"16px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"24px",fontWeight:900,color:T.accent}}>{finishedCount}</div>
        <div style={{fontSize:"11px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"4px"}}>{t.statFinished}</div>
      </div>
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"16px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"24px",fontWeight:900,color:T.warning}}>{upcomingCount}</div>
        <div style={{fontSize:"11px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"4px"}}>{t.statUpcoming}</div>
      </div>
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"16px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"24px",fontWeight:900,color:T.text}}>{totalKm.toFixed(1)}</div>
        <div style={{fontSize:"11px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"4px"}}>{t.statTotalKm}</div>
      </div>
    </div>
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px",boxShadow:T.shadow,marginBottom:"20px"}}>
      <h3 style={{margin:"0 0 14px",color:T.text,fontSize:"16px"}}>{t.prsTitle}</h3>
      {prList.length===0?(
        <div style={{color:T.textLight,fontSize:"13px",textAlign:"center",padding:"20px"}}>{t.prsNone}</div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {prList.map((pr,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:T.bg,borderRadius:"8px",padding:"10px 14px",border:`1px solid ${T.border}`}}>
              <div>
                <div style={{color:T.text,fontWeight:700,fontSize:"14px"}}>🏃 {pr.distance}</div>
                <div style={{color:T.textMid,fontSize:"12px"}}>{pr.raceName} · {pr.raceDate}</div>
              </div>
              <div style={{background:T.primary,color:"#fff",borderRadius:"6px",padding:"6px 14px",fontWeight:700,fontSize:"15px",fontFamily:"monospace"}}>{formatTime(pr.finish_time)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px",boxShadow:T.shadow,marginBottom:"20px"}}>
      <h3 style={{margin:"0 0 14px",color:T.text,fontSize:"16px"}}>{t.profileInfo}</h3>
      <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"20px",padding:"14px",background:T.bg,borderRadius:"10px"}}>
        {myRunner.avatar_url?(<img src={myRunner.avatar_url} alt="" style={{width:"72px",height:"72px",borderRadius:"50%",objectFit:"cover",border:`3px solid ${T.primary}`}}/>):(<div style={{width:"72px",height:"72px",borderRadius:"50%",background:T.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",fontWeight:700}}>{(form.first_name?.[0]||"?").toUpperCase()}</div>)}
        <div style={{flex:1}}>
          <div style={{color:T.text,fontWeight:700,marginBottom:"6px"}}>{t.avatarUpload}</div>
          <label style={{display:"inline-block",cursor:"pointer",background:T.primary,color:"#fff",borderRadius:"8px",padding:"8px 14px",fontSize:"12px",fontWeight:700}}>
            {uploading?t.uploadingAvatar:t.avatarChange}
            <input type="file" accept="image/*" onChange={uploadAvatar} style={{display:"none"}} disabled={uploading}/>
          </label>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label="Όνομα" value={form.first_name} onChange={e=>set("first_name",e.target.value)}/>
        <In label="Επώνυμο" value={form.last_name} onChange={e=>set("last_name",e.target.value)}/>
      </div>
      <In label={t.email} value={session.user.email} disabled style={{opacity:0.6}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label={t.phone} value={form.phone} onChange={e=>set("phone",e.target.value)}/>
        <In label="ΑΜΚΑ" value={form.amka} onChange={e=>set("amka",e.target.value)}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label={t.dob} type="date" value={form.dob||""} onChange={e=>set("dob",e.target.value)}/>
        <Sel label={t.gender} value={form.gender||t.male} onChange={e=>set("gender",e.target.value)}><option>{t.male}</option><option>{t.female}</option><option>{t.other}</option></Sel>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label={t.club} value={form.club} onChange={e=>set("club",e.target.value)}/>
        <In label="Πόλη" value={form.city} onChange={e=>set("city",e.target.value)}/>
      </div>
      <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"14px",marginBottom:"14px"}}>
        <div style={{color:T.text,fontSize:"13px",fontWeight:700,marginBottom:"10px"}}>🆘 Επαφή Έκτακτης Ανάγκης</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
          <In label="Ονοματεπώνυμο" value={form.emergency_name} onChange={e=>set("emergency_name",e.target.value)}/>
          <In label="Τηλέφωνο" value={form.emergency_phone} onChange={e=>set("emergency_phone",e.target.value)}/>
        </div>
      </div>
      <F label={t.notes}><textarea value={form.notes||""} onChange={e=>set("notes",e.target.value)} rows={3} placeholder={t.notesPh} style={{...css.input,resize:"vertical"}}/></F>
      <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        <Btn onClick={save} disabled={saving}>{saving?"...":t.profileSave}</Btn>
        {saved&&<span style={{color:T.accent,fontSize:"13px",fontWeight:700}}>{t.profileSaved}</span>}
      </div>
    </div>
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px",boxShadow:T.shadow}}>
      <h3 style={{margin:"0 0 14px",color:T.text,fontSize:"16px"}}>{t.profileHistory}</h3>
      {history.length===0?(
        <div style={{color:T.textLight,fontSize:"13px",textAlign:"center",padding:"20px"}}>{t.noRegs}</div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {history.map((h,i)=>(
            <div key={i} style={{background:T.bg,borderRadius:"8px",padding:"12px 16px",border:`1px solid ${T.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px",flexWrap:"wrap",gap:"6px"}}>
                <div style={{color:T.text,fontWeight:700,fontSize:"14px"}}>#{h.bib_number} · {h.race.name}</div>
                {h.finish_time?(<span style={{background:T.accent,color:"#fff",borderRadius:"6px",padding:"3px 10px",fontSize:"12px",fontFamily:"monospace",fontWeight:700}}>⏱️ {formatTime(h.finish_time)}</span>):(<span style={{color:T.textLight,fontSize:"12px"}}>{t.noTime}</span>)}
              </div>
              <div style={{color:T.textMid,fontSize:"12px"}}>📅 {h.race.date||"-"} · 🏃 {h.distance||"-"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>;
}

function RaceDetailsPage({race,registrations,runners,profile,session,onBack,onRegister}){
  const {t,lang}=useLang();
  const [activeTab,setActiveTab]=useState("info");
  const myReg=registrations.find(r=>r.race_id===race.id&&runners.find(rn=>rn.id===r.runner_id)?.email===session.user.email);
  const totalRegs=registrations.filter(r=>r.race_id===race.id).length;
  const distances=race.distance?race.distance.split(" | "):[];
  const canRegister=!myReg&&race.status==="upcoming";
  const hasEarlyBird=race.early_bird&&race.early_bird.deadline&&new Date()<=new Date(race.early_bird.deadline);
  const statusConfig={
    upcoming:{label:t.statusUpcoming,bg:"rgba(16,185,129,0.95)"},
    active:{label:t.statusActive,bg:"rgba(59,130,246,0.95)"},
    finished:{label:t.statusFinished,bg:"rgba(107,114,128,0.95)"}
  };
  const status=statusConfig[race.status]||statusConfig.upcoming;
  const finishedRegs=registrations.filter(r=>r.race_id===race.id&&r.finish_time).sort((a,b)=>{if(a.overall_rank&&b.overall_rank)return a.overall_rank-b.overall_rank;return timeToSeconds(a.finish_time)-timeToSeconds(b.finish_time);});

  function getPerkIcon(perk){
    const first=perk?.charAt(0);
    if(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(first||""))return first;
    const p=(perk||"").toLowerCase();
    if(p.includes("shirt")||p.includes("μπλούζ"))return "👕";
    if(p.includes("medal")||p.includes("μετάλλι"))return "🏅";
    if(p.includes("food")||p.includes("φαγητ"))return "🍝";
    if(p.includes("water")||p.includes("νερ"))return "💧";
    if(p.includes("goody")||p.includes("bag"))return "🎒";
    if(p.includes("photo")||p.includes("φωτογ"))return "📸";
    if(p.includes("shower")||p.includes("ντουζ"))return "🚿";
    if(p.includes("medical")||p.includes("ιατρ"))return "🏥";
    if(p.includes("timing")||p.includes("χρονο"))return "🎟️";
    if(p.includes("cert")||p.includes("πιστοπ"))return "📋";
    return "✓";
  }
  function getPerkLabel(perk){return (perk||"").replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s*/u,"").trim()||perk;}

  async function share(){
    if(navigator.share){
      try{await navigator.share({title:race.name,text:`${race.name} - ${race.date}`,url:window.location.href});}catch(e){}
    }else if(navigator.clipboard){
      navigator.clipboard.writeText(window.location.href);
      alert(lang==="el"?"Σύνδεσμος αντιγράφηκε!":"Link copied!");
    }
  }

  const tabs=[
    {id:"info",label:lang==="el"?"Πληροφορίες":"Information",icon:"ℹ️"},
    {id:"routes",label:lang==="el"?"Διαδρομές":"Routes",icon:"🏃"},
    {id:"perks",label:lang==="el"?"Παροχές":"Benefits",icon:"🎁"},
    {id:"results",label:lang==="el"?"Αποτελέσματα":"Results",icon:"🏆"}
  ];

  return <div style={{minHeight:"100vh",background:T.bg}}>
    <div style={{position:"relative",width:"100%",height:"clamp(280px,45vh,420px)",background:`linear-gradient(135deg,${T.primary},${T.accent})`,overflow:"hidden"}}>
      {race.banner_url&&<img src={race.banner_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%)"}}/>
      <div style={{position:"absolute",top:0,left:0,right:0,padding:"18px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:2}}>
        <button onClick={onBack} aria-label="Back" style={{background:"rgba(255,255,255,0.18)",backdropFilter:"blur(10px)",border:"none",color:"#fff",borderRadius:"50%",width:"42px",height:"42px",cursor:"pointer",fontSize:"20px",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>←</button>
        <div style={{display:"flex",gap:"8px"}}>
          <button aria-label="Favorite" style={{background:"rgba(255,255,255,0.18)",backdropFilter:"blur(10px)",border:"none",color:"#fff",borderRadius:"50%",width:"42px",height:"42px",cursor:"pointer",fontSize:"18px",fontFamily:"inherit"}}>♡</button>
          <button onClick={share} aria-label="Share" style={{background:"rgba(255,255,255,0.18)",backdropFilter:"blur(10px)",border:"none",color:"#fff",borderRadius:"50%",width:"42px",height:"42px",cursor:"pointer",fontSize:"16px",fontFamily:"inherit"}}>↗</button>
        </div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"28px 20px 28px"}}>
        <div style={{maxWidth:"1000px",margin:"0 auto"}}>
          <div style={{display:"flex",gap:"8px",marginBottom:"14px",flexWrap:"wrap"}}>
            <span style={{background:status.bg,backdropFilter:"blur(8px)",color:"#fff",padding:"6px 14px",borderRadius:"999px",fontSize:"11px",fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase"}}>{status.label}</span>
            {hasEarlyBird&&<span style={{background:"rgba(212,160,23,0.95)",backdropFilter:"blur(8px)",color:"#fff",padding:"6px 12px",borderRadius:"999px",fontSize:"11px",fontWeight:800}}>🏷 EARLY BIRD -{race.early_bird.discount_percent}%</span>}
            {myReg&&<span style={{background:"rgba(255,255,255,0.95)",backdropFilter:"blur(8px)",color:T.accent,padding:"6px 12px",borderRadius:"999px",fontSize:"11px",fontWeight:800}}>✓ BIB #{myReg.bib_number}</span>}
          </div>
          <h1 style={{margin:"0 0 12px",color:"#fff",fontSize:"clamp(26px,5vw,36px)",fontWeight:900,letterSpacing:"-0.02em",lineHeight:1.1,textShadow:"0 2px 14px rgba(0,0,0,0.4)"}}>{race.name}</h1>
          <div style={{display:"flex",alignItems:"center",gap:"18px",color:"rgba(255,255,255,0.95)",fontSize:"14px",fontWeight:500,flexWrap:"wrap",textShadow:"0 1px 4px rgba(0,0,0,0.5)"}}>
            <span>📅 {race.date}</span>
            <span>📍 {race.location||"—"}</span>
            <span>👤 {totalRegs}</span>
          </div>
        </div>
      </div>
    </div>

    <div style={{background:T.bgAlt,borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:10,boxShadow:"0 1px 0 rgba(0,0,0,0.02)"}}>
      <div style={{maxWidth:"1000px",margin:"0 auto",display:"flex",padding:"0 20px",overflowX:"auto"}}>
        {tabs.map(tb=>(
          <button key={tb.id} onClick={()=>setActiveTab(tb.id)} aria-pressed={activeTab===tb.id} style={{padding:"16px 18px",fontSize:"13px",fontWeight:activeTab===tb.id?800:600,color:activeTab===tb.id?T.primary:T.textMid,background:"none",border:"none",borderBottom:activeTab===tb.id?`3px solid ${T.primary}`:"3px solid transparent",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",marginBottom:"-1px",display:"flex",alignItems:"center",gap:"6px"}}>
            <span>{tb.icon}</span><span>{tb.label}</span>
          </button>
        ))}
      </div>
    </div>

    <div style={{maxWidth:"1000px",margin:"0 auto",padding:"28px 20px 100px"}}>
      {activeTab==="info"&&(<div>
        {race.description&&<div style={{background:T.bgAlt,borderRadius:"16px",padding:"24px",marginBottom:"20px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",color:T.text,fontSize:"15px",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{race.description}</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"14px"}}>
          <div style={{background:T.bgAlt,borderRadius:"16px",padding:"22px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            <div style={{width:"44px",height:"44px",borderRadius:"12px",background:`${T.primary}15`,color:T.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",marginBottom:"14px"}}>📅</div>
            <div style={{color:T.textMid,fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"4px"}}>{lang==="el"?"Ημερομηνία":"Date"}</div>
            <div style={{color:T.text,fontSize:"16px",fontWeight:700}}>{race.date}</div>
          </div>
          <div style={{background:T.bgAlt,borderRadius:"16px",padding:"22px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            <div style={{width:"44px",height:"44px",borderRadius:"12px",background:`${T.accent}15`,color:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",marginBottom:"14px"}}>📍</div>
            <div style={{color:T.textMid,fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"4px"}}>{lang==="el"?"Τοποθεσία":"Location"}</div>
            <div style={{color:T.text,fontSize:"16px",fontWeight:700}}>{race.location||"—"}</div>
          </div>
          <div style={{background:T.bgAlt,borderRadius:"16px",padding:"22px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            <div style={{width:"44px",height:"44px",borderRadius:"12px",background:`${T.warning}15`,color:T.warning,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",marginBottom:"14px"}}>👥</div>
            <div style={{color:T.textMid,fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"4px"}}>{lang==="el"?"Εγγεγραμμένοι":"Registered"}</div>
            <div style={{color:T.text,fontSize:"16px",fontWeight:700}}>{totalRegs}{race.max_runners?` / ${race.max_runners}`:""}</div>
          </div>
        </div>
      </div>)}

      {activeTab==="routes"&&(<div>
        {distances.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>—</div>}
        <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
          {distances.map((d,i)=>{
            const pr=calculatePrice(race,d);
            const isMyDistance=myReg&&myReg.distance===d;
            const km=parseDistanceKm(d);
            const pricingEntry=(race.pricing||[]).find(p=>p.distance===d);
            const elevation=pricingEntry?.elevation;
            return <div key={i} style={{background:T.bgAlt,borderRadius:"18px",padding:"22px 24px",boxShadow:isMyDistance?`0 0 0 2px ${T.accent}, 0 4px 16px rgba(45,167,127,0.12)`:"0 2px 10px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:"18px",flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:"16px",flex:"1 1 280px",minWidth:0}}>
                <div style={{width:"56px",height:"56px",borderRadius:"16px",background:isMyDistance?T.accent:`${T.primary}15`,color:isMyDistance?"#fff":T.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",flexShrink:0}}>🏃</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:T.text,fontWeight:800,fontSize:"18px",marginBottom:"6px"}}>{d}</div>
                  <div style={{display:"flex",gap:"14px",flexWrap:"wrap",color:T.textMid,fontSize:"12px",fontWeight:600,alignItems:"center"}}>
                    {km>0&&<span>📏 {km}km</span>}
                    {elevation&&<span>⛰ +{elevation}m</span>}
                    {pr.base>0&&<span style={{color:isMyDistance?T.accent:T.primary,fontSize:"15px",fontWeight:800}}>{pr.isEarlyBird?pr.final.toFixed(2):pr.base}€{pr.isEarlyBird&&<span style={{textDecoration:"line-through",color:T.textLight,marginLeft:"6px",fontSize:"12px",fontWeight:500}}>{pr.base.toFixed(2)}€</span>}</span>}
                  </div>
                </div>
              </div>
              <button onClick={()=>{if(canRegister)onRegister(race);}} disabled={!canRegister} style={{background:isMyDistance?T.accent:(canRegister?T.primary:T.borderDark),color:"#fff",border:"none",borderRadius:"14px",padding:"14px 28px",fontSize:"14px",fontWeight:800,letterSpacing:"0.02em",cursor:canRegister?"pointer":"default",fontFamily:"inherit",boxShadow:canRegister?"0 4px 14px rgba(74,93,199,0.3)":"none",opacity:canRegister||isMyDistance?1:0.6,minWidth:"140px"}}>{isMyDistance?`✓ ${t.myDistance}`:(canRegister?(lang==="el"?"Εγγραφή →":"Register →"):(race.status==="finished"?t.statusFinished:"—"))}</button>
            </div>;
          })}
        </div>
      </div>)}

      {activeTab==="perks"&&(<div>
        {(race.perks||[]).length===0?(<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>—</div>):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:"14px"}}>
          {(race.perks||[]).map((p,i)=>{
            const translated=translatePerk(p,lang);
            const icon=getPerkIcon(translated);
            const label=getPerkLabel(translated);
            return <div key={i} style={{background:T.bgAlt,borderRadius:"16px",padding:"24px 18px",textAlign:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column",alignItems:"center",gap:"10px"}}>
              <div style={{width:"54px",height:"54px",borderRadius:"16px",background:`linear-gradient(135deg, ${T.accent}25, ${T.primary}25)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px"}}>{icon}</div>
              <div style={{color:T.text,fontSize:"13px",fontWeight:700,lineHeight:1.3}}>{label}</div>
            </div>;
          })}
        </div>)}
      </div>)}

      {activeTab==="results"&&(<div>
        {finishedRegs.length===0?(
          <div style={{background:T.bgAlt,borderRadius:"16px",padding:"60px 20px",textAlign:"center",color:T.textLight,fontSize:"14px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:"40px",marginBottom:"12px"}}>🏁</div>
            {t.resultsNoData}
          </div>
        ):(
          <div style={{background:T.bgAlt,borderRadius:"16px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            {finishedRegs.map((reg,i)=>{
              const r=runners.find(x=>x.id===reg.runner_id)||{};
              const rank=reg.overall_rank||(i+1);
              return <div key={reg.id} style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px 18px",borderTop:i?`1px solid ${T.border}`:"none"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"50%",background:rank===1?"#fbbf24":rank===2?"#94a3b8":rank===3?"#cd7f32":T.bg,color:rank<=3?"#fff":T.text,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"13px",flexShrink:0}}>{rank<=3?(rank===1?"🥇":rank===2?"🥈":"🥉"):rank}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:T.text,fontWeight:700,fontSize:"14px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.first_name} {r.last_name}</div>
                  <div style={{color:T.textLight,fontSize:"12px"}}>#{reg.bib_number}{reg.distance?` · ${reg.distance}`:""}</div>
                </div>
                <div style={{fontFamily:"monospace",fontWeight:800,color:T.text,fontSize:"14px"}}>{formatTime(reg.finish_time)}</div>
              </div>;
            })}
          </div>
        )}
      </div>)}
    </div>

    {canRegister&&distances.length>0&&activeTab!=="routes"&&(
      <div style={{position:"fixed",bottom:0,left:0,right:0,padding:"14px 20px",background:`linear-gradient(180deg, rgba(245,243,239,0) 0%, ${T.bg} 60%)`,zIndex:20}}>
        <div style={{maxWidth:"1000px",margin:"0 auto"}}>
          <button onClick={()=>onRegister(race)} style={{width:"100%",background:T.primary,color:"#fff",border:"none",borderRadius:"16px",padding:"16px 24px",fontSize:"15px",fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 6px 20px rgba(74,93,199,0.35), 0 2px 6px rgba(0,0,0,0.08)",letterSpacing:"0.02em"}}>{lang==="el"?"Εγγραφή στον Αγώνα →":"Register for Race →"}</button>
        </div>
      </div>
    )}
  </div>;
}

function AthleteDashboard({races,registrations,runners,profile,session,onRefresh}){
  const {t}=useLang();
  const [registerRace,setRegisterRace]=useState(null);
  const [selectedRace,setSelectedRace]=useState(null);
  const [tab,setTab]=useState("available");
  const myRunner=runners.find(r=>r.email===session.user.email);
  const myRegs=myRunner?registrations.filter(r=>r.runner_id===myRunner.id):[];
  const myRaceIds=myRegs.map(r=>r.race_id);
  const availableRaces=races.filter(r=>r.status==="upcoming");
  const myRaces=races.filter(r=>myRaceIds.includes(r.id));

  if(selectedRace){
    const currentRace=races.find(r=>r.id===selectedRace.id)||selectedRace;
    return <><RaceDetailsPage race={currentRace} registrations={registrations} runners={runners} profile={profile} session={session} onBack={()=>setSelectedRace(null)} onRegister={r=>setRegisterRace(r)}/>
      {registerRace&&<AthleteRegistrationForm race={registerRace} profile={profile} session={session} onClose={()=>setRegisterRace(null)} onSuccess={()=>{setRegisterRace(null);onRefresh();}}/>}
    </>;
  }

  return <div>
    <div style={{display:"flex",gap:"6px",marginBottom:"24px",flexWrap:"wrap"}}>
      <button onClick={()=>setTab("available")} style={{background:tab==="available"?T.primary:T.bgAlt,color:tab==="available"?"#fff":T.textMid,border:`1px solid ${tab==="available"?T.primary:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="available"?700:500,fontFamily:"inherit"}}>{t.availableRaces} ({availableRaces.length})</button>
      <button onClick={()=>setTab("my")} style={{background:tab==="my"?T.primary:T.bgAlt,color:tab==="my"?"#fff":T.textMid,border:`1px solid ${tab==="my"?T.primary:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="my"?700:500,fontFamily:"inherit"}}>{t.myRegs} ({myRaces.length})</button>
      <button onClick={()=>setTab("profile")} style={{background:tab==="profile"?T.primary:T.bgAlt,color:tab==="profile"?"#fff":T.textMid,border:`1px solid ${tab==="profile"?T.primary:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="profile"?700:500,fontFamily:"inherit"}}>{t.profileTab}</button>
    </div>
    {tab==="available"&&(<div>
      <h2 style={{margin:"0 0 18px",color:T.text,fontSize:"22px",fontWeight:900,letterSpacing:"-0.02em"}}>{t.availableRacesTitle}</h2>
      {availableRaces.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>{t.noAvailable}</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"18px"}}>{availableRaces.map(race=>(<AthleteRaceCard key={race.id} race={race} registrations={registrations} runners={runners} session={session} onSelect={setSelectedRace}/>))}</div>
    </div>)}
    {tab==="my"&&(<div>
      <h2 style={{margin:"0 0 18px",color:T.text,fontSize:"22px",fontWeight:900,letterSpacing:"-0.02em"}}>{t.myRegsTitle}</h2>
      {myRaces.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>{t.noRegs}</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"18px"}}>
        {myRaces.map(race=>(<AthleteRaceCard key={race.id} race={race} registrations={registrations} runners={runners} session={session} onSelect={setSelectedRace}/>))}
      </div>
    </div>)}
    {tab==="profile"&&(<AthleteProfile runners={runners} registrations={registrations} races={races} session={session} onRefresh={onRefresh}/>)}
    {registerRace&&<AthleteRegistrationForm race={registerRace} profile={profile} session={session} onClose={()=>setRegisterRace(null)} onSuccess={()=>{setRegisterRace(null);onRefresh();}}/>}
  </div>;
}

function OrganizerRaces({races,setRaces,runners,registrations,session,profile}){
  const {t,lang}=useLang();
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState(null);
  const [uploadingBanner,setUploadingBanner]=useState(false);
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({name:"",date:"",location:"",distances:[],max_runners:"",description:"",pricing:[],perks:[],early_bird:null,custom_fields:[],banner_url:"",public_runners_list:false});

  async function uploadBanner(e){
    const file=e.target.files?.[0];
    if(!file)return;
    setUploadingBanner(true);
    const ext=file.name.split(".").pop();
    const path=`race-${Date.now()}.${ext}`;
    const {error:upErr}=await supabase.storage.from("race-banners").upload(path,file,{upsert:true});
    if(upErr){alert("⚠️ "+upErr.message);setUploadingBanner(false);return;}
    const {data:{publicUrl}}=supabase.storage.from("race-banners").getPublicUrl(path);
    setForm(f=>({...f,banner_url:publicUrl}));
    setUploadingBanner(false);
  }

  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);
  function resetForm(){setEditId(null);setForm({name:"",date:"",location:"",distances:[],max_runners:"",description:"",pricing:[],perks:[],early_bird:null,custom_fields:[],banner_url:"",public_runners_list:false});}
  function openEdit(race){setEditId(race.id);setForm({name:race.name||"",date:race.date||"",location:race.location||"",distances:race.distance?race.distance.split(" | "):[],max_runners:race.max_runners?String(race.max_runners):"",description:race.description||"",pricing:race.pricing||[],perks:race.perks||[],early_bird:race.early_bird||null,custom_fields:race.custom_fields||[],banner_url:race.banner_url||"",public_runners_list:!!race.public_runners_list});setShowForm(true);}

  async function save(){
    if(!form.name||!form.date){alert(t.fillNameDate);return;}
    if(form.distances.length===0){alert(t.addDistance);return;}
    setLoading(true);
    const validPricing=form.pricing.filter(p=>form.distances.includes(p.distance));
    const payload={name:form.name,date:form.date,location:form.location,distance:form.distances.join(" | "),description:form.description,max_runners:form.max_runners?parseInt(form.max_runners):null,pricing:validPricing,perks:form.perks,early_bird:form.early_bird,custom_fields:form.custom_fields,banner_url:form.banner_url||null,public_runners_list:!!form.public_runners_list};
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

  async function exportExcel(race){
    const regs=registrations.filter(r=>r.race_id===race.id);
    if(!regs.length){alert(t.noRegsCsv);return;}
    const data=regs.map((reg,i)=>{
      const r=runners.find(x=>x.id===reg.runner_id)||{};
      return {"Α/Α":i+1,"BIB":reg.bib_number,"Όνομα":r.first_name||"","Επώνυμο":r.last_name||"","Email":r.email||"","Τηλέφωνο":r.phone||"","Διαδρομή":reg.distance||"","Κατηγορία":reg.category||"","T-Shirt":reg.tshirt||"","Τιμή":reg.price_paid||0};
    });
    if(!window.XLSX){
      await new Promise((res,rej)=>{const sc=document.createElement("script");sc.src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";sc.onload=res;sc.onerror=rej;document.head.appendChild(sc);});
    }
    const XLSX=window.XLSX;
    const ws=XLSX.utils.json_to_sheet(data);
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Εγγραφές");
    XLSX.writeFile(wb,`${race.name.replace(/\s+/g,"-")}.xlsx`);
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
          <div style={{color:T.textMid,fontSize:"13px",lineHeight:"1.8",marginBottom:"10px"}}>📅 {race.date} &nbsp; 📍 {race.location||"—"} &nbsp; 👤 {regCount} {t.registered}{totalRevenue>0&&<> &nbsp; 💰 {totalRevenue.toFixed(2)}€</>}</div>
          {distances.length>0&&(<div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"8px"}}>{distances.map((d,i)=>{const pr=(race.pricing||[]).find(p=>p.distance===d);return <span key={i} style={{background:`${T.primary}12`,border:`1px solid ${T.primary}33`,borderRadius:"6px",padding:"3px 10px",fontSize:"12px",color:T.primary,fontWeight:500}}>🏃 {d}{pr?.price>0?` · ${pr.price}€`:""}</span>;})}</div>)}
          {(race.perks||[]).length>0&&(<div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>{race.perks.map((p,i)=>(<span key={i} style={{background:`${T.accent}12`,border:`1px solid ${T.accent}33`,borderRadius:"6px",padding:"3px 10px",fontSize:"12px",color:T.accent}}>{translatePerk(p,lang)}</span>))}</div>)}
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <Btn sm v="ghost" onClick={()=>toggleStatus(race)}>{t.statusBtn}</Btn>
            <Btn sm v="sec" onClick={()=>openEdit(race)}>{t.editBtn}</Btn>
            <Btn sm v="grn" onClick={()=>exportExcel(race)}>{t.excelBtn}</Btn>
            <Btn sm v="red" onClick={()=>del(race.id)}>{t.deleteBtn}</Btn>
          </div>
        </div>;
      })}
    </div>
    {showForm&&<Modal title={editId?t.editRaceTitle:t.newRaceTitle} onClose={()=>{setShowForm(false);resetForm();}} wide>
      <In label={t.raceName} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <div style={{marginBottom:"14px"}}>
        <label style={css.label}>{t.bannerLabel}</label>
        <div style={{display:"flex",gap:"10px",alignItems:"center",marginTop:"6px"}}>
          {form.banner_url?(
            <div style={{position:"relative",flex:1}}>
              <img src={form.banner_url} alt="" style={{width:"100%",maxHeight:"120px",objectFit:"cover",borderRadius:"8px",border:`1px solid ${T.border}`}}/>
              <button type="button" onClick={()=>setForm({...form,banner_url:""})} style={{position:"absolute",top:"6px",right:"6px",background:T.danger,color:"#fff",border:"none",borderRadius:"6px",padding:"4px 10px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>{t.bannerRemove}</button>
            </div>
          ):(
            <label style={{flex:1,background:T.bg,border:`2px dashed ${T.border}`,borderRadius:"8px",padding:"20px",textAlign:"center",cursor:"pointer",color:T.textMid,fontSize:"13px"}}>
              {uploadingBanner?t.bannerUploading:t.bannerUpload}
              <input type="file" accept="image/*" onChange={uploadBanner} style={{display:"none"}} disabled={uploadingBanner}/>
            </label>
          )}
        </div>
      </div>
      <div style={{marginBottom:"14px",background:T.bg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"12px 16px"}}>
        <label style={{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer"}}>
          <input type="checkbox" checked={!!form.public_runners_list} onChange={e=>setForm({...form,public_runners_list:e.target.checked})} style={{width:"18px",height:"18px",cursor:"pointer"}}/>
          <div>
            <div style={{color:T.text,fontWeight:600,fontSize:"13px"}}>{t.publicRunnersToggle}</div>
            <div style={{color:T.textLight,fontSize:"11px"}}>{t.publicRunnersHint}</div>
          </div>
        </label>
      </div>
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
  async function togglePayment(reg){
    const newStatus=reg.payment_status==="paid"?"pending":"paid";
    const {error}=await supabase.from("registrations").update({payment_status:newStatus}).eq("id",reg.id);
    if(error){alert("Σφάλμα: "+error.message);return;}
    window.location.reload();
  }
  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);
  const myRaceIds=myRaces.map(r=>r.id);
  const filtered=registrations.filter(r=>myRaceIds.includes(r.race_id)).filter(r=>filterRace==="all"||r.race_id===filterRace);
  const totalRevenue=filtered.reduce((sum,r)=>sum+(parseFloat(r.price_paid)||0),0);
  return <div>
    <h2 style={{margin:"0 0 20px",color:T.text,fontSize:"20px"}}>{t.regsTitle} ({filtered.length}){totalRevenue>0&&<span style={{color:T.accent,fontSize:"15px",marginLeft:"12px"}}>💰 {totalRevenue.toFixed(2)}€</span>}</h2>
    <Sel value={filterRace} onChange={e=>setFilterRace(e.target.value)}><option value="all">{t.allRaces}</option>{myRaces.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</Sel>
    {filtered.length===0&&<div style={{textAlign:"center",color:T.textLight,padding:"60px",fontSize:"14px"}}>{t.noRegsList}</div>}
    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {filtered.map(reg=>{
        const runner=runners.find(r=>r.id===reg.runner_id);const race=races.find(r=>r.id===reg.race_id);
        if(!runner||!race)return null;
        return <div key={reg.id} style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"14px 18px",display:"flex",alignItems:"center",gap:"12px",boxShadow:T.shadow,flexWrap:"wrap"}}>
          <div style={{background:T.primary,color:"#fff",borderRadius:"8px",padding:"4px 10px",fontWeight:700,fontSize:"16px"}}>#{reg.bib_number}</div>
          <div style={{flex:1,minWidth:"200px"}}>
            <div style={{color:T.text,fontWeight:700,fontSize:"14px",display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
              {runner.first_name} {runner.last_name}
              {reg.price_paid>0&&<span style={{color:T.accent,fontSize:"12px",fontWeight:600}}>💰 {parseFloat(reg.price_paid).toFixed(2)}€</span>}
              <span onClick={()=>togglePayment(reg)} style={{cursor:"pointer",background:reg.payment_status==="paid"?`${T.accent}20`:`${T.warning}20`,color:reg.payment_status==="paid"?T.accent:T.warning,border:`1px solid ${reg.payment_status==="paid"?T.accent:T.warning}55`,borderRadius:"99px",padding:"2px 10px",fontSize:"11px",fontWeight:700}}>{reg.payment_status==="paid"?t.paymentPaid:t.paymentPending}</span>
            </div>
            <div style={{color:T.textMid,fontSize:"12px"}}>{race.name}{reg.distance?` · 🏃 ${reg.distance}`:""} · {reg.category} · {reg.tshirt}</div>
            <div style={{color:T.textLight,fontSize:"12px"}}>{runner.email}{runner.phone?` · ${runner.phone}`:""}</div>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

function OrganizerStats({races,registrations,session,profile}){
  const {t}=useLang();
  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);
  const myRaceIds=myRaces.map(r=>r.id);
  const myRegs=registrations.filter(r=>myRaceIds.includes(r.race_id));
  const totalRaces=myRaces.length;
  const totalRegs=myRegs.length;
  const totalRevenue=myRegs.reduce((sum,r)=>sum+(parseFloat(r.price_paid)||0),0);
  const paidRegs=myRegs.filter(r=>r.payment_status==="paid").length;
  const pendingRegs=myRegs.filter(r=>r.payment_status!=="paid").length;
  const avgPerRace=totalRaces>0?(totalRegs/totalRaces).toFixed(1):"0";
  const racesData=myRaces.map(r=>{const regs=myRegs.filter(reg=>reg.race_id===r.id);const revenue=regs.reduce((sum,reg)=>sum+(parseFloat(reg.price_paid)||0),0);return{...r,regCount:regs.length,revenue};}).sort((a,b)=>b.regCount-a.regCount);
  const maxRegCount=racesData.length>0?Math.max(...racesData.map(r=>r.regCount||0),1):1;
  return <div>
    <h2 style={{margin:"0 0 20px",color:T.text,fontSize:"20px"}}>{t.statsTitle}</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:"12px",marginBottom:"24px"}}>
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"18px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"28px",fontWeight:900,color:T.primary}}>{totalRaces}</div>
        <div style={{fontSize:"11px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"4px"}}>{t.statsTotalRaces}</div>
      </div>
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"18px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"28px",fontWeight:900,color:T.accent}}>{totalRegs}</div>
        <div style={{fontSize:"11px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"4px"}}>{t.statsTotalRegs}</div>
      </div>
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"18px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"24px",fontWeight:900,color:T.warning}}>{totalRevenue.toFixed(2)}€</div>
        <div style={{fontSize:"11px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"4px"}}>{t.statsTotalRevenue}</div>
      </div>
      <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"18px",textAlign:"center",boxShadow:T.shadow}}>
        <div style={{fontSize:"28px",fontWeight:900,color:T.text}}>{avgPerRace}</div>
        <div style={{fontSize:"11px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"4px"}}>{t.statsAvgPerRace}</div>
      </div>
    </div>
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px",marginBottom:"20px",boxShadow:T.shadow}}>
      <h3 style={{margin:"0 0 14px",color:T.text,fontSize:"15px"}}>💳 {t.paymentStatus}</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
        <div style={{background:`${T.accent}10`,border:`1px solid ${T.accent}44`,borderRadius:"10px",padding:"14px"}}>
          <div style={{fontSize:"22px",fontWeight:900,color:T.accent}}>{paidRegs}</div>
          <div style={{fontSize:"12px",color:T.textMid}}>{t.paymentPaid}</div>
        </div>
        <div style={{background:`${T.warning}10`,border:`1px solid ${T.warning}44`,borderRadius:"10px",padding:"14px"}}>
          <div style={{fontSize:"22px",fontWeight:900,color:T.warning}}>{pendingRegs}</div>
          <div style={{fontSize:"12px",color:T.textMid}}>{t.paymentPending}</div>
        </div>
      </div>
    </div>
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px",boxShadow:T.shadow}}>
      <h3 style={{margin:"0 0 14px",color:T.text,fontSize:"15px"}}>📊 {t.statsRegsPerRace}</h3>
      {racesData.length===0?(<div style={{color:T.textLight,fontSize:"13px",textAlign:"center",padding:"20px"}}>{t.statsNoData}</div>):(
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {racesData.map(r=>(
            <div key={r.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px",flexWrap:"wrap",gap:"6px"}}>
                <span style={{color:T.text,fontSize:"13px",fontWeight:600}}>{r.name}</span>
                <span style={{color:T.textMid,fontSize:"12px"}}>{r.regCount} · 💰 {r.revenue.toFixed(2)}€</span>
              </div>
              <div style={{background:T.bg,height:"10px",borderRadius:"99px",overflow:"hidden"}}>
                <div style={{background:`linear-gradient(90deg, ${T.primary} 0%, ${T.accent} 100%)`,height:"100%",width:`${(r.regCount/maxRegCount)*100}%`}}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>;
}

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

  if(!session)return <PublicHomePage/>;
  if(loading)return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.primary,fontFamily:"Inter,sans-serif"}}>{t.loading}</div>;

  const isAthlete=profile?.role==="athlete";
  const isOrganizer=(profile?.role==="organizer"||profile?.role==="admin")&&profile?.status==="approved";
  const isPendingOrganizer=profile?.role==="organizer"&&profile?.status==="pending";
  const isRejectedOrganizer=profile?.role==="organizer"&&profile?.status==="rejected";
  const isAdmin=profile?.role==="admin";

  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Inter,sans-serif"}}>
    <div style={{borderBottom:`1px solid ${T.border}`,padding:"16px 24px",background:T.bgAlt,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        <img src="/11085.png" alt="Race Management" style={{width:"40px",height:"40px",borderRadius:"50%",objectFit:"cover"}}/>
        <div><div style={{color:T.text,fontWeight:700,fontSize:"16px"}}>{t.appName}</div><div style={{color:T.textLight,fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase"}}>{isAthlete?t.athletePanel:t.adminPanel}</div></div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
        <LangToggle/>
        <span style={{color:T.textMid,fontSize:"13px"}}>{profile?.full_name||session.user.email}</span>
        {profile?.role==="admin"&&<span style={{background:`${T.warning}15`,color:T.warning,border:`1px solid ${T.warning}44`,borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700}}>{t.badgeAdmin}</span>}
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
      <div style={{display:"flex",gap:"4px",padding:"12px 24px",borderBottom:`1px solid ${T.border}`,background:T.bgAlt,flexWrap:"wrap"}}>
        {[{id:"races",label:t.tabRaces},{id:"regs",label:t.tabRegs},{id:"stats",label:t.statsTab},...(isAdmin?[{id:"admin",label:t.tabAdmin}]:[])].map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{background:tab===tb.id?T.primary:"none",color:tab===tb.id?"#fff":T.textMid,border:"none",borderRadius:"8px",padding:"8px 16px",cursor:"pointer",fontSize:"13px",fontWeight:tab===tb.id?700:500,fontFamily:"inherit"}}>{tb.label}</button>
        ))}
      </div>
      <div style={{padding:"28px",maxWidth:"960px",margin:"0 auto"}}>
        {tab==="races"&&<OrganizerRaces races={races} setRaces={setRaces} runners={runners} registrations={registrations} session={session} profile={profile}/>}
        {tab==="regs"&&<OrganizerRegistrations races={races} runners={runners} registrations={registrations} session={session} profile={profile}/>}
        {tab==="stats"&&<OrganizerStats races={races} registrations={registrations} session={session} profile={profile}/>}
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
