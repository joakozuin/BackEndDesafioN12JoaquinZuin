const express=require('express')
const morgan=require('morgan')
const productoRuta=require('../rutas/producto')
const apiRuta = require('../rutas')
const path=require('path')
const handlebar=require('express-handlebars')
const {Server:ioServer}=require('socket.io')
const http=require('http')


class Servidor {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8080";

    this.httpServer = http.createServer(this.app);
    this.io = new ioServer(this.httpServer);
   
    //Middlewares
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.static(process.cwd() + "\\public"));
    this.app.use(express.urlencoded({ extended: true }));

    // Ruta de la Api en http://localhost:8080/api
    // prefijo, por el tema de versiones de la API
    this.apiCaminos = {
      api: "/api",
      productos: "/api/productos",
    };
    this.rutas();
    this.manErrores();

    //Websocket
    //
    this.mensajes = [
      {
        email: "Juan@gmail.com",
        fecha: this.calcFechaHora(),
        texto: "Hola que tal...",
      },
      {
        email: "Joaquin@gmail.com",
        fecha: this.calcFechaHora(),
        texto: "Genial...",
      },
    ];

    this.productos=[];

    this.webSocket();
  }

  calcFechaHora() {
    const dato = new Date();
    const dia = dato.getDate();
    const mes = dato.getMonth() + 1;
    const ano = dato.getFullYear();
    const hor = dato.getHours();
    const min = dato.getMinutes();
    const seg = dato.getSeconds();
    const fecha = [dia, mes, ano].join("/").toString();
    const hora = [hor, min, seg].join(":").toString();
    return [fecha, hora].join(" ");
  }

  webSocket() {
    this.io.on("connection", (cliente) => {
      console.log(`Nuevo Cliente Conectado id:${cliente.id}`);
      cliente.emit("mensaje", this.mensajes);

      //Modulo CHAT
      //
      cliente.on("nuevoMensaje", (mensaje) => {
        console.log("Nuevo Mensaje: " + mensaje.email);
        console.log("Nuevo Mensaje: " + mensaje.texto);
        
        const mens={
          email: mensaje.email,
          fecha: this.calcFechaHora(),
          texto: mensaje.texto,
        }

        this.mensajes.push(mens);

        /* console.log('Enviando Mensajes al cliente')
        this.io.sockets.emit("mensaje", this.mensajes); */

      });

     //Modulo Productos
     //
     cliente.on("nuevoProducto",(producto)=>{
        
       console.log("Servidor Nuevo Producto Titulo: " + producto.titulo);
       console.log("Servidor Nuevo Producto Precio: " + producto.precio);
       console.log("Servidor Nuevo Producto Thumbnail: " + producto.thumbnail);

       const prod={
          titulo: producto.titulo,
          precio: producto.precio,
          thumbnail:producto.thumbnail
        }

       this.productos.push(prod)

      /*  console.log('Servidor Enviando Producto al cliente')
       this.io.sockets.emit("producto", this.productos); */

    });

        console.log('Enviando Mensajes al cliente')
        this.io.sockets.emit("mensaje", this.mensajes);

        console.log('Servidor Enviando Producto al cliente')
        this.io.sockets.emit("producto", this.productos);

    });

  }



  rutas() {
    this.app.use(this.apiCaminos.api, apiRuta);
    this.app.use(this.apiCaminos.productos, productoRuta);
  }

  manErrores() {
    this.app.use((err, req, res, next) => {
      res.json({
        Mensage: "Ha ocurrido un error",
        Error: err.message,
        status: err,
      });
      //return next()
    });
  }

  //Usando motor de plantillas Handlerbars
  //**************** */
  handlerbars() {
    console.log("Trabajando con el Motor de Plantillas HandleBars");
    this.app.engine(
      "hbs",
      handlebar.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: process.cwd() + "\\views\\layouts",
        partialsDir: process.cwd() + "\\views\\partials",
      })
    );

    this.app.set("views", process.cwd() + "\\views");
    this.app.set("view engine", "hbs");
  }

  //Usando motor de plantillas PUG
  //**************** */
  pug() {
    console.log("Trabajando con el Motor de Plantillas Pug");
    this.app.set("views", process.cwd() + "\\views");
    this.app.set("view engine", "pug");
    //this.app.use(express.static(path.join(__dirname, "public")));
  }

  //Usando motor de plantillas EJS
  //**************** */
  EJs() {
    //console.log('Trabajando con el Motor de Plantillas EJs')
    this.app.set("views", process.cwd() + "\\views");
    this.app.set("view engine", "ejs");
  }

  escuchando() {
    this.httpServer.listen(this.port, () => {
      console.log(`Servidor respondiendo en el puerto ${this.port}`);
    });
  }
}

module.exports=Servidor