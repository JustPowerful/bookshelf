import { Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Button3D from "@/components/ui/button3d";

export default function Page() {
  const plans = [
    {
      name: "Basic",
      price: "10TND",
      description: "Perfect for individuals and small projects",
      features: ["1 user", "5 projects", "5GB storage", "Basic support"],
    },
    {
      name: "Smart",
      price: "30TND",
      description: "Ideal for growing teams and businesses",
      features: [
        "5 users",
        "Unlimited projects",
        "50GB storage",
        "Priority support",
        "Advanced analytics",
      ],
      isBestChoice: true,
    },
    {
      name: "Professor",
      price: "100TND",
      description: "Tailored solutions for large organizations",
      features: [
        "Unlimited users",
        "Unlimited projects",
        "Unlimited storage",
        "24/7 dedicated support",
        "Custom integrations",
        "On-premise options",
      ],
    },
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose the Right Plan for You
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Simple, transparent pricing that grows with you.
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col justify-between ${plan.isBestChoice ? "border-primary border-2 relative" : ""}`}
            >
              {plan.isBestChoice && (
                <Badge className="absolute top-0 right-0 m-4 bg-primary text-primary-foreground">
                  Best Choice
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  {plan.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">{plan.price}</div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button3D className="w-full">
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button3D>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
