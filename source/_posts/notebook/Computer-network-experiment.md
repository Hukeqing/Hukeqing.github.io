---
title: 计算机网络实验复习
date: 2020-12-26 10:23:14
tag:
 - 学习
 - 课程
 - 计算机网络
---

# 传输介质
## 颜色
A类线(T568A)颜色：白绿/绿/白橙/蓝/白蓝/橙/白棕/棕
B类线(T568B)颜色：白橙/橙/白绿/蓝/白蓝/绿/白棕/棕

## 线
分为两种线：直连线和交叉线

直连线：线的两端使用的是相同类的线，即同时使用A类或者B类
交叉线：线的两端使用的是不同的线，一段为A类，一段为B类

### 为什么有两种不同的线
输入口和输出口的区别

如果使用的是直连线，则一段的输入端和另一端输入端的位置相同
而使用的是交叉线，则一段的输入端和另一端输入端的位置不同

### 使用时间
当一段为交换机，另一端不为交换机时，使用直连线
其他情况均使用交叉线

# 动态主机配置协议(DHCP)
用户利用有线或无线方式随机接入局域网，获得由DHCP服务器分配的临时IP地址

## 分配过程
 - 借助UDP协议、广播方式向局域网中所有DHCP服务器67端口发送DHCP搜索信息(DHCPDISCOVER)
 - 每个DHCP服务器收到广播请求后回应一个有效IP地址，并对该IP地址进行锁定(DHCPOFFER)
 - 客户机接受第一个回应的IP地址，并广播通知所有DHCP服务器确认接受。除分配该IP地址的服务器外，其他服务器解除对准备分配的IP地址的锁定，放回地址池(DHCPREQUEST)
 - 被选中的DHCP服务器收到确认信息后，以广播方式答复确认信息(DHCPACK)

## 终止DHCP租借
 - 超过服务器配置中所设置的时间，DHCP租借自动过期
 - 未超过服务器配置中所设置的时间，客户机的TCP/IP配置中可进行手动终止。

# 域名解析服务(DNS)
域名解析系统，以符号名字代替纯数字（IP地址）对计算机进行标识。例如，将www.baidu.com解析为36.152.44.95

## 域名分级
例如：www.baidu.com
一级域名为：com
二级域名为：baidu
三级域名为：www

每一级域名的解析服务器(DNS)都知道其下一级域名的服务器的IP，同时也知道根服务器的IP

## 域名解析过程
 - 客户机（PC）向首选DNS服务器发起请求：“你知道www.baidu.com的IP吗？”如果首选DNS服务器知道（一般如果首选DNS服务器曾经解析过，那么会进行一段时间内的缓存，默认三天，如果正好在缓存时间内，那么首选服务器就会知道这个域名的IP）那么首选DNS 服务器就会直接给客户机返回域名的IP 地址
 - 若首选DNS 服务器上没有相关信息，就不能直接返回域名的IP 地址，这时候，首选DNS 服务器就会去询问根DNS服务器（所有的 DNS 服务器都知道全球的 13 台DNS根服务器在哪里），根服务器可能不知道这个具体的 www.baidu.com 的IP地址，但是它知道一级域 com 的DNS服务器的IP（也就是说根服务器只负责维护所有的一级域，所以也就几百条数据在这里，虽然数据量少，但是它接受来自全球的请求，所以负载也很大）
 - 根服务器将 com 的DNS服务器的IP地址返回给首选 DNS 服务器
 - 首选DNS服务器再去请求 “com” DNS服务器：“你知道 www.baidu.com 的IP吗”，但是com DNS服务器也不知道 www.baidu.com 的IP，但是com 的DNS服务器知道 baidu.com 的IP
 - “com” 的DNS服务器将这个信息返回给首选 DNS 服务器
 - 首选DNS服务器再去请求 “baidu.com” DNS服务器，这时候 baidu.com 服务器当然就会知道 www.baidu.com的IP地址
 - “baidu.com”DNS服务器将这个信息返回给首选DNS 服务器
 - 首选DNS服务器将获取到的 www.baidu.com 的IP返回给客户机
 - 客户机根据获取到的 www.baidu.com 的IP地址来访问WEB服务器
 - WEB服务器返回相关的数据

| 序号 | 请求发起者 | 请求接受者 | 询问内容 | 询问结果 |
|:-:|:-:|:-:|:-:|:-:|
| 1 | PC | 默认DNS服务器 | www.baidu.com | 暂时不回答 |
| 2 | 默认DNS服务器 | 根服务器 | www.baidu.com | com的DNS服务器的IP |
| 3 | 默认DNS服务器 | com 的DNS服务器 | www.baidu.com | baidu.com 的DNS服务器的IP |
| 4 | 默认DNS服务器 | baidu.com 的DNS服务器 | www.baidu.com | www.baidu.com的IP |
| 5 | 默认DNS服务器 | PC | | 回答序号1的询问，即返回www.baidu.com的IP |

## 性能优化
 - 缓存：将查找到的新域名解析结果置于本地缓存，以提高域名解析响应速度
 - 复制：根服务器存在多个副本，为客户机请求提供最快速的响应

# Internet服务管理器(IIS)

## Web访问过程
 - 输入想要访问的网站的域名或者IP
 - DNS 解析网站的域名得到 IP
 - 访问对方的 IP 的80端口找到对方的 web 服务器上的对应的网页
 - 将网页下载到本地
 - 浏览器渲染页面并显示出来

## FTP访问过程
 - 输入想要访问的FTP的域名或者IP
 - DNS 解析网站的域名得到 IP
 - 访问对方的 IP 的21端口找到对方的 FTP 服务器上的对应的文件夹
 - 打开FTP站点目录

# 交换机(Switch)
工作在OSI参考模型的第二层，即数据链路层

| 序号 | 名称 | 举例 |
|:-:|:-:|:-:|
| 7 | 应用层 | HTTP |
| 6 | 表示层 | JPEG |
| 5 | 会话层 | |
| 4 | 传输层 | TCP |
| 3 | 网络层 | IP |
| 2 | 数据链路层 | mac |
| 1 | 物理层 | |

通常交换机只能看到数据包的mac地址，并不知道数据包所要发往的IP地址

## 基本概念

### mac地址
 - mac 地址与电脑硬件(网卡)有关
 - 是网卡的硬件地址，全球唯一

### mac地址表
存放物理地址与交换机端口映射关系的数据库

## 交换机工作原理
### 数据转发
 - 数据包信息到达交换机
 - 交换机根据数据包中封装的目的主机的MAC地址信息查找MAC地址表，同时根据源主机MAC地址信息更新自己的MAC地址表
     * 如果表中存在该目的主机的MAC地址，则从其对应的端口将数据包发送出去
     * 如果表中不存在该目的主机的MAC地址，则将该数据包被<font color=red>泛洪</font>到所有端口
 - 目的主机PC2接收到数据包后，回复响应数据包给PC1，该过程与PC1发送数据包给PC2类似，但此时，PC2是源主机，PC1是目的主机
 - 当PC2发送的响应数据包到达交换机时，交换机在转发数据包的同时，根据源主机MAC地址更新MAC地址表（在2.2的情况下，即在MAC地址表中添加一条PC2的MAC地址信息——MAC地址自动<font color=red>学习</font>）
### 自动老化功能
 - 存在于MAC地址表中的MAC地址，如果长时间没有从该MAC地址收到包，则该MAC地址将被删除
 - 当再次收到该MAC地址发送的包时，把该包作为广播包处理，重新学习

### 转发
交换机向MAC地址X转发数据包

### 过滤
交换机收到一个数据包，查表后发现该数据包的来源地址与目的地址属于同一网段。交换机将不处理该数据包

如果交换机的每个端口都只连接一台 PC，那么交换机会正常进行转发而不会进行过滤

## 使用
{% note warning %}
所有<font color=green>绿色</font>内容都为需要根据实际情况填写
{% endnote %}

| 原状态 | 新状态 | 命令 |
|:-:|:-:|:-:|
| 用户模式 | 特权模式 | enable |
| 特权模式 | 全局配置模式 | configure terminal |
| 全局配置模式 | 接口配置模式 | interface fa0/<font color=green>1</font> |
| 全局配置模式 | 多个接口配置模式 | interface range fa0/<font color=green>1</font> - <font color=green>10</font> |
| 全局配置模式 | Vlan配置模式 | interface vlan <font color=green>1</font> |
| (多个)接口配置模式/Vlan配置模式 | 全局配置模式 | exit |
| 全局配置模式 | 特权模式 | exit |
| 特权模式 | 用户模式 | exit |

| 模式 | 用途 | 命令行开头最后显示标志 |
|:-:|:-:|:-:|
| 用户模式 | 实验课上无用 | > |
| 特权模式 | <font color=red>查看</font>设备信息时使用 | # |
| 全局配置模式 | <font color=red>设置</font>设备信息时使用 | (config)# |

## 交换机的命令列表

### 特权模式下
| 命令 | 功能 |
|:-:|:-:|
| show mac-address-table | 查看mac地址表 |
| show aging-time | 查看自动老化时间 |
| show vlan brief | 查看 vlan 列表 |

### 全局配置模式
| 命令 | 功能 |
|:-:|:-:|
| hostname <font color=green>新的名字</font> | 修改交换机名称 |
| mac-address-table static <font color=green>mac</font> vlan <font color=green>1</font> interface fa0/<font color=green>1</font> | 新增一条静态路由绑定 |
| no mac-address-table static <font color=green>mac</font> vlan <font color=green>1</font> interface fa0/<font color=green>1</font> | 删除一条静态路由绑定 |
| vlan <font color=green>1</font> | 新建/配置一个Vlan |
| no vlan <font color=green>1</font> | 删除一个Vlan |
| ip routing | 启用路由功能(仅三层交换机) |

### 配置模式
| 命令 | 功能 |
|:-:|:-:|
| switchport mode access | 设置端口为普通端口 |
| switchport mode trunk | 设置端口为 trunk 口 |
| switchport access vlan <font color=green>1</font> | 将端口设定为 vlan 1
| ip address <font color=green>IP</font> <font color=green>掩码</font> | 设置当前Vlan的IP(仅在Vlan配置模式下使用，仅三层交换机可用) |

# 路由器(Router)

## 网络段计算公式
```
IP & 掩码
```
> 例如，IP为192.168.1.1，掩码为255.255.255.0
> 则其网络段为
> `11000000.10101000.00000001.00000001 &`
> `11111111.11111111.11111111.00000000 =`
> `11000000.10101000.00000001.00000000`
> 即，网络段为：192.168.1.0

交换机只能交换同一个网络段的数据包，不能交换不同网络段的数据包

## 使用
| 原状态 | 新状态 | 命令 |
|:-:|:-:|:-:|
| 用户模式 | 特权模式 | enable |
| 特权模式 | 全局配置模式 | configure terminal |
| 全局配置模式 | 接口配置模式 | interface fa0/<font color=green>0</font> |
| 全局配置模式 | 子接口配置模式 | interface fa0/<font color=green>0</font>.<font color=green>1</font> |
| 子接口配置模式 | 全局配置模式 | exit |
| 接口配置模式 | 全局配置模式 | exit |
| 全局配置模式 | 特权模式 | exit |
| 特权模式 | 用户模式 | exit |

| 模式 | 用途 | 命令行开头最后显示标志 |
|:-:|:-:|:-:|
| 用户模式 | 实验课上无用 | > |
| 特权模式 | <font color=red>查看</font>设备信息时使用 | # |
| 全局配置模式 | <font color=red>设置</font>设备信息时使用 | (config)# |
| 接口配置模式 | <font color=red>设置</font>单个具体的端口使用 | (config-if)# |

## 路由器命令列表

### 特权模式下
| 命令 | 功能 |
|:-:|:-:|
| show interface | 查看路由器端口信息 |
| show ip route | 查看路由信息 |

### 全局配置模式
| 命令 | 功能 |
|:-:|:-:|
| hostname <font color=green>新的名字</font> | 修改路由器名称 |
| ip route <font color=green>目标网段</font> <font color=green>掩码</font> <font color=green>下一个跳转的IP地址</font> | 设置静态路由转发 |

### 配置模式
| 命令 | 功能 |
|:-:|:-:|
| ip address <font color=green>IP</font> <font color=green>掩码</font> | 设置路由器的此端口的IP和掩码 |
| no shutdown | 启用此端口 |
| encapsulation dot1Q <font color=green>Vlan号</font> | 封装802.1Q(进入子端口的时候，封装此协议可以为此子端口设置IP) |

{% note success %}
注意，别忘记给PC设置网关
{% endnote %}

# Ping 的返回结果含义

## Requesttimed out 超时
 - 对方已关机
 - 对方和我不在同一个网段
 - 对方防火墙设置了ICMP数据包过滤
 - 错误设置IP地址

## Destinationhost Unreachable(无法到达)
 - 对方与自己不在同一网段内，而自己又未设置默认的路由(网关)
 - 网线出了故障

## BadIP address(错误的IP)
 - DNS服务器未设置
 - IP地址不存在

## Sourcequench received
 - 对方或中途的服务器繁忙无法回应

## Unknownhost(不知名主机)
该远程主机的名字不能被域名服务器（DNS）转换成IP地址

 - 域名服务器有故障
 - 名字不正确
 - 网络管理员的系统与远程主机之间的通信线路有故障

## Noanswer
 - 中心主机没有工作
 - 本地或中心主机网络配置不正确
 - 本地或中心的路由器没有工作
 - 通信线路有故障

# 网络协议分析
## ARP(地址解析协议)
 - 工作在数据链路层
 - 将IP地址转化成物理地址(mac)

> 在以太网协议中规定，同一局域网中的一台主机要和另一台主机进行直接通信，必须要知道目标主机的MAC地址。而在TCP/IP协议中，网络层和传输层只关心目标主机的IP地址。这就导致在以太网中使用IP协议时，数据链路层的以太网协议接到上层IP协议提供的数据中，只包含目的主机的IP地址。于是需要一种方法，根据目的主机的IP地址，获得其MAC地址。这就是ARP协议要做的事情。所谓地址解析（address resolution）就是主机在发送帧前将目标IP地址转换成目标MAC地址的过程。

> 另外，当发送主机和目的主机不在同一个局域网中时，即便知道对方的MAC地址，两者也不能直接通信，必须经过路由转发才可以。所以此时，发送主机通过ARP协议获得的将不是目的主机的真实MAC地址，而是一台可以通往局域网外的路由器的MAC地址。于是此后发送主机发往目的主机的所有帧，都将发往该路由器，通过它向外发送。这种情况称为委托ARP或ARP代理（ARP Proxy）。

### 工作原理
 - 有目的主机IP地址对应的MAC地址，直接转发
 - 没有目的主机IP地址对应的MAC地址，在本网段发起ARP请求广播包进行查询
 - 根据源主机的MAC地址信息，更新ARP列表

### 数据包

| 长度(位) | 48 | 48 | 16 | 16 | 16 | 8 | 8 | 16 | 48 | 32 | 48 | 32 |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 数据类型 | 目标以太网地址 | 源以太网地址 | 帧类型 | 硬件类型 | 协议类型 | 硬件地址长度 | 协议地址长度 | 操作码 | 源硬件地址 | 源协议地址 | 目标硬件地址 | 目标协议地址 |
| 英文名 | DEST ADDR | SRC ADDR | TYPE | HARDWARE TYPE | PROTOCOL TYPE | HLEN | PLEN | OPCODE | SOURCE MAC | SOURCE IP | TARGET MAC | TARGET IP |
| ARP(请求) | FF:FF:FF:FF:FF:FF | | | 0x0001 | 0x0800 | 0x06 | 0x04 | 0x0001 | | | 0000.0000.0000 | |
| ARP(回复) | | | | 0x0001 | 0x0800 | 0x06 | 0x04 | 0x0002 | | | | |

 - 硬件类型：如以太网（0x0001）、分组无线网
 - 协议类型：如网际协议(IP)（0x0800）、IPv6（0x86DD）
 - 硬件地址长度：每种硬件地址的字节长度，一般为6（以太网）
 - 协议地址长度：每种协议地址的字节长度，一般为4（IPv4）
 - 操作码：1为ARP请求，2为ARP应答，3为RARP请求，4为RARP应答
 - 源硬件地址：n个字节，n由硬件地址长度得到，一般为发送方MAC地址
 - 源协议地址：m个字节，m由协议地址长度得到，一般为发送方IP地址
 - 目标硬件地址：n个字节，n由硬件地址长度得到，一般为目标MAC地址
 - 目标协议地址：m个字节，m由协议地址长度得到，一般为目标IP地址

前14字节为以太网首部，后28字节为ARP请求/应答

## TCP(传输控制协议)
 - 工作在传输层
 - 实现进程到进程的可靠的数据流传送服务
 - 标识主机位置：地址(IP)
 - 标识进程：端口

### 三次握手
 - 客户端（通过执行connect函数）向服务器端发送一个SYN包，请求一个主动打开。该包携带客户端为这个连接请求而设定的随机数X作为消息序列号(seq=X)
 - 服务器端收到一个合法的SYN包后，把该包放入SYN队列中；回送一个SYN/ACK。ACK的确认码应为X+1，SYN/ACK包本身携带一个随机产生的序号Y(seq=Y,ack=X+1)
 - 客户端收到SYN/ACK包后，发送一个ACK包，该包的序号被设定为X+1，而ACK的确认码则为Y+1。然后客户端的connect函数成功返回(seq=X+1 ack=Y+1)

### 四次挥手
*貌似不考*

### 数据包
| 长度(位) | 16 | 16 | 32 | 32 | 4 | 6 | 6 | 16 | 16 | 16 |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 数据类型 | 来源连接端口 | 目的连接端口 | 序列号码 | 确认号码 | 资料偏移 | 保留 | 标志位 | 窗口大小 | 校验和 | 紧急指针 |
| 英文名 | SOURCE PORT | DESTINATION PORT | <font color=red>SEQ</font>UENCE NUMBER | <font color=red>ACK</font>NOWLEDGEMENT NUMBER | OFFSET | RESERVED | FLAGS | WINDOW | CHECKSUM | URGENT POINTER |
| TCP第一次握手 | A | B | X | 0 | 0 | 0 | 0b000010 | | | |
| TCP第二次握手 | B | A | Y | X+1 | 0 | 0 | 0b010010 | | | |
| TCP第三次握手 | A | B | X+1 | Y+1 | 0 | 0 | 0b010000 | | | |

# 实验操作
## 交换机配置静态路由

PC
```
C:\>ipconfig /all
```
获取FastEthernet0的物理地址(Physical Address)为`00E0.A3BA.8021`

交换机
```
Switch(config)# mac-address-table static 00E0.A3BA.8021 vlan 1 interface fa0/1
```

即完成了将mac地址为`00E0.A3BA.8021`的PC与`fa0/1`端口绑定

## 路由器设置端口

路由器
```
Router(config)# interface fa0/0
Router(config-if)# ip address 192.168.1.1 255.255.255.0
```

完成将`fa0/0`端口的IP设置为`192.168.1.1`，掩码为`255.255.255.0`

## 三层交换机实现Vlan间通讯

| 设备 | 属性 |
|:-:|:-:|
| PC1 | IP：192.168.10.10，掩码：255.255.255.0，网关：192.168.10.1 |
| PC2 | IP：192.168.20.10，掩码：255.255.255.0，网关：192.168.20.1 |
| PC3 | IP：192.168.10.20，掩码：255.255.255.0，网关：192.168.10.1 |
| PC4 | IP：192.168.20.20，掩码：255.255.255.0，网关：192.168.20.1 |
| 交换机1 | 与PC1和PC2连接，分别连在fa0/1 fa0/2口，fa0/3与三层交换机连接 |
| 交换机2 | 与PC3和PC4连接，分别连在fa0/1 fa0/2口，fa0/3与三层交换机连接 |
| 三层交换机 | 与交换机1和交换机2连接，分别连在fa0/1 fa0/2口 |

交换机1
```
enable
configure terminal
vlan 10
exit
vlan 20
exit
interface fa0/1
switchport access vlan 10
exit
interface fa0/2
switchport access vlan 20
exit
interface fa0/3
switchport mode trunk
exit
```

交换机2
```
enable
configure terminal
vlan 10
exit
vlan 20
exit
interface fa0/1
switchport access vlan 10
exit
interface fa0/2
switchport access vlan 20
exit
interface fa0/3
switchport mode trunk
exit
```

交换机3
```
enable
configure terminal
vlan 10
exit
vlan 20
exit
interface vlan 10
ip address 192.168.10.1 255.255.255.0
exit
interface vlan 20
ip address 192.168.20.1 255.255.255.0
exit
ip routing
```

## 单臂路由

| 设备 | 属性 |
|:-:|:-:|
| PC1 | IP：192.168.10.10，掩码：255.255.255.0，网关：192.168.10.1 |
| PC2 | IP：192.168.20.10，掩码：255.255.255.0，网关：192.168.20.1 |
| 交换机 | 与PC1和PC2连接，分别连在fa0/1 fa0/2口，fa0/3与路由器连接 |
| 路由器 | 与交换机连接，连在fa0/0口 |

交换机
```
enable
configure terminal
vlan 10
exit
vlan 20
exit
interface fa0/1
switchport access vlan 10
exit
interface fa0/2
switchport access vlan 20
exit
interface fa0/3
switchport mode trunk
exit
```

路由器
```
enable
configure terminal
interface fa0/0
no shutdown
interface fa0/0.1
encapsulation dot1Q 10
ip address 192.168.10.1 255.255.255.0
no shutdown
exit
interface fa0/0.2
encapsulation dot1Q 20
ip address 192.168.20.1 255.255.255.0
no shutdown
exit
```
