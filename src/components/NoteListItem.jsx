// 一覧に並ぶ「メモ1件分」の見た目です。
// タスク帳の TaskItem と同じ考え方で、props で受け取った内容を表示するだけにしています。
export default function NoteListItem({ note, isSelected, onSelect }) {
  // 本文の先頭部分を、一覧のプレビュー用に短く切り出します。
  // Markdownの記号(#, *, - など)が混ざったままだと見づらいので、簡単に取り除いています。
  const preview = note.content
    .replace(/[#*_`>-]/g, "") // Markdown記号を大まかに除去
    .replace(/\s+/g, " ") // 改行や連続する空白を1つのスペースにまとめる
    .trim()
    .slice(0, 40);

  const formattedDate = new Date(note.updatedAt).toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
  });

  return (
    <li>
      <button
        className={`note-list-item${isSelected ? " is-selected" : ""}`}
        onClick={onSelect}
      >
        <div className="note-list-item-top">
          <span className="note-list-item-title">
            {note.title || "無題のメモ"}
          </span>
          <span className="note-list-item-date">{formattedDate}</span>
        </div>
        {preview && <p className="note-list-item-preview">{preview}</p>}
      </button>
    </li>
  );
}
