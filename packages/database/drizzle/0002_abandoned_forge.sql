CREATE TABLE IF NOT EXISTS "bookshelf" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(255) NOT NULL
);
