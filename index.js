

console.log('Vinculado')
const formularioSearch = document.getElementById('formularioSearch')
const cards = document.getElementById('cards')
// console.log('esta es la cards',cards)
const tbody = document.getElementById('tbody')
// console.log('este es el tbody',tbody)
const tfoot = document.getElementById('tfoot')
// console.log('este es el tfoot',tfoot)
const templateCards = document.getElementById('template-cards').content
const templateTbody = document.getElementById('template-tbody').content
const templateTfoot = document.getElementById('template-tfoot').content
const inputBuscar = document.getElementById('inputBuscar')

const fragment = document.createDocumentFragment()

let carrito = {}

// Reloj
const hora = document.getElementById('hora')
const minutos = document.getElementById('minutos')
const segundos = document.getElementById('segundos')

// CLIMA
const ciudad = document.getElementById('ciudad')
const pais = document.getElementById('pais')
const temperatura = document.getElementById('temperatura')
const description = document.getElementById('descripcion')
const imagenTiempo = document.getElementById('imagenTiempo')

window.addEventListener('load' , () => {
    Reloj()
})

document.addEventListener('DOMContentLoaded' , (e) => {
    fecthData()
    fetchClima()
})

// API CARRITO
const fecthData = async() => {
   try {
        const res = await fetch('api.json')
        const data = await res.json()
         pintarCards(data)
   } catch (error) {
        console.log(error)
   }
}

// formularioSearch.addEventListener('submit' , e => {
//     e.preventDefault()
//     // console.log('procesando form',inputBuscar.value)

//     capturarCiudad()
// })

// const capturarCiudad = () => {

//     window.otro = inputBuscar.value.textContent

    
//     console.log('estamos en prueba de esto',otro)
// }

// Wellington
const API_KEY = '35d4627857b8305d1171c369d738ff07'
const URL_API = `https://api.openweathermap.org/data/2.5/weather?q=tegucigalpa&appid=${API_KEY}&lang=es`
// API CLIMA
const fetchClima = async() => {
   try {
        const res = await fetch(URL_API)
        const data = await res.json()
        obtenerClima(data)
   } catch (error) {
        console.log(error)
   }
}

cards.addEventListener('click' , (e) => {

        CrearNuevoObjeto(e)
       
})

tbody.addEventListener('click' , (e) => {

    btnAccion(e)
})

const pintarCards = (data) => {
    // console.log('Desde la funcion',data)

   Object.values(data).forEach( producto => {
        // console.log('recorriendo la data',producto)


        const clone = templateCards.cloneNode(true)

        clone.querySelector('.card-img-top').setAttribute('src', producto.imagen)
        clone.querySelector('.card-title').textContent = producto.title
        clone.querySelector('span').textContent = producto.price
        clone.querySelector('.card-text').textContent = producto.Description

        clone.querySelector('.btn-dark').dataset.id = producto.id

        fragment.appendChild(clone)

    });

    cards.appendChild(fragment)
}


const CrearNuevoObjeto = (e) => {
    // console.log('desde la funcion',e.target)

    if(e.target.classList.contains('btn-dark')){
        // console.log('diste click')

        obtenerDIvPadre(e.target.parentElement)

    }

    e.stopPropagation()
}


const obtenerDIvPadre = (objeto) => {
    // console.log('desde la funcion objeto padre',objeto)

    let productos = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title : objeto.querySelector('.card-title').textContent,
        Description : objeto.querySelector('.card-text').textContent,
        price : objeto.querySelector('span').textContent,
        cantidad : 1
    }

    if(carrito.hasOwnProperty(productos.id)){
        // console.log('si ya existo')
        productos.cantidad = carrito[productos.id].cantidad + 1
    }

    carrito[productos.id] = {...productos}

    // console.log('Este es mi carrito lleno',carrito)

    pintarCarrito()

}


const pintarCarrito = () => {

    tbody.innerHTML = ''

    Object.values(carrito).forEach( producto => {
        // console.log('recorriendo el carrito desde la funcion',producto)

        const clone = templateTbody.cloneNode(true)
        
        clone.querySelectorAll('td')[0].textContent = producto.title
        clone.querySelectorAll('td')[1].textContent = producto.cantidad
        clone.querySelectorAll('span')[0].textContent = producto.price
        clone.querySelectorAll('span')[1].textContent = producto.price * producto.cantidad

        clone.querySelector('.btn-primary').dataset.id = producto.id
        clone.querySelector('.btn-success').dataset.id = producto.id

        fragment.appendChild(clone)
    })

    tbody.appendChild(fragment)
    pintarFooter()
}

const btnAccion = (e) => {
    // console.log('evento desde la funcion',e.target)
    
      if(e.target.classList.contains('btn-primary')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        // console.log('este es el id',producto)
        pintarCarrito()
      }

      if(e.target.classList.contains('btn-success')){
        const producto = carrito[e.target.dataset.id]

        producto.cantidad--

        if(producto.cantidad < 1){
            delete carrito[e.target.dataset.id]
        }

        pintarCarrito()
      }
     
    e.stopPropagation()
}

const pintarFooter = () => {

    tfoot.innerHTML = ''

    if(Object.keys(carrito).length === 0){
        tbody.innerHTML = `
          <th colspan="6">Carrito Vacio - Comience a Comprar</th>
        `
        return
    }

    const clone = templateTfoot.cloneNode(true)

    const nCantidad = Object.values(carrito).reduce( (acum, {cantidad}) => 
        acum + cantidad , 0
    )

    const nTotalPagar = Object.values(carrito).reduce( (acum , {cantidad , price }) =>
        acum + cantidad * price , 0
    )

    clone.querySelector('.total').textContent = nCantidad
    clone.querySelector('span').textContent = nTotalPagar

    fragment.appendChild(clone)
    tfoot.appendChild(fragment)

    const vaciarTodo = document.getElementById('vaciar-todo')

    vaciarTodo.addEventListener('click' , () => {
        carrito = {}
        pintarCarrito(carrito)
    })

}

const Reloj = () => {
    const fecha = new Date()
    // console.log(fecha)

    const hours = fecha.getHours()
    const minutes = fecha.getMinutes()
    const secons = fecha.getSeconds()

    hora.textContent = String(hours).padStart(2,"0")
    minutos.textContent = String(minutes).padStart(2,"0")
    segundos.textContent = String(secons).padStart(2,"0")

    setTimeout(Reloj , 1000)
}

const obtenerClima = (data) => {
    // console.log('estamos desde la funcion',data)

    const paises = data.sys.country
    const ciudadActual = data.name
    const temp = data.main.temp
    const humidity = data.main.humidity
    const descripcion = data.weather[0].description
    const estado = data.weather[0].main

    ciudad.textContent = `${ciudadActual}`
    temperatura.textContent = `${temp} °C`
    description.textContent = `${descripcion}`

    switch(estado){
        case 'Rain' :
            imagenTiempo.src = 'animated/rainy-6.svg'
        break;
        case 'Clouds' :
            imagenTiempo.src = 'animated/cloudy-day-2.svg'
        break;
        case 'Clear' :
            imagenTiempo.src = 'animated/day.svg'
        break;
    }

    switch(paises){
        case 'HN' :
            pais.textContent = 'Honduras'
        break;
        case 'NZ' :
            pais.textContent = 'Nueva Zelanda'
        break;
        case 'CO' : 
            pais.textContent = 'Colombia'
        break;
        case 'MX' : 
            pais.textContent = 'Mexico'
        break;
        case 'US' : 
            pais.textContent = 'Estados Unidos'
        break;
        case 'GB' :
            pais.textContent = 'Gran Bretaña'
        break;
        case 'BR' :
            pais.textContent = 'Brasil'
        break;
    }

}