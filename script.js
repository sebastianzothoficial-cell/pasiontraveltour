// Configurá tu número de WhatsApp en formato internacional, sin + ni espacios.
const WHATSAPP_NUMBER = "549XXXXXXXXXX";

function whatsappUrl(message) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

document.querySelectorAll(".quote-tour").forEach((button) => {
  button.addEventListener("click", () => {
    const tour = button.dataset.tour;
    document.querySelector('[name="tour"]').value = tour;
    document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector("#quoteForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    "Hola, Pasión Travel Tour. Quiero consultar:",
    "",
    "Nombre: " + data.get("name"),
    "Experiencia: " + data.get("tour"),
    "Mensaje: " + (data.get("message") || "Sin detalles adicionales"),
  ].join("\n");

  if (WHATSAPP_NUMBER.includes("X")) {
    alert("Antes de publicar, configurá tu número de WhatsApp en script.js.");
    return;
  }
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
});

document.querySelector("#heroWhatsapp").addEventListener("click", (event) => {
  if (WHATSAPP_NUMBER.includes("X")) {
    event.preventDefault();
    document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
    return;
  }
  event.currentTarget.href = whatsappUrl("Hola, Pasión Travel Tour. Quiero información sobre sus experiencias.");
});
