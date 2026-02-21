import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useBanking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const performAction = async (action: string, amount: number, recipient?: string) => {
    setLoading(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("banking", {
        body: { action, amount, recipient },
      });
      if (fnError) {
        setError(fnError.message || "Operation failed");
        return null;
      }
      if (data?.error) {
        setError(data.error);
        return null;
      }
      return data;
    } catch {
      setError("Network error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { performAction, loading, error, setError };
}
