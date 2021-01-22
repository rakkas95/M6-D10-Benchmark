DROP TABLE IF EXISTS brands, products, reviews, categories;
CREATE TABLE brands(
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR(50) NOT NULL,
);


CREATE TABLE categories(
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name TEXT NOT NULL,
);


CREATE TABLE products(
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR (100) NOT NULL,
	description VARCHAR (200) NOT NULL,
	price INTEGER NOT NULL,
	category_id INTEGER NOT NULL,
	brand_id INTEGER NOT NULL,
	imageUrl TEXT NOT NULL,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	FOREIGN KEY (brand_id) REFERENCES brands(id),
	FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE reviews(
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	comment TEXT NOT NULL,
    rate INTEGER NOT NULL,
	brand_id INTEGER NOT NULL,
	product_id INTEGER NOT NULL,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	FOREIGN KEY (brand_id) REFERENCES brands(id),
	FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS '
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;'
	LANGUAGE plpgsql;
CREATE TRIGGER update_product_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE  update_updated_at_column();
CREATE TRIGGER update_product_modtime BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE PROCEDURE  update_updated_at_column();
--dummy data
INSERT INTO brands(name) VALUES ('Nokia');
INSERT INTO categories(name) VALUES ('smartphones');
INSERT INTO products(name, description, price, category_id, brand_id, imageUrl) VALUES ('Nokia brick', 'VERY VERY OLD OLD PHONE', '1','1', 'https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80');
INSERT INTO products(name, description, price, category_id, brand_id, imageUrl) VALUES ('Nokia brick', 'VERY VERY OLD OLD PHONE', '1','1', 'https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80');
INSERT INTO products(name, description, price, category_id, brand_id, imageUrl) VALUES ('Nokia brick', 'VERY VERY OLD OLD PHONE', '1','1', 'https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80');
INSERT INTO products(name, description, price, category_id, brand_id, imageUrl) VALUES ('Nokia brick', 'VERY VERY OLD OLD PHONE', '1','1', 'https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80');
INSERT INTO products(name, description, price, category_id, brand_id, imageUrl) VALUES ('Nokia brick', 'VERY VERY OLD OLD PHONE', '1','1', 'https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80');
INSERT INTO products(name, description, price, category_id, brand_id, imageUrl) VALUES ('Nokia brick', 'VERY VERY OLD OLD PHONE', '1','1', 'https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80');
INSERT INTO products(name, description, price, category_id, brand_id, imageUrl) VALUES ('Nokia brick', 'VERY VERY OLD OLD PHONE', '1','1', 'https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80');
INSERT INTO products(name, description, price, category_id, brand_id, imageUrl) VALUES ('Nokia brick', 'VERY VERY OLD OLD PHONE', '1','1', 'https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80');
INSERT INTO reviews(comment, rate, brand_id, product_id) VALUES ('look nice!', '4' '1','1');