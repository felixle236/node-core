var baseUrl = 'http://localhost:3000';
var baseSocket = 'http://localhost:5000';
var socket;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

window.onload = function() {
    if (userAuth) {
        socket = io(baseSocket + '/chat', {
            reconnectionDelayMax: 10000,
            transports: ['websocket'],
            auth: { token: getCookie('token') }
        });

        socket.on('connect', function() {
            console.log('You are connected!');
        });

        socket.on('disconnect', function() {
            console.log('You have disconnected!');
        });

        socket.on('connect_error', err => {
            console.log('connect_error', err);
        });
    }

    if (typeof main === 'function')
        main();
}