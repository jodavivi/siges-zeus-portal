sap.ui.define([], function() {
  "use strict";
  return {
    stateEstado: function(estado){
      var retorno; 

      if (estado  === 1){
          retorno =   "Success";
      } else {
          retorno =   "Error";
      }

      return retorno;
   },

   iconEstado: function(estado){
      var retorno; 

      if (estado  === 1){
          retorno =   "sap-icon://accept";
      } else {
          retorno =   "sap-icon://sys-cancel-2";
      }

      return retorno;
   },
   formatDate: function(date, format){ 

     if(format === undefined || format === null || format === ""){
      format = "dd/mm/yyyy h:m:s";
     }
    var nuevoFormat='';

    if(date !== undefined && date !== null ){
      date = new Date(date);
      if(date.getFullYear() !== -1){
          var dd = (date.getDate() <= 9 ? '0' + date.getDate() : date.getDate());
          var mm = (date.getMonth() + 1<=9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
          var yyyy = date.getFullYear();
          var hour = (date.getHours() <= 9 ? '0' + date.getHours() : date.getHours());
          var minut = (date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes());
          var segund = (date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds());
          nuevoFormat = format.replace('dd',dd)
                      .replace('mm',mm)
                      .replace('yyyy',yyyy)
                      .replace('h',hour)
                      .replace('m', minut)
                      .replace('s',segund);
      }
    }
      return  nuevoFormat;
  },
  tipoControl: function(sTipo){
    var sNombreTipo = "";
    if(sTipo === "P"){
      sNombreTipo = "Pagina";
    }
    if(sTipo === "C"){
      sNombreTipo = "Control";
    }
    return sNombreTipo;
  } ,
  mostrarImagen: function(sImagen){
    var mostrar = true;
    if(sImagen === undefined 
      || sImagen === null
        || sImagen === ""){
          mostrar = false;
    }
    return mostrar;
  } 

  };
});
