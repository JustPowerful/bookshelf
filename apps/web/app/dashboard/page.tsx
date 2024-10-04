"use client";
import { useEffect, useState } from "react";
import { BookOpen, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookshelfForm } from "./components/bookshelf-form";
import { DeleteBookshelf } from "./components/bookshelf-form";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "bookshelves" | "settings"
  >("profile");
  const [bookshelves, setBookshelves] = useState<
    {
      id: number;
      title: string;
      description: string;
    }[]
  >([]);

  const router = useRouter();

  async function getBookshelves() {
    try {
      const response = await fetch("/api/bookshelf");
      const data = await response.json();
      setBookshelves(data.bookshelves);
    } catch (error) {
      console.error("Error fetching bookshelves:", error);
    }
  }

  useEffect(() => {
    getBookshelves();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="flex flex-col h-full p-2">
          <div className="p-4">
            <h2 className="text-2xl font-bold">Dashboard</h2>
          </div>
          <nav className="flex-1">
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              variant={activeTab === "bookshelves" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("bookshelves")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Bookshelves
            </Button>
          </nav>
          <div className="p-4">
            <Button variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">User Profile</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value="John Doe"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value="john.doe@example.com"
                  readOnly
                />
              </div>
              <Button>Edit Profile</Button>
            </div>
          </div>
        )}

        {activeTab === "bookshelves" && (
          <div>
            <div className="flex justify-center mb-4">
              {" "}
              {/* <UploadButton
                className="cursor-pointer bg-red-500 text-white w-fit p-2 rounded-md"
                endpoint="pdfUploader"
                onClientUploadComplete={() => {
                  router.refresh();
                }}
              /> */}
              <BookshelfForm getBookshelves={getBookshelves} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Bookshelves</h2>
            <ScrollArea className="h-[calc(100vh-12rem)] rounded-md border p-4">
              {bookshelves.map((shelf) => (
                <div
                  key={shelf.id}
                  className="mb-4 p-4 bg-white rounded-lg shadow"
                >
                  <h3 className="text-lg font-semibold">{shelf.title}</h3>
                  <div className="text-sm text-gray-600">
                    {shelf.description}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        router.push(`/bookshelf/${shelf.id}`);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      View Contents
                    </Button>
                    <DeleteBookshelf
                      getBookshelves={getBookshelves}
                      id={shelf.id}
                      className="w-fit"
                    />
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
