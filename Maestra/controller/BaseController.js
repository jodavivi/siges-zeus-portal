sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent", 
    '../util/formatter',
    "../servicio/TablaGenericaService" ,
    "../util/utilPopUps",
  ], function(Controller, History, UIComponent, formatter, TablaGenericaService, UtilPopUps) {
    "use strict";
  
    return Controller.extend("com.telcomdataperu.app.Maestra.controller.BaseController", { 
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
        
      },
      fnCargarTabla:function(self){
        try{
          sap.ui.core.BusyIndicator.show(0);
          var that        = self;
          var oParam 		= {}; 
          TablaGenericaService.consultarTablaGenerica(oParam, function(result) {  
            sap.ui.core.BusyIndicator.hide();
            if(result.iCode ===1){ 
              var itemSelecionado = {};
              that.getView().getModel("modelTablaGenerica").setProperty("/aTablaMaestra",result.oResults); 
              
              var aListaMaestro = sap.ui.getCore().byId("__xmlview0--listTablaMaestra");
              try {
                aListaMaestro.getModel("modelTablaGenerica").setProperty("/aTablaMaestra", result.oResults);
              } catch (error) {
                console.log(error);
              } 
              try {
                aListaMaestro.removeSelections();
              } catch (error) {
                console.log(error);
              }
              
              
              for (let index = 0; index < aListaMaestro.getItems().length; index++) {
                const p = aListaMaestro.getItems()[index];
                var sPath       =   p.getBindingContextPath();
                var seleccion   =   that.getView().getModel("modelTablaGenerica").getProperty(sPath); 
                if (seleccion.Id   === parseInt(that.getView().getModel("modelTablaGenerica").getProperty("/oTablaSeleccionada/Id"), 10)){
                   itemSelecionado =   p;
                   break;
                 }
              } 
                if (itemSelecionado){ 
                  // if (modelGlobal.getProperty("/conSeleccion")    === true){
                    aListaMaestro.setSelectedItem(itemSelecionado);
                  // }
                }
            }else{
              UtilPopUps.validarRespuestaServicio(result,'',function(e){});
            }
          }, that);
   
          }catch(e){
            sap.ui.core.BusyIndicator.hide();
            console.log(e);
          }
      }, 
      decompilerJwt: function() {
        var token = localStorage.login;
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
      
        return JSON.parse(JSON.parse(jsonPayload).data);
      },
       
    });
  
  });
  