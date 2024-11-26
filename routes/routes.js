const express = require('express');
const router = express.Router();
const {
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
    deleteAccount
} = require('../controllers/controllers')

router.post('/login', login)
router.get('/logout', logout)
router.get('/showalluserdata', getUser)
router.get('/user', setUsername)
router.get('/requested/send/data/user/profile', currentUserData)
router.get('/another-user-liked-post-by/:post_username', userLiked)
router.post('/liked-post-by', postLikedBy)
router.post('/another-user-commented-post-by', userComment)
router.post('/signup', signup)
router.post('/', newPost)
router.post('/new-profile', newProfileImage)
router.post('/update-fn/:fn', updateFirstname)
router.post('/update-ln/:ln', updateLastname)
router.post('/update-un/:un', updateUsername)
router.post('/update-bio/:bio', updateBio)
router.post('/update-pwd/:pwd', updatePassword)
router.get('/delete-post/:id', deletePost)
router.get('/delete/account-delete', deleteAccount)

module.exports = router