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
		modelDocumentoVenta:function(){
			var oParam                       = {};  
			oParam.oDatosDefault			 = {};  
			oParam.aListaDocVenta 			 = {};
			var oModel                       = new JSONModel(oParam);
			return oModel;
		  },
		  modelDocVentaPermisosApp:function(){
			  var oParam           = {};
			  oParam.sPermisosApp  = "";  
			  var oModel           = new JSONModel(oParam);
			  return oModel;
			}

	};
});