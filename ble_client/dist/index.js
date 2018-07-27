"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BleClientControl_1 = require("./BleClientControl"); //import BluetoothController
let BLE_DEVICE_NAME = 'IOT SENSOR With LIGHT';
let BLE_DEVICE_UUID = 'fffffffffffffffffffffffffffffff0';
let BLE_SENSOR_01_UUID = 'fffffffffffffffffffffffffffffff1';
let BLE_LIGHT_UUID = 'fffffffffffffffffffffffffffffff2';
let ble = new BleClientControl_1.BluetoothController(BLE_DEVICE_UUID, BLE_SENSOR_01_UUID, BLE_LIGHT_UUID);
