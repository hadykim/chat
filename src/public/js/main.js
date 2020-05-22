$(function () {
    
    const socket = io();

    //obtencion de elementos DOM de html
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    //obtencion de elementos nickname
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickName = $('#nickName');

    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickName.val(), data => {
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else{
                $nickError.html(`
                    <div class="alert alert-danger">
                        Este usuario ya existe
                    </div>`);
            }

            $nickName.val('');
        });
    });

    //eventos
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => { //data recibe errores
            $chat.append(`<p class="error">${data}</p>`)
        });
        $messageBox.val('');
    });

    //escuchar desde servidor
    socket.on('new message', function(data) {
        $chat.append('<b>' + data.nick + '</b>: ' +data.msg + '<br>');
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++){
            html += `<p><i class="fas fa-user"></i>${data[i]}</p>`
        }
        $users.html(html);
    });

    socket.on('private', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}</b> ${data.msg}</p>`);
    });

    socket.on('load old msgs', msgs => {
        for(let i = 0; i < msgs.length; i++){
            displayMsg(msgs[i]);
        }
    });

    function displayMsg(data) {
        $chat.append(`<p class="whisper"><b>${data.nick}</b> ${data.msg}</p>`);
    }
});