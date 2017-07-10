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
 *　　・rpg_maker_mv.css (https://github.com/)
 *　プラグインコマンド
 *　　・showMessageView
 *　　　メッセージウィンドウを表示します。
 *
 *　　・hideMessageView
 *　　　メッセージウィンドウを隠します。
 *
 *　　・nextMessage
 *　　　メッセージを進めます。
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


  var _Scene_Boot_start = Scene_Boot.prototype.start;

  var message;
  Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.apply(this, arguments);
    appendMessageView();

// FIXME
// 外部のJSONファイルを読み込むように作り直すべきですね。。。
    message = new MessageViewer({
        "data": [
        {
            "message":"",
        },
        {
            "message":"そこでMessageView.js（http://www.webcyou.com/）を<br>利用してアニメーションの表示領域のさらに上にメッセージを<br>表示させたよ。",
        },
        {
            "message":"メッセージ枠はCSSでそれっぽく設定しているよ。",
        },
        ],
        "option": {
            "loop": true,
           "speed": "fast"
        }
    });

  }

  function showMessageView()
  {
    main.style.visibility = "visible";
  }
  function hideMessageView()
  {
    main.style.visibility = "hidden";
  }
  function nextMessage()
  {
    message.next();
  }



  var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'showMessageView') {
      showMessageView();
    }
    if (command === 'hideMessageView') {
      hideMessageView();
    }
    if (command === 'nextMessage') {
      nextMessage();
    }
  };



})();
