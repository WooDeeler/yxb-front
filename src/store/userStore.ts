import { defineStore } from "pinia";

interface UserBasic {
  uid: number;
  username: string;
  avatar: string;
  // 根据你的实际需求添加更多用户信息字段
}

export const useUserStore = defineStore("user", {
  state: () => ({
    userBasic: {
      uid: 27,
      username: "一研为定",
      avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/myav.svg",
    } as UserBasic | null,
  }),
  actions: {
    setUser(user: UserBasic) {
      this.userBasic = user;
    },
    clearUser() {
      this.userBasic = null;
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.userBasic,
    getUserInfo: (state) => state.userBasic,
  },
});
