export default {
  /*
          const uploadItem = event.getParameter("item");
        if (!uploadItem) {
            return;
        }
        const context = (this as any).getBindingContext() as Context;
        if (!context) {
            return;
        }

        // - using the "items" binding from the UploadSet produces duplicate entries (further analysis needed???)
        // - using the "context" during "bindList" works only if the object page is already loaded in the draft state
        //   otherwise an exception is thrown because of a path missmatch (-> analyze fiori elements framework how ODataListBinding's are created for table facets)
        const attachmentBinding = this.getModel()?.bindList(
            `${context.getPath()}/_Attachment`
        ) as ODataListBinding;

        const attachmentContext = attachmentBinding.create({
            FileName: uploadItem.getFileName()
        });

        await attachmentContext.created();

        let serviceUrl = (this.getModel() as ODataModel).getServiceUrl();
        if (serviceUrl.charAt(serviceUrl.length - 1) === "/") {
            serviceUrl = serviceUrl.substring(0, serviceUrl.length - 1);
        }

        // apply created context to the upload item and set upload url for
        uploadItem.setBindingContext(attachmentContext);
        uploadItem.bindProperty("fileName", { path: "FileName" });
        uploadItem.bindProperty("url", { path: "Content" });

        const keyPath = attachmentContext.getPath().substring(attachmentBinding.getHeaderContext()?.getPath().length ?? 0);
        if (keyPath) {
            uploadItem.setUploadUrl(
                serviceUrl + "/Attachment" + keyPath + "/Content"
            );
        } else {
            // .bindProperty does not work here
            uploadItem.setUploadUrl(
                serviceUrl + attachmentContext.getPath()
            );
        }

        const token = (this.getModel() as ODataModel)?.getHttpHeaders()?.["X-CSRF-Token"];

        if (token) {
            uploadItem.addHeaderField(new Item({ key: "x-csrf-token", text: token }));
        }

        const eTag = attachmentContext?.getProperty("@odata.etag");
        if (eTag) {
            uploadItem.addHeaderField(new Item({ key: "If-Match", text: eTag }));
        }

        // perform actual upload
        (uploadItem.getParent() as UploadSet).uploadItem(uploadItem);
  */
}