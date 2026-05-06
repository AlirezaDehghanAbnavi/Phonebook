const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log("Enter Password as CLI Argument");
    process.exit;
}

const password = process.argv[2];

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
