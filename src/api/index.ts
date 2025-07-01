import axios from "axios";
// const baseURL = "http://";
const baseURL = "http://127.0.0.1";

// 创建axios实例
const request = axios.create({
  baseURL: baseURL,
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
let port = ":8791";

// 新闻相关API
export const newsApi = {
  // 获取新闻列表
  getNewsList: (data) => {
    return request.post(port + "/news/list", data);
  },

  // 获取新闻详情
  getNewsDetail: (id: number) => {
    return request.post(port + `/news/detail?id=${id}`);
  },

  // 搜索新闻
  searchNews: (data) => {
    return request.post(port + "/news/cond", data);
  },
};
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

  getUserPost: (id: number) => {
    return request.post(port + `/post/userPost?uid=${id}`);
  },  

  // 发布帖子
  createPost: (data) => {
    return request.post(port + "/post/create", data);
  },

  // 更新帖子
  updatePost: (data) => {
    return request.post(port + "/post/update", data);
  },

  // 删除帖子
  deletePost: (id: number) => {
    return request.post(port + `/post/delete?postId=${id}`);
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
    return request.post(port + `/comment/delComment?id=${id}`);
  },
};

let port2 = ":8691";

// 文件相关api
export const fileApi = {
  upload: (file) => {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: baseURL + port2 + "/oss/upload",
        filePath: file,
        name: "file",
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(res.data));
          } else {
            reject(new Error("上传失败"));
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  },
  download: (fileName) =>
    request({
      url: port2 + "/oss/download",
      method: "get",
      params: { fileName },
      responseType: "blob",
    }),
};

export const studyApi = {
  // 查询学习资源
  query: (data) => {
    return request.post(port2 + "/study/query", data);
  },
};

// 院校接口
export const schoolApi = {
  condQuery: (data) => {
    return request.post(port2 + "/univ/condQuery", data);
  },
  getDetail: (id: number) => {
    return request.post(port2 + `/univ/getById?id=${id}`);
  },
};

export const majorApi = {
  condQuery: (data) => {
    return request.post(port2 + "/major/condQuery", data);
  }
}

let port3 = ":8591"

// 群聊接口
export const chatApi = {  
  // 创建群聊
  createGroup: (data) => {
    return request.post(port3 + "/chat/group/create", data);
  },
  // 查询群聊信息
  getDetail: (id: number) => {
    return request.post(port3 + `/chat/group/detail?gid=${id}`);
  },
  // 搜索群聊
  queryGroup: (data) => {
    return request.post(port3 + "/chat/group/query", data);
  },
  // 更新群聊信息
  updateGroup: (data) => {
    return request.post(port3 + "/chat/group/update", data);
  },
  // 删除群聊
  delGroup: (id: number) => {
    return request.post(port3 + `/chat/group/delete?gid=${id}`);
  },
  // 加入群聊
  joinGroup: (data) => {
    return request.post(port3 + "/chat/list/join", data);
  },
  // 退出群聊
  leaveGroup: (data) => {
    return request.post(port3 + "/chat/list/leave", data);
  },
  // 获取用户群聊列表
  getUserGroupList: (id: number) => {
    return request.post(port3 + `/chat/list/user?uid=${id}`);
  },
  // 发送群聊消息
  sendMsg: (data) => {
    return request.post(port3 + "/chat/msg/send", data);
  },
  // 查询群聊信息
  getGroupMsgs: (id: number) => {
    return request.post(port3 + `/chat/msg/list?gid=${id}`);
  },
}


let port4 = ":8891"

// 用户相关API
export const userApi = {
  // 获取用户详细信息
  getUserDetail: (userId: string) => {
    return request.get(`/user/detail/${userId}`);
  },

  batchGetUserDetail: (data) => {
    return request.post(port4 + "/user/batchUsers", data);
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
  fileApi,
  studyApi,
  schoolApi,
  chatApi,
};
