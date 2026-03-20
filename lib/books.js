import postgres from "postgres";
import { randomUUID } from "node:crypto";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  "";

const sql = connectionString
  ? postgres(connectionString, {
      prepare: false
    })
  : null;

function getMemoryStore() {
  if (!globalThis.__READING_TOWER_BOOKS__) {
    globalThis.__READING_TOWER_BOOKS__ = [];
  }

  return globalThis.__READING_TOWER_BOOKS__;
}

export function isDatabaseConfigured() {
  return Boolean(connectionString);
}

async function ensureTable() {
  if (!sql) {
    return;
  }

  await sql`
    create table if not exists reading_books (
      id text primary key,
      title text not null,
      memo text not null default '',
      student_class text not null default '',
      student_name text not null default '',
      created_at timestamptz not null default now()
    )
  `;
}

export async function getBooks() {
  if (!sql) {
    return [...getMemoryStore()];
  }

  await ensureTable();
  const rows = await sql`
    select id, title, memo, student_class, student_name, created_at
    from reading_books
    order by created_at desc
  `;

  return rows.map(mapRow);
}

export async function createBook({ title, memo, studentClass, studentName }) {
  const book = {
    id: randomUUID(),
    title,
    memo: memo ?? "",
    studentClass: studentClass ?? "",
    studentName: studentName ?? "",
    createdAt: new Date().toISOString()
  };

  if (!sql) {
    const store = getMemoryStore();
    store.unshift(book);
    return book;
  }

  await ensureTable();
  const rows = await sql`
    insert into reading_books (
      id,
      title,
      memo,
      student_class,
      student_name
    ) values (
      ${book.id},
      ${book.title},
      ${book.memo},
      ${book.studentClass},
      ${book.studentName}
    )
    returning id, title, memo, student_class, student_name, created_at
  `;

  return mapRow(rows[0]);
}

export async function deleteBook(id) {
  if (!sql) {
    const store = getMemoryStore();
    globalThis.__READING_TOWER_BOOKS__ = store.filter((book) => book.id !== id);
    return;
  }

  await ensureTable();
  await sql`
    delete from reading_books
    where id = ${id}
  `;
}

export async function clearBooks() {
  if (!sql) {
    globalThis.__READING_TOWER_BOOKS__ = [];
    return;
  }

  await ensureTable();
  await sql`delete from reading_books`;
}

function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    memo: row.memo,
    studentClass: row.student_class,
    studentName: row.student_name,
    createdAt: row.created_at
  };
}
