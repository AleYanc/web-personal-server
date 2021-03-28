const express = require('express');
const md_auth = require('../middleware/authenticated');
const ProjectController = require('../controller/projects');
const multiparty = require('connect-multiparty');

const md_upload_image = multiparty({uploadDir: './uploads/image'});

const api = express.Router();

api.post('/upload-project', ProjectController.uploadProject);
api.get('/get-projects', ProjectController.getProjects);
api.put('/update-project/:id', ProjectController.updateProject);
api.delete('/delete-project/:id', ProjectController.deleteProject);
api.put('/upload-image/:id', [md_upload_image], ProjectController.uploadImage);
api.get('/get-image/:imageName', ProjectController.getImage);

module.exports = api;

