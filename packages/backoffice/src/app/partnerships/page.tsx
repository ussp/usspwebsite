export const dynamic = "force-dynamic";

import Link from "next/link";
import { connection } from "next/server";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { getAllPartners, type Partner, type PartnerContact } from "@/lib/partners";

export const metadata = { title: "Partnerships" };

const typeBadgeColors: Record<Partner["type"], string> = {
  prime_vendor: "bg-blue-100 text-blue-700",
  technology: "bg-purple-100 text-purple-700",
  investment: "bg-green-100 text-green-700",
  reseller: "bg-amber-100 text-amber-700",
};

const typeLabels: Record<Partner["type"], string> = {
  prime_vendor: "Prime Vendor",
  technology: "Technology",
  investment: "Investment",
  reseller: "Reseller",
};

const statusBadgeColors: Record<Partner["status"], string> = {
  active: "bg-green-100 text-green-700",
  in_conversation: "bg-amber-100 text-amber-700",
  inactive: "bg-gray-100 text-gray-500",
};

const statusLabels: Record<Partner["status"], string> = {
  active: "Active",
  in_conversation: "In Conversation",
  inactive: "Inactive",
};

function getKeyContact(contacts: PartnerContact[]): PartnerContact | null {
  if (contacts.length === 0) return null;
  const poc = contacts.find(
    (c) =>
      c.role.toLowerCase().includes("poc") ||
      c.role.toLowerCase().includes("partner")
  );
  return poc ?? contacts[0];
}

export default async function PartnershipsPage() {
  await connection();
  const partners = getAllPartners();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Partnerships ({partners.length})</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map((partner) => {
            const keyContact = getKeyContact(partner.contacts);
            const href = `/partnerships/${partner.slug}`;

            return (
              <Link
                key={partner.slug}
                href={href}
                className="block rounded-lg border border-light-gray bg-white p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-dark leading-tight">
                    {partner.name}
                  </h3>
                  <div className="flex gap-2 shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadgeColors[partner.type]}`}
                    >
                      {typeLabels[partner.type]}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadgeColors[partner.status]}`}
                    >
                      {statusLabels[partner.status]}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-dark/70 line-clamp-2 mb-3">
                  {partner.about}
                </p>

                {keyContact && (
                  <div className="text-xs text-dark/50">
                    <span className="font-medium text-dark/70">
                      {keyContact.name}
                    </span>{" "}
                    &middot; {keyContact.role}
                  </div>
                )}

                {!keyContact && partner.contacts.length === 0 && (
                  <div className="text-xs text-dark/40 italic">
                    No contacts yet
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
