const socket = io();

const tableProducts = document.getElementById("tableProducts");

const inputEmail = document.getElementById("email");
const btnEmail = document.getElementById("sendEmail");
document.getElementById("sendEmail").addEventListener("click", () => {
  //socket.emit("correo", inputEmail.value);
  inputChat.removeAttribute("disabled");
  btnChat.removeAttribute("disabled");
  inputEmail.setAttribute("disabled", "");
  btnEmail.setAttribute("disabled", "");
});

const inputChat = document.getElementById("chatting");
const btnChat = document.getElementById("send");
btnChat.addEventListener("click", () => {
  const message = {
    mensaje: inputChat.value,
    date: new Date(),
  };
  socket.emit("mensaje", message);
  inputChat.value = "";
});

let productsList;
const consume = async () => {
  try {
    return await fetch("http://localhost:3005/api/productos-test")
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i <= data.length; i++) {
          const element = data[i];
          productsList = element;
          socket.emit("producto", productsList);
        }
        return data;
      });
  } catch (err) {
    alert(err);
  }
};

consume();

const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productUrl = document.getElementById("productUrl");
// document.getElementById("save_product").addEventListener("click", () => {
//   const product = {
//     nombre: productName.value,
//     precio: productPrice.value,
//     imagen: productUrl.value,
//   };
//   socket.emit("producto", product);
//   productName.value = "";
//   productPrice.value = "";
//   productUrl.value = "";
// });

// Cliente
socket.on("productos", (productos) => {
  const conProducto = `
    <thead>
        <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Imagen</th>
        </tr>
    </thead>
    `;
  const sinProducto = `
    <div class="alert alert-warning" role="alert">
        No se encontraron productos
    </div>
    `;

  const productoHTML = productos
    .map((prod, index) => {
      if ((prod.producto !== null) ) {
        return `
        <tbody>
            <tr>
                <td>${prod.producto.nombre}</td>
                <td>${prod.producto.precio}</td>
                <td>
                    <img src="${prod.producto.imagen}" class="img-prod" alt="${prod.producto.nombre}">
                </td>
            </tr>
        </tbody>
    `;
      }
    })
    .join(" ");

  if (productos.length > 0) {
    tableProducts.innerHTML = conProducto + productoHTML;
  } else {
    tableProducts.innerHTML = sinProducto;
  }
});

// Cliente
socket.on("mensajes", (mensajes) => {
  console.log("mensajes", mensajes);
  const html = mensajes
    .map((elem, index) => {
      return `<div>
                <time class='text-muted'>${elem.mensaje.date}</time>
                : <em>${elem.mensaje.mensaje}</em>
            </div>`;
    })
    .join(" ");
  const div = document.getElementById("message");
  div.innerHTML = html;
});
