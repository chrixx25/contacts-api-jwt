const jwt = require("jsonwebtoken");

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get('Authorization');
        if (token) {
            token = token.slice(7);
            jwt.verify(token, 'userToken', (err, decoded) => {
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