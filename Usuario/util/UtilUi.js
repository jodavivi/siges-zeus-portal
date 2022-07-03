sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], function(JSONModel, MessageBox, MessageToast) {
  "use strict";
  return {
 
		geneararFiltro: function(oParam) {
      var sFiltro = "";
      var i = 0;
      for (const prop in oParam) {
        if(oParam[prop] !== undefined && oParam[prop] !== null){
          i = i +1;
          sFiltro = sFiltro + prop +"="+oParam[prop]+"&";
        } 
      }
      if(i > 0){
        sFiltro = "?"+sFiltro.substr(0, sFiltro.length -1);
      }
      
			return sFiltro;
		},
    generarTree: function(arr, nivelObjetivo) {
      var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;

      // En primer lugar mapear los nodos de la matriz a un objeto -> crear
      // una tabla
      var i = 0;
      var len = [];
      for (i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.Codigo] = arrElem;
        mappedArr[arrElem.Codigo].listaAccesos = [];
      }
      var id = {};
      for (id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
          mappedElem = mappedArr[id];
          // Si el elemento no está en el nivel raíz, se agrega a su matriz de
          // hijos.
          if (mappedElem.CodigoPadre !== null) {
            try {
              mappedArr[mappedElem.CodigoPadre].listaAccesos.push(mappedElem);
            } catch (e) {

            }

          }
          // Si el elemento está en el nivel raíz, se agrega al array de
          // elementos de primer nivel.
          else {
            tree.push(mappedElem);
          }
        }
      }
      return tree;
    }, 
    decodeJwt:function(token){
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
    }
  };
});
