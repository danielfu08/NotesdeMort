(function () {
  let notesData = {};

  async function loadNotes() {
    // We try multiple relative paths to find notes.json or notas.json
    const targets = ["./notes.json", "../notes.json", "../../notes.json", "./notas.json", "../notas.json", "../../notas.json"];
    for (const url of targets) {
      try {
        const resp = await fetch(url, {cache: "no-store"});
        if (resp.ok) {
          notesData = await resp.json();
          console.log("Loaded notes from:", url);
          return;
        }
      } catch (e) {}
    }
    console.error("Could not load notes.json from any standard location.");
  }

  window.openNoteById = function(noteId) {
    console.log("Opening note:", noteId);
    const note = notesData[noteId];
    if (!note) {
      document.getElementById("noteTitle").innerHTML = noteId || "NOTA DESCONOCIDA";
      document.getElementById("noteText").innerHTML = "No s'ha trobat el contingut d'aquesta nota.";
      document.getElementById("notePopup").style.display = "flex";
      return;
    }
    document.getElementById("noteTitle").innerHTML = note.title || noteId;
    document.getElementById("noteText").innerHTML = note.text || "";
    document.getElementById("notePopup").style.display = "flex";
  };

  window.closeNote = function() {
    document.getElementById("notePopup").style.display = "none";
  };

  function bindClickableNotes() {
    const nodes = document.querySelectorAll('.clickable');
    nodes.forEach(node => {
      node.removeEventListener('click', clickableHandler);
      node.addEventListener('click', clickableHandler);
    });
  }

  function clickableHandler(evt) {
    let ent = evt.target;
    // Walk up the tree to find the element with an ID (max 6 levels as per user request)
    for (let i=0; i<6 && ent && !ent.id; i++) ent = ent.parentNode;
    const id = ent && ent.id ? ent.id : null;
    
    if (id) {
        // If it's a known note in the JSON, we open it
        if (notesData[id]) {
            openNoteById(id);
            // We don't stop propagation here to avoid breaking other logic, 
            // unless the user specifically wants to.
        } else if (id.startsWith('note')) {
            // If the ID starts with 'note' but isn't in JSON, still open to show 'not found'
            openNoteById(id);
        }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadNotes().then(() => {
        bindClickableNotes();
        // A-Frame dynamic loading support
        const scene = document.querySelector('a-scene');
        if (scene) {
            if (scene.hasLoaded) bindClickableNotes();
            else scene.addEventListener('loaded', bindClickableNotes);
        }
    });

    const popup = document.getElementById("notePopup");
    if (popup) {
      popup.addEventListener("click", function(e) {
        if (e.target === this) closeNote();
      });
    }
  });

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeNote();
  });

})();
