sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../servicio/CategoriaService",
	"../controller/BaseController",
	'../util/UtilPopUps',
	'../util/UtilValidation' 
], function (Controller, CategoriaService, BaseController, UtilPopUps, UtilValidation) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.ProductoCategoria.controller.CategoriaDetalle", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("categoriaDetalleRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){ 
			var  iCategoriaId   = evt.getParameter("arguments").id; 
			this.iCategoriaId   = iCategoriaId;
			this.onFnConsultarCategoriaxFiltro(iCategoriaId); 

		},
        onFnConsultarCategoriaxFiltro:function(iCategoriaId){
          try{
			sap.ui.core.BusyIndicator.show(0);
			var that        = this;
			var oParam 		= {}; 
			oParam.iId		= iCategoriaId;
			oParam.bBuscarPadre = true;
			CategoriaService.consultarCategoria(oParam, function(result) {   
				if(result.iCode ===1){ 
					if(result.oResults.length > 1){
						that.getView().getModel("modelAcceso").setProperty("/oCategoriaPadre", result.oResults[1]);	
						that.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", result.oResults[0]);
					}else{
						that.getView().getModel("modelAcceso").setProperty("/oCategoriaPadre", {});	
						that.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", result.oResults[0]);
					} 
				}else{
					that.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", []);
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
				this.navigation(this, "categoriaRoute",{}); 
			} catch (error) {
				console.log(error);
			}
		} 
	});
});