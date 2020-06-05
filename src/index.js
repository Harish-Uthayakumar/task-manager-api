const express = require('express')
const multer = require('multer')
require('./db/mongoos')

const User = require('./models/user')
const Task= require('./models/tasks')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')




const app = express()
const port = process.env.PORT


const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },

    fileFilter(req, file, cb) {

        if(!file.originalname.match(/\.(doc|docx)$/)) {

            return cb(new Error('Please upload a word document'))


        }

        cb(undefined, true)

        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})

const errorMiddleware = (req, res, next) => {

    throw new Error('Error from my middleware')
}

app.post('/upload', upload.single('upload') , (req, res) => {

    res.send()
}, (error, req, res, next) => {

    res.status(400).send({error: error.message})
})


// app.use((req, res, next) => {

//     if(req.method === 'GET') {

//         res.send('GET request are disabled')


//     } else {

//         next()
//     }
    
// })


// // app.use((req, res, next) => {

    
// //         res.status(503).send('Maintenance mode')
    
// // })

//app.use(express.json()) //parses json to object
app.use(userRouter)
 app.use(taskRouter)

// const jwt = require('jsonwebtoken')

// // const myFunction = async() => {

// //     const token = jwt.sign({_id: 'abc123'}, 'secretkey', {expiresIn: '7 days'})
// //     console.log(token);
// //     const data = jwt.verify(token, 'secretkey')
// //     console.log(data);
// // }

// const pet = {
//     name: 'Hal'
// }

// pet.toJSON = function () {

//     return {}
// }

// console.log(JSON.stringify(pet))

// myFunction()

app.listen(port, () => {

    
    
    console.log('The app is running on port' + port)

    
})




// const main = async() => {

//     // const task = await Task.findById('5ecb7f529a4b9503d30a2751')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
    
//     const user  = await User.findById('5ecb7df59065dc030c55786c')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks);
    


// }

// main()
 


