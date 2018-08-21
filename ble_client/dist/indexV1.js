"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BleClientControl_1 = require("./BleClientControl"); //import BluetoothController
const Net = require("net"); //import net
let HOST = '127.0.0.1';
let PORT = 6969;
let preamble = 0x55;
let turnonlight = 0x80;
let temperature = 0;
let humidity = 0;
let preamble1 = 0x20;
let person = 0;
let light = 0;
let ble; //ble object
let BLE_DEVICE_NAME = 'IOT SENSOR With LIGHT'; //BLE name
let BLE_DEVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e'; //service UUID
let BLE_RX_UUID = '6e400003b5a3f393e0a9e50e24dcca9e'; //write to pheripheral
let BLE_TX_UUID = '6e400002b5a3f393e0a9e50e24dcca9e'; //read from peripheral
let rx_TH_sensor = ''; //temperature and humdity sensor data
let rx_PIR_sensor = ''; //PIT sensor
let time; //record time
let client = new Net.Socket();
//read all sensor
function readSensor() {
    //execution per 1 second
    setInterval(() => {
        time = (new Date()).toLocaleString(); //record time
        //read temperature and humidity sensor data
        rx_TH_sensor = ble.readTHSensorData();
        light = ble.lightStatus;
        if (rx_TH_sensor != '') {
            //console.log(time + ' TH sensor =' + rx_TH_sensor);
            let rx = rx_TH_sensor.toString().split(";");
            if (parseInt(rx[0]) == 55) //is preamble= 55
             {
                if (light == 1) {
                    let Temp = parseInt(rx[1]);
                    let humidity = parseInt(rx[2]);
                    console.log(time + " temperature=" + Temp.toString() + ' C;' + 'Humidity=' + humidity.toString() + ' %');
                    writeData(Temp, humidity, 1);
                }
                else if (light == 0) {
                    let Temp = parseInt(rx[1]);
                    let humidity = parseInt(rx[2]);
                    console.log(time + " temperature=" + Temp.toString() + ' C;' + 'Humidity=' + humidity.toString() + ' %');
                    writeData(Temp, humidity, 0);
                }
            }
        }
    }, 1000);
}
exports.readSensor = readSensor;
function writeData(temp, humid, light) {
    let tx = preamble.toString(10) + ";" + temp.toString(10) + ";" + humid.toString(10) + ";" + light.toString(10);
    client.connect(PORT, HOST, () => {
        client.write(tx); //sent data to server
    });
}
function writeData1(light) {
    let tx = preamble1.toString(10) + ";" + 1;
    client.connect(PORT, HOST, () => {
        client.write(tx);
    });
}
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
//system start 
function systemStart() {
    console.log("Start to run IOT System.");
    //execution after 1 second 
    setTimeout(() => {
        clientControl();
        ble = new BleClientControl_1.BluetoothController(BLE_DEVICE_UUID, BLE_RX_UUID, BLE_TX_UUID);
        writeData(temperature, humidity, light);
        //  writeData1(light);
    }, 1000);
    //execution after 5 second 
    setTimeout(() => {
        readSensor();
    }, 5000);
}
;
//start all system
systemStart();
