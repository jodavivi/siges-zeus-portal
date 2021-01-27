sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"../../controller/BaseController",
	"../../servicio/Permisos"
], function (Controller, BaseController, Permisos) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Acceso.controller.Permisos.MantPermisos", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("PermisoRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(){
			this.fnCargarRoles();
		},
		fnCargarRoles:function(){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				Permisos.consultarRoles(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/aListaRoles", result.oResults);
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aListaRoles", []);
				  } 
				}, that);
		 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onPressGoRolAplicacion: function(oEvent) {
            var control = oEvent.getSource(); 
            var sPath = control.getBindingContext("modelAcceso").getPath(); 
			var seleccion = this.getView().getModel("modelAcceso").getProperty(sPath);
			seleccion.NombreRol = "de " +seleccion.Nombre;
			this.getView().getModel("modelAcceso").setProperty("/oRolSeleccionado", seleccion);
			this.fnCargarAplicacionRol(seleccion.Codigo);
             
		},
		fnCargarAplicacionRol:function(sCodRol){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.sCodRol	= sCodRol;
				Permisos.consultarRolAplicacion(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/aListaRolAplicacion", result.oResults);
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aListaRolAplicacion", []);
				  } 
				}, that);
		 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		}
	});
});