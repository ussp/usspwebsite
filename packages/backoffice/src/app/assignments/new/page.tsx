import { connection } from "next/server";
import { Suspense } from "react";
import NewAssignmentPage from "./new-assignment-form";

export const dynamic = "force-dynamic";

export default async function Page() {
  await connection();
  return (
    <Suspense>
      <NewAssignmentPage />
    </Suspense>
  );
}
