/* ══════════════════════════════════════
   R FORM — Shared Utilities
   main.js
══════════════════════════════════════ */

/* ── Theme ──────────────────────────── */
const THEME_KEY = 'rf_theme';

function getTheme(){ return localStorage.getItem(THEME_KEY)||'dark'; }

function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem(THEME_KEY,t);
  document.querySelectorAll('.theme-icon').forEach(el=>{
    el.textContent = t==='dark' ? '☀️' : '🌙';
  });
}

function toggleTheme(){
  applyTheme(getTheme()==='dark'?'light':'dark');
}

/* ── Cart ───────────────────────────── */
const CART_KEY = 'rf_cart';

function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[]; }catch{ return []; } }
function saveCart(c){ localStorage.setItem(CART_KEY,JSON.stringify(c)); updateCartUI(); }

function addToCart(product){
  const cart = getCart();
  const ex = cart.find(i=>i.id===product.id);
  if(ex) ex.qty += (product.qty||1);
  else cart.push({...product, qty: product.qty||1});
  saveCart(cart);
  showToast(`"${product.title}" added to cart`);
}

function removeFromCart(id){ saveCart(getCart().filter(i=>i.id!==id)); }
function updateCartQty(id,qty){ const c=getCart(); const i=c.find(x=>x.id===id); if(i) i.qty=Math.max(1,qty); saveCart(c); }
function getCartTotal(){ return getCart().reduce((s,i)=>s+i.price*i.qty,0); }
function getCartCount(){ return getCart().reduce((s,i)=>s+i.qty,0); }

function updateCartUI(){
  const n=getCartCount();
  document.querySelectorAll('.cart-count').forEach(el=>{
    el.textContent=n; el.style.display=n>0?'flex':'none';
  });
}

/* ── Toast ──────────────────────────── */
function showToast(msg, dur=2800){
  let t=document.getElementById('toast');
  if(!t){ t=document.createElement('div'); t.id='toast'; document.body.appendChild(t); }
  t.textContent=msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t=setTimeout(()=>t.classList.remove('show'),dur);
}

/* ── Ripple ─────────────────────────── */
function initRipple(){
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      btn.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
      btn.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
    });
  });
}

/* ── Scroll Reveal ──────────────────── */
function initReveal(){
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  },{threshold:0.1});
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((el,i)=>{
    el.style.transitionDelay=`${(i%6)*0.09}s`;
    io.observe(el);
  });
}

/* ── Nav active link ────────────────── */
function setActiveNav(){
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a,.mobile-nav a').forEach(a=>{
    const href=(a.getAttribute('href')||'').split('/').pop();
    if(href===page) a.classList.add('active');
  });
}

/* ── Hamburger ──────────────────────── */
function initHamburger(){
  const btn=document.getElementById('hamburger');
  const menu=document.getElementById('mobileNav');
  if(!btn||!menu) return;
  btn.addEventListener('click',()=>menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
}

/* ── Parallax ───────────────────────── */
function initParallax(){
  const els=document.querySelectorAll('[data-parallax]');
  if(!els.length) return;
  window.addEventListener('scroll',()=>{
    const sy=window.scrollY;
    els.forEach(el=>{
      const speed=parseFloat(el.dataset.parallax)||0.3;
      el.style.transform=`translateY(${sy*speed}px)`;
    });
  },{passive:true});
}

/* ── Products catalog ───────────────── */
const PRODUCTS = [
  { id:1, title:'Custom Name Plate', cat:'Custom', price:18.99, rating:4.9,
    desc:'Precision-engraved personalized name plates for desks, doors, and gifts.',
    img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80'] },
  { id:2, title:'3D Phone Stand', cat:'Utility', price:12.49, rating:4.8,
    desc:'Minimalist adjustable phone stand compatible with all devices.',
    img:'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=900&q=80','https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=900&q=80'] },
  { id:3, title:'Mechanical Gear Model', cat:'Decor', price:34.99, rating:4.7,
    desc:'Intricate working gear model — a statement piece for any workspace.',
    img:'https://images.unsplash.com/photo-1509043759401-136742328bb3?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1509043759401-136742328bb3?w=900&q=80','https://images.unsplash.com/photo-1565008576549-57569a49a715?w=900&q=80'] },
  { id:4, title:'Miniature Figurine', cat:'Custom', price:29.99, rating:4.9,
    desc:'High-detail custom miniature figurines for collectors and tabletop gamers.',
    img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900&q=80'] },
  { id:5, title:'Custom Keychain', cat:'Custom', price:8.99, rating:4.8,
    desc:'Durable precision-printed keychains in any shape or text.',
    img:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&q=80'] },
  { id:6, title:'Wall Art Panel', cat:'Decor', price:49.99, rating:4.6,
    desc:'Geometric 3D wall panels that transform any room into art.',
    img:'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=900&q=80'] },
  { id:7, title:'Desk Organizer', cat:'Utility', price:22.49, rating:4.7,
    desc:'Modular desk organizer with smart compartments for every workflow.',
    img:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=80'] },
  { id:8, title:'Custom Logo Print', cat:'Custom', price:39.99, rating:4.9,
    desc:'High-fidelity 3D rendering of your brand logo or emblem.',
    img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80'] },
  { id:9, title:'Planter Pot Set', cat:'Decor', price:27.99, rating:4.6,
    desc:'Modern geometric planter sets with drainage — home or office.',
    img:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80'] },
  { id:10, title:'Cable Management Clip', cat:'Utility', price:6.99, rating:4.7,
    desc:'Clean up your desk with precision-printed cable management clips.',
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80'] },
  { id:11, title:'Architecture Model', cat:'Decor', price:59.99, rating:4.9,
    desc:'Precision architectural scale models for studios and presentations.',
    img:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80'] },
  { id:12, title:'Personalized Coaster Set', cat:'Custom', price:15.99, rating:4.8,
    desc:'Set of 4 custom-printed coasters with your design or initials.',
    img:'https://images.unsplash.com/photo-1563520239648-a1e7b48e8a15?w=700&q=80',
    imgs:['https://images.unsplash.com/photo-1563520239648-a1e7b48e8a15?w=900&q=80'] },
];

/* ── Init ───────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  applyTheme(getTheme());
  updateCartUI();
  setActiveNav();
  initReveal();
  initRipple();
  initHamburger();
  initParallax();

  document.querySelectorAll('.theme-btn').forEach(b=>b.addEventListener('click',toggleTheme));
});
