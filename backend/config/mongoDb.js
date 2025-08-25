import mongoose from 'mongoose';

const connectDb = async() => {

    mongoose.connection.on('connected', ()=>{
        console.log('mongo connected')
    })
    await mongoose.connect(`${process.env.MONGO_CONN}/Auth`);
}

export default connectDb;
