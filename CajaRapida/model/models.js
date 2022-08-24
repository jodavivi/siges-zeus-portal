sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		modelCajaRapida:function(){
			var oParam                       = {}; 
			oParam.oCajaApertura        	 = {};
			oParam.oTipoCambio		         = {}; 
			oParam.aProductoDisponible       = []; 
			oParam.oProductoSeleccionado     = {}; 
			oParam.oCarritoVenta     		 = {};
			oParam.oClienteVenta     		 = {};
			oParam.oDocVenta     		 	 = {};
			oParam.aPagoCarrito    		 	 = [];
			oParam.oPagoEfectivo			 = {};
			oParam.oPagoTarjeta			 	 = {};
			oParam.oPagoAplicacion		 	 = {};
			oParam.aTipoIdentificacion		 = []; 
			oParam.aTipoAplicacionVenta		 = []; 
			oParam.aTipoIdentificacionxDocVenta	 = []; 
			oParam.aTipoDocVenta			 = []; 
			oParam.aTipoTarjetaVenta		 = []; 
			oParam.aCarritoCompra		     = []; 
			oParam.oControles     		 	 = {};
			oParam.oDatosDefault			 = {};
			oParam.oDatosDefault.sTipoDocVenta	= "01";
			oParam.oDatosDefault.sTipoDocIdent	= "01";
			oParam.oDatosDefault.sFiltroProducto	= 1;
			oParam.oDatosDefault.sFiltroProductoDesc	= "Buscar x Codigo de Barras";
			oParam.oControles.txtApellido    	= false;
			oParam.oControles.bActivar    		= false; 
			oParam.oControles.btnAgregarCarrito = "Agregar";
			oParam.oControles.btnImprimir  		= false; 
			oParam.oControles.btnMostrarEliminarCarrito = false;
			var oModel                       = new JSONModel(oParam);
			return oModel;
		  },
		  modelPermisosApp:function(){
			  var oParam           = {};
			  oParam.sPermisosApp  = ""; 
			  oParam.sBtnMaestroRegistrar 	 = 'C0000005';
			  oParam.sBtnMaestroEliminar  	 = 'C0000006';
			  oParam.sBtnMaestroActualizar 	 = 'C0000007';
			  oParam.sBtnParametroRegistrar  = 'C0000008';
			  oParam.sBtnParametroEditar  	 = 'C0000009';
			  oParam.sBtnParametroEliminar   = 'C0000010';
			  var oModel           = new JSONModel(oParam);
			  return oModel;
			}

	};
});