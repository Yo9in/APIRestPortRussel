const Catway = require('../models/catways');
const Reservation = require('../models/reservation');


// 🔁 Helper : détection si on veut du JSON ou du HTML
const isJSON = (req) => req.accepts(['html', 'json']) === 'json';

// Ajouter un catway
exports.add = async (req, res, next) => {
    try {
      const { catwayNumber, catwayType, catwayState } = req.body;
      const newCatway = await Catway.create({ catwayNumber, catwayType, catwayState });
      return res.redirect('/catways');
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la création du catway', error });
    }
  };
  

// ✅ Récupérer tous les catways
exports.getAll = async (req, res) => {
    try {
        const catways = await Catway.find({});
        
        if (isJSON(req)) {
            return res.status(200).json({ catways });
        } else {
            return res.render('catways', { title: 'Liste des Catways', catways });
        }
    } catch (error) {
        console.error("❌ Erreur dans getAll:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la récupération des catways", error });
    }
};

// ✅ Récupérer un catway par ID
exports.getById = async (req, res, next) => {
    try {
      const id = req.params.id;
      console.log("📌 Requête détail Catway pour l'id:", id);
  
      const catway = await Catway.findById(id);
      const reservations = await Reservation.find({ catwayNumber: catway.catwayNumber });
  
      if (!catway) {
        return res.status(404).json({ message: "Catway non trouvé" });
      }
  
      return res.render("catwayInfo", { catway, reservations });
    } catch (error) {
      console.error("💥 Erreur dans getById:", error);
      return res.status(500).json({ message: "Erreur serveur", error });
    }
  };
  

// ✅ Mettre à jour uniquement l’état d’un catway
exports.update = async (req, res) => {
    const { catwayState } = req.body;

    if (!catwayState) {
        return res.status(400).json({ message: "Seul le champ 'catwayState' peut être mis à jour" });
    }

    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.status(404).json({ message: "Catway non trouvé" });
        }

        catway.catwayState = catwayState;
        await catway.save();

        return res.status(200).json({ message: "Catway mis à jour", catway });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la mise à jour du catway", error });
    }
};

// ✅ Supprimer un catway
exports.delete = async (req, res) => {
    try {
        const deleted = await Catway.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Catway non trouvé" });
        }

        return res.status(204).end(); // No content
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la suppression du catway", error });
    }
};
