const dalaran = require('../../src/index');

dalaran.libraryTasks({
    umdName: 'Caculator',
    minify: false
}).build(()=>1);