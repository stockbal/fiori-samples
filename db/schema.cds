namespace my.bookshop;

using {
  cuid,
  managed
} from '@sap/cds/common';

entity Books : cuid, managed {
  title : String @title : 'Title';
  stock : Integer @title : 'Stock';
}
