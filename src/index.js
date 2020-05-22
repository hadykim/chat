const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');

const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

//conexion db
mongoose.connect('mongodb://localhost/chat-database')
.then(db => console.log('base de datos conectado'))
.catch(error => console.log(error));

//configuraciones
app.set('port', process.env.PORT || 3000);

require('./sockets')(io);

//archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//iniciando el servidor
server.listen(app.get('port'), () => {
    console.log('servidor en puerto 3000')
});