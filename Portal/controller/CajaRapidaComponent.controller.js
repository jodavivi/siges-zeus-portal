sap.ui.define(
    ["sap/ui/core/mvc/Controller", 
    "sap/ui/core/Component" ],
    function(Controller, Component) {
      "use strict";
  
      return Controller.extend( "com.telcomdataperu.app.Portal.controller.CajaRapidaComponent",
        { 
          onInit: function() {
            if (!Component.get("cajarapidacomp")) {
              Component.create({
                name: "com.telcomdataperu.app.CajaRapida",
                id: "cajarapidacomp"
              }).then(
                function(Component) {
                  this.getView()
                    .byId("cajaRapidaCmpCtr")
                    .setComponent(Component);
                }.bind(this)
              );
            }
          }
        }
      );
    }
  );
  