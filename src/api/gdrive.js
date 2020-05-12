
export function loadApi() {
    const script = document.createElement("script");
    script.src="https://apis.google.com/js/api.js";
}

export async function authenticateApi(authObject) {

    return new Promise ((resolve, reject) => {
        window.gapi.load('client:auth2', () => {
            window.gapi.client.setToken({access_token: authObject.tokenObj.access_token});
            resolve();
        });
    })

    
}


async function getFolderId(folderName) {
    return new Promise((resolve, reject) => {
        window.gapi.client.load('drive', 'v3', () => {
            window.gapi.client.drive.files.list({
                q: `mimeType='application/vnd.google-apps.folder' and name = '${folderName}'`,
                fields: "nextPageToken, files(id, name)"
            }).then(function(response) {
                const files = response.result.files;
                resolve(files[0].id);
                
            });
            
        });
    });
}

export async function getFilesInFolder(folderName) {
    const folderId = await getFolderId(folderName);
    // TODO: currently, max limit is 100 files. either increase limit, or use pagination: https://developers.google.com/drive/api/v2/reference/children/list#javascript
    
    return new Promise((resolve, reject) => {
        window.gapi.client.drive.files.list({
            q: `mimeType != 'application/vnd.google-apps.folder' and '${folderId}' in parents`,
            fields: "nextPageToken, files(id, name)"
        }).then(function(response) {
            resolve(response.result.files);
        });
    });
}

export async function getFileHtml(fileId) {
    return new Promise((resolve, reject) => {
        window.gapi.client.drive.files.export({
            fileId: fileId,
            mimeType: "text/html"
        }).then(function(response) {
            resolve(response.body);
        });
    })
}