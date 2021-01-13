sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/telcomdataperu/app/Portal/constante/Constantes",
	"com/telcomdataperu/app/Portal/util/InterfaceUtil",
	"sap/ui/model/Filter"
], function (Controller, Constantes, InterfaceUtil, Filter) {
	"use strict";

	return Controller.extend("com.telcomdataperu.app.Portal.controller.Root", {
		onInit: function () {
			sap.ui.core.BusyIndicator.hide();
			this.oSF = this.getView().byId("searchField"); 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("appMaestra").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(){
			console.log("LLAMMMAA");
		},
		onAfterRendering:function(){
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
			console.log("LLAMAAA");	
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
		}	
	});
});