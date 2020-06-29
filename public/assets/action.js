// jQuery that will "listen" to the html survey.html
$(document).ready(function () {

    $('form').on('submit', function () {

        // var item = $('form input');
        // console.log(item.serializeArray());

        $.ajax({
            type: 'POST',
            url: '/niceSurvey',
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


    $('#num-in').on('keydown', e => {
        if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode === 8)) {
            return false;
        }
    });
});
