sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "../controller/BaseController"
], function(Controller, BaseController) {
	"use strict";
	return BaseController.extend("com.telcomdataperu.app.Auditoria.controller.DetalleAuditoria", {
			onInit: function (oEvent) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getRoute("auditoriaDetalleRoute").attachMatched(this._onRouteMatched, this); 
			},
			_onRouteMatched : function (oEvent) {
				var oArgs, oView;
				oArgs = oEvent.getParameter("arguments");
				oView = this.getView(); 
				this.detalleAuditoria(oArgs.auditoriaId);
		}, 
        detalleAuditoria : function(oParametro){  
		}
	});
});
