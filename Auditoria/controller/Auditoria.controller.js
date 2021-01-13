sap.ui.define(["sap/ui/core/mvc/Controller"], function(
    Controller,
    formatter
  ) {
    "use strict";
  
    return Controller.extend("com.telcomdataperu.app.Usuario.controller.Usuarios",
      {
        formatter: formatter,
  
        onInit: function() {},
  
        onPressNav2Button: function() {
          this.getOwnerComponent()
            .getRouter()
            .navTo("sub1view2");
        },
  
        onPressNavSub2Button: function() {
          sap.ui
            .getCore()
            .getEventBus()
            .publish("nav", "sub2component:view1");
        }
      }
    );
  });
  