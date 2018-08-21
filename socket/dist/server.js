"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Net = require("net"); //import socket module
let HOST = '127.0.0.1';
let PORT = 6969;
let preamble = 0x55;
let temperature = 0;
let humidity = 0;
console.log('server on');
Net.createServer((sock) => {
    // receive data from client
    sock.on('data', (data) => {
        console.log("Get client data:" + data);
        let rx = data.toString().split(";");
        if (parseInt(rx[0]) == preamble) {
            temperature = parseInt(rx[1]);
            humidity = parseInt(rx[2]);
            console.log((new Date().toLocaleString()));
            console.log('temperature:' + temperature.toString(10));
            console.log('humidity:' + humidity.toString(10));
            //reply data to server
            sock.write('200'); //200:ok,104:fail
        }
        else {
            console.log('received data error');
            //reply data to server
            sock.write('104'); //200:ok,104:fail
        }
    });
    //client close event
    sock.on('close', (data) => {
        console.log('Client Disconnect');
    });
}).listen(PORT, HOST); //listen host
