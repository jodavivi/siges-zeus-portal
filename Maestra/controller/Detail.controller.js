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
	"../servicio/CampoGenericaService",
	"../util/utilValidation",
	"../util/utilPopUps",
	"../util/UtilHttp",
	"../servicio/TablaGenericaService" 
], function (Controller, BaseController, Filter, FilterOperator, JSONModel, Models, Dialog, Button, Text, MessageBox, MessageToast,Sorter, CampoGenericaService, UtilValidation, UtilPopUps, UtilHttp, TablaGenericaService ) {
	"use strict";
	return BaseController.extend("com.telcomdataperu.app.Maestra.controller.Detail", {
		onInit: function () { 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteHomeDetalle").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(event) {
			sap.ui.core.BusyIndicator.show(0);
			var  maestroId   = event.getParameter("arguments").maestroId;
			this.getView().byId("iconTabDetalle").setSelectedKey("2");
			this.getView().getModel("modelTablaGenerica").setProperty("/oControles/btnGuardarTabla",false);
			this.conultarTablaParametros(maestroId);
		},
		conultarTablaParametros:function(maestroId){
			try{
				var that        = this;
				var oParam 		= {}; 
				oParam.iId		= parseInt(maestroId,10);
				CampoGenericaService.consultarParametrosTabla(oParam, function(result) { 
					sap.ui.core.BusyIndicator.hide();
					if(result.iCode ===1){
						var oTabla = result.oResults.oMaestra; 
						that.getView().getModel("modelTablaGenerica").setProperty("/oTablaSeleccionada",oTabla);
						var fnPress = that.onEditarParametro.bind(that);
					}else{
						UtilPopUps.validarRespuestaServicio(result,'',function(e){});
					}
				}, that);
 
			  }catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
			  }
		},
		onPressEditarDetalle:function(){ 
			try{
				var self        = this;
				sap.ui.core.BusyIndicator.show(0);
				UtilPopUps.messageBox("¿Desea actualizar información de la maestra?", 'c', function(bConfirmacion) {
					if (bConfirmacion) {
						var oMaestroSeleccionado = self.getView().getModel("modelTablaGenerica").getProperty("/oTablaSeleccionada");   
						var oMaestro = {};
						oMaestro.iId			   = oMaestroSeleccionado.Id;
						oMaestro.sDescripcionTabla = oMaestroSeleccionado.DescripcionTabla;
						TablaGenericaService.actualizarTablaGenerica(oMaestro, function(result) { 
							sap.ui.core.BusyIndicator.hide();
							UtilPopUps.validarRespuestaServicio(result,'Maestro se actualizado correctamente',function(e){});
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
		},
		onRegistrarParametro:function(){
			try {
				this.getView().getModel("modelTablaGenerica").setProperty("/oParametroNuevo", {});   
				var oMaestroSeleccionado = this.getView().getModel("modelTablaGenerica").getProperty("/oTablaSeleccionada");   
				var oMaestro = {};
				oMaestro.maestroId	    = oMaestroSeleccionado.Id;
				oMaestro.Des 			= oMaestroSeleccionado.DescripcionTabla;
				this.navigation(this, "RouteHomeAddParameter",oMaestro); 
			} catch (error) {
				console.log(error);
			}
		},
		onEliminarParametro:function(evt){
			try {
				var self = this;
				sap.ui.core.BusyIndicator.show(0);
				var indexes = self.getView().byId("tblParametros").getSelectedIndices();
				if(indexes.length > 0){
					var aListaParametrosEliminar = [];
					indexes.forEach(function(i) {
						var oParametros = self.getView().byId("tblParametros").getContextByIndex(i).getObject();  
						aListaParametrosEliminar.push({"iId" : oParametros.Id});
					});
					var oParamEliminar = {};
					oParamEliminar.aItems = aListaParametrosEliminar;
					UtilPopUps.messageBox("¿Desea eliminar los parámetros seleccionados?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
							CampoGenericaService.eliminarParametroTabla(oParamEliminar, function(result) { 
								sap.ui.core.BusyIndicator.hide();
								UtilPopUps.validarRespuestaServicio(result,'Parámetros eliminados correctamente',function(e){});
								if(result.iCode ===1){
									//Recargamos las maestras
									self.fnCargarTabla(self);
									//Recargamos los parametros de la maestra seleccionada
									var oMaestroSeleccionado = self.getView().getModel("modelTablaGenerica").getProperty("/oTablaSeleccionada"); 
									self.conultarTablaParametros(oMaestroSeleccionado.Id);

									var oTable1 = self.getView().byId("tblParametros");
									oTable1.clearSelection(); 
									self.getView().getModel("modelTablaGenerica").refresh();

								} 
							}, self);
						}else{
							sap.ui.core.BusyIndicator.hide();
						}
					}); 
				}
			} catch (error) {
				sap.ui.core.BusyIndicator.hide();
				console.log(error);
			}
		},
		onEditarParametro:function(evt){ 
			try {
				var oMaestroSeleccionado = this.getView().getModel("modelTablaGenerica").getProperty("/oTablaSeleccionada");   
				var oMaestro = {};
				oMaestro.maestroId	    = oMaestroSeleccionado.Id;
				oMaestro.Des 			= oMaestroSeleccionado.DescripcionTabla; 
				var sPathParamSeleccionado = evt.getSource().getBindingContext("modelTablaGenerica").getPath()
				var oParamSeleccionado  =  this.getView().getModel("modelTablaGenerica").getProperty(sPathParamSeleccionado);    
				var oParamFiltro = {};
				oParamFiltro.maestroId   = oMaestroSeleccionado.Id;
				oParamFiltro.parametroId = oParamSeleccionado.Id;
				this.getView().getModel("modelTablaGenerica").setProperty("/oParametroSeleccionado", JSON.parse(JSON.stringify(oParamSeleccionado)));    
				this.navigation(this, "RouteHomeEditParameter",oParamFiltro); 
			} catch (error) {
				console.log(error);
			}

		},
		onPressTabDetalle:function(e){
			var iTabSeleccionado = this.getView().byId("iconTabDetalle").getSelectedKey();
			if(parseInt(iTabSeleccionado, 10) === 1 ){
				this.getView().getModel("modelTablaGenerica").setProperty("/oControles/btnGuardarTabla",true);
			}else{
				this.getView().getModel("modelTablaGenerica").setProperty("/oControles/btnGuardarTabla",false);
			}
		},
		onVerAuditoria:function(evt){

			var sPathParamSeleccionado = evt.getSource().getBindingContext("modelTablaGenerica").getPath()
			var oParamSeleccionado  =  this.getView().getModel("modelTablaGenerica").getProperty(sPathParamSeleccionado);    
			this.getView().getModel("modelTablaGenerica").setProperty("/oParametroAuditoria",oParamSeleccionado); 
			var oButton = evt.getSource(),
				oView = this.getView();

			if (!this._AuditoriaParametro) {
				this._AuditoriaParametro = sap.ui.core.Fragment.load({
					id: oView.getId(),
					name: "com.telcomdataperu.app.Maestra.view.frag.dialog.AuditoriaParametro",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._AuditoriaParametro.then(function (oPopover){ 
				oPopover.openBy(oButton);
			});
		},
		onParametroDetalle:function(evt){

			var sPathParamSeleccionado = evt.getSource().getBindingContext("modelTablaGenerica").getPath()
			var oParamSeleccionado  =  this.getView().getModel("modelTablaGenerica").getProperty(sPathParamSeleccionado);  
			this.getView().getModel("modelTablaGenerica").setProperty("/oParametroVistaDetalle",oParamSeleccionado); 
			if (!this.oDialog) {
				var oView = this.getView(); 
				this.oDialog = oView.byId("dlgParametroDetalle");
			// create dialog lazily
			
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.telcomdataperu.app.Maestra.view.frag.dialog.DlgParametroDetalle", this);
			  oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		onCerrarParametroDetalle:function(evt){
			this.oDialog.close();
		},
		onAuditoriaMaestra:function(evt){ 
			var oMaestroSeleccionado = this.getView().getModel("modelTablaGenerica").getProperty("/oTablaSeleccionada");    
			this.getView().getModel("modelTablaGenerica").setProperty("/oMaestraAuditoria",oMaestroSeleccionado); 

			var oButton = evt.getSource(),
				oView = this.getView();

			if (!this._AuditoriaMaestra) {
				this._AuditoriaMaestra = sap.ui.core.Fragment.load({
					id: oView.getId(),
					name: "com.telcomdataperu.app.Maestra.view.frag.dialog.AuditoriaMaestra",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._AuditoriaMaestra.then(function (oPopover){ 
				oPopover.openBy(oButton);
			});
		}
	});
});
