"use client";

import {
  TrendingDownIcon,
  TrendingUpIcon,
  Users,
  FileQuestion,
  MessageSquare,
  UtensilsCrossed,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DashboardCards = ({ stats }) => {
  // Format camelCase to Title Case with spaces
  const formatLabel = (label) => {
    // Insert space before capital letters and capitalize first letter
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Calculate percentage change
  const calculatePercentage = (total, newCount) => {
    if (total === 0) return 0;
    return Math.round((newCount / total) * 100);
  };

  // Prepare card data
  const cardsData = [
    {
      title: "Total Questions",
      value: stats?.totalQuestions,
      newValue: stats.newQuestionsWeek,
      icon: <FileQuestion className="size-5" />,
      description: "New questions this week",
      insight:
        stats.newQuestionsWeek === 0
          ? "No new questions this week"
          : "New questions added this week",
    },
    {
      title: "Total Answers",
      value: stats.totalAnswers,
      newValue: stats.newAnswersWeek,
      icon: <MessageSquare className="size-5" />,
      description: "New answers this week",
      insight: "Strong engagement from users",
    },
    {
      title: "Total Recipes",
      value: stats.totalRecipes,
      newValue: stats.newRecipesWeek,
      icon: <UtensilsCrossed className="size-5" />,
      description: "New recipes this week",
      insight: "Recipe collection growing steadily",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      newValue: stats.newUsersWeek,
      icon: <Users className="size-5" />,
      description: "New users this week",
      insight: "User acquisition on target",
    },
  ];

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      {cardsData.map((card, index) => {
        const percentage = calculatePercentage(card.value, card.newValue);
        const isPositive = card.newValue > 0;

        return (
          <Card key={index} className="@container/card">
            <CardHeader className="relative">
              <div className="flex items-center gap-2">
                {card.icon}
                <CardDescription>{card.title}</CardDescription>
              </div>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums mt-2">
                {card.value.toLocaleString()}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge
                  variant="outline"
                  className={`flex gap-1 rounded-lg text-xs ${
                    isPositive
                      ? "text-green-600 bg-green-50"
                      : "text-amber-600 bg-amber-50"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {isPositive ? `+${card.newValue}` : "0"}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.insight}
                {isPositive ? (
                  <TrendingUpIcon className="size-4 text-green-600" />
                ) : (
                  <TrendingDownIcon className="size-4 text-amber-600" />
                )}
              </div>
              <div className="text-muted-foreground">
                {card.newValue} {card.description.toLowerCase()}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export { DashboardCards };
