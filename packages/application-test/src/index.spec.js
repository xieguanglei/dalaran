import theText from './index';

const assert = (shouldBeTrue, message) => {
    if (!shouldBeTrue) {
        throw new Error(message || 'Assert Error!');
    }
    return true;
}

describe('caculator', function () {
    it('\'Hello World\' has 11 charactors', function (done) {
        assert(theText.length === 11);
        setTimeout(done, 100);
    });
});