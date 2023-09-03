// function called if wwads is blocked
function ABDetected() {
    const all_element = document.getElementsByClassName("wwads-cn");
    for (let i = 0; i < all_element.length; i++) {
        all_element[i].insertAdjacentHTML(
            "beforeend",
            `<style>
      .wwads-horizontal,.wwads-vertical{
        background-color:#f4f8fa;
        padding:5px;
        min-height:120px;
        margin-top:20px;
        box-sizing:border-box;
        border-radius:3px;
        font-family:sans-serif;
        display:flex;
        min-width:150px;
        position:relative;
        overflow:hidden;
      }
      .wwads-horizontal{
        flex-wrap:wrap;
        justify-content:center
      }
      .wwads-vertical{
        flex-direction:column;
        align-items:center;
        padding-bottom:32px
      }
      .wwads-horizontal a,.wwads-vertical a{
        text-decoration:none
      }  
      .wwads-horizontal .wwads-img,.wwads-vertical .wwads-img{
        margin:5px
      }
      .wwads-horizontal .wwads-content,.wwads-vertical .wwads-content{
        margin:5px
      }
      .wwads-horizontal .wwads-content{
        flex:130px;
        max-height: 150px;
        overflow-y: auto;
      }
      .wwads-vertical .wwads-content{
        margin-top:10px
      }
      .wwads-horizontal .wwads-text,.wwads-content .wwads-text{
        font-size:14px;
        line-height:1.4;
        color:#0e1011;
        -webkit-font-smoothing:antialiased;
      }
      .wwads-horizontal .wwads-poweredby,.wwads-vertical .wwads-poweredby{
        display:block;
        font-size:11px;
        color:#a6b7bf;
        margin-top:1em
      }
      .wwads-vertical .wwads-poweredby{
        position:absolute;
        left:10px;
        bottom:10px
      }
      .wwads-horizontal .wwads-poweredby span,.wwads-vertical .wwads-poweredby span{
        transition:all 0.2s ease-in-out;
        margin-left:-1em
      }
      .wwads-horizontal .wwads-poweredby span:first-child,.wwads-vertical .wwads-poweredby span:first-child{
        opacity:0
      }
      .wwads-horizontal:hover .wwads-poweredby span,.wwads-vertical:hover .wwads-poweredby span{
        opacity:1;
        margin-left:0
      }
      .wwads-horizontal .wwads-hide,.wwads-vertical .wwads-hide{
        position:absolute;
        right:-23px;
        bottom:-23px;
        width:46px;
        height:46px;
        border-radius:23px;
        transition:all 0.3s ease-in-out;
        cursor:pointer;
      }
      .wwads-horizontal .wwads-hide:hover,.wwads-vertical .wwads-hide:hover{
        background:rgb(0 0 0 /0.05)
      }
      .wwads-horizontal .wwads-hide svg,.wwads-vertical .wwads-hide svg{
        position:absolute;
        left:10px;
        top:10px;
        fill:#a6b7bf
      }
      .wwads-horizontal .wwads-hide:hover svg,.wwads-vertical .wwads-hide:hover svg{
        fill:#3E4546
      }
    </style>
    <a href='https://wwads.cn/page/whitelist-wwads' class='wwads-img' target='_blank' rel='nofollow'>
      <img src='/image/oops.webp' width='150'>
    </a>
    <div class='wwads-content'>
      <a href='https://wwads.cn/page/whitelist-wwads' class='wwads-text' target='_blank' rel='nofollow'>
        检测到您开启了广告拦截器… 广告有时候确实很烦人… 但请把它关掉í﹏ì，这样我们的服务器可能才不会饿死👻，十分感谢!<br/>
        Oops! Detected that you have turned on an ad blocker... Ads can sometimes be really annoying... But, if possible, please turn it off so that our servers don't starve to death 👻, thank you very much!  
      </a>
      <a href='https://wwads.cn/page/end-user-privacy' class='wwads-poweredby' title='万维广告 ~ 让广告更优雅,且有用' target='_blank'>
        
        <span>万维</span><span>广告</span>
      </a>
    </div>
    <a class='wwads-hide' onclick='parentNode.remove()' title='隐藏广告'>
      <svg xmlns='http://www.w3.org/2000/svg' width='6' height='7'>
        <path d='M.879.672L3 2.793 5.121.672a.5.5 0 11.707.707L3.708 3.5l2.12 2.121a.5.5 0 11-.707.707l-2.12-2.12-2.122 2.12a.5.5 0 11-.707-.707l2.121-2.12L.172 1.378A.5.5 0 01.879.672z'></path>
      </svg>
    </a>
  `);
    }
}
//check document ready
function docReady(t) {
    "complete" === document.readyState ||
    "interactive" === document.readyState
        ? setTimeout(t, 1)
        : document.addEventListener("DOMContentLoaded", t);
}

//check if wwads' fire function was blocked after document is ready with 3s timeout (waiting the ad loading)
docReady(function () {
    setTimeout(function () {
        if (window._AdBlockInit === undefined) {
            ABDetected();
        }
    }, 3000);
});
