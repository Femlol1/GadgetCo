const express = require('express');
const espress = require ('express')
const app = express();
const http = require ('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, { 
    cors: '*',
    methods: '*'
})



app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());



server.listen(8080, ()=> { })