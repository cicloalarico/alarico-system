
// We're changing this to directly export from shadcn's implementation
// instead of re-exporting it, which is causing the React hook context issue
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };
