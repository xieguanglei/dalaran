const dalaran = require('../../src/index');

dalaran.applicationTasks({
    watchTest: false,
    coverageFilePattern: '**/src/index.js'
}).test();