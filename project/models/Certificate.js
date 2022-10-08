
//Model of the certificate table 
const mongoose = require('mongoose')

const certificateSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true

    },
    email:{
        type: String,
        required: true

    },
    hashcode: {
        type: String,
        required:true,
        
    },

    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
})
module.exports = mongoose.model('Certificate', certificateSchema)