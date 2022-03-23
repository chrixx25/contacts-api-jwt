const express = require('express');
const router = express.Router();
const { checkToken } = require('../auth/tokenValidation');
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    removeUser,
    getUser,
    loginUser,
    updatePassword
} = require('../controllers/user');

router.post('/login', loginUser);
router.get('/', checkToken, getUsers);
router.get('/:id', checkToken, getUser, getUserById);
router.post('/', checkToken, createUser);
router.put('/:id', checkToken, getUser, updateUser);
router.put('/change-password/:id', checkToken, getUser, updatePassword);
router.delete('/:id', checkToken, getUser, removeUser);

module.exports = router;
