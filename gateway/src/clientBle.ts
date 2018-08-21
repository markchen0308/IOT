import * as Net from 'net';//import net
import { InterfaceProtocol } from './interfaceData';

let HOST: string = '127.0.0.1';
let PORT_BLE: number = 6969;
let preamble: number = 0x55;
let temperature: number = 34;
let humidity: number = 70;
let pirStatus: number = 1;

let client = new Net.Socket();

function clientControl() {
    //get server reply information
    client.on('data', (data) => {
        // client.destroy();//disconnect
        parserBleServerData(data);
    });

    //connection closed
    client.on('close', () => {
        console.log('Server has been disconnected');
    });

    client.connect(PORT_BLE, HOST, () => {
        console.log('Server has been connected');
    });

}

//parser data from ble client
function parserBleServerData(data: any) {
    let rx:InterfaceProtocol=JSON.parse(data);
    let protocolData: InterfaceProtocol =
    {
        cmdtype: rx.cmdtype,
        cmdData: rx.cmdData
    }

    if (protocolData.cmdtype == 'replyOK') {
        console.log('server reply ' + protocolData.cmdData);
    }
    else if (protocolData.cmdtype == 'replyError') {
        console.log('server reply ' + protocolData.cmdData);
        //code here to turn on light
    }
    else if (protocolData.cmdtype == 'lightOn') {

        //code here to turn on light 
    }
    else if (protocolData.cmdtype == 'lightOff') {

        //code here to turn off light 
    }
    else if (protocolData.cmdtype == 'lightDimming') {

        //code here to dime light 
    }

}


function writeBleData2Server(type: string, data: string) {

    let obj: InterfaceProtocol =
    {
        cmdtype: type,
        cmdData: data
    }
    client.write(JSON.stringify(obj));//sent data to server
}


function writeTH2Server(temp: number, hum: number) {
    let cmddata: string = temp.toString(10) + ';' + hum.toString(10);
    writeBleData2Server('SensorHT', cmddata);
}

function writePIR2Server(PIR: number) {
    let cmddata: string = PIR.toString(10);
    writeBleData2Server('SensorPIR', cmddata);
}

setTimeout(() => {
    clientControl();
    //send data per 1 second
    setInterval(() => {
        console.log("send TH value");
        writeTH2Server(temperature, humidity);
    }, 3000);

    setInterval(() => {
        console.log("send pir value");
        writePIR2Server(pirStatus);
    }, 5000);

}, 1000);





