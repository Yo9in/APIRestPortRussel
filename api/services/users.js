const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
  
// Lister tous les utilisateurs
exports.getAll = async (req, res, next) => {
    try {
      const users = await User.find({});
      return res.render('users', { users }); // rend la vue EJS
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error });
    }
  };
  

exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        let user = await User.findById(id);

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}
// Ajout d'un utilisateur 
exports.add = async (req, res, next) => {

    const temp = ({
        name     : req.body.name,
        
        email    : req.body.email,
        password : req.body.password
    });

    try {
        let user = await User.create(temp);

        return res.status(201).json(user);
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Modifier un utiisateur
exports.update = async (req, res, next) => {
    const id = req.params.id
    const temp = ({
        name    : req.body.name,
        
        email    : req.body.email,
        password : req.body.password
    });

    try {
        let user = await User.findOne({_id : id});

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            });

            await user.save();
            return res.status(201).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Supprimer un utilisateur 
exports.delete = async (req, res, next) => {
    const id = req.params.id

    try {
        await User.deleteOne({ _id: id });

        return res.redirect('/users');

    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

        if (user) {
            bcrypt.compare(password, user.password, function(err, response) {
                if (err) {
                    throw new Error(err);
                }
                if (response) {
                    delete user._doc.password;

                    const expireIn = 24 * 60 * 60;
                    const token    = jwt.sign({
                        user: user 
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: expireIn
                    });

                    res.header('Authorization', 'Bearer' + token);

                    res.cookie('token', token, {
                        httpOnly: true,
                        maxAge: expireIn * 1000
                    });
                    
                    return res.redirect('/dashboard');
                }

                return res.status(403).json('wrong_credentials');
            });
        } else {
            return res.status(404).json('user_not_found');
        }
    } catch (error) {
        return res.status(501).json(error);
    }
}