"use client";
import { Book, BookOpen } from "lucide-react";
import { UploadButton } from "../../../utils/uploadthing";
import { books, InferSelectModel } from "@repo/database";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

type BookType = InferSelectModel<typeof books>;

function BookComponent({ book }: { book: BookType }) {
  return (
    <div className="text-sm bg-slate-900 text-white p-2 rounded-md flex items-center gap-2">
      <Book /> {book.title}
    </div>
  );
}

const page = ({ params }: { params: { id: string } }) => {
  async function getBooks() {
    try {
      const response = await fetch(`/api/bookshelf/${params.id}/books`);
      const data = await response.json();
      if (!data) throw new Error("There was a server error");
      return data.books;
    } catch (error) {
      throw error;
    }
  }
  async function getBookshelf() {
    try {
      const response = await fetch(`/api/bookshelf/${params.id}`);
      const data = await response.json();
      if (!data) throw new Error("There was a server error");
      return data.bookshelf;
    } catch (error) {
      throw error;
    }
  }

  async function generateEmbeddings() {
    try {
      await fetch("/api/storeembeddings", {
        method: "POST",
        body: JSON.stringify({
          bookshelfId: params.id,
        }),
      });
    } catch (error) {}
  }

  const {
    data: embeddingsData,
    isLoading: isLoadingEmbeddings,
    refetch: refetchEmbeddings,
  } = useQuery({
    queryKey: ["embeddings"],
    queryFn: generateEmbeddings,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    data: bookshelfData,
    error: bookshelfError,
    isLoading: bookshelfIsLoading,
  } = useQuery({
    queryKey: ["bookshelf"],
    queryFn: getBookshelf,
    refetchOnWindowFocus: false,
  });

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="p-4">
      <div className="bg-gradient-to-tr from-slate-600 to-slate-900 text-white p-4 rounded-md mb-4">
        <h1 className="text-3xl font-bold">
          <BookOpen className="inline mr-2" />
          {bookshelfIsLoading ? "Loading..." : bookshelfData.title}
        </h1>
        {error && <small>{error.message}</small>}
      </div>
      <div className="flex items-center justify-center">
        <UploadButton
          onClientUploadComplete={() => {
            refetch();
          }}
          headers={{ bookshelfId: params.id }}
          endpoint="pdfUploader"
          className="cursor-pointer bg-slate-900 text-white w-fit p-2 rounded-md"
        />
        <Button
          onClick={() => {
            refetchEmbeddings();
          }}
        >
          Generate Embeddings
        </Button>
      </div>
      <div>
        {/* Books here */}
        {isLoading ? (
          "Loading..."
        ) : (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {data.map((book: BookType) => (
              <a href={book.fileUrl}>
                <BookComponent book={book} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
