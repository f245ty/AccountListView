// ログイン
export const LOGOUT = 'ログアウトしますか？'
export const LOGIN = '再度、ログインしてください。'
export const LOGIN_PAGE = 'ログインページへ行く'

// エラー
export const ERR_MSG = 'エラーが発生しました。'
export const ID_TOKEN_ERR = 'トークン有効期限が切れました。'
export const SESSION_ERR = 'セッションが切れました。'
export const CSV_ERR = 'CSVファイルがダウンロードできませんでした。'
export const LOGIN_ERR = 'ログインに失敗しました。'
export const ERR_WAIT_MSG = 'しばらく時間を置いてから試してください。または、システム管理者にお問い合わせください。'

// CSV
export const CSV_LOADING = 'CSVファイルをダウンロード中です。\nページを閉じると、ダウンロードができません。'
export const DOWNLOAD = 'ダウンロードが終了しました。'

// 検索
export const SEARCH_MSG = '検索中です。'
export const WAIT_MSG = '※しばらく時間がかかることがあります。'
export const EXPLANATION = {
    "owner": "指定したユーザが管理権限を持つフォルダの一覧と、それらのフォルダを利用できるユーザの一覧を表示します。",
    "user": "指定したユーザが利用できるフォルダの一覧と、それらのフォルダを利用できるユーザの一覧を表示します。",
    "folder": "指定したフォルダおよびすべてのサブフォルダの一覧と、各フォルダを利用できるユーザの一覧を表示します。",
    "file": "現在の指定フォルダ（例：/S20001_〇〇工事/〇〇工事）に含まれているファイル数、サイズを集計します。サイズについては、Windows上のサイズと異なる場合があります。CSV保管期間は１０日間です。"
}
export const SEARCH_CONDITION = "指定できるメールアドレスは、１つだけです。"
export const SEARCH_CONDITION_FOLDER = "先頭に「/」を含むフォルダパスを指定してください。"
export const EXECUTION_MSG = "「処理中」の実行ステータスがあるため、新たに実行できません。「処理中」の実行ステータスがなくなってから、再実行してください。"
export const ATTENTION_MSG = "※ 実行ステータスが「失敗」の場合、システムエラーが発生しています。"

// 検索結果0件のメッセージ
export const NO_DATA_MSG = "該当するデータが見つかりませんでした。"
export const NOT_FIND_FOLDER_PATH = "該当するフォルダパスが見つかりませんでした。"
