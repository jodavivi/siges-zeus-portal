sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../../servicio/AplicacionService",
	"../../controller/BaseController",
	'../../util/UtilPopUps'
], function (Controller, AplicacionService, BaseController, UtilPopUps) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Acceso.controller.Aplicacion.AplicacionEditar", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("AplicacionEditarRoute").attachMatched(this._onRouteMatched, this);
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
					that.getView().getModel("modelAcceso").setProperty("/oAplicacionEditar", result.oResults[0]); 
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/oAplicacionEditar", {});
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
		},
		onEditarAplicacion:function(){
			try{
					var that        = this;
					UtilPopUps.messageBox("¿Desea editar la aplicación?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
							sap.ui.core.BusyIndicator.show(0); 
							var oAplicacionEditar= that.getView().getModel("modelAcceso").getProperty("/oAplicacionEditar");
							var oParam 					= {}; 
							oParam.iId					= oAplicacionEditar.Id;
							oParam.sNombre 				= oAplicacionEditar.Nombre;
							oParam.sDescripcion 		= oAplicacionEditar.Descripcion;
							oParam.sIco 				= oAplicacionEditar.Ico;
							oParam.sUrl 				= oAplicacionEditar.Url;
							oParam.iCodEstadoAplicacion = oAplicacionEditar.iCodEstadoAplicacion; 
							AplicacionService.actualizarAplicacion(oParam, function(result) {  
							sap.ui.core.BusyIndicator.hide();
							UtilPopUps.validarRespuestaServicio(result,'La Aplicación se actualizó correctamente',function(e){});
							if(result.iCode ===1){  
								//that.getView().getModel("modelAcceso").setProperty("/oAplicacionEditar", {});
							} 
							}, that);
						}else{
							sap.ui.core.BusyIndicator.hide();
						}
					});
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		}
		
	});
});