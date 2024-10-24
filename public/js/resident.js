document.addEventListener("DOMContentLoaded", function() {
    const searchFormResident = document.getElementById('searchForm_EResident');
    console.log("HELLO");
    if (searchFormResident) {
        searchFormResident.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(searchFormResident);
            const searchName = formData.get('search_name');
            
            try {
                if(searchName) {
                    const response = await fetch(`/search-resident/${searchName}`);

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const result = await response.json();
                    console.log(result); 

                    window.location.href = `/employee-resident-db/${searchName}`;
                } else {
                    window.location.href = '/employee-resident-db';
                }

            } catch (error) {
                console.error('There was a problem with the search operation:', error);
            }
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