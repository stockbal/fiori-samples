/**
 * Helper to be able to define how to get the page specific extension API when writing a controller extension.
 */
declare module "sap/ui/core/mvc/ControllerExtension" {
  import View from "sap/ui/core/mvc/View";
  export default class ControllerExtension<API> {
    static overrides: unknown;
    getView(): View;
    base: {
      getExtensionAPI(): API;
    };
  }
}
