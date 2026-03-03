import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "LCA - USSP",
  description: "USSP Labor Condition Application (LCA) public access file.",
};

export default function LCAPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-alata)] mb-4">
            LCA Public Access File
          </h1>
          <p className="text-xl text-white/80 font-[family-name:var(--font-montserrat)]">
            Labor Condition Application
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="Public Disclosure"
            subtitle="In compliance with U.S. Department of Labor regulations"
          />
          <div className="space-y-6 text-dark/80 font-[family-name:var(--font-montserrat)] leading-relaxed">
            <p>
              This page serves as the public access file for Labor Condition
              Applications (LCA) filed by USSP Inc. in connection with H-1B
              visa petitions.
            </p>
            <p>
              In accordance with the regulations of the U.S. Department of
              Labor, USSP Inc. maintains a public access file for each LCA
              filed. The public access file contains information about the
              employer&apos;s compliance with the terms and conditions of the
              H-1B program.
            </p>

            <div className="bg-light-gray rounded-lg p-8 mt-8">
              <h3 className="text-xl font-[family-name:var(--font-alata)] mb-4">
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold">Company:</span> US Software Professionals Inc.
                </div>
                <div>
                  <span className="font-bold">Address:</span> 875 N Michigan
                  Ave, Suite 3100, Chicago, IL 60614
                </div>
                <div>
                  <span className="font-bold">Phone:</span> +1-(312) 546-4306
                </div>
                <div>
                  <span className="font-bold">Fax:</span> +1-(312) 253-2026
                </div>
              </div>
            </div>

            <p className="text-sm text-dark/50 mt-8">
              For questions regarding this public access file, please contact us
              at our office during business hours: Mon - Fri 8:00 am to 5:00 pm.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
