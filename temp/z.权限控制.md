登录认证 Authentication 与鉴权 Authorization

关于登录认证与权限管理需要考虑的细节与对应设计，以及在 SSR 应用中又该如何处理。

<!-- more -->

## 价值
权限控制的关键在于后端，前端权限控制的价值是
* 提升突破权限的门槛
* 过滤越权请求，减轻服务端压力
* 提升用户体验

## 常见场景
关于登录认证的需求场景
* 对于受保护的资源，当用户没有登录时则直接跳转到登录页要求用户登录，通常还会带上跳转前路径，方便登录成功后直接跳转到指定页面。
* 如果用户已登录，用户依旧访问登录页，部分应用会选择自动跳转到首页

关于权限认证的需求场景，因为即使都是登录用户，但角色不同，权限也就不同，能看到和操作的东西就会有所差别。
* 不同的用户对页面的访问权限不同
  * 路由菜单等入口不显示
  * 通过 URL 直接访问，渲染 404 或 403 组件
* 不同用户在页面中可以看到的元素和操作不同
  * 元素直接消失不可见
  * 元素保留，但处于禁用态，同时引导用户购买 Pro 版等

多种常见 Authorization 权限策略
* RBAC - Role-Based Access Control
  * 将权限分配给角色，再将角色分配给用户来实现权限管理，关键部分是：User-Role-Permission
  * 优点是管理简单，适合组织结构清晰的场景
  * 缺点是不够灵活，难以处理复杂条件，以及角色爆炸问题
* ABAC - Attribute-Based Access Control
  * 通过评估用户、资源、环境和操作的各种属性来决定访问权限，如实现【允许部门经理在工作时间(9:00-18:00)从公司网络访问其部门标记为'内部'的文档】
  * 优点是非常灵活，支持复杂条件，可以实现动态权限控制
  * 缺点是实现复杂，性能开销较大
* ACL - Access Control List
  * 直接附加在资源上的权限列表，明确指定哪些用户/主体可以对该资源执行什么操作，每个资源维护一个列表，记录谁可以访问这个资源，可以进行什么操作
  * 优点是简单直观，细粒度控制，适合资源数量有限的场景
  * 缺点是难以大规模管理（每个资源单独维护），容易出现权限冗余

> 现代系统常组合使用这些策略，如使用RBAC作为基础，对特殊场景使用ABAC补充，对关键资源使用ACL进行精确控制。

其他场景：资源数量显示/账号有效期时长限制

下面根据 RBAC 策略和 React 技术栈简单谈下设计。

## 设计分析
根据上述 RBAC 提到的三个关键部分 User, Role, Permission，大概简单定义一下 User 数据模型如下。
```ts
interface User {
  // ……
  role: 'admin' | 'user';
  permission: { [key: string]: boolean }
}
```

主要 API 支持：login/logout/register/check-user，分别用于登录、登出、注册、检查是否登录。

根据应用场景，模块应该具备的部分有
* 考虑到登录鉴权模块是很通用的功能，最好能抽象出稳定的东西，将其解耦出来，方便在不同的系统中进行复用
* 需要一个时机对关键信息 User 进行获取，考虑到路由层面和元素层面可能需要对是否登录和是否有权限做出反应，为方便后续组件设计，通过 Context 机制将关键信息注入到全局
* 需要考虑到这部分数据的更改，如退出登录需要清除、登录成功需要手动注入
* 需要考虑客户端不可感知的异常情况，如本来已登录有权限，但登录失效或权限被更改，从而导致的接口异常情况
* 实现 component 当通过 URL 访问受保护资源时，未登录的自动跳登录页逻辑，无权限时渲染 404/403 组件
* 实现一个 useAccess hook 和 Access component 供组件进行元素级别权限控制

关于登录部分的解耦，可以参考开源项目 Refine 的设计
```ts
export type AuthActionResponse = {
  success: boolean;
  redirectTo?: string;
  error?: RefineError | Error;
  [key: string]: unknown;
  successNotification?: SuccessNotificationResponse;
};
export type CheckResponse = {
  authenticated: boolean;
  redirectTo?: string;
  logout?: boolean;
  error?: RefineError | Error;
};
export type OnErrorResponse = {
  redirectTo?: string;
  logout?: boolean;
  error?: RefineError | Error;
};

export type AuthProvider = {
  login: (params: any) => Promise<AuthActionResponse>;
  logout: (params: any) => Promise<AuthActionResponse>;
  check: (params?: any) => Promise<CheckResponse>;
  onError: (error: any) => Promise<OnErrorResponse>;
  register?: (params: any) => Promise<AuthActionResponse>;
  forgotPassword?: (params: any) => Promise<AuthActionResponse>;
  updatePassword?: (params: any) => Promise<AuthActionResponse>;
  // 获取权限信息
  getPermissions?: (
    params?: Record<string, any>,
  ) => Promise<PermissionResponse>;
  // 获取用户信息
  getIdentity?: (params?: any) => Promise<IdentityResponse>;
};
```

关于 Authenticated 组件应用举例，实现如果未登录访问需授权信息，则跳转登录页，实现已登录访问登录页，则自动跳转内容页
```tsx
<Route
  element={
    <Authenticated
      key="authenticated-inner"
      // CatchAllNavigate 的作用是跳转到指定路径，带上当前 location 信息作为 query params
      fallback={<CatchAllNavigate to="/login" />}
    >
      <Outlet />
    </Authenticated>
  }
>
  Private Content
</Route>
<Route
  element={
    <Authenticated
      key="authenticated-outer"
      fallback={<Outlet />}
    >
      {/* NavigateToResource 跳转到内容页面 */}
      <NavigateToResource />
    </Authenticated>
  }
>
  Login Page/Register Page/…
</Route>
```

## 服务端架构
关于在 Next.js 工程中关于 Auth 部分推荐实践，Auth 主要分为三部分，推荐使用三方认证库，除了核心功能外，通常还额外特性：social logins, multi-factor authentication, and role-based access control
* Authentication：身份认定，如有没有登录
* Session Management：跨请求跟踪用户的授权状态
* Authorization：授权，决定用户可以访问哪些路由和数据
  * Middleware 中进行乐观检查，如检查 cookie session 相关数据
  * Data Access Layer 集中处理授权逻辑，例如 verifySession
  * Data Transfer Objects 只返回必要信息

在 SPA 中的一种常见模式是，如果用户未获得授权，则在布局或顶级组件中返回 null。不推荐使用这种模式，因为 Next.js 应用程序有多个入口点，这不会阻止嵌套的路由段和 Server Action 被访问。

因此 Next.js 则强调服务端优先的授权策略，在服务端进行授权检查，也就是布局、Server Component 或中间件中验证权限。

## 接口级别
请求层面的登录失效逻辑怎么处理呢？如果再扩展一下，因为我们通常预期接口都是成功的，只有网络异常或者权限等问题时才会出现请求失败，因此我们系统异常情况只需要在一个地方统一处理即可。

有没有可能将接口级别的 401 和全局状态联动起来，当接口 401 时修改 store 状态，此时根组件发现状态变了，则跳转登录页，这样一来将根组件和组件级别的跳转都统一了。

由于需要修改组件逻辑，则使用需要使用 useEffect 进行注入，举例如下
```ts
export default function useSetupFetch(instance: AxiosInstance) {
  const router = useRouter();
  const [, setIsLoginIn] = useAtom(isLoginAtom);

  useEffect(() => {
    instance.interceptors.response.use(undefined, (error) => {
      const { response } = error;
      // 处理 client 组件发起请求自动跳转登录页逻辑
      if (response && response.status === 401) {
        setIsLoginIn(false);
        router.push('/login');
      }
      return Promise.reject(error);
    });
  }, [instance, router]);

  return null;
}
```

如果是 next 应用，还需要处理服务端的跳转，举例如下
```ts
import { redirect } from 'next/navigation';

let router: RouterInstance | null = null;
export function setRouter(instance: RouterInstance) {
  router = instance;
}

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// because of it can't use useSetupFetch in server component directly, need to wrap it in a client component
export default function SetupRequest() {
  const router = useRouter();

  useEffect(() => {
    setRouter(router);
  }, [router]);

  return null;
}

instance.interceptors.response.use(undefined, (error: any) => {
  const { response } = error;
  if (response && response.status === 401) {
    if (isServer) {
      redirect('/login');
    } else if (router) {
      router.push('/login');
    }
  }
  return Promise.reject(error);
});
```

> 经调研发现，连 Figma 都没有处理中途 token 失效时，ajax 请求 401 时的异常情况。