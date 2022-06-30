sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../../servicio/AplicacionService",
	"../../controller/BaseController",
	'../../util/UtilPopUps'
], function (Controller, AplicacionService, BaseController, UtilPopUps) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Acceso.controller.Aplicacion.AplicacionDetalle", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("AplicacionDetalleRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){
			var  aplicacionId   = evt.getParameter("arguments").id; 
			this.fnConsultarAplicacion(parseInt(aplicacionId,10));
		}, 
		fnConsultarAplicacion:function(aplicacionId){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iId		= aplicacionId;
				AplicacionService.consultarAplicacion(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/oAplicacionDetalle", result.oResults[0]); 
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/oAplicacionDetalle", {});
				  } 
				}, that);
		 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onPressCancelarEdicion:function(){
			try { 
				this.navigation(this, "AplicacionRoute",{}); 
			} catch (error) {
				console.log(error);
			}
		} 
		
	});
});