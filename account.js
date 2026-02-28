/* ══════════════════════════════════════
   R FORM — Account JS
   account.js
══════════════════════════════════════ */

document.querySelectorAll('.acc-link[data-tab]').forEach(link=>{
  link.addEventListener('click',e=>{
    e.preventDefault();
    document.querySelectorAll('.acc-link').forEach(l=>l.classList.remove('active'));
    document.querySelectorAll('.acc-tab').forEach(t=>t.classList.remove('active'));
    link.classList.add('active');
    document.getElementById(`tab-${link.dataset.tab}`).classList.add('active');
  });
});

document.addEventListener('DOMContentLoaded',()=>{
  const orders=JSON.parse(localStorage.getItem('rf_orders')||'[]');
  const container=document.getElementById('ordersContainer');

  if(!orders.length){
    container.innerHTML=`<div class="orders-empty"><p>No orders yet.</p><a href="shop.html" class="btn btn-primary">Start Shopping →</a></div>`;
  } else {
    orders.slice().reverse().forEach(o=>{
      const date=new Date(o.date).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
      const el=document.createElement('div');
      el.className='order-card reveal';
      el.innerHTML=`
        <div class="order-hdr">
          <div><p class="order-id">${o.id}</p><p class="order-date">${date}</p></div>
          <span class="order-status">${o.status}</span>
          <div><p class="order-total">$${o.total}</p><p class="order-total-label" style="font-size:0.7rem;color:var(--text-3);text-align:right">${o.items.length} item(s)</p></div>
        </div>
        <div class="order-preview">
          ${o.items.map(i=>`<div class="order-prev-item"><img src="${i.img}" alt="${i.title}"/><span>${i.title} × ${i.qty}</span></div>`).join('')}
        </div>`;
      container.appendChild(el);
    });
  }
  initReveal();
});
