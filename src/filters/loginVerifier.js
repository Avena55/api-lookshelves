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

        const isUserRegistered = await connection.knex('users').where({ id }).first();

        if (!isUserRegistered) {
            return res.status(404).json('O usuário não foi encontrado.');
        }
        
        const { senha, ...user } = isUserRegistered;

        req.user = user;

        next();

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

module.exports = loginVerifier;
