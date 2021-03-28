const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const normalize = require('normalize-path');

function signUp(req, res) {
    const user = new User();
    const {name, surname, email, password, repeatPassword} = req.body;
    user.name = name;
    user.surname = surname;
    user.email = email.toLowerCase();
    user.role = 'admin';
    user.active = 'false';

    if(password != repeatPassword) {
        res.status(404).send({msg: 'Passwords must match'});
    }
    if(!password || !repeatPassword) {
        res.status(404).send({msg: 'You must choose a password'});
    } 

    bcrypt.hash(password, null, null, function(err, hash) { 
        if(err) {
            res.status(500).send({msg: 'Error encrypting password'});
        } else {
            user.password = hash;

            user.save((err, userStored) => {
                if(err) {
                    res.status(500).send({msg: 'Email already in use'});
                } else {
                    if(!userStored) {
                        res.status(404).send({msg: 'Error creating user'});
                    } else {
                        res.status(200).send({user: userStored})
                    }
                }
            });
        }
    });
    
}

function signIn(req, res) {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({email}, (err, userStored) => {
        if(err) {
            res.status(500).send({msg: 'Server error'});
        } else {
            if(!userStored) {
                res.status(404).send({msg: 'User not found'});
            } else {
                bcrypt.compare(password, userStored.password, (err, check) => {
                    if(err) {
                        res.status(500).send({msg: 'Server error'});
                    } else if (!check) {
                        res.status(404).send({msg: 'Invalid password or email'});
                    }  
                    else {
                        if(!userStored.active) {
                            res.status(200).send({code: 200, msg: 'User is not active'});
                        } else {
                            res.status(200).send({accessToken: jwt.createAccessToken(userStored), refreshToken: jwt.createRefreshToken(userStored)});
                        }
                    }
                })
            }
        }
    })
}

function getUsers(req, res) {
    User.find().then(users => {
        if(!users) {
            res.status(404).send({msg: 'No users found'});
        } else {
            res.status(200).send({users});
        }
    });
}

function getUsersActive(req, res) {
    const query = req.query;

    User.find({active: query.active}).then(users => {
        if(!users) {
            res.status(404).send({msg: 'No users found'});
        } else {
            res.status(200).send({users});
        }
    });
}

function uploadAvatar(req, res) {
    const params = req.params;
    
    User.findById({_id: params.id}, (err, userData) => {
        if(err) {
            res.status(500).send({msg: 'Server error'});
        } else {
            if(!userData) {
                res.status(404).send({msg: 'User not found'});
            } else {
                let user = userData;
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
                        user.avatar = fileName;
                        User.findByIdAndUpdate({_id: params.id}, user, (err, userResult) => {
                            if(err) {
                                res.status(500).send({msg: 'Server error'});
                            } else {
                                if(!userResult) {
                                    res.status(404).send({msg: 'User not found'});
                                } else {
                                    res.status(200).send({avatarName: fileName});
                                }
                            }
                        });
                    }
                } 
            }
        }
    })
}

function getAvatar(req, res) {
    const avatarName = req.params.avatarName;
    const filePath = './uploads/avatar/' + avatarName;

    fs.exists(filePath, exists => {
        if(!exists) {
            res.status(404).send({msg: 'Avatar not found'});
        } else {
            res.sendFile(path.resolve(filePath));
        }
    })
}

async function updateUser(req, res) {
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const params = req.params;

    if(userData.password) {
        await bcrypt.hash(userData.password, null, null, (err, hash) => {
            if(err) {
                res.status(500).send({msg: 'Error encrypting password'});
            } else {
                userData.password = hash;
            }
        });
    }

    User.findByIdAndUpdate({_id: params.id}, userData, (err, userUpdate) => {
        if(err) {
            res.status(500).send({msg: 'Server error'});
        } else {
            if(!userUpdate) {
                res.status(404).send({msg: 'User not found'});
            } else {
                res.status(200).send({msg: 'User updated successfully.'});
            }
        }
    })
}

function activateUser(req, res) {
    const {id} = req.params;
    const {active} = req.body;

    User.findByIdAndUpdate( id, {active}, (err, userStored) => {
        if(err) {
            res.status(500).send({msg: 'Server error'});
        } else {
            if(!userStored) {
                res.status(404).send({msg: 'User not found'});
            } else {
                if(active === true) {
                    res.status(200).send({msg: 'User activated'});
                } else {
                    res.status(200).send({msg: 'User deactivated'});
                }
            }
        }
    })

}

function deleteUser(req, res) {
    const {id} = req.params;

    User.findByIdAndDelete(id, (err, userDeleted) => {
        if(err) {
            res.status(500).send({msg: 'Server error'});
        } else {
            if(!userDeleted) {
                res.status(404).send({msg: 'User not found'});
            } else {
                res.status(200).send({msg: 'User deleted successfully.'});
            }
        }
    })

}

function createUser(req, res) {
    const user = new User();
    const {name, lastname, email, role, password} = req.body;
    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = role;
    user.password = password;
    user.active = true;

    bcrypt.hash(password, null, null, (err, hash) => {
        if(err) {
            res.status(500).send({msg: 'Error encrypting password'});
        } else {
            user.password = hash;

            user.save((err, userStored) => {
                if(err) {
                    res.status(500).send({msg: 'Email already in use'});
                } else {
                    if(!userStored) {
                        res.status(404).send({msg: 'Error creating user'});
                    } else {
                        res.status(200).send({user: 'User created successfully'});
                    }
                }
            })
        }
    })
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser,
    createUser
}