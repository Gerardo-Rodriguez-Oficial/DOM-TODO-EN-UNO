
console.log('tambien vinculado')

const formulario = document.getElementById('formulario')

const listaTareas = document.getElementById('lista-tareas')
const input = document.getElementById('input')


const templateList = document.getElementById('template-list').content

const fragment1 = document.createDocumentFragment()

let tareas = {}

formulario.addEventListener('submit' , (e) => {
    e.preventDefault()
    // console.log('procesando formulario',input.value)

    crearTarea(e)
})



// console.log(Date.now())

listaTareas.addEventListener('click' , (e) => {

    btnAcciones(e)
})

const crearTarea = (e) => {
    // console.log('procesando formulario desde la funcion',input.value)

    if(input.value.trim() === ''){
        alert('Ingrese una tarea!')
        return
    }

    const tarea = {
        id : Date.now(),
        title : input.value,
        estado : false
    }
    // console.log('sigoo por aqui')

    tareas[tarea.id] = {...tarea}

    console.log(tareas)

    pintarTareas()

    formulario.reset()
    input.focus()
}

const pintarTareas = () => {

    listaTareas.innerHTML = ''

    Object.values(tareas).forEach( tarea => {
        // console.log('recorriendo las tareas',tarea)

        const clone = templateList.cloneNode(true)

        if(tarea.estado){
            clone.querySelector('.alert').classList.replace('alert-warning' , 'alert-primary')
            clone.querySelectorAll('.fa-solid')[0].classList.replace('fa-circle-check','fa-arrows-rotate')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        clone.querySelector('p').textContent = tarea.title

        clone.querySelectorAll('.fa-solid')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fa-solid')[1].dataset.id = tarea.id



        fragment1.appendChild(clone)

    })

    listaTareas.appendChild(fragment1)
}

const btnAcciones = (e) => {
    // console.log('este es',e.target)

    if(e.target.classList.contains('fa-circle-check')){
        tareas[e.target.dataset.id].estado = true
        pintarTareas()
    }

    if(e.target.classList.contains('fa-circle-minus')){
        delete tareas[e.target.dataset.id]
        pintarTareas()
    }

    if(e.target.classList.contains('fa-arrows-rotate')){
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
    }



    e.stopPropagation()
}