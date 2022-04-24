---
title: 使用 Junit5 和 Mockito 实现 SpringBoot 的单元测试最优美的解决方案
date: 2022-04-22 17:17:27
updated: 2022-04-22 17:17:27
mermaid: true
tags:
 - Java
 - SpringBoot
 - 单元测试
---

# 什么是单元测试

单元测试就是一部分代码，但是它

 - 不会在正常的业务流程中被执行
 - 不被打包进入最终的编译程序
 - 不会被任何其他业务代码以任何方式导入
 - 不会影响正常的代码

当然，它通常还要满足下面这些条件

 - 自动化的，不需要人工输入任何数据即可完成
 - 独立的，任何两个单元测试之间都不应该发生调用关系
 - 可重复的，单元测试可以无限重复执行且结果应该一致

传统的单元测试，即是测试一个函数是否正确运行。单元测试可以**为这个函数预先伪造一个测试环境**，例如用户登录了，且已经有超管权限了，那么运行这个函数是否能够得到我们期望得到的结果

注意上面这段文字中的提到的「为这个函数预先伪造一个测试环境」，这似乎不是很难理解，让我来举个例子：

> - 例如我们现在希望测试登录能力，这是多数的服务中通常都有的能力，按照一般的编码规范，我们将会在 service 层进行逻辑判断。例如取出匹配此账号的数据库的值，并校验密码。
> - 这是非常传统的做法，也同样足够的有效。接下来，让我们来为这个测试伪造一个环境
> > - 首先，我们在数据库中插入一个数据，当然，此时我们并不需要考虑到底插入了什么，因为我现在想要模拟假如没有此账号的似乎，登录的结果
> > - 然后，我们请求对应的接口，使用新的随机数据，当然，这时候我们期望得到的是失败的登录请求，因为我们输入的数据就是不存在的。
>
> - 让我们来重新回顾整个过程，这个过程我们做了什么？我们访问了数据库！还修改了里面的数据！这太可怕了！
> - 假如这件事放在业务上，我们需要在发布环境通过单元测试来校验代码是否合理的时候，我们还需要插入一条数据！这仅仅只是一个登录失败的测试，这太可怕了！
> - 那有没有什么可能的方案来解决这个问题？
> - 接下来就轮到 Mock 来伪造这个过程了
> - 还是以登录失败为例，我们现在假定 service 是直接调用了 dao 层接口
> > - 首先，我们 mock 了用户的 dao 层接口，并指定「获取用户」的接口若传入 "ABC" 这个字符串，则返回不存在这个用户
> > - 然后我们调用用户的登录接口，并传入 "ABC" 作为账号
> > - 当用户的 service 遇到需要调用用户的 dao 接口时，会被上面设定的规则将会导致不再请求数据库，而是直接返回不存在
> > - service 收到不存在后，包装好返回值，并返回
> - 虽然看起来与刚才的，最终的结果是一样的，我们测试的代码几乎是相同的，但是我们却解决了最重要的问题——访问数据库

事实上，很多时候 mock 并不是解决这个问题的。我们希望单元测试能够单独测试一个函数是否逻辑正确，那么我们仅需要测试这个函数即可，当这个函数需要调用其他函数的时候，我们会对函数进行 mock 使得得到我们期望的值。这样就可以实现仅仅校验此函数的逻辑是否正确了

# 单元测试的意义

 - 在不需要启动服务的情况下，检查代码逻辑是否有问题
 - 保证代码在后续的迭代过程中，被其他人更新后导致原来可以正常运行的结果变得不正确了

因为单元测试是负责完成代码测试的，所以当完整的单元测试写完之后，我们就可以通过单元测试来校验代码逻辑是否有问题

同时单元测试将会一直存在与源代码中，后续每一次需要进行校验发布时，都可以通过运行一次单元测试来检查是否因为本次修改，导致之前的逻辑出现错误

# 单元测试的标准

 - 单元测试应该是全自动执行的，并且非交互式的。测试用例通常是被定期执行的，执行过程必须完全自动化才有意义。输出结果需要人工检查的测试不是一个好的单元测试。单元 测试中不准使用 System.out 来进行人肉验证，必须使用 assert 来验证。
 - 保持单元测试的独立性。为了保证单元测试稳定可靠且便于维护，单元测试用例之间决不能互相调用，也不能依赖执行的先后次序。
 - 单元测试是可以重复执行的，不能受到外界环境的影响。
 - 对于单元测试，要保证测试粒度足够小，有助于精确定位问题。单测粒度至多是类级别，一般是方法级别。
 - 单元测试代码必须写在如下工程目录:src/test/java，不允许写在业务代码目录下。
 - 单元测试应当包含「边界值测试」、「正确的输入」、「强制错误信息输入」的测试，而不是仅仅以满足覆盖率为标准

# 你需要会哪些代码知识

本博客的知识范围是 SpringBoot 框架，所以你必须要掌握下面的技能

 - 能够熟练使用 Java 语言编写代码
 - 了解 SpringBoot 的 AOP 的设计思想，会使用依赖注入
 - 能够看懂上面的基本概念，了解单元测试的重要性
 - 会使用 maven，并知道如何使用 maven
 - 能够阅读中文，并能看懂本博客

# 开始写单元测试

单元测试的代码应该位于你的项目目录 `src/test/java` 下，接下来所有的内容目录都指此目录

## 导入 maven 依赖

我们需要了解下面几个重要的依赖，但是并非都是需要添加的，请继续阅读

```xml
<!-- Junit 5 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
</dependency>
<!-- Mockito 核心 -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
</dependency>
<!-- Mockito 对 static 支持 -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-inline</artifactId>
</dependency>
<!-- Spring 对单元测试支持 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
```

以上这些依赖的相互依赖关系如下

```mermaid
graph LR
c([mockito-inline]) ----> b([mockito-core])
d([spring-boot-starter-test]) ----> b([mockito-core])
d([spring-boot-starter-test]) ----> a([junit-jupiter])
```

所以，实际上你只需要最后两个依赖即可完成本片博客的所有内容，但是还是有必要详细解释一下这些依赖在本博客中起到的作用

 - junit5：必须的组件，提供了最重要的注解和单元测试能力
 - mockito-core：必须的组件，提供了最重要的 Mock 的能力
 - mockito-inline：非必须组件，提供了对静态方法的 Mock 能力，如果不需要对静态方法进行 Mock 则可以不需要
 - spring-boot-starter-test：非必须组件，提供了对类的 private 变量的赋值能力，实际上反射也可以做到，但是通常为了方便期间，可以直接使用已经有的轮子

当你确定好需要的依赖之后，将其最新版本添加到你的 maven 里吧

## 创建测试类

首先，需要进行逻辑测试的永远是某个实现类，而不是接口，因为接口并不是需要测试的，我们需要测试的是实现的过程是否有问题

创建类用来编写你的单元测试。通常我们会根据需要测试的类进行单独建测试类，即每一个类对应一个测试类，每一个测试类，仅测试对应类的方法。例如，我们有 `src/main/java/com/example/service/impl/UserServiceImpl.java` 类，那么我们创建 `src/test/java/com/example/service/impl/UserServiceImplTest.java` 用于测试 `UserServiceImpl` 类。

例如，我们创建了 `src/test/java/com/example/service/impl/UserServiceImplTest.java` 类用于测试对应的类。接下来我们需要介绍一些注解和类。

```java
@ExtendWith() // 来自 junit 5 的注解，用于测试类上，表示此测试需要额外使用什么扩展工具
MockitoExtension // 来自 Mockito-core 的类，是 Mockito 的扩展工具，用于 junit 5 使用，junit 4 并不是这个
@BeforeAll // 来自 junit5 的注解，用于 static 方法上，表示在进行此类的所有测试方法前，执行一次此函数，仅一次
@AfterAll // 来自 junit 5 的注解，与 @BeforeAll 类似，但是表示所有测试方法结束后执行一次，仅一次
@BeforeEach // 来自 junit 5 的注解，用于非 static 方法上，表示在此类的所有测试方法将被执行前，每个都执行一次
@AfterEach // 来自 junit 5 的注解，与 @BeforeEach 类似，但是是在每个测试方法结束后，都执行一次
@Test // 来自 junit 5 的注解，用于非 static 方法上，表示此方法是一个测试
```

## 添加注解

接下来，按照上面的描述，为你的每个测试类都添加这些需要的注解，我们可以得到类似下面的代码

```java
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @BeforeEach
    void setUp() {
        // 这里的代码将会在每个测试前运行
    }

    @AfterEach
    void tearDown() {
        // 这里的代码将会在每个测试结束后运行
    }

    /**
     * 测试登录，用户不存在的情况
     */
    @Test
    void testLoginWithNoSuchUser() {
        // 这里编写你的测试代码
    }
}
```

我们已经完成了最基本的类的创建，虽然我们还没有开始调用登录的函数，但是我们已经完成类绝大部分的任务。

## 注入类

接下来，让我们将需要测试的类注入进来

在类中最开头添加类似下面的代码

```java

    @InjectMocks
    private UserServiceImpl userService; // 需要测试的类，需要用 @InjectMocks 注解

    @Mock
    private UserDaoImpl userDao; // 需要 mock 的类，需要用 @Mock 注解

```

然后，开始测试

```java

    @Test
    void testLoginWithNoSuchUser() {
        Boolean isSuccess = userService.login("handle", "password");
        Assertions.assertFalse(isSuccess); // 校验返回值是否正确
    }

```

但是这样肯定是不行的，因为你会发现，这样运行的结果会使得 `isSuccess` 为 `null`，而不是我们期望的结果。当然，我们也还没有配置 mock 的内容。

## mock it！

接下来让我们开始 mock 吧，尝试类似下面的代码

```java

    @Test
    void testLoginWithNoSuchUser() {
        // 表示「当调用 userDao#selectUserByHandle 且参数为 "handle" 时，则返回 null」
        Mockito.when(userDao.selectUserByHandle("handle")).thenReturn(null);
        Boolean isSuccess = userService.login("handle", "password");
        Assertions.assertFalse(isSuccess); // 校验返回值是否正确
    }

```

再运行一次看看？是不是完美了？

回头看看我们做的过程，是否让单元测试变得更加简单了，编写单元测试仅需要三步

 - 编写 Mockito 内容
 - 调用函数
 - 校验返回值或者参数

下面将会介绍几种常见的情况

# 应对各种情况

## 通用匹配类型

有时候我们并不喜欢指明参数必须要是什么，例如无论什么调用时，都返回 `null`，此时，参数可以使用 `Mockito.any()` 来表示任意参数，例如：

```java
Mockito.when(userDao.selectUserByHandle(Mockito.any())).thenReturn(null);
```

## 指定调用的目标函数的返回值

这已经在上面提及到了，也就是最常见的问题

## 让调用的目标函数抛出错误

将 `thenReturn` 改为 `thenThrow` 即可

## 让调用的目标函数做一些指定的事情

如果希望更加自定义函数的内容，譬如做点什么，则可以使用 `thenAnswer` 来解决

```java
Mockito.when(userDao.selectUserByHandle(Mockito.any())).thenAnswer(invocationOnMock -> {
    String handle = invocationOnMock.getArgument(0); // 获取第 0 个参数
    if (handle == "handle") {
        return null;
    }
    return 1;
})
```

## 如何应对没有返回值的函数

把 then 的部分向前提就行，并改为 do 系列

```java
Mockito.doAnswer(invocationOnMock -> {
    User argument = invocationOnMock.getArgument(0);
    argument.setId(1);
    return null; // 必须要返回些什么
}).when(userDao).insertAccount(Mockito.any());
```

## 如何控制那些静态的函数

假如我们有一个校验密码的静态方法 `BCryptEncoder#encode`，那么下面就是一个很好的例子

```java
MockedStatic<BCryptEncoder> bCryptEncoderMockedStatic;
bCryptEncoderMockedStatic = Mockito.mockStatic(BCryptEncoder.class);
bCryptEncoderMockedStatic.when(() -> BCryptEncoder.encoder("abc")).thenReturn("123");

// do something

bCryptEncoderMockedStatic.close();
```

## 如何测试 private 的方法

private 方法不应该被测试，因为其他类不会调用这方法。应该通过 public 间接测试 private 方法

## 如何校验函数的参数

我们以注册用户的时候使用的插入用户至数据库为例

```java
ArgumentCaptor<User> userArgumentCaptor = ArgumentCaptor.forClass(User.class); // 创建一个捕获类
Mockito.verify(userManager, Mockito.times(1)).insertAccount(userArgumentCaptor.capture()); // 第一次插入的时候，捕获参数
User userCP = userArgumentCaptor.getValue(); 获取被捕获的参数的值，后面就可以直接校验 userCP 了
```

