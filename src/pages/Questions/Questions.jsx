import UsersTable from "../../components/userTable";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/constant/constant";
import Cookies from "js-cookie";
import QuestionsTable from "@/components/questionsTable";
import { useState } from "react";
import { AddQuestionModal } from "@/components/add-question-modal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Add this if using shadcn

export default function Questions() {
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(null);

  const {
    data: questions,
    isLoading: isQuestionsLoading,
    refetch,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/questions`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (newQuestion) => {
      return axios.post(`${API_BASE_URL}/questions`, newQuestion, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Question Added Successfully");
      setIsAddQuestionModalOpen(false);
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`${API_BASE_URL}/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
    onSuccess: () => {
      toast.success("Question Deleted Successfully");
      refetch();
      setDeletingQuestion(null);
    },
  });

  return (
    <div className="px-10">
      <AddQuestionModal
        isOpen={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        initialData={editingQuestion} // pass data for edit
        onSubmit={async (data) => {
          if (editingQuestion) {
            await axios.put(
              `${API_BASE_URL}/questions/${editingQuestion._id}`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get("token")}`,
                },
              }
            );
            toast.success("Question Updated Successfully");
          } else {
            await mutation.mutateAsync(data);
          }
          setIsAddQuestionModalOpen(false);
          setEditingQuestion(null);
          refetch();
        }}
      />
      <div className="flex justify-end my-2">
        <Button onClick={() => setIsAddQuestionModalOpen(true)}>
          Add Question
        </Button>
      </div>

      {deletingQuestion && (
        <AlertDialog
          open={!!deletingQuestion}
          onOpenChange={() => setDeletingQuestion(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this question?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate(deletingQuestion._id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {!isQuestionsLoading && (
        <QuestionsTable
          onEdit={(question) => {
            setEditingQuestion(question);
            setIsAddQuestionModalOpen(true);
          }}
          onDelete={(question) => setDeletingQuestion(question)}
          initialData={questions}
        />
      )}
    </div>
  );
}
