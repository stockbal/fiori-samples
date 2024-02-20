namespace db;

using {
  cuid,
  managed
} from '@sap/cds/common';

entity WikiPages : cuid, managed {
  description : String @title: 'Description';
  content     : String @title: 'Content';
}
