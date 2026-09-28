import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const demoTeachers = [
 {id:"demo1",name:"Ayesha Khan",qualification:"MSc Mathematics",experience:6,subjects:"Mathematics, Calculus",city:"Lahore",mode:"Online, Home tuition",levels:"Matric, Intermediate",fee:1800,availability:"Evenings · Mon–Sat",bio:"Concept-focused lessons with practice and regular feedback.",phone:"923001234567",approved:true},
 {id:"demo2",name:"Hamza Ali",qualification:"MPhil Physics",experience:4,subjects:"Physics, Mathematics",city:"Islamabad",mode:"Online, Home tuition",levels:"Matric, O Level",fee:2000,availability:"Weekdays · 4–8 PM",bio:"Clear explanations, exam preparation, and problem-solving practice.",phone:"923001234568",approved:true},
 {id:"demo3",name:"Sara Ahmed",qualification:"BS English Literature",experience:5,subjects:"English, IELTS",city:"Karachi",mode:"Online",levels:"Intermediate, University",fee:1500,availability:"Flexible · Weekends",bio:"Supportive English lessons for academic and language goals.",phone:"923001234569",approved:true}
];
let teachers=[...demoTeachers];
let db=null,auth=null;
const firebaseReady= firebaseConfig.apiKey!=="YOUR_API_KEY";
if(firebaseReady){try{const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);loadTeachers();}catch(e){console.warn("Firebase setup issue:",e);}}
const $=id=>document.getElementById(id);
function escapeHTML(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function render(list=teachers){
 const grid=$("teacherGrid");grid.innerHTML="";
 const approved=list.filter(t=>t.approved===true);
 $("resultCount").textContent=`${approved.length} teacher${approved.length===1?"":"s"} found`;
 $("emptyState").classList.toggle("hidden",approved.length>0);
 approved.forEach(t=>{
  const initials=t.name.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();
  const card=document.createElement("article");card.className="teacher-card";
  card.innerHTML=`<div class="teacher-top"><div class="teacher-avatar">${escapeHTML(initials)}</div><div><h3>${escapeHTML(t.name)}</h3><div class="qual">${escapeHTML(t.qualification)}</div></div><span class="verified">✓ Approved</span></div>
  <div class="teacher-subjects">${escapeHTML(t.subjects)}</div><p class="teacher-bio">${escapeHTML(t.bio||"Available for personalized lessons.")}</p>
  <div class="teacher-meta"><span>📍 ${escapeHTML(t.city)}<br>⌁ ${escapeHTML(t.mode)}</span><span><strong>Rs ${Number(t.fee).toLocaleString("en-PK")}</strong><br>per hour</span></div>
  <div class="teacher-meta"><span>${escapeHTML(t.levels)}</span><span>${Number(t.experience)||0} yrs experience</span></div>
  <div class="teacher-actions"><a class="btn" target="_blank" rel="noopener" href="https://wa.me/${encodeURIComponent(String(t.phone).replace(/\D/g,''))}?text=${encodeURIComponent("Hello "+t.name+", I found your profile on TutorConnect and would like to ask about tuition.")}">WhatsApp ↗</a><button class="outline-btn" data-details="${escapeHTML(t.id)}">Details</button></div>`;
  grid.appendChild(card);
 });
}
function applyFilters(){
 const subject=$("subjectSearch").value.trim().toLowerCase(),city=$("citySearch").value.trim().toLowerCase(),level=$("classSearch").value.toLowerCase(),mode=$("modeSearch").value.toLowerCase();
 render(teachers.filter(t=>(!subject||t.subjects.toLowerCase().includes(subject))&&(!city||t.city.toLowerCase().includes(city))&&(!level||t.levels.toLowerCase().includes(level))&&(!mode||t.mode.toLowerCase().includes(mode))));
}
$("searchForm").addEventListener("submit",e=>{e.preventDefault();applyFilters();$("teacherGrid").scrollIntoView({behavior:"smooth",block:"start"});});
$("clearFilters").addEventListener("click",()=>{$("searchForm").reset();render();});
$("teacherGrid").addEventListener("click",e=>{const b=e.target.closest("[data-details]");if(!b)return;const t=teachers.find(x=>x.id===b.dataset.details);if(t)alert(`${t.name}\n${t.qualification}\nSubjects: ${t.subjects}\nExperience: ${t.experience} years\nClasses: ${t.levels}\nAvailability: ${t.availability}\nAbout: ${t.bio||"—"}`);});
$("teacherForm").addEventListener("submit",async e=>{
 e.preventDefault();const f=new FormData(e.currentTarget);const t=Object.fromEntries(f.entries());t.experience=Number(t.experience);t.fee=Number(t.fee);t.approved=false;
 try{if(db){await addDoc(collection(db,"teachers"),{...t,createdAt:serverTimestamp()});}else{t.id="local"+Date.now();teachers.push(t);}
 $("formNote").textContent="Profile submitted. It will appear publicly after an administrator approves it.";e.currentTarget.reset();
 }catch(err){$("formNote").textContent="Could not submit profile. Check Firebase setup and Firestore rules, then try again.";console.error(err);}
});
async function loadTeachers(){try{const snap=await getDocs(query(collection(db,"teachers"),where("approved","==",true)));const cloud=snap.docs.map(d=>({id:d.id,...d.data()}));teachers=[...demoTeachers,...cloud];render();}catch(e){console.warn("Could not load Firebase profiles:",e);}}
$("loginBtn").addEventListener("click",()=>$("loginDialog").showModal());
$("loginSubmit").addEventListener("click",async()=>{
 if(!auth){$("loginMessage").textContent="Firebase is not configured yet. Add your project settings in firebase-config.js.";return;}
 try{const cred=await signInWithEmailAndPassword(auth,$("loginEmail").value,$("loginPassword").value);$("loginMessage").textContent=`Signed in as ${cred.user.email}. A secured teacher dashboard must be configured with role-based access.`;}
 catch(e){$("loginMessage").textContent="Sign-in failed. Check your email, password, and Firebase Authentication settings.";}
});
$("menuToggle").addEventListener("click",()=>$("nav").classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>$("nav").classList.remove("open")));
$("year").textContent=new Date().getFullYear();render();
