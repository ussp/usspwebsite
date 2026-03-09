export const dynamic = "force-dynamic";

import { getContactSubmissions } from "@ussp-platform/core/queries/admin/contacts";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { ContactsTable } from "./contacts-table";

export const metadata = { title: "Contacts" };

export default async function ContactsPage() {
  const contacts = await getContactSubmissions();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <h2 className="text-xl font-bold mb-6">
          Contact Submissions ({contacts.length})
        </h2>
        <ContactsTable contacts={contacts} />
      </main>
    </>
  );
}
