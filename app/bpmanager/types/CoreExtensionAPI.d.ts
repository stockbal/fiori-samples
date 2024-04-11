declare module "sap/fe/core/ExtensionAPI" {
  import Model from "sap/ui/model/Model";
  export default interface ExtensionAPI {
    getModel<T extends Model>(
      name?: string
    ): T extends Model ? T : Model | undefined;
  }
}
