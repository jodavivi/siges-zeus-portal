sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../servicio/ProductoService",
	"../controller/BaseController",
	'../util/UtilPopUps',
	'../util/UtilValidation',
	"../servicio/ProductoImagenService",  
], function (Controller, ProductoService, BaseController, UtilPopUps, UtilValidation, ProductoImagenService) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Producto.controller.ProductoDetalle", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("ProductoDetalleRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){ 
			var  iProductoId   = evt.getParameter("arguments").id;  
			this.onFnConsultarProductoxFiltro(iProductoId);
			this.onFnConsultarImagenProducto(iProductoId);

		},
        onFnConsultarProductoxFiltro:function(iProductoId){
          try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iId		= iProductoId;
				ProductoService.consultarProducto(oParam, function(result) {   
				if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/oProductoSeleccionado", result.oResults[0]);
					 
				}else{
					that.getView().getModel("modelAcceso").setProperty("/oProductoSeleccionado", []);
				} 
				sap.ui.core.BusyIndicator.hide();
				}, that);
         
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
		onPressCancelarDetalle:function(){
			try { 
				this.navigation(this, "productoRoute",{}); 
			} catch (error) {
				console.log(error);
			}
		},
		onFnConsultarImagenProducto:function(iProductoId){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iProductoId = iProductoId;
				ProductoImagenService.consultarProductoImagen(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){  
					that.getView().getModel("modelAcceso").setProperty("/aProductoImagen", result.oResults); 
					that.getView().getModel("modelAcceso").setProperty("/iNumImagenItems", result.oResults.length); 
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aProductoImagen", []); 
				  } 
				}, that);
			 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		}  
	});
});