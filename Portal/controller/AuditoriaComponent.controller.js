sap.ui.define(
    ["sap/ui/core/mvc/Controller", 
    "sap/ui/core/Component" ],
    function(Controller, Component) {
      "use strict";
  
      return Controller.extend( "com.telcomdataperu.app.Portal.controller.AuditoriaComponent",
        { 
          onInit: function() {
            if (!Component.get("subAuditoria")) {
              Component.create({
                name: "com.telcomdataperu.app.Auditoria",
                id: "subAuditoria"
              }).then(
                function(Component) {
                  this.getView()
                    .byId("subAuditoriaCtr")
                    .setComponent(Component);
                }.bind(this)
              );
            }
          }
        }
      );
    }
  );
  