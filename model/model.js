const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

/*
 * User Schema 
*/
const UserSchema = new Schema({
  username: { type: String, required: true,  unique: true  },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, required: true }
});

/*
 * Hash the user password
*/
UserSchema.pre(
  'save',
  async function(next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
  }
);

/**
 * Validated requested payload password
*/
UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;

