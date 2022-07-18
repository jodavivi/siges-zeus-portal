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
		  },
		  modelPermisosApp:function(){
			var oParam           = {};
			oParam.sPermisosApp  = {}; 
			oParam.sBtnAplicacionRegistrar 	 = 'C0000015';
			oParam.sBtnAplicacionActualizar 	 = 'C0000016';
			oParam.sBtnAplicacionEliminar 	 = 'C0000017';
			oParam.sBtnGrupoRegistrar	 		 = 'C0000018'; 
			oParam.sBtnGrupoActualizar	 	 = 'C0000019'; 
			oParam.sBtnGrupoEiminar	 		 = 'C0000020'; 
			oParam.sBtnAsignarAplicacion 	 	 = 'C0000021'; 
			oParam.sBtnEliminarAplicacion 	 = 'C0000022';  
			oParam.sBtnRolRegistrar 	 = 'C0000023';
			oParam.sBtnRolActualizar 	 = 'C0000024';
			oParam.sBtnRolEliminar 	 	= 'C0000025';
			oParam.sBtnAsignarControl 	 = 'C0000026';
			oParam.sBtnAsinarEliminar 	 = 'C0000027';

			var oModel           = new JSONModel(oParam);
			  var oModel           = new JSONModel(oParam);
			  return oModel;
			}

	};
});