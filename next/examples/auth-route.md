关于路由配置有如下结构
```ts
interface Auth {
    resource: string | RegExp;
    actions?: string[];
}

interface IRoute = {
    name: string;
    key: string;
    children?: IRoute[];
    // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
    ignore?: boolean;
    requiredPermissions?: Auth[];
    oneOfPerm?: boolean;
}
```

关于用户信息如下
```ts
// 对应 [source, actions]
type UserPermission = Record<string, string[]>;

interface User {
    name?: string;
    permission: UserPermission;
}
```

其中 auth 种 resource 表示资源标识，对应 user.permission 信息，actions 表示需要何种权限，如 write/read 表示分别可写可读。路由种 requiredPermissions 表示需要的权限信息，oneOfPerm 为 true 表示满足任意 requiredPermissions 即可，否则需要满足全部。

需求：根据给定的 IRoute[] 路由配置，以及给定的用户的 permission 得到用户拥有哪些路由权限。

参考答案
```ts
const judge = (actions: string[], perm: string[]) => {
  if (!perm || !perm.length) {
    return false;
  }

  if (perm.join('') === '*') {
    return true;
  }

  return actions.every((action) => perm.includes(action));
};

const auth = (params: Auth, userPermission: UserPermission) => {
  const { resource, actions = [] } = params;
  if (resource instanceof RegExp) {
    const permKeys = Object.keys(userPermission);
    const matchPermissions = permKeys.filter((item) => item.match(resource));
    if (!matchPermissions.length) {
      return false;
    }
    return matchPermissions.every((key) => {
      const perm = userPermission[key];
      return judge(actions, perm);
    });
  }

  const perm = userPermission[resource];
  return judge(actions, perm);
};

function authPermissions(params: AuthParams, userPermission: UserPermission) {
    const { requiredPermissions, oneOfPerm } = params;
    if (Array.isArray(requiredPermissions) && requiredPermissions.length) {
        let count = 0;
        for (const rp of requiredPermissions) {
            if (auth(rp, userPermission)) {
                count++;
            }
        }
        return oneOfPerm ? count > 0 : count === requiredPermissions.length;
    }
    return true;
}

const filterRoute = (routes: IRoute[], arr = []): IRoute[] => {
    if (!routes.length) {
      return [];
    }
    for (const route of routes) {
      const { requiredPermissions, oneOfPerm } = route;
      let visible = true;
      if (requiredPermissions) {
        visible = auth({ requiredPermissions, oneOfPerm }, userPermission);
      }

      if (!visible) {
        continue;
      }
      if (route.children && route.children.length) {
        const newRoute = { ...route, children: [] };
        filterRoute(route.children, newRoute.children);
        if (newRoute.children.length) {
          arr.push(newRoute);
        }
      } else {
        arr.push({ ...route });
      }
    }

    return arr;
};
```