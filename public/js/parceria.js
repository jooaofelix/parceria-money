(function(){
  var BRL0 = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
  var sCli=document.getElementById('s-cli'), sHon=document.getElementById('s-hon');
  var segBtns=[].slice.call(document.querySelectorAll('.seg button')), pct=0.20;
  var rdCli=document.getElementById('rd-cli'), rdHon=document.getElementById('rd-hon');
  var rMonth=document.getElementById('r-month'), rYear=document.getElementById('r-year'), rNote=document.getElementById('r-note');

  function fill(el){var mn=+el.min,mx=+el.max,v=+el.value;el.style.setProperty('--fill',((v-mn)/(mx-mn)*100)+'%');}
  function animate(el,to){var from=el._cur||0,start=performance.now(),dur=420;
    function tick(now){var t=Math.min(1,(now-start)/dur),e=1-Math.pow(1-t,3),val=Math.round((from+(to-from)*e)/100)*100;
      el.textContent=BRL0.format(val);if(t<1)requestAnimationFrame(tick);else{el.textContent=BRL0.format(to);el._cur=to;}}
    requestAnimationFrame(tick);}
  function update(anim){var cli=+sCli.value,hon=+sHon.value,gross=cli*hon,month=Math.round(gross*pct);
    rdCli.textContent=cli+(cli===1?' cliente':' clientes');rdHon.textContent=BRL0.format(hon);
    if(anim)animate(rMonth,month);else{rMonth.textContent=BRL0.format(month);rMonth._cur=month;}
    rYear.textContent=BRL0.format(month*12);
    rNote.textContent='Sobre '+BRL0.format(gross)+' em honorários gerados pela sua indicação, a '+Math.round(pct*100)+'% de comissão. Você não executa nada técnico — só mantém o relacionamento.';
    fill(sCli);fill(sHon);}
  sCli.addEventListener('input',function(){update(false)});
  sHon.addEventListener('input',function(){update(false)});
  segBtns.forEach(function(b){b.addEventListener('click',function(){segBtns.forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');pct=+b.dataset.pct;update(true);});});
  update(false);

  // blueprint grid inside the invite overlay
  var cv=document.getElementById('grid');
  if(cv){var ctx=cv.getContext('2d'),W,H,dpr;
    function resize(){dpr=Math.min(window.devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
    function draw(){ctx.clearRect(0,0,W,H);ctx.strokeStyle='rgba(140,195,245,.10)';ctx.lineWidth=1;var g=46;
      for(var x=0;x<W;x+=g){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(var y=0;y<H;y+=g){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}}
    window.addEventListener('resize',resize);resize();}

  // ---- invite overlay: open on load, close on CTA / × / backdrop / Esc ----
  var invite=document.getElementById('invite');
  if(invite){
    var closeBtn=document.getElementById('inviteClose');
    var openBtn=document.getElementById('inviteOpenBtn');
    var html=document.documentElement;
    var closeTimer=null;

    function lockScroll(on){ html.classList.toggle('invite-lock', on); }

    function openInvite(){
      invite.classList.remove('is-closing');
      invite.classList.add('is-open');
      lockScroll(true);
    }
    function closeInvite(afterClose){
      if(invite.classList.contains('is-closed')) { if(afterClose) afterClose(); return; }
      invite.classList.add('is-closing');
      lockScroll(false);
      clearTimeout(closeTimer);
      closeTimer=setTimeout(function(){
        invite.classList.add('is-closed');
        if(typeof updateNavTheme === 'function') updateNavTheme();
        if(afterClose) afterClose();
      }, 480);
    }

    closeBtn.addEventListener('click', function(){ closeInvite(); });
    invite.addEventListener('click', function(e){ if(e.target===invite) closeInvite(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeInvite(); });
    openBtn.addEventListener('click', function(e){
      e.preventDefault();
      closeInvite(function(){
        var t=document.getElementById('intro');
        if(t) t.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });

    // Quem chega por um link com âncora (…/#comecar) veio atrás de uma seção
    // específica: abrir o convite por cima seria um obstáculo, e pior, o
    // travamento de scroll do overlay impediria a página de pular até ela.
    // Isso acontece de verdade porque os botões internos usam a URL absoluta:
    // quando o endereço atual não bate exatamente com ela — /index.html, um
    // domínio próprio, um ?utm_source= de campanha — o clique recarrega o
    // documento em vez de só rolar, e a página volta do zero com a âncora.
    if(location.hash){
      invite.classList.add('is-closed');
    } else {
      requestAnimationFrame(function(){ requestAnimationFrame(openInvite); });
    }
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- barra do topo adapta cor: clara sobre seção clara, escura sobre seção navy ----
  var navEl = document.querySelector('.brandbar');
  var navTicking = false;
  function updateNavTheme(){
    if(!navEl) return;
    navTicking = false;
    var rect = navEl.getBoundingClientRect();
    var probeY = rect.bottom + 2;
    var el = document.elementFromPoint(window.innerWidth / 2, probeY);
    var sec = el ? el.closest('section[data-nav]') : null;
    navEl.classList.toggle('on-dark', !!(sec && sec.dataset.nav === 'dark'));
  }
  if(navEl){
    window.addEventListener('scroll', function(){
      if(!navTicking){ navTicking = true; requestAnimationFrame(updateNavTheme); }
    }, {passive:true});
    window.addEventListener('resize', updateNavTheme);
    updateNavTheme();
  }

  // ---- reveal ao rolar: painéis, passos, cards, stats, faq ----
  var revealEls = [].slice.call(document.querySelectorAll('.reveal-up'));
  if(revealEls.length){
    if(!reduceMotion && 'IntersectionObserver' in window){
      var revealIo = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('in-view');
            revealIo.unobserve(entry.target);
          }
        });
      }, {threshold:0.2, rootMargin:'0px 0px -6% 0px'});
      revealEls.forEach(function(el){ revealIo.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add('in-view'); });
    }
  }

  // ---- números da seção "Os números que importam" contando ao entrar em tela ----
  var nums = [].slice.call(document.querySelectorAll('.stat .num'));
  if(nums.length){
    if(reduceMotion){
      nums.forEach(function(el){ el.textContent = el.dataset.target; });
    } else if('IntersectionObserver' in window){
      var countIo = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var el = entry.target, target = parseInt(el.dataset.target, 10), start = performance.now(), dur = 900;
            (function tick(now){
              var t = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - t, 3);
              el.textContent = Math.round(target * e);
              if(t < 1) requestAnimationFrame(tick); else el.textContent = target;
            })(performance.now());
            countIo.unobserve(el);
          }
        });
      }, {threshold:0.6});
      nums.forEach(function(el){ countIo.observe(el); });
    } else {
      nums.forEach(function(el){ el.textContent = el.dataset.target; });
    }
  }
})();
