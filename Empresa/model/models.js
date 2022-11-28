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
		modelEmpresa:function(){
			var oParam                       = {};
			oParam.aTablaEmpresa             = []; 
			var oModel                       = new JSONModel(oParam);
			return oModel;
		  },
		  modelPermisosApp:function(){
			  var oParam           = {};
			  oParam.sPermisosApp  = ""; 
			  oParam.sBtnMaestroRegistrar 	 = 'C0000005';
			  oParam.sBtnMaestroEliminar  	 = 'C0000006';
			  oParam.sBtnMaestroActualizar 	 = 'C0000007';
			  oParam.sBtnParametroRegistrar  = 'C0000008';
			  oParam.sBtnParametroEditar  	 = 'C0000009';
			  oParam.sBtnParametroEliminar   = 'C0000010';
			  var oModel           = new JSONModel(oParam);
			  return oModel;
			}

	};
});