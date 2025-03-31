const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Catway = require('../models/catways');
const Reservation = require('../models/reservation');
const { render } = require('pug');
const { response } = require('../app');
const jwt = require('jsonwebtoken');

exports.dashboard = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).render('index', { title: 'Accueil', error: 'Token manquant, veuillez vous reconnecter' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.user;
        const users = await User.find({});
        const catways = await Catway.find({});
        const reservation = await Reservation.find({})
        const catwayId = await Catway.findOne({});
        return res.render('dashboard', {
            title: 'Dashboard',
            users: users,
            catways: catways,
            reservation: reservation,
            catwayId: catwayId._id,
            user: req.user
        });
    } catch (error) {
        console.error('Erreur dans dashboard 🧨:', error);
        return res.status(500).render('index', {
            title: 'Erreur',
            error: 'Erreur serveur lors du chargement du dashboard'
        });
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.body.user;
        let user = await User.findById(userId);

        return res.render('updateUser', {
            title: "Update user",
            user: user
        });
    } catch (error) {
        return res.status(500).json(error)
    }
};

exports.updateUserById = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    let temp = {
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password
    }

  try {
    const id = req.params.id;

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({message: 'Token non trouvé'});
    }

    fetch(`http://${process.env.API_URL}/users/${id}`, {
        method: "PATCH",
        headers: {
            'authorization': 'Bearer ${token}',
            "Content-Type": "application/json",
        },
        body: JSON.stringify(temp),
    })
    .then(response => {
        if (response.ok) {
            return res.redirect('/dashboard');
        } else {
            return response.json().then(errorData => {
                return res.status(response.status).json(errorData);
            });
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Erreur Serveur'});
    });
  } catch (error) {
    console.error('Erreur Inatendue', error);
    return res.status(500).json({ message: 'Erreur Serveur'});
  } 
};

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.query.user;

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({message:'Token non trouvé'});
        };

        fetch(`http://${process.env.API_URL}/users/${userId}`, {
            method: "DELETE",
            headers: {
                'authorization': 'Bearer ${token}',
            }
        })
        .then(reponse => {
            if (response.ok) {
                return res.redirect('/dashboard');
            } else {
                return response.json().then(errorData => {
                    return res.status(response.status).json(errorData);
                });
            }
        })
        .catch(error => {
            console.error('Erreur supression user:', error);
            return res.status(500).json({message: 'Erreur Serveur'});
        });
    } catch (error) {
        console.error('Erreur Inatendue:', error);
        return res.status(500).json({message: 'Erreur Serveur'});
    } 
};

exports.updateCatway = async (req, res, next) => {
    try {
        const catwayId = req.params.id;
        let catway = await Catway.findById(catwayId);

        return res.render('updateCatway', {
            titre: "Updt Catway",
            catway: catway
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.updateCatwayById = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    let temp = {
        "catwayState": req.body.catwayState
    }

    try {
        const id = req.params.id;

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({message: 'error'});
        }
        fetch(`http://${process.env.API_URL}/catways/${id}`, {
            method: "PATCH",
            headers: {
                'authorization': 'Bearer ${token}',
                "Content-Type": "application/json",
            },
            body: JSON.stringify(temp),
        })
        .then(response => {
            if (response.ok) {
                return res.redirect('/dashboard');
            } else {
                return response.json().then(errorData => {
                    return res.status(response.status).json(errorData);
                });
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            return res.status(500).json({message: 'Erreur Serveur'});
        });
    } catch (error) {
        console.error('Erreur Inatendue:', error);
        return res.status(500).json({message:'Erreur Serveur'});
    }
};

exports.deleteCatway = async (req, res, next) => {
    try {
        const id = req.params.id;
        const token = req.cookies.token;
  
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: Missing authorization token' });
        };

        fetch(`http://${process.env.API_URL}catways/${id}`, {
            method: "DELETE",
            headers: {
                'authorization': 'Bearer ${token}',
            }
        })
            .then(response => {
                if (response.ok) {
                    return res.redirect('/dashboard');
                } else {
                    return response.json().then(errorData => {
                        return res.status(response.status).json(errorData);
                    });
                }
            })
            .catch(error => {
                console.error('Erreur Inatendue', error);
                return res.status(500).json({message:'Erreur Serveur'});
            });
        } catch (error) {
            console.error('Erreur Inatendue:', error);
            return res.status(500).json({message:'Erreur Interne'});
        }
    };
    
    
exports.addBooking = async (req, res, next) => {
        try {
          const catway = JSON.parse(req.body.catwayNumber);
    
          const token = req.cookies.token;
    
          if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Missing authorization token' });
          };
    
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
          myHeaders.append("Authorization", token);
    
          const urlencoded = new URLSearchParams();
          urlencoded.append("ReservationId", req.body.reservationId);
          urlencoded.append("clientName", req.body.clientName);
          urlencoded.append("boatName", req.body.boatName);
          urlencoded.append("startDate", req.body.startDate);
          urlencoded.append("endDate", req.body.endDate);
    
          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded
          };
    
          await fetch(`http://${process.env.API_URL}/catways/${catway._id}/reservations`, 
            requestOptions)
            .then(response => {
              if (response.ok) {
                return res.redirect('/dashboard');
              } else {
                return response.json().then(errorData => {
                  return res.status(response.status).json(errorData);
                });
              }
            })
            .catch(error => {
              console.error('Error deleting catway:', error);
              return res.status(500).json({ message: 'Internal Server Error' });
            });
        } catch (error) {
          console.error('Unexpected error:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      }; 
      
exports.getBookingInfo = async (req, res, next) => {
        try {
          const id = req.params.id;
      
          const book = await Booking.findById(id);
      
          const catway = await Catway.findOne({catwayNumber: book.catwayNumber})
      
          return res.redirect(`/catways/${catway._id}/reservations/${book._id}`)
        } catch (error) {
          console.error('Unexpected error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
      };
      
exports.deleteBooking = async (req, res, next) => {
        try {
            const id = req.params.id;
            const token = req.cookies.token;
      
            const book = await Booking.findById(id);
            const catway = await Catway.findOne({"catwayNumber": book.catwayNumber});
      
            if (!token) {
              return res.status(401).json({ message: 'Unauthorized: Missing authorization token' });
            };
      
         
            fetch(`http://${process.env.API_URL}/catways/${catway._id}/reservations/${id}`, {
              method: "DELETE",
              headers: {
                'authorization': `Bearer ${token}`, 
              }
            })
              .then(response => {
                if (response.ok) {
                  return res.redirect('/dashboard');
                } else {
                  return response.json().then(errorData => {
                    return res.status(response.status).json(errorData);
                  });
                }
              })
              .catch(error => {
                console.error('Error deleting catway:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
              });
          } catch (error) {
            console.error('Unexpected error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
          }
      };      
  
