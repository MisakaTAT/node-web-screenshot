/**
 * 基于puppeteer与fastify的web截图服务
 * @author Zero
 */
const fastify = require('fastify')({ logger: false });
const puppeteer = require('puppeteer');

const PORT = process.env.PORT || 8080;

const browserLaunch = puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

async function webScreenShot(url, selector) {
  let page = null;
  try {
    page = await (await browserLaunch).newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await page.goto(url, { waitUntil: 'load', timeout: 10000 });

    let imgBuffer = null;
    if (selector) {
      imgBuffer = await page.$(selector).screenshot();
    } else {
      imgBuffer = await page.screenshot({ fullPage: true });
    }

    return { code: 200, status: 'success', imgBuffer: imgBuffer };
  } catch (err) {
    return { code: 500, status: 'failed', msg: err.message };
  } finally {
    if (page) await page.close();
  }
}

fastify.get('/', async function (request, reply) {
  let url = request.query.url;
  let selector = request.query.selector;

  if (url) url = url.trim();
  if (selector) selector = selector.trim();

  if (!selector) selector = undefined;

  let checkUrl = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(url);
  if (!checkUrl) reply.code(400).send({ code: 400, status: 'failed', msg: 'url syntax error' });

  const result = await webScreenShot(url, selector);
  if (result.code == 200) {
    reply.code(200).type('image/png').send(result.imgBuffer);
  } else {
    reply.code(result.code).send(result);
  }
});

fastify.post('/', async function (request, reply) {
  let url = request.body.url;
  let selector = request.body.selector;

  if (url) url = url.trim();
  if (selector) selector = selector.trim();

  if (!selector) selector = undefined;

  let checkUrl = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(url);
  if (!checkUrl) reply.code(400).send({ code: 400, status: 'failed', msg: 'url syntax error' });

  const result = await webScreenShot(url, selector);
  if (result.code == 200) {
    reply.code(200).type('image/png').send(result.imgBuffer);
  } else {
    reply.code(result.code).send(result);
  }
});

fastify.listen(PORT, '0.0.0.0', (err, address) => {
  console.log(`Server is now listening on ${address}`);
  if (err) console.log(err);
});
