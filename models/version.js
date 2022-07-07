const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    ios_version: { type: String, default: null },
    android_version: { type: String, default: null },
    ios_appLink: { type: String, default: null },
    android_appLink: { type: String, default: null },
    soft_update: {type: Boolean, default: false},
    force_update: {type: Boolean, default: false},
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },

)

const version = mongoose.model('version', versionSchema)

module.exports = version