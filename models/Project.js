const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = Schema({
    name: String,
    desc: String,
    tech: String,
    link: String,
    img: String
});

module.exports = mongoose.model('Project', ProjectSchema);