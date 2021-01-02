sap.ui.define(
    ["sap/ui/core/mvc/Controller", 
    "sap/ui/core/Component" ],
    function(Controller, Component) {
      "use strict";
  
      return Controller.extend( "com.telcomdataperu.app.Portal.controller.UsuariosComponent",
        { 
          onInit: function() {
            if (!Component.get("sub1Component")) {
              Component.create({
                name: "com.telcomdataperu.app.Usuario",
                id: "sub1Component"
              }).then(
                function(Component) {
                  this.getView()
                    .byId("sub1CmpCtr")
                    .setComponent(Component);
                }.bind(this)
              );
            }
          }
        }
      );
    }
  );
  