document.addEventListener('DOMContentLoaded', () => {

    // ── CUSTOM CURSOR ──
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove', e => {
        mx=e.clientX; my=e.clientY;
        dot.style.left=mx+'px'; dot.style.top=my+'px';
    });
    (function loop(){ rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(loop); })();
    document.querySelectorAll('a,button,.club-card,.faq-item,.thumb,.team-card,.filter-tag').forEach(el=>{
        el.addEventListener('mouseenter',()=>ring.classList.add('expanded'));
        el.addEventListener('mouseleave',()=>ring.classList.remove('expanded'));
    });

    // ── SCROLL PROGRESS ──
    const prog = document.getElementById('scrollProgress');
    window.addEventListener('scroll',()=>{
        prog.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%';
    },{passive:true});

    // ── BACK TO TOP ──
    const btt = document.getElementById('backToTop');
    window.addEventListener('scroll',()=>btt.classList.toggle('visible',window.scrollY>400),{passive:true});
    btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

    // ── ACTIVE NAV ──
    const sections = document.querySelectorAll('section[id]');
    const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
    window.addEventListener('scroll',()=>{
        let cur='';
        sections.forEach(s=>{ if(window.scrollY>=s.offsetTop-150) cur=s.id; });
        navAs.forEach(a=>{ a.classList.remove('active-link'); if(a.getAttribute('href')==='#'+cur) a.classList.add('active-link'); });
    },{passive:true});

    // ── NAVBAR ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>60),{passive:true});

    // ── MOBILE MENU ──
    const toggle = document.getElementById('menuToggle');
    const links  = document.getElementById('navLinks');
    toggle.addEventListener('click',()=>{ links.classList.toggle('open'); toggle.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ links.classList.remove('open'); toggle.classList.remove('open'); }));

    // ── THEME ──
    const themeBtn=document.getElementById('theme-toggle');
    const sun=document.querySelector('.sun-icon');
    const moon=document.querySelector('.moon-icon');
    function applyTheme(t){ document.body.setAttribute('data-theme',t); sun.style.display=t==='dark'?'block':'none'; moon.style.display=t==='light'?'block':'none'; }
    applyTheme(localStorage.getItem('nexus-theme')||'dark');
    themeBtn.addEventListener('click',()=>{ const n=document.body.getAttribute('data-theme')==='dark'?'light':'dark'; applyTheme(n); localStorage.setItem('nexus-theme',n); });

    // ── COUNTDOWN ──
    const target=new Date(); target.setDate(target.getDate()+21);
    const dEl=document.getElementById('days'),hEl=document.getElementById('hours'),mEl=document.getElementById('minutes'),sEl=document.getElementById('seconds');
    function tick(){ const d=target-Date.now(); if(d<=0)return; dEl.textContent=String(Math.floor(d/86400000)).padStart(2,'0'); hEl.textContent=String(Math.floor((d%86400000)/3600000)).padStart(2,'0'); mEl.textContent=String(Math.floor((d%3600000)/60000)).padStart(2,'0'); sEl.textContent=String(Math.floor((d%60000)/1000)).padStart(2,'0'); }
    tick(); setInterval(tick,1000);

    // ── SCROLL REVEAL ──
    const reveals=document.querySelectorAll('.reveal');
    const obs=new IntersectionObserver(entries=>{
        entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('active'); obs.unobserve(e.target); } });
    },{threshold:0,rootMargin:'0px 0px -40px 0px'});
    reveals.forEach(el=>obs.observe(el));
    setTimeout(()=>reveals.forEach(el=>{ if(el.getBoundingClientRect().top<window.innerHeight) el.classList.add('active'); }),80);

    // ── STAT COUNTERS ──
    const statObs=new IntersectionObserver(entries=>{
        entries.forEach(e=>{ if(!e.isIntersecting)return; const el=e.target,end=+el.getAttribute('data-target'),step=end/90; let c=0; const t=setInterval(()=>{ c+=step; if(c>=end){el.textContent=end+'+';clearInterval(t);}else{el.textContent=Math.floor(c)+'+';} },16); statObs.unobserve(el); });
    },{threshold:.5});
    document.querySelectorAll('.stat-number').forEach(el=>statObs.observe(el));

    // ── CLUB SEARCH & FILTER ──
    const cards=document.querySelectorAll('.club-card');
    const searchInput=document.getElementById('clubSearch');
    const filterBtns=document.querySelectorAll('.filter-tag');
    const noRes=document.getElementById('noResults');
    let activeFilter='all';
    function filterClubs(){
        const q=searchInput.value.toLowerCase(); let n=0;
        cards.forEach(c=>{ const ok=(activeFilter==='all'||c.getAttribute('data-category')===activeFilter)&&(c.querySelector('h3').textContent.toLowerCase().includes(q)||c.querySelector('p').textContent.toLowerCase().includes(q)); c.style.display=ok?'':'none'; if(ok)n++; });
        noRes.style.display=n===0?'block':'none';
    }
    searchInput.addEventListener('input',filterClubs);
    filterBtns.forEach(b=>b.addEventListener('click',()=>{ filterBtns.forEach(x=>x.classList.remove('active')); b.classList.add('active'); activeFilter=b.getAttribute('data-filter'); filterClubs(); }));

    // ── CLUB MODAL ──
    const clubData={
        ambassador:{title:'Student Ambassador',category:'Leadership',desc:'Be the face of the college. Guide new students, represent at events, and build leadership skills.',activities:['Campus tours & orientations','College fair representation','Mentorship programs','Public speaking workshops']},
        nextgen:{title:'NextGen MergMind',category:'Technology',desc:'Where code meets creativity. Build real-world projects, compete in hackathons, and explore AI.',activities:['Weekly coding sprints','Hackathon teams','AI & ML workshops','Industry guest talks']},
        alumni:{title:'Alumni Connect',category:'Leadership',desc:'Bridge the gap between student life and a successful career. Network with alumni from top companies.',activities:['Networking dinners','LinkedIn mentorship','Career guidance sessions','Industry field trips']},
        impact:{title:'Impact Nexus',category:'Social Impact',desc:'Create meaningful change. Lead sustainability campaigns and social innovation projects.',activities:['Monthly clean-up drives','Sustainability workshops','Fundraising campaigns','Policy advocacy']},
        inter:{title:'Inter Club Collaboration',category:'Social Impact',desc:'The glue that holds Nexus together. Coordinate mega-events and build inter-club partnerships.',activities:['Annual Nexus Fest','Inter-club tournaments','Joint workshops','Campus media productions']}
    };
    const modal=document.getElementById('clubModal');
    const mClose=document.getElementById('modalClose');
    function openModal(key){ const d=clubData[key]; if(!d)return; document.getElementById('modalTitle').textContent=d.title; document.getElementById('modalCategory').textContent=d.category; document.getElementById('modalDesc').textContent=d.desc; document.getElementById('modalActivities').innerHTML=d.activities.map(a=>`<li>${a}</li>`).join(''); modal.classList.add('active'); document.body.style.overflow='hidden'; }
    function closeModal(){ modal.classList.remove('active'); document.body.style.overflow=''; }
    cards.forEach(c=>c.addEventListener('click',()=>openModal(c.getAttribute('data-club'))));
    mClose.addEventListener('click',closeModal);
    modal.addEventListener('click',e=>{ if(e.target===modal)closeModal(); });

    // ── GALLERY ──
    const thumbs=document.querySelectorAll('.thumb');
    const mainImg=document.getElementById('mainGalleryImg');
    thumbs.forEach(t=>t.addEventListener('click',()=>{
        thumbs.forEach(x=>x.classList.remove('active')); t.classList.add('active');
        mainImg.style.opacity='0';
        setTimeout(()=>{ mainImg.src=t.getAttribute('data-img'); document.getElementById('galleryTitle').textContent=t.getAttribute('data-title'); document.getElementById('galleryDesc').textContent=t.getAttribute('data-desc'); mainImg.style.opacity='1'; },280);
    }));
    mainImg.style.transition='opacity .28s ease';

    // ── REMIND ME ──
    document.querySelectorAll('.remind-btn').forEach(btn=>btn.addEventListener('click',()=>{
        const name=btn.closest('.event-card').querySelector('h3').textContent;
        showToast(`Reminder set for "${name}"! ✅`,'success');
        btn.textContent='Reminder Set ✓'; btn.disabled=true;
    }));

    // ── FAQ ──
    document.querySelectorAll('.faq-item').forEach(item=>item.addEventListener('click',()=>{
        const open=item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('active'));
        if(!open)item.classList.add('active');
    }));

    // ── MULTI-STEP FORM ──
    const step1=document.getElementById('step1');
    const step2=document.getElementById('step2');
    const progress=document.getElementById('formProgress');
    document.querySelector('.next-step').addEventListener('click',()=>{
        const nameEl=document.getElementById('name'),emailEl=document.getElementById('email'),phoneEl=document.getElementById('phone');
        const nGrp=nameEl.closest('.form-group'),eGrp=emailEl.closest('.form-group'),pGrp=phoneEl.closest('.form-group');
        let ok=true;
        nGrp.classList.remove('has-error','is-valid'); if(!nameEl.value.trim()){nGrp.classList.add('has-error');ok=false;}else nGrp.classList.add('is-valid');
        eGrp.classList.remove('has-error','is-valid'); if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())){eGrp.classList.add('has-error');ok=false;}else eGrp.classList.add('is-valid');
        pGrp.classList.remove('has-error','is-valid'); if(!/^[0-9+\-\s]{7,15}$/.test(phoneEl.value.trim())){pGrp.classList.add('has-error');ok=false;}else pGrp.classList.add('is-valid');
        if(!ok)return;
        step1.classList.remove('active'); step2.classList.add('active'); progress.style.width='100%';
    });
    document.querySelector('.prev-step').addEventListener('click',()=>{ step2.classList.remove('active'); step1.classList.add('active'); progress.style.width='50%'; });
    document.getElementById('multiStepForm').addEventListener('submit',e=>{ e.preventDefault(); if(!document.getElementById('club-select').value){showToast('Please select a club.','info');return;} showToast('Application submitted! 🎉','success'); e.target.reset(); step2.classList.remove('active'); step1.classList.add('active'); progress.style.width='50%'; });

    // ── NEWSLETTER ──
    const nf=document.getElementById('newsletterForm');
    if(nf) nf.addEventListener('submit',e=>{ e.preventDefault(); const v=document.getElementById('newsletterEmail').value.trim(); if(!v||!v.includes('@')){showToast('Enter a valid email.','info');return;} showToast('Subscribed! Welcome 🎉','success'); nf.reset(); });

    // ── TOAST ──
    function showToast(msg,type='info'){ const c=document.getElementById('toast-container'),t=document.createElement('div'); t.className=`toast ${type}`; t.textContent=msg; c.appendChild(t); setTimeout(()=>{ t.style.transition='.3s ease'; t.style.opacity='0'; t.style.transform='translateX(40px)'; setTimeout(()=>t.remove(),350); },3000); }

});
