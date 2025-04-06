import ExtensionAPI from "sap/fe/templates/ObjectPage/ExtensionAPI";
import Button from "sap/m/Button";
import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";

/**
 * @namespace com.demo.bookshop.admin.ext.controller
 * @controller
 */
export default class ObjectPageExt extends ControllerExtension<ExtensionAPI> {
  static overrides = {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf com.demo.bookshop.admin.ext.controller.ObjectPageExt
     */
    onInit(this: ObjectPageExt) {
      this.setButtonIcon(
        "com.demo.bookshop.admin::BooksObjectPage--fe::CustomAction::shipAsBox",
        "sap-icon://fontawesome/box"
      );
      this.setButtonIcon(
        "com.demo.bookshop.admin::BooksObjectPage--fe::CustomAction::shipAsPallet",
        "sap-icon://fontawesome/pallet"
      );
    }
  };
  setButtonIcon(id: string, iconUrl: string) {
    const shipAsBoxBtn = this.base.getExtensionAPI().byId(id) as Button | undefined;

    if (shipAsBoxBtn) {
      shipAsBoxBtn.setIcon(iconUrl);
    }
  }
}
