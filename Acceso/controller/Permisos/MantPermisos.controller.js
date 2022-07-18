sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"../../controller/BaseController",
	"../../servicio/Permisos",
	"sap/ui/core/Fragment",
	'../../util/UtilPopUps',
	'../../util/UtilValidation',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", 
	'../../util/UtilUi',
	"../../servicio/AplicacionService",
], function (Controller, BaseController, Permisos, Fragment, UtilPopUps, UtilValidation, Filter, FilterOperator, UtilUi, AplicacionService) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Acceso.controller.Permisos.MantPermisos", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("PermisoRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(){
			this.fnCargarRoles();
		},
		fnCargarRoles:function(){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				Permisos.consultarRoles(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/aListaRoles", result.oResults);
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aListaRoles", []);
				  } 
				}, that);
		 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onPressGoRolAplicacion: function(oEvent) {
            var control = oEvent.getSource(); 
            var sPath = control.getBindingContext("modelAcceso").getPath(); 
			var seleccion = this.getView().getModel("modelAcceso").getProperty(sPath);
			seleccion.NombreRol = "de " +seleccion.Nombre;
			this.getView().getModel("modelAcceso").setProperty("/oRolSeleccionado", seleccion);
			this.fnCargarAplicacionRol(seleccion.Codigo);
			this.fnCargarAplicaciones();
             
		},
		fnCargarAplicacionRol:function(sCodRol){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.sCodRol	= sCodRol;
				Permisos.consultarRolAplicacion(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){ 
					var aListaAplicaciones = []
					result.oResults.forEach(function(e){
						e.Aplicacion.RolAplicacionId = e.Id;
						aListaAplicaciones.push(e.Aplicacion);
					});
					var aNuevaListaAccesos = {};
					aNuevaListaAccesos.listaAccesos = UtilUi.generarTree(aListaAplicaciones, null);
					   
					that.getView().getModel("modelAcceso").setProperty("/aListaRolAplicacion", aNuevaListaAccesos);
				  
					var oTreeTable = that.getView().byId("tblRolAplicaciones");
					oTreeTable.expandToLevel(1);
				}else{
					that.getView().getModel("modelAcceso").setProperty("/aListaRolAplicacion", []);
				  } 
				}, that);
		 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onPressCrearRol:function(){
			var oDialog 	=	this.getView().byId("DlgCrearRol"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Acceso.view.Permisos.frag.dialog.DlgCrearRol", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressCloseCrearRol:function(){
			this.getView().byId("DlgCrearRol").destroy();  
		}, 
		onfnCrearRol:function(grupoId){
			try{
				var that = this;
				var sError = UtilValidation.validaFormObligatorio(this,"frmCrearRol"); 
				if(!sError){
					UtilPopUps.messageBox("¿Desea crear el rol?", 'c', function(bConfirmacion) {
					if (bConfirmacion) {
						sap.ui.core.BusyIndicator.show(0); 
						var oRolNuevo = that.getView().getModel("modelAcceso").getProperty("/oRolNuevo");
						var oParam 		= {}; 
						oParam.sCodigo			= oRolNuevo.sCodigo;
						oParam.sNombre			= oRolNuevo.sNombre;
						oParam.sDescripcion		= oRolNuevo.sDescripcion;
						oParam.iEstadoRolCod			= parseInt(oRolNuevo.iEstadoRolCod, 10); ;
						Permisos.crearRol(oParam, function(result) {   
							sap.ui.core.BusyIndicator.hide();
							UtilPopUps.validarRespuestaServicio(result,'El Rol se registró correctamente',function(e){});
							if(result.iCode ===1){  
								that.fnCargarRoles();
								that.onPressCloseCrearRol();
								that.getView().getModel("modelAcceso").setProperty("/oRolNuevo", {});
							}  

						}, that); 
						sap.ui.core.BusyIndicator.hide();
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
		onPressEditarRol: function(evt){

			var sPathRolSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
			var oRolSeleccionado  =  this.getView().getModel("modelAcceso").getProperty(sPathRolSeleccionado);     
			 
			this.getView().getModel("modelAcceso").setProperty("/oRolEditar",oRolSeleccionado );
			var oDialog 	=	this.getView().byId("DlgEditarRol"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Acceso.view.Permisos.frag.dialog.DlgEditarRol", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressCloseEditarRol: function(){
			this.getView().byId("DlgEditarRol").destroy();  
		}, 
		onfnEditarRol:function(grupoId){
			try{
				var that = this;
				var sError = UtilValidation.validaFormObligatorio(this,"frmEditarRol"); 
				if(!sError){
					UtilPopUps.messageBox("¿Desea actualizar el rol?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
							sap.ui.core.BusyIndicator.show(0); 
							var oRolEditar = that.getView().getModel("modelAcceso").getProperty("/oRolEditar");
							var oParam 		= {}; 
							oParam.iId				= oRolEditar.Id;
							oParam.sNombre			= oRolEditar.Nombre;
							oParam.sDescripcion		= oRolEditar.Descripcion;
							oParam.iEstadoRolCod			= parseInt(oRolEditar.EstadoRolCod, 10); ;
							Permisos.actualizarRol(oParam, function(result) {   
								sap.ui.core.BusyIndicator.hide();
								UtilPopUps.validarRespuestaServicio(result,'El Rol se actualizó correctamente',function(e){});
								if(result.iCode ===1){  
									that.fnCargarRoles();
									that.onPressCloseEditarRol();
									that.getView().getModel("modelAcceso").setProperty("/oRolEditar", {});
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
		onVerAuditoriaRol:function(evt){

			var sPathParamSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
			var oParamSeleccionado  =  this.getView().getModel("modelAcceso").getProperty(sPathParamSeleccionado);    
			this.getView().getModel("modelAcceso").setProperty("/oRolAuditoria",oParamSeleccionado); 
			var oButton = evt.getSource(),
				oView = this.getView();

			if (!this._AuditoriaRol) {
				this._AuditoriaRol = Fragment.load({
					id: oView.getId(),
					name: "com.telcomdataperu.app.Acceso.view.Permisos.frag.dialog.AuditoriaRol",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._AuditoriaRol.then(function (oPopover){ 
				oPopover.openBy(oButton);
			});
		} , 
		onPressVerRol: function(evt){
			var sPathRolSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
			var oRolSeleccionado  =  this.getView().getModel("modelAcceso").getProperty(sPathRolSeleccionado);     
			this.getView().getModel("modelAcceso").setProperty("/oRolVer",oRolSeleccionado );
			var oDialog 	=	this.getView().byId("DlgVerRol"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Acceso.view.Permisos.frag.dialog.DlgVerRol", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressCloseVerRol:function(){
			this.getView().byId("DlgVerRol").destroy();  
		},
		onPressEliminarRol:function(){
			try {
				var self = this;
				var indexes = self.getView().byId("tblRoles").getSelectedIndices();
				if(indexes.length > 0){
					var aListaRolEliminar = [];
					indexes.forEach(function(i) {
						var oRolSeleccionado = self.getView().byId("tblRoles").getContextByIndex(i).getObject();  
						aListaRolEliminar.push( {"iId":oRolSeleccionado.Id, "sCodigo": oRolSeleccionado.Codigo});
					});
					UtilPopUps.messageBox("¿Desea eliminar los roles seleccionados?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
							sap.ui.core.BusyIndicator.show(0);
							var oParam = {};
							oParam.aItems = aListaRolEliminar;
							Permisos.eliminarRol(oParam, function(result) {  
								sap.ui.core.BusyIndicator.hide();
								
								if(result.iCode ===1){ 
									UtilPopUps.validarRespuestaServicio(result,'Roles eliminados correctamente',function(e){});
									var oTable1 = self.getView().byId("tblRoles");
									oTable1.clearSelection(); 
									self.getView().getModel("modelAcceso").setProperty("/oRolSeleccionado", {});
									self.getView().getModel("modelAcceso").setProperty("/aListaRolAplicacion", []);
									self.fnCargarRoles();
								} 
							}, this);
						}
					}); 
				}
			} catch (error) {
				
			} 
		}, 
		onConsultarAplicacionSinAsignar:function(){

			try{
				sap.ui.core.BusyIndicator.show(0); 
				var oSeleccionRol = this.getView().getModel("modelAcceso").getProperty("/oRolSeleccionado");
 
				var that        = this;
				var oParam 		= {}; 
				oParam.sCodRol	= oSeleccionRol.Codigo;
				Permisos.consultarRolAplicacionSinAsignar(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide(); 
				  if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/aListaAplicacionSinAsignar", result.oResults);
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aListaAplicacionSinAsignar", []);
				  } 
				  that.onPressAgregarAplicacionRol();
				}, that);
		 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}

		},  
		onPressAgregarAplicacionRol: function(){
			var oDialog 	=	this.getView().byId("DlgAgregarAplicacionRol"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Acceso.view.Permisos.frag.dialog.DlgAgregarAplicacion", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressCloseAgregarAplicacionRol:function(){
			this.getView().byId("DlgAgregarAplicacionRol").destroy();  
		},
		onPressRegistrarAplicacionesxRol:function(){
			try {
				var self = this;
				var indexes = self.getView().byId("tblAppSinAsignar").getSelectedIndices();
				if(indexes.length > 0){
					var aListaAppAgregar = [];
					indexes.forEach(function(i) {
						var oAppSeleccionado = self.getView().byId("tblAppSinAsignar").getContextByIndex(i).getObject();  
						aListaAppAgregar.push( oAppSeleccionado.Id);
					});
					UtilPopUps.messageBox("¿Desea Registrar las aplicaciones seleccionadas?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
							sap.ui.core.BusyIndicator.show(0);
							var oParam =  {};
							oParam.sCodRol = self.getView().getModel("modelAcceso").getProperty("/oRolSeleccionado").Codigo;
							oParam.aItems =  aListaAppAgregar;
							Permisos.registrarAplicacionxRol(oParam, function(result) {  
								sap.ui.core.BusyIndicator.hide(); 
								if(result.iCode ===1){ 
									UtilPopUps.validarRespuestaServicio(result,'Aplicaciones registradas correctamente',function(e){});
									var oTable1 = self.getView().byId("tblAppSinAsignar");
									oTable1.clearSelection();  
									self.getView().getModel("modelAcceso").setProperty("/aListaAplicacionSinAsignar", []);
									self.fnCargarAplicacionRol(oParam.sCodRol);
									self.onPressCloseAgregarAplicacionRol();
								} 
							}, this);
						}
					}); 
				}
			} catch (error) {
				
			} 
		},
		onPressEliminarAplicacionxRol:function(){
			try {
				var self = this;
				var indexes = self.getView().byId("tblRolAplicaciones").getSelectedIndices();
				var oRolSeleccionado = self.getView().getModel("modelAcceso").getProperty("/oRolSeleccionado");
				if(indexes.length > 0){
					var aListaRolEliminar = [];
					indexes.forEach(function(i) {
						var oRolSeleccionado = self.getView().byId("tblRolAplicaciones").getContextByIndex(i).getObject();  
						aListaRolEliminar.push( oRolSeleccionado.RolAplicacionId);
					});
					UtilPopUps.messageBox("¿Desea eliminar las aplicaciones seleccionados?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
							sap.ui.core.BusyIndicator.show(0);
							var oParam = {};
							oParam.aItems = aListaRolEliminar;
							Permisos.eliminarAplicacionxRol(oParam, function(result) {  
								sap.ui.core.BusyIndicator.hide();
								
								sap.ui.core.BusyIndicator.hide(); 
								if(result.iCode ===1){ 
									UtilPopUps.validarRespuestaServicio(result,'Aplicaciones eliminadas correctamente',function(e){});
									var oTable1 = self.getView().byId("tblRolAplicaciones");
									oTable1.clearSelection();   
									self.fnCargarAplicacionRol(oRolSeleccionado.Codigo); 
								} 
							}, this);
						}
					}); 
				}
			} catch (error) {
				
			} 
		},
		fnCargarAplicaciones:function(){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.sTipo = "P";
				oParam.iCodEstadoAplicacion = 1;
				AplicacionService.consultarAplicacion(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){ 
					result.oResults.push({"Codigo": "0" , "Nombre":"--Todas las Aplicaciones--"});
					that.getView().getModel("modelAcceso").setProperty("/aListaAplicacionesSeleccion", result.oResults);
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aListaAplicacionesSeleccion", []);
				  } 
				}, that);
		 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onPressFiltrarAplicacionesxRol:function(){
			var sCodAplicacionSeleccionado = this.getView().byId("cbxAplicacion").getSelectedKey(); 
			var oFilter1 = new sap.ui.model.Filter("Codigo", sap.ui.model.FilterOperator.Contains, sCodAplicacionSeleccionado);
			var oFilter2 = new sap.ui.model.Filter("CodigoPadre", sap.ui.model.FilterOperator.Contains, sCodAplicacionSeleccionado);
			var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false); 
			//var oBinding = this.getView().byId("tblAppSinAsignar").getBinding("items");
			//oBinding.filter(allFilter);
			this.byId("tblAppSinAsignar").getBinding().filter(allFilter, "Application");
		},
		onPressActualizarRol: function(){
			this.fnCargarRoles();
		}, 
		onPressActualizarAplicacion: function(){
			var oRolAplicacion = this.getView().getModel("modelAcceso").getProperty("/oRolSeleccionado");
			this.fnCargarAplicacionRol(oRolAplicacion.Codigo);
		}
	});
});