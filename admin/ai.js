const AI_PREVIEW=window.PASION_ADMIN_PREVIEW===true;
const AI_URL=window.PASION_AI_FUNCTION_URL||"";
const AI_SUPABASE_URL=window.PASION_SUPABASE_URL||"";
const aiInput=document.querySelector("#aiPrompt");
const aiOutput=document.querySelector("#aiOutput");
const aiRun=document.querySelector("#aiRun");
const aiStatus=document.querySelector("#aiStatus");
function aiSetStatus(s,error=false){if(aiStatus){aiStatus.textContent=s;aiStatus.classList.toggle("error",error)}}
function aiRender(text){if(aiOutput)aiOutput.textContent=text||"Sin respuesta."}
async function runAI(mode="analyze"){
 const prompt=(aiInput?.value||"").trim();
 if(!prompt){aiSetStatus("Escribí la consulta del cliente.",true);return}
 const trigger=document.activeElement?.matches?.("[data-ai-mode]")?document.activeElement:null;
 if(trigger)trigger.disabled=true;
 aiSetStatus(AI_PREVIEW?"PREVIEW · simulación":"Procesando con Gemini…");
 try{
  if(AI_PREVIEW){
   await new Promise(r=>setTimeout(r,450));
   const preview=mode==="quote"
    ?"PROPUESTA DE COTIZACIÓN\n\nCliente: solicitud demo\nDestino: Buenos Aires\nViajeros: 2\n\n1. Transfer aeropuerto → hotel\n2. Experiencia privada a medida\n\nCosto: validar proveedor\nMargen: definir\nPrecio final: pendiente\n\n⚠️ En PREVIEW no se crea ni modifica ninguna cotización."
    :"ANÁLISIS COMERCIAL\n\nIntención: alta\nDestino: Buenos Aires\nPerfil: pareja\nNecesidades detectadas: experiencia personalizada, traslado y actividad principal.\nDatos faltantes: fechas, presupuesto y preferencias.\n\nSiguiente paso sugerido: contactar al cliente y completar los datos antes de confirmar precio.";
   aiRender(preview);return;
  }
  if(!AI_URL)throw new Error("La función Gemini todavía no está configurada.");
  const res=await fetch(AI_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode,prompt})});
  const data=await res.json();
  if(!res.ok)throw new Error(data?.error||"Error de Gemini");
  aiRender(data.output||data.text||JSON.stringify(data,null,2));
  aiSetStatus("Listo · propuesta generada");
 }catch(e){aiSetStatus(e.message||"No se pudo procesar.",true)}
 finally{if(trigger)trigger.disabled=false}
}
document.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll("[data-ai-mode]").forEach(b=>b.addEventListener("click",()=>runAI(b.dataset.aiMode)));
});
