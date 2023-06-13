const connection = require('../connection');


const userShelf = async (req, res) => {    
    const { user } = req;    

    try {
        const books = await connection.knex('books').where({ user_id: user.id });        
        return res.status(200).json(books);

    } catch (error) {
        return res.status(400).json(error.message); 
    }

}

const registerBook = async (req, res) => {
    const { bookIsbn, comment, rating } = req.body;
    const { user } = req;

    if (!bookIsbn) {
        return res.status(404).json('Por favor informe o ISBN do livro.');
    }

    try {
        const bookToBeRegistered = await connection.knex('books').insert({ user_id: user.id, isbn: bookIsbn, comment: comment, rating: rating});

        if (bookToBeRegistered.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o livro.');
        }

        return res.status(200).json('Livro cadastrado com sucesso.');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const updateBook = async (req, res) => {
    const { comment, rating } = req.body;
    const { user } = req;
    const { id: bookId } = req.params;

    try {
        const existingBook = await connection.knex('books').where({ user_id: user.id, id: bookId}).first();
        
        if (!existingBook) {
            return res.status(400).json('O livro não foi encontrado.');
        }

        const bookToBeUpdated = await connection.knex('books').update({ comment, rating }).where( { id: bookId, user_id: user.id });

        if (!bookToBeUpdated) {
            return res.status(400).json('Não foi possível atualizar o livro.');
        }

        return res.status(200).json('Livro atualizado com sucesso.');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const deleteBook = async (req, res) => {
    const { user } = req;
    const { id: bookId } = req.params;

    try {
        const existingBook = await connection.knex('books').where({ user_id: user.id, id: bookId}).first();

        if (!existingBook) {
            return res.status(404).json('O livro não foi encontrado.');
        }

        const booktoBeDeleted = await connection.knex('books').del().where( { id: bookId, user_id: user.id });

        if (!booktoBeDeleted) {
            return res.status(400).json('Não foi possível excluir o livro.');            
        }

        return res.status(200).json('Livro excluído com sucesso.')
    } catch (error) {
        return res.status(400).json(error.message); 
    }
}

module.exports = {
    registerBook,
    updateBook,
    deleteBook,
    userShelf
}