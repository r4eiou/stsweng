$(document).ready(function() {
    // Event listener when email input loses focus (blur event)
    $('#email').on('blur', function() {
        const email = $(this).val();
        
        if (email) {
            // Make AJAX call to check user role
            $.ajax({
                url: '/check-user-role', // API route to check role
                method: 'POST',
                data: { email: email },
                success: function(response) {
                    if (response.role === 'admin') {
                        // Show the forgot password link if admin
                        $('#forgotPassword').show();
                    } else {
                        // Hide if not admin
                        $('#forgotPassword').hide();
                    }
                },
                error: function(err) {
                    console.error('Error checking user role:', err);
                }
            });
        }
    });

    //FOR MODAL
    $('#forgotPassword').on('click', function(e) {
        e.preventDefault(); // Prevent default link behavior

        // Simply open the modal
        $('#forgotPasswordModal').css('display', 'block');
    });

    // Handle close button in the modal
    $('.close').on('click', function() {
        $('#forgotPasswordModal').css('display', 'none'); // Hide the modal when close is clicked
    });

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