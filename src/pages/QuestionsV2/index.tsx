import { useEffect, useMemo, useState } from "react";
import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { Question } from "@/types/question";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash } from "lucide-react";
import UpdateQuestionModal from "../Questions/components/UpdateQuestionModal";
import CreateQuestionModal from "../Questions/components/CreateQuestionModal";
import { formatDateTime } from "@/utils/time";
import { CustomSelect, type SelectOption } from "@/components/CustomSelect";

const QuestionsV2 = () => {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isGettingQuestion, setIsGettingQuestion] = useState(false);
  const [questionSets, setQuestionSets] = useState<SelectOption[]>([]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionSetID, setQuestionSetID] = useState<string | null>(null);

  const loadQuestionSets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        "https://exslhvvumjuuypkyiwwm.supabase.co/functions/v1/question-set",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      const options = data.data.map((questionSet: { id: string; name_vi: string }) => ({
        value: questionSet.id,
        label: questionSet.name_vi,
      }));
      setQuestionSets(options);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuestions = async (questionSetIDParam?: string | null) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://exslhvvumjuuypkyiwwm.supabase.co/functions/v1/add-question?question_set_id=${
          questionSetIDParam || ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
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
      const res = await fetch(
        `https://exslhvvumjuuypkyiwwm.supabase.co/functions/v1/add-question?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        await loadQuestions();
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
      const res = await fetch(
        `https://exslhvvumjuuypkyiwwm.supabase.co/functions/v1/add-question?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setQuestion(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGettingQuestion(false);
    }
  };

  useEffect(() => {
    loadQuestions(questionSetID);
  }, [questionSetID]);

  useEffect(() => {
    loadQuestionSets();
  }, []);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs] = useState<ColDef[]>([
    {
      headerName: "STT",
      width: 80,
      valueGetter: (params) => {
        return (params.node?.rowIndex ?? 0) + 1;
      },
      pinned: "left",
      lockPinned: true,
      filter: false,
      sortable: false,
    },
    {
      field: "question_variant[0].name",
      headerName: "Loại câu hỏi",
      width: 200,
      valueGetter: (params) => {
        return params.data.question_variant?.[0]?.name || "";
      },
      cellRenderer: (params: CustomCellRendererProps) => (
        <div className="text-start">
          <Badge
            variant={"secondary"}
            className={
              String(params.value || "") === "multiple_choice"
                ? "bg-amber-700 text-white dark:bg-amber-700"
                : "bg-blue-500 text-white dark:bg-blue-600"
            }
          >
            {String(params.value || "")}
          </Badge>
        </div>
      ),
    },
    {
      field: "topics_questions[0].topics.name_vi",
      headerName: "Danh mục",
      width: 200,
      valueGetter: (params) => {
        return params.data.topics_questions?.[0]?.topics?.name_vi || "";
      },
    },
    {
      field: "question_en",
      headerName: "Câu hỏi tiếng Anh",
      flex: 1,
      minWidth: 300,
      wrapText: true,
      autoHeight: true,
      cellStyle: {
        padding: "10px",
        whiteSpace: "normal",
        lineHeight: "1.5",
        display: "flex",
        alignItems: "flex-start",
        textAlign: "start",
      },
    },
    {
      field: "question_vi",
      headerName: "Câu hỏi tiếng Việt",
      width: 300,
      flex: 1,
      minWidth: 300,
      wrapText: true,
      autoHeight: true,
      cellStyle: {
        padding: "10px",
        whiteSpace: "normal",
        lineHeight: "1.5",
        display: "flex",
        alignItems: "flex-start",
        textAlign: "start",
      },
    },
    {
      field: "updated_at",
      headerName: "Cập nhật lúc",
      width: 200,
      valueGetter: (params) => {
        return formatDateTime(params.data.updated_at);
      },
    },
    // {
    //   field: "example_en",
    //   headerName: "Ví dụ (Tiếng Anh)",
    //   width: 300,
    //   flex: 1,
    //   minWidth: 300,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellStyle: {
    //     padding: "10px",
    //     whiteSpace: "normal",
    //     lineHeight: "1.5",
    //     display: "flex",
    //     alignItems: "flex-start",
    //     textAlign: "start",
    //   },
    // },
    // {
    //   field: "example_vi",
    //   headerName: "Ví dụ (Tiếng Việt)",
    //   width: 300,
    //   flex: 1,
    //   minWidth: 300,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellStyle: {
    //     padding: "10px",
    //     whiteSpace: "normal",
    //     lineHeight: "1.5",
    //     display: "flex",
    //     alignItems: "flex-start",
    //     textAlign: "start",
    //   },
    // },

    {
      field: "id",
      headerName: "Hành động",
      pinned: "right",
      width: 120,
      cellRenderer: (params: CustomCellRendererProps) => (
        <div className="flex gap-2 text-start">
          <Button
            onClick={async () => {
              await getQuestion(params.value);
              setIsOpenEdit(true);
            }}
          >
            {isGettingQuestion ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Edit />
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
                handleDelete(params.value);
              }
            }}
          >
            <Trash />
          </Button>
        </div>
      ),
    },
  ]);

  // Apply settings across all columns
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  // Container: Defines the grid's theme & dimensions.
  return (
    <>
      <div className="flex justify-between">
        <CustomSelect
          placeholder="Chọn bộ bài"
          options={questionSets}
          value={questionSetID || ""}
          onValueChange={(value) => setQuestionSetID(value)}
        />
        <Button onClick={() => setIsOpenCreate(true)}>Thêm mới câu hỏi</Button>
      </div>
      <div className="w-full h-[80vh] mt-4">
        <AgGridReact
          rowData={questions}
          loading={isLoading}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={true}
        />
      </div>
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
export default QuestionsV2;
