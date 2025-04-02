const Reservation = require('../models/reservation'); 
const Catway = require('../models/catways');

// ✅ Lister toutes les réservations pour un catway
exports.getAllAll = async (req, res, next) => {
    try {
      const reservations = await Reservation.find({});
      const catway = await Catway.findOne(); // récupère un catway
  
      if (!catway) {
        return res.status(404).send("Aucun catway trouvé.");
      }
  
      return res.render('reservationGlobal', {
        reservations,
        catway, // ✅ ici on passe bien l’objet catway attendu dans la vue
      });
    } catch (err) {
      console.error("Erreur récupération réservations globales:", err);
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
  };
  
  

// ✅ Détails d'une réservation spécifique
exports.getById = async (req, res, next) => {
    const catwayId = req.params.id;
    const idReservation = req.params.idReservation;

    try {
        const catway = await Catway.findById(catwayId);
        if (!catway) return res.status(404).json({ message: "Catway non trouvé" });

        const reservation = await Reservation.findById(idReservation);
        if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });

        return res.render('reservationInfo', {
            title: 'Info de réservation',
            reservation,
            catway
        });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};

// ✅ Créer une réservation liée à un catway
exports.add = async (req, res, next) => {
    console.log("📥 Requête reçue pour créer une réservation");
console.log("catwayId =>", req.params.id);

    const catwayId = req.params.id;
    const { ReservationId, clientName, boatName, startDate, endDate } = req.body;
  
    try {
      const catway = await Catway.findById(catwayId);
      if (!catway) {
        return res.status(404).json({ message: "Catway non trouvé" });
      }
  
      const newReservation = new Reservation({
        ReservationId,
        clientName,
        boatName,
        catwayNumber: catway.catwayNumber,
        startDate,
        endDate
      });
  
      await newReservation.save();
  
      return res.redirect('/reservations'); // ou vers la page de détails
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la création de la réservation", error });
    }
  };
  

// ✅ Modifier une réservation existante
exports.update = async (req, res, next) => {
    const catwayId = req.params.id;
    const reservationId = req.params.idReservation;

    try {
        const catway = await Catway.findById(catwayId);
        if (!catway) return res.status(404).json({ message: "Catway non trouvé" });

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });

        const updates = {
            ReservationId: req.body.ReservationId,
            catwayNumber: catway.catwayNumber,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        };

        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) reservation[key] = updates[key];
        });

        await reservation.save();
        return res.status(200).json({ message: "Réservation mise à jour", reservation });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la mise à jour", error });
    }
};

// ✅ Supprimer une réservation
exports.delete = async (req, res, next) => {
    const catwayId = req.params.id;
    const reservationId = req.params.idReservation;

    try {
        const catway = await Catway.findById(catwayId);
        if (!catway) return res.status(404).json({ message: "Catway non trouvé" });

        await Reservation.findByIdAndDelete(reservationId);

        return res.status(204).json({ message: "Réservation supprimée" });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la suppression", error });
    }
};
