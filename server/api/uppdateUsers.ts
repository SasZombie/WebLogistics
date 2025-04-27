import { defineEventHandler, } from 'h3';  
import axios from 'axios';

export default defineEventHandler(async (event) => {
    const body = await readBody(event); 

    try {
        const response = await axios.post('http://localhost:8000/uppdate-users', {
            prompt: body.prompt
        });

        return response.data;
    } catch (error) {
        console.error("Error calling Python backend:", error);
        return { response: "Sorry, there was an error retrieving the answer." };
    }
});
