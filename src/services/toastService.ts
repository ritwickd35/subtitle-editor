import { type ToastSeverityType } from "../types/ToastSeverityType";
import { useToast } from "primevue/usetoast";

export const showToast = (
  toast,
  category: ToastSeverityType,
  summary: string,
  detail: string,
  duration: number = 1000
) => {
  toast.add({
    severity: category,
    summary,
    detail,
    life: duration,
  });
};
