const { create, get, getById, update, remove } = require('../models/user');
const Joi = require('joi');
const { genSaltSync, hashSync } = require('bcrypt');

const validateUser = (human) => {
    const schema = Joi.object({
        userName: Joi.string().required().max(50),
        password: Joi.string().required().min(8),
        firstName: Joi.string().required().max(50),
        middleName: Joi.string().required().max(50),
        lastName: Joi.string().required().max(50),
        email: Joi.string().required().email().max(255),
        mobileNo: Joi.string().required().min(11)
    });
    return schema.validate(human);
}

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
    getUserById: (req, res) => {
        return res.status(200).json(res.user);
    },
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
    },
    getUser: getUser
}
