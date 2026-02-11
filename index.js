require("dotenv").config();
// 3.1
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/", (request, response) => {
  response.send("<h1>Hello,World!<h1/>");
});

// 3.2
app.get("/info", (request, response) => {
  const date = new Date();
  const personsLength = persons.length;
  response.send(`
    <p>Phonebook has info for ${personsLength} people<p/>
    ${date}
    `);
});

// 3.3
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  response.send(person);
});

// 3.4
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personId = persons.findIndex((person) => person.id === id);
  persons.splice(personId, 1);
  response.send(`Pessoa com id ${id} removido`);
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
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
