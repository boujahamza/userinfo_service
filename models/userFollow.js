const mongoose = require("mongoose");

let followSchema = new mongoose.Schema({
    user_id: {type: String, required:true},
    followed_by: {type: String, required:true}
});

module.exports = mongoose.model("userFollow", followSchema);