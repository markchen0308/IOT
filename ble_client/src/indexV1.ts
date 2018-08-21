import { BluetoothController } from './BleClientControl';//import BluetoothController
import * as Net from 'net';//import net



let HOST: string = '127.0.0.1';
let PORT: number = 6969;
let preamble: number = 0x55;
let turnonlight: number = 0x80;
let temperature: number = 0;
let humidity: number = 0;
let preamble1: number = 0x20;
let person: number = 0;
let light: number = 0;
let ble: BluetoothController;//ble object
let BLE_DEVICE_NAME: string = 'IOT SENSOR With LIGHT';//BLE name
let BLE_DEVICE_UUID: string = '6e400001b5a3f393e0a9e50e24dcca9e';//service UUID
let BLE_RX_UUID: string = '6e400003b5a3f393e0a9e50e24dcca9e';//write to pheripheral
let BLE_TX_UUID: string = '6e400002b5a3f393e0a9e50e24dcca9e';//read from peripheral
let rx_TH_sensor: string = '';//temperature and humdity sensor data
let rx_PIR_sensor: string = '';//PIT sensor
let time: String;//record time
let client = new Net.Socket();



//read all sensor
export function readSensor() {
    //execution per 1 second
    setInterval(() => {
        time = (new Date()).toLocaleString();//record time
        //read temperature and humidity sensor data
        rx_TH_sensor = ble.readTHSensorData();
        light = ble.lightStatus;
        if (rx_TH_sensor != '') {
            //console.log(time + ' TH sensor =' + rx_TH_sensor);
            let rx = rx_TH_sensor.toString().split(";");
            if (parseInt(rx[0]) == 55) //is preamble= 55
            {
                if (light == 1) {
                    let Temp: number = parseInt(rx[1]);
                    let humidity: number = parseInt(rx[2]);
                    console.log(time + " temperature=" + Temp.toString() + ' C;' + 'Humidity=' + humidity.toString() + ' %');
                    writeData(Temp, humidity, 1);
                }
                else if (light == 0) {
                    let Temp: number = parseInt(rx[1]);
                    let humidity: number = parseInt(rx[2]);
                    console.log(time + " temperature=" + Temp.toString() + ' C;' + 'Humidity=' + humidity.toString() + ' %');
                    writeData(Temp, humidity, 0);
                }


            }
        }
    }, 1000);
}




function writeData(temp: number, humid: number, light: number) {
    let tx: string = preamble.toString(10) + ";" + temp.toString(10) + ";" + humid.toString(10) + ";" + light.toString(10);
    client.connect(PORT, HOST, () => {
        client.write(tx);//sent data to server
    });
}
function writeData1(light: number) {
    let tx: string = preamble1.toString(10) + ";" + 1;
    client.connect(PORT, HOST, () => {
        client.write(tx);
    });
}

function clientControl() {
    //get server reply information
    client.on('data', (data) => {
        console.log('get server data: ' + data);

        client.destroy();//disconnect
    });

    //connection closed
    client.on('close', () => {
        console.log('disconnect');
    });
}




//system start 
function systemStart() {
    console.log("Start to run IOT System.");
    //execution after 1 second 
    setTimeout(() => {
        clientControl();
        ble = new BluetoothController(BLE_DEVICE_UUID, BLE_RX_UUID, BLE_TX_UUID);
        writeData(temperature, humidity, light);
        //  writeData1(light);


    }, 1000);




    //execution after 5 second 
    setTimeout(() => {
        readSensor();
    }, 5000);


};


//start all system
systemStart();

