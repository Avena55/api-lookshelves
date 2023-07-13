const yup = require('./yup');

const bookSchema = yup.object().shape({
    isbn: yup.number().required(),
    bookTitle: yup.string().required()
});

module.exports = bookSchema;