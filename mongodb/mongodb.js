const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MideabudSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Fisrtname is required.'],
        minlength: [3, 'Firstname must be atleast 3 chracter long.'],
        maxlength: [50, 'Firstname must be atmost 50 character long.'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required.'],
        minlength: [3, 'Lastname must be atleast 3 chracter long.'],
        maxlength: [50, 'Lastname must be atmost 50 character long.'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required.'],
        minlength: [3, 'Username must be atleast 3 chracter long.'],
        maxlength: [30, 'Username must be atmost 30 character long.'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [8, 'Password must be atleast 8 chracter long.']
    },
    gender: {
        type: String,
        default: 'none',
        enum: {
            values: ['male', 'female', 'none']
        }
    },
    dob: String,
    profile_img: {
        type: String,
        default: './assets/user.jpg'
    },
    images: [{ img: String, likes: { type: Array, default: [] }, comments: [{ username: String, comment: String }], caption: { type: String, default: 'No caption' }, date: String, post_id: Number }],
    bio: 
    {
        type: String,
        default: ''
    },
    date: String,
    verified: {
        type: Boolean,
        default: false
    }
});

MideabudSchema.methods.isValidPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash)
}

module.exports = mongoose.model("MideaBUD", MideabudSchema, "mideabud")