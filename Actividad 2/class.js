class Tarea {
  constructor(nombre) {
    this.id = Date.now(); //Identificador de antiguedad de cada tarea (No se muestra en el UI);
    this.nombre = nombre; //Texto que el usuario escribio para la tarea.
    this.completa = false; //Identificador para saber si la tarea esta hecha o no.
  }

  completar() {
    this.completa = !this.completa;
  }

  actualizarNombre(nuevoNombre){
    this.nombre = nuevoNombre
  }
}

class GestorDeTareas {
  constructor(btnTareaId, inputTareaId, listaTareasId) {
    this.btnTarea = document.getElementById(btnTareaId);
    this.inputTarea = document.getElementById(inputTareaId);
    this.listaTareasId = listaTareasId;

    //Carga las tareas almacenadas.
    this.tareas = this.cargarTareas();

    if(!this.btnTarea || !this.inputTarea){
      console.error("Elementos DOM no encontrados");
      return;
    }

    //Pone las acciones de la pagina en marcha.
    this.init();
  }

  init(){
    this.render();
    this.configuracionEventos();
  }

  configuracionEventos(){

    //Evento para agregar una tarea.
    btnTarea.addEventListener("click", () => {
      const texto = inputTarea.value.trim();
      if(texto){
        this.agregarTarea(texto);
        inputTarea.value = "";
      }
      else{
        alert("Escribe una tarea");
      }
    });

    inputTarea.addEventListener("keypress", (e) => {
      if (e.key === "Enter"){
        btnTarea.click();
      }
    });
  }

  agregarTarea(nombre) {
    const tarea = new Tarea(nombre);
    this.tareas.push(tarea);
    this.guardarTareas();
    return tarea;
  }

  eliminarTarea(id){
    if(confirm("Eliminar esta tarea?")){
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardarTareas();
        this.render();
        return true;
    }
    return false;
  }

  toggleCompleta(id){
    const tarea = this.tareas.find(t => t.id === id);
    if(tarea){
        tarea.completa = !tarea.completa;
        this.guardarTareas();
        this.render();
        return true;
    }
    return false;
  }

  editarTarea(id){
    const tarea = this.tareas.find(t => t.id === id);
    if (!tarea) return false;
    

    const nuevoMensaje = prompt("Editar Tarea", tarea.nombre);
    if (tarea && nuevoMensaje.trim()){
        tarea.nombre = nuevoMensaje.trim();
        this.guardarTareas();
        this.render();
        return true;
    }
    return false
  }

  guardarTareas(){
    localStorage.setItem("tareas", JSON.stringify(this.tareas))
  }

  cargarTareas(){
    const guardadas = localStorage.getItem("tareas");
    return guardadas ? JSON.parse(guardadas) : [];
  }

  getTareas(){
    return this.tareas;
  }

  render() {
    const lista = document.getElementById("listaTareas");
    lista.innerHTML = "";

    //Permite la creacion de elementos "li" para cada tarea que sirven para el checkbox y los botones de editar y eliminar.
    this.tareas.forEach(tarea =>{
        const li = document.createElement("li");
        li.className = `tareaItem ${tarea.completa ? 'completa' : ''}`;
        
        //Esta parte añade los botones de editar, eliminar y el checkbox de completado a cada tarea por separado.
        li.innerHTML = `
                <div class="tareaInfo">
                    <input type="checkbox" ${tarea.completa ? 'checked' : ''}>
                    <span class="tareaTexto">${tarea.nombre}</span>
                </div>
                <div class="tareaBotones">
                    <button class="btnEditar" type="button">Editar</button>
                    <button class="btnEliminar" type="button">Eliminar</button>
                </div>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
              this.toggleCompleta(tarea.id);
            });

            const btnEliminar = li.querySelector('.btnEliminar');
            btnEliminar.addEventListener('click', () => {
              this.eliminarTarea(tarea.id);
            });

            const btnEditar = li.querySelector('.btnEditar');
            btnEditar.addEventListener('click', () => {
              this.editarTarea(tarea.id);
            });

            const tareaTexto = li.querySelector('.tareaTexto');
            tareaTexto.addEventListener('dblclick', () => {
              this.editarTarea(tarea.id);
            });
            lista.appendChild(li);
    });
  }
}
