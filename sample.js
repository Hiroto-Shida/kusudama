var win_width; //ウィンドウの横サイズ
var win_height; //ウィンドウの縦サイズ

var count = 0; //ゴミ箱に捨てた数(カウント)

var supportTouch = 'ontouchend' in document; // タッチイベントが利用可能かの判別
// イベント名
var EVENTNAME_TOUCHSTART = supportTouch ? 'touchstart' : 'mousedown';
var EVENTNAME_TOUCHMOVE = supportTouch ? 'touchmove' : 'mousemove';
var EVENTNAME_TOUCHEND = supportTouch ? 'touchend' : 'mouseup';

// jQueryでHTMLの読み込みが完了してからCSSを読みこむ
$(function(){
  var style = "<link rel='stylesheet' href='animation.css'>";
  $('head:last').after(style);
});

// スクロールを禁止する関数
(function() {
    function noScroll(event) {
      event.preventDefault();
    }
    document.addEventListener('touchmove', noScroll, { passive: false }); // スクロール禁止(SP)
    document.addEventListener('mousewheel', noScroll, { passive: false }); // スクロール禁止(PC)
})();

// window(HTML)の読み込みが完了してから初期設定
window.onload = function(){
    kusudama();
};


// くす玉関数
function kusudama() {
  win_width = window.innerWidth; //ウィンドウの横サイズ
  win_height = window.innerHeight; //ウィンドウの縦サイズ
  // 左くす玉作成
  let newElementL = document.createElement("img"); // p要素作成
  newElementL.setAttribute("id","kusudamaLeft"); // img要素にidを設定
  newElementL.setAttribute("class","rotLeft"); // img要素にclassを設定
  newElementL.setAttribute("src","./pictures/kusudama_left.png"); // img要素にsrcを設定
  newElementL.setAttribute("width","100px"); // img要素にwidthを設定
  newElementL.setAttribute("style","z-index:500; position: absolute; left: "+(win_width/2-100)+"px; top: 0px"); // img要素にstyleを設定

  // 右くす玉作成
  let newElementR = document.createElement("img"); // p要素作成
  newElementR.setAttribute("id","kusudamaRight"); // img要素にidを設定
  newElementR.setAttribute("class","rotRight"); // img要素にclassを設定
  newElementR.setAttribute("src","./pictures/kusudama_right.png"); // img要素にsrcを設定
  newElementR.setAttribute("width","100px"); // img要素にwidthを設定
  newElementR.setAttribute("style","z-index:500; position: absolute; left: "+(win_width/2)+"px; top: 0px"); // img要素にstyleを設定

  let parentDiv = document.getElementById("parent-pic"); // 親要素（div）への参照を取得
  parentDiv.appendChild(newElementL); // 左くす玉追加
  parentDiv.appendChild(newElementR); // 右くす玉追加

  let newDiv = document.createElement('div');
  newDiv.setAttribute("id", "flag")
  newDiv.setAttribute("class", "flag")
  newDiv.setAttribute("width","50px"); // img要素にwidthを設定
  newDiv.setAttribute("style", "position: absolute; left: "+(win_width/2-25)+"px; z-index: 350")
  document.body.appendChild(newDiv)

  parentDiv = document.getElementById("flag"); // 親要素（div）への参照を取得

  let newSpan1 = document.createElement('span');
  newSpan1.setAttribute("class", "redfont");
  let newContent1 = document.createTextNode("祝 ")
  newSpan1.appendChild(newContent1)
  parentDiv.appendChild(newSpan1);

  let newSpan2 = document.createElement('span');
  newSpan2.setAttribute("class", "text-combine");
  let newContent2 = document.createTextNode(count)
  newSpan2.appendChild(newContent2)
  parentDiv.appendChild(newSpan2);

  let newContent3 = document.createTextNode("回")
  parentDiv.appendChild(newContent3);


  class Paper{
    constructor(num, width, G, color, startX, finishX) {
      this.num = num; //ナンバー idが"paper(num)"となる
      this.width = width; // 大きさ
      this.G = G; // 初速度
      this.D = 5; //遅延度
      this.startX = startX // 初期位置(x座標)
      this.finishX = finishX // 最終位置(x座標)
      this.newElement = document.createElement("img"); // img要素作成
      this.newElement.setAttribute("id","paper"+num); // img要素にidを設定
      this.newElement.setAttribute("class",color); // img要素にclassを設定
      this.newElement.setAttribute("src","./pictures/moai.png"); // img要素にsrcを設定
      this.newElement.setAttribute("width",this.width+"px"); // img要素にwidthを設定
      this.newElement.setAttribute("style","z-index:400; position: absolute; left: "+(this.startX)+"px; top: 50px"); // img要素にstyleを設定
      let parentDiv = document.getElementById("parent-pic"); // 親要素（div）への参照を取得
      parentDiv.appendChild(this.newElement); // 追加
    }
  }

  let papers = []; // 各紙吹雪の格納場所
  let colors = ["red", "blue", "green", "yellow", "orange", "aqua", "purple"];
  let rand_width = 0;
  let rand_G = 0;
  for (let i = 0; i < 50; i++) {
    rand_width = 20 + Math.floor( Math.random()*10 - 5 );
    rand_G = 7 + Math.random()*6 - 3;
    rand_color = colors[Math.floor( Math.random()*colors.length )];
    rand_X = Math.floor( Math.random()*20 - 10 );
    rand_startX = win_width/2 + rand_X;
    rand_finishX = win_width/2 + rand_X*5;
	  papers.push( new Paper(i, rand_width, rand_G, rand_color, rand_startX, rand_finishX) );
  }
  console.log(papers[0].num)

  movepaper(papers, papers.length); // 紙吹雪を動かす
};


// 紙吹雪を動かす関数
function movepaper(papers, length){
  let promise = new Promise((resolve, reject) => { // #1
    resolve('1')
  })
  promise.then(() => { // 上記処理後0.1秒後class追加
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (let paper of papers) {
          document.getElementById("paper"+paper.num).classList.add('slowly'); //0.1秒後にclass"slowly"を追加する 
        }
        resolve("2")
      }, 50)
    })
  }).then(() => { // 上記処理後に紙吹雪を動かすs
    let t = 0, // 時間
        X = 0, // X座標
        Y = 0; // Y座標

    function draw_pa(){
      t += 1;
      let icount = 0; //カウント
      let rmCount = 0; //削除する要素のカウント
      for (let paper of papers) {
        X = paper.startX + (paper.finishX - paper.startX)*(t/20)
        Y = 50+ 0.5*paper.G*t^2
        $('#paper'+paper.num).animate({
          'left': (X+'px'),
          'top': (Y+'px')
        }, paper.D, 'linear');
        if (Y > win_height){ // 画面外(横)に出たら
          tmp = papers.splice(icount, 1);
          papers.unshift(tmp[0]);
          rmCount++;
        }
        icount++
      }
      for (let i = 0; i < rmCount; i++) {
        papers.splice(0, 1)
      }
      if (papers.length != 0){ // 一つが画面外(横)に出たら終了
        draw_pa();
      }
    };

    draw_pa(); // 描画
  }).then(() => { //上記処理後1000秒後，以下の関数を実行
    document.addEventListener(EVENTNAME_TOUCHSTART, removeKusudama);
    function removeKusudama(){ // 画面に触れた時の処理を追加
      console.log("test111111111111")
      $('#kusudamaLeft').remove(); //くす玉削除
      $('#kusudamaRight').remove(); //くす玉削除
      $('#flag').remove(); // 幕削除
      for (let i = 0; i < length; i++) {
        $('#paper'+i).remove(); //紙吹雪削除
      }
      count++;
      document.removeEventListener(EVENTNAME_TOUCHSTART, removeKusudama); // 画面上で指を移動させているきの処理を削除
      kusudama();
    };
  }).catch(() => { // エラーハンドリング
    console.error('Something wrong!')
  })

}