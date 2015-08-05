WebRTCのWebアプリケーションでスクリーンシェア機能を簡単に実装できるライブラリです。
Chrome向けのExtension用ソースコードとFirefox向けのAdd-On用ソースコードも含まれています。

## Installation

### 1. Library

* CDNを利用する場合

	```html
	<script src="https://skyway.io/dist/screenshare.js"></script>
	```

* 自分でビルドする場合

	ライブラリをcloneします。
	```
	git clone git@github.com:nttcom/SkyWay-ScreenShare.git
	```

	ライブラリをビルドします。
	```
	cd SkyWay-ScreenShare && npm install && npm run build-library
	```

	生成されたライブラリを利用します。
	```
	SkyWay-ScreenShare/dist/screenshare.js
	SkyWay-ScreenShare/dist/screenshare.min.js
	```

### 2. Chrome Extension

マニフェストファイル `SkyWay-ScreenShare/chrome-extension/src/manifest.json` を修正します。
```json
{
  "name": "Your extension name here",
  "short_name": "Your extension short_name here",
  "version": "Your extension version number here",
  "manifest_version": 2,
  "description": "Your extension description here",
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  },
  "permissions": [
    "desktopCapture",
    "tabs"
  ],
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "content_scripts": [{
    "matches": [""],
    "js": ["content.js"],
    "all_frames": true,
    "run_at": "document_end"
  }]
}
```
必須の修正箇所は以下の通りです。

|修正項目|コメント|
|---|---|---|
|name|Extentionのnameを指定して下さい。|
|short_name|Extentionのshort_nameを指定して下さい。|
|version|Extentionのversion番号を指定して下さい。|
|description|Extentionのdescriptionを指定して下さい。|
|icons|Extentionのiconファイル名（３種類）を指定して下さい。<BR>iconファイルは `SkyWay-ScreenShare/chrome-extension/src/` に配置して下さい。<BR>リポジトリにはSkyWayのiconファイルが同梱されています。|
|matches|Extention利用するサイトのドメインを指定して下さい。<BR>ドメイン指定には `*`（ワイルドカード）が利用可能です。<BR>例：`"matches": ["https://*.skyway.io/*"]`|


Extentionをビルドします。
```
cd SkyWay-ScreenShare && npm install && npm run build-chrome
```


生成されたExtentionをChromeで読み込み動作確認を行います。

1. chrome://extensions/ にアクセス
2. 「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック、以下のディレクトリを指定
```
SkyWay-ScreenShare/chrome-extension/screenshare_chrome_extension/
```


Extentionを公開します。
Chrome Web Storeに公開する場合は以下のZipファイルを利用して下さい。
```
SkyWay-ScreenShare/chrome-extension/screenshare_chrome_extension.zip
```

### 3. Firefox Add-On

メインプログラム `SkyWay-ScreenShare/firefox-addon/src/lib/main.js` を修正します。
```javascript
var pageMod = require('sdk/page-mod');
var self = require('sdk/self');
var __temp = require('chrome');
var Cc = __temp.Cc;
var Ci = __temp.Ci;

var domains_to_add = [''];
var addon_domains = [];
var allowed_domains_pref = 'media.getusermedia.screensharing.allowed_domains';
var enable_screensharing_pref = 'media.getusermedia.screensharing.enabled';

 ~~ 省略 ~~

```
必須の修正箇所は以下の通りです。

|修正項目|コメント|
|---|---|---|
|domains_to_add|ScreenShare機能を有効にするサイトのドメインを指定して下さい。<BR>ドメイン指定には `*`（ワイルドカード）が利用可能です。<BR>例：`var domains_to_add = ['*.skyway.io']`|


パッケージファイル `SkyWay-ScreenShare/firefox-addon/src/package.json` を修正します。
```json
{
    "name": "your_add-on_name_here",
    "title": "Your add-on title here",
    "description": "Your add-on description here",
    "author": "Your add-on author here",
    "version": "Your add-on version number here",
    "license": "Your add-on license here",
    "homepage": "Your add-on homepage url here",
    "icon64": "icon64.png",
    "icon": "icon48.png"
}
```
必須の修正箇所は以下の通りです。

|修正項目|コメント|
|---|---|---|
|name|Add−Onのnameを指定して下さい。|
|license|Add−Onのlicenseを指定して下さい。|
|title|Add−Onのtitleを指定して下さい。|
|description|Add−Onのdescriptionを指定して下さい。|
|author|Add−Onのauthorを指定して下さい。|
|version|Add−Onのversion番号を指定して下さい。|
|homepage|Add−Onのhomepage urlを指定して下さい。|
|icon,icon64|Add−Onのiconファイル名（２種類）を指定して下さい。<BR>iconファイルは `SkyWay-ScreenShare/firefox-addon/src/` に配置して下さい。|


cfxコマンドラインツールをインストールします。

インストール方法は以下のサイトを参考にして下さい。
https://dev.mozilla.jp/addon-sdk-docs/dev-guide/tutorials/installation.html


Add-Onを *プレビルド* します。
```
cd SkyWay-ScreenShare && npm install && npm run pre-build-firefox
```
【注意】プレビルドは`package.json`にidが記載されていないため失敗しますが、問題ありません。
```

~~ 省略 ~~

No 'id' in package.json: creating a new ID for you.
package.json modified: please re-run 'cfx xpi'

~~ 省略 ~~

```

Add-Onを *ビルド* します。
```
cd SkyWay-ScreenShare && npm install && npm run build-firefox
```

生成されたAdd−OnをFirefoxで読み込み動作確認を行います。

1. about:addons にアクセス
2. 画面にビルドしたAdd-Onファイル `SkyWay-ScreenShare/firefox-addon/screenshare_firefox_addon.xpi` をドラッグ・アンド・ドロップ


Add−Onをに公開します。
サービスサイト等で以下のAdd-Onファイルをダウンロード可能な状態にして下さい。
```
SkyWay-ScreenShare/firefox-addon/screenshare_firefox_addon.xpi
```

## API reference

```javascript
var screenshare = new SkyWay.ScreenShare([options]);
```

- options
  - debug (boolean)
    - ブラウザの開発者コンソールにデバッグログを出力します.

### startScreenShare

- スクリーンシェアを開始します

```javascript
screenshare.startScreenShare({
	"Width": <number>,
	"Height": <number>,
	"FrameRate": <number>
},function(stream){
 // success callback
 // 成功するとstreamオブジェクトを取得できます
},function(error) {
 // error callback
},function() {
 // onEnded callback
 // スクリーンシェアが終了した時に発火します（Chromeのみ対応/任意）
});
```

### stopScreenShare

- スクリーンシェアを停止します
 - startScreenShareで取得したstreamオブジェクトのstop()メソッドを実行する
 - 専用メソッドは今後実装予定

```javascript
stream.stop();
```

### isEnabledExtension

- Chrome ExtentionsまたはFirefox Add-Onがインストールされているかどうか`<true or false>`を確認する

```javascript
var result = screenshare.isEnabledExtension();
```

## Sample

SkyWay ScreenShare Sample App(準備中)

## Contributing

1. Fork it ( https://github.com/[my-github-username]/SkyWay-ScreenShare/fork )
1. Create your feature branch (git checkout -b my-new-feature)
1. Commit your changes (git commit -am 'Add some feature')
1. Push to the branch (git push origin my-new-feature)
1. Create a new Pull Request

## LICENSE & Copyright

[LICENSE](./LICENSE)
