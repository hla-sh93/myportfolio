import { getStoredCertificates } from "@/lib/content-store";
import { CertificatesEditor } from "./CertificatesEditor";

export const metadata = { title: "Certificates | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await getStoredCertificates();

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <header>
        <h1 className="text-xl font-bold">Certificates</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--ad-muted)" }}>
          Courses and certificates shown on the About page. Lower order appears
          first.
        </p>
      </header>

      <CertificatesEditor initial={certificates} />
    </div>
  );
}
