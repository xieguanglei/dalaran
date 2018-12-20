import add from './index';

const assert = (shouldBeTrue, message) => {
    if (!shouldBeTrue) {
        throw new Error(message || 'Assert Error!');
    }
    return true;
}

describe('add', function () {
    it('1+1=2', function (done) {
        assert(add(1,1) === 2);
        assert(add(1,2) === 3);
        setTimeout(done, 100);
    });
});