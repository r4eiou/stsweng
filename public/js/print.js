function previewProfileImage(event) {
    const input = event.target;
    const previewImage = document.getElementById('deets-profile-img');
    const uploadButton = document.querySelector('label[for="imageUpload"]');

    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImage.src = e.target.result;
            uploadButton.style.display = 'none';
        };

        reader.readAsDataURL(file);
    }
}

function cancelForm() {
    document.getElementById('name').value = '';
    document.getElementById('name').style.backgroundColor = '#D9D9D9';

    document.getElementById('address').value = '';
    document.getElementById('address').style.backgroundColor = '#D9D9D9';

    document.getElementById('ctc-date-issued').value = '';
    document.getElementById('ctc-date-issued').style.backgroundColor = '#D9D9D9';

    document.getElementById('Birthday').value = '';
    document.getElementById('Birthday').style.backgroundColor = '#D9D9D9';

    document.getElementById('birthplace').value = '';
    document.getElementById('birthplace').style.backgroundColor = '#D9D9D9';

    document.getElementById('cedula').value = '';
    document.getElementById('cedula').style.backgroundColor = '#D9D9D9';

    document.getElementById('location').value = '';
    document.getElementById('location').style.backgroundColor = '#D9D9D9';

    document.getElementById('reason').value = '';
    document.getElementById('reason').style.backgroundColor = '#D9D9D9';

    document.getElementById('deets-profile-img').src = '/images/customer.png';

    // document.querySelector('label[for="imageUpload"]').style.display = 'inline-block';
    // document.getElementById('imageUpload').value = '';

    $('#accesscamera').show();
}

async function validateCedula(cedula) {
    const response = await fetch('/check-cedula', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cedula: cedula }),
    });
    console.log("checking cedula")

    const result = await response.json();
    return result.exists;
}

async function validateForm() {
    // const imageUpload = document.getElementById('imageUpload').files[0];
    const uploadedImage = document.getElementById('photoStore').value;
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const ctc_date = document.getElementById('ctc-date-issued').value.trim();
    const birthplace = document.getElementById('birthplace').value.trim();
    const birthday = document.getElementById('Birthday').value.trim();
    const cedula = document.getElementById('cedula').value.trim();
    const location = document.getElementById('location').value.trim();
    const reason = document.getElementById('reason').value.trim();

    let valid = true;
    let errorMessage = '';

    if (!uploadedImage) {
        valid = false;
        errorMessage += 'Profile image is required.\n';
    }

    if (!name) {
        valid = false;
        errorMessage += 'Name is required.\n';
    }

    if (!birthday) {
        valid = false;
        errorMessage += 'Complete Birth Date is required.\n'; 
    } else {
        console.log(birthday)
        const [year, month, day] = birthday.split('-');
        if (!isValidDate(day, month, year)) {
            valid = false;
            errorMessage += 'Invalid Birth Date.\n';
        }
    }

    if (!address) {
        valid = false;
        errorMessage += 'Address is required.\n';
    }

    if (!ctc_date) {
        valid = false;
        errorMessage += 'Complete CTC Issuance Date is required.\n'; 
    } else {
        const [year, month, day] = ctc_date.split('-');
        if (!isValidDate(day, month, year)) {
            valid = false;
            errorMessage += 'Invalid CTC Issuance Date.\n';
        }
    }

    if (!location) {
        valid = false;
        errorMessage += 'Place of CTC Issuance is required.\n';
    }
    
    if (await validateCedula(cedula)) {
        valid = false;
        errorMessage += 'CTC Number already exists.\n';
    }

    if (!cedula) {
        valid = false;
        errorMessage += 'CTC Number is required.\n';
    }
    else if (cedula.length !== 8) {
        valid = false;
        errorMessage += 'Invalid CTC Number.\n';
    }

    if (!birthplace) {
        valid = false;
        errorMessage += 'Place of Birth is required.\n'; 
    } 

    if (!reason) {
        valid = false;
        errorMessage += 'Reason of Certificate is required.\n';
    }

    if (!valid) {
        showModal(errorMessage);
    }

    return valid;
}

async function validateFormEdit() {
    // const imageUpload = document.getElementById('imageUpload').files[0];
    // const uploadedImage = document.getElementById('photoStore').value;
    const uploadedImage = document.getElementById('deets-profile-img').src;
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const ctc_date = document.getElementById('ctc-date-issued').value.trim();
    const birthplace = document.getElementById('birthplace').value.trim();
    const birthday = document.getElementById('Birthday').value.trim();
    const cedula = document.getElementById('cedula').value.trim();
    const location = document.getElementById('location').value.trim();
    const reason = document.getElementById('reason').value.trim();

    let valid = true;
    let errorMessage = '';

    if (!uploadedImage) {
        valid = false;
        errorMessage += 'Profile image is required.\n';
    }

    if (!name) {
        valid = false;
        errorMessage += 'Name is required.\n';
    }

    if (!birthday) {
        valid = false;
        errorMessage += 'Complete Birth Date is required.\n'; 
    } else {
        console.log(birthday)
        const [year, month, day] = birthday.split('-');
        if (!isValidDate(day, month, year)) {
            valid = false;
            errorMessage += 'Invalid Birth Date.\n';
        }
    }

    if (!address) {
        valid = false;
        errorMessage += 'Address is required.\n';
    }

    if (!ctc_date) {
        valid = false;
        errorMessage += 'Complete CTC Issuance Date is required.\n'; 
    } else {
        const [year, month, day] = ctc_date.split('-');
        if (!isValidDate(day, month, year)) {
            valid = false;
            errorMessage += 'Invalid CTC Issuance Date.\n';
        }
    }

    if (!location) {
        valid = false;
        errorMessage += 'Place of CTC Issuance is required.\n';
    }
    
    if (await validateCedula(cedula)) {
        valid = false;
        errorMessage += 'CTC Number already exists.\n';
    }

    if (!cedula) {
        valid = false;
        errorMessage += 'CTC Number is required.\n';
    }
    else if (cedula.length !== 8) {
        valid = false;
        errorMessage += 'Invalid CTC Number.\n';
    }

    if (!birthplace) {
        valid = false;
        errorMessage += 'Place of Birth is required.\n'; 
    } 

    if (!reason) {
        valid = false;
        errorMessage += 'Reason of Certificate is required.\n';
    }

    if (!valid) {
        showModal(errorMessage);
    }

    return valid;
}

function isValidDate(day, month, year) {
    const dayInt = parseInt(day);
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    const inputDate = new Date(`${year}-${month}-${day}`);

    if (isNaN(dayInt) || isNaN(monthInt) || isNaN(yearInt)) {
        return false;
    }

    if (yearInt < 1900 || yearInt > currentYear) {
        return false;
    }

    if (monthInt < 1 || monthInt > 12) {
        return false;
    }

    const daysInMonth = [31, isLeapYear(yearInt) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (dayInt < 1 || dayInt > daysInMonth[monthInt - 1]) {
        return false;
    }

    if (inputDate > currentDate) {
        return false;
    }

    return true;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
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

function formatBirthday(birthday) {
    // Split the birthday string into parts
    const parts = birthday.split('-');

    // Extract month, day, and year
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    

    // Create an array of month names for formatting
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    // Get the month name based on the month number (adjust for zero-index)
    const monthName = monthNames[parseInt(month, 10) - 1];

    // Format day with suffix (st, nd, rd, th)
    let daySuffix;
    if (day == 1 || day == 21 || day == 31) {
        daySuffix = "st";
    } else if (day == 2 || day == 22) {
        daySuffix = "nd";
    } else if (day == 3 || day == 23) {
        daySuffix = "rd";
    } else {
        daySuffix = "th";
    }

    // Construct the formatted string
    const formattedBirthday = `${day}${daySuffix} of ${monthName} ${year}`;

    return formattedBirthday;
}

document.addEventListener("DOMContentLoaded", function() {
    var print_form = document.querySelector(".print-form");

    print_form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
    });

    // const dateInputs = document.querySelectorAll('.date');
    // dateInputs.forEach(input => {
    //     input.placeholder = 'DD/MM/YYYY';
    // });

    const dateInputs = document.querySelectorAll(".date");
    dateInputs.forEach(dateInput => {
        if (dateInput) {
            // Sets date max to current date in the format YYYY-MM-DD
            dateInput.max = new Date().toISOString().split('T')[0];
            // Sets date minimum to January 1, 1970
            dateInput.min = "1970-01-01";
            dateInput.placeholder = 'DD/MM/YYYY';
        }
    });

    function updateBackgroundColor(input) {
        if (input.value === '') {
            input.style.backgroundColor = '#D9D9D9';
        } else {
            input.style.backgroundColor = '#E8F0FE'; // Reset to default
        }
    }

    const fields = [
        'name',
        'address',
        'reason',
        'Birthday',
        'ctc-date-issued',
        'birthplace',
        'cedula',
        'location'
    ];

    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            // Set initial background color based on current value
            updateBackgroundColor(element);

            // Update background color on change
            element.addEventListener('change', function() {
                updateBackgroundColor(this);
            });
        }
    });
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