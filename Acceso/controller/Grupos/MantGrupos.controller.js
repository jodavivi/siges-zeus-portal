sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../../servicio/GrupoService",
	"../../controller/BaseController",
	"../../servicio/AplicacionService",
], function (Controller, GrupoService, BaseController, AplicacionService) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Acceso.controller.Grupos.MantGrupos", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("GrupoRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){
			this.fnCargarGrupos();
		},
		fnCargarGrupos:function(){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				GrupoService.consultarGrupos(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/aListaGrupos", result.oResults);
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aListaGrupos", []);
				  } 
				}, that);
		 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onPressGoAplicacion: function(oEvent) {
            var control = oEvent.getSource(); 
            var sPath = control.getBindingContext("modelAcceso").getPath(); 
			var seleccion = this.getView().getModel("modelAcceso").getProperty(sPath);
			seleccion.NombreGrupo = "de " +seleccion.Nombre;
			this.getView().getModel("modelAcceso").setProperty("/oGrupoSeleccionado", seleccion);
			this.fnCargarAplicacionGrupo(seleccion.Id);
             
		},
		fnCargarAplicacionGrupo:function(grupoId){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iId		= grupoId;
				AplicacionService.consultarGrupoAplicacion(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/aListaGrupoAplicaciones", result.oResults);
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aListaGrupoAplicaciones", []);
				  } 
				}, that);
		 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		action:function(e){
			console.log("EEEE");
		}

	});
});