const connection = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = require('../secretKey');
const loginSchema = require('../validation/loginSchema');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        await loginSchema.validate(req.body);

        const user = await connection.knex('users').where({ email }).first();

        if (!user) {
            return res.status(400).json('Usuário não cadastrado.');
        }

        const verifiedPassword = await bcrypt.compare(password, user.senha);

        if (!verifiedPassword) {
            return res.status(400).json('Email ou senha incorretos.')
        }

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '30d'});

        const { senha, ...userData } = user;

        return res.status(200).json({ user: userData, token });
    } catch (error) {
        return res.status(400).json(error.message);
    }

};

module.exports = {
    login
}