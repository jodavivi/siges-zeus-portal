sap.ui.define(
    ["sap/ui/core/mvc/Controller", 
    "sap/ui/core/Component" ],
    function(Controller, Component) {
      "use strict";
  
      return Controller.extend( "com.telcomdataperu.app.Portal.controller.ProductoCategoriaComponent",
        { 
          onInit: function() {
            if (!Component.get("productocategoriacomp")) {
              Component.create({
                name: "com.telcomdataperu.app.ProductoCategoria",
                id: "productocategoriacomp"
              }).then(
                function(Component) {
                  this.getView()
                    .byId("productocategoriaCtr")
                    .setComponent(Component);
                }.bind(this)
              );
            }
          }
        }
      );
    }
  );
  