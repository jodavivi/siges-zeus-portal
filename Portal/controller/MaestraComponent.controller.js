sap.ui.define(
    ["sap/ui/core/mvc/Controller", 
    "sap/ui/core/Component" ],
    function(Controller, Component) {
      "use strict";
  
      return Controller.extend( "com.telcomdataperu.app.Portal.controller.MaestraComponent",
        { 
          onInit: function() {
            if (!Component.get("sub2Component")) {
              Component.create({
                name: "com.telcomdataperu.app.Maestra",
                id: "sub2Component"
              }).then(
                function(Component) {
                  this.getView()
                    .byId("sub2CmpCtr")
                    .setComponent(Component);
                }.bind(this)
              );
            }
          }
        }
      );
    }
  );
  