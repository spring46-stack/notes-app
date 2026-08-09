// このファイルは「localStorageとのやり取り」だけを担当します。
// App.jsxの中に直接書いてもいいのですが、
// 「保存の仕組み」と「画面の組み立て」を別ファイルに分けておくと、
// 後から「保存先をlocalStorageからサーバーに変える」ときに、
// このファイルの中身だけを直せばよくなります。
// （このような分け方を「関心の分離」と呼びます）

const STORAGE_KEY = "notes-app-notes";

// 保存されているメモの配列を読み込みます。
// 何も保存されていない、またはデータが壊れている場合は空配列を返します。
export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("メモの読み込みに失敗しました:", error);
    return [];
  }
}

// メモの配列をそのまま保存します。
export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    // 例えば保存容量の上限を超えた場合などにここに来ます。
    console.error("メモの保存に失敗しました:", error);
  }
}

// 新しい空のメモを1件作ります。
// IDの生成に crypto.randomUUID() を使っています。
// これはブラウザ標準の機能で、「世界でほぼ重複しない文字列」を作ってくれます。
// （前回のタスク帳では Date.now() を使いましたが、
//   短時間に連続でメモを作るとID がかぶる可能性があるため、
//   今回はより安全な randomUUID を採用しています。理由はREADME.mdに詳しく書いています）
export function createEmptyNote() {
  return {
    id: crypto.randomUUID(),
    title: "無題のメモ",
    content: "",
    updatedAt: new Date().toISOString(),
  };
}
