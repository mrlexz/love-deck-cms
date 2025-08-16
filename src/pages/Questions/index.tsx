import { type ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import type { Question } from "@/types/question";
import { Badge } from "@/components/ui/badge";
import CreateQuestionModal from "./components/CreateQuestionModal";
import UpdateQuestionModal from "./components/UpdateQuestionModal";

export const Questions = () => {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isGettingQuestion, setIsGettingQuestion] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);


  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("https://exslhvvumjuuypkyiwwm.supabase.co/functions/v1/add-question", {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      setQuestions(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://exslhvvumjuuypkyiwwm.supabase.co/functions/v1/add-question?id=${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
          "Content-Type": "application/json"
        },
      });
      const data = await res.json();
      if (data.success) {
        loadQuestions();
      } else {
        alert("Error deleting question");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestion = async (id: string) => {
    setIsGettingQuestion(true);
    try {
      const res = await fetch(`https://exslhvvumjuuypkyiwwm.supabase.co/functions/v1/add-question?id=${id}`, {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
          "Content-Type": "application/json"
        },
      });
      const data = await res.json();
      setQuestion(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGettingQuestion(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

    const columns: ColumnDef<Question>[] = [
    {
      accessorFn: (row) => row.question_variant?.[0]?.name,
      accessorKey: "question_variant[0].name",
      header: "Loại câu hỏi",
      cell: ({ getValue }) => (
        <div className="text-start">
          <Badge variant={"secondary"} className={String(getValue() || "") === "multiple_choice" ? "bg-amber-700 text-white dark:bg-amber-700" : "bg-blue-500 text-white dark:bg-blue-600"}>
            {String(getValue() || "")}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "question_en",
      header: "Câu hỏi tiếng Anh",
      cell: ({ row }) => (
        <div className="text-start">{row.getValue("question_en")}</div>
      ),
      meta: {
        className: "w-[200px]", // Sử dụng Tailwind CSS
      },
    },
    {
      accessorKey: "question_vi",
      header: "Câu hỏi tiếng Việt",
      cell: ({ row }) => (
        <div className="text-start">{row.getValue("question_vi")}</div>
      ),
      size: 300,
    },
    {
      accessorKey: "example_en",
      header: "Ví dụ (Tiếng Anh)",
      cell: ({ row }) => (
        <div className="text-start">{row.getValue("example_en")}</div>
      ),
    },
    {
      accessorKey: "example_vi",
      header: "Ví dụ (Tiếng Việt)",
      cell: ({ row }) => (
        <div className="text-start">{row.getValue("example_vi")}</div>
      ),
    },
    {
      accessorKey: "id",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex gap-2 text-start">
          <Button onClick={async () => {
            await getQuestion(row.getValue("id"));
            setIsOpenEdit(true);
          }}>
            {isGettingQuestion ? <Loader2 className="animate-spin" /> : <Edit />}
          </Button>
          <Button variant="destructive" onClick={() => {
            if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
              handleDelete(row.getValue("id"));
            }
          }}>
            <Trash />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setIsOpenCreate(true)}>Thêm mới câu hỏi</Button>
      </div>
      <CustomTable<Question>
        isLoading={isLoading}
        loadingText="Loading..."
        data={questions}
        columns={columns}
        title="Payments"
        description="List of all payments processed"
        searchPlaceholder="Tìm kiếm câu hỏi..."
        searchColumn="question_en"
      />
      <CreateQuestionModal
        isOpenCreate={isOpenCreate}
        setIsOpenCreate={setIsOpenCreate}
        callback={loadQuestions}
      />
      {question && (
        <UpdateQuestionModal
          question={question}
          isOpenCreate={isOpenEdit}
          setIsOpenCreate={setIsOpenEdit}
          callback={loadQuestions}
        />
      )}
    </>
  );
};
