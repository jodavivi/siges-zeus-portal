sap.ui.define([], function() {
  "use strict";
  return {
    validarPermisoControl: function(permisos, control){
      try {
        if(permisos[control]){
          return permisos[control];
        }else{
          return false;
        } 
      } catch (error) {
        return false;
      } 
    },
    stateEstadoStock: function(estado){
      var retorno; 

      if (estado  > 0){
          retorno =   "Success";
      } else {
          retorno =   "Error";
      }

      return retorno;
   },

   textEstadoStock: function(estado){
      var retorno; 

      if (estado  > 0){
          retorno =   "En Stock (" + estado + ")";
      } else {
          retorno =   "Agotado";
      }

      return retorno;
   },

   textPrecioVenta: function(estado){
      var retorno; 

      if (estado  > 0){
          retorno =   "P.U (" + estado + ")";
      } else {
          retorno =   "Sin Precio";
      }

      return retorno;
   },

   textEstadoCantidad: function(estado){
      var retorno; 

      if (estado  > 0){
          retorno =   "CANT. (" + estado + ")";
      } else {
          retorno =   "Agotado";
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
  } , 
  redondear2Decimal: function (num) {
    if(!num){
      return "0.00";
    }
    var valor = +(Math.round(num + "e+2")  + "e-2"); 
    valor = valor.toFixed(2);
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1,';
    let arr = valor.toString().split('.');
    arr[0] = arr[0].replace(exp,rep);
    var valorDecimal = arr[1] ? arr.join('.'): arr[0]; 
    if(!valorDecimal){
      valorDecimal = "0.00";
    }
    return valorDecimal;
  } , 
  valorInicial: function (num) {
     if(!num){
      return "0.00"
     }
    return num;
  } 
  };
});
