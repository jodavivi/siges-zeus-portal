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
		modelTablaGenerica:function(){
			var oParam                       = {};
			oParam.aTablaMaestra             = [];
			oParam.oTablaSeleccionada        = {};
			oParam.aTablaParametros          = [];
			oParam.aTablaBusquedaParametros  = [];
			oParam.oTablaNuevo  	         = {};
			oParam.oParametroNuevo           = {};
			oParam.oControles		         = {};
			oParam.oControles.btnGuardarTabla = false;
			oParam.oParametroPadreNuevo      = {};
			oParam.oParametroNuevo.iIdEstado = 1;
			oParam.oParametroSeleccionado    = {};
			oParam.oParametroAuditoria	     = {};
			oParam.oParametroVistaDetalle	 = {};
			oParam.oMaestraAuditoria	     = {};
			var oModel                       = new JSONModel(oParam);
			return oModel;
		  }

	};
});