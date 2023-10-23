import "./globals.css";
import { instrumentSans } from "./styles/fonts";

export const metadata = {
  title: "Langchain JavaScript",
  description: "Learn  the latest AI technologies from Shawn Esquivel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.className} `}>
        <main className="flex flex-col pt-20 px-20">{children}</main>
      </body>
    </html>
  );
}
