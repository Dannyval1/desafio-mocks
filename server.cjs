//import { faker } from "@faker-js/faker";

//import express from "express";
//import { faker } from '@faker-js/faker';
//import express, { static } from "express";
//const express = require("express");
// import { Server as HttpServer } from "http";
// import { Server as IOServer } from "socket.io";

const express = require("express");
const { faker } = require("@faker-js/faker");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const productos = [];
const mensajes = [];

// Indicamos que queremos cargar los archivos estáticos que se encuentran en dicha carpeta
app.use(express.static("./public"));
// Esta ruta carga nuestro archivo index.html en la raíz de la misma
app.get("/api/productos-test", (req, res) => {
  const products = [];
  for (let i = 1; i < 6; i++) {
    const product = {
      id: id++,
      nombre: faker.commerce.product(),
      precio: faker.commerce.price(),
      imagen: faker.image.business(300, 300, true),
    };
    products.push(product);
  }
  res.status(200).json(products);
  //res.sendFile("index.html", { root: __dirname });
});

app.get("/", (req, res) => {
  //res.status(200).json(products);
  res.sendFile("index.html", { root: __dirname });
});

httpServer.listen(3005, () => console.log("Servidor Encendido"));

io.on("connection", (socket) => {
  console.log("¡Nuevo cliente conectado!");

  socket.emit("productos", productos);
  socket.emit("mensajes", mensajes);

  // Servidor
  socket.on("producto", (data) => {
    productos.push({ socketid: socket.id, producto: data });
    io.sockets.emit("productos", productos);
  });

  socket.on("mensaje", (data) => {
    mensajes.push({ socketid: socket.id, mensaje: data });
    io.sockets.emit("mensajes", mensajes);
  });
});
