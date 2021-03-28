const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_KEY = "g654776556434dsfkjh8";

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({msg: 'Petition does not have auth header'});
    }
    const token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        var payload = jwt.decode(token, SECRET_KEY);
        if(payload.ex <= moment.unix()) {
            return res.status(404).send({msg: 'Expired token'});
        }
    } catch (ex) {
        console.log(ex);
        return res.status(404).send({msg: 'Invalid token'});
    }

    req.user = payload;
    next();
}