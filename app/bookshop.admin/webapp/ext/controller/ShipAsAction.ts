import ExtensionAPI from "sap/fe/core/ExtensionAPI";
import Context from "sap/ui/model/odata/v4/Context";
import MessageToast from "sap/m/MessageToast";

export function onShipAsPallet(this: ExtensionAPI, pageContext: Context) {
  MessageToast.show("Ship as pallet");
}

export function onShipAsBox(this: ExtensionAPI, pageContext: Context) {
  MessageToast.show("Ship as box");
}
