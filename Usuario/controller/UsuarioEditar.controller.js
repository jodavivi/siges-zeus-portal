sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../servicio/UsuarioService",
	"../controller/BaseController",
	'../util/UtilPopUps',
	'../util/UtilValidation' 
], function (Controller, UsuarioService, BaseController, UtilPopUps, UtilValidation) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Usuario.controller.UsuarioEditar", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("usuarioEditarRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){ 
			var  iUsuarioId   = evt.getParameter("arguments").id; 
			this.onFnConsultarUsuarioxFiltro(iUsuarioId);
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
		},
        onEditarUsuario:function(){
          try{
            var that = this;
            var sError = UtilValidation.validaFormObligatorio(this,"frmEditarUsuario"); 
            if(!sError){
              UtilPopUps.messageBox("¿Desea actualizar el usuario?", 'c', function(bConfirmacion) {
              if (bConfirmacion) {
				//sap.ui.core.BusyIndicator.show(0); 
				var aParametros = that.getView().getModel("modelAcceso").getProperty("/aListaParametros");
				var aListaRoles = that.getView().getModel("modelAcceso").getProperty("/aListaRoles");
				var oUsuarioEditar = that.getView().getModel("modelAcceso").getProperty("/oUsuarioSeleccionado");
				var oParam 					= {}; 
				oParam.iId					= oUsuarioEditar.Id;
				oParam.sCodTipoUsuario 		= oUsuarioEditar.CodTipoUsuario; 
				var aTipoUsuario = aParametros.filter(function (item) {
					return item.Codigo === oUsuarioEditar.CodTipoUsuario;
				}); 
				oParam.sTipoUsuario 		= aTipoUsuario[0].Campo1;
				oParam.sCodTipoDocumento 	= oUsuarioEditar.CodTipoDocumento;
				var aTipoDocumento= aParametros.filter(function (item) {
					return item.Codigo === oUsuarioEditar.CodTipoDocumento;
				}); 
				oParam.sTipoDocumento 		= aTipoDocumento[0].Campo1;
				oParam.sNumDocumento 		= oUsuarioEditar.NumDocumento;
				oParam.sNombre 				= oUsuarioEditar.Nombre;
				oParam.sApellido 			= oUsuarioEditar.Apellido;
				oParam.sUsuario 			= oUsuarioEditar.Usuario;
				oParam.sEmail 				= oUsuarioEditar.Email; 
				oParam.aRol					= [];
				var aRol= aListaRoles.filter(function (item) {
					return item.Codigo === oUsuarioEditar.UsuarioRol[0].CodRol;
				}); 
				oParam.aRol.push({"sCodRol":aRol[0].Codigo, "sRol":aRol[0].Nombre});
				oParam.iCodEstadoUsuario	= parseInt(oUsuarioEditar.CodEstadoUsuario, 10);   
				if(oParam.iCodEstadoUsuario === 1){
					oParam.sEstadoUsuario = "Activo";
				}else{
					oParam.sEstadoUsuario = "Desactivo";
				}
				oParam.sEstadoUsuario
				UsuarioService.actualizarUsuario(oParam, function(result) {  
					sap.ui.core.BusyIndicator.hide();
					UtilPopUps.validarRespuestaServicio(result,'El Usuario se actualizó correctamente',function(e){});
					 
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