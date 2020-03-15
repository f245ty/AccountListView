// 日本語ヘッダーを定義
export const HEADER_LABEL = {
    "#": "#",
    "user_email": "メールアドレス",
    "user_name": "ユーザ名",
    "folder_path": "フォルダパス",
    "permission": "権限",
    "owner_name": "管理者名",
    "p_read": "閲覧権限",
    "p_download": "ダウンロード権限",
    "p_upload": "アップロード権限",
    "p_admin": "管理権限",
    "p_delete": "削除権限",
    "p_notify_ul": "アップロード通知",
    "p_notify_dl": "ダウンロード通知",
    "p_owner": "フォルダ所有権"
}


// 表示ラベルの順番、ラベルの表示、非表示の設定
export const PERMISSION_LABELS = ['p_read', 'p_upload', 'p_download', 'p_delete', 'p_admin']
export const OWNER_LABELS = ['#', 'owner_name', 'folder_path', 'user_email', 'user_name']
export const USER_LABELS = ['#', 'folder_path', 'owner_name']
export const PERMISSION_LABELS_CSV = ['#', 'p_read', 'p_upload', 'p_download', 'p_delete', 'p_admin']
export const OWNER_LABELS_CSV = ['#', 'folder_path', 'owner_name', 'user_email', 'user_name']
export const USER_LABELS_CSV = ['#', 'folder_path', 'owner_name']

// 1ページあたりのページ数のデフォルト
export const DEFAULT_ROWS_PAR_PAGE = 5
