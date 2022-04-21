---
title: Portable OJ 二期工程技术方案
date: 2022-02-17 20:38:29
math: true
mermaid: true
hide: true
---

# 新增权限

| 权限 | 名称 | 功能 |
|:-:|:-:|:-:|
| VIEW\_ALL\_CONTEST | 查看所有比赛 | 能够无视约束查看所有比赛，但是不可以提交 |
| CREATE\_AND\_EDIT\_CONTEST | 创建和更新比赛内容权利 | 能够创建和编辑自己的比赛，此权限不影响合作者编辑题目 |
| EDIT\_NOT\_OWNER\_CONTEST | 更新其他人拥有的比赛内容权利 | 能够创建和编辑别人的比赛，此权限不影响合作者编辑题目 |

# 新增模块

## 比赛模块

### 比赛属性

 - id。唯一不变的主键
 - owner。拥有者
 - title。标题
 - startTime。开始时间
 - duration。持续时间
 - accessType。访问权限


 | 访问权限 | 名称 | 描述 |
 | :-: | :-: | :-: |
 | PUBLIC | 公开的 | 允许任何人进入查看此比赛并进行 |
 | PASSWORD | 需要密码的 | 在输入密码后授权允许在当前浏览器上进入 |
 | PRIVATE | 邀请制的 | 仅允许指定的部分用户参加 |


 - problemList。题目列表
 - coAuthor。共同的出题人
 - accessTypeValue。访问权限配置值
 - freezeTime。封榜时长
 - announcement。公告


 | 访问权限 | 普通用户 | 有密码或者在邀请列表内的 | 出题人/合作者 | VAC 的 | ENOC 的 |
 | :-: | :-: | :-: | :-: | :-: | :-: |
 | PUBLIC | 可以查看/提交 | 可以查看/提交 | 可以查看/提交/编辑 | 可以查看/提交 | 可以查看/提交/编辑 |
 | PASSWORD | 无 | 可以查看/提交 | 可以查看/提交/编辑 | 可以查看/提交 | 可以查看/提交/编辑 |
 | PRIVATE | 无 | 可以查看/提交 | 可以查看/编辑 | 可以查看 | 可以查看/编辑 |

### 比赛功能

 - 查看比赛列表
     * 前端提供
         + 页码
         + 每一页的数量
     * 后端逻辑
         + 检查每一页的数量是否在要求范围内
         + 获取所有比赛总量
         + 检查页码是否在范围内
         + 获取指定页码的内容并返回
         + 在会话中中添加此用户的认证信息
 - 查看比赛详情
     * 前端提供
         + 比赛的 id
     * 公开的比赛
         + 验证是否已经开始比赛
         + 在会话中中添加此用户的认证信息
         + 返回比赛信息
     * 需要密码的
         + 验证是否已经开始比赛
         + 检查用户是否已经认证过此比赛
         + 检查用户是否是比赛的拥有者或者合作者
         + 检查用户是否拥有 VIEW\_ALL\_CONTEST 权限
         + 检查用户的密码是否正确
         + 在会话中中添加此用户的认证信息
         + 返回比赛信息
     * 邀请制的
         + 验证是否已经开始比赛
         + 检查用户是否已经认证过此比赛
         + 检查用户是否是比赛的拥有者或者合作者
         + 检查用户是否拥有 VIEW\_ALL\_CONTEST 权限
         + 检查用户是否在邀请列表中
         + 在会话中中添加此用户的认证信息
         + 返回比赛信息
 - 查看比赛的题目
     * 前端提供
         + 比赛的 id
         + 题目的序号
     * 后端逻辑
         + 验证是否已经开始比赛
         + 认证用户信息，参考查看比赛详情
         + 验证是否已经开始比赛
         + 返回题目信息
 - 查看比赛提交列表/测试提交列表
     * 前端提供
         + 比赛的 id
         + 提交的页码
         + 提交每页数量
     * 后端逻辑
         + 认证用户信息，参考查看比赛详情
         + 返回比赛提交列表
 - 查看比赛提交详情/测试提交详情
     * 前端提供
         + 比赛的 id
         + 提交的 id
     * 后端逻辑
         + 认证用户信息，参考查看比赛详情
         + 若为题目的拥有者、合作者，则返回提交的详情和运行信息
         + 若为提交本人，则仅返回提交的详情
         + 若为其他人，则拒绝
 - 查看比赛榜单
     * 前端提供
         + 比赛的 id
     * 后端逻辑
         + 认证用户信息，参考查看比赛详情
         + 返回榜单，注意封榜
 - 在比赛中提交
     * 前端提供
         + 比赛的 id
         + 题目的序号
         + 提交的代码
         + 提交的语言
     * 后端逻辑
         + 认证用户信息，参考查看比赛详情
         + 比赛拥有者和出题合作人提交至测试提交列表
         + 验证是否已经开始比赛
         + “公开的”和“需要密码的”仅允许比赛参与者进行提交，“邀请制的”，则仅邀请制内的可以提交
         + 完成提交，并加入判题系统
 - 创建/更新比赛（需要 CREATE\_AND\_EDIT\_CONTEST）
     * 前端提供
         + 比赛的 id
         + 比赛的标题
         + 题目列表
         + 比赛开始时间
         + 比赛持续时间
         + 比赛的访问权限
         + 比赛访问权限的参数
         + 共同出题人
         + 封榜单时长
         + 公告
     * 比赛未开始
         + 检查是否是 owner 或者拥有 EDIT\_NOT\_OWNER\_CONTEST 权限
         + 均可更新
     * 比赛开始后
         + 检查是否是 owner 或者拥有 EDIT\_NOT\_OWNER\_CONTEST 权限
         + 不可以删除题目，但是可以增加
         + 不可以修改开始时间
         + 不可以修改结束时间至当前时间之前
         + 不可以修改共同出题人
     * 比赛结束之后
         + 除了公告，所有内容均不可修改
 - 比赛共同出题人修改比赛题目
     * 前端提供
         + 比赛的 id
         + 变更操作与题目 id
     * 后端逻辑
         + 检查是否有权编辑此比赛
         + 检查是否有权限变更请求的列表中的题目，共同出题人只能变更 `owner` 为其本身的题目
         + 检查当前是否还可以变更题目列表
         + 变更比赛的题目

# 更新模块

## 问题模块

### 新增属性

 - contest。第一次绑定的比赛

### 更新逻辑

 - 修改题目的访问权限
     * 后端需要检查对应的比赛是否已经结束

### 新增功能

 - 根据标题搜索可访问的题目列表
     * 前端提供
         + 搜索关键词

## 提交模块

### 新增枚举

SolutionType 下新增 TEST_CONTEST 属性，表示比赛拥有者/共同出题人在比赛中的提交

# 存储变更

## 比赛模块

### MySQL
```sql
create table contest
(
    id          bigint auto_increment comment '比赛 id',
    data_id     varchar(32)  null comment '比赛数据 id',
    owner       bigint       null comment '比赛拥有者',
    title       varchar(255) null comment '比赛标题',
    start_time  datetime     null comment '比赛开始时间',
    duration    int          null comment '比赛持续时间（分钟）',
    access_type varchar(64)  null comment '比赛的访问权限类型',
    primary key (`id`),
    UNIQUE KEY uk_title(`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mp4 COLLATION=utf8mb4_general_ci COMMENT '比赛信息';
```

### Mongo
```java
public abstract class BasicContestData {

    /**
     * 题目列表
     */
    private List<Long> problemList;

    /**
     * 允许此类访问权限的题目
     */
    private Set<ProblemAccessType> problemAccessTypeList;

    /**
     * 共同的出题人
     */
    private Set<Long> coAuthor;

    /**
     * 封榜时长
     */
    private Long freezeTime;

    /**
     * 公告
     */
    private String announcement;
}
```
