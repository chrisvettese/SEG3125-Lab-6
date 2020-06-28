// jQuery that will "listen" to the html survey.html
$(document).ready(function () {

    $('form').on('submit', function () {

        // var item = $('form input');
        // console.log(item.serializeArray());

        $.ajax({
            type: 'POST',
            url: '/survey',
            data: $(this).serializeArray(),
            success: function (data) {
                // do something with the data via front-end framework
                // Make the submit button red, disabled and saying Thank you
                const buttonChange = $('#bb');
                buttonChange.css("background-color", "red");
                buttonChange.prop("disabled", "true");
                buttonChange.text("Thank you!");
            }
        });
        return false;
    });
});
