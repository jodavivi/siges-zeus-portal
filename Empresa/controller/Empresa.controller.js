sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../controller/BaseController", 
	"../servicio/TablaGenericaService",
	"sap/ui/core/UIComponent",
	'../util/UtilPopUps',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	"../model/models",
	"../servicio/EmpresaService", 
], function (Controller, BaseController, TablaGenericaService, UIComponent, UtilPopUps, Filter, FilterOperator, Sorter, models, EmpresaService) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Empresa.controller.Empresa", { 
		onInit: function () {  
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("empresaRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(event) {  
			this.onCargarEmpresa(this);
		}, 
		onCargarEmpresa: function (oEvent) {
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = self;
				var oParam 		= {}; 
				EmpresaService.consultarEmpresa(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  console.log(result);
				  if(result.iCode ===1){ 
					 
				  }else{
					UtilPopUps.validarRespuestaServicio(result,'',function(e){});
				  }
				}, that);
		 
			}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
			}
		} 
 
	});
});