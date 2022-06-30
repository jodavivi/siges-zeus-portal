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
			var oParam            = {};
			oParam.aMenuAcceso    = [
				{
					"Nombre":"Permisos",
					"Ico":"sap-icon://shield",
					"Descripcion":"Acceso por Roles",
					"Route":"PermisoRoute",
					"Id":1
				},
				{
					"Nombre":"Grupos",
					"Ico":"sap-icon://group-2",
					"Descripcion":"Grupo de Aplicaciones",
					"Route":"GrupoRoute",
					"Id":2
				},
				{
					"Nombre":"Aplicaciones",
					"Ico":"sap-icon://switch-views",
					"Descripcion":"Administración de Aplicaciones",
					"Route":"AplicacionRoute",
					"Id":3
				}

			]; 
			oParam.aListaAplicaciones 		= [];
			oParam.aListaGrupos 			= [];
			oParam.aListaGrupoAplicaciones 	= [];
			oParam.oGrupoSeleccionado 		= {};
			oParam.aListaRoles 				= [];
			oParam.oRolSeleccionado			= {};
			oParam.aListaRolAplicacion		= [];
			oParam.oAplicacionNuevo			= {}; 
			oParam.oAplicacionEditar		= {}; 
			oParam.oAplicacionDetalle		= {};
			oParam.oGrupoNuevo 				= {};
			oParam.oGrupoEditar 			= {};
			oParam.oGrupoVer 				= {};
			oParam.oGrupoAuditoria			= {};
			oParam.aListaPaginas			= {};
			oParam.aListaAplicacionSinAsignar = [];
			oParam.oRolNuevo 				= {};
			oParam.oRolEditar 				= {};
			oParam.oRolVer 					= {};
			oParam.oRolAuditoria			= {};
			oParam.aListaAplicacionesSeleccion = [];
			var oModel            = new JSONModel(oParam);
			return oModel;
		  }

	};
});