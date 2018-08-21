import {PgControl} from './pgControl';

///initialize
let pg=new PgControl();




async function myMain()
{
    await pg.begin();
    let rx=await pg.readAllDB();
    console.log('1');
    console.info(rx);

    
    rx=await pg.readAllDB();
    console.log('2');
    console.info(rx);

}


setTimeout(() => {
    myMain();
}, 1000);