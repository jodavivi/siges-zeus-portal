sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.telcomdataperu.app.Portal.controller.Aplicacion", {
		onInit: function () {
				 
		},
		onNavegarAplicacion:function(oEvent){
			try{  
			  
			  var sPath = oEvent.getSource().getBindingContext("usuarioLogeadoModel").getPath();
        	  var oModel = this.getView().getModel("usuarioLogeadoModel");
			  var oContext = oModel.getProperty(sPath); 
			  this.getOwnerComponent().getRouter().navTo(oContext.Url); 
			}catch(e){
			  console.error("Error: "+e);
			}
		  }
	});
});