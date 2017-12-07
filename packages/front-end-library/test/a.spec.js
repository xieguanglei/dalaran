import expect from 'expect';
import Caculator from '../src/index';

describe('a', function () {

    let c = null;

    before(function(){
        c = new Caculator();
    });

    it('ok', async function () {
        console.log(document.createElement('canvas'));
        await c.clear(3);
        const res = await c.add(5);
        expect(res).toEqual(8);
    })
})