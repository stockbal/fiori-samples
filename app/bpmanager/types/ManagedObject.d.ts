declare module "sap/ui/base/ManagedObject" {
  import Context from "sap/ui/model/Context";
  import Binding from "sap/ui/model/Binding";

  export default interface ManagedObject {
    getParent<T extends ManagedObject>(): T | null;
    getBindingContext<T extends Context>(
      modelName?: string
    ): T | null | undefined;
    getBinding<R extends Binding>(name: string): R | undefined;
  }
}
