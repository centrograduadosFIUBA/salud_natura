let hierbas = [];
let jugos = [];
let infusiones = [];
let current = 0;
let abierto = false;

function abrirLibro(idx){
  document.getElementById('cover').classList.add('open');
  document.getElementById('pages').classList.add('visible');
  document.getElementById('navBar').classList.add('visible');
  abierto = true;
  if(idx !== undefined && idx >= 0){
    mostrarPlanta(idx);
  } else {
    mostrarIndice();
  }
}

function cerrarLibro(){
  document.getElementById('cover').classList.remove('open');
  document.getElementById('pages').classList.remove('visible');
  document.getElementById('navBar').classList.remove('visible');
  abierto = false;
}

function _ocultarVistas(){
  document.getElementById('indexView').classList.remove('visible');
  document.getElementById('fuentesView').classList.remove('visible');
  document.getElementById('plantView').classList.add('hidden');
  document.getElementById('jugoView').classList.add('hidden');
  document.getElementById('infusionView').classList.add('hidden');
  document.getElementById('btnPrev').style.display = 'none';
  document.getElementById('btnNext').style.display = 'none';
  document.getElementById('navCounter').style.display = 'none';
  document.getElementById('loteIndicator').style.display = 'none';
}

function mostrarIndice(){
  _ocultarVistas();
  document.getElementById('indexView').classList.add('visible');
  document.getElementById('btnIdx').classList.remove('visible');
  idxRenderLista(hierbas, 'Todas las plantas');
}

function mostrarFuentes(){
  _ocultarVistas();
  document.getElementById('fuentesView').classList.add('visible');
  // Recopilar todas las fuentes únicas de todas las plantas
  const set = new Set();
  hierbas.forEach(h => {
    if(!h.fuentes) return;
    h.fuentes.split(/[;\n]/).forEach(f => {
      const t = f.trim();
      if(t) set.add(t);
    });
  });
  const lista = document.getElementById('fuentesList');
  lista.innerHTML = [...set].sort().map(f => `<li>${f}</li>`).join('');
}

function cerrarFuentes(){
  mostrarPlanta(current);
}

/* ── JUGOS INLINE ── */

function getJugoParaHierba(idRemedio){
  return jugos.find(j => j.id_remedio === idRemedio);
}

function renderJugoInline(j){
  const img = j.foto_url || '';
  return `<div class="jugo-inline">
    <button class="jugo-toggle-btn" onclick="toggleJugoPanel(this)">
      <span>🍹 &nbsp;Elixir herbal &middot; ${j.tag}</span><span>▾</span>
    </button>
    <div class="jugo-panel" style="display:none">
      <img class="jugo-panel-img" src="${img}" alt="${j.nombre}" onerror="this.style.display='none'"/>
      <div class="jugo-panel-body">
        <p class="jugo-panel-tag">${j.tag}</p>
        <p class="jugo-panel-nombre">${j.nombre}</p>
        <p class="jugo-panel-ayuda">${j.beneficio}</p>
        <p class="jugo-ing-title">Ingredientes</p>
        <ul class="jugo-ing-list">${j.ingredientes.map(x=>`<li>${x}</li>`).join('')}</ul>
        <button class="jugo-prep-btn" onclick="toggleJugoPrep(this)">✦ Ver preparación paso a paso</button>
        <ol class="jugo-prep-list" style="display:none">${j.pasos.map(p=>`<li>${p}</li>`).join('')}</ol>
      </div>
    </div>
  </div>`;
}

function toggleJugoPanel(btn){
  const panel = btn.nextElementSibling;
  const open = panel.style.display === 'none';
  panel.style.display = open ? 'block' : 'none';
  btn.querySelectorAll('span')[1].textContent = open ? '▴' : '▾';
}

function toggleJugoPrep(btn){
  const list = btn.nextElementSibling;
  const open = list.style.display === 'none';
  list.style.display = open ? 'block' : 'none';
  btn.textContent = open ? '✦ Ocultar preparación' : '✦ Ver preparación paso a paso';
}

function mostrarPlanta(idx){
  document.getElementById('indexView').classList.remove('visible');
  document.getElementById('fuentesView').classList.remove('visible');
  document.getElementById('plantView').classList.remove('hidden');
  document.getElementById('btnIdx').classList.add('visible');
  document.getElementById('btnFuentes').classList.add('visible');
  document.getElementById('btnPrev').style.display = '';
  document.getElementById('btnNext').style.display = '';
  document.getElementById('navCounter').style.display = '';
  document.getElementById('loteIndicator').style.display = '';
  current = idx;
  renderHierba(idx);
}

/* ── ÍNDICE: lógica ── */
function idxInit(){
  const sel = document.getElementById('idxSelDolencia');
  const todas = [...new Set(hierbas.flatMap(h=>h.dolencias))].sort();
  todas.forEach(d=>{
    const o = document.createElement('option');
    o.value = d;
    o.textContent = d.charAt(0).toUpperCase()+d.slice(1);
    sel.appendChild(o);
  });
}

function norm(s){ return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }

function idxBuscar(){
  const raw = document.getElementById('idxSearch').value.trim();
  document.getElementById('idxSelDolencia').value = '';
  document.getElementById('idxPlantWrap').classList.remove('visible');
  if(!raw){ idxRenderLista(hierbas,'Todas las plantas'); return; }
  fetch(`/api/remedios/buscar?q=${encodeURIComponent(raw)}`)
    .then(r=>r.json())
    .then(json=>{
      if(!json.ok){ idxRenderLista([],'Sin resultados'); return; }
      const nombres = json.data.map(r=>norm(r.nombre_remedio));
      const res = hierbas.filter(h=>nombres.includes(norm(h.nombre)));
      idxRenderLista(res, res.length ? `🔍 ${res.length} resultado${res.length>1?'s':''} para "${raw}"` : `Sin resultados para "${raw}"`);
    })
    .catch(()=>{
      const q = norm(raw);
      const res = hierbas.filter(h=>norm(h.nombre).includes(q)||h.props.some(p=>norm(p).includes(q)));
      idxRenderLista(res, res.length ? `🔍 ${res.length} resultado${res.length>1?'s':''} para "${raw}"` : `Sin resultados para "${raw}"`);
    });
}

function idxSeleccionarDolencia(){
  const d = document.getElementById('idxSelDolencia').value;
  document.getElementById('idxSearch').value = '';
  const wrap = document.getElementById('idxPlantWrap');
  const selP = document.getElementById('idxSelPlanta');
  if(!d){ wrap.classList.remove('visible'); idxRenderLista(hierbas,'Todas las plantas'); return; }
  const filtradas = hierbas.filter(h=>h.dolencias.includes(d));
  selP.innerHTML = '<option value="">— Elige una planta —</option>';
  filtradas.forEach(h=>{
    const o = document.createElement('option');
    o.value = hierbas.indexOf(h);
    o.textContent = h.nombre;
    selP.appendChild(o);
  });
  wrap.classList.add('visible');
  idxRenderLista(filtradas, `Plantas para: ${d}`);
}

function idxIrAPlanta(){
  const idx = parseInt(document.getElementById('idxSelPlanta').value);
  if(isNaN(idx)) return;
  mostrarPlanta(idx);
}

function idxRenderLista(lista, label){
  document.getElementById('idxResultsLabel').textContent = label;
  const ul = document.getElementById('idxPlantList');
  const noR = document.getElementById('idxNoResults');
  if(!lista.length){ ul.innerHTML=''; noR.style.display='block'; return; }
  noR.style.display='none';
  const ordenada = [...lista].sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
  ul.innerHTML = ordenada.map(h=>{
    const idx = hierbas.indexOf(h);
    return `
      <li class="idx-plant-item" onclick="mostrarPlanta(${idx})">
        <span class="idx-plant-num">${String(idx+1).padStart(2,'0')}</span>
        <span class="idx-plant-name">${h.nombre}</span>
        <span class="idx-plant-lote">${h.lote}</span>
      </li>
      <li class="idx-plant-props">${h.props.slice(0,3).join(' · ')}</li>`;
  }).join('');
}


function getInfusionParaHierba(idRemedio){
  return infusiones.find(inf => inf.id_remedio === idRemedio);
}

function renderInfusionInline(inf){
  const img = inf.foto_url || '';
  return `<div class="jugo-inline">
    <button class="jugo-toggle-btn" onclick="toggleJugoPanel(this)">
      <span>☕ &nbsp;Infusión medicinal &middot; ${inf.tag}</span><span>▾</span>
    </button>
    <div class="jugo-panel" style="display:none">
      <img class="jugo-panel-img" src="${img}" alt="${inf.nombre}" onerror="this.style.display='none'"/>
      <div class="jugo-panel-body">
        <p class="jugo-panel-tag">${inf.tag}</p>
        <p class="jugo-panel-nombre">${inf.nombre}</p>
        <p class="jugo-panel-ayuda">${inf.beneficio}</p>
        <p class="jugo-ing-title">Ingredientes</p>
        <ul class="jugo-ing-list">${inf.ingredientes.map(x=>`<li>${x}</li>`).join('')}</ul>
        <button class="jugo-prep-btn" onclick="toggleJugoPrep(this)">✦ Ver preparación paso a paso</button>
        <ol class="jugo-prep-list" style="display:none">${inf.pasos.map(p=>`<li>${p}</li>`).join('')}</ol>
      </div>
    </div>
  </div>`;
}

function initIdxInfusionesList(){
  const ul = document.getElementById('idxInfusionesList');
  if(!ul) return;
  ul.innerHTML = infusiones.map((inf,i)=>`
    <li class="idx-jugos-item" onclick="seleccionarIdxInfusion(${i})">
      <span class="idx-jugos-item-nombre">☕ ${inf.nombre}</span>
      <span class="idx-jugos-item-tag">${inf.tag}</span>
    </li>`).join('');
}

function toggleIdxInfusionesList(){
  const ul = document.getElementById('idxInfusionesList');
  const open = ul.style.display === 'none';
  ul.style.display = open ? 'block' : 'none';
  document.getElementById('idxInfusionesArrow').textContent = open ? '▴' : '▾';
}

function seleccionarIdxInfusion(i){
  document.getElementById('idxInfusionesList').style.display = 'none';
  document.getElementById('idxInfusionesArrow').textContent = '▾';
  mostrarInfusion(i);
}

function mostrarInfusion(i){
  const inf = infusiones[i];
  _ocultarVistas();
  document.getElementById('btnIdx').classList.add('visible');
  const img = inf.foto_url || '';
  document.getElementById('infusionViewImg').src = img;
  document.getElementById('infusionViewImg').style.display = 'block';
  document.getElementById('infusionViewTag').textContent = inf.tag;
  document.getElementById('infusionViewNombre').textContent = inf.nombre;
  document.getElementById('infusionViewAyuda').textContent = inf.beneficio;
  document.getElementById('infusionViewIng').innerHTML = inf.ingredientes.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('infusionViewPasos').innerHTML = inf.pasos.map(p=>`<li>${p}</li>`).join('');
  document.getElementById('infusionView').classList.remove('hidden');
}

function initIdxJugosList(){
  const ul = document.getElementById('idxJugosList');
  if(!ul) return;
  ul.innerHTML = jugos.map((j,i)=>`
    <li class="idx-jugos-item" onclick="seleccionarIdxJugo(${i})">
      <span class="idx-jugos-item-nombre">🍹 ${j.nombre}</span>
      <span class="idx-jugos-item-tag">${j.tag}</span>
    </li>`).join('');
}

function toggleIdxJugosList(){
  const ul = document.getElementById('idxJugosList');
  const open = ul.style.display === 'none';
  ul.style.display = open ? 'block' : 'none';
  document.getElementById('idxJugosArrow').textContent = open ? '▴' : '▾';
}

function seleccionarIdxJugo(i){
  document.getElementById('idxJugosList').style.display = 'none';
  document.getElementById('idxJugosArrow').textContent = '▾';
  mostrarJugo(i);
}

function mostrarJugo(i){
  const j = jugos[i];
  _ocultarVistas();
  document.getElementById('btnIdx').classList.add('visible');
  const img = j.foto_url || '';
  document.getElementById('jugoViewImg').src = img;
  document.getElementById('jugoViewImg').style.display = 'block';
  document.getElementById('jugoViewTag').textContent = j.tag;
  document.getElementById('jugoViewNombre').textContent = j.nombre;
  document.getElementById('jugoViewAyuda').textContent = j.beneficio;
  document.getElementById('jugoViewIng').innerHTML = j.ingredientes.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('jugoViewPasos').innerHTML = j.pasos.map(p=>`<li>${p}</li>`).join('');
  document.getElementById('jugoView').classList.remove('hidden');
}

// Carga de plantas desde la API — se llama al iniciar la página
const LOTE_DESC = [
  'Lote I · Hierbas suaves','Lote II · Hierbas energizantes','Lote III · Hierbas respiratorias',
  'Lote IV · Hierbas de la calma','Lote V · Hierbas depurativas','Lote VI · Hierbas femeninas',
  'Lote VII · Hierbas nootrópicas','Lote VIII · Hierbas del huerto','Lote IX · Hierbas del huerto',
  'Lote X · Hierbas del huerto'
];

function normImg(nombre){
  return nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'');
}

function mapearPlanta(p, idx){
  const loteNum  = Math.floor(idx / 3);
  const loteLabel = `Lote ${['I','II','III','IV','V','VI','VII','VIII','IX','X'][loteNum] || (loteNum+1)}`;
  const props = p.propiedades ? p.propiedades.split(',').map(s=>s.trim()).filter(Boolean) : [];
  return {
    id_remedio: p.id_remedio,
    nombre: p.nombre_remedio,
    lat:    p.planta_base || '',
    lote:   loteLabel,
    loteDesc: LOTE_DESC[loteNum] || loteLabel,
    img:    p.imagen ? `/static/img/${p.imagen}` : `/static/img/planta_default.svg`,
    props:  props,
    usos:   p.dosificacion || '',
    nota:   p.contraindicaciones || '',
    dolencias: props.map(s=>s.toLowerCase()),
    link:   p.link_articulo_web || '',
    nombres_alternativos: p.nombres_alternativos || '',
    partes_utilizadas:    p.partes_utilizadas || '',
    fuentes:              p.fuentes || ''
  };
}

async function cargarPlantas(){
  try {
    const [resP, resJ, resI] = await Promise.all([
      fetch('/api/plantas'),
      fetch('/api/jugos'),
      fetch('/api/infusiones'),
    ]);
    const [dataP, dataJ, dataI] = await Promise.all([resP.json(), resJ.json(), resI.json()]);
    if(dataP.ok && dataP.plantas.length) hierbas = dataP.plantas.map((p,i) => mapearPlanta(p, i));
    if(dataJ.ok) jugos = dataJ.data;
    if(dataI.ok) infusiones = dataI.data;
  } catch(e) {
    console.error('Error al cargar datos:', e);
  }
  idxInit();
  initIdxJugosList();
  initIdxInfusionesList();
  // Re-renderizar la lista si el índice ya estaba visible con hierbas vacías
  const elIdx = document.getElementById('indexView');
  if(elIdx && elIdx.classList.contains('visible')){
    idxRenderLista(hierbas, 'Todas las plantas');
  }
  const paramH = parseInt(new URLSearchParams(window.location.search).get('h'));
  if(!isNaN(paramH) && paramH >= 0 && paramH < hierbas.length){
    setTimeout(() => abrirLibro(paramH), 50);
  }
}

cargarPlantas();

// Apagar servidor solo cuando se cierra el navegador, no en navegación interna
window.addEventListener('pagehide', function(e){
  if(!e.persisted){
    navigator.sendBeacon('/api/apagar', '{}');
  }
});

/* ── REGISTRO / LOGIN ── */
const TIENDAS = {
  ES:  { tipo:'herbolario',      gmaps:'herbolario'             },
  AR:  { tipo:'dietética',       gmaps:'dietética naturista'    },
  MX:  { tipo:'herbolaria',      gmaps:'herbolaria'             },
  CO:  { tipo:'tienda naturista',gmaps:'tienda naturista'       },
  CL:  { tipo:'herboristería',   gmaps:'herboristería'          },
  PE:  { tipo:'botica natural',  gmaps:'botica natural'         },
  US:  { tipo:'health store',    gmaps:'natural health store'   },
  OTRO:{ tipo:'tienda naturista',gmaps:'tienda naturista'       },
};
const ONLINE = {
  ES:  { nombre:'Amazon España',          url:'https://www.amazon.es/s?k={planta}+planta+medicinal'                  },
  AR:  { nombre:'Mercado Libre Argentina',url:'https://listado.mercadolibre.com.ar/{planta}-planta-medicinal'        },
  MX:  { nombre:'Mercado Libre México',   url:'https://listado.mercadolibre.com.mx/{planta}-planta-medicinal'        },
  CO:  { nombre:'Mercado Libre Colombia', url:'https://listado.mercadolibre.com.co/{planta}-planta-medicinal'        },
  CL:  { nombre:'Mercado Libre Chile',    url:'https://listado.mercadolibre.cl/{planta}-planta-medicinal'            },
  PE:  { nombre:'Mercado Libre Perú',     url:'https://listado.mercadolibre.com.pe/{planta}-planta-medicinal'        },
  US:  { nombre:'Amazon USA',             url:'https://www.amazon.com/s?k={planta}+medicinal+herb'                  },
  OTRO:{ nombre:'tienda online',          url:'https://www.google.com/search?q=comprar+{planta}+planta+medicinal'   },
};

function getUsuario(){ try{ return JSON.parse(sessionStorage.getItem('sn_usuario')); }catch(e){ return null; } }

function actualizarTopbar(){
  const u = getUsuario();
  const el = document.getElementById('topbarAuth');
  if(u){
    el.innerHTML = `<div class="topbar-user">✦ <span class="topbar-user-name">${u.nombre_completo.split(' ')[0]}</span> · <span class="topbar-user-logout" onclick="cerrarSesion()">Salir</span></div>`;
  } else {
    const backup = (() => { try{ return JSON.parse(localStorage.getItem('sn_usuario_backup')); }catch(e){ return null; } })();
    const label = backup ? '✦ Entrar' : '✦ Registrarse';
    el.innerHTML = `<button class="topbar-register" onclick="abrirModal()">${label}</button>`;
  }
}

async function actualizarZonas(){
  const u = getUsuario();
  const h = hierbas[current];
  const planta = encodeURIComponent(h.nombre.toLowerCase());

  const tTexto = document.getElementById('zonaTiendaTexto');
  const tLink  = document.getElementById('zonaTiendaLink');
  const oTexto = document.getElementById('zonaOnlineTexto');
  const oLink  = document.getElementById('zonaOnlineLink');

  if(!u){
    tTexto.innerHTML = `<strong>Tienda naturista cercana</strong><span>Regístrate para ver dónde comprar en tu zona</span>`;
    tLink.textContent = 'Registrarse'; tLink.href = '#'; tLink.target = '';
    tLink.onclick = (e)=>accionZona(e,'tienda');
    oTexto.innerHTML = `<strong>Comprar desde casa</strong><span>Regístrate para ver la mejor opción en tu país</span>`;
    oLink.textContent = 'Registrarse'; oLink.href = '#'; oLink.target = '';
    oLink.onclick = (e)=>accionZona(e,'online');
    return;
  }

  // ── Zona compra online (siempre disponible con sesión) ──
  const o    = ONLINE[u.pais_codigo || u.pais] || ONLINE.OTRO;
  const oUrl = o.url.replace('{planta}', planta);
  oTexto.innerHTML = `<strong>Comprar en ${o.nombre}</strong><span>${h.nombre} · envío a ${u.ciudad}</span>`;
  oLink.textContent = 'Ver ofertas';
  oLink.href = oUrl; oLink.target = '_blank'; oLink.onclick = null;

  // ── Zona tienda cercana ──
  const t = TIENDAS[u.pais_codigo || u.pais] || TIENDAS.OTRO;
  // Dirección completa del usuario para usar como punto A en Maps
  const dirUsuario = encodeURIComponent((u.direccion_completa ? u.direccion_completa+', ' : '') + (u.ciudad_prov_pais || u.ciudad || ''));

  // Función para generar URL de Maps con la casa del usuario marcada como punto A
  const mapsDesdeCasa = (destino) =>
    `https://www.google.com/maps/dir/${dirUsuario}/${encodeURIComponent(destino)}`;

  if(u.lat && u.lon){
    // Tenemos coordenadas → consultar API de tiendas reales
    tTexto.innerHTML = `<strong>Buscando tiendas cercanas…</strong><span>${h.nombre} en tu zona</span>`;
    tLink.textContent = '…'; tLink.href = '#'; tLink.onclick = null;

    try {
      const res = await fetch(`/api/tiendas?lat=${u.lat}&lon=${u.lon}`);
      const data = await res.json();
      const tiendas = data.tiendas || [];

      if(tiendas.length > 0){
        const primera = tiendas[0];
        // Dirección exacta de la tienda como destino → tu casa aparece marcada como A
        const destino = primera.direccion && primera.direccion !== 'Sin dirección registrada'
          ? primera.nombre + ', ' + primera.direccion
          : `${primera.lat},${primera.lon}`;
        tTexto.innerHTML = `<strong>${primera.nombre}</strong><span>${primera.direccion || u.ciudad} · ${tiendas.length} tienda${tiendas.length>1?'s':''} encontrada${tiendas.length>1?'s':''}</span>`;
        tLink.textContent = 'Cómo llegar';
        tLink.href = mapsDesdeCasa(destino); tLink.target = '_blank';
      } else {
        // Sin resultados → ruta desde tu casa buscando el tipo de tienda cercana
        tTexto.innerHTML = `<strong>${t.tipo.charAt(0).toUpperCase()+t.tipo.slice(1)} cerca de ti</strong><span>Tu casa marcada · busca en 1 km</span>`;
        tLink.textContent = 'Buscar en Maps';
        tLink.href = mapsDesdeCasa(t.gmaps+' cerca'); tLink.target = '_blank';
      }
    } catch(e){
      tTexto.innerHTML = `<strong>Tiendas cerca de ti</strong><span>Abre Google Maps desde tu casa</span>`;
      tLink.textContent = 'Abrir Maps';
      tLink.href = mapsDesdeCasa(t.gmaps); tLink.target = '_blank';
    }
  } else {
    // Sin coordenadas → geocodificar la dirección registrada automáticamente
    tTexto.innerHTML = `<strong>Tienda ${t.tipo} cerca de ti</strong><span>Localizando tu dirección…</span>`;
    tLink.textContent = '…'; tLink.href = '#'; tLink.target = ''; tLink.onclick = null;

    try {
      const res = await fetch('/api/geocodificar', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          email: u.email,
          direccion_completa: u.direccion_completa || '',
          ciudad_prov_pais: u.ciudad_prov_pais || u.ciudad || ''
        })
      });
      const data = await res.json();
      if(res.ok && data.lat){
        u.lat = data.lat; u.lon = data.lon;
        sessionStorage.setItem('sn_usuario', JSON.stringify(u));
        actualizarZonas();
      } else {
        throw new Error('sin coords');
      }
    } catch(e){
      // Fallback: desde tu dirección buscando el tipo de tienda — tu casa queda marcada
      tTexto.innerHTML = `<strong>${t.tipo.charAt(0).toUpperCase()+t.tipo.slice(1)} en ${u.ciudad}</strong><span>Tu casa como punto de partida</span>`;
      tLink.textContent = 'Buscar desde mi casa';
      tLink.href = mapsDesdeCasa(t.gmaps+' '+u.ciudad); tLink.target = '_blank';
    }
  }
}

function accionZona(e, tipo){
  e.preventDefault();
  if(!getUsuario()){ abrirModal(); }
}

function abrirModal(){
  document.getElementById('modalOverlay').classList.add('visible');
  document.getElementById('regError').style.display = 'none';
  document.getElementById('loginError').style.display = 'none';
  // Si hay cuenta guardada → abrir directo en login
  const backup = (() => { try{ return JSON.parse(localStorage.getItem('sn_usuario_backup')); }catch(e){ return null; } })();
  if(backup){
    document.getElementById('panelRegistro').style.display = 'none';
    document.getElementById('panelLogin').style.display = '';
    // Pre-rellenar el email
    const inputEmail = document.getElementById('loginEmail');
    if(inputEmail && backup.email) inputEmail.value = backup.email;
  } else {
    document.getElementById('panelRegistro').style.display = '';
    document.getElementById('panelLogin').style.display = 'none';
  }
}

function cerrarModal(){
  document.getElementById('modalOverlay').classList.remove('visible');
}

function togglePanel(){
  const r = document.getElementById('panelRegistro');
  const l = document.getElementById('panelLogin');
  r.style.display = r.style.display === 'none' ? '' : 'none';
  l.style.display = l.style.display === 'none' ? '' : 'none';
  document.getElementById('regError').style.display = 'none';
  document.getElementById('loginError').style.display = 'none';
}

async function registrar(){
  const nombre_completo    = document.getElementById('regNombreCompleto').value.trim();
  const celular            = document.getElementById('regCelular').value.trim();
  const email              = document.getElementById('regEmail').value.trim();
  const direccion_completa = document.getElementById('regDireccion').value.trim();
  const ciudad_prov_pais   = document.getElementById('regCiudadProvPais').value.trim();
  const pais_codigo        = document.getElementById('regPais').value;
  const err                = document.getElementById('regError');
  const btn                = document.querySelector('#panelRegistro .modal-btn');

  const password = document.getElementById('regPassword').value.trim();

  if(!nombre_completo || !celular || !email || !password || !ciudad_prov_pais || !pais_codigo){
    err.textContent = 'Por favor completa los campos obligatorios (*).';
    err.style.display = 'block'; return;
  }
  if(password.length < 6){
    err.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    err.style.display = 'block'; return;
  }

  btn.textContent = '✦ Guardando…'; btn.disabled = true;

  // 1. Guardar en localStorage INMEDIATAMENTE — el usuario nunca pierde su sesión
  const uLocal = {nombre_completo, celular, email, password, direccion_completa,
                  ciudad_prov_pais, pais_codigo, pais: pais_codigo,
                  ciudad: ciudad_prov_pais.split(',')[0].trim(),
                  pendiente_sync: true};
  sessionStorage.setItem('sn_usuario', JSON.stringify(uLocal));
  localStorage.setItem('sn_usuario_backup', JSON.stringify(uLocal));

  cerrarModal();
  actualizarTopbar();
  actualizarZonas();

  // 2. Intentar guardar en el servidor en segundo plano (sin bloquear al usuario)
  try {
    const res = await fetch('/api/registro', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({nombre_completo, celular, email, password, direccion_completa,
                            ciudad_prov_pais, pais_codigo})
    });
    const data = await res.json();

    if(res.status === 409){
      // Email ya en DB → hacer login automático con esos datos
      const res2 = await fetch('/api/login', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email})
      });
      const data2 = await res2.json();
      if(res2.ok){
        const u = {...data2.usuario, pais: data2.usuario.pais_codigo,
                   ciudad: (data2.usuario.ciudad_prov_pais||'').split(',')[0].trim()};
        sessionStorage.setItem('sn_usuario', JSON.stringify(u));
        localStorage.setItem('sn_usuario_backup', JSON.stringify(u));
        actualizarTopbar(); actualizarZonas();
      }
    } else if(res.ok){
      // Servidor respondió con lat/lon del geocoding → actualizar sesión
      const u = {...data.usuario, pais: pais_codigo,
                 ciudad: ciudad_prov_pais.split(',')[0].trim()};
      sessionStorage.setItem('sn_usuario', JSON.stringify(u));
      localStorage.setItem('sn_usuario_backup', JSON.stringify(u));
      actualizarZonas(); // refrescar con coordenadas reales
    }
  } catch(e){
    // Sin servidor: los datos ya están en localStorage, no pasa nada
  } finally {
    btn.textContent = '✦ Crear cuenta y acceder'; btn.disabled = false;
  }
}

async function login(){
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const err      = document.getElementById('loginError');
  const btn      = document.querySelector('#panelLogin .modal-btn');

  if(!email || !password){ err.style.display='block'; return; }

  btn.textContent = '✦ Accediendo…'; btn.disabled = true;

  try {
    const res  = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email, password})
    });
    const data = await res.json();
    if(!res.ok){
      err.style.display = 'block';
    } else {
      const u = {...data.usuario,
                 pais: data.usuario.pais_codigo,
                 ciudad: (data.usuario.ciudad_prov_pais||'').split(',')[0].trim()};
      // Guardar en sesión Y en backup local (cada usuario sobreescribe su propio backup)
      sessionStorage.setItem('sn_usuario', JSON.stringify(u));
      localStorage.setItem('sn_usuario_backup', JSON.stringify(u));
      cerrarModal();
      actualizarTopbar();
      actualizarZonas();
    }
  } catch(e) {
    // Sin servidor → verificar contra copia local
    try {
      const backup = JSON.parse(localStorage.getItem('sn_usuario_backup'));
      const pwOk = !backup?.password || backup.password === password;
      if(backup && backup.email === email && pwOk){
        sessionStorage.setItem('sn_usuario', JSON.stringify(backup));
        cerrarModal(); actualizarTopbar(); actualizarZonas();
      } else { err.style.display = 'block'; }
    } catch(_){ err.style.display = 'block'; }
  } finally {
    btn.textContent = '✦ Acceder'; btn.disabled = false;
  }
}

function cerrarSesion(){
  // Guardar copia antes de borrar para poder volver a entrar
  const u = getUsuario();
  if(u) localStorage.setItem('sn_usuario_backup', JSON.stringify(u));
  sessionStorage.removeItem('sn_usuario');
  actualizarTopbar();
  actualizarZonas();
}

function imprimirFicha(){
  if(!getUsuario()){ abrirModal(); return; }
  const h = hierbas[current];
  const win = window.open('','_blank');
  win.document.write(`<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"/>
<title>Ficha – ${h.nombre}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:12mm 14mm}
@media print{.btn-wrap{display:none!important}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
body{font-family:'EB Garamond',serif;color:rgba(232,224,208,.82);background:#0d1810;padding:20px;max-width:800px;margin:0 auto}
.btn-wrap{text-align:center;margin-bottom:14px}
.btn-print{padding:.5rem 2rem;font-family:'Cinzel',serif;font-size:.65rem;letter-spacing:2px;
  text-transform:uppercase;background:rgba(184,146,74,.2);border:1px solid #b8924a;
  border-radius:3px;cursor:pointer;color:#5a3a00}
/* CABECERA */
.cab{display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #b8924a}
.logo{width:46px;height:46px;border-radius:50%;object-fit:cover;border:2px solid #c8a060;flex-shrink:0}
.cab-linea{font-family:'Cinzel',serif;font-size:5.5pt;letter-spacing:3px;text-transform:uppercase;color:#d4af37}
.cab-nombre{font-family:'EB Garamond',serif;font-style:italic;font-size:20pt;color:rgba(232,224,208,.92);line-height:1.1}
.cab-lat{font-style:italic;font-size:8pt;color:rgba(58,30,0,.5);margin-top:2px}
.cab-lote{font-family:'Cinzel',serif;font-size:5.5pt;letter-spacing:3px;text-transform:uppercase;color:#b8924a;margin-top:2px}
/* CUERPO: foto izq, contenido der — igual que el grimorio */
.cuerpo{display:table;width:100%;border-collapse:separate;border-spacing:12px 0}
.col-foto{display:table-cell;width:200px;vertical-align:top}
.col-info{display:table-cell;vertical-align:top}
.foto{width:200px;height:230px;object-fit:cover;border:2px solid #c8a060;display:block}
/* SECCIONES */
h2{font-family:'Cinzel',serif;font-size:5.5pt;letter-spacing:3px;text-transform:uppercase;
  color:#d4af37;margin:8px 0 3px;padding-bottom:2px;border-bottom:1px solid rgba(184,146,74,.4)}
p.t{font-style:italic;font-size:9pt;line-height:1.6;text-align:justify;margin-bottom:4px}
.nota{margin-top:6px;padding:5px 8px;font-style:italic;font-size:8pt;
  color:rgba(58,30,0,.7);border-left:3px solid #b8924a;background:rgba(212,175,55,.07);line-height:1.5}
ul{list-style:none;padding:0;margin:0}
ul li{font-style:italic;font-size:9pt;padding:2px 0 2px 10px;position:relative;border-bottom:1px solid rgba(212,175,55,.05)}
ul li::before{content:'◆';position:absolute;left:0;color:#b8924a;font-size:4pt;top:5px}
.pie{border-top:1px solid rgba(184,146,74,.3);margin-top:12px;padding-top:5px;
  text-align:center;font-family:'Cinzel',serif;font-size:4.5pt;
  letter-spacing:2px;color:rgba(58,30,0,.3);text-transform:uppercase}
</style></head><body>
<div class="btn-wrap">
  <button class="btn-print" onclick="window.print()">🖨 Imprimir / Guardar como PDF</button>
</div>
<div class="cab">
  <img class="logo" src="${location.origin}/static/img/logo.jpg" alt="logo"/>
  <div>
    <p class="cab-linea">Salud Natura · Grimorio de Plantas Medicinales</p>
    <p class="cab-nombre">${h.nombre}</p>
    <p class="cab-lat">${h.lat}</p>
    <p class="cab-lote">${h.loteDesc}</p>
  </div>
</div>
<div class="cuerpo">
  <div class="col-foto">
    <img class="foto" src="${location.origin}${h.img}" alt="${h.nombre}"/>
  </div>
  <div class="col-info">
    <h2>Propiedades medicinales</h2>
    <ul>${h.props.map(p=>`<li>${p}</li>`).join('')}</ul>
    <h2>Usos y dosificación</h2>
    <p class="t">${h.usos}</p>
    ${h.nota ? `<div class="nota">⚕ ${h.nota}</div>` : ''}
    ${h.nombres_alternativos ? `<h2>También conocida como</h2><p class="t">${h.nombres_alternativos}</p>` : ''}
    ${h.partes_utilizadas ? `<h2>Partes utilizadas</h2><p class="t">${h.partes_utilizadas}</p>` : ''}
  </div>
</div>
<div class="pie">Salud Natura · Información con fines divulgativos · Consulte siempre a un profesional de la salud</div>
</body></html>`);
  win.document.close();
}

document.getElementById('modalOverlay').addEventListener('click', function(e){
  if(e.target === this) cerrarModal();
});

actualizarTopbar();

// Abrir modal de registro si viene desde el botón de index.html
if(sessionStorage.getItem('abrirRegistro')){
  sessionStorage.removeItem('abrirRegistro');
  setTimeout(abrirModal, 300);
}

function renderHierba(idx, dir=0){
  const h = hierbas[idx];
  const left = document.getElementById('pageLeft');
  const right = document.getElementById('pageRight');

  // Animación flip
  if(dir !== 0){
    left.classList.add('page-flip');
    right.classList.add('page-flip');
    setTimeout(()=>{left.classList.remove('page-flip');right.classList.remove('page-flip')},500);
  }

  // Lote badge
  document.getElementById('loteBadge').textContent = h.lote;
  document.getElementById('herbNum').textContent = (idx+1)+' / '+hierbas.length;

  // Foto local
  const img = document.getElementById('herbPhoto');
  img.classList.add('loading');
  img.onload = () => img.classList.remove('loading');
  img.onerror = () => img.classList.remove('loading');
  img.src = h.img;

  // Nombre
  document.getElementById('herbName').textContent = h.nombre;
  document.getElementById('herbLat').textContent = h.lat;

  // Propiedades
  const ul = document.getElementById('herbProps');
  ul.innerHTML = h.props.map(p=>`<li>${p}</li>`).join('');

  // Usos
  document.getElementById('herbUsos').textContent = h.usos;

  // Nota / contraindicaciones
  document.getElementById('herbNota').textContent = h.nota ? '⚕ ' + h.nota : '';

  // Campos extra: nombres alternativos, partes, fuentes
  const extra = document.getElementById('herbExtra');
  let extraHtml = '';
  if(h.nombres_alternativos) extraHtml += `<p class="herb-section-title">También conocida como</p><p class="herb-extra-val">${h.nombres_alternativos}</p>`;
  if(h.partes_utilizadas)    extraHtml += `<p class="herb-section-title">Partes utilizadas</p><p class="herb-extra-val">${h.partes_utilizadas}</p>`;
  extra.innerHTML = extraHtml;

  // Jugo herbal inline
  const jugo = getJugoParaHierba(h.id_remedio);
  document.getElementById('herbJugo').innerHTML = jugo ? renderJugoInline(jugo) : '';
  const infusion = getInfusionParaHierba(h.id_remedio);
  document.getElementById('herbInfusion').innerHTML = infusion ? renderInfusionInline(infusion) : '';

  // Indicador
  document.getElementById('navCounter').textContent = (idx+1)+' / '+hierbas.length;
  document.getElementById('loteIndicator').textContent = h.loteDesc;

  // Botones
  document.getElementById('btnPrev').disabled = idx === 0;
  document.getElementById('btnNext').disabled = idx === hierbas.length-1;

  // Actualizar enlace de descarga PDF
  const nombrePDF = h.nombre.toLowerCase()
    .replace(/ /g,'_').replace(/\//g,'_')
    .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i')
    .replace(/ó/g,'o').replace(/ú/g,'u').replace(/ñ/g,'n').replace(/ü/g,'u');
  const btnPDF = document.getElementById('btnDescargaPDF');
  if(btnPDF){
    btnPDF.href = `fichas_pdf/${nombrePDF}.pdf`;
    btnPDF.download = `${h.nombre}.pdf`;
  }

  actualizarZonas();
}

function cambiarHierba(dir){
  const next = current + dir;
  if(next < 0 || next >= hierbas.length) return;
  current = next;
  renderHierba(current, dir);
}

// Teclas de dirección
document.addEventListener('keydown', e=>{
  if(!abierto) return;
  if(e.key==='ArrowRight') cambiarHierba(1);
  if(e.key==='ArrowLeft') cambiarHierba(-1);
});
