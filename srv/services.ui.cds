using {UploadService as srv} from './services';

annotate srv.BusinessPartners with @( //
UI: {
    HeaderInfo    : {
        $Type         : 'UI.HeaderInfoType',
        TypeName      : '{i18n>bp_list_title}',
        TypeNamePlural: '{i18n>bp_object_title}',
        Title         : {
            $Type: 'UI.DataField',
            Value: fullName
        },
    },
    LineItem      : [
        {Value: firstName},
        {Value: lastName}
    ],
    Identification: [
        {Value: firstName},
        {Value: lastName}
    ],
    Facets        : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>general_info_facet}',
            ID    : 'Identification',
            Target: '@UI.Identification'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>attachments_table_label}',
            Target: 'attachments/@UI.LineItem',
        },
    ]
});

annotate srv.Attachments with @( //
    UI.LineItem     : [
        {Value: fileName},
        {Value: content}
    ]
);
