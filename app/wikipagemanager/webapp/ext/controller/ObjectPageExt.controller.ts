import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import ExtensionAPI from "sap/fe/templates/ObjectPage/ExtensionAPI";
import RichTextEditor from "sap/ui/richtexteditor/RichTextEditor";
import VerticalLayout from "sap/ui/layout/VerticalLayout";
import Button from "sap/m/Button";
import MessageToast from "sap/m/MessageToast";

let editor: RichTextEditor;

/**
 * @namespace com.demo.wikipagemanager.ext.controller.ObjectPageExt
 * @controller
 */
export default class ObjectPageExt extends ControllerExtension<ExtensionAPI> {
  static overrides = {
    onPageReady(this: ObjectPageExt) {
      const context = this.base.getView().getBindingContext()?.getObject() as {
        IsActiveEntity: boolean;
      };
      if (context.IsActiveEntity) {
        return;
      }
      if (!editor) {
        const container = this.base
          .getExtensionAPI()
          .byId(
            "fe::CustomSubSection::EditorUsingControllerExtension--editorLayoutContainer"
          ) as VerticalLayout;
        editor = new RichTextEditor("myRTE", {
          value: "{content}",
          visible: "{ui>/isEditable}",
          editable: true,
          required: true,
          customToolbar: true,
          buttonGroups: [
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
          ],
          customButtons: [
            new Button({
              text: "Custom Action",
              press: () =>
                MessageToast.show("Perform some custom editor action...")
            })
          ],
          height: "500px",
          width: "100%"
        });
        container.addContent(editor);
      }
    }
  };
}
