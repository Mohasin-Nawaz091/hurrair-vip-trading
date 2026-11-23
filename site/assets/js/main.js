(function(){
  var C = window.HURRAIR_CONFIG || {}, d = document;

  /* ── Google Search Console Verification Injection ── */
  if (C.gscVerification) {
    var gscMeta = d.createElement('meta');
    gscMeta.name = 'google-site-verification';
    gscMeta.content = C.gscVerification;
    d.head.appendChild(gscMeta);
  }

  /* ── Google Analytics 4 / Tag Manager Loader ── */
  if (C.gaMeasurementId && !window.gtag) {
    var gaScript = d.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(C.gaMeasurementId);
    d.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', C.gaMeasurementId);
  }

  /* ── Lightweight Event Tracking Helper ── */
  function trackEvent(name, params) {
    params = params || {};
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    } else if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      window.dataLayer.push(Object.assign({ event: name }, params));
    }
  }
  window.hurrairTrackEvent = trackEvent;

  /* ── APK links & Event Tracking ── */
  var apkUrl = C.apkUrl || '/apk/hurrair-vip-trading.apk';
  var apkFilename = C.apkFilename || 'Hurrair-VIP-Trading.apk';
  d.querySelectorAll('[data-apk]').forEach(function(a){
    a.href = apkUrl;
    a.setAttribute('download', apkFilename);
    a.removeAttribute('target');

    a.addEventListener('click', function(){
      trackEvent('apk_download_click', {
        version: C.apkVersion || '1.0.0',
        page: location.pathname
      });
    });
  });

  /* ── VIP / Membership CTAs ── */
  d.querySelectorAll('a[href*="#vip-access"], a[href*="#vip-showcase"]').forEach(function(a){
    a.addEventListener('click', function(){
      trackEvent('vip_access_click', {
        text: (a.textContent || '').trim().slice(0, 30),
        page: location.pathname
      });
    });
  });

  /* ── Google Play Coming Soon Click Tracking ── */
  d.querySelectorAll('.dl-card.soon, .btn-ghost.disabled').forEach(function(el){
    el.addEventListener('click', function(){
      trackEvent('google_play_coming_soon_click', {
        status: 'coming_soon',
        page: location.pathname
      });
    });
  });

  /* ── FAQ Accordion Tracking ── */
  d.querySelectorAll('.faq-item').forEach(function(detail){
    detail.addEventListener('toggle', function(){
      if (detail.open) {
        var summary = detail.querySelector('summary');
        trackEvent('faq_expand', {
          question: summary ? (summary.textContent || '').trim().slice(0, 50) : 'FAQ Item'
        });
      }
    });
  });

  /* ── APK meta rows ── */
  var rows = [
    ['Version', C.apkVersion || '1.0.0'],
    ['File Size', C.apkSize || '76.2 MB'],
    ['Last Updated', C.apkUpdated || 'November 2026'],
    ['Requirements', C.apkRequirements || 'Android 8.0+ (Oreo or later)']
  ].filter(function(r){ return r[1]; });

  d.querySelectorAll('[data-apk-meta]').forEach(function(ul){
    ul.innerHTML = rows.map(function(r){
      return '<li><span>' + r[0] + '</span><b>' + r[1] + '</b></li>';
    }).join('');
  });

  /* ── Support link ── */
  d.querySelectorAll('[data-support-link]').forEach(function(a){
    if (C.supportEmail) {
      a.href = 'mailto:' + C.supportEmail;
      a.textContent = C.supportEmail;
    } else {
      a.removeAttribute('href');
      a.textContent = 'Support contact available in the app';
    }
  });

  /* ── Legal dates ── */
  d.querySelectorAll('[data-legal-date]').forEach(function(s){
    s.textContent = C.legalUpdated || '';
  });

  /* ── Year ── */
  var y = d.getElementById('yr');
  if (y) y.textContent = new Date().getFullYear();

  /* ── Theme toggle ── */
  function setTheme(theme) {
    if (theme === 'light') {
      d.documentElement.setAttribute('data-theme', 'light');
    } else {
      d.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('hurrair-theme', theme);
    } catch(err) {}

    trackEvent('theme_toggle', { theme: theme });
  }

  d.querySelectorAll('#theme-toggle, .theme-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var isLight = d.documentElement.getAttribute('data-theme') === 'light';
      setTheme(isLight ? 'dark' : 'light');
    });
  });

  /* ── Mobile menu ── */
  var b = d.getElementById('burger'), m = d.getElementById('menu');
  function setMenu(o){
    m.classList.toggle('open', o);
    b.setAttribute('aria-expanded', String(o));
    d.body.classList.toggle('lock', o);
  }
  if (b && m) {
    b.addEventListener('click', function(){ setMenu(!m.classList.contains('open')); });
    m.addEventListener('click', function(e){ if (e.target.tagName === 'A') setMenu(false); });
    d.addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });
  }

  /* ── Active nav link ── */
  var path = location.pathname.replace(/\/$/, '');
  d.querySelectorAll('#menu a').forEach(function(a){
    var href = a.getAttribute('href').replace(/\/$/, '');
    if (href === path || (path === '' && href === '/')) a.classList.add('active');
  });

  /* ── Scroll reveal ── */
  var revEls = d.querySelectorAll('.reveal:not(.in)');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
    revEls.forEach(function(el){ io.observe(el); });
  } else {
    revEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ── Toast ── */
  function toast(t){
    var n = d.createElement('div');
    n.className = 'toast';
    n.textContent = t;
    d.body.appendChild(n);
    setTimeout(function(){ n.remove(); }, 3200);
  }
})();
