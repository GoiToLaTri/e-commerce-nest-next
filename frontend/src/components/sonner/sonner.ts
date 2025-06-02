import { toast } from "sonner";

export const sonnerSuccess = (message: string) => toast.success(message);

export const sonnerError = (message: string) => toast.error(message);

export const sonnerInfo = (message: string) => toast.info(message);
export const sonnerWarning = (message: string) => toast.warning(message);

export const sonnerLoading = <T extends { message: string }>(
  promise: Promise<T>
) =>
  toast.promise(promise, {
    loading: "Loading...",
    success: (data: T) => {
      return `${data.message}`;
    },
    error: (data: T) => `${data.message}`,
  });
