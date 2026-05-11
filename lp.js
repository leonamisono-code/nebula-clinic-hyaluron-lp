/* Nebula Clinic — Hyaluron LP scripts */
(function(){
  'use strict';

  /* ===== Countdown ===== */
  // Target: end of current month, 23:59:59 local time
  function targetDate(){
    const now = new Date();
    // last day of current month at 23:59:59
    const t = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 0);
    // If less than 24h remaining, push to end of next month (so demo always shows urgency)
    if (t.getTime() - now.getTime() < 24*3600*1000) {
      return new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 0);
    }
    return t;
  }

  const target = targetDate();
  const pad = n => String(n).padStart(2,'0');

  function tick(){
    const now = new Date();
    let diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
    const d = Math.floor(diff / 86400); diff -= d*86400;
    const h = Math.floor(diff / 3600); diff -= h*3600;
    const m = Math.floor(diff / 60);
    const s = diff - m*60;

    const set = (id, v) => { const el = document.getElementById(id); if(el) el.textContent = pad(v); };
    set('cd-d', d); set('cd-h', h); set('cd-m', m); set('cd-s', s);
    set('cd-d2', d); set('cd-h2', h); set('cd-m2', m); set('cd-s2', s);

    const inline = document.getElementById('cd-inline');
    if(inline) inline.textContent = `あと ${d}日 ${pad(h)}:${pad(m)}:${pad(s)}`;

    const bar = document.getElementById('cd-bar');
    if(bar) bar.textContent = `${pad(d)} : ${pad(h)} : ${pad(m)} : ${pad(s)}`;
  }
  tick();
  setInterval(tick, 1000);

  /* ===== Slot ticker (gentle decrement to imply scarcity, capped) =====
     Marketing-friendly: starts at 8, occasionally drops by 1 to a floor of 3
     over the session — purely UX urgency. Persists per-tab. */
  let slots = parseInt(sessionStorage.getItem('nb_slots') || '8', 10);
  const slotIds = ['slots','slots-inline','slots-final','slots-bar'];
  function paintSlots(){
    slotIds.forEach(id => {
      const el = document.getElementById(id);
      if(el) el.textContent = slots;
    });
  }
  paintSlots();
  // Random gentle decrement every 90-180s, never below 3
  function maybeDec(){
    if (slots > 3 && Math.random() < 0.45){
      slots -= 1;
      sessionStorage.setItem('nb_slots', slots);
      paintSlots();
      // small visual ping
      slotIds.forEach(id => {
        const el = document.getElementById(id);
        if(!el) return;
        el.animate(
          [{transform:'scale(1)'},{transform:'scale(1.3)',color:'#e2407b'},{transform:'scale(1)'}],
          {duration: 700, easing:'ease-out'}
        );
      });
    }
    setTimeout(maybeDec, 90000 + Math.random()*90000);
  }
  setTimeout(maybeDec, 60000);

  /* ===== Reveal on scroll ===== */
  const targets = document.querySelectorAll('.section-h, .worry__list li, .reason, .menu-card, .flow-list li, .dr-card, .price-card, .mech-points li, .mech-fig, .faq-list details');
  targets.forEach(el => el.classList.add('reveal'));
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin:'0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(el => el.classList.add('in'));
  }

  /* ===== Smooth anchor offset ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const id = this.getAttribute('href');
      if (id.length > 1){
        const t = document.querySelector(id);
        if(t){
          e.preventDefault();
          const y = t.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });
})();
