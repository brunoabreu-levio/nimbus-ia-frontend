async function invokeClaude() {
    const sourceCode = document.getElementById('sourceCode').value;
    const prompt = document.getElementById('prompt').value;
    const responseField = document.getElementById('response');

    const requestData = {
        source_code: sourceCode,
        prompt: prompt
    };

    try {
        const response = await fetch('https://c4zdfged5i.execute-api.ca-central-1.amazonaws.com/dev/invoke', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        console.log(response);
        if (response.ok) {
            const data = await response.json();
            responseField.value = data.response;
        } else {
            responseField.value = 'Error: ' + response.statusText;
        }
    } catch (error) {
        responseField.value = 'Error: ' + error.message;
    }
}
