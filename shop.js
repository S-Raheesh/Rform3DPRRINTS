/* ══════════════════════════════════════
   R FORM — Shop JS
   shop.js
══════════════════════════════════════ */

let activeCat='All', activeSort='default';

function renderShop(){
  const grid=document.getElementById('shopGrid');
  const empty=document.getElementById('emptyState');
  const count=document.getElementById('pCount');
  if(!grid) return;

  let list=activeCat==='All'?[...PRODUCTS]:PRODUCTS.filter(p=>p.cat===activeCat);
  if(activeSort==='price-asc') list.sort((a,b)=>a.price-b.price);
  else if(activeSort==='price-desc') list.sort((a,b)=>b.price-a.price);
  else if(activeSort==='rating') list.sort((a,b)=>b.rating-a.rating);

  grid.innerHTML='';
  count&&(count.textContent=list.length);
  empty&&(empty.style.display=list.length?'none':'block');

  list.forEach((p,i)=>{
    const el=document.createElement('div');
    el.className='product-card reveal';
    el.style.transitionDelay=`${(i%4)*0.07}s`;
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
}

document.querySelectorAll('.fpill').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.fpill').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeCat=btn.dataset.cat;
    renderShop();
  });
});

document.getElementById('sortSel')?.addEventListener('change',e=>{
  activeSort=e.target.value; renderShop();
});

// URL param support
const urlCat=new URLSearchParams(location.search).get('cat');
if(urlCat){
  const btn=document.querySelector(`.fpill[data-cat="${urlCat}"]`);
  if(btn){ document.querySelectorAll('.fpill').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); activeCat=urlCat; }
}

renderShop();
