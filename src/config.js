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
export const PERMISSION_LABELS     = ['p_view', 'p_upload', 'p_download', 'p_delete', 'p_admin']
export const PERMISSION_LABELS_CSV = ['p_view', 'p_upload', 'p_download', 'p_delete', 'p_admin']
export const OWNER_LABELS     = ['#', 'owner_name', 'folder_path', 'user_email', 'user_name']
export const OWNER_LABELS_CSV = ['#', 'folder_path', 'owner_name', 'user_email', 'user_name']
export const USER_LABELS     =  ['#', 'folder_path', 'owner_name']
export const USER_LABELS_CSV =  ['#', 'folder_path', 'owner_name']

// 1ページあたりのページ数のデフォルト
export const DEFAULT_ROWS_PAR_PAGE = 5


// Cognito Identity Pool ID
export const IDENTITY_POOL_ID = 'ap-northeast-1:9cd11c18-7668-4ea3-8427-40a8aed8ec94'


// 認証処理後のリダイレクトURIを表示サイトに合わせて取得
const HOST = window.location.host 
const HTTP_PROTOCOL = window.location.host.indexOf('localhost') === 0 ? 'http://' : 'https://'
const REDIRECT_URI = encodeURIComponent(HTTP_PROTOCOL + HOST)
console.log(REDIRECT_URI)

// Azure AD のログイン要求先
const DOMAIN = 'login.microsoftonline.com'
const DIRECTORY_ID = '8a08112f-92e8-43fe-9a0a-56d393b9f042'
const APPLICATION_ID = '3a0aef16-07ab-4f88-8122-4114b7c496a1'
const PROTOCOL = 'oauth2/v2.0'
const SITE = 'https://' + DOMAIN + '/' + DIRECTORY_ID + '/' + PROTOCOL + '/';
export const LOGIN_URI = SITE + 'authorize?client_id=' + APPLICATION_ID
    + '&redirect_uri=' + REDIRECT_URI
    + '&scope=openid+profile+email&response_type=id_token&response_mode=fragment&nonce='
export const LOGOUT_URI = SITE + 'logout?post_logout_redirect_uri=' + REDIRECT_URI
