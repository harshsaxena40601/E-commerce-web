let iconCart = document.querySelector(".iconCart");
let cart = document.querySelector(".cart");
let container = document.querySelector(".container");
let close = document.querySelector(".close");

iconCart.addEventListener("click", function () {
  if (cart.style.right == "-100%") {
    cart.style.right = "0";
    container.style.transform = "translateX(-400px)";
  } else {
    cart.style.right = "-100%";
    container.style.transform = "translateX(0)";
  }
});
close.addEventListener("click", function () {
  cart.style.right = "-100%";
  container.style.transform = "translateX(0)";
});
let products = null;
// get data from json file
fetch("product.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    addDataToHTML();
  });
// show datas in list html
function addDataToHTML() {
  // remove datas default in html
  let listProductHTML = document.querySelector(".listProduct");
  listProductHTML.innerHTML = "";
  // add datas in html
  if (products != null) {
    products.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("item");
      newProduct.innerHTML = ` <img src="${product.image}" alt="" />
              <h2>${product.name}</h2>
              <div class="price">${product.price}</div>
              <button onclick = "addCart(${product.id})>Add To Cart</button> `;
      listProductHTML.appendChild(newProduct);
    });
  }
}
let listCart = [];
//and i get cookie data cart
function checkCart() {
  var cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("listCart="));
  if (cookieValue) {
    listCart = JSON.parse(cookieValue.split("=")[1]);
  }
}
checkCart();

function addCart(idProduct) {
  let productCopy = JSON.parse(JSON.stringify(products));
  // if this product is not in the cart
  if (!listCart[idProduct]) {
    let dataProduct = productCopy.filter(
      (product) => product.id == idProduct
    )[0];
    // add data product in cart
    dataProduct.quantity = 1; // initialize quantity
    listCart[idProduct] = dataProduct;
  } else {
    // if this product is in the cart
    // just increase the quantity
    listCart[idProduct].quantity++;
  }
  // i will save datas cart in cookie
  // to save this datas cart when i refresh the page
  let timeSave = "expires=Thu, 31 Dec 2027 12:00:00 UTC";
  document.cookie = `listCart=${JSON.stringify(listCart)};${timeSave};path=/`;
  addCartToHTML();
  function addCartToHTML() {
    //clear data default
  }
}
