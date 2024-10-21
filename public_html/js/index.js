    
    document.addEventListener('DOMContentLoaded', function(){
           
           crearBD();
    });


function crearBD(){
    
    var abrir = indexedDB.open("VitoMaite",1) ;
    abrir.onupgradeneeded = function (event) {
        
        
      var user = event.target.result.createObjectStore("Usuarios", {keyPath: "id", autoIncrement: true});
      //Crear campos de tabla user
      user.createIndex("correo", "correo", {unique: true});
      user.createIndex("nick", "nick", {unique: false});
      user.createIndex("contraseña", "contraseña", {unique: false});
      user.createIndex("edad", "edad", {unique: false});
      user.createIndex("esPremium", "esPremium", {unique: false}); 
      
      
     var citas = event.target.result.createObjectStore("Citas", {keyPath: "id", autoIncrement: true});
     //Crear campos de tabla citas
     citas.createIndex("user1","user1", {unique: false});
     citas.createIndex("user2","user2", {unique: false});
     //Será un boolean, se marcará 0 si solo hay like de parte de uno y 1 si hay like por parte de los 2(match)
     citas.createIndex("estado","estado", {unique: false});
     
     
     var visitas = event.target.result.createObjectStore("Visitas", {keyPath: "id", autoIncrement: true});
     //Crear campos tabla visitas
       visitas.createIndex("visita","visita", {unique: false});
       visitas.createIndex("visitado","visitado", {unique: false});
       visitas.createIndex("fechaUltimaVisita","fechaUltimaVisita", {unique: false});
       visitas.createIndex("horaUltimaVisita","horaUltimaVisita", {unique: false});
       
       
       //Para añadir a los objectStore
       // user.add({...,...,...})
    };
    
}
