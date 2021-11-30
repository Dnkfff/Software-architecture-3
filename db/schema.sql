DROP TABLE IF EXISTS "menu";
CREATE TABLE "menu"
(
    "id"   SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE
    "price" INT NOT NULL
);

INSERT INTO "menu" (name, price) VALUES ('biscuit', '100');
INSERT INTO "menu" (name, price) VALUES ('rice', '50');

DROP TABLE IF EXISTS "orders";
CREATE TABLE "orders"
(
    "id" SERIAL PRIMARY KEY,
    "content" VARCHAR NOT NULL,
    "sum" INTEGER NOT NULL,
    "desk" SMALLINT NOT NULL
);
