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
			oParam.aListaRolesUsuario	= [];
			oParam.aListaRolesUsuarioActual	= [];
			oParam.aListaRolesUsuarioEditar = [];
			oParam.oUsuarioSeleccionado = {};
			oParam.iNumItems			= 0;
			oParam.oEstadoClave			= {};
			oParam.bActivar				= false;
			var oModel       = new JSONModel(oParam);
			return oModel;
		  },
		  modelPermisosApp:function(){
			  var oParam           = {};
			  oParam.sPermisosApp  = ""; 
			  oParam.sBtnUsuarioRegistrar 	 = 'C0000011';
			  oParam.sBtnUsuarioActualizar 	 = 'C0000012';
			  oParam.sBtnUsuarioEliminar 	 = 'C0000013'; 
			  oParam.sBtnUsuarioClaveReset 	 = 'C0000014'; 
			  var oModel           = new JSONModel(oParam);
			  return oModel;
			}

	};
});