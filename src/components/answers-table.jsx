import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent } from "@/components/ui/card";

export default function AnswersTable({ data, questions, onChangeQuestion }) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [questionTypeFilter, setQuestionTypeFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (data) {
      setAnswers(data.data || []);

      setLoading(false);
    }
  }, [data]);

  // Filter logic
  const filteredAnswers = answers.filter((ans) => {
    const userName = ans.user?.name || "";
    const questionText = ans.question?.text || "";
    const answerText = ans.answer || "";
    const questionType = ans.question?.questionType || "";

    // 1) Search across user, question, and answer text
    const searchMatch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answerText.toLowerCase().includes(searchTerm.toLowerCase());

    // 2) Filter by question type if selected
    const typeMatch =
      questionTypeFilter.length === 0 ||
      questionTypeFilter.includes(questionType);

    return searchMatch && typeMatch;
  });

  const totalPages = Math.ceil(filteredAnswers.length / pageSize);
  const currentValidatedPage = Math.min(currentPage, totalPages || 1);

  const startIndex = (currentValidatedPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAnswers = filteredAnswers.slice(startIndex, endIndex);

  const toggleQuestionTypeFilter = (type) => {
    onChangeQuestion(type);
    // setQuestionTypeFilter((prev) =>
    //   prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    // );
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by user, question, or answer..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Question
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {questions?.data?.length ? (
                questions?.data?.map((qt) => (
                  <DropdownMenuCheckboxItem
                    key={qt}
                    checked={questionTypeFilter.includes(qt)}
                    onCheckedChange={() => toggleQuestionTypeFilter(qt._id)}
                  >
                    {qt?.text}
                  </DropdownMenuCheckboxItem>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  No question types
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedAnswers.length} of {filteredAnswers.length} filtered
        answers (total {answers.length}).
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAnswers.length > 0 ? (
                  paginatedAnswers.map((ans) => (
                    <TableRow key={ans._id}>
                      <TableCell>
                        {ans.user?.name || (
                          <span className="text-muted-foreground">No name</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {ans.question?.text || (
                          <span className="text-muted-foreground">
                            No question
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{ans.answer || "—"}</TableCell>
                      <TableCell>{formatDate(ans.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No answers found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Simple Pagination Controls */}
          <div className="flex justify-center items-center mt-4 gap-2">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentValidatedPage === 1}
            >
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentValidatedPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentValidatedPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Cards for Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 mt-4">
        {paginatedAnswers.map((ans) => (
          <Card key={ans._id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="font-semibold line-clamp-2 mb-2">
                {ans.user?.name || "No user"}
              </div>
              <div className="text-sm text-muted-foreground mb-1">
                {ans.question?.text}
              </div>
              <div className="text-sm mb-2">
                <span className="mr-1 font-medium">Type:</span>
                {ans.question?.questionType || "N/A"}
              </div>
              <div className="text-sm mb-2">
                <span className="mr-1 font-medium">Live:</span>
                {ans.question?.isLive ? "Yes" : "No"}
              </div>
              {ans.question?.options?.length ? (
                <div className="text-sm mb-2">
                  <span className="mr-1 font-medium">Options:</span>
                  {ans.question.options.join(", ")}
                </div>
              ) : null}
              <div className="text-sm mb-2">
                <span className="mr-1 font-medium">Answer:</span>
                {ans.answer}
              </div>
              <div className="text-xs text-muted-foreground">
                Created: {formatDate(ans.createdAt)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
