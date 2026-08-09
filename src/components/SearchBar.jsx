// SearchBar は「検索の入力欄」だけを担当する、小さな部品です。
// 検索の"結果を絞り込む処理"は持たせず、"入力された文字を親に伝える"だけに専念させています。
export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>
      <input
        type="search"
        placeholder="メモを検索…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="メモを検索"
      />
    </div>
  );
}
