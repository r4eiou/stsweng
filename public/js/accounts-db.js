function hidePW(role_pw) {

    // console.log(role_pw) 

    var x = document.getElementById(role_pw);
    var eye_icon = document.getElementById("eye-" + role_pw);

    // console.log(eye_icon) 

    if (x.type === "password") {
        x.type = "text";
        eye_icon.innerHTML = "<img src='/images/action-hide.png'>";
    } else {
        x.type = "password";
        eye_icon.innerHTML = "<img src='/images/action-view.png'>";
    }
}

function validateForm() {
    var user_role = localStorage.getItem("userRole").toLowerCase();

    var email_id = user_role + "-email";
    var pw_id = user_role + "-pw";

    const user_email = document.getElementById(email_id);
    const user_pw = document.getElementById(pw_id);
    const confirm_user_pw = document.getElementById(pw_id + "1");

    let valid = true;
    let errorMessage = "";

    if (!user_pw.value) {
        valid = false;
        user_pw.classList.add("input-error");
        errorMessage += "Password is required.\n"
    }
    // password should have at least 8 characters and have at least 1 letter and 1 digit
    else if (user_pw.value.length < 8) {
        valid = false;
        user_pw.classList.add("input-error");
        errorMessage += "Password must have at least 8 characters.\n"
    }
    else if (user_pw.value.search(/[a-z]/i) < 0) {
        valid = false;
        user_pw.classList.add("input-error");
        errorMessage += "Password must contain at least one letter.\n"
    }
    else if (user_pw.value.search(/[0-9]/) < 0) {
        valid = false;
        user_pw.classList.add("input-error");
        errorMessage += "Password must contain at least one digit.\n"
    }
    else if (!(user_pw.value === confirm_user_pw.value)) {
        valid = false;
        user_pw.classList.add("input-error");
        errorMessage += "Passwords do not match.\n"
    }
    else {
        user_pw.classList.remove("input-error");
    }

    if (!user_email.value) {
        valid = false;
        user_email.classList.add("input-error");
        errorMessage += "Email is required.\n"
    }
    else if (!user_email.value.includes("@") || 
        // to check for proper email structure
            !user_email.value.match((/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/))) {
        valid = false;
        user_email.classList.add("input-error");
        errorMessage += "Invalid email.\n"
    }
    else {
        user_email.classList.remove("input-error");
    }

    if(valid) {
        return true;
    } else {
        showModal(errorMessage);
    }

    
}

// for account details (email and password) validation
document.addEventListener("DOMContentLoaded", function() {
    var acc_form = document.querySelector(".acc-info-form");

    if(acc_form) {
        acc_form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
        });
    }

    const TP1 = document.getElementById('togglePassword');
    if (TP1) {
        TP1.addEventListener("click", function() {
            var passwordField = document.getElementById("admin-pw");
            var eye_icon = document.getElementById("eye_con");
            
            if (passwordField.type === "password") {
                passwordField.type = "text";
                eye_icon.src = "/images/action-hide.png";
            } else {
                passwordField.type = "password";
                eye_icon.src = "/images/action-view.png";
            }
        });
    }

    const TP2 = document.getElementById('togglePassword1');
    if (TP2) {
        TP2.addEventListener("click", function() {
            var passwordFieldCP = document.getElementById("admin-pw1");
            var eye_iconCP = document.getElementById("eye_con1");
            
            if (passwordFieldCP.type === "password") {
                passwordFieldCP.type = "text";
                eye_iconCP.src = "/images/action-hide.png";
            } else {
                passwordFieldCP.type = "password";
                eye_iconCP.src = "/images/action-view.png";
            }
        });
    }

    //ADMIN
    const saveButton_A = document.getElementById('saveButtonAdmin');
    if (saveButton_A) {
        saveButton_A.addEventListener('click', function () {

            console.log("checking saveButtonAdmin")

            const form = document.querySelector('.acc-info-form');

            if(validateForm()) {
                form.submit();
            }
        });
    }

    //EMPLOYEE
    const saveButton_E = document.getElementById('saveButtonEmployee');
    if (saveButton_E) {
        
        saveButton_E.addEventListener('click', function () {

            console.log("checking saveButtonEmployee")

            const form = document.querySelector('.acc-info-form');

            if(validateForm()) {
                form.submit();
            }
        });
    }

    //LUPON
    const saveButton_L = document.getElementById('saveButtonLupon');
    if (saveButton_L) {
        
        saveButton_L.addEventListener('click', function () {

            console.log("checking saveButtonLupon")

            const form = document.querySelector('.acc-info-form');

            if(validateForm()) {
                form.submit();
            }
        });
    }

    //LUPON
    const saveButton_T = document.getElementById('saveButtonTanod');
    if (saveButton_T) {
        
        saveButton_T.addEventListener('click', function () {

            console.log("checking saveButtonTanod")

            const form = document.querySelector('.acc-info-form');

            if(validateForm()) {
                form.submit();
            }
        });
    }
});

function showModal(message) {
    const modal = document.getElementById('validationModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeBtn = document.getElementsByClassName('close')[0];

    modalMessage.textContent = message;
    modalMessage.innerHTML = message.replace(/\n/g, '<br>');
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