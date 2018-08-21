import * as Net from 'net';//import socket module
import { InterfaceProtocol } from './interfaceData'



let HOST: string = '127.0.0.1';
let PORT_BLE: number = 6969;
let PORT_Webserver: number = 6970;
let bleClientSocket: Net.Socket = null;
let webServerSocket: Net.Socket = null;
let preamble: number = 0x55;

let temperature: number = 0;
let humidity: number = 0;
let pirValue: number = 0;






function serverStart() {
    BleServerStart();//start ble server
    WebserverServerStart();//start werserver server
}


function BleServerStart() {
    console.log('Ble server start: IP=' + HOST + ';Port=' + PORT_BLE);
    // create ble server 

    Net.createServer((sock) => {
        console.log('Ble client connect.');
        bleClientSocket = sock;

        //ble client disconnected
        sock.on('close', (error) => {
            console.log('Ble client disconnected!')
            bleClientSocket = null;
        })

        // receive data from ble client
        sock.on('data', (data) => {
            parserBleClientData(data);
        });
    }).listen(PORT_BLE, HOST);//listen host
}

//parser data from ble client
function parserBleClientData(data: any) {
    let rx: InterfaceProtocol = JSON.parse(data);
    let protocolData: InterfaceProtocol =
    {
        cmdtype: rx.cmdtype,
        cmdData: rx.cmdData
    }

    if (protocolData.cmdtype == 'SensorHT') {
        let content = protocolData.cmdData.toString().split(";");
        temperature = parseInt(content[0]);
        humidity = parseInt(content[1]);
        console.log((new Date().toLocaleString()));
        console.log('temperature:' + temperature.toString(10));
        console.log('humidity:' + humidity.toString(10));
        write2BleClient('replyOK', 'ok');

        //codeing for saving data to database and updating sensor status here

    }
    else if (protocolData.cmdtype == 'SensorPIR') {
        let content = protocolData.cmdData.toString().split(";");
        pirValue = parseInt(content[0]);
        console.log((new Date().toLocaleString()));
        console.log('PIR:' + pirValue);
        write2BleClient('replyOK', 'ok');
        //codeing for saving data to database and updating sensor status here
    }

}


//control light
function ControllBleLight(state: string) {
    if (state == 'lightOn') {
        write2BleClient('lightOn', '');//turn on ligh
    }
    else if (state == 'lightOff') {
        write2BleClient('lightOff', '');// turn off light
    }
    else {
        write2BleClient('lightDimming', state);//dimming value
    }
}


//write data to ble client
function write2BleClient(type: string, data: string) {
    let obj: InterfaceProtocol =
    {
        cmdtype: type,
        cmdData: data
    }
    if (bleClientSocket != null) {
        bleClientSocket.write(JSON.stringify(obj));
    }

}

//start webserver server
function WebserverServerStart() {
    console.log('Webserver server start: IP=' + HOST + ';Port=' + PORT_Webserver);
    // create Webserver server 
    Net.createServer((sock) => {
        console.log('web server  client connect.');
        webServerSocket = sock;//save webserver socket

        //webserver client disconnected
        sock.on('close', (error) => {
            console.log('Webserver client disconnected!')
            webServerSocket = null;

        })

        // receive data from webserver client
        sock.on('data', (data) => {
            parserWebserverClientData(data) ;
            //parser protocol from web server
            //processing and access data
            //return  data to webserver client by  function write2WebserverClient

        });
    }).listen(PORT_Webserver, HOST);//listen host
}

//parser data from webserver client
function parserWebserverClientData(data: any) {
    let rx: InterfaceProtocol = JSON.parse(data);
    let protocolData: InterfaceProtocol =
    {
        cmdtype: rx.cmdtype,
        cmdData: rx.cmdData
    }

    if(protocolData.cmdtype=="SensorDataNow")
    {
        writeSensorDataNow2WebserverClient();
    }
    else if(protocolData.cmdtype=="lightOn")
    {
        ControllBleLight("lightOn");
        writeLightControlNow2WebserverClient("lightOn","ok");
    }
    //code here for webserver request

}

//write data to webserver client
function write2WebserverClient(type: string, data: string) {
    let obj: InterfaceProtocol =
    {
        cmdtype: type,
        cmdData: data
    }

    if (webServerSocket != null) {
        webServerSocket.write(JSON.stringify(obj));
    }

}


function writeSensorDataNow2WebserverClient()
{
    let cmdData:string=temperature.toString(10)+";"+humidity.toString(10)+";"+pirValue.toString(10);
    write2WebserverClient("SensorDataNow", cmdData);
}

function writeLightControlNow2WebserverClient(cmdtype:string,cmdData:string)
{
    write2WebserverClient(cmdtype, cmdData);
}


setTimeout(() => {
   serverStart();//start server after 1 second
}, 1000);


