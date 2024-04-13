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
import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import ActionToolbar from "sap/ui/mdc/ActionToolbar";
import ActionToolbarAction from "sap/ui/mdc/actiontoolbar/ActionToolbarAction";
import Context from "sap/ui/model/odata/v4/Context";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import FileUploader from "sap/ui/unified/FileUploader";
import UploadItemUtils from "./UploadItemUtil";
import { MediaCollection } from "./ServiceMetadata";

const ATTACHMENT_TABLE_ID =
  "bpmanager::BusinessPartnersObjectPage--fe::table::attachments::LineItem";

/**
 * @namespace bpmanager.ext.util
 */
export default class UploadHelper {
  #fileUploader: FileUploader;
  #extension: ControllerExtension<ExtensionAPI>;
  #uploader: Uploader;
  #serviceUrl: string;

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

    const uploadPromises = Object.entries(files).map(async ([, file]) => {
      const uploadSetItem = new UploadSetItem({
        uploadState: UploadState.Ready
      });
      // unfortunately this method is not part of the public interface
      (uploadSetItem as any)._setFileObject(file);

      const attachmentContext = attachmentBinding.create(
        {},
        true,
        false,
        false
      );
      await attachmentContext.created();

      uploadSetItem.setBindingContext(attachmentContext);

      UploadItemUtils.setUploadUrl(
        uploadSetItem,
        attachmentContext,
        attachmentBinding,
        serviceUrl
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
    if (!item) {
      return;
    }
    const context = item.getBindingContext<Context>();
    const headers = (e.getParameter("responseXHR") as Record<string, unknown>)
      ?.headers;
    let newEtag: string | undefined;
    if (typeof headers === "string") {
      newEtag = (headers as string)
        .split("\r\n")
        .find((h) => h.startsWith("etag"))
        ?.substring(6);
    }
    if (newEtag) {
      context?.setProperty(
        "@odata.etag",
        newEtag,
        /*prevent patch request*/ null as never
      );
    }
    context?.setProperty(
      MediaCollection.fileNameProp,
      (item.getFileObject() as File).name
    );
  }

  #getServiceUrl() {
    if (!this.#serviceUrl) {
      const model = this.#extension.base.getModel<ODataModel>();
      if (!model) {
        throw new Error("Main ODataModel not found");
      }
      this.#serviceUrl = model.getServiceUrl();

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
