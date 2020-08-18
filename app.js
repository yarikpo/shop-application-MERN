const express = require('express');
const config = require('config');
const routes = require('./routes/rout');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = config.get('port') || 3001;

// cors
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// end cors

app.use(express.json());
app.use('/api/', routes);

async function start() {
    try {
        // TODO connecting to database
        app.listen(PORT, (req, res) => {
            console.log(`Server has been run on port ${PORT}.`);
        });
    } catch (e) {

    }
}
start();