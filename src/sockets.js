const Chat = require('./models/Chat');

module.exports = function(io) { //socket del servidor

    let users = {};

    io.on('connection', async socket => {
        console.log('nuevo usuario');

        //cargar mensajes desde bd
        let messages = await Chat.find({}).limit(5);
        socket.emit('load old msgs', messages)

        socket.on('new user', (data, cb) => {
            if(data in users){    //si existe devuelve el valor del array y si no -1
                cb(false);
            }else{
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            }
        });

        socket.on('send message', async (data, cb) => { //cb = callback

            var msg = data.trim();

            if(msg.substr(0, 3) === '/p '){
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if(index !== -1){
                    var name = msg.substring(0, index);
                    var msg = msg.substring(index + 1);
                    if(name in users){
                        users[name].emit('private', {
                            msg,
                            nick: socket.nickname
                        });
                    }else{
                        cb('Error, inserta un usuario valido!')
                    }
                }else{
                    cb('Ingresa el mensaje!')
                }
            }else{
                var newMsg = new Chat({
                    msg: msg,
                    nick: socket.nickname
                });
                await newMsg.save();

                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                });
            }
            
        });

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        function updateNicknames(){
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
    
}