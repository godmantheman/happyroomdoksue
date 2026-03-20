import ReadingTowerApp from "@/components/ReadingTowerApp";
import { getBooks, isDatabaseConfigured } from "@/lib/books";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const books = await getBooks();
  const dbConnected = isDatabaseConfigured();

  return <ReadingTowerApp initialBooks={books} dbConnected={dbConnected} />;
}
