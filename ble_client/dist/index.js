"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BleClientControl_1 = require("./BleClientControl"); //import BluetoothController
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
            //console.log(time + ' TH sensor =' + rx_TH_sensor);
            let rx = rx_TH_sensor.toString().split(";");
            if (parseInt(rx[0]) == 55) //is preamble= 55
             {
                let temp = parseInt(rx[1]);
                let humidity = parseInt(rx[2]);
                console.log(time + " temperature=" + temp.toString() + ' C;' + 'Humidity=' + humidity.toString() + ' %');
            }
        }
        //read PIR sensor data
        rx_PIR_sensor = ble.readPIRSensorData();
        if (rx_PIR_sensor != '') {
            //console.log(time + ' PIR sensor =' + rx_PIR_sensor);
            let rx = rx_PIR_sensor.toString().split(";");
            if (parseInt(rx[0]) == 55) //is preamble= 55
             {
                if (parseInt(rx[1]) == 1) {
                    if (ble.charLight != null) {
                        console.log(time + ' There is person=>Turn on light');
                        ble.writeLight('1');
                    }
                }
                else if (parseInt(rx[1]) == 0) {
                    if (ble.charLight != null) {
                        console.log(time + ' There is no person=>Turn off light');
                        ble.writeLight('0');
                    }
                }
                else {
                    console.log('PIR sensor protocol error!');
                }
            }
            //control light function here according to PIR value 
        }
    }, 1000);
}
//system start 
function systemStart() {
    console.log("Start to run IOT System.");
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
systemStart();
