/* ══════════════════════════════════════
   R FORM — Cart JS
   cart.js
══════════════════════════════════════ */

function renderCart(){
  const cart=getCart();
  const items=document.getElementById('cartItems');
  const empty=document.getElementById('cartEmpty');
  const summary=document.getElementById('cartSummary');
  if(!items) return;

  items.innerHTML='';

  if(!cart.length){
    empty.style.display='flex'; empty.style.flexDirection='column'; empty.style.alignItems='center';
    summary.style.display='none';
    return;
  }

  empty.style.display='none';
  summary.style.display='block';

  cart.forEach(item=>{
    const el=document.createElement('div');
    el.className='cart-item'; el.dataset.id=item.id;
    el.innerHTML=`
      <div class="cart-item__img"><img src="${item.img}" alt="${item.title}"/></div>
      <div>
        <p class="cart-item__name">${item.title}</p>
        <p class="cart-item__unit">$${item.price.toFixed(2)} each</p>
        <span class="cart-item__remove" data-id="${item.id}">Remove ×</span>
      </div>
      <div class="cart-qty">
        <button class="cqb" data-action="minus" data-id="${item.id}">−</button>
        <input class="cqv" type="number" value="${item.qty}" min="1" max="99" data-id="${item.id}"/>
        <button class="cqb" data-action="plus" data-id="${item.id}">+</button>
      </div>
      <div class="cart-item__total">$${(item.price*item.qty).toFixed(2)}</div>`;
    items.appendChild(el);

    el.querySelector('.cart-item__remove').addEventListener('click',()=>{
      removeFromCart(item.id); renderCart();
    });
    el.querySelector('[data-action="minus"]').addEventListener('click',()=>{ updateCartQty(item.id,item.qty-1); renderCart(); });
    el.querySelector('[data-action="plus"]').addEventListener('click',()=>{ updateCartQty(item.id,item.qty+1); renderCart(); });
    el.querySelector('.cqv').addEventListener('change',e=>{ updateCartQty(item.id,+e.target.value); renderCart(); });
  });

  const sub=getCartTotal();
  const tax=sub*0.08;
  document.getElementById('sumSubtotal').textContent=`$${sub.toFixed(2)}`;
  document.getElementById('sumTax').textContent=`$${tax.toFixed(2)}`;
  document.getElementById('sumTotal').textContent=`$${(sub+tax).toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded',renderCart);
