import React, { useState, useEffect } from 'react';
import { getAllWebviewWindows } from '@tauri-apps/api/webviewWindow';
import Input from '../components/Input';
import './Add.css';
import { emit } from '@tauri-apps/api/event';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import {addBook, editBook, getBookById, queryClient} from '../utils/getBook.jsx';
import {message} from "@tauri-apps/plugin-dialog";

const Add = ({ functionName }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 获取书籍数据
    const { data: bookData, isLoading: isBookLoading } = useQuery({
        queryKey: ['get_book_by_id', id],
        queryFn: () => getBookById(id),
        enabled: functionName === 'edit' && !!id, // 仅在编辑模式下启用查询
    });

    // 添加书籍的 mutation
    const addMutation = useMutation({
        mutationFn: (newBook) => addBook(newBook),
        onSuccess: async () => {
            console.log('add book1111');
            emit('update_book'); // 发送更新书籍事件
            setFormData({title: '', author: '', price: ''}); // 重置表单
            handleClose(); // 关闭窗口
            await message('更新数据成功', {title: '添加数据', kind: 'info'});

        },
        onError: (error) => {
            alert('添加失败');
            console.error(error);
        },
    });

    // 编辑书籍的 mutation
    const editMutation = useMutation({
        mutationFn: (updatedBook) => editBook(id,updatedBook),
        onSuccess: async () => {
            queryClient.invalidateQueries(['get_book'])
            await message('更新数据成功', {title: 'Tauri', kind: 'info'});
            navigate('..'); // 返回上一页
        },
        onError: (error) => {
            alert('编辑失败');
            console.error(error);
        },
    });

    // 表单数据
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
    });

    // 填充表单数据
    useEffect(() => {
        if (functionName === 'edit' && bookData) {
            setFormData({
                title: bookData.title,
                author: bookData.author,
                price: bookData.price,
            });
        }
    }, [bookData, functionName]);

    // 关闭窗口
    const handleClose = async () => {
        if (functionName === 'edit') {
            navigate('..');
            return;
        }
        const webviewWindows = await getAllWebviewWindows();
        const addWindow = webviewWindows.find((webviewWindow) => webviewWindow.label === 'add');
        if (addWindow) {
            addWindow.hide();
        }
    };

    // 表单提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (functionName === 'add') {
            addMutation.mutate(formData); // 提交添加书籍的请求
        } else {
            editMutation.mutate(formData); // 提交编辑书籍的请求
        }
    };

    // 表单字段变化
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="add-container">
            <div className="add-form-container">
                <h2 className="add-title">{functionName === 'add' ? '添加书籍' : '修改书籍'}</h2>
                <form onSubmit={handleSubmit} className="add-form">
                    <Input
                        label="书名"
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="请输入书名"
                    />
                    <Input
                        label="作者"
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                        placeholder="请输入作者"
                    />
                    <Input
                        label="价格"
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                        placeholder="请输入价格"
                    />
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={handleClose}>
                            取消
                        </button>
                        <button type="submit" className="submit-btn">
                            {functionName === 'add' ? '添加' : '修改'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Add;