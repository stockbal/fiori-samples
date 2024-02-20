using WikiService as service from '../../srv/wiki-service';

annotate service.WikiPages with @(
    UI.LineItem  : [{
        $Type: 'UI.DataField',
        Value: description
    }],
    UI.HeaderInfo: {
        TypeName      : 'Wiki Page',
        TypeNamePlural: 'Wiki Pages',
        Title         : {Value: description}
    }
);

annotate service.WikiPages with @(
    UI.FieldGroup #GeneratedGroup1: {
        $Type: 'UI.FieldGroupType',
        Data : [{
            $Type: 'UI.DataField',
            Value: description,
        }],
    },
    UI.Facets                     : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup1',
    }, ]
);
