declare module "sap/fe/core/ExtensionAPI" {
  import Model from "sap/ui/model/Model";
  import UI5Element from "sap/ui/core/Element";

  export default interface ExtensionAPI {
    byId<R extends UI5Element>(id: string): R | undefined;
    getModel<T extends Model>(
      name?: string
    ): T extends Model ? T : Model | undefined;
  }
}
