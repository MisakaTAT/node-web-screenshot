# node-web-screenshot
基于`Puppeteer`与`Fastify`的Web截图服务

# QuickStart

## Clone project
```
git clone https://github.com/MisakaTAT/node-web-screenshot.git
```

## Project setup
```
npm install
```

## Running project
```
node index.js
```

## Usening
```shell
curl "http://127.0.0.1:3000" -H "Content-Type: application/json" -d "{\"url\":\"https://mikuac.com\"}" -X POST
```
Screenshot of the specified element
```json
{
    "url": "https://mikuac.com",
    "selector": "#aside-user > div > div > a > span > img"
}
```
Full screenshot
```json
{
    "url": "https://mikuac.com"
}
```
