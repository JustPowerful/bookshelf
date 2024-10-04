CREATE TABLE IF NOT EXISTS "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"embedding" vector(1536) NOT NULL,
	"bookshelf_id" integer NOT NULL
);
