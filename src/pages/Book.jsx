import {useEffect, useState} from 'react';
import {invoke} from '@tauri-apps/api/core'
import Theader from '../components/Theader';
import Tbody from '../components/Tbody';
import './Book.css';
import AddButton from "../components/AddButton.jsx";

import {useNavigate} from "react-router";
import {useMutation} from "@tanstack/react-query";
import {deleteBook, queryClient} from "../utils/getBook.jsx";
import {message} from "@tauri-apps/plugin-dialog";
import {useSelector} from "react-redux";

const Book = () => {
    const navigate=useNavigate();
    const deletMutation=useMutation({
        mutationFn:(id)=>deleteBook(id),
        onSuccess:queryClient.invalidateQueries({
            queryKey:['get_book'],
            exact:true
        })
    })
    const handleDeleteBook = async (id) => {
        deletMutation.mutate(id)
        await message( '删除成功', {title: 'Tauri', kind: 'info'})
    };

    const handleEditBook = (id) => {
        navigate(`edit/${id}`)
    };

    const tableHeaders = [
        {key: 'id', label: 'ID'},
        {key: 'title', label: '书名'},
        {key: 'author', label: '作者'},
        {key: 'price', label: '价格'},
        {key: 'actions', label: '操作'}
    ];

    return (
        <div className="book-container">
            <div className="book-header">
                <h1 className="book-title">图书管理系统</h1>
                <AddButton/>
            </div>
            <div className="book-table-container">
                <table className="book-table">
                    <Theader headers={tableHeaders}/>
                    <Tbody
                        headers={tableHeaders}
                        onDelete={handleDeleteBook}
                        onEdit={handleEditBook}
                    />
                </table>
            </div>
        </div>
    );
};

export default Book; 