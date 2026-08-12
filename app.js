// ============================================
// VERTICAL RAP — Lógica del sitio
// ============================================

const LINE_IMG = {
  "trabajo-en-alturas": "imagenes/descensor_rig_petzl.jpg",
  "rescate-y-emergencias": "imagenes/kit_de_rescate_4_a_1_dinamik_para_una_altura_de_40_metros.jpg",
  "proteccion-personal": "imagenes/guante_anticorte_nivel_5_sosega.avif",
};

let state = {
  filter: "all",     // 'all' or line id
  search: "",
};

let cart = [];

// ---------- Cart persistence ----------
function loadCart() {
  try {
    const saved = localStorage.getItem("vr_cart");
    cart = saved ? JSON.parse(saved) : [];
  } catch (e) { cart = []; }
}
function saveCart() {
  try { localStorage.setItem("vr_cart", JSON.stringify(cart)); } catch (e) {}
}

// ---------- Helpers ----------
function catInfo(catId) {
  return CATEGORIES.find(c => c.id === catId);
}
function lineInfo(lineId) {
  return LINES.find(l => l.id === lineId);
}
function productsByLine(lineId) {
  const catIds = CATEGORIES.filter(c => c.line === lineId).map(c => c.id);
  return PRODUCTS.filter(p => catIds.includes(p.cat));
}

// ---------- Render: Lines grid ----------
function renderLines() {
  const grid = document.getElementById("linesGrid");
  grid.innerHTML = LINES.map(line => {
    const count = productsByLine(line.id).length;
    return `
      <a class="cat-card" href="#catalogo" data-line="${line.id}">
        <img src="${LINE_IMG[line.id]}" alt="${line.name}" loading="lazy">
        <div class="cat-label">
          <span class="n">${String(count).padStart(2,"0")} REFERENCIAS</span>
          <h3>${line.name}</h3>
        </div>
      </a>`;
  }).join("");

  grid.querySelectorAll(".cat-card").forEach(card => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      state.filter = card.dataset.line;
      renderChips();
      renderProducts();
      document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ---------- Render: Filter chips ----------
function renderChips() {
  const wrap = document.getElementById("filterChips");
  const chips = [{ id: "all", name: "Todos" }, ...LINES];
  wrap.innerHTML = chips.map(c =>
    `<button class="chip ${state.filter === c.id ? "active" : ""}" data-line="${c.id}">${c.name}</button>`
  ).join("");
  wrap.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      state.filter = btn.dataset.line;
      renderChips();
      renderProducts();
    });
  });
}

// ---------- Render: Product grid ----------
function getFilteredProducts() {
  let list = PRODUCTS;
  if (state.filter !== "all") {
    const catIds = CATEGORIES.filter(c => c.line === state.filter).map(c => c.id);
    list = list.filter(p => catIds.includes(p.cat));
  }
  if (state.search.trim()) {
    const q = state.search.trim().toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      catInfo(p.cat).name.toLowerCase().includes(q)
    );
  }
  return list;
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const list = getFilteredProducts();
  const count = document.getElementById("resultsCount");
  count.innerHTML = `Mostrando <strong>${list.length}</strong> de <strong>${PRODUCTS.length}</strong> productos`;

  if (!list.length) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>Sin resultados</h3>
        <p>No encontramos productos que coincidan con tu búsqueda. Intenta con otro término o categoría.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const cat = catInfo(p.cat);
    const inCart = cart.find(i => i.id === p.id);
    return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-media">
          ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
          <img src="${p.img}" alt="${p.name}" loading="lazy">
        </div>
        <div class="product-body">
          <span class="product-cat">${cat.name}</span>
          <h3>${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-foot">
            <button class="btn-add ${inCart ? "added" : ""}" data-action="add" data-id="${p.id}">
              ${inCart ? "✓ En el carrito" : "Añadir al carrito"}
            </button>
            <button class="btn-quote" data-action="view" data-id="${p.id}" aria-label="Ver detalle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
      </article>`;
  }).join("");

  grid.querySelectorAll('[data-action="add"]').forEach(btn => {
    btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id)));
  });
  grid.querySelectorAll('[data-action="view"]').forEach(btn => {
    btn.addEventListener("click", () => openQuickView(parseInt(btn.dataset.id)));
  });
}

// ---------- Cart logic ----------
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCartCount();
  renderCartDrawer();
  renderProducts();
  showToast(`${product.name} añadido al carrito`);
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCartCount();
  renderCartDrawer();
  renderProducts();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCartCount();
  renderCartDrawer();
  renderProducts();
}

function renderCartCount() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cartCount").textContent = total;
}

function renderCartDrawer() {
  const wrap = document.getElementById("cartItems");
  const foot = document.getElementById("cartFoot");

  if (!cart.length) {
    wrap.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p>Tu carrito está vacío.<br>Explora el catálogo y añade los equipos que necesitas.</p>
      </div>`;
    foot.style.display = "none";
    return;
  }

  foot.style.display = "block";
  wrap.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    const cat = catInfo(p.cat);
    return `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.name}">
        <div class="cart-item-info">
          <span class="cat">${cat.name}</span>
          <h4>${p.name}</h4>
          <div class="qty-row">
            <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
            <button class="remove-btn" data-action="remove" data-id="${p.id}">Quitar</button>
          </div>
        </div>
      </div>`;
  }).join("");

  wrap.querySelectorAll('[data-action="inc"]').forEach(b => b.addEventListener("click", () => updateQty(parseInt(b.dataset.id), 1)));
  wrap.querySelectorAll('[data-action="dec"]').forEach(b => b.addEventListener("click", () => updateQty(parseInt(b.dataset.id), -1)));
  wrap.querySelectorAll('[data-action="remove"]').forEach(b => b.addEventListener("click", () => removeFromCart(parseInt(b.dataset.id))));

  updateWhatsappLink();
}

function updateWhatsappLink() {
  const link = document.getElementById("whatsappCheckout");
  if (!cart.length) return;
  let msg = "Hola Vertical Rap, quiero cotizar los siguientes equipos:%0A%0A";
  cart.forEach(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    msg += `• ${p.name} (Ref. ${p.sku}) — Cantidad: ${item.qty}%0A`;
  });
  msg += "%0AQuedo atento a la disponibilidad y cotización. ¡Gracias!";
  link.href = `https://wa.me/573027725152?text=${msg}`;
}

// ---------- Quick view modal ----------
function openQuickView(id) {
  const p = PRODUCTS.find(pr => pr.id === id);
  const cat = catInfo(p.cat);
  const modal = document.getElementById("modalContent");
  modal.innerHTML = `
    <button class="modal-close" id="modalCloseBtn" aria-label="Cerrar">✕</button>
    <div class="modal-media"><img src="${p.img}" alt="${p.name}"></div>
    <div class="modal-info">
      <span class="product-cat">${cat.name} · Ref. ${p.sku}</span>
      <h2>${p.name}</h2>
      <p class="product-desc">${p.desc}</p>
      <button class="btn btn-primary" data-action="add" data-id="${p.id}">Añadir al carrito</button>
    </div>`;
  modal.querySelector('[data-action="add"]').addEventListener("click", () => {
    addToCart(p.id);
    closeQuickView();
  });
  document.getElementById("modalOverlay").classList.add("open");
  document.getElementById("modalCloseBtn").addEventListener("click", closeQuickView);
}
function closeQuickView() {
  document.getElementById("modalOverlay").classList.remove("open");
}

// ---------- Toast ----------
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// ---------- Footer lines ----------
function renderFooterLines() {
  const ul = document.getElementById("footerLines");
  ul.innerHTML = LINES.map(l => `<li><a href="#catalogo" data-line="${l.id}">${l.name}</a></li>`).join("");
  ul.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      state.filter = a.dataset.line;
      renderChips();
      renderProducts();
      document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ---------- Drawer / Nav toggles ----------
function initToggles() {
  const cartDrawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");
  document.getElementById("openCart").addEventListener("click", () => {
    cartDrawer.classList.add("open");
    overlay.classList.add("open");
  });
  document.getElementById("closeCart").addEventListener("click", closeDrawer);
  overlay.addEventListener("click", () => {
    closeDrawer();
    closeMobileNav();
  });
  function closeDrawer() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("open");
  }

  const mobileNav = document.getElementById("mobileNav");
  document.getElementById("openMobileNav").addEventListener("click", () => {
    mobileNav.classList.add("open");
    overlay.classList.add("open");
  });
  document.getElementById("closeMobileNav").addEventListener("click", closeMobileNav);
  function closeMobileNav() { mobileNav.classList.remove("open"); }
  mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    closeMobileNav();
    overlay.classList.remove("open");
  }));

  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeQuickView();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeQuickView();
      closeDrawer();
      closeMobileNav();
    }
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderProducts();
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderLines();
  renderChips();
  renderProducts();
  renderCartCount();
  renderCartDrawer();
  renderFooterLines();
  initToggles();
});
