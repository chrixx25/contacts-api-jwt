const { createUser, getUsers, getUserById, updateUser, removeUser, getUser } = require('../controllers/user');
const express = require('express');
const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser, getUserById);
router.post('/', createUser);
router.put('/:id', getUser, updateUser);
router.delete('/:id', getUser, removeUser);

module.exports = router;
