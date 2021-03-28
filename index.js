const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3977;
const portDb = 27017;
const {API_VERSION} = require('./config');

mongoose.set('useFindAndModify', false);
mongoose.connect(`mongodb://localhost:${portDb}/personalweb`, {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if(err) {
        throw err;
    } else {
        console.log('Db Connected');
        app.listen(port, () => {
            console.log('#### API REST #####');
            console.log(`http://localhost:${port}/api/${API_VERSION}`);
        });
    }
});
