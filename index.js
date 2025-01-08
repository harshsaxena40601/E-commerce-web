let menuToggle = document.querySelector("input[type='checkbox']");
let menu = document.querySelector(".slide");

function closeMenu() {
  if (menuToggle.checked) {
    menuToggle.checked = false;
    menu.style.transform = "translateX(180px)"; // Adjust this value based on your initial transform value
  }
}

// Close the menu when clicking anywhere on the document
document.addEventListener("click", function (event) {
  // Check if the click is outside the menu and the toggle button
  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});

// Close the menu when clicking inside the menu
menu.addEventListener("click", function (event) {
  closeMenu();
});

// Toggle the menu when clicking the toggle button
menuToggle.addEventListener("change", function () {
  if (menuToggle.checked) {
    menu.style.transform = "translateX(0)";
  } else {
    menu.style.transform = "translateX(180px)"; // Adjust this value based on your initial transform value
  }
});
