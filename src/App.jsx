import { useState, useEffect, useRef, createContext, useContext } from "react";

// Global keyframe injection for skeleton animation
if (typeof document !== "undefined" && !document.getElementById("rm-global-styles")) {
  const s = document.createElement("style");
  s.id = "rm-global-styles";
  s.innerHTML = `
    @keyframes skeletonPulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pageEnter {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pageEnterFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .page-transition {
      animation: pageEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .fade-in {
      animation: pageEnterFade 0.4s ease-out;
    }
    /* Dark mode via CSS filter trick */
    html.dark-mode {
      filter: invert(1) hue-rotate(180deg);
      background: #1a1a1a;
    }
    html.dark-mode img,
    html.dark-mode video,
    html.dark-mode [data-no-invert] {
      filter: invert(1) hue-rotate(180deg);
    }
    /* Smooth transition when toggling */
    html {
      transition: filter 0.3s ease, background 0.3s ease;
    }
    @keyframes tickerScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    /* Greek typography - uppercase without accents */
    .uppercase-greek {
      text-transform: uppercase;
      font-variant-caps: all-petite-caps;
    }
    .uppercase-no-accent {
      text-transform: uppercase;
    }
    /* Smoother button hovers */
    button {
      transition: transform 0.15s ease, opacity 0.15s ease, background 0.15s ease;
    }
    /* Enhanced button hover effects */
    .btn-enhanced:not(:disabled):hover {
      transform: translateY(-2px);
      filter: brightness(1.05);
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    }
    .btn-enhanced:not(:disabled):active {
      transform: translateY(0);
      filter: brightness(0.97);
    }
    .btn-enhanced:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  `;
  if (document.head) document.head.appendChild(s);
  else document.addEventListener("DOMContentLoaded", () => document.head.appendChild(s));
}
import { createClient } from "@supabase/supabase-js";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
    changeRole:"🔙 Αλλαγή ρόλου", signupBtn:"✨ Εγγραφή ως", loginBtn:"🔑 Σύνδεση",
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
    publicLoginToReg:"Συνδεθείτε για εγγραφή", backToRaces:"🏠 Αρχική",
    importResultsBtn:"📥 Import Αποτελεσμάτων", importResultsTitle:"Εισαγωγή Αποτελεσμάτων από CSV",
    importResultsDesc:"Το CSV πρέπει να έχει στήλες: bib_number, finish_time.",
    importResultsBtn2:"⬆️ Επιλογή Αρχείου CSV", importResultsProcessing:"Επεξεργασία...",
    importResultsDone:"✅ Ενημερώθηκαν %N αποτελέσματα!", importResultsErr:"❌ Σφάλμα στο αρχείο.",
    viewResultsBtn:"🏆 Αποτελέσματα", resultsPageTitle:"Αποτελέσματα Αγώνα",
    resultsNoData:"Δεν υπάρχουν αποτελέσματα ακόμα", resultsRank:"Θέση", resultsBib:"BIB",
    resultsName:"Αθλητής", resultsTime:"Χρόνος", resultsClub:"Σύλλογος", resultsCat:"Κατηγορία",
    backToHome:"🏠 Αρχική",
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
    resetPasswordCancel:"🔙 Επιστροφή στη Σύνδεση", profileInfo:"📋 Στοιχεία μου", profileStats:"🏆 Στατιστικά",
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
    changeRole:"🔙 Change role", signupBtn:"✨ Sign up as", loginBtn:"🔑 Log In",
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
    publicLoginToReg:"Log in to register", backToRaces:"🏠 Home",
    importResultsBtn:"📥 Import", importResultsTitle:"Import CSV",
    importResultsDesc:"CSV columns required.",
    importResultsBtn2:"⬆️ Choose CSV", importResultsProcessing:"Processing...",
    importResultsDone:"✅ %N updated!", importResultsErr:"❌ Error.",
    viewResultsBtn:"🏆 Results", resultsPageTitle:"Results",
    resultsNoData:"No results", resultsRank:"Rank", resultsBib:"BIB",
    resultsName:"Athlete", resultsTime:"Time", resultsClub:"Club", resultsCat:"Category",
    backToHome:"🏠 Home",
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
    resetPasswordCancel:"🔙 Back", profileInfo:"📋 Info", profileStats:"🏆 Stats",
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
    pri:{background:`linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,color:"#fff",fontWeight:700,boxShadow:`0 2px 8px ${T.primary}33`},
    sec:{background:T.bgAlt,color:T.text,border:`1px solid ${T.border}`},
    red:{background:"#fce8e8",color:T.danger,border:`1px solid ${T.danger}33`,fontWeight:600},
    grn:{background:"#e1f3ec",color:T.accent,border:`1px solid ${T.accent}44`,fontWeight:600},
    ghost:{background:"transparent",color:T.textMid,border:`1px solid ${T.border}`}
  };
  return <button {...p} className={`btn-enhanced ${p.className||""}`} style={{borderRadius:"10px",border:"none",cursor:"pointer",padding:sm?"7px 14px":"11px 22px",fontSize:sm?"12px":"13px",fontFamily:"inherit",letterSpacing:"0.01em",transition:"all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",...vs[v],...p.style}}>{children}</button>;
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

function getDaysUntilRace(date){
  if(!date)return null;
  try{
    const raceDate=new Date(date);
    raceDate.setHours(23,59,59,999);
    const now=new Date();
    const diffMs=raceDate-now;
    return Math.ceil(diffMs/(1000*60*60*24));
  }catch(e){return null;}
}

function RaceCountdown({date,compact,lang}){
  const days=getDaysUntilRace(date);
  if(days===null)return null;
  const isMobile=compact;
  if(days<0)return <span style={{background:"rgba(107,114,128,0.92)",color:"#fff",padding:isMobile?"3px 9px":"5px 11px",borderRadius:"999px",fontSize:isMobile?"10px":"11px",fontWeight:800,letterSpacing:"0.04em",display:"inline-flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap"}}>🏁 {lang==="el"?"Ολοκληρώθηκε":"Completed"}</span>;
  let bg,emoji;
  if(days>30){bg="rgba(16,185,129,0.92)";emoji="⏳";}
  else if(days>=7){bg="rgba(217,119,6,0.92)";emoji="⏰";}
  else{bg="rgba(220,38,38,0.92)";emoji="🔥";}
  const label=days===0?(lang==="el"?"Σήμερα!":"Today!"):days===1?(lang==="el"?"Αύριο!":"Tomorrow!"):lang==="el"?`${days} ημέρες`:`${days} days`;
  return <span style={{background:bg,color:"#fff",padding:isMobile?"3px 9px":"5px 11px",borderRadius:"999px",fontSize:isMobile?"10px":"11px",fontWeight:800,letterSpacing:"0.04em",display:"inline-flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap"}}>{emoji} {label}</span>;
}

function Skeleton({width,height,radius,style}){
  return <div style={{background:"linear-gradient(90deg, #e8e6df 0%, #f0eee7 50%, #e8e6df 100%)",backgroundSize:"200% 100%",animation:"skeletonPulse 1.4s ease-in-out infinite",width:width||"100%",height:height||"16px",borderRadius:radius||"6px",...style}}/>;
}

function SkeletonCard(){
  return <div style={{background:T.bgAlt,borderRadius:"20px",overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)"}}>
    <Skeleton height="200px" radius="0"/>
    <div style={{padding:"18px 22px 20px"}}>
      <Skeleton height="22px" width="70%" style={{marginBottom:"12px"}}/>
      <Skeleton height="14px" width="50%" style={{marginBottom:"16px"}}/>
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
        <Skeleton height="22px" width="60px" radius="8px"/>
        <Skeleton height="22px" width="60px" radius="8px"/>
        <Skeleton height="22px" width="60px" radius="8px"/>
      </div>
    </div>
  </div>;
}

function SkeletonGrid({count}){
  return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"18px"}}>
    {Array.from({length:count||3}).map((_,i)=><SkeletonCard key={i}/>)}
  </div>;
}

function EmptyState({icon,title,message,action,actionLabel,onAction}){
  return <div style={{textAlign:"center",padding:"60px 24px",background:T.bgAlt,borderRadius:"16px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
    <div style={{fontSize:"56px",marginBottom:"14px",opacity:0.9}}>{icon||"📭"}</div>
    <h3 style={{margin:"0 0 6px",color:T.text,fontSize:"17px",fontWeight:800,letterSpacing:"-0.01em"}}>{title}</h3>
    {message&&<p style={{margin:"0 0 18px",color:T.textMid,fontSize:"14px",lineHeight:1.6,maxWidth:"360px",marginLeft:"auto",marginRight:"auto"}}>{message}</p>}
    {action&&actionLabel&&<button onClick={onAction} style={{background:T.primary,color:"#fff",border:"none",borderRadius:"10px",padding:"10px 22px",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(74,93,199,0.2)"}}>{actionLabel}</button>}
  </div>;
}

async function sendEmail(to,subject,html){
  try{
    const {data:{session}}=await supabase.auth.getSession();
    const url=`${SUPABASE_URL}/functions/v1/rapid-api`;
    const res=await fetch(url,{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${session?.access_token||SUPABASE_KEY}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({to,subject,html})
    });
    if(!res.ok){console.error("Email send failed:",await res.text());return false;}
    return true;
  }catch(err){console.error("Email error:",err);return false;}
}

function emailTemplate(title,bodyHtml){
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:30px 20px;">
      <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">
        <div style="background:linear-gradient(135deg,#4a5dc7 0%,#3a4ba8 100%);padding:32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;letter-spacing:-0.02em;">🏃 Race Management</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:13px;">racemanagement.gr</p>
        </div>
        <div style="padding:32px 28px;">
          <h2 style="margin:0 0 20px;color:#1a1a1a;font-size:22px;font-weight:700;line-height:1.3;">${title}</h2>
          <div style="color:#444;font-size:15px;line-height:1.6;">${bodyHtml}</div>
        </div>
        <div style="background:#f9f9fb;padding:20px 28px;border-top:1px solid #eee;text-align:center;color:#888;font-size:12px;">
          <p style="margin:0 0 6px;">© ${new Date().getFullYear()} ΜΗΤΡΟΠΕΤΡΟΣ ΕΛΕΥΘΕΡΙΟΣ · ΑΦΜ 105127494</p>
          <p style="margin:0;">📞 693 6960328 · ✉️ <a href="mailto:leyterhs.mhtropetros1986@gmail.com" style="color:#4a5dc7;text-decoration:none;">leyterhs.mhtropetros1986@gmail.com</a></p>
        </div>
      </div>
    </div>
  </body></html>`;
}

function toast(message,type){
  if(typeof window==="undefined")return;
  const detail={message:String(message||""),type:type||autoToastType(message)};
  window.dispatchEvent(new CustomEvent("app-toast",{detail}));
}

function autoToastType(msg){
  if(!msg)return"info";
  const s=String(msg).toLowerCase();
  if(s.includes("✅")||s.includes("επιτυχ")||s.includes("success")||s.includes("ολοκληρ"))return"success";
  if(s.includes("σφάλμα")||s.includes("error")||s.includes("❌"))return"error";
  if(s.includes("⚠")||s.includes("συμπληρ")||s.includes("warn")||s.includes("μη έγκυρ")||s.includes("invalid"))return"warning";
  return"info";
}

function ToastItem({message,type,onClose}){
  const colors={
    success:{bg:"#dcfce7",border:"#10b981",color:"#15803d",icon:"✅"},
    error:{bg:"#fee2e2",border:"#ef4444",color:"#b91c1c",icon:"❌"},
    warning:{bg:"#fef3c7",border:"#d97706",color:"#92400e",icon:"⚠️"},
    info:{bg:"#dbeafe",border:"#3b82f6",color:"#1e40af",icon:"ℹ️"}
  };
  const c=colors[type]||colors.info;
  // Strip leading icon from message if it matches the type icon
  let cleanMsg=String(message||"");
  if(cleanMsg.startsWith(c.icon))cleanMsg=cleanMsg.slice(c.icon.length).trim();
  return <div onClick={onClose} style={{background:c.bg,borderLeft:`4px solid ${c.border}`,color:c.color,padding:"14px 18px",borderRadius:"10px",cursor:"pointer",boxShadow:"0 10px 30px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.05)",fontSize:"14px",fontWeight:600,maxWidth:"420px",minWidth:"260px",display:"flex",alignItems:"flex-start",gap:"10px",animation:"fadeInUp 0.25s ease-out",whiteSpace:"pre-line",lineHeight:1.5,pointerEvents:"auto"}}>
    <span style={{fontSize:"20px",flexShrink:0,lineHeight:1}}>{c.icon}</span>
    <span style={{flex:1,minWidth:0,wordBreak:"break-word"}}>{cleanMsg}</span>
    <span style={{opacity:0.5,fontSize:"16px",lineHeight:1,marginLeft:"4px"}}>×</span>
  </div>;
}

function ToastContainer(){
  const [toasts,setToasts]=useState([]);
  useEffect(()=>{
    function handler(e){
      const id=Date.now()+Math.random();
      const t={...e.detail,id};
      setToasts(prev=>[...prev,t]);
      const ttl=t.type==="error"?7000:t.type==="success"?5000:4500;
      setTimeout(()=>{
        setToasts(prev=>prev.filter(x=>x.id!==id));
      },ttl);
    }
    window.addEventListener("app-toast",handler);
    return()=>window.removeEventListener("app-toast",handler);
  },[]);
  if(toasts.length===0)return null;
  return <div style={{position:"fixed",bottom:"20px",right:"20px",zIndex:9999,display:"flex",flexDirection:"column",gap:"10px",maxWidth:"calc(100vw - 40px)",pointerEvents:"none"}}>
    {toasts.map(t=><ToastItem key={t.id} message={t.message} type={t.type} onClose={()=>setToasts(prev=>prev.filter(x=>x.id!==t.id))}/>)}
  </div>;
}

function DarkModeToggle(){
  const [dark,setDark]=useState(()=>{
    if(typeof window==="undefined")return false;
    return localStorage.getItem("rm-dark-mode")==="1";
  });
  useEffect(()=>{
    if(typeof document==="undefined")return;
    if(dark){
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("rm-dark-mode","1");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("rm-dark-mode","0");
    }
  },[dark]);
  return <button onClick={()=>setDark(d=>!d)} title={dark?"Light mode":"Dark mode"} style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"8px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:"16px",lineHeight:1,minWidth:"40px",height:"36px",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>{dark?"☀️":"🌙"}</button>;
}

function validateGreekPhone(phone){
  if(!phone)return{valid:true,clean:""}; // Optional in most cases
  const clean=String(phone).replace(/[\s\-\(\)]/g,"");
  // Greek mobile: starts with 69, 10 digits total. Or +30 69...
  // Greek landline: 10 digits starting with 2
  // International with +30
  if(/^\+30\d{10}$/.test(clean))return{valid:true,clean};
  if(/^00306\d{9}$/.test(clean))return{valid:true,clean};
  if(/^6\d{9}$/.test(clean))return{valid:true,clean}; // Mobile 6XXXXXXXXX (10 digits)
  if(/^2\d{9}$/.test(clean))return{valid:true,clean}; // Landline 2XXXXXXXXX (10 digits)
  return{valid:false,clean,error:"Μη έγκυρος αριθμός. Σωστό format: 69ΧΧΧΧΧΧΧΧ ή 21ΧΧΧΧΧΧΧΧ"};
}

function validateAMKA(amka){
  if(!amka)return{valid:true,clean:""}; // Optional
  const clean=String(amka).replace(/\D/g,"");
  if(clean.length!==11)return{valid:false,clean,error:"Το ΑΜΚΑ πρέπει να είναι 11 ψηφία"};
  // First 6 digits = birth date DDMMYY
  const day=parseInt(clean.substring(0,2));
  const month=parseInt(clean.substring(2,4));
  if(day<1||day>31||month<1||month>12)return{valid:false,clean,error:"Μη έγκυρο ΑΜΚΑ - λάθος ημερομηνία γέννησης"};
  return{valid:true,clean};
}

function generateCalendarLinks(race){
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

function AddToCalendarMenu({race,onClose}){
  const {lang}=useLang();
  const links=generateCalendarLinks(race);
  if(!links)return null;
  function downloadICS(){
    const blob=new Blob([links.ics],{type:"text/calendar"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=`${race.name.replace(/\s+/g,"-")}.ics`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    onClose();
  }
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:T.bgAlt,borderRadius:"20px",padding:"24px",width:"100%",maxWidth:"380px",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
        <h3 style={{margin:0,color:T.text,fontSize:"17px",fontWeight:800}}>📅 {lang==="el"?"Προσθήκη στο Ημερολόγιο":"Add to Calendar"}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",color:T.textLight,cursor:"pointer",fontSize:"24px"}}>×</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
        <a href={links.google} target="_blank" rel="noopener noreferrer" onClick={onClose} style={{display:"flex",alignItems:"center",gap:"12px",background:T.bg,padding:"14px 16px",borderRadius:"12px",textDecoration:"none",color:T.text,fontWeight:700,fontSize:"14px"}}>
          <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"#4285f4",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>G</div>
          <span>Google Calendar</span>
        </a>
        <a href={links.outlook} target="_blank" rel="noopener noreferrer" onClick={onClose} style={{display:"flex",alignItems:"center",gap:"12px",background:T.bg,padding:"14px 16px",borderRadius:"12px",textDecoration:"none",color:T.text,fontWeight:700,fontSize:"14px"}}>
          <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"#0078d4",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>O</div>
          <span>Outlook Calendar</span>
        </a>
        <button onClick={downloadICS} style={{display:"flex",alignItems:"center",gap:"12px",background:T.bg,padding:"14px 16px",borderRadius:"12px",border:"none",cursor:"pointer",fontFamily:"inherit",color:T.text,fontWeight:700,fontSize:"14px",width:"100%",textAlign:"left"}}>
          <div style={{width:"36px",height:"36px",borderRadius:"50%",background:T.text,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>📅</div>
          <span>{lang==="el"?"Apple Calendar / .ics":"Apple Calendar / .ics"}</span>
        </button>
      </div>
    </div>
  </div>;
}

function RecentRegistrationsTicker(){
  const {lang}=useLang();
  const [items,setItems]=useState([]);
  useEffect(()=>{
    (async()=>{
      // Get recent registrations across all races
      const {data}=await supabase
        .from("registrations")
        .select("id,bib_number,distance,created_at,race_id,runner_id")
        .order("created_at",{ascending:false})
        .limit(8);
      if(!data||data.length===0)return;
      const runnerIds=[...new Set(data.map(r=>r.runner_id))];
      const raceIds=[...new Set(data.map(r=>r.race_id))];
      const [{data:runners},{data:races}]=await Promise.all([
        supabase.from("runners").select("id,first_name,last_name").in("id",runnerIds),
        supabase.from("races").select("id,name").in("id",raceIds)
      ]);
      const enriched=data.map(reg=>{
        const r=(runners||[]).find(x=>x.id===reg.runner_id);
        const race=(races||[]).find(x=>x.id===reg.race_id);
        if(!r||!race)return null;
        return{...reg,name:`${r.first_name||""} ${(r.last_name||"").charAt(0)}.`.trim(),raceName:race.name};
      }).filter(Boolean);
      setItems(enriched);
    })();
  },[]);
  if(items.length===0)return null;
  return <div style={{background:`linear-gradient(90deg, ${T.primary}10, ${T.accent}10)`,border:`1px solid ${T.primary}22`,borderRadius:"12px",padding:"10px 16px",marginBottom:"20px",overflow:"hidden",position:"relative"}}>
    <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
      <div style={{flexShrink:0,background:T.primary,color:"#fff",fontSize:"11px",fontWeight:800,padding:"3px 10px",borderRadius:"999px",letterSpacing:"0.04em"}}>🔔 LIVE</div>
      <div style={{flex:1,overflow:"hidden",whiteSpace:"nowrap",position:"relative",maskImage:"linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",WebkitMaskImage:"linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)"}}>
        <div style={{display:"inline-block",animation:"tickerScroll 40s linear infinite",paddingLeft:"100%"}}>
          {[...items,...items].map((reg,i)=>(
            <span key={i} style={{display:"inline-block",marginRight:"40px",color:T.text,fontSize:"13px",fontWeight:600}}>
              <span style={{color:T.accent}}>✅</span> {lang==="el"?"Ο/Η":""} <strong>{reg.name}</strong> {lang==="el"?"μόλις εγγράφηκε στον":"just registered for"} <strong style={{color:T.primary}}>{reg.raceName}</strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>;
}

function PWAInstallPrompt(){
  const {lang}=useLang();
  const [deferredPrompt,setDeferredPrompt]=useState(null);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    function handler(e){
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner if not dismissed before
      if(localStorage.getItem("rm-pwa-dismissed")!=="1")setVisible(true);
    }
    window.addEventListener("beforeinstallprompt",handler);
    return()=>window.removeEventListener("beforeinstallprompt",handler);
  },[]);
  async function install(){
    if(!deferredPrompt)return;
    deferredPrompt.prompt();
    const{outcome}=await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
    if(outcome==="accepted")toast(lang==="el"?"✅ Η εφαρμογή εγκαταστάθηκε!":"✅ App installed!","success");
  }
  function dismiss(){
    setVisible(false);
    localStorage.setItem("rm-pwa-dismissed","1");
  }
  if(!visible||!deferredPrompt)return null;
  return <div style={{position:"fixed",bottom:"20px",left:"20px",right:"20px",maxWidth:"380px",margin:"0 auto",background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"16px",padding:"16px 18px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)",zIndex:9998,display:"flex",alignItems:"center",gap:"14px"}}>
    <div style={{fontSize:"32px",flexShrink:0}}>📲</div>
    <div style={{flex:1,minWidth:0}}>
      <div style={{color:T.text,fontWeight:700,fontSize:"14px",marginBottom:"2px"}}>{lang==="el"?"Εγκατάσταση Εφαρμογής":"Install App"}</div>
      <div style={{color:T.textMid,fontSize:"12px",lineHeight:1.4}}>{lang==="el"?"Πιο γρήγορη πρόσβαση από το κινητό σου":"Faster access from your phone"}</div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
      <button onClick={install} style={{background:T.primary,color:"#fff",border:"none",borderRadius:"8px",padding:"7px 14px",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="el"?"Εγκατάσταση":"Install"}</button>
      <button onClick={dismiss} style={{background:"none",color:T.textLight,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:"11px"}}>{lang==="el"?"Όχι τώρα":"Not now"}</button>
    </div>
  </div>;
}

function LocationAutocomplete({value,onChange,label,placeholder}){
  const {lang}=useLang();
  const [suggestions,setSuggestions]=useState([]);
  const [showDrop,setShowDrop]=useState(false);
  const [loading,setLoading]=useState(false);
  const debounceRef=useRef(null);
  const wrapperRef=useRef(null);

  // Close dropdown on outside click
  useEffect(()=>{
    function handleClick(e){
      if(wrapperRef.current&&!wrapperRef.current.contains(e.target))setShowDrop(false);
    }
    document.addEventListener("mousedown",handleClick);
    return()=>document.removeEventListener("mousedown",handleClick);
  },[]);

  function handleChange(e){
    const v=e.target.value;
    onChange(v);
    if(debounceRef.current)clearTimeout(debounceRef.current);
    if(v.length<2){setSuggestions([]);setShowDrop(false);return;}
    debounceRef.current=setTimeout(async()=>{
      setLoading(true);
      try{
        // Photon API (OpenStreetMap, free)
        const url=`https://photon.komoot.io/api/?q=${encodeURIComponent(v)}&lang=${lang==="el"?"default":"en"}&limit=6`;
        const res=await fetch(url);
        const data=await res.json();
        const results=(data.features||[]).map(f=>{
          const p=f.properties||{};
          const name=p.name||"";
          const parts=[p.city,p.county,p.state,p.country].filter(Boolean);
          const subtitle=parts.join(", ");
          return{
            id:`${f.geometry.coordinates[1]},${f.geometry.coordinates[0]}`,
            name,
            subtitle,
            display:[name,subtitle].filter(Boolean).join(", "),
            lat:f.geometry.coordinates[1],
            lng:f.geometry.coordinates[0],
            country:p.country,
            type:p.osm_value||p.type
          };
        });
        setSuggestions(results);
        setShowDrop(true);
      }catch(e){console.warn("Geocoding failed",e);}
      setLoading(false);
    },300);
  }

  function selectSuggestion(s){
    onChange(s.display);
    setShowDrop(false);
    setSuggestions([]);
  }

  function typeIcon(t){
    if(!t)return"📍";
    if(t.includes("city")||t.includes("town"))return"🏙";
    if(t.includes("village"))return"🏡";
    if(t.includes("airport"))return"✈️";
    if(t.includes("hotel"))return"🏨";
    if(t.includes("stadium")||t.includes("sports"))return"🏟";
    if(t.includes("park"))return"🌳";
    if(t.includes("beach"))return"🏖";
    if(t.includes("mountain"))return"⛰";
    return"📍";
  }

  return <div ref={wrapperRef} style={{position:"relative",marginBottom:"14px"}}>
    {label&&<label style={css.label}>{label}</label>}
    <input
      type="text"
      value={value||""}
      onChange={handleChange}
      onFocus={()=>{if(suggestions.length>0)setShowDrop(true);}}
      placeholder={placeholder||(lang==="el"?"Π.χ. Αθήνα, Θεσσαλονίκη...":"e.g. Athens, Thessaloniki...")}
      autoComplete="off"
      style={css.input}
    />
    {loading&&<div style={{position:"absolute",right:"12px",top:label?"38px":"12px",color:T.textLight,fontSize:"12px",pointerEvents:"none"}}>⏳</div>}
    {showDrop&&suggestions.length>0&&(
      <div style={{position:"absolute",top:"100%",left:0,right:0,background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"10px",marginTop:"4px",boxShadow:"0 8px 24px rgba(0,0,0,0.12)",maxHeight:"260px",overflowY:"auto",zIndex:100}}>
        {suggestions.map(s=>(
          <div key={s.id} onClick={()=>selectSuggestion(s)} style={{padding:"10px 14px",cursor:"pointer",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:"10px",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{fontSize:"20px",flexShrink:0}}>{typeIcon(s.type)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:T.text,fontSize:"13px",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name||s.subtitle}</div>
              {s.subtitle&&s.name&&<div style={{color:T.textLight,fontSize:"11px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.subtitle}</div>}
            </div>
            {s.country&&<div style={{flexShrink:0,fontSize:"10px",color:T.textLight,padding:"2px 6px",background:T.bg,borderRadius:"4px"}}>{s.country}</div>}
          </div>
        ))}
      </div>
    )}
  </div>;
}

const LEGAL_INFO = {
  responsible: "ΜΗΤΡΟΠΕΤΡΟΣ ΕΛΕΥΘΕΡΙΟΣ",
  address: "Στύρα Ευβοίας, Ελλάδα",
  email: "leyterhs.mhtropetros1986@gmail.com",
  afm: "105127494",
  domain: "racemanagement.gr",
  lastUpdate: "31 Μαΐου 2026"
};

function getPrivacyText(lang){
  if(lang==="en"){
    return `# Privacy Policy

Last update: ${LEGAL_INFO.lastUpdate}

## 1. Data Controller

The data controller for personal data collected through ${LEGAL_INFO.domain} is:

- **${LEGAL_INFO.responsible}**
- Address: ${LEGAL_INFO.address}
- VAT ID: ${LEGAL_INFO.afm}
- Email: ${LEGAL_INFO.email}

## 2. Data We Collect

We collect the following personal data:

**For athletes:**
- Full name, email, phone number
- Date of birth, gender
- ID/AMKA number (optional)
- Address, city
- Emergency contact info
- Medical certificate confirmation
- Club/Team
- Race registrations and results

**For organizers:**
- Full name, business/organization name
- Email, phone, address
- Tax ID (AFM)

## 3. Purpose of Processing

Your data is processed for the following purposes:
- Race registration and participation
- Issuing official race results
- Communication regarding registered races
- Compliance with sports federation rules
- Statistical analysis (anonymized)
- Compliance with legal obligations

## 4. Legal Basis

The legal basis for processing is:
- **Contract**: Your registration creates a contractual relationship
- **Consent**: You explicitly consent during registration
- **Legal obligation**: Tax records, sports federation reporting
- **Legitimate interest**: Platform security and improvement

## 5. Data Retention

We retain personal data:
- **Active registrations**: Until race completion + 3 years
- **Race results**: 5 years (for historical records)
- **Accounting data**: 10 years (legal requirement)
- **Anonymous statistics**: Indefinitely

## 6. Data Sharing

We share your data only with:
- **Race organizers** (for races you register in)
- **Supabase** (USA, our database provider - GDPR compliant)
- **Vercel** (USA, our hosting provider - GDPR compliant)
- **Greek authorities** (if legally required)

We do **NOT** sell or rent your data to third parties.

## 7. Your Rights (GDPR)

You have the right to:
- **Access**: Request a copy of your data
- **Rectification**: Correct inaccurate data
- **Erasure**: Request deletion ("right to be forgotten")
- **Portability**: Receive your data in machine-readable format
- **Objection**: Object to processing
- **Restriction**: Request limited processing
- **Withdraw consent**: At any time

To exercise these rights, contact us at: **${LEGAL_INFO.email}**

You may also file a complaint with the **Hellenic Data Protection Authority**:
- Website: www.dpa.gr
- Phone: +30 210 6475600

## 8. Cookies

We use essential cookies for authentication and session management. See our [Cookies Policy](#cookies) for details.

## 9. Security

We implement appropriate technical and organizational measures:
- HTTPS encryption (SSL/TLS)
- Database-level Row Level Security (RLS)
- Password encryption
- Regular security audits

## 10. Changes to This Policy

We may update this policy. Changes will be announced on our website. The "Last update" date indicates the most recent revision.

## 11. Contact

For any privacy-related questions:
**${LEGAL_INFO.email}**`;
  }
  return `# Πολιτική Απορρήτου

Τελευταία ενημέρωση: ${LEGAL_INFO.lastUpdate}

## 1. Υπεύθυνος Επεξεργασίας

Υπεύθυνος επεξεργασίας των προσωπικών δεδομένων που συλλέγονται μέσω της πλατφόρμας ${LEGAL_INFO.domain} είναι:

- **${LEGAL_INFO.responsible}**
- Διεύθυνση: ${LEGAL_INFO.address}
- ΑΦΜ: ${LEGAL_INFO.afm}
- Email: ${LEGAL_INFO.email}

## 2. Δεδομένα που Συλλέγουμε

Συλλέγουμε τα ακόλουθα προσωπικά δεδομένα:

**Για αθλητές:**
- Ονοματεπώνυμο, email, τηλέφωνο
- Ημερομηνία γέννησης, φύλο
- ΑΜΚΑ (προαιρετικό)
- Διεύθυνση, πόλη
- Στοιχεία επικοινωνίας έκτακτης ανάγκης
- Επιβεβαίωση ιατρικής βεβαίωσης
- Σύλλογος/Ομάδα
- Εγγραφές σε αγώνες και αποτελέσματα

**Για διοργανωτές:**
- Ονοματεπώνυμο, επωνυμία επιχείρησης/φορέα
- Email, τηλέφωνο, διεύθυνση
- ΑΦΜ

## 3. Σκοπός Επεξεργασίας

Τα δεδομένα σας υφίστανται επεξεργασία για:
- Εγγραφή και συμμετοχή σε αγώνες
- Έκδοση επίσημων αποτελεσμάτων αγώνων
- Επικοινωνία σχετικά με αγώνες στους οποίους εγγραφήκατε
- Συμμόρφωση με κανόνες αθλητικών ομοσπονδιών
- Στατιστική ανάλυση (ανώνυμη)
- Συμμόρφωση με νομικές υποχρεώσεις

## 4. Νομική Βάση

Η νομική βάση για την επεξεργασία είναι:
- **Σύμβαση**: Η εγγραφή σας δημιουργεί συμβατική σχέση
- **Συγκατάθεση**: Δίνετε ρητή συγκατάθεση κατά την εγγραφή
- **Νομική υποχρέωση**: Φορολογικά αρχεία, αναφορές ομοσπονδιών
- **Έννομο συμφέρον**: Ασφάλεια και βελτίωση πλατφόρμας

## 5. Διατήρηση Δεδομένων

Διατηρούμε προσωπικά δεδομένα:
- **Ενεργές εγγραφές**: Μέχρι την ολοκλήρωση του αγώνα + 3 χρόνια
- **Αποτελέσματα αγώνων**: 5 χρόνια (για ιστορικά αρχεία)
- **Λογιστικά δεδομένα**: 10 χρόνια (νομική υποχρέωση)
- **Ανώνυμα στατιστικά**: Επ' αόριστον

## 6. Κοινοποίηση Δεδομένων

Μοιραζόμαστε τα δεδομένα σας μόνο με:
- **Διοργανωτές αγώνων** (για αγώνες στους οποίους εγγραφήκατε)
- **Supabase** (ΗΠΑ, πάροχος βάσης δεδομένων - GDPR compliant)
- **Vercel** (ΗΠΑ, πάροχος hosting - GDPR compliant)
- **Ελληνικές Αρχές** (αν απαιτηθεί νομικά)

**ΔΕΝ** πουλάμε ή ενοικιάζουμε τα δεδομένα σας σε τρίτους.

## 7. Δικαιώματά σας (GDPR)

Έχετε το δικαίωμα:
- **Πρόσβασης**: Να ζητήσετε αντίγραφο των δεδομένων σας
- **Διόρθωσης**: Να διορθώσετε ανακριβή δεδομένα
- **Διαγραφής**: Να ζητήσετε διαγραφή ("δικαίωμα στη λήθη")
- **Φορητότητας**: Να λάβετε τα δεδομένα σας σε μηχαναγνώσιμη μορφή
- **Εναντίωσης**: Να εναντιωθείτε στην επεξεργασία
- **Περιορισμού**: Να ζητήσετε περιορισμένη επεξεργασία
- **Ανάκλησης συγκατάθεσης**: Οποτεδήποτε

Για να ασκήσετε αυτά τα δικαιώματα, επικοινωνήστε: **${LEGAL_INFO.email}**

Μπορείτε επίσης να υποβάλετε καταγγελία στην **Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα**:
- Website: www.dpa.gr
- Τηλέφωνο: +30 210 6475600
- Email: contact@dpa.gr

## 8. Cookies

Χρησιμοποιούμε απαραίτητα cookies για authentication και διαχείριση session. Δείτε την Πολιτική Cookies για λεπτομέρειες.

## 9. Ασφάλεια

Εφαρμόζουμε κατάλληλα τεχνικά και οργανωτικά μέτρα:
- HTTPS κρυπτογράφηση (SSL/TLS)
- Row Level Security (RLS) σε επίπεδο βάσης δεδομένων
- Κρυπτογράφηση κωδικών
- Τακτικοί έλεγχοι ασφαλείας

## 10. Αλλαγές στην Πολιτική

Μπορεί να ενημερώσουμε αυτή την πολιτική. Οι αλλαγές θα ανακοινώνονται στον ιστότοπό μας. Η ημερομηνία "Τελευταία ενημέρωση" δείχνει την πιο πρόσφατη αναθεώρηση.

## 11. Επικοινωνία

Για οποιαδήποτε ερώτηση σχετικά με το απόρρητο:
**${LEGAL_INFO.email}**`;
}

function getTermsText(lang){
  if(lang==="en"){
    return `# Terms of Service

Last update: ${LEGAL_INFO.lastUpdate}

## 1. Acceptance of Terms

By using ${LEGAL_INFO.domain} ("the Platform"), you agree to these Terms of Service. If you do not agree, do not use the Platform.

## 2. Service Description

The Platform provides race registration and management services for organizers and athletes participating in running, trail, and similar sporting events.

## 3. User Accounts

### 3.1 Eligibility
You must be at least 18 years old (or have parental consent for minors).

### 3.2 Account Security
You are responsible for maintaining the confidentiality of your account credentials.

### 3.3 Truthful Information
You must provide accurate and complete information during registration.

## 4. Athlete Responsibilities

By registering for a race, you confirm:
- You are medically fit to participate
- You hold a valid medical certificate (where required by race organizer)
- You will follow race rules and safety guidelines
- You assume the inherent risks of athletic participation
- Race entry fees are non-refundable unless the race is cancelled

## 5. Organizer Responsibilities

Race organizers agree to:
- Provide accurate race information
- Maintain proper insurance coverage
- Comply with sports federation rules
- Honor announced refund policies
- Properly handle athlete personal data
- Obtain necessary permits and approvals

## 6. Platform Operator's Role

${LEGAL_INFO.responsible}, as platform operator:
- Provides technical infrastructure
- Is NOT responsible for race execution
- Is NOT liable for injuries during races
- Is NOT a party to the contract between athletes and organizers

## 7. Payments

- Race fees are paid directly to organizers (currently via bank transfer)
- The Platform does not currently process payments
- Refund policies are set by each organizer

## 8. Intellectual Property

All Platform content (excluding user-submitted content) is owned by ${LEGAL_INFO.responsible}. Unauthorized reproduction is prohibited.

## 9. User Content

By submitting content (race information, profile data), you grant us a license to use it for Platform operation.

## 10. Prohibited Conduct

You may NOT:
- Use the Platform for illegal purposes
- Attempt to hack or disrupt the Platform
- Impersonate others
- Scrape or harvest data
- Submit false or misleading information

## 11. Limitation of Liability

To the maximum extent permitted by law, ${LEGAL_INFO.responsible} is not liable for:
- Indirect, incidental, or consequential damages
- Personal injury during races
- Loss of data
- Service interruptions

## 12. Termination

We may suspend or terminate accounts that violate these Terms.

## 13. Governing Law

These Terms are governed by Greek law. Disputes are subject to the courts of Athens, Greece.

## 14. Changes to Terms

We may update these Terms. Continued use after changes constitutes acceptance.

## 15. Contact

For questions about these Terms: **${LEGAL_INFO.email}**`;
  }
  return `# Όροι Χρήσης

Τελευταία ενημέρωση: ${LEGAL_INFO.lastUpdate}

## 1. Αποδοχή Όρων

Με τη χρήση του ${LEGAL_INFO.domain} ("η Πλατφόρμα"), συμφωνείτε με αυτούς τους Όρους Χρήσης. Εάν δεν συμφωνείτε, μην χρησιμοποιείτε την Πλατφόρμα.

## 2. Περιγραφή Υπηρεσιών

Η Πλατφόρμα παρέχει υπηρεσίες εγγραφής και διαχείρισης αγώνων για διοργανωτές και αθλητές που συμμετέχουν σε αγώνες δρόμου, trail running και παρόμοιες αθλητικές εκδηλώσεις.

## 3. Λογαριασμοί Χρηστών

### 3.1 Επιλεξιμότητα
Πρέπει να είστε τουλάχιστον 18 ετών (ή να έχετε γονική συγκατάθεση για ανηλίκους).

### 3.2 Ασφάλεια Λογαριασμού
Είστε υπεύθυνοι για τη διατήρηση της εμπιστευτικότητας των διαπιστευτηρίων του λογαριασμού σας.

### 3.3 Αληθινές Πληροφορίες
Πρέπει να παρέχετε ακριβείς και πλήρεις πληροφορίες κατά την εγγραφή.

## 4. Ευθύνες Αθλητή

Εγγραφόμενοι σε αγώνα, επιβεβαιώνετε ότι:
- Είστε ιατρικά ικανοί να συμμετάσχετε
- Διαθέτετε έγκυρη ιατρική βεβαίωση (όπου απαιτείται)
- Θα ακολουθήσετε τους κανονισμούς και τις οδηγίες ασφαλείας του αγώνα
- Αναλαμβάνετε τους εγγενείς κινδύνους της αθλητικής συμμετοχής
- Τα τέλη συμμετοχής δεν επιστρέφονται εκτός αν ο αγώνας ακυρωθεί

## 5. Ευθύνες Διοργανωτή

Οι διοργανωτές αγώνων συμφωνούν να:
- Παρέχουν ακριβείς πληροφορίες αγώνα
- Διατηρούν κατάλληλη ασφαλιστική κάλυψη
- Συμμορφώνονται με τους κανονισμούς αθλητικών ομοσπονδιών
- Τιμούν τις δηλωμένες πολιτικές επιστροφών
- Διαχειρίζονται σωστά τα προσωπικά δεδομένα αθλητών
- Λαμβάνουν τις απαραίτητες άδειες

## 6. Ρόλος του Παρόχου Πλατφόρμας

Ο ${LEGAL_INFO.responsible}, ως πάροχος πλατφόρμας:
- Παρέχει την τεχνική υποδομή
- ΔΕΝ ευθύνεται για την εκτέλεση των αγώνων
- ΔΕΝ ευθύνεται για τραυματισμούς κατά τη διάρκεια αγώνων
- ΔΕΝ είναι συμβαλλόμενο μέρος στη σύμβαση μεταξύ αθλητών και διοργανωτών

## 7. Πληρωμές

- Τα τέλη συμμετοχής καταβάλλονται απευθείας στους διοργανωτές (μέσω τραπεζικού εμβάσματος επί του παρόντος)
- Η Πλατφόρμα δεν επεξεργάζεται πληρωμές αυτή τη στιγμή
- Οι πολιτικές επιστροφών καθορίζονται από κάθε διοργανωτή

## 8. Πνευματική Ιδιοκτησία

Όλο το περιεχόμενο της Πλατφόρμας (εξαιρουμένου του περιεχομένου που υποβάλλεται από χρήστες) ανήκει στον ${LEGAL_INFO.responsible}. Η μη εξουσιοδοτημένη αναπαραγωγή απαγορεύεται.

## 9. Περιεχόμενο Χρηστών

Υποβάλλοντας περιεχόμενο (πληροφορίες αγώνα, δεδομένα προφίλ), μας παρέχετε άδεια να το χρησιμοποιήσουμε για τη λειτουργία της Πλατφόρμας.

## 10. Απαγορευμένη Συμπεριφορά

Δεν επιτρέπεται:
- Χρήση της Πλατφόρμας για παράνομους σκοπούς
- Προσπάθεια hack ή διακοπής της Πλατφόρμας
- Πλαστοπροσωπία
- Συλλογή/scraping δεδομένων
- Υποβολή ψευδών ή παραπλανητικών πληροφοριών

## 11. Περιορισμός Ευθύνης

Στο μέγιστο βαθμό που επιτρέπεται από το νόμο, ο ${LEGAL_INFO.responsible} δεν ευθύνεται για:
- Έμμεσες, παρεπόμενες ή αποτελεσματικές ζημιές
- Σωματικούς τραυματισμούς κατά τη διάρκεια αγώνων
- Απώλεια δεδομένων
- Διακοπές υπηρεσίας

## 12. Διακοπή Υπηρεσίας

Μπορούμε να αναστείλουμε ή να τερματίσουμε λογαριασμούς που παραβιάζουν αυτούς τους Όρους.

## 13. Εφαρμοστέο Δίκαιο

Αυτοί οι Όροι διέπονται από το ελληνικό δίκαιο. Οι διαφορές υπάγονται στα δικαστήρια των Αθηνών.

## 14. Αλλαγές στους Όρους

Μπορεί να ενημερώσουμε αυτούς τους Όρους. Η συνεχιζόμενη χρήση μετά από αλλαγές συνιστά αποδοχή.

## 15. Επικοινωνία

Για ερωτήσεις σχετικά με αυτούς τους Όρους: **${LEGAL_INFO.email}**`;
}

function getCookiesText(lang){
  if(lang==="en"){
    return `# Cookies Policy

Last update: ${LEGAL_INFO.lastUpdate}

## What Are Cookies?

Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit.

## Cookies We Use

### Essential Cookies (Required)
- **Authentication**: To keep you logged in
- **Session management**: To maintain your session

These cookies are required for the Platform to function and cannot be disabled.

### Functional Cookies (Optional)
- **Language preference**: Remembers your language choice (el/en)
- **Dark mode**: Remembers your theme preference

### Local Storage
We use browser local storage for:
- Dark mode preference
- PWA install prompt dismissal
- Recently selected race filters

## Third-Party Services

We use:
- **Supabase Auth** (for authentication cookies)
- **Vercel** (for hosting analytics, anonymized)

## Your Choices

You can:
- Block cookies in your browser settings
- Delete existing cookies
- Use incognito/private browsing

Note: Blocking essential cookies will prevent the Platform from working.

## Contact

Questions about cookies: **${LEGAL_INFO.email}**`;
  }
  return `# Πολιτική Cookies

Τελευταία ενημέρωση: ${LEGAL_INFO.lastUpdate}

## Τι είναι τα Cookies;

Τα cookies είναι μικρά αρχεία κειμένου που αποθηκεύονται στη συσκευή σας όταν επισκέπτεστε έναν ιστότοπο. Βοηθούν τους ιστότοπους να θυμούνται πληροφορίες σχετικά με την επίσκεψή σας.

## Cookies που Χρησιμοποιούμε

### Απαραίτητα Cookies
- **Authentication**: Για να παραμείνετε συνδεδεμένοι
- **Διαχείριση Session**: Για τη διατήρηση της συνεδρίας σας

Αυτά τα cookies είναι απαραίτητα για τη λειτουργία της Πλατφόρμας και δεν μπορούν να απενεργοποιηθούν.

### Λειτουργικά Cookies (Προαιρετικά)
- **Προτίμηση γλώσσας**: Θυμάται την επιλογή γλώσσας σας (el/en)
- **Dark mode**: Θυμάται την προτίμηση θέματος

### Local Storage (Τοπική αποθήκευση)
Χρησιμοποιούμε τοπική αποθήκευση του browser για:
- Προτίμηση Dark Mode
- Απόκρυψη PWA install prompt
- Πρόσφατα επιλεγμένα φίλτρα αγώνων

## Υπηρεσίες Τρίτων

Χρησιμοποιούμε:
- **Supabase Auth** (για cookies authentication)
- **Vercel** (για στατιστικά hosting, ανώνυμα)

## Οι Επιλογές σας

Μπορείτε να:
- Μπλοκάρετε τα cookies από τις ρυθμίσεις του browser
- Διαγράψετε υπάρχοντα cookies
- Χρησιμοποιήσετε incognito/ιδιωτική περιήγηση

Σημείωση: Το μπλοκάρισμα των απαραίτητων cookies θα εμποδίσει τη λειτουργία της Πλατφόρμας.

## Επικοινωνία

Ερωτήσεις σχετικά με cookies: **${LEGAL_INFO.email}**`;
}

function renderMarkdown(text){
  // Simple markdown renderer for legal text
  const lines=text.split("\n");
  const elements=[];
  let listItems=[];
  function flushList(){
    if(listItems.length>0){
      elements.push(<ul key={"ul"+elements.length} style={{paddingLeft:"22px",margin:"8px 0 14px",color:T.textMid,fontSize:"14px",lineHeight:1.7}}>{listItems.map((item,i)=><li key={i} dangerouslySetInnerHTML={{__html:item.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")}}/>)}</ul>);
      listItems=[];
    }
  }
  lines.forEach((line,idx)=>{
    if(line.startsWith("# ")){flushList();elements.push(<h1 key={idx} style={{color:T.text,fontSize:"24px",fontWeight:900,margin:"0 0 18px",borderBottom:`2px solid ${T.primary}`,paddingBottom:"10px"}}>{line.substring(2)}</h1>);}
    else if(line.startsWith("## ")){flushList();elements.push(<h2 key={idx} style={{color:T.text,fontSize:"18px",fontWeight:800,margin:"24px 0 10px"}}>{line.substring(3)}</h2>);}
    else if(line.startsWith("### ")){flushList();elements.push(<h3 key={idx} style={{color:T.text,fontSize:"15px",fontWeight:700,margin:"16px 0 6px"}}>{line.substring(4)}</h3>);}
    else if(line.startsWith("- ")){listItems.push(line.substring(2));}
    else if(line.trim()===""){flushList();}
    else {flushList();const html=line.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");elements.push(<p key={idx} style={{color:T.textMid,fontSize:"14px",lineHeight:1.7,margin:"0 0 12px"}} dangerouslySetInnerHTML={{__html:html}}/>);}
  });
  flushList();
  return elements;
}

function LegalModal({page,onClose}){
  const {lang}=useLang();
  const text=page==="privacy"?getPrivacyText(lang):page==="terms"?getTermsText(lang):getCookiesText(lang);
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:T.bgAlt,borderRadius:"20px",maxWidth:"760px",width:"100%",maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 30px 80px rgba(0,0,0,0.3)"}}>
      <div style={{padding:"20px 28px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{display:"flex",gap:"6px"}}>
          <button onClick={()=>onClose("privacy")} style={{background:page==="privacy"?T.primary:T.bg,color:page==="privacy"?"#fff":T.textMid,border:"none",borderRadius:"8px",padding:"7px 14px",cursor:"pointer",fontSize:"12px",fontWeight:700,fontFamily:"inherit"}}>🛡 {lang==="el"?"Απόρρητο":"Privacy"}</button>
          <button onClick={()=>onClose("terms")} style={{background:page==="terms"?T.primary:T.bg,color:page==="terms"?"#fff":T.textMid,border:"none",borderRadius:"8px",padding:"7px 14px",cursor:"pointer",fontSize:"12px",fontWeight:700,fontFamily:"inherit"}}>📋 {lang==="el"?"Όροι":"Terms"}</button>
          <button onClick={()=>onClose("cookies")} style={{background:page==="cookies"?T.primary:T.bg,color:page==="cookies"?"#fff":T.textMid,border:"none",borderRadius:"8px",padding:"7px 14px",cursor:"pointer",fontSize:"12px",fontWeight:700,fontFamily:"inherit"}}>🍪 Cookies</button>
        </div>
        <button onClick={()=>onClose(null)} style={{background:"none",border:"none",color:T.textLight,fontSize:"26px",cursor:"pointer",width:"32px",height:"32px"}}>×</button>
      </div>
      <div style={{padding:"28px",overflowY:"auto",flex:1}}>
        {renderMarkdown(text)}
      </div>
    </div>
  </div>;
}

function Footer(){
  const {lang}=useLang();
  const [legalPage,setLegalPage]=useState(null);
  return <>
    <footer style={{borderTop:`1px solid ${T.border}`,background:T.bgAlt,padding:"24px 20px",marginTop:"40px",textAlign:"center"}}>
      <div style={{maxWidth:"960px",margin:"0 auto"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:"14px 24px",justifyContent:"center",marginBottom:"14px"}}>
          <button onClick={()=>setLegalPage("privacy")} style={{background:"none",border:"none",color:T.textMid,fontSize:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>🛡 {lang==="el"?"Απόρρητο":"Privacy"}</button>
          <button onClick={()=>setLegalPage("terms")} style={{background:"none",border:"none",color:T.textMid,fontSize:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>📋 {lang==="el"?"Όροι Χρήσης":"Terms"}</button>
          <button onClick={()=>setLegalPage("cookies")} style={{background:"none",border:"none",color:T.textMid,fontSize:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>🍪 Cookies</button>
          <a href={`mailto:${LEGAL_INFO.email}`} style={{color:T.textMid,fontSize:"13px",textDecoration:"none",fontWeight:600}}>✉️ {lang==="el"?"Επικοινωνία":"Contact"}</a>
        </div>
        <div style={{color:T.textLight,fontSize:"11px",lineHeight:1.6}}>
          © {new Date().getFullYear()} {LEGAL_INFO.responsible} · ΑΦΜ {LEGAL_INFO.afm} · {LEGAL_INFO.address}<br/>
          📞 <a href="tel:+306936960328" style={{color:T.textMid,textDecoration:"none"}}>693 6960328</a> · ✉️ <a href={`mailto:${LEGAL_INFO.email}`} style={{color:T.textMid,textDecoration:"none"}}>{LEGAL_INFO.email}</a><br/>
          racemanagement.gr · {lang==="el"?"Πλατφόρμα Διαχείρισης Αγώνων":"Race Management Platform"}
        </div>
      </div>
    </footer>
    {legalPage&&<LegalModal page={legalPage} onClose={p=>setLegalPage(p)}/>}
  </>;
}

function upperNoAccent(s){
  if(!s)return"";
  return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();
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
  const {t,lang}=useLang();
  function updateField(distance,field,value){
    const existing=pricing.find(p=>p.distance===distance);
    if(existing){onChange(pricing.map(p=>p.distance===distance?{...p,[field]:field==="price"||field==="elevation"?(parseFloat(value)||0):value}:p));}
    else{onChange([...pricing,{distance,[field]:field==="price"||field==="elevation"?(parseFloat(value)||0):value}]);}
  }
  function getField(distance,field){return pricing.find(p=>p.distance===distance)?.[field]||"";}
  if(distances.length===0)return <div style={{background:`${T.warning}15`,border:`1px solid ${T.warning}44`,borderRadius:"8px",padding:"12px",color:T.warning,fontSize:"12px",marginBottom:"14px"}}>{t.addDistancesFirst}</div>;
  return <F label={t.pricingLabel}>
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      {distances.map(d=>(
        <div key={d} style={{background:T.bg,padding:"12px 14px",borderRadius:"10px",border:`1px solid ${T.border}`}}>
          <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"8px"}}>
            <span style={{flex:1,fontSize:"14px",color:T.text,fontWeight:700}}>🏃 {d}</span>
            <input type="number" min="0" step="0.5" value={getField(d,"price")} onChange={e=>updateField(d,"price",e.target.value)} placeholder="0" style={{...css.input,width:"90px"}}/>
            <span style={{color:T.textMid,fontSize:"13px"}}>€</span>
            <input type="number" min="0" value={getField(d,"elevation")} onChange={e=>updateField(d,"elevation",e.target.value)} placeholder={lang==="el"?"Υψομ.":"Elev."} style={{...css.input,width:"90px"}}/>
            <span style={{color:T.textMid,fontSize:"13px"}}>m</span>
          </div>
          <textarea value={getField(d,"description")} onChange={e=>updateField(d,"description",e.target.value)} placeholder={lang==="el"?`Σύντομη περιγραφή της διαδρομής ${d} (προαιρετικό)...`:`Short description for ${d} (optional)...`} rows={2} style={{...css.input,width:"100%",resize:"vertical",fontFamily:"inherit",fontSize:"12px",lineHeight:1.4,boxSizing:"border-box"}}/>
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

function SponsorsPicker({sponsors,onChange}){
  const {lang}=useLang();
  const [newSp,setNewSp]=useState({name:"",logo_url:"",website:""});
  const [uploading,setUploading]=useState(false);
  async function uploadLogo(e){
    const file=e.target.files?.[0];
    if(!file)return;
    setUploading(true);
    const ext=file.name.split(".").pop();
    const path=`sponsor-${Date.now()}.${ext}`;
    const {error:upErr}=await supabase.storage.from("race-banners").upload(path,file,{upsert:true});
    if(upErr){toast("⚠️ "+upErr.message,"error");setUploading(false);return;}
    const {data:{publicUrl}}=supabase.storage.from("race-banners").getPublicUrl(path);
    setNewSp(s=>({...s,logo_url:publicUrl}));
    setUploading(false);
  }
  function addSponsor(){
    if(!newSp.name.trim()){toast(lang==="el"?"Συμπληρώστε όνομα χορηγού!":"Please enter sponsor name!","warning");return;}
    onChange([...(sponsors||[]),{...newSp,id:Date.now().toString()}]);
    setNewSp({name:"",logo_url:"",website:""});
  }
  function removeSponsor(id){onChange((sponsors||[]).filter(s=>s.id!==id));}
  return <F label={lang==="el"?"🤝 Χορηγοί":"🤝 Sponsors"}>
    <div style={{color:T.textMid,fontSize:"12px",marginBottom:"10px"}}>{lang==="el"?"Προσθέστε χορηγούς του αγώνα με όνομα, λογότυπο και ιστοσελίδα.":"Add race sponsors with name, logo and website."}</div>
    {(sponsors||[]).length>0&&(
      <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"12px"}}>
        {sponsors.map(s=>(
          <div key={s.id} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"10px 14px",display:"flex",alignItems:"center",gap:"12px"}}>
            {s.logo_url?<img src={s.logo_url} alt="" style={{width:"40px",height:"40px",objectFit:"contain",borderRadius:"6px",background:"#fff",border:`1px solid ${T.border}`}}/>:<div style={{width:"40px",height:"40px",borderRadius:"6px",background:`${T.primary}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>🏢</div>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:T.text,fontWeight:700,fontSize:"13px"}}>{s.name}</div>
              {s.website&&<div style={{color:T.textLight,fontSize:"11px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.website}</div>}
            </div>
            <button onClick={()=>removeSponsor(s.id)} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",fontSize:"18px"}}>×</button>
          </div>
        ))}
      </div>
    )}
    <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"14px"}}>
      <input value={newSp.name} onChange={e=>setNewSp({...newSp,name:e.target.value})} placeholder={lang==="el"?"Όνομα χορηγού":"Sponsor name"} style={{...css.input,marginBottom:"8px"}}/>
      <input value={newSp.website} onChange={e=>setNewSp({...newSp,website:e.target.value})} placeholder={lang==="el"?"Ιστοσελίδα (π.χ. https://...)":"Website (e.g. https://...)"} style={{...css.input,marginBottom:"8px"}}/>
      <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"}}>
        {newSp.logo_url?(<><img src={newSp.logo_url} alt="" style={{width:"40px",height:"40px",objectFit:"contain",borderRadius:"6px",background:"#fff",border:`1px solid ${T.border}`}}/><button type="button" onClick={()=>setNewSp({...newSp,logo_url:""})} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",fontSize:"12px",fontFamily:"inherit"}}>✕</button></>):(<label style={{cursor:uploading?"wait":"pointer",background:T.bgAlt,border:`1px dashed ${T.border}`,borderRadius:"8px",padding:"8px 14px",fontSize:"12px",color:T.textMid,fontFamily:"inherit",opacity:uploading?0.6:1}}>{uploading?"...":(lang==="el"?"📷 Λογότυπο":"📷 Logo")}<input type="file" accept="image/*" onChange={uploadLogo} style={{display:"none"}} disabled={uploading}/></label>)}
        <button type="button" onClick={addSponsor} style={{marginLeft:"auto",background:T.primary,color:"#fff",border:"none",borderRadius:"8px",padding:"8px 16px",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="el"?"+ Προσθήκη":"+ Add"}</button>
      </div>
    </div>
  </F>;
}

function FAQPicker({faq,onChange}){
  const {lang}=useLang();
  const [newQ,setNewQ]=useState({question:"",answer:""});
  function addFaq(){
    if(!newQ.question.trim()||!newQ.answer.trim()){toast(lang==="el"?"Συμπληρώστε ερώτηση και απάντηση!":"Please fill question and answer!","warning");return;}
    onChange([...(faq||[]),{...newQ,id:Date.now().toString()}]);
    setNewQ({question:"",answer:""});
  }
  function removeFaq(id){onChange((faq||[]).filter(f=>f.id!==id));}
  return <F label={lang==="el"?"❓ Συχνές Ερωτήσεις":"❓ FAQ"}>
    <div style={{color:T.textMid,fontSize:"12px",marginBottom:"10px"}}>{lang==="el"?"Προσθέστε συχνές ερωτήσεις και απαντήσεις για τους αθλητές.":"Add frequently asked questions for athletes."}</div>
    {(faq||[]).length>0&&(
      <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"12px"}}>
        {faq.map(f=>(
          <div key={f.id} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"12px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"10px"}}>
              <div style={{flex:1}}>
                <div style={{color:T.text,fontWeight:700,fontSize:"13px",marginBottom:"4px"}}>Q: {f.question}</div>
                <div style={{color:T.textMid,fontSize:"12px",lineHeight:1.5,whiteSpace:"pre-wrap"}}>A: {f.answer}</div>
              </div>
              <button onClick={()=>removeFaq(f.id)} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",fontSize:"18px",flexShrink:0}}>×</button>
            </div>
          </div>
        ))}
      </div>
    )}
    <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"14px"}}>
      <input value={newQ.question} onChange={e=>setNewQ({...newQ,question:e.target.value})} placeholder={lang==="el"?"Ερώτηση π.χ. Πότε λήγουν οι εγγραφές;":"Question e.g. When do registrations close?"} style={{...css.input,marginBottom:"8px"}}/>
      <textarea value={newQ.answer} onChange={e=>setNewQ({...newQ,answer:e.target.value})} rows={2} placeholder={lang==="el"?"Απάντηση...":"Answer..."} style={{...css.input,resize:"vertical",marginBottom:"8px"}}/>
      <button type="button" onClick={addFaq} style={{background:T.primary,color:"#fff",border:"none",borderRadius:"8px",padding:"8px 16px",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",float:"right"}}>{lang==="el"?"+ Προσθήκη":"+ Add"}</button>
      <div style={{clear:"both"}}/>
    </div>
  </F>;
}

function calculatePrice(race,distance){
  const basePrice=(race.pricing||[]).find(p=>p.distance===distance)?.price||0;
  if(!race.early_bird||!race.early_bird.deadline)return{base:basePrice,final:basePrice,isEarlyBird:false};
  const now=new Date();const deadline=new Date(race.early_bird.deadline);
  if(now<=deadline){const discount=race.early_bird.discount_percent||0;return{base:basePrice,final:basePrice*(1-discount/100),isEarlyBird:true,discount,deadline:race.early_bird.deadline};}
  return{base:basePrice,final:basePrice,isEarlyBird:false};
}

function parseGPX(gpxText){
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
  }catch(e){return null;}
}

function haversineKm(p1,p2){
  const R=6371;
  const dLat=(p2[0]-p1[0])*Math.PI/180;
  const dLng=(p2[1]-p1[1])*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(p1[0]*Math.PI/180)*Math.cos(p2[0]*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function calculateRouteStats(points){
  if(!points||points.length<2)return{totalKm:0,gain:0,loss:0};
  let totalKm=0,gain=0,loss=0;
  for(let i=1;i<points.length;i++){
    totalKm+=haversineKm(points[i-1],points[i]);
    const diff=points[i][2]-points[i-1][2];
    if(diff>0)gain+=diff;else loss+=Math.abs(diff);
  }
  return{totalKm:Math.round(totalKm*100)/100,gain:Math.round(gain),loss:Math.round(loss)};
}

function escapeXml(s){return String(s||"").replace(/[<>&'"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));}

function generateGPX(route){
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

function downloadGPX(route,raceName){
  try{
    const gpx=generateGPX(route);
    const blob=new Blob([gpx],{type:"application/gpx+xml"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`${(raceName||"race").replace(/[^a-zA-Z0-9]/gi,"-")}-${(route.distance||"route").replace(/[^a-zA-Z0-9]/gi,"-")}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(e){toast("Σφάλμα: "+e.message,"error");}
}

function buildElevationData(points){
  if(!points||points.length<2)return[];
  let cumKm=0;
  const data=[{x:0,y:points[0][2]||0}];
  for(let i=1;i<points.length;i++){
    cumKm+=haversineKm(points[i-1],points[i]);
    data.push({x:cumKm,y:points[i][2]||0});
  }
  return data;
}

function downsampleProfile(data,maxPoints){
  if(data.length<=maxPoints)return data;
  const step=Math.ceil(data.length/maxPoints);
  const out=[];
  for(let i=0;i<data.length;i+=step)out.push(data[i]);
  if(out[out.length-1]!==data[data.length-1])out.push(data[data.length-1]);
  return out;
}

function ElevationProfile({points,height}){
  if(!points||points.length<2)return null;
  const data=buildElevationData(points);
  const sampled=downsampleProfile(data,250);
  const totalKm=data[data.length-1].x;
  if(totalKm<=0)return null;
  const eles=data.map(d=>d.y);
  const minEle=Math.min(...eles);
  const maxEle=Math.max(...eles);
  const range=Math.max(maxEle-minEle,1);
  const W=1000,H=240;
  const PAD={top:24,right:14,bottom:30,left:56};
  const chartW=W-PAD.left-PAD.right;
  const chartH=H-PAD.top-PAD.bottom;
  const xScale=km=>PAD.left+(km/totalKm)*chartW;
  const yScale=ele=>PAD.top+chartH-((ele-minEle)/range)*chartH;
  const linePts=sampled.map(d=>`${xScale(d.x).toFixed(1)},${yScale(d.y).toFixed(1)}`).join(" ");
  const areaPath=`M ${xScale(0).toFixed(1)} ${(PAD.top+chartH).toFixed(1)} L ${sampled.map(d=>`${xScale(d.x).toFixed(1)} ${yScale(d.y).toFixed(1)}`).join(" L ")} L ${xScale(totalKm).toFixed(1)} ${(PAD.top+chartH).toFixed(1)} Z`;
  const maxP=data.reduce((a,b)=>b.y>a.y?b:a,data[0]);
  const minP=data.reduce((a,b)=>b.y<a.y?b:a,data[0]);
  const midEle=(minEle+maxEle)/2;
  const kmTicks=totalKm<=10?[0,totalKm/2,totalKm]:totalKm<=30?[0,totalKm*0.25,totalKm*0.5,totalKm*0.75,totalKm]:[0,totalKm*0.2,totalKm*0.4,totalKm*0.6,totalKm*0.8,totalKm];
  return <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{width:"100%",height:height||200,display:"block"}}>
    <defs>
      <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4a5dc7" stopOpacity="0.45"/>
        <stop offset="100%" stopColor="#4a5dc7" stopOpacity="0.02"/>
      </linearGradient>
    </defs>
    {/* gridlines */}
    <line x1={PAD.left} y1={PAD.top} x2={W-PAD.right} y2={PAD.top} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3"/>
    <line x1={PAD.left} y1={PAD.top+chartH/2} x2={W-PAD.right} y2={PAD.top+chartH/2} stroke="#f1f1f1" strokeWidth="1" strokeDasharray="3,3"/>
    <line x1={PAD.left} y1={PAD.top+chartH} x2={W-PAD.right} y2={PAD.top+chartH} stroke="#e5e7eb" strokeWidth="1"/>
    {/* Y labels */}
    <text x={PAD.left-8} y={PAD.top+5} fill="#9a9aa3" fontSize="12" textAnchor="end" fontFamily="Inter,sans-serif" fontWeight="600">{Math.round(maxEle)}m</text>
    <text x={PAD.left-8} y={PAD.top+chartH/2+4} fill="#bbb" fontSize="11" textAnchor="end" fontFamily="Inter,sans-serif">{Math.round(midEle)}m</text>
    <text x={PAD.left-8} y={PAD.top+chartH+5} fill="#9a9aa3" fontSize="12" textAnchor="end" fontFamily="Inter,sans-serif" fontWeight="600">{Math.round(minEle)}m</text>
    {/* Area */}
    <path d={areaPath} fill="url(#elevGrad)"/>
    {/* Line */}
    <polyline points={linePts} fill="none" stroke="#4a5dc7" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
    {/* X axis ticks */}
    {kmTicks.map((k,i)=>(
      <g key={i}>
        <line x1={xScale(k)} y1={PAD.top+chartH} x2={xScale(k)} y2={PAD.top+chartH+5} stroke="#9a9aa3"/>
        <text x={xScale(k)} y={H-8} fill="#9a9aa3" fontSize="12" textAnchor={i===0?"start":i===kmTicks.length-1?"end":"middle"} fontFamily="Inter,sans-serif" fontWeight="600">{k.toFixed(k<10?1:0)}km</text>
      </g>
    ))}
    {/* Max marker */}
    <circle cx={xScale(maxP.x)} cy={yScale(maxP.y)} r="5" fill="#10b981" stroke="#fff" strokeWidth="2.5"/>
    <text x={xScale(maxP.x)} y={yScale(maxP.y)-12} fill="#10b981" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="Inter,sans-serif">▲ {Math.round(maxP.y)}m</text>
    {/* Min marker */}
    <circle cx={xScale(minP.x)} cy={yScale(minP.y)} r="5" fill="#ef4444" stroke="#fff" strokeWidth="2.5"/>
    <text x={xScale(minP.x)} y={yScale(minP.y)+20} fill="#ef4444" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="Inter,sans-serif">▼ {Math.round(minP.y)}m</text>
  </svg>;
}

function RouteMap({points,height,defaultLayer}){
  const [layer,setLayer]=useState(defaultLayer||"satellite");
  if(!points||points.length===0)return null;
  const positions=points.map(p=>[p[0],p[1]]);
  const start=positions[0];
  const finish=positions[positions.length-1];
  const lats=positions.map(p=>p[0]);
  const lngs=positions.map(p=>p[1]);
  const center=[(Math.min(...lats)+Math.max(...lats))/2,(Math.min(...lngs)+Math.max(...lngs))/2];
  const startIcon=L.divIcon({html:'<div style="background:#10b981;width:38px;height:38px;border-radius:50%;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:18px;font-family:system-ui">▶</div>',iconSize:[38,38],iconAnchor:[19,19],className:""});
  const finishIcon=L.divIcon({html:'<div style="background:#ef4444;width:38px;height:38px;border-radius:50%;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:13px;font-family:system-ui">END</div>',iconSize:[38,38],iconAnchor:[19,19],className:""});
  const layers={
    standard:{url:"https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png",attribution:'&copy; OpenStreetMap',label:"🗺",routeColor:"#4a5dc7"},
    satellite:{url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",attribution:'Tiles &copy; Esri',label:"🛰",routeColor:"#fbbf24"},
    terrain:{url:"https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",attribution:'&copy; OpenTopoMap (CC-BY-SA)',label:"⛰",routeColor:"#dc2626"}
  };
  const current=layers[layer]||layers.satellite;
  const opts=[{id:"standard",label:"Map",icon:"🗺"},{id:"satellite",label:"Satellite",icon:"🛰"},{id:"terrain",label:"Terrain",icon:"⛰"}];
  return <div style={{position:"relative",width:"100%"}}>
    <MapContainer key={layer} center={center} zoom={13} style={{height:height||"360px",width:"100%",borderRadius:"16px",zIndex:1}} scrollWheelZoom={false}>
      <TileLayer url={current.url} attribution={current.attribution} maxZoom={layer==="terrain"?17:19}/>
      <Polyline positions={positions} pathOptions={{color:current.routeColor,weight:5,opacity:0.92}}/>
      <Polyline positions={positions} pathOptions={{color:"#fff",weight:7,opacity:0.4}}/>
      <Polyline positions={positions} pathOptions={{color:current.routeColor,weight:5,opacity:0.92}}/>
      <Marker position={start} icon={startIcon}/>
      <Marker position={finish} icon={finishIcon}/>
    </MapContainer>
    <div style={{position:"absolute",top:"10px",right:"10px",zIndex:400,background:"rgba(255,255,255,0.96)",backdropFilter:"blur(8px)",borderRadius:"10px",padding:"4px",boxShadow:"0 2px 8px rgba(0,0,0,0.15)",display:"flex",gap:"2px"}}>
      {opts.map(o=>(
        <button key={o.id} onClick={()=>setLayer(o.id)} type="button" title={o.label} style={{background:layer===o.id?T.primary:"transparent",color:layer===o.id?"#fff":T.text,border:"none",borderRadius:"7px",padding:"6px 10px",fontSize:"14px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,minWidth:"34px"}}>{o.icon}</button>
      ))}
    </div>
  </div>;
}

function RoutesPicker({distances,routes,onChange}){
  const {lang}=useLang();
  const [uploading,setUploading]=useState({});
  function getRouteFor(d){return (routes||[]).find(r=>r.distance===d);}
  async function handleUpload(distance,e){
    const file=e.target.files?.[0];
    if(!file)return;
    setUploading(u=>({...u,[distance]:true}));
    try{
      const text=await file.text();
      const points=parseGPX(text);
      if(!points||points.length<2){
        toast(lang==="el"?"Μη έγκυρο αρχείο GPX":"Invalid GPX file","warning");
        setUploading(u=>({...u,[distance]:false}));
        return;
      }
      const stats=calculateRouteStats(points);
      const newRoute={distance,points,total_km:stats.totalKm,elevation_gain:stats.gain,elevation_loss:stats.loss,file_name:file.name};
      const filtered=(routes||[]).filter(r=>r.distance!==distance);
      onChange([...filtered,newRoute]);
    }catch(err){
      toast("Error: "+err.message,"error");
    }
    setUploading(u=>({...u,[distance]:false}));
  }
  function removeRoute(distance){
    if(!confirm(lang==="el"?"Διαγραφή χάρτη;":"Delete route map?"))return;
    onChange((routes||[]).filter(r=>r.distance!==distance));
  }
  if(distances.length===0)return <div style={{background:`${T.warning}15`,border:`1px solid ${T.warning}44`,borderRadius:"8px",padding:"12px",color:T.warning,fontSize:"12px",marginBottom:"14px"}}>{lang==="el"?"⚠️ Πρόσθεσε πρώτα διαδρομές για να ανεβάσεις GPX":"⚠️ Add distances first"}</div>;
  return <F label={lang==="el"?"🗺 Χάρτες Διαδρομών (GPX)":"🗺 Route Maps (GPX)"}>
    <div style={{color:T.textMid,fontSize:"12px",marginBottom:"10px"}}>{lang==="el"?"Ανέβασε .gpx για κάθε διαδρομή. Υπολογίζονται αυτόματα km και υψομετρικά.":"Upload .gpx per distance. KM and elevation calculated automatically."}</div>
    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
      {distances.map(d=>{
        const route=getRouteFor(d);
        return <div key={d} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"12px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"10px"}}>
            <div style={{flex:"1 1 200px",minWidth:0}}>
              <div style={{color:T.text,fontWeight:700,fontSize:"13px"}}>🏃 {d}</div>
              {route?(
                <div style={{color:T.textMid,fontSize:"12px",marginTop:"4px"}}>📏 {route.total_km} km · ⛰ +{route.elevation_gain}m / -{route.elevation_loss}m</div>
              ):(
                <div style={{color:T.textLight,fontSize:"11px",marginTop:"4px"}}>{lang==="el"?"Δεν έχει χάρτη":"No map yet"}</div>
              )}
            </div>
            <div style={{display:"flex",gap:"8px"}}>
              {route?(
                <button type="button" onClick={()=>removeRoute(d)} style={{background:"#fce8e8",color:T.danger,border:`1px solid ${T.danger}33`,borderRadius:"8px",padding:"6px 12px",cursor:"pointer",fontSize:"12px",fontFamily:"inherit",fontWeight:600}}>🗑 {lang==="el"?"Αφαίρεση":"Remove"}</button>
              ):(
                <label style={{cursor:uploading[d]?"wait":"pointer",background:T.primary,color:"#fff",borderRadius:"8px",padding:"7px 14px",fontSize:"12px",fontWeight:700,fontFamily:"inherit",display:"inline-block",opacity:uploading[d]?0.6:1}}>
                  {uploading[d]?(lang==="el"?"Επεξεργασία...":"Processing..."):"📤 Upload GPX"}
                  <input type="file" accept=".gpx" onChange={e=>handleUpload(d,e)} style={{display:"none"}} disabled={!!uploading[d]}/>
                </label>
              )}
            </div>
          </div>
          {route&&route.points&&route.points.length>0&&(
            <div style={{marginTop:"10px"}}>
              <RouteMap points={route.points} height="220px"/>
            </div>
          )}
        </div>;
      })}
    </div>
  </F>;
}

function WeatherWidget({location,raceDate}){
  const {lang}=useLang();
  const [weather,setWeather]=useState(null);
  const [coords,setCoords]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  useEffect(()=>{
    if(!location){setLoading(false);setError("nolocation");return;}
    let cancelled=false;
    (async()=>{
      try{
        const geoUrl=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en`;
        const geoRes=await fetch(geoUrl);
        const geoData=await geoRes.json();
        if(!geoData.results||geoData.results.length===0){if(!cancelled){setError("nogeo");setLoading(false);}return;}
        const {latitude,longitude}=geoData.results[0];
        if(!cancelled)setCoords({lat:latitude,lng:longitude});
        const today=new Date();
        const race=raceDate?new Date(raceDate):today;
        race.setHours(12,0,0,0);
        const daysAhead=Math.ceil((race-today)/(1000*60*60*24));
        if(daysAhead>16){if(!cancelled){setError("toofar");setLoading(false);}return;}
        const dateStr=race.toISOString().split("T")[0];
        const wUrl=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,precipitation_probability_max,relative_humidity_2m_max&timezone=auto&start_date=${dateStr}&end_date=${dateStr}`;
        const wRes=await fetch(wUrl);
        const wData=await wRes.json();
        if(!wData.daily){if(!cancelled){setError("noweather");setLoading(false);}return;}
        if(!cancelled){
          setWeather({
            tempMax:Math.round(wData.daily.temperature_2m_max[0]),
            tempMin:Math.round(wData.daily.temperature_2m_min[0]),
            wind:Math.round(wData.daily.wind_speed_10m_max[0]),
            precipitation:wData.daily.precipitation_probability_max[0]||0,
            humidity:Math.round(wData.daily.relative_humidity_2m_max[0]||0),
            code:wData.daily.weather_code[0]
          });
          setLoading(false);
        }
      }catch(e){if(!cancelled){setError("err");setLoading(false);}}
    })();
    return()=>{cancelled=true;};
  },[location,raceDate]);

  function weatherIcon(code){
    if(code===0)return"☀️";
    if(code>=1&&code<=3)return"⛅";
    if(code>=45&&code<=48)return"🌫️";
    if(code>=51&&code<=67)return"🌧️";
    if(code>=71&&code<=77)return"🌨️";
    if(code>=80&&code<=82)return"🌦️";
    if(code>=95&&code<=99)return"⛈️";
    return"🌤️";
  }
  function weatherLabel(code){
    if(code===0)return lang==="el"?"Καθαρός":"Clear";
    if(code>=1&&code<=3)return lang==="el"?"Μερικώς νεφελώδης":"Partly cloudy";
    if(code>=45&&code<=48)return lang==="el"?"Ομίχλη":"Fog";
    if(code>=51&&code<=67)return lang==="el"?"Βροχή":"Rain";
    if(code>=71&&code<=77)return lang==="el"?"Χιόνι":"Snow";
    if(code>=80&&code<=82)return lang==="el"?"Καταιγίδα":"Showers";
    if(code>=95&&code<=99)return lang==="el"?"Καταιγίδα με κεραυνούς":"Thunderstorm";
    return lang==="el"?"Νεφώσεις":"Cloudy";
  }

  if(loading)return <div style={{background:T.bgAlt,borderRadius:"16px",padding:"22px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",textAlign:"center",color:T.textLight,fontSize:"13px"}}>🌤 {lang==="el"?"Φόρτωση καιρού...":"Loading weather..."}</div>;
  if(error||!weather){
    const msg=error==="toofar"?(lang==="el"?"Πρόγνωση διαθέσιμη 16 ημέρες πριν":"Forecast available 16 days before"):(lang==="el"?"Δεν είναι διαθέσιμη η πρόγνωση":"Weather not available");
    return <div style={{background:T.bgAlt,borderRadius:"16px",padding:"22px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <div style={{width:"44px",height:"44px",borderRadius:"12px",background:`${T.primary}15`,color:T.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",marginBottom:"14px"}}>🌤</div>
      <div style={{color:T.textMid,fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"4px"}}>{lang==="el"?"Πρόγνωση Καιρού":"Weather"}</div>
      <div style={{color:T.textLight,fontSize:"13px"}}>{msg}</div>
    </div>;
  }
  return <div style={{background:T.bgAlt,borderRadius:"16px",padding:"22px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"}}>
      <div style={{color:T.textMid,fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>{lang==="el"?"🌤 Πρόγνωση":"🌤 Weather"}</div>
      <div style={{fontSize:"36px"}}>{weatherIcon(weather.code)}</div>
    </div>
    <div style={{display:"flex",alignItems:"baseline",gap:"6px",marginBottom:"4px"}}>
      <span style={{color:T.text,fontSize:"30px",fontWeight:900}}>{weather.tempMax}°</span>
      <span style={{color:T.textLight,fontSize:"16px",fontWeight:600}}>/ {weather.tempMin}°C</span>
    </div>
    <div style={{color:T.textMid,fontSize:"12px",marginBottom:"12px"}}>{weatherLabel(weather.code)}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
      <div style={{background:T.bg,borderRadius:"8px",padding:"8px 10px",textAlign:"center"}}>
        <div style={{fontSize:"16px",marginBottom:"2px"}}>💨</div>
        <div style={{color:T.text,fontSize:"13px",fontWeight:700}}>{weather.wind}</div>
        <div style={{color:T.textLight,fontSize:"9px",letterSpacing:"0.06em",textTransform:"uppercase"}}>km/h</div>
      </div>
      <div style={{background:T.bg,borderRadius:"8px",padding:"8px 10px",textAlign:"center"}}>
        <div style={{fontSize:"16px",marginBottom:"2px"}}>💧</div>
        <div style={{color:T.text,fontSize:"13px",fontWeight:700}}>{weather.humidity}%</div>
        <div style={{color:T.textLight,fontSize:"9px",letterSpacing:"0.06em",textTransform:"uppercase"}}>{lang==="el"?"Υγρ.":"Hum."}</div>
      </div>
      <div style={{background:T.bg,borderRadius:"8px",padding:"8px 10px",textAlign:"center"}}>
        <div style={{fontSize:"16px",marginBottom:"2px"}}>☔</div>
        <div style={{color:T.text,fontSize:"13px",fontWeight:700}}>{weather.precipitation}%</div>
        <div style={{color:T.textLight,fontSize:"9px",letterSpacing:"0.06em",textTransform:"uppercase"}}>{lang==="el"?"Βροχή":"Rain"}</div>
      </div>
    </div>
    {coords&&(
      <div style={{marginTop:"14px",borderRadius:"12px",overflow:"hidden",border:`1px solid ${T.border}`}}>
        <MapContainer center={[coords.lat,coords.lng]} zoom={11} style={{height:"160px",width:"100%"}} scrollWheelZoom={false} dragging={true} doubleClickZoom={false} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <Marker position={[coords.lat,coords.lng]}>
            <Popup>{location}</Popup>
          </Marker>
        </MapContainer>
        <a href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`} target="_blank" rel="noopener noreferrer" style={{display:"block",textAlign:"center",padding:"8px",background:T.bg,color:T.primary,fontSize:"12px",fontWeight:700,textDecoration:"none",borderTop:`1px solid ${T.border}`}}>🗺 {lang==="el"?"Άνοιγμα στο Google Maps":"Open in Google Maps"} ↗</a>
      </div>
    )}
  </div>;
}

function SponsorsDisplay({sponsors}){
  const {lang}=useLang();
  if(!sponsors||sponsors.length===0)return null;
  return <div style={{background:T.bgAlt,borderRadius:"16px",padding:"24px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
    <h3 style={{margin:"0 0 18px",color:T.text,fontSize:"15px",fontWeight:800,letterSpacing:"-0.01em"}}>🤝 {lang==="el"?"Χορηγοί":"Sponsors"}</h3>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:"14px"}}>
      {sponsors.map((s,i)=>{
        const inner=<>
          {s.logo_url?<img src={s.logo_url} alt={s.name} style={{maxWidth:"100%",maxHeight:"60px",objectFit:"contain"}}/>:<div style={{fontSize:"30px"}}>🏢</div>}
          <div style={{color:T.text,fontSize:"12px",fontWeight:700,textAlign:"center",lineHeight:1.3}}>{s.name}</div>
        </>;
        const style={background:T.bg,borderRadius:"12px",padding:"18px 14px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"10px",minHeight:"110px",textDecoration:"none",color:"inherit",transition:"transform 0.15s"};
        return s.website?<a key={i} href={s.website} target="_blank" rel="noopener noreferrer" style={style} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>{inner}</a>:<div key={i} style={style}>{inner}</div>;
      })}
    </div>
  </div>;
}

function FAQDisplay({faq}){
  const {lang}=useLang();
  const [open,setOpen]=useState({});
  if(!faq||faq.length===0)return null;
  return <div style={{background:T.bgAlt,borderRadius:"16px",padding:"24px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
    <h3 style={{margin:"0 0 18px",color:T.text,fontSize:"15px",fontWeight:800,letterSpacing:"-0.01em"}}>❓ {lang==="el"?"Συχνές Ερωτήσεις":"FAQ"}</h3>
    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {faq.map((f,i)=>{
        const isOpen=!!open[f.id||i];
        return <div key={f.id||i} style={{background:T.bg,borderRadius:"12px",overflow:"hidden"}}>
          <button onClick={()=>setOpen({...open,[f.id||i]:!isOpen})} style={{width:"100%",background:"none",border:"none",padding:"14px 18px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"10px"}}>
            <span style={{color:T.text,fontWeight:700,fontSize:"14px",flex:1}}>{f.question}</span>
            <span style={{color:T.textMid,fontSize:"18px",transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>⌄</span>
          </button>
          {isOpen&&<div style={{padding:"0 18px 16px",color:T.textMid,fontSize:"13px",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{f.answer}</div>}
        </div>;
      })}
    </div>
  </div>;
}

function ShareMenu({raceName,raceDate,onClose}){
  const {lang}=useLang();
  const url=typeof window!=="undefined"?window.location.href:"";
  const shareText=`${raceName} - ${raceDate}`;
  function shareTo(platform){
    const encUrl=encodeURIComponent(url);
    const encText=encodeURIComponent(shareText);
    let target="";
    if(platform==="facebook")target=`https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;
    else if(platform==="whatsapp")target=`https://wa.me/?text=${encText}%20${encUrl}`;
    else if(platform==="viber")target=`viber://forward?text=${encText}%20${encUrl}`;
    else if(platform==="telegram")target=`https://t.me/share/url?url=${encUrl}&text=${encText}`;
    else if(platform==="twitter")target=`https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}`;
    if(target)window.open(target,"_blank","noopener,noreferrer");
  }
  async function copyLink(){
    try{
      await navigator.clipboard.writeText(url);
      toast(lang==="el"?"Σύνδεσμος αντιγράφηκε!":"Link copied!","success");
    }catch(e){toast(lang==="el"?"Δεν μπόρεσε να αντιγραφεί":"Could not copy","error");}
    onClose();
  }
  const opts=[
    {id:"facebook",label:"Facebook",icon:"📘",bg:"#1877f2"},
    {id:"whatsapp",label:"WhatsApp",icon:"💬",bg:"#25d366"},
    {id:"viber",label:"Viber",icon:"📞",bg:"#7360f2"},
    {id:"telegram",label:"Telegram",icon:"✈️",bg:"#0088cc"},
    {id:"twitter",label:"X / Twitter",icon:"🐦",bg:"#000"}
  ];
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:T.bgAlt,borderRadius:"20px",padding:"24px",width:"100%",maxWidth:"380px",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
        <h3 style={{margin:0,color:T.text,fontSize:"17px",fontWeight:800}}>📲 {lang==="el"?"Κοινοποίηση":"Share"}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",color:T.textLight,cursor:"pointer",fontSize:"24px"}}>×</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"14px"}}>
        {opts.map(o=>(
          <button key={o.id} onClick={()=>{shareTo(o.id);onClose();}} style={{background:T.bg,border:"none",borderRadius:"14px",padding:"14px 8px",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
            <div style={{width:"42px",height:"42px",borderRadius:"50%",background:o.bg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px"}}>{o.icon}</div>
            <span style={{color:T.text,fontSize:"11px",fontWeight:700}}>{o.label}</span>
          </button>
        ))}
        <button onClick={copyLink} style={{background:T.bg,border:"none",borderRadius:"14px",padding:"14px 8px",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
          <div style={{width:"42px",height:"42px",borderRadius:"50%",background:T.text,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px"}}>🔗</div>
          <span style={{color:T.text,fontSize:"11px",fontWeight:700}}>{lang==="el"?"Αντιγραφή":"Copy"}</span>
        </button>
      </div>
    </div>
  </div>;
}

function GalleryPicker({gallery,onChange}){
  const {lang}=useLang();
  const [uploading,setUploading]=useState(false);
  async function uploadPhoto(e){
    const files=e.target.files;
    if(!files||files.length===0)return;
    setUploading(true);
    const uploaded=[];
    for(const file of files){
      const ext=file.name.split(".").pop();
      const path=`gallery-${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
      const {error:upErr}=await supabase.storage.from("race-banners").upload(path,file,{upsert:true});
      if(upErr){toast("⚠️ "+upErr.message,"error");continue;}
      const {data:{publicUrl}}=supabase.storage.from("race-banners").getPublicUrl(path);
      uploaded.push({id:Date.now().toString()+Math.random().toString(36).slice(2,6),url:publicUrl,caption:""});
    }
    onChange([...(gallery||[]),...uploaded]);
    setUploading(false);
    e.target.value="";
  }
  function removePhoto(id){onChange((gallery||[]).filter(p=>p.id!==id));}
  function updateCaption(id,caption){onChange((gallery||[]).map(p=>p.id===id?{...p,caption}:p));}
  return <F label={lang==="el"?"📸 Φωτογραφίες / Gallery":"📸 Photo Gallery"}>
    <div style={{color:T.textMid,fontSize:"12px",marginBottom:"10px"}}>{lang==="el"?"Ανεβάστε φωτογραφίες του αγώνα ή προηγούμενων εκδόσεων.":"Upload race photos or photos from past editions."}</div>
    {(gallery||[]).length>0&&(
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:"10px",marginBottom:"12px"}}>
        {gallery.map(p=>(
          <div key={p.id} style={{position:"relative",borderRadius:"10px",overflow:"hidden",background:T.bg,border:`1px solid ${T.border}`}}>
            <img src={p.url} alt="" style={{width:"100%",height:"100px",objectFit:"cover",display:"block"}}/>
            <button onClick={()=>removePhoto(p.id)} type="button" style={{position:"absolute",top:"6px",right:"6px",background:"rgba(220,38,38,0.95)",color:"#fff",border:"none",borderRadius:"50%",width:"26px",height:"26px",cursor:"pointer",fontSize:"14px",fontFamily:"inherit",fontWeight:700,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            <input value={p.caption||""} onChange={e=>updateCaption(p.id,e.target.value)} placeholder={lang==="el"?"Λεζάντα...":"Caption..."} style={{width:"100%",border:"none",padding:"6px 8px",fontSize:"11px",background:T.bg,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
          </div>
        ))}
      </div>
    )}
    <label style={{display:"block",cursor:uploading?"wait":"pointer",background:T.bg,border:`2px dashed ${T.border}`,borderRadius:"10px",padding:"20px",textAlign:"center",color:T.textMid,fontSize:"13px",opacity:uploading?0.6:1}}>
      {uploading?(lang==="el"?"Ανέβασμα...":"Uploading..."):(lang==="el"?"📷 Επιλέξτε φωτογραφίες (μπορείτε πολλές)":"📷 Choose photos (multiple allowed)")}
      <input type="file" accept="image/*" multiple onChange={uploadPhoto} style={{display:"none"}} disabled={uploading}/>
    </label>
  </F>;
}

function GalleryDisplay({gallery}){
  const {lang}=useLang();
  const [zoomedIndex,setZoomedIndex]=useState(null);
  if(!gallery||gallery.length===0)return null;
  function close(){setZoomedIndex(null);}
  function prev(e){if(e)e.stopPropagation();setZoomedIndex(i=>(i-1+gallery.length)%gallery.length);}
  function next(e){if(e)e.stopPropagation();setZoomedIndex(i=>(i+1)%gallery.length);}
  return <>
    <div style={{background:T.bgAlt,borderRadius:"16px",padding:"24px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <h3 style={{margin:"0 0 18px",color:T.text,fontSize:"15px",fontWeight:800,letterSpacing:"-0.01em"}}>📸 {lang==="el"?"Φωτογραφίες":"Photos"} <span style={{color:T.textLight,fontWeight:600,fontSize:"13px"}}>({gallery.length})</span></h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:"10px"}}>
        {gallery.map((p,i)=>(
          <button key={p.id||i} onClick={()=>setZoomedIndex(i)} type="button" style={{padding:0,border:"none",background:"none",cursor:"pointer",borderRadius:"12px",overflow:"hidden",position:"relative",aspectRatio:"1/1",transition:"transform 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.03)";}} onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}>
            <img src={p.url} alt={p.caption||""} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} loading="lazy"/>
          </button>
        ))}
      </div>
    </div>
    {zoomedIndex!==null&&(
      <div onClick={close} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",cursor:"pointer"}}>
        <button onClick={e=>{e.stopPropagation();close();}} aria-label="Close" style={{position:"absolute",top:"20px",right:"20px",background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",border:"none",color:"#fff",width:"44px",height:"44px",borderRadius:"50%",cursor:"pointer",fontSize:"22px",fontFamily:"inherit",zIndex:2}}>×</button>
        {gallery.length>1&&<button onClick={prev} aria-label="Previous" style={{position:"absolute",left:"20px",top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",border:"none",color:"#fff",width:"50px",height:"50px",borderRadius:"50%",cursor:"pointer",fontSize:"24px",fontFamily:"inherit",zIndex:2}}>‹</button>}
        <div onClick={e=>e.stopPropagation()} style={{maxWidth:"90vw",maxHeight:"90vh",display:"flex",flexDirection:"column",alignItems:"center",gap:"12px"}}>
          <img src={gallery[zoomedIndex].url} alt="" style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:"8px",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}/>
          {gallery[zoomedIndex].caption&&<div style={{color:"#fff",fontSize:"14px",textAlign:"center",maxWidth:"600px"}}>{gallery[zoomedIndex].caption}</div>}
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:"12px"}}>{zoomedIndex+1} / {gallery.length}</div>
        </div>
        {gallery.length>1&&<button onClick={next} aria-label="Next" style={{position:"absolute",right:"20px",top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",border:"none",color:"#fff",width:"50px",height:"50px",borderRadius:"50%",cursor:"pointer",fontSize:"24px",fontFamily:"inherit",zIndex:2}}>›</button>}
      </div>
    )}
  </>;
}

function HomeServicesSection(){
  const {lang}=useLang();
  const services=[
    {icon:"🎤",titleEl:"Ηχητική Κάλυψη",titleEn:"Sound Coverage",descEl:"Επαγγελματικός εξοπλισμός ήχου & MC",descEn:"Professional sound equipment & MC"},
    {icon:"🎨",titleEl:"Γραφιστικά",titleEn:"Graphics",descEl:"Αφίσες, banner, social media",descEn:"Posters, banners, social media"},
    {icon:"📹",titleEl:"Κάλυψη με Drone",titleEn:"Drone Coverage",descEl:"Αεροφωτογραφίες & βίντεο HD",descEn:"Aerial photos & HD video"},
    {icon:"🎫",titleEl:"BIB Numbers",titleEn:"BIB Numbers",descEl:"Εκτύπωση & παράδοση",descEn:"Print & delivery"},
    {icon:"⏱",titleEl:"Χρονομέτρηση",titleEn:"Timing",descEl:"Chip timing & live αποτελέσματα",descEn:"Chip timing & live results"},
    {icon:"📋",titleEl:"Διαχείριση Εγγραφών",titleEn:"Registration Management",descEl:"Online platform & υποστήριξη",descEn:"Online platform & support"}
  ];
  return <div style={{margin:"24px 0 32px"}}>
    <div style={{textAlign:"center",marginBottom:"20px"}}>
      <h2 style={{margin:"0 0 6px",color:T.text,fontSize:"22px",fontWeight:900,letterSpacing:"-0.02em"}}>{lang==="el"?"Οι Υπηρεσίες μας":"Our Services"}</h2>
      <p style={{margin:0,color:T.textMid,fontSize:"14px",maxWidth:"560px",marginLeft:"auto",marginRight:"auto",lineHeight:1.5}}>{lang==="el"?"Ολοκληρωμένη υποστήριξη για διοργανωτές αγώνων δρόμου & trail running":"Complete support for race organizers - running, trail & more"}</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:"12px"}}>
      {services.map((s,i)=>(
        <div key={i} style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"16px 18px",transition:"all 0.2s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.08)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
          <div style={{fontSize:"28px",marginBottom:"8px"}}>{s.icon}</div>
          <div style={{color:T.text,fontSize:"14px",fontWeight:800,marginBottom:"4px"}}>{lang==="el"?s.titleEl:s.titleEn}</div>
          <div style={{color:T.textMid,fontSize:"12px",lineHeight:1.4}}>{lang==="el"?s.descEl:s.descEn}</div>
        </div>
      ))}
    </div>
  </div>;
}

function PublicHomePage(){
  const {t,lang}=useLang();
  const [showLogin,setShowLogin]=useState(false);
  const [viewResults,setViewResults]=useState(null);
  const [publicRaces,setPublicRaces]=useState([]);
  const [loading,setLoading]=useState(true);
  const [searchQuery,setSearchQuery]=useState("");
  const [filterMonth,setFilterMonth]=useState("all");
  const [sortBy,setSortBy]=useState("date_asc");
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
          <DarkModeToggle/><LangToggle/>
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
<RecentRegistrationsTicker/>
        <HomeServicesSection/>
        <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} style={{width:"100%",padding:"12px 16px",fontSize:"14px",borderRadius:"10px",border:`1px solid ${T.border}`,background:T.bgAlt,color:T.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginTop:"10px"}}>
          <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{padding:"8px 12px",fontSize:"13px",borderRadius:"8px",border:`1px solid ${T.border}`,background:T.bgAlt,color:T.text,fontFamily:"inherit",cursor:"pointer"}}>
            <option value="all">📅 {lang==="el"?"Όλοι οι μήνες":"All months"}</option>
            <option value="1">Ιανουάριος</option><option value="2">Φεβρουάριος</option><option value="3">Μάρτιος</option>
            <option value="4">Απρίλιος</option><option value="5">Μάιος</option><option value="6">Ιούνιος</option>
            <option value="7">Ιούλιος</option><option value="8">Αύγουστος</option><option value="9">Σεπτέμβριος</option>
            <option value="10">Οκτώβριος</option><option value="11">Νοέμβριος</option><option value="12">Δεκέμβριος</option>
          </select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:"8px 12px",fontSize:"13px",borderRadius:"8px",border:`1px solid ${T.border}`,background:T.bgAlt,color:T.text,fontFamily:"inherit",cursor:"pointer"}}>
            <option value="date_asc">📅 {lang==="el"?"Πιο κοντινός":"Soonest first"}</option>
            <option value="date_desc">📅 {lang==="el"?"Πιο μακρινός":"Latest first"}</option>
            <option value="name">🔤 {lang==="el"?"Όνομα Α-Ω":"Name A-Z"}</option>
          </select>
        </div>
      </div>

      {loading?(
        <SkeletonGrid count={4}/>
      ):(()=>{
        const q=searchQuery.trim().toLowerCase();
        let filtered=q?publicRaces.filter(r=>(r.name||"").toLowerCase().includes(q)||(r.location||"").toLowerCase().includes(q)):publicRaces;
        if(filterMonth!=="all")filtered=filtered.filter(r=>r.date&&new Date(r.date).getMonth()+1===parseInt(filterMonth));
        filtered=[...filtered].sort((a,b)=>{
          if(sortBy==="date_asc")return new Date(a.date||0)-new Date(b.date||0);
          if(sortBy==="date_desc")return new Date(b.date||0)-new Date(a.date||0);
          if(sortBy==="name")return(a.name||"").localeCompare(b.name||"","el");
          return 0;
        });
        if(publicRaces.length===0)return <EmptyState icon="🏃" title={lang==="el"?"Δεν υπάρχουν διαθέσιμοι αγώνες":"No available races"} message={lang==="el"?"Επίσκεψέ μας ξανά σύντομα για νέους αγώνες!":"Check back soon for new races!"}/>;
        if(filtered.length===0)return <EmptyState icon="🔍" title={lang==="el"?"Δεν βρέθηκαν αγώνες":"No races found"} message={lang==="el"?"Δοκίμασε διαφορετική αναζήτηση":"Try a different search"}/>;
        return (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"18px"}}>
          {filtered.map(race=>{
            const distances=race.distance?race.distance.split(" | "):[];
            const hasEarlyBird=race.early_bird&&race.early_bird.deadline&&new Date()<=new Date(race.early_bird.deadline);
            const statusConfig={
              upcoming:{label:t.statusUpcoming,bg:"rgba(16,185,129,0.95)",icon:"🟢"},
              active:{label:t.statusActive,bg:"rgba(59,130,246,0.95)",icon:"🔵"},
              finished:{label:t.statusFinished,bg:"rgba(107,114,128,0.95)",icon:"⚫"}
            };
            const status=statusConfig[race.status]||statusConfig.upcoming;
            const isSoldOut=race.max_runners&&race.registrations_count>=race.max_runners;
            const daysOld=race.created_at?Math.floor((Date.now()-new Date(race.created_at).getTime())/86400000):999;
            const isNew=daysOld<=7;
            return <div key={race.id} onClick={()=>openLogin()} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openLogin();}}} style={{background:T.bgAlt,borderRadius:"20px",overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",transition:"transform 0.2s ease, box-shadow 0.2s ease"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px) scale(1.005)";e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)";}}>
              <div style={{position:"relative",width:"100%",aspectRatio:"16/10",background:`linear-gradient(135deg,${T.primary},${T.accent})`,overflow:"hidden"}}>
                {race.banner_url&&<img src={race.banner_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>}
                <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)"}}/>
                <div style={{position:"absolute",top:"14px",right:"14px",display:"flex",gap:"8px",alignItems:"center"}}>
                  {hasEarlyBird&&<span style={{background:"rgba(212,160,23,0.95)",backdropFilter:"blur(8px)",color:"#fff",padding:"5px 11px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.04em"}}>🏷 -{race.early_bird.discount_percent}%</span>}
                  <RaceCountdown date={race.date} compact lang={lang}/>
                  <span style={{background:status.bg,backdropFilter:"blur(8px)",color:"#fff",padding:"6px 13px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",display:"inline-flex",alignItems:"center",gap:"4px",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}>{status.icon} {status.label}</span>
                  {isSoldOut&&<span style={{background:"rgba(220,38,38,0.95)",backdropFilter:"blur(8px)",color:"#fff",padding:"6px 13px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",boxShadow:"0 2px 8px rgba(220,38,38,0.3)"}}>🔴 {lang==="el"?"ΕΞΑΝΤΛΗΘΗΚΕ":"SOLD OUT"}</span>}
                  {isNew&&!isSoldOut&&<span style={{background:"rgba(168,85,247,0.95)",backdropFilter:"blur(8px)",color:"#fff",padding:"6px 13px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",boxShadow:"0 2px 8px rgba(168,85,247,0.3)"}}>✨ {lang==="el"?"ΝΕΟ":"NEW"}</span>}
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
        <DarkModeToggle/><LangToggle/>
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
  const {t,lang}=useLang();
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
        <DarkModeToggle/><LangToggle/>
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
                <div style={{color:T.text,fontWeight:700,fontSize:"15px",marginBottom:"4px"}}>{reg.runner.first_name} {reg.runner.last_name}</div>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap",fontSize:"12px"}}>
                  {reg.distance&&<span style={{background:`${T.primary}15`,color:T.primary,padding:"2px 8px",borderRadius:"6px",fontWeight:600}}>🏃 {reg.distance}</span>}
                  {reg.runner.club&&<span style={{background:`${T.accent}15`,color:T.accent,padding:"2px 8px",borderRadius:"6px",fontWeight:600}}>👥 {reg.runner.club}</span>}
                  {reg.runner.city&&<span style={{background:T.bg,color:T.textMid,padding:"2px 8px",borderRadius:"6px",fontWeight:600}}>📍 {reg.runner.city}</span>}
                </div>
              </div>
              <div style={{flexShrink:0}}>
                {reg.payment_status==="paid"?(
                  <span style={{background:`${T.accent}15`,color:T.accent,border:`1px solid ${T.accent}44`,padding:"4px 10px",borderRadius:"999px",fontSize:"11px",fontWeight:700,whiteSpace:"nowrap"}}>✅ {lang==="el"?"Επιβεβαιώθηκε":"Confirmed"}</span>
                ):(
                  <span style={{background:`${T.warning}15`,color:T.warning,border:`1px solid ${T.warning}44`,padding:"4px 10px",borderRadius:"999px",fontSize:"11px",fontWeight:700,whiteSpace:"nowrap"}}>⏳ {lang==="el"?"Εκκρεμεί":"Pending"}</span>
                )}
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
    const {data,error}=await supabase.auth.signUp({
      email,
      password,
      options:{
        data:{
          full_name:name,
          role:role
        }
      }
    });
    if(error){setError(error.message);setLoading(false);return;}
    if(data.user){
      // Trigger automatically creates profile from metadata
      // No need for manual insert anymore
      setError(role==="organizer"?t.signupOk:t.checkEmail);
    }
    setLoading(false);
  }
  const roleColor=role==="organizer"?T.primary:T.accent;
  const roleIcon=role==="organizer"?"🏟":"🏃";
  const roleLabel=role==="organizer"?t.organizer:t.athlete;
  return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif",padding:"20px",position:"relative"}}>
    <div style={{position:"absolute",top:"20px",right:"20px"}}><DarkModeToggle/><LangToggle/></div>
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
        <RaceCountdown date={race.date} compact lang="el"/>
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

function DOBInput({value,onChange,label}){
  const {lang}=useLang();
  // Convert YYYY-MM-DD → DD/MM/YYYY for display
  function toDisplay(v){
    if(!v)return"";
    const p=v.split("-");
    if(p.length!==3)return v;
    const[y,m,d]=p;
    return `${d||""}/${m||""}/${y||""}`.replace(/^\/+|\/+$/g,"");
  }
  // Convert DD/MM/YYYY → YYYY-MM-DD for save
  function toISO(v){
    if(!v)return"";
    const digits=v.replace(/\D/g,"");
    if(digits.length<8)return"";
    const d=digits.slice(0,2),m=digits.slice(2,4),y=digits.slice(4,8);
    return `${y}-${m}-${d}`;
  }
  function handleChange(raw){
    // Allow only digits + auto-add slashes
    let digits=raw.replace(/\D/g,"").slice(0,8);
    let formatted=digits;
    if(digits.length>=3)formatted=digits.slice(0,2)+"/"+digits.slice(2);
    if(digits.length>=5)formatted=digits.slice(0,2)+"/"+digits.slice(2,4)+"/"+digits.slice(4);
    // Save: if complete, save ISO; else save raw display so next render preserves it
    if(digits.length===8){
      const iso=toISO(formatted);
      onChange(iso);
    }else if(digits.length===0){
      onChange("");
    }else{
      // Partial: save as raw display so we don't lose it
      onChange(formatted);
    }
  }
  // What to show
  const display=(value&&value.includes("-"))?toDisplay(value):(value||"");
  return <div style={{marginBottom:"14px"}}>
    {label&&<label style={{...css.label,marginBottom:"6px"}}>{label}</label>}
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9/]*"
      placeholder={lang==="el"?"ΗΗ/ΜΜ/ΕΕΕΕ (π.χ. 09/05/1986)":"DD/MM/YYYY (e.g. 09/05/1986)"}
      value={display}
      onChange={e=>handleChange(e.target.value)}
      maxLength={10}
      style={{width:"100%",padding:"12px 14px",fontSize:"16px",borderRadius:"8px",border:`1px solid ${T.border}`,background:T.bg,color:T.text,fontFamily:"inherit",outline:"none",letterSpacing:"0.5px",boxSizing:"border-box"}}
    />
    <div style={{fontSize:"11px",color:T.textLight,marginTop:"4px"}}>{lang==="el"?"Παράδειγμα: 09/05/1986":"Example: 09/05/1986"}</div>
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
    emergency_name:"",emergency_phone:"",medical_cert:false,
    nationality:"Ελληνική",
    gdpr_consent:false,terms_consent:false
  });
  const [customAnswers,setCustomAnswers]=useState({});
  const [showLegalPage,setShowLegalPage]=useState(null);
  const [loading,setLoading]=useState(false);
  const priceInfo=calculatePrice(race,form.distance);
  function updateCustom(id,value){setCustomAnswers({...customAnswers,[id]:value});}
  function set(k,v){setForm({...form,[k]:v});}

  async function submit(){
    if(!form.first_name.trim()||!form.last_name.trim()){toast("Συμπληρώστε Όνομα και Επώνυμο!","warning");return;}
    if(!form.distance){toast(t.selectDistance,"warning");return;}
    if(!form.city||!form.city.trim()){toast("📍 Συμπληρώστε τόπο διαμονής","warning");return;}
    if(!form.nationality||!form.nationality.trim()){toast("🌍 Συμπληρώστε εθνικότητα","warning");return;}
    // Phone validation
    if(form.phone){
      const phoneCheck=validateGreekPhone(form.phone);
      if(!phoneCheck.valid){toast("📞 "+phoneCheck.error,"warning");return;}
    }
    // AMKA validation
    if(form.amka){
      const amkaCheck=validateAMKA(form.amka);
      if(!amkaCheck.valid){toast("🆔 "+amkaCheck.error,"warning");return;}
    }
    // Emergency phone validation
    if(form.emergency_phone){
      const epCheck=validateGreekPhone(form.emergency_phone);
      if(!epCheck.valid){toast("📞 Τηλέφωνο επικοινωνίας: "+epCheck.error,"warning");return;}
    }
    for(const f of customFields){if(f.required&&!customAnswers[f.id]&&customAnswers[f.id]!==false){toast(`${t.pleaseComplete} ${f.label}`,"warning");return;}}
    // GDPR consent validation
    if(!form.terms_consent){toast("📋 Πρέπει να αποδεχτείτε τους Όρους Χρήσης","warning");return;}
    if(!form.gdpr_consent){toast("🛡 Πρέπει να συναινέσετε στην επεξεργασία δεδομένων (GDPR)","warning");return;}
    setLoading(true);
    // Step 1. Find or create runner profile
    const {data:foundRunner}=await supabase.from("runners").select("*").eq("email",session.user.email).maybeSingle();
    let runner=foundRunner;
    const runnerData={
      first_name:form.first_name.trim(),last_name:form.last_name.trim(),
      email:session.user.email,phone:form.phone,dob:form.dob||null,
      gender:form.gender,club:form.club,amka:form.amka,city:form.city,nationality:form.nationality||"Ελληνική",
      emergency_name:form.emergency_name,emergency_phone:form.emergency_phone
    ,gdpr_consent_at:new Date().toISOString()};
    if(!runner){
      const {data,error}=await supabase.from("runners").insert([runnerData]).select().maybeSingle();
      if(error){toast("Σφάλμα δημιουργίας προφίλ: "+error.message,"error");setLoading(false);return;}
      runner=data;
    } else {
      await supabase.from("runners").update(runnerData).eq("id",runner.id);
    }
    if(!runner){toast("Σφάλμα: δεν βρέθηκε προφίλ.","error");setLoading(false);return;}
    // Step 2. Check ONLY this specific race - allow same email in other races
    const {data:existing}=await supabase.from("registrations").select("id,bib_number").eq("runner_id",runner.id).eq("race_id",race.id).maybeSingle();
    if(existing){toast(t.alreadyRegAlert+(existing.bib_number?` BIB #${existing.bib_number}`:""),"warning");setLoading(false);return;}
    // Step 3. Assign BIB and create the registration
    const {data:allRegs}=await supabase.from("registrations").select("bib_number").eq("race_id",race.id);
    const maxBib=(allRegs||[]).reduce((mx,r)=>Math.max(mx,parseInt(r.bib_number)||0),0);
    const bibNum=(maxBib+1).toString();
    const {error:regError}=await supabase.from("registrations").insert([{runner_id:runner.id,race_id:race.id,distance:form.distance,category:form.category,tshirt:form.tshirt,medical_cert:form.medical_cert,bib_number:bibNum,custom_answers:customAnswers,price_paid:priceInfo.final,gdpr_consent_at:new Date().toISOString()}]);
    // Send confirmation email to athlete
    if(!regError){
      const emailSubject=`✅ Επιβεβαίωση Εγγραφής - ${race.name}`;
      const emailBody=`
        <p>Γεια σας <strong>${form.first_name} ${form.last_name}</strong>,</p>
        <p>Η εγγραφή σας στον αγώνα ολοκληρώθηκε επιτυχώς!</p>
        <div style="background:#f5f7ff;border-left:4px solid #4a5dc7;padding:18px 22px;margin:20px 0;border-radius:8px;">
          <p style="margin:0 0 8px;"><strong>🏁 Αγώνας:</strong> ${race.name}</p>
          <p style="margin:0 0 8px;"><strong>📅 Ημερομηνία:</strong> ${race.date}</p>
          <p style="margin:0 0 8px;"><strong>📍 Τοποθεσία:</strong> ${race.location||"—"}</p>
          <p style="margin:0 0 8px;"><strong>🏃 Απόσταση:</strong> ${form.distance}</p>
          ${bibNum?`<p style="margin:0 0 8px;"><strong>🎫 Νούμερο BIB:</strong> #${bibNum}</p>`:""}
          ${priceInfo.final>0?`<p style="margin:0;"><strong>💰 Κόστος:</strong> ${priceInfo.final.toFixed(2)}€</p>`:""}
        </div>
        <p>Καλή επιτυχία στον αγώνα! 🏃‍♂️💨</p>
        <p style="margin-top:24px;"><a href="https://racemanagement.gr" style="background:#4a5dc7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">Δείτε τη σελίδα του αγώνα →</a></p>
      `;
      sendEmail(session.user.email,emailSubject,emailTemplate(`Επιβεβαίωση Εγγραφής`,emailBody));
      // Send notification to organizer
      try{
        const {data:orgData}=await supabase.from("profiles").select("email,full_name").eq("id",race.user_id).single();
        if(orgData?.email){
          const orgSubject=`🔔 Νέα Εγγραφή - ${race.name}`;
          const orgBody=`
            <p>Γεια σας <strong>${orgData.full_name||""}</strong>,</p>
            <p>Νέα εγγραφή στον αγώνα σας <strong>"${race.name}"</strong>!</p>
            <div style="background:#f5f7ff;border-left:4px solid #4a5dc7;padding:18px 22px;margin:20px 0;border-radius:8px;">
              <p style="margin:0 0 8px;"><strong>👤 Αθλητής:</strong> ${form.first_name} ${form.last_name}</p>
              <p style="margin:0 0 8px;"><strong>✉️ Email:</strong> ${session.user.email}</p>
              ${form.phone?`<p style="margin:0 0 8px;"><strong>📞 Τηλέφωνο:</strong> ${form.phone}</p>`:""}
              <p style="margin:0 0 8px;"><strong>🏃 Απόσταση:</strong> ${form.distance}</p>
              <p style="margin:0 0 8px;"><strong>🎫 Νούμερο BIB:</strong> #${bibNum}</p>
              ${form.city?`<p style="margin:0 0 8px;"><strong>📍 Πόλη:</strong> ${form.city}</p>`:""}
              ${priceInfo.final>0?`<p style="margin:0;"><strong>💰 Πληρωμή:</strong> ${priceInfo.final.toFixed(2)}€</p>`:""}
            </div>
            <p style="margin-top:24px;"><a href="https://racemanagement.gr" style="background:#4a5dc7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">Δείτε όλες τις εγγραφές →</a></p>
          `;
          sendEmail(orgData.email,orgSubject,emailTemplate("Νέα Εγγραφή!",orgBody));
        }
      }catch(err){console.error("Failed to email organizer:",err);}
    }
    if(regError){toast("Σφάλμα εγγραφής: "+regError.message,"error");setLoading(false);return;}
    setLoading(false);
    toast(`✅ Εγγραφή Επιτυχής! BIB #${bibNum} · ${form.distance} · ${priceInfo.final.toFixed(2)}€`,"success");
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
      <DOBInput label={t.dob} value={form.dob} onChange={v=>set("dob",v)}/>
      <Sel label={t.gender} value={form.gender} onChange={e=>set("gender",e.target.value)}><option>{t.male}</option><option>{t.female}</option><option>{t.other}</option></Sel>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
      <In label={t.club} value={form.club} onChange={e=>set("club",e.target.value)} placeholder={t.optional}/>
      <In label="Πόλη / Τόπος Διαμονής *" value={form.city} onChange={e=>set("city",e.target.value)} placeholder="Π.χ. Αθήνα"/>
      <In label="Εθνικότητα *" value={form.nationality} onChange={e=>set("nationality",e.target.value)} placeholder="Π.χ. Ελληνική"/>
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
    <label style={{display:"flex",alignItems:"center",gap:"8px",color:T.textMid,fontSize:"13px",cursor:"pointer",marginBottom:"10px"}}><input type="checkbox" checked={form.medical_cert} onChange={e=>set("medical_cert",e.target.checked)}/>{t.medicalCert}</label>
    <div style={{background:`${T.primary}08`,border:`1px solid ${T.primary}22`,borderRadius:"10px",padding:"12px 14px",marginBottom:"16px"}}>
      <label style={{display:"flex",alignItems:"flex-start",gap:"10px",color:T.text,fontSize:"13px",cursor:"pointer",marginBottom:"10px",lineHeight:1.5}}>
        <input type="checkbox" checked={form.terms_consent} onChange={e=>set("terms_consent",e.target.checked)} style={{marginTop:"2px",flexShrink:0}}/>
        <span>📋 Αποδέχομαι τους <button type="button" onClick={()=>setShowLegalPage("terms")} style={{background:"none",border:"none",color:T.primary,fontWeight:700,cursor:"pointer",textDecoration:"underline",padding:0,font:"inherit"}}>Όρους Χρήσης</button> *</span>
      </label>
      <label style={{display:"flex",alignItems:"flex-start",gap:"10px",color:T.text,fontSize:"13px",cursor:"pointer",lineHeight:1.5}}>
        <input type="checkbox" checked={form.gdpr_consent} onChange={e=>set("gdpr_consent",e.target.checked)} style={{marginTop:"2px",flexShrink:0}}/>
        <span>🛡 Συναινώ στην επεξεργασία των προσωπικών μου δεδομένων σύμφωνα με την <button type="button" onClick={()=>setShowLegalPage("privacy")} style={{background:"none",border:"none",color:T.primary,fontWeight:700,cursor:"pointer",textDecoration:"underline",padding:0,font:"inherit"}}>Πολιτική Απορρήτου</button> (GDPR) *</span>
      </label>
    </div>
    <div style={{display:"flex",gap:"10px"}}>
      <Btn onClick={submit} style={{flex:1}} disabled={loading}>{loading?"...":`${t.confirmReg}${priceInfo.final>0?` (${priceInfo.final.toFixed(2)}€)`:""}`}</Btn>
      <Btn v="sec" onClick={onClose} style={{flex:1}}>{t.cancel}</Btn>
    </div>
    {showLegalPage&&<LegalModal page={showLegalPage} onClose={p=>setShowLegalPage(p)}/>}
  </Modal>;
}

function AthleteProfile({runners,registrations,races,session,profile,onRefresh}){
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
    if(error)toast("Σφάλμα: "+error.message,"error");
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
    if(upErr){toast("Σφάλμα: "+upErr.message,"error");setUploading(false);return;}
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
    {profile?.athlete_id&&(
      <div style={{background:`linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,borderRadius:"16px",padding:"20px 24px",marginBottom:"20px",color:"#fff",boxShadow:`0 8px 24px ${T.primary}33`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
          <div>
            <div style={{fontSize:"11px",opacity:0.85,letterSpacing:"0.15em",textTransform:"uppercase",fontWeight:600,marginBottom:"4px"}}>Athlete ID</div>
            <div style={{fontSize:"28px",fontWeight:900,fontFamily:"monospace",letterSpacing:"0.05em"}}>{profile.athlete_id}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:"16px",fontWeight:700}}>{myRunner?.first_name} {myRunner?.last_name}</div>
            <div style={{fontSize:"12px",opacity:0.85,marginTop:"2px"}}>{session?.user?.email}</div>
          </div>
        </div>
      </div>
    )}
    <h2 style={{margin:"0 0 20px",color:T.text,fontSize:"20px"}}>{t.profileTitle}</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:"12px",marginBottom:"20px"}}>
      <div style={{background:`linear-gradient(135deg, ${T.primary}15 0%, ${T.primary}08 100%)`,border:`1px solid ${T.primary}33`,borderRadius:"14px",padding:"18px 16px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{fontSize:"28px",marginBottom:"4px"}}>🏃</div>
        <div style={{fontSize:"28px",fontWeight:900,color:T.primary,lineHeight:1}}>{totalRaces}</div>
        <div style={{fontSize:"10px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"6px",fontWeight:700}}>{t.statTotalRaces}</div>
      </div>
      <div style={{background:`linear-gradient(135deg, ${T.accent}15 0%, ${T.accent}08 100%)`,border:`1px solid ${T.accent}33`,borderRadius:"14px",padding:"18px 16px",textAlign:"center"}}>
        <div style={{fontSize:"28px",marginBottom:"4px"}}>✅</div>
        <div style={{fontSize:"28px",fontWeight:900,color:T.accent,lineHeight:1}}>{finishedCount}</div>
        <div style={{fontSize:"10px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"6px",fontWeight:700}}>{t.statFinished}</div>
      </div>
      <div style={{background:`linear-gradient(135deg, ${T.warning}15 0%, ${T.warning}08 100%)`,border:`1px solid ${T.warning}33`,borderRadius:"14px",padding:"18px 16px",textAlign:"center"}}>
        <div style={{fontSize:"28px",marginBottom:"4px"}}>⏳</div>
        <div style={{fontSize:"28px",fontWeight:900,color:T.warning,lineHeight:1}}>{upcomingCount}</div>
        <div style={{fontSize:"10px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"6px",fontWeight:700}}>{t.statUpcoming}</div>
      </div>
      <div style={{background:`linear-gradient(135deg, ${T.text}15 0%, ${T.text}05 100%)`,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"18px 16px",textAlign:"center"}}>
        <div style={{fontSize:"28px",marginBottom:"4px"}}>📏</div>
        <div style={{fontSize:"28px",fontWeight:900,color:T.text,lineHeight:1}}>{totalKm.toFixed(0)}<span style={{fontSize:"14px",fontWeight:600,opacity:0.6}}>km</span></div>
        <div style={{fontSize:"10px",color:T.textMid,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"6px",fontWeight:700}}>{t.statTotalKm}</div>
      </div>
    </div>
    {/* Achievements/Badges */}
    {(()=>{
      const badges=[];
      if(totalRaces>=1)badges.push({icon:"🥇",title:lang==="el"?"Πρώτος Αγώνας":"First Race",desc:lang==="el"?"Καλωσήρθες!":"Welcome!"});
      if(totalRaces>=5)badges.push({icon:"⭐",title:lang==="el"?"5 Αγώνες":"5 Races",desc:lang==="el"?"Σταθερός":"Consistent"});
      if(totalRaces>=10)badges.push({icon:"🏆",title:lang==="el"?"10 Αγώνες":"10 Races",desc:lang==="el"?"Veteran":"Veteran"});
      if(totalKm>=42)badges.push({icon:"🏃‍♂️",title:lang==="el"?"Marathon Distance":"Marathon Distance",desc:`${totalKm.toFixed(0)}km`});
      if(totalKm>=100)badges.push({icon:"💯",title:"100km Club",desc:`${totalKm.toFixed(0)}km`});
      if(totalKm>=500)badges.push({icon:"🚀",title:"500km Club",desc:`${totalKm.toFixed(0)}km`});
      if(finishedCount>=3)badges.push({icon:"✅",title:lang==="el"?"3 Ολοκληρωμένοι":"3 Finishers",desc:lang==="el"?"Finisher":"Finisher"});
      if(prList.length>=3)badges.push({icon:"⏱",title:lang==="el"?"3 PRs":"3 PRs",desc:lang==="el"?"Personal Bests":"Personal Bests"});
      if(badges.length===0)return null;
      return <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"16px",padding:"20px",boxShadow:T.shadow,marginBottom:"20px"}}>
        <h3 style={{margin:"0 0 14px",color:T.text,fontSize:"16px",display:"flex",alignItems:"center",gap:"8px"}}>🏅 {lang==="el"?"Επιτεύγματα":"Achievements"}</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:"10px"}}>
          {badges.map((b,i)=>(
            <div key={i} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"14px",textAlign:"center",transition:"all 0.2s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.08)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
              <div style={{fontSize:"32px",marginBottom:"6px"}}>{b.icon}</div>
              <div style={{color:T.text,fontWeight:700,fontSize:"12px",marginBottom:"2px"}}>{b.title}</div>
              <div style={{color:T.textLight,fontSize:"10px"}}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>;
    })()}
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
    {/* My Races - Auto-synced από registrations */}
    <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"16px",padding:"24px",boxShadow:T.shadow,marginBottom:"20px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px",flexWrap:"wrap",gap:"8px"}}>
        <h3 style={{margin:0,color:T.text,fontSize:"17px",fontWeight:800,display:"flex",alignItems:"center",gap:"8px"}}>🗓 Οι Αγώνες μου</h3>
        <div style={{background:T.primary+"15",color:T.primary,padding:"4px 12px",borderRadius:"999px",fontSize:"12px",fontWeight:700}}>{history.length} {history.length===1?"αγώνας":"αγώνες"}</div>
      </div>
      {history.length===0?(
        <div style={{color:T.textLight,fontSize:"13px",textAlign:"center",padding:"30px",background:T.bg,borderRadius:"10px"}}>{lang==="el"?"📭 Δεν έχεις εγγραφεί σε κανέναν αγώνα ακόμα":"📭 No race registrations yet"}</div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {history.map((h,i)=>{
            const isFinished=h.race.status==="finished"||h.finish_time;
            const isUpcoming=h.race.status==="upcoming";
            const isActive=h.race.status==="active";
            const statusBadge=isFinished?{bg:"#10b98115",color:"#059669",label:"✅ "+(lang==="el"?"Ολοκληρώθηκε":"Finished")}:isActive?{bg:"#3b82f615",color:"#2563eb",label:"🔵 "+(lang==="el"?"Σε εξέλιξη":"Active")}:isUpcoming?{bg:"#f59e0b15",color:"#d97706",label:"⏳ "+(lang==="el"?"Επερχόμενος":"Upcoming")}:{bg:T.bg,color:T.textMid,label:h.race.status||"—"};
            return <div key={i} style={{background:T.bg,borderRadius:"12px",padding:"16px 18px",border:`1px solid ${T.border}`,transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.06)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px",flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:T.text,fontWeight:800,fontSize:"15px",marginBottom:"4px"}}>{h.race.name||"—"}</div>
                  <div style={{color:T.textMid,fontSize:"12px",display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center"}}>
                    <span>📅 {h.race.date||"—"}</span>
                    {h.race.location&&<span>📍 {h.race.location}</span>}
                    <span>🏃 {h.distance}</span>
                    {h.bib_number&&<span style={{background:T.primary,color:"#fff",padding:"2px 8px",borderRadius:"6px",fontWeight:700,fontSize:"11px"}}>#{h.bib_number}</span>}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"6px"}}>
                  <span style={{background:statusBadge.bg,color:statusBadge.color,padding:"4px 10px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.05em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{statusBadge.label}</span>
                  {h.finish_time&&<div style={{background:T.text,color:"#fff",padding:"4px 10px",borderRadius:"6px",fontFamily:"monospace",fontWeight:700,fontSize:"13px"}}>⏱ {formatTime(h.finish_time)}</div>}
                  {h.position&&<div style={{color:T.warning,fontWeight:800,fontSize:"13px"}}>🏆 #{h.position}</div>}
                </div>
              </div>
            </div>;
          })}
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
        <DOBInput label={t.dob} value={form.dob||""} onChange={v=>set("dob",v)}/>
        <Sel label={t.gender} value={form.gender||t.male} onChange={e=>set("gender",e.target.value)}><option>{t.male}</option><option>{t.female}</option><option>{t.other}</option></Sel>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <In label={t.club} value={form.club} onChange={e=>set("club",e.target.value)}/>
        <In label="Πόλη / Τόπος Διαμονής *" value={form.city} onChange={e=>set("city",e.target.value)} placeholder="Π.χ. Αθήνα"/>
        <In label="Εθνικότητα *" value={form.nationality} onChange={e=>set("nationality",e.target.value)} placeholder="Π.χ. Ελληνική"/>
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
    // Apparel
    if(p.includes("shirt")||p.includes("μπλούζ")||p.includes("μπλουζ")||p.includes("φανέλ")||p.includes("φανελ"))return "👕";
    if(p.includes("καλτσ")||p.includes("sock"))return "🧦";
    if(p.includes("καπέλ")||p.includes("καπελ")||p.includes("hat")||p.includes("cap"))return "🧢";
    if(p.includes("παπούτσ")||p.includes("παπουτσ")||p.includes("shoe"))return "👟";
    if(p.includes("τσάντ")||p.includes("τσαντ")||p.includes("σακίδ")||p.includes("σακιδ")||p.includes("backpack")||p.includes("bag")||p.includes("goody"))return "🎒";
    if(p.includes("γαντι")||p.includes("γάντι")||p.includes("glove"))return "🧤";
    // Awards/medals
    if(p.includes("medal")||p.includes("μετάλλ")||p.includes("μεταλλ"))return "🏅";
    if(p.includes("κύπελλ")||p.includes("κυπελλ")||p.includes("trophy")||p.includes("award")||p.includes("βραβ"))return "🏆";
    if(p.includes("cert")||p.includes("πιστοπ")||p.includes("diploma")||p.includes("δίπλωμ")||p.includes("διπλωμ"))return "📜";
    // Food & drinks
    if(p.includes("food")||p.includes("φαγητ")||p.includes("γεύμ")||p.includes("γευμ")||p.includes("meal"))return "🍝";
    if(p.includes("σνακ")||p.includes("snack")||p.includes("μπάρ")||p.includes("μπαρ")||p.includes("μπανάν")||p.includes("μπαναν")||p.includes("banana"))return "🍌";
    if(p.includes("καφέ")||p.includes("καφε")||p.includes("coffee"))return "☕";
    if(p.includes("water")||p.includes("νερ"))return "💧";
    if(p.includes("isotonic")||p.includes("ισοτον")||p.includes("gatorade")||p.includes("powerade"))return "🥤";
    if(p.includes("beer")||p.includes("μπίρ")||p.includes("μπιρ"))return "🍺";
    if(p.includes("μπουφέ")||p.includes("μπουφε")||p.includes("buffet"))return "🍽";
    if(p.includes("fruit")||p.includes("φρούτ")||p.includes("φρουτ"))return "🍎";
    // Photos & media
    if(p.includes("photo")||p.includes("φωτογ"))return "📸";
    if(p.includes("video")||p.includes("βίντε")||p.includes("βιντε"))return "🎥";
    // Facilities
    if(p.includes("shower")||p.includes("ντουζ")||p.includes("ντους")||p.includes("μπάνι")||p.includes("μπανι"))return "🚿";
    if(p.includes("parking")||p.includes("πάρκιν")||p.includes("παρκιν"))return "🅿️";
    if(p.includes("bus")||p.includes("λεωφορ")||p.includes("μετακίν")||p.includes("μετακιν")||p.includes("transport"))return "🚌";
    if(p.includes("locker")||p.includes("ντουλάπ")||p.includes("ντουλαπ")||p.includes("φύλαξ")||p.includes("φυλαξ"))return "🔒";
    if(p.includes("massage")||p.includes("μασάζ")||p.includes("μασαζ"))return "💆";
    // Medical & timing
    if(p.includes("medical")||p.includes("ιατρ")||p.includes("doctor")||p.includes("γιατρ"))return "🏥";
    if(p.includes("first aid")||p.includes("πρώτες βοήθ")||p.includes("πρωτες βοηθ"))return "⛑";
    if(p.includes("timing")||p.includes("χρονομέτρ")||p.includes("χρονομετρ")||p.includes("chip"))return "⏱";
    if(p.includes("bib")||p.includes("νούμερ")||p.includes("νουμερ"))return "🎫";
    // Routes & nature
    if(p.includes("gpx")||p.includes("map")||p.includes("χάρτ")||p.includes("χαρτ"))return "🗺";
    if(p.includes("aid")||p.includes("σταθμ"))return "🚰";
    // Tech
    if(p.includes("app")||p.includes("εφαρμογ"))return "📱";
    if(p.includes("wifi"))return "📶";
    // Generic gifts
    if(p.includes("δώρ")||p.includes("δωρ")||p.includes("gift")||p.includes("present"))return "🎁";
    if(p.includes("σήμ")||p.includes("σημ")||p.includes("badge")||p.includes("pin"))return "📌";
    if(p.includes("αυτοκόλλ")||p.includes("αυτοκολλ")||p.includes("sticker"))return "🏷";
    // Activities
    if(p.includes("party")||p.includes("πάρτ")||p.includes("παρτ")||p.includes("γιορτ"))return "🎉";
    if(p.includes("music")||p.includes("μουσικ"))return "🎵";
    return "🎁"; // Default: gift icon (instead of generic ✓)
  }
  function getPerkLabel(perk){return (perk||"").replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s*/u,"").trim()||perk;}

  const [showShareMenu,setShowShareMenu]=useState(false);
  const [showCalendarMenu,setShowCalendarMenu]=useState(false);
  async function share(){
    if(navigator.share){
      try{await navigator.share({title:race.name,text:`${race.name} - ${race.date}`,url:window.location.href});return;}catch(e){}
    }
    setShowShareMenu(true);
  }

  const tabs=[
    {id:"info",label:lang==="el"?"Πληροφορίες":"Information",icon:"ℹ️"},
    {id:"routes",label:lang==="el"?"Διαδρομές":"Routes",icon:"🏃"},
    {id:"map",label:lang==="el"?"Χάρτης":"Map",icon:"🗺"},
    ...(race.documents&&race.documents.length>0?[{id:"documents",label:lang==="el"?"Έγγραφα":"Documents",icon:"📄"}]:[]),
    {id:"perks",label:lang==="el"?"Παροχές":"Benefits",icon:"🎁"},
    ...(race.gallery&&race.gallery.length>0?[{id:"gallery",label:lang==="el"?"Φωτογραφίες":"Photos",icon:"📸"}]:[]),
    ...(race.sponsors&&race.sponsors.length>0?[{id:"sponsors",label:lang==="el"?"Χορηγοί":"Sponsors",icon:"🤝"}]:[]),
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
          <button onClick={()=>setShowCalendarMenu(true)} aria-label="Add to Calendar" title={lang==="el"?"Προσθήκη στο Ημερολόγιο":"Add to Calendar"} style={{background:"rgba(255,255,255,0.18)",backdropFilter:"blur(10px)",border:"none",color:"#fff",borderRadius:"50%",width:"42px",height:"42px",cursor:"pointer",fontSize:"16px",fontFamily:"inherit"}}>📅</button>
          <button onClick={share} aria-label="Share" style={{background:"rgba(255,255,255,0.18)",backdropFilter:"blur(10px)",border:"none",color:"#fff",borderRadius:"50%",width:"42px",height:"42px",cursor:"pointer",fontSize:"16px",fontFamily:"inherit"}}>↗</button>
        </div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"28px 20px 28px"}}>
        <div style={{maxWidth:"1000px",margin:"0 auto"}}>
          <div style={{display:"flex",gap:"8px",marginBottom:"14px",flexWrap:"wrap"}}>
            <span style={{background:status.bg,backdropFilter:"blur(8px)",color:"#fff",padding:"6px 14px",borderRadius:"999px",fontSize:"11px",fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase"}}>{status.label}</span>
            <RaceCountdown date={race.date} lang={lang}/>
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
        {race.location&&<div style={{marginTop:"20px"}}><WeatherWidget location={race.location} raceDate={race.date}/></div>}
        {race.faq&&race.faq.length>0&&<div style={{marginTop:"20px"}}><FAQDisplay faq={race.faq}/></div>}
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
                  <div style={{display:"flex",gap:"14px",flexWrap:"wrap",color:T.textMid,fontSize:"12px",fontWeight:600,alignItems:"center",marginBottom:pricingEntry?.description?"8px":0}}>
                    {km>0&&<span>📏 {km}km</span>}
                    {elevation&&<span>⛰ +{elevation}m</span>}
                    {pr.base>0&&<span style={{color:isMyDistance?T.accent:T.primary,fontSize:"15px",fontWeight:800}}>{pr.isEarlyBird?pr.final.toFixed(2):pr.base}€{pr.isEarlyBird&&<span style={{textDecoration:"line-through",color:T.textLight,marginLeft:"6px",fontSize:"12px",fontWeight:500}}>{pr.base.toFixed(2)}€</span>}</span>}
                  </div>
                  {pricingEntry?.description&&<div style={{color:T.textMid,fontSize:"13px",lineHeight:1.5,marginTop:"4px",whiteSpace:"pre-wrap"}}>{pricingEntry.description}</div>}
                </div>
              </div>
              <button onClick={()=>{if(canRegister)onRegister(race);}} disabled={!canRegister} style={{background:isMyDistance?T.accent:(canRegister?T.primary:T.borderDark),color:"#fff",border:"none",borderRadius:"14px",padding:"14px 28px",fontSize:"14px",fontWeight:800,letterSpacing:"0.02em",cursor:canRegister?"pointer":"default",fontFamily:"inherit",boxShadow:canRegister?"0 4px 14px rgba(74,93,199,0.3)":"none",opacity:canRegister||isMyDistance?1:0.6,minWidth:"140px"}}>{isMyDistance?`✓ ${t.myDistance}`:(canRegister?(lang==="el"?"Εγγραφή →":"Register →"):(race.status==="finished"?t.statusFinished:"—"))}</button>
            </div>;
          })}
        </div>
      </div>)}

      {activeTab==="map"&&(<div>
        {(race.routes||[]).length===0?(
          <div style={{background:T.bgAlt,borderRadius:"16px",padding:"60px 20px",textAlign:"center",color:T.textLight,fontSize:"14px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:"40px",marginBottom:"12px"}}>🗺</div>
            {lang==="el"?"Δεν υπάρχει χάρτης διαδρομής ακόμα":"No route map available yet"}
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
            {race.routes.map((route,i)=>(
              <div key={i} style={{background:T.bgAlt,borderRadius:"16px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                <div style={{padding:"20px 24px"}}>
                  <div style={{color:T.text,fontWeight:800,fontSize:"17px",marginBottom:"10px"}}>🏃 {route.distance}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"10px"}}>
                    <div style={{background:T.bg,borderRadius:"10px",padding:"12px 14px"}}>
                      <div style={{color:T.textMid,fontSize:"10px",letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:700}}>{lang==="el"?"Απόσταση":"Distance"}</div>
                      <div style={{color:T.text,fontSize:"18px",fontWeight:900,marginTop:"3px"}}>📏 {route.total_km} km</div>
                    </div>
                    <div style={{background:"#dcfce7",borderRadius:"10px",padding:"12px 14px"}}>
                      <div style={{color:"#15803d",fontSize:"10px",letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:700}}>{lang==="el"?"Άνοδος":"Gain"}</div>
                      <div style={{color:"#15803d",fontSize:"18px",fontWeight:900,marginTop:"3px"}}>⛰ +{route.elevation_gain}m</div>
                    </div>
                    <div style={{background:"#fee2e2",borderRadius:"10px",padding:"12px 14px"}}>
                      <div style={{color:"#b91c1c",fontSize:"10px",letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:700}}>{lang==="el"?"Κάθοδος":"Loss"}</div>
                      <div style={{color:"#b91c1c",fontSize:"18px",fontWeight:900,marginTop:"3px"}}>⬇ -{route.elevation_loss}m</div>
                    </div>
                  </div>
                </div>
                <RouteMap points={route.points} height="400px"/>
                {route.points&&route.points.length>1&&(
                  <div style={{padding:"20px 24px",borderTop:`1px solid ${T.border}`}}>
                    <div style={{color:T.textMid,fontSize:"11px",letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:700,marginBottom:"10px"}}>{lang==="el"?"Υψομετρικό προφίλ":"Elevation profile"}</div>
                    <ElevationProfile points={route.points} height={200}/>
                  </div>
                )}
                <div style={{padding:"16px 24px",borderTop:`1px solid ${T.border}`,display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center"}}>
                  <button onClick={()=>downloadGPX(route,race.name)} style={{background:T.primary,color:"#fff",border:"none",borderRadius:"10px",padding:"10px 18px",fontSize:"13px",fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(74,93,199,0.2)",display:"inline-flex",alignItems:"center",gap:"6px"}}>📥 {lang==="el"?"Κατέβασμα GPX":"Download GPX"}</button>
                  {route.file_name&&<span style={{color:T.textLight,fontSize:"11px"}}>{route.file_name}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>)}

      {activeTab==="gallery"&&(<div>
        <GalleryDisplay gallery={race.gallery}/>
      </div>)}
      {activeTab==="sponsors"&&(<div>
        <SponsorsDisplay sponsors={race.sponsors}/>
      </div>)}
      {activeTab==="documents"&&(<div>
        <DocumentsDisplay documents={race.documents}/>
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

    {showShareMenu&&<ShareMenu raceName={race.name} raceDate={race.date} onClose={()=>setShowShareMenu(false)}/>}
    {showCalendarMenu&&<AddToCalendarMenu race={race} onClose={()=>setShowCalendarMenu(false)}/>}

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
      {availableRaces.length===0&&<EmptyState icon="🏁" title={t.noAvailable} message="Επίσκεψέ μας ξανά σύντομα!"/>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"18px"}}>{availableRaces.map(race=>(<AthleteRaceCard key={race.id} race={race} registrations={registrations} runners={runners} session={session} onSelect={setSelectedRace}/>))}</div>
    </div>)}
    {tab==="my"&&(<div>
      <h2 style={{margin:"0 0 18px",color:T.text,fontSize:"22px",fontWeight:900,letterSpacing:"-0.02em"}}>{t.myRegsTitle}</h2>
      {myRaces.length===0&&<EmptyState icon="🎯" title={t.noRegs} message="Βρες αγώνα και ξεκίνα να συμμετέχεις!"/>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"18px"}}>
        {myRaces.map(race=>(<AthleteRaceCard key={race.id} race={race} registrations={registrations} runners={runners} session={session} onSelect={setSelectedRace}/>))}
      </div>
    </div>)}
    {tab==="profile"&&(<AthleteProfile runners={runners} registrations={registrations} races={races} session={session} profile={profile} onRefresh={onRefresh}/>)}
    {registerRace&&<AthleteRegistrationForm race={registerRace} profile={profile} session={session} onClose={()=>setRegisterRace(null)} onSuccess={()=>{setRegisterRace(null);onRefresh();}}/>}
  </div>;
}

function loadScript(src){
  return new Promise((res,rej)=>{
    if(document.querySelector(`script[src="${src}"]`)){res();return;}
    const sc=document.createElement("script");
    sc.src=src;sc.onload=res;sc.onerror=rej;
    document.head.appendChild(sc);
  });
}

async function ensureJsPDF(){
  if(window.jspdf&&window.jspdf.jsPDF)return;
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.0/jspdf.plugin.autotable.min.js");
}

// Greek text normalization for fuzzy matching
function normalizeText(s){
  if(!s)return"";
  return String(s).toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"") // strip accents
    .replace(/ς/g,"σ") // final sigma to regular
    .replace(/\s+/g," "); // collapse whitespace
}

// Parse CSV (simple, handles quoted values)
function parseCSV(text){
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
function mapCSVRow(row){
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
function parseTimeFlex(s){
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
function matchRunner(csvRow,registrations,runners){
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

function ImportResultsModal({race,registrations,runners,onClose,onSuccess}){
  const {lang}=useLang();
  const [step,setStep]=useState("upload"); // upload | preview | done
  const [csvText,setCsvText]=useState("");
  const [preview,setPreview]=useState(null);
  const [loading,setLoading]=useState(false);
  const raceRegs=registrations.filter(r=>r.race_id===race.id);

  function handleFile(e){
    const file=e.target.files?.[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const text=ev.target.result;
      setCsvText(text);
      analyzeCSV(text);
    };
    reader.readAsText(file,"UTF-8");
  }

  function analyzeCSV(text){
    const parsed=parseCSV(text);
    if(!parsed||!parsed.rows||parsed.rows.length===0){
      toast(lang==="el"?"⚠️ Το CSV είναι κενό":"⚠️ CSV is empty","error");
      return;
    }
    const matched=[];
    const notFound=[];
    const ambiguous=[];
    const noTime=[];
    parsed.rows.forEach((row,idx)=>{
      const mapped=mapCSVRow(row);
      const time=parseTimeFlex(mapped.finish_time);
      const match=matchRunner(row,raceRegs,runners);
      if(!time){noTime.push({row:idx+2,data:mapped});return;}
      if(!match){notFound.push({row:idx+2,data:mapped});return;}
      if(match.ambiguous){ambiguous.push({row:idx+2,data:mapped,count:match.count});return;}
      matched.push({row:idx+2,registration:match.registration,method:match.method,time,raw:mapped});
    });
    setPreview({matched,notFound,ambiguous,noTime,totalRows:parsed.rows.length});
    setStep("preview");
  }

  async function confirmImport(){
    if(!preview||preview.matched.length===0)return;
    setLoading(true);
    // 1. Update finish_time για κάθε match
    for(const m of preview.matched){
      const time=(m.time==="DNF"||m.time==="DNS"||m.time==="DSQ")?null:m.time;
      await supabase.from("registrations").update({finish_time:time}).eq("id",m.registration.id);
    }
    // 2. Re-fetch and rank: sort by time, set overall_rank
    const {data:updated}=await supabase.from("registrations").select("*").eq("race_id",race.id);
    const finished=(updated||[]).filter(r=>r.finish_time).sort((a,b)=>{
      const ta=a.finish_time,tb=b.finish_time;
      // Convert HH:MM:SS to seconds
      const toSec=t=>{const p=String(t).split(":");return parseInt(p[0]||0)*3600+parseInt(p[1]||0)*60+parseInt(p[2]||0);};
      return toSec(ta)-toSec(tb);
    });
    // Group by distance for distance-rank as well
    const byDistance={};
    for(let i=0;i<finished.length;i++){
      const reg=finished[i];
      await supabase.from("registrations").update({overall_rank:i+1}).eq("id",reg.id);
      // Distance rank
      if(!byDistance[reg.distance])byDistance[reg.distance]=0;
      byDistance[reg.distance]++;
      await supabase.from("registrations").update({category_rank:byDistance[reg.distance]}).eq("id",reg.id);
    }
    setLoading(false);
    setStep("done");
    toast(`✅ ${preview.matched.length} αποτελέσματα ενημερώθηκαν`,"success");
    if(onSuccess)onSuccess();
  }

  return <Modal onClose={onClose}>
    <h2 style={{margin:"0 0 18px",color:T.text,fontSize:"20px",fontWeight:800}}>📥 {lang==="el"?"Import Αποτελεσμάτων":"Import Results"} — {race.name}</h2>

    {step==="upload"&&(
      <div>
        <div style={{background:`${T.primary}10`,border:`1px solid ${T.primary}33`,borderRadius:"10px",padding:"14px 16px",marginBottom:"16px",color:T.text,fontSize:"13px",lineHeight:1.6}}>
          <div style={{fontWeight:700,marginBottom:"6px"}}>📋 {lang==="el"?"Υποστηριζόμενες Στήλες":"Supported Columns"}:</div>
          <code style={{fontSize:"11px",color:T.textMid}}>bib_number, email, first_name, last_name, club, finish_time</code>
          <div style={{marginTop:"10px",fontSize:"12px",color:T.textMid}}>
            {lang==="el"?"💡 Το app θα ταυτοποιήσει με αυτή τη σειρά: BIB → Email → Ονοματεπώνυμο → +Σύλλογος":"Matching order: BIB → Email → Name → +Club"}
          </div>
        </div>
        <div style={{background:T.bgAlt,border:`2px dashed ${T.border}`,borderRadius:"10px",padding:"30px",textAlign:"center"}}>
          <div style={{fontSize:"40px",marginBottom:"10px"}}>📁</div>
          <label style={{cursor:"pointer",background:T.primary,color:"#fff",padding:"10px 22px",borderRadius:"10px",fontWeight:700,fontSize:"13px",display:"inline-block"}}>
            {lang==="el"?"⬆️ Επιλογή CSV":"⬆️ Choose CSV"}
            <input type="file" accept=".csv,text/csv" onChange={handleFile} style={{display:"none"}}/>
          </label>
          <div style={{marginTop:"10px",fontSize:"11px",color:T.textLight}}>
            {lang==="el"?"Time format: HH:MM:SS ή MM:SS · DNF/DNS αποδεκτά":"Time format: HH:MM:SS or MM:SS · DNF/DNS supported"}
          </div>
        </div>
      </div>
    )}

    {step==="preview"&&preview&&(
      <div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"10px",marginBottom:"16px"}}>
          <div style={{background:"#dcfce7",borderRadius:"10px",padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:"22px",fontWeight:900,color:"#15803d"}}>{preview.matched.length}</div>
            <div style={{fontSize:"10px",color:"#15803d",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{lang==="el"?"Βρέθηκαν":"Matched"}</div>
          </div>
          <div style={{background:"#fee2e2",borderRadius:"10px",padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:"22px",fontWeight:900,color:"#b91c1c"}}>{preview.notFound.length}</div>
            <div style={{fontSize:"10px",color:"#b91c1c",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{lang==="el"?"Δεν Βρέθηκαν":"Not Found"}</div>
          </div>
          <div style={{background:"#fef3c7",borderRadius:"10px",padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:"22px",fontWeight:900,color:"#92400e"}}>{preview.ambiguous.length}</div>
            <div style={{fontSize:"10px",color:"#92400e",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{lang==="el"?"Ασαφή":"Ambiguous"}</div>
          </div>
          <div style={{background:T.bg,borderRadius:"10px",padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:"22px",fontWeight:900,color:T.textLight}}>{preview.noTime.length}</div>
            <div style={{fontSize:"10px",color:T.textLight,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{lang==="el"?"Χωρίς Time":"No Time"}</div>
          </div>
        </div>

        {preview.matched.length>0&&(
          <div style={{marginBottom:"16px"}}>
            <div style={{color:T.text,fontWeight:700,fontSize:"13px",marginBottom:"8px"}}>✅ {lang==="el"?`Προς ενημέρωση (${preview.matched.length})`:`To update (${preview.matched.length})`}:</div>
            <div style={{maxHeight:"180px",overflowY:"auto",background:T.bg,borderRadius:"8px",padding:"8px"}}>
              {preview.matched.slice(0,20).map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 8px",fontSize:"12px",borderBottom:`1px solid ${T.border}`}}>
                  <span>BIB #{m.registration.bib_number} <span style={{color:T.textLight}}>({m.method})</span></span>
                  <span style={{fontFamily:"monospace",fontWeight:700}}>{m.time}</span>
                </div>
              ))}
              {preview.matched.length>20&&<div style={{padding:"4px 8px",fontSize:"11px",color:T.textLight,textAlign:"center"}}>... +{preview.matched.length-20} ακόμα</div>}
            </div>
          </div>
        )}

        {preview.notFound.length>0&&(
          <div style={{marginBottom:"16px"}}>
            <div style={{color:T.danger,fontWeight:700,fontSize:"13px",marginBottom:"8px"}}>⚠️ {lang==="el"?"Δεν βρέθηκαν":"Not found"}:</div>
            <div style={{maxHeight:"120px",overflowY:"auto",background:"#fee2e2",borderRadius:"8px",padding:"8px"}}>
              {preview.notFound.slice(0,10).map((m,i)=>(
                <div key={i} style={{padding:"4px 8px",fontSize:"11px"}}>Γρ.{m.row}: {m.data.bib||m.data.email||`${m.data.first_name} ${m.data.last_name}`}</div>
              ))}
            </div>
          </div>
        )}

        <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
          <Btn v="sec" onClick={()=>setStep("upload")}>← {lang==="el"?"Πίσω":"Back"}</Btn>
          <Btn onClick={confirmImport} disabled={loading||preview.matched.length===0}>{loading?(lang==="el"?"Επεξεργασία...":"Processing..."):(lang==="el"?`✅ Ενημέρωση ${preview.matched.length} αποτελεσμάτων`:`✅ Update ${preview.matched.length} results`)}</Btn>
        </div>
      </div>
    )}

    {step==="done"&&(
      <div style={{textAlign:"center",padding:"30px 20px"}}>
        <div style={{fontSize:"60px",marginBottom:"16px"}}>🎉</div>
        <h3 style={{margin:"0 0 8px",color:T.text}}>{lang==="el"?"Επιτυχία!":"Success!"}</h3>
        <p style={{color:T.textMid,fontSize:"14px",marginBottom:"24px"}}>{lang==="el"?`Ενημερώθηκαν ${preview.matched.length} αποτελέσματα και υπολογίστηκε αυτόματα η κατάταξη.`:`${preview.matched.length} results updated and ranks calculated.`}</p>
        <Btn onClick={onClose}>{lang==="el"?"Κλείσιμο":"Close"}</Btn>
      </div>
    )}
  </Modal>;
}

function DocumentsPicker({documents,onChange}){
  const {lang}=useLang();
  const [uploading,setUploading]=useState(false);
  const [newTitle,setNewTitle]=useState("");

  async function uploadFile(e){
    const file=e.target.files?.[0];
    if(!file)return;
    if(file.size>50*1024*1024){toast(lang==="el"?"⚠️ Μέγιστο μέγεθος 50MB":"⚠️ Max size 50MB","warning");return;}
    if(!newTitle.trim()){toast(lang==="el"?"⚠️ Δώσε πρώτα τίτλο":"⚠️ Set title first","warning");return;}
    setUploading(true);
    try{
      const ext=file.name.split(".").pop()||"pdf";
      const path=`${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
      const {error}=await supabase.storage.from("race-documents").upload(path,file,{cacheControl:"3600",upsert:false});
      if(error){toast("Σφάλμα: "+error.message,"error");setUploading(false);return;}
      const {data:{publicUrl}}=supabase.storage.from("race-documents").getPublicUrl(path);
      const newDoc={id:Date.now()+"-"+Math.random().toString(36).slice(2,8),title:newTitle.trim(),url:publicUrl,filename:file.name,size:file.size,type:file.type||"application/pdf",uploaded_at:new Date().toISOString()};
      onChange([...(documents||[]),newDoc]);
      setNewTitle("");
      toast("✅ "+(lang==="el"?"Έγγραφο ανέβηκε":"Document uploaded"),"success");
    }catch(err){toast("Σφάλμα: "+err.message,"error");}
    setUploading(false);
    e.target.value="";
  }

  function removeDoc(id){
    if(!confirm(lang==="el"?"Διαγραφή εγγράφου;":"Delete document?"))return;
    onChange((documents||[]).filter(d=>d.id!==id));
  }

  function fileIcon(type,filename){
    const ext=(filename||"").toLowerCase().split(".").pop();
    if(type?.includes("pdf")||ext==="pdf")return "📄";
    if(type?.includes("image")||["jpg","jpeg","png","gif","webp"].includes(ext))return "🖼";
    if(type?.includes("word")||["doc","docx"].includes(ext))return "📝";
    if(type?.includes("sheet")||["xls","xlsx","csv"].includes(ext))return "📊";
    if(["zip","rar","7z"].includes(ext))return "🗜";
    return "📎";
  }

  function fmtSize(bytes){
    if(!bytes)return"";
    if(bytes<1024)return bytes+"B";
    if(bytes<1024*1024)return Math.round(bytes/1024)+"KB";
    return (bytes/1024/1024).toFixed(1)+"MB";
  }

  return <div style={{marginBottom:"18px"}}>
    <label style={css.label}>📄 {lang==="el"?"Έγγραφα Αγώνα (Προκήρυξη, Κανονισμός, κλπ)":"Race Documents (Announcement, Rules, etc)"}</label>
    <div style={{color:T.textMid,fontSize:"12px",marginBottom:"10px"}}>{lang==="el"?"Ανέβασε PDF, εικόνες ή έγγραφα. Οι αθλητές μπορούν να τα κατεβάσουν.":"Upload PDFs, images or documents. Athletes can download them."}</div>

    <div style={{background:T.bg,borderRadius:"10px",padding:"14px",marginBottom:"10px",border:`1px dashed ${T.border}`}}>
      <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"}}>
        <input type="text" value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder={lang==="el"?"Τίτλος (π.χ. Προκήρυξη 2026)":"Title (e.g. Race Brief 2026)"} style={{flex:1,minWidth:"200px",padding:"8px 12px",fontSize:"13px",borderRadius:"8px",border:`1px solid ${T.border}`,background:T.bgAlt,color:T.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        <label style={{cursor:uploading?"wait":"pointer",background:T.primary,color:"#fff",padding:"8px 16px",borderRadius:"8px",fontSize:"13px",fontWeight:700,fontFamily:"inherit",opacity:uploading?0.6:1,whiteSpace:"nowrap"}}>
          {uploading?"⏳ "+(lang==="el"?"Ανέβασμα...":"Uploading..."):(lang==="el"?"📎 Επιλογή Αρχείου":"📎 Choose File")}
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.zip,application/pdf,image/*" onChange={uploadFile} style={{display:"none"}} disabled={uploading}/>
        </label>
      </div>
      <div style={{marginTop:"8px",fontSize:"11px",color:T.textLight}}>{lang==="el"?"Μέγιστο 50MB · Δέχεται PDF, εικόνες, Word, Excel, ZIP":"Max 50MB · Accepts PDF, images, Word, Excel, ZIP"}</div>
    </div>

    {(documents||[]).length>0&&(
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {documents.map(doc=>(
          <div key={doc.id} style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"10px 14px",display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{fontSize:"24px",flexShrink:0}}>{fileIcon(doc.type,doc.filename)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:T.text,fontWeight:700,fontSize:"13px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.title}</div>
              <div style={{color:T.textLight,fontSize:"11px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.filename} · {fmtSize(doc.size)}</div>
            </div>
            <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{flexShrink:0,color:T.primary,fontSize:"12px",fontWeight:700,textDecoration:"none",padding:"4px 8px"}}>👁</a>
            <button type="button" onClick={()=>removeDoc(doc.id)} style={{flexShrink:0,background:"none",border:"none",color:T.danger,cursor:"pointer",fontSize:"18px",padding:"4px"}}>×</button>
          </div>
        ))}
      </div>
    )}
  </div>;
}

function DocumentsDisplay({documents}){
  const {lang}=useLang();
  if(!documents||documents.length===0)return null;

  function fileIcon(type,filename){
    const ext=(filename||"").toLowerCase().split(".").pop();
    if(type?.includes("pdf")||ext==="pdf")return "📄";
    if(type?.includes("image")||["jpg","jpeg","png","gif","webp"].includes(ext))return "🖼";
    if(type?.includes("word")||["doc","docx"].includes(ext))return "📝";
    if(type?.includes("sheet")||["xls","xlsx","csv"].includes(ext))return "📊";
    if(["zip","rar","7z"].includes(ext))return "🗜";
    return "📎";
  }

  function fmtSize(bytes){
    if(!bytes)return"";
    if(bytes<1024)return bytes+"B";
    if(bytes<1024*1024)return Math.round(bytes/1024)+"KB";
    return (bytes/1024/1024).toFixed(1)+"MB";
  }

  return <div style={{background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"20px"}}>
    <h3 style={{margin:"0 0 14px",color:T.text,fontSize:"16px",fontWeight:800}}>📄 {lang==="el"?"Έγγραφα Αγώνα":"Race Documents"}</h3>
    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
      {documents.map(doc=>(
        <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:"14px",background:T.bg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"12px 16px",textDecoration:"none",color:T.text,transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.08)";e.currentTarget.style.borderColor=T.primary;}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=T.border;}}>
          <div style={{fontSize:"32px",flexShrink:0}}>{fileIcon(doc.type,doc.filename)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:T.text,fontWeight:700,fontSize:"14px",marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.title}</div>
            <div style={{color:T.textLight,fontSize:"11px"}}>{doc.filename} · {fmtSize(doc.size)}</div>
          </div>
          <div style={{flexShrink:0,color:T.primary,fontSize:"20px",fontWeight:700}}>⬇</div>
        </a>
      ))}
    </div>
  </div>;
}

function OrganizerRaces({races,setRaces,runners,registrations,session,profile}){
  const {t,lang}=useLang();
  const [showForm,setShowForm]=useState(false);
  const [importRace,setImportRace]=useState(null);
  const [editId,setEditId]=useState(null);
  const [uploadingBanner,setUploadingBanner]=useState(false);
  const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({name:"",date:"",location:"",distances:[],max_runners:"",description:"",pricing:[],perks:[],early_bird:null,custom_fields:[],banner_url:"",public_runners_list:false,routes:[],sponsors:[],faq:[],gallery:[],documents:[]});

  async function uploadBanner(e){
    const file=e.target.files?.[0];
    if(!file)return;
    setUploadingBanner(true);
    const ext=file.name.split(".").pop();
    const path=`race-${Date.now()}.${ext}`;
    const {error:upErr}=await supabase.storage.from("race-banners").upload(path,file,{upsert:true});
    if(upErr){toast("⚠️ "+upErr.message,"error");setUploadingBanner(false);return;}
    const {data:{publicUrl}}=supabase.storage.from("race-banners").getPublicUrl(path);
    setForm(f=>({...f,banner_url:publicUrl}));
    setUploadingBanner(false);
  }

  const isAdmin=profile?.role==="admin";
  const myRaces=isAdmin?races:races.filter(r=>r.user_id===session?.user?.id);
  function resetForm(){setEditId(null);setForm({name:"",date:"",location:"",distances:[],max_runners:"",description:"",pricing:[],perks:[],early_bird:null,custom_fields:[],banner_url:"",public_runners_list:false,routes:[],sponsors:[],faq:[],gallery:[],documents:[]});}
  function openEdit(race){setEditId(race.id);setForm({name:race.name||"",date:race.date||"",location:race.location||"",distances:race.distance?race.distance.split(" | "):[],max_runners:race.max_runners?String(race.max_runners):"",description:race.description||"",pricing:race.pricing||[],perks:race.perks||[],early_bird:race.early_bird||null,custom_fields:race.custom_fields||[],banner_url:race.banner_url||"",public_runners_list:!!race.public_runners_list,routes:race.routes||[],sponsors:race.sponsors||[],faq:race.faq||[],gallery:race.gallery||[],documents:race.documents||[]});setShowForm(true);}

  async function save(){
    if(!form.name||!form.date){toast(t.fillNameDate,"warning");return;}
    // Validate race date is not in the past
    const raceDate=new Date(form.date);
    const today=new Date();today.setHours(0,0,0,0);
    if(raceDate<today){toast(lang==="el"?"⚠️ Η ημερομηνία του αγώνα δεν μπορεί να είναι στο παρελθόν":"⚠️ Race date cannot be in the past","warning");return;}
    if(form.distances.length===0){toast(t.addDistance,"warning");return;}
    setLoading(true);
    const validPricing=form.pricing.filter(p=>form.distances.includes(p.distance));
    const validRoutes=(form.routes||[]).filter(r=>form.distances.includes(r.distance));
    const payload={name:form.name,date:form.date,location:form.location,distance:form.distances.join(" | "),description:form.description,max_runners:form.max_runners?parseInt(form.max_runners):null,pricing:validPricing,perks:form.perks,early_bird:form.early_bird,custom_fields:form.custom_fields,banner_url:form.banner_url||null,public_runners_list:!!form.public_runners_list,routes:validRoutes,sponsors:form.sponsors||[],faq:form.faq||[],gallery:form.gallery||[],documents:form.documents||[]};
    if(editId){
      const {data,error}=await supabase.from("races").update(payload).eq("id",editId).select();
      if(error){toast("Σφάλμα: "+error.message,"error");setLoading(false);return;}
      if(data)setRaces(races.map(r=>r.id===editId?data[0]:r));
    } else {
      const initialStatus=profile?.role==="admin"?"upcoming":"pending_approval";
      const {data,error}=await supabase.from("races").insert([{...payload,status:initialStatus,user_id:session.user.id,organizer_gdpr_consent_at:new Date().toISOString()}]).select();
      if(error){toast("Σφάλμα: "+error.message,"error");setLoading(false);return;}
      if(data)setRaces([data[0],...races]);
      if(initialStatus==="pending_approval"){
        toast(lang==="el"?"⏳ Ο αγώνας στάλθηκε για έγκριση από admin":"⏳ Race sent for admin approval","info");
      } else {
        toast(lang==="el"?"✅ Ο αγώνας δημιουργήθηκε":"✅ Race created","success");
      }
    }
    setLoading(false);setShowForm(false);resetForm();
  }
  async function del(id){if(!confirm(t.deleteConfirm))return;await supabase.from("races").delete().eq("id",id);setRaces(races.filter(r=>r.id!==id));}
  async function toggleStatus(race){const s=["upcoming","active","finished"];const ns=s[(s.indexOf(race.status)+1)%s.length];await supabase.from("races").update({status:ns}).eq("id",race.id);setRaces(races.map(r=>r.id===race.id?{...r,status:ns}:r));}

  async function exportPDF(race){
    const regs=registrations.filter(r=>r.race_id===race.id);
    if(!regs.length){toast(t.noRegsCsv,"warning");return;}
    const paidCount=regs.filter(r=>r.payment_status==="paid").length;
    const totalRev=regs.filter(r=>r.payment_status==="paid").reduce((sum,r)=>sum+(parseFloat(r.price_paid)||0),0);
    // Build pretty HTML for print
    const rows=regs.map((reg,i)=>{
      const r=runners.find(x=>x.id===reg.runner_id)||{};
      const paid=reg.payment_status==="paid";
      return `<tr>
        <td class="num">${i+1}</td>
        <td class="bib">#${reg.bib_number||"-"}</td>
        <td>${(r.first_name||"")} ${(r.last_name||"")}</td>
        <td>${reg.distance||"-"}</td>
        <td>${r.club||"-"}</td>
        <td>${r.city||"-"}</td>
        <td class="${paid?"paid":"pending"}">${paid?"✓ Πληρωμένο":"⏳ Εκκρεμές"}</td>
        <td class="num">${reg.price_paid?Number(reg.price_paid).toFixed(2)+"€":"-"}</td>
      </tr>`;
    }).join("");
    const html=`<!DOCTYPE html>
<html lang="el"><head><meta charset="UTF-8"><title>${race.name} - Εγγραφές</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:"Inter","Helvetica Neue",Arial,sans-serif;color:#1a1a1a;padding:30px;background:#fff;font-size:11pt}
  .header{border-bottom:3px solid #4a5dc7;padding-bottom:14px;margin-bottom:20px}
  h1{font-size:22pt;color:#1a1a1a;margin-bottom:6px}
  .meta{color:#666;font-size:10pt}
  .stats{display:flex;gap:14px;margin:18px 0;padding:14px;background:#f5f3ef;border-radius:8px;font-size:10pt}
  .stat{flex:1}
  .stat-label{color:#666;font-size:9pt;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px}
  .stat-value{font-size:15pt;font-weight:800;color:#1a1a1a}
  table{width:100%;border-collapse:collapse;font-size:10pt}
  thead{background:#4a5dc7;color:#fff}
  th{padding:10px 8px;text-align:left;font-weight:700;font-size:9pt;text-transform:uppercase;letter-spacing:0.04em}
  td{padding:8px;border-bottom:1px solid #e8e6df}
  tbody tr:nth-child(even){background:#fafaf7}
  .num{text-align:right;font-variant-numeric:tabular-nums}
  .bib{font-weight:700;color:#4a5dc7;font-family:monospace}
  .paid{color:#10b981;font-weight:600;font-size:9pt}
  .pending{color:#d97706;font-weight:600;font-size:9pt}
  .footer{margin-top:24px;padding-top:14px;border-top:1px solid #e8e6df;color:#999;font-size:9pt;display:flex;justify-content:space-between}
  .print-note{position:fixed;top:20px;right:20px;background:#4a5dc7;color:#fff;padding:14px 24px;border-radius:10px;font-size:14pt;box-shadow:0 6px 20px rgba(74,93,199,0.4);cursor:pointer;border:none;font-family:inherit;font-weight:700;z-index:1000}
  .print-note:hover{background:#3a4dab;transform:translateY(-2px)}
  @media print{.print-note{display:none}@page{margin:1.5cm;size:A4}}
</style></head><body>
<button class="print-note" onclick="window.print()">🖨️ Εκτύπωση / Save as PDF</button>
<div class="header">
  <h1>${race.name}</h1>
  <div class="meta">📅 ${race.date||"-"} &nbsp;·&nbsp; 📍 ${race.location||"-"}</div>
</div>
<div class="stats">
  <div class="stat"><div class="stat-label">Σύνολο</div><div class="stat-value">${regs.length}${race.max_runners?"/"+race.max_runners:""}</div></div>
  <div class="stat"><div class="stat-label">Πληρωμένοι</div><div class="stat-value" style="color:#10b981">${paidCount}</div></div>
  <div class="stat"><div class="stat-label">Εκκρεμείς</div><div class="stat-value" style="color:#d97706">${regs.length-paidCount}</div></div>
  <div class="stat"><div class="stat-label">Έσοδα</div><div class="stat-value">€${totalRev.toFixed(2)}</div></div>
</div>
<table>
<thead><tr><th>#</th><th>BIB</th><th>Ονοματεπώνυμο</th><th>Διαδρομή</th><th>Σύλλογος</th><th>Πόλη</th><th>Πληρωμή</th><th>Τιμή</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<div class="footer">
  <div>Race Management · racemanagement.gr</div>
  <div>Εκτύπωση: ${new Date().toLocaleString("el-GR")}</div>
</div>
</body></html>`;
    const w=window.open("","_blank");
    if(!w){toast("⚠️ Επέτρεψε τα popups για το PDF","warning");return;}
    w.document.write(html);
    w.document.close();
    toast("✅ Άνοιξε νέο tab - πάτα '🖨️ Εκτύπωση' πάνω δεξιά","success");
  }

  async function exportExcel(race){
    const regs=registrations.filter(r=>r.race_id===race.id);
    if(!regs.length){toast(t.noRegsCsv,"warning");return;}
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
    {myRaces.length===0&&<EmptyState icon="🏟" title={t.noRacesYet} message="Δημιούργησε τον πρώτο σου αγώνα!" actionLabel={t.newRace} onAction={()=>setShowForm(true)} action={true}/>}
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
            <Btn sm v="grn" onClick={()=>exportPDF(race)}>{t.pdfBtn}</Btn>
            <Btn sm v="sec" onClick={()=>setImportRace(race)}>{t.importResultsBtn}</Btn>
            <Btn sm v="red" onClick={()=>del(race.id)}>{t.deleteBtn}</Btn>
          </div>
        </div>;
      })}
    </div>
    {importRace&&<ImportResultsModal race={importRace} registrations={registrations} runners={runners} onClose={()=>setImportRace(null)} onSuccess={()=>{if(onRefresh)onRefresh();}}/>}
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
        <In label={t.date} type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} min={new Date().toISOString().split("T")[0]}/>
        <LocationAutocomplete label={t.location} value={form.location} onChange={v=>setForm({...form,location:v})} placeholder={lang==="el"?"Π.χ. Μαραθώνας, Αττική":"e.g. Marathon, Greece"}/>
      </div>
      <DistancesPicker distances={form.distances} onChange={d=>setForm({...form,distances:d})}/>
      <PricingPicker distances={form.distances} pricing={form.pricing} onChange={p=>setForm({...form,pricing:p})}/>
      <RoutesPicker distances={form.distances} routes={form.routes||[]} onChange={r=>setForm({...form,routes:r})}/>
      <SponsorsPicker sponsors={form.sponsors||[]} onChange={s=>setForm({...form,sponsors:s})}/>
      <DocumentsPicker documents={form.documents||[]} onChange={d=>setForm({...form,documents:d})}/>
      <FAQPicker faq={form.faq||[]} onChange={f=>setForm({...form,faq:f})}/>
      <GalleryPicker gallery={form.gallery||[]} onChange={g=>setForm({...form,gallery:g})}/>
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
    if(error){toast("Σφάλμα: "+error.message,"error");return;}
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
    {filtered.length===0&&<EmptyState icon="📋" title={t.noRegsList} message="Όταν εγγραφούν αθλητές θα τους δεις εδώ"/>}
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
  const {t,lang}=useLang();
  const [pendingOrgs,setPendingOrgs]=useState([]);
  const [allOrgs,setAllOrgs]=useState([]);
  const [pendingRaces,setPendingRaces]=useState([]);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("pendingRaces");
  async function fetchOrgs(){
    setLoading(true);
    const [orgsRes,racesRes]=await Promise.all([
      supabase.from("profiles").select("*").eq("role","organizer").order("id",{ascending:false}),
      supabase.from("races").select("*").eq("status","pending_approval").order("date",{ascending:true})
    ]);
    if(orgsRes.data){setPendingOrgs(orgsRes.data.filter(o=>o.status==="pending"));setAllOrgs(orgsRes.data);}
    if(racesRes.data)setPendingRaces(racesRes.data);
    setLoading(false);
  }
  useEffect(()=>{fetchOrgs();},[]);
  async function approveRace(id){
    const race=pendingRaces.find(r=>r.id===id);
    const {error}=await supabase.from("races").update({status:"upcoming"}).eq("id",id);
    if(error){toast("Σφάλμα: "+error.message,"error");return;}
    toast(lang==="el"?"✅ Ο αγώνας εγκρίθηκε!":"✅ Race approved!","success");
    if(race){
      const owner=allOrgs.find(o=>o.id===race.user_id);
      if(owner?.email){
        const body=`
          <p>Γεια σας <strong>${owner.full_name||""}</strong>,</p>
          <p>Ο αγώνας σας <strong>"${race.name}"</strong> <strong style="color:#10b981;">εγκρίθηκε</strong> και είναι πλέον δημόσιος!</p>
          <div style="background:#f5f7ff;border-left:4px solid #4a5dc7;padding:18px 22px;margin:20px 0;border-radius:8px;">
            <p style="margin:0 0 8px;"><strong>🏁 Αγώνας:</strong> ${race.name}</p>
            <p style="margin:0 0 8px;"><strong>📅 Ημερομηνία:</strong> ${race.date}</p>
            <p style="margin:0;"><strong>📍 Τοποθεσία:</strong> ${race.location||"—"}</p>
          </div>
          <p>Οι αθλητές μπορούν τώρα να εγγραφούν!</p>
          <p style="margin-top:24px;"><a href="https://racemanagement.gr" style="background:#4a5dc7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">Δείτε τον αγώνα →</a></p>
        `;
        sendEmail(owner.email,`✅ Ο αγώνας "${race.name}" εγκρίθηκε`,emailTemplate("Ο αγώνας σας εγκρίθηκε!",body));
      }
    }
    fetchOrgs();
  }
  async function rejectRace(id){
    if(!confirm(lang==="el"?"Σίγουρα θέλεις να απορρίψεις τον αγώνα;":"Reject this race?"))return;
    const {error}=await supabase.from("races").update({status:"rejected"}).eq("id",id);
    if(error){toast("Σφάλμα: "+error.message,"error");return;}
    toast(lang==="el"?"❌ Ο αγώνας απορρίφθηκε":"❌ Race rejected","info");
    fetchOrgs();
  }
  async function approve(id){
    const org=allOrgs.find(o=>o.id===id);
    const {error}=await supabase.from("profiles").update({status:"approved"}).eq("id",id);
    if(error){toast("Σφάλμα: "+error.message,"error");return;}
    toast(lang==="el"?"✅ Εγκρίθηκε!":"✅ Approved!","success");
    if(org?.email){
      const body=`
        <p>Γεια σας <strong>${org.full_name||""}</strong>,</p>
        <p>Ο λογαριασμός σας ως διοργανωτής στο racemanagement.gr <strong style="color:#10b981;">εγκρίθηκε</strong>!</p>
        <p>Μπορείτε πλέον να:</p>
        <ul>
          <li>Δημιουργήσετε αγώνες</li>
          <li>Διαχειριστείτε εγγραφές αθλητών</li>
          <li>Ανεβάσετε προκηρύξεις και έγγραφα</li>
          <li>Δείτε αποτελέσματα</li>
        </ul>
        <p style="margin-top:24px;"><a href="https://racemanagement.gr" style="background:#4a5dc7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">Συνδεθείτε τώρα →</a></p>
      `;
      sendEmail(org.email,"✅ Ο λογαριασμός σας εγκρίθηκε",emailTemplate("Καλωσήρθατε!",body));
    }
    fetchOrgs();
  }
  async function reject(id){if(!confirm(t.rejectConfirm))return;await supabase.from("profiles").update({status:"rejected"}).eq("id",id);fetchOrgs();}
  async function makeAdmin(id){if(!confirm(t.makeAdminConfirm))return;await supabase.from("profiles").update({role:"admin",status:"approved"}).eq("id",id);fetchOrgs();}
  const list=tab==="pending"?pendingOrgs:allOrgs;
  const statusColors={pending:T.warning,approved:T.accent,rejected:T.danger};
  const statusLabels={pending:t.statusPending,approved:t.statusApproved,rejected:t.statusRejected};
  if(loading)return <div style={{textAlign:"center",color:T.textMid,padding:"40px"}}>{t.loading}</div>;
  return <div>
    <div style={{display:"flex",gap:"6px",marginBottom:"24px",flexWrap:"wrap"}}>
      <button onClick={()=>setTab("pendingRaces")} style={{background:tab==="pendingRaces"?T.warning:T.bgAlt,color:tab==="pendingRaces"?"#fff":T.textMid,border:`1px solid ${tab==="pendingRaces"?T.warning:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="pendingRaces"?700:500,fontFamily:"inherit"}}>🏁 {lang==="el"?"Αγώνες προς Έγκριση":"Pending Races"} ({pendingRaces.length})</button>
      <button onClick={()=>setTab("pending")} style={{background:tab==="pending"?T.warning:T.bgAlt,color:tab==="pending"?"#fff":T.textMid,border:`1px solid ${tab==="pending"?T.warning:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="pending"?700:500,fontFamily:"inherit"}}>{t.pendingTab} ({pendingOrgs.length})</button>
      <button onClick={()=>setTab("all")} style={{background:tab==="all"?T.primary:T.bgAlt,color:tab==="all"?"#fff":T.textMid,border:`1px solid ${tab==="all"?T.primary:T.border}`,borderRadius:"8px",padding:"10px 18px",cursor:"pointer",fontSize:"13px",fontWeight:tab==="all"?700:500,fontFamily:"inherit"}}>{t.allOrgsTab} ({allOrgs.length})</button>
    </div>

    {tab==="pendingRaces"?(
      pendingRaces.length===0?(
        <EmptyState icon="✅" title={lang==="el"?"Δεν υπάρχουν αγώνες προς έγκριση":"No pending races"} message={lang==="el"?"Όλοι οι αγώνες έχουν εγκριθεί":"All races approved"}/>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
          {pendingRaces.map(race=>(
            <div key={race.id} style={{background:T.bgAlt,borderRadius:"14px",padding:"18px 20px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",border:`2px solid ${T.warning}55`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"14px",flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:"200px"}}>
                  <span style={{background:T.warning,color:"#fff",padding:"3px 10px",borderRadius:"999px",fontSize:"10px",fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",display:"inline-block",marginBottom:"8px"}}>⏳ {lang==="el"?"Σε αναμονή":"Pending"}</span>
                  <h3 style={{margin:"0 0 6px",color:T.text,fontSize:"17px",fontWeight:800}}>{race.name}</h3>
                  <div style={{color:T.textMid,fontSize:"13px",marginBottom:"4px"}}>📅 {race.date} · 📍 {race.location||"-"}</div>
                  <div style={{color:T.textLight,fontSize:"12px"}}>🏃 {race.distance||"-"} · 👥 max {race.max_runners||"-"}</div>
                  {race.description&&<div style={{color:T.textMid,fontSize:"12px",marginTop:"8px",padding:"8px 10px",background:T.bg,borderRadius:"8px",maxHeight:"80px",overflow:"hidden"}}>{race.description.substring(0,200)}{race.description.length>200?"...":""}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"8px",flexShrink:0}}>
                  <button onClick={()=>approveRace(race.id)} style={{background:T.accent,color:"#fff",border:"none",borderRadius:"8px",padding:"8px 16px",cursor:"pointer",fontSize:"12px",fontWeight:700,fontFamily:"inherit"}}>✅ {lang==="el"?"Έγκριση":"Approve"}</button>
                  <button onClick={()=>rejectRace(race.id)} style={{background:T.danger,color:"#fff",border:"none",borderRadius:"8px",padding:"8px 16px",cursor:"pointer",fontSize:"12px",fontWeight:700,fontFamily:"inherit"}}>❌ {lang==="el"?"Απόρριψη":"Reject"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    ):(<div>
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
  </div>)}
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

  // Auto-logout after 30 minutes of inactivity
  useEffect(()=>{
    if(!session)return;
    const INACTIVITY_TIMEOUT=30*60*1000; // 30 minutes
    const WARNING_BEFORE=5*60*1000; // 5 min warning
    let logoutTimer,warningTimer;
    function resetTimers(){
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
      warningTimer=setTimeout(()=>{
        toast("⏰ Θα αποσυνδεθείτε σε 5 λεπτά λόγω αδράνειας","warning");
      },INACTIVITY_TIMEOUT-WARNING_BEFORE);
      logoutTimer=setTimeout(()=>{
        toast("👋 Αποσυνδεθήκατε λόγω αδράνειας","info");
        supabase.auth.signOut();
      },INACTIVITY_TIMEOUT);
    }
    const events=["mousedown","keydown","scroll","touchstart","click"];
    events.forEach(e=>window.addEventListener(e,resetTimers,{passive:true}));
    resetTimers();
    return ()=>{
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
      events.forEach(e=>window.removeEventListener(e,resetTimers));
    };
  },[session]);

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

  if(!session)return <><PublicHomePage/><Footer/></>;
  if(loading)return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:T.primary,fontFamily:"Inter,sans-serif"}}>
      {t.loading}</div>;

  const isAthlete=profile?.role==="athlete";
  const isOrganizer=(profile?.role==="organizer"||profile?.role==="admin")&&profile?.status==="approved";
  const isPendingOrganizer=profile?.role==="organizer"&&profile?.status==="pending";
  const isRejectedOrganizer=profile?.role==="organizer"&&profile?.status==="rejected";
  const isAdmin=profile?.role==="admin";

  return <div className="fade-in" style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Inter,sans-serif"}}>
    <div style={{borderBottom:`1px solid ${T.border}`,padding:"16px 24px",background:T.bgAlt,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        <img src="/11085.png" alt="Race Management" style={{width:"40px",height:"40px",borderRadius:"50%",objectFit:"cover"}}/>
        <div><div style={{color:T.text,fontWeight:700,fontSize:"16px"}}>{t.appName}</div><div style={{color:T.textLight,fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase"}}>{isAthlete?t.athletePanel:t.adminPanel}</div></div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
        <DarkModeToggle/><LangToggle/>
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
    <Footer/>
  </div>;
}

export default function App(){
  const [lang,setLang]=useState("el");
  return <LangContext.Provider value={{lang,t:STR[lang],setLang}}>
    <AppContent/>
    <ToastContainer/>
    <PWAInstallPrompt/>
  </LangContext.Provider>;
}
