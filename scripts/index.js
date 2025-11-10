

// ["ciudad-salida","ciudad-destino","salida","llegada","precio-tercera-clase"],
  const datos = [
    ["0","Guadalajara","Monterrey","7:15 AM","9:00 AM","950"],
    ["1","Mérida","Guadalajara","10:30 AM","4:15 AM","3800"],
    ["2","Monterrey","Mérida","2:00 PM","3:00 PM","700"],
    ["3","Tijuana","Monterrey","6:30 PM","8:30 PM","950"],
    ["4","Puebla","Tijuana","11:10 AM","5:00 PM","3500"],
    ["5","Guadalajara","Puebla","12:10 AM","4:00 PM","2000"],
    ["6","Tijuana","Guadalajara","9:40 AM","3:30 PM","3200"]
  ];


  document.addEventListener("DOMContentLoaded", function ()  {  
    const page = document.body.dataset.page;

    //variables y constantes de index
    //filtro
    const input_fecha = document.getElementById("fecha");
    const select_ciudad_salida = document.getElementById("select-ciudad-salida");
    const select_ciudad_destino = document.getElementById("select-ciudad-destino");

    const vuelos = document.getElementById("vuelos");
    
    const primera_clase = document.getElementById("primera-clase");
    const segunda_clase = document.getElementById("segunda-clase");
    const tercera_clase = document.getElementById("tercera-clase"); 

    const clases = [primera_clase, segunda_clase, tercera_clase];
    
    // localStorage.clear();

    let fecha;
    //cargar segun pagina
    if (page == "index" || page == "estadisticas") {
      //indicador de fecha
        
      if (input_fecha) {
        
        input_fecha.value = new Date().toISOString().split("T")[0];
        fecha = input_fecha.value;
        
        input_fecha.addEventListener("change", function(e) {
          fecha = e.target.value;
          console.log(fecha);
          cargarVuelos(fecha);
        });
      }
      cargarVuelos();

        select_ciudad_salida.addEventListener("change", filtrar);
        select_ciudad_destino.addEventListener("change", filtrar);
      
    }

    //variables y constantes de seleccionAsiento
    const select_cantidad_asientos = document.getElementById("cantidad-asientos");
    const params = new URLSearchParams(window.location.search);
    const idVuelo = params.get("id");
    const fechaVuelo = params.get("fecha")
    const horaSalida = params.get("horaSalida");
    const horaLlegada = params.get("horaLlegada");

    
    const span_total = document.getElementById("span-total");
    let total = 0.00;
    if (span_total) {
      span_total.textContent = total.toFixed(2)
    }

    const td_precio_primera_clase = document.getElementById("precio-primera-clase");
    const td_precio_segunda_clase = document.getElementById("precio-segunda-clase");
    const td_precio_tercera_clase = document.getElementById("precio-tercera-clase");
    
    let asientos_seleccionados = [];
    
    if (page == "vuelos"){
      let cantidadAsientos = select_cantidad_asientos.value;
      td_precio_primera_clase.textContent = `$${(datos[idVuelo][5] * 1.5).toFixed(2)}`;
      td_precio_segunda_clase.textContent = `$${(datos[idVuelo][5] * 1.25).toFixed(2)}`;
      td_precio_tercera_clase.textContent = `$${Number(datos[idVuelo][5]).toFixed(2)}`;
      
      const subtotal = document.getElementById("subtotal");
      const mensaje_error = document.getElementById("mensaje-error");
      const btnPagar = document.getElementById("btnPagar");

      select_cantidad_asientos.addEventListener("change", function(){
        cantidadAsientos = select_cantidad_asientos.value;
        let diferencia = asientos_seleccionados.length - cantidadAsientos;
        if (diferencia > 0) {
          let ultimos = asientos_seleccionados.splice(-diferencia, diferencia);
          ultimos.forEach((u) => { u.classList.replace("seleccionado", "libre")});
          actualizarResumen(asientos_seleccionados);
        }

      });
      
      let asiento;
      
      primera_clase.addEventListener("click", function(e){
        asiento = e.target.closest("td");
        seleccionarAsientos(asiento);

      });

      segunda_clase.addEventListener("click", function(e){
        asiento = e.target.closest("td");
        seleccionarAsientos(asiento); 
        
      });

      tercera_clase.addEventListener("click", function(e){
        asiento = e.target.closest("td");
        seleccionarAsientos(asiento);

      });

      

      btnPagar.addEventListener('click', function() {
        
        if (cantidadAsientos > asientos_seleccionados.length) {
          mensaje_error.style.display = "block";
        }
        else {

          asientos_seleccionados.forEach((asiento) => {
            asiento.classList.replace("seleccionado", "ocupado");
          });
          
          //guardar en local storage
          GuardarVuelo();
          
          asientos_seleccionados = [];
          window.location.href = "index.html"
        }
        
      });
      
      const vueloGuardado = JSON.parse(localStorage.getItem(`vuelo_${fechaVuelo}_${idVuelo}`));
      
      
      if (vueloGuardado) {
        cargarVuelo();
      }
      else {
        crearAsientos(clases);
      }
      
      document.getElementById("span-id-vuelo").textContent = `Vuelo: ${fechaVuelo}_${idVuelo}`;
      document.getElementById("span-salida").innerHTML = `${datos[idVuelo][1]}<br>${fechaVuelo}<br>${datos[idVuelo][3]}`;
      document.getElementById("span-destino").innerHTML = `${datos[idVuelo][2]}<br>${fechaVuelo}<br>${datos[idVuelo][4]}`;
      
      

      function cargarVuelo(){
        for (let i = 0; i < clases.length; i++) {
          let clase = vueloGuardado[i];
          let tr = document.createElement("tr");

          for(let j = 0; j < clase.length; j++){
            let td = document.createElement("td");
            td.textContent = clase[j].nombre;
            td.classList.add(clase[j].estado);
            tr.appendChild(td);

            if (( j + 1 ) % 6 == 0) {
              clases[i].appendChild(tr);
              tr = document.createElement("tr");
            }
          } 
          if (tr.children.length > 0) {
            clases[i].appendChild(tr);
          }
        }

      }

      function crearAsientos(clases){ //Primera vez
        const letras = ["A","B","C","D","E","F"];
        let max;
          let r_sum = 0;
          
          for(clase of clases){

            //Arreglar por clase
            if (clases[0]) max = 4; else max = 5
            let r = Math.floor(Math.random() * (max - 3 + 1)) + 3;
            

            for (let i = 1; i <= r; i++) {
              let tr = document.createElement("tr");
              
              for(let j = 0; j < 6; j++){
                let td = document.createElement("td");
                td.textContent = `${letras[j]}${i + r_sum}`; 
                console.log(clases[0].length);
                td.classList.add("libre")
                tr.appendChild(td)
              }
              
              clase.appendChild(tr);
              
            }
            r_sum += r;
          }

      }


      function GuardarVuelo(){
        
        const datosClases = clases.map((tabla) => {
          return Array.from(tabla.querySelectorAll("td")).map((td) => ({
            nombre : td.textContent.trim(),
            estado : td.classList.contains("ocupado") ? "ocupado" : "libre"
          }));

        });

        const compraBoleto = {
          id : idVuelo,
          salida : { fecha: fechaVuelo, hora : horaSalida, ciudad : datos[idVuelo][1], },          
          llegada : { fecha: fechaVuelo, hora : horaLlegada, ciudad : datos[idVuelo][2],},
          asientos : asientos_seleccionados.map(td => { 
            return{
              clase : td.closest("table").id, 
              lugar : td.textContent
            }
          })

        };

        //datos de posiciones y clases
        localStorage.setItem(`vuelo_${fechaVuelo}_${idVuelo}`, JSON.stringify(datosClases));

        //buscar datos anteriores
        const  compras = JSON.parse(localStorage.getItem(`compras`)) || [];
        compras.push(compraBoleto);
        localStorage.setItem(`compras`, JSON.stringify(compras));
      }

      function seleccionarAsientos(a) {
        if(a == null)return

        if (a.classList.contains("ocupado"))return

        if (a.classList.contains("libre") && Number(cantidadAsientos) > asientos_seleccionados.length) {  
          a.classList.replace("libre", "seleccionado");
          asientos_seleccionados.push(a);  
          
        }
        else if (a.classList.contains("seleccionado")) {
          let a_pos = asientos_seleccionados.indexOf(a);
          a.classList.replace("seleccionado", "libre");
          asientos_seleccionados.splice(a_pos, 1);
        }
        
        actualizarResumen(asientos_seleccionados);
      }
    
  
      function actualizarResumen(asientos) {
        let precio;
        total = 0;
        subtotal.innerHTML = "";
        let clase = "";
        asientos.forEach(a =>{
          const tr = document.createElement("tr");

          const tabla = a.closest("table");

          switch (tabla.id) {
            case "primera-clase":
              clase = "Primera clase";
              precio = datos[idVuelo][5] * 1.5;
              break;
            case "segunda-clase":
              clase = "Segunda clase";
              precio = datos[idVuelo][5] * 1.25;
              break;
              case "tercera-clase":
                clase = "Tercera clase";
                precio = Number(datos[idVuelo][5]);
              break;
          }

          tr.innerHTML = `<td>${clase}</td>
                          <td>${a.textContent}</td>
                          <td>$${Number(precio).toFixed(2)}</td>`;
          subtotal.appendChild(tr);
          total += parseFloat(precio);
        });

        mensaje_error.style.display = "none";
        span_total.textContent = total.toFixed(2);
      } 
    
  }

  //quite el parametro fecha
    function cargarVuelos(){
      if (page == "index") {
        vuelos.innerHTML="";
        datos.forEach(dato => {
          let v = `<div id ="${dato[0]}" class="vuelo" data-salida=${dato[1]} data-destino=${dato[2]}>
                      <span class="ciudades">
                          <strong>${dato[1]}</strong>
                          <i class="fa-solid fa-arrow-right"></i>
                          <strong>${dato[2]}</strong>
                      </span>
                      <div>
                          <strong>Salida</strong>
                          <span>${fecha}<br>${dato[3]}</span>
                      </div>
                      <div>
                          <strong>Llegada</strong>
                          <span>${fecha}<br>${dato[4]}</span>
                      </div>
                      <span id="precio-tercera-clase" class="precio-vuelo">Desde $ ${dato[5]}</span>
                      <a href="vuelo.html?fecha=${fecha}&id=${dato[0]}&horaSalida=${dato[3]}&horaLlegada=${dato[4]}">Ver vuelo</a>
                  </div>`;
                vuelos.innerHTML += v
        });
        vuelos.append();
      }
      else{
        vuelos.innerHTML="";
        let compras = JSON.parse(localStorage.getItem(`compras`)) || [];
        compras = eliminarVencidos(compras);

        if (compras.length == 0) {
          vuelos.innerHTML = `<span class="error">No hay vuelos pendientes por visualizar</span>`;
        }
        else {
          compras.forEach(dato => {
            let v = `<div id ="${dato.id}" class="vuelo" data-salida=${dato.salida.ciudad} data-destino=${dato.llegada.ciudad}>
                          <span class="ciudades">
                              <strong>${dato.salida.ciudad}</strong>
                              <i class="fa-solid fa-arrow-right"></i>
                              <strong>${dato.llegada.ciudad}</strong>
                          </span>
                          <div>
                              <strong>Salida</strong>
                              <span>${dato.salida.fecha}<br>${dato.salida.hora}</span>
                          </div>
                          <div>
                              <strong>Destino</strong>
                              <span>${dato.llegada.fecha}<br>${dato.llegada.hora}</span>
                          </div>
                          <div class="estadistica">
                            <strong>Mis asientos: </strong>
                            <div>
                              ${dato.asientos.map(a => 
                                `<span class="b-${a.clase}"> ${a.lugar}</span>`).join("")}
                            </div>
                          </div>
                          <a href="vuelo.html?fecha=${dato.salida.fecha}&id=${dato.id}&horaSalida=${dato.salida.hora}&horaLlegada=${dato.llegada.hora}">Ver vuelo</a>
                      </div>`;
                  vuelos.innerHTML += v;
          });
        }
        vuelos.append();
      }

    }

    function eliminarVencidos(compras){
      const hoy = new Date().toISOString().split("T")[0];

      const vigentes = compras.filter(compra => {
        return compra.llegada.fecha >= hoy;
      });

      vigentes.sort((a,b) => {
        if (a.salida.fecha < b.salida.fecha) return -1;
        if (a.salida.fecha > b.salida.fecha) return 1;
        return 0;
      });

      if (vigentes.length != compras.length) {
        localStorage.setItem("compras",JSON.stringify(vigentes)) 
      }
      return vigentes;
    }

    function filtrar(){
      document.querySelectorAll(".vuelo").forEach(vuelo =>{
        const salidaVuelo = vuelo.dataset.salida;
        const destinoVuelo = vuelo.dataset.destino;
      
          let coincideSalida = select_ciudad_salida.value == "*" ||  salidaVuelo == select_ciudad_salida.value;
          let coincideLlegada = select_ciudad_destino.value == "*" ||  destinoVuelo == select_ciudad_destino.value;

          if (coincideSalida && coincideLlegada) {
            vuelo.style.display = "grid";   
          }
          else {
            vuelo.style.display = "none"
          }
      });
    }

  });

