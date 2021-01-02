sap.ui.define([], function() {
  "use strict";
  return {
    formatoFecha1: function(fecha) {
      if (fecha !== undefined && fecha !== null) {
        return new Date(fecha);
      }
      return fecha;
    },
    imagenDefault: function(imagen) {
      if (imagen === undefined || imagen === null || imagen === "") {

        return "img/default.jpg"
      } else {
        return "https://sistema.vivfcons.com"+imagen;
      }
    },
    precioCarrito: function(precio) {
      if (precio === undefined || precio === null || precio === "") {

        return "S/. 0.0"
      } else {
        return "S/. " + precio.toFixed(2);
      }
    },
    formatDate: function(fecha) {
      var format = "yyyy-mm-dd h:m:s";
      var date = new Date(fecha);
			if(date.getFullYear() < 2000){
				return "";
			}
      var nuevoFormat = '';
      if (date !== undefined && date !== null) {
        if (date.getFullYear() !== -1) {
          var dd = (date.getDate() <= 9 ? '0' + date.getDate() : date.getDate());
          var mm = (date.getMonth() + 1 <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
          var yyyy = date.getFullYear();
          var hour = (date.getHours() <= 9 ? '0' + date.getHours() : date.getHours());
          var minut = (date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes());
          var segund = (date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds());
          nuevoFormat = format.replace('dd', dd)
            .replace('mm', mm)
            .replace('yyyy', yyyy)
            .replace('h', hour)
            .replace('m', minut)
            .replace('s', segund);
        }
      }
      return nuevoFormat;
    },
		statusPedido:function(estadoPedidoId){
			if(estadoPedidoId === 71 ){
				return "Warning";
			}
			if(estadoPedidoId === 72 ){
				return "Success";
			}
			if(estadoPedidoId === 73 ){
				return "Error";
			}
			if(estadoPedidoId === 74 ){
				return "Success";
			}
		},
		statusProducto:function(estadoPedidoId){
			if(estadoPedidoId === 24 ){
				return "Warning";
			}
			if(estadoPedidoId === 23 ){
				return "Success";
			}
		},
		num2decimales:function(num){
			if(num !== undefined && num !== null){
				return num.toFixed(2);
			}else{
				return num;
			}
		},
    validaPuntos:function(num){
      if(num !== undefined && num !== null){
        return num.toFixed(2) + " Pts";
      }else{
        return 0 + " Pts"
      }
    },
    statusBono:function(num){
      if(num === 65){
        return "Warning";
      }else{
          return "Success";
      }
    },
    descripcionBono:function(num){

        return num;

    },
    activarAccionBono:function(estadoId, porcentajeAvance){
      if(estadoId === null && porcentajeAvance >= 100){
          return true;
      }else if (estadoId === 65){
        return true;
      } else if (estadoId === 67){
        return true;
      } else {
        return false;
      }

    },
    descripcionBtnBono:function(estadoId){
      if (estadoId === 65 || estadoId === 67){
        return "Cancelar";
      } else {
        return "Solicitar";
      }
    },
    validaImagen: function(imagenUrl){
      if(imagenUrl === undefined || imagenUrl === null || imagenUrl === ""){
        return "/Imagenes/Productos/missing.png";
      } else {
        return "http://vivfcons.subciber.com"+imagenUrl;
      }
    },
    redondeo2:function(num){
      if(num > 0){
        return num.toFixed(2);
      }else{
        return num;
      }
    },
    redondeo2dec:function(num){
      if(num > 0){
        return parseFloat(num.toFixed(2));
      }else{
        return num;
      }
    }
  };
});
