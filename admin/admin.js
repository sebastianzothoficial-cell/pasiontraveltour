const SUPABASE_URL=window.PASION_SUPABASE_URL||"";
const SUPABASE_ANON_KEY=window.PASION_SUPABASE_ANON_KEY||"";
const loginView=document.querySelector("#loginView");
const dashboardView=document.querySelector("#dashboardView");
const loginForm=document.querySelector("#loginForm");
const loginMessage=document.querySelector("#loginMessage");
const adminMessage=document.querySelector("#adminMessage");
const userEmail=document.querySelector("#userEmail");
const logoutBtn=document.querySelector("#logoutBtn");
const refreshBtn=document.querySelector("#refreshBtn");
const leadsBody=document.querySelector("#leadsBody");
const statusFilter=document.querySelector("#statusFilter");
const languageFilter=document.querySelector("#languageFilter");
const destinationFilter=document.querySelector("#destinationFilter");
const tripTypeFilter=document.querySelector("#tripTypeFilter");
const leadCount=document.querySelector("#leadCount");
const newLeadCount=document.querySelector("#newLeadCount");
const qualifiedLeadCount=document.querySelector("#qualifiedLeadCount");
const wonLeadCount=document.querySelector("#wonLeadCount");
const statusSummary=document.querySelector("#statusSummary");
let client=null;
let currentUser=null;
let allLeads=[];

const STATUSES=["new","contacted","qualified","quoted","won","lost","archived"];

function message(v){if(loginMessage)loginMessage.textContent=v||""}
function adminMsg(v){if(adminMessage)adminMessage.textContent=v||""}
function showDashboard(user){
 loginView.classList.add("hidden");
 dashboardView.classList.remove("hidden");
 currentUser=user;
 userEmail.textContent=user?.email||"";
 loadDashboard();
}
function showLogin(){
 dashboardView.classList.add("hidden");
 loginView.classList.remove("hidden");
 currentUser=null;
}
function esc(value){
 return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function formatDate(value){
 if(!value)return "-";
 return new Intl.DateTimeFormat("es-AR",{dateStyle:"short",timeStyle:"short"}).format(new Date(value));
}
function filteredLeads(){
 const status=statusFilter.value,language=languageFilter.value,destination=destinationFilter.value.trim().toLowerCase(),trip=tripTypeFilter.value.trim().toLowerCase();
 return allLeads.filter(l=>
  (!status||l.status===status)&&
  (!language||l.language===language)&&
  (!destination||String(l.destination||"").toLowerCase().includes(destination))&&
  (!trip||String(l.trip_type||"").toLowerCase().includes(trip))
 );
}
function renderLeads(){
 const rows=filteredLeads();
 if(!rows.length){leadsBody.innerHTML='<tr><td colspan="6">No hay leads con estos filtros.</td></tr>';return;}
 leadsBody.innerHTML=rows.map(l=>`<tr>
 <td><small>${esc(formatDate(l.created_at))}</small></td>
 <td><strong>${esc(l.name)}</strong><small>${esc(l.message||"")}</small></td>
 <td><small>${esc(l.whatsapp||"-")}<br>${esc(l.email||"-")}</small></td>
 <td><strong>${esc(l.destination||"-")}</strong><small>${esc(l.trip_type||"-")} · ${esc(l.travelers||"-")} viajeros</small></td>
 <td><span class="badge">${esc((l.language||"-").toUpperCase())}</span></td>
 <td><select class="status-select" data-lead-id="${esc(l.id)}">${STATUSES.map(s=>`<option value="${s}" ${s===l.status?"selected":""}>${s}</option>`).join("")}</select></td>
 </tr>`).join("");
 document.querySelectorAll(".status-select").forEach(select=>select.addEventListener("change",()=>updateLeadStatus(select.dataset.leadId,select.value)));
}
function renderSummary(){
 const counts=Object.fromEntries(STATUSES.map(s=>[s,0]));
 allLeads.forEach(l=>{if(counts[l.status]!==undefined)counts[l.status]++;});
 leadCount.textContent=allLeads.length;
 newLeadCount.textContent=counts.new;
 qualifiedLeadCount.textContent=counts.qualified;
 wonLeadCount.textContent=counts.won;
 statusSummary.innerHTML=STATUSES.map(s=>`<div><span>${s}</span><strong>${counts[s]}</strong></div>`).join("");
}
async function loadDashboard(){
 if(!client||!currentUser)return;
 adminMsg("");
 const {data,error}=await client.from("leads").select("*").order("created_at",{ascending:false});
 if(error){
  allLeads=[];
  renderSummary();
  leadsBody.innerHTML='<tr><td colspan="6">No se pudieron cargar los leads. Verificá que tu usuario tenga un perfil staff en Supabase.</td></tr>';
  adminMsg("Acceso autenticado, pero el perfil todavía no tiene permisos de staff.");
  return;
 }
 allLeads=data||[];
 renderSummary();
 renderLeads();
}
async function updateLeadStatus(id,status){
 const lead=allLeads.find(l=>l.id===id);
 if(!lead||lead.status===status)return;
 const previous=lead.status;
 const {error}=await client.from("leads").update({status}).eq("id",id);
 if(error){
  adminMsg("No se pudo actualizar el estado del lead.");
  renderLeads();
  return;
 }
 const audit={actor_id:currentUser.id,entity_type:"lead",entity_id:id,action:"status_changed",details:{from:previous,to:status}};
 const auditResult=await client.from("audit_logs").insert(audit);
 if(auditResult.error)console.warn("No se pudo registrar auditoría:",auditResult.error);
 lead.status=status;
 renderSummary();
 renderLeads();
}
async function boot(){
 if(!window.supabase){message("No se pudo cargar el sistema de autenticación.");return}
 if(!SUPABASE_URL||!SUPABASE_ANON_KEY){
  message("Falta configurar Supabase para activar el login seguro.");
  loginForm.querySelector("button").disabled=true;
  return;
 }
 client=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
 const {data}=await client.auth.getSession();
 if(data.session)showDashboard(data.session.user);
 client.auth.onAuthStateChange((_event,session)=>session?showDashboard(session.user):showLogin());
}
loginForm.addEventListener("submit",async e=>{
 e.preventDefault();message("");
 if(!client){message("El acceso seguro todavía no está configurado.");return}
 const email=document.querySelector("#email").value.trim();
 const password=document.querySelector("#password").value;
 const {error}=await client.auth.signInWithPassword({email,password});
 if(error)message("No se pudo iniciar sesión. Verificá email y contraseña.");
});
logoutBtn.addEventListener("click",async()=>{if(client)await client.auth.signOut();showLogin();});
refreshBtn.addEventListener("click",loadDashboard);
[statusFilter,languageFilter,destinationFilter,tripTypeFilter].forEach(el=>el.addEventListener("input",renderLeads));
boot();