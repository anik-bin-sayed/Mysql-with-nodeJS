import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { IoMdLogOut } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";

import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import Loading from './Loading';

const Dashboard = () => {
    const navigate = useNavigate();
    const [todoText, setTodoText] = useState('');
    const { logout, addTodo, user, fetchTodos, todos, isLoading, deleteTodo } = useStore();

    const handleAddTodo = async (event) => {
        event.preventDefault();

        if (!todoText) return;

        try {
            const response = await addTodo(todoText); // একবারই call
            setTodoText('');
            toast.success(response.data?.message || "Todo added successfully!");
            await fetchTodos();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add todo");
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id);
            toast.success("Todo deleted successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete todo");
        }
    }

    const handleLogout = () => {
        logout()
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    if (isLoading) {
        return <Loading />;
    }


    return (
        <>

            <div className=' w-full h-[100vh] flex   flex-col md:flex-row gap-5 p-5'>

                {/* box 1 */}
                <div className='w-96 mx-auto  bg-white shadow-2xl rounded'>
                    <div className=" px-3 py-5 flex justify-between border-b">
                        <h1 className='text-2xl font-bold text-blue-950'>Todo</h1>
                        <button
                            onClick={handleLogout}
                            className='hover:text-gray-700 w-6 h-6 flex items-center justify-center cursor-pointer text-red-800'>
                            <IoMdLogOut className='text-xl' />
                        </button>
                    </div>
                    <div className='mt-4'>
                        <form onSubmit={handleAddTodo}>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={todoText}
                                    onChange={(e) => setTodoText(e.target.value)}
                                    placeholder="Add a new todo"
                                    className="border-b border-gray-300 p-2 w-full outline-0"
                                />
                                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-blue-950 transition-all duration-300 ease-out pointer-events-none input-focus-span"></span>
                            </div>
                            <button type="submit" className='bg-blue-950 text-white rounded p-2 mt-2 cursor-pointer hover:bg-blue-900 transition w-full'>
                                Add Todo</button>
                        </form>

                        <div className='mt-5 pl-2 mb-10'>
                            <h2 className='text-xl font-medium'>User info:</h2>
                            <div className='mt-2'>
                                <p className='text-gray-600'>
                                    Name: {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase() : 'Guest'}
                                </p>
                                <p className='text-gray-600'>Email: {user && user.email ? user.email : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* box 2 */}
                <div className='w-96 mx-auto bg-white shadow-2xl rounded'>
                    <div className=" px-3 py-5 flex justify-between border-b">
                        <h1 className='text-2xl font-bold'>Todo List</h1>

                    </div>
                    <div className='mt-4 h-[400px] overflow-y-auto '>
                        {todos && todos.length > 0 ? (
                            todos.map((todo, index) => (
                                <div key={index}>
                                    <div className="border-b border-gray-300 py-1 bg-gray-400 w-full">
                                        <p className="text-gray-800 px-2">{todo?.title}</p>

                                    </div>
                                    <div className="flex justify-center items-center px-2 py-1 gap-3">
                                        <button
                                            onClick={() => handleDeleteTodo(todo.id)}
                                            className='text-red-500 cursor-pointer'><MdDelete /></button>
                                        <button className='text-blue-500'><MdOutlineCheckBoxOutlineBlank /></button>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <p className="text-gray-500">No todos found</p>
                        )}


                    </div>
                </div>
            </div>

        </>
    )
}

export default Dashboard