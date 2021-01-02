sap.ui.define(
    ["sap/ui/core/mvc/Controller", 
    "sap/ui/core/Component" ],
    function(Controller, Component) {
      "use strict";
  
      return Controller.extend( "com.telcomdataperu.app.Portal.controller.AccesoComponent",
        { 
          onInit: function() {
            if (!Component.get("sub2Component")) {
              Component.create({
                name: "com.telcomdataperu.app.Acceso",
                id: "subAppAcceso"
              }).then(
                function(Component) {
                  this.getView()
                    .byId("subCmpAcceso")
                    .setComponent(Component);
                }.bind(this)
              );
            }
          }
        }
      );
    }
  );
  