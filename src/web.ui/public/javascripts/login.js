function login() {
    $('#login-error').html('');
    var email = $('#email').val();
    var password = $('#password').val();

    $.ajax({
        method: 'POST',
        url: baseUrl + '/api/v1/auth/login',
        contentType: 'application/json',
        data: JSON.stringify({
            email: email,
            password: password
        })
    }).done(function(result) {
        setCookie('token', result.data.accessToken, 1);
        setTimeout(function() { location.reload() }, 100);
    }).fail(function(jqXHR, textStatus) {
        $('#login-error').html(jqXHR.responseJSON.message);
    });
}

function logout() {
    deleteCookie('token');
    setTimeout(function() { location.reload() }, 100);
}