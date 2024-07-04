// Variable y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos
addEventListener();
function addEventListener(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    document.addEventListener('submit', agregarGasto)
}

// Clases
class Presupuesto {
    constructor (presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante  = Number(presupuesto);
        this.gastos = [];
    }


    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]
        console.log(this.gasto)
        this.calcularRestante()
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto)=> total + gasto.cantidad, 0 )
        this.restante = this.presupuesto - gastado
        console.log(this.restante)
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto  => gasto.id !== id)
        this.calcularRestante()

    }
}
class UI{
    insertarPresupuesto(cantidad){
        console.log(cantidad)
        // extrayendo el valor 
        const {presupuesto, restante} = cantidad
        // Agregando al html
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante

    }
    imprimirAlerta(mensaje, tipo){
        // crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert')

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success')
        }
        // Mensaje de error
        divMensaje.textContent = mensaje;
        // insertar en el html
        document.querySelector('.primario').insertBefore(divMensaje, formulario) 

        // quitamos del html
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos){
        this.limpiarHTML() // Elimina el html previo
// iterar sobre los gastos
            gastos.forEach(gasto => {
            console.log(gasto)
            const {cantidad, nombre, id} = gasto;
            //Crear un li
            const nuevoGasto = document.createElement('li')
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id' , id);mas resomendado lo que se encuentra abajo
            // se utiliza para tener informacion que se pueda usar con js pero siempre data y guion
            nuevoGasto.dataset.id = id;
            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge-primary badge-pill"> $ ${cantidad}</span>`
            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            // btnBorrar.textContent = 'Borrar &times;' las entidades & no las acepta textContent
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar)
            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto)
        });
        
    }
   
    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante

    }
    comprarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante')
    
        // comprobar %25
        if ((presupuesto / 4)> restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')
        }else if((presupuesto / 2 )> restante){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add('alert-success')

        }

        // si el total es 0 o menor
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error')
            formulario.querySelector('button[type="submit"]').disabled = true
        }
    }
}
const ui = new UI

let presupuesto; 

// Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');
    console.log(Number(presupuestoUsuario))

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }
    presupuesto = new Presupuesto(presupuestoUsuario)
    console.log(presupuesto)
    // Le enviamos el objeto presupuesto a la funcion UI
    ui.insertarPresupuesto(presupuesto)
}
// Añade Gasto
function agregarGasto(e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value)
    // Validar
    if(nombre === '' || cantidad === ''){
     ui.imprimirAlerta('ambos campos son obligatorios', 'error');
     return
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return    
    }

    //  generar un objeto con el gasto
    const gasto = { nombre , cantidad, id : Date.now()}

    // Agregar un nuevo gasto 
    presupuesto.nuevoGasto(gasto)

    // imprimos la alerta de agregado
    // TODO solo le mandaremos un parametro y se tomara como mensaje, 
    // TODO no el otro parametro porque solo procesa error
    ui.imprimirAlerta("Gasto agregado Correctamente")

    // imprimir los gastos
    const { gastos, restante } = presupuesto //del objeto presupuesto
    // ui.agregarGastoListado(gastos)
    ui.mostrarGastos(gastos)

    ui.actualizarRestante(restante)
    ui.comprarPresupuesto(presupuesto)

    // Reinicia el formulario
    formulario.reset(); 
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id)
    const {gastos, restante} = presupuesto
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprarPresupuesto(presupuesto)

}