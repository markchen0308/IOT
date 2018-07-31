import {BluetoothController}  from './BleClientControl';//import BluetoothController


let BLE_DEVICE_NAME:string ='IOT SENSOR With LIGHT'
let BLE_DEVICE_UUID:string='6e400001b5a3f393e0a9e50e24dcca9e';//service UUID
let BLE_RX_UUID:string='6e400003b5a3f393e0a9e50e24dcca9e';//write to pheripheral
let BLE_TX_UUID:string='6e400002b5a3f393e0a9e50e24dcca9e';//read from peripheral

let ble=new BluetoothController(BLE_DEVICE_UUID,BLE_RX_UUID,BLE_TX_UUID);


setTimeout(() => {
    setInterval(()=>{
       let rx=ble.readSensorData();
        if(rx != '')
        {
            console.log('received data='+rx);
        }
  
    },1000);
}, 5000);


