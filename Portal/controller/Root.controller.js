sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/telcomdataperu/app/Portal/constante/Constantes",
	"com/telcomdataperu/app/Portal/util/InterfaceUtil"
], function (Controller, Constantes, InterfaceUtil) {
	"use strict";

	return Controller.extend("com.telcomdataperu.app.Portal.controller.Root", {
		onInit: function () {
			sap.ui.core.BusyIndicator.hide();
		},
		onPressProfile:function(oEvent){ 
			var oUsaurioToken =  InterfaceUtil.utilUi.decodeJwt(localStorage.login) ; 
			var oInfoUsuario = JSON.parse(oUsaurioToken.data); 
			console.log(oInfoUsuario);

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
		}
	});
});