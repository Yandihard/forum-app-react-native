import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://forum-api.dicoding.dev/v1';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Register user
 */
async function register({ name, email, password }: any) {
  const response: any = await axiosInstance.post('/register', {
    name,
    email,
    password,
  });
  return response.data.user;
}

/**
 * Login user
 */
async function login({ email, password }: any) {
  const response: any = await axiosInstance.post('/login', {
    email,
    password,
  });
  return response.data.token;
}

/**
 * Get own profile
 */
async function getOwnProfile() {
  const response: any = await axiosInstance.get('/users/me');
  return response.data.user;
}

/**
 * CREATE THREAD
 */
async function createThread({ title, body, category }: any) {
  const response: any = await axiosInstance.post('/threads', {
    title,
    body,
    category,
  });
  return response.data.thread;
}

/**
 * GET ALL THREADS
 */
async function getAllThreads() {
  const response: any = await axiosInstance.get('/threads');
  return response.data.threads;
}

/**
 * GET ALL USERS
 */
async function getAllUsers() {
  const response: any = await axiosInstance.get('/users');
  return response.data.users;
}

/**
 * GET DETAIL THREAD
 */
async function getDetailThread(threadId: string) {
  const response: any = await axiosInstance.get(`/threads/${threadId}`);
  return response.data.detailThread;
}

async function upVoteThread(threadId: string) {
  const response: any = await axiosInstance.post(`/threads/${threadId}/up-vote`);
  return response.data.vote;
}

async function downVoteThread(threadId: string) {
  const response: any = await axiosInstance.post(`/threads/${threadId}/down-vote`);
  return response.data.vote;
}

async function neutralVoteThread(threadId: string) {
  const response: any = await axiosInstance.post(`/threads/${threadId}/neutral-vote`);
  return response.data.vote;
}

async function getLeaderboards() {
  const response: any = await axiosInstance.get('/leaderboards');
  return response.data.leaderboards;
}

async function upVoteComment({ threadId, commentId }: { threadId: string, commentId: string }) {
  const response: any = await axiosInstance.post(`/threads/${threadId}/comments/${commentId}/up-vote`);
  return response.data.vote;
}

async function downVoteComment({ threadId, commentId }: { threadId: string, commentId: string }) {
  const response: any = await axiosInstance.post(`/threads/${threadId}/comments/${commentId}/down-vote`);
  return response.data.vote;
}

async function neutralVoteComment({ threadId, commentId }: { threadId: string, commentId: string }) {
  const response: any = await axiosInstance.post(`/threads/${threadId}/comments/${commentId}/neutral-vote`);
  return response.data.vote;
}

async function createComment({ threadId, content }: { threadId: string, content: string }) {
  const response: any = await axiosInstance.post(`/threads/${threadId}/comments`, {
    content,
  });
  return response.data.comment;
}

/**
 * Simpan token ke AsyncStorage
 */
async function putAccessToken(token: string) {
  await AsyncStorage.setItem('accessToken', token);
}

/**
 * Hapus token dari AsyncStorage
 */
async function clearAccessToken() {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('userProfile');
}

/**
 * Ambil token dari AsyncStorage
 */
async function getAccessToken() {
  return await AsyncStorage.getItem('accessToken');
}

async function putUserProfile(user: any) {
  await AsyncStorage.setItem('userProfile', JSON.stringify(user));
}

async function getUserProfile() {
  const user = await AsyncStorage.getItem('userProfile');
  return user ? JSON.parse(user) : null;
}

export {
  getLeaderboards,
  getAllUsers,
  register,
  login,
  getOwnProfile,
  putAccessToken,
  getAccessToken,
  clearAccessToken,
  putUserProfile,
  getUserProfile,
  createThread,
  getAllThreads,
  getDetailThread,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
  createComment
};
