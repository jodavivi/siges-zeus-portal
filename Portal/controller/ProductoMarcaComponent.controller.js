sap.ui.define(
    ["sap/ui/core/mvc/Controller", 
    "sap/ui/core/Component" ],
    function(Controller, Component) {
      "use strict";
  
      return Controller.extend( "com.telcomdataperu.app.Portal.controller.ProductoMarcaComponent",
        { 
          onInit: function() {
            if (!Component.get("productomarcacomp")) {
              Component.create({
                name: "com.telcomdataperu.app.ProductoMarca",
                id: "productomarcacomp"
              }).then(
                function(Component) {
                  this.getView()
                    .byId("productomarcaCtr")
                    .setComponent(Component);
                }.bind(this)
              );
            }
          }
        }
      );
    }
  );
  