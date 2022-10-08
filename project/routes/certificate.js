//Required Modules

const multer = require('multer');
const path = require('path');
const { create } = require('ipfs-http-client');
const Certificate = require('../models/Certificate')

const fs = require('fs');
const express = require('express');


const router = express.Router()

//Connceting to the ipfs network via infura gateway
const ipfs = create('https://ipfs.infura.io:5001')

// Create a storage path to save images
const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

//Used for image uploading
const imageUpload = multer({

    //Configure the path to image storage
    storage: imageStorage,
    limits: {
        fileSize: 10000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})


router.post('/', imageUpload.single('image'), async (req, res) => {
    let testFile = fs.readFileSync(`${req.file.path}`);

    const fileAdded = await ipfs.add({ path: 'testfile', content: testFile });
    const { cid } = fileAdded;
    //Creating one

    const cert = {
        userId: req.body.userId,
        email: req.body.email,
        hashcode: cid.toString(),
        name: req.body.name,
        description: req.body.description,
    };


    // create an object for certificate model
    const certificate = new Certificate(cert);

    try {
        const newCertificate = await certificate.save();


        let data = JSON.stringify({...cert, token: newCertificate._id, image:  `https://gateway.ipfs.io/ipfs/${cert.hashcode}`}, null, 2);

        fs.writeFile('student-3.json', data, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });

        res.status(201).json(newCertificate)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})

//Getting All
router.get('/', async (req, res) => {
    try {
        const certificate = await Certificate.find()
        res.json(certificate.map(cert => {
            return {
                _id: cert._id,
                userId: cert.userId,
                email: cert.email,
                hashcode: cert.hashcode,
                url: `https://gateway.ipfs.io/ipfs/${cert.hashcode}`
            }

        }))

    } catch (err) {
        res.status(500).json({ message: err.message })

    }
});

//Getting one
router.get('/:userId', async (req, res) => {
    let certificate
    try {
        certificate = await Certificate.find({
            userId: req.params.userId,
        })
        console.log(certificate)
        if (certificate == null) {
            return res.status(404).json({ message: 'Cannot find Certificate' })
        }

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.json(certificate)
});

//Updating One
router.put('/:certId', async (req, res) => {
    try {
        const cert = await Certificate.findById(req.params.certId);
        console.log(cert)
        if (req.body.userId != null) {
            cert.userId = req.body.userId
        }
        if (req.body.email != null) {
            cert.email = req.body.email
        }


        const updatedCertificate = await cert.save()
        res.json(updatedCertificate)

    } catch (err) {
        res.status(400).json({ message: err.message })

    }
});
//Deleting One
router.delete('/:certId', async (req, res) => {
    try {

        await Certificate.findByIdAndDelete(req.params.certId);
        res.json({ message: 'Deleted certificate' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

});



router.get('/email/:email', async (req, res) => {
    let certificate
    try {
        certificate = await Certificate.find({
            email: req.params.email,
        })
        console.log(certificate)
        if (certificate == null) {
            return res.status(404).json({ message: 'Cannot find Certificate' })
        }

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.json(certificate)
});

async function getCertificate(req, res, next) {
    let certificate
    try {

        certificate = await Certificate.find({
            userId: req.params.userId,
        })
        console.log(certificate)
        if (certificate == null) {
            return res.status(404).json({ message: 'Cannot find Certificate' })
        }

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.certificate = certificate
    next()
}
module.exports = router;
