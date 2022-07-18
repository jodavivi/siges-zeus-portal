sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/telcomdataperu/app/Maestra/model/models",
	"com/telcomdataperu/app/Maestra/util/UtilUi"
], function (UIComponent, Device, models, UtilUi) {
	"use strict";

	return UIComponent.extend("com.telcomdataperu.app.Maestra.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.modelTablaGenerica(), "modelTablaGenerica");
			var oInfoUsuario = JSON.parse(UtilUi.decodeJwt(JSON.parse(localStorage.login).Token).data).UsuarioEmpresa;
			var oEmpresaSeleccionada = JSON.parse(localStorage.empresa);  
			this.setModel(models.modelPermisosApp(), "modelPermisosApp"); 
			this.getModel("modelPermisosApp").setProperty("/sPermisosApp",oInfoUsuario[oEmpresaSeleccionada.CodEmpresa]["Control"]); 
			
			var s = $(document).height() -48;
			$(".prueba").height(s + 'px'); 
		}
	});
});