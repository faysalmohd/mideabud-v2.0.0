const path = require('path')
const bcrypt = require('bcryptjs');
let saved_user = ''
const mongoose = require('mongoose')
const Mideabud = require('../mongodb/mongodb')
//const { generateToken } = require('../utils/jwt')

let current_date = () => {
    let usable = new Date();
    let h = usable.getHours();
    let m = usable.getMinutes();
    if (m < 10) {
        m = `0${m}`;
    };
    let date = usable.getDate();
    let month = usable.getMonth() + 1;
    let year = usable.getFullYear();
    let returnable = date + "/" + month + "/" + year + "   " + h + ":" + m;
    return returnable
}

const savedName = () => {
    if (saved_user !== '') {
        return saved_user
    }
}

const login = async (req, res) => {
    const {username, password} = req.body
    if (!username || !password){
        return res.status(400).json({success: false, message: 'Username and Password are required.'})
    }

    try{
        const user = await Mideabud.findOne({username})
        if (!user || !(await user.isValidPassword(password, user.password))){
            return res.status(401).json ({success: false, message: 'Invalid Username or Password.'})
        }

        //const token = generateToken(user._id)
        fetch(`http://localhost:3000/user?username=${username}`)
        return res.status(200).json({success: true})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}

const logout = (req, res) => {
    saved_user = ''
    fetch(`http://localhost:3000/user?username=''`)
    res.status(200).json({ success: true, message: 'User logged out' })
}

const getUser = async (req, res) => {
    const data = await Mideabud.find()
    if (data){
        res.status(200).json({ success: true, data: data })
    } else {
        res.status(404).json({ success: false, message: 'No user' })
    }   
}

const setUsername = async (req, res) => {
    const { username } = req.query;
    if (username !== '') {
        saved_user = username;
    }
    const data = await Mideabud.find({ username: username })
    res.status(200).json({ success: true, data: data })
}

const currentUserData = (req, res) => {
    res.status(200).json({ success: true, data: saved_user })
}

const userLiked = async (req, res) => {
    if (saved_user !== '') {
        const { post_username } = req.params;
        const { posts } = req.query;
        await Mideabud.updateOne({ username: post_username, "images": { $elemMatch: { img: posts } } }, { $push: { "images.$.likes": saved_user } })
        res.status(200).json({ success: true, message: 'like updated' })
    } else {
        res.status(404).json({ success: false, message: 'like not updated' })
    }
}

const postLikedBy = async (req, res) => {
    if (saved_user !== '') {
        const { posts } = req.body;
        const data = await Mideabud.find({ "images": { $elemMatch: { img: posts } } });
        res.status(200).json({ success: true, data: data })
    } else {
        res.status(404).json({ success: false, message: 'like not updated' })
    }
}

const userComment = async (req, res) => {
    if (saved_user !== '') {
        const { username } = req.body;
        const { posts } = req.body;
        const { com } = req.body;
        await Mideabud.updateOne({ username: username, "images": { $elemMatch: { img: posts } } }, { $push: { "images.$.comments": { username: saved_user, comment: com } } })
        res.status(200).json({ success: true, message: 'comment updated' })
    } else {
        res.status(404).json({ success: false, message: 'comment not updated' })
    }
}

const signup = async (req, res) => {
    try {
        const { firstname } = req.body
        const { lastname } = req.body
        const { username } = req.body
        const { password } = req.body
        const { gender } = req.body
        const { dob } = req.body
        const { date } = req.body
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt)
        await Mideabud.insertMany({ firstname: firstname, lastname: lastname, username: username, password: passwordHash, gender: gender, dob: dob, date: date })   //insertOne is not working but insertmany is working
        saved_user = username
        res.status(200).json({ success: true, message: `New user added ${firstname, lastname, username, password, gender, dob, date}` })
    } catch {
        res.status(404).json({ success: false, message: `FAILED: New user not added` })
    }
}

const newPost = async (req, res) => {
    if (req.files) {
        var file = req.files.file;
        var mime = file.mimetype.split("/")[1];
        var date_extension = Date.now();
        const date_now = current_date();
        newFilename = `./assets/pictures_upload/${saved_user}_${date_extension}.${mime}`;
        file.mv(path.join(__dirname, '..', `/assets/pictures_upload/${saved_user}_${date_extension}.${mime}`), async (err) => {
            if (err) {
                res.status(404).json({ success: false, message: err })
            } else {
                await Mideabud.updateOne({ username: saved_user }, { $push: { images: { img: `./assets/pictures_upload/${saved_user}_${date_extension}.${mime}`, date: date_now, caption: req.body.text } } })
                return res.status(200).sendFile(path.join(__dirname, '..', 'home.html'))
            }
        })
    } else {
        res.status(204).json({succes: false, message: 'post not uploaded'})
    }
}

const newProfileImage = async (req, res) => {
    if (req.files) {
        var file = req.files.profile;
        var mime = file.mimetype.split("/")[1];
        var date_extension = Date.now();
        file.mv(path.join(__dirname, '..', `/assets/profile_pictures/${saved_user}_${date_extension}.${mime}`), async (err) => {
            if (err) {
                res.status(404).json({ success: false, message: err })
            } else {
                await Mideabud.updateOne({ username: saved_user }, { $set: { profile_img: `./assets/profile_pictures/${saved_user}_${date_extension}.${mime}` } })
                return res.status(200).sendFile(path.join(__dirname, '..', 'home.html'))
            }
        })
    } else {
        res.status(204)
    }
}

const updateFirstname = async (req, res) => {
    try {
        await Mideabud.updateOne({ username: saved_user }, { $set: { firstname: `${req.params.fn}` } }) 
        res.status(200).json({ success: true, message: 'Update successful.' })
    } catch {
        res.status(404).json({ success: false, message: 'Update NOT successful.' })
    }
}

const updateLastname = async (req, res) => {
    try {
        await Mideabud.updateOne({ username: saved_user }, { $set: { lastname: `${req.params.ln}` } })
        res.status(200).json({ success: true, message: 'Update successful.' })
    } catch {
        res.status(404).json({ success: false, message: 'Update NOT successful.' })
    }
}

const updateUsername = async (req, res) => {
    try {
        await Mideabud.updateOne({ username: saved_user }, { $set: { username: `${req.params.un}` } })
        res.status(200).json({ success: true, message: 'Update successful.' })
    } catch {
        res.status(404).json({ success: false, message: 'Update NOT successful.' })
    }
}

const updateBio = async (req, res) => {
    try {
        await Mideabud.updateOne({ username: saved_user }, { $set: { bio: `${req.params.bio}` } })
        res.status(200).json({ success: true, message: 'Update successful.' })
    } catch {
        res.status(404).json({ success: false, message: 'Update NOT successful.' })
    }
}

const updatePassword = async (req, res) => {
    try {
        await Mideabud.updateOne({ username: saved_user }, { $set: { password: `${req.params.pwd}` } })
        res.status(200).json({ success: true, message: 'Update successful.' })
    } catch {
        res.status(404).json({ success: false, message: 'Update NOT successful.' })
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
    await Mideabud.updateOne({ username: saved_user }, { $pull: { images: { _id: id } } })
    } catch {
        res.status(404).json({ success: false, message: 'Update NOT successful.' })
    }
}

const deleteAccount = async (req, res) => {
    try {
        await Mideabud.deleteOne({ username: saved_user });
        res.status(200).json({ success: true, message: 'Update successful.' })
    } catch {
        res.status(404).json({ success: false, message: 'Update NOT successful.' })
    }
}

module.exports = {
    login,
    logout,
    getUser,
    setUsername,
    currentUserData,
    userLiked,
    postLikedBy,
    userComment,
    signup,
    newPost,
    newProfileImage,
    updateFirstname,
    updateLastname,
    updateUsername,
    updateBio,
    updatePassword,
    deletePost,
    deleteAccount,
    savedName
}