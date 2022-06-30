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
			oParam.aCategoria 	 		= [];
			oParam.oCategoriaNuevo 		= {};
			oParam.oCategoriaEditar		= {};
			oParam.oCategoriaPadre 		= {};
			oParam.aListaParametros 	= [];
			oParam.oCategoriaSeleccionado = {};
			oParam.iNumItems			= 0; 
			var oModel       = new JSONModel(oParam);
			return oModel;
		  }

	};
});