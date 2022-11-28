sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"../model/models",
	"sap/m/Dialog",
	"sap/m/Button",
	'sap/m/Text',
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	'sap/ui/model/Sorter', 
	"../util/UtilValidation",
	"../util/UtilPopUps",
	"../util/UtilHttp", 
	"sap/ui/core/Fragment", 
	"../servicio/VentaService",
], function (Controller, BaseController, Filter, FilterOperator, 
	JSONModel, Models, Dialog, Button, Text, MessageBox, MessageToast,Sorter, 
	UtilValidation, UtilPopUps, UtilHttp, Fragment, VentaService ) {
	"use strict";
	return BaseController.extend("com.telcomdataperu.app.DocumentoVenta.controller.DocumentoVentaDetail", {
		onInit: function () { 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);  
            oRouter.getRoute("documentoventaRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(event) { 
		 this.onFnBuscarDocVenta();
		},
		onAfterRendering: function(){ 
			 
		},
		onFnBuscarDocVenta: function(oParamFiltro){
			try{  
				var that        = this; 
				var oParam 		= {};  
				if(oParamFiltro){

				}else{

				} 
				sap.ui.core.BusyIndicator.show(0);
				VentaService.consultarDocumentoVenta(oParam, function(result) {    
				  if(result.iCode ===1){   
					that.getView().getModel("modelDocumentoVenta").setProperty("/aListaDocVenta", result.oResults); 
				  }else{    
					sap.m.MessageToast.show("Venta no encontada!!"); 
				  }  
				  sap.ui.core.BusyIndicator.hide();
				}, that);
			 
				}catch(e){ 
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		}
	});
});
