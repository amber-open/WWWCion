### 开发环境
| 工具  |  版本 |
| :------------: | :------------: |
|  node |  8.9.4 |
|  npm | 5.7.1  |

### 操作流程
```flow
st=>start: git clone https://coding.net/u/jinbingpeng/p/jifen/git
change=>condition: 修改代码 Yes or No?
rely=>operation: npm install  (安装依赖)
test=>operation: npm run serve (启动测试环境)
build=>operation: npm run build (构建dist目录)
e=>end: 配置nginx代理dist目录

st->rely->change->rely
change(yes)->test->build->e
change(no)->build->e
```

### 命令
```
npm install  	安装依赖
npm run serve	运行测试
npm run build	构建生产
```

### nginx配置
```
location / {
    root   test;
    index  index.html index.htm;
    #支持vue-router history模式
    if (!-e $request_filename) {
        rewrite ^/(.*) /index.html last;
        break;
    }
    #支持gzip包加载
    location ~* \.(css|js)$ {
        gzip_static on;
    }
    #缓存文件
    location ~* ^.+\.(html|htm)$ {
        expires      1h;
    }
    location ~* ^.+\.(css|js|txt|xml|swf|wav)$ {
        access_log   off;
        expires      24h;
    }
    location ~* ^.+\.(ico|gif|jpg|jpeg|png)$ {
        access_log   off;
        expires      30d;
    }
    location ~* ^.+\.(eot|ttf|otf|woff|svg)$ {
        access_log   off;
        expires      max;
    }
}
```
