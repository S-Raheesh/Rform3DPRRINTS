/* ══════════════════════════════════════
   R FORM — Custom Order JS
   custom.js
══════════════════════════════════════ */

/* ── File Upload ── */
const fileInput=document.getElementById('cfFiles');
const fileList=document.getElementById('fileList');
const uploadArea=document.getElementById('fileUploadArea');
let selectedFiles=[];

function renderFileList(){
  if(!fileList) return;
  fileList.innerHTML='';
  selectedFiles.forEach((f,i)=>{
    const el=document.createElement('div');
    el.className='file-item';
    el.innerHTML=`
      <div class="file-item-name">📄 <span>${f.name}</span></div>
      <span class="file-remove" data-i="${i}">Remove ×</span>`;
    fileList.appendChild(el);
  });
  fileList.querySelectorAll('.file-remove').forEach(btn=>{
    btn.addEventListener('click',()=>{
      selectedFiles.splice(parseInt(btn.dataset.i),1);
      renderFileList();
    });
  });
}

fileInput?.addEventListener('change',()=>{
  const arr=Array.from(fileInput.files||[]);
  selectedFiles=[...selectedFiles,...arr].slice(0,5);
  renderFileList();
  fileInput.value='';
});

// Drag & Drop
uploadArea?.addEventListener('dragover',e=>{e.preventDefault();uploadArea.classList.add('drag-over');});
uploadArea?.addEventListener('dragleave',()=>uploadArea.classList.remove('drag-over'));
uploadArea?.addEventListener('drop',e=>{
  e.preventDefault(); uploadArea.classList.remove('drag-over');
  const arr=Array.from(e.dataTransfer.files||[]);
  selectedFiles=[...selectedFiles,...arr].slice(0,5);
  renderFileList();
});

/* ── Submit ── */
document.getElementById('cfSubmit')?.addEventListener('click',async()=>{
  const name=document.getElementById('cfName')?.value.trim();
  const email=document.getElementById('cfEmail')?.value.trim();
  const type=document.getElementById('cfType')?.value;
  const desc=document.getElementById('cfDesc')?.value.trim();
  const budget=document.getElementById('cfBudget')?.value;
  const timeline=document.getElementById('cfTimeline')?.value;

  if(!name){showToast('Please enter your name');document.getElementById('cfName').focus();return;}
  if(!email){showToast('Please enter your email');document.getElementById('cfEmail').focus();return;}
  if(!type){showToast('Please select a project type');document.getElementById('cfType').focus();return;}
  if(!desc){showToast('Please describe your project');document.getElementById('cfDesc').focus();return;}
  if(!budget){showToast('Please select a budget range');document.getElementById('cfBudget').focus();return;}
  if(!timeline){showToast('Please select a timeline');document.getElementById('cfTimeline').focus();return;}

  const btn=document.getElementById('cfSubmit');
  btn.disabled=true; btn.textContent='Submitting…';

  await new Promise(r=>setTimeout(r,1500));

  const requestId='CR-'+Date.now().toString(36).toUpperCase().slice(-8);
  const request={
    id:requestId,
    name, email,
    phone:document.getElementById('cfPhone')?.value.trim()||'',
    type, desc, budget, timeline,
    material:document.getElementById('cfMaterial')?.value||'',
    color:document.getElementById('cfColor')?.value||'',
    dimensions:document.getElementById('cfDimensions')?.value.trim()||'',
    notes:document.getElementById('cfNotes')?.value.trim()||'',
    fileCount:selectedFiles.length,
    status:'Submitted',
    date:new Date().toISOString()
  };

  /* Firebase placeholder:
     await addDoc(collection(db,'customOrders'), request); */

  const saved=JSON.parse(localStorage.getItem('rf_custom_orders')||'[]');
  saved.push(request);
  localStorage.setItem('rf_custom_orders',JSON.stringify(saved));

  showToast('Request submitted! We\'ll reply within 24 hours ✓');
  btn.disabled=false; btn.textContent='Submit Custom Request →';

  // Show status panel
  const statusPanel=document.getElementById('requestStatus');
  if(statusPanel){
    statusPanel.style.display='block';
    document.getElementById('statusId').textContent=`Request ID: ${requestId}`;
    statusPanel.scrollIntoView({behavior:'smooth',block:'center'});
  }

  // Clear form
  ['cfName','cfEmail','cfPhone','cfDesc','cfDimensions','cfNotes'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  ['cfType','cfMaterial','cfColor','cfBudget','cfTimeline'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  selectedFiles=[]; renderFileList();
});
