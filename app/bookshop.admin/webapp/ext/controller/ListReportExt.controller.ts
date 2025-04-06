import ExtensionAPI from "sap/fe/templates/ListReport/ExtensionAPI";
import Button from "sap/m/Button";
import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import MDCTable from "sap/ui/mdc/Table";

/**
 * @namespace com.demo.bookshop.admin.ext.controller
 * @controller
 */
export default class ListReportExt extends ControllerExtension<ExtensionAPI> {
  static overrides = {
    onInit(this: ListReportExt) {
      this.setButtonIcon(
        "com.demo.bookshop.admin::BooksList--fe::table::Books::LineItem::CustomAction::shipAsPallet",
        "sap-icon://fontawesome/pallet"
      );
      this.setButtonIcon(
        "com.demo.bookshop.admin::BooksList--fe::table::Books::LineItem::CustomAction::shipAsBox",
        "sap-icon://fontawesome/box"
      );
    }
  };
  setButtonIcon(id: string, iconUrl: string) {
    // NOTE: using extensionApi.byId() will result in an error because the button is regarded as internal API so
    //       we have to use view.byId() instead
    const button = this.getView().byId(id) as Button | undefined;

    if (button) {
      button.setIcon(iconUrl);
    }
  }
}
