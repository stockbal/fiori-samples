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
    Facets        : [{
        $Type : 'UI.ReferenceFacet',
        Label : 'General Information',
        ID    : 'Identification',
        Target: '@UI.Identification'
    }]
});
