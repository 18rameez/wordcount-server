const {getDB} = require("../util/database")
const { ObjectId } = require("mongodb");


class WordCount {

    constructor(userId, url, wordCount, webLinks= [], mediaLinks = []) {
        this.userId = new ObjectId (userId);
        this.url = url;
        this.wordCount = wordCount;
        this.favourite = false;
        this.webLinks = webLinks;
        this.mediaLinks = mediaLinks
    }

    create(){
        const db = getDB();
        return db.collection("word_countes_history").insertOne(this)
    }


    static getAll (userId){
        const db = getDB();
        return db.collection("word_countes_history").find({userId : new ObjectId(userId)}).toArray()
    }

    static addToFavourite (id, state){
        const db = getDB();
        return db.collection("word_countes_history").updateOne({_id : new ObjectId(id)}, {$set : {"favourite": state}})
    }


    static delete(id){
       
        const db = getDB();
        return db.collection("word_countes_history").deleteOne({_id : new ObjectId(id)})
    }


    static getCount(){

        const db = getDB();
        return db.collection("word_countes_history").countDocuments()
    }
}

  module.exports = WordCount;