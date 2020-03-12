// 日本語ヘッダーを定義
export const HEADER_LABEL = {
    "#": "#",
    "user_email": "メールアドレス",
    "user_name": "ユーザ名",
    "path": "フォルダパス",
    "folder": "フォルダ",
    "permission": "権限",
    "owner": "管理者",
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
export const OWNER_LABELS = ['#', 'owner', 'path', 'folder', 'user_email', 'user_name']
export const USER_LABELS = ['#', 'path', 'owner', 'folder']
export const PERMISSION_LABELS_CSV = ['#', 'p_read', 'p_upload', 'p_download', 'p_delete', 'p_admin']
export const OWNER_LABELS_CSV = ['#', 'path', 'folder', 'owner', 'user_email', 'user_name']
export const USER_LABELS_CSV = ['#', 'path', 'owner', 'folder']
