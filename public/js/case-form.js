document.addEventListener("DOMContentLoaded", function() {

    var dateInput = document.querySelector("#dateInput");

    if (dateInput) {
        // sets date max to current date in the format mm/dd/yyyy
        dateInput.max = new Date().toLocaleDateString('fr-ca');

        // sets date minimum to January 1, 1970
        dateInput.min = "1970-01-01";
    }

    // autocapitalizes middle initial inputs
    document.querySelectorAll('.middle-name-input').forEach(function(mid_initial) {
        mid_initial.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    });

    // capitalizes first character of first and last names after each space
    document.querySelectorAll('.first-name-input').forEach(function(first_name) {
        first_name.addEventListener('input', function() {
            this.value = capitalizeName(this.value);
        });
    });

    document.querySelectorAll('.last-name-input').forEach(function(last_name) {
        last_name.addEventListener('input', function() {
            this.value = capitalizeName(this.value);
        });
    });

    //TANOD
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', function () {

            console.log("checking saveButton")

            if(checkChangesEdit()){
                const form = document.querySelector('.case-form');
                form.submit();
            }
        });
    }

   

    const discardButton = document.getElementById('discardButton');
    if(discardButton) {
        discardButton.addEventListener('click', function () {

            console.log("checking discardButton")

            discardChanges();
            window.location.href = '/admin-tanod-db-view';
        });
    }
    
    const createSumbitBtn = document.getElementById('create-submit-btn');
    if(createSumbitBtn) {
        createSumbitBtn.addEventListener('click', function () {
            const form = document.querySelector('.case-form');
            if (form == null) {
                const errorMessage = 'Form not found.';
                showModal(errorMessage);
            } else {
                const inputs = form.querySelectorAll('input, textarea, select');
                let formIsValid = true;

                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        formIsValid = false;
                    }
                });

                if (!formIsValid) {
                    const errorMessage = 'All inputs are required.';
                    showModal(errorMessage);
                } else {
                     // Check for duplicate EntryNo
                     const entryNoInput = form.querySelector('input[name="EntryNo"]');
                     const entryNo = entryNoInput.value.trim();
                     fetch('/check-entryno', {
                         method: 'POST',
                         headers: {
                             'Content-Type': 'application/json'
                         },
                         body: JSON.stringify({ EntryNo: entryNo })
                     })
                     .then(response => response.json())
                     .then(result => {
                         if (result.exists) {
                             showModal('Entry Number already exists.');
                         } else {
                             form.submit();
                         }
                     })
                     .catch(error => {
                         console.error('Error:', error);
                         showModal('An error occurred while checking the Entry Number. Please try again.');
                     });
                }
            }
        });
    }

    //LUPON
    const saveButtonLupon = document.getElementById('saveButtonLupon');
    if (saveButtonLupon) {
        saveButtonLupon.addEventListener('click', function () {

            console.log("checking saveButton")

            if(checkChangesEdit()){
                const form = document.querySelector('.case-form');
                form.submit();
            }
        });
    }



    const discardButtonLupon = document.getElementById('discardButtonLupon');
    if(discardButtonLupon) {
        discardButtonLupon.addEventListener('click', function () {

            console.log("checking discardButton")

            discardChanges();
            window.location.href = '/admin-lupon-db-view';
        });
    }

    const createSumbitBtnLupon = document.getElementById('create-submit-btn-lupon');
    if(createSumbitBtnLupon) {
        createSumbitBtnLupon.addEventListener('click', function () {
            const form = document.querySelector('.case-form');
            if (form == null) {
                const errorMessage = 'Form not found.';
                showModal(errorMessage);
            } else {
                const inputs = form.querySelectorAll('input, textarea, select');
                let formIsValid = true;

                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        formIsValid = false;
                    }
                });

                if (!formIsValid) {
                    const errorMessage = 'All inputs are required.';
                    showModal(errorMessage);
                } else {
                    form.submit();
                }
            }
        });
    }
});

function capitalizeName(name) {
    var name_split = name.toLowerCase().split(' ');

    for (var i = 0; i < name_split.length; i++) {
        name_split[i] = name_split[i].charAt(0).toUpperCase() + name_split[i].substring(1);     
    }
    return name_split.join(' '); 
}

function checkChanges() {
    // Get all input fields
    let inputs = document.querySelectorAll('input[type="text"], textarea');

    // Loop through each input field
    inputs.forEach(input => {
        // Check if the input field value is different from its placeholder
        if (input.value === "") {
            input.value = input.placeholder; // If value is empty, restore the placeholder
        }
    });
}

function checkChangesEdit() {
    const requiredFields = document.querySelectorAll('.case-form input, .case-form select, .case-form textarea');
    let allFilled = true;

    requiredFields.forEach(field => {
        if (field.value.trim() === '') {
            allFilled = false;   
        }
    });

    if (!allFilled) {
        alert('Please fill out all the fields.');
    }

    return allFilled;
}

function discardChanges() {
    // Get all input fields
    let inputs = document.querySelectorAll('input[type="text"], textarea');

    // Loop through each input field
    inputs.forEach(input => {
        input.value = input.placeholder;
    });
}

function showModal(message) {
    const modal = document.getElementById('validationModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeBtn = document.getElementsByClassName('close')[0];
    const formattedMessage = message
        .replace(/required/g, '<span style="color: red;">required</span>')
        .replace(/Invalid/g, '<span style="color: red;">Invalid</span>');

    modalMessage.innerHTML = formattedMessage.replace(/\n/g, '<br>');
    modal.style.display = 'block';

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}