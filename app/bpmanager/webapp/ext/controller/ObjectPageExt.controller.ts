import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import ExtensionAPI from "sap/fe/templates/ObjectPage/ExtensionAPI";
import JSONModel from "sap/ui/model/json/JSONModel";
import UploadHelper from "../util/UploadHelper";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import {
  getUploadSetControl,
  refreshUploadSetTitle
} from "../fragment/CustomUpload";

let attachmentUtil: UploadHelper;

function initUploadModel(ext: ControllerExtension<ExtensionAPI>) {
  const uploadModel = ext.base.getModel<JSONModel>("upload");
  if (!uploadModel) {
    return;
  }

  let modelData = uploadModel.getData();
  if (!("title" in modelData)) {
    // defines calculated property
    Object.defineProperty(modelData, "title", {
      get: () => {
        const uploadSet = getUploadSetControl(ext.base.getExtensionAPI());

        return `${ext.base
          .getModel<ResourceModel>("i18n")
          .getProperty("attachments_title")} (${
          uploadSet.getItems().length ?? 0
        })`;
      }
    });
    uploadModel.setData(modelData);
  } else {
    uploadModel.setProperty("/uploadSetSelection", 0);
  }
}

/**
 * @namespace bpmanager.ext.controller
 * @controller
 */
export default class ObjectPageExt extends ControllerExtension<ExtensionAPI> {
  static overrides = {
    onInit(this: ObjectPageExt) {
      if (!attachmentUtil) {
        attachmentUtil = new UploadHelper(this);
        attachmentUtil.registerUploadAction();
      }
    },
    onPageReady(this: ObjectPageExt): void {
      // reset model for upload set control (e.g. count of selected items)
      initUploadModel(this);

      refreshUploadSetTitle(this.base.getExtensionAPI());

      const uploadSet = getUploadSetControl(this.base.getExtensionAPI());
      if (uploadSet) {
        uploadSet.removeAllIncompleteItems();
      }
    }
  };
}
