import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Discover - USSP",
};

export default function Discover1() {
  redirect("/discover");
}
