let notesData = {};

function createNotePopup() {
  const popupHTML = `
    <div id="notePopup" style="
      display:none;
      position:fixed;
      top:0; left:0;
      width:100%; height:100%;
      background:rgba(0,0,0,0.85);
      justify-content:center;
      align-items:center;
      z-index:9999;
      font-family:'Special Elite', monospace;">
      <div id="notePopupInner" style="
        max-width:620px;
        padding:50px;
        border:1px solid #2a2a2a;
        background:rgba(10,10,10,0.95);
        color:#cfcfcf;
        text-align:center;
        box-shadow:0 0 40px rgba(0,0,0,0.9);">
        <h1 id="noteTitle" style="letter-spacing:4px;">NOTA ███</h1>
        <p id="noteText">Aquí irá el texto de la nota.</p>
        <button onclick="closeNote()" style="
          margin-top:20px;
          background:none;
          color:#cfcfcf;
          border:1px solid #444;
          padding:12px 25px;
          cursor:pointer;">Tancar</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHTML);
}

async function loadNotes() {
  try {
    // Intentar cargar desde ../ o desde ./ (para el root)
    let response = await fetch('../notas.json');
    if (!response.ok) {
      response = await fetch('../notas.json');
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    notesData = await response.json();
    console.log('Notas cargadas:', notesData);
  } catch (error) {
    console.error('Error al cargar notas.json:', error);
  }
}

function openNote(noteId) {
  const note = notesData[noteId];
  if (note) {
    document.getElementById('noteTitle').innerText = note.title;
    document.getElementById('noteText').innerText = note.text;
    document.getElementById('notePopup').style.display = 'flex';
  } else {
    console.warn(`Nota con ID ${noteId} no encontrada.`);
  }
}

function closeNote() {
  document.getElementById('notePopup').style.display = 'none';
}

function attachClickHandlers() {
  const clickableEntities = document.querySelectorAll('.clickable');
  clickableEntities.forEach(entity => {
    const noteId = entity.getAttribute('data-note-id');
    if (noteId) {
      entity.addEventListener('click', () => openNote(noteId));
    }
  });
}

// Event listeners para cerrar el popup
document.addEventListener('DOMContentLoaded', () => {
  createNotePopup();
  loadNotes().then(() => {
    // Attach handlers after notes are loaded and popup is created
    attachClickHandlers();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.getElementById('notePopup').style.display === 'flex') {
      closeNote();
    }
  });

  document.getElementById('notePopup').addEventListener('click', (event) => {
    if (event.target.id === 'notePopup') {
      closeNote();
    }
  });
});

window.openNote = openNote;
window.closeNote = closeNote;
