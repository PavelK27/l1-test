$(document).ready(function() {
    var form = $('#main_form');

    $(form).submit(function(event) {
        event.preventDefault();

        // Basic validation of input.
        if ( $('input#message')[0].value == '' ) {
            alert("Message can't be empty!");
            return;
        }

        var formData = $(form).serialize();
        $.ajax({
            type: 'POST',
            url: $(form).attr('action') + '?' + formData
        }).done(function(response) {
            $('#response').text(response);
            // Clear the form.
            $('#message').val('');
        })
    });
});