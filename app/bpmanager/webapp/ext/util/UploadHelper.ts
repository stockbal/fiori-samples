/**
 * This file is required for the alternate approach where the created
 * object table from annotation @UI.LineItem is used
 */
import ExtensionAPI from "sap/fe/templates/ObjectPage/ExtensionAPI";
import Table from "sap/m/Table";
import { UploadState } from "sap/m/library";
import UploadSetItem from "sap/m/upload/UploadSetItem";
import Uploader, { Uploader$UploadCompletedEvent } from "sap/m/upload/Uploader";
import UploaderHttpRequestMethod from "sap/m/upload/UploaderHttpRequestMethod";
import CustomData from "sap/ui/core/CustomData";
import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import ActionToolbar from "sap/ui/mdc/ActionToolbar";
import ActionToolbarAction from "sap/ui/mdc/actiontoolbar/ActionToolbarAction";
import Context from "sap/ui/model/odata/v4/Context";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import FileUploader from "sap/ui/unified/FileUploader";
import UploadItemUtils from "./UploadItemUtil";

const ATTACHMENT_TABLE_ID =
  "bpmanager::BusinessPartnersObjectPage--fe::table::attachments::LineItem";
const LAST_ITEM_CUSTOM_KEY = "lastItem";

/**
 * @namespace bpmanager.ext.util
 */
export default class UploadHelper {
  #fileUploader: FileUploader;
  #extension: ControllerExtension<ExtensionAPI>;
  #uploader: Uploader;
  #serviceUrl: string;
  #newContexts: Context[];

  constructor(extension: ControllerExtension<ExtensionAPI>) {
    this.#extension = extension;
  }

  /**
   * Creates new "Upload" button in the toolbar of the @UI.LineItem table to
   * allow an upload of multiple files at once
   */
  registerUploadAction() {
    const attachmentTableTB = this.#extension
      .getView()
      .byId<ActionToolbar>(`${ATTACHMENT_TABLE_ID}-toolbar`);
    if (attachmentTableTB) {
      attachmentTableTB.addAction(
        new ActionToolbarAction({
          visible: "{ui>/isEditable}",
          // the button will be rendered by an FileUploader control
          action: this.#getFileUploader()
        })
      );
    }
  }

  #getFileUploader() {
    if (!this.#fileUploader) {
      this.#fileUploader = new FileUploader({
        multiple: true,
        buttonOnly: true,
        useMultipart: false,
        sendXHR: true,
        sameFilenameAllowed: true,
        change: async (e) => {
          await this.#uploadFiles(
            e.getParameter("files") as unknown as FileList // cast required as type not really object[]
          );
        },
        buttonText: "{i18n>upload_button_text}"
      });
    }
    return this.#fileUploader;
  }

  #getUploader() {
    if (!this.#uploader) {
      this.#uploader = new Uploader({
        httpRequestMethod: UploaderHttpRequestMethod.Put,
        uploadCompleted: this.#onUploadCompleted.bind(this)
      });
    }
    return this.#uploader;
  }

  async #uploadFiles(files: FileList) {
    const serviceUrl = this.#getServiceUrl();
    const attachmentTable = this.#getAttachmentTable();

    const attachmentBinding =
      attachmentTable?.getBinding<ODataListBinding>("items");
    if (!attachmentBinding) {
      return;
    }

    const uploader = this.#getUploader();
    this.#newContexts = [];

    const uploadPromises = Object.entries(files).map(async ([, file], i) => {
      const uploadSetItem = new UploadSetItem({
        uploadState: UploadState.Ready
      });
      // unfortunately this method is not part of the public interface
      (uploadSetItem as any)._setFileObject(file);

      const attachmentContext = attachmentBinding.create({
        fileName: file.name
      });
      await attachmentContext.created();

      this.#newContexts.push(attachmentContext);

      if (i === files.length - 1) {
        uploadSetItem.addCustomData(
          new CustomData({ key: LAST_ITEM_CUSTOM_KEY, value: true })
        );
      }
      UploadItemUtils.setUploadUrl(
        uploadSetItem,
        attachmentContext,
        attachmentBinding,
        serviceUrl,
        "Attachments",
        "content"
      );
      UploadItemUtils.addHttpHeaders(
        uploadSetItem,
        attachmentContext,
        this.#extension.base.getModel<ODataModel>()
      );
      uploader.uploadItem(uploadSetItem, uploadSetItem.getHeaderFields());
    });

    if (Array.isArray(uploadPromises)) {
      await Promise.all(uploadPromises);
    }
  }

  async #onUploadCompleted(e: Uploader$UploadCompletedEvent) {
    const item = e.getParameter("item");
    const customData = item?.getCustomData();
    const isLastItem = customData
      ?.find((i) => i.getKey() === LAST_ITEM_CUSTOM_KEY)
      ?.getValue();

    if (isLastItem) {
      // last item uploaded, now we refresh the new contexts so the URL is rendered
      this.#newContexts.forEach((c) => c.refresh());
    }
  }

  #getServiceUrl() {
    if (!this.#serviceUrl) {
      this.#serviceUrl = this.#extension.base
        .getModel<ODataModel>()
        .getServiceUrl();

      if (this.#serviceUrl.charAt(this.#serviceUrl.length - 1) === "/") {
        this.#serviceUrl = this.#serviceUrl.substring(
          0,
          this.#serviceUrl.length - 1
        );
      }
    }
    return this.#serviceUrl;
  }

  #getAttachmentTable() {
    return this.#extension
      .getView()
      .byId<Table>(`${ATTACHMENT_TABLE_ID}-innerTable`);
  }
}
