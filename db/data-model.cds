namespace db;

using from '@sap/cds-common-content';

using {
  cuid,
  managed,
  Currency,
  sap.common.CodeList as CodeList
} from '@sap/cds/common';

@cds.search: {comment}
entity OpenItems : cuid, managed {
  policyId    : String         @title: 'Policy';
  postingDate : Date           @title: 'Posting Date';
  comment     : String         @title: 'Comment';

  @Measures.ISOCurrency: currency_code
  costs       : Decimal(17, 5) @title: 'Costs';
  currency    : Currency       @title: 'Currency';
}

entity Payments : cuid, managed {
  transactionId : UUID                       @title: 'Transaction ID';
  yearPeriod    : Association to YearPeriods @assert.target;

  @Measures.ISOCurrency: currency_code
  costs         : Decimal(17, 5)             @title: 'Costs';
  currency      : Currency                   @title: 'Currency';
}

entity YearPeriods : CodeList {
  key period : String(10) @title: 'Period';
}
