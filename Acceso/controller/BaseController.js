sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent", 
    '../util/formatter' 
  ], function(Controller, History, UIComponent, formatter) {
    "use strict";
  
    return Controller.extend("com.telcomdataperu.app.Acceso.controller.BaseController", { 
      formatter: formatter,
      onInit:function(){ 
      },
      getRouter: function (ctx) {
        return UIComponent.getRouterFor(ctx);
      }, 
      navigation: function (ctx, name, param) { 
         var self = this; 
         self.getRouter(ctx).navTo(name, param, true);
        
      } 
    });
  
  });
  