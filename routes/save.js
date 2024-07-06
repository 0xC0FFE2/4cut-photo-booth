const express = require("express");
const puppeteer = require('puppeteer');
const router = express.Router();

router.get('/:uri', async (req, res) => {
    const url = req.params.uri + '?' + req.url.split('?')[1];

    if (!url) {
        return res.status(400).send('URL parameter is required.');
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        //실제 올라간 도메인(포트) 로 변경 필요
        await page.goto(`http://localhost:8080/render/png/${url}`, { waitUntil: 'networkidle0' });

        await page.setViewport({ width: 640, height: 1984 });

        const screenshotBuffer = await page.screenshot({ fullPage: true });

        await browser.close();

        res.set('Content-Type', 'image/png');
        res.send(screenshotBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while taking the screenshot.');
    }
});

module.exports = router;
