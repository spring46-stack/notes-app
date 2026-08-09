// EmptyState は「右側にまだ何も表示するものが無い」ときの案内画面です。
// メモが0件の場合と、メモはあるけどまだ選んでいない場合とで、少しだけ文言を変えています。
export default function EmptyState({ hasNotes, onCreateNote }) {
  return (
    <div className="empty-state">
      <p className="empty-state-icon" aria-hidden="true">
        🗒️
      </p>
      <p className="empty-state-text">
        {hasNotes
          ? "左の一覧からメモを選んでください"
          : "まだメモがありません。最初のメモを作ってみましょう"}
      </p>
      {!hasNotes && (
        <button className="new-note-button" onClick={onCreateNote}>
          ＋ 新規メモを作成
        </button>
      )}
    </div>
  );
}
