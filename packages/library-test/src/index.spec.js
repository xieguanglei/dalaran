import Caculator from './index';

const assert = (shouldBeTrue, message) => {
    if (!shouldBeTrue) {
        throw new Error(message || 'Assert Error!');
    }
    return true;
}

describe('caculator', function () {
    it('1+2 should be 3', function (done) {
        assert(Caculator.add(1, 2) === 3);
        setTimeout(done, 100);
    });
});