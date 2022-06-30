sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}, 
		modelAcceso:function(){
			var oParam           		= {}; 
			oParam.aProductos 	 		= [];
			oParam.aProductoImagen 		= [];
			oParam.oImagenProductoNuevo = {};
			oParam.aCategoria 	 		= [];
			oParam.aMarca 	 			= [];
			oParam.oCategoriaSeleccionado = {};
			oParam.oProductoNuevo 		= {};
			oParam.oProductoSeleccionado= {};
			oParam.aListaParametros 	= []; 
			oParam.oProductoSeleccionado = {};
			oParam.iNumItems			= 0; 
			oParam.iNumImagenItems			= 0; 
			oParam.bActivarEdicion      = true;
			oParam.bGuardar      		= true;
			oParam.bTabActivar			= false;
			var oModel       = new JSONModel(oParam);
			return oModel;
		  }

	};
});