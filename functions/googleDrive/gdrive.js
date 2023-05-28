const { google } = require('googleapis')

class GoogleDriveApi {
    constructor(access_token, refresh_token, expires_at) {
        const authClient = new google.auth.OAuth2();
        authClient.setCredentials({access_token: access_token, refresh_token: refresh_token, expiry_date: expires_at});
        this.drive = google.drive({version: 'v3', auth: authClient});
    }

     async getFolderId(folderName) {
         return new Promise((resolve, reject) => {
                 this.drive.files.list({
                     q: `mimeType='application/vnd.google-apps.folder' and name = '${folderName}'`,
                     fields: "nextPageToken, files(id, name)"
                 }).then(function(response) {
                     console.log("getFolderId Response:")
                     console.log(response.data.files)
                     const files = response.data.files;
                     resolve(files[0].id);
                 });

         });
    }

    // timestampLastUpdated: only fetch files created/modfied past this UNIX timestamp, or -1 to fetch all
    async getFilesInFolder(folderName, timestampLastUpdated) {
        const folderId = await this.getFolderId(folderName);

        let timestampQueryString = '';
        if (timestampLastUpdated !== -1) {
            const rfcTimestamp = new Date(timestampLastUpdated * 1000).toISOString();
            timestampQueryString = ` and modifiedTime >= '${rfcTimestamp}'`;
        }

        return new Promise((resolve, reject) => {
            this.drive.files.list({
                q: `mimeType != 'application/vnd.google-apps.folder' and '${folderId}' in parents ${timestampQueryString}`,
                fields: "nextPageToken, files(id, name)",
                pageSize: 500
            }).then(function(response) {
                resolve(response.data.files);
            });
        });
    }

    async getFileHtmlAux(fileId) {
        return new Promise(async (resolve, reject) => {

            try {
                const res = await this.drive.files.export({
                    fileId: fileId,
                    mimeType: "text/html"
                });
                resolve(res.data);
            } catch(err) {
                reject(err);
            }


        });
    }

    //download file html, with exponential backoff to prevent rate-limiting
    getFileHtml(fileId) {
        const pause = (durationSeconds) => new Promise(res => setTimeout(res, durationSeconds * 1000));

        // const getFileHtmlAux = this.getFileHtmlAux;

        return new Promise((resolve, reject) => {
            const download = (fileId, waitTime) => {

                this.getFileHtmlAux(fileId)
                    .then((html) => {
                        resolve(html);
                    })
                    .catch((err) => {
                        if (err.status === 403) {
                            pause(1).then(() => {
                                const randOffset = Math.random() * 1000
                                const newWaitTime = Math.min(5, waitTime*2 + randOffset);
                                download(fileId, newWaitTime);
                            })
                        } else {
                            reject(err)
                        }
                    })
            };
            download(fileId, 1);
        });
    }


    async getAllFilesHtml(fileList, progressCallback) {

        const maxFiles = fileList.length;
        //const maxFiles = 5;

        return new Promise(async (resolve, reject) => {

            let responseList = [];

            let promiseList = [];

            for (let i = 0; i < fileList.length && i < maxFiles; i++) {
                console.log("In getAllFilesHTML, i = " + i)

                let promise = new Promise((resolve, reject) => {
                    this.getFileHtml(fileList[i].id)
                        .then((html) => {

                            const fileObject = {
                                name: fileList[i].name,
                                html: html
                            }

                            responseList.push(fileObject);

                            progressCallback(responseList.length / maxFiles * 100, fileObject);
                            resolve();
                        });
                })



                promiseList.push(promise);

            }

            await Promise.all(promiseList);

            /* Once all requests have finished, resolves. */
            resolve(responseList);

        })


    }

}

module.exports = {
    GoogleDriveApi
}










