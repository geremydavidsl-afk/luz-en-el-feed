/**
 * LUZ EN EL FEED - Cuaderno Digital de Trabajo
 * Lógica: Auto-guardado de todas las láminas interactivas y generación fiel de PDF
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Elementos clave
  const studentNameInput = document.getElementById('student-name');
  const dateDisplay = document.getElementById('current-date-display');
  const autosaveStatus = document.getElementById('autosave-status');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  const btnDownloadText = document.getElementById('btn-download-text');

  const STORAGE_KEY = 'luz_en_el_feed_cuaderno_v2';

  // Inicializar fecha actual
  function initDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = today.toLocaleDateString('es-ES', options);
    if (dateDisplay) {
      dateDisplay.textContent = `Fecha: ${dateStr}`;
    }
    const fechaComp = document.getElementById('compromiso-fecha');
    if (fechaComp && !fechaComp.value) {
      fechaComp.value = dateStr;
    }
    return dateStr;
  }

  const formattedDate = initDate();

  // 2. Auto-expansión de las áreas de texto
  const textareas = document.querySelectorAll('textarea');
  function autoResize(ta) {
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.max(ta.scrollHeight, 120)}px`;
  }

  textareas.forEach(ta => {
    ta.addEventListener('input', () => {
      autoResize(ta);
      saveAllData();
    });
  });

  // 3. Captura y Guardado Completo en LocalStorage
  let saveTimer = null;
  function saveAllData() {
    clearTimeout(saveTimer);
    if (autosaveStatus) {
      autosaveStatus.textContent = 'Guardando...';
      autosaveStatus.style.color = '#D97706';
    }

    saveTimer = setTimeout(() => {
      const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
      };

      const getRadio = (name) => {
        const el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? el.value : '';
      };

      const getCheck = (id) => {
        const el = document.getElementById(id);
        return el ? el.checked : false;
      };

      const data = {
        name: getVal('student-name'),
        // Sección 1
        diagHoras: getVal('diag-horas'),
        diagDespertar: getVal('diag-despertar'),
        diagAcostarme: getVal('diag-acostarme'),
        diagSoyMas: getRadio('diag-soy-mas'),
        notas1: getVal('notas-1'),
        // Sección 2
        accNombre1: getVal('acc-nombre-1'),
        accEval1: getRadio('acc-eval-1'),
        accNombre2: getVal('acc-nombre-2'),
        accEval2: getRadio('acc-eval-2'),
        accNombre3: getVal('acc-nombre-3'),
        accEval3: getRadio('acc-eval-3'),
        notas2: getVal('notas-2'),
        // Sección 3
        pilarTrabajar: getVal('pilar-trabajar'),
        notas3: getVal('notas-3'),
        // Sección 4
        excusaComun: getVal('excusa-comun'),
        tengoEnMano: getVal('tengo-en-mano'),
        notas4: getVal('notas-4'),
        // Sección 5
        creador1Nombre: getVal('creador-1-nombre'),
        creador1Aprendi: getVal('creador-1-aprendi'),
        creador2Nombre: getVal('creador-2-nombre'),
        creador2Aprendi: getVal('creador-2-aprendi'),
        checkDia1: getCheck('check-dia-1'),
        checkDia2: getCheck('check-dia-2'),
        checkDia3: getCheck('check-dia-3'),
        checkDia4: getCheck('check-dia-4'),
        checkDia5: getCheck('check-dia-5'),
        compromisoTexto: getVal('compromiso-texto'),
        compromisoFirma: getVal('compromiso-firma'),
        compromisoFecha: getVal('compromiso-fecha'),
        timestamp: new Date().toISOString()
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        if (autosaveStatus) {
          autosaveStatus.textContent = 'Borrador guardado';
          autosaveStatus.style.color = '#10B981';
        }
      } catch (err) {
        console.warn('Error al guardar datos:', err);
      }
    }, 350);
  }

  // 4. Restauración de datos
  function loadAllData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);

      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.value = val;
      };

      const setRadio = (name, val) => {
        if (!val) return;
        const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
        if (el) el.checked = true;
      };

      const setCheck = (id, checked) => {
        const el = document.getElementById(id);
        if (el && checked !== undefined) el.checked = Boolean(checked);
      };

      setVal('student-name', data.name);
      setVal('diag-horas', data.diagHoras);
      setVal('diag-despertar', data.diagDespertar);
      setVal('diag-acostarme', data.diagAcostarme);
      setRadio('diag-soy-mas', data.diagSoyMas);
      setVal('notas-1', data.notas1);

      setVal('acc-nombre-1', data.accNombre1);
      setRadio('acc-eval-1', data.accEval1);
      setVal('acc-nombre-2', data.accNombre2);
      setRadio('acc-eval-2', data.accEval2);
      setVal('acc-nombre-3', data.accNombre3);
      setRadio('acc-eval-3', data.accEval3);
      setVal('notas-2', data.notas2);

      setVal('pilar-trabajar', data.pilarTrabajar);
      setVal('notas-3', data.notas3);

      setVal('excusa-comun', data.excusaComun);
      setVal('tengo-en-mano', data.tengoEnMano);
      setVal('notas-4', data.notas4);

      setVal('creador-1-nombre', data.creador1Nombre);
      setVal('creador-1-aprendi', data.creador1Aprendi);
      setVal('creador-2-nombre', data.creador2Nombre);
      setVal('creador-2-aprendi', data.creador2Aprendi);
      setCheck('check-dia-1', data.checkDia1);
      setCheck('check-dia-2', data.checkDia2);
      setCheck('check-dia-3', data.checkDia3);
      setCheck('check-dia-4', data.checkDia4);
      setCheck('check-dia-5', data.checkDia5);
      setVal('compromiso-texto', data.compromisoTexto);
      setVal('compromiso-firma', data.compromisoFirma);
      setVal('compromiso-fecha', data.compromisoFecha);

      textareas.forEach(ta => autoResize(ta));
    } catch (err) {
      console.warn('Error al cargar datos guardados:', err);
    }
  }

  // Escuchar inputs y cambios
  document.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', saveAllData);
    inp.addEventListener('change', saveAllData);
  });

  loadAllData();

  // Función de escape para HTML seguro
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 5. Construcción del documento de impresión PDF de alta resolución
  function buildPdfHtml() {
    const getVal = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : '';
    };

    const isChecked = (id) => {
      const el = document.getElementById(id);
      return el && el.checked;
    };

    const participantName = getVal('student-name') || 'Participante';

    const renderNotes = (val) => {
      if (!val) {
        return '<div style="font-style: italic; color: #94A3B8; padding: 6px 0;">(Sin notas registradas en esta sección)</div>';
      }
      return `<div style="white-space: pre-wrap; word-break: break-word; color: #1E293B; line-height: 1.5; padding: 4px 0;">${escapeHtml(val)}</div>`;
    };

    return `
      <div style="font-family: 'Inter', -apple-system, sans-serif; color: #1E293B; width: 750px; padding: 24px 30px; background-color: #FFFFFF;">
        
        <!-- Header del documento -->
        <div style="border-bottom: 3px solid #F59E0B; padding-bottom: 14px; margin-bottom: 18px;">
          <span style="background-color: #FEF3C7; color: #B45309; font-size: 8pt; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">Taller Juvenil Cristiano</span>
          <h1 style="font-size: 20pt; font-weight: 900; color: #1E2B45; margin: 4px 0 2px 0;">LUZ EN EL FEED</h1>
          <p style="font-size: 11pt; font-weight: 700; color: #D97706; margin: 0 0 8px 0;">Redes Sociales e Influencia con Propósito</p>
          <div style="background-color: #F8FAFC; border-left: 4px solid #F59E0B; padding: 6px 10px; font-size: 9pt;">
            <em>«Así alumbre vuestra luz delante de los hombres.»</em> — <strong>Mateo 5:16</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 9.5pt; background: #F1F5F9; padding: 8px 12px; border-radius: 6px;">
            <span><strong>Participante:</strong> ${escapeHtml(participantName)}</span>
            <span><strong>Fecha:</strong> ${formattedDate}</span>
          </div>
        </div>

        <!-- =================== SECCIÓN 1 =================== -->
        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 18px; page-break-inside: avoid;">
          <div style="background: #1E2B45; color: #FFFFFF; padding: 8px 12px; border-radius: 6px; font-size: 11pt; font-weight: 800; margin-bottom: 12px;">
            1. MI DIAGNÓSTICO DIGITAL
          </div>
          <div style="background: #EFF6FF; padding: 12px; border-radius: 6px; font-size: 9pt; margin-bottom: 12px;">
            <div style="margin-bottom: 6px;"><strong>Horas al día frente a la pantalla:</strong> ${escapeHtml(getVal('diag-horas')) || 'No especificado'}</div>
            <div style="margin-bottom: 6px;"><strong>Lo primero que reviso al despertar:</strong> ${escapeHtml(getVal('diag-despertar')) || 'No especificado'}</div>
            <div style="margin-bottom: 6px;"><strong>Lo último que reviso al acostarme:</strong> ${escapeHtml(getVal('diag-acostarme')) || 'No especificado'}</div>
            <div><strong>Soy más:</strong> <span style="color: #D97706; font-weight: 800;">${escapeHtml(getRadio('diag-soy-mas')) || 'No seleccionado'}</span></div>
          </div>
          <div style="background: #1E2B45; color: #FFFFFF; padding: 10px; border-radius: 6px; text-align: center; font-size: 9pt; margin-bottom: 12px;">
            <span style="color: #F59E0B; font-weight: 800;">PARA PENSAR:</span> ¿Quién está influyendo en quién: yo en las redes o las redes en mí?
          </div>
          <div style="border: 1.5px solid #0D9488; border-radius: 6px; padding: 10px;">
            <span style="color: #0D9488; font-weight: 800; font-size: 8.5pt;">MIS NOTAS:</span>
            ${renderNotes(getVal('notas-1'))}
          </div>
        </div>

        <!-- =================== SECCIÓN 2 =================== -->
        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 18px; page-break-inside: avoid;">
          <div style="background: #1E2B45; color: #FFFFFF; padding: 8px 12px; border-radius: 6px; font-size: 11pt; font-weight: 800; margin-bottom: 10px;">
            2. LO QUE CONSUMO ME MOLDEA
          </div>
          <p style="font-size: 8.5pt; font-style: italic; color: #475569; margin-bottom: 10px;">
            Lo que miro una y otra vez moldea lo que pienso, lo que deseo y lo que creo de mí mismo.
          </p>

          <table style="width: 100%; border-collapse: collapse; font-size: 8pt; margin-bottom: 12px;">
            <thead>
              <tr>
                <th style="background: #E05252; color: #fff; padding: 6px; text-align: left; width: 50%;">ME AFECTA CUANDO...</th>
                <th style="background: #10B981; color: #fff; padding: 6px; text-align: left; width: 50%;">ME BENEFICIA CUANDO...</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="background:#FFF5F5; padding:4px 6px;">Genera comparación, envidia y ansiedad</td><td style="background:#F0FDF4; padding:4px 6px;">Inspira gratitud, servicio y esperanza</td></tr>
              <tr><td style="background:#FFF5F5; padding:4px 6px;">Me hace buscar identidad en likes</td><td style="background:#F0FDF4; padding:4px 6px;">Me recuerda quién soy en Cristo</td></tr>
              <tr><td style="background:#FFF5F5; padding:4px 6px;">Normaliza el pecado y vanidad</td><td style="background:#F0FDF4; padding:4px 6px;">Edifica, enseña y fortalece mi fe</td></tr>
              <tr><td style="background:#FFF5F5; padding:4px 6px;">Me roba tiempo de Dios y familia</td><td style="background:#F0FDF4; padding:4px 6px;">Aporta ideas y aprendizaje útil</td></tr>
            </tbody>
          </table>

          <div style="background: #EFF6FF; padding: 10px; border-radius: 6px; font-size: 8.5pt; margin-bottom: 10px;">
            <strong style="color: #0D9488;">MIS 3 CUENTAS QUE MÁS VEO (¿Me acercan o me alejan de Dios?):</strong>
            <div style="margin-top: 6px;">1. ${escapeHtml(getVal('acc-nombre-1')) || '_________'} &nbsp;➔&nbsp; <strong style="color: #1E2B45;">${escapeHtml(getRadio('acc-eval-1')) || 'Sin evaluar'}</strong></div>
            <div style="margin-top: 4px;">2. ${escapeHtml(getVal('acc-nombre-2')) || '_________'} &nbsp;➔&nbsp; <strong style="color: #1E2B45;">${escapeHtml(getRadio('acc-eval-2')) || 'Sin evaluar'}</strong></div>
            <div style="margin-top: 4px;">3. ${escapeHtml(getVal('acc-nombre-3')) || '_________'} &nbsp;➔&nbsp; <strong style="color: #1E2B45;">${escapeHtml(getRadio('acc-eval-3')) || 'Sin evaluar'}</strong></div>
          </div>

          <div style="border: 1.5px solid #0D9488; border-radius: 6px; padding: 10px;">
            <span style="color: #0D9488; font-weight: 800; font-size: 8.5pt;">MIS NOTAS:</span>
            ${renderNotes(getVal('notas-2'))}
          </div>
        </div>

        <!-- =================== SECCIÓN 3 =================== -->
        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 18px; page-break-inside: avoid;">
          <div style="background: #1E2B45; color: #FFFFFF; padding: 8px 12px; border-radius: 6px; font-size: 11pt; font-weight: 800; margin-bottom: 10px;">
            3. DE CONSUMIDOR A CREADOR
          </div>
          
          <div style="background: #EFF6FF; padding: 10px; border-radius: 6px; font-size: 8.5pt; margin-bottom: 10px;">
            <div style="margin-bottom: 4px;"><strong>1. Autenticidad sobre apariencia:</strong> La luz brilla cuando soy real, no cuando finjo.</div>
            <div style="margin-bottom: 4px;"><strong>2. Coherencia digital y presencial:</strong> Lo que soy en redes es igual a lo que soy fuera.</div>
            <div><strong>3. Edificación intencional:</strong> Antes de publicar: ¿esto construye y aporta valor?</div>
          </div>

          <div style="background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 6px; padding: 8px 10px; font-size: 9pt; margin-bottom: 10px;">
            <strong>El pilar que más necesito trabajar es:</strong>
            <span style="color: #D97706; font-weight: 800; margin-left: 6px;">${escapeHtml(getVal('pilar-trabajar')) || 'No especificado'}</span>
          </div>

          <div style="border: 1.5px solid #0D9488; border-radius: 6px; padding: 10px;">
            <span style="color: #0D9488; font-weight: 800; font-size: 8.5pt;">MIS NOTAS:</span>
            ${renderNotes(getVal('notas-3'))}
          </div>
        </div>

        <!-- =================== SECCIÓN 4 =================== -->
        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 18px; page-break-inside: avoid;">
          <div style="background: #1E2B45; color: #FFFFFF; padding: 8px 12px; border-radius: 6px; font-size: 11pt; font-weight: 800; margin-bottom: 10px;">
            4. EMPIEZA CON LO QUE TIENES
          </div>
          
          <div style="background: #1E2B45; color: #FFFFFF; padding: 10px; border-radius: 6px; font-size: 8.5pt; margin-bottom: 10px;">
            <strong style="color: #F59E0B; font-size: 10pt;">NO.</strong> No necesito un estudio ni grandes equipos. Dios usa lo que ya tengo en la mano.
          </div>

          <div style="background: #EFF6FF; padding: 10px; border-radius: 6px; font-size: 8.5pt; margin-bottom: 10px;">
            <div style="margin-bottom: 4px;"><strong>Mi excusa más común es:</strong> <em>${escapeHtml(getVal('excusa-comun')) || 'No especificada'}</em></div>
            <div><strong>Lo que ya tengo en mi mano para empezar:</strong> <strong style="color: #0D9488;">${escapeHtml(getVal('tengo-en-mano')) || 'No especificado'}</strong></div>
          </div>

          <div style="border: 1.5px solid #0D9488; border-radius: 6px; padding: 10px;">
            <span style="color: #0D9488; font-weight: 800; font-size: 8.5pt;">MIS NOTAS:</span>
            ${renderNotes(getVal('notas-4'))}
          </div>
        </div>

        <!-- =================== SECCIÓN 5 =================== -->
        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 10px; page-break-inside: avoid;">
          <div style="background: #1E2B45; color: #FFFFFF; padding: 8px 12px; border-radius: 6px; font-size: 11pt; font-weight: 800; margin-bottom: 10px;">
            5. DESAFÍO DE 5 DÍAS
          </div>
          
          <div style="display: flex; gap: 10px; font-size: 8pt; margin-bottom: 10px;">
            <div style="flex: 1; background: #EFF6FF; padding: 8px; border-radius: 6px;">
              <strong>Creador 1:</strong> ${escapeHtml(getVal('creador-1-nombre')) || '—'} <br>
              <strong>Aprendí:</strong> ${escapeHtml(getVal('creador-1-aprendi')) || '—'}
            </div>
            <div style="flex: 1; background: #EFF6FF; padding: 8px; border-radius: 6px;">
              <strong>Creador 2:</strong> ${escapeHtml(getVal('creador-2-nombre')) || '—'} <br>
              <strong>Aprendí:</strong> ${escapeHtml(getVal('creador-2-aprendi')) || '—'}
            </div>
          </div>

          <!-- Lista de retos -->
          <div style="background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 8px 12px; border-radius: 4px; font-size: 8pt; margin-bottom: 12px;">
            <div>[${isChecked('check-dia-1') ? '✔' : ' '}] <strong>DÍA 1: Limpieza de feed</strong> (Dejo 3 cuentas que me resten paz y sigo 3 que edifiquen)</div>
            <div style="margin-top: 3px;">[${isChecked('check-dia-2') ? '✔' : ' '}] <strong>DÍA 2: Oración e intercesión</strong> (Oro y animo a alguien)</div>
            <div style="margin-top: 3px;">[${isChecked('check-dia-3') ? '✔' : ' '}] <strong>DÍA 3: Mi primera creación</strong> (Preparo testimonio, versículo o reflexión)</div>
            <div style="margin-top: 3px;">[${isChecked('check-dia-4') ? '✔' : ' '}] <strong>DÍA 4: Publicación de luz</strong> (Publico con autenticidad)</div>
            <div style="margin-top: 3px;">[${isChecked('check-dia-5') ? '✔' : ' '}] <strong>DÍA 5: Mensaje de ánimo</strong> (Digo a alguien que Dios lo ama)</div>
          </div>

          <!-- Tarjeta de compromiso -->
          <div style="background: #1E2B45; color: #FFFFFF; padding: 14px; border-radius: 6px; font-size: 8.5pt;">
            <div style="color: #F59E0B; font-weight: 900; font-size: 9.5pt; margin-bottom: 4px;">MI COMPROMISO:</div>
            <div style="margin-bottom: 8px;">Con la ayuda de Dios, durante estos 5 días voy a:</div>
            <div style="border-bottom: 1px solid #64748B; padding-bottom: 4px; margin-bottom: 10px; font-style: italic; color: #FCD34D;">
              ${escapeHtml(getVal('compromiso-texto')) || '(Sin redactar aún)'}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 8pt; color: #CBD5E1;">
              <span><strong>Firma:</strong> ${escapeHtml(getVal('compromiso-firma')) || '_______________'}</span>
              <span><strong>Fecha:</strong> ${escapeHtml(getVal('compromiso-fecha')) || formattedDate}</span>
            </div>
          </div>
        </div>

        <div style="text-align: center; font-size: 7.5pt; color: #64748B; margin-top: 14px; border-top: 1px solid #E2E8F0; padding-top: 8px;">
          Taller Juvenil "Luz en el Feed: Redes Sociales e Influencia con Propósito" • Mateo 5:16
        </div>

      </div>
    `;
  }

  // 6. Generación y Descarga del archivo PDF
  async function downloadNotesAsPdf() {
    if (typeof html2pdf === 'undefined') {
      alert('La herramienta de PDF se está cargando. Por favor, reintenta en unos instantes.');
      return;
    }

    const originalText = btnDownloadText.textContent;
    btnDownloadPdf.disabled = true;
    btnDownloadText.textContent = 'Generando Cuaderno PDF...';

    try {
      const exportWrapper = document.createElement('div');
      exportWrapper.style.position = 'fixed';
      exportWrapper.style.left = '0';
      exportWrapper.style.top = '0';
      exportWrapper.style.width = '750px';
      exportWrapper.style.zIndex = '-9999';
      exportWrapper.style.backgroundColor = '#FFFFFF';
      exportWrapper.innerHTML = buildPdfHtml();
      document.body.appendChild(exportWrapper);

      const target = exportWrapper.firstElementChild;

      const opt = {
        margin: [6, 6, 6, 6],
        filename: 'Mis_Apuntes_Luz_En_El_Feed.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 800
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(target).save();

      if (exportWrapper.parentNode) {
        document.body.removeChild(exportWrapper);
      }
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Ocurrió un error al generar el PDF. Puedes intentar de nuevo o usar la opción imprimir de tu navegador.');
    } finally {
      btnDownloadPdf.disabled = false;
      btnDownloadText.textContent = originalText;
    }
  }

  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', downloadNotesAsPdf);
  }
});
