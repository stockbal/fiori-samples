import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import ExtensionAPI from "sap/fe/templates/ObjectPage/ExtensionAPI";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace bpprocessor.ext.controller
 * @controller
 */
export default class ObjectPageExt extends ControllerExtension<ExtensionAPI> {
  static overrides = {
    onInit(this: ObjectPageExt) {
      // init code
    },
    onPageReady(this: ObjectPageExt): void {
      // reset model for upload set control (e.g. count of selected items)
      (this.base.getModel("upload") as JSONModel).setData({});
    },
  };
}
