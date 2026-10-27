
const aiForm = document.getElementById("ai-form");
const aiQuestion = document.getElementById("ai-question");
const chatMessages = document.getElementById("chat-messages");
const aiStatus = document.getElementById("ai-status");

function addMessage(message, type) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${type}-message`;
  bubble.textContent = message;
  chatMessages.appendChild(bubble);
  bubble.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function getDemoResponse(question) {
  const text = question.toLowerCase();

  if (text.includes("jean") || text.includes("pantalón")) {
    return "Puedes probar tres ideas: combinar la prenda con una camisa que ya tengas, reparar pequeños daños o explorar una transformación sencilla. Antes de cortarla, piensa si puedes seguir usándola de otras maneras.";
  }

  if (text.includes("camisa") || text.includes("combinar") || text.includes("outfit")) {
    return "Prueba combinar tu prenda con diferentes colores y capas usando lo que ya tienes. También puedes cambiar los accesorios para crear un estilo distinto sin comprar ropa nueva.";
  }

  if (text.includes("dañ") || text.includes("repar")) {
    return "Primero identifica el daño. Una costura abierta o un botón suelto pueden repararse con materiales básicos. Si el daño es mayor, puedes consultar a una persona con experiencia en costura antes de descartar la prenda.";
  }

  if (text.includes("donar")) {
    return "Separa las prendas limpias y revisa su estado. Después, busca una organización o jornada de recepción verificada en tu ciudad. Puedes registrar tu intención de donar en nuestra sección de donaciones.";
  }

  return "¡Exploremos opciones sostenibles! Revisa el estado de tu prenda, piensa cómo podrías combinarla de otra manera y considera repararla o reutilizar parte de su tela. Si me cuentas qué prenda es y qué quieres conseguir, podrás recibir orientación más específica cuando conectemos la IA real.";
}

aiForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const question = aiQuestion.value.trim();
  if (!question) return;

  addMessage(question, "user");
  aiQuestion.value = "";

  const response = getDemoResponse(question);
  addMessage(response, "assistant");

  aiStatus.textContent =
    "Respuesta de demostración. La inteligencia artificial real todavía no está conectada.";
});

document.querySelectorAll(".suggestion-btn").forEach((button) => {
  button.addEventListener("click", () => {
    aiQuestion.value = button.dataset.question || "";
    aiQuestion.focus();
    document.getElementById("asistente").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});
