const mongoose = require('mongoose');




const catwaySchema = mongoose.Schema(
    {
    catwayNumber: {
        type    : Number,
        required: true
    },

    catwaytype: {
        type     : String,
        trim     : true,
        required : true, 
        lowercase: true,
        enum: ['long', 'short'], 
    },
    catwayState: {
        type: String,
        trim: true,
    }

});


const Catway = mongoose.model('Catway', catwaySchema);
module.exports = Catway;