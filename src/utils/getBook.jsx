import request from "./requests";
import {QueryClient} from "@tanstack/react-query";
export const queryClient = new QueryClient();
export const getBook = async () => {
    let data = await request.get('book/');
    return data.data;
};
export const getBookById = async (id) => {
    let data = await request.get(`book/${id}`);
    return data.data;
}
export const deleteBook = async (id) => {
    let data = await request.delete(`book/${id}`);
    return data.data;
}
export const addBook = async (book) => {
    console.log(book);
    let data = await request.post('book/', book);
    console.log(data);
    return data.data;
}
export const editBook = async (id,book) => {
    let data = await request.put(`book/${id}`, book);
    return data.data;
}