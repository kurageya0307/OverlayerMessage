//=============================================================================
// KURAGE_OverlayerMessage.js
//=============================================================================

/*:ja
 * @plugindesc ゲームの上のレイヤーにMV標準風のメッセージを表示します。
 * @author Y.kurage
 *
 * @help
 * 使用方法：
 *　前準備
 *　  RPGツクールMVプロジェクトのjs/pluginsのフォルダに以下のファイルを用意してください。
 *　　・message_view.min.js (https://github.com/webcyou/MessageViewJS/blob/master/dist/message_view.min.js)
 *　　・style.css (https://github.com/webcyou/MessageViewJS/blob/master/demo/css/style.css)
 *　　・rpg_maker_mv.css (https://github.com/kurageya0307/OverlayerMessage/blob/master/rpg_maker_mv.css)
 *　使い方
 *　　①以下のプラグインコマンドのスタートを実行する。
 *　　②ツクールMVのイベントコマンドの「文章の表示」でメッセージを表示する。
 *　　③以下のプラグインコマンドのエンドを実行する。
 *    プラグインコマンドのスタートからエンドまでの間の文章の表示がツクールMVとは別のCANVASに表示されるはずです。
 *　注意
 *  　startOverlayerMessage以降の文章では改行がそのままでは入力できません。
 *    改行の代わりに<br>を入力すると該当箇所に改行が挿入されます。
 *　プラグインコマンド
 *　　・startOverlayerMessage
 *　　　このプラグインコマンド実行後，「文章の表示」が上のレイヤーのメッセージ表示になります。
 *
 *　　・endOverlayerMessage
 *　　　上のレイヤーのメッセージ表示を終了します。
 *
 * @license
 * Copyright (c) 2017 Y.K
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */
(function() {
  function loadScript(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = PluginManager._path + url;
    script.async = false;
    document.body.appendChild(script);
  }

  function loadCss(url) {
    var css   = document.createElement('link');
    css.type  = 'text/css';
    css.href  = PluginManager._path + url;
    css.media = 'screen';
    css.rel   = 'stylesheet';
    css.async = false;
    document.body.appendChild(css);
  }

//  loadScript('message_view.js')
  loadScript('message_view.min.js')
  loadCss('style.css')
  loadCss('rpg_maker_mv.css')

  var main = document.createElement('div');
  function appendMessageView() {
    main.classList.add("messageView");
    main.id = "default";
    main.style.visibility = 'hidden';

    var mv_contents = document.createElement('div');
    mv_contents.classList.add("mv-contents");
    main.appendChild(mv_contents);

    var mv_name = document.createElement('p');
    mv_name.classList.add("mv-name");
    mv_contents.appendChild(mv_name);

    var mv_comment = document.createElement('div');
    mv_comment.classList.add("mv-comment");
    mv_contents.appendChild(mv_comment);

    var mv_val = document.createElement('p');
    mv_val.classList.add("val");
    mv_comment.appendChild(mv_val);

    var mv_pointer = document.createElement('p');
    mv_pointer.classList.add("pointer");
    mv_comment.appendChild(mv_pointer);

    var mv_image_character = document.createElement('p');
    mv_image_character.classList.add("mv-image");
    mv_image_character.classList.add("character");
    mv_contents.appendChild(mv_image_character);

    var img = document.createElement('img');
    img.src = '';
    img.alt = '';
    mv_image_character.appendChild( img );

    document.body.appendChild(main);
  }

  var message_view_mode = false;
  Window_Message.prototype.startMessage = function() {
    if(message_view_mode)
    {
      this._textState = {};
      this._textState.index = 0;
      this._textState.text = this.convertEscapeCharacters($gameMessage.allText());
      message = new MessageViewer({
          "data": [ { "message":this._textState.text }, ],
        "option": { "loop": false, "speed": "fast"}
      });
      main.style.visibility = "visible";
      this.newPage(this._textState);
      this.updatePlacement();
      this.updateBackground();
      this.open();
    }
    else
    {
      this._textState = {};
      this._textState.index = 0;
      this._textState.text = this.convertEscapeCharacters($gameMessage.allText());
      this.newPage(this._textState);
      this.updatePlacement();
      this.updateBackground();
      this.open();
    }
  };

  Window_Message.prototype.updatePlacement = function() {
    // FIXME 割りと無理やりです。
    if(message_view_mode)
    {
      this.y = -1000;
    }
    else
    {
      this._positionType = $gameMessage.positionType();
      this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
      this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
    }
  };

//-----------------------------------------------------------------------------
  var _Scene_Boot_start = Scene_Boot.prototype.start;

  var message;
  Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.apply(this, arguments);
    appendMessageView();

  }

  var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'startOverlayerMessage') {
      main.style.visibility = "visible";
      message_view_mode = true;
    }
    if (command === 'endOverlayerMessage') {
      message_view_mode = false;
      main.style.visibility = "hidden";
    }
  };



})();
