"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Net = require("net"); //import net
let HOST = '127.0.0.1';
let PORT = 6969;
let preamble = 0x55;
let temperature = 34;
let humidity = 70;
let client = new Net.Socket();
function clientControl() {
    //get server reply information
    client.on('data', (data) => {
        console.log('get server data: ' + data);
        client.destroy(); //disconnect
    });
    //connection closed
    client.on('close', () => {
        console.log('disconnect');
    });
}
function writeData(temp, humid) {
    let tx = preamble.toString(10) + ';' + temp.toString(10) + ';' + humid.toString(10);
    client.connect(PORT, HOST, () => {
        client.write(tx); //sent data to server
    });
}
setTimeout(() => {
    clientControl();
    //send data per 1 second
    setInterval(() => {
        writeData(temperature, humidity);
    }, 1000);
}, 1000);
