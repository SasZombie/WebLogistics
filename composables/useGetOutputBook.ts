import { ref } from 'vue';
import type { Book } from '@/types/book';

export const useGetOutputBook = () => {
    const bookOutput = ref('');
    const formBodyBook = ref<Book>({
        title: '',
        theme1: '',
        theme2: '',
        readingLvl: ''
    });

    const getAllEntriesBook = async () => {
        try {
            const response = await fetch('/api/getAllEntriesBook');
            const data = await response.json();
    
            bookOutput.value = data.message;
        } catch (error) {
            bookOutput.value = 'Failed to fetch output from C++ program.';
            console.error(error);
        }
    };

    const submitFormBook = async () =>{
        try {
            const response = await fetch('/api/addEntryBook',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: formBodyBook.value.title,
                    theme1: formBodyBook.value.theme1,
                    theme2: formBodyBook.value.theme2,
                    readingLvl: formBodyBook.value.readingLvl,
                })
            });
            const data = await response.json();
    
        } catch (error) {
            console.error(error);
        }
    };

    return {
        bookOutput, getAllEntriesBook, submitFormBook, formBodyBook
    };
};
