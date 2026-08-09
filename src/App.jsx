import { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/Sidebar.jsx";
import NoteEditor from "./components/NoteEditor.jsx";
import EmptyState from "./components/EmptyState.jsx";
import SpecModal from "./components/SpecModal.jsx";
import { loadNotes, saveNotes, createEmptyNote } from "./utils/storage.js";
import "./App.css";

export default function App() {
  // ---- 状態(state)の定義 ----

  // notes: 全メモの配列。CRUD操作のたびにここが変わります。
  // useState(loadNotes) のように関数を渡すと、
  // 「最初の描画の時だけ」その関数を実行して初期値を決めてくれます。
  // （毎回の再描画のたびにlocalStorageを読みに行かずに済みます）
  const [notes, setNotes] = useState(loadNotes);

  // selectedId: 今どのメモを選んでいるか。まだ何も選んでいなければ null。
  const [selectedId, setSelectedId] = useState(null);

  // searchQuery: 検索欄に入力されている文字列。
  const [searchQuery, setSearchQuery] = useState("");

  // viewMode: 選択中メモの表示モード。"edit"(編集) か "preview"(プレビュー)。
  const [viewMode, setViewMode] = useState("edit");

  const [isSpecOpen, setIsSpecOpen] = useState(false);

  // notes が変わるたびに、自動でlocalStorageへ保存します。
  // 「編集する → notesが変わる → 自動保存される」という流れが
  // このuseEffect 1つだけで完結しています。
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // ---- CRUD操作 ----
  // Create / Read / Update / Delete の頭文字。データを扱うアプリの基本4操作です。

  // Create: 新しい空メモを作り、それを選択状態にして編集モードに入る
  function handleCreateNote() {
    const newNote = createEmptyNote();
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
    setViewMode("edit");
  }

  // Update: 指定したIDのメモの一部を書き換える
  // patch には { title: "新しいタイトル" } のように「変更したい部分だけ」を渡します。
  function handleUpdateNote(id, patch) {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...patch, updatedAt: new Date().toISOString() }
          : note
      )
    );
  }

  // Delete: 指定したIDのメモを削除する
  function handleDeleteNote(id) {
    const target = notes.find((note) => note.id === id);
    const label = target?.title || "このメモ";
    // window.confirm は「はい/いいえ」を選べる簡易的な確認ダイアログです。
    // 誤操作で大事なメモを消してしまわないための安全策です。
    const ok = window.confirm(`「${label}」を削除します。よろしいですか？`);
    if (!ok) return;

    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  // ---- 検索(Read + フィルタリング) ----
  // useMemo は「依存する値が変わったときだけ、計算をやり直す」ためのフックです。
  // ここでは notes か searchQuery が変わった時だけ絞り込みをやり直します。
  // （毎回の再描画で無駄に絞り込み処理を繰り返さないための最適化です）
  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const base = query
      ? notes.filter(
          (note) =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        )
      : notes;

    // 更新日時が新しい順に並べ替えます。
    // sort は元の配列を直接変更してしまうため、[...base] でコピーしてから使います。
    return [...base].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }, [notes, searchQuery]);

  const selectedNote = notes.find((note) => note.id === selectedId) ?? null;

  return (
    <div className="app-shell">
      <Sidebar
        notes={filteredNotes}
        selectedId={selectedId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectNote={(id) => {
          setSelectedId(id);
          setViewMode("preview");
        }}
        onCreateNote={handleCreateNote}
        onOpenSpec={() => setIsSpecOpen(true)}
      />

      {selectedNote ? (
        <NoteEditor
          note={selectedNote}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onUpdateNote={(patch) => handleUpdateNote(selectedNote.id, patch)}
          onDeleteNote={() => handleDeleteNote(selectedNote.id)}
        />
      ) : (
        <EmptyState hasNotes={notes.length > 0} onCreateNote={handleCreateNote} />
      )}

      {isSpecOpen && <SpecModal onClose={() => setIsSpecOpen(false)} />}
    </div>
  );
}
