/**
 * LUZ EN EL FEED - Bloc de Notas Digital
 * Lógica de la aplicación: Auto-expansión, Auto-guardado y Generación de PDF
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const studentNameInput = document.getElementById('student-name');
    const dateDisplay = document.getElementById('current-date-display');
    const autosaveStatus = document.getElementById('autosave-status');
    const btnDownloadPdf = document.getElementById('btn-download-pdf');
    const btnDownloadText = document.getElementById('btn-download-text');
    const pdfTemplate = document.getElementById('pdf-export-template');

    // Textareas
    const textareas = {
        diagnostico: document.getElementById('note-diagnostico'),
        consumo: document.getElementById('note-consumo'),
        creador: document.getElementById('note-creador'),
        reflexiones: document.getElementById('note-reflexiones')
    };

    const STORAGE_KEY = 'luz_en_el_feed_apuntes_v1';

    // 1. Inicializar fecha actual en español
    function initDate() {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = today.toLocaleDateString('es-ES', options);
        if (dateDisplay) {
            dateDisplay.textContent = `Fecha: ${dateStr}`;
        }
        return dateStr;
    }

    const formattedDate = initDate();

    // 2. Auto-expansión de las áreas de texto
    function autoResize(textarea) {
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.max(textarea.scrollHeight, 120)}px`;
    }

    Object.values(textareas).forEach(ta => {
        if (!ta) return;
        ta.addEventListener('input', () => {
            autoResize(ta);
            saveToStorage();
        });
    });

    // 3. Guardado Automático en LocalStorage (para no perder apuntes)
    let saveTimeout = null;
    function saveToStorage() {
        clearTimeout(saveTimeout);
        if (autosaveStatus) {
            autosaveStatus.textContent = 'Guardando...';
            autosaveStatus.style.color = '#D97706';
        }

        saveTimeout = setTimeout(() => {
            const data = {
                name: studentNameInput ? studentNameInput.value : '',
                diagnostico: textareas.diagnostico ? textareas.diagnostico.value : '',
                consumo: textareas.consumo ? textareas.consumo.value : '',
                creador: textareas.creador ? textareas.creador.value : '',
                reflexiones: textareas.reflexiones ? textareas.reflexiones.value : '',
                lastUpdated: new Date().toISOString()
            };

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                if (autosaveStatus) {
                    autosaveStatus.textContent = 'Borrador guardado';
                    autosaveStatus.style.color = '#10B981';
                }
            } catch (err) {
                console.warn('No se pudo guardar en almacenamiento local:', err);
            }
        }, 400);
    }

    // Cargar datos previos si existen
    function loadFromStorage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;
            const data = JSON.parse(saved);

            if (studentNameInput && data.name) {
                studentNameInput.value = data.name;
            }
            if (textareas.diagnostico && data.diagnostico) {
                textareas.diagnostico.value = data.diagnostico;
            }
            if (textareas.consumo && data.consumo) {
                textareas.consumo.value = data.consumo;
            }
            if (textareas.creador && data.creador) {
                textareas.creador.value = data.creador;
            }
            if (textareas.reflexiones && data.reflexiones) {
                textareas.reflexiones.value = data.reflexiones;
            }

            // Reajustar alturas de los textareas
            Object.values(textareas).forEach(ta => autoResize(ta));
        } catch (err) {
            console.warn('Error al cargar datos previos:', err);
        }
    }

    if (studentNameInput) {
        studentNameInput.addEventListener('input', saveToStorage);
    }

    loadFromStorage();

    // Función auxiliar para escapar texto en HTML y prevenir inyecciones
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 4. Preparar el HTML estructurado para el PDF
    function buildPdfHtml() {
        const participantName = (studentNameInput && studentNameInput.value.trim())
            ? escapeHtml(studentNameInput.value.trim())
            : 'Participante';

        const getNoteHtml = (val) => {
            if (!val || !val.trim()) {
                return '<p class="pdf-content-empty"><em>(Sin notas registradas en esta sección)</em></p>';
            }
            return `<div class="pdf-content-box">${escapeHtml(val.trim())}</div>`;
        };

        return `
      <div class="pdf-export-container">
        <!-- Encabezado del documento PDF -->
        <div class="pdf-header">
          <span class="pdf-badge">Taller Juvenil Cristiano</span>
          <h1 class="pdf-title">LUZ EN EL FEED</h1>
          <p class="pdf-subtitle">Redes Sociales e Influencia con Propósito</p>
          <div class="pdf-verse-box">
            <span class="pdf-verse-text">«Así alumbre vuestra luz delante de los hombres.»</span>
            <span class="pdf-verse-ref">— Mateo 5:16</span>
          </div>
        </div>

        <!-- Metadatos de la persona -->
        <div class="pdf-meta-box">
          <div><strong>Participante:</strong> <span class="pdf-participant-name">${participantName}</span></div>
          <div class="pdf-date"><strong>Fecha:</strong> ${formattedDate}</div>
        </div>

        <!-- Secciones de apuntes -->
        <div class="pdf-section">
          <div class="pdf-section-header">
            <span class="pdf-sec-title">1. Mi Diagnóstico Digital</span>
            <span class="pdf-sec-subtitle">(¿Soy influenciador o consumidor?)</span>
          </div>
          ${getNoteHtml(textareas.diagnostico ? textareas.diagnostico.value : '')}
        </div>

        <div class="pdf-section">
          <div class="pdf-section-header">
            <span class="pdf-sec-title">2. Lo que consumo me moldea</span>
            <span class="pdf-sec-subtitle">(Lo que entra por mis ojos y oídos define mi corazón)</span>
          </div>
          ${getNoteHtml(textareas.consumo ? textareas.consumo.value : '')}
        </div>

        <div class="pdf-section">
          <div class="pdf-section-header">
            <span class="pdf-sec-title">3. De consumidor a creador</span>
            <span class="pdf-sec-subtitle">(Usa tus redes para impactar vidas con propósito)</span>
          </div>
          ${getNoteHtml(textareas.creador ? textareas.creador.value : '')}
        </div>

        <div class="pdf-section">
          <div class="pdf-section-header">
            <span class="pdf-sec-title">4. Mis Notas y Reflexiones</span>
            <span class="pdf-sec-subtitle">(Apuntes libres, versículos clave y compromisos)</span>
          </div>
          ${getNoteHtml(textareas.reflexiones ? textareas.reflexiones.value : '')}
        </div>

        <!-- Pie de página del documento -->
        <div class="pdf-footer">
          Taller Juvenil "Luz en el Feed: Redes Sociales e Influencia con Propósito" • Mateo 5:16
        </div>
      </div>
    `;
    }

    // 5. Generación y Descarga del PDF
    async function downloadNotesAsPdf() {
        // Verificar que la librería html2pdf esté cargada
        if (typeof html2pdf === 'undefined') {
            alert('La librería para generar el PDF aún se está cargando. Por favor, intenta de nuevo en unos segundos.');
            return;
        }

        const nameVal = studentNameInput ? studentNameInput.value.trim() : '';
        if (!nameVal) {
            const confirmContinue = confirm('No has escrito tu nombre en el campo de identificación.\n\n¿Deseas descargar los apuntes de todas formas?');
            if (!confirmContinue) {
                studentNameInput.focus();
                return;
            }
        }

        // Estado visual del botón durante la generación
        const originalText = btnDownloadText.textContent;
        btnDownloadPdf.disabled = true;
        btnDownloadText.textContent = 'Generando PDF...';

        try {
            // Crear contenedor en coordenadas seguras (0,0) detrás de la vista para que html2canvas capture todo fielmente sin importar el scroll
            const exportWrapper = document.createElement('div');
            exportWrapper.style.position = 'fixed';
            exportWrapper.style.left = '0';
            exportWrapper.style.top = '0';
            exportWrapper.style.width = '760px';
            exportWrapper.style.zIndex = '-9999';
            exportWrapper.style.backgroundColor = '#FFFFFF';
            exportWrapper.innerHTML = buildPdfHtml();
            document.body.appendChild(exportWrapper);

            const targetElement = exportWrapper.firstElementChild;

            const opt = {
                margin: [10, 10, 10, 10], // mm
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

            // Generar y descargar el PDF
            await html2pdf().set(opt).from(targetElement).save();

            // Limpiar elemento temporal
            if (exportWrapper.parentNode) {
                document.body.removeChild(exportWrapper);
            }

        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Ocurrió un error al generar el PDF. Por favor, intenta nuevamente o utiliza la función de imprimir de tu navegador.');
        } finally {
            btnDownloadPdf.disabled = false;
            btnDownloadText.textContent = originalText;
        }
    }

    if (btnDownloadPdf) {
        btnDownloadPdf.addEventListener('click', downloadNotesAsPdf);
    }
});
