const react_app_env = process.env.REACT_APP_ENV || 'dev';
// AWS 環境
var REGION = ''

// Cognito Identity Pool ID
var IDENTITY_POOL_ID = ''
var ACCOUNT_ID = ''

// Group ID
var SUPER_USER_GROUP_ID = ''
var ADMIN_GROUP_ID = ''
var MNG_GROUP_ID = ''

// Azure AD のログイン要求先
var DOMAIN = ''
var DIRECTORY_ID = ''
var APPLICATION_ID = ''
var PROTOCOL = ''

// グループ情報取得API
var GET_GROUPS_URL = ''

// 汎用検索API
var GET_PERMISSION_URL = ''

// CSVダウンロード実行タスク確認API
var GET_CSV_TASKS_URL = ''

// CSVダウンロード実行タスクのダウンロードリンクから署名付きURLを取得するAPI
var GET_S3_URL = ''

if (react_app_env === "prod") {
    REGION = 'ap-northeast-1'
    IDENTITY_POOL_ID = `${REGION}:fe11ba82-e9f9-4481-b370-8eb53729fc29`
    ACCOUNT_ID = '498191950326'
    SUPER_USER_GROUP_ID = ``
    ADMIN_GROUP_ID = '269ec94e-7c5f-48b6-a541-1a34b08208a0'
    MNG_GROUP_ID = 'd5b80467-c8b5-4edc-a714-45c30e86fbee'
    DOMAIN = 'login.microsoftonline.com'
    DIRECTORY_ID = 'dd866e13-f8b7-4585-bb47-be0efba1c006'
    APPLICATION_ID = '7adcb600-5dfd-422e-8df0-0f33363bd19c'
    PROTOCOL = 'oauth2/v2.0'
    GET_GROUPS_URL = `https://g37zf38yj5.execute-api.${REGION}.amazonaws.com/prod`
    GET_PERMISSION_URL = `https://uuy7k5gfqb.execute-api.${REGION}.amazonaws.com/prod/`
    GET_CSV_TASKS_URL = `https://wxq147i7n1.execute-api.${REGION}.amazonaws.com/prod`
    GET_S3_URL = `https://navhbhki2d.execute-api.${REGION}.amazonaws.com/prod`
} else if (react_app_env === "dev") {
    REGION = 'ap-northeast-1'
    IDENTITY_POOL_ID = `${REGION}:9cd11c18-7668-4ea3-8427-40a8aed8ec94`
    ACCOUNT_ID = '707439530427'
    SUPER_USER_GROUP_ID = `a384385b-2edd-4038-91ed-94ccf529c3c6`
    ADMIN_GROUP_ID = '86c759da-6918-4d19-8931-2cfa5f8f6ec7'
    MNG_GROUP_ID = 'a746a5b4-795b-4d5a-8d2b-4559b92d9bf4'
    DOMAIN = 'login.microsoftonline.com'
    DIRECTORY_ID = '8a08112f-92e8-43fe-9a0a-56d393b9f042'
    APPLICATION_ID = '3a0aef16-07ab-4f88-8122-4114b7c496a1'
    PROTOCOL = 'oauth2/v2.0'
    GET_GROUPS_URL = `https://stp3h4k946.execute-api.${REGION}.amazonaws.com/develop`
    GET_PERMISSION_URL = `https://fusppa21xg.execute-api.${REGION}.amazonaws.com/dev`
    GET_CSV_TASKS_URL = `https://fj0y0qtqe2.execute-api.${REGION}.amazonaws.com/dev`
    GET_S3_URL = `https://bwz2s1u3kc.execute-api.${REGION}.amazonaws.com/dev`
}

export {
    REGION,
    IDENTITY_POOL_ID,
    ACCOUNT_ID,
    GET_GROUPS_URL,
    GET_PERMISSION_URL,
    GET_CSV_TASKS_URL,
    GET_S3_URL
}

// common
// メニュー定義
export const MENU_ITEMS = {
    "superuser": {
        "#owner": ["@", "管理権限フォルダ一覧"],
        "#user": ["@", "利用可能フォルダ一覧"],
        "#folder": ["/", "指定フォルダ利用者一覧"],
        "#file": ["/", "指定フォルダ内ファイル情報集計"],
    },
    "administrator": {
        "#owner": ["@", "管理権限フォルダ一覧"],
        "#user": ["@", "利用可能フォルダ一覧"],
        "#folder": ["/", "指定フォルダ利用者一覧"],
        "#file": ["/", "指定フォルダ内ファイル情報集計"],
    },
    "manager": {
        "#owner": ["@", "管理権限フォルダ一覧"],
        "#user": ["@", "利用可能フォルダ一覧"],
    },
    "user": {
    }
}

// 日本語ヘッダーを定義
export const HEADER_LABEL = {
    "#": "#",
    "user_email": "実行ユーザ",
    "folder_path": "検索パス",
    "create_at": "実行日時",
    "csv_ttl": "CSV保管期間",
    "zip_ttl": "CSV保管期間",
    "download_ln": "ダウンロードリンク",
    "process_state": "実行ステータス",
    // "search_email": "フォルダ管理者",
    "search_condition": "検索パス"
}

// 表示ラベルの順番、ラベルの表示、非表示の設定
const FILE_LABELS = ['#', 'folder_path', 'user_email', 'create_at', 'csv_ttl', 'process_state', 'download_ln']
const PERMISSION_LABELS = ['#', 'search_condition', 'create_at', 'zip_ttl', 'process_state', 'download_ln']
const PERMISSION_LABELS_SUPERUSER = ['#', 'search_condition', 'user_email', 'create_at', 'zip_ttl', 'process_state', 'download_ln']
export const OUTPUT_LABELS = {
    "screen": {
        "#owner": PERMISSION_LABELS,
        "#user": PERMISSION_LABELS,
        "#folder": PERMISSION_LABELS,
        "#file": FILE_LABELS
    },
    "superuser": {
        "#owner": PERMISSION_LABELS_SUPERUSER,
        "#user": PERMISSION_LABELS_SUPERUSER,
        "#folder": PERMISSION_LABELS_SUPERUSER,
        "#file": FILE_LABELS
    }
}

// 実行ステータスラベル
export const STATUS_LABEL_FILE = {
    0: "処理中",
    1: "ファイル作成中",
    2: "正常終了中",
    3: "完了",
    4: "失敗",
    5: "失敗"
}

export const STATUS_LABEL = {
    0: "ファイル作成中",
    1: "完了",
    2: "失敗"
}

// 1ページあたりのページ数のデフォルト
export const DEFAULT_ROWS_PAR_PAGE = 10

// 認証処理後のリダイレクトURIを表示サイトに合わせて取得
const HOST = window.location.host
const HTTP_PROTOCOL = window.location.host.indexOf('localhost') === 0 ? 'http://' : 'https://'
const REDIRECT_URI = encodeURIComponent(HTTP_PROTOCOL + HOST)

// Azure AD のログイン要求先
const SITE = 'https://' + DOMAIN + '/' + DIRECTORY_ID + '/' + PROTOCOL + '/';
export const LOGIN_URI = SITE + 'authorize?client_id=' + APPLICATION_ID
    + '&redirect_uri=' + REDIRECT_URI
    + '&scope=openid+profile+email&response_type=id_token+code&response_mode=fragment&nonce='
export const LOGOUT_URI = SITE + 'logout?post_logout_redirect_uri=' + REDIRECT_URI
export const LOGINS_SET_ID = DOMAIN + '/' + DIRECTORY_ID + '/v2.0'

// ロール設定(groupe ID : 名前)
export const ROLE_NAME = {
    "superuser": "SuperUser",
    "administrator": "システム管理者",
    "manager": "一般管理者",
    "user": "一般ユーザ"
}

// ロールの権限序列設定
export const ROLE_ORDER = ["superuser", "administrator", "manager"]

// ロール付与グループ一覧
export const ROLES = {
    "superuser": SUPER_USER_GROUP_ID,
    "administrator": ADMIN_GROUP_ID,
    "manager": MNG_GROUP_ID
}

// バリデーション対象
export const FILE_VALIDATION_PATH = "/"