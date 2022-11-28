sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/telcomdataperu/app/DocumentoVenta/model/models",
	"com/telcomdataperu/app/DocumentoVenta/util/UtilUi"
], function (UIComponent, Device, models, UtilUi) {
	"use strict";

	return UIComponent.extend("com.telcomdataperu.app.DocumentoVenta.Component", {

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
			sap.ui.getCore().getConfiguration().setFormatLocale("es");
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.modelDocumentoVenta(), "modelDocumentoVenta");
			var s = $(document).height() -48;
			$(".prueba").height(s + 'px'); 
		}
	});
});