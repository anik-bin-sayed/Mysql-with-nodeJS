import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

const API = "http://localhost:3000/api";

const useStore = create((set, get) => ({
  todos: [],
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: false,

  signup: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API}/auth/signup`, {
        username,
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API}/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const res = await axios.get(`${API}/auth/check-auth`, {
        withCredentials: true,
      });
      set({
        user: res.data.user,
        token: Cookies.get("token"),
        isLoading: false,
      });
      return true;
    } catch (err) {
      console.error("Auth check failed:", err);
      set({ user: null, token: "", isLoading: false });
      return false;
    }
  },

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API}/todos`, {
        withCredentials: true,
      });
      set({
        todos: response.data.todos,
        message: "Posts retrieved successfully",
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error retrieving posts",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addTodo: async (title) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API}/todos`,
        { title },
        { withCredentials: true }
      );
      set((state) => ({
        todos: [response.data.todo, ...state.todos],
        message: "Todo created successfully",
        isLoading: false,
      }));
      return response;
    } catch (error) {
      set({
        error: error.response.data.message || "Error retrieving posts",
        isLoading: false,
      });
    }
  },

  toggleTodo: async (id, completed) => {
    try {
      const { token } = get();
      await axios.put(
        `${API}/todos/${id}`,
        { completed },
        { headers: { Authorization: token } }
      );
      get().fetchTodos();
    } catch (err) {
      console.error(err);
    }
  },

  deleteTodo: async (id) => {
    try {
      await axios.delete(`${API}/todos/${id}`, {
        withCredentials: true,
      });
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useStore;
