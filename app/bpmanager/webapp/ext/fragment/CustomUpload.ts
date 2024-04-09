import ExtensionAPI from "sap/fe/templates/ObjectPage/ExtensionAPI";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import UploadSet, {
  UploadSet$AfterItemAddedEvent,
  UploadSet$AfterItemRemovedEvent,
  UploadSet$UploadCompletedEvent
} from "sap/m/upload/UploadSet";
import Context from "sap/ui/model/odata/v4/Context";

import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Title from "sap/m/Title";

export function getUploadSetControl(extApi: ExtensionAPI) {
  return extApi.byId(
    "bpmanager::BusinessPartnersObjectPage--fe::CustomSubSection::CustomUpload--AttachmentUploadSet"
  ) as UploadSet;
}

export function refreshUploadSetTitle(extApi: ExtensionAPI) {
  const uploadSetTitle = extApi.byId(
    "bpmanager::BusinessPartnersObjectPage--fe::CustomSubSection::CustomUpload--AttachmentUploadSetTitle"
  ) as Title;
  if (uploadSetTitle) {
    uploadSetTitle.getBinding("text")?.refresh();
  }
}

function updateSelectionCount(extApi: ExtensionAPI) {
  const uploadSet = getUploadSetControl(extApi);

  (extApi.getModel("upload") as JSONModel).setProperty(
    "/uploadSetSelection",
    uploadSet.getSelectedItems().length
  );
}

export default {
  async onAfterItemAdded(
    this: ExtensionAPI,
    event: UploadSet$AfterItemAddedEvent
  ) {
    const uploadItem = event.getParameter("item");
    if (!uploadItem) {
      return;
    }
    const context = this.getBindingContext() as Context;
    if (!context) {
      return;
    }

    // - using the "items" binding from the UploadSet produces duplicate entries (further analysis needed???)
    // - using the "context" during "bindList" works only if the object page is already loaded in the draft state
    //   otherwise an exception is thrown because of a path missmatch (-> analyze fiori elements framework how ODataListBinding's are created for table facets)
    const attachmentBinding = this.getModel()?.bindList(
      `${context.getPath()}/attachments`
    ) as ODataListBinding;

    const attachmentContext = attachmentBinding.create({
      fileName: uploadItem.getFileName()
    });

    await attachmentContext.created();

    let serviceUrl = (this.getModel() as ODataModel).getServiceUrl();
    if (serviceUrl.charAt(serviceUrl.length - 1) === "/") {
      serviceUrl = serviceUrl.substring(0, serviceUrl.length - 1);
    }

    // apply created context to the upload item and set upload url for
    uploadItem.setBindingContext(attachmentContext);
    uploadItem.bindProperty("fileName", { path: "fileName" });
    uploadItem.bindProperty("url", { path: "content" });

    // .bindProperty does not work here
    uploadItem.setUploadUrl(
      serviceUrl + attachmentContext.getPath() + "/content"
    );

    // perform actual upload
    (uploadItem.getParent() as UploadSet).uploadItem(uploadItem);
  },

  onUploadCompleted(this: ExtensionAPI, event: UploadSet$UploadCompletedEvent) {
    const uploadItem = event.getParameter("item");
    if (!uploadItem) {
      return;
    }
    refreshUploadSetTitle(this);
  },

  /*
   * Updates JSON property with current count of attachments to enable/disable delete button
   */
  async onSelectionChanged(this: ExtensionAPI) {
    if (!(this.getModel("ui") as JSONModel).getProperty("/isEditable")) {
      return;
    }

    updateSelectionCount(this);
  },

  async onMultiDelete(this: ExtensionAPI) {
    const uploadSet = getUploadSetControl(this);

    MessageBox.confirm(
      (this.getModel("i18n") as ResourceModel).getProperty(
        "delete_selected_dialog_title"
      ) ?? "Delete selected Attachments?",
      {
        onClose: async (answer: string) => {
          if (answer === MessageBox.Action.OK) {
            // rebuilt from single delete action of "UploadSet"
            uploadSet.getSelectedItems().forEach((it) => {
              uploadSet.removeItem(it);
              uploadSet.removeIncompleteItem(it);
              uploadSet.fireAfterItemRemoved({ item: it });
            });
          }
        }
      }
    );
  },

  /*
   * Handles afterItemRemoved event to trigger the deletion in the service
   */
  async onItemRemoved(
    this: ExtensionAPI,
    event: UploadSet$AfterItemRemovedEvent
  ) {
    const item = event.getParameter("item");
    if (item) {
      const itemContext = <Context>item.getBindingContext();
      if (itemContext) {
        await itemContext.delete();

        refreshUploadSetTitle(this);
        updateSelectionCount(this);
      }
    }
  }
};
