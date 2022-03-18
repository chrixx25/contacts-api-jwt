const Joi = require('joi');

module.exports = {
    validateUser: (user) => {
        const schema = Joi.object({
            userName: Joi.string().required().max(50),
            password: Joi.string().required().min(8),
            firstName: Joi.string().required().max(50),
            middleName: Joi.optional(),
            lastName: Joi.string().required().max(50),
            email: Joi.string().required().email().max(255),
            mobileNo: Joi.string().required().min(11)
        });
        return schema.validate(user);
    },
    validateLogin: (user) => {
        const schema = Joi.object({
            userName: Joi.string().required().max(50),
            password: Joi.string().required().min(8)
        });
        return schema.validate(user);
    }
}
