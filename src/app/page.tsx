import { redirect } from "next/navigation";

// Root / redirects to the default locale. The proxy handles this before
// the page renders; this is the fallback, and it used to say /en.
export default function RootPage() {
  redirect("/ar");
}
