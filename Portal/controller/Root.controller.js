sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/telcomdataperu/app/Portal/constante/Constantes",
	"com/telcomdataperu/app/Portal/util/InterfaceUtil",
	"sap/ui/model/Filter",
	"../servicio/UsuarioService",
	'../util/base/UtilPopUps',
	'../util/base/UtilValidation',
	"com/telcomdataperu/app/Portal/util/base/UtilUi" 
], function (Controller, Constantes, InterfaceUtil, Filter, UsuarioService, UtilPopUps, UtilValidation, UtilUi) {
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
			
			this.onValidarSeleccionEmpresa();
			
			/*var aListaAplicaciones = [];
			var aLista = this.getView().getModel("usuarioLogeadoModel").getData();
			aLista.Accesos.forEach(function(e){
				e.Aplicaciones.forEach(function(x){
					aListaAplicaciones.push(x);
				});
			}); 
			this.getView().getModel("usuarioLogeadoModel").setProperty("/aplicaciones", aListaAplicaciones);
			*/
		},
		onValidarSeleccionEmpresa:function(){
			if(localStorage.empresa !== undefined){
				this.getView().getModel("usuarioLogeadoModel").setProperty("/empresaseleccionada",JSON.parse(localStorage.empresa));
				this.onCargarAplicaciones(JSON.parse(localStorage.empresa));
				return;
			}

			var aEmpresa = [];
			var oInfoUsuario = JSON.parse(UtilUi.decodeJwt(JSON.parse(localStorage.login).Token).data);
			oInfoUsuario.UsuarioEmpresa.forEach(function(e){ 
				 if(e.CodTipo == 100){
					aEmpresa.push(e);
				 };
				} 
			 ); 
			
			 if(aEmpresa.length > 1){  
					this.getView().getModel("usuarioLogeadoModel").setProperty("/empresa", aEmpresa); 
					this.onLoadSelecionarEmpresa(); 
			 }else{
				this.getView().getModel("usuarioLogeadoModel").setProperty("/empresaseleccionada", aEmpresa[0]);
				localStorage.setItem("empresa", JSON.stringify(aEmpresa[0]));
				this.onCargarAplicaciones();
			 }  

		}, 
		onLoadSelecionarEmpresa: function(){
			var oDialog 	=	this.getView().byId("DlgSeleccionarEmpresa"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Portal.view.frag.DlgSeleccionarEmpresa", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPresSeleccionarEmpresa:function(oEvent){  
			this.onCargarAplicaciones();
			this.getView().byId("DlgSeleccionarEmpresa").destroy(); 
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
				  //if(result.iCode === 1){
					//that.onValidarSeleccionEmpresa();
				 // }
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
			this.onCargarAplicaciones(); 
		} ,
		onCargarAplicaciones:function(oEmpresa){ 
			if(oEmpresa === undefined){
				var sCodEmpresaSeleccionada = this.getView().getModel("usuarioLogeadoModel").getProperty("/empresa/CodEmpresa");
			 
				var aEmpresa = this.getView().getModel("usuarioLogeadoModel").getProperty("/empresa");
				for (let index = 0; index < aEmpresa.length; index++) {
					const element = aEmpresa[index];
					if(element.CodEmpresa === sCodEmpresaSeleccionada){
						//this.getView().getModel("usuarioLogeadoModel").setProperty("/empresaseleccionada", element);
						oEmpresa = element;
						localStorage.setItem("empresa", JSON.stringify(element));
						break;
					} 
				} 
			}
			//this.getView().getModel("usuarioLogeadoModel").setProperty("/empresa", 'element');
			var oInfoUsuario = JSON.parse(UtilUi.decodeJwt(JSON.parse(localStorage.login).Token).data);
			oInfoUsuario.Accesos =   JSON.parse(localStorage.login).Accesos;
			oInfoUsuario.sUsuarioIniciales = oInfoUsuario.Nombre.substring(0,1) + oInfoUsuario.Apellido.substring(0,1);
			oInfoUsuario.oEmpresa = oEmpresa;
			this.getView().getModel("usuarioLogeadoModel").setProperty("/", oInfoUsuario);
			this.onValidarEstadoClave();
		}
	});
});