"use client";
import { Book, BookOpen, Loader2, Trash } from "lucide-react";
import { UploadButton } from "../../../utils/uploadthing";
import { books, InferSelectModel } from "@repo/database";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { deleteBook } from "../actions";

import { useFormState } from "react-dom";
import FormButton from "@/components/ui/form-button";
import { useEffect } from "react";

type BookType = InferSelectModel<typeof books>;

function BookComponent({
  book,
  reloadBooks,
}: {
  book: BookType;
  reloadBooks: () => Promise<any>;
}) {
  const [state, formAction] = useFormState(deleteBook, undefined);

  useEffect(() => {
    return () => {
      reloadBooks();
    };
  }, [state]);

  return (
    <div className="text-sm bg-slate-900 text-white p-2 rounded-md flex flex-col   gap-2 box-border">
      <div className="flex items-center">
        {" "}
        <Book /> {book.title}
      </div>
      <form action={formAction}>
        <input value={book.id} name="id" className="hidden" />
        <FormButton className="bg-red-500 hover:bg-red-600 w-full text-white">
          <Trash className="w-4 h-4" />
        </FormButton>
      </form>
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
      <div className="grid grid-cols-2 gap-4">
        <UploadButton
          onClientUploadComplete={() => {
            refetch();
          }}
          headers={{ bookshelfId: params.id }}
          endpoint="pdfUploader"
          className="cursor-pointer w-full bg-slate-900 text-white p-2 rounded-md"
        />
        <Button
          className="flex items-center justify-center h-full text-xl"
          onClick={() => {
            refetchEmbeddings();
          }}
        >
          {" "}
          {isLoadingEmbeddings ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Generate Embeddings"
          )}
        </Button>
      </div>
      <div>
        {/* Books here */}
        {isLoading ? (
          "Loading..."
        ) : (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {data.map((book: BookType) => (
              <a href={book.fileUrl}>
                <BookComponent reloadBooks={refetch} book={book} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
