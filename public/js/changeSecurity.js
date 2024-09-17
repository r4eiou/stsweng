document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("securityQuestionModal");
    var openModalButton = document.getElementById("changeSQLink");
    var closeButton = document.getElementsByClassName("close")[0];

    var submitButton = document.getElementById("submitNewQuestion");

    // Open modal
    if(openModalButton) {
        openModalButton.onclick = function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            modal.style.display = "block";
        };
    }

    // Close modal when clicking on close button
    if(closeButton) {
        closeButton.onclick = function() {
            modal.style.display = "none";
            document.getElementById("newQuestion").value = "";
            document.getElementById("newAnswer").value = "";
        };
    }

    // Close modal when clicking outside of modal
    // window.onclick = function(event) {
    //     if (event.target == modal) {
    //         modal.style.display = "none";
    //     }
    // };
    
    // Handle submit button click
    if(submitButton) {
        submitButton.onclick = function() {
            // console.log("button working")
            var newQuestion = document.getElementById("newQuestion").value;
            var newAnswer = document.getElementById("newAnswer").value;
            
            // console.log(newQuestion)
            // console.log(newAnswer)

            if (!newQuestion || !newAnswer) {
                alert("Both the new security question and answer are required.");
                return;
            }

            fetch('/submit-new-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Question: newQuestion,
                    Answer: newAnswer
                })
            })
            .then(response => response.json())
            .then(data => {
                // Handle response from the server
                if (data.success) {
                    window.location.href = "/admin-accounts-db-view"
                    alert('Changed successfully!');
                } else {
                    alert('Failed to update security question. Please try again.');
                }
            })
            .catch(error => console.error('Error:', error));

            modal.style.display = "none";
        };
    }
});