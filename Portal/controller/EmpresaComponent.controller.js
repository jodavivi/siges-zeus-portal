sap.ui.define(
    ["sap/ui/core/mvc/Controller", 
    "sap/ui/core/Component" ],
    function(Controller, Component) {
      "use strict";
  
      return Controller.extend( "com.telcomdataperu.app.Portal.controller.EmpresaComponent",
        { 
          onInit: function() {
            if (!Component.get("empresaComponent")) {
              Component.create({
                name: "com.telcomdataperu.app.Empresa",
                id: "empresaComponent"
              }).then(
                function(Component) {
                  this.getView()
                    .byId("empresaCmpCtr")
                    .setComponent(Component);
                }.bind(this)
              );
            }
          }
        }
      );
    }
  );
  