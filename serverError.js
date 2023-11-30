const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/callAPI', async (req, res) => {
    const { method, fetchURL, headers, body } = req.body;

    try {
        let axiosConfig = {
            method,
            url: fetchURL,
            headers: {},
        };

        // Extract headers from the array and set them in axiosConfig
        if (headers && Array.isArray(headers)) {
            headers.forEach(header => {
                if (header.key && header.value) {
                    axiosConfig.headers[header.key] = header.value;
                }
            });
        }

        if (method === 'POST' || method === 'PUT') {
            const parsedBody = JSON.parse(body);
            axiosConfig.data = parsedBody;
        }

        const response = await axios(axiosConfig);

        // Send the entire modified response back to the React app
        res.json(response.data);
    } catch (error) {
        const errorCode = error.response ? error.response.status : 'Not Found';
        const errorMessage = error.response ? error.response.data : error.message;

        res.status(401).json({
            errorCode,
            errorMessage,
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
