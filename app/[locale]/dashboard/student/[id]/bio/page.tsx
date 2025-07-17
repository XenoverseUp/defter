import { getStudentProfile } from "@/lib/actions/students";
import { getUser } from "@/lib/auth";
import { UUID } from "crypto";
import { BookDashedIcon, Building2Icon, EarthIcon, PhoneIcon } from "lucide-react";
import countries from "@/data/countries.json";
import flags from "react-phone-number-input/flags";

export default async function Bio({ params }: { params: Promise<{ id: UUID }> }) {
  const { id } = await params;

  const user = await getUser();

  if (user === null) return;

  const { country, city, phone, updatedAt } = await getStudentProfile(id, user.id);

  // @ts-expect-error ts mismatch between keys
  const Flag = country ? flags[country] : null;

  return (
    <section className="flex flex-col gap-3 pb-4 px-5">
      <div className="flex items-center gap-2">
        <EarthIcon size={16} />
        <div className="text-sm flex items-center gap-1.5">
          <p className="font-medium">Country:</p>
          {Flag && <Flag className="inline! w-6 ml-1 rounded-[3px]" title={country} />}
          <p>{country ? countries.find(({ iso2 }) => iso2 === country)?.name : "Unset"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Building2Icon size={16} />
        <p className="text-sm">
          <span className="font-medium">City / State:</span> {city ?? "Unset"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <PhoneIcon size={16} />
        <p className="text-sm">
          <span className="font-medium">Phone:</span> {phone ?? "Unset"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <BookDashedIcon size={16} />
        <p className="text-sm">
          <span className="font-medium">Last Updated:</span> {updatedAt.toDateString()}
        </p>
      </div>
    </section>
  );
}
