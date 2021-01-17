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
		modelAuditoria:function(){
			var oParam                    = {};
			oParam.aAuditoria             = []; 
			oParam.oAuditoriaDetalle	  = {};
			oParam.oFiltroAuditoria	  	  = {};
			oParam.aListaAplicacion	  	  = [];
			oParam.aListaProceso  	  	  = [];
			var oModel                     = new JSONModel(oParam);
			return oModel;
		  }


	};
});