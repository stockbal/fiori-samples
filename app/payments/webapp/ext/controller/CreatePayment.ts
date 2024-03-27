import ExtensionAPI from "sap/fe/core/ExtensionAPI";
import Context from "sap/ui/model/odata/v4/Context";
import Dialog from "sap/m/Dialog";
import Button from "sap/m/Button";
import JSONModel from "sap/ui/model/json/JSONModel";
import Messaging from "sap/ui/core/Messaging";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

function modelPropertyChanged() {
  Messaging.removeAllMessages();
}

export async function createPayment(this: ExtensionAPI, pageContext: Context) {
  const model = this.getModel() as ODataModel;

  const dialog = (await this.loadFragment({
    id: "fragmentThree",
    name: "payments.ext.fragment.NewPayment",
    controller: this,
    contextPath: "/Payments",
  })) as Dialog;

  dialog.attachEventOnce("afterClose", () => {
    dialog.destroy();
    model.detachPropertyChange(modelPropertyChanged);
  });
  dialog.setEndButton(
    new Button({
      text: "Close",
      press: () => dialog.close(),
    })
  );

  model.attachPropertyChange(modelPropertyChanged);

  (this.getModel("ui") as JSONModel).setProperty("/isEditable", true);

  // REMARK: normally the ID for the payment entity would not be hardcoded here :)
  dialog.bindElement({
    path: `/Payments(c105b04a-307f-4972-9771-ec112a3238ff)`,
  });

  Messaging.removeAllMessages();
  dialog.open();
}
