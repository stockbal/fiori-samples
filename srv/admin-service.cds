using my.bookshop as my from '../db/schema';

service AdminService {
    @odata.draft.enabled
    entity Books as projection on my.Books;
}
