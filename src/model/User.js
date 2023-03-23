const { getDB } = require("../util/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.cart = [];
    this.orders = [];
  }

  create() {
    const db = getDB();
    return db.collection("users").insertOne(this);
  }

  static getUser(email){
    const db = getDB()
    return db.collection("users").findOne({"email": email})
  }
 
}

module.exports = User;
