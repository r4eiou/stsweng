document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("forgotPasswordModal");
    var btn = document.getElementById("forgot-password");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById("submitAnswer").onclick = function() {
        var answer = document.getElementById("securityAnswer").value;
        
        fetch('/check-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ answer: answer })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "/admin-accounts-db-view-security"
            } else {
                alert('Incorrect answer.');
            }
        })
        .catch(error => console.error('Error:', error));

        modal.style.display = "none";
    }
});