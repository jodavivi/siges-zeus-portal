sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../../servicio/GrupoService",
	"../../controller/BaseController",
	"../../servicio/AplicacionService",
	"sap/ui/core/Fragment",
	'../../util/UtilPopUps',
	'../../util/UtilValidation',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", 
], function (Controller, GrupoService, BaseController, AplicacionService, Fragment, UtilPopUps, UtilValidation, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Acceso.controller.Grupos.MantGrupos", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("GrupoRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){
			this.fnCargarGrupos();
		},
		fnCargarGrupos:function(){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				GrupoService.consultarGrupos(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/aListaGrupos", result.oResults);
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aListaGrupos", []);
				  } 
				}, that);
		 
			}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
			}
		},
		onPressGoAplicacion: function(oEvent) {
            var control = oEvent.getSource(); 
            var sPath = control.getBindingContext("modelAcceso").getPath(); 
			var seleccion = this.getView().getModel("modelAcceso").getProperty(sPath);
			seleccion.NombreGrupo = "de " +seleccion.Nombre;
			this.getView().getModel("modelAcceso").setProperty("/oGrupoSeleccionado", seleccion);
			this.fnCargarAplicacionGrupo(seleccion.Id);
             
		},
		fnCargarAplicacionGrupo:function(grupoId){
			try{
				
						sap.ui.core.BusyIndicator.show(0);
						var that        = this;
						var oParam 		= {}; 
						oParam.iId		= grupoId;
						AplicacionService.consultarGrupoAplicacion(oParam, function(result) {  
						sap.ui.core.BusyIndicator.hide();
						if(result.iCode ===1){ 
							that.getView().getModel("modelAcceso").setProperty("/aListaGrupoAplicaciones", result.oResults);
						}else{
							that.getView().getModel("modelAcceso").setProperty("/aListaGrupoAplicaciones", []);
						} 
						}, that);
				 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		}, 
		onPressCrearGrupo: function(){
			var oDialog 	=	this.getView().byId("DlgRegistroGrupo"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Acceso.view.Grupos.frag.dialog.DlgRegistroGrupo", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressCloseCrearGrupo:function(){
			this.getView().byId("DlgRegistroGrupo").destroy();  
		}, 
		onfnCrearGrupo:function(grupoId){
			try{
				var that = this;
				var sError = UtilValidation.validaFormObligatorio(this,"frmCrearGrupo"); 
				if(!sError){
					UtilPopUps.messageBox("¿Desea crear el grupo?", 'c', function(bConfirmacion) {
					if (bConfirmacion) {
						sap.ui.core.BusyIndicator.show(0); 
						var oGrupoNuevo = that.getView().getModel("modelAcceso").getProperty("/oGrupoNuevo");
						var oParam 		= {}; 
						oParam.sNombre			= oGrupoNuevo.sNombre;
						oParam.sDescripcion		= oGrupoNuevo.sDescripcion;
						oParam.iCodEstadoGrupo			= parseInt(oGrupoNuevo.iCodEstadoGrupo, 10); ;
						GrupoService.crearGrupo(oParam, function(result) {   
							sap.ui.core.BusyIndicator.hide();
							UtilPopUps.validarRespuestaServicio(result,'El Grupo se registró correctamente',function(e){});
							if(result.iCode ===1){  
								that.fnCargarGrupos();
								that.onPressCloseCrearGrupo();
								that.getView().getModel("modelAcceso").setProperty("/oGrupoNuevo", {});
							}  

						}, that);
					}
				});
				}else{
					sap.m.MessageToast.show("(*) Ingresar los campos obligatorios"); 
				};
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onPressEditarGrupo: function(evt){

			var sPathGrupoSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
			var oGrupoSeleccionado  =  this.getView().getModel("modelAcceso").getProperty(sPathGrupoSeleccionado);     
			 
			this.getView().getModel("modelAcceso").setProperty("/oGrupoEditar",oGrupoSeleccionado );
			var oDialog 	=	this.getView().byId("DlgEditarGrupo"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Acceso.view.Grupos.frag.dialog.DlgEditarGrupo", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressCloseEditarGrupo: function(){
			this.getView().byId("DlgEditarGrupo").destroy();  
		} 
		, 
		onfnEditarGrupo:function(grupoId){
			try{
				var that = this;
				var sError = UtilValidation.validaFormObligatorio(this,"frmEditarGrupo"); 
				if(!sError){
					UtilPopUps.messageBox("¿Desea actualizar el grupo?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
							sap.ui.core.BusyIndicator.show(0); 
							var oGrupoEditar = that.getView().getModel("modelAcceso").getProperty("/oGrupoEditar");
							var oParam 		= {}; 
							oParam.iId				= oGrupoEditar.Id;
							oParam.sNombre			= oGrupoEditar.Nombre;
							oParam.sDescripcion		= oGrupoEditar.Descripcion;
							oParam.iCodEstadoGrupo			= parseInt(oGrupoEditar.CodEstadoGrupo, 10); ;
							GrupoService.actualizarGrupo(oParam, function(result) {   
								sap.ui.core.BusyIndicator.hide();
								UtilPopUps.validarRespuestaServicio(result,'El Grupo se actualizó correctamente',function(e){});
								if(result.iCode ===1){  
									that.fnCargarGrupos();
									that.onPressCloseEditarGrupo();
									that.getView().getModel("modelAcceso").setProperty("/oGrupoEditar", {});
								}  

							}, that);
						}
					});
				}else{
					sap.m.MessageToast.show("(*) Ingresar los campos obligatorios"); 
				};
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		}, 
		onPressVerGrupo: function(evt){
			var sPathGrupoSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
			var oGrupoSeleccionado  =  this.getView().getModel("modelAcceso").getProperty(sPathGrupoSeleccionado);     
			this.getView().getModel("modelAcceso").setProperty("/oGrupoVer",oGrupoSeleccionado );
			var oDialog 	=	this.getView().byId("DlgVerGrupo"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Acceso.view.Grupos.frag.dialog.DlgVerGrupo", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressCloseVerGrupo:function(){
			this.getView().byId("DlgVerGrupo").destroy();  
		},
		onVerAuditoriaGrupo:function(evt){

			var sPathParamSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
			var oParamSeleccionado  =  this.getView().getModel("modelAcceso").getProperty(sPathParamSeleccionado);    
			this.getView().getModel("modelAcceso").setProperty("/oGrupoAuditoria",oParamSeleccionado); 
			var oButton = evt.getSource(),
				oView = this.getView();

			if (!this._AuditoriaGrupo) {
				this._AuditoriaGrupo = Fragment.load({
					id: oView.getId(),
					name: "com.telcomdataperu.app.Acceso.view.Grupos.frag.dialog.AuditoriaGrupo",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._AuditoriaGrupo.then(function (oPopover){ 
				oPopover.openBy(oButton);
			});
		},
		onPressEliminarGrupo:function(){
			try {
				var self = this;
				var indexes = self.getView().byId("tblGrupos").getSelectedIndices();
				if(indexes.length > 0){
					var aListaGrupoEliminar = [];
					indexes.forEach(function(i) {
						var oGrupoSeleccionado = self.getView().byId("tblGrupos").getContextByIndex(i).getObject();  
						aListaGrupoEliminar.push( oGrupoSeleccionado.Id);
					});
					UtilPopUps.messageBox("¿Desea eliminar los grupos seleccionados?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
							sap.ui.core.BusyIndicator.show(0);
							var oParam = {};
							oParam.aItems = aListaGrupoEliminar;
							GrupoService.eliminarGrupo(oParam, function(result) {  
								sap.ui.core.BusyIndicator.hide();
								
								if(result.iCode ===1){ 
									UtilPopUps.validarRespuestaServicio(result,'Grupos eliminados correctamente',function(e){});
									var oTable1 = self.getView().byId("tblGrupos");
									oTable1.clearSelection(); 
									self.getView().getModel("modelAcceso").setProperty("/oGrupoSeleccionado", {});
									self.getView().getModel("modelAcceso").setProperty("/aListaGrupoAplicaciones", []);
									self.fnCargarGrupos();
								} 
							}, this);
						}
					}); 
				}
			} catch (error) {
				
			} 
		},
		fnBuscarPaginasSinAgregar:function(){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oGrupoSeleccion = this.getView().getModel("modelAcceso").getProperty("/oGrupoSeleccionado");
				var oParam 		= {}; 
				oParam.iId		= oGrupoSeleccion.Id;
				GrupoService.consultarGruposAplicacionFaltante(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/aListaPaginas", result.oResults);
					that.onPressAgregarAplicacion();
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aListaPaginas", []);
				  } 
				}, that);
		 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		}, 
		onPressAgregarAplicacion: function(){
			var oDialog 	=	this.getView().byId("DlgAgregarAplicacion"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Acceso.view.Grupos.frag.dialog.DlgAgregarAplicacion", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressCloseAgregarAplicacion:function(){
			this.getView().byId("DlgAgregarAplicacion").destroy();  
		},

		onSelectionChange: function (oEvent) {
			var oList = oEvent.getSource();
			var oLabel = this.byId("idFilterLabel");
			var oInfoToolbar = this.byId("idInfoToolbar");
 
			var aContexts = oList.getSelectedContexts(true); 
			var bSelected = (aContexts && aContexts.length > 0);
			var sText = (bSelected) ? aContexts.length + " Seleccionado" : null;
			oInfoToolbar.setVisible(bSelected);
			oLabel.setText(sText);
		},
		onPressRegistrarSelectAplicacion:function(){
			var that = this;
			 var aListaApp = this.byId("idListAplicaciones").getSelectedContextPaths();
			 var oGrupoSeleccion = this.getView().getModel("modelAcceso").getProperty("/oGrupoSeleccionado");
			 var aListaRegistraApp = [];
			 if(aListaApp && aListaApp.length > 0){ 
				aListaApp.forEach(element => { 
					var oSeleccionado = that.getView().getModel("modelAcceso").getProperty(element);
					
					aListaRegistraApp.push({
						"iAplicacionId":oSeleccionado.Id,
						"iGrupoId": oGrupoSeleccion.Id
					});
				});
				
				if(aListaRegistraApp.length > 0){
					UtilPopUps.messageBox("¿Desea agregar las aplicaciones seleccionadas?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
							var oParam 		= aListaRegistraApp;
							GrupoService.registrarGrupoAplicacion(oParam, function(result) {  
								sap.ui.core.BusyIndicator.hide(); 
								if(result.iCode ===1){ 
									that.onPressCloseAgregarAplicacion();
									UtilPopUps.validarRespuestaServicio(result,'Aplicaciones agregadas correctamente',function(e){});
									var oSeleccion = that.getView().getModel("modelAcceso").getProperty("/oGrupoSeleccionado");
									that.fnCargarAplicacionGrupo(oSeleccion.Id);
								}else{
									
								} 
							}, that);
						} 
					}); 
				}
			 }
		},
		onBuscarAplicacion:function(oEvent){
				// add filter for search
				var aFilters = [];
				var sQuery = oEvent.getSource().getValue();
				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("Nombre", FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}
	
				// update list binding
				var oList = this.byId("idListAplicaciones");
				var oBinding = oList.getBinding("items");
				oBinding.filter(aFilters, "Application");
		},
		onPressEliminarPagAsignada:function(){
			try {
				var self = this;
				var indexes = self.getView().byId("tblAppAsignadas").getSelectedIndices();
				if(indexes.length > 0){
					
					var aListaAppEliminar = [];
					indexes.forEach(function(i) {
						var oAppSeleccionado = self.getView().byId("tblAppAsignadas").getContextByIndex(i).getObject();  
						aListaAppEliminar.push( oAppSeleccionado.Id);
					});
					UtilPopUps.messageBox("¿Desea eliminar las aplicaciones seleccionadas?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
							sap.ui.core.BusyIndicator.show(0);
							var oParam = {};
							oParam.aItems = aListaAppEliminar;
							GrupoService.eliminarGrupoAplicacionAsignado(oParam, function(result) {  
								sap.ui.core.BusyIndicator.hide();
								
								if(result.iCode ===1){ 
									UtilPopUps.validarRespuestaServicio(result,'Aplicaciones eliminadas correctamente',function(e){});
									var oTable1 = self.getView().byId("tblAppAsignadas");
									oTable1.clearSelection(); 
									var oSeleccion = self.getView().getModel("modelAcceso").getProperty("/oGrupoSeleccionado");
									self.fnCargarAplicacionGrupo(oSeleccion.Id);
								} 
							}, this);
						
						} 
				}); 
				}
			} catch (error) {
				console.log(error);
				sap.ui.core.BusyIndicator.hide();	
			}
		},
		onPressActualizarGrupo: function(){
			this.fnCargarGrupos();
		},
		onPressActualizarAplicacion: function(){
			var oSeleccion = this.getView().getModel("modelAcceso").getProperty("/oGrupoSeleccionado");
			this.fnCargarAplicacionGrupo(oSeleccion.Id);
		} 
	});
});