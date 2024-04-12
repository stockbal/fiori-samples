import UploadSetItem from "sap/m/upload/UploadSetItem";
import Item from "sap/ui/core/Item";
import Context from "sap/ui/model/odata/v4/Context";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

export default {
  setUploadUrl(
    item: UploadSetItem,
    context: Context,
    listBinding: ODataListBinding,
    serviceUrl: string,
    entitySet: string,
    contentProperty: string
  ) {
    /**
     * Note:
     * CAP OData v4 service would actually allow to upload a file via navigation properties, but
     * an OData v4 service built with SAP RAP does not support this. To keep the solution universal the
     * file is uploaded directly via the stream entity set
     */
    const keySegment = context
      .getPath()
      .substring(listBinding.getHeaderContext()?.getPath().length ?? 0);
    if (keySegment) {
      // .bindProperty does not work here
      item.setUploadUrl(
        `${serviceUrl}/${entitySet}${keySegment}/${contentProperty}`
      );
    }
  },
  addHttpHeaders: function (
    item: UploadSetItem,
    context: Context,
    model?: ODataModel
  ) {
    const token = model?.getHttpHeaders()?.["X-CSRF-Token"];

    if (token) {
      item.addHeaderField(new Item({ key: "x-csrf-token", text: token }));
    }

    const eTag = context?.getProperty("@odata.etag");
    if (eTag) {
      item.addHeaderField(new Item({ key: "If-Match", text: eTag }));
    }
  }
};
