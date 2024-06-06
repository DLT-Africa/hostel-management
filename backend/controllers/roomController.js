const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");

const createNewRoom = asyncHandler(async (req, res) => {
  const { roomNumber, roomCapacity, roomLocation, roomOccupancy, roomStatus } =
    req.body;

  if (!roomNumber || !roomCapacity || !roomLocation) {
    res.status(400);
    throw new Error("All Fields required");
  }

  const roomExist = await Room.findOne({ roomNumber });

  roomExist &&
    (() => {
      res.status(400);

      throw new Error("Room already Exists");
    })();

  const room = await Room.create({
    roomNumber,
    roomCapacity,
    roomOccupancy,
    roomLocation,
    roomStatus,
  });

  if (room) {
    const {
      _id,
      roomNumber,
      roomCapacity,
      roomOccupancy,
      roomLocation,
      roomStatus,
    } = room;

    res.status(201).json({
      _id,
      roomNumber,
      roomCapacity,
      roomOccupancy,
      roomLocation,
      roomStatus,
    });
  } else {
    res.status(400);
    throw new Error("Invalid data kindly check again");
  }
});

const getAllRoom = asyncHandler(async (req, res) => {
  const rooms = await Room.find().sort();

  if (!rooms) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  res.status(200).json(rooms);
});

const getRoom = asyncHandler(async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    if (room) {
      const {
        _id,
        roomNumber,
        roomLocation,
        roomOccupancy,
        roomStatus,
        roomCapacity,
      } = room;
      res
        .status(200)
        .json({
          _id,
          roomNumber,
          roomLocation,
          roomOccupancy,
          roomStatus,
          roomCapacity,
        });
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateRoom = asyncHandler(async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    if (room) {
      const {
        _id,
        roomNumber,
        roomLocation,
        roomOccupancy,
        roomStatus,
        roomCapacity,
      } = room;

      room.roomNumber = req.body.roomNumber || roomNumber;
      room.roomCapacity = req.body.roomCapacity || roomCapacity;
      room.roomLocation = req.body.roomLocation || roomLocation;
      room.roomStatus = req.body.roomStatus || roomStatus;
      room.roomOccupancy = req.body.roomOccupancy || roomOccupancy;

      const updatedRoom = await room.save();

      res.status(200).json({
        _id: updatedRoom._id,
        roomNumber: updatedRoom.roomNumber,
        roomCapacity: updatedRoom.roomCapacity,
        roomOccupancy: updatedRoom.roomOccupancy,
        roomLocation: updatedRoom.roomLocation,
        roomStatus: updatedRoom.roomStatus,
      });
    } else {
      res.status(404);
      throw new Error("Room not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const deleteRoom = asyncHandler(async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = Room.findById(roomId);

    if (!room) {
      res.status(404);
      throw new Error("Room not Found");
    }

    await room.deleteOne();
    res.status(200).json({ message: "Room Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  createNewRoom,
  getAllRoom,
  getRoom,
  updateRoom,
  deleteRoom,
};
