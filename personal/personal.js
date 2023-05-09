//llamado etiquetas
const form = document.querySelector('#formulario')
const tabla = document.querySelector('.table tbody')

//pongo un evento al form
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    let data = Object.fromEntries(new FormData(e.target))
    option[e.submitter.dataset.action](data)
})

//declaro mi crud
const option={
    "GET": () => getUserAll(),
    "POST": (data) => postUser(data),
    "DELETE": (id) => deleteUser(id),
}

//hago una configuración para evitar colocarle esto a cada función, de esta manera resumo más el código
let config = {
    headers:new Headers({
        "Content-Type": "application/json"
    }), 
};

//Funciones crud
//POST
const postUser = async(data)=>{
    config.method = "POST";
    config.body = JSON.stringify(data);
    let respuesta = await ( await fetch("http://localhost:3000/personal",config)).json();
    console.log(respuesta);
}

//GET
const getUserAll = async()=>{
    config.method = "GET";
    let respuesta = await ( await fetch("http://localhost:3000/personal",config)).json()
    console.log(respuesta)

    //DOM
    //Mostrar datos: de esta manera agrego cada usuario a la tabla ordenadamente, usando innerHTML, tambíen agrego el id que se crea con jsonServer al id de la etiqueta que contiene todos mis datos (tr).
    respuesta.forEach(empleado => {
        tabla.innerHTML +=`
        <tr class="registro" id='${empleado.id}'>
                <td>${empleado.documento}</td>
                <td>${empleado.nombres}</td>
                <td>${empleado.apellidos}</td>
                <td>${empleado.email}</td>
                <td>${empleado.nCelular}</td>
                <td>${empleado.profesion}</td>
                <td><div class="contenedor-buttons">    
                        <button class="delete" >Eliminar</button>
                    </div>
                </td>
                </tr>
        `
    });
}

//DELETE
const deleteUser = async(id)=>{
    config.method = "DELETE";
    let respuesta = await ( await fetch(`http://localhost:3000/personal/${id}`,config)).json();
    console.log(respuesta);
}

//evento de escucha para eliminar tanto de la página como de mi servidor
tabla.addEventListener('click',(e)=>{ 
    e.preventDefault
    if(e.target.classList == 'delete'){ //si lo que doy click en el tbody tiene la clase delete, entonces...
        let registro = e.target.closest('.registro')
        registro.remove()
        deleteUser(registro.id) //le paso el id que tiene la etiqueta que es el mismo del objeto en jsonServer
    }
})


