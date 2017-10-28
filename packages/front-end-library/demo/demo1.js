import Caculator from '../src/index';

async function add(x, y){
    const c = new Caculator();
    await c.clear(x);
    const res = await c.add(y);
    console.log(res);
}
add(3, 5);