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
	"../servicio/ClienteService",
	"sap/ui/core/Fragment", 
], function (Controller, BaseController, Filter, FilterOperator, 
	JSONModel, Models, Dialog, Button, Text, MessageBox, MessageToast,Sorter, 
	UtilValidation, UtilPopUps, UtilHttp, ClienteService, Fragment ) {
	"use strict";
	return BaseController.extend("com.telcomdataperu.app.CajaRapida.controller.Detail", {
		onInit: function () { 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);  
            oRouter.getRoute("cajaRapidaVentaRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(event) { 
			if(this.getView().byId("tabDetalleCarrito")){
				this.getView().byId("tabDetalleCarrito").setSelectedKey("1");
			} 
		},
		onAfterRendering: function(){
			this.getView().getModel("modelCajaRapida").setProperty("/oDatosDefault/bPantallDetalle", true); 
			sap.ui.core.BusyIndicator.hide();
			var oDatosDefault = this.getView().getModel("modelCajaRapida").getProperty("/oDatosDefault"); 
			var oDocVentaDefault = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta");
			if(!oDocVentaDefault.sCodTipoIdentificacion){
				var oTipoIdentificacionDefault = {};
				var aTipoIdentificacion = this.getView().getModel("modelCajaRapida").getProperty("/aTipoIdentificacion");
				for (let index = 0; index < aTipoIdentificacion.length; index++) {
					const element = aTipoIdentificacion[index];
					if(element.Campo2 === oDatosDefault.sTipoDocIdent){
						oTipoIdentificacionDefault = element;
						break;
					}
				}
				this.getView().getModel("modelCajaRapida").setProperty("/oDocVenta/sCodTipoIdentificacion", oTipoIdentificacionDefault.Codigo);
			}
			if(oDocVentaDefault.sCodTipoDocVenta){
				this.onFnBuscarTipoDocxDocVenta();
			} 
		},
		onPressTabDetalle: function(oEvent){
			var self        = this; 
			var oBinding = this.byId("tabDetalleCarrito").getBinding("items");
			var sKey = oEvent.getParameter("key"); 
			if(sKey === "2"){
				//console.log(self.getView().getModel("modelCajaRapida").getProperty("/oDocVenta"));
				this.getView().byId("txtNumDocCliente").focus();
			}
		},
		btnBuscarCliente:function(){
			var activarBuscar = this.onFnValidarTxtNumIdentificacion();
			if(!activarBuscar){ 
				sap.m.MessageToast.show("El formato de numero de documento no es correcto"); 
				return;
			} 
			var oParam = {};  
			oParam.sNumeroIdentificacion  = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta/sNumDocCliente");
			this.onFnBuscarCliente(oParam);
		},
		onFnBuscarCliente: function(oParamFiltro){
			try{  
				var that        = this; 
				var oParam 		= {};  
            	oParam.sNumeroIdentificacion 	= oParamFiltro.sNumeroIdentificacion; 
				oParam.iCodEstadoCliente 		= 1; 
				sap.ui.core.BusyIndicator.show(0);
				ClienteService.consultarCliente(oParam, function(result) {    
				  if(result.iCode ===1){   
					that.getView().getModel("modelCajaRapida").setProperty("/oClienteVenta", result.oResults[0]); 
				  }else{   
					that.getView().getModel("modelCajaRapida").setProperty("/oClienteVenta", {}); 
					sap.m.MessageToast.show("Cliente no encontado!!"); 
				  } 
				  that.onFnActivarControles();
				  that.getView().getModel("modelCajaRapida").refresh(true);
				  sap.ui.core.BusyIndicator.hide();
				}, that);
			 
				}catch(e){ 
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onFnActivarControles: function(){
			var oTipoDocVentaActual =  this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta/oTipoDocVentaActual");
			if(oTipoDocVentaActual.Campo2 === "02"){  
				this.getView().getModel("modelCajaRapida").setProperty("/oControles/txtApellido", false);  
			}else{
				this.getView().getModel("modelCajaRapida").setProperty("/oControles/txtApellido", true); 
			}
			this.getView().getModel("modelCajaRapida").setProperty("/oControles/bActivar", true); 
		},
		onFnBloquearControles: function(){ 
			this.getView().getModel("modelCajaRapida").setProperty("/oClienteVenta", {});
			this.getView().getModel("modelCajaRapida").setProperty("/oControles/txtApellido", false);  
			this.getView().getModel("modelCajaRapida").setProperty("/oControles/bActivar", false); 
		},
		onFnBuscarTipoDocxDocVenta:function(){
			var oDocVentaDefault = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta");
			var aTipoIdentificacion = this.getView().getModel("modelCajaRapida").getProperty("/aTipoIdentificacion");
			var aTipoDocVenta = this.getView().getModel("modelCajaRapida").getProperty("/aTipoDocVenta");
			
			var aTipoIdentificacionxDocVenta = [];
			var oTipoDocVentaActual = {};
			for (let index = 0; index < aTipoDocVenta.length; index++) {
				const element = aTipoDocVenta[index];
				if(element.Codigo === oDocVentaDefault.sCodTipoDocVenta) {
					oTipoDocVentaActual = element;
					break;
				}
			}
			this.getView().getModel("modelCajaRapida").setProperty("/oDocVenta/oTipoDocVentaActual", oTipoDocVentaActual);
			this.getView().byId("txtNumDocCliente").focus();
			if(oDocVentaDefault.sCodTipoDocVenta){
				aTipoIdentificacion.forEach(function(e){
					if(e.Campo7.includes(oDocVentaDefault.sCodTipoDocVenta)){
						aTipoIdentificacionxDocVenta.push(e);
					}
				});
			} 
			if(aTipoIdentificacionxDocVenta.length === 1){
				this.getView().getModel("modelCajaRapida").setProperty("/oDocVenta/sCodTipoIdentificacion", aTipoIdentificacionxDocVenta[0].Codigo);
				this.getView().getModel("modelCajaRapida").setProperty("/oDocVenta/oTipoIdentificacionActual", aTipoIdentificacionxDocVenta[0]);
				
			}else{
				this.getView().getModel("modelCajaRapida").setProperty("/oDocVenta/sCodTipoIdentificacion", aTipoIdentificacionxDocVenta[aTipoIdentificacionxDocVenta.length - 1].Codigo);
				this.getView().getModel("modelCajaRapida").setProperty("/oDocVenta/oTipoIdentificacionActual", aTipoIdentificacionxDocVenta[aTipoIdentificacionxDocVenta.length - 1]);
			} 
			this.getView().getModel("modelCajaRapida").setProperty("/oDocVenta/sNumDocCliente", "");
			this.getView().getModel("modelCajaRapida").setProperty("/aTipoIdentificacionxDocVenta", aTipoIdentificacionxDocVenta);  
			//this.onChangeTipoIdentificacion();
			this.getView().getModel("modelCajaRapida").refresh(true);
		},
		onChangeTipoDocVenta: function(){
			
			this.onFnBuscarTipoDocxDocVenta();
			this.onFnBloquearControles();
		},
		onLiveChangeNumDoc: function(){
			var oTipoIdentificacionActual = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta/oTipoIdentificacionActual");
			//console.log(oTipoIdentificacionActual.Campo3);
			var txtNumDocCliente = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta/sNumDocCliente");
			if(txtNumDocCliente.length > parseInt(oTipoIdentificacionActual.Campo3)){
				// txtNumDocCliente = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta/sNumDocCliente"); 
				 txtNumDocCliente = txtNumDocCliente.substring(0, parseInt(oTipoIdentificacionActual.Campo3));  
				 this.getView().getModel("modelCajaRapida").setProperty("/oDocVenta/sNumDocCliente", txtNumDocCliente);
			} 
			this.onFnValidarTxtNumIdentificacion(); 
			//this.getView().getModel("modelCajaRapida").refresh(true);
		},
		onFnValidarTxtNumIdentificacion: function(){
			var oTipoIdentificacionActual = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta/oTipoIdentificacionActual");
			//console.log(oTipoIdentificacionActual.Campo3);
			var txtNumDocCliente = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta/sNumDocCliente");
			if(txtNumDocCliente.length === parseInt(oTipoIdentificacionActual.Campo3)){
				this.getView().byId("txtNumDocCliente").setValueState("None");
				this.getView().byId("txtNumDocCliente").removeStyleClass("ErrorInput");
				
				 return true;
			}  
			this.getView().byId("txtNumDocCliente").setValueState("Error");
			this.getView().byId("txtNumDocCliente").addStyleClass("ErrorInput");
			
			return false;
		},
		onChangeTipoIdentificacion: function(){ 
			var oDocVentaDefault = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta");
			if(oDocVentaDefault.sCodTipoIdentificacion){
				var oTipoIdentificacionActual = {}; 
				var aTipoDocVenta = this.getView().getModel("modelCajaRapida").getProperty("/aTipoIdentificacionxDocVenta");  
				for (let index = 0; index < aTipoDocVenta.length; index++) {
					const element = aTipoDocVenta[index];
					 if(element.Codigo === oDocVentaDefault.sCodTipoIdentificacion){
						oTipoIdentificacionActual = element; 
						break;
					 }
				}
				oDocVentaDefault.oTipoIdentificacionActual = oTipoIdentificacionActual;
				this.getView().getModel("modelCajaRapida").refresh(true);
				this.getView().getModel("modelCajaRapida").setProperty("/oDocVenta/sNumDocCliente", "");
				this.onFnBloquearControles();
			}  
		},
		onDlgPagoEfectivo: function(){ 
			
			this.getView().getModel("modelCajaRapida").setProperty("/oPagoEfectivo", {});
			if (!this._oDialogPagoEfectivo) {
				Fragment.load({
					name: "com.telcomdataperu.app.CajaRapida.view.frag.dialog.DlgAddPagoEfectivo",
					controller: this
				}).then(function (oDialog) {
					this._oDialogPagoEfectivo = oDialog;

					this.getView().addDependent(this._oDialogPagoEfectivo);

					this._oDialogPagoEfectivo.open();
					
				}.bind(this));
			} else {
				this._oDialogPagoEfectivo.open();
			}
		},
		onBtnAbrirPagoEfectivo: function(){
			this.onDlgPagoEfectivo(); 
		},
		onCloseDlgAddPagoEfectivo: function(){
			//this._oDialogPagoEfectivo.close();
			this._oDialogPagoEfectivo.destroy();
        	this._oDialogPagoEfectivo = undefined;
		},
		onAgregarPagoEfectivo: function(){
			try {

				var bValidated = UtilValidation.fnValidarCampos(undefined, 'validarGrupoInputPagoEfectivo', undefined);
				if (!bValidated) {
					var mensaje = 'Deben llenarse correctamente los campos obligatorios marcados con  asterisco';
					sap.m.MessageToast.show(mensaje, { duration: 5000, width: "25em" });
					return;
				}

				var oTipoCambio = this.getView().getModel("modelCajaRapida").getProperty("/oTipoCambio"); 
				var oPagoEfectivo = this.getView().getModel("modelCajaRapida").getProperty("/oPagoEfectivo");  
				
				if(!oPagoEfectivo.sMoneda){
					oPagoEfectivo.sMoneda = "PEN";
				} 
				var aPagoCarrito = this.getView().getModel("modelCajaRapida").getProperty("/aPagoCarrito"); 
				if(aPagoCarrito){
					var oNuevoPago = {};
					oNuevoPago.iPosicion	 = aPagoCarrito.length + 1;
					oNuevoPago.sCodFormaPago = "EFE";
					oNuevoPago.sFormaPago 	 = "Efectivo";
					oNuevoPago.sMoneda 		 = oPagoEfectivo.sMoneda;
					oNuevoPago.fImporte 	 = oPagoEfectivo.fImporte;  
					oNuevoPago.fImporteTotal = oPagoEfectivo.fImporte; 
					if(oPagoEfectivo.sMoneda === "USD"){
						oNuevoPago.fImporteTotal = parseFloat(oTipoCambio.Campo1) * oNuevoPago.fImporte;
					}
					
					aPagoCarrito.push(oNuevoPago);
				} 
				this.onFnCalcularCobro();
				this.onCloseDlgAddPagoEfectivo();
				this.getView().getModel("modelCajaRapida").refresh(true); 
			} catch (error) {
				console.log(error);
			}
		}, 
		onDlgPagoTarjeta: function(){ 
			this.getView().getModel("modelCajaRapida").setProperty("/oPagoTarjeta", {});
			this.getView().getModel("modelCajaRapida").setProperty("/oPagoTarjeta/sCodBancoOperador", "01"); 
			if (!this._oDialogPagoTarjeta) {
				Fragment.load({
					name: "com.telcomdataperu.app.CajaRapida.view.frag.dialog.DlgAddPagoTarjeta",
					controller: this
				}).then(function (oDialog) {
					this._oDialogPagoTarjeta = oDialog;

					this.getView().addDependent(this._oDialogPagoTarjeta);

					this._oDialogPagoTarjeta.open();
					
				}.bind(this));
			} else {
				this._oDialogPagoTarjeta.open();
			}
		},
		onBtnAbrirPagoTarjeta: function(){
			this.onDlgPagoTarjeta(); 
		},
		onCloseDlgAddPagoTarjeta: function(){
			//this._oDialogPagoTarjeta.close();
			this._oDialogPagoTarjeta.destroy();
        	this._oDialogPagoTarjeta = undefined;
		},
		onAgregarPagoTarjeta: function(){
			try {

				var bValidated = UtilValidation.fnValidarCampos('validarGrupoSelectPagoTarjeta', 'validarGrupoInputPagoTarjeta', undefined);
				if (!bValidated) {
					var mensaje = 'Deben llenarse correctamente los campos obligatorios marcados con  asterisco';
					sap.m.MessageToast.show(mensaje, { duration: 5000, width: "25em" });
					return;
				}
				var oPagoTarjeta = this.getView().getModel("modelCajaRapida").getProperty("/oPagoTarjeta");  
				
				if(!oPagoTarjeta.sMoneda){
					oPagoTarjeta.sMoneda = "PEN";
				}  
				var aPagoCarrito = this.getView().getModel("modelCajaRapida").getProperty("/aPagoCarrito"); 
				if(aPagoCarrito){
					var aTipoTarjetaVenta = this.getView().getModel("modelCajaRapida").getProperty("/aTipoTarjetaVenta"); 
					var oTarjetaSeleccionado = {};
					for (let index = 0; index < aTipoTarjetaVenta.length; index++) {
						const element = aTipoTarjetaVenta[index];
						if(element.Campo2  === oPagoTarjeta.sCodBancoOperador){
							oTarjetaSeleccionado = element;
							break;
						} 
					}
					var oNuevoPago = {};
					oNuevoPago.iPosicion	 = aPagoCarrito.length + 1;
					oNuevoPago.sCodFormaPago = "TAR";
					oNuevoPago.sFormaPago 	 = "Tarjeta";
					oNuevoPago.sMoneda 		 = oPagoTarjeta.sMoneda;
					oNuevoPago.fImporte 	 = oPagoTarjeta.fImporte;  
					oNuevoPago.fImporteTotal = oPagoTarjeta.fImporte; 
					oNuevoPago.sCodBancoOperador 	 = oPagoTarjeta.sCodBancoOperador; 
					oNuevoPago.sBanco 		 = oTarjetaSeleccionado.Campo1; 
					oNuevoPago.sDigitosTarjeta 		 = oPagoTarjeta.sDigitosTarjeta; 
					oNuevoPago.sNumReferencia 		 = oPagoTarjeta.sNumReferencia; 
					aPagoCarrito.push(oNuevoPago);
				} 
				this.onFnCalcularCobro();
				this.onCloseDlgAddPagoTarjeta();
				this.getView().getModel("modelCajaRapida").refresh(true); 

			} catch (error) {
				console.log(error);
			}
		},
		onDlgPagoAplicacion: function(){ 
			this.getView().getModel("modelCajaRapida").setProperty("/oPagoAplicacion", {}); 
			this.getView().getModel("modelCajaRapida").setProperty("/oPagoAplicacion/sCodBancoOperador", "01")
			if (!this._oDialogPagoAplicacion) {
				Fragment.load({
					name: "com.telcomdataperu.app.CajaRapida.view.frag.dialog.DlgAddPagoAplicacion",
					controller: this
				}).then(function (oDialog) {
					this._oDialogPagoAplicacion = oDialog; 
					this.getView().addDependent(this._oDialogPagoAplicacion); 
					this._oDialogPagoAplicacion.open();
					
				}.bind(this));
			} else {
				this._oDialogPagoAplicacion.open();
			}
		},
		onBtnAbrirPagoAplicacion: function(){
			this.onDlgPagoAplicacion(); 
		},
		onCloseDlgAddPagoAplicacion: function(){
			//this._oDialogPagoAplicacion.close();
			this._oDialogPagoAplicacion.destroy();
        	this._oDialogPagoAplicacion = undefined;
		},
		onAgregarPagoAplicacion: function(){
			try {

				var bValidated = UtilValidation.fnValidarCampos('validarGrupoSelectPagoAplicacion', 'validarGrupoInputPagoAplicacion', undefined);
				if (!bValidated) {
					var mensaje = 'Deben llenarse correctamente los campos obligatorios marcados con  asterisco';
					sap.m.MessageToast.show(mensaje, { duration: 5000, width: "25em" });
					return;
				}

				var oPagoAplicacion = this.getView().getModel("modelCajaRapida").getProperty("/oPagoAplicacion");  
				if(!oPagoAplicacion.sMoneda){
					oPagoAplicacion.sMoneda = "PEN";
				} 
				var aPagoCarrito = this.getView().getModel("modelCajaRapida").getProperty("/aPagoCarrito");
				var aTipoAplicacionVenta = this.getView().getModel("modelCajaRapida").getProperty("/aTipoAplicacionVenta");  
				var oAplicacionSeleccionado = {};
				for (let index = 0; index < aTipoAplicacionVenta.length; index++) {
					const element = aTipoAplicacionVenta[index];
					if(element.Campo2  === oPagoAplicacion.sCodBancoOperador){
						oAplicacionSeleccionado = element;
						break;
					} 
				} 
				var oNuevoPago = {};
					oNuevoPago.iPosicion	 = aPagoCarrito.length + 1;
					oNuevoPago.sCodFormaPago = "APP";
					oNuevoPago.sFormaPago 	 = "Aplicación";
					oNuevoPago.sMoneda 		 = oPagoAplicacion.sMoneda;
					oNuevoPago.fImporte 	 = oPagoAplicacion.fImporte;  
					oNuevoPago.fImporteTotal = oPagoAplicacion.fImporte; 
					oNuevoPago.sCodBancoOperador 	 = oPagoAplicacion.sCodBancoOperador; 
					oNuevoPago.sBanco 		 = oAplicacionSeleccionado.Campo1; 
					 
					oNuevoPago.sNumReferencia 		 = oPagoAplicacion.sNumReferencia; 
					aPagoCarrito.push(oNuevoPago); 
				this.onFnCalcularCobro();
				this.onCloseDlgAddPagoAplicacion();
				this.getView().getModel("modelCajaRapida").refresh(true); 
			} catch (error) {
				console.log(error);
			}
		},
		onSelectProductoCarrito: function(oEvent){
			var sPath			=	oEvent.getSource().getSelectedItem().getBindingContext("modelCajaRapida").sPath; 
			var oProductoSeleccionado		=	JSON.parse(JSON.stringify(this.getView().getModel("modelCajaRapida").getProperty(sPath))) ; 
			oProductoSeleccionado.Accion	= "U"; 
			this.getView().getModel("modelCajaRapida").setProperty("/oControles/btnAgregarCarrito", "Modificar"); 
			this.getView().getModel("modelCajaRapida").setProperty("/oControles/btnMostrarEliminarCarrito", true); 
			this.getView().getModel("modelCajaRapida").setProperty("/oProductoSeleccionado", oProductoSeleccionado); 
			this.getView().getModel("modelCajaRapida").refresh(true);
			this.fnMensajeAgregarProductoCarrito();
			this.getView().byId("listTablaCarrito").removeSelections(true); 
		},
		onPressBtnEliminarPago: function(oEvent){
				var self = this;
				var control     = oEvent.getSource(); 
                var sPath       = control.getBindingContext("modelCajaRapida").getPath(); 
                var seleccion   = self.getView().getModel("modelCajaRapida").getProperty(sPath); 

				sap.ui.core.BusyIndicator.show(0);
				UtilPopUps.messageBox("¿Desea eliminar el pago seleccionadas?", 'c', function(bConfirmacion) {
					if (bConfirmacion) { 
						var aPagoCarrito = JSON.parse(JSON.stringify(self.getView().getModel("modelCajaRapida").getProperty("/aPagoCarrito"))); 
						var aPagosCarritoNuevo = [];
						var iItems = 0;
						aPagoCarrito.forEach(function(e,i){
							if(e.iPosicion !== seleccion.iPosicion){
								iItems = iItems + 1;
								e.iPosicion = iItems;
								aPagosCarritoNuevo.push(e);
							}
						}); 
						self.getView().getModel("modelCajaRapida").setProperty("/aPagoCarrito",aPagosCarritoNuevo);
						self.getView().getModel("modelCajaRapida").refresh(true);  
						self.onFnCalcularCobro();  
						sap.ui.core.BusyIndicator.hide();
					}else{
						sap.ui.core.BusyIndicator.hide();
					  }
				});  
		},
		onLiveChangeNumTarjeta: function(){
			var txtNumTarjetaCliente =  this.getView().getModel("modelCajaRapida").getProperty("/oPagoTarjeta/sDigitosTarjeta");
			if(txtNumTarjetaCliente.length > 4){ 
				txtNumTarjetaCliente = txtNumTarjetaCliente.substring(0, 4);  
				 this.getView().getModel("modelCajaRapida").setProperty("/oPagoTarjeta/sDigitosTarjeta", txtNumTarjetaCliente);
			} 
			this.getView().getModel("modelCajaRapida").refresh(true); 
		}
	});
});
