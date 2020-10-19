SSO(Single Sign On)

## 什么是单点登录
在一个地方登录一次，就可以访问所有的系统。

## Cookie
Cookie 的工作原理
* 服务器在响应头 Set-Cookie 中写入的键值字符串，浏览器会写入 Cookie 中
* 请求在没有跨域的情况下，会自动在请求头 Cookie 中带上浏览器存储的键值字符串

了解一个 Cookie 属性：domain 用于设置 Cookie 的域名，默认值是当前响应请求的域名。

## 简单的解决办法
解决问题的关键就是解决跨域的问题
* 人为的将所有的系统统一到二级域名下，比如 xxx.xkool.org
* 登录的时候，设置 Cookie 的 domain 为 xkool.org
* 这样一来 Cookie 共享的问题就解决了，但后端如果是多个不同的服务，你 Cookie 发过来，但我内存中没有对应的数据，也就无法验证了。可以借助 redis 搭建一个共享的 session 库

## JWT
上述方式中搭建 redis 可能会比较麻烦，而且也会浪费服务端的内存。有没有办法绕开这个问题呢。于是就有了 JWT 鉴权的方式

基于 token 的鉴权机制类似于http协议也是无状态的，它不需要在服务端去保留用户的认证信息或者会话信息。

JWT 的构成
* header
  * 声明类型
  * 声明加密的算法
  * base64 encode 后构成第一部分
* payload
  * 各种声明
  * 暂简单理解为业务需要的数据支持
  * base 64 encode 后构成第二部分
* signature
  * base64 header
  * payload payload
  * secret

> secret 是保存在服务器端的，JWT 的签发生成也是在服务器端的，secret 就是用来进行 JWT 的签发和 JWT 的验证，目的就是为了防止伪造

服务端收到 token 后，就用同样的算法在计算签名，然后和 token 中的签名对比，如果相等，则证明他已经登录，就可以取出 payload 比如 userId 使用了。如果不相等，则说明有人篡改。

## CAS
CAS(Central Authentication Service)，耶鲁大学提出的注明的 SSO 解决方案。

a.com 访问一个需要鉴权的页面
1. 重定向到认证中心，通过 redirect 当前访问的系统传过去，用于到时候重定向回来
2. 认证中心判断用户有没有登录，如果没有，就让用户去登录
3. 登录成功后
   * 建立一个 session
   * 创建 ticket
   * 重定向回 a.com
   * 写 cookie，比如 Set cookie: ssoid=1234;domain=sso.com
4. a.com 拿到 ticket 后，再次向认证中心去认证，如果是合法的 ticket，认证中心会返回用户信息，同时注册系统 A
  * 建立局部 session
  * 返回对应资源
  * 写 cookie，比如 Set cookie: sessionid=xxx;domain=a.com
5. 这时候如果用户继续访问另一个受保护资源，由于建立局部 session 的过程中，发过自己的 cookie，到时候浏览器自然会带过来，自然就可以直到用户已经登录了

用户已经登录后，访问 B 系统 b.com 呢
* 系统 B 发现未登录，302 重定向到认证中心
* 由于之前登录过，sso.com 是有对应的 session 和 cookie 的，则 sso.com 不再引导用户登录，而是直接创建 ticket 并重定向回 b.com
* 后面的流程就和 a.com 拿到 ticket 的流程是一样的了

> 本质上是一个认证中心的 cookie，加上多个子系统的 cookie

为什么每次那 ticket 去认证时，认证中心还需要注册对应系统呢
* 主要是为了实现单点退出
* 用户在一个系统退出了，认证中心需要把自己的会话和 cookie 消灭
* 通知各个子系统，把自己的会话也统统消灭