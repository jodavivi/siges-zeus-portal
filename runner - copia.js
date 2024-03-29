sap.ui.require(
  [
    "sap/m/Shell",
    "sap/ui/core/ComponentContainer",
    "sap/ui/core/routing/HashChanger"
  ],
  function(Shell, ComponentContainer, HashChanger) {
    "use strict";
    //Busy application
    sap.ui.core.BusyIndicator.show(0);

    //Set root component at content div
    new Shell({
      class:"prueba44",
      appWidthLimited:false,
      app: new ComponentContainer({
        async: true,
        name: "com.telcomdataperu.app.Portal",
        height: "100%"
      })
    }).placeAt("content");
    var sUrl = window.location.href;
    var aListaUrl = sUrl.split("#");
	console.log(aListaUrl);
    var sUrlActual = "";
    if(aListaUrl.length > 1){
      var aUrl = aListaUrl[1].slice(1, aListaUrl[1].length);
	  console.log(aUrl);
      sUrlActual = aUrl;
    }
    //Set initial view to sub1Component/view1
    HashChanger.getInstance().setHash(sUrlActual);
  }
);
