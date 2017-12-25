import expect from 'expect';
import Caculator from '../src/index';

describe('caculator', function () {

    it('1+2 should be 3', function(){
        expect(Caculator.add(1,2)).toEqual(3);
    });

    it('2x3 should be 6', function () {
        expect(Caculator.multiply(2,3)).toEqual(6);
    })
})