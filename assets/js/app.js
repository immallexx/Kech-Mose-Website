(function(){
  "use strict";
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
  if(isTouch) document.body.classList.add('touch');

  function splitWords(el){
    var text = el.textContent;
    el.innerHTML='';
    text.split(/(\s+)/).forEach(function(part){
      if(/^\s+$/.test(part)){ el.appendChild(document.createTextNode(' ')); return; }
      var w=document.createElement('span'); w.className='w';
      var i=document.createElement('span'); i.className='wi'; i.textContent=part;
      w.appendChild(i); el.appendChild(w);
    });
    return el.querySelectorAll('.wi');
  }

  /* LENIS */
  var lenis=null;
  if(window.Lenis && !reduce && !isTouch){
    lenis=new Lenis({duration:1.1, easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t));}, smoothWheel:true});
    function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if(hasGSAP){ lenis.on('scroll', ScrollTrigger.update); }
  }
  function scrollTo(target){
    var el=document.querySelector(target); if(!el) return;
    if(lenis){ lenis.scrollTo(el,{offset:0}); } else { el.scrollIntoView({behavior:reduce?'auto':'smooth'}); }
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var href=a.getAttribute('href');
      if(href.length>1 && document.querySelector(href)){
        e.preventDefault(); closeMenu(); scrollTo(href);
        var t=document.querySelector(href); if(t && t.hasAttribute('tabindex')) t.focus({preventScroll:true});
      }
    });
  });

  /* PRELOADER (only if present, i.e. home) */
  var pre=document.getElementById('pre');
  function startSite(){ buildReveals(); initHero3D(); }
  if(pre && hasGSAP && !reduce){
    var preBar=document.getElementById('preBar'), preNum=document.getElementById('preNum');
    var o={v:0};
    if(lenis) lenis.stop();
    gsap.to(o,{v:100,duration:1.4,ease:'power2.inOut',
      onUpdate:function(){ var n=Math.round(o.v); if(preNum)preNum.textContent=n; if(preBar)preBar.style.width=n+'%'; },
      onComplete:function(){
        gsap.to(pre,{yPercent:-100,duration:0.9,ease:'power3.inOut',delay:0.12,
          onComplete:function(){ pre.style.display='none'; if(lenis) lenis.start(); }});
        startSite(); heroIntro();
      }});
  } else {
    if(pre) pre.style.display='none';
    startSite();
    if(hasGSAP && !reduce) heroIntro();
  }

  function heroIntro(){
    if(!hasGSAP||reduce) return;
    var hero=document.querySelector('.hero'); if(!hero) return;
    var tl=gsap.timeline({delay:0.45});
    hero.querySelectorAll('[data-split]').forEach(function(h){
      var wis=splitWords(h);
      tl.from(wis,{yPercent:115,duration:1,ease:'power4.out',stagger:0.06},'<0.06');
    });
    tl.from('.hero .eyebrow',{y:20,opacity:0,duration:0.8,ease:'power3.out'},0.15);
    tl.from('.hero__sub',{y:24,opacity:0,duration:0.8,ease:'power3.out'},'-=0.6');
    tl.from('.hero__cta',{y:24,opacity:0,duration:0.8,ease:'power3.out'},'-=0.6');
    tl.from('.hero__scroll',{opacity:0,duration:0.8},'-=0.4');
  }

  function buildReveals(){
    /* release the anti-flicker hide *before* GSAP reads each element's natural opacity as its
       animation target — otherwise from({opacity:0}) would capture the hidden state and animate 0→0 */
    document.documentElement.classList.remove('anim');
    if(!hasGSAP||reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('[data-split]').forEach(function(h){
      if(h.closest('.hero')) return;
      var wis=splitWords(h);
      gsap.from(wis,{yPercent:115,duration:0.9,ease:'power4.out',stagger:0.04,
        scrollTrigger:{trigger:h,start:'top 90%'}});
    });
    gsap.utils.toArray('[data-reveal]').forEach(function(el){
      gsap.from(el,{y:34,opacity:0,duration:0.9,ease:'power3.out',
        scrollTrigger:{trigger:el,start:'top 92%'}});
    });
    gsap.utils.toArray('[data-img]').forEach(function(el){
      gsap.fromTo(el,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:1.2,ease:'power3.inOut',
        scrollTrigger:{trigger:el,start:'top 88%'}});
    });
    gsap.utils.toArray('[data-parallax]').forEach(function(el){
      var sp=parseFloat(el.getAttribute('data-speed'))||-0.1;
      gsap.to(el,{yPercent:sp*100,ease:'none',
        scrollTrigger:{trigger:el.closest('section')||el,start:'top bottom',end:'bottom top',scrub:true}});
    });
    gsap.utils.toArray('[data-count]').forEach(function(el){
      var end=+el.getAttribute('data-count'), o={v:0};
      gsap.to(o,{v:end,duration:1.6,ease:'power2.out',snap:{v:1},
        scrollTrigger:{trigger:el,start:'top 94%'},
        onUpdate:function(){ el.textContent=(end>=10?'':'0')+Math.round(o.v); }});
    });
    if(document.getElementById('heroBg'))
      gsap.to('#heroBg',{yPercent:18,scale:1.08,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    if(document.getElementById('pheroBg'))
      gsap.to('#pheroBg',{yPercent:16,ease:'none',scrollTrigger:{trigger:'.phero',start:'top top',end:'bottom top',scrub:true}});
    if(document.getElementById('ctaBg'))
      gsap.to('#ctaBg',{yPercent:14,ease:'none',scrollTrigger:{trigger:'.cta',start:'top bottom',end:'bottom top',scrub:true}});
    if(document.getElementById('marq'))
      gsap.to('#marq',{xPercent:-50,duration:24,ease:'none',repeat:-1});
    ScrollTrigger.refresh();
  }

  /* NAV */
  var nav=document.getElementById('nav'), lastY=0, forceSolid=nav&&nav.classList.contains('solid');
  function onScroll(y){
    if(!nav) return;
    if(!forceSolid){ if(y>40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled'); }
    if(y>lastY && y>500) nav.classList.add('hide'); else nav.classList.remove('hide');
    lastY=y;
  }
  if(lenis){ lenis.on('scroll',function(e){ onScroll(e.scroll); }); }
  else { window.addEventListener('scroll',function(){ onScroll(window.scrollY); },{passive:true}); }

  /* MENU */
  var burger=document.getElementById('burger'), menu=document.getElementById('menu'), menuOpen=false;
  if(menu) menu.inert=true; /* keep menu links out of the tab order while closed */
  if(burger){ burger.setAttribute('aria-controls','menu'); burger.setAttribute('aria-expanded','false'); }
  function openMenu(){
    if(menuOpen) return; menuOpen=true;
    if(burger){ burger.classList.add('open'); burger.setAttribute('aria-expanded','true'); }
    if(menu){ menu.inert=false; menu.classList.add('open'); }
    document.body.classList.add('lock'); if(lenis) lenis.stop();
    var first=menu&&menu.querySelector('a'); if(first) first.focus();
  }
  function closeMenu(){
    if(!menuOpen) return; menuOpen=false;
    if(burger){ burger.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }
    if(menu){ menu.classList.remove('open'); menu.inert=true; }
    document.body.classList.remove('lock'); if(lenis) lenis.start();
    if(burger) burger.focus();
  }
  if(burger){
    burger.addEventListener('click',function(){ menuOpen?closeMenu():openMenu(); });
  }
  document.addEventListener('keydown',function(e){ if((e.key==='Escape'||e.key==='Esc') && menuOpen) closeMenu(); });

  /* CURSOR */
  if(!isTouch){
    var cur=document.querySelector('.cur'), curD=document.querySelector('.cur-d');
    if(cur&&curD){
      var cx=0,cy=0,tx=0,ty=0;
      window.addEventListener('mousemove',function(e){ tx=e.clientX; ty=e.clientY; curD.style.transform='translate('+tx+'px,'+ty+'px) translate(-50%,-50%)'; });
      (function tick(){ cx+=(tx-cx)*0.18; cy+=(ty-cy)*0.18; cur.style.transform='translate('+cx+'px,'+cy+'px) translate(-50%,-50%)'; requestAnimationFrame(tick); })();
      document.querySelectorAll('a,button,[data-mag]').forEach(function(el){
        el.addEventListener('mouseenter',function(){ cur.classList.add('grow'); });
        el.addEventListener('mouseleave',function(){ cur.classList.remove('grow'); });
      });
    }
  }

  /* MAGNETIC */
  if(!isTouch && hasGSAP){
    document.querySelectorAll('[data-mag]').forEach(function(el){
      el.addEventListener('mousemove',function(e){
        var r=el.getBoundingClientRect();
        gsap.to(el,{x:(e.clientX-(r.left+r.width/2))*0.3,y:(e.clientY-(r.top+r.height/2))*0.4,duration:0.5,ease:'power3.out'});
      });
      el.addEventListener('mouseleave',function(){ gsap.to(el,{x:0,y:0,duration:0.6,ease:'elastic.out(1,0.4)'}); });
    });
  }

  /* THREE.JS HERO — 3D blueprint: a wireframe building massing on a receding site grid,
     on a slow turntable you steer with the mouse. Skipped on reduced-motion or no-WebGL. */
  function initHero3D(){
    var canvas=document.getElementById('hero-canvas');
    if(!canvas || !window.THREE || reduce) return;
    var renderer;
    try{ renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true}); }catch(e){ return; }
    var mobile=window.matchMedia('(max-width:768px)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile?1.5:2));
    var w=window.innerWidth,h=window.innerHeight; renderer.setSize(w,h);
    var scene=new THREE.Scene(); scene.fog=new THREE.FogExp2(0x0d2626,0.03);
    var camera=new THREE.PerspectiveCamera(56,w/h,0.1,200); camera.position.set(0,7,22);

    var world=new THREE.Group(); scene.add(world);

    /* receding site grid (the "plan") + a finer near grid for depth */
    var grid=new THREE.GridHelper(140,70,0x6fb9ad,0x447871);
    grid.material.transparent=true; grid.material.opacity=0.20; world.add(grid);
    var grid2=new THREE.GridHelper(44,44,0x6fb9ad,0x6fb9ad);
    grid2.material.transparent=true; grid2.material.opacity=0.08; world.add(grid2);

    /* wireframe building massing — [x, z, width, height, depth] */
    var edgeBright=new THREE.LineBasicMaterial({color:0x6fb9ad,transparent:true,opacity:0.62});
    var edgeSoft=new THREE.LineBasicMaterial({color:0x6fb9ad,transparent:true,opacity:0.30});
    var specs=[[0,0,4,13,4],[6,-2,3,5,3],[-6,2,3.5,8,3.5],[-2,-7,5,4,4],
               [8,5,3,7,3],[-8,-4,3,6,3.5],[2,7,4,5.5,4],[-9,7,3,4,3]];
    for(var i=0;i<specs.length;i++){
      var s=specs[i];
      var line=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(s[2],s[3],s[4])), (i%3===0)?edgeBright:edgeSoft);
      line.position.set(s[0], s[3]/2, s[1]);
      world.add(line);
    }

    var mx=0,my=0,tmx=0,tmy=0;
    window.addEventListener('mousemove',function(e){ mx=(e.clientX/window.innerWidth-0.5); my=(e.clientY/window.innerHeight-0.5); });
    window.addEventListener('resize',function(){ w=window.innerWidth; h=window.innerHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); });

    var clock=new THREE.Clock();
    function loop(){
      requestAnimationFrame(loop);
      var t=clock.getElapsedTime();
      tmx+=(mx-tmx)*0.05; tmy+=(my-tmy)*0.05;
      world.rotation.y=t*0.035 + tmx*0.7;                 /* slow turntable, steered by the mouse */
      camera.position.x=tmx*2;                             /* slight parallax */
      camera.position.y=7 - tmy*4;                         /* vertical tilt with the mouse */
      camera.lookAt(0,3,0);
      renderer.render(scene,camera);
    }
    loop();
  }

  /* CONTACT FORM (only if present) */
  var form=document.getElementById('enquiry');
  if(form){
    var note=form.querySelector('.note');
    var defaultNote=note?note.textContent:'';
    var endpoint=form.getAttribute('action')||'';
    var configured=endpoint.indexOf('formspree.io/f/')!==-1 && endpoint.indexOf('your-form-id')===-1;
    function setNote(msg,kind){ if(!note) return; note.textContent=msg; note.className='note'+(kind?' '+kind:''); }
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      var btn=form.querySelector('button[type=submit]');
      var data=new FormData(form);
      /* No email service connected yet — fall back to the visitor's mail app. */
      if(!configured){
        var body='Name: '+(data.get('name')||'')+'\nPhone: '+(data.get('phone')||'')+'\nEmail: '+(data.get('email')||'')+'\n\n'+(data.get('message')||'');
        window.location.href='mailto:kechmose@gmail.com?subject='+encodeURIComponent('Website enquiry')+'&body='+encodeURIComponent(body);
        setNote('Opening your email app… if nothing happens, write to kechmose@gmail.com directly.');
        return;
      }
      setNote('Sending…'); if(btn) btn.disabled=true;
      fetch(endpoint,{method:'POST',body:data,headers:{'Accept':'application/json'}})
        .then(function(r){
          if(r.ok){ form.reset(); setNote('Thanks — your enquiry has been sent. We typically respond within one business day.','ok'); }
          else { return r.json().then(function(d){ throw new Error((d&&d.errors&&d.errors[0]&&d.errors[0].message)||'Something went wrong.'); }); }
        })
        .catch(function(err){ setNote((err&&err.message)||'Network error — please email kechmose@gmail.com directly.','err'); })
        .then(function(){ if(btn) btn.disabled=false; });
    });
  }

  /* SUB-PAGE HERO BLUEPRINT GRID (only if present) — a drafting grid + drifting survey guides;
     an architectural motif that makes the brand's "we show our workings" promise visual. */
  var pcv=document.getElementById('phero-canvas');
  if(pcv && pcv.getContext){
    var pctx=pcv.getContext('2d');
    var phero=(pcv.closest && (pcv.closest('.phero')||pcv.parentNode)) || pcv.parentNode;
    var dpr=Math.min(window.devicePixelRatio||1,2);
    var pw=0, ph=0, minor=44, major=176, intro=0;
    var gx=0, gy=0, gvx=0.35, gvy=0.22; /* drifting plumb/level guide */
    var grid=document.createElement('canvas'), gctx=grid.getContext('2d');

    function buildGrid(){ /* render the static drafting grid once per resize, into an offscreen buffer */
      grid.width=Math.round(pw*dpr); grid.height=Math.round(ph*dpr);
      gctx.setTransform(dpr,0,0,dpr,0,0); gctx.clearRect(0,0,pw,ph);
      var x,y;
      gctx.lineWidth=1;
      gctx.strokeStyle='rgba(111,185,173,0.09)'; gctx.beginPath();      /* fine grid */
      for(x=0;x<=pw;x+=minor){ gctx.moveTo(x+0.5,0); gctx.lineTo(x+0.5,ph); }
      for(y=0;y<=ph;y+=minor){ gctx.moveTo(0,y+0.5); gctx.lineTo(pw,y+0.5); }
      gctx.stroke();
      gctx.strokeStyle='rgba(111,185,173,0.18)'; gctx.beginPath();      /* major lines */
      for(x=0;x<=pw;x+=major){ gctx.moveTo(x+0.5,0); gctx.lineTo(x+0.5,ph); }
      for(y=0;y<=ph;y+=major){ gctx.moveTo(0,y+0.5); gctx.lineTo(pw,y+0.5); }
      gctx.stroke();
      gctx.strokeStyle='rgba(111,185,173,0.24)'; gctx.beginPath();      /* ruler ticks, top + left edges */
      for(x=0;x<=pw;x+=minor){ gctx.moveTo(x+0.5,0); gctx.lineTo(x+0.5,(x%major===0)?12:6); }
      for(y=0;y<=ph;y+=minor){ gctx.moveTo(0,y+0.5); gctx.lineTo((y%major===0)?12:6,y+0.5); }
      gctx.stroke();
      gctx.strokeStyle='rgba(111,185,173,0.20)'; gctx.beginPath();      /* plus marks at major intersections */
      for(x=major;x<pw;x+=major){ for(y=major;y<ph;y+=major){ gctx.moveTo(x-4,y+0.5); gctx.lineTo(x+4,y+0.5); gctx.moveTo(x+0.5,y-4); gctx.lineTo(x+0.5,y+4); } }
      gctx.stroke();
    }
    function sizeHero(){
      pw=phero.clientWidth; ph=phero.clientHeight;
      pcv.width=Math.round(pw*dpr); pcv.height=Math.round(ph*dpr);
      pctx.setTransform(dpr,0,0,dpr,0,0);
      minor=Math.max(34,Math.round(pw/30)); major=minor*4;
      gx=pw*0.62; gy=ph*0.42;
      buildGrid();
    }
    function drawGuides(){ /* drifting plumb (vertical) + level (horizontal) with a crosshair marker */
      pctx.save();
      pctx.strokeStyle='rgba(111,185,173,0.30)'; pctx.lineWidth=1; pctx.setLineDash([1,5]);
      pctx.beginPath(); pctx.moveTo(Math.round(gx)+0.5,0); pctx.lineTo(Math.round(gx)+0.5,ph); pctx.stroke();
      pctx.beginPath(); pctx.moveTo(0,Math.round(gy)+0.5); pctx.lineTo(pw,Math.round(gy)+0.5); pctx.stroke();
      pctx.setLineDash([]);
      pctx.strokeStyle='rgba(111,185,173,0.85)';
      pctx.beginPath(); pctx.arc(gx,gy,4,0,6.2832); pctx.stroke();
      pctx.fillStyle='rgba(111,185,173,0.9)';
      pctx.beginPath(); pctx.arc(gx,gy,1.4,0,6.2832); pctx.fill();
      pctx.restore();
    }
    function render(reveal){
      pctx.clearRect(0,0,pw,ph);
      var w = reveal>=1 ? pw : pw*reveal; /* left-to-right draw-in on load */
      if(w>0){
        pctx.save();
        pctx.beginPath(); pctx.rect(0,0,w,ph); pctx.clip();
        pctx.drawImage(grid,0,0,grid.width,grid.height,0,0,pw,ph);
        pctx.restore();
      }
      if(reveal>=0.6) drawGuides();
    }
    function stepHero(){
      if(intro<1) intro=Math.min(1,intro+0.025);
      gx+=gvx; gy+=gvy;
      if(gx<pw*0.08||gx>pw*0.92) gvx=-gvx;
      if(gy<ph*0.12||gy>ph*0.88) gvy=-gvy;
      render(1-Math.pow(1-intro,3)); /* easeOutCubic reveal */
      requestAnimationFrame(stepHero);
    }
    sizeHero();
    if(reduce){ intro=1; render(1); } else { requestAnimationFrame(stepHero); }
    var pheroRT;
    window.addEventListener('resize',function(){ clearTimeout(pheroRT); pheroRT=setTimeout(function(){ sizeHero(); if(reduce) render(1); },200); });
  }
})();
