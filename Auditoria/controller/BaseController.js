sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent", 
    '../util/formatter',
  ], function(Controller, History, UIComponent, formatter) {
    "use strict";
  
    return Controller.extend("com.telcomdataperu.app.Auditoria.controller.BaseController", { 
      formatter: formatter,
      onInit:function(){ 
      },
      getRouter: function (ctx) {
        return UIComponent.getRouterFor(ctx);
      }, 
      navigation: function (ctx, name, param) {
        
         var self = this; 
         self.getRouter(ctx).navTo(name, param, true);
        
      },onNavBack: function (oEvent) {
        var oHistory, sPreviousHash;
        oHistory = History.getInstance();
        sPreviousHash = oHistory.getPreviousHash();
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.getRouter(this).navTo("auditoriaRoute", {}, true /*no history*/);
        }
      }
  
       
    });
  
  });
  