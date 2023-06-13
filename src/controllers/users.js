const connection = require('../connection')
const bcrypt = require('bcrypt');

const register = async(req, res) => {
    const { nome, email, password } = req.body;
    
    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }

    if (!email) {
        return res.status(404).json('O campo e-mail é obrigatório');
    }

    if (!password) {
        return res.status(404).json('O campo senha é obrigatório');
    }

    try {
        const queryEmailCheck = 'select * from users where email = $1';
        const { rowCount: isEmailDuplicate } = await connection.query(queryEmailCheck, [email]);

        if (isEmailDuplicate) {
            return res.status(400).json('O email informado já existe.');
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const query = `insert into users (nome, email, senha) values ($1, $2, $3);`
        const user = await connection.query(query, [nome, email, encryptedPassword]);

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
        const userData = await connection.query('select nome, email from users where id = $1', [user.id]);
        return res.status(200).json(userData.rows[0]);

    } catch (error) {
        return res.status(400).json(error.message); 
    }
}

module.exports = {
    register,
    getUser
}