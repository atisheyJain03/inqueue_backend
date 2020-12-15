import mongoose from 'mongoose';
import validator from 'validator';

const queueSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.ObjectId,
        ref : 'Shop',
        required : [true , 'A Queue must have a Shop']
    },
    user : {
        type: mongoose.Schema.ObjectId,
        ref : 'User',
    },
    email :  {
        type: String,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    number: {
        type: Number,
        default :0
    },
    service: {
        type: mongoose.Schema.ObjectId,
        ref : 'Service'
    },
    status: {
        type: String,
        default : 'Active',
        enum : ['Active', 'Done' , 'Cancelled']
    },
    description : {
        type: String,
        trim : true
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    createdAt: true,
    modifiedAt: true
})

queueSchema.pre('save' , async function(next) {
    
})


const Queue = mongoose.model('Queue', queueSchema);

export default  Queue;