---
title: macOS 更新后导致 sdk 丢失问题
date: 2022-3-22 17:30:15
categories: 杂项
tag:
 - CLion
 - macOS
---

在 macOS 更新后，CLion 可能会出现如下错误

```
CMake Warning at /Applications/CLion.app/Contents/bin/cmake/mac/share/cmake-3.15/Modules/Platform/Darwin-Initialize.cmake:131 (message):
  Ignoring CMAKE_OSX_SYSROOT value:

   /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX12.1.sdk

  because the directory does not exist.
```

这时候，只需要删除 `cmake-build-debug` 或者对应的目录，然后 reload cmake 就行了
