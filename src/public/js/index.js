const socket = io();

const productosContainer = document.getElementById("products");

socket.on("products", (productos) => {
  const productoslist = productos.map(
    (prod) => `<li>
      <h2>${prod.title}</h2>
      <p>Id: ${prod.id}</p>
      <p>Description: ${prod.description}</p>
      <p>Code: ${prod.code}</p>
      <p>Price: ${prod.price}</p>
      <p>Status: ${prod.status}</p>
      <p>Stock: ${prod.stock}</p>
      <p>Category: ${prod.category}</p>
      <img src="${prod.thumbnail}" alt="${prod.title} Image" />
    </li>`
  );

  productosContainer.innerHTML = `<ul>${productoslist.join("")}</ul>`;
});

socket.on("products_update", (productos) => {
  const productoslist = productos.map(
    (prod) => `<li>
      <h2>${prod.title}</h2>
      <p>Id: ${prod.id}</p>
      <p>Description: ${prod.description}</p>
      <p>Code: ${prod.code}</p>
      <p>Price: ${prod.price}</p>
      <p>Status: ${prod.status}</p>
      <p>Stock: ${prod.stock}</p>
      <p>Category: ${prod.category}</p>
      <img src="${prod.thumbnail}" alt="${prod.title} Image" />
    </li>`
  );

  productosContainer.innerHTML = `<ul>${productoslist.join("")}</ul>`;
});

const form = document.querySelector("#productForm");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Collect form data as shown in step 2
  const formData = {
    title: document.querySelector("#title").value,
    description: document.querySelector("#description").value,
    code: document.querySelector("#code").value,
    price: parseFloat(document.querySelector("#price").value),
    status: document.querySelector("#status").value,
    stock: parseInt(document.querySelector("#stock").value),
    category: document.querySelector("#category").value,
    thumbnail: document.querySelector("#thumbnail").value,
  };
  fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).catch((error) => {
    console.error("Error:", error);
  });
});

const deleteForm = document.getElementById("deleteProductForm");

deleteForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const productId = document.getElementById("deleteId").value;

  fetch(`/api/products/${productId}`, {
    method: "DELETE",
  }).catch((error) => {
    console.error("Error:", error);
  });
});
