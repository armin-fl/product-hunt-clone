import { permanentRedirect } from "next/navigation";

export default function ArchivePage() {
  // SEO: consolidate duplicate archive content into the canonical /products route.
  permanentRedirect("/products");
}
