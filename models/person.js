const mongoose = require('mongoose');

/*
The following is not needed since we are using a .env file for injection.
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
        required: true,
        unique: true,
        minLength: [5, 'Name must be at least 5 characters long']
    },

    number: {
        type: String,
        required: true,
        minLength: 8,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: props =>
                `${props.value} is not a valid phone number (format XX-XXXX or XXX-XXXX)`
        }
    }
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
