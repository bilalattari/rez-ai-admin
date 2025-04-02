import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Clock,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function RecipeTable({ data }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState([]);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [availableMealTypes, setAvailableMealTypes] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data) {
          setRecipes(data.data);

          const mealTypes = Array.from(
            new Set(data.data.map((recipe) => recipe.mealType))
          );
          setAvailableMealTypes(mealTypes);

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [data]);

  // Filter recipes based on search term and filters
  const filteredRecipes = recipes.filter((recipe) => {
    // Filter by search term
    const searchMatch =
      recipe.mealType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some((ing) =>
        ing.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      recipe.cookingTime.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by meal type
    const mealTypeMatch =
      mealTypeFilter.length === 0 || mealTypeFilter.includes(recipe.mealType);

    // Filter by bookmarked status
    const bookmarkMatch = !bookmarkedOnly || recipe.isBookmark;

    return searchMatch && mealTypeMatch && bookmarkMatch;
  });

  // Toggle meal type in filter
  const toggleMealTypeFilter = (mealType) => {
    setMealTypeFilter((prev) =>
      prev.includes(mealType)
        ? prev.filter((type) => type !== mealType)
        : [...prev, mealType]
    );
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search recipes, ingredients, or cooking time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Meal Type
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {availableMealTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={mealTypeFilter.includes(type)}
                  onCheckedChange={() => toggleMealTypeFilter(type)}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={bookmarkedOnly ? "default" : "outline"}
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className="flex gap-2"
          >
            {bookmarkedOnly ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            Bookmarked
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredRecipes.length} of {recipes.length} recipes
      </div>

      {/* Recipe Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Recipe</TableHead>
                <TableHead className="w-[300px]">Created By</TableHead>
                <TableHead>Meal Type</TableHead>
                <TableHead>Ingredients</TableHead>
                <TableHead>Cooking Time</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                  <TableRow key={recipe._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={
                              recipe.imageUrl ||
                              "/placeholder.svg?height=100&width=100"
                            }
                            alt={recipe.mealType}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="truncate max-w-[200px]">
                          {recipe.mealType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{recipe?.user?.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{recipe.mealType}</Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {recipe.ingredients
                          .slice(0, 3)
                          .map((ingredient, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {ingredient}
                            </Badge>
                          ))}
                        {recipe.ingredients.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{recipe.ingredients.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {recipe.cookingTime}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(recipe.createdAt)}</TableCell>
                    <TableCell className="text-center">
                      {recipe.isBookmark ? (
                        <BookmarkCheck className="h-5 w-5 text-primary inline-block" />
                      ) : (
                        <Bookmark className="h-5 w-5 text-muted-foreground inline-block" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No recipes found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Recipe Cards for Mobile View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 mt-4">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe._id} className="overflow-hidden">
            <div className="h-40 w-full overflow-hidden">
              <img
                src={recipe.imageUrl || "/placeholder.svg?height=200&width=400"}
                alt={recipe.mealType}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold truncate">{recipe.mealType}</h3>
                {recipe.isBookmark && (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                )}
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                {recipe.cookingTime}
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {ingredient}
                  </Badge>
                ))}
                {recipe.ingredients.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{recipe.ingredients.length - 3}
                  </Badge>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Created: {formatDate(recipe.createdAt)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
