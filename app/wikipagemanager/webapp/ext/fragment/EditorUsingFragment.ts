import ExtensionAPI from "sap/fe/core/ExtensionAPI";
import Button from "sap/m/Button";
import MessageToast from "sap/m/MessageToast";
import { RichTextEditor$ReadyEvent } from "sap/ui/richtexteditor/RichTextEditor";

export function onEditorReady(
  this: ExtensionAPI,
  event: RichTextEditor$ReadyEvent
) {
  event.getSource().setButtonGroups([
    {
      name: "font",
      visible: true,
      priority: 10,
      customToolbarPriority: 10,
      buttons: ["fontselect", "fontsizeselect", "forecolor"]
    },
    {
      name: "font-style",
      visible: true,
      priority: 20,
      customToolbarPriority: 20,
      buttons: ["italic", "bold", "underline"]
    }
  ]);

  event
    .getSource()
    .addCustomButton(
      new Button({
        text: "Custom Action",
        press: () => MessageToast.show("Perform some custom editor action...")
      })
    );
}
