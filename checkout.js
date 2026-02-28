/* ══════════════════════════════════════
   R FORM — Checkout JS
   checkout.js
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded',()=>{
  const cart=getCart();
  const coItems=document.getElementById('coItems');

  if(!cart.length){
    coItems.innerHTML='<p style="color:var(--text-3);font-size:0.84rem">Cart is empty. <a href="shop.html" style="color:var(--accent)">Shop now</a></p>';
  } else {
    cart.forEach(item=>{
      const el=document.createElement('div');
      el.className='co-item';
      el.innerHTML=`
        <img src="${item.img}" alt="${item.title}"/>
        <div><p class="co-item-name">${item.title}</p><p class="co-item-qty">× ${item.qty}</p></div>
        <p class="co-item-price">$${(item.price*item.qty).toFixed(2)}</p>`;
      coItems.appendChild(el);
    });
    const sub=getCartTotal(), tax=sub*0.08;
    document.getElementById('coSub').textContent=`$${sub.toFixed(2)}`;
    document.getElementById('coTax').textContent=`$${tax.toFixed(2)}`;
    document.getElementById('coTotal').textContent=`$${(sub+tax).toFixed(2)}`;
  }

  document.getElementById('coPlaceBtn').addEventListener('click',async()=>{
    const required=['coFirst','coLast','coEmail','coPhone','coAddr','coCity','coZip','coCountry'];
    const empty=required.filter(id=>!document.getElementById(id).value.trim());
    if(empty.length){ document.getElementById(empty[0]).focus(); showToast('Please fill in all required fields'); return; }
    if(!cart.length){ showToast('Your cart is empty'); return; }

    const btn=document.getElementById('coPlaceBtn');
    document.getElementById('coBtnText').style.display='none';
    document.getElementById('coLoader').style.display='inline-block';
    btn.disabled=true;

    await new Promise(r=>setTimeout(r,1400));

    const orderId='RF-'+Date.now().toString(36).toUpperCase().slice(-8);
    const orders=JSON.parse(localStorage.getItem('rf_orders')||'[]');
    orders.push({
      id:orderId,
      date:new Date().toISOString(),
      items:cart,
      total:(getCartTotal()*1.08).toFixed(2),
      status:'Processing',
      name:`${document.getElementById('coFirst').value} ${document.getElementById('coLast').value}`,
      email:document.getElementById('coEmail').value
    });
    localStorage.setItem('rf_orders',JSON.stringify(orders));
    localStorage.removeItem('rf_cart');
    updateCartUI();

    document.getElementById('coOrderId').textContent=`Order ID: ${orderId}`;
    document.getElementById('coModal').style.display='flex';
    document.getElementById('coModal').classList.add('open');
  });

  document.getElementById('coModal').addEventListener('click',e=>{
    if(e.target===document.getElementById('coModal'))
      document.getElementById('coModal').style.display='none';
  });
});
