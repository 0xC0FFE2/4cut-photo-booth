const express = require("express");
const puppeteer = require("puppeteer");
const router = express.Router();

const BASE_RENDER_URL = process.env.RENDER_SERVER_URL || 'https://cloud.samsungsds.one';

const getFullUrl = (uri, query, isPrint = false) => {
    const queryString = new URLSearchParams(query).toString();
    const endpoint = isPrint ? 'print' : 'png';
    return `${BASE_RENDER_URL}/render/${endpoint}/${uri}?${queryString}`;
};

const captureScreenshot = async (url, isPdf = false) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle0" });

    await page.setViewport({ width: 1280, height: 1920 });

    let resultBuffer;
    if (isPdf) {
        resultBuffer = await page.pdf({
            width: '1280px',
            height: '1920px',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });
    } else {
        resultBuffer = await page.screenshot({ fullPage: true });
    }

    await browser.close();
    return resultBuffer;
};
router.get("/pdf/:uri", async (req, res) => {
  let browser;
  try {
    console.log("=== PDF 생성 시작 ===");
    console.log("URI:", req.params.uri);
    console.log("Query:", req.query);

    // URL 파라미터 올바르게 처리
    const queryParams = [];
    for (const [key, value] of Object.entries(req.query)) {
      queryParams.push(`${key}=${value}`);
    }
    const queryString = queryParams.join("&");
    
    // 올바른 다운로드 URL 사용
    const baseUrl = `${BASE_RENDER_URL}/download/${req.params.uri}`;
    const pngUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    console.log("Generated PNG URL:", pngUrl);

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--allow-running-insecure-content",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-client-side-phishing-detection",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-features=TranslateUI",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-popup-blocking",
        "--disable-prompt-on-repost",
        "--disable-sync",
        "--disable-translate",
        "--metrics-recording-only",
        "--no-first-run",
        "--safebrowsing-disable-auto-update",
        "--enable-automation",
        "--password-store=basic",
        "--use-mock-keychain"
      ],
    });

    const page = await browser.newPage();

    // 네트워크 요청 로깅
    page.on("request", (request) => {
      console.log("요청:", request.url());
    });

    page.on("response", (response) => {
      console.log("응답:", response.url(), response.status());
    });

    page.on("requestfailed", (request) => {
      console.error("요청 실패:", request.url(), request.failure().errorText);
    });

    // 콘솔 로그 캐치
    page.on("console", (msg) => {
      console.log("브라우저 콘솔:", msg.text());
    });

    // 페이지 설정
    await page.setViewport({ width: 1280, height: 1920 });
    
    // User-Agent 설정 (일부 서버에서 봇 차단 방지)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // 먼저 이미지 URL이 접근 가능한지 확인
    try {
      console.log("이미지 URL 접근성 확인:", pngUrl);
      const imageResponse = await fetch(pngUrl);
      
      if (!imageResponse.ok) {
        throw new Error(`이미지 서버 응답 오류: ${imageResponse.status}`);
      }
      
      // 이미지 타입 확인
      const contentType = imageResponse.headers.get('content-type');
      console.log("Content-Type:", contentType);
      
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error(`잘못된 컨텐츠 타입: ${contentType}`);
      }
      
      console.log("이미지 URL 접근 성공!");
      
    } catch (imageError) {
      console.error("이미지 URL 접근 실패:", imageError.message);
      throw new Error(`이미지 로딩 실패: ${imageError.message}`);
    }

    // HTML 콘텐츠 생성 (이미지 로딩 개선)
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    background: white; 
                    font-family: Arial, sans-serif;
                }
                .container {
                    width: 1280px;
                    height: 1920px;
                    display: flex;
                    flex-direction: row;
                }
                .image-container {
                    width: 640px;
                    height: 1920px;
                    position: relative;
                    background: #f0f0f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .image {
                    width: 640px;
                    height: 1920px;
                    object-fit: cover;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .fallback {
                    display: none;
                    text-align: center;
                    color: #666;
                    font-size: 16px;
                    padding: 20px;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: #f0f0f0;
                    z-index: 1;
                }
                .image.error {
                    display: none;
                }
                .image.error + .fallback {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
                .loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: #f0f0f0;
                    z-index: 2;
                }
                .image.loaded + .loading {
                    display: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="image-container">
                    <img src="${pngUrl}" class="image" alt="4cut photo 1" 
                         onload="this.classList.add('loaded'); console.log('이미지 1 로드 성공', this.naturalWidth, this.naturalHeight);" 
                         onerror="this.classList.add('error'); console.log('이미지 1 로드 실패');" />
                    <div class="loading">
                        <p>이미지 로딩중...</p>
                    </div>
                    <div class="fallback">
                        <p>4컷 사진</p>
                        <p>이미지 로딩 실패</p>
                        <p style="font-size: 12px; margin-top: 10px; word-break: break-all;">${pngUrl}</p>
                    </div>
                </div>
                <div class="image-container">
                    <img src="${pngUrl}" class="image" alt="4cut photo 2" 
                         onload="this.classList.add('loaded'); console.log('이미지 2 로드 성공', this.naturalWidth, this.naturalHeight);" 
                         onerror="this.classList.add('error'); console.log('이미지 2 로드 실패');" />
                    <div class="loading">
                        <p>이미지 로딩중...</p>
                    </div>
                    <div class="fallback">
                        <p>4컷 사진</p>
                        <p>이미지 로딩 실패</p>
                        <p style="font-size: 12px; margin-top: 10px; word-break: break-all;">${pngUrl}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>`;

    await page.setContent(htmlContent);

    console.log("HTML 콘텐츠 설정 완료");

    // 이미지 로딩 대기 (개선된 방식)
    try {
      console.log("이미지 로딩 대기 시작...");

      // 이미지 로딩 완료 대기 (Promise.race 사용해서 타임아웃 처리)
      await Promise.race([
        page.waitForFunction(() => {
          const images = Array.from(document.images);
          return images.every(img => img.complete && (img.naturalWidth > 0 || img.classList.contains('error')));
        }, { timeout: 0 }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('이미지 로딩 타임아웃')), 15000)
        )
      ]);

      // 최종 이미지 상태 확인
      const imageInfo = await page.evaluate(() => {
        const images = Array.from(document.images);
        return images.map((img, index) => ({
          index: index,
          src: img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          hasError: img.classList.contains('error'),
          hasLoaded: img.classList.contains('loaded')
        }));
      });

      console.log("최종 이미지 상태:", JSON.stringify(imageInfo, null, 2));

    } catch (waitError) {
      console.error("이미지 로딩 대기 실패:", waitError.message);
      // 타임아웃이어도 PDF 생성 계속 진행
    }

    // 추가 대기 (이미지 렌더링 완료 대기)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("PDF 생성 시작...");

    const pdfBuffer = await page.pdf({
      width: "1280px",
      height: "1920px",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    });

    console.log("PDF 생성 완료, 크기:", pdfBuffer.length);

    await browser.close();
    browser = null;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `4cut_photo_${req.params.uri}_${timestamp}.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error("PDF 생성 실패:", error);
    console.error("Error stack:", error.stack);

    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("브라우저 종료 실패:", closeError);
      }
    }

    res.status(500).json({
      error: "PDF 생성 중 문제가 발생했습니다.",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});
router.get('/:uri', async (req, res) => {
    try {
        const url = getFullUrl(req.params.uri, req.query);
        const imageBuffer = await captureScreenshot(url, false);

        res.set("Content-Type", "image/png");
        res.send(imageBuffer);
    } catch (error) {
        console.error("스크린샷 실패:", error.stack);
        res.status(500).send("이미지 캡처 중 문제가 발생했습니다.");
    }
});

module.exports = router;
