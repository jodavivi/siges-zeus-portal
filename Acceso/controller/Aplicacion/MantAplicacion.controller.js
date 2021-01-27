sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../../servicio/AplicacionService",
	"../../controller/BaseController",
	'../../util/UtilPopUps', 
	"sap/ui/core/Fragment"
], function (Controller, AplicacionService, BaseController, UtilPopUps, Fragment) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Acceso.controller.Aplicacion.MantAplicacion", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("AplicacionRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){
			this.fnCargarAplicaciones();
		},
		fnCargarAplicaciones:function(){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				AplicacionService.consultarAplicacion(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/aListaAplicaciones", result.oResults);
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aListaAplicaciones", []);
				  } 
				}, that);
		 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onRegistrarAplicacion:function(){
			this.getView().getModel("modelAcceso").setProperty("/oAplicacionNuevo", {});
			this.navigation(this, "AplicacionRegistroRoute",{}); 
		},
		onEliminarAplicacion:function(){
			try {
				var self = this;
				
				var indexes = self.getView().byId("tblAplicaciones").getSelectedIndices();
				if(indexes.length > 0){
					sap.ui.core.BusyIndicator.show(0);
					var aListaAppEliminar = [];
					indexes.forEach(function(i) {
						var oParametros = self.getView().byId("tblAplicaciones").getContextByIndex(i).getObject();  
						aListaAppEliminar.push( oParametros.Id);
					});
					var oParamEliminar = {};
					oParamEliminar.aItems = aListaAppEliminar;
					UtilPopUps.messageBox("¿Desea eliminar las aplicaciones seleccionadas?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
							sap.ui.core.BusyIndicator.hide();
							AplicacionService.eliminarAplicacion(oParamEliminar, function(result) { 
								sap.ui.core.BusyIndicator.hide();
								UtilPopUps.validarRespuestaServicio(result,'Aplicaciones eliminadas correctamente',function(e){});
								if(result.iCode ===1){
									//Recargamos las aplicaciones
									self.fnCargarAplicaciones(self);  
									var oTable1 = self.getView().byId("tblAplicaciones");
									oTable1.clearSelection(); 
									self.getView().getModel("modelAcceso").refresh();
								} 
							}, self); 
						}else{
							sap.ui.core.BusyIndicator.hide();
						}
					}); 
				}else{ 
						sap.m.MessageToast.show("Seleccionar Aplicación"); 
					} 
			} catch (error) {
				sap.ui.core.BusyIndicator.hide();
				console.log(error);
			}
		},
		onEditarAplicacion:function(evt){
			try {
				var sPathAplicacionSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
				var oAplicacionSeleccionado  =  this.getView().getModel("modelAcceso").getProperty(sPathAplicacionSeleccionado);     
				var oParam = {};
				oParam.id = oAplicacionSeleccionado.Id;
				this.navigation(this, "AplicacionEditarRoute",oParam);  
			} catch (error) {
				
			}
		} ,
		onVerAuditoria:function(evt){

			var sPathParamSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
			var oParamSeleccionado  =  this.getView().getModel("modelAcceso").getProperty(sPathParamSeleccionado);    
			this.getView().getModel("modelAcceso").setProperty("/oAplicacionAuditoria",oParamSeleccionado); 
			var oButton = evt.getSource(),
				oView = this.getView();

			if (!this._AuditoriaAplicacion) {
				this._AuditoriaAplicacion = Fragment.load({
					id: oView.getId(),
					name: "com.telcomdataperu.app.Acceso.view.Aplicacion.frag.dialog.AuditoriaAplicacion",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._AuditoriaAplicacion.then(function (oPopover){ 
				oPopover.openBy(oButton);
			});
		}
		
	});
});