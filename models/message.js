const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
