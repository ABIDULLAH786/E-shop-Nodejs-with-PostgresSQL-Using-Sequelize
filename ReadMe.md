## introduction
In this repo i have created postgresSQL with nodejs and used ORM (Sequilize) to do all crud operations on it.


## Shema
The schema consist of four tables Products, product_type, catalogs, catalog_types.

Realtions Between Tables
```
    One Product_type can have many Products
    One Catalog_type can have many Catalogs
    One Product can have many Catalogs
```

![PostgresSQL Schema](https://i.ibb.co/bb6hnj8/schema.jpg)
