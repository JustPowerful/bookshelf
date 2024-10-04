import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  varchar,
  vector,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstname: varchar("firstname", { length: 50 }).notNull(),
  lastname: varchar("lastname", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password").notNull(),
});

export const bookshelf = pgTable("bookshelf", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  userId: integer("user_id").notNull(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  fileUrl: varchar("file_url", { length: 255 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }), // could be null
  bookshelfId: integer("bookshelf_id").notNull(),
});

export const booksRelations = relations(books, ({ one }) => ({
  bookshelf: one(bookshelf, {
    fields: [books.bookshelfId],
    references: [bookshelf.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  bookshelf: many(bookshelf),
}));

export const bookshelfRelations = relations(bookshelf, ({ one, many }) => ({
  users: one(users, {
    fields: [bookshelf.userId],
    references: [users.id],
  }),
  books: many(books),
  documents: many(documents),
}));

// these are used to store the embedding of the books
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  content: text("content"),
  embedding: vector("embedding", {
    dimensions: 1024,
  }).notNull(),
  bookshelfId: integer("bookshelf_id").notNull(),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  bookshelf: one(bookshelf, {
    fields: [documents.bookshelfId],
    references: [bookshelf.id],
  }),
}));
