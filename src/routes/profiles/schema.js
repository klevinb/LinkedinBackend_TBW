const {Schema, model} = require("mongoose")

const profileSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    surname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    bio:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    area:{
        type: String,
        required: true,
    },
    image:{
        type: String
    },
    username:{
        type: String,
        required: true,
    },


})

profileSchema.set('timestamps', true);

module.exports = model("profile", profileSchema)