using AdminService as service from '../../srv/admin-service';

annotate service.Books with @(
    UI.LineItem                   : [
        {Value: title},
        {Value: stock}
    ],
    UI.HeaderInfo: {
        Title : {
            Value : title,
        },
        TypeName : 'Book',
        TypeNamePlural: 'Books'
    },
    UI.FieldGroup #GeneratedGroup1: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {Value: title},
            {Value: stock}
        ],
    },
    UI.Facets                     : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup1',
    }, ]
);
