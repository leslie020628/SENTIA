/* ==========================================================
   SENTÍA — Configurador funcional "Arma tu emoción"
   Cambia WhatsApp, precios, disponibilidad y dulces aquí.
   ========================================================== */
const SITE_CONFIG = {
  instagram: "https://www.instagram.com/sentia.dets/",
  whatsapp: "18299740579", // RD: escribe el número con 1 + código de área, sin + ni espacios. Ej. 18095551234
  minSlots: 4,
  maxSlots: 6,
  basePrice: 180
};

const candy = (name, price, icon, slots=1, available=true) => ({name, price, icon, slots, available});

const emotions = [
  { id:"alegria", name:"Alegría", icon:"☀", color:"#d9a22c", image:"assets/alegria.webp", phrase:"Para esos días que merecen un poquito más de felicidad.", candies:[
    candy("Gomitas frutales",40,"🍬"), candy("Paleta",35,"🍭",2), candy("Caramelos de colores",35,"🍬"), candy("Marshmallows",40,"☁️"), candy("Chicles",35,"🫧"), candy("Chocolate pequeño",55,"🍫"), candy("Dulce ácido suave",45,"🍋"), candy("Galletitas",45,"🍪") ]},
  { id:"carino", name:"Cariño", icon:"♡", color:"#b86673", image:"assets/carino.webp", phrase:"Para las personas que hacen la vida más bonita.", candies:[
    candy("Chocolate",55,"🍫"), candy("Gomitas de corazón",45,"💗"), candy("Marshmallows",40,"☁️"), candy("Caramelos de fresa",35,"🍓"), candy("Mini galletas",45,"🍪"), candy("Dulce de leche",50,"🥛"), candy("Paleta",35,"🍭",2), candy("Bombón",55,"🤎") ]},
  { id:"nostalgia", name:"Nostalgia", icon:"☾", color:"#946b71", image:"assets/nostalgia.webp", phrase:"Para esos recuerdos a los que siempre volvemos.", candies:[
    candy("Dulce de leche",50,"🥛"), candy("Dulce de coco",45,"🥥"), candy("Maní dulce",40,"🥜"), candy("Caramelo clásico",35,"🍬"), candy("Galletitas",45,"🍪"), candy("Paleta tradicional",35,"🍭",2), candy("Chocolate pequeño",55,"🍫"), candy("Dulce sorpresa de infancia",50,"✨") ]},
  { id:"amistad", name:"Amistad", icon:"❧", color:"#687b5b", image:"assets/amistad.webp", phrase:"Para las personas con las que todo sabe mejor.", candies:[
    candy("Gomitas para compartir",45,"🍬"), candy("Mini chocolates",55,"🍫"), candy("Caramelos",35,"🍬"), candy("Galletitas",45,"🍪"), candy("Chicles",35,"🫧"), candy("Paleta",35,"🍭",2), candy("Marshmallows",40,"☁️"), candy("Mix dulce",50,"🎉",2) ]},
  { id:"ilusion", name:"Ilusión", icon:"✧", color:"#6586b0", image:"assets/ilusion.webp", phrase:"Para todo lo bonito que todavía está por venir.", candies:[
    candy("Marshmallows",40,"☁️"), candy("Gomitas suaves",45,"🍬"), candy("Chocolate blanco",60,"🤍"), candy("Caramelos",35,"🍬"), candy("Galletitas",45,"🍪"), candy("Paleta",35,"🍭",2), candy("Dulce especial",45,"✨"), candy("Bombón",55,"🤎") ]},
  { id:"sorpresa", name:"Sorpresa", icon:"✦", color:"#63314f", image:"assets/sorpresa.webp", phrase:"Para cuando la vida necesita un poquito de magia.", candies:[
    candy("Dulce ácido",45,"🍋"), candy("Dulce picante",50,"🌶️"), candy("Gomitas",45,"🍬"), candy("Chocolate",55,"🍫"), candy("Paleta misteriosa",40,"🍭",2), candy("Caramelo sorpresa",40,"❔"), candy("Marshmallows",40,"☁️"), candy("Selección secreta",60,"🎁",2) ]}
];

const money = n => `RD$${n}`;
const emotionGrid = document.querySelector("#emotion-grid");
const minPreviewPrice = e => SITE_CONFIG.basePrice + [...e.candies].filter(x=>x.available).sort((a,b)=>a.price/a.slots-b.price/b.slots).slice(0,SITE_CONFIG.minSlots).reduce((s,c)=>s+c.price,0);

emotionGrid.innerHTML = emotions.map((e,i)=>`
  <article class="emotion-card reveal" style="--accent:${e.color};transition-delay:${Math.min(i*55,220)}ms">
    <div class="emotion-image"><img src="${e.image}" alt="Caja ${e.name} de SENTÍA vacía y personalizada" loading="lazy"><span class="emotion-badge">${String(i+1).padStart(2,'0')} · ${e.name}</span></div>
    <div class="emotion-body">
      <div class="emotion-head"><h3>${e.name}</h3><span class="emotion-icon">${e.icon}</span></div>
      <p class="emotion-phrase">${e.phrase}</p>
      <p class="recommended-label">Opciones para esta emoción</p>
      <div class="candy-preview">${e.candies.filter(c=>c.available).slice(0,5).map(c=>`<span class="candy-pill">${c.name}</span>`).join('')}<span class="candy-pill">+ más</span></div>
      <div class="emotion-actions"><div class="from-price"><small>desde aprox.</small><strong>${money(minPreviewPrice(e))}</strong></div><button class="build-btn" type="button" data-build="${e.id}">Armar esta emoción →</button></div>
    </div>
  </article>`).join("");

const modal=document.querySelector('#builder-modal');
const builderImage=document.querySelector('#builder-image');
const builderIcon=document.querySelector('#builder-icon');
const builderEmotion=document.querySelector('#builder-emotion');
const builderTitle=document.querySelector('#builder-title');
const builderPhrase=document.querySelector('#builder-phrase');
const candyOptions=document.querySelector('#candy-options');
const countEl=document.querySelector('#selection-count');
const totalEl=document.querySelector('#builder-total');
const submitBtn=document.querySelector('#builder-submit');
const copyBtn=document.querySelector('#copy-order');
const surpriseBtn=document.querySelector('#surprise-btn');
const messageEl=document.querySelector('#gift-message');
const messageCount=document.querySelector('#message-count');
const recipientEl=document.querySelector('#recipient-name');
const senderEl=document.querySelector('#sender-name');
const boxFill=document.querySelector('#box-fill');
const boxEmptyNote=document.querySelector('#box-empty-note');
const capacityText=document.querySelector('#capacity-text');
const capacityBar=document.querySelector('#capacity-bar');
document.querySelector('#min-items').textContent=SITE_CONFIG.minSlots;
document.querySelector('#max-items').textContent=SITE_CONFIG.maxSlots;

let current=null;
let selected=new Map(); // index -> quantity
let surpriseMode=false;

function usedSlots(){
  if(!current) return 0;
  return [...selected].reduce((sum,[idx,qty])=>sum+current.candies[idx].slots*qty,0);
}
function selectedPrice(){
  if(!current) return 0;
  return [...selected].reduce((sum,[idx,qty])=>sum+current.candies[idx].price*qty,0);
}
function selectedUnits(){ return [...selected.values()].reduce((a,b)=>a+b,0); }

function openBuilder(id){
  current=emotions.find(e=>e.id===id); if(!current)return;
  selected.clear(); surpriseMode=false; messageEl.value=''; recipientEl.value=''; senderEl.value=''; messageCount.textContent='0';
  surpriseBtn.classList.remove('selected');
  builderImage.src=current.image; builderImage.alt=`Caja ${current.name}`; builderIcon.textContent=current.icon; builderIcon.style.color=current.color;
  builderEmotion.textContent='CAJA '+current.name.toUpperCase(); builderTitle.textContent=`Arma tu ${current.name}`; builderPhrase.textContent=current.phrase;
  modal.style.setProperty('--builder-accent',current.color);
  renderCandies(); updateBuilder(); modal.showModal(); document.body.style.overflow='hidden';
}

function renderCandies(){
  candyOptions.innerHTML=current.candies.map((c,idx)=>`
    <div class="candy-option ${c.available?'':'unavailable'}" data-candy-index="${idx}">
      <div class="candy-main"><span class="candy-emoji">${c.icon}</span><span><strong>${c.name}</strong><small>${c.available?`+${money(c.price)} · ${c.slots} espacio${c.slots>1?'s':''}`:'Agotado por ahora'}</small></span></div>
      ${c.available?`<div class="qty-control"><button type="button" data-action="minus" aria-label="Quitar ${c.name}">−</button><b data-qty>0</b><button type="button" data-action="plus" aria-label="Agregar ${c.name}">+</button></div>`:'<span class="sold-out">AGOTADO</span>'}
    </div>`).join('');
}

function renderBoxFill(){
  if(surpriseMode){
    boxFill.innerHTML='<div class="surprise-token">✦<span>SENTÍA<br>elige por ti</span></div>';
    boxEmptyNote.hidden=true;
    return;
  }
  const tokens=[];
  [...selected].forEach(([idx,qty])=>{
    const c=current.candies[idx];
    for(let q=0;q<qty;q++) tokens.push(`<div class="candy-token" title="${c.name}"><span>${c.icon}</span><small>${c.name}</small></div>`);
  });
  boxFill.innerHTML=tokens.join('');
  boxEmptyNote.hidden=tokens.length>0;
}

function updateBuilder(){
  const slots=usedSlots();
  const total=SITE_CONFIG.basePrice+selectedPrice();
  countEl.textContent=surpriseMode?'SENTÍA elige por ti':`${selectedUnits()} dulce${selectedUnits()===1?'':'s'} · ${slots}/${SITE_CONFIG.maxSlots} espacios`;
  totalEl.textContent=surpriseMode?'Se confirma al pedir':money(total);
  capacityText.textContent=surpriseMode?'Sorpresa':`${slots} / ${SITE_CONFIG.maxSlots}`;
  capacityBar.style.width=surpriseMode?'100%':`${Math.min(100,slots/SITE_CONFIG.maxSlots*100)}%`;
  submitBtn.disabled=!surpriseMode && slots<SITE_CONFIG.minSlots;
  copyBtn.disabled=submitBtn.disabled;
  renderBoxFill();
  document.querySelectorAll('.candy-option[data-candy-index]').forEach(el=>{
    const idx=Number(el.dataset.candyIndex), qty=selected.get(idx)||0;
    el.classList.toggle('selected',qty>0);
    const q=el.querySelector('[data-qty]'); if(q) q.textContent=qty;
  });
}

emotionGrid.addEventListener('click',e=>{const b=e.target.closest('[data-build]'); if(b)openBuilder(b.dataset.build)});
candyOptions.addEventListener('click',e=>{
  const row=e.target.closest('[data-candy-index]'); const btn=e.target.closest('[data-action]'); if(!row||!btn)return;
  const idx=Number(row.dataset.candyIndex), item=current.candies[idx]; if(!item.available)return;
  surpriseMode=false; surpriseBtn.classList.remove('selected');
  const qty=selected.get(idx)||0;
  if(btn.dataset.action==='plus'){
    if(usedSlots()+item.slots>SITE_CONFIG.maxSlots){showToast(`Esa opción necesita ${item.slots} espacio${item.slots>1?'s':''}. Tu caja ya está casi llena.`);return;}
    selected.set(idx,qty+1);
  } else if(qty>1) selected.set(idx,qty-1); else selected.delete(idx);
  updateBuilder();
});

surpriseBtn.addEventListener('click',()=>{
  surpriseMode=!surpriseMode; selected.clear(); surpriseBtn.classList.toggle('selected',surpriseMode); updateBuilder();
});
messageEl.addEventListener('input',()=>messageCount.textContent=messageEl.value.length);
document.querySelector('.modal-close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{const r=modal.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()});
modal.addEventListener('close',()=>document.body.style.overflow='');

function makeOrderText(){
  if(!current)return '';
  const recipient=recipientEl.value.trim();
  const sender=senderEl.value.trim();
  const msg=messageEl.value.trim();
  let sweets;
  if(surpriseMode) sweets='✦ Selección sorpresa SENTÍA';
  else sweets=[...selected].map(([idx,qty])=>`• ${current.candies[idx].name}${qty>1?` x${qty}`:''}`).join('\n');
  const total=surpriseMode?'Por confirmar':money(SITE_CONFIG.basePrice+selectedPrice());
  return `Hola 💜 Quiero pedir una caja SENTÍA.\n\nEmoción: ${current.name} ${current.icon}\n${recipient?`Para: ${recipient}\n`:''}${sender?`De: ${sender}\n`:''}\nDulces:\n${sweets}${msg?`\n\nMensaje de la tarjeta:\n“${msg}”`:''}\n\nTotal estimado: ${total}\n\n¿Me confirman disponibilidad, forma de pago y entrega?`;
}

submitBtn.addEventListener('click',()=>{
  const text=makeOrderText(); if(!text)return;
  if(SITE_CONFIG.whatsapp){
    const numero=SITE_CONFIG.whatsapp.replace(/\D/g,'');
    const url=`https://wa.me/${numero}?text=${encodeURIComponent(text)}`;
    window.location.href=url;
  } else {
    showToast('Falta agregar el número de WhatsApp de SENTÍA en script.js.');
  }
});
copyBtn.addEventListener('click',async()=>{
  const text=makeOrderText(); if(!text)return;
  try{await navigator.clipboard.writeText(text); showToast('Resumen del pedido copiado ✓');}
  catch{showToast('No pude copiar automáticamente. Usa el botón de WhatsApp cuando agregues el número.');}
});

/* Pasaporte interactivo */
const stickerGrid=document.querySelector('#sticker-grid'), passportStatus=document.querySelector('#passport-status');let collected=new Set();
stickerGrid.innerHTML=emotions.map(e=>`<button class="sticker-slot" type="button" data-sticker="${e.id}" aria-pressed="false" style="--slot-color:${e.color}22"><span class="sticker-check">✓</span><span class="sticker-icon" style="color:${e.color}">${e.icon}</span><span class="sticker-name">${e.name}</span></button>`).join('');
stickerGrid.addEventListener('click',ev=>{const slot=ev.target.closest('[data-sticker]');if(!slot)return;const id=slot.dataset.sticker;collected.has(id)?collected.delete(id):collected.add(id);const active=collected.has(id);slot.classList.toggle('active',active);slot.setAttribute('aria-pressed',String(active));passportStatus.textContent=collected.size===emotions.length?'Pasaporte completo ✦ Tu última emoción guarda una sorpresa.':`${collected.size} / ${emotions.length} emociones coleccionadas`;});

/* navegación + apariciones */
const header=document.querySelector('.site-header'),toggle=document.querySelector('.menu-toggle');toggle.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');toggle.setAttribute('aria-expanded',String(open))});document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('menu-open')));window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>25),{passive:true});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){setTimeout(()=>entry.target.classList.add('visible'),Number(entry.target.dataset.delay||0));observer.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -20px'});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const toast=document.querySelector('#toast');function showToast(t){toast.textContent=t;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),3000)}
