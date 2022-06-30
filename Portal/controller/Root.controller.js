sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/telcomdataperu/app/Portal/constante/Constantes",
	"com/telcomdataperu/app/Portal/util/InterfaceUtil",
	"sap/ui/model/Filter",
	"../servicio/UsuarioService",
	'../util/base/UtilPopUps',
	'../util/base/UtilValidation' 
], function (Controller, Constantes, InterfaceUtil, Filter, UsuarioService, UtilPopUps, UtilValidation) {
	"use strict";

	return Controller.extend("com.telcomdataperu.app.Portal.controller.Root", {
		onInit: function () {
			sap.ui.core.BusyIndicator.hide();
			this.oSF = this.getView().byId("searchField"); 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("appMaestra").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(){
			 
		},
		onAfterRendering:function(){
			this.onValidarEstadoClave();
			var aListaAplicaciones = [];
			var aLista = this.getView().getModel("usuarioLogeadoModel").getData();
			aLista.Accesos.forEach(function(e){
				e.Aplicaciones.forEach(function(x){
					aListaAplicaciones.push(x);
				});
			}); 
			this.getView().getModel("usuarioLogeadoModel").setProperty("/aplicaciones", aListaAplicaciones);
		},
		onPressProfile:function(oEvent){ 
			var oUsaurioToken =  InterfaceUtil.utilUi.decodeJwt(localStorage.login) ; 
			var oInfoUsuario = JSON.parse(oUsaurioToken.data);  
			try { 

				  this.getView().getModel("usuarioLogeadoModel").setProperty("/info", oInfoUsuario);
				  if (!this._oPopoverProfile) {
					this._oPopoverProfile = sap.ui.xmlfragment("com.telcomdataperu.app.Portal.view.frag.Profile", this);
					this.getView().addDependent(this._oPopoverProfile);
				  }
				  this._oPopoverProfile.openBy(oEvent.getSource());
 
			  } catch (e) {
				console.error("Error: " + e);
			  }
		},
		onCerrarSession:function(){
			var that = this;
			localStorage.clear();
            if (that._oPopoverProfile) {
               that._oPopoverProfile.destroy();
            }
            if (that._oPopoverMessage) {
               that._oPopoverMessage.destroy();
            }
            window.location.href = Constantes.urlWebLogin;
		},
		onPressHome:function(){
			 
			this.getOwnerComponent().getRouter().navTo("appInicio");
		},
		onPressBuscarApp:function(e){ 
		},
		handlerSearchFieldSearch: function (oEvent) { 
		 var appNombreSeleccionado =	  oEvent.getSource()._getSearchField().getValue() ;
		 var oAppSeleccionado = {};
		 var aListaApps = this.getView().getModel("usuarioLogeadoModel").getProperty("/aplicaciones");

		 for (let index = 0; index < aListaApps.length; index++) {
			 const element = aListaApps[index];
			 if(appNombreSeleccionado === element.Nombre){
				oAppSeleccionado = element;
				break;
			 }
		 } 
		 this.getOwnerComponent().getRouter().navTo(oAppSeleccionado.Url); 
		},
		handlerSearchFieldLiveEvent: function (oEvent) {
			console.log(oEvent.getSource().getId() + " liveChange event value is: " + oEvent.getParameter("newValue"));
		},
		handlerSearchSuggestEvent: function (oEvent) {
			var sValue = oEvent.getParameter("suggestValue"),
				aFilters = [];

			if (sValue) {
				aFilters = [
					new Filter([ 
						new Filter("Nombre", function (sDes) {
							return (sDes || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
						})
					])
				];
			}

			this.oSF.getBinding("suggestionItems").filter(aFilters);
			this.oSF.suggest();
		},
		onValidarEstadoClave:function(){

			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {};  
				UsuarioService.validarEstadoClave(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===2){
					 that.onPressCambiarClave();
				  } 
				}, that);
			 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		}, 
		onPressCambiarClave: function(){
			var oDialog 	=	this.getView().byId("DlgCambiarClave"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Portal.view.frag.DlgCambiarClave", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressActualizarClave:function(){
			try{
				var that = this;
				var sError = UtilValidation.validaFormObligatorio(this,"frmCambiarClave"); 
				if(!sError){
					var txtClave1 = that.getView().byId("txtClave1").getValue();
					var txtClave2 = that.getView().byId("txtClave2").getValue();
					if(txtClave1 !== txtClave2){
						sap.m.MessageToast.show("(*) La claves no son iguales"); 
						return;
					}
				  	UtilPopUps.messageBox("¿Desea actualizar la clave?", 'c', function(bConfirmacion) {
					if (bConfirmacion) {
						sap.ui.core.BusyIndicator.show(0); 
							var oParam 		= {}; 
							oParam.sClave			= that.getView().byId("txtClave1").getValue(); 
							UsuarioService.cambiarClave(oParam, function(result) {   
								sap.ui.core.BusyIndicator.hide();
								UtilPopUps.validarRespuestaServicio(result,'La Clave se actualizó correctamente',function(e){});
								if(result.iCode ===1){   
									that.onPressCloseCambiarClave(); 
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
		},
		onPressCloseCambiarClave:function(){
			this.getView().byId("DlgCambiarClave").destroy();  
		}	
	});
});