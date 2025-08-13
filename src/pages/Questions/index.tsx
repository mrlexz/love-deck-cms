import { type ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { CustomModal } from "@/components/CustomModal";
import { useEffect, useState } from "react";
import type { Question } from "@/types/question";
import { Badge } from "@/components/ui/badge";


export const PaymentTable = () => {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  console.log("🚀 ~ PaymentTable ~ questions:", questions)

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
      accessorKey: "",
      header: "Hành động",
      cell: () => (
        <div className="flex gap-2 text-start">
          <Button onClick={() => setIsOpenEdit(true)}>
            <Edit />
          </Button>
          <Button variant="destructive">
            <Trash />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  return (
    <>
      <Button onClick={() => setIsOpenCreate(true)}>Open Modal</Button>
      <CustomTable<Question>
        isLoading={isLoading}
        loadingText="Loading..."
        data={questions}
        columns={columns}
        title="Payments"
        description="List of all payments processed"
        searchPlaceholder="Filter payments..."
        searchColumn="question_en"
      />
      <CustomModal
        open={isOpenCreate}
        onOpenChange={setIsOpenCreate}
        modalTitle="Thêm mới câu hỏi"
        modalDescription="Modal Description"
      >
        Thêm mới
      </CustomModal>
      <CustomModal
        open={isOpenEdit}
        onOpenChange={setIsOpenEdit}
        modalTitle="Sửa câu hỏi"
        modalDescription="Modal Description"
      >
        Sửa
      </CustomModal>
    </>
  );
};
