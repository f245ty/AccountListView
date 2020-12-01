// ログイン
export const LOGOUT = 'ログアウトしますか？'
export const LOGIN = '再度、ログインしてください。'
export const LOGIN_PAGE = 'ログインページへ行く'

// エラー
export const ERR_MSG = 'エラーが発生しました。'
export const ID_TOKEN_ERR = 'トークン有効期限が切れました。'
export const CSV_ERR = 'CSVファイルがダウンロードできませんでした。'
export const LOGIN_ERR = 'ログインに失敗しました。'
export const ERR_WAIT_MSG = 'しばらく時間を置いてから試してください。または、システム管理者にお問い合わせください。'

// CSV
export const CSV_HEADER = 'CSVファイルをダウンロード中'
export const CSV_LOADING = 'ページを閉じてもダウンロードは実行し続けます。'
export const CSV_RETENSION_PERIOD = 'CSV保管期間は、約10日間です。'

// 検索
export const RECEPTION_MSG = 'CSV作成受付中です。'
export const SEARCH_MSG = '検索中です。'
export const WAIT_MSG = '※しばらく時間がかかることがあります。'
export const EXPLANATION = {
    "owner": "指定したユーザが管理権限を持つフォルダの一覧と、それらのフォルダを利用できるユーザの一覧をCSVファイル形式で作成します。",
    "user": "指定したユーザが利用できるフォルダの一覧をCSVファイル形式で作成します。",
    "folder": "指定したフォルダおよびすべてのサブフォルダの一覧と、各フォルダを利用できるユーザの一覧をCSVファイル形式で作成します。",
    "file": "現在の指定フォルダ（例：/S20001_〇〇工事/〇〇工事）に含まれているファイル数、サイズを集計します。サイズについては、Windows上のサイズと異なる場合があります。" + CSV_RETENSION_PERIOD,
    "check": "指定したサイトパスの社内限定サイト不正権限検査履歴を表示します。" + CSV_RETENSION_PERIOD
}
export const SEARCH_CONDITION = "指定できるメールアドレスは、１つだけです。"
export const SEARCH_CONDITION_FOLDER = "先頭に「/」を含むフォルダパスを指定してください。"
export const EXECUTION_MSG = "の実行ステータスがあるため、ダウンロードを開始できません。実行ステータスが「完了」になるまで、しばらくお待ちください。"
export const ATTENTION_MSG = "※ 実行ステータスが「失敗」の場合、システムエラーが発生しています。"
export const FILE_VALIDATION_MSG = "「/」だけでは、検索対象が広すぎるため、ダウンロード開始できませんでした。検索対象を絞ってください。"

// 検索結果0件のメッセージ
export const NO_DATA_MSG = "該当するデータが見つかりませんでした。"
export const NOT_FIND_FOLDER_PATH = "該当するフォルダパスが見つかりませんでした。"

// メール通知
export const MAIL_NOTIFICATION_MSG = "CSV形式のファイル作成を開始しました。作成完了は、ログインメールアドレスに通知されます。"