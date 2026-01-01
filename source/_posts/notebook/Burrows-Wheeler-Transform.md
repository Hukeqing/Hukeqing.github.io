---
title: The Burrows-Wheeler Transform 块排序压缩算法
date: 2026-01-01 22:11:23
updated: 2026-01-01 22:11:23
categories:
  - 杂项
tag:
  - 算法
math: true
description: 一种非常有趣的块排序压缩算法
hide: false
sticky: false
---

# 前言

最近发现了一个非常有意思的算法：The Burrows-Wheeler Transform（块排序压缩算法），所以稍微花点时间简单记录一下

说是一个压缩算法，实际上这个算法主要做的事情是把数据重排序，实际上并没有减少数据的长度（通常反而因为增加了行尾标识而增长了）

但是它完成了一个非常有意思的效果：在几乎不增加字符串长度的情况下，把一个字符串的重复的部分尽可能聚合到一块了

而 Gzip 压缩算法基于Deflate算法，通过结合LZ77算法（查找并替换重复字符串）和霍夫曼编码，通过将接近的字符串聚合到一块，能够有效增加压缩率

# 算法操作方式

我做了一个简单的演示工具，我们就用经典的 `banana` 作为示例

<div id="v">
  <div class="demo-block">
    <div>在原串后添加结束结束符号<span class="demo-mono red">$</span>，且此符号认为是最小的字符</div>
    <div class="demo-window">
      banana<span class="red">\$</span>
    </div>
  </div>
  <div class="demo-block">
    <div>生成字符串的全部循环序列</div>
    <div class="demo-window">
      banana<span class="red">\$</span><br>
      anana<span class="red">\$</span>b<br>
      nana<span class="red">\$</span>ba<br>
      ana<span class="red">\$</span>ban<br>
      na<span class="red">\$</span>bana<br>
      a<span class="red">\$</span>banan<br>
      <span class="red">\$</span>banana
    </div>
  </div>
  <div class="demo-block">
    <div>将这几个字符串排序</div>
    <div class="demo-window">
      <span class="red">\$</span>banana<br>
      a<span class="red">\$</span>banan<br>
      ana<span class="red">\$</span>ban<br>
      anana<span class="red">\$</span>b<br>
      banana<span class="red">\$</span><br>
      na<span class="red">\$</span>bana<br>
      nana<span class="red">\$</span>ba
    </div>
  </div>
  <div class="demo-block">
    <div>取出最后一列字符串</div>
    <div class="demo-window">
      <span class="red">\$</span>banan<span class="green">a</span><br>
      a<span class="red">\$</span>bana<span class="green">n</span><br>
      ana<span class="red">\$</span>ba<span class="green">n</span><br>
      anana<span class="red">\$</span><span class="green">b</span><br>
      banana<span class="green">\$</span><br>
      na<span class="red">\$</span>ban<span class="green">a</span><br>
      nana<span class="red">\$</span>b<span class="green">a</span>
    </div>
  </div>
  <div class="demo-block">
    <div>得到结果</div>
    <div class="demo-window">
      annb<span class="red">\$</span>aa
    </div>
  </div>
  <div class="demo-block">
    <div>下面将进行还原操作</div>
    <div class="demo-window">
      annb<span class="red">\$</span>aa
    </div>
  </div>
  <div class="demo-block">
    <div>将结果排成一列</div>
    <div class="demo-window">
      <span class="green">a</span><br>
      <span class="green">n</span><br>
      <span class="green">n</span><br>
      <span class="green">b</span><br>
      <span class="green">\$</span><br>
      <span class="green">a</span><br>
      <span class="green">a</span>
    </div>
  </div>
  <div class="demo-block">
    <div>排序</div>
    <div class="demo-window">
      <span class="green">\$</span><br>
      <span class="green">a</span><br>
      <span class="green">a</span><br>
      <span class="green">a</span><br>
      <span class="green">b</span><br>
      <span class="green">n</span><br>
      <span class="green">n</span>
    </div>
  </div>
  <div class="demo-block">
    <div>在当前的列之前添加 BWT 结果</div>
    <div class="demo-window">
      <span class="green">a</span><span class="gray">\$</span><br>
      <span class="green">n</span><span class="gray">a</span><br>
      <span class="green">n</span><span class="gray">a</span><br>
      <span class="green">b</span><span class="gray">a</span><br>
      <span class="green">\$</span><span class="gray">b</span><br>
      <span class="green">a</span><span class="gray">n</span><br>
      <span class="green">a</span><span class="gray">n</span>
    </div>
  </div>
  <div class="demo-block">
    <div>再次排序</div>
    <div class="demo-window">
      <span class="green">\$</span><span class="gray">b</span><br>
      <span class="green">a</span><span class="gray">\$</span><br>
      <span class="green">a</span><span class="gray">n</span><br>
      <span class="green">a</span><span class="gray">n</span><br>
      <span class="green">b</span><span class="gray">a</span><br>
      <span class="green">n</span><span class="gray">a</span><br>
      <span class="green">n</span><span class="gray">a</span>
    </div>
  </div>
  <div class="demo-block">
    <div>重复上述步骤</div>
    <div class="demo-window">
      <span class="green">a</span><span class="gray">\$b</span><br>
      <span class="green">n</span><span class="gray">a\$</span><br>
      <span class="green">n</span><span class="gray">an</span><br>
      <span class="green">b</span><span class="gray">an</span><br>
      <span class="green">\$</span><span class="gray">ba</span><br>
      <span class="green">a</span><span class="gray">na</span><br>
      <span class="green">a</span><span class="gray">na</span>
    </div>
  </div>
  <div class="demo-block">
    <div>再次排序</div>
    <div class="demo-window">
      <span class="green">\$</span><span class="gray">ba</span><br>
      <span class="green">a</span><span class="gray">\$b</span><br>
      <span class="green">a</span><span class="gray">na</span><br>
      <span class="green">a</span><span class="gray">na</span><br>
      <span class="green">b</span><span class="gray">an</span><br>
      <span class="green">n</span><span class="gray">a\$</span><br>
      <span class="green">n</span><span class="gray">an</span>
    </div>
  </div>
  <div class="demo-block">
    <div>重复上述步骤</div>
    <div class="demo-window">
      <span class="green">a</span><span class="gray">\$ba</span><br>
      <span class="green">n</span><span class="gray">a\$b</span><br>
      <span class="green">n</span><span class="gray">ana</span><br>
      <span class="green">b</span><span class="gray">ana</span><br>
      <span class="green">\$</span><span class="gray">ban</span><br>
      <span class="green">a</span><span class="gray">na\$</span><br>
      <span class="green">a</span><span class="gray">nan</span>
    </div>
  </div>
  <div class="demo-block">
    <div>再次排序</div>
    <div class="demo-window">
      <span class="green">\$</span><span class="gray">ban</span><br>
      <span class="green">a</span><span class="gray">\$ba</span><br>
      <span class="green">a</span><span class="gray">na\$</span><br>
      <span class="green">a</span><span class="gray">nan</span><br>
      <span class="green">b</span><span class="gray">ana</span><br>
      <span class="green">n</span><span class="gray">a\$b</span><br>
      <span class="green">n</span><span class="gray">ana</span>
    </div>
  </div>
  <div class="demo-block">
    <div>重复上述步骤</div>
    <div class="demo-window">
      <span class="green">a</span><span class="gray">\$ban</span><br>
      <span class="green">n</span><span class="gray">a\$ba</span><br>
      <span class="green">n</span><span class="gray">ana\$</span><br>
      <span class="green">b</span><span class="gray">anan</span><br>
      <span class="green">\$</span><span class="gray">bana</span><br>
      <span class="green">a</span><span class="gray">na\$b</span><br>
      <span class="green">a</span><span class="gray">nana</span>
    </div>
  </div>
  <div class="demo-block">
    <div>再次排序</div>
    <div class="demo-window">
      <span class="green">\$</span><span class="gray">bana</span><br>
      <span class="green">a</span><span class="gray">\$ban</span><br>
      <span class="green">a</span><span class="gray">na\$b</span><br>
      <span class="green">a</span><span class="gray">nana</span><br>
      <span class="green">b</span><span class="gray">anan</span><br>
      <span class="green">n</span><span class="gray">a\$ba</span><br>
      <span class="green">n</span><span class="gray">ana\$</span>
    </div>
  </div>
  <div class="demo-block">
    <div>重复上述步骤</div>
    <div class="demo-window">
      <span class="green">a</span><span class="gray">\$bana</span><br>
      <span class="green">n</span><span class="gray">a\$ban</span><br>
      <span class="green">n</span><span class="gray">ana\$b</span><br>
      <span class="green">b</span><span class="gray">anana</span><br>
      <span class="green">\$</span><span class="gray">banan</span><br>
      <span class="green">a</span><span class="gray">na\$ba</span><br>
      <span class="green">a</span><span class="gray">nana\$</span>
    </div>
  </div>
  <div class="demo-block">
    <div>再次排序</div>
    <div class="demo-window">
      <span class="green">\$</span><span class="gray">banan</span><br>
      <span class="green">a</span><span class="gray">\$bana</span><br>
      <span class="green">a</span><span class="gray">na\$ba</span><br>
      <span class="green">a</span><span class="gray">nana\$</span><br>
      <span class="green">b</span><span class="gray">anana</span><br>
      <span class="green">n</span><span class="gray">a\$ban</span><br>
      <span class="green">n</span><span class="gray">ana\$b</span>
    </div>
  </div>
  <div class="demo-block">
    <div>重复上述步骤</div>
    <div class="demo-window">
      <span class="green">a</span><span class="gray">\$banan</span><br>
      <span class="green">n</span><span class="gray">a\$bana</span><br>
      <span class="green">n</span><span class="gray">ana\$ba</span><br>
      <span class="green">b</span><span class="gray">anana\$</span><br>
      <span class="green">\$</span><span class="gray">banana</span><br>
      <span class="green">a</span><span class="gray">na\$ban</span><br>
      <span class="green">a</span><span class="gray">nana\$b</span>
    </div>
  </div>
  <div class="demo-block">
    <div>再次排序</div>
    <div class="demo-window">
      <span class="green">\$</span><span class="gray">banana</span><br>
      <span class="green">a</span><span class="gray">\$banan</span><br>
      <span class="green">a</span><span class="gray">na\$ban</span><br>
      <span class="green">a</span><span class="gray">nana\$b</span><br>
      <span class="green">b</span><span class="gray">anana\$</span><br>
      <span class="green">n</span><span class="gray">a\$bana</span><br>
      <span class="green">n</span><span class="gray">ana\$ba</span>
    </div>
  </div>
  <div class="demo-block">
    <div>回到最初的矩阵</div>
    <div class="demo-window">
      <span class="red">\$</span>banana<br>
      a<span class="red">\$</span>banan<br>
      ana<span class="red">\$</span>ban<br>
      anana<span class="red">\$</span>b<br>
      banana<span class="red">\$</span><br>
      na<span class="red">\$</span>bana<br>
      nana<span class="red">\$</span>ba
    </div>
  </div>
</div>

<div class="demo-button-block">
  <div></div>
  <button class="demo-button" id="prev" onclick="p()">上一步</button>
  <div></div>
  <button class="demo-button" id="next" onclick="n()">下一步</button>
  <div></div>
</div>

<style>
  .demo-button {
    padding: 6px 14px;
    border: 1px solid #ccc;
    background: #fff;
    cursor: pointer;
    border-radius: 4px;
  }
  .demo-button:disabled {
    opacity: .4;
    cursor: not-allowed;
  }
  .demo-block {
    display: grid;
    place-items: center;
  }
  .demo-button-block {
    display: grid;
    grid-template-columns: 1fr auto 30px auto 1fr;
  }
  .demo-window {
    height: 200px;
    font-family: monospace;
    border: 1px solid gray;
    padding: 5px 30px 5px 30px;
    margin: 5px 0 5px 0;
  }
  .red {
    color: red;
  }
  .green {
    color: green;
  }
  .gray {
    color: gray;
  }
</style>

<script>
  let i = 0,
      v = document.getElementById('v'),
      c = v.children,
      prev = document.getElementById('prev'),
      next = document.getElementById('next');

  let u = () => {
    [...c].forEach((d, n) => d.hidden = n !== i);
    prev.disabled = i === 0;
    next.disabled = i === c.length - 1;
  };

  let p = () => { if (i > 0) i--; u() };
  let n = () => { if (i < c.length - 1) i++; u() };

  u()
</script>


# 算法原理

觉得这个算法有意思的地方，可能并不是它的实用价值。这里有一个非常有意思：为什么这样排序了几次之后，就会回到最初的矩阵

这里蕴藏了一个非常有意思的字符串排序逻辑。

通常情况下，我们会使用字符串从第一个字符开始比较，如果相同则比下一个字符

而在这个问题下，假定所有字符串长度相同，那其实完全可以从最后一位比起，然后逐次比较新增加的字符，可以实现类似桶排序的方式，达成最终排序结果

由于后排序的结果会覆盖先排序的结果，使得实际上达成了“从第一个字符开始比较，如果相同则比下一个字符”的效果