// =======================
// SWIPER
// =======================
var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});


// =======================
// SELECT ELEMENTS
// =======================
const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cartList = document.querySelector('.cart-list');
const cartValue = document.querySelector('.cart-value');
const cartTotal = document.querySelector('.cart-total');

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const icon = hamburger.querySelector('i');


// =======================
// CART OPEN / CLOSE
// =======================
cartIcon.addEventListener('click', () => {
  cartTab.classList.add('cart-tab-active');
});

closeBtn.addEventListener('click', () => {
  cartTab.classList.remove('cart-tab-active');
});


// =======================
// MOBILE MENU TOGGLE (☰ ↔ ✖)
// =======================
hamburger.addEventListener('click', (e) => {
  e.preventDefault();

  mobileMenu.classList.toggle('mobile-menu-active');

  if (icon.classList.contains('fa-bars')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
});


// =======================
// CLICK OUTSIDE CLOSE MENU
// =======================
document.addEventListener('click', (e) => {
  if (
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    mobileMenu.classList.remove('mobile-menu-active');

    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
});


// =======================
// PRODUCT + CART LOGIC
// =======================
const cardList = document.querySelector('.cardlist');
let productList = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// =======================
// SHOW PRODUCTS
// =======================
const showCards = () => {
  cardList.innerHTML = "";

  productList.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('order-card');

    card.innerHTML = `
      <div class="card-image">
        <img src="${product.image}">
      </div>
      <h4>${product.name}</h4>
      <p class="price">${product.price}</p>
      <a href="#" class="btn add-btn">Add to Cart</a>
    `;

    cardList.appendChild(card);

    card.querySelector('.add-btn').addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(product);
    });
  });
};


// =======================
// ADD TO CART
// =======================
const addToCart = (product) => {
  const exist = cart.find(item => item.id === product.id);

  if (exist) {
    exist.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
};


// =======================
// UPDATE CART
// =======================
const updateCart = () => {
  cartList.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += parseInt(item.price.replace("₹", "")) * item.qty;
    count += item.qty;

    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem.innerHTML = `
      <div class="item-image">
        <img src="${item.image}">
      </div>

      <div class="detail">
        <h4>${item.name}</h4>
        <h4 class="item-total">₹${parseInt(item.price.replace("₹","")) * item.qty}</h4>
      </div>

      <div class="flex">
        <a href="#" class="quantity-btn minus">
          <i class="fa-solid fa-minus"></i>
        </a>

        <h4 class="quantity-value">${item.qty}</h4>

        <a href="#" class="quantity-btn plus">
          <i class="fa-solid fa-plus"></i>
        </a>
      </div>
    `;

    // PLUS
    cartItem.querySelector('.plus').addEventListener('click', (e) => {
      e.preventDefault();
      item.qty++;
      updateCart();
    });

    // MINUS
    cartItem.querySelector('.minus').addEventListener('click', (e) => {
      e.preventDefault();
      item.qty--;
      if (item.qty <= 0) {
        cart = cart.filter(p => p.id !== item.id);
      }
      updateCart();
    });

    cartList.appendChild(cartItem);
  });

  cartValue.innerText = count;
  cartTotal.innerText = "₹" + total;

  localStorage.setItem("cart", JSON.stringify(cart));
};


// =======================
// LOAD PRODUCTS
// =======================
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    productList = data;
    showCards();
    updateCart();
  })
  .catch(() => {
    console.error("❌ products.json not found");
  });


// =======================
// ACTIVE MENU LINK
// =======================
const menuLinks = document.querySelectorAll('.mobile-menu a');

menuLinks.forEach(link => {
  link.addEventListener('click', () => {

    menuLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    mobileMenu.classList.remove('mobile-menu-active');

    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  });
});