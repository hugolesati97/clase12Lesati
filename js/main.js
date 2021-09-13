// Global ARRAYS
const productos = [];
const carrito = [];
const categorias = ["PANADERIA", "FIAMBRES", "LACTEOS", "CARNES", "BEBIDAS", "VERDULERIA", "VARIOS"];


// Jquery DOM
function productosUIjQuery(productos, id) {
  $(id).empty()
  for (const producto of productos) {
    $(id).append(`<div class="card productos" style="width: 18rem;">
                    <img src="https://via.placeholder.com/150" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${producto.nombre}</h5>
                      <p class="card-text">${producto.precio}</p>
                      <span class="badge bg-secondary">${producto.categoria}</span>
                      <a href="#" id='${producto.id}' class="btn btn-success btn-compra">COMPRAR</a>
                    </div>
                  </div>`);
  }
}


// Management PRODUCTOS
function comprarProducto(e) {
  //Refresh
  e.preventDefault();

  //Id button
  const idProducto = e.target.id;

  //Object producto
  const seleccionado = carrito.find(p => p.id == idProducto);

  // Find array
  if (seleccionado == undefined) {
    carrito.push(productos.find(p => p.id == idProducto));
  } else {
    // add
    seleccionado.agregarCantidad(1);
  }

  // Storage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  carritoUI(carrito);
}



function carritoUI(productos) {
  $('#carritoCantidad').html(productos.length);

  $('#carritoProductos').empty();

  for (const producto of productos) {
    $('#carritoProductos').append(registroCarrito(producto));
  }

  //Total

  $("#carritoProductos").append(`<p id="totalCarrito"> TOTAL ${totalCarrito(productos)}</p>`);

  //Confirmacion
  $("#carritoProductos").append(`<div id="divConfirmar" class="text-center"><button id="btnConfirmar" class="btn btn-success">CONFIRMAR</button></div>`);

  $(".btn-add").click(addCantidad);
  $(".btn-delete").click(eliminarCarrito);
  $("#btnConfirmar").click(confirmarCompra);

}
//TOTAL CARRITO
function totalCarrito(carrito) {
  console.log(carrito);
  let total = 0;
  carrito.forEach(p => total += p.subtotal());
  return total.toFixed(2);
}

// Function DOM
function registroCarrito(producto) {
  return `<p> ${producto.nombre} 
          <span class="badge bg-success">$ ${producto.precio}</span>
          <span class="badge bg-info">${producto.cantidad}</span>
          <a id="${producto.id}" class="btn btn-primary btn-add">+</a>
          <a id="${producto.id}" class="btn btn-danger btn-delete">-</a>
          </p>`
}


// Function array
function selectUI(lista, selector) {
  //Empty
  $(selector).empty();

  //Option
  lista.forEach(element => {
    $(selector).append(`<option value="${element}">${element}</option>`)
  });
  $(selector).prepend(`<option value="TODOS" selected>TODOS</option>`)
}


// Management delete
function eliminarCarrito(e) {
  console.log(e.target.id);
  let posicion = carrito.findIndex(p => p.id == e.target.id);
  carrito.splice(posicion, 1);
  console.log(carrito);

  carritoUI(carrito);

  localStorage.setItem("carrito", JSON.stringify(carrito));
}


// Management add
function addCantidad() {
  let producto = carrito.find(p => p.id == this.id);
  producto.agregarCantidad(1);
  $(this).parent().children()[1].innerHTML = producto.cantidad;

  // Storage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}


// Class
class Producto {
  constructor(id, nombre, precio, categoria, cantidad) {
    this.id = parseInt(id);
    this.nombre = nombre;
    this.precio = parseFloat(precio);
    this.categoria = categoria;
    this.cantidad = cantidad || 1;
  }

  agregarCantidad(valor) {
    this.cantidad += valor;
  }
}

// Ready DOM
$(document).ready(function () {
  if ("carrito" in localStorage) {
    const arrayLiterales = JSON.parse(localStorage.getItem("carrito"));
    for (const literal of arrayLiterales) {
      carrito.push(new Producto(literal.id, literal.nombre, literal.precio, literal.categoria, literal.cantidad));
    }
    console.log(carrito);
    carritoUI(carrito);
  }
  $(".dropdown-menu").click(function (e) {
    e.stopPropagation();
  });

  $.get("data/producto.json", function (datos, estado) {
    console.log(datos);
    console.log(estado);
    if (estado == "success") {
      for(const literal of datos){
        productos.push(new Producto(literal.id, literal.nombre, literal.precio, literal.categoria, literal.cantidad));
      }
    }
    console.log(productos);
    productosUIjQuery(productos, '#productosContenedor');
  });

});

/* //Arrays
productos.push(new Producto(1, "Pan", 65, categorias[0]));
productos.push(new Producto(2, "Medialunas", 130, categorias[0]));
productos.push(new Producto(3, "Chipa", 150, categorias[0]));
productos.push(new Producto(4, "Jamon", 60, categorias[1]));
productos.push(new Producto(5, "Mortadella", 60, categorias[1]));
productos.push(new Producto(6, "Bondiola", 60, categorias[1]));
productos.push(new Producto(7, "Leche", 75, categorias[2]));
productos.push(new Producto(8, "Flan", 75, categorias[2]));
productos.push(new Producto(9, "Yogourt", 75, categorias[2]));
productos.push(new Producto(10, "Costeleta", 100, categorias[3]));
productos.push(new Producto(11, "Chorizo", 100, categorias[3]));
productos.push(new Producto(12, "Asado", 100, categorias[3]));
productos.push(new Producto(13, "Fernet", 125, categorias[4]));
productos.push(new Producto(14, "Cerveza", 125, categorias[4]));
productos.push(new Producto(15, "Coca-Cola", 125, categorias[4]));
productos.push(new Producto(16, "Lechuga", 150, categorias[5]));
productos.push(new Producto(17, "Palta", 150, categorias[5]));
productos.push(new Producto(18, "Papa", 150, categorias[5]));
productos.push(new Producto(19, "Cigarrillos", 170, categorias[6]));
productos.push(new Producto(20, "Pañales", 170, categorias[6]));
productos.push(new Producto(21, "Pilas", 170, categorias[6]));
console.log(productos); */

//Jquery CLASS DOM
/* productosUIjQuery(productos, '#productosContenedor'); */

selectUI(categorias, "#filtroCategorias");

$('#filtroCategorias').change(function (e) {
  const value = this.value;

  $('#productosContenedor').fadeOut(600, function () {
    if (value == 'TODOS') {
      productosUIjQuery(productos, '#productosContenedor');
    } else {
      const filtrados = productos.filter(producto => producto.categoria == value);
      productosUIjQuery(filtrados, '#productosContenedor');
    }
    $("#productosContenedor").fadeIn();
  });
})

$('.btn-compra').on("click", comprarProducto);

// $("#btn-flashOffer").click(function(e){
//   $("#offer").slideDown(2000).slideUp(slideDown);
// })
$("#offer").animate({
  margin: '30px',
  fontSize: "2em",
  width: 500
}, 2000).delay(1000).slideUp(1000);