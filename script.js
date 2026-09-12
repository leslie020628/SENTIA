/* ==========================================================
   SENTÍA — datos editables
   Aquí puedes cambiar emociones, precios, imágenes y dulces.
   Las marcas no forman parte del sistema: usa categorías.
   ========================================================== */
const SITE_CONFIG = {
  instagram: "https://www.instagram.com/sentia.dets/",
  whatsapp: "18299740579", // Ej.: 18095551234
  minItems: 4,
  maxItems: 8,
  basePrice: 180
};

const emotions = [
  {
    id:"alegria", name:"Alegría", icon:"☀", color:"#d9a22c", image:"assets/alegria.webp",
    phrase:"Para esos días que merecen un poquito más de felicidad.",
    candies:[
      ["Gomitas frutales",40],["Paleta",35],["Caramelos de colores",35],["Marshmallows",40],["Chicles",35],["Chocolate pequeño",55],["Dulce ácido suave",45],["Galletitas",45]
    ]
  },
  {
    id:"carino", name:"Cariño", icon:"♡", color:"#b86673", image:"assets/carino.webp",
    phrase:"Para las personas que hacen la vida más bonita.",
    candies:[
      ["Chocolate",55],["Gomitas de corazón",45],["Marshmallows",40],["Caramelos de fresa",35],["Mini galletas",45],["Dulce de leche",50],["Paleta",35],["Bombón",55]
    ]
  },
  {
    id:"nostalgia", name:"Nostalgia", icon:"☾", color:"#946b71", image:"assets/nostalgia.webp",
    phrase:"Para esos recuerdos a los que siempre volvemos.",
    candies:[
      ["Dulce de leche",50],["Dulce de coco",45],["Maní dulce",40],["Caramelo clásico",35],["Galletitas",45],["Paleta tradicional",35],["Chocolate pequeño",55],["Dulce sorpresa de infancia",50]
    ]
  },
  {
    id:"amistad", name:"Amistad", icon:"❧", color:"#687b5b", image:"assets/amistad.webp",
    phrase:"Para las personas con las que todo sabe mejor.",
    candies:[
      ["Gomitas para compartir",45],["Mini chocolates",55],["Caramelos",35],["Galletitas",45],["Chicles",35],["Paleta",35],["Marshmallows",40],["Mix dulce",50]
    ]
  },
  {
    id:"ilusion", name:"Ilusión", icon:"✧", color:"#6586b0", image:"assets/ilusion.webp",
    phrase:"Para todo lo bonito que todavía está por venir.",
    candies:[
      ["Marshmallows",40],["Gomitas suaves",45],["Chocolate blanco",60],["Caramelos",35],["Galletitas",45],["Paleta",35],["Dulce azul",45],["Bombón",55]
    ]
  },
  {
    id:"sorpresa", name:"Sorpresa", icon:"✦", color:"#63314f", image:"assets/sorpresa.webp",
    phrase:"Para cuando la vida necesita un poquito de magia.",
    candies:[
      ["Dulce ácido",45],["Dulce picante",50],["Gomitas",45],["Chocolate",55],["Paleta misteriosa",40],["Caramelo sorpresa",40],["Marshmallows",40],["Selección secreta",60]
    ]
  }
];

const money = n => `RD$${n}`;
const emotionGrid = document.querySelector("#emotion-grid");

emotionGrid.innerHTML = emotions.map((e,i)=>`
  <article class="emotion-card reveal" style="--accent:${e.color};transition-delay:${Math.min(i*55,220)}ms">
    <div class="emotion-image"><img src="${e.image}" alt="Caja ${e.name} de SENTÍA vacía y personalizada" loading="lazy"><span class="emotion-badge">${String(i+1).padStart(2,'0')} · ${e.name}</span></div>
    <div class="emotion-body">
      <div class="emotion-head"><h3>${e.name}</h3><span class="emotion-icon">${e.icon}</span></div>
      <p class="emotion-phrase">${e.phrase}</p>
      <p class="recommended-label">Opciones para esta emoción</p>
      <div class="candy-preview">${e.candies.slice(0,5).map(c=>`<span class="candy-pill">${c[0]}</span>`).join('')}<span class="candy-pill">+ más</span></div>
      <div class="emotion-actions"><div class="from-price"><small>desde</small><strong>${money(SITE_CONFIG.basePrice + e.candies[0][1]*SITE_CONFIG.minItems)}</strong></div><button class="build-btn" type="button" data-build="${e.id}">Armar esta emoción →</button></div>
    </div>
  </article>
`).join("");

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
const surpriseBtn=document.querySelector('#surprise-btn');
const messageEl=document.querySelector('#gift-message');
document.querySelector('#min-items').textContent=SITE_CONFIG.minItems;
document.querySelector('#max-items').textContent=SITE_CONFIG.maxItems;
let current=null, selected=new Set(), surpriseMode=false;

function openBuilder(id){
  current=emotions.find(e=>e.id===id); if(!current)return;
  selected.clear(); surpriseMode=false; messageEl.value=''; surpriseBtn.classList.remove('selected');
  builderImage.src=current.image; builderImage.alt=`Caja ${current.name}`; builderIcon.textContent=current.icon; builderIcon.style.color=current.color;
  builderEmotion.textContent='CAJA '+current.name.toUpperCase(); builderTitle.textContent=`Arma tu ${current.name}`; builderPhrase.textContent=current.phrase;
  renderCandies(); updateBuilder(); modal.showModal(); document.body.style.overflow='hidden';
}
function renderCandies(){
  candyOptions.innerHTML=current.candies.map(([name,price],idx)=>`<label class="candy-option" data-candy-index="${idx}"><input type="checkbox"><span><strong>${name}</strong><small> +${money(price)}</small></span><span>＋</span></label>`).join('');
}
function updateBuilder(){
  const chosen=[...selected].map(i=>current.candies[i]);
  const total=SITE_CONFIG.basePrice+chosen.reduce((s,c)=>s+c[1],0);
  countEl.textContent=surpriseMode?'SENTÍA elige por ti':`${selected.size} / ${SITE_CONFIG.maxItems} dulces`;
  totalEl.textContent=surpriseMode?'Se confirma al pedir':money(total);
  submitBtn.disabled=!surpriseMode && selected.size<SITE_CONFIG.minItems;
}

emotionGrid.addEventListener('click',e=>{const b=e.target.closest('[data-build]'); if(b)openBuilder(b.dataset.build)});
candyOptions.addEventListener('click',e=>{
  const label=e.target.closest('[data-candy-index]'); if(!label)return; e.preventDefault();
  const idx=Number(label.dataset.candyIndex); surpriseMode=false; surpriseBtn.classList.remove('selected');
  if(selected.has(idx)){selected.delete(idx);label.classList.remove('selected')}else{
    if(selected.size>=SITE_CONFIG.maxItems){showToast(`Puedes elegir hasta ${SITE_CONFIG.maxItems} dulces.`);return}
    selected.add(idx);label.classList.add('selected')
  }
  updateBuilder();
});
surpriseBtn.addEventListener('click',()=>{surpriseMode=!surpriseMode;selected.clear();document.querySelectorAll('.candy-option').forEach(x=>x.classList.remove('selected'));surpriseBtn.classList.toggle('selected',surpriseMode);updateBuilder()});
document.querySelector('.modal-close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{const r=modal.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()});
modal.addEventListener('close',()=>document.body.style.overflow='');

submitBtn.addEventListener('click',()=>{
  if(!current)return;
  const list=surpriseMode?'Quiero que SENTÍA elija los dulces.':[...selected].map(i=>current.candies[i][0]).join(', ');
  const msg=messageEl.value.trim();
  const text=`Hola, quiero armar una caja ${current.name} de SENTÍA.\nDulces: ${list}${msg?`\nMensaje de la tarjeta: ${msg}`:''}`;
  if(SITE_CONFIG.whatsapp) window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`,'_blank','noopener');
  else {navigator.clipboard?.writeText(text);showToast('Tu pedido se copió. Agrega el WhatsApp en script.js para enviarlo directo.');}
});

/* Pasaporte interactivo */
const stickerGrid=document.querySelector('#sticker-grid'), passportStatus=document.querySelector('#passport-status');let collected=new Set();
stickerGrid.innerHTML=emotions.map(e=>`<button class="sticker-slot" type="button" data-sticker="${e.id}" aria-pressed="false" style="--slot-color:${e.color}22"><span class="sticker-check">✓</span><span class="sticker-icon" style="color:${e.color}">${e.icon}</span><span class="sticker-name">${e.name}</span></button>`).join('');
stickerGrid.addEventListener('click',ev=>{const slot=ev.target.closest('[data-sticker]');if(!slot)return;const id=slot.dataset.sticker;collected.has(id)?collected.delete(id):collected.add(id);const active=collected.has(id);slot.classList.toggle('active',active);slot.setAttribute('aria-pressed',String(active));passportStatus.textContent=collected.size===emotions.length?'Pasaporte completo ✦ Tu última emoción guarda una sorpresa.':`${collected.size} / ${emotions.length} emociones coleccionadas`;});

/* navegación + apariciones */
const header=document.querySelector('.site-header'),toggle=document.querySelector('.menu-toggle');toggle.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');toggle.setAttribute('aria-expanded',String(open))});document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('menu-open')));window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>25),{passive:true});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){setTimeout(()=>entry.target.classList.add('visible'),Number(entry.target.dataset.delay||0));observer.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -20px'});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const toast=document.querySelector('#toast');function showToast(t){toast.textContent=t;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2800)}
