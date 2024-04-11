/**
 * Helper to be able to define how to get the page specific extension API when writing a controller extension.
 */
declare module "sap/ui/core/mvc/ControllerExtension" {
  import View from "sap/ui/core/mvc/View";
  import Model from "sap/ui/model/Model";
  import AppComponent from "sap/fe/core/AppComponent";

  export default interface ControllerExtension<API> {
    static overrides: unknown;
    base: {
      getExtensionAPI(): API;
      getAppComponent(): AppComponent;
      setModel(model: Model, name: string): void;
      getModel<T>(name?: string): T extends Model ? T : Model;
    };
    getView(): View;
  }
}
