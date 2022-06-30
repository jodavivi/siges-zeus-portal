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
			oParam.aUsuarios 	 		= [];
			oParam.oUsuarioNuevo 		= {};
			oParam.aListaParametros 	= [];
			oParam.aListaRoles			= [];
			oParam.oUsuarioSeleccionado = {};
			oParam.iNumItems			= 0;
			oParam.oEstadoClave			= {};
			var oModel       = new JSONModel(oParam);
			return oModel;
		  }

	};
});