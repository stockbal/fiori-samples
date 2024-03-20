using {db} from '../db/data-model';

service PaymentService {
    @odata.draft.enabled
    entity OpenItems   as projection on db.OpenItems;

    // @odata.draft.enabled
    entity Payments    as projection on db.Payments;

    entity YearPeriods as projection on db.YearPeriods;
}
