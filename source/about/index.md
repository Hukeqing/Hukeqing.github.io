---
title: 关于我
date: 2020-12-24 14:56:00
---

<div id="head" class="head lazy lazy-hide">
  <img id="avatar" src="/image/about/avatar.png" alt="avatar" class="avatar">
  <div class="nick">Shiroha</div>
</div>

<div id="hello" class="lazy lazy-hide" style="text-align: center; font-size: 30px; font-weight: 900;">
  欢迎光临，荣幸之至
</div>

<div id="tag" class="card lazy lazy-hide">
  <div class="title">
    我的标签
  </div>
  <div class="answer-box">
    <div><i class="iconfont icon-code"></i>程序猿</div>
    <div>后端工程师</div>
    <div>会一点前端</div>
    <div>unity 退役工程师</div>
    <div>ACM 退役选手</div>
    <div>Geek</div>
    <div>熟练使用 C++</div>
    <div>Java 工程师</div>
    <div>学生</div>
    <div>上班ing</div>
    <div>Alibaba</div>
    <div><i class="iconfont icon-taobao-fill"></i>大淘宝技术部</div>
    <div>六级没过</div>
    <div>kEy厨</div>
    <div>Galgame 玩家</div>
    <div>兜厨</div>
    <div>珂学家</div>
    <div>岛学家</div>
    <div>罚学家</div>
    <div>星际争霸II 菜鸡玩家</div>
    <div>绝对不女装</div>
  </div>
</div>

<div id="contactMe" class="card lazy lazy-hide">
  <div class="title">
    联系我
  </div>
  <div class="answer-box">
    <div onclick="window.open('https://github.com/Hukeqing')">
      <img class="link-avatar" src="https://avatars.githubusercontent.com/u/47495915" srcset="https://avatars.githubusercontent.com/u/47495915" alt="GithubAvatar">
      <i class="iconfont icon-github-fill"></i>
      GitHub
    </div>
    <div onclick="window.open('https://twitter.com/realMauve')">
      <img class="link-avatar" src="https://pbs.twimg.com/profile_images/1166876800141578240/HSx1ZQoR_400x400.jpg" srcset="https://pbs.twimg.com/profile_images/1166876800141578240/HSx1ZQoR_400x400.jpg" alt="TwitterAvatar">
      <i class="iconfont icon-twitter-fill"></i>
      Twitter
    </div>
    <div onclick="window.open('https://t.me/ShiroNaruse')">
      <img class="link-avatar" src="https://cdn5.telegram-cdn.org/file/cVVEcIVEDDOn8f2lzkaCMvfNrAoLUbrt3hmdZMYdAw90jTwd8XmGZqHKncTXXTOp4cY4feqStsZ5ifiOlnZmj09OCMG4aUBh8eImAOEFWkNa2h80bIhlnk36wuM4ZzcpT31DUEOhNoqtz1hrunKlYV8e8WLRcHvJvpqHF8BBZcpd8EWFBnwmpFDzXhk6-YT3qIu4C-UxzAkfdspSxPdNTrKWnnbpoBwM2NC_qVuXFzSgs4OE5poDECtbNmy0RH26tHd9ni7TNTTq2P8QRqTdK9pp8jXvNBEBOAjOA3jQjfbuQKsubPZWnVCgcmTLWIST4g79gGm0F_hKlfUtP5tyag.jpg" alt="TelegramAvatar">
      <i class="iconfont icon-telegram-fill"></i>
      Telegram
    </div>
    <div onclick="window.open('https://codeforces.com/profile/KamiyamaShiki')">
      <img class="link-avatar" src="https://userpic.codeforces.org/864576/title/425eb0f25a79727d.jpg" alt="CodeforcesAvatar">
      <i class="iconfont icon-codeforces"></i>
      Codeforces
    </div>
    <div onclick="window.open('https://codeforces.com/profile/ShirohaIsMyWife')">
      <img class="link-avatar" src="https://userpic.codeforces.org/1511630/title/fb2d8d392b542132.jpg" alt="CodeforcesAvatar">
      <i class="iconfont icon-codeforces"></i>
      Codeforces
    </div>
    <div>
      <img class="link-avatar" src="https://avatars.cloudflare.steamstatic.com/bf589a8c1c3592a4dceee6e42bbc631211219a00_full.jpg">
      <i class="iconfont icon-steam"></i>
      Steam
    </div>
    <div onclick="window.open('mailto:keqing.hu@icloud.com')">
      <img class="link-avatar" src="/image/about/avatar.png" alt="avatar">
      <i class="iconfont icon-mail"></i>
      keqing.hu@icloud.com
    </div>
  </div>
</div>

<style>
  .head {
    top: -150px;
    position: relative;
    width: 100%;
    height: 250px;
    text-align: center;
  }

  .avatar {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 100px;
  }

  .link-avatar {
    width: 50px;
    height: ;
    border-radius: 100px;
  }

  .nick {
    font-weight: 900;
    font-size: 40px;
  }

  .card {
    box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
    border-radius: 30px;
    background: rgba(0, 0, 0, 0);
    margin-top: 20px;
    padding: 30px 30px 30px 30px;
    position: relative;
  }

  .lazy {
    transition: 1s
  }

  .lazy-hide {
    opacity: 0;
    transform: translate(0px, 100px);
  }

  .lazy-show {
    opacity: 1;
  }

  .title {
    font-weight: 800;
    font-size: 20px;
    text-align: center;
  }

  .answer-box {
    display: block;
    text-align: center;
    margin-top: 20px;
  }

  .answer-box > div {
    display: inline-block;
    margin: 5px 10px 5px 10px;
    padding: 2px 30px 2px 30px;
    border: 4px solid;
    font-weight: 600;
    background: none;
    text-align: center;
    justify-content: center;
    cursor: pointer;
    /* max-height: 100px; */
    position: relative;
  }

  .answer-img {
    box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
    border-radius: 0.25rem;
  }

  .answer-box > div::before,
  .answer-box > div::after {
    content: "";
    position: absolute;
    width: 14px;
    height: 4px;
    background: var(--board-bg-color);
    transform: skewX(50deg);
    transition: .4s;
    ease;
  }

  .answer-box > div::before {
    top: -4px;
    left: 10%
  }

  .answer-box > div::after {
    bottom: -4px;
    right: 10%
  }

  .answer-box > div:hover::before {
    left: 80%;
  }

  .answer-box > div:hover::after {
    right: 80%;
  }
</style>

<script>
  function throttle(fn, delay, atleast) {
    var timeout = null, startTime = new Date()
    return function() {
      var curTime = new Date()
      clearTimeout(timeout)
      if (curTime - startTime >= atleast) {
        fn()
        startTime = curTime
      } else {
        timeout = setTimeout(fn, delay)
      }
    }
  }

  function lazyload() {
    let cardList = document.getElementsByClassName('lazy')
    let n = 0;
    return function() {
      for (var i = n; i < cardList.length; i++) {
        if (cardList[i].getBoundingClientRect().top + 100 < document.documentElement.clientHeight) {
          cardList[i].className = cardList[i].className.replace('lazy-hide', 'lazy-show')
          n = n + 1
          return
        }
      }
    }
  }
  var loadImages = lazyload();
  loadImages(); //初始化首页的页面图片
  window.addEventListener('scroll', throttle(loadImages, 300, 300), false);
</script>
