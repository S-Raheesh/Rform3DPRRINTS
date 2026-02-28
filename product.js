/* ══════════════════════════════════════
   R FORM — Product JS
   product.js
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded',()=>{
  const id=parseInt(new URLSearchParams(location.search).get('id'))||1;
  const p=PRODUCTS.find(x=>x.id===id)||PRODUCTS[0];
  document.title=`${p.title} — R Form`;

  const imgs=p.imgs?.length?p.imgs:[p.img];
  let currentImg=0;

  const layout=document.getElementById('productLayout');
  layout.innerHTML=`
    <div class="prod-gallery">
      <div class="prod-main-img">
        <img id="mainImg" src="${imgs[0]}" alt="${p.title}"/>
      </div>
      <div class="prod-thumbs" id="thumbs">
        ${imgs.map((src,i)=>`<div class="prod-thumb${i===0?' active':''}" data-i="${i}"><img src="${src}" alt=""/></div>`).join('')}
      </div>
    </div>
    <div class="prod-info reveal-r">
      <div class="prod-breadcrumb">
        <a href="index.html">Home</a><span>/</span>
        <a href="shop.html">Shop</a><span>/</span>
        <span>${p.title}</span>
      </div>
      <p class="prod-cat">${p.cat}</p>
      <h1 class="prod-title">${p.title}</h1>
      <div class="prod-rating">
        <span class="stars">★★★★★</span>
        <span>${p.rating} · (47 reviews)</span>
      </div>
      <div class="prod-price">$${p.price.toFixed(2)}</div>
      <p class="prod-desc">${p.desc} Each piece is printed fresh using premium filaments, carefully sanded and finished by hand before dispatch.</p>
      <div class="qty-row">
        <div class="qty-ctrl">
          <button class="qty-btn" id="qMinus">−</button>
          <input class="qty-val" type="number" id="qVal" value="1" min="1" max="99"/>
          <button class="qty-btn" id="qPlus">+</button>
        </div>
        <span style="font-size:0.78rem;color:var(--text-3)" class="mono">In stock</span>
      </div>
      <div class="prod-actions">
        <button class="btn btn-primary" id="addBtn" style="flex:2">Add to Cart →</button>
        <a href="cart.html" class="btn btn-outline">View Cart</a>
      </div>
      <div class="prod-specs">
        <h4>Specifications</h4>
        <div class="spec-row"><span>Material</span><span>PLA+ / PETG</span></div>
        <div class="spec-row"><span>Layer Height</span><span>0.2mm</span></div>
        <div class="spec-row"><span>Finish</span><span>Sanded & Primed</span></div>
        <div class="spec-row"><span>Dispatch</span><span>Within 48 hours</span></div>
        <div class="spec-row"><span>Category</span><span>${p.cat}</span></div>
      </div>
    </div>`;

  // Thumb switching
  layout.querySelectorAll('.prod-thumb').forEach(thumb=>{
    thumb.addEventListener('click',()=>{
      const i=parseInt(thumb.dataset.i);
      const mainImg=document.getElementById('mainImg');
      mainImg.style.opacity='0';
      setTimeout(()=>{ mainImg.src=imgs[i]; mainImg.style.opacity='1'; },200);
      layout.querySelectorAll('.prod-thumb').forEach(t=>t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Qty
  const qVal=document.getElementById('qVal');
  document.getElementById('qMinus').addEventListener('click',()=>qVal.value=Math.max(1,+qVal.value-1));
  document.getElementById('qPlus').addEventListener('click',()=>qVal.value=Math.min(99,+qVal.value+1));

  // Add to cart
  document.getElementById('addBtn').addEventListener('click',()=>{
    addToCart({id:p.id,title:p.title,price:p.price,img:p.img,qty:+qVal.value});
  });

  // Related
  const related=PRODUCTS.filter(x=>x.id!==p.id&&x.cat===p.cat).slice(0,4);
  const show=related.length>=2?related:PRODUCTS.filter(x=>x.id!==p.id).slice(0,4);
  const rg=document.getElementById('relatedGrid');
  show.forEach(rp=>{
    const el=document.createElement('div');
    el.className='product-card reveal';
    el.innerHTML=`
      <a href="product.html?id=${rp.id}"><div class="product-card__media"><img src="${rp.img}" alt="${rp.title}" loading="lazy"/></div></a>
      <div class="product-card__body">
        <p class="product-card__cat">${rp.cat}</p>
        <h3 class="product-card__title"><a href="product.html?id=${rp.id}">${rp.title}</a></h3>
        <div class="product-card__footer">
          <p class="product-card__price">$${rp.price.toFixed(2)}</p>
          <button class="btn btn-primary btn-sm" onclick="addToCart({id:${rp.id},title:'${rp.title}',price:${rp.price},img:'${rp.img}'})">Add</button>
        </div>
      </div>`;
    rg.appendChild(el);
  });
  initReveal();
});
