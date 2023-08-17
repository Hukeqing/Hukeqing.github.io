---
title: OTPAUTH，两步验证中的通用协议
date: 2023-08-16 08:46:46
categories: 杂项
tag:
 - otpauth
 - 2FA
math: true
mermaid: true
---

# 起因

昨天突然 GitHub 给我发了一封邮件，要求我必须添加 2FA 的验证

![GitHub-email](/image/other/otpauth/github-email.png)

好吧好吧，那就创建吧。但是在创建的过程中，GitHub 问我是否有使用 1Password 之类的软件，如果有的话，可以扫码添加 2FA

嗯？？？因为我基本上是躺在 Apple 生态里的，所以选择让 Apple 自带的密码管理系统试试看，于是直接扫码了 GitHub 提供的二维码

结果扫码之后果真添加了 2FA 的能力

![password](/image/other/otpauth/password.png)

这个验证码很像 steam 使用的那种自生成的两步验证码，这让我觉得似乎有一种通用协议，来实现这样一套东西。立马开整

第一步，再搞到一份这样的二维码。我翻阅了 GitHub 的文档，最终找到了一份 GitHub 提供的示例二维码

![qr-code](/image/other/otpauth/qr-code.png)

接着直接读取二维码内的信息得到了这样一个地址: `otpauth://totp/GitHub:octocat-testing?secret=F76W4SX573PDRIDA&issuer=GitHub`

嗯，看起来是有一个用 OTPAUTH 的验证协议，其中 OTP 大概率就是 One Time Password 了。

# OTP 协议

一般 OTP 有两种策略：

计次使用（HOTP）和计时使用（TOTP）。计次使用的密码使用过一次就失效；计时使用的密码过一段时间就失效。

> HOTP 的全称是 HMAC-based One Time Password，它是基于 HMAC 的一次性密码生成算法。HMAC 的全称是 Hash-based Message Authentication Code，是指密钥相关的哈希运算消息认证码。HMAC 利用 MD5、SHA-1 等哈希算法，针对输入的密钥和消息，输出消息摘要。HOTP 算法中，传入密钥 K 和计数器 C，得到数字校验码。
>
> 实际使用 HOTP 中，服务端会给用户生成密钥 K，并约定起始计数器 C。客户端根据 K 和 C 生成校验码，并在用户点击刷新按钮后将计数器加 1，同时更新校验码；而服务端会在每次校验成功后将计数器加 1，这就保证了校验码只能使用一次。但客户端刷新并不通知服务端，很可能出现客户端计数器大于服务端的情况。所以一般的实现里，服务端如果用 PASSWORD = HOTP(K, C) 验证失败，还会尝试 C+1、C+2...，如果匹配上了，就更新服务端的计数器，保证跟客户端步调一致。出于安全考虑，服务端会设置一个最大值，并不会无限制地尝试下去。
>
> HOTP 的优点是可以事先算好一批校验码，用户可以把他们打印出来随身携带逐个使用，用一个划掉一个，达到客户端计数器累加的效果，这样可以完全不依赖于电子设备。HOTP 的缺点是计数器很容易不一致，服务端经常需要通过不断尝试来同步计数器，从而降低了安全性。
>
> TOTP 的全称是 Time-based One-time Password，它是基于时间的一次性密码生成算法。TOTP 算法需要约定一个起始时间戳 T0，以及间隔时间 TS。把当前时间戳 now 减去 T0，用得到的时间差除以 TS 并取整，可以得到整数 TC。根据 PASSWORD = HOTP(K, TC) 就可以得到数字校验码。
>
> TOTP 实际上只是把 HOTP 的递增计数器换成了与当前时间有关的 TS，从而在服务端 / 客户端时间一致的前提下，解决了 HOTP 需要同步计数器的问题。同时，TOTP 算法需要用到当前时间，需要现场计算，无法提前算好打印出来。默认情况下，TOTP 在间隔时间 TS 内都能通过校验，并不是一次有效。这个问题可以通过在服务端记录最后一次 TC 来解决，由于 TS 一般很短，通常也可以忽略。

翻阅 [google-authenticator](https://github.com/google/google-authenticator/wiki/Key-Uri-Format) 的 wiki 可以看到，这里有非常详细关于 URL 的参数的描述

## Secret

- REQUIRED: The secret parameter is an arbitrary key value encoded in Base32 according to RFC 3548. The padding specified in RFC 3548 section 2.2 is not required and should be omitted.

## Issuer

- STRONGLY RECOMMENDED: The issuer parameter is a string value indicating the provider or service this account is associated with, URL-encoded according to RFC 3986. If the issuer parameter is absent, issuer information may be taken from the issuer prefix of the label. If both issuer parameter and issuer label prefix are present, they should be equal.

- Valid values corresponding to the label prefix examples above would be: issuer=Example, issuer=Provider1, and issuer=Big%20Corporation.

- Older Google Authenticator implementations ignore the issuer parameter and rely upon the issuer label prefix to disambiguate accounts. Newer implementations will use the issuer parameter for internal disambiguation, it will not be displayed to the user. We recommend using both issuer label prefix and issuer parameter together to safely support both old and new Google Authenticator versions.

## Algorithm

- OPTIONAL: The algorithm may have the values:
    - SHA1 (Default)
    - SHA256
    - SHA512

> Currently, the algorithm parameter is ignored by the Google Authenticator implementations.

## Digits

- OPTIONAL: The digits parameter may have the values 6 or 8, and determines how long of a one-time passcode to display to the user. The default is 6.

> Currently, on Android and Blackberry the digits parameter is ignored by the Google Authenticator implementation.

## Counter

- REQUIRED if type is hotp: The counter parameter is required when provisioning a key for use with HOTP. It will set the initial counter value.

## Period

- OPTIONAL only if type is totp: The period parameter defines a period that a TOTP code will be valid for, in seconds. The default value is 30.

> Currently, the period parameter is ignored by the Google Authenticator implementations.