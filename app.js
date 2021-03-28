const express = require('express');
const bodyParser = require('body-parser');

const {API_VERSION} = require('./config');
const app = express();

// Load Routing //
const authRoutes = require('./routers/auth');
const userRoutes = require('./routers/user');
const projectRoutes = require('./routers/projects');
const api = require('./routers/auth');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Configure Header HTTP
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

//Router basic//
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, projectRoutes);


module.exports = app;