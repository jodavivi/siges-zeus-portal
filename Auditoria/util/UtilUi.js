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
        if(oParam[prop] !== undefined && oParam[prop] !== null && oParam[prop] !== ""){
          i = i +1;
          sFiltro = sFiltro + prop +"="+oParam[prop]+"&";
        } 
      }
      if(i > 0){
        sFiltro = "?"+sFiltro.substr(0, sFiltro.length -1);
      }
      
			return sFiltro;
		}
  };
});
