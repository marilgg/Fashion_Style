
const donationForm = document.getElementById("donation-form");
const donationStatus = document.getElementById("donation-status");
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

function showMessage(element, message, type = "success") {
  element.textContent = message;
  element.classList.remove("success-message", "error-message");
  element.classList.add(
    type === "success" ? "success-message" : "error-message"
  );
}

donationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!donationForm.reportValidity()) return;

  showMessage(
    donationStatus,
    "¡Gracias por querer transformar una historia! Tu formulario está validado, pero todavía no se ha enviado ni guardado. Conectaremos el servidor para completar tu solicitud."
  );
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  showMessage(
    contactStatus,
    "¡Gracias por compartir tu idea! El formulario está validado, pero todavía no se ha enviado. Pronto lo conectaremos al servidor."
  );
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (target) {
      event.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});
