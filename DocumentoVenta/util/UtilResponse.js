sap.ui.define([
], function() {
    "use strict";
    return {
    	iCodeSuccess	: 1,
    	iCodeWarn		: 2,
    	iCodeError		: -1,
    	iCodeException	: -2,
        success: function(sTransaccionId, sMessage, oResults) {
            return {
                iCode		           : this.iCodeSuccess,
                sTransaccionId	   : sTransaccionId,
                sMessage	         : sMessage,
                oResults	         : oResults
            };
        },
        warn: function(sTransaccionId, sMessage, oResults) {
            return {
                iCode		           : this.iCodeWarn,
                sTransaccionId	   : sTransaccionId,
                sMessage	         : sMessage,
                oResults	         : oResults
            };
        },
        error: function(sTransaccionId, sMessage, oResults) {
            return {
                iCode		           : this.iCodeError,
                sTransaccionId	   : sTransaccionId,
                sMessage	         : sMessage,
                oResults	         : oResults
            };
        },
        exception: function(sMessage) {
            return {
                iCode		: this.iCodeException,
                sMessage	: sMessage
            };
        }
    };
});
