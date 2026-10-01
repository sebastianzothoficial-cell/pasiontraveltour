const WHATSAPP_NUMBER="5548996752532";
function whatsappUrl(message){return "https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(message);}
const menuBtn=document.querySelector("#menuBtn");
const nav=document.querySelector(".main-nav");
if(menuBtn){menuBtn.addEventListener("click",()=>nav.classList.toggle("open"));}
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const translations={
es:{
"title":"Pasión Travel Tour | Buenos Aires y Argentina","description":"Pasión Travel Tour: receptivo en Buenos Aires y Argentina para viajeros de Brasil. Tango, fútbol, gastronomía, parejas, familias, traslados y experiencias a medida. Cotizá por WhatsApp.",
nav:{home:"Inicio",ba:"Buenos Aires",argentina:"Argentina",packages:"Paquetes",about:"Nosotros",contact:"Contacto",whatsapp:"Cotizá por WhatsApp"},
hero:{eyebrow:"DESCUBRÍ",title:"Buenos Aires",kicker:"Una ciudad, mil experiencias",copy:"Tango, fútbol, gastronomía, experiencias románticas, familia y mucho más. Decinos qué querés vivir y armamos el viaje.",cta:"✈  Quiero armar mi viaje  ›"},
trust:{safe:"Viajes seguros",safeSub:"Tu tranquilidad es nuestra prioridad",personal:"Atención personalizada",personalSub:"Te acompañamos en todo el proceso",unique:"Experiencias únicas",uniqueSub:"Más que un viaje, una historia",receptive:"Receptivo en Argentina y Brasil",receptiveSub:"Buenos Aires | Argentina"},
dest:{view:"Ver experiencias →"},visual:{eyebrow:"BUENOS AIRES NO SE VISITA",title:"Se vive.",copy:"Una noche de tango. Un asado. Un partido. Una caminata por San Telmo. Un brindis con vino argentino. Elegí el momento y nosotros armamos el resto.",cta:"Elegir mi experiencia  ›"},
ba:{eyebrow:"BUENOS AIRES",title:"Elegí cómo querés vivir la ciudad.",copy:"Diseñamos experiencias para parejas, familias, grupos y viajeros que quieren algo diferente."},
trip:{eyebrow:"EMPECEMOS POR VOS",title:"¿Qué tipo de viaje estás buscando?",copy:"Elegí lo que más se parece a tu viaje y te llevamos directo a WhatsApp para empezar a armarlo."},
brazil:{eyebrow:"PARA QUEM VEM DO BRASIL",title:"Buenos Aires do seu jeito.",copy:"Atendimento próximo, experiências selecionadas e ajuda para montar sua viagem antes e durante a estadia.",cta:"Quero falar em português  ›"},
manifesto:{eyebrow:"PASIÓN TRAVEL TOUR",title:"Armamos el viaje que querés vivir."},
process:{eyebrow:"CÓMO FUNCIONA",title:"De tu idea al viaje.",tell:"Contanos",tellSub:"Fechas, viajeros, intereses y estilo.",build:"Armamos",buildSub:"Diseñamos una propuesta a medida.",confirm:"Confirmamos",confirmSub:"Validamos disponibilidad y precio.",enjoy:"Disfrutás",enjoySub:"Te acompañamos por WhatsApp."},
seo:{eyebrow:"IDEAS PARA TU VIAJE",title:"Empezá por lo que querés vivir.",couples:"Buenos Aires para parejas →",families:"Buenos Aires para familias →",football:"Fútbol en Buenos Aires →",tango:"Tango en Buenos Aires →",food:"Gastronomía argentina →",travel:"Viaje a Buenos Aires →"},
contact:{eyebrow:"¿VIAJAMOS?",title:"Contanos cómo imaginás tu viaje.",copy:"Contanos las fechas, cuántos viajan y qué tipo de experiencia buscás. Te respondemos por WhatsApp con una propuesta para tu viaje."},
form:{name:"Nombre",namePh:"Tu nombre",destination:"Destino",destinationChoose:"Elegí un destino",custom:"Paquete a medida",dates:"Fechas",datesPh:"Ej.: 10 al 15 de noviembre",travelers:"Viajeros",travelersPh:"Ej.: 2 adultos",message:"Mensaje",messagePh:"Fechas, cantidad de viajeros y qué te gustaría hacer...",submit:"Enviar por WhatsApp  ›"},
footer:{tagline:"Tu viaje, nuestra pasión."},
trips:["Pareja","Escapada romántica","Familia","Fútbol","Tango y noche porteña","Gastronomía y vino","Experiencias especiales","Viaje completo a medida","Quiero algo diferente"]
},
pt:{
"title":"Pasión Travel Tour | Buenos Aires e Argentina","description":"Pasión Travel Tour: receptivo em Buenos Aires e Argentina para viajantes do Brasil. Tango, futebol, gastronomia, casais, famílias, transfers e experiências sob medida. Fale pelo WhatsApp.",
nav:{home:"Início",ba:"Buenos Aires",argentina:"Argentina",packages:"Pacotes",about:"Sobre nós",contact:"Contato",whatsapp:"Cote pelo WhatsApp"},
hero:{eyebrow:"DESCUBRA",title:"Buenos Aires",kicker:"Uma cidade, mil experiências",copy:"Tango, futebol, gastronomia, experiências românticas, família e muito mais. Conte o que você quer viver e nós montamos a viagem.",cta:"✈  Quero montar minha viagem  ›"},
trust:{safe:"Viagens seguras",safeSub:"Sua tranquilidade é nossa prioridade",personal:"Atendimento personalizado",personalSub:"Acompanhamos você em todo o processo",unique:"Experiências únicas",uniqueSub:"Mais que uma viagem, uma história",receptive:"Receptivo na Argentina e no Brasil",receptiveSub:"Buenos Aires | Argentina"},
dest:{view:"Ver experiências →"},visual:{eyebrow:"BUENOS AIRES NÃO SE VISITA",title:"Vive-se.",copy:"Uma noite de tango. Um asado. Um jogo. Uma caminhada por San Telmo. Um brinde com vinho argentino. Escolha o momento e nós cuidamos do resto.",cta:"Escolher minha experiência  ›"},
ba:{eyebrow:"BUENOS AIRES",title:"Escolha como você quer viver a cidade.",copy:"Criamos experiências para casais, famílias, grupos e viajantes que querem algo diferente."},
trip:{eyebrow:"COMEÇAMOS POR VOCÊ",title:"Que tipo de viagem você está procurando?",copy:"Escolha o que mais combina com sua viagem e vamos direto para o WhatsApp começar a montar."},
brazil:{eyebrow:"PARA QUEM VEM DO BRASIL",title:"Buenos Aires do seu jeito.",copy:"Atendimento próximo, experiências selecionadas e ajuda para montar sua viagem antes e durante a estadia.",cta:"Quero falar em português  ›"},
manifesto:{eyebrow:"PASIÓN TRAVEL TOUR",title:"Montamos a viagem que você quer viver."},
process:{eyebrow:"COMO FUNCIONA",title:"Da sua ideia à viagem.",tell:"Conte para nós",tellSub:"Datas, viajantes, interesses e estilo.",build:"Montamos",buildSub:"Criamos uma proposta sob medida.",confirm:"Confirmamos",confirmSub:"Validamos disponibilidade e preço.",enjoy:"Aproveite",enjoySub:"Acompanhamos você pelo WhatsApp."},
seo:{eyebrow:"IDEIAS PARA SUA VIAGEM",title:"Comece pelo que você quer viver.",couples:"Buenos Aires para casais →",families:"Buenos Aires para famílias →",football:"Futebol em Buenos Aires →",tango:"Tango em Buenos Aires →",food:"Gastronomia argentina →",travel:"Viagem para Buenos Aires →"},
contact:{eyebrow:"VAMOS VIAJAR?",title:"Conte como você imagina sua viagem.",copy:"Conte as datas, quantas pessoas viajam e que experiência procura. Respondemos pelo WhatsApp com uma proposta para sua viagem."},
form:{name:"Nome",namePh:"Seu nome",destination:"Destino",destinationChoose:"Escolha um destino",custom:"Pacote sob medida",dates:"Datas",datesPh:"Ex.: 10 a 15 de novembro",travelers:"Viajantes",travelersPh:"Ex.: 2 adultos",message:"Mensagem",messagePh:"Datas, número de viajantes e o que você gostaria de fazer...",submit:"Enviar pelo WhatsApp  ›"},
footer:{tagline:"Sua viagem, nossa paixão."},
trips:["Casal","Escapada romântica","Família","Futebol","Tango e noite portenha","Gastronomia e vinho","Experiências especiais","Viagem completa sob medida","Quero algo diferente"]
},
en:{
"title":"Pasión Travel Tour | Buenos Aires & Argentina","description":"Pasión Travel Tour: receptive travel in Buenos Aires and Argentina for travelers from Brazil. Tango, football, food, couples, families, transfers and tailor-made experiences.",
nav:{home:"Home",ba:"Buenos Aires",argentina:"Argentina",packages:"Packages",about:"About us",contact:"Contact",whatsapp:"Get a quote on WhatsApp"},
hero:{eyebrow:"DISCOVER",title:"Buenos Aires",kicker:"One city, a thousand experiences",copy:"Tango, football, food, romantic experiences, family and more. Tell us what you want to live and we'll build the trip.",cta:"✈  Build my trip  ›"},
trust:{safe:"Safe travel",safeSub:"Your peace of mind comes first",personal:"Personalized service",personalSub:"We support you throughout the journey",unique:"Unique experiences",uniqueSub:"More than a trip, a story",receptive:"Receptive service in Argentina & Brazil",receptiveSub:"Buenos Aires | Argentina"},
dest:{view:"View experiences →"},visual:{eyebrow:"YOU DON'T JUST VISIT BUENOS AIRES",title:"You live it.",copy:"A tango night. An asado. A football match. A walk through San Telmo. A toast with Argentine wine. Choose the moment and we'll handle the rest.",cta:"Choose my experience  ›"},
ba:{eyebrow:"BUENOS AIRES",title:"Choose how you want to experience the city.",copy:"We design experiences for couples, families, groups and travelers looking for something different."},
trip:{eyebrow:"START WITH YOU",title:"What kind of trip are you looking for?",copy:"Choose what best matches your trip and we'll take you straight to WhatsApp to start planning."},
brazil:{eyebrow:"FOR TRAVELERS FROM BRAZIL",title:"Buenos Aires, your way.",copy:"Personal service, selected experiences and help planning your trip before and during your stay.",cta:"Talk to us in Portuguese  ›"},
manifesto:{eyebrow:"PASIÓN TRAVEL TOUR",title:"We build the trip you want to live."},
process:{eyebrow:"HOW IT WORKS",title:"From your idea to the trip.",tell:"Tell us",tellSub:"Dates, travelers, interests and style.",build:"We build",buildSub:"We create a tailor-made proposal.",confirm:"We confirm",confirmSub:"We validate availability and price.",enjoy:"Enjoy",enjoySub:"We're with you on WhatsApp."},
seo:{eyebrow:"TRIP IDEAS",title:"Start with what you want to experience.",couples:"Buenos Aires for couples →",families:"Buenos Aires for families →",football:"Football in Buenos Aires →",tango:"Tango in Buenos Aires →",food:"Argentine food & wine →",travel:"Trip to Buenos Aires →"},
contact:{eyebrow:"LET'S TRAVEL?",title:"Tell us how you imagine your trip.",copy:"Tell us your dates, number of travelers and the experience you want. We'll reply on WhatsApp with a proposal."},
form:{name:"Name",namePh:"Your name",destination:"Destination",destinationChoose:"Choose a destination",custom:"Tailor-made package",dates:"Dates",datesPh:"E.g. November 10–15",travelers:"Travelers",travelersPh:"E.g. 2 adults",message:"Message",messagePh:"Dates, number of travelers and what you'd like to do...",submit:"Send on WhatsApp  ›"},
footer:{tagline:"Your trip, our passion."},
trips:["Couples","Romantic getaway","Family","Football","Tango & Buenos Aires nightlife","Food & wine","Special experiences","Complete tailor-made trip","I want something different"]
}
}};
const waMessages={
es:{quote:"Hola Pasión Travel Tour, quiero cotizar un viaje.",start:"Hola Pasión Travel Tour, quiero armar mi viaje a Buenos Aires.",pt:"Hola Pasión Travel Tour, vengo de Brasil y quiero montar mi viaje a Buenos Aires."},
pt:{quote:"Olá Pasión Travel Tour, quero fazer um orçamento de viagem.",start:"Olá Pasión Travel Tour, quero montar minha viagem para Buenos Aires.",pt:"Olá Pasión Travel Tour, venho do Brasil e quero montar minha viagem para Buenos Aires."},
en:{quote:"Hello Pasión Travel Tour, I'd like a travel quote.",start:"Hello Pasión Travel Tour, I'd like to plan my trip to Buenos Aires.",pt:"Hello Pasión Travel Tour, I'm traveling from Brazil and would like to plan my trip to Buenos Aires."}
};
function get(obj,key){return key.split(".").reduce((o,k)=>o&&o[k],obj);}
function setLanguage(lang){
 const t=translations[lang]||translations.es;
 document.documentElement.lang=lang;
 document.title=t.title;
 document.querySelector('meta[name="description"]')?.setAttribute("content",t.description);
 document.querySelectorAll("[data-i18n]").forEach(el=>{const v=get(t,el.dataset.i18n);if(v!==undefined)el.textContent=v;});
 document.querySelectorAll("[data-ph]").forEach(el=>{const v=get(t,el.dataset.ph);if(v!==undefined)el.placeholder=v;});
 const select=document.querySelector("#languageSelect");if(select)select.value=lang;
 document.querySelectorAll("[data-wa]").forEach(a=>{const k=a.dataset.wa;a.href=whatsappUrl(waMessages[lang]?.[k]||waMessages[lang].start);});
 const cards=document.querySelectorAll(".trip-card");cards.forEach((card,i)=>{const v=t.trips[i];if(v)card.querySelector("strong").textContent=v;});
 localStorage.setItem("pasionLang",lang);
}
const languageSelect=document.querySelector("#languageSelect");
const saved=localStorage.getItem("pasionLang");
const browser=(navigator.language||"es").toLowerCase();
const initial=saved|| (browser.startsWith("pt")?"pt":browser.startsWith("en")?"en":"es");
if(languageSelect){languageSelect.addEventListener("change",e=>setLanguage(e.target.value));}
setLanguage(initial);

const form=document.querySelector("#quoteForm");
if(form){form.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(form);const lang=document.querySelector("#languageSelect")?.value||"es";const t=translations[lang];const msg=[t.form.submit.replace("  ›","")+" — Pasión Travel Tour","",""+t.form.name+": "+d.get("name"),t.form.destination+": "+d.get("destination"),t.form.dates+": "+(d.get("dates")||"-"),t.form.travelers+": "+(d.get("travelers")||"-"),t.form.message+": "+(d.get("message")||"-")].join("\n");window.open(whatsappUrl(msg),"_blank","noopener,noreferrer");});}
