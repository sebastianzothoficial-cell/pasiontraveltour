(() => {
  const cfg = window.PASION_SUPABASE_URL ? window.PASION_SUPABASE_URL + "/functions/v1/pasion-travel-agent" : "";
  const whatsapp = () => String(window.PASION_WHATSAPP_NUMBER || "5548996752532").replace(/\\D/g, "");
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
  function chips(items){
    const wrap=document.createElement("div"); wrap.className="agent-chips";
    items.forEach(item=>{const b=document.createElement("button");b.className="agent-chip";b.type="button";b.textContent=item;b.addEventListener("click",()=>{sendMessage(item)});wrap.appendChild(b);});
    messages.appendChild(wrap);messages.scrollTop=messages.scrollHeight;
  }
  function openAgent(){
    modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("agent-lock"); input.focus();
    if(!messages.children.length){
      const l=lang();
      addMessage("agent", l==="pt" ? "Olá 👋 Sou o consultor de viagens da Pasión Travel Tour. Estou aqui para ajudar você a montar sua experiência em Buenos Aires. Não precisa saber exatamente o que quer fazer. Me conte como é a sua viagem e eu vou fazendo algumas perguntas." : l==="en" ? "Hi 👋 I'm the Pasión Travel Tour travel advisor. I'm here to help you build your Buenos Aires experience. You don't need to know exactly what you want to do. Tell me about your trip and I'll guide you with a few questions." : "Hola 👋 Soy el asesor de viajes de Pasión Travel Tour. Estoy para ayudarte a organizar tu experiencia en Buenos Aires. No necesitás saber exactamente qué querés hacer. Contame cómo es tu viaje y te voy haciendo algunas preguntas.");
      chips(l==="pt"?["Casal","Família","Futebol","Tango","Gastronomia","Quero contar minha ideia"]:["Pareja","Familia","Fútbol","Tango","Gastronomía","Quiero contarte mi idea"]);
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
      if(data.proposal_ready){
        renderSummary(data);
      } else if(Array.isArray(data.missing_fields)&&data.missing_fields.length===0){
        chips(lang()==="pt"?["Preparar proposta","Quero mudar algo"]:["Preparar propuesta","Quiero cambiar algo"]);
      }
      messages.scrollTop=messages.scrollHeight;
    }catch(e){addTyping(false);addMessage("agent","No pude conectar con el asesor en este momento. Podés intentar nuevamente.");console.error(e);}
    finally{send.disabled=false;input.focus();}
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
  function renderSummary(data){
    const p=state.profile||{}; const box=document.createElement("div"); box.className="agent-proposal";
    const items=[["Viajeros",p.cantidad_viajeros||"-"],["Duración",p.duracion||"-"],["Fechas",p.fechas||"-"],["Motivo",p.motivo_viaje||"-"],["Intereses",(p.intereses||[]).join(" / ")||"-"],["Preferencias",(p.preferencias||[]).join(" / ")||"-"]];
    box.innerHTML="<h3>Así entendí tu viaje</h3><ul>"+items.map(([k,v])=>"<li><b>"+k+":</b> "+escapeHtml(v)+"</li>").join("")+"</ul>";
    const b=document.createElement("button");b.className="agent-primary";b.type="button";b.textContent=lang()==="pt"?"Preparar proposta":lang()==="en"?"Prepare proposal":"Preparar propuesta";b.addEventListener("click",()=>showContact(box));box.appendChild(b);
    const edit=document.createElement("button");edit.className="agent-secondary";edit.type="button";edit.textContent=lang()==="pt"?"Quero mudar algo":lang()==="en"?"I want to change something":"Quiero cambiar algo";edit.style.marginLeft="8px";edit.addEventListener("click",()=>input.focus());box.appendChild(edit);
    messages.appendChild(box);messages.scrollTop=messages.scrollHeight;
  }
  function showContact(container){
    container.remove();
    const box=document.createElement("div");box.className="agent-contact";
    const pt=lang()==="pt", en=lang()==="en";
    box.innerHTML="<h3>"+(pt?"Vamos preparar sua solicitação":en?"Let's prepare your request":"Vamos a preparar tu solicitud")+"</h3><p>"+(pt?"Deixe seus dados para que a equipe da Pasión Travel Tour possa continuar a cotação.":en?"Leave your details so the Pasión Travel Tour team can continue the quote.":"Dejanos tus datos para que el equipo de Pasión Travel Tour continúe la cotización.")+"</p><div class='agent-contact-grid'><input id='agentName' placeholder='"+(pt?"Nome":en?"Name":"Nombre")+"'><input id='agentWhatsApp' placeholder='WhatsApp'><input id='agentEmail' type='email' placeholder='Email'></div><div class='agent-contact-actions'><button class='agent-primary' id='agentConfirm'>"+(pt?"Confirmar solicitação":en?"Confirm request":"Confirmar solicitud")+"</button><button class='agent-secondary' id='agentBack'>"+(pt?"Voltar":en?"Back":"Volver")+"</button></div>";
    messages.appendChild(box);messages.scrollTop=messages.scrollHeight;
    $("#agentConfirm").addEventListener("click",()=>confirmRequest(box));$("#agentBack").addEventListener("click",()=>{box.remove();input.focus();});
  }
  async function confirmRequest(box){
    const contact={name:$("#agentName")?.value.trim(),whatsapp:$("#agentWhatsApp")?.value.trim(),email:$("#agentEmail")?.value.trim()};
    if(!contact.name||!contact.whatsapp){alert(lang()==="pt"?"Informe nome e WhatsApp.":lang()==="en"?"Please enter your name and WhatsApp.":"Completá nombre y WhatsApp.");return;}
    $("#agentConfirm").disabled=true;
    try{
      const res=await fetch(cfg,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"confirm",sessionId:state.sessionId,profile:state.profile,contact,history:state.history,summary:state.summary,intentLevel:state.intentLevel})});
      const data=await res.json();if(!res.ok)throw new Error(data?.error||"No se pudo guardar la solicitud.");
      box.innerHTML="<div class='agent-success'><h3>"+(lang()==="pt"?"Solicitação criada.":lang()==="en"?"Request created.":"Solicitud creada.")+"</h3><p>"+(lang()==="pt"?"Agora você pode continuar pelo WhatsApp com nossa equipe.":lang()==="en"?"You can now continue on WhatsApp with our team.":"Ahora podés continuar por WhatsApp con nuestro equipo.")+"</p><button class='agent-primary' id='agentWhatsAppGo'>Continuar por WhatsApp</button></div>";
      $("#agentWhatsAppGo").addEventListener("click",()=>window.open("https://wa.me/"+whatsapp()+"?text="+encodeURIComponent(data.whatsappText||""),"_blank","noopener,noreferrer"));
    }catch(e){$("#agentConfirm").disabled=false;alert(e.message||"No se pudo guardar la solicitud.");}
  }
  document.addEventListener("DOMContentLoaded",()=>{
    document.querySelectorAll("[data-open-travel-agent]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();openAgent();}));
    $("#agentClose")?.addEventListener("click",closeAgent);
    $("#agentSend")?.addEventListener("click",()=>sendMessage(input.value));
    input?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input.value);}});
    modal?.addEventListener("click",e=>{if(e.target===modal)closeAgent();});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeAgent();});
  });
  window.PasionTravelAgent={open:openAgent,close:closeAgent};
})();