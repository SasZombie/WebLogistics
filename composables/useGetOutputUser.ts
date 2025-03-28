import { ref } from 'vue';
import type { User } from '@/types/user';

export const useGetOutputUser = () => {
    const userOutput = ref('');
    const formBodyUser = ref<User>({
        name: '',
        surrname: '',
        preferedTheme: '',
        readingLvl: ''
    });


    const getAllEntriesUser = async () => {
        try {
            const response = await fetch('/api/getAllEntriesUser');
            const data = await response.json();
    
            userOutput.value = data.message;
        } catch (error) {
            userOutput.value = 'Failed to fetch output from C++ program.';
            console.error(error);
        }
    };


    const submitFormUser = async () =>{
        try {
            const response = await fetch('/api/addEntryUser',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formBodyUser.value.name,
                    surrname: formBodyUser.value.surrname,
                    preferedTheme: formBodyUser.value.preferedTheme,
                    readingLvl: formBodyUser.value.readingLvl,
                })
            });
            const data = await response.json();
    
            userOutput.value = data.message;
        } catch (error) {
            userOutput.value = 'Failed to add.';
            console.error(error);
        }
    };

    return {
        getAllEntriesUser, userOutput, submitFormUser, formBodyUser
    };
};
