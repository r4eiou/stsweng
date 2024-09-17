document.addEventListener("DOMContentLoaded", function() {
    var login_form = document.querySelector(".login-form");

    login_form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // TODO: form validation here
        
        var selectedView = document.getElementById("login-title").innerHTML;
        // var redirectUrl;

        // console.log(selectedView);

        // const user_email = document.getElementById("email");
        // const user_pw = document.getElementById("pw");

        // user_email.classList.remove("input-error");
        // user_pw.classList.remove("input-error");

        // let valid = true;
        // let errorMessage = "";
        
        // if (!user_pw.value) {
        //     valid = false;
        //     user_pw.classList.add("input-error");
        //     errorMessage += "Password is required.\n"
        // }
        // else {
        //     user_pw.classList.remove("input-error");
        // }

        // if (!user_email.value) {
        //     valid = false;
        //     user_email.classList.add("input-error");
        //     errorMessage += "Email is required.\n"
        // }
        // else if (!user_email.value.includes("@")) {
        //     valid = false;
        //     user_email.classList.add("input-error");
        //     errorMessage += "Invalid email.\n"
        // }
        // else {
        //     user_email.classList.remove("input-error");
        // }

        if(true) {
            switch (selectedView) {
                case "Employee Log-in:":
                    //redirectUrl = "employee-homepage.html";
                    login("Employee");
                    break;
                case "Administrator Log-in:":
                    //redirectUrl = "admin-homepage.html";
                    login("Admin");
                    break;
                case "Tanod Log-in:":
                    //redirectUrl = "tanod-homepage.html";
                    login("Tanod");
                    break;
                case "Lupon Log-in:":
                    //redirectUrl = "lupon-homepage.html";
                    login("Lupon");
                    break;
                default:
                    //redirectUrl = "employee-homepage.html";
                    login("Employee");
            }
                login_form.submit();
            //window.location.href = redirectUrl;
        } else {
            // showModal(errorMessage);
        }
    });
});

// function showModal(message) {
//     const modal = document.getElementById('validationModal');
//     const modalMessage = document.getElementById('modalMessage');
//     const closeBtn = document.getElementsByClassName('close')[0];
    
//     modalMessage.textContent = message;
//     modalMessage.innerHTML = message.replace(/\n/g, '<br>');
//     modal.style.display = 'block';

//     closeBtn.onclick = function() {
//         modal.style.display = 'none';
//     }

//     window.onclick = function(event) {
//         if (event.target === modal) {
//             modal.style.display = 'none';
//         }
//     }
// }
    
function tanodView() {
    document.getElementById("emp-panel").style.background = "#AFE1D7";
    document.getElementById("login-title").innerHTML = "Tanod Log-in:"
    document.getElementById("login-title").style.color = "black";
    document.getElementById("emp-lupon-tanod-btns").style.display = "none";
   //  document.getElementById("submit-link").href = "tanod-homepage.html";
}

function luponView() {
    document.getElementById("emp-panel").style.background = "#F3BE72";
    document.getElementById("login-title").innerHTML = "Lupon Log-in:"
    document.getElementById("login-title").style.color = "black";
    document.getElementById("emp-lupon-tanod-btns").style.display = "none";
    // document.getElementById("submit-link").href = "lupon-homepage.html";
}

function employeeView() {
    if (document.getElementById("login-title").innerHTML == "Employee Log-in:") {
        window.location.href = "../index.html";
    }
    else {
        document.getElementById("emp-panel").style.background = "#779FE5";
        document.getElementById("login-title").innerHTML = "Employee Log-in:"
        document.getElementById("login-title").style.color = "white";
        document.getElementById("emp-lupon-tanod-btns").style.display = "flex";
        // document.getElementById("submit-link").href = "employee-homepage.html";
    }
}

function login(userRole) {
    localStorage.setItem('userRole', userRole);
}