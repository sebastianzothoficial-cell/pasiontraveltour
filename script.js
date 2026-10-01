const WHATSAPP_NUMBER="5548996752532";
function whatsappUrl(message){return "https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(message);}
const menuBtn=document.querySelector("#menuBtn");
const nav=document.querySelector(".main-nav");
if(menuBtn){menuBtn.addEventListener("click",()=>nav.classList.toggle("open"));}
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
const form=document.querySelector("#quoteForm");
if(form){form.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(form);const msg=["Hola, Pasión Travel Tour. Quiero cotizar un viaje.","","Nombre: "+d.get("name"),"Destino: "+d.get("destination"),"Mensaje: "+(d.get("message")||"Sin detalles adicionales")].join("\n");window.open(whatsappUrl(msg),"_blank","noopener,noreferrer");});}