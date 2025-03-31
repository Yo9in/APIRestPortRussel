const Catway = require('../models/catways');

// 🔁 Helper : détection si on veut du JSON ou du HTML
const isJSON = (req) => req.accepts(['html', 'json']) === 'json';

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
exports.getById = async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);

        if (!catway) {
            return isJSON(req)
                ? res.status(404).json({ message: 'Catway non trouvé' })
                : res.status(404).send('Catway non trouvé');
        }

        return isJSON(req)
            ? res.status(200).json({ catway })
            : res.render('catwayInfo', { title: 'Détail Catway', catway });

    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur lors de la récupération du catway", error });
    }
};

// ✅ Créer un nouveau catway
exports.add = async (req, res) => {
    const { catwayNumber, catwayType, catwayState } = req.body;

    // Validation simple
    if (!catwayNumber || !catwayType || !catwayState) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        const existing = await Catway.findOne({ catwayNumber });
        if (existing) {
            return res.status(400).json({ message: "Un catway avec ce numéro existe déjà" });
        }

        const newCatway = new Catway({ catwayNumber, catwayType, catwayState });
        await newCatway.save();

        return res.status(201).json({ message: "Catway créé avec succès", catway: newCatway });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la création du catway", error });
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
