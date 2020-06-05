const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        
    },

    email : {
        
        type: String,
        unique: true,
        require: true,
        validate(value) {

            if(!validator.isEmail(value)) {
                throw new Error('Email id is not valid')
            }

        },
        trim: true,
        lowercase: true
        
    },

    password: {
        type: String,
        require: true,
        validate(value) {
            if(value.length < 7) {
                throw new Error('Value is less than 7 or you\'ve used the word password ')
            }
        },
        trim: true,



    },

    tokens: [{

        token: {

            type: String,
            required: true
        }


    }],

    avatar: {
        type: Buffer
    }


},


{

    timestamps: true
})

userSchema.virtual('tasks', {

    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function() {

    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token

}


userSchema.methods.toJSON = function() {

const user = this
const userObject = user.toObject()

delete userObject.password
delete userObject.tokens
delete userObject.avatar

return userObject
}



userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({email})

    if(!user) {

        throw new Error('Unable to login')
    }


    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {

        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function (next) {

    const user = this

    if(user.isModified('password')) {

        user.password =  await bcrypt.hash(user.password, 8)
    }

    next()
})

//Delete user tasks when user is removed

userSchema.pre('remove', async function (next) {

    const user = this
    await Task.deleteMany({ owner: user._id})

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User