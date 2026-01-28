
let gestor;
function initApp(){
  const inputTarea = document.getElementById("nuevaTarea");
  const btnTarea = document.getElementById("agregarTarea");
  const listaTareas = document.getElementById("listaTareas");

  gestor = new GestorDeTareas();

  gestor.render(listaTareas);

  btnTarea.addEventListener("click", () => {
    const texto = inputTarea.value.trim();
    if(texto){
      gestor.agregarTarea(texto);
      inputTarea.value = "";
      inputTarea.focus();
      gestor.render(listaTareas);
    }
    else{
      alert("Escribe una tarea");
    }
  });

  inputTarea.addEventListener("keypress", (e) =>{
    if(e.key === "Enter"){
      btnTarea.click();
    }
  });

  window.gestor = gestor
}

//Se inicializara el programa, cuando el DOM del programa este listo.
document.addEventListener("DOMContentLoaded", initApp)