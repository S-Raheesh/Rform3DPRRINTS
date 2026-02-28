/* ══════════════════════════════════════
   R FORM — Home JS
   home.js
══════════════════════════════════════ */

/* ── Hero Carousel ── */
(function(){
  const slides=document.querySelectorAll('.hero-slide');
  const dots=document.querySelectorAll('.hdot');
  let cur=0, timer;

  function go(n){
    slides[cur].classList.remove('active'); dots[cur].classList.remove('active');
    cur=(n+slides.length)%slides.length;
    slides[cur].classList.add('active'); dots[cur].classList.add('active');
  }
  function auto(){ clearInterval(timer); timer=setInterval(()=>go(cur+1),5500); }

  document.getElementById('hNext')?.addEventListener('click',()=>{go(cur+1);auto();});
  document.getElementById('hPrev')?.addEventListener('click',()=>{go(cur-1);auto();});
  dots.forEach(d=>d.addEventListener('click',()=>{go(parseInt(d.dataset.i));auto();}));

  let tx=0;
  const hero=document.getElementById('hero');
  hero?.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;},{passive:true});
  hero?.addEventListener('touchend',e=>{
    const dx=tx-e.changedTouches[0].clientX;
    if(Math.abs(dx)>50){go(dx>0?cur+1:cur-1);auto();}
  });
  auto();
})();

/* ── Testimonials Slider ── */
(function(){
  const track=document.getElementById('tTrack');
  if(!track) return;
  let pos=0;
  const cards=track.children.length;
  const visible=()=>window.innerWidth<700?1:3;

  function move(dir){
    pos+=dir;
    const max=cards-visible();
    pos=Math.max(0,Math.min(pos,max));
    const pct=pos*(100/visible());
    track.style.transform=`translateX(-${pct}%)`;
  }

  document.getElementById('tNext')?.addEventListener('click',()=>move(1));
  document.getElementById('tPrev')?.addEventListener('click',()=>move(-1));
  setInterval(()=>{ if(pos>=cards-visible()) pos=-1; move(1); },5000);
})();

/* ── Featured Products ── */
(function(){
  const grid=document.getElementById('featuredGrid');
  if(!grid||typeof PRODUCTS==='undefined') return;
  PRODUCTS.slice(0,8).forEach(p=>{
    const el=document.createElement('div');
    el.className='product-card reveal';
    el.innerHTML=`
      <div class="product-card__media">
        <img src="${p.img}" alt="${p.title}" loading="lazy"/>
        <div class="product-card__badge">${p.cat}</div>
        <div class="product-card__hover">
          <a href="product.html?id=${p.id}" class="btn btn-ghost btn-sm" style="width:100%;justify-content:center">View Details →</a>
        </div>
      </div>
      <div class="product-card__body">
        <p class="product-card__cat">${p.cat}</p>
        <h3 class="product-card__title"><a href="product.html?id=${p.id}">${p.title}</a></h3>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__footer">
          <p class="product-card__price">$${p.price.toFixed(2)}</p>
          <button class="btn btn-primary btn-sm" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>`;
    grid.appendChild(el);
    el.querySelector('[data-id]').addEventListener('click',()=>addToCart({id:p.id,title:p.title,price:p.price,img:p.img}));
  });
  initReveal();
})();

/* ── Newsletter ── */
function handleNewsletter(e){
  e.preventDefault();
  showToast('Subscribed! Welcome to R Form 🎉');
  e.target.reset();
}

/* ── Auto-scroll gallery ── */
(function(){
  const g=document.getElementById('galleryScroll');
  if(!g) return;
  let dir=1;
  const step=()=>{ g.scrollLeft+=dir; if(g.scrollLeft+g.clientWidth>=g.scrollWidth) dir=-1; if(g.scrollLeft<=0) dir=1; };
  const iv=setInterval(step,20);
  g.addEventListener('mouseenter',()=>clearInterval(iv));
})();
