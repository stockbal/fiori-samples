import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import ExtensionAPI from "sap/fe/templates/ObjectPage/ExtensionAPI";
import JSONModel from "sap/ui/model/json/JSONModel";
import UploadSet from "sap/m/upload/UploadSet";
import UploadHelper from "../util/UploadHelper";

let attachmentUtil: UploadHelper;

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
      (this.base.getModel("upload") as JSONModel).setData({});

      // clear any incomplete items from upload set
      const uploadSet = this.base
        .getExtensionAPI()
        .byId(
          "bpmanager::BusinessPartnersObjectPage--fe::CustomSubSection::CustomUpload--AttachmentUploadSet"
        ) as UploadSet;
      if (uploadSet) {
        uploadSet.removeAllIncompleteItems();
      }
    }
  };
}
