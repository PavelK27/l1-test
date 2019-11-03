$(document).ready(function() {
    var form = $('#main_form');

    var username = localStorage.getItem('name');
    var post_placeholder = $('.post-placeholder');

    function bindClickEvent() {
        $('.post-reply').on('click',
            function(e) {
                e.preventDefault();

                var id = $(this).attr('data-parent-id');
                if ($(this).parent('.child').length != 0) {
                    id = $(this).parents('.parent').find('.post-reply').attr('data-parent-id');
                }
                
                var reply_to = $(this).attr('data-parent-author');
                $("html, body").animate({ scrollTop: 0 }, "slow");
                $('#reply_id').val(id);
                $('.reply-to').text('Reply to: ' + reply_to);
            }
        );
    }

    function getPostTemplate(post, child = false) {
        var new_post = post_placeholder.clone();
        $(new_post).find('.date').text(new Date(post.date));
        $(new_post).find('.author').text(post.name);
        $(new_post).find('p').text(post.text);
        $(new_post).find('.post-reply').attr('data-parent-id',post._id).attr('data-parent-author',post.name);
        $(new_post).removeClass('hidden');

        if (child) {
            $(new_post).addClass('child');
        }

        // Load child posts.
        if (post.children) {
            $(new_post).addClass('parent');
            for (var i = post.children.length - 1; i >= 0; i--) {
                $(new_post).find('.children:first').append(getPostTemplate(post.children[i], true));
            }
        }
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
            bindClickEvent();
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
            loadSubmissions();
            bindClickEvent();

            // Clear the form.
            $('#message').val('');
        })
    });
});