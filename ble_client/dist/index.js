"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BleClientControl_1 = require("./BleClientControl"); //import BluetoothController
const CP = require("child_process"); //module for deal with system command
let BLE_START_CMD = 'hciconfig hci0 up'; //command for turning up BLE
let ble; //ble object
let BLE_DEVICE_NAME = 'IOT SENSOR With LIGHT'; //BLE name
let BLE_DEVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e'; //service UUID
let BLE_RX_UUID = '6e400003b5a3f393e0a9e50e24dcca9e'; //write to pheripheral
let BLE_TX_UUID = '6e400002b5a3f393e0a9e50e24dcca9e'; //read from peripheral
let rx_TH_sensor = ''; //temperature and humdity sensor data
let rx_PIR_sensor = ''; //PIT sensor
let time; //record time
//read all sensor
function readSensor() {
    //execution per 1 second
    setInterval(() => {
        time = (new Date()).toLocaleString(); //record time
        //read temperature and humidity sensor data
        rx_TH_sensor = ble.readTHSensorData();
        if (rx_TH_sensor != '') {
            console.log(time + ' TH sensor =' + rx_TH_sensor);
        }
        //read PIR sensor data
        rx_PIR_sensor = ble.readPIRSensorData();
        if (rx_PIR_sensor != '') {
            console.log(time + ' PIR sensor =' + rx_PIR_sensor);
        }
    }, 1000);
}
//system start 
function SystemStart() {
    console.log("Start to run IOT System.");
    //turn up ble
    CP.exec(BLE_START_CMD, (err, stdout, stderr) => {
        if (err) {
            console.log('ble start error:' + stderr);
        }
        else {
            console.log('ble start ok');
        }
    });
    //execution after 1 second 
    setTimeout(() => {
        ble = new BleClientControl_1.BluetoothController(BLE_DEVICE_UUID, BLE_RX_UUID, BLE_TX_UUID);
    }, 1000);
    //execution after 5 second 
    setTimeout(() => {
        readSensor();
    }, 5000);
}
;
//start all system
SystemStart();
