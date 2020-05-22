// メニュー定義
export const MENU_ITEMS = {
    "administrator": {
        "#owner": ["@", "管理権限フォルダ一覧"],
        "#user": ["@", "利用可能フォルダ一覧"],
        "#folder": ["/", "指定フォルダ利用者一覧"]
    },
    "manager": {
        "#owner": ["@", "管理フォルダ権限一覧"],
        "#user": ["@", "利用可能フォルダ一覧"],
    },
    "user": {
    }
}


// 日本語ヘッダーを定義
export const HEADER_LABEL = {
    "#": "#",
    "user_email": "ユーザメールアドレス",
    "user_name": "ユーザ名",
    "folder_path": "フォルダパス",
    "permission": "権限",
    "owner_name": "フォルダ管理者名",
    "p_view": "閲覧権限",
    "p_download": "ダウンロード権限",
    "p_upload": "アップロード権限",
    "p_admin": "フォルダ管理権限",
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
export const DEFAULT_ROWS_PAR_PAGE = 10

// Cognito Identity Pool ID
export const IDENTITY_POOL_ID = 'ap-northeast-1:fe11ba82-e9f9-4481-b370-8eb53729fc29'
export const ACCOUNT_ID = '498191950326'

// Group ID
export const ADMIN_GROUP_ID = '269ec94e-7c5f-48b6-a541-1a34b08208a0'
export const MNG_GROUP_ID = 'd5b80467-c8b5-4edc-a714-45c30e86fbee'

// 認証処理後のリダイレクトURIを表示サイトに合わせて取得
const HOST = window.location.host
const HTTP_PROTOCOL = window.location.host.indexOf('localhost') === 0 ? 'http://' : 'https://'
const REDIRECT_URI = encodeURIComponent(HTTP_PROTOCOL + HOST)

// Azure AD のログイン要求先
const DOMAIN = 'login.microsoftonline.com'
const DIRECTORY_ID = 'dd866e13-f8b7-4585-bb47-be0efba1c006'
const APPLICATION_ID = '7adcb600-5dfd-422e-8df0-0f33363bd19c'
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
export const ROLES = { "administrator": ADMIN_GROUP_ID, "manager": MNG_GROUP_ID }

// グループ情報取得API
export const GET_GROUPS_URL = "https://g37zf38yj5.execute-api.ap-northeast-1.amazonaws.com/prod/"

