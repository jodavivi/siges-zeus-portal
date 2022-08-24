sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../controller/BaseController", 
	"../servicio/AsignacionCajaService",
	"sap/ui/core/UIComponent",
	'../util/UtilPopUps',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	"../model/models" ,
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"../servicio/MaestraService",
	"../servicio/ProductoService",
	'../util/UtilUi',
], function (Controller, BaseController, AsignacionCajaService, UIComponent, UtilPopUps, Filter, FilterOperator, Sorter, models, JSONModel, Fragment, MaestraService, ProductoService, UtilUi) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.CajaRapida.controller.CajaRapida", { 
		onInit: function () {     
			var self = this;  
			self.onValidarAperturaCaja();
			self.fnConsultarDatosGenericos();  
		},
		_onRouteMatched: function(event) {  
			this.onFnValidarParametros();
		} ,
		onFnValidarParametros: function(){
			var self = this;  
			var oCajaApertura = self.getView().getModel("modelCajaRapida").getProperty("/oCajaApertura"); 
			if(!oCajaApertura.Id){
				self.fnMostrarMensajeNoApertura();
			} 
			var oTipoCambio = self.getView().getModel("modelCajaRapida").getProperty("/oTipoCambio"); 
			if(!oTipoCambio.Id){
				self.fnMensajeTipoCambioNoEncontrado();
			}
		},
		onAfterRendering: function(){ 
		},
		onValidarAperturaCaja: function(){
			try{ 
				var that        = this;
				var oParam 		= {};   
				AsignacionCajaService.validarAperturaCaja(oParam, function(result) {   
				  if(result.iCode ===1){   
					that.getView().getModel("modelCajaRapida").setProperty("/oCajaApertura", result.oResults); 
				  }else{  
					that.getView().getModel("modelCajaRapida").setProperty("/oCajaApertura", {});
					that.fnMostrarMensajeNoApertura();
					that.navigation(that, "cajaRapidaRoute",{});  
				  } 
				  var oRouter = sap.ui.core.UIComponent.getRouterFor(that); 
					oRouter.getRoute("cajaRapidaRoute").attachMatched(that._onRouteMatched, that);
				}, that);
			 
				}catch(e){ 
				  console.log(e);
				}
		},
		fnMostrarMensajeNoApertura:  function(){
				// create value help dialog
				if (!this._oDialogNoApertura) {
					Fragment.load({
						name: "com.telcomdataperu.app.CajaRapida.view.frag.dialog.CajaNoAsignada",
						controller: this
					}).then(function (oDialog) {
						this._oDialogNoApertura = oDialog;
	
						this.getView().addDependent(this._oDialogNoApertura);
	
						this._oDialogNoApertura.open();
					}.bind(this));
				} else {
					this._oDialogNoApertura.open();
				}
		},
		fnConsultarDatosGenericos: function(){
			try{ 
				var that        = this;
				var oParam 		= {}; 
            	oParam.sListaCodigoTabla = "tipo-cambio,tipo-doc-venta,tipo-doc-persona,tarjeta-operador-venta,aplicacion-operador-venta";
            	oParam.iEstadoCampoId    = 1;
				MaestraService.consultarParametros(oParam, function(result) {   
					var oTipoCambio 		= {};
					var aTipoIdentificacion = [];
					var aTipoDocVenta    	= [];
					var aTipoTarjetaVenta    	= [];
					var aTipoAplicacionVenta    	= [];
					
				  if(result.iCode ===1){   
					result.oResults.forEach(function(e){
							if(e.CodigoTabla === "tipo-cambio"){
								oTipoCambio = e;
							}
							if(e.CodigoTabla === "tipo-doc-persona"){
								aTipoIdentificacion.push(e);
							}
							if(e.CodigoTabla === "tipo-doc-venta"){
								aTipoDocVenta.push(e);
							}
							if(e.CodigoTabla === "tarjeta-operador-venta"){
								aTipoTarjetaVenta.push(e);
							}
							if(e.CodigoTabla === "aplicacion-operador-venta"){
								aTipoAplicacionVenta.push(e);
							}
					}); 
					that.getView().getModel("modelCajaRapida").setProperty("/oTipoCambio", oTipoCambio); 
					that.getView().getModel("modelCajaRapida").setProperty("/aTipoIdentificacion", aTipoIdentificacion);
					that.getView().getModel("modelCajaRapida").setProperty("/aTipoDocVenta", aTipoDocVenta);
					that.getView().getModel("modelCajaRapida").setProperty("/aTipoTarjetaVenta", aTipoTarjetaVenta);
					that.getView().getModel("modelCajaRapida").setProperty("/aTipoAplicacionVenta", aTipoAplicacionVenta);
				  }else{   
					that.getView().getModel("modelCajaRapida").setProperty("/oTipoCambio", {}); 
					that.getView().getModel("modelCajaRapida").setProperty("/aTipoIdentificacion", []); 
					that.getView().getModel("modelCajaRapida").setProperty("/aTipoDocVenta", []); 
					that.getView().getModel("modelCajaRapida").setProperty("/aTipoTarjetaVenta", []);
					that.getView().getModel("modelCajaRapida").setProperty("/aTipoAplicacionVenta",[] );
					that.fnMensajeTipoCambioNoEncontrado();
				  } 
				}, that);
			 
				}catch(e){ 
				  console.log(e);
				}
		},
		fnMensajeTipoCambioNoEncontrado:  function(){
				// create value help dialog
				if (!this._oDialogNoTipoCambio) {
					Fragment.load({
						name: "com.telcomdataperu.app.CajaRapida.view.frag.dialog.TipoCambioNoFound",
						controller: this
					}).then(function (oDialog) {
						this._oDialogNoTipoCambio = oDialog;
	
						this.getView().addDependent(this._oDialogNoTipoCambio);
	
						this._oDialogNoTipoCambio.open();
					}.bind(this));
				} else {
					this._oDialogNoTipoCambio.open();
				}
		},
		onBuscarProductoDisponible: function(oEvent){
			try{ 
				var that        = this;
				that.onFnValidarParametros();
				var sQuery = oEvent.getSource().getValue();
				if(sQuery.length < 4){
					sap.m.MessageToast.show("Debe ingresar al menos 3 digitos para buscar"); 
					return;
				}
				var oCajaApertura = that.getView().getModel("modelCajaRapida").getProperty("/oCajaApertura"); 
				var oParam 		= {};  
				oParam.sCodSede = oCajaApertura.CodSede;
				var iFiltroBuscarProducto = this.getView().getModel("modelCajaRapida").getProperty("/oDatosDefault/sFiltroProducto");
				if(iFiltroBuscarProducto === 0){
					oParam.sCodigo = sQuery.toUpperCase(); 
				} 
				if(iFiltroBuscarProducto === 1){
					oParam.sCodigoBarra = sQuery; 
				} 
				if(iFiltroBuscarProducto === 2){
					oParam.sNombre = sQuery; 
				} 
				if(iFiltroBuscarProducto === 3){
					oParam.sDescripcion = sQuery; 
				} 
				sap.ui.core.BusyIndicator.show(0);
				ProductoService.consultarProductoDisponibilidad(oParam, function(result) {   
				  if(result.iCode ===1){   
					that.getView().getModel("modelCajaRapida").setProperty("/aProductoDisponible", result.oResults); 
					if(iFiltroBuscarProducto === 1){
						//Si es busqued por codigo, automaticamento lo agrega al carrito
						that.getView().byId("txtBuscarProducto").setValue("");
						that.onFnAgregaCarritoRapida(result.oResults[0]);
					}else{
						sap.ui.core.BusyIndicator.hide();
					} 
				  }else{   
					that.getView().getModel("modelCajaRapida").setProperty("/aProductoDisponible", []);  
					that.getView().byId("txtBuscarProducto").setValue("");
					sap.m.MessageToast.show("Producto no encontrado!!"); 
					sap.ui.core.BusyIndicator.hide();
				  } 
				  
				}, that);
			 
				}catch(e){ 
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onBtnBuscarProducto: function(oEvent){
			this.onBuscarProductoDisponible(oEvent);
		},
		onSelectProducto: function(oEvent){
			var sPath			=	oEvent.getSource().getSelectedItem().getBindingContext("modelCajaRapida").sPath; 
			var oProductoSeleccionado		=	JSON.parse(JSON.stringify(this.getView().getModel("modelCajaRapida").getProperty(sPath))) ; 
			oProductoSeleccionado.Cantidad  = 1;
			oProductoSeleccionado.Accion	= "C";
			this.getView().getModel("modelCajaRapida").setProperty("/oControles/btnAgregarCarrito", "Agregar"); 
			this.getView().getModel("modelCajaRapida").setProperty("/oControles/btnMostrarEliminarCarrito", false); 
			this.getView().getModel("modelCajaRapida").setProperty("/oProductoSeleccionado", oProductoSeleccionado); 
			this.getView().getModel("modelCajaRapida").refresh(true);
			this.fnMensajeAgregarProductoCarrito();
			this.getView().byId("listTablaMaestraProducto").removeSelections(true); 
		},
		fnMensajeAgregarProductoCarrito:  function(){
				// create value help dialog
				if (!this._oDialogProductoAgregarCarrito) {
					Fragment.load({
						name: "com.telcomdataperu.app.CajaRapida.view.frag.dialog.ProductoAgregarCarrito",
						controller: this
					}).then(function (oDialog) {
						this._oDialogProductoAgregarCarrito = oDialog;
	
						this.getView().addDependent(this._oDialogProductoAgregarCarrito);
	
						this._oDialogProductoAgregarCarrito.open();
					}.bind(this));
				} else {
					this._oDialogProductoAgregarCarrito.open();
				}
		},
		onFnLimpiarVenta:function(){
			var self = this;
			
			self.getView().getModel("modelCajaRapida").setProperty("/aProductoDisponible", []);
			self.getView().getModel("modelCajaRapida").setProperty("/oProductoSeleccionado", {}); 
			self.getView().getModel("modelCajaRapida").setProperty("/aCarritoCompra", []);
			
			self.getView().getModel("modelCajaRapida").setProperty("/oClienteVenta", {});
			self.getView().getModel("modelCajaRapida").setProperty("/oDocVenta", {});
			self.getView().getModel("modelCajaRapida").setProperty("/aPagoCarrito", []);
			self.getView().getModel("modelCajaRapida").refresh(true);
		},
		onBtnAReiniciarCajaRapida: function() {
			var self = this;
			UtilPopUps.messageBox("¿Desea generar nueva venta?", 'c', function(bConfirmacion) {
				if (bConfirmacion) {
					var oParam = {}; 
					self.onFnLimpiarVenta(); 
					self.navigation(self, "cajaRapidaRoute",oParam);
				} 
			});
			
		}, 
		onPressFiltroBuscarProducto: function(){ 

			if (!this._oDialogFiltroProductp) {
				Fragment.load({
					name: "com.telcomdataperu.app.CajaRapida.view.frag.dialog.DlgFiltroBuscarProducto",
					controller: this
				}).then(function (oDialog) {
					this._oDialogFiltroProductp = oDialog;

					this.getView().addDependent(this._oDialogFiltroProductp);

					this._oDialogFiltroProductp.open();
				}.bind(this));
			} else {
				this._oDialogFiltroProductp.open();
			}
		},
		onPressCerrarFiltroProducto: function(){
			this._oDialogFiltroProductp.destroy();
        	this._oDialogFiltroProductp = undefined;
		},
		onPressFiltroProducto: function(oEvent){
			//var text = sap.ui.getCore().byId(this.createId("radioFiltroProducto")).getSelectedButton().getText();
			//console.log(text); 
			var iSelectFiltro = sap.ui.getCore().byId("radioFiltroProducto").getSelectedIndex().toString();
            switch (iSelectFiltro) {
				case '0':  
					this.getView().getModel("modelCajaRapida").setProperty("/oDatosDefault/sFiltroProducto", 0);
					this.getView().getModel("modelCajaRapida").setProperty("/oDatosDefault/sFiltroProductoDesc", "Buscar x Codigo");
				break;
				case '1':  
					this.getView().getModel("modelCajaRapida").setProperty("/oDatosDefault/sFiltroProducto", 1);
					this.getView().getModel("modelCajaRapida").setProperty("/oDatosDefault/sFiltroProductoDesc", "Buscar x Codigo de Barras");
				break;
				case '2':
					this.getView().getModel("modelCajaRapida").setProperty("/oDatosDefault/sFiltroProducto", 2); 
					this.getView().getModel("modelCajaRapida").setProperty("/oDatosDefault/sFiltroProductoDesc", "Buscar x Nombre");
				break;
				case '3':
					this.getView().getModel("modelCajaRapida").setProperty("/oDatosDefault/sFiltroProducto", 3); 
					this.getView().getModel("modelCajaRapida").setProperty("/oDatosDefault/sFiltroProductoDesc", "Buscar x Descripción");
				break;
						}
			this.getView().byId("txtBuscarProducto").setValue("");
			this.getView().byId("txtBuscarProducto").focus();
			this.getView().getModel("modelCajaRapida").refresh(true);
			this.onPressCerrarFiltroProducto();
		},
		onFnAgregaCarritoRapida: function(oProducto){

			var oProductoSeleccionado = oProducto;
			oProductoSeleccionado.Cantidad  = 1;
			oProductoSeleccionado.Accion	= "C"; 
			this.getView().getModel("modelCajaRapida").setProperty("/oProductoSeleccionado", oProductoSeleccionado); 
			this.getView().getModel("modelCajaRapida").refresh(true);
			this.onBtnAgregarProductoCarrito();
		}
 
	});
});