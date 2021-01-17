sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../controller/BaseController", 
	"../servicio/TablaGenericaService",
	"sap/ui/core/UIComponent",
	'../util/UtilPopUps',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	"../model/models"
], function (Controller, BaseController, TablaGenericaService, UIComponent, UtilPopUps, Filter, FilterOperator, Sorter, models) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Maestra.controller.Maestra", {
		onInit: function () {  
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("maestraRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(event) { 
			this.getView().byId("listTablaMaestra").removeSelections(true); 
			this.getView().setModel(models.modelTablaGenerica(), "modelTablaGenerica");
			this.fnCargarTabla(this);

		},
		
		onBuscarMaestra: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filterDescipcion = new Filter("DescripcionTabla", FilterOperator.Contains, sQuery); 
				var CodigoTabla = new Filter("CodigoTabla", FilterOperator.Contains, sQuery); 
				var Codigo = new Filter("Codigo", FilterOperator.Contains, sQuery); 
				aFilters = new sap.ui.model.Filter([filterDescipcion, CodigoTabla, Codigo]);
			}

			// update list binding
			var oList = this.byId("listTablaMaestra");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		}, 
		onPressSortMaestro: function(){
			var oDialog 	=	this.getView().byId("dialogSortMaestra"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Maestra.view.frag.dialog.DlgSorterMaster", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressConfirmarSorter: function(oEvent) {

			var oView		=	this.getView();
			var oTable		=	oView.byId("listTablaMaestra"); 
			var mParams		=	oEvent.getParameters();
			var oBinding	=	oTable.getBinding("items"); 
			var sPath;
			var bDescending;
			var vGroup;
			var aSorters		=	[];
			if (mParams.groupItem) {
				sPath			=	mParams.groupItem.getKey();
				bDescending		=	mParams.groupDescending;
				vGroup			=	this.mGroupFunctions[sPath];
				aSorters.push(new Sorter(sPath, bDescending, vGroup));
			}
			sPath				=	mParams.sortItem.getKey();
			bDescending			=	mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters); 
			// apply filters to binding
			var aFilters		=	[];
			jQuery.each(mParams.filterItems, function (i, oItem) {
				var aSplit		=	oItem.getKey().split("___");
				var sPath		=	aSplit[0];
				var sOperator	=	aSplit[1];
				var sValue1		=	aSplit[2];
				var sValue2		=	aSplit[3];
				var oFilter		=	new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});
			oBinding.filter(aFilters);
		},
		onSelectMaestro:function(oEvt){  
			var sPath			=	oEvt.getSource().getSelectedItem().getBindingContext("modelTablaGenerica").sPath; 
			var oMaestro		=	this.getView().getModel("modelTablaGenerica").getProperty(sPath) ; 
			var oParam			=  {};
			oParam.maestroId	=  oMaestro.Id;
			oParam.Des  		=  oMaestro.CodigoTabla;
			
			this.getView().getModel("modelTablaGenerica").setProperty("/oTablaSeleccionada",oMaestro); 
			this.navigation(this, "RouteHomeDetalle",oParam); 
		
		},
		onAgregarTabla: function (){
			this.getView().getModel("modelTablaGenerica").setProperty("/oTablaNuevo", {}); 
			var oDialog 	=	this.getView().byId("RegistroTabla");
			
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Maestra.view.frag.dialog.RegistroTabla", this);
				this.getView().addDependent(oDialog);
			}

			oDialog.open();
		},
		onPressGuardarTabla:function(event){ 
			var that        = this;
			try {
				sap.ui.core.BusyIndicator.show(0);
				UtilPopUps.messageBox("¿Desea registrar la maestra?", 'c', function(bConfirmacion) {
					if (bConfirmacion) {
						var oParam = that.getView().getModel("modelTablaGenerica").getProperty("/oTablaNuevo");   
						TablaGenericaService.registrarTablaGenerica(oParam, function(result) { 
							sap.ui.core.BusyIndicator.hide();
							UtilPopUps.validarRespuestaServicio(result,'El Maestro se guardo Correctamente',function(e){});
							if(result.iCode ===1){ 
								that.fnCargarTabla(that);
								that.getView().byId("RegistroTabla").destroy(); 
								var oParam			=  {};
								oParam.maestroId	=  result.oResults.Id;
								oParam.Des  		=  result.oResults.CodigoTabla; 
								that.getView().getModel("modelTablaGenerica").setProperty("/oTablaSeleccionada",result.oResults); 
								that.navigation(that, "RouteHomeDetalle",oParam); 

							}else{
								
							}
						}, that);
					}else{
						sap.ui.core.BusyIndicator.hide();
					}
				});
			} catch (error) {
				sap.ui.core.BusyIndicator.hide();
			}  
				
		},
		onPressClose:function(){
			this.getView().byId("RegistroTabla").destroy(); 
			this.getView().getModel("modelTablaGenerica").setProperty("/oTablaNuevo", {}); 
		},
		onEliminarTabla: function(){ 
			var that        = this;
			try {
				var oMaestroSeleccionado = that.getView().getModel("modelTablaGenerica").getProperty("/oTablaSeleccionada");  
				if(oMaestroSeleccionado.Id === undefined ||oMaestroSeleccionado.Id === null){
					sap.m.MessageToast.show("Seleccionar Maestra");
					return;
				}
				sap.ui.core.BusyIndicator.show(0);
				UtilPopUps.messageBox("¿Desea eliminar la maestra?", 'c', function(bConfirmacion) {
					if (bConfirmacion) {
						 
						TablaGenericaService.eliminarTablaGenerica(oMaestroSeleccionado, function(result) { 
							sap.ui.core.BusyIndicator.hide();
							UtilPopUps.validarRespuestaServicio(result,'La Maestra se elimino correctamente',function(e){});
							if(result.iCode ===1){
								that.fnCargarTabla(that);
								that.navigation(that, "maestraRoute",{}); 
							}else{
								
							}
						}, that);
					}else{
						sap.ui.core.BusyIndicator.hide();
					}
				});
			} catch (error) {
				sap.ui.core.BusyIndicator.hide();
			}  

		}
 
	});
});