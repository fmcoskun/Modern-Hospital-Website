import { notFound } from "next/navigation";

/**
 * proxy bilinmeyen yolları buraya rewrite eder. Build sırasında notFound() ile 404 olarak
 * prerender edilir; böylece ilk istekte de streaming başlamadan gerçek 404 döner.
 */
export default function UnknownPath() {
  notFound();
}
