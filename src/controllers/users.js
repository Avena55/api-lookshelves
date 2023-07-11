const connection = require('../connection')
const bcrypt = require('bcrypt');
const registrationSchema = require('../validation/registrationSchema')

const register = async(req, res) => {
    const { name, email, password } = req.body;

    try {
        await registrationSchema.validate(req.body);

        const isEmailDuplicate = await connection.knex('users').where({email}).first();

        if (isEmailDuplicate) {
            return res.status(400).json('O email informado já existe.');
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
 
        const user = await connection.knex('users').insert({ nome: name, email, senha: encryptedPassword  });

        if (user.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o usuário.');
        }

        return res.status(200).json('Usuário cadastrado com sucesso.');

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const getUser = async(req, res) => {
    const { user } = req;    

    try {
        const userData = await connection.knex.select('nome', 'email').from('users').where({id: user.id})
        return res.status(200).json(userData);

    } catch (error) {
        return res.status(400).json(error.message); 
    }
}

module.exports = {
    register,
    getUser
}