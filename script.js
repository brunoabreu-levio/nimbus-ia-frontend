const API_URL = 'https://c4zdfged5i.execute-api.ca-central-1.amazonaws.com/dev/invoke';

async function invokeClaude() {
    const sourceCode = document.getElementById('sourceCode').value;
    const sourceCodeFile = document.getElementById('sourceCodeFile').files[0];
    const prompt = document.getElementById('prompt').value;
    const responseField = document.getElementById('response');

    try {
        const response = sourceCodeFile ? await invokeWithFile(prompt, sourceCodeFile) : await invokeWithCode(prompt, sourceCode);
        displayResponse(responseField, response);
    } catch (error) {
        displayError(responseField, error);
    }
}

async function fetchFromAPI(url, options) {
    try {
        const response = await fetch(url, options);
        return handleResponse(response);
    } catch (error) {
        throw error;
    }
}

async function invokeWithFile(prompt, file) {
    let formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('file', file);

    return fetchFromAPI(API_URL, {
        method: 'POST',
        body: formData
    });
}

async function invokeWithCode(prompt, sourceCode) {
    const requestData = {source_code: sourceCode, prompt: prompt};

    return fetchFromAPI(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    });
}

async function handleResponse(response) {
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('HTTP error: ' + response.statusText);
    }
}

function displayResponse(field, data) {
    field.value = data.response;

    const downloadButton = document.getElementById('downloadBtn');
    downloadButton.disabled = field.value.trim().length === 0
}

function displayError(field, error) {
    field.value = 'Error: ' + error.message;
}

function downloadResponse() {
    const responseText = document.getElementById('response').value;
    const blob = new Blob([responseText], {type: 'text/plain'});
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = "response.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', function () {
    const sourceCodeInput = document.getElementById('sourceCode');
    const sourceCodeFileInput = document.getElementById('sourceCodeFile');

    sourceCodeInput.addEventListener('input', function () {
        sourceCodeFileInput.disabled = sourceCodeInput.value.trim() !== '';
    });

    sourceCodeFileInput.addEventListener('change', function () {
        sourceCodeInput.disabled = sourceCodeFileInput.files.length > 0;
    });
});
