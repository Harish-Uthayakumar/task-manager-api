const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/task-manager-api', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true, useFindAndModify: false});



const task = mongoose.model('task', {

    description: {
        type: String,
        required: true,
        trim: true
    },

    completed: {
        type: Boolean,
        default: false,
        require: false
    }
})


