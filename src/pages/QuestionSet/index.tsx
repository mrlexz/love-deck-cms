import { useEffect, useMemo, useState } from "react";
import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash } from "lucide-react";
import CreateQuestionSetModal from "./components/CreateModal";
import type { IQuestionSet } from "@/types/category";
import UpdateQuestionSetModal from "./components/UpdateModal";

const QuestionSet = () => {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [questionSet, setQuestionSet] = useState<IQuestionSet | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isGettingQuestion, setIsGettingQuestion] = useState(false);

  const [questionSets, setQuestionSets] = useState<IQuestionSet[]>([]);

  const loadListQuestionSet = async () => {
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
      setQuestionSets(data.data);
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
        `https://exslhvvumjuuypkyiwwm.supabase.co/functions/v1/question-set?id=${id}`,
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
        await loadListQuestionSet();
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
        `https://exslhvvumjuuypkyiwwm.supabase.co/functions/v1/question-set?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setQuestionSet(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGettingQuestion(false);
    }
  };

  useEffect(() => {
    loadListQuestionSet();
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
      field: "name_en",
      headerName: "Tên bộ bài Tiếng Anh",
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
      field: "name_vi",
      headerName: "Tên bộ bài Tiếng Việt",
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
      <div className="flex justify-end">
        <Button onClick={() => setIsOpenCreate(true)}>Thêm mới bộ bài</Button>
      </div>
      <div className="w-full h-[80vh] mt-4">
        <AgGridReact
          rowData={questionSets}
          loading={isLoading}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={true}
        />
      </div>
      <CreateQuestionSetModal
        isOpenCreate={isOpenCreate}
        setIsOpenCreate={setIsOpenCreate}
        callback={loadListQuestionSet}
      />
      {questionSet && (
        <UpdateQuestionSetModal
          category={questionSet}
          isOpenCreate={isOpenEdit}
          setIsOpenCreate={setIsOpenEdit}
          callback={loadListQuestionSet}
        />
      )}
    </>
  );
};
export default QuestionSet;
