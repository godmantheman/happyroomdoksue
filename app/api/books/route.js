import { NextResponse } from "next/server";
import { clearBooks, createBook, getBooks } from "@/lib/books";

export async function GET() {
  const books = await getBooks();
  return NextResponse.json({ books });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const memo = String(body.memo ?? "").trim();
    const studentClass = String(body.studentClass ?? "").trim();
    const studentName = String(body.studentName ?? "").trim();

    if (!title) {
      return NextResponse.json(
        { error: "책 제목을 입력해 주세요." },
        { status: 400 }
      );
    }

    const book = await createBook({
      title,
      memo,
      studentClass,
      studentName
    });

    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "책을 저장하지 못했어요." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await clearBooks();
  return NextResponse.json({ ok: true });
}
