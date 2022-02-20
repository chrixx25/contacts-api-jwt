const pool = require('../config/database');

module.exports = {
    get: callback => {
        pool.query(
            `SELECT * FROM tbl_user WHERE Isdeleted = 0`,
            [],
            (error, results, fields) => {
                if (error) callback(error)
                return callback(null, results)
            }
        );
    },
    getById: (id, callback) => {
        pool.query(
            `SELECT * FROM tbl_user WHERE Id = ? AND Isdeleted = 0`,
            [id],
            (error, results, fields) => {
                if (error) callback(error)
                return callback(null, results[0])
            }
        );
    },
    create: (data, callback) => {
        pool.query(
            `INSERT INTO tbl_user (
                UserName,
                Password,
                FirstName,
                MiddleName,
                LastName,
                Email,
                MobileNo
            ) VALUE (?,?,?,?,?,?,?)`,
            [
                data.userName,
                data.password,
                data.firstName,
                data.middleName,
                data.lastName,
                data.email,
                data.mobileNo
            ],
            (error, results, fields) => {
                if (error) callback(error)
                return callback(null, results)
            }
        );
    },
    update: (id, data, callback) => {
        pool.query(
            `UPDATE tbl_user SET
                UserName = ?,
                Password = ?,
                FirstName = ?,
                MiddleName = ?,
                LastName = ?,
                Email = ?,
                MobileNo = ?
            WHERE
                Id = ?`,
            [
                data.userName,
                data.password,
                data.firstName,
                data.middleName,
                data.lastName,
                data.email,
                data.mobileNo,
                id
            ],
            (error, results, fields) => {
                if (error) callback(error)
                return callback(null, results)
            }
        );
    },
    remove: (id, callback) => {
        pool.query(
            `UPDATE tbl_user SET IsDeleted = 1 WHERE Id = ?`,
            [id],
            (error, results, fields) => {
                if (error) callback(error)
                return callback(null, results)
            }
        );
    },
}
