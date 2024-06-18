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

async function invokeWithFile(prompt, file) {
    let formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('file', file);

    const response = await fetch(API_URL, {
        method: 'POST',
        body: formData
    });

    return handleResponse(response);
}

async function invokeWithCode(prompt, sourceCode) {
    const requestData = {source_code: sourceCode, prompt: prompt};

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    });

    return handleResponse(response);
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
}

function displayError(field, error) {
    field.value = 'Error: ' + error.message;
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
