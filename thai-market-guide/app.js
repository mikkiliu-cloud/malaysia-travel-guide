/* ===== 共享脚本：导航 / 卡片渲染 / 筛选 / 收藏 ===== */
document.addEventListener('DOMContentLoaded', function () {
try {
  const budgetByCat = { weekend:2, night:1, floating:2, railway:1, creative:2, walking:1, food:1, indoor:2, local:1 };
  const budgetIcon = ['', '💰', '💰💰', '💰💰💰'];
  const budgetLabel = ['', '经济', '中等', '高端'];

  // ---- 收藏（全站共享）----
  let favs = [];
  try { favs = JSON.parse(localStorage.getItem('my-thai-market-favs') || '[]'); } catch (e) {}
  const saveFavs = () => { try { localStorage.setItem('my-thai-market-favs', JSON.stringify(favs)); } catch (e) {} };
  const idOf = (m) => m.city + '-' + m.en.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();

  // ---- 顶部导航（所有页面通用）----
  const nav = document.getElementById('topnav');
  if (nav) {
    const current = document.body.dataset.page || '';
    let html = '<a class="brand" href="index.html">BAZAAR · TH</a>';
    html += '<a class="nav-link' + (current === 'home' ? ' active' : '') + '" href="index.html">首页</a>';
    THAI_CITIES.forEach(c => {
      const active = current === c.key ? ' active' : '';
      html += '<a class="nav-link' + active + '" href="' + c.key + '.html">' + c.cn + '</a>';
    });
    nav.innerHTML = html;
  }

  // ---- 页脚导航 ----
  const fnav = document.getElementById('footer-nav');
  if (fnav) {
    let html = '<a href="index.html">首页</a>';
    THAI_CITIES.forEach(c => { html += '<a href="' + c.key + '.html">' + c.cn + '</a>'; });
    fnav.innerHTML = html;
  }

  // ================= 首页 =================
  const tiles = document.getElementById('city-tiles');
  if (tiles) {
    let html = '';
    THAI_CITIES.forEach(c => {
      const count = THAI_MARKETS.filter(m => m.city === c.key).length;
      html += '<a class="city-tile" href="' + c.key + '.html" style="background-image:url(\'' + c.img + '\')">' +
        '<span class="ct-icon">' + c.icon + '</span>' +
        '<span class="ct-count">' + count + ' 个市集</span>' +
        '<div class="ct-inner">' +
          '<h3>' + c.cn + '</h3>' +
          '<div class="ct-en">' + c.en + '</div>' +
          '<div class="ct-sub">' + c.sub + '</div>' +
          '<div class="ct-go">查看市集 →</div>' +
        '</div></a>';
    });
    tiles.innerHTML = html;

    // 地图 pin 跳转到城市分页
    document.querySelectorAll('[data-city]').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.dataset.city;
        if (THAI_CITIES.some(c => c.key === key)) location.href = key + '.html';
      });
    });
    return; // 首页到此结束
  }

  // ================= 城市分页 =================
  const grid = document.getElementById('grid');
  if (!grid) return;
  const cityKey = document.body.dataset.page;
  const cityMeta = THAI_CITIES.find(c => c.key === cityKey) || {};
  const list = THAI_MARKETS.filter(m => m.city === cityKey);

  // 渲染城市 HERO
  const ph = document.querySelector('.page-hero');
  if (ph) {
    if (cityMeta.img) ph.style.backgroundImage = "url('" + cityMeta.img + "')";
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('ph-icon', cityMeta.icon || '');
    set('ph-title', cityMeta.cn || '');
    set('ph-en', cityMeta.en || '');
    set('ph-sub', cityMeta.sub || '');
  }
  const phCount = document.getElementById('ph-count');
  if (phCount) phCount.textContent = list.length + ' 个市集 · ' + list.filter(m => m.hi).length + ' 精华';
  document.title = (cityMeta.cn || '') + '市集攻略 · ' + (cityMeta.en || '') + ' · 泰国市集';

  // 渲染卡片
  grid.innerHTML = list.map(m => {
    const id = idOf(m);
    const budget = budgetByCat[m.cat] || 1;
    const isFav = favs.includes(id);
    const transportRow = '<div class="row"><span class="ic">' + (m.ico || '📍') + '</span><span>' + m.transport + '</span></div>';
    return '<div class="dest-card' + (m.hi ? ' is-highlight' : '') + '" data-id="' + id + '" data-cat="' + m.cat + '" ' +
      'data-name="' + (m.name + ' ' + m.en + ' ' + (CAT_NAMES[m.cat] || '') + ' ' + m.eat).toLowerCase() + '">' +
      '<div class="dest-img c-' + m.cat + '" style="background-image:url(\'' + m.img + '\')">' +
        '<span class="dest-type">' + (CAT_NAMES[m.cat] || '') + '</span>' +
        (m.hi ? '<span class="dest-star">★</span>' : '') +
        '<span class="dest-state">' + m.state + '</span>' +
        '<span class="budget-badge" title="' + budgetLabel[budget] + '">' + budgetIcon[budget] + '</span>' +
      '</div>' +
      '<div class="dest-body">' +
        '<h4>' + m.name +
          '<button class="fav-btn' + (isFav ? ' active' : '') + '" data-id="' + id + '" title="收藏到我的清单" ' +
          'style="color:' + (isFav ? '#d81e5b' : '#aaa') + '">' + (isFav ? '❤' : '♡') + '</button>' +
          '<span class="en">' + m.en + '</span></h4>' +
        '<p>' + m.desc + '</p>' +
        '<div class="dest-meta">' +
          '<div class="row"><span class="ic">⏰</span><span>' + m.time + '</span></div>' +
          transportRow +
          '<div class="row eat"><span class="ic">🍜</span><span><strong>必吃</strong>：' + m.eat + '</span></div>' +
          '<div class="row tip"><span class="ic">💡</span><span><strong>提示</strong>：' + m.tip + '</span></div>' +
        '</div>' +
      '</div></div>';
  }).join('');

  // 类型下拉
  const typeFilter = document.getElementById('type-filter');
  const cats = [...new Set(list.map(m => m.cat))];
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = CAT_NAMES[c]; typeFilter.appendChild(opt);
  });

  // 主题路线
  const routesWrap = document.getElementById('routes');
  const routes = (typeof CITY_ROUTES !== 'undefined' && CITY_ROUTES[cityKey]) || null;
  if (routesWrap) {
    if (routes) {
      routesWrap.querySelector('.themed-grid').innerHTML = routes.map(r =>
        '<div class="theme-card"><div class="icon">' + r.icon + '</div><h4>' + r.title + '</h4>' +
        '<div class="duration">' + r.dur + '</div><p class="route">' + r.route + '</p>' +
        '<p class="why">' + r.why + '</p></div>').join('');
    } else {
      routesWrap.style.display = 'none';
    }
  }

  // ---- 筛选 ----
  const cards = grid.querySelectorAll('.dest-card');
  const info = document.getElementById('filter-info');
  const searchInput = document.getElementById('search-input');
  const favCountEl = document.getElementById('fav-count');
  const buttons = document.querySelectorAll('.filter-btn');
  if (favCountEl) favCountEl.textContent = favs.length;
  let activeCat = 'all', favOnly = false;

  function applyAll() {
    const q = (searchInput.value || '').trim().toLowerCase();
    const type = typeFilter.value;
    let shown = 0;
    cards.forEach(card => {
      const name = card.dataset.name || '';
      let ok = true;
      if (q && !name.includes(q)) ok = false;
      if (type !== 'all' && card.dataset.cat !== type) ok = false;
      if (activeCat === 'highlight' && !card.classList.contains('is-highlight')) ok = false;
      if (favOnly && !favs.includes(card.dataset.id)) ok = false;
      card.classList.toggle('hide', !ok);
      if (ok) shown++;
    });
    let old = grid.querySelector('.no-result');
    if (shown === 0) {
      if (!old) { old = document.createElement('div'); old.className = 'no-result'; grid.appendChild(old); }
      old.textContent = favOnly ? '「我的清单」里还没有本城市集，点 ♡ 收藏吧。' : '没有符合条件的市集。';
    } else if (old) { old.remove(); }
    info.textContent = favOnly ? ('我的清单 · ' + shown + ' 个') : (shown === cards.length ? ('共 ' + shown + ' 个市集') : ('显示 ' + shown + ' 个市集'));
  }

  // 收藏按钮
  grid.addEventListener('click', (e) => {
    const fb = e.target.closest('.fav-btn');
    if (!fb) return;
    e.preventDefault(); e.stopPropagation();
    const id = fb.dataset.id;
    const idx = favs.indexOf(id);
    if (idx > -1) { favs.splice(idx, 1); fb.textContent = '♡'; fb.style.color = '#aaa'; fb.classList.remove('active'); }
    else { favs.push(id); fb.textContent = '❤'; fb.style.color = '#d81e5b'; fb.classList.add('active'); }
    saveFavs();
    if (favCountEl) favCountEl.textContent = favs.length;
    applyAll();
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.fav) { favOnly = !favOnly; btn.classList.toggle('active', favOnly); }
      else {
        activeCat = btn.dataset.cat;
        buttons.forEach(b => { if (!b.dataset.fav) b.classList.remove('active'); });
        btn.classList.add('active');
      }
      applyAll();
    });
  });
  searchInput.addEventListener('input', applyAll);
  typeFilter.addEventListener('change', applyAll);
  applyAll();

} catch (e) { console.error('app init error', e); }
});
