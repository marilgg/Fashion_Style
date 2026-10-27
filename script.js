const products = [
{
id: 1,
name: “Essential Oversized Tee”,
category: “Camisetas”,
price: 54900,
tag: “BEST SELLER”,
image: “photo-1521572163474-6864f9cf17ab”,
description: “Camiseta básica de corte amplio.”
},
{
id: 2,
name: “Urban Graphic Tee”,
category: “Camisetas”,
price: 62900,
tag: “NEW DROP”,
image: “photo-1503341504253-dff4815485f1”,
description: “Camiseta gráfica para un look urbano.”
},
{
id: 3,
name: “Street Oversized Hoodie”,
category: “Buzos”,
price: 119900,
tag: “TRENDING”,
image: “photo-1556821840-3a63f95609a7”,
description: “Buzo cómodo de silueta oversize.”
},
{
id: 4,
name: “Daily Comfort Hoodie”,
category: “Buzos”,
price: 109900,
tag: “ESSENTIAL”,
image: “photo-1578681994506-b8f463449011”,
description: “Una prenda para combinar todos los días.”
},
{
id: 5,
name: “Baggy Denim”,
category: “Pantalones”,
price: 99900,
tag: “URBAN FIT”,
image: “photo-1542272604-787c3835535d”,
description: “Jean de inspiración urbana.”
},
{
id: 6,
name: “Cargo Street Pants”,
category: “Pantalones”,
price: 114900,
tag: “NEW DROP”,
image: “photo-1517438476312-10d79c077509”,
description: “Pantalón casual para crear tu propio estilo.”
}
];

const productGrid = document.getElementById(“product-grid”);
const productCount = document.getElementById(“product-count”);
const filterButtons = document.querySelectorAll(”.filter”);

const formatPrice = (price) =>
new Intl.NumberFormat(“es-CO”, {
style: “currency”,
currency: “COP”,
maximumFractionDigits: 0
}).format(price);

function renderProducts(category = “Todos”) {
const filteredProducts = category === “Todos”
? products
: products.filter((product) => product.category === category);

productGrid.innerHTML = “”;

if (filteredProducts.length === 0) {
productGrid.innerHTML = ‘No hay productos en esta categoría.’;
return;
}

filteredProducts.forEach((product) => {
const card = document.createElement(“article”);
card.className = “product-card”;

const image = document.createElement("img");
image.src = `https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=700&q=80`;
image.alt = product.name;
image.loading = "lazy";
const imageBox = document.createElement("div");
imageBox.className = "product-image";
const tag = document.createElement("span");
tag.className = "product-tag";
tag.textContent = product.tag;
imageBox.append(image, tag);
const info = document.createElement("div");
info.className = "product-info";
const details = document.createElement("div");
const name = document.createElement("h3");
name.textContent = product.name;
const description = document.createElement("p");
description.textContent = product.description;
details.append(name, description);
const price = document.createElement("span");
price.className = "product-price";
price.textContent = formatPrice(product.price);
info.append(details, price);
card.append(imageBox, info);
productGrid.appendChild(card);
image.addEventListener("error", () => {
  imageBox.style.background = "#e8e6e0";
  image.style.display = "none";
});

});

productCount.textContent = ${filteredProducts.length} PRODUCTOS;
}

filterButtons.forEach((button) => {
button.addEventListener(“click”, () => {
filterButtons.forEach((item) => item.classList.remove(“active”));
button.classList.add(“active”);
renderProducts(button.dataset.filter);
});
});

const suggestionForm = document.getElementById(“suggestion-form”);
const formStatus = document.getElementById(“form-status”);

suggestionForm.addEventListener(“submit”, (event) => {
event.preventDefault();

formStatus.textContent =
“Gracias por tu sugerencia. El formulario aún necesita conectarse al servidor para enviarla realmente.”;

suggestionForm.reset();
});

renderProducts();
