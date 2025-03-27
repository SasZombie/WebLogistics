import { ref } from 'vue';


export const useGetOutput = () => {
    const cppOutput = ref('');
    const formBody = ref({
        title: '',
        theme1: '',
        theme2: '',
        readingLvl: ''
    });
    const fetchCppOutput = async () => {
        try {
            const response = await fetch('/api/getAllEntriesBook');
            const data = await response.json();
    
            cppOutput.value = data.message;
        } catch (error) {
            cppOutput.value = 'Failed to fetch output from C++ program.';
            console.error(error);
        }
    };

    const submitForm = async () =>{
        try {
            const response = await fetch('/api/addEntryBook',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: formBody.value.title,
                    theme1: formBody.value.theme1,
                    theme2: formBody.value.theme2,
                    readingLvl: formBody.value.readingLvl,
                })
            });
            const data = await response.json();
    
            cppOutput.value = data.message;
        } catch (error) {
            cppOutput.value = 'Failed to add.';
            console.error(error);
        }
    };

    return {
        cppOutput, fetchCppOutput, submitForm, formBody
    };
};
