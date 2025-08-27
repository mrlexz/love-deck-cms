import { useForm, useFieldArray, Controller } from "react-hook-form";
import { CustomModal } from "@/components/CustomModal";
import { CustomSelect, type SelectOption } from "@/components/CustomSelect";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";

// Define form data type
interface FormData {
  question_en: string;
  question_vi: string;
  example_en: string;
  example_vi: string;
  question_type: string;
  options: Array<{
    text_en: string;
    text_vi: string;
  }>;
}

function CreateQuestionModal({
  isOpenCreate,
  setIsOpenCreate,
  callback
}: {
  isOpenCreate: boolean;
  setIsOpenCreate: (open: boolean) => void;
  callback?: () => void;
}) {

  const [loading, setLoading] = useState(false);

  // Use React Hook Form for ALL form state
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      question_en: "",
      question_vi: "",
      example_en: "",
      example_vi: "",
      question_type: "",
      options: [{ text_en: "", text_vi: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  // Watch question_type to show/hide options
  const questionType = watch("question_type");

  const questionTypeOptions: SelectOption[] = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "open_ended", label: "Open Ended" },
  ];

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      // Validate required fields
      if (!data.question_type) {
        alert("Please select question type");
        return;
      }

      if (data.question_type === "multiple_choice" && data.options.length === 0) {
        alert("Please add at least one option for multiple choice questions");
        return;
      }

      // Prepare payload
      const payload = {
        question_en: data.question_en,
        question_vi: data.question_vi,
        example_en: data.example_en,
        example_vi: data.example_vi,
        question_variant_name: data.question_type,
        question_variant_options: data.question_type === "multiple_choice" ? data.options : [],
      };
      
      // API call
      const res = await fetch("https://exslhvvumjuuypkyiwwm.supabase.co/functions/v1/add-question", {
        method: "POST",
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

  return (
    <CustomModal
      open={isOpenCreate}
      onOpenChange={handleClose}
      modalTitle="Thêm mới câu hỏi"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {/* Question English */}
          <div className="grid w-full gap-3">
            <Label htmlFor="question_en">Câu hỏi (Tiếng Anh)</Label>
            <Controller
              name="question_en"
              control={control}
              rules={{ required: "Question in English is required" }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="question_en"
                  placeholder="Enter question in English"
                  className={errors.question_en ? "border-red-500" : ""}
                />
              )}
            />
            {errors.question_en && (
              <p className="text-sm text-red-500">{errors.question_en.message}</p>
            )}
          </div>

          {/* Question Vietnamese */}
          <div className="grid w-full gap-3">
            <Label htmlFor="question_vi">Câu hỏi (Tiếng Việt)</Label>
            <Controller
              name="question_vi"
              control={control}
              rules={{ required: "Question in Vietnamese is required" }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="question_vi"
                  placeholder="Enter question in Vietnamese"
                  className={errors.question_vi ? "border-red-500" : ""}
                />
              )}
            />
            {errors.question_vi && (
              <p className="text-sm text-red-500">{errors.question_vi.message}</p>
            )}
          </div>

          {/* Example English */}
          <div className="grid w-full gap-3">
            <Label htmlFor="example_en">Ví dụ (Tiếng Anh)</Label>
            <Controller
              name="example_en"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="example_en"
                  placeholder="Enter example in English (optional)"
                />
              )}
            />
          </div>

          {/* Example Vietnamese */}
          <div className="grid w-full gap-3">
            <Label htmlFor="example_vi">Ví dụ (Tiếng Việt)</Label>
            <Controller
              name="example_vi"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="example_vi"
                  placeholder="Enter example in Vietnamese (optional)"
                />
              )}
            />
          </div>

          {/* Question Type */}
          <div className="grid w-full gap-3">
            <Label htmlFor="question_type">Loại câu hỏi</Label>
            <Controller
              name="question_type"
              control={control}
              rules={{ required: "Question type is required" }}
              render={({ field }) => (
                <CustomSelect
                  placeholder="Chọn loại câu hỏi"
                  options={questionTypeOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.question_type?.message}
                  required
                />
              )}
            />
          </div>

          {/* Options for Multiple Choice */}
          {questionType === "multiple_choice" && (
            <div className="grid w-full gap-3">
              <Label>Câu trả lời</Label>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <Controller
                        name={`options.${index}.text_en`}
                        control={control}
                        rules={{ 
                          required: questionType === "multiple_choice" ? "English option is required" : false 
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Nhập câu trả lời (Tiếng Anh)"
                            className={errors.options?.[index]?.text_en ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.options?.[index]?.text_en && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.options[index]?.text_en?.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <Controller
                        name={`options.${index}.text_vi`}
                        control={control}
                        rules={{ 
                          required: questionType === "multiple_choice" ? "Vietnamese option is required" : false 
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Nhập câu trả lời (Tiếng Việt)"
                            className={errors.options?.[index]?.text_vi ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.options?.[index]?.text_vi && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.options[index]?.text_vi?.message}
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1} // Keep at least one option
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => append({ text_en: "", text_vi: "" })}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Thêm câu trả lời
                </Button>
              </div>
            </div>
          )}
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
            {(loading || isSubmitting) ? "Đang tạo..." : "Tạo"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

export default CreateQuestionModal;