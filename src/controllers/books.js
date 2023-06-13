const connection = require('../connection');


const userShelf = async (req, res) => {    
    const { user } = req;    

    try {
        const books = await connection.query('select * from books where user_id = $1', [user.id]);
        return res.status(200).json(books.rows);

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
        const bookToBeRegistered = await connection.query('insert into books (user_id, ISBN, comment, rating) values ($1, $2, $3, $4)', [user.id, bookIsbn, comment, rating]);

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
        const existingBook = await connection.query('select * from books where id = $1 and user_id = $2', [bookId, user.id]);        
        
        if (existingBook.rowCount === 0) {
            return res.status(400).json('O livro não foi encontrado.');
        }

        const bookToBeUpdated = await connection.query('update books set comment = $1, rating = $2 where id = $3 and user_id = $4', [comment, rating, bookId, user.id]);

        if (bookToBeUpdated.rowCount === 0) {
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
        const existingBook = await connection.query('select * from books where id = $1 and user_id = $2', [bookId, user.id]);

        if (existingBook.rowCount === 0) {
            return res.status(404).json('O livro não foi encontrado.');
        }

        const { rowCount: wasItDeleted } = connection.query('delete from books where id = $1', [bookId]);

        if (wasItDeleted) {
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