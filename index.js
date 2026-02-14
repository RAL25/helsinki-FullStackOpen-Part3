require("dotenv").config();
const Person = require("./models/person");
// 3.1
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());

// 3.16
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformated id" });
  }

  next(error);
};

// Integration test with front end
// 3.11
app.use(express.static("build"));

// 3.7 and 3.8
morgan.token("body", function (req, res) {
  const aux = JSON.stringify(req.body);
  return aux;
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms | :body",
  ),
);

// To integrate with the front end, need the CORS
// Both of parts (front and back) are in PORT 3001
app.use(cors());

app.get("/", (request, response) => {
  response.send("<h1>Hello,World!<h1/>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// 3.2
app.get("/info", async (request, response) => {
  const personsLength = await Person.countDocuments({});
  const date = new Date();
  response.send(`
    <p>Phonebook has info for ${personsLength} people<p/>
    ${date}
    `);
});

// 3.3
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// 3.4
app.delete("/api/persons/:id", (request, response, next) => {
  // 3.15
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// 3.5
app.post("/api/persons", (request, response) => {
  const body = request.body;

  // 3.6
  if (!body.name || !body.number) {
    const aux = !body.name ? "name" : "number";
    return response.status(400).json({
      error: `${aux} missing`,
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((personSave) => {
    response.json(personSave);
  });
});

// 3.17
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }

      person.name = name;
      person.number = number;

      return person.save().then((updatePerson) => {
        response.json(updatePerson);
      });
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
