sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/telcomdataperu/app/Producto/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.telcomdataperu.app.Producto.Component", {

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
			this.setModel(models.modelAcceso(), "modelAcceso");
			var s = $(document).height() -48;
			$(".prueba").height(s + 'px'); 
		}
	});
});