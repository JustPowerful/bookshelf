"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { registerUser } from "../actions";
import { useFormState, useFormStatus } from "react-dom";

import { Loader2 as Spinner } from "lucide-react";

interface Props {}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      <span>{pending ? <Spinner className="animate-spin" /> : "Register"}</span>
    </Button>
  );
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [error, formAction] = useFormState(registerUser, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form action={formAction}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Sign up for our platform to access exclusive features and content.
            </CardDescription>
          </CardHeader>
          <div className="text-center mb-4 text-red-500">{error && error}</div>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First name</Label>
                <Input id="firstname" name="firstname" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last name</Label>
                <Input id="lastname" name="lastname" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <FormButton />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
