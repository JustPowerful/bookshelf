import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

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

export const usersRelations = relations(users, ({ many }) => ({
  bookshelf: many(bookshelf),
}));

export const bookshelfRelations = relations(bookshelf, ({ one }) => ({
  users: one(users, {
    fields: [bookshelf.userId],
    references: [users.id],
  }),
}));

// export const posts = pgTable("posts", {
//   id: serial("id").primaryKey(),
//   title: varchar("title").notNull(),
//   content: text("content").notNull(),
//   authorId: integer("author_id")
//     .references(() => users.id, { onDelete: "cascade" })
//     .notNull(),
// });

// export const comments = pgTable("comments", {
//   id: serial("id").primaryKey(),
//   text: text("text"),
//   authorId: integer("author_id")
//     .references(() => users.id, { onDelete: "cascade" })
//     .notNull(),
//   postId: integer("post_id")
//     .references(() => posts.id, { onDelete: "cascade" })
//     .notNull(),
// });

// export const usersRelations = relations(users, ({ many }) => ({
//   posts: many(posts),
// }));

// export const postsRelations = relations(posts, ({ one, many }) => ({
//   author: one(users, {
//     fields: [posts.authorId],
//     references: [users.id],
//   }),
//   comments: many(comments),
// }));

// export const commentsRelations = relations(comments, ({ one }) => ({
//   post: one(posts, {
//     fields: [comments.postId],
//     references: [posts.id],
//   }),
// }));
