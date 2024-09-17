document.addEventListener("DOMContentLoaded", function() {
    function toggleDarkPage() {
        document.documentElement.style.background = "url(/images/bg-dark.png) no-repeat center center fixed";
        document.documentElement.style.backgroundSize = "cover";
        document.documentElement.style.WebkitBackgroundSize = "cover"; // For older WebKit-based browsers
        document.documentElement.style.MozBackgroundSize = "cover"; // For older Mozilla-based browsers
        document.documentElement.style.OBackgroundSize = "cover"; // For older Opera browsers
        document.getElementById("header").style.background = "#004112";
        document.getElementById("logout-btn").style.setProperty("--logout-hover-bg", "#1C8A3B");
    }

    function toggleLightPage() {
        document.documentElement.style.background = "url(/images/bg-light.png) no-repeat center center fixed";
        document.documentElement.style.backgroundSize = "cover";
        document.documentElement.style.WebkitBackgroundSize = "cover"; // For older WebKit-based browsers
        document.documentElement.style.MozBackgroundSize = "cover"; // For older Mozilla-based browsers
        document.documentElement.style.OBackgroundSize = "cover"; // For older Opera browsers
        document.getElementById("header").style.background = "#004112";
        document.getElementById("logout-btn").style.setProperty("--logout-hover-bg", "#1C8A3B");
    }

    var isLogin = false;

    function initializePage() {
        if (document.querySelector(".login-panel")){
            // remove current stored user role 
            logout();

            isLogin = true;

            // hide User Profile portion and Logout button
            document.getElementById("profile-text").classList.add("hide");
            document.getElementById("profile-img").classList.add("hide");
            document.getElementById("logout-btn").classList.add("hide");
            
            if (document.title == "Barangay Parang - Initial Login Page")
                document.documentElement.style.background = "url(/images/bg-light.png) no-repeat center center fixed";
            else
                document.documentElement.style.background = "url(/images/bg-light.png) no-repeat center center fixed";

            // set background to light
            document.documentElement.style.backgroundSize = "cover";
            document.documentElement.style.WebkitBackgroundSize = "cover"; // For older WebKit-based browsers
            document.documentElement.style.MozBackgroundSize = "cover"; // For older Mozilla-based browsers
            document.documentElement.style.OBackgroundSize = "cover"; // For older Opera browsers   
            document.getElementById("header").style.background = "#004112";
            document.getElementById("logout-btn").style.setProperty("--logout-hover-bg", "#1C8A3B");
        }
        else if (document.querySelector(".search-page") || document.querySelector("#view-case-page") ||
                (document.querySelector(".tanod-lupon-db-table")) || (document.querySelector(".accts-db-table")) || 
                (document.querySelector(".cert-db-table")) || (document.querySelector("#acct-indiv-view"))){
            toggleLightPage();
            // console.log("toggled light");
        } else {
            // console.log("toggled dark");
            toggleDarkPage();
        }

        if (getCurrentUserRole()) {
            // console.log("Found User Role:" + getCurrentUserRole());
            updateUser(getCurrentUserRole());
        }
    }

    // Codes for changing the header user dynamically depending on who is logged in
    // improved previous hardcoded solution

    function logout() {
        localStorage.removeItem('userRole');
    }

    function updateUser(userRole) {
        // console.log("Updating user" + userRole);
        const user_role = document.getElementById("profile-text");

        if (user_role) {
            user_role.textContent = userRole;

            document.getElementById("profile-text").classList.remove("hide");
            document.getElementById("profile-img").classList.remove("hide");
            document.getElementById("logout-btn").classList.remove("hide");

            var user_profile = document.getElementById("profile-img");
            var home_link1 = document.getElementById("home-link1");
            var home_link2 = document.getElementById("home-link2");

            // console.log("Found user_role: " + userRole);
            switch(userRole) {
                case "Lupon":
                    document.getElementById("profile-text").style.color="#F3BE72";
                    user_profile.src = "/images/lupon-profile.png";
                    home_link1.href = "/lupon-home";
                    home_link2.href = "/lupon-home";
                    break;
    
                case "Tanod":
                    document.getElementById("profile-text").style.color="#AFE1D7";
                    user_profile.src = "/images/tanod-profile.png";
                    home_link1.href = "/tanod-home";
                    home_link2.href = "/tanod-home";
                    break;
    
                case "Employee":
                    document.getElementById("profile-text").style.color="#779FE5";
                    user_profile.src = "/images/employee-profile.png";
                    home_link1.href = "/employee-home";
                    home_link2.href = "/employee-home";
                    break;
    
                case "Admin":
                    document.getElementById("profile-text").style.color="#F07507";
                    user_profile.src = "/images/admin-profile.png";
                    home_link1.href = "/admin-homepage";
                    home_link2.href = "/admin-homepage";
                    break;
                default:
                    document.getElementById("profile-text").style.color="#FFFFFF";
                    user_profile.src = "/images/logo.png";
                    home_link1.href = "/index";
                    home_link2.href = "/index";

                    // hide profile if no user
                    document.getElementById("profile-text").classList.add("hide");
                    document.getElementById("profile-img").classList.add("hide");
                    document.getElementById("logout-btn").classList.add("hide");
            }
        }
    }

    function getCurrentUserRole() {
        return fetch('/api/getUserRole')
            .then(response => response.json())
            .then(data => {
                return data.userRole; // Return the userRole from the response
            })
            .catch(error => {
                console.error('Error:', error);
                return ""; // Return a default value in case of error
            });
    }

    getCurrentUserRole().then(userRole => {
        if (userRole) {
            // console.log("Found User Role: " + userRole);
            updateUser(userRole);
        }
    }).catch(error => {
        console.error('Error:', error);
    });

    const userRole = getCurrentUserRole();
    updateUser(userRole);
    
    initializePage();

    // for logout btn
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(){
            window.location.href="/logout";
        });
    }
});
