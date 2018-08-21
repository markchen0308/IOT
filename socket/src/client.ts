import * as Net from 'net';//import net
let HOST: string = '127.0.0.1';
let PORT: number = 6969;
let preamble: number = 0x55;
let temperature: number = 34;
let humidity: number = 70;

let client = new Net.Socket();

function clientControl() {
    //get server reply information
    client.on('data', (data) => {
        console.log('get server data: ' + data);
        client.destroy();//disconnect
    });

    //connection closed
    client.on('close', () => {
        console.log('Server has been disconnected');
    });
}

function writeData(temp: number, humid: number) {
    let tx: string = preamble.toString(10) + ';' + temp.toString(10) + ';' + humid.toString(10);
    if ((client.connecting == false) )//server has been  disconnected
    {
        console.log('Server is connecting ');
        //re-connect
        client.connect(PORT, HOST, () => {
            console.log('Write data to server');
            client.write(tx);//sent data to server
        });
    }
    else  //server has been connected
    {
        console.log('Write data to server');
        client.write(tx);//sent data to server
    }
}


setTimeout(() => {
    clientControl();
    //send data per 1 second
    setInterval(() => {
        writeData(temperature, humidity);
    }, 500);
}, 1000);





