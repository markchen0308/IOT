"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Net = require("net"); //import net
let HOST = '127.0.0.1';
let PORT_Webserver = 6970;
let webserverClient = new Net.Socket();
function clientControl() {
    //get server reply information
    webserverClient.on('data', (data) => {
        parserWebserverData(data);
        // client.destroy();//disconnect
    });
    //connection closed
    webserverClient.on('close', () => {
        console.log('Server has been disconnected');
    });
    webserverClient.connect(PORT_Webserver, HOST, () => {
        console.log('Server has been connected');
    });
}
//parser data from ble client
function parserWebserverData(data) {
    let rx = JSON.parse(data);
    let protocolData = {
        cmdtype: rx.cmdtype,
        cmdData: rx.cmdData
    };
    if (protocolData.cmdtype == "SensorDataNow") {
        let content = protocolData.cmdData.toString().split(";");
        let temperature = parseInt(content[0]);
        let humidity = parseInt(content[1]);
        let pirValue = parseInt(content[2]);
        console.log('get temperature:' + temperature);
        console.log('get humidity:' + humidity);
        console.log('get PIR value:' + pirValue);
    }
    else if (protocolData.cmdtype == "lightOn") {
        if (protocolData.cmdData == "ok") {
            console.log('light has been turned on');
        }
        else {
            console.log('light can not be turned on');
        }
    }
    //code here for webserver request
}
function writeWebserverData2Server(type, data) {
    let obj = {
        cmdtype: type,
        cmdData: data
    };
    webserverClient.write(JSON.stringify(obj)); //sent data to server
}
setTimeout(() => {
    clientControl();
    //send data per 1 second
    setInterval(() => {
        console.log("ask sensor value");
        writeWebserverData2Server("SensorDataNow", "");
    }, 3000);
    setInterval(() => {
        console.log("ask turn on light");
        writeWebserverData2Server("lightOn", "");
    }, 6000);
}, 1000);
