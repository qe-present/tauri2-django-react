import React, {useEffect} from 'react';
import './Tbody.css';
import {useDispatch, useSelector} from "react-redux";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getBook} from "../utils/getBook.jsx";
import {listen} from "@tauri-apps/api/event";
import { message } from '@tauri-apps/plugin-dialog';


const Tbody = ({headers, onDelete, onEdit}) => {
    const queryClient = useQueryClient()
    listen('update_book', async () => {
        queryClient.invalidateQueries(['get_book'])
    })
    const {data,isPending,isError,error} = useQuery({
            queryKey: ['get_book'],
            queryFn: getBook
        }
    )
    if (!data) {
        return <tbody className="tbody">
        <tr className="tbody-row">
            <td className="tbody-cell">Loading...</td>
        </tr>
        </tbody>
    }
    return (
        <tbody className="tbody">
        {data.map(item => (
            <tr key={item.id} className="tbody-row">
                {headers.map(header => {
                    if (header.key === 'actions') {
                        return (
                            <td key={header.key} className="tbody-cell">
                                <button className="action-btn delete-btn" onClick={() => onDelete(item.id)}>删除</button>
                                <button className="action-btn" onClick={() => onEdit(item.id)}>编辑</button>
                            </td>
                        );
                    }
                    return (
                        <td key={header.key} className="tbody-cell">
                            {item[header.key]}
                        </td>
                    );
                })}
            </tr>
        ))}
        </tbody>
    );
};

export default Tbody; 