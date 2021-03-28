const express = require('express');
const AuthController = require('../controller/auth');

const api = express.Router();

api.post('/refresh-access-token', AuthController.refreshAccessToken);

module.exports = api;