sap.ui.define(
    ["sap/ui/core/mvc/Controller", 
    "sap/ui/core/Component" ],
    function(Controller, Component) {
      "use strict";
  
      return Controller.extend( "com.telcomdataperu.app.Portal.controller.ClienteComponent",
        { 
          onInit: function() {
            if (!Component.get("clientecomp")) {
              Component.create({
                name: "com.telcomdataperu.app.Cliente",
                id: "clientecomp"
              }).then(
                function(Component) {
                  this.getView()
                    .byId("subClienteCtr")
                    .setComponent(Component);
                }.bind(this)
              );
            }
          }
        }
      );
    }
  );
  