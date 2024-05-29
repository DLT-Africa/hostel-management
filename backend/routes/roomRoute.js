const express = require('express');

const router = express.Router()

const {createNewRoom,
    getAllRoom,
    getRoom,
    updateRoom,
    deleteRoom} = require('../controllers/roomController');


router.post('/createNewRoom', createNewRoom);
router.get('/get-all-room', getAllRoom);
router.get('/get-single-room/:roomId', getRoom); 
router.patch('/update-room/:roomId', updateRoom);
router.delete('/delete-room/:roomId', deleteRoom);


module.exports = router