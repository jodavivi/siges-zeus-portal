sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "../controller/BaseController", 
  "../servicio/AuditoriaService",
], function( Controller, BaseController,  AuditoriaService ) {
    "use strict";
  
    return BaseController.extend("com.telcomdataperu.app.Auditoria.controller.Auditoria",
      {
  
        onInit: function() {
          var self = this; 
			    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.getRoute("auditoriaRoute").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched:function(){
          var sFechaActual = new Date().toISOString().split("T"); 
          var oParam =  {};
          oParam.iLimit  = 15;
          this.fnCargarAuditoria(oParam);
          this.onCargarAplicacion();
        }, 
        fnCargarAuditoria:function(oParam){
          try{
            sap.ui.core.BusyIndicator.show(0);
            var self        = this;
            var oParamAuditoria 		= oParam; 
            AuditoriaService.consultarAuditoria(oParamAuditoria, function(result) {  
              sap.ui.core.BusyIndicator.hide(); 
              if(result.iCode ===1){ 
                self.getView().getModel("modelAuditoria").setProperty("/aAuditoria",result.oResults);  
              }else{
                self.getView().getModel("modelAuditoria").setProperty("/aAuditoria",[]);  
              } 
            }, self);
   
          }catch(e){
            sap.ui.core.BusyIndicator.hide();
            console.log(e);
          }
      },
      onPressDetalleTransaccion: function(oEvent) {
        var bindingContext = oEvent.getSource().getBindingContext("modelAuditoria");
        var path = bindingContext.getPath();
        var oAuditoria = bindingContext.getModel().getProperty(path); 
        this.getView().getModel("modelAuditoria").setProperty("/oAuditoriaDetalle",oAuditoria);  
        var oParam = {};
        oParam.auditoriaId = oAuditoria.Id;
        this.navigation(this, "auditoriaDetalleRoute",oParam); 
      },
      onCargarAplicacion:function(){
        try{
          sap.ui.core.BusyIndicator.show(0);
          var self        = this;
          var oParam 		= {}; 
          AuditoriaService.consultarAplicacion(oParam, function(result) {  
            sap.ui.core.BusyIndicator.hide(); 
            if(result.iCode ===1){ 
              self.getView().getModel("modelAuditoria").setProperty("/aListaAplicacion",result.oResults);  
            }else{
              self.getView().getModel("modelAuditoria").setProperty("/aListaAplicacion",[]);  
            } 
          }, self);
 
        }catch(e){
          sap.ui.core.BusyIndicator.hide();
          console.log(e);
        }
      },
      onCargarProcesosxAplicacion:function(sAplicacion){
        try{
          sap.ui.core.BusyIndicator.show(0);
          var self        = this;
          var oParam 		= {}; 
          oParam.sAplicacion = sAplicacion;
          AuditoriaService.consultarProceso(oParam, function(result) {  
            sap.ui.core.BusyIndicator.hide(); 
            console.log(result);
            if(result.iCode ===1){ 
              self.getView().getModel("modelAuditoria").setProperty("/aListaProceso",result.oResults);  
              self.fnActivarProceso(self);
            }else{
              self.getView().getModel("modelAuditoria").setProperty("/aListaProceso",[]);  
            } 
          }, self);
 
        }catch(e){
          sap.ui.core.BusyIndicator.hide();
          console.log(e);
        }
      },
      fnActivarProceso:function(oEvent){
        try{ 
          var self = this; 
          this.getView().byId("procesoInput").setEnabled(true);
          this.getView().byId("procesoInput").setValue(""); 
        }catch(e){
          sap.ui.core.BusyIndicator.hide();
          console.log(e);
        }
      },
      onPressBuscarAuditoria:function(oEvent){
        try {
            // Captura de filtros
            var sTransaccion   = this.getView().byId("transaccionInput").getValue();
            var sAplicacion    = this.getView().byId("aplicacionInput").getValue();
			      var sNombreProceso = this.getView().byId("procesoInput").getValue();
            var dFechaInicioFin = this.getView().byId("fechaInicioFin").getValue();
            var sEstado         =  this.getView().byId("idEstado").getSelectedKey() ;
            var dFechaInicio = "";
            var dFechaFin = "";
            var iLimit    = "";
            if(dFechaInicioFin !== undefined && dFechaInicioFin !== null  && dFechaInicioFin !== ""){
              var aLista = dFechaInicioFin.split(" ");
              var fInicio = aLista[0].split("/");
              var fFinal  = aLista[2].split("/");
              dFechaInicio = fInicio[2] +"-" + fInicio[1]+"-"+fInicio[0];
              dFechaFin    = fFinal[2] +"-" + fFinal[1]+"-"+fFinal[0]; 
            } 
            if(sEstado=== undefined || sEstado === null || sEstado === "" || sEstado === "ALL"){
              sEstado = "";
            }
            var oParam = {};
            oParam.sTransaccionId = sTransaccion;
            oParam.sAplicacion    = sAplicacion;
            oParam.sNombreProceso = sNombreProceso;
            oParam.dFechaInicio   = dFechaInicio;
            oParam.dFechaFin      = dFechaFin;
            oParam.iLimit         = iLimit;
            oParam.sEstado        = sEstado;
            this.fnCargarAuditoria(oParam); 
        } catch (error) {
            sap.ui.core.BusyIndicator.hide();
            console.log(e);
        }
      },
      onPressLimpiarFiltros:function(){
        try { 
          this.getView().byId("transaccionInput").setValue(""); 
          this.getView().byId("aplicacionInput").setValue("");
          this.getView().byId("procesoInput").setValue("");
          this.getView().byId("fechaInicioFin").setValue("");
          this.getView().byId("idEstado").setSelectedKey("ALL") ;  
          this.getView().byId("procesoInput").setEnabled(false); 
          var oParam =  {};
          oParam.iLimit = 15; 
          this.fnCargarAuditoria(oParam); 
      } catch (error) {
          sap.ui.core.BusyIndicator.hide();
          console.log(e);
      }
      },
      showDialAplicaciones: function(oEvent) {
        var sInputValue = oEvent.getSource().getValue();
        this.inputId = oEvent.getSource().getId();
        var oView = this.getView();
        var oDialog = oView.byId("dlgAplicaciones");
  
        if (!oDialog) {
          oDialog = sap.ui.xmlfragment(oView.getId(),
            "com.telcomdataperu.app.Auditoria.view.frag.Aplicaciones",
            this
          );
          oView.addDependent(oDialog);
        }
        oDialog.open();
      },
      _handleCerrarAplicaciones: function(evt) {
        var oSelectedItem	=	evt.getParameter("selectedItem");
        if (oSelectedItem) { 
          var seleccion		=	oSelectedItem.getBindingContext("modelAuditoria").getProperty(); 
          var aplicacionInput = this.getView().byId(this.inputId);
          aplicacionInput.setValue(oSelectedItem.getTitle());
          this.onCargarProcesosxAplicacion(seleccion.Aplicacion);
        }
        evt.getSource().getBinding("items").filter([]); 
      },
      showDialProceso: function(oEvent) {
        var sInputValue = oEvent.getSource().getValue();
        this.inputId = oEvent.getSource().getId();
  
        var oView = this.getView();
        var oDialog = oView.byId("dlgProcesos");
  
        if (!oDialog) {
          oDialog = sap.ui.xmlfragment(oView.getId(),
            "com.telcomdataperu.app.Auditoria.view.frag.Procesos",
            this
          );
          this.getView().addDependent(oDialog);
        }
        oDialog.open();
      },
      _handleBuscarProceso: function(evt) {
        var sQuery = evt.getParameter("value");
        var sQueryLower =	sQuery.toLowerCase();
        var sQueryUpper =	sQuery.toUpperCase();
        var FilterTotal =	new Filter([], false);
        
        if (sQuery && sQuery.length > 0) {
          var sQueryUpLow 			=	sQuery[0].toUpperCase() + sQuery.substr(1).toLowerCase();
          var filtroPedido			=	new Filter("NombreProceso",		FilterOperator.Contains,	sQueryLower);
          FilterTotal.aFilters.push(filtroPedido);
          var filtroPedido1			=	new Filter("NombreProceso",		FilterOperator.Contains,	sQueryUpper);
          FilterTotal.aFilters.push(filtroPedido1);
          var filtroPedido2			=	new Filter("NombreProceso",		FilterOperator.Contains,	sQueryUpLow);
          FilterTotal.aFilters.push(filtroPedido2);
          evt.getSource().getBinding("items").filter(FilterTotal);
        } else {
          evt.getSource().getBinding("items").filter();
        }
      },
      _handleCerrarProceso: function(evt) {
        var oSelectedItem = evt.getParameter("selectedItem");
        if (oSelectedItem) {
          var procesoInput = this.getView().byId(this.inputId);
          procesoInput.setValue(oSelectedItem.getTitle());
        }
        evt.getSource().getBinding("items").filter([]);
        
      
      }
  
  
  
   
    }
  );
});
