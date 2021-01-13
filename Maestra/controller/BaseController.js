sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "../servicio/TablaGenericaService" ,
    '../util/formatter',
  ], function(Controller, History, UIComponent, TablaGenericaService, formatter) {
    "use strict";
  
    return Controller.extend("com.telcomdataperu.app.Maestra.controller.BaseController", { 
      formatter: formatter,
      onInit:function(){ 
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
              aListaMaestro.getModel("modelTablaGenerica").setProperty("/aTablaMaestra", result.oResults);
              aListaMaestro.removeSelections();
              
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
       
    });
  
  });
  