import Link from "next/link";
import "./globals.css";
export const metadata = {
  title: "404 · Ocean Plastic Mining Project",
  robots: { index: false },
};
export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <main className="entry">
          <span className="eyebrow">OPM / 404</span>
          <h1>Uncharted waters.</h1>
          <p>This page does not exist. / 此页面不存在。</p>
          <Link className="button primary" href="/en/">
            Return to the project ↗
          </Link>
          <Link className="button" href="/zh/">
            返回项目首页 ↗
          </Link>
        </main>
      </body>
    </html>
  );
}
