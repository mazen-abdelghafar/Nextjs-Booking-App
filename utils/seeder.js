const Room = require("../models/room");
const mongoose = require("mongoose");
const rooms = require("../data/rooms.json");

const dbConnect = () => {
  if (mongoose.connection.readyState >= 1) return;

  mongoose
    .connect(
      "mongodb+srv://mazen:pass123@cluster0.svqtq.mongodb.net/BookitDB?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(`DB connection error: ${err}`));
};

dbConnect();

const seedRooms = async () => {
  try {
    await Room.deleteMany();
    console.log("Rooms are deleted");

    await Room.insertMany(rooms);
    console.log("All rooms are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedRooms();
