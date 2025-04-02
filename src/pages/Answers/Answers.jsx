import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "@/constant/constant";
import Cookies from "js-cookie";
import AnswersTable from "@/components/answers-table";
import { useState } from "react";

export default function Answers() {
  const [question, setQuestion] = useState("");
  const { data: questions, isLoading: isQuestionsLoading } = useQuery({
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

  const {
    data: answers,
    isLoading: isAnswersLoading,
    refetch,
  } = useQuery({
    queryKey: ["answers"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/admin/answers?limit=1000&questionId=${question}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      return response.data;
    },
  });

  return (
    <div className="px-10">
      {!isAnswersLoading && (
        <AnswersTable
          questions={questions}
          onChangeQuestion={(questionId) => {
            setQuestion(questionId);
            refetch();
          }}
          data={answers}
        />
      )}
    </div>
  );
}
