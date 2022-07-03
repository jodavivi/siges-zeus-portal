sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../../servicio/AplicacionService",
	"../../controller/BaseController",
	'../../util/UtilPopUps',
	'../../util/UtilValidation' 
], function (Controller, AplicacionService, BaseController, UtilPopUps, UtilValidation) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Acceso.controller.Aplicacion.AplicacionRegistro", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("AplicacionRegistroRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){
			var that        = this;
 
		},
		onPressCancelarAppRegistro:function(){
			try { 
				this.navigation(this, "AplicacionRoute",{}); 
			} catch (error) {
				console.log(error);
			}
		},
		onRegistrarAplicacion:function(){
			try{
					if(!this.validaFormObligatorio()){
						var that        = this;
						UtilPopUps.messageBox("¿Desea registrar la aplicación?", 'c', function(bConfirmacion) {
							if (bConfirmacion) {
								sap.ui.core.BusyIndicator.show(0); 
								var oAplicacionNueva = that.getView().getModel("modelAcceso").getProperty("/oAplicacionNuevo");
								var oParam 					= {}; 
								oParam.sTipo 				= oAplicacionNueva.sTipo;
								oParam.sNombre 				= oAplicacionNueva.sNombre;
								oParam.sDescripcion 		= oAplicacionNueva.sDescripcion;
								oParam.sIco 				= oAplicacionNueva.sIco;
								oParam.sUrl 				= oAplicacionNueva.sUrl;
								oParam.sCodigoPadre 		= oAplicacionNueva.sCodigoPadre;
								oParam.iCodEstadoAplicacion = parseInt(oAplicacionNueva.iCodEstadoAplicacion, 10); 
								if(oParam.iCodEstadoAplicacion === 1){
									oParam.sEstadoAplicacion = "Activo";
								}else{
									oParam.sEstadoAplicacion = "DesaActivo";
								}
								
								AplicacionService.crearAplicacion(oParam, function(result) {  
								sap.ui.core.BusyIndicator.hide();
								UtilPopUps.validarRespuestaServicio(result,'La Aplicación se registró correctamente',function(e){});
								if(result.iCode ===1){  
									that.getView().getModel("modelAcceso").setProperty("/oAplicacionNuevo", {});
								} 
								}, that);
							}else{
								sap.ui.core.BusyIndicator.hide();
							}
						}); 
					}else{
						sap.m.MessageToast.show("(*) Ingresar los campos obligatorios"); 
					}; 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		validaFormObligatorio: function()
        { 
            var sError = UtilValidation.validaFormObligatorio(this,"frmRegistroApp"); 
			return sError;

        }
	});
});