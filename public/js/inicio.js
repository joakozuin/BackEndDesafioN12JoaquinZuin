function llamarRuta() {
  console.log("Llamando a la ruta de carga de la pagina dinámica...");
 
  // Petición HTTP
  fetch("http://localhost:8080/api/productos/motorEjs")
    .then((response) => response.text())
    .then(data=>{
        const renderizar=document.getElementById("rend")
        renderizar.innerHTML=data
        //console.log(data)
    })
}
