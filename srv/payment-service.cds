using {db} from '../db/data-model';

service PaymentService {
    @odata.draft.enabled
    entity OpenItems   as projection on db.OpenItems;

    entity Payments    as projection on db.Payments;

    entity YearPeriods as projection on db.YearPeriods;
}
