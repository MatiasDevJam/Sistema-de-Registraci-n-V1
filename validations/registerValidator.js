const fs = require('fs');
const {check, body} = require('express-validator');
const users_db = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));

module.exports = [
    check('username')
    .notEmpty().withMessage('Debe ingresar su nombre'),

    check('lastname')
    .notEmpty().withMessage('Debe ingresar su apellido'),

    check('email')
    .isEmail().withMessage('Debe ingresar un email válido'),

    body('email').custom((value)=>{
        let result = users_db.find(user => user.email === value);

        if(result){
            return false
        }else{
            return true
        }
    }).withMessage('El email ya esta registrado'),

    check('pass')
    .isLength({
        min: 6,
        max: 12
    }).withMessage('La contraseña debe tener entre 6 y 12 caracteres'),

    body('pass2').custom((value, {req})=>{
        if(value !== req.body.pass){
            return false
        }else{
            return true
        }
    }).withMessage('Las contraseñas no coinciden')


]