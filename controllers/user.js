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

const getUser = (req, res, next) => {
    let user;
    getById(req.params.id, (err, results) => {
        if (err)
            return res.status(500).json(err);
        if (!results)
            return res.status(200).json({ message: 'No record found.' });
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
    });
}

module.exports = {
    loginUser: (req, res) => {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const body = req.body;

        getByUserName(body, (err, results) => {
            if (err)
                return res.status(500).json(err);
            if (!results)
                return res.status(401).json({ message: 'Username or Password is incorrect.' });

            const isPasswordMatch = compareSync(body.password, results.Password);

            if (isPasswordMatch) {
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
                const jsontoken = sign({
                    result: {
                        id: Id,
                        userName: UserName,
                        password: Password,
                        firstName: FirstName,
                        middleName: MiddleName,
                        lastName: LastName,
                        email: Email,
                        mobileNo: MobileNo
                    }
                }, 'userToken', {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    success: 1,
                    message: "login successfully",
                    token: jsontoken
                });
            }
            return res.status(401).json({ message: 'Username or Password is incorrect.' });
        });
    },
    getUsers: (req, res) => {
        get((err, results) => {
            if (err)
                return res.status(500).json(err);
            if (results.length < 1)
                return res.status(200).json({ message: 'No record found.' });

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
        });
    },
    getUserById: (req, res) => res.status(200).json(res.user),
    getUser: getUser,
    createUser: (req, res) => {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        create(body, (err, results) => {
            if (err)
                return res.status(500).json(err);
            return res.status(201).json(results);
        });
    },
    updateUser: (req, res) => {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        update(req.params.id, body, (err, results) => {
            if (err)
                return res.status(500).json(err);
            return res.status(200).json(res.user);
        });
    },
    removeUser: (req, res) => {
        remove(req.params.id, (err, results) => {
            if (err)
                return res.status(500).json(err);
            return res.status(201).json(results);
        });
    }
}
