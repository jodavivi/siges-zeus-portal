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
			oParam.aMarca 	 			= [];
			oParam.aMarcaCategoria 	 	= [];
			oParam.oMarcaNuevo 			= {};
			oParam.oMarcaEditar			= {};
			oParam.oMarcaVer			= {};
			oParam.aCategoria			= [];
			oParam.iNumItemsCat			= 0; 
			oParam.oMarcaSeleccionado 	= {};
			oParam.sMarcacategoriaSel	= "";
			oParam.iNumItems			= 0; 

			var oModel       = new JSONModel(oParam);
			return oModel;
		  }

	};
});