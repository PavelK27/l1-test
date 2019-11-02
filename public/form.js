$(document).ready(function() {
    var form = $('#main_form');

    var username = localStorage.getItem('name');
    var post_placeholder = $('.post-placeholder');

    function getPostTemplate(post) {
        var new_post = post_placeholder.clone();
        $(new_post).find('.date').text(new Date(post.date));
        $(new_post).find('.author').text(post.name);
        $(new_post).find('p').text(post.text);
        $(new_post).removeClass('hidden');
        return new_post;
    }

    function loadSubmissions() {
        // Load submissions of current user.
        if (username && username.length > 0) {
            $('#name').val(username);

            $('#submissions').empty();

            $.ajax({
                type: 'GET',
                url: '/user?account=' + username
            }).done(function(resp) {
                var messages = JSON.parse(resp);

                $.each( messages, function( i, post ) {
                    var new_post = getPostTemplate(post);
                    $('#submissions').append(new_post);
                });
            })
        }

        $('#response').empty();
        // Load other submissions.
        $.ajax({
            type: 'GET',
            url: '/all'
        }).done(function(res) {
            var messages = JSON.parse(res);

            $.each( messages, function( i, val ) {
                var new_post = getPostTemplate(val);
                $('#response').append(new_post);
            });
        })
    }

    loadSubmissions();

    $(form).submit(function(event) {
        event.preventDefault();

        // Basic validation of input.
        if ( $('input#message')[0].value == '' || $('input#name')[0].value == '' ) {
            alert("Message or name can't be empty!");
            return;
        }

        localStorage.setItem("name", $('input#name')[0].value);

        var formData = $(form).serialize();
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        }).done(function(response) {
            loadSubmissions()

            // Clear the form.
            $('#message').val('');
        })
    });
});