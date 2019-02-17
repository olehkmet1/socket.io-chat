
$(function () {
    const socket = io();
    let message = $('#m');
    let inputName = 'Anonimus';
    let isTyping = false;
    let timeout;

    function timeoutFunction(){
        socket.emit('is typing', false);
    }

    $('form').submit(function (e) {
        e.preventDefault();
        socket.emit('chat message', message.val());
        message.val('');
        return false;
    });

    message.on('keyup', function (e) {
        socket.emit('is typing', inputName);
        clearTimeout(timeout)
        timeout = setTimeout(timeoutFunction, 1000)
    })

    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });
    socket.on('name', function (name) {
        $('#messages').append($('<li>').text(`${name ? name : 'Anonimus'} has connected`));
    });
    socket.on('is typing', function (name) {
        if (name) {
            $('#typing').text(`${name} is typing`);
        } else {
            $('#typing').text(``);
        } 
    });

    socket.on('close', function (name) {
        $('#messages').append($('<li>').text(`${name ? name : 'Anonimus'} has disconnected`));
    });
});