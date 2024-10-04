import { NextResponse } from "next/server";
import { books, db, documents } from "@repo/database";
import { eq } from "@repo/database";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/ollama";

export async function POST(req: Request) {
  const { bookshelfId } = await req.json();

  if (!bookshelfId) {
    return NextResponse.json(
      { error: "Bookshelf ID is required" },
      { status: 400 }
    );
  }

  try {
    // 1. Initialize OpenAI embeddings
    const embeddings = new OllamaEmbeddings({
      maxRetries: 2,
    });

    // 2. Retrieve the books from the database
    const booksData = await db
      .select()
      .from(books)
      .where(eq(books.bookshelfId, bookshelfId));

    if (!booksData.length) {
      return NextResponse.json(
        { message: "No books found for the specified bookshelf ID." },
        { status: 404 }
      );
    }

    // 3. Process each book
    for (const book of booksData) {
      const response = await fetch(book.fileUrl);
      const data = await response.blob();
      // 3a. Load PDF content
      const loader = new WebPDFLoader(data);
      const pdfContent = await loader.load();

      // 3b. Split content into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const chunks = await textSplitter.splitDocuments(pdfContent);

      // 3c. Generate embeddings for each chunk and save to database
      for (const chunk of chunks) {
        const chunkEmbedding = await embeddings.embedQuery(chunk.pageContent);

        await db.insert(documents).values({
          bookshelfId: parseInt(bookshelfId),
          content: chunk.pageContent.toString(),
          embedding: chunkEmbedding,
        });
      }
    }

    return NextResponse.json(
      {
        message:
          "PDF content loaded, chunked, and embeddings generated and saved successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing PDFs and generating embeddings:", error);
    return NextResponse.json(
      { error: "Failed to process PDFs and generate embeddings" },
      { status: 500 }
    );
  }
}
