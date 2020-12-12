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

  myDB.getEvents = async (username) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("db2");

    const events1 = db.collection("events");

    const eventsposts = await events1.findOne({ username: username });
    console.log("try", eventsposts);
    return eventsposts;
  };

  myDB.addToDB = async (username, title, start, end, allday) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("db2");

    const events1 = db.collection("events");
    events1.findOne({ username: username }, function (err, user) {
      if (err) {
        return next(err);
      }
      if (user) {
        const update = {
          $push: {
            eventsarr: {
              title: title,
              start: start,
              end: end,
              allday: allday,
            },
          },
        };

        events1.updateOne({ username: username }, update);
      } else {
        events1.insertOne({
          username: username,
          eventsarr: [{ title: title, start: start, end: end, allday: allday }],
        });
      }
    });
  };

  myDB.deleteFromDB = async (username, title, start, end, allday) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("db2");

    const events1 = db.collection("events");
    events1.updateOne(
      { username: username },
      {
        $pull: {
          eventsarr: {
            title: title,
            start: start.replace("T", " ").slice(0, 16),
            end: end.replace("T", " ").slice(0, 16),
          },
        },
      }
    );
    events1.updateOne(
      { username: username },
      {
        $pull: {
          eventsarr: {
            title: title,
            start: start,
            end: end,
            allday: allday,
          },
        },
      }
    );
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

  myDB.getSaved = async (username) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    //database
    const db = client.db("db2");
    //collection
    const saved = db.collection("saved");

    const rtn = await saved.findOne({ username: username });
    if (rtn === null) {
      return null;
    } else {
      return rtn.savedarr;
    }
  };

  myDB.getSavedHearts = async (username) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("db2");

    const savedHearts = db.collection("savedHearts");

    return savedHearts.findOne({ username: username });
  };

  myDB.addSavedToDB = async (
    username,
    title,
    price,
    housinginfo,
    hood,
    date,
    body,
    address,
    images
  ) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("db2");

    const saved = db.collection("saved");
    saved.findOne({ username: username }, function (err, user) {
      if (err) {
        return next(err);
      }
      if (user) {
        const update = {
          $push: {
            savedarr: {
              title: title,
              price: price,
              housinginfo: housinginfo,
              hood: hood,
              date: date,
              body: body,
              address: address,
              images: images,
            },
          },
        };

        saved.updateOne({ username: username }, update);
      } else {
        saved.insertOne({
          username: username,
          savedarr: [
            {
              title: title,
              price: price,
              housinginfo: housinginfo,
              hood: hood,
              date: date,
              body: body,
              address: address,
              images: images,
            },
          ],
        });
      }
    });
  };

  myDB.deleteSavedFromDB = async (username, title) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("db2");

    const saved = db.collection("saved");
    saved.updateOne(
      { username: username },
      {
        $pull: {
          savedarr: { title: title },
        },
      }
    );
  };

  myDB.updateSavedInDB = async (
    username,
    title,
    price,
    housinginfo,
    hood,
    date,
    body,
    address,
    images,
    notes
  ) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("db2");

    const saved = db.collection("saved");
    saved.updateOne(
      { username: username },
      {
        $pull: {
          savedarr: { title: title },
        },
      }
    );
    saved.findOne({ username: username }, function (err, user) {
      if (err) {
        return next(err);
      }

      let update = "";
      if (user) {
        update = {
          $push: {
            savedarr: {
              title: title,
              price: price,
              housinginfo: housinginfo,
              hood: hood,
              date: date,
              body: body,
              address: address,
              images: images,
              notes: notes,
            },
          },
        };
      }

      saved.updateOne({ username: username }, update);
    });
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
