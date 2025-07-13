import { UUID } from "crypto";

export default async function StudentProfile({ params }: { params: Promise<{ id: UUID }> }) {
  return (
    <section className="mt-16">
      <pre className="bg-accent p-4 border rounded-lg text-xs">Home</pre>
    </section>
  );
}
