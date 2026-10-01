(() => {
  const cfg = window.PASION_TRAVEL_AGENT_FUNCTION_URL || (window.PASION_SUPABASE_URL ? window.PASION_SUPABASE_URL + "/functions/v1/pasion-travel-agent" : "");
  const whatsapp = () => String(window.PASION_WHATSAPP_NUMBER || "5548996752532").replace(/\D/g, "");
  const state = { sessionId: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()), history: [], profile: {}, intentLevel: "EXPLORACIÓN", summary: "" };
  const $ = (s) => document.querySelector(s);
  const modal = $("#travelAgentModal"), messages = $("#agentMessages"), input = $("#agentInput"), send = $("#agentSend"), orb = $("#agentOrb"), status = $("#agentStatus");
  const speech = { recognition:null, speaking:false, listening:false, enabled:true, lang:"es-AR" };

  function lang(){ return $("#languageSelect")?.value || ((navigator.language||"es").toLowerCase().startsWith("pt") ? "pt" : "es"); }
  function speechLang(){ const l=lang(); return l==="pt"?"pt-BR":l==="en"?"en-US":"es-AR"; }
  function setStatus(text){ if(status) status.textContent=text; }
  function speak(text, after){ if(!speech.enabled||!("speechSynthesis" in window)||!text){after?.();return;} window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(String(text)); u.lang=speechLang(); u.rate=1; u.pitch=1; u.volume=1; u.onstart=()=>{speech.speaking=true;document.body.classList.add("agent-speaking");setStatus(lang()==="pt"?"Falando…":lang()==="en"?"Speaking…":"Hablando…");}; u.onend=()=>{speech.speaking=false;document.body.classList.remove("agent-speaking");after?.();}; u.onerror=()=>{speech.speaking=false;document.body.classList.remove("agent-speaking");after?.();}; window.speechSynthesis.speak(u); }
  function addMessage(role,text){ const el=document.createElement("div"); el.className="agent-msg "+role; el.textContent=text; messages.appendChild(el); messages.scrollTop=messages.scrollHeight; }
  function addTyping(show=true){ let el=$("#agentTyping"); if(show){if(!el){el=document.createElement("div");el.id="agentTyping";el.className="agent-typing";el.textContent="…";messages.appendChild(el);}} else el?.remove(); }
  function startListening(){ if(!speech.recognition){setStatus("Tu navegador no habilita el micrófono. Tocá para escribir.");return;} if(speech.listening)return; try{speech.recognition.lang=speechLang();speech.recognition.start();}catch(e){} }
  function stopListening(){ if(speech.recognition&&speech.listening) speech.recognition.stop(); }
  function setupVoice(){
    if(!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)){setStatus("Tocá el botón para escribir.");return;}
    const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition, r=new Recognition();
    r.lang=speechLang();r.continuous=false;r.interimResults=false;r.maxAlternatives=1;
    r.onstart=()=>{speech.listening=true;document.body.classList.add("agent-listening");setStatus(lang()==="pt"?"Estou ouvindo…":lang()==="en"?"I'm listening…":"Te escucho…");};
    r.onresult=e=>{const text=e.results?.[0]?.[0]?.transcript||"";if(text)sendMessage(text);};
    r.onend=()=>{speech.listening=false;document.body.classList.remove("agent-listening");if(!speech.speaking)setStatus(lang()==="pt"?"Tocá o orbe e fale comigo.":lang()==="en"?"Tap the orb and talk to me.":"Tocá el orbe y hablame.");};
    r.onerror=e=>{speech.listening=false;document.body.classList.remove("agent-listening");setStatus(e?.error==="not-allowed"?"Necesito permiso para usar el micrófono.":"No pude escuchar. Tocá el orbe para intentar otra vez.");};
    speech.recognition=r;
  }
  function toggleVoice(){ if(speech.listening){stopListening();return;} startListening(); }
  function openAgent(userInitiated=false){
    modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("agent-lock");
    if(!messages.children.length){
      const l=lang(), greeting=l==="pt"?"Olá! 👋 Sou o Tour Manager da Pasión Travel Tour. Como você quer viver sua viagem em Buenos Aires?":l==="en"?"Hi! 👋 I'm the Tour Manager at Pasión Travel Tour. How do you want to experience Buenos Aires?":"¡Hola! 👋 Soy el Tour Manager de Pasión Travel Tour. ¿Cómo querés que sea tu viaje?";
      addMessage("agent",greeting); speak(greeting,()=>{if(userInitiated)setTimeout(startListening,250);});
    } else if(userInitiated) startListening();
  }
  function closeAgent(){stopListening();window.speechSynthesis?.cancel();modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("agent-lock","agent-speaking","agent-listening");}
  async function sendMessage(text){
    text=String(text||"").trim();if(!text||send.disabled)return;
    addMessage("user",text);state.history.push({role:"user",text});input.value="";send.disabled=true;addTyping(true);setStatus(lang()==="pt"?"Pensando…":lang()==="en"?"Thinking…":"Pensando…");
    try{
      const res=await fetch(cfg,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"chat",sessionId:state.sessionId,message:text,history:state.history.slice(-20),profile:state.profile})});
      const data=await res.json();if(!res.ok)throw new Error(data?.error||"Gemini no pudo responder.");
      addTyping(false);state.profile=data.profile||state.profile;state.intentLevel=data.intent_level||state.intentLevel;state.summary=data.summary||state.summary;
      const reply=data.reply||"Contame un poco más y seguimos.";addMessage("agent",reply);state.history.push({role:"assistant",text:reply});
      setStatus(lang()==="pt"?"":lang()==="en"?"":"");
      speak(reply,()=>{if(modal.classList.contains("open"))setTimeout(startListening,250);});
      if(Array.isArray(data.experiences)&&data.experiences.length){const box=document.createElement("div");box.className="agent-proposal";box.innerHTML="<span>"+data.experiences.slice(0,3).map(x=>escapeHtml(x)).join(" · ")+"</span>";messages.appendChild(box);}
      if(data.contact_ready&&data.contact)await confirmRequest(data.contact);
    }catch(e){addTyping(false);const detail=e?.message||"Gemini no pudo responder.";addMessage("agent",detail);setStatus("Hay un problema de conexión. Tocá el orbe para intentar de nuevo.");speak(detail);console.error(e);}
    finally{send.disabled=false;}
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
  async function confirmRequest(contact){
    const cleanContact={name:String(contact?.name||state.profile?.nombre||"").trim(),whatsapp:String(contact?.whatsapp||"").trim(),email:String(contact?.email||"").trim()};if(!cleanContact.name||!cleanContact.whatsapp)return;
    try{const res=await fetch(cfg,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"confirm",sessionId:state.sessionId,profile:state.profile,contact:cleanContact,history:state.history,summary:state.summary,intentLevel:state.intentLevel})});const data=await res.json();if(!res.ok)throw new Error(data?.error||"No se pudo guardar la solicitud.");const box=document.createElement("div");box.className="agent-success";box.innerHTML="<strong>"+(lang()==="pt"?"Perfeito.":"Perfecto.")+"</strong> <span>"+(lang()==="pt"?"Sua solicitação ficou preparada.":"Tu solicitud quedó preparada.")+"</span><button class='agent-primary' id='agentWhatsAppGo'>WhatsApp</button>";messages.appendChild(box);$("#agentWhatsAppGo").addEventListener("click",()=>window.open("https://wa.me/"+whatsapp()+"?text="+encodeURIComponent(data.whatsappText||""),"_blank","noopener,noreferrer"));}catch(e){console.error(e);}
  }
  document.addEventListener("DOMContentLoaded",()=>{
    setTimeout(()=>openAgent(false),900);
    document.querySelectorAll("[data-open-travel-agent]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();openAgent(true);}));
    $("#agentClose")?.addEventListener("click",closeAgent);$("#agentOrb")?.addEventListener("click",toggleVoice);
    $("#agentForm")?.addEventListener("submit",e=>{e.preventDefault();sendMessage(input.value);});
    $("#agentTextFallback")?.addEventListener("click",()=>{input.focus();setStatus("Escribí tu mensaje y presioná Enter.");});
    setupVoice();input?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input.value);}});
    modal?.addEventListener("click",e=>{if(e.target===modal)closeAgent();});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeAgent();});
  });
  window.PasionTravelAgent={open:()=>openAgent(true),close:closeAgent};
})();