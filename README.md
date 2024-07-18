这是一个前端发送请求的js库
=======
# Apricity --前后端交互工具库

<font color=blue>这是本人在学习 js 的过程中编写的一个工具库用来熟悉 js 的，一切仅供本人学习使用</font>

## 一、功能

用来进行前后端交互类似于 axios，ajax 等库。

## 二、技术选型

- **语言：**`javaScript`
- **第三方库：**`buffer`
- **环境：**`Nodejs`
- **打包工具：**`rollup` + `babel`
- **基础依赖：**`http`

## 三、功能实现

1. **目前支持的功能：**

   1. `get`请求：

      `get`请求接收四个参数，分别是`url`，`data`，`beforeRequest`，`afterRequest`

      - `url`：请求的 http 路径
      - `data`：请求的参数，以及配置（`params`、`config`）
      - `beforeRequest`：请求发送前执行的回调函数
      - `afterRequest`：请求完成后执行的回调函数

      ```javascript
      const ap = new Apricity();
      
      ap.get("url",
        {
          params: { username: "admin", password: "admin" },
          config: {
            headers: {
              "Content-Type": "application/json",
            },
          },
        },
        () => {
          console.log("请求发送前执行回调函数");
        },
        () => {
          console.log("请求完成后执行回调函数");
        }
      )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      ```
   
2. `post`请求：
      `post`请求接收五个参数`url`，`config`，`params`，`beforeRequest`，`afterRequest`
   
   - `url`：请求的 http 路径
      - `config`：请求的配置选项`(headers)`
      - `params`：请求的参数
      - `beforeRequest`：请求发送前执行的回调函数
      - `afterRequest`：请求完成后执行的回调函数
   
   ```javascript
      const ap = new Apricity();
      
   ap.post("/objectPost",
        { "Content-Type": "application/json" },
        { user: "admin", password: "admin" },
        () => {
          console.log("请求发送前执行的回调函数");
        },
        () => {
          console.log("请求完成后执行的回调函数");
        }
      )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
   ```
   
   3. <font color=red>目前仅支持`get`和`post`请求。`config`的选项配置目前仅支持`headers`</font>

2. **基础配置：**
   该库目前支持在请求发送前进行基础配置。目前的配置选项（目前仅支持这些）：

   - `baseUrl`：基础 url 配置
   - `timeout`：最大请求时间（毫秒）
   - `headers`：请求头
   - `headerBeforeRequest`：基础配置中请求发送前执行的回调函数
   - `headerAfterRequest`：基础配置中请求完成后执行的回调函数

   **配置形式：**

   1. `object`对象配置：

      ```javascript
      const ap = new Apricity({
        baseUrl: "http://localhost:3000",
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
        headerBeforeRequest: () => {
          console.log("请求发送前执行的回调函数");
        },
        headerAfterRequest: () => {
          console.log("请求完成后执行的回调函数");
        },
      });
      ```

   2. `function`函数配置：

      ```javascript
      const ap = new Apricity((config) => {
        config.baseUrl = "http://localhost:3000";
        config.headers = { "Content-Type": "application/json" };
        config.timeout = 10000;
        config.headerBeforeRequest = () => {
          console.log("请求发送前执行的回调函数");
        };
        config.headerAfterRequest = () => {
          console.log("请求完成后执行的回调函数");
        };
      
        return config;
      });
      ```

   **修改配置：**

   ```javascript
   const ap = new Apricity((config) => {
     config.baseUrl = "http://localhost:3000";
     config.headers = { "Content-Type": "application/json" };
     config.timeout = 10000;
     config.headerBeforeRequest = () => {
       console.log("请求发送前执行的回调函数");
     };
     config.headerAfterRequest = () => {
       console.log("请求完成后执行的回调函数");
     };
   
     return config;
   });
   
   ap.baseUrl = "http://localhost:8088";
   ap.timeout = 7000;
   
   ap.get("url").then((res) =>
     console.log(res)
   ); /*这个时候再发送请求，url的整体就是http://localhost:8088/url,而不是http://localhost:3000/url了，方便了不同情况的简单修改*/
   ```

   在基础配置中配置的参数，在后续是可以进行修改的以防一整个系统中出现不同情况的应对。例如：出现一个或者多个不同基础 url 的访问（只改变 url 不改变其他的配置）。这时就不用再单独进行配置，或者重新写请求的方法。emmm...，这只是一个例子，仅用于做例子，实际可能不会出现这种情况，所以这只是一个例子。

## 总结：

这个前后端交互工具库，目前仅适合再项目中做测试使用，由于该库还不具备完全的生产环境的处理功能以及许多基础功能未实现，所以只能做测试使用。

**新特点：**

- 基础配置绑定在实例上，可以直接通过实例进行修改。
- 有执行的回调函数（**请求发送前**和**请求发送后**）
