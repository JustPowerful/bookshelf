DROP TABLE "comments";--> statement-breakpoint
DROP TABLE "posts";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "name" TO "firstname";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "firstname" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lastname" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar NOT NULL;