import SearchBar from "./SearchBar.jsx";
import NoteListItem from "./NoteListItem.jsx";

// Sidebar は「検索欄」「新規作成ボタン」「メモ一覧」をまとめた、画面左側の部品です。
// 実際のデータ操作(検索処理やメモの作成)はすべて親(App.jsx)にあるので、
// このコンポーネントは props で受け取ったものを並べて表示し、
// クリックされたら親から渡された関数を呼ぶだけの役割です。
export default function Sidebar({
  notes,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelectNote,
  onCreateNote,
  onOpenSpec,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">メモ帳</h1>
        <button className="new-note-button" onClick={onCreateNote}>
          ＋ 新規メモ
        </button>
      </div>

      <SearchBar value={searchQuery} onChange={onSearchChange} />

      {notes.length === 0 ? (
        <p className="sidebar-empty">
          {searchQuery ? "一致するメモがありません" : "メモがありません"}
        </p>
      ) : (
        <ul className="note-list">
          {notes.map((note) => (
            <NoteListItem
              key={note.id}
              note={note}
              isSelected={note.id === selectedId}
              onSelect={() => onSelectNote(note.id)}
            />
          ))}
        </ul>
      )}

      <button className="spec-link" onClick={onOpenSpec}>
        仕様書を見る
      </button>
    </aside>
  );
}
