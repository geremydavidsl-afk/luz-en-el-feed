/**
 * LUZ EN EL FEED - Cuaderno digital
 * Autoguardado local + generación de PDF
 */
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'luz_en_el_feed_cuaderno_v3';
  const $ = (id) => document.getElementById(id);
  const statusEl = $('autosave-status');
  const btn = $('btn-download-pdf');
  const btnText = $('btn-download-text');

  // Fecha
  const formattedDate = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  if ($('current-date-display')) $('current-date-display').textContent = formattedDate;

  // Campos a guardar
  const TEXT_IDS = [
    'student-name', 'diag-horas', 'diag-despertar', 'diag-acostarme', 'notas-1',
    'acc-nombre-1', 'acc-nombre-2', 'acc-nombre-3', 'notas-2',
    'pilar-trabajar', 'notas-3',
    'excusa-comun', 'tengo-en-mano', 'notas-4',
    'creador-1-nombre', 'creador-1-aprendi', 'creador-2-nombre', 'creador-2-aprendi',
    'compromiso-texto', 'compromiso-firma', 'compromiso-fecha'
  ];
  const RADIO_NAMES = ['diag-soy-mas', 'acc-eval-1', 'acc-eval-2', 'acc-eval-3'];
  const CHECK_IDS = ['check-dia-1', 'check-dia-2', 'check-dia-3', 'check-dia-4', 'check-dia-5'];

  const val = (id) => ($(id) ? $(id).value.trim() : '');
  const radio = (name) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : '';
  };

  // Auto-crecer textareas
  const autoResize = (ta) => {
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };

  // Guardar
  let timer;
  function save() {
    clearTimeout(timer);
    if (statusEl) statusEl.textContent = 'Guardando...';
    timer = setTimeout(() => {
      const data = { text: {}, radio: {}, check: {} };
      TEXT_IDS.forEach(id => { if ($(id)) data.text[id] = $(id).value; });
      RADIO_NAMES.forEach(n => { data.radio[n] = radio(n); });
      CHECK_IDS.forEach(id => { if ($(id)) data.check[id] = $(id).checked; });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        if (statusEl) statusEl.textContent = 'Borrador guardado';
      } catch (e) { console.warn(e); }
    }, 300);
  }

  // Cargar
  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!data) return;
      Object.entries(data.text || {}).forEach(([id, v]) => { if ($(id)) $(id).value = v; });
      Object.entries(data.radio || {}).forEach(([n, v]) => {
        if (!v) return;
        const el = document.querySelector(`input[name="${n}"][value="${v}"]`);
        if (el) el.checked = true;
      });
      Object.entries(data.check || {}).forEach(([id, v]) => { if ($(id)) $(id).checked = !!v; });
    } catch (e) { console.warn(e); }
  }

  load();
  if ($('compromiso-fecha') && !$('compromiso-fecha').value) $('compromiso-fecha').value = formattedDate;

  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', save);
    el.addEventListener('change', save);
  });
  document.querySelectorAll('textarea').forEach(ta => {
    autoResize(ta);
    ta.addEventListener('input', () => autoResize(ta));
  });

  // ---------- PDF ----------
  const esc = (t) => String(t || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const NAVY = '#1B2A47', GOLD = '#F5B83D', GOLD_D = '#B7791F', TEAL = '#1A8C87', BLUE = '#E8F0FA', CREAM = '#FEF5DC';

  const banner = (n, title, sub) => `
    <div style="background:${NAVY};border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:12px;margin-bottom:10px;">
      <div style="width:30px;height:30px;border-radius:50%;background:${GOLD};color:${NAVY};font-weight:800;font-size:13pt;text-align:center;line-height:30px;">${n}</div>
      <div><div style="color:#fff;font-weight:700;font-size:12pt;">${title}</div>
      <div style="color:${GOLD};font-size:8.5pt;">${sub}</div></div>
    </div>`;

  const row = (label, value) => `
    <div style="margin-bottom:5px;"><strong>${label}</strong>
    <span style="border-bottom:1px solid #C9D2DE;padding:0 4px;">${esc(value) || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</span></div>`;

  const box = (bg, inner, extra = '') =>
    `<div style="background:${bg};border-radius:8px;padding:10px 12px;margin-bottom:8px;font-size:9.5pt;${extra}">${inner}</div>`;

  const label = (txt, color) => `<div style="color:${color};font-weight:800;font-size:8pt;letter-spacing:.05em;margin-bottom:5px;">${txt}</div>`;

  const notes = (id) => {
    const v = val(id);
    return `<div style="border:1.5px solid ${TEAL};border-radius:8px;padding:10px 12px;font-size:9.5pt;">
      ${label('MIS NOTAS', TEAL)}
      <div style="white-space:pre-wrap;word-break:break-word;${v ? '' : 'color:#9CA3AF;font-style:italic;'}">${v ? esc(v) : 'Sin notas'}</div>
    </div>`;
  };

  const passages = (list) => box(CREAM, label('PASAJES', GOLD_D) + list.join(' &nbsp;•&nbsp; '), `border-left:4px solid ${GOLD};font-weight:700;`);
  const mark = (on) => on ? '☑' : '☐';

  const sectionWrap = (inner) => `<div style="page-break-inside:avoid;margin-bottom:16px;">${inner}</div>`;

  function buildPdfHtml() {
    return `
    <div style="font-family:'Lato','Segoe UI',sans-serif;color:#1F2937;width:740px;padding:20px 26px;background:#fff;">
      <div style="background:${NAVY};border-radius:10px;padding:16px;text-align:center;color:#fff;margin-bottom:12px;">
        <div style="font-size:19pt;font-weight:800;">LUZ EN EL FEED</div>
        <div style="color:${GOLD};font-size:10pt;">Redes Sociales e Influencia con Propósito</div>
        <div style="font-size:8.5pt;font-style:italic;color:#D7DEEA;margin-top:6px;">“Así alumbre vuestra luz delante de los hombres.” — Mateo 5:16</div>
      </div>
      ${box(BLUE, `<strong>Nombre:</strong> ${esc(val('student-name')) || '—'} <span style="float:right;color:#6B7280;">${formattedDate}</span>`)}

      ${sectionWrap(
      banner(1, 'Diagnóstico digital', '¿Soy influenciador o consumidor?') +
      box(BLUE,
        label('MI DIAGNÓSTICO', TEAL) +
        row('Horas al día frente a la pantalla:', val('diag-horas')) +
        row('Lo primero que reviso al despertar:', val('diag-despertar')) +
        row('Lo último que reviso al acostarme:', val('diag-acostarme')) +
        row('Soy más:', radio('diag-soy-mas'))) +
      notes('notas-1'))}

      ${sectionWrap(
        banner(2, 'Lo que consumo me moldea', '¿En qué me afecta o me beneficia?') +
        passages(['Proverbios 4:23', 'Salmo 101:3', 'Romanos 12:2', 'Filipenses 4:8']) +
        box(BLUE,
          label('MIS 3 CUENTAS QUE MÁS VEO', TEAL) +
          [1, 2, 3].map(i => row(`${i}.`, `${val('acc-nombre-' + i)}${radio('acc-eval-' + i) ? '  →  ' + radio('acc-eval-' + i) : ''}`)).join('')) +
        notes('notas-2'))}

      ${sectionWrap(
          banner(3, 'De consumidor a creador', 'Dios nos llamó a ser luz, no espectadores') +
          passages(['Mateo 5:14-16', '1 Pedro 4:10', 'Efesios 4:29']) +
          box(BLUE, label('TRES PILARES', TEAL) + '1. Autenticidad &nbsp;•&nbsp; 2. Coherencia &nbsp;•&nbsp; 3. Edificación') +
          box('#fff', row('El pilar que más necesito trabajar:', val('pilar-trabajar')), `border:1.5px solid ${TEAL};`) +
          notes('notas-3'))}

      ${sectionWrap(
            banner(4, 'Empieza con lo que tienes', '¿Necesito un estudio o grandes equipos?') +
            passages(['Éxodo 4:2', 'Zacarías 4:10', 'Juan 6:9-13', '1 Samuel 17:40']) +
            box(BLUE,
              row('Mi excusa más común es:', val('excusa-comun')) +
              row('Lo que ya tengo en mi mano:', val('tengo-en-mano'))) +
            notes('notas-4'))}

      ${sectionWrap(
              banner(5, 'Desafío de 5 días', 'De la teoría a la práctica') +
              box(BLUE,
                label('EJEMPLOS DE LA IGLESIA', TEAL) +
                row('Creador 1:', val('creador-1-nombre')) + row('Lo que aprendí:', val('creador-1-aprendi')) +
                row('Creador 2:', val('creador-2-nombre')) + row('Lo que aprendí:', val('creador-2-aprendi'))) +
              box(CREAM,
                [['check-dia-1', 'Limpieza de feed'], ['check-dia-2', 'Oración e intercesión'], ['check-dia-3', 'Mi primera creación'],
                ['check-dia-4', 'Publicación de luz'], ['check-dia-5', 'Mensaje de ánimo']]
                  .map(([id, t], i) => `<div style="margin-bottom:3px;">${mark($(id) && $(id).checked)} <strong style="color:${GOLD_D};">DÍA ${i + 1}</strong> &nbsp;${t}</div>`).join(''),
                `border-left:4px solid ${GOLD};`) +
              box(NAVY,
                label('MI COMPROMISO', GOLD) +
                `<div style="color:#E5E9F0;margin-bottom:6px;">Con la ayuda de Dios, durante estos 5 días voy a:</div>
           <div style="border-bottom:1px solid #64748B;padding-bottom:4px;margin-bottom:8px;white-space:pre-wrap;">${esc(val('compromiso-texto')) || '&nbsp;'}</div>
           <div style="color:#CBD5E1;font-size:9pt;">Firma: <span style="color:#fff;">${esc(val('compromiso-firma')) || '__________'}</span>
           <span style="float:right;">Fecha: <span style="color:#fff;">${esc(val('compromiso-fecha')) || formattedDate}</span></span></div>`,
                'color:#fff;'))}
    </div>`;
  }

  async function downloadPdf() {
    if (typeof html2pdf === 'undefined') {
      alert('La herramienta de PDF aún se está cargando. Intenta de nuevo en unos segundos.');
      return;
    }
    const original = btnText.textContent;
    btn.disabled = true;
    btnText.textContent = 'Generando PDF...';

    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;left:0;top:0;width:740px;z-index:-9999;background:#fff;';
    wrap.innerHTML = buildPdfHtml();
    document.body.appendChild(wrap);

    try {
      await html2pdf().set({
        margin: [8, 8, 8, 8],
        filename: 'Mis_Apuntes_Luz_En_El_Feed.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, windowWidth: 800 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }).from(wrap.firstElementChild).save();
    } catch (e) {
      console.error(e);
      alert('Ocurrió un error al generar el PDF. Intenta nuevamente.');
    } finally {
      wrap.remove();
      btn.disabled = false;
      btnText.textContent = original;
    }
  }

  if (btn) btn.addEventListener('click', downloadPdf);
});
