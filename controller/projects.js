const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');
const normalize = require('normalize-path');

function uploadProject(req, res) {
    const project = new Project();
    const {name, desc, link, tech, img} = req.body;
    project.name = name;
    project.desc = desc;
    project.link = link;
    project.tech = tech;
    project.img = img;

    project.save((err, projectStored) => {
        if(err) {
            res.status(500).send({msg: 'Server error'});
        } else {
            if(!projectStored) {
                res.status(404).send({msg: 'Error creating project'});
            } else {
                res.status(200).send({project: projectStored});
            }
        }
    })
    

}

function getProjects(req, res) {
    Project.find().then(projects => {
        if(!projects) {
            res.status(404).send({msg: 'No projects found'});
        } else {
            res.status(200).send({projects});
        }
    })
}

function updateProject(req, res) {
    let projectData = req.body;
    const params = req.params;

    Project.findByIdAndUpdate({_id: params.id}, projectData, (err, projectUpdated) => {
        if(err) {
            res.status(500).send({msg: 'Server error'});
        } else {
            if(!projectUpdated) {
                res.status(404).send({msg: 'Project not found'});
            } else {
                res.status(200).send({msg: 'Project updated successfully.'});
            }
        }
    })
}

function deleteProject(req, res) {
    const {id} = req.params;

    Project.findByIdAndDelete(id, (err, projectDeleted) => {
        if(err) {
            res.status(500).send({msg: 'Server error'});
        } else {
            if(!projectDeleted) {
                res.status(404).send({msg: 'Project not found'});
            } else {
                res.status(200).send({msg: 'Project deleted successfully.'});
            }
        }
    })
}

function uploadImage(req, res) {
    const params = req.params;
    
    Project.findById({_id: params.id}, (err, projectData) => {
        if(err) {
            res.status(500).send({msg: 'Server error'});
        } else {
            if(!userData) {
                res.status(404).send({msg: 'User not found'});
            } else {
                let project = projectData;
                if(req.files) {
                    let filePath = req.files.avatar.path;
                    let filePathNorm = normalize(filePath);
                    let fileSplit = filePathNorm.split('/');
                    let fileName = fileSplit[2];
                    let extSplit = fileName.split('.');
                    let fileExt = extSplit[1];

                    if(fileExt != 'png' && fileExt != 'jpg') {
                        res.status(400).send({msg: 'File extension not valid. Only .png and .jpg files are allowed.'});
                    } else {
                        project.img = fileName;
                        Project.findByIdAndUpdate({_id: params.id}, project, (err, projectResult) => {
                            if(err) {
                                res.status(500).send({msg: 'Server error'});
                            } else {
                                if(!projectResult) {
                                    res.status(404).send({msg: 'Project not found'});
                                } else {
                                    res.status(200).send({iamgeName: fileName});
                                }
                            }
                        });
                    }
                } 
            }
        }
    })
}

function getImage(req, res) {
    const imageName = req.params.imageName;
    const filePath = './uploads/images/' + imageName;

    fs.exists(filePath, exists => {
        if(!exists) {
            res.status(404).send({msg: 'Image not found'});
        } else {
            res.sendFile(path.resolve(filePath));
        }
    })
}

module.exports = {
    uploadProject,
    getProjects,
    updateProject,
    deleteProject,
    uploadImage,
    getImage
}