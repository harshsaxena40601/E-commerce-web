let iconCart = document.querySelector(".iconCart");
let cartButton = document.querySelector("#cartButton");
let cart = document.querySelector(".cart");
let container = document.querySelector(".container");
let close = document.querySelector(".close");

// Function to toggle the cart view
function toggleCart() {
  if (cart.style.right == "-100%" || cart.style.right === "") {
    cart.style.right = "0";
    container.style.transform = "translateX(-400px)";
  } else {
    cart.style.right = "-100%";
    container.style.transform = "translateX(0)";
  }
}

iconCart.addEventListener("click", toggleCart);
cartButton.addEventListener("click", toggleCart);
close.addEventListener("click", function () {
  cart.style.right = "-100%";
  container.style.transform = "translateX(0)";
});

let products = null;

// ✅ Fetch products from the backend API
fetch("http://localhost:5000/products")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    addDataToHTML();
  })
  .catch((error) => console.error("Error fetching products:", error));

// ✅ Display products in the HTML
function addDataToHTML() {
  let listProductHTML = document.querySelector(".listProduct");
  listProductHTML.innerHTML = "";

  if (products) {
    products.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("item");
      newProduct.innerHTML = `
            <img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button onclick="addCart('${product._id}')">Add To Cart</button>`;

      listProductHTML.appendChild(newProduct);
    });
  }
}

// ✅ Use localStorage instead of cookies for the cart
let listCart = JSON.parse(localStorage.getItem("listCart")) || {};

// ✅ Add product to cart
function addCart(productId) {
  let product = products.find((p) => p._id === productId);

  if (product) {
    if (!listCart[productId]) {
      listCart[productId] = { ...product, quantity: 1 };
    } else {
      listCart[productId].quantity++;
    }

    localStorage.setItem("listCart", JSON.stringify(listCart)); // ✅ Save cart data
    addCartToHTML();
  }
}

addCartToHTML();

// ✅ Display cart data
function addCartToHTML() {
  let listCartHTML = document.querySelector(".listCart");
  listCartHTML.innerHTML = "";

  let totalHTML = document.querySelector(".totalQuantity");
  let totalQuantity = 0;

  Object.values(listCart).forEach((product) => {
    let newCart = document.createElement("div");
    newCart.classList.add("item");
    newCart.innerHTML = `
        <img src="${product.image}">
        <div class="content">
            <div class="name">${product.name}</div>
            <div class="price">$${product.price} / 1 product</div>
        </div>
        <div class="quantity">
            <button onclick="changeQuantity('${product._id}', '-')">-</button>
            <span class="value">${product.quantity}</span>
            <button onclick="changeQuantity('${product._id}', '+')">+</button>
        </div>`;
    listCartHTML.appendChild(newCart);
    totalQuantity += product.quantity;
  });

  totalHTML.innerText = totalQuantity;
}

// ✅ Change product quantity in cart
function changeQuantity(productId, type) {
  if (listCart[productId]) {
    if (type === "+") {
      listCart[productId].quantity++;
    } else if (type === "-") {
      listCart[productId].quantity--;
      if (listCart[productId].quantity <= 0) {
        delete listCart[productId];
      }
    }

    localStorage.setItem("listCart", JSON.stringify(listCart)); // ✅ Save updated cart
    addCartToHTML();
  }
}
