sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/telcomdataperu/app/Portal/model/models",
	"com/telcomdataperu/app/Portal/constante/Constantes",
	"com/telcomdataperu/app/Portal/util/base/UtilUi"
], function (UIComponent, Device, models, Constantes, UtilUi) {
	"use strict";

	return UIComponent.extend("com.telcomdataperu.app.Portal.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			console.log(window.location.href);
			//sap.ui.core.BusyIndicator.show(0)
			if(localStorage.login === undefined){
				window.location.href = Constantes.urlWebLogin;
			}
			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.usuarioLogeadoModel(), "usuarioLogeadoModel");
			//console.log(JSON.parse(UtilUi.decodeJwt(localStorage.login).data));
			var oInfoUsuario = JSON.parse(UtilUi.decodeJwt(JSON.parse(localStorage.login).Token).data);
			oInfoUsuario.Accesos =   JSON.parse(localStorage.login).Accesos;
			oInfoUsuario.sUsuarioIniciales = oInfoUsuario.Nombre.substring(0,1) + oInfoUsuario.Apellido.substring(0,1);
 
			this.getModel("usuarioLogeadoModel").setProperty("/", oInfoUsuario);
		 
			//console.log(this.getModel("usuarioLogeadoModel").getProperty("/grupos"));
		}
	});
});