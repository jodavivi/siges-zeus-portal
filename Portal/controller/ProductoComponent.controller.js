sap.ui.define(
    ["sap/ui/core/mvc/Controller", 
    "sap/ui/core/Component" ],
    function(Controller, Component) {
      "use strict";
  
      return Controller.extend( "com.telcomdataperu.app.Portal.controller.ProductoComponent",
        { 
          onInit: function() {
            if (!Component.get("productocomp")) {
              Component.create({
                name: "com.telcomdataperu.app.Producto",
                id: "productocomp"
              }).then(
                function(Component) {
                  this.getView()
                    .byId("productoCtr")
                    .setComponent(Component);
                }.bind(this)
              );
            }
          }
        }
      );
    }
  );
  