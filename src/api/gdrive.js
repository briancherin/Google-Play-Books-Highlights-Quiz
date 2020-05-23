import async from 'async';


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
            fields: "nextPageToken, files(id, name)",
            pageSize: 500
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

export async function getAllFilesHtml(fileList, progressCallback) {

    const maxFiles = fileList.length;

    return new Promise(async (resolve, reject) => {

        let responseList = [];

        for (var i = 0; i < fileList.length && i < maxFiles; i++) {
            responseList.push({
                name: fileList[i].name,
                html: await getFileHtml(fileList[i].id)
            });
            progressCallback(i / fileList.length * 100);
        }

        resolve(responseList);

    })

   
}

/*  Using a batch Google Drive API call to download the files 

    @param fileIdList   list of file objects from which to download the html for
                        file object: {name: <string>, id: <string>}
    @param progressCallback     Function which takes one argument, the current percentage (0 to 100) of progress
    @return list where each element is an object containing the file's name and its html string
                            object: {name: <string>, html: <string>}
 */
export async function getAllFilesHtmlWithBatchRequest(fileList, progressCallback) {

    const maxFiles = fileList.length;
    //const maxFiles = 5;

    return new Promise((resolve, reject) => {

        const batch = window.gapi.client.newBatch();
        let responseList = [];

        for (var i = 0; i < fileList.length && i < maxFiles; i++) {
            const { name, id } = fileList[i];

            batch.add(
                window.gapi.client.drive.files.export({
                    fileId: id,
                    mimeType: "text/html"
                }), {callback: function (response) {    //Callback called individually for each file downloaded
                    responseList.push({name: name, html: response.result});
                    console.log("responseList.length = " + responseList.length)
                    progressCallback(responseList.length / fileList.length * 100);
                }}
            );
        }


        batch.execute(() => {
            resolve(responseList);
        });        
    })

    

}