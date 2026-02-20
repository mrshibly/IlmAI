export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ilmai.onrender.com";

// For debugging in production if needed
if (typeof window !== "undefined") {
  console.log("IlmAI API Base URL:", API_BASE_URL);
}
