import puppeteer, { Browser } from "https://deno.land/x/puppeteer@9.0.0/mod.ts";
export { assertEquals, assertThrows } from "https://deno.land/std@0.102.0/testing/asserts.ts";

Deno.test('e2e', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('http://localhost:1123/');
    const h1 = await page.evaluate(() => {
        return !!document.querySelector("h1");
    });
    // FIXME
    // assertEquals(h1.toString(), "true");
    await page.close();
    await browser.close();    
});
