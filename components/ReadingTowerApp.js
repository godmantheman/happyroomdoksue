"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

const PROFILE_KEY = "reading-tower-profile";

const sampleBooks = [
  {
    title: "아몬드",
    memo: "감정을 배워가는 장면이 오래 남았다.",
    studentClass: "2학년 3반",
    studentName: "김행복"
  },
  {
    title: "페인트",
    memo: "가족에 대해 다시 생각해 보게 된 이야기.",
    studentClass: "2학년 3반",
    studentName: "김행복"
  },
  {
    title: "긴긴밤",
    memo: "슬프지만 따뜻한 우정이 기억난다.",
    studentClass: "2학년 3반",
    studentName: "김행복"
  }
];

export default function ReadingTowerApp({ initialBooks, dbConnected }) {
  const [books, setBooks] = useState(initialBooks);
  const [studentClass, setStudentClass] = useState("");
  const [studentName, setStudentName] = useState("");
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(PROFILE_KEY);
      if (!saved) {
        return;
      }

      const profile = JSON.parse(saved);
      setStudentClass(profile.studentClass ?? "");
      setStudentName(profile.studentName ?? "");
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({ studentClass, studentName })
    );
  }, [studentClass, studentName]);

  const towerCountText = useMemo(
    () => `${books.length}권을 기록했어요.`,
    [books.length]
  );

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("책 제목을 먼저 적어주세요.");
      return;
    }

    setMessage("");

    startTransition(async () => {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          memo,
          studentClass,
          studentName
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error ?? "저장 중 문제가 생겼어요.");
        return;
      }

      setBooks((current) => [result.book, ...current]);
      setTitle("");
      setMemo("");
      setMessage("독서탑에 책이 올라갔어요.");
    });
  }

  function handleFillSample() {
    if (books.length > 0) {
      setMessage("기존 기록이 있을 때는 예시를 넣지 않아요.");
      return;
    }

    startTransition(async () => {
      const createdBooks = [];

      for (const sample of sampleBooks) {
        const response = await fetch("/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(sample)
        });

        const result = await response.json();
        if (response.ok) {
          createdBooks.push(result.book);
        }
      }

      if (createdBooks.length > 0) {
        setBooks(createdBooks.reverse());
        setMessage("예시 독서탑을 채웠어요.");
      }
    });
  }

  function handleReset() {
    startTransition(async () => {
      const response = await fetch("/api/books", {
        method: "DELETE"
      });

      if (!response.ok) {
        setMessage("기록을 지우지 못했어요.");
        return;
      }

      setBooks([]);
      setMessage("독서탑을 비웠어요.");
    });
  }

  function handleDelete(bookId) {
    startTransition(async () => {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        setMessage("책을 삭제하지 못했어요.");
        return;
      }

      setBooks((current) => current.filter((book) => book.id !== bookId));
      setMessage("책 한 권을 독서탑에서 내렸어요.");
    });
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-meta">
          <div className="meta-card">
            <label htmlFor="studentClass">학번</label>
            <input
              id="studentClass"
              type="text"
              placeholder="예: 2학년 3반"
              value={studentClass}
              onChange={(event) => setStudentClass(event.target.value)}
            />
          </div>
          <div className="meta-card">
            <label htmlFor="studentName">이름</label>
            <input
              id="studentName"
              type="text"
              placeholder="이름을 적어보세요"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
            />
          </div>
        </div>

        <div className="hero-title-wrap">
          <p className="hero-badge">중학생 행복반: 책으로 여는 마음</p>
          <h1>독서탑</h1>
          <p className="hero-desc">책 제목을 적어 차곡차곡 쌓는 나만의 기억 노트</p>
          <p className={`status-chip ${dbConnected ? "connected" : "demo"}`}>
            {dbConnected
              ? "데이터베이스 연결됨: GitHub + Vercel 배포 준비 완료"
              : "임시 모드: DATABASE_URL 또는 POSTGRES_URL을 연결하면 영구 저장됩니다"}
          </p>
        </div>

        <div className="hero-face" aria-hidden="true">
          ☺
        </div>
      </header>

      <main className="layout">
        <section className="panel control-panel">
          <div className="panel-title">
            <h2>오늘의 기록</h2>
            <p>읽은 책 제목을 적으면 독서탑에 바로 쌓여요.</p>
          </div>

          <form className="book-form" onSubmit={handleSubmit}>
            <label htmlFor="bookTitle">책 제목</label>
            <input
              id="bookTitle"
              name="bookTitle"
              type="text"
              maxLength={60}
              placeholder="예: 아몬드"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />

            <label htmlFor="bookMemo">짧은 메모</label>
            <textarea
              id="bookMemo"
              name="bookMemo"
              maxLength={120}
              rows={3}
              placeholder="기억하고 싶은 한 줄을 남겨보세요"
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
            />

            <button type="submit" disabled={isPending}>
              {isPending ? "저장하는 중..." : "독서탑에 올리기"}
            </button>
          </form>

          <div className="panel-actions">
            <button
              type="button"
              className="secondary"
              onClick={handleFillSample}
              disabled={isPending}
            >
              예시 채우기
            </button>
            <button
              type="button"
              className="ghost"
              onClick={handleReset}
              disabled={isPending}
            >
              모두 지우기
            </button>
          </div>

          <p className="message">{message || "제목과 메모를 남기면 서버에 저장돼요."}</p>
        </section>

        <section className="panel tower-panel">
          <div className="tower-header">
            <div>
              <h2>나의 독서탑</h2>
              <p>{towerCountText}</p>
            </div>
            <div className="tower-deco" aria-hidden="true">
              📚
            </div>
          </div>

          <div className="tower-frame">
            <div className="book-tower" aria-live="polite">
              {books.length === 0 ? (
                <div className="empty-state">
                  <strong>아직 비어 있어요</strong>
                  <p>왼쪽에 책 제목을 적으면 첫 번째 책이 독서탑에 올라와요.</p>
                </div>
              ) : (
                books.map((book, index) => (
                  <article
                    className={`book color-${index % 6}`}
                    key={book.id}
                  >
                    <div className="book-spine">
                      <span className="book-order">{books.length - index}권</span>
                    </div>

                    <div className="book-body">
                      <div className="book-text">
                        <p className="book-label">✎ 책 제목</p>
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-owner">
                          {book.studentClass || "학번 미입력"} · {book.studentName || "이름 미입력"}
                        </p>
                      </div>
                      <p className="book-memo">
                        {book.memo || "기억하고 싶은 문장을 아직 적지 않았어요."}
                      </p>
                    </div>

                    <button
                      className="book-remove"
                      type="button"
                      aria-label="책 삭제"
                      onClick={() => handleDelete(book.id)}
                      disabled={isPending}
                    >
                      ×
                    </button>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
