import fs from 'fs';
import axios from 'axios';

/**
 * 下载文件  
 * https://stackoverflow.com/a/64228570
 * @param {String} fileUrl 文件地址
 * @param {String} filePath 保存地址
 */
const downloadFile = async (fileUrl, filePath) => {
    const writer = fs.createWriteStream(filePath);

    return axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream'
    }).then(response => {
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);

            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) resolve(true);
            });
        });
    });
};

/**
 * 不优雅的转义文本
 * @param {String} text 文本
 * @param {String} type ''|(|)|code|pre 默认''
 * @returns {String} 文本
 */
const ECMarkdown = (text, type = '') => {
    if (type == '') {
        return text.replace(/\_/g, '\\_')
            .replace(/\*/g, '\\*')
            .replace(/\[/g, '\\[')
            .replace(/\]/g, '\\]')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)')
            .replace(/\~/g, '\\~')
            .replace(/\`/g, '\\`')
            .replace(/\>/g, '\\>')
            .replace(/\#/g, '\\#')
            .replace(/\+/g, '\\+')
            .replace(/\-/g, '\\-')
            .replace(/\=/g, '\\=')
            .replace(/\|/g, '\\|')
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}')
            .replace(/\./g, '\\.')
            .replace(/\!/g, '\\!');
    } else if (type == '(' || type == ')') {
        return text.replace(/\)/g, '\\)').replace(/\\/g, '\\\\');
    } else if (type == 'code' || type == 'pre') {
        return text.replace(/\`/g, '\\`').replace(/\\/g, '\\\\');
    };
};

export {
    downloadFile,
    ECMarkdown
};