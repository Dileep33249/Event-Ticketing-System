const mongoose = require('mongoose');

const organsierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    role: {
        type: String,
        enum: ['organiser'],
        default: 'organiser'
    }
});

module.exports = mongoose.models.Organiser || mongoose.model('Organiser', organsierSchema);
