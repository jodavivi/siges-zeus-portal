sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../servicio/UsuarioService",
	"../controller/BaseController",
	'../util/UtilPopUps',
	'../util/UtilValidation' 
], function (Controller, UsuarioService, BaseController, UtilPopUps, UtilValidation) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Usuario.controller.UsuarioDetalle", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("usuarioDetalleRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){ 
			var  iUsuarioId   = evt.getParameter("arguments").id; 
			this.iUsuarioId   = iUsuarioId;
			this.onFnConsultarUsuarioxFiltro(iUsuarioId);
			this.onFnConsultarEstadoClave(iUsuarioId);

		},
        onFnConsultarUsuarioxFiltro:function(iUsuarioId){
          try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iId		= iUsuarioId;
				UsuarioService.consultarUsuario(oParam, function(result) {   
				if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/oUsuarioSeleccionado", result.oResults[0]);
				}else{
					that.getView().getModel("modelAcceso").setProperty("/oUsuarioSeleccionado", []);
				} 
				sap.ui.core.BusyIndicator.hide();
				}, that);
         
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
		onPressCancelarEdicion:function(){
			try { 
				this.navigation(this, "usuarioRoute",{}); 
			} catch (error) {
				console.log(error);
			}
		} ,
        onFnConsultarEstadoClave:function(iUsuarioId){
          try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iIdUsuario = iUsuarioId;
				UsuarioService.consultarEstadoClave(oParam, function(result) {   
					if(result.iCode ===1){ 
						that.getView().getModel("modelAcceso").setProperty("/oEstadoClave", result.oResults);
					}else{
						that.getView().getModel("modelAcceso").setProperty("/oEstadoClave", []);
					} 
					sap.ui.core.BusyIndicator.hide();
				}, that);
         
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
        onFnResetearClave:function(){
          try{
			var that          = this;
			UtilPopUps.messageBox("¿Desea resetear la clave del usuario?", 'c', function(bConfirmacion) {
				if (bConfirmacion) {
					sap.ui.core.BusyIndicator.show(0); 
					var oUsuarioSeleccionado = that.getView().getModel("modelAcceso").getProperty("/oUsuarioSeleccionado");
					var oParam 		  = {}; 
					oParam.iIdUsuario = oUsuarioSeleccionado.Id;
					oParam.sClave	  = oUsuarioSeleccionado.NumDocumento;
					UsuarioService.resetearClave(oParam, function(result) {   
						//if(result.iCode ===1){ 
							UtilPopUps.validarRespuestaServicio(result,'Se reinició la clave correctamente',function(e){}); 
						//} 
						sap.ui.core.BusyIndicator.hide();
					}, that);
				}
			});
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        }
	});
});