// importar express
const express = require("express");
//importar para read y write file
const path = require("path");
const fs = require("fs/promises");

// para conocer Ruta Relativa
const jsonPath = path.resolve("user.json");


// instancia de express
const app = express(); 


// middleware para leer json
// use nos permite manejar midlewares
app.use(express.json());
 
//app.all ('/', ()=>{}); usa todos los metodos
//cuando hagan una solicitud con este enpoint van a responder

app.get("/api/v1/tasks", async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, "utf8");
  // enviar header
  // metodo de express envio repuesta al cliente
  res.status(200);
  res.send(jsonFile); 
});

app.post("/api/v1/tasks", async (req, res) => {
  const newTask = req.body;
  // necesito el arreglo que esta dentro de user.json JSON.parse convertir en array
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  
  tasksArray.push({ ...newTask, id: getLastId(tasksArray) }); //agrego id al arreglo
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.sendStatus(201); // created
});

app.put("/api/v1/tasks", async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  // necesito saber que tarea voy a actualizar  --> id
  // necesito modificar la propiedad que me enviaron por el body paso id ,status
  const { id, password } = req.body;
  const taskIndex = tasksArray.findIndex((task) => task.id === id);
  tasksArray[taskIndex].password = password;
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.sendStatus(200);
});

app.delete("/api/v1/tasks", async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  // recibir un id 
  // encontrarlo y eliminarlo del arreglo, paso solo el id por el cuerpo del body
  const { id } = req.body;
  const taskIndex = tasksArray.findIndex((task) => task.id === id);
  tasksArray.splice(taskIndex, 1);
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.sendStatus(200);
});

app.listen(8000, () => {
  console.log("Servidor corriendo en el puerto 8000");
});

// creamos una funcion para encontar 
// obtener el ultimo id de las tareas y el nuevo elemento agregado
// ponerle el ultimo elemento + 1

const getLastId = (userArray) => {
  const lastElementIndex = userArray.length - 1;
  return userArray[lastElementIndex].id + 1;  //devuelve el valor numerico del ultim id +1
};


