const portal=document.getElementById('portal');
function leavePortal(){portal.classList.add('hidden');setTimeout(()=>portal.remove(),1000)}
document.getElementById('enterButton').addEventListener('click',leavePortal);
document.getElementById('skipButton').addEventListener('click',leavePortal);
document.getElementById('menuToggle').addEventListener('click',()=>document.getElementById('mainNav').classList.toggle('open'));
document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('mainNav').classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  document.querySelectorAll('.gallery-item').forEach(item=>{item.hidden=btn.dataset.filter!=='all'&&item.dataset.category!==btn.dataset.filter});
}));
const lightbox=document.getElementById('lightbox'),lightboxImage=document.getElementById('lightboxImage');
document.querySelectorAll('.gallery-item img').forEach(img=>img.addEventListener('click',()=>{lightboxImage.src=img.src;lightboxImage.alt=img.alt;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false')}));
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightboxImage.src=''}
document.getElementById('lightboxClose').addEventListener('click',closeLightbox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});
document.getElementById('contactForm').addEventListener('submit',e=>{
  e.preventDefault();const d=new FormData(e.currentTarget);
  const subject=encodeURIComponent(d.get('subject'));
  const body=encodeURIComponent(`Nama: ${d.get('name')}\nEmail: ${d.get('email')}\n\n${d.get('message')}`);
  window.location.href=`mailto:syafiqghatfansatriaa@gmail.com?subject=${subject}&body=${body}`;
});