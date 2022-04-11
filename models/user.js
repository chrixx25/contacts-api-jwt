const pool = require('../config/database');

module.exports = {
    get: (paging, limit) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM tbl_user WHERE Isdeleted = 0 ORDER BY Id LIMIT ?, ?`,
                [paging, limit],
                (error, results, fields) => {
                    if (error)
                        return reject(error)
                    return resolve(results)
                }
            );
        });
    },
    getTotal: () => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT COUNT(*) total FROM tbl_user WHERE Isdeleted = 0`,
                [],
                (error, results, fields) => {
                    if (error)
                        return reject(error)
                    return resolve(results[0])
                }
            );
        });
    },
    getById: (id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM tbl_user WHERE Id = ? AND Isdeleted = 0`,
                [id],
                (error, results, fields) => {
                    if (error)
                        return reject(error)
                    return resolve(results[0])
                }
            );
        });
    },
    create: (data) => {
        return new Promise((resolve, reject) => {
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
                    data.middleName || '',
                    data.lastName,
                    data.email,
                    data.mobileNo
                ],
                (error, results, fields) => {
                    if (error)
                        return reject(error)
                    return resolve(results)
                }
            );
        });
    },
    update: (id, data) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE tbl_user SET
                UserName = ?,
                FirstName = ?,
                MiddleName = ?,
                LastName = ?,
                Email = ?,
                MobileNo = ?
            WHERE
                Id = ?`,
                [
                    data.userName,
                    data.firstName,
                    data.middleName || '',
                    data.lastName,
                    data.email,
                    data.mobileNo,
                    id
                ],
                (error, results, fields) => {
                    if (error)
                        return reject(error)
                    return resolve(results)
                }
            );
        });
    },
    remove: (id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE tbl_user SET IsDeleted = 1 WHERE Id = ?`,
                [id],
                (error, results, fields) => {
                    if (error)
                        return reject(error)
                    return resolve(results)
                }
            );
        });
    },
    getByUserName: (data) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM tbl_user WHERE UserName = ? AND Isdeleted = 0`,
                [data.userName],
                (error, results, fields) => {
                    if (error)
                        return reject(error)
                    return resolve(results[0])
                }
            );
        });

    },
    updatePassword: (id, data) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE tbl_user SET Password = ? WHERE Id = ?`,
                [data.password, id],
                (error, results, fields) => {
                    if (error)
                        return reject(error)
                    return resolve(results)
                }
            );
        });
    }
}
