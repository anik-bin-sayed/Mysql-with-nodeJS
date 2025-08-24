import React, { useEffect, useState } from 'react'


import { IoMdLogOut } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { IoMdCheckbox } from "react-icons/io";

import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import Loading from './Loading';

const Dashboard = () => {
    const [todoText, setTodoText] = useState('');

    const { logout, addTodo, user, fetchTodos, todos, isLoading, deleteTodo, toggleTodo } = useStore();

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

    const handleToggleTodo = async (id, currentStatus) => {
        try {
            const response = await toggleTodo(id, currentStatus === 1 ? 0 : 1);
            toast.success(response.data?.message)
        } catch (error) {
            toast.success(error.response.data?.message)
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    if (isLoading) {
        return <Loading />;
    }


    return (

        <div className=' w-full h-full flex flex-col md:flex-row lg:flex-row flex-wrap gap-10 justify-center mt-10 mb-10'>

            {/* box 1 */}
            <div className='w-96 mx-auto  bg-white shadow-2xl rounded'>
                <div className=" px-3 py-5 flex justify-between border-b">
                    <h1 className='text-2xl font-bold text-blue-950'>Todo App</h1>
                    <div className=' '>
                        <button
                            onClick={handleLogout}
                            className='flex items-center gap-1 justify-center text-md font-semibold text-red-800 cursor-pointer hover:text-blue-800 transition-all'
                        >
                            <p>Logout</p>
                            <IoMdLogOut className='mt-1' />
                        </button>
                    </div>

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
                        <button type="submit" className='bg-blue-950 text-white rounded p-2 mt-2 cursor-pointer hover:bg-blue-900 transition ml-2'>
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
                <div className="px-3 py-5 flex justify-between border-b">
                    <h1 className='text-2xl font-bold'>Todo List</h1>
                    <div>
                        <p className="text-gray-600 opacity-50">
                            Total todo: {Array.isArray(todos) ? todos.length : 0}
                        </p>
                        <p className="text-gray-600 opacity-50">
                            Completed todo: {Array.isArray(todos) ? todos.filter(todo => todo?.completed == 1 || todo?.completed === true).length : 0}
                        </p>
                    </div>
                </div>
                <div className='mt-4 h-[400px] overflow-y-auto '>
                    {Array.isArray(todos) && todos.length > 0 ? (
                        todos.map((todo, index) => (
                            <div key={index} className='mx-2'>
                                <div className={`bg-blue-950 text-white rounded p-2 mt-2 cursor-pointer hover:bg-blue-900 transition w-full ${todo?.completed == 1 ? 'line-through' : ''}`}>
                                    {todo?.title}
                                </div>
                                <div className="flex justify-center items-center px-2 py-1 gap-4 bg-gray-100">
                                    <button
                                        onClick={() => handleDeleteTodo(todo.id)}
                                        className="text-red-500 cursor-pointer hover:underline transition"
                                    >
                                        Delete task
                                        {/* <MdDelete /> */}
                                    </button>
                                    <button
                                        onClick={() => handleToggleTodo(todo.id, todo.completed)}
                                        className="text-blue-500 cursor-pointer hover:underline transition"
                                    >
                                        {todo?.completed === 0 ? (
                                            // <MdOutlineCheckBoxOutlineBlank />
                                            'Mark as completed'
                                        ) : (
                                            // <IoMdCheckbox />
                                            'Mark as uncompleted'
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No todos found</p>
                    )}



                </div>
            </div>
        </div>


    )
}

export default Dashboard