document.addEventListener("DOMContentLoaded", () => {
    //links for active tags
    const btn = document.querySelector(".btn");
    const board = document.querySelector(".mainDiv");

    //constructor for the note object
    function Note(notes, x, y) {
        this.notes = notes;
        this.x = x;
        this.y = y;
    }

    //array for saving notes
    let noteData = JSON.parse(localStorage.getItem("newDiv")) || [];
    updateMarkup();

    //creating notes function
    function updateMarkup() {
        board.innerHTML = '';
        noteData.forEach((item, index) => {
            board.append(createOneNoteMarkup(item, index));
        });
    }

    //function for creating a one note object
    function createOneNoteMarkup(note, index) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("note-style");
        newDiv.style.left = note.x + 'px';
        newDiv.style.top = note.y + 'px';

        // create a div with fa-sticky-note icon
        const addNoteFa = document.createElement("i");
        addNoteFa.classList.add("fas", "fa-sticky-note", "fa-3x");

        // create a textarea field on button click
        addNoteFa.onclick = () => {
            createTextArea(newDiv, note, addNoteFa);
        }

        // create a delete button
        const deleteBtn = document.createElement("div");
        const deleteBtnP = document.createElement("p");
        deleteBtn.className = "deleteBtn";
        deleteBtnP.textContent = "+";
        deleteBtn.append(deleteBtnP);
        newDiv.append(deleteBtn, addNoteFa);

        // check if there is some data inside note
        if (note.notes) {
            createTextArea(newDiv, note, addNoteFa);
        }

        // delete note on click
        deleteBtn.onclick = function() {
            noteData.splice(index, 1);
            localStorage.setItem("newDiv", JSON.stringify(noteData));

            updateMarkup();
        }

        //drag'n'drop functionality
        newDiv.onmousedown = function(event) {
            let shiftX = event.clientX - newDiv.getBoundingClientRect().left;
            let shiftY = event.clientY - newDiv.getBoundingClientRect().top;
            //shiftX, shiftY - position of pointer in the note
            newDiv.style.zIndex = 1000;

            moveAt(event.pageX, event.pageY);

            function moveAt(pageX, pageY) {
                newDiv.style.left = pageX - shiftX + 'px';
                newDiv.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            newDiv.onmouseup = function() {
                note.x = newDiv.getBoundingClientRect().left;
                note.y = newDiv.getBoundingClientRect().top;

                document.removeEventListener('mousemove', onMouseMove);
                newDiv.onmouseup = null;

                localStorage.setItem("newDiv", JSON.stringify(noteData));
            };
        };

        //drag'n'drop cancelation function from browser
        newDiv.ondragstart = function() {
            return false;
        };

        return newDiv;
    }

    //add note in random place 
    btn.onclick = function() {
        let randomX = Math.floor(Math.random() * (board.offsetWidth - 200));
        let randomY = Math.floor(Math.random() * (board.offsetHeight - 200));
        let newUserNote = new Note("", randomX, randomY);
        noteData.push(newUserNote);

        localStorage.setItem("newDiv", JSON.stringify(noteData));

        updateMarkup();
    }

    // function to create a text area
    function createTextArea(newDiv, note, addNoteFa) {
        let txtArea = document.createElement("TEXTAREA");
        txtArea.setAttribute("cols", 25);
        txtArea.setAttribute("rows", 6);
        txtArea.setAttribute("autofocus", "");
        txtArea.value = note.notes;
        addNoteFa.classList.add("hidden");
        newDiv.append(txtArea);

        //grad the value from the text area field and save it to the localStorage
        txtArea.onkeyup = () => {
            let noteTxt = newDiv.querySelector("textarea");
            note.notes = noteTxt.value;

            localStorage.setItem("newDiv", JSON.stringify(noteData));
        }
    }
})