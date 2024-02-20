using db from '../db/data-model';

service WikiService {
    @odata.draft.enabled
    entity WikiPages as projection on db.WikiPages;
}
