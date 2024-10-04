import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { authOptions } from "../../../utils/auth-options";
import { getServerSession } from "next-auth";
import { books, bookshelf as bookshelfdb, db, eq, users } from "@repo/database";

const f = createUploadthing();

const auth = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    const user = (
      await db
        .select({
          id: users.id,
          email: users.email,
          firstname: users.firstname,
          lastname: users.lastname,
        })
        .from(users)
        .where(eq(users.email, session.user.email!))
    )[0];
    return user;
  } catch (error) {
    return null;
  }
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter: FileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "16MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);
      const bookshelfId = req.headers.get("bookshelfId");
      if (!bookshelfId)
        throw new UploadThingError("Please specify the bookshelf");

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id, bookshelfId: bookshelfId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // console.log("Upload complete for userId:", metadata.userId);
      const bookshelf = (
        await db
          .select()
          .from(bookshelfdb)
          .where(eq(bookshelfdb.id, parseInt(metadata.bookshelfId)))
      )[0];
      if (!bookshelf) throw new Error("Couldn't find bookshelf");
      if (bookshelf.userId !== metadata.userId) throw new Error("Unauthorized");
      await db.insert(books).values({
        fileUrl: file.url,
        bookshelfId: bookshelf.id,
        title: file.name,
      });
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
