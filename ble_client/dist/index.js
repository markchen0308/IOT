"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BleClientControl_1 = require("./BleClientControl"); //import BluetoothController
let BLE_DEVICE_NAME = 'IOT SENSOR With LIGHT';
let BLE_DEVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e'; //service UUID
let BLE_RX_UUID = '6e400003b5a3f393e0a9e50e24dcca9e'; //write to pheripheral
let BLE_TX_UUID = '6e400002b5a3f393e0a9e50e24dcca9e'; //read from peripheral
let ble = new BleClientControl_1.BluetoothController(BLE_DEVICE_UUID, BLE_RX_UUID, BLE_TX_UUID);
setTimeout(() => {
    setInterval(() => {
        let rx = ble.readSensorData();
        if (rx != '') {
            console.log('received data=' + rx);
        }
    }, 1000);
}, 5000);
