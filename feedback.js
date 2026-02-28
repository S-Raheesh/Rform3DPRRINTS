/* ══════════════════════════════════════
   R FORM — Feedback & Reviews JS
   feedback.js
   All review logic: submit, display, sort, persist
══════════════════════════════════════ */

const FB_KEY = 'rf_reviews';

/* ── Seed reviews so page is never blank ── */
const SEED_REVIEWS = [
  { id:'seed1', name:'Aisha R.', product:'Custom Name Plate', rating:5, title:'Absolutely stunning quality', body:'The name plate I ordered exceeded every expectation. Precision finish, came in perfect packaging, arrived in 2 days. Already ordered 3 more for my colleagues.', date:'2025-02-10T09:15:00Z', anon:false },
  { id:'seed2', name:'Marcus T.', product:'Miniature Figurine', rating:5, title:'Best 3D printing service I\'ve found', body:'My DnD character figurine is stunning. Every detail I described was captured. R Form clearly takes pride in their work — this is a 10/10 service.', date:'2025-02-05T14:30:00Z', anon:false },
  { id:'seed3', name:'Priya S.', product:'Wall Art Panel', rating:5, title:'Transformed my living room', body:'The geometric wall panels look incredible. The build quality is outstanding and the prints are super clean. I get compliments from everyone who visits.', date:'2025-01-28T11:00:00Z', anon:false },
  { id:'seed4', name:'James K.', product:'Desk Organizer', rating:5, title:'Perfect for my WFH setup', body:'Fast, beautiful, and professional. The desk organizer fits perfectly and the surface quality is really impressive for the price. Will definitely order again.', date:'2025-01-20T16:45:00Z', anon:false },
  { id:'seed5', name:'Sara M.', product:'Custom Logo Print', rating:5, title:'Our trade show star', body:'I sent in our company logo for a custom 3D print. The result was better than I imagined — we used it as a centrepiece at our trade show stand and got so many compliments.', date:'2025-01-12T08:20:00Z', anon:false },
];

function getReviews(){
  try { return JSON.parse(localStorage.getItem(FB_KEY))||[]; }
  catch { return []; }
}

function saveReviews(list){ localStorage.setItem(FB_KEY,JSON.stringify(list)); }

function getAllReviews(){
  const saved=getReviews();
  const savedIds=new Set(saved.map(r=>r.id));
  const seeds=SEED_REVIEWS.filter(s=>!savedIds.has(s.id));
  return [...seeds,...saved];
}

/* ── Star Rating ── */
let selectedRating=0;
const ratingLabels=['','Poor','Fair','Good','Great','Excellent!'];

function setStars(v){
  document.querySelectorAll('.star-btn').forEach(b=>{
    b.classList.toggle('lit',parseInt(b.dataset.v)<=v);
  });
  const el=document.getElementById('ratingText');
  if(el) el.textContent=v>0?ratingLabels[v]:'Tap to rate';
}

document.querySelectorAll('.star-btn').forEach(btn=>{
  btn.addEventListener('mouseenter',()=>setStars(parseInt(btn.dataset.v)));
  btn.addEventListener('mouseleave',()=>setStars(selectedRating));
  btn.addEventListener('click',()=>{ selectedRating=parseInt(btn.dataset.v); setStars(selectedRating); });
});

/* ── Render Reviews ── */
function starEmoji(n){
  return '★'.repeat(n)+'☆'.repeat(5-n);
}

function timeAgo(dateStr){
  const diff=Date.now()-new Date(dateStr).getTime();
  const days=Math.floor(diff/86400000);
  if(days===0) return 'Today';
  if(days===1) return 'Yesterday';
  if(days<7) return `${days} days ago`;
  if(days<30) return `${Math.floor(days/7)} week${Math.floor(days/7)>1?'s':''} ago`;
  return new Date(dateStr).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}

function renderReviews(){
  const feed=document.getElementById('reviewsFeed');
  const empty=document.getElementById('reviewsEmpty');
  const countLabel=document.getElementById('reviewCountLabel');
  const totalEl=document.getElementById('totalReviews');
  if(!feed) return;

  let reviews=getAllReviews();
  const sort=document.getElementById('fbSortReviews')?.value||'newest';
  if(sort==='newest') reviews.sort((a,b)=>new Date(b.date)-new Date(a.date));
  else if(sort==='oldest') reviews.sort((a,b)=>new Date(a.date)-new Date(b.date));
  else if(sort==='highest') reviews.sort((a,b)=>b.rating-a.rating);
  else if(sort==='lowest') reviews.sort((a,b)=>a.rating-b.rating);

  feed.innerHTML='';
  const n=reviews.length;
  if(countLabel) countLabel.textContent=n;
  if(totalEl) totalEl.textContent=n;

  if(!n){ empty&&(empty.style.display='block'); return; }
  empty&&(empty.style.display='none');

  reviews.forEach(r=>{
    const initials=(r.name||'?')[0].toUpperCase();
    const displayName=r.anon?'Anonymous':r.name;
    const card=document.createElement('div');
    card.className='review-card';
    card.innerHTML=`
      <div class="review-card-top">
        <div class="review-author">
          <div class="review-av">${r.anon?'?':initials}</div>
          <div>
            <p class="review-av-name">${displayName}</p>
            ${r.product?`<p class="review-av-product">${r.product}</p>`:''}
          </div>
        </div>
        <div class="review-meta">
          <div class="review-stars" style="color:var(--accent)">${'★'.repeat(r.rating)}<span style="color:var(--border-2)">${'★'.repeat(5-r.rating)}</span></div>
          <p class="review-date">${timeAgo(r.date)}</p>
        </div>
      </div>
      ${r.title?`<p class="review-title">${r.title}</p>`:''}
      <p class="review-body">"${r.body}"</p>
      <p class="review-verified">✓ Verified Buyer</p>`;
    feed.appendChild(card);
  });
}

/* ── Submit ── */
document.getElementById('fbSubmit')?.addEventListener('click',()=>{
  const name=document.getElementById('fbName')?.value.trim();
  const email=document.getElementById('fbEmail')?.value.trim();
  const body=document.getElementById('fbReview')?.value.trim();

  if(!name){ showToast('Please enter your name'); document.getElementById('fbName').focus(); return; }
  if(!email){ showToast('Please enter your email'); document.getElementById('fbEmail').focus(); return; }
  if(!selectedRating){ showToast('Please select a star rating'); return; }
  if(!body){ showToast('Please write your review'); document.getElementById('fbReview').focus(); return; }

  const review={
    id:'rv_'+Date.now(),
    name,
    email,
    product:document.getElementById('fbProduct')?.value||'',
    rating:selectedRating,
    title:document.getElementById('fbTitle')?.value.trim()||'',
    body,
    anon:document.getElementById('fbAnon')?.checked||false,
    date:new Date().toISOString()
  };

  /* Firebase placeholder:
     await addDoc(collection(db,'feedback'), review); */

  const saved=getReviews();
  saved.push(review);
  saveReviews(saved);

  showToast('Thank you! Your review has been posted ✓');

  /* Reset form */
  document.getElementById('fbName').value='';
  document.getElementById('fbEmail').value='';
  document.getElementById('fbProduct').value='';
  document.getElementById('fbReview').value='';
  document.getElementById('fbTitle').value='';
  document.getElementById('fbAnon').checked=false;
  selectedRating=0;
  setStars(0);

  renderReviews();
});

/* ── Sort ── */
document.getElementById('fbSortReviews')?.addEventListener('change',renderReviews);

/* ── Init ── */
document.addEventListener('DOMContentLoaded',()=>{
  renderReviews();
});
