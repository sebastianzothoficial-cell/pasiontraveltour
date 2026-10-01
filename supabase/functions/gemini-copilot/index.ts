import { createSupabaseContext } from "npm:@supabase/server@1";
const MODEL=Deno.env.get("GEMINI_MODEL")||"gemini-3.6-flash";
const GEMINI_API_KEY=Deno.env.get("GEMINI_API_KEY");
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json",...cors}});
const system=`Eres el copiloto interno de Pasión Travel Tour, una agencia receptiva de Argentina enfocada inicialmente en viajeros de Brasil. Ayudas a analizar leads y preparar borradores de cotización. No inventes disponibilidad, costos, proveedores, márgenes ni reservas. Si falta información, indícalo. Las cotizaciones son borradores para revisión humana; nunca confirmes una venta ni ejecutes una reserva. Respeta la regla: ningún producto se vende sin ejecución identificada. Considera que proveedores con estado Summa "excluded" no deben proponerse.`;
Deno.serve(async req=>{
 if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
 const {data:ctx,error:authError}=await createSupabaseContext(req,{auth:"user"});
 if(authError) return json({error:authError.message},401);
 const userId=ctx.userClaims?.sub;
 const {data:profile}=await ctx.supabase.from("profiles").select("id,role").eq("id",userId).maybeSingle();
 if(!profile || !["admin","manager","operator"].includes(profile.role)) return json({error:"Usuario sin permisos de backoffice."},403);
 if(!GEMINI_API_KEY) return json({error:"GEMINI_API_KEY no está configurada en Supabase."},503);
 let body={};try{body=await req.json()}catch{}
 const mode=body.mode==="quote"?"quote":"analyze";
 const prompt=String(body.prompt||"").trim().slice(0,12000);
 if(!prompt)return json({error:"Falta prompt."},400);
 const full=`${system}\n\nModo: ${mode==="quote"?"borrador de cotización":"análisis comercial"}.\n\nSolicitud:\n${prompt}`;
 const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+MODEL+":generateContent?key="+encodeURIComponent(GEMINI_API_KEY),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:full}]}],generationConfig:{temperature:0.2,maxOutputTokens:2500}})});
 const g=await r.json();
 if(!r.ok){await ctx.supabase.from("ai_runs").insert({actor_id:userId,mode,prompt,output:JSON.stringify(g),model:MODEL,status:"error"});return json({error:g?.error?.message||"Gemini API error"},502)}
 const output=g?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("\n").trim()||"Sin respuesta.";
 await ctx.supabase.from("ai_runs").insert({actor_id:userId,mode,prompt,output,model:MODEL,status:"completed"});
 return json({output,model:MODEL});
});