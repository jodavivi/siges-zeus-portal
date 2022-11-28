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

	return BaseController.extend("com.telcomdataperu.app.Maestra.controller.ParametroEditar", {
		onInit: function () {  
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteHomeEditParameter").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(event) {  
			 var  parametroId   = event.getParameter("arguments").parametroId;  

			 this.fnConsultarParametros(parametroId);
		},
		fnConsultarParametros:function(parametroId){
			try{
				var that        = this;
				var oParam 		= {}; 
				oParam.iId		= parseInt(parametroId,10);
				CampoGenericaService.consultarParametrosxFiltro(oParam, function(result) { 
					sap.ui.core.BusyIndicator.hide();
					if(result.iCode ===1){ 
						 var oParamSeleccionado = result.oResults[0]; 
						that.getView().getModel("modelTablaGenerica").setProperty("/oParametroSeleccionado", oParamSeleccionado);  
						var oParamPadreParametro = {};
						oParamPadreParametro.iPadreId  = oParamSeleccionado.PadreId;
						oParamPadreParametro.sPadreCod = oParamSeleccionado.PadreCod;
						that.getView().getModel("modelTablaGenerica").setProperty("/oParametroPadreActual", oParamPadreParametro);   
						that.getView().byId("inputCategoriaSuperiorEdit").setSelectedKey(oParamSeleccionado.PadreId); 
						that.getView().byId("inputCategoriaSuperiorEdit").setValue(oParamSeleccionado.PadreCod); 

					}else{
						UtilPopUps.validarRespuestaServicio(result,'',function(e){});
					}
				}, that);
 
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
			 var self = this;
			var sInputValue	=	oEvent.getSource().getValue(); 
			this.inputId	=	oEvent.getSource().getId(); 
			// create value help dialog
			if (!this._handleValueAplicacion) {
				this._handleValueAplicacion = sap.ui.xmlfragment(
					"com.telcomdataperu.app.Maestra.view.frag.dialog.CategoriaSuperiorEdit",
					this
				);
				this.getView().addDependent(this._handleValueAplicacion);
			} 

			if(sInputValue.length > 0){
				var oParam = {};
				oParam.sCodigo = sInputValue;
				CampoGenericaService.consultarParametrosxFiltro(oParam, function(result) { 
				sap.ui.core.BusyIndicator.hide(); 
					if(result.iCode ===1){
						self.getView().getModel("modelTablaGenerica").setProperty("/aTablaBusquedaParametros", result.oResults);   
					}  
				}, self);

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
				}else{
					self.getView().getModel("modelTablaGenerica").setProperty("/aTablaBusquedaParametros", []);   
				}  
			}, self);
		 

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
				self.getView().getModel("modelTablaGenerica").setProperty("/oParametroPadreActual", oParamPadreParametro);  
				self.getView().byId("inputCategoriaSuperiorEdit").setSelectedKey(arr1[2]); 
				self.getView().byId("inputCategoriaSuperiorEdit").setValue(arr1[2]);
			}  
		},
		onLimpiarPadreParametro:function(evt){
			this.getView().getModel("modelTablaGenerica").setProperty("/oParametroPadreActual", {}); 
			this.getView().byId("inputCategoriaSuperiorEdit").setSelectedKey(""); 
		    this.getView().byId("inputCategoriaSuperiorEdit").setValue(""); 
		} ,
		onPressActualizarParametro:function(){
			try{
				//sap.ui.core.BusyIndicator.show(0);
	 
				var self        = this; 
				var oParametroSeleccionado = self.getView().getModel("modelTablaGenerica").getProperty("/oParametroSeleccionado");    
				var oParametroPadreActual = self.getView().getModel("modelTablaGenerica").getProperty("/oParametroPadreActual"); 

				UtilPopUps.messageBox("¿Desea actualizar el parámetro?", 'c', function(bConfirmacion) {
					if (bConfirmacion) { 
						var oParam = {};
						oParam.iId 	   = oParametroSeleccionado.Id;   
						oParam.sCampo1 = oParametroSeleccionado.Campo1;
						oParam.sCampo2 = oParametroSeleccionado.Campo2;
						oParam.sCampo3 = oParametroSeleccionado.Campo3;
						oParam.sCampo4 = oParametroSeleccionado.Campo4;
						oParam.sCampo5 = oParametroSeleccionado.Campo5;
						oParam.sCampo6 = oParametroSeleccionado.Campo6;
						oParam.sCampo7 = oParametroSeleccionado.Campo7;
						oParam.iPadreId  = (oParametroPadreActual.iPadreId) ? oParametroPadreActual.iPadreId : null;
						oParam.sPadreCod = (oParametroPadreActual.sPadreCod) ? oParametroPadreActual.sPadreCod : null; 
						oParam.iEstadoCampoId =  parseInt(oParametroSeleccionado.EstadoCampoId,10); 
						CampoGenericaService.actualizarParametroTabla(oParam, function(result) { 
							sap.ui.core.BusyIndicator.hide();
							UtilPopUps.validarRespuestaServicio(result,'El Parametro se actualizo correctamente',function(e){});
							if(result.iCode ===1){
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
		}

	});
});