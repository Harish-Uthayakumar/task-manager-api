const express = require('express')
const router = new express.Router()
const User = require('../models/user.js')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, cancelEmail} = require('../emails/accounts')





router.get('/test' , auth, (req, res) => {

    res.send('Sent from a new file')
})






router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {


        await user.save()
       // sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.send({user, token})
        

    } catch(e) {


        res.status(400).send(e)

    }

    // user.save().then(() => {
    //     res.send(user)

    // }).catch((e) => {
    //     res.status(400).send(e)
       

    // })
})

router.get('/users/me', auth, async (req,res) => {


    try {

       res.send(req.user)
    }

    catch(e) {

        res.send().status(500)
    }

    // User.find({}).then((users) => {

    //     res.send(users)
        

    // }).catch((e) => {
    //     res.send().status(500)
        
    // })
})








    router.patch('/users/me', auth,  async (req,res) => {

        const allowedUpdate = ['name','email','age', 'password']
 
        const updates = Object.keys(req.body)
        const isValidoperator = updates.every((update) => allowedUpdate.includes(update))
        
         if(!isValidoperator) {
 
             return res.status(404).send({ error: 'Invalid operation'})
         }
 
         try {

            

            updates.forEach((update) => {

                req.user[update] = req.body[update]
                req.user.save()
                res.send(req.user)
            })

            
            
 
        //    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
 
 
         }
 
         
 
           catch(e) {
 
             res.status(400).send(e)
           }
         
     })


     
     router.delete('/users/me', auth, async (req, res) => {

        try{


            await req.user.remove()

            res.send(req.user)
            //cancelEmail(user.email, user.name)
        }

        catch(e) {

            res.status(404).send(e)
        }

        
    })

    router.post('/users/logout', auth, async(req, res) => {

        try{

            req.user.tokens= req.user.tokens.filter((token) => {

                return token.token !== req.token
            })

            await req.user.save()
            res.send()


        }

        catch(e) {

            res.status(500)


        }
    })

    router.post('/users/logoutAll', auth, async(req, res) => {

        try {

            req.user.tokens = []
            await req.user.save()
            res.send()


        }

        catch(e) {

            res.status(500).send()

        }
    })
    
    router.post('/users/login', async (req, res) => {

        try {

            const user = await User.findByCredentials(req.body.email, req.body.password)
            const token = await user.generateAuthToken()
            res.send({user, token})

        }

        catch(e) {

            res.status(400).send(e)


        }
    })


    const upload = multer({
        
        limits: {
            fileSize: 1000000
        },
    
        fileFilter(req, file, cb) {
    
            if(!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
    
                return cb(new Error('Please upload a png or jpg document'))
    
    
            }
    
            cb(undefined, true)
    
            // cb(new Error('File must be a PDF'))
            // cb(undefined, true)
            // cb(undefined, false)
        }
    })
    


    
    
    router.post('/users/avatar', auth, upload.single('upload') , async (req, res) => {
    
        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    
       req.user.avatar = buffer

       await req.user.save()

        res.send()
    }, (error, req, res, next) => {
    
        res.status(400).send({error: error.message})
    })

    router.delete('/users/avatar', auth, async (req, res) => {

        req.user.avatar = undefined
        await req.user.save()
        res.send(200)
    })

    router.get('/users/:id/avatar', async(req, res) => {

        try {
            const user = await User.findById(req.params.id)

            if(!user || !user.avatar) {

                throw new Error()
            }

            res.set('Content-Type', 'image/png')
            res.send(user.avatar)

        }

        catch(e) {

            res.status(404)
        }
    })
    


    module.exports = router
 