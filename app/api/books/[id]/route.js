import { NextResponse } from "next/server";
import { deleteBook } from "@/lib/books";

export async function DELETE(_request, { params }) {
  try {
    await deleteBook(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "책을 삭제하지 못했어요." },
      { status: 500 }
    );
  }
}
