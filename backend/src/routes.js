const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer')

const Firmware = require("./models/Firmware")


routes.get("/firmwares", async (req, res) =>{
    const firmwares = await Firmware.find();

    return res.json(firmwares)
})

routes.post("/firmwares", multer(multerConfig).single('file'), async (req,res) => {
    const {originalname: name, size, key, location: url = ''} = req.file
    
    const firmware = await Firmware.create({
        name,
        size,
        key,
        url,
        version:req.body.version,
        nameProject:req.body.nameProject,
        compatibleBoard:req.body.compatibleBoard
    })

    return res.json(firmware)
});

// nome_do_projeto_v0_0_1.bin

routes.delete("/firmwares/:id", async (req, res) =>{
    try{
        const firmware = await Firmware.findById(req.params.id);
        await firmware.remove()
        return res.send()
    } catch (error) {
        throw { code: error.code, message: error.message };
    }



})

module.exports = routes;