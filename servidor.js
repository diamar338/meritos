// importamos express
import express from "express"

// 1. Creamos una instancia de nustra aplicacion
const app = express()

app.get("/",(req, res) => {

    res.send("Hola mundo")
})

const PORT = 3001
//Ponemos a ejecutar nuestra aplicacion
app.listen(PORT, () =>{
    console.log("Ejecutando http://localhost:3001")
})