sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../servicio/UsuarioService",
	"../controller/BaseController",
	'../util/UtilPopUps',
	'../util/UtilValidation' 
], function (Controller, UsuarioService, BaseController, UtilPopUps, UtilValidation) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Usuario.controller.UsuarioRegistro", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("usuarioRegistroRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){
			var that        = this; 
		 
		} ,
		onPressCancelarRegistro:function(){
			try { 
				this.navigation(this, "usuarioRoute",{}); 
			} catch (error) {
				console.log(error);
			}
		},
        onRegistrarUsuario:function(){
          try{
            var that = this;
            var sError = UtilValidation.validaFormObligatorio(this,"frmRegistroUsuario"); 
            if(!sError){
              UtilPopUps.messageBox("¿Desea crear el usuario?", 'c', function(bConfirmacion) {
              if (bConfirmacion) {
				sap.ui.core.BusyIndicator.show(0); 
				var aParametros = that.getView().getModel("modelAcceso").getProperty("/aListaParametros");
				var aListaRoles = that.getView().getModel("modelAcceso").getProperty("/aListaRoles");
				var oUsuarioNuevo = that.getView().getModel("modelAcceso").getProperty("/oUsuarioNuevo");
				var oParam 					= {}; 
				oParam.sCodTipoUsuario 		= oUsuarioNuevo.sCodTipoUsuario; 
				var aTipoUsuario = aParametros.filter(function (item) {
					return item.Codigo === oUsuarioNuevo.sCodTipoUsuario;
				}); 
				oParam.sTipoUsuario 		= aTipoUsuario[0].Campo1;
				oParam.sCodTipoDocumento 	= oUsuarioNuevo.sCodTipoDocumento;
				var aTipoDocumento= aParametros.filter(function (item) {
					return item.Codigo === oUsuarioNuevo.sCodTipoDocumento;
				}); 
				oParam.sTipoDocumento 		= aTipoDocumento[0].Campo1;
				oParam.sNumDocumento 		= oUsuarioNuevo.sNumDocumento;
				oParam.sNombre 				= oUsuarioNuevo.sNombre;
				oParam.sApellido 			= oUsuarioNuevo.sApellido;
				oParam.sUsuario 			= oUsuarioNuevo.sUsuario;
				oParam.sEmail 				= oUsuarioNuevo.sEmail; 
				oParam.aRol					= [];
				var aRol= aListaRoles.filter(function (item) {
					return item.Codigo === oUsuarioNuevo.sCodRol;
				}); 
				oParam.aRol.push({"sCodRol":oUsuarioNuevo.sCodRol, "sRol":aRol[0].Nombre});
				oParam.iCodEstadoUsuario	= parseInt(oUsuarioNuevo.iCodEstado, 10);   
				UsuarioService.registrarUsuario(oParam, function(result) {  
				sap.ui.core.BusyIndicator.hide();
				UtilPopUps.validarRespuestaServicio(result,'El Usuario se registró correctamente',function(e){});
				if(result.iCode ===1){  
					that.getView().getModel("modelAcceso").setProperty("/oUsuarioNuevo", {});
				} 
				}, that); 
              }
            });
            }else{
              sap.m.MessageToast.show("(*) Ingresar los campos obligatorios"); 
            };
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        }   
	});
});