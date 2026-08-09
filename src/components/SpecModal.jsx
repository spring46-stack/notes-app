import specText from "../../SPEC.md?raw";

// タスク帳アプリと同じ考え方のモーダルです。
// "?raw" でSPEC.mdの中身を文字列として読み込み、そのまま表示しています。
export default function SpecModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>仕様書</h2>
          <button className="modal-close" onClick={onClose} aria-label="閉じる">
            ×
          </button>
        </div>
        <pre className="modal-body">{specText}</pre>
      </div>
    </div>
  );
}
