import axios from "axios";
import { url } from "hexo/dist/hexo/default_config";

// 创建axios实例
const request = axios.create({
  baseURL: "http://127.0.0.1", // 替换为实际的API基础URL
  timeout: 30000, // 请求超时时间
  adapter: (config) => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: config.baseURL + config.url,
        method: config.method?.toUpperCase() as any,
        data: config.data,
        header: config.headers,
        timeout: config.timeout,
        success: (res) => {
          resolve({
            data: res.data,
            status: res.statusCode,
            statusText: res.errMsg,
            headers: res.header,
            config,
          });
        },
        fail: (err) => {
          reject({
            config,
            response: null,
            message: err.errMsg,
          });
        },
      });
    });
  },
});

// // 请求拦截器
// request.interceptors.request.use(
//   (config) => {
//     // 从本地存储获取token
//     const token = uni.getStorageSync("token");
//     // 如果有token，添加到请求头中
//     if (token) {
//       config.headers = config.headers || {};
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一处理错误
    uni.showToast({
      title: error.message || "请求失败",
      icon: "none",
    });
    return Promise.reject(error);
  }
);

// 新闻相关API
export const newsApi = {
  // 获取新闻列表
  getNewsList: (params: {
    category?: string;
    page?: number;
    pageSize?: number;
  }) => {
    return request.get("/news/list", { params });
  },

  // 获取新闻详情
  getNewsDetail: (id: string) => {
    return request.get(`/news/detail/${id}`);
  },

  // 搜索新闻
  searchNews: (keyword: string) => {
    return request.get("/news/search", { params: { keyword } });
  },
};
let port = ":8791";
// 帖子相关API
export const postApi = {
  // 获取帖子列表
  getPostList: (data) => {
    return request({
      url: port + "/post/list",
      method: "post",
      data,
    });
  },

  condQuery: (data) => {
    return request({
      url: port + "/post/cond",
      method: "post",
      data,
    });
  },

  // 获取帖子详情
  getPostDetail: (postId: number) => {
    return request.post(port + `/post/detail?postId=${postId}`);
  },
  // 发布帖子
  createPost: (data) => {
    return request.post("/post/create", data);
  },

  // 更新帖子
  updatePost: (
    id: string,
    data: {
      title?: string;
      content?: string;
      category?: string;
      images?: string[];
    }
  ) => {
    return request.put(`/post/update/${id}`, data);
  },

  // 删除帖子
  deletePost: (id: string) => {
    return request.delete(`/post/delete/${id}`);
  },
};

export const commentApi = {
  // 查询评论信息
  commentList: (postId: number) => {
    return request.post(port + `/comment/comments?postId=${postId}`);
  },
  // 创建评论
  createComment: (data) => {
    return request.post(port + "/comment/createComment", data);
  },
  delete: (id: number) => {
    return request.post(post + `/comment/delComment?id=${id}`)
  },
}

// 用户相关API
export const userApi = {
  // 获取用户详细信息
  getUserDetail: (userId: string) => {
    return request.get(`/user/detail/${userId}`);
  },

  // 更新用户资料
  updateUserProfile: (data: {
    nickname?: string;
    bio?: string;
    gender?: number;
    birthday?: string;
    location?: string;
  }) => {
    return request.put("/user/profile", data);
  },

  // 上传用户头像
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return request.post("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 获取用户统计信息
  getUserStats: (userId: string) => {
    return request.get(`/user/stats/${userId}`);
  },
};

// 用户认证相关API
export const authApi = {
  // 用户注册
  register: (data: { username: string; password: string; email: string }) => {
    return request.post("/auth/register", data);
  },

  // 账号密码登录
  login: async (data: { username: string; password: string }) => {
    try {
      const response = await request.post("/auth/login", data);
      // 保存token
      if (response.token) {
        uni.setStorageSync("token", response.token);
      }
      return response;
    } catch (error) {
      uni.showToast({
        title: error.message || "登录失败",
        icon: "none",
      });
      return Promise.reject(error);
    }
  },

  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }) => {
    return request.post("/auth/change-password", data);
  },

  // 获取用户信息
  getUserInfo: () => {
    return request.get("/auth/user-info");
  },

  // 微信登录
  wxLogin: async () => {
    try {
      // 调用微信登录
      const loginRes = await uni.login();
      if (!loginRes.code) {
        throw new Error("微信登录失败");
      }

      // 获取用户信息
      const userInfoRes = await uni.getUserProfile({
        desc: "用于完善用户资料",
      });

      // 发送登录请求到后端
      const response = await request.post("/auth/wx-login", {
        code: loginRes.code,
        userInfo: userInfoRes.userInfo,
      });

      // 保存token
      if (response.token) {
        uni.setStorageSync("token", response.token);
      }

      return response;
    } catch (error) {
      uni.showToast({
        title: error.message || "登录失败",
        icon: "none",
      });
      return Promise.reject(error);
    }
  },

  // 检查登录状态
  checkLoginStatus: () => {
    const token = uni.getStorageSync("token");
    return request.get("/auth/check-status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // 退出登录
  logout: () => {
    uni.removeStorageSync("token");
    return request.post("/auth/logout");
  },
};

export default {
  newsApi,
  postApi,
  authApi,
  userApi,
  commentApi,
};
