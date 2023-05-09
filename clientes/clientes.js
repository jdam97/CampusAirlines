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
    // "SEARCH": (data) => searchUser(data),
    // "PUT": (data) => putUser(data)
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
    let respuesta = await ( await fetch("http://localhost:3000/usuarios",config)).json();
    console.log(respuesta);
}

//GET
const getUserAll = async()=>{
    config.method = "GET";
    let respuesta = await ( await fetch("http://localhost:3000/usuarios",config)).json()
    console.log(respuesta)

    //DOM
    //Mostrar datos: de esta manera agrego cada usuario a la tabla ordenadamente, usando innerHTML, tambíen agrego el id que se crea con jsonServer al id de la etiqueta que contiene todos mis datos (tr)
    
    respuesta.forEach(usuario => {
        tabla.innerHTML +=` 
        <tr class="registro" id='${usuario.id}'> 
                <th scope="row">${usuario.id}</th>
                <td>${usuario.identificacion}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.telefono}</td>
                <td>${usuario.nacimiento}</td>
                <td>${usuario.ciudad}</td>
                <td>${usuario.pais}</td>
                <td>${usuario.correo}/td>
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
    let respuesta = await ( await fetch(`http://localhost:3000/usuarios/${id}`,config)).json();
    console.log(respuesta);
}

//evento para eliminar
/*1.agrego un evento de escucha al tbody que sería el papá de mis datos.
2. agrego una condicion que le asigno al e.target de tbody y le digo que si hay alguna clase que tenga el valor "delete", entonces...
3. En la linea 82 uso el método closest que me permite buscar un elemento con la clase ".registro" y se lo agrego a una variable llamada 'registro'.
4.remuevo o elimino de la página todo lo que contiene esa clase "registro", qué como podemos ver arriba en la linea 47, es una clase que le asigno a tr. Todo esto para eliminar todo el usuario en este caso
5. le paso la funcion deleteUser para que también se elimine de mi servidor

Nota: lo hice de esta manera para no hacer un forEach por cada hijo que creo, le aplico el evento de escucha al papá 1 vez y el me busca lo que debo eliminar, de esta manera no consumo tantos recursos creando eventos de escucha por cada hijo.
*/

tabla.addEventListener('click',(e)=>{ 
    if(e.target.classList == 'delete'){ //si lo que doy click en el tbody tiene la clase delete, entonces...
        let registro = e.target.closest('.registro')
        registro.remove()
        deleteUser(registro.id) //le paso el id que tiene la etiqueta que es el mismo del objeto en jsonServer
    }
})


