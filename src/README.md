# パッケージ郡説明

各種ファイルの存在意味を定義/説明する。  
内部パッケージはファイル/フォルダ・定義を説明する。  
外部パッケージはコマンド/アクション・成果物・編集有無を説明する。

## 内部パッケージ郡説明

内部パッケージは独自に生成したものであるが故に管理方法を統一しない場合、他者が編集する難易度を向上させてしまう。  
そのため、存在する意味を定義することで、正しく管理することを目的とする。

| ファイル/フォルダ | 定義 |
| :--- | :--- |
| config | configやmessageなどの定数ファイル格納 |
| static/css | CSSファイル格納 |
| static/image | pngファイル等格納 |
| function | 純粋なNode.jsコードのみを含むファイルを格納する。 |
| html_parts | 返却値としてHTML要素をレンダリング要素を含むファイルを格納する。 |
| loading.js | 用途不明 |

## 外部パッケージ郡説明

外部パッケージを多用する関係上、生成されるコマンド/アクションと成果物（ファイル/フォルダ）を明記する。  
また同時に、中身に編集箇所がある場合は、別途項目を設け、説明と対応方法を示す。

| 成果物（ファイル/フォルダ） | コマンド/アクション | 編集有無 |
| :--- | :--- | :---: |
| lib/apiGatewayCore | AWS API Gateway SDKの生成 |  |
| lib/axios | AWS API Gateway SDKの生成 |  |
| lib/CryptoJS | AWS API Gateway SDKの生成 |  |
| lib/url-template | AWS API Gateway SDKの生成 |  |
| apigClient.js | AWS API Gateway SDKの生成 |  |
| API_GATEWAY_README.md | AWS API Gateway SDKの生成 | ◯ |
| static/css/App.css | `npm init react-app project名`による生成 | ◯ |
| App.js | `npm init react-app project名`による生成 | ◯ |
| App.test.js | `npm init react-app project名`による生成 |  |
| static/css/index.css | `npm init react-app project名`による生成 | ◯ |
| index.js | `npm init react-app project名`による生成 |  |
| serviceWorker.js | `npm init react-app project名`による生成 |  |
| setupTests.js | `npm init react-app project名`による生成 |  |

### API_GATEWAY_README.md

`AWS API Gateway SDKの生成`による生成では、`README.md`で出力される。  
名前が競合することから、当タイトルの用に編集する。  
また、理解不能なmarkdown書式を利用しているため、一部編集しているが内容の編集はないため、明記しない。

### static/css/App.css

コマンド実行で出力された場合、`./App.css`となるが、管理体制を統一するために`./static/css`へ移動させている。  
本プロジェクトでは、`App.js`にだけコールされる。

### App.js

`index.js`からコールされ、`index.html`の`id=root`に要素を出力する。  
コールされる順番は、`index.html`→`index.js`→`App.js`となる。  
要素の伝搬順序は上記の逆順となる。  
従って、App.jsはページを構成するUI部品⇒`コンポーネント`を定義する場所。  
この`App.js`から子コンポーネントを呼び出し、本プロジェクトのページを作成している。

### static/css/index.css

コマンド実行で出力された場合、`./index.css`となるが、管理体制を統一するために`./static/css`へ移動させている。  
本プロジェクトでは、コールされない。
