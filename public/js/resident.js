document.addEventListener("DOMContentLoaded", function() {
    var dateInput = document.querySelector("#birthdateInput");
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

    const createRecordBtnEmployee = document.getElementById('create-resident-record-employee');
    if (createRecordBtnEmployee) {
        createRecordBtnEmployee.addEventListener('click', function () {
            const form = document.querySelector('#case-form-employee_resident');
            
            // Check if the form exists
            if (form == null) {
                const errorMessage = 'Form not found.';
                showModal(errorMessage);
            } else {
                const inputs = form.querySelectorAll('input, textarea, select');
                let formIsValid = true;
                let isAnyFieldEmpty = false;

                // Validate each input
                inputs.forEach(input => {
                    if (input.required && input.id !== 'middleInitial' && input.id !== 'respondent-service-request-no' && !input.value) {
                        isAnyFieldEmpty = true; 
                    }

                    if (input.id === 'email') {
                        const emailValue = input.value;
                        if (emailValue && !emailValue.includes('@')) {
                            formIsValid = false;
                            input.classList.add('error'); // Add error for invalid email
                            showModal('Please enter a valid email address.');
                        } else {
                            input.classList.remove('error'); // Remove error if valid
                        }
                    }
                });

                // Check if the image source is empty
                const imgElement = document.getElementById('deets-profile-img');
                const imgSrc = imgElement ? imgElement.src : '';                //needs to be checked again
                if (imgSrc === 'http://localhost:3000/images/customer.png' || 'https://brgy-parang-wfqm.onrender.com/images/customer.png') {
                    formIsValid = false;
                    showModal('Please upload an image.'); 
                }

                if (isAnyFieldEmpty) {
                    formIsValid = false;
                    showModal('All fields must be filled out.'); // Show message for missing fields
                }

                // Proceed if the form is valid
                if (formIsValid) {
                    // Capture the image source
                    const imgElement = document.getElementById('deets-profile-img');
                    const imgSrc = imgElement ? imgElement.src : ''; 
    
                    const residentData = {
                        img: imgSrc,
                        FirstName: form.querySelector('#firstName').value,
                        MiddleInitial: form.querySelector('#middleInitial').value,
                        LastName: form.querySelector('#lastName').value,
                        Age: form.querySelector('#age').value,
                        Email: form.querySelector('#email').value,
                        Birthday: form.querySelector('#birthdateInput').value,
                        Sex: form.querySelector('#sex').value,
                        Address: form.querySelector('#case-type').value,
                        isSeniorCitizen: form.querySelector('#seniorCitizen').value,
                        ContactNo: form.querySelector('#contactNo').value,
                        CivilStatus: form.querySelector('#civilStatus').value,
                        NoOfResident: form.querySelector('#noOfResident').value,
                        HousingInfo: form.querySelector('#housingInfo').value,
                        ServiceRequestID: form.querySelector('#respondent-service-request-no').value || null,
                    };
    
                    // Send residentData to the server
                    fetch('/submit-resident-employee', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(residentData),
                    })
                    .then(response => {
                        if (response.ok) {
                            // Handle success
                            window.location.href = '/employee-resident-db';
                        } else {
                            // Handle error
                            return response.json().then(errorData => {
                                console.error('Error:', errorData.message);
                                showModal('Error: ' + errorData.message);
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Network error:', error);
                        showModal('Network error: ' + error.message);
                    });
                }
            }
        });
    }
    


    const discardButtonRecordEmployee = document.getElementById('discardButton-recordEmployee');
    if(discardButtonRecordEmployee) {
        discardButtonRecordEmployee.addEventListener('click', function () {

            console.log("checking discardButtonRecordEmployee")

            discardChanges();
            window.location.href = '/employee-resident-db';
        });
    }
});

//for webcam
$(document).ready(function() {
    Webcam.set({
        width: 320,
        height: 240,
        image_format: 'jpeg',
        jpeg_quality: 90
    });

    $('#accesscamera').on('click', function() {
        Webcam.reset();
        Webcam.on('error', function() {
            $('#photoModal').modal('hide');
            swal({
                title: 'Warning',
                text: 'Please give permission to access your webcam',
                icon: 'warning'
            });
        });
        Webcam.attach('#my_camera');
    });

    $('#takephoto').on('click', take_snapshot);

    $('#retakephoto').on('click', function() {
        $('#my_camera').addClass('d-block');
        $('#my_camera').removeClass('d-none');

        $('#results').addClass('d-none');

        $('#takephoto').addClass('d-block');
        $('#takephoto').removeClass('d-none');

        $('#retakephoto').addClass('d-none');
        $('#retakephoto').removeClass('d-block');

        $('#uploadphoto').addClass('d-none');
        $('#uploadphoto').removeClass('d-block');
    });

    $('#photoForm').on('submit', function(e) {
        e.preventDefault();
        
        Webcam.reset();

        $('#my_camera').addClass('d-block');
        $('#my_camera').removeClass('d-none');

        $('#results').addClass('d-none');

        $('#takephoto').addClass('d-block');
        $('#takephoto').removeClass('d-none');

        $('#retakephoto').addClass('d-none');
        $('#retakephoto').removeClass('d-block');

        $('#uploadphoto').addClass('d-none');
        $('#uploadphoto').removeClass('d-block');

        $('#photoModal').modal('hide');

        swal({
            title: 'Success',
            text: 'Photo uploaded successfully',
            icon: 'success',
            buttons: false,
            closeOnClickOutside: false,
            closeOnEsc: false,
            timer: 2000
        });
    });

    $('#uploadphoto').on('click', function() {
        const data_uri = $('#photoStore').val();
        if (data_uri) {
            // Update the profile image container
            $('#deets-profile-img').attr('src', 'data:image/jpeg;base64,' + data_uri);
    
            // Hide the capture button
            $('#accesscamera').hide();
        }
    
        // Close the modal and reset the webcam
        $('#photoModal').modal('hide');
        Webcam.reset();
    
        // Reset the UI for taking a new photo
        $('#my_camera').addClass('d-block').removeClass('d-none');
        $('#results').addClass('d-none');
        $('#takephoto').addClass('d-block').removeClass('d-none');
        $('#retakephoto').addClass('d-none').removeClass('d-block');
        $('#uploadphoto').addClass('d-none').removeClass('d-block');
    
        swal({
            title: 'Success',
            text: 'Photo uploaded successfully',
            icon: 'success',
            buttons: false,
            closeOnClickOutside: false,
            closeOnEsc: false,
            timer: 2000
        });
    });
    
});

function take_snapshot() {
    Webcam.snap(function(data_uri) {
        // Display the result image
        $('#results').html('<img src="' + data_uri + '" class="d-block mx-auto rounded"/>');

        // Update the profile image container
        $('#deets-profile-img').attr('src', data_uri);

        // Hide the upload image option
        $('label[for="imageUpload"]').hide();

        // Store the raw image data in the hidden input
        var raw_image_data = data_uri.replace(/^data\:image\/\w+\;base64\,/, '');
        $('#photoStore').val(raw_image_data);
    });

    // Update visibility of elements
    $('#my_camera').removeClass('d-block').addClass('d-none');
    $('#results').removeClass('d-none');
    $('#takephoto').removeClass('d-block').addClass('d-none');
    $('#retakephoto').removeClass('d-none').addClass('d-block');
    $('#uploadphoto').removeClass('d-none').addClass('d-block');
}
//

//additional function
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

function capitalizeName(name) {
    var name_split = name.toLowerCase().split(' ');

    for (var i = 0; i < name_split.length; i++) {
        name_split[i] = name_split[i].charAt(0).toUpperCase() + name_split[i].substring(1);     
    }
    return name_split.join(' '); 
}

function discardChanges() {
    // Get all input fields
    let inputs = document.querySelectorAll('input[type="text"], textarea');

    // Loop through each input field
    inputs.forEach(input => {
        input.value = input.placeholder;
    });
}