const express = require('express');
const users = require('./controllers/users');
const login = require('./controllers/login');
const books = require('./controllers/books');
const loginVerifier = require('./filters/loginVerifier');

const routes = express();

routes.post('/cadastro', users.register);
routes.post('/login', login.login);
routes.use(loginVerifier);
routes.post('/livro', books.registerBook);
routes.patch('/livro/:id', books.updateBook);
routes.delete('/livro/:id', books.deleteBook);
routes.get('/estante', books.userShelf);
routes.get('/usuario', users.getUser);

module.exports = routes;