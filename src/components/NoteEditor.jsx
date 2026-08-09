import { marked } from "marked";

// NoteEditor は画面右側、「選択中のメモ1件」を編集・プレビューする部品です。
//
// タイトルや本文の変更は、この部品の中でstateを持たず、
// 入力されるたびに onUpdateNote(patch) を呼んで親(App.jsx)に伝えます。
// 親がその内容でnotes配列を更新し、その結果がまたpropsとしてここに戻ってくる、
// という流れです（Reactの「データは上から下へ流れる」という考え方に沿っています）。
export default function NoteEditor({
  note,
  viewMode,
  onChangeViewMode,
  onUpdateNote,
  onDeleteNote,
}) {
  const formattedDate = new Date(note.updatedAt).toLocaleString("ja-JP");

  return (
    <section className="editor">
      <div className="editor-toolbar">
        <input
          type="text"
          className="title-input"
          value={note.title}
          placeholder="タイトルを入力"
          onChange={(event) => onUpdateNote({ title: event.target.value })}
        />

        <div className="editor-toolbar-right">
          <div className="view-tabs" role="group" aria-label="表示切り替え">
            <button
              className={`view-tab${viewMode === "edit" ? " is-active" : ""}`}
              onClick={() => onChangeViewMode("edit")}
            >
              編集
            </button>
            <button
              className={`view-tab${
                viewMode === "preview" ? " is-active" : ""
              }`}
              onClick={() => onChangeViewMode("preview")}
            >
              プレビュー
            </button>
          </div>
          <button className="delete-note-button" onClick={onDeleteNote}>
            削除
          </button>
        </div>
      </div>

      <p className="updated-at">最終更新: {formattedDate}</p>

      {viewMode === "edit" ? (
        <textarea
          className="content-textarea"
          value={note.content}
          placeholder={
            "Markdownで書けます。\n\n# 見出し\n**太字** や *斜体*\n- リスト項目\n\n```\nコードブロック\n```"
          }
          onChange={(event) => onUpdateNote({ content: event.target.value })}
        />
      ) : (
        <MarkdownPreview content={note.content} />
      )}
    </section>
  );
}

// MarkdownPreview は「Markdownの文字列を、実際の見た目(HTML)に変換して表示する」部品です。
//
// なぜ自分でMarkdownの変換処理を書かないのか？
// Markdownの仕様は見た目より複雑（リストのネスト、表、コードブロックの中身をそのまま表示する処理など）で、
// 自作すると抜け漏れが起きやすい部分です。ここでは "marked" という実績のある
// 軽量ライブラリに変換を任せています（詳しい理由はREADME.mdに書いています）。
function MarkdownPreview({ content }) {
  if (!content.trim()) {
    return <p className="preview-empty">（本文がありません）</p>;
  }

  // marked.parse() は、Markdownの文字列を受け取ってHTMLの文字列を返す関数です。
  const html = marked.parse(content);

  // dangerouslySetInnerHTML は、Reactに「このHTML文字列をそのまま画面に描画してください」
  // と伝えるための書き方です。名前に "dangerously"(危険)と付いているのは、
  // 通常この方法で他人が書いた文字列を表示すると、悪意のあるスクリプトが
  // 埋め込まれて実行されてしまう危険(XSS)があるためです。
  // このアプリでは「自分のブラウザに保存された、自分自身が書いたメモ」だけを表示するため
  // 許容していますが、複数人が使うアプリや外部から受け取った文章を表示する場合は、
  // DOMPurifyのような「HTMLを安全に無害化するライブラリ」を必ず併用してください。
  return (
    <div
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
