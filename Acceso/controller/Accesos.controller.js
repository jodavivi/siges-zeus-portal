sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../controller/BaseController"
], function (Controller, BaseController) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Acceso.controller.Accesos", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("AccesoRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){
			console.log("INGRESAAA ACCESOOOO");
		},
		onSelectMaestro:function(oEvt){
			var sPath			=	oEvt.getSource().getSelectedItem().getBindingContext("modelAcceso").sPath;
			var oPage		=	this.getView().getModel("modelAcceso").getProperty(sPath) ;  
			this.navigation(this, oPage.Route,{});
		}
	});
});