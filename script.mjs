
import puppeteer from 'puppeteer';
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
config({path: './.env'});
const uri = process.env.MONGO_URI;

    (async function () {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.daraz.com.np/products/apple-iphone-11-oliz-store-i107988223-s1029738541.html');

        const title = await page.$eval('.pdp-mod-product-badge-title', el => el.innerText);
        const price = await page.$eval('.pdp-price', el => el.textContent);
        const image = await page.$eval('.pdp-mod-common-image', el => el.src);
        console.table({title, price, image});
        browser.close();


        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            monitorCommands: true
        })
        client.on('commandStarted', started => console.log(started));
        client.connect()
            .then(async () => {
                const collection = client.db("daraz").collection("products")
                const result = await collection.insertOne({
                    title: title,
                    price: price,
                    image: image
                })
                console.log(result);
            })
    })();
