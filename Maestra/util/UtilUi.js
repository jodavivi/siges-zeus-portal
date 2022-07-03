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
