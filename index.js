import fs from 'fs';
import axios from 'axios';
import { downloadFile, ECMarkdown } from './tools/toolBox.js';
import TelegramAPI from './tools/TelegramAPI.js';

/**
 * 修改 App.vue
 */
const changePage = () => {
    try {
        let data = fs.readFileSync('./web/src/App.vue', 'utf-8');
        data = data.replace('const showBotInterveneAlert = ref(false);', 'const showBotInterveneAlert = ref(true);');
        data = data.replace('const botInterveneTime = ref("Undefined");', `const botInterveneTime = ref("${String(new Date)}");`);
        fs.writeFileSync('./web/src/App.vue', data);
        console.log('[changePage][Info] App.vue 已修改');
    } catch (e) {
        throw new Error(`[changPage][Error] ${String(e.errno || e.code)}: ${e.message}`);
    };
};

/**
 * 检查是否寄了
 */
const main = async () => {
    const telegramData = {
        token: process.env.TELEGRAM_TOKEN,
        father: String(process.env.TELEGRAM_FATHER_ID)
    };
    const checklyData = {
        checkID: process.env.CHECKLY_CHECK_ID,
        accountID: process.env.CHECKLY_ACCOUNT_ID,
        APIToken: process.env.CHECKLY_API_TOKEN
    };
    const Telegram = new TelegramAPI(telegramData.token);

    const ErrorMessage = async (message) => {
        console.log(message);
        await Telegram.sendMessage(telegramData.father, ECMarkdown(message));
    };

    // 请求 checklyAPI
    let requestData;
    try {
        requestData = await axios({
            method: 'get',
            url: `https://api.checklyhq.com/v1/check-statuses/${checklyData.checkID}`,
            headers: {
                'Accept': 'application/json',
                'x-checkly-account': checklyData.accountID,
                'Authorization': `Bearer ${checklyData.APIToken}`
            }
        });
    } catch (e) {
        await ErrorMessage(`[Axios][Error] ${String(e.errno || e.code)}: ${e.message}`);
        throw new Error();
    };
    const status = requestData.status;
    const data = requestData.data;

    // status != 200
    if (status != 200) {
        try {
            switch (status) {
                case 401:
                    throw new Error('[checklyAPI][Error] 401: 未授权');
                case 403:
                    throw new Error('[checklyAPI][Error] 403: 禁止访问');
                case 404:
                    throw new Error('[checklyAPI][Error] 404: 找不到');
                case 429:
                    throw new Error('[checklyAPI][Error] 429: 请求过多');
                default:
                    throw new Error(`[checklyAPI][Error] ${String(status)}: 未知错误`);
            };
        } catch (e) {
            await ErrorMessage(e.message);
            throw new Error();
        };
    };

    if (data.hasFailures) {
        // 寄了
        await ErrorMessage('[checklyAPI][Info] openit.pw 寄了! 🥳');
        // 修改 App.vue
        try {
            changePage();
        } catch (e) {
            await ErrorMessage(e.message);
        };
        // 移动 ./data/_headers 至 /public/
        fs.cp('./data/_headers', './web/public/_headers', async (e) => {
            if (e) {
                await ErrorMessage(`[fs][Error] copy _headers ${String(e.errno)}: ${e.message}`);
            };
        });
        // 从 yu-steven/openit 拉取数据
        const dFile = async (fileName, fileUrl, filePath) => {
            try {
                await downloadFile(fileUrl, filePath);
                console.log(`[downloadFile][Info] ${fileName} 已下载`);
            } catch (e) {
                await ErrorMessage(`[downloadFile][Error][${fileName}] ${String(e.errno || e.code)}: ${e.message}`);
            };
        };
        await dFile('https', 'https://raw.githubusercontent.com/yu-steven/openit/main/https', './web/public/https');
        await dFile('long', 'https://raw.githubusercontent.com/yu-steven/openit/main/long', './web/public/long');
        await dFile('Quanx.conf', 'https://raw.githubusercontent.com/yu-steven/openit/main/Quanx.conf', './web/public/Quanx.conf');
        await dFile('Clash.yaml', 'https://raw.githubusercontent.com/yu-steven/openit/main/Clash.yaml', './web/public/Clash.yaml');
    } else if (data.hasErrors) {
        // checkly 寄了
        await ErrorMessage('[checklyAPI][Error] 寄! 🤔');
    } else {
        // 还活着
        console.log('[checklyAPI][Info] openit.pw 还活着! 🎉');
    };
};

main();
