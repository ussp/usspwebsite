import { connection } from "next/server";
import { Suspense } from "react";
import PositionDetailPage from "./position-detail";

export const dynamic = "force-dynamic";

export default async function Page() {
  await connection();
  return (
    <Suspense>
      <PositionDetailPage />
    </Suspense>
  );
}
