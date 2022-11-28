sap.ui.define(
    ["sap/ui/core/mvc/Controller", 
    "sap/ui/core/Component" ],
    function(Controller, Component) {
      "use strict";
  
      return Controller.extend( "com.telcomdataperu.app.Portal.controller.DocumentoVentaComponent",
        { 
          onInit: function() {
            if (!Component.get("documentoventacomp")) {
              Component.create({
                name: "com.telcomdataperu.app.DocumentoVenta",
                id: "documentoventacomp"
              }).then(
                function(Component) {
                  this.getView()
                    .byId("documentoVentaCtr")
                    .setComponent(Component);
                }.bind(this)
              );
            }
          }
        }
      );
    }
  );
  