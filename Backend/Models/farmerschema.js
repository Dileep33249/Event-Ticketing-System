const mongoose = require('mongoose');
const farmerschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        index : true
    },
    role: {
        type : String,
        enum : ['user' , 'organiser'],
        default : 'user'
    }
})
module.exports = mongoose.models.Farmers || mongoose.model('Farmers', farmerschema);