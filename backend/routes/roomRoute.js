const express = require('express');

const router = express.Router()
const {protect} = require("../middleware/authMiddleware");

const {createNewRoom,
    getAllRoom,
    getRoom,
    updateRoom,
    deleteRoom} = require('../controllers/roomController');


router.post('/createNewRoom',protect, createNewRoom);
router.get('/get-all-room',protect, getAllRoom);
router.get('/get-single-room/:roomId',protect, getRoom); 
router.patch('/update-room/:roomId',protect, updateRoom);
router.delete('/delete-room/:roomId',protect, deleteRoom);


module.exports = router