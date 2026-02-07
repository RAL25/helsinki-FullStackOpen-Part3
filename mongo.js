const mongoose = require("mongoose");

function conectionToDB(user, password) {
  const url = `mongodb+srv://${user}:${password}@cluster0.h43zaiq.mongodb.net/phoneApp?appName=Cluster0`;
  mongoose.set("strictQuery", false);
  mongoose.connect(url);

  const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", noteSchema);
  return Person;
}

if (process.argv.length < 3) {
  console.log("give more arguments");
  process.exit(1);
} else if (process.argv.length < 4) {
  const Person = conectionToDB("ral25", process.argv[2]);

  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  const Person = conectionToDB("ral25", process.argv[2]);

  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
