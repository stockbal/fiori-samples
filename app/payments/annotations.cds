using PaymentService as service from '../../srv/payment-service';

annotate service.OpenItems with @( //
    UI.HeaderInfo         : {
        Title         : {
            $Type: 'UI.DataField',
            Value: policyId,
        },
        TypeName      : 'Open Item',
        TypeNamePlural: 'Open Items'
    },
    UI.SelectionFields    : [
        policyId,
        postingDate,
        currency_code
    ],
    UI.LineItem           : [
        {
            $Type: 'UI.DataField',
            Value: policyId,
        },
        {
            $Type: 'UI.DataField',
            Value: postingDate,
        },
        {
            $Type: 'UI.DataField',
            Value: comment,
        },
        {
            $Type            : 'UI.DataField',
            Value            : costs,
            ![@UI.Importance]: #High,
        },
    ],
    UI.FieldGroup #General: {
        Label: 'General',
        Data : [
            {Value: policyId},
            {Value: costs},
            {Value: postingDate}
        ],
    },
    UI.Facets             : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'General',
        Target: '@UI.FieldGroup#General',
    }, ]
) {};

annotate service.Payments with @( //
    UI.Facets                 : [{
        $Type : 'UI.CollectionFacet',
        Facets: [
            {
                $Type : 'UI.ReferenceFacet',
                Target: '@UI.FieldGroup#General',
                Label : 'Payment Info'
            },
            {
                $Type : 'UI.ReferenceFacet',
                Target: '@UI.FieldGroup#transaction',
                Label : 'Transaction Info'
            },
        ],
    }, ],
    UI.FieldGroup #transaction: {Data: [{Value: transactionId}]},
    UI.FieldGroup #General    : {
        Label: 'General Information',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'Year Period',
                Value: yearPeriod_period,
            },
            {
                $Type: 'UI.DataField',
                Value: costs,
            },
        ]
    }
) {
    yearPeriod @(Common: {
        Text           : yearPeriod.name,
        TextArrangement: #TextFirst,
        ValueList      : {
            Label         : 'Value with Value Help',
            CollectionPath: 'YearPeriods',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: yearPeriod_period,
                    ValueListProperty: 'period'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                }
            ]
        }
    });
};

annotate service.OpenItems with {
    policyId @Common.ValueList: {
        $Type          : 'Common.ValueListType',
        Parameters     : [{
            $Type            : 'Common.ValueListParameterInOut',
            ValueListProperty: 'policyId',
            LocalDataProperty: policyId,
        }, ],
        CollectionPath : 'OpenItems',
        SearchSupported: true,
        Label          : 'Policies',
    }
};
