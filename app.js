// Product information comes from the PHP array embedded by index.php.
const products = window.TECHHUB_PRODUCTS;

const CART_KEY = 'techhub-cart-v1';
const money = amount => '₱' + Number(amount).toLocaleString('en-PH');
const productImage = product => `https://images.unsplash.com/${product.photo}?auto=format&fit=crop&w=700&q=82`;
let cart = loadCart();
let toastTimer;

const grid = document.querySelector('#product-grid');
const searchInput = document.querySelector('#header-search');
const categoryFilter = document.querySelector('#category-filter');
const priceFilter = document.querySelector('#price-filter');
const sortFilter = document.querySelector('#sort-filter');

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter(item => products.some(product => product.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0);
  } catch (error) { return []; }
}

function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = products.filter(product => {
    const matchesSearch = `${product.name} ${product.category} ${product.specs}`.toLowerCase().includes(query);
    const matchesCategory = categoryFilter.value === 'all' || product.category === categoryFilter.value || (categoryFilter.value === 'Gaming' && product.category === 'Gaming');
    let matchesPrice = true;
    if (priceFilter.value === 'under20000') matchesPrice = product.price < 20000;
    if (priceFilter.value === '20000-50000') matchesPrice = product.price >= 20000 && product.price <= 50000;
    if (priceFilter.value === 'over50000') matchesPrice = product.price > 50000;
    return matchesSearch && matchesCategory && matchesPrice;
  });
  if (sortFilter.value === 'low-high') visible.sort((a,b) => a.price - b.price);
  if (sortFilter.value === 'high-low') visible.sort((a,b) => b.price - a.price);

  document.querySelector('#results-note').textContent = `${visible.length} ${visible.length === 1 ? 'product' : 'products'}${query ? ` matching “${searchInput.value.trim()}”` : ''}`;
  document.querySelector('#empty-state').hidden = visible.length > 0;
  grid.hidden = visible.length === 0;
  grid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image"><img src="${productImage(product)}" alt="${product.name}" loading="lazy"><span class="product-badge ${product.oldPrice ? 'sale' : ''}">${product.badge}</span></div>
      <div class="product-info"><div class="product-category">${product.category}</div><h3 class="product-name">${product.name}</h3><div class="product-specs">${product.specs}</div>
        <div class="product-bottom"><div class="product-price">${money(product.price)}${product.oldPrice ? `<small>${money(product.oldPrice)}</small>` : ''}</div><button class="add-button" data-add="${product.id}" aria-label="Add ${product.name} to cart">Add to Cart</button></div>
      </div>
    </article>`).join('');
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({id, quantity:1});
  saveCart(); renderCart();
  const product = products.find(item => item.id === id);
  showToast(`${product.name} added to your cart`);
}

function updateQuantity(id, change) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity < 1) cart = cart.filter(entry => entry.id !== id);
  saveCart(); renderCart();
}

function renderCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum,item) => sum + products.find(product => product.id === item.id).price * item.quantity, 0);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#drawer-count').textContent = `(${count})`;
  document.querySelector('#cart-subtotal').textContent = money(subtotal);
  document.querySelector('#cart-total').textContent = money(subtotal);
  document.querySelector('#shipping-cost').textContent = subtotal >= 5000 ? 'Free' : 'Calculated at checkout';
  document.querySelector('#cart-empty').hidden = count > 0;
  document.querySelector('#cart-footer').hidden = count === 0;
  document.querySelector('#cart-items').innerHTML = cart.map(item => {
    const product = products.find(entry => entry.id === item.id);
    return `<div class="cart-row"><img src="${productImage(product)}" alt=""><div><h3 class="cart-row-name">${product.name}</h3><span class="cart-row-price">${money(product.price)} each</span><div class="quantity-control"><button data-quantity="${product.id}" data-change="-1" aria-label="Decrease ${product.name} quantity">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-change="1" aria-label="Increase ${product.name} quantity">+</button></div></div><button class="remove-item" data-remove="${product.id}" aria-label="Remove ${product.name}">×</button></div>`;
  }).join('');
}

function openCart() {
  document.querySelector('#cart-drawer').classList.add('open');
  document.querySelector('#cart-backdrop').classList.add('open');
  document.querySelector('#cart-drawer').setAttribute('aria-hidden','false');
  document.body.classList.add('cart-open');
  document.querySelector('#close-cart').focus();
}
function closeCart() {
  document.querySelector('#cart-drawer').classList.remove('open');
  document.querySelector('#cart-backdrop').classList.remove('open');
  document.querySelector('#cart-drawer').setAttribute('aria-hidden','true');
  document.body.classList.remove('cart-open');
}
function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

document.addEventListener('click', event => {
  const addButton = event.target.closest('[data-add]');
  const quantityButton = event.target.closest('[data-quantity]');
  const removeButton = event.target.closest('[data-remove]');
  const categoryCard = event.target.closest('[data-category]');
  if (addButton) addToCart(addButton.dataset.add);
  if (quantityButton) updateQuantity(quantityButton.dataset.quantity, Number(quantityButton.dataset.change));
  if (removeButton) { cart = cart.filter(item => item.id !== removeButton.dataset.remove); saveCart(); renderCart(); }
  if (categoryCard) { categoryFilter.value = categoryCard.dataset.category; renderProducts(); document.querySelector('#products').scrollIntoView({behavior:'smooth'}); }
});

[searchInput, categoryFilter, priceFilter, sortFilter].forEach(control => control.addEventListener(control === searchInput ? 'input' : 'change', renderProducts));
document.querySelector('#cart-trigger').addEventListener('click', openCart);
document.querySelector('#close-cart').addEventListener('click', closeCart);
document.querySelector('#cart-backdrop').addEventListener('click', closeCart);
document.querySelector('#continue-shopping').addEventListener('click', closeCart);
document.querySelector('#clear-cart').addEventListener('click', () => { cart = []; saveCart(); renderCart(); });
document.querySelector('#clear-filters').addEventListener('click', () => { searchInput.value = ''; categoryFilter.value = 'all'; priceFilter.value = 'all'; sortFilter.value = 'featured'; renderProducts(); });
document.querySelector('#checkout-button').addEventListener('click', () => showToast('Checkout demo — your cart is saved for later.'));
document.querySelector('#newsletter-form').addEventListener('submit', event => { event.preventDefault(); document.querySelector('#newsletter-message').textContent = 'You’re on the list — watch your inbox!'; event.target.reset(); });
document.querySelector('#menu-toggle').addEventListener('click', event => {
  const nav = document.querySelector('#main-nav'); const isOpen = nav.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(isOpen)); event.currentTarget.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchInput.focus(); }
  if (event.key === 'Escape') { closeCart(); document.querySelector('#main-nav').classList.remove('open'); document.querySelector('#menu-toggle').setAttribute('aria-expanded','false'); }
});
document.querySelectorAll('#main-nav a').forEach(link => link.addEventListener('click', () => { document.querySelector('#main-nav').classList.remove('open'); document.querySelector('#menu-toggle').setAttribute('aria-expanded','false'); }));

renderProducts();
renderCart();
