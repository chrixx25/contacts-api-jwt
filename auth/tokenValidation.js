require('dotenv').config();
const jwt = require("jsonwebtoken");

module.exports = {
    checkToken: (req, res, next) => {
        const token = req.get('Authorization');
        if (token) {
            jwt.verify(token.slice(7), process.env.TOKEN_NAME, (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        message: 'Invalid Token.'
                    });
                }
                req.decoded = decoded;
                next();
            });
            return false;
        }
        return res.status(403).json({
            message: 'Access denied! Unauthorized user.'
        });
    }
}