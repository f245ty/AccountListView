// メニュー定義
export const MENU_ITEMS = {
    "administrator": {
        "#owner": ["@", "管理フォルダ権限一覧"],
        "#user": ["@", "権限所有フォルダ一覧"],
        "#folder": ["/", "フォルダ権限保持者一覧"]
    },
    "manager": {
        "#owner": ["@", "管理フォルダ権限一覧"],
        "#user": ["@", "権限所有フォルダ一覧"],
    },
    "user": {
    }
}


// 日本語ヘッダーを定義
export const HEADER_LABEL = {
    "#": "#",
    "user_email": "メールアドレス",
    "user_name": "ユーザ名",
    "folder_path": "フォルダパス",
    "permission": "権限",
    "owner_name": "管理者名",
    "p_view": "閲覧権限",
    "p_download": "ダウンロード権限",
    "p_upload": "アップロード権限",
    "p_admin": "管理権限",
    "p_delete": "削除権限",
    "p_notify_ul": "アップロード通知",
    "p_notify_dl": "ダウンロード通知",
    "p_owner": "フォルダ所有権"
}


// 表示ラベルの順番、ラベルの表示、非表示の設定
const PERMISSION_LABELS = ['p_view', 'p_upload', 'p_download', 'p_delete', 'p_admin']
const PERMISSION_LABELS_CSV = ['p_view', 'p_upload', 'p_download', 'p_delete', 'p_admin']
const OWNER_LABELS = ['#', 'owner_name', 'folder_path', 'user_email', 'user_name']
const OWNER_LABELS_CSV = ['#', 'folder_path', 'owner_name', 'user_email', 'user_name']
const USER_LABELS = ['#', 'folder_path', 'owner_name']
const USER_LABELS_CSV = ['#', 'folder_path', 'owner_name']
const FOLDER_LABELS = ['#', 'folder_path', 'owner_name']
const FOLDER_LABELS_CSV = ['#', 'folder_path', 'owner_name']
export const OUTPUT_LABELS = {
    "screen": {
        "#owner": OWNER_LABELS.concat(PERMISSION_LABELS),
        "#user": USER_LABELS.concat(PERMISSION_LABELS),
        "#folder": FOLDER_LABELS.concat(PERMISSION_LABELS)
    },
    "csv": {
        "#owner": OWNER_LABELS_CSV.concat(PERMISSION_LABELS_CSV),
        "#user": USER_LABELS_CSV.concat(PERMISSION_LABELS_CSV),
        "#folder": FOLDER_LABELS_CSV.concat(PERMISSION_LABELS_CSV)
    }
}


// 1ページあたりのページ数のデフォルト
export const DEFAULT_ROWS_PAR_PAGE = 5


// Cognito Identity Pool ID
export const IDENTITY_POOL_ID = 'ap-northeast-1:9cd11c18-7668-4ea3-8427-40a8aed8ec94'
export const ACCOUNT_ID = '707439530427'

// Group ID
export const ADMIN_GROUP_ID = '86c759da-6918-4d19-8931-2cfa5f8f6ec7'
export const MNG_GROUP_ID = 'a746a5b4-795b-4d5a-8d2b-4559b92d9bf4'


// 認証処理後のリダイレクトURIを表示サイトに合わせて取得
const HOST = window.location.host
const HTTP_PROTOCOL = window.location.host.indexOf('localhost') === 0 ? 'http://' : 'https://'
const REDIRECT_URI = encodeURIComponent(HTTP_PROTOCOL + HOST)

// Azure AD のログイン要求先
const DOMAIN = 'login.microsoftonline.com'
const DIRECTORY_ID = '8a08112f-92e8-43fe-9a0a-56d393b9f042'
const APPLICATION_ID = '3a0aef16-07ab-4f88-8122-4114b7c496a1'
const PROTOCOL = 'oauth2/v2.0'
const SITE = 'https://' + DOMAIN + '/' + DIRECTORY_ID + '/' + PROTOCOL + '/';
export const LOGIN_URI = SITE + 'authorize?client_id=' + APPLICATION_ID
    + '&redirect_uri=' + REDIRECT_URI
    + '&scope=openid+profile+email&response_type=id_token+code&response_mode=fragment&nonce='
export const LOGOUT_URI = SITE + 'logout?post_logout_redirect_uri=' + REDIRECT_URI
export const LOGINS_SET_ID = DOMAIN + '/' + DIRECTORY_ID + '/v2.0'

// ロール設定(groupe ID : 名前)
export const ROLE_NAME = {
    "administrator": "システム管理者",
    "manager": "一般管理者",
    "user": "一般ユーザ"
}

// ロールの権限序列設定
export const ROLE_ORDER = ["administrator", "manager"]

// ロール付与グループ一覧
export const ROLES = {"administrator":ADMIN_GROUP_ID, "manager":MNG_GROUP_ID}