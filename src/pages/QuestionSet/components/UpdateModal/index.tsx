import { useForm, Controller } from "react-hook-form";
import { CustomModal } from "@/components/CustomModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { ICategory } from "@/types/category";

// Define form data type
interface FormData {
  name_en: string;
  name_vi: string;
}

function UpdateQuestionSetModal({
  category,
  isOpenCreate,
  setIsOpenCreate,
  callback
}: {
  category: ICategory;
  isOpenCreate: boolean;
  setIsOpenCreate: (open: boolean) => void;
  callback?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  // Use React Hook Form for ALL form state
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      name_en: category?.name_en || "",
      name_vi: category?.name_vi || "",
    },
  });


  const onSubmit = async (data: FormData) => {
    if (!category || !category.id) return;
    try {
      setLoading(true);

      // Prepare payload
      const payload = {
        name_en: data.name_en,
        name_vi: data.name_vi,
      };
      
      // API call
      const res = await fetch(`https://exslhvvumjuuypkyiwwm.supabase.co/functions/v1/question-set?id=${category.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        reset();
        if (callback) {
          callback();
        }
        setIsOpenCreate(false);
      } else {
        alert("Error creating question");
      }
      
    } catch (error) {
      console.error("Error creating question:", error);
      alert("Error creating question");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset(); // Reset form when closing
    setIsOpenCreate(false);
  };

  useEffect(() => {
    if (category) {
      reset({
        name_en: category.name_en,
        name_vi: category.name_vi,
      });
    }
  }, [category, reset]);

  return (
    <CustomModal
      open={isOpenCreate}
      onOpenChange={handleClose}
      modalTitle="Cập nhật bộ bài"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {/* Question English */}
          <div className="grid w-full gap-3">
            <Label htmlFor="name_en">Tên bộ bài (Tiếng Anh)</Label>
            <Controller
              name="name_en"
              control={control}
              rules={{ required: "Question in English is required" }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="name_en"
                  placeholder="Enter question in English"
                  className={errors.name_en ? "border-red-500" : ""}
                />
              )}
            />
            {errors.name_en && (
              <p className="text-sm text-red-500">{errors.name_en.message}</p>
            )}
          </div>

          {/* Question Vietnamese */}
          <div className="grid w-full gap-3">
            <Label htmlFor="question_vi">Tên bộ bài (Tiếng Việt)</Label>
            <Controller
              name="name_vi"
              control={control}
              rules={{ required: "Question in Vietnamese is required" }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="name_vi"
                  placeholder="Enter question in Vietnamese"
                  className={errors.name_vi ? "border-red-500" : ""}
                />
              )}
            />
            {errors.name_vi && (
              <p className="text-sm text-red-500">{errors.name_vi.message}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="bg-blue-500 hover:bg-blue-400"
          >
            {(loading || isSubmitting) ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

export default UpdateQuestionSetModal;