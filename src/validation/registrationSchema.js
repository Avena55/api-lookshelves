const yup = require('./yup');

const registrationSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required()
});

module.exports = registrationSchema;