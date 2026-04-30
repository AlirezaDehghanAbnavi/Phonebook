const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log("Enter Password as CLI Argument");
    process.exit;
}

const password = process.argv[2];

const url = `mongodb+srv://Nutcracko:${password}@cluster0.j2zmccm.mongodb.net/Phonebook?appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person.find({}).then(res => {
        res.forEach(p => {
            console.log(`${p.name} ${p.number}`);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];
    const person = new Person({
        name,
        number,
    });


    person.save().then((result) => {
        console.log("Person saved!");
        mongoose.connection.close();
    });
}



module.exports = Person