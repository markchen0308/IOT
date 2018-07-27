import * as Bleno from 'bleno';//import bleno

let ServiceUUID: string;//service UUID
let Sensor01UUID: string;//sensor 01 UUID
let LightUUID: string;//light 01 UUID


//create a new class of  Characteristic for device extending Characteristic of bleno
export class BluetoothController {
    private isAdvertising: boolean;

    private deviceName: string;//ble device name


    //class initialize
    constructor(deviceName: string, serviceUUID: string, sensor01UUID: string, lightUUID: string) {
        this.isAdvertising = false;
        this.deviceName = deviceName;//save device name
        ServiceUUID = serviceUUID;//savve service UUID
        Sensor01UUID = sensor01UUID;
        LightUUID = lightUUID;

        console.log('start ble');
        this.bleControl();//execute bleControl()
    }

    //if exit
    dispose(callback: () => void) {
        if (this.isAdvertising) {
            Bleno.stopAdvertising(callback);//stop advertising
        } else {
            callback();
        }
    }

    private onWriteRequest(data: Buffer) {
        console.log('data write '+data.toString());
    }

    private bleControl() {
        //ble open
        Bleno.on('stateChange', (state: string) => {
            console.log('bluetooth', `stateChange: ${state}, address = ${Bleno.address}`);

            if (state === 'poweredOn') {
                Bleno.startAdvertising(this.deviceName, [ServiceUUID]);//start to advertise
            } else {
                Bleno.stopAdvertising();//ble fail, stop to advertise
            }
        });

        //connecting event
        Bleno.on('accept', (clientAddress: string) => {
            console.log('bluetooth', `accept, client: ${clientAddress}`);//show client's information
            Bleno.updateRssi();//triggle RSSI update event
        });

        //disconnect event
        Bleno.on('disconnect', (clientAddress: string) => {
            console.log('bluetooth', `disconnect, client: ${clientAddress}`);
        });

        //RSSI update event
        Bleno.on('rssiUpdate', (rssi: number) => {
            console.log('bluetooth', `rssiUpdate: ${rssi}`);//show rssi
        });

        Bleno.on('mtuChange', (mtu: number) => {
            console.log('bluetooth', `mtuChange: ${mtu}`);
        });

        //start advertising event
        Bleno.on('advertisingStart', (error?: Error | null) => {
            console.log('bluetooth', `advertisingStart: ${error ? error : 'success'}`);
            if (!error) {
                this.isAdvertising = true;
                Bleno.setServices([
                    new Bleno.PrimaryService({
                        uuid: ServiceUUID,
                        characteristics: [
                            new LightCharacteristic((data) => {
                                this.onWriteRequest(data);
                            }),
                            new Sensor01Characteristic(),
                        ],
                    }),
                ]);
            }
            else{
                console.log('ble fail')
            }
        });

        Bleno.on('advertisingStop', () => {
            this.isAdvertising = false;
            console.log('bluetooth', 'advertisingStop');
        });
        
        //setting service sevent
        Bleno.on('servicesSet', (error?: Error | null) => {
            console.log('bluetooth', `servicesSet: ${error ? error : 'success'}`);
        });



    };

}



class Sensor01Characteristic extends Bleno.Characteristic {
    constructor() {
        super({
            uuid: Sensor01UUID,
            properties: ['read'],//only read
            /*
            descriptors: [
                new Bleno.Descriptor({
                    uuid: '2901',
                    value: Buffer.from('status ok'),
                }),
            ],*/
        });
    }

    onReadRequest(offset: number, callback: (result: number, data?: Buffer) => void) {
        try {
            const data = Buffer.from('status ok');
            callback(Bleno.Characteristic.RESULT_SUCCESS, data.slice(offset));
        } catch (error) {
            callback(Bleno.Characteristic.RESULT_UNLIKELY_ERROR);
        }
    }
}



class LightCharacteristic extends Bleno.Characteristic {
    private readonly callback: (data: Buffer) => void;

    constructor(onWriteRequestCb: (data: Buffer) => void) {
        super({
            uuid: LightUUID,
            properties: ['write'],
            /*
            descriptors: [
                new Bleno.Descriptor({
                    uuid: '2901',
                    value: Buffer.from('test characteristic'),
                }),
            ],
            */
        });
        this.callback = onWriteRequestCb;
    }

    onWriteRequest(data: Buffer, offset: number, withoutResponse: any, callback: (result: number) => void): void {
        if (offset > 0) {
            console.log('offset = '+ offset.toString());
            this.callback(data.slice(offset));
        } else {
            this.callback(data);
        }
        callback(this.RESULT_SUCCESS);
    }
}