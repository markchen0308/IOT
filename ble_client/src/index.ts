import { BluetoothController } from './BleClientControl';//import BluetoothController
import * as CP from 'child_process';//module for deal with system command

let BLE_START_CMD: string = 'hciconfig hci0 up';//command for turning up BLE

let ble: BluetoothController;//ble object
let BLE_DEVICE_NAME: string = 'IOT SENSOR With LIGHT';//BLE name
let BLE_DEVICE_UUID: string = '6e400001b5a3f393e0a9e50e24dcca9e';//service UUID
let BLE_RX_UUID: string = '6e400003b5a3f393e0a9e50e24dcca9e';//write to pheripheral
let BLE_TX_UUID: string = '6e400002b5a3f393e0a9e50e24dcca9e';//read from peripheral
let rx_TH_sensor: string = '';//temperature and humdity sensor data
let rx_PIR_sensor: string = '';//PIT sensor

let time: String;//record time
let bleStatus: boolean;

//read all sensor
function readSensor() {
    //execution per 1 second
    setInterval(() => {
        time = (new Date()).toLocaleString();//record time
        //read temperature and humidity sensor data
        rx_TH_sensor = ble.readTHSensorData();
        if (rx_TH_sensor != '') {
            console.log(time + ' TH sensor =' + rx_TH_sensor);
        }

        //read PIR sensor data
        rx_PIR_sensor = ble.readPIRSensorData();
        if (rx_PIR_sensor != '') {
            console.log(time + ' PIR sensor =' + rx_PIR_sensor);
            //control light function here according to PIR value 
        }
    }, 1000);
}

//system start 
function systemStart() {
    console.log("Start to run IOT System.");

    //turn on ble
    CP.exec(BLE_START_CMD, (err: Error, stdout: string, stderr: string) => {
        if (err) {
            bleStatus = false;
            console.log('Can not turn on ble:' + stderr);
        }
        else {
            bleStatus = true;
            console.log('ble is turned on');
        }
    });

    if (bleStatus)//if ble is turned on 
    {
        //execution after 1 second 
        setTimeout(() => {
            ble = new BluetoothController(BLE_DEVICE_UUID, BLE_RX_UUID, BLE_TX_UUID);
        }, 1000);

        //execution after 5 second 
        setTimeout(() => {
            readSensor();
        }, 5000);
    }

};


//start all system
systemStart();

