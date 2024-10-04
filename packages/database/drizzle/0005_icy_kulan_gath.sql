CREATE TABLE IF NOT EXISTS "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_url" varchar(255) NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(255),
	"bookshelf_id" integer NOT NULL
);
