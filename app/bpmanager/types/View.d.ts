declare module "sap/ui/core/mvc/View" {
  import UI5Element from "sap/ui/core/Element";
  import Model from "sap/ui/model/Model";

  export default interface View {
    getModel<T extends Model>(
      name?: string
    ): T extends Model ? T : Model | undefined;
    byId<R extends UI5Element>(id: string): R | undefined;
  }
}
