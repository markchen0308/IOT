#This project teach how to use nodejs ble module 'bleno' to play ble as peripheral


#1. install bluetooth module
   $sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev

#2.check BlueZ version
   $bluetoothd -v

#3. If BlueZ version is 5.14 or later ,run following cmd
   $sudo systemctl stop bluetooth 
   $sudo systemctl disable bluetooth 
   $reboot

#4.Use sudo hciconfig hci0 up to power Bluetooth adapter up after stopping or disabling bluetoothd
    $sudo hciconfig hci0 up

#5.run the index.js in dist directory
    nodejs index.js

#6. Using nRF Connect App on mobile phone to connect the   peripheral
