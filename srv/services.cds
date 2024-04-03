using {db} from '../db/schema';

@path: '/upload'
service UploadService {

    @odata.draft.enabled
    entity BusinessPartners     as projection on db.BusinessPartners;

    // entity Attachments as projection on db.Attachments;
}
