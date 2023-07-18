const connection = require('../connection');
const bookSchema = require('../validation/bookSchema')


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
    const { bookTitle, isbn, comment, rating } = req.body;
    const { user } = req;
    const bookCover = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

    try {
        await bookSchema.validate(req.body);

        const bookToBeRegistered = await connection.knex('books').insert({ user_id: user.id, title: bookTitle, isbn, comment, rating, cover: bookCover });

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