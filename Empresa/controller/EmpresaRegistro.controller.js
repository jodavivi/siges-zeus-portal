sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../controller/BaseController", 
	"../servicio/TablaGenericaService",
	"sap/ui/core/UIComponent",
	'../util/UtilPopUps',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	"../servicio/CampoGenericaService"
], function (Controller, BaseController, TablaGenericaService, UIComponent, UtilPopUps, Filter, FilterOperator, Sorter, CampoGenericaService) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Maestra.controller.ParametroRegistro", {
		onInit: function () {  
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteHomeAddParameter").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(event) { 
			 console.log("REGISTRO PARAMETRO");
		},
		onPressGuardarParametro:function(){ 
			try{
				//sap.ui.core.BusyIndicator.show(0);
	 
				var self        = this;
				var oMaestroSeleccionado = self.getView().getModel("modelTablaGenerica").getProperty("/oTablaSeleccionada");   
				var oParametroNuevo      = self.getView().getModel("modelTablaGenerica").getProperty("/oParametroNuevo");   
				var oParametroPadreNuevo = self.getView().getModel("modelTablaGenerica").getProperty("/oParametroPadreNuevo");  
				UtilPopUps.messageBox("¿Desea registrar el parámetro?", 'c', function(bConfirmacion) {
					if (bConfirmacion) { 
						var oParam = {};
						oParam.iId = oMaestroSeleccionado.Id; 
						oParam.sCodigoTabla = oMaestroSeleccionado.CodigoTabla;
						oParam.sCodigo = oParametroNuevo.sCodigo;
						oParam.sCampo1 = oParametroNuevo.sCampo1;
						oParam.sCampo2 = oParametroNuevo.sCampo2;
						oParam.sCampo3 = oParametroNuevo.sCampo3;
						oParam.sCampo4 = oParametroNuevo.sCampo4;
						oParam.sCampo5 = oParametroNuevo.sCampo5;
						oParam.sCampo6 = oParametroNuevo.sCampo6;
						oParam.sCampo7 = oParametroNuevo.sCampo7;
						oParam.iPadreId = oParametroPadreNuevo.iPadreId;
						oParam.sPadreCod = oParametroPadreNuevo.sPadreCod; 
						oParam.iEstadoCampoId =  parseInt(oParametroNuevo.iIdEstado, 10); 
						CampoGenericaService.registrarParametroTabla(oParam, function(result) { 
							sap.ui.core.BusyIndicator.hide();
							UtilPopUps.validarRespuestaServicio(result,'El Parametro se registró correctamente',function(e){});
							if(result.iCode ===1){ 
								//self.getView().getModel("modelTablaGenerica").setProperty("/oParametroNuevo/sCodigo", result.oResults.Codigo)
								self.getView().getModel("modelTablaGenerica").setProperty("/oParametroNuevo", {});  
								self.fnCargarTabla(self);
							} 
						}, self);
					}else{
						sap.ui.core.BusyIndicator.hide();
					}
				});
			  }catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
			  }
		},
		onPressCancelarParametro:function(){
			try {
				var oMaestroSeleccionado = this.getView().getModel("modelTablaGenerica").getProperty("/oTablaSeleccionada");   
				var oMaestro = {};
				oMaestro.maestroId	    = oMaestroSeleccionado.Id;
				oMaestro.Des 			= oMaestroSeleccionado.DescripcionTabla;
				this.navigation(this, "RouteHomeDetalle",oMaestro); 
			} catch (error) {
				console.log(error);
			}
		}, 
		 handleValueCategoriaSuperior : function (oEvent) {
			var sInputValue	=	oEvent.getSource().getValue(); 
			this.inputId	=	oEvent.getSource().getId(); 
			// create value help dialog
			if (!this._handleValueAplicacion) {
				this._handleValueAplicacion = sap.ui.xmlfragment(
					"com.telcomdataperu.app.Maestra.view.frag.dialog.CategoriaSuperior",
					this
				);
				this.getView().addDependent(this._handleValueAplicacion);
			} 
			this._handleValueAplicacion.open(sInputValue); 
		},
		_handleValueHelpSearchCategoriaSuperior:function(evt){
			var self = this;
			sap.ui.core.BusyIndicator.show(0);
			var sValue		=	evt.getParameter("value"); 
			var oParam = {};
			oParam.sCodigo = sValue;
			CampoGenericaService.consultarParametrosxFiltro(oParam, function(result) { 
				sap.ui.core.BusyIndicator.hide(); 
				if(result.iCode ===1){
					self.getView().getModel("modelTablaGenerica").setProperty("/aTablaBusquedaParametros", result.oResults);   
				}  
			}, self);
			oParam.aTablaBusquedaParametros  = [];

		},
		_handleValueHelpCloseCategoriaSuperior:function(evt){
			var self = this;
			var oSelectedItem	=	evt.getParameter("selectedItem");  
			if (oSelectedItem){
				var descripcion	=	oSelectedItem.getTitle();
				var arr1		=	descripcion.split(" ");  
				var oParamPadreParametro = {};
				oParamPadreParametro.iPadreId  = parseInt(arr1[0], 10);
				oParamPadreParametro.sPadreCod = arr1[2];
				self.getView().getModel("modelTablaGenerica").setProperty("/oParametroPadreNuevo", oParamPadreParametro);  
				self.getView().byId("inputCategoriaSuperior").setSelectedKey(arr1[2]); 
				self.getView().byId("inputCategoriaSuperior").setValue(arr1[2]);
			}  
		},
		onLimpiarPadreParametro:function(evt){
			this.getView().getModel("modelTablaGenerica").setProperty("/oParametroPadreNuevo", {}); 
			this.getView().byId("inputCategoriaSuperior").setSelectedKey(""); 
		    this.getView().byId("inputCategoriaSuperior").setValue(""); 
		} 
 
	});
});