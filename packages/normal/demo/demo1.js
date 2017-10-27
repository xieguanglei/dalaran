const obj = { foo: 1, bar: () => console.log('bar') };

const say = async function () {
    const { bar, ...o } = obj;
    
    await new Promise(function(resolve){
        setTimeout(resolve, 1000)
    });

    console.log(o.foo);
}

say();