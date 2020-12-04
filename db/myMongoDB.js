const { MongoClient } = require("mongodb");
const dataFile = require("../routes");

function MyDB() {
  const myDB = {};

  const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
  myDB.getPosts = async () => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    //database
    const db = client.db("db2");
    //collection
    const houses = db.collection("houses");

    const query = {};
    return houses.find(query).toArray();
  };

  myDB.getHouses = async () => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    //database
    const db = client.db("db2");
    //collection
    const houses = db.collection("houses");

    return houses;
  };

  myDB.initializeUsers = async () => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("db2");
    const users = db.collection("users");
    return users;
  };

  myDB.getUsers = async () => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    //database
    const db = client.db("db2");
    //collection
    const users = db.collection("users");

    const query = {};
    return users
      .find(query)
      .toArray()
      .finally(() => client.close());
  };

  return myDB;
}

module.exports = MyDB();
