require('dotenv').config();
const { sign } = require("jsonwebtoken");
const { genSaltSync, hashSync, compareSync } = require('bcrypt');

const {
    validateUser,
    validateLogin
} = require('../utils/validations/userValidations');
const {
    create,
    get,
    getById,
    update,
    remove,
    getByUserName
} = require('../models/user');

const getUser = async (req, res, next) => {
    let user;
    try {
        const results = await getById(req.params.id);
        if (!results)
            return res.status(404).send('User Not Found.');

        const {
            Id,
            UserName,
            Password,
            FirstName,
            MiddleName,
            LastName,
            Email,
            MobileNo
        } = results;
        const data = {
            id: Id,
            userName: UserName,
            password: Password,
            firstName: FirstName,
            middleName: MiddleName,
            lastName: LastName,
            email: Email,
            mobileNo: MobileNo
        }
        user = data;
        res.user = user;
        next();
    } catch (err) {
        return res.status(500).json(err);
    }
}

module.exports = {
    loginUser: async (req, res) => {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const body = req.body;

        try {
            const results = await getByUserName(body);

            if (!results)
                return res.status(401).json({ message: 'Username or Password is incorrect.' });

            const isPasswordMatch = compareSync(body.password, results.Password);

            if (isPasswordMatch) {
                const {
                    Id,
                    UserName,
                    FirstName,
                    MiddleName,
                    LastName,
                    Email,
                    MobileNo
                } = results;
                const jsontoken = sign({
                    result: {
                        id: Id,
                        userName: UserName,
                        firstName: FirstName,
                        middleName: MiddleName,
                        lastName: LastName,
                        email: Email,
                        mobileNo: MobileNo
                    }
                }, process.env.TOKEN_NAME, {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    success: 1,
                    message: "login successfully",
                    token: jsontoken
                });
            }
            return res.status(401).json({ message: 'Username or Password is incorrect.' });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    getUsers: async (req, res) => {
        try {
            const results = await get();
            const data = results.map(({
                Id,
                UserName,
                Password,
                FirstName,
                MiddleName,
                LastName,
                Email,
                MobileNo
            }) => {
                return {
                    id: Id,
                    userName: UserName,
                    password: Password,
                    firstName: FirstName,
                    middleName: MiddleName,
                    lastName: LastName,
                    email: Email,
                    mobileNo: MobileNo
                }
            });
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).send(err.message);
        }
    },
    getUserById: (req, res) => res.status(200).json(res.user),
    getUser,
    createUser: async (req, res) => {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        try {
            const results = await create(body);
            if (results) {
                const isUserNameMatch = await getByUserName(body);
                if (isUserNameMatch)
                    return res.status(400).send(`${body.userName} username already exists.`);
                return res.status(201).send(`${body.firstName} sucessfully created.`);
            }
        } catch (err) {
            return res.status(500).send(err.message);
        }
    },
    updateUser: async (req, res) => {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const body = req.body;
        //const decodedToken = req.decoded; // decoded token
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        try {
            const results = await update(req.params.id, body);
            if (results) {
                const isUserNameMatch = await getByUserName(body);
                if (isUserNameMatch)
                    return res.status(400).send(`${body.userName} username already exists.`);
                return res.status(200).json(res.user);
            }
            return res.status(400).send('Failed to update.');
        } catch (err) {
            return res.status(500).send(err.message);
        }
    },
    removeUser: async (req, res) => {
        try {
            const results = await remove(req.params.id);
            if (results)
                return res.status(200).send(`${res.user.UserName} sucessfully deleted.`);
            return res.status(400).send('Failed to delete.');
        } catch (err) {
            return res.status(500).send(err.message);
        }
    }
}