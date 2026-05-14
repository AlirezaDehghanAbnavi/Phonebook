const mongoose = require('mongoose');

/*
The following is not needed since we are using a .env file for injection
*/
// if (process.argv.length < 3) {
//     console.log("Enter Password as CLI Argument");
//     process.exit(1);
// }

// const password = process.argv[2];

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 5,
        unique: true,
        required: true
    },
    number: String,
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        return {
            id: returnedObject._id.toString(),
            name: returnedObject.name,
            number: returnedObject.number
        }
    }
})

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
