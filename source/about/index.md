---
title: 关于我
date: 2020-12-24 14:56:00
---

<div id="head" class="head lazy lazy-hide">
  <img id="avatar" src="/image/about/avatar.png" srcset="https:/hukeqing.github.io/image/about/avatar.png" alt="avatar" class="avatar">
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
    <div class="answer">
      小小的程序员
    </div>
    <div class="answer">
      后端工程师
    </div>
    <div class="answer">
      会一点前端
    </div>
    <div class="answer">
      unity 退役工程师
    </div>
    <div class="answer">
      ACM 退役选手
    </div>
    <div class="answer">
      Geek
    </div>
    <div class="answer">
      熟练使用 C++
    </div>
    <div class="answer">
      Java 工程师
    </div>
    <div class="answer">
      学生
    </div>
    <div class="answer">
      实习ing
    </div>
    <div class="answer">
      Alibaba
    </div>
    <div class="answer">
      六级没过
    </div>
    <div class="answer">
      kEy厨
    </div>
    <div class="answer">
      Galgame 玩家
    </div>
    <div class="answer">
      兜厨
    </div>
    <div class="answer">
      珂学家
    </div>
    <div class="answer">
      岛学家
    </div>
    <div class="answer">
      罚学家
    </div>
  </div>
</div>

<div id="contactMe" class="card lazy lazy-hide">
  <div class="title">
    联系我
  </div>
  <div class="answer-box">
    <div class="answer" onclick="window.open('https://github.com/Hukeqing')">
      <img class="link-avatar" src="https://avatars.githubusercontent.com/u/47495915" srcset="https://avatars.githubusercontent.com/u/47495915" alt="GithubAvatar">
      GitHub
    </div>
    <div class="answer" onclick="window.open('https://twitter.com/realMauve')">
      <img class="link-avatar" src="https://pbs.twimg.com/profile_images/1166876800141578240/HSx1ZQoR_400x400.jpg" srcset="https://pbs.twimg.com/profile_images/1166876800141578240/HSx1ZQoR_400x400.jpg" alt="TwitterAvatar">
      Twitter
    </div>
    <div class="answer" onclick="window.open('mailto:keqing.hu@icloud.com')">
      邮箱：keqing.hu@icloud.com
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

  .answer {
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

  .answer::before,
  .answer::after {
    content: "";
    position: absolute;
    width: 14px;
    height: 4px;
    background: var(--board-bg-color);
    transform: skewX(50deg);
    transition: .4s;
    ease;
  }

  .answer::before {
    top: -4px;
    left: 10%
  }

  .answer::after {
    bottom: -4px;
    right: 10%
  }

  .answer:hover::before {
    left: 80%;
  }

  .answer:hover::after {
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
