const connection = require('../connection');
const jwt = require('jsonwebtoken');
const secretKey = require('../secretKey');

const loginVerifier = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(404).json('Token não informado.');
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, secretKey);

        const query = 'select * from users where id = $1';
        const { rows, rowCount: isUserRegistered } = await connection.query(query, [id]);

        if (!isUserRegistered) {
            return res.status(404).json('O usuário não foi encontrado.');
        }
        
        const { senha, ...user } = rows[0];

        req.user = user;

        next();

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

module.exports = loginVerifier;
