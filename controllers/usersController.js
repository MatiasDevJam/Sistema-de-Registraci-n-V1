const fs = require('fs');
const bcrypt = require('bcrypt');
const users_db = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
const {validationResult} = require('express-validator');

module.exports = {
    register: (req,res)=>{
        res.render('register',{
            title: "Register"
        })
    },
    processRegister: (req,res)=>{

        let errores = validationResult(req);

        if(!errores.isEmpty()){
            return res.render('register', {
                errores: errores.errors
            })
        };

        const {username, lastname ,email, pass} = req.body;

        let lastID = 0;
        users_db.forEach(user => {
            if(user.ID > lastID){
                lastID = user.id
            }
	})

        let hashPass = bcrypt.hashSync(pass, 12)

        let newUser = {
            id: +lastID + 1,
            username,
            lastname,
            email,
            pass: hashPass,
            avatar: req.files[0].filename
        };

        users_db.push(newUser);

        fs.writeFileSync('./data/users.json', JSON.stringify(users_db,null,2));

        res.redirect('/users/login');

    },
    login: (req,res)=>{
        res.render('login',{
            title: "Login"
        })
    },
    processLogin: (req,res)=>{
        
        let errores = validationResult(req);

        if(!errores.isEmpty()){
            return res.render('login',{
                errores: errores.errors
            })
        }else{
            const {email,pass} = req.body;

            let result = users_db.find(user => user.email === email);

            if(result){
                if(bcrypt.compareSync(pass.trim(),result.pass)){

                    req.session.user = {
                        id: result.id,
                        username: result.username,
                        avatar: result.avatar
                    }

                    return res.redirect('/users/profile')
                }
            }
            return res.render('login',{
                errores: [
                    {
                        msg: "credenciales inválidas"
                    }
                ]
            })
        }
    },
    profile: (req,res)=>{
        res.render('profile',{
            title: "Profile"
        })
    }
}