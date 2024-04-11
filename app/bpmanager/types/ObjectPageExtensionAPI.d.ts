declare module "sap/fe/templates/ObjectPage/ExtensionAPI" {
  import Context from "sap/ui/model/Context";

  export default interface ExtensionAPI {
    getBindingContext<R extends Context>(): R | null | undefined;
  }
}
