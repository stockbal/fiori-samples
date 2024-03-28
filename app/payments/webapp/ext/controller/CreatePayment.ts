import ExtensionAPI from "sap/fe/core/ExtensionAPI";
import Dialog from "sap/m/Dialog";
import Button from "sap/m/Button";
import JSONModel from "sap/ui/model/json/JSONModel";
import Messaging from "sap/ui/core/Messaging";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import MessageView from "sap/m/MessageView";
import MessageItem from "sap/m/MessageItem";
import { Model$PropertyChangeEvent } from "sap/ui/model/Model";
import Message from "sap/ui/core/message/Message";

function modelPropertyChanged(event: Model$PropertyChangeEvent) {
  const path = event.getParameter("path") as string;
  let messages = (Messaging.getMessageModel().getData() ?? []) as Message[];

  // only remove messages that match the given path
  const matchingMessages = messages.filter((m) =>
    m.getTargets().some((t) => t === path || t.endsWith(path))
  );

  if (matchingMessages.length > 0) {
    Messaging.removeMessages(matchingMessages);
  }
}

function showMessageDialog() {
  let messageDialog: Dialog;
  messageDialog = new Dialog({
    title: "Messages",
    contentHeight: "25%",
    contentWidth: "25%",
    verticalScrolling: false,
    content: new MessageView({
      items: {
        path: "/",
        template: new MessageItem({
          type: "{type}",
          title: "{message}"
        })
      },
    }),
    endButton: new Button({
      text: "Close",
      press: () => messageDialog.close()
    })
  });
  messageDialog.setModel(Messaging.getMessageModel());
  messageDialog.open();
}

function removeDuplicateMessages(messages: Message[]) {
  const uniqueMessages = [] as Message[];
  messages.forEach((m) => {
    if (
      !uniqueMessages.some(
        (um) =>
          m.getTargets().some((t) => um.getTargets().includes(t)) &&
          m.getMessage() === um.getMessage()
      )
    ) {
      uniqueMessages.push(m);
    }
  });
  if (uniqueMessages.length !== messages.length) {
    Messaging.updateMessages(messages, uniqueMessages);
  }
}

export async function createPayment(this: ExtensionAPI) {
  const model = this.getModel() as ODataModel;

  const dialog = (await this.loadFragment({
    id: "fragmentThree",
    name: "payments.ext.fragment.NewPayment",
    controller: this,
    contextPath: "/Payments"
  })) as Dialog;

  dialog.attachEventOnce("afterClose", () => {
    dialog.destroy();
    model.detachPropertyChange(modelPropertyChanged);
  });
  dialog.setBeginButton(
    new Button({
      text: "Submit",
      type: "Emphasized",
      press: () => {
        const messages = Messaging.getMessageModel().getData() as Message[];

        if (messages?.length > 0) {
          removeDuplicateMessages(messages);
          showMessageDialog();
          return;
        }
        dialog.close();
      }
    })
  );
  dialog.setEndButton(
    new Button({
      text: "Close",
      press: () => dialog.close()
    })
  );

  model.attachPropertyChange(modelPropertyChanged);

  (this.getModel("ui") as JSONModel).setProperty("/isEditable", true);

  // REMARK: normally the ID for the payment entity would not be hardcoded here :)
  dialog.bindElement({
    path: "/Payments(c105b04a-307f-4972-9771-ec112a3238ff)"
  });

  Messaging.removeAllMessages();
  dialog.open();
}
