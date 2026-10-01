const AI_PREVIEW=window.PASION_ADMIN_PREVIEW===true;
const AI_URL=window.PASION_AI_FUNCTION_URL||"";
const aiInput=document.querySelector("#aiPrompt");
const aiOutput=document.querySelector("#aiOutput");
const aiStatus=document.querySelector("#aiStatus");
const aiCounter=document.querySelector("#aiCounter");
const aiExample=document.querySelector("#aiExample");
const aiClear=document.querySelector("#aiClear");
const aiCopy=document.querySelector("#aiCopy");

const EXAMPLE=`Somos 2 viajeros de Brasil que quieren visitar Buenos Aires durante 5 días.
Buscamos una experiencia de tango, una excursión y traslado desde el aeropuerto.
Todavía no definimos fechas ni presupuesto.
Analizá el lead, indicá qué información falta y cuál debería ser el próximo paso comercial.`;

function aiSetStatus(s,error=false){
  if(aiStatus){aiStatus.textContent=s;aiStatus.classList.toggle("error",error)}
}
function aiRender(text){
  if(aiOutput)aiOutput.textContent=text||"Sin respuesta.";
}
function aiUpdateCounter(){
  if(aiCounter&&aiInput)aiCounter.textContent=aiInput.value.length+" / 12000";
}
async function runAI(mode="analyze"){
  const prompt=(aiInput?.value||"").trim();
  if(!prompt){aiSetStatus("Escribí la consulta del cliente.",true);aiInput?.focus();return}
  const trigger=document.activeElement?.matches?.("[data-ai-mode]")?document.activeElement:null;
  document.querySelectorAll("[data-ai-mode]").forEach(b=>b.disabled=true);
  aiSetStatus(AI_PREVIEW?"PREVIEW · simulación":"Consultando Gemini…");
  try{
    if(AI_PREVIEW){
      await new Promise(r=>setTimeout(r,450));
      aiRender(mode==="quote"
        ?"BORRADOR DE COTIZACIÓN\n\nCliente: solicitud demo\nDestino: Buenos Aires\nViajeros: 2\n\nServicios sugeridos: validar con proveedores.\nPrecio: pendiente de datos reales.\n\n⚠️ PREVIEW: no crea ni modifica una cotización."
        :"ANÁLISIS COMERCIAL\n\nIntención: alta\nDestino: Buenos Aires\nPerfil: 2 viajeros de Brasil.\n\nFaltan: fechas, presupuesto y preferencias.\nPróximo paso: completar datos antes de cotizar.");
      aiSetStatus("Preview listo");
      return;
    }
    if(!AI_URL)throw new Error("La función Gemini no está configurada.");
    const res=await fetch(AI_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode,prompt})});
    let data={};try{data=await res.json()}catch{}
    if(!res.ok)throw new Error(data?.error||"Gemini devolvió un error.");
    aiRender(data.output||data.text||"Gemini no devolvió contenido.");
    aiSetStatus("Listo · "+(mode==="quote"?"borrador preparado":"lead analizado"));
  }catch(e){
    aiSetStatus(e.message||"No se pudo procesar la consulta.",true);
    aiRender("No se pudo obtener una respuesta. Revisá el estado de Gemini y volvé a intentar.");
  }finally{
    document.querySelectorAll("[data-ai-mode]").forEach(b=>b.disabled=false);
  }
}
document.addEventListener("DOMContentLoaded",()=>{
  aiInput?.addEventListener("input",aiUpdateCounter);
  aiExample?.addEventListener("click",()=>{aiInput.value=EXAMPLE;aiUpdateCounter();aiInput.focus();aiSetStatus("Ejemplo cargado · listo para analizar")});
  aiClear?.addEventListener("click",()=>{aiInput.value="";aiRender("La respuesta de Gemini aparecerá aquí.");aiUpdateCounter();aiSetStatus("Listo para analizar");aiInput.focus()});
  aiCopy?.addEventListener("click",async()=>{
    const text=aiOutput?.textContent||"";
    if(!text||text.startsWith("La respuesta de Gemini"))return;
    try{await navigator.clipboard.writeText(text);aiSetStatus("Resultado copiado");}catch{aiSetStatus("No se pudo copiar automáticamente.",true)}
  });
  document.querySelectorAll("[data-ai-mode]").forEach(b=>b.addEventListener("click",()=>runAI(b.dataset.aiMode)));
  aiUpdateCounter();
});