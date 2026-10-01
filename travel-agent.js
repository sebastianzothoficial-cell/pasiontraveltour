(() => {
  const cfg = window.PASION_TRAVEL_AGENT_FUNCTION_URL || (window.PASION_SUPABASE_URL ? window.PASION_SUPABASE_URL + "/functions/v1/pasion-travel-agent" : "");
  const whatsapp = () => String(window.PASION_WHATSAPP_NUMBER || "5548996752532").replace(/\D/g, "");
  const state = { sessionId: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()), history: [], profile: {}, intentLevel: "EXPLORACIÓN", summary: "" };

  const $ = (s) => document.querySelector(s);
  const modal = $("#travelAgentModal"), messages = $("#agentMessages"), input = $("#agentInput"), send = $("#agentSend");

  function lang(){ return $("#languageSelect")?.value || ((navigator.language||"es").toLowerCase().startsWith("pt") ? "pt" : "es"); }
  function addMessage(role,text){
    const el=document.createElement("div"); el.className="agent-msg "+role; el.textContent=text; messages.appendChild(el); messages.scrollTop=messages.scrollHeight;
  }
  function addTyping(show=true){
    let el=$("#agentTyping"); if(show){ if(!el){el=document.createElement("div");el.id="agentTyping";el.className="agent-typing";el.textContent="El asesor está pensando…";messages.appendChild(el);} }
    else el?.remove();
    messages.scrollTop=messages.scrollHeight;
  }
  function openAgent(){
    modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("agent-lock"); input.focus();
    if(!messages.children.length){
      const l=lang();
      addMessage("agent", l==="pt" ? "Olá! 👋 Sou o Tour Manager da Pasión Travel Tour. Como você está? Quando você pretende vir a Buenos Aires?" : "¡Hola! 👋 Soy el Tour Manager de Pasión Travel Tour. ¿Cómo estás? ¿Cuándo pensás venir a Buenos Aires?");
    }
  }
  function closeAgent(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("agent-lock");}
  async function sendMessage(text){
    text=String(text||"").trim(); if(!text||send.disabled)return;
    addMessage("user",text); state.history.push({role:"user",text}); input.value=""; send.disabled=true; addTyping(true);
    try{
      const res=await fetch(cfg,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"chat",sessionId:state.sessionId,message:text,history:state.history.slice(-20),profile:state.profile})});
      const data=await res.json(); if(!res.ok) throw new Error(data?.error||"No se pudo conectar con el asesor.");
      addTyping(false); state.profile=data.profile||state.profile; state.intentLevel=data.intent_level||state.intentLevel; state.summary=data.summary||state.summary;
      addMessage("agent",data.reply||"Contame un poco más y seguimos.");
      state.history.push({role:"assistant",text:data.reply||""});
      if(Array.isArray(data.experiences)&&data.experiences.length){
        const box=document.createElement("div");box.className="agent-proposal";box.innerHTML="<h3>Ideas que podrían encajar</h3><ul>"+data.experiences.slice(0,5).map(x=>"<li>"+escapeHtml(x)+"</li>").join("")+"</ul>";messages.appendChild(box);
      }
      if(data.contact_ready&&data.contact){
        await confirmRequest(data.contact);
      }
      messages.scrollTop=messages.scrollHeight;
    }catch(e){addTyping(false);addMessage("agent","No pude conectar con el asesor en este momento. Podés intentar nuevamente.");console.error(e);}
    finally{send.disabled=false;input.focus();}
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
  async function confirmRequest(contact){
    const cleanContact={
      name:String(contact?.name||state.profile?.nombre||"").trim(),
      whatsapp:String(contact?.whatsapp||"").trim(),
      email:String(contact?.email||"").trim()
    };
    if(!cleanContact.name||!cleanContact.whatsapp)return;
    try{
      const res=await fetch(cfg,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"confirm",sessionId:state.sessionId,profile:state.profile,contact:cleanContact,history:state.history,summary:state.summary,intentLevel:state.intentLevel})});
      const data=await res.json();if(!res.ok)throw new Error(data?.error||"No se pudo guardar la solicitud.");
      const box=document.createElement("div");box.className="agent-success";
      box.innerHTML="<h3>"+(lang()==="pt"?"Perfeito. Já deixei sua solicitação preparada.":lang()==="en"?"Perfect. I've prepared your request.":"Perfecto. Ya dejé preparada tu solicitud.")+"</h3><p>"+(lang()==="pt"?"Agora você pode continuar pelo WhatsApp com nossa equipe para validar disponibilidade e orçamento.":lang()==="en"?"You can continue on WhatsApp with our team to validate availability and pricing.":"Ahora podés continuar por WhatsApp con nuestro equipo para validar disponibilidad y presupuesto.")+"</p><button class='agent-primary' id='agentWhatsAppGo'>Continuar por WhatsApp</button>";
      messages.appendChild(box);messages.scrollTop=messages.scrollHeight;
      $("#agentWhatsAppGo").addEventListener("click",()=>window.open("https://wa.me/"+whatsapp()+"?text="+encodeURIComponent(data.whatsappText||""),"_blank","noopener,noreferrer"));
    }catch(e){addMessage("agent",lang()==="pt"?"Tive um problema ao registrar sua solicitação. Vamos tentar novamente.":lang()==="en"?"I had a problem registering your request. Let's try again.":"Tuve un problema al registrar tu solicitud. Intentemos nuevamente.");console.error(e);}
  }
  document.addEventListener("DOMContentLoaded",()=>{
    setTimeout(()=>openAgent(),900);
    document.querySelectorAll("[data-open-travel-agent]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();openAgent();}));
    $("#agentClose")?.addEventListener("click",closeAgent);
    $("#agentForm")?.addEventListener("submit",e=>{e.preventDefault();sendMessage(input.value);});
    input?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input.value);}});
    modal?.addEventListener("click",e=>{if(e.target===modal)closeAgent();});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeAgent();});
  });
  window.PasionTravelAgent={open:openAgent,close:closeAgent};
})();