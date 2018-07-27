import {BluetoothController}  from './BlePeripheralControl';//import BluetoothController


let BLE_DEVICE_NAME:string ='IOT SENSOR With LIGHT'
let BLE_DEVICE_UUID:string='fffffffffffffffffffffffffffffff0'
let BLE_SENSOR_01_UUID:string='fffffffffffffffffffffffffffffff1';
let BLE_LIGHT_UUID:string='fffffffffffffffffffffffffffffff2';

let ble=new BluetoothController(BLE_DEVICE_NAME,BLE_DEVICE_UUID,BLE_SENSOR_01_UUID,BLE_LIGHT_UUID);