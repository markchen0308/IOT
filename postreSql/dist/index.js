"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgControl_1 = require("./pgControl");
///initialize
let pg = new pgControl_1.PgControl();
async function myMain() {
    await pg.begin();
    let rx = await pg.readAllDB();
    console.log('1');
    console.info(rx);
    rx = await pg.readAllDB();
    console.log('2');
    console.info(rx);
}
setTimeout(() => {
    myMain();
}, 1000);
