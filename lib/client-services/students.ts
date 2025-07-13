type CreateStudentInput = {
  firstName: string;
  lastName: string;
  grade: "middle-school" | "high-school";
  location?: [string, string?]; // [country, city]
  phone?: string;
  notes?: string;
};

export async function createStudent(data: CreateStudentInput) {
  const res = await fetch("/api/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create student");
  }

  return res.json();
}
