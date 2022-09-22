sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent", 
    '../util/formatter', 
    "../util/utilPopUps",
    '../util/UtilUi',
    "sap/ui/core/Fragment",
    "../servicio/AsignacionCajaService",
  ], function(Controller, History, UIComponent, formatter, UtilPopUps, UtilUi, Fragment, AsignacionCajaService) {
    "use strict";
  
    return Controller.extend("com.telcomdataperu.app.CajaRapida.controller.BaseController", { 
      formatter: formatter,
      onInit:function(){ 
        //console.log(decompilerJwt);
      },
      getRouter: function (ctx) {
        return UIComponent.getRouterFor(ctx);
      }, 
      navigation: function (ctx, name, param) {
        
         var self = this; 
         self.getRouter(ctx).navTo(name, param, true);
        
      } , 
      decompilerJwt: function() {
        var token = localStorage.login;
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
      
        return JSON.parse(JSON.parse(jsonPayload).data);
      },
      onFnCalcularCobro: function(){
        try { 
          var oCarritoVenta = this.getView().getModel("modelCajaRapida").getProperty("/oCarritoVenta");  
          var aPagoCarrito = this.getView().getModel("modelCajaRapida").getProperty("/aPagoCarrito"); 
          var fTotalCorbro = 0;
          aPagoCarrito.forEach(function(e){
            fTotalCorbro = fTotalCorbro + parseFloat(e.fImporteTotal);
          });
          var fTotalxCobrar = oCarritoVenta.fTotalVenta - fTotalCorbro;
          oCarritoVenta.fTotalPorCobrar = 0;
          oCarritoVenta.fTotalVuelto = 0;
          if(fTotalxCobrar > 0){
            oCarritoVenta.fTotalPorCobrar = fTotalxCobrar;
          } 
          if(fTotalxCobrar < 0){
            oCarritoVenta.fTotalVuelto = fTotalxCobrar * -1;
          }
          if(oCarritoVenta.fTotalPorCobrar === 0){
            this.getView().getModel("modelCajaRapida").setProperty("/oControles/btnImprimir", true);
          }else{
            this.getView().getModel("modelCajaRapida").setProperty("/oControles/btnImprimir", false);
          } 
          this.getView().getModel("modelCajaRapida").refresh(true); 
        } catch (error) {
          console.log(error);
        }
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
      onBtnCerrarAgregarProductoCarrito: function(){ 
        try {
          this._oDialogProductoAgregarCarrito.destroy();
         this._oDialogProductoAgregarCarrito = undefined;
        } catch (error) {
          
        }
        
      },
      onBtnAgregarProductoCarrito: function(){
        var self = this;
        var oParam = {};
        sap.ui.core.BusyIndicator.show(0);
        var oProductoSeleccionado = JSON.parse(JSON.stringify(self.getView().getModel("modelCajaRapida").getProperty("/oProductoSeleccionado"))); 
        oProductoSeleccionado.TotalPrecioProducto = oProductoSeleccionado.Cantidad * oProductoSeleccionado.ProductoPrecio.PrecioVenta;
        var aListaCarritoCompra = JSON.parse(JSON.stringify(self.getView().getModel("modelCajaRapida").getProperty("/aCarritoCompra"))); 
        
        var existeProducto = false;
        var oNuevoProductoCarrito = oProductoSeleccionado;
        for (let index = 0; index < aListaCarritoCompra.length; index++) {
          const element = aListaCarritoCompra[index];
          if(element.Codigo ===oProductoSeleccionado.Codigo){ 
           if(oProductoSeleccionado.Accion === "C"){
            element.Cantidad = element.Cantidad + oProductoSeleccionado.Cantidad;
           }else{
            element.Cantidad = oProductoSeleccionado.Cantidad;
           }
             
            element.TotalPrecioProducto = element.Cantidad * element.ProductoPrecio.PrecioVenta;
            existeProducto = true;
            oNuevoProductoCarrito = element;
            break;
          } 
        } 
        if(oNuevoProductoCarrito.Cantidad > oNuevoProductoCarrito.CantidadDisponible){
          sap.m.MessageToast.show("Stock Insuficiente!!"); 
          return;
        } 

        if(!existeProducto){
          oNuevoProductoCarrito.Item = aListaCarritoCompra.length + 1 ;
          aListaCarritoCompra.push(oNuevoProductoCarrito);
        } 
        self.onBtnCerrarAgregarProductoCarrito();
        self.getView().getModel("modelCajaRapida").setProperty("/aCarritoCompra", aListaCarritoCompra);
        self.onFnCalcularPrecioVentaCarrito();
        self.getView().getModel("modelCajaRapida").refresh(true);
         
        self.navigation(self, "cajaRapidaVentaRoute",oParam);
        var listaProductos = sap.ui.getCore().byId("cajarapidacomp---masterCajaRapidaDetailViewId--listTablaCarrito");
        if(listaProductos){
          sap.ui.core.BusyIndicator.hide();
        }
      },
      onFnCalcularPrecioVentaCarrito: function () {
        var self = this; 
        var aListaCarrito = self.getView().getModel("modelCajaRapida").getProperty("/aCarritoCompra");
        var fTotalVenta = 0;
        aListaCarrito.forEach(element => {
          fTotalVenta = fTotalVenta + element.TotalPrecioProducto;
          //console.log(element.TotalPrecioProducto);
        });
        var oTipoCambio = self.getView().getModel("modelCajaRapida").getProperty("/oTipoCambio");  
        var oCarritoVenta = {};
        oCarritoVenta.sMoneda = "PEN";
        oCarritoVenta.fTotalVenta	= fTotalVenta;
        oCarritoVenta.fTotalVentaUSD = UtilUi.redondear2Decimal(fTotalVenta / parseFloat(oTipoCambio.Campo1)); 
        oCarritoVenta.fTotalPorCobrar = fTotalVenta;
        oCarritoVenta.fTotalVuelto = 0;
        self.getView().getModel("modelCajaRapida").setProperty("/oCarritoVenta", oCarritoVenta);
        self.getView().getModel("modelCajaRapida").refresh(true);
        this.onFnCalcularCobro();  
      },
      onBtnEliminarProductoCarrito: function(){
        try {
          var oProductoSeleccionado = this.getView().getModel("modelCajaRapida").getProperty("/oProductoSeleccionado"); 
          var aListaCarrito = JSON.parse(JSON.stringify(this.getView().getModel("modelCajaRapida").getProperty("/aCarritoCompra"))); 
          var aListaCarritoFiltro = []; 
          var j = 1;
          aListaCarrito.forEach(function(e,i){
            if(e.Id !== oProductoSeleccionado.Id){
              e.Item = j;
              aListaCarritoFiltro.push(e);
              j = j + 1;
            }
          });
          this.getView().getModel("modelCajaRapida").setProperty("/aCarritoCompra", aListaCarritoFiltro);
          this.getView().getModel("modelCajaRapida").refresh(true);
          this.onFnCalcularPrecioVentaCarrito();  
          this.onBtnCerrarAgregarProductoCarrito();
        } catch (error) {
          console.log(error);
        }
      },
      onFnLimpiarVenta:function(){
        var self = this;
        
        self.getView().getModel("modelCajaRapida").setProperty("/aProductoDisponible", []);
        self.getView().getModel("modelCajaRapida").setProperty("/oProductoSeleccionado", {}); 
        self.getView().getModel("modelCajaRapida").setProperty("/aCarritoCompra", []);
        
        self.getView().getModel("modelCajaRapida").setProperty("/oCarritoVenta", {}); 
        self.getView().getModel("modelCajaRapida").setProperty("/oClienteVenta", {});
        self.getView().getModel("modelCajaRapida").setProperty("/oDocVenta", {});
        self.getView().getModel("modelCajaRapida").setProperty("/aPagoCarrito", []);
        
        self.onFnCargarTipoIdentificacionDefault();
        self.onFnCargarTipoDocumentoVentaDefault();
        
        self.getView().getModel("modelCajaRapida").refresh(true);
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
      onFnCargarTipoIdentificacionDefault:function(){ 
        this.getView().getModel("modelCajaRapida").setProperty("/oDatosDefault/bPantallDetalle", true);  
			  var oDatosDefault = this.getView().getModel("modelCajaRapida").getProperty("/oDatosDefault"); 
			  var oDocVentaDefault = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta");
			  if(!oDocVentaDefault.sCodTipoIdentificacion){
          var aTipoIdentificacionDefault = [];
          var aTipoIdentificacion = this.getView().getModel("modelCajaRapida").getProperty("/aTipoIdentificacion");
          for (let index = 0; index < aTipoIdentificacion.length; index++) {
            const element = aTipoIdentificacion[index];
            if(element.Campo2 === oDatosDefault.sTipoDocIdent){
              aTipoIdentificacionDefault.push(element);
              break;
            }
          }
          
          this.getView().getModel("modelCajaRapida").setProperty("/oDocVenta/oTipoIdentificacionActual", aTipoIdentificacionDefault[0]);
          this.getView().getModel("modelCajaRapida").setProperty("/aTipoIdentificacionxDocVenta", aTipoIdentificacionDefault);
          this.getView().getModel("modelCajaRapida").refresh();
        }  
      },
      onFnCargarTipoDocumentoVentaDefault:function(){
        //var oDocVentaDefault = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta");
        //if(oDocVentaDefault.sCodTipoDocVenta){
         // return;
        //} 
        var oDatosDefault = this.getView().getModel("modelCajaRapida").getProperty("/oDatosDefault"); 
        var oDocVentaDefault = this.getView().getModel("modelCajaRapida").getProperty("/oDocVenta");
 
			  var aTipoDocVenta = this.getView().getModel("modelCajaRapida").getProperty("/aTipoDocVenta");
        if(!oDocVentaDefault.sCodTipoDocVenta){ 
          var oTipoDocVentaActual = {};
          for (let index = 0; index < aTipoDocVenta.length; index++) {
            const element = aTipoDocVenta[index];
            if(element.Campo2 === oDatosDefault.sTipoDocVenta) {
            oTipoDocVentaActual = element;
            break;
          }
        }
        this.getView().getModel("modelCajaRapida").setProperty("/oDocVenta/oTipoDocVentaActual", oTipoDocVentaActual);

        }
        
        /*this.getView().byId("txtNumDocCliente").focus();
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
*/
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
      }

      
       
    });
  
  });
  