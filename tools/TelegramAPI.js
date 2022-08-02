import qs from 'qs';
import axios from 'axios';

class TelegramAPI {
    /**
     * 初始化
     * @param {String} token Telegram bot token
     */
    constructor(token) {
        this.api = axios.create({
            baseURL: `https://api.telegram.org/bot${token}/`
        });
    };

    /**
     * SendMessage
     * @param {String|Number} chat_id 聊天 ID
     * @param {String} text 文本
     * @param {String} parse_mode (选)解析模式
     * @returns {Promise<JSON>} Data
     */
    async sendMessage(chat_id, text, parse_mode = 'MarkdownV2') {
        try {
            const respData = await this.api.post('sendMessage', qs.stringify({
                chat_id: String(chat_id),
                text,
                parse_mode
            }));

            return Promise.resolve(respData.data.result);
        } catch (e) {
            return Promise.reject({
                e,
                message: `[Axios - TelegramAPI][Error] ${e.errno || e.code}: ${e.message}`
            });
        };
    };
};

export default TelegramAPI;