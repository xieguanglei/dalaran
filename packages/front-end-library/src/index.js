import txt from './text.txt';

console.log(txt);
console.log(bar);
console.log(bar_two);


function sleepAble(Clazz) {
    class SleepSome extends Clazz {
        async sleep(t) {
            await new Promise((resolve) => {
                setTimeout(resolve, t);
            });
        }
    }
}

@sleepAble
class Caculator {

    value = 0;

    static async add(x, y) {
        await new Promise(function (resolve) {
            setTimeout(resolve, 500)
        });
        return x + y;
    }

    async add(y) {
        await new Promise(function (resolve) {
            setTimeout(resolve, 1000)
        });
        this.value += y;
        return this.value;
    }

    async clear(x) {
        this.value = x;
    }
}

export default Caculator;