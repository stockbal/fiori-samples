namespace db;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity BusinessPartners : cuid, managed {
    firstName   : String                                @title: '{i18n>bp_firstName}';
    lastName    : String                                @title: '{i18n>bp_lastName}';
    fullName    : String = firstName || ' ' || lastName @title: 'Full Name';
    attachments : Composition of many Attachments
                      on $self = attachments.travel;
}

entity Attachments : cuid, managed {
    mimeType : String       @title: 'Mime Type'   @Core.IsMediaType;
    fileName : String       @title: 'Filename';

    @Core.ContentDisposition: {
        Filename: fileName,
        Type    : 'inline'
    }
    content  : LargeBinary  @title: 'Attachment'  @Core.MediaType: mimeType;
    travel   : Association to BusinessPartners;
}
