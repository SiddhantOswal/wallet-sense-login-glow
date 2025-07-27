// @/api/categorizeTransactions.ts
export async function categorizeTransactions(
  sessionId: string,
  phoneNumber: string,
  rawTransactions: any
): Promise<any> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const res = await fetch(`${backendUrl}/categorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        phone_number: phoneNumber,
        transactions: rawTransactions,
      }),
    });

    if (!res.ok) {
      throw new Error("Backend call failed");
    }

    const data = await res.json();
    return data.categories;
  } catch (err) {
    throw new Error("Network or backend error: " + (err as Error).message);
  }
}
