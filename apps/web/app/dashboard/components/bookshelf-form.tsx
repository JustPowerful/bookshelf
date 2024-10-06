"use client";
import { useFormState } from "react-dom"; // Ensure this is correct
// import { useTransition } from "react";
// https://swr.vercel.app/docs/with-nextjs
// use next-safe-action

import { addBookshelf, deleteBookshelf } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import FormButton from "@/components/ui/form-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Button3D from "@/components/ui/button3d";

export function DeleteBookshelf({
  id,
  className,
  getBookshelves,
}: {
  id: number;
  className?: string;
  getBookshelves: () => Promise<void>;
}) {
  const [state, formAction] = useFormState(deleteBookshelf, undefined);
  useEffect(() => {
    return () => {
      getBookshelves();
    };
  }, [state]);
  return (
    <form action={formAction}>
      <Input value={id} name="id" className="hidden" />
      <FormButton className={cn("bg-red-500 hover:bg-red-600", className)}>
        Delete
      </FormButton>
    </form>
  );
}

export function BookshelfForm({
  getBookshelves,
}: {
  getBookshelves: () => Promise<void>;
}) {
  const [state, formAction] = useFormState(addBookshelf, undefined);
  const [toggleState, setToggleState] = useState(false);
  useEffect(() => {
    getBookshelves();
    return () => {
      setToggleState(false);
    };
  }, [state]);
  return (
    <div>
      <Dialog
        open={toggleState}
        onOpenChange={() => {
          setToggleState((prev) => !prev);
        }}
      >
        <DialogTrigger>
          {/* <Button className="flex items-center gap-2 justify-center">
            <BookOpen className="w-4 h-4" /> Create a Bookshelf
          </Button> */}
          <Button3D className="flex items-center gap-2 justify-center">
            <BookOpen className="w-4 h-4" /> Create a Bookshelf
          </Button3D>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bookshelf Information</DialogTitle>
            <DialogDescription>
              Please fill in the form below to create a new bookshelf.
              Information is really important for our AI to understand your
              bookshelf.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Title of the bookshelf"
              name="title"
              required
            />
            <Input
              type="text"
              placeholder="Description of the bookshelf"
              name="description"
              required
            />
            <FormButton className="bg-slate-900 hover:bg-slate-950">
              Add
            </FormButton>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
