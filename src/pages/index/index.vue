<template>
  <view class="container">
    <!-- 微信授权登录弹窗 -->
    <view v-if="showLoginModal" class="login-modal-overlay">
      <view class="login-modal-content">
        <text class="modal-title">登录研习宝</text>
        <text class="modal-subtitle">获取更完整的服务体验</text>
        <button class="authorize-button" @click="handleAuthorizeLogin">
          <uni-icons type="weixin" size="20" color="#fff"></uni-icons>
          <text>微信一键登录</text>
        </button>
        <button class="skip-button" @click="handleSkipLogin">暂不登录</button>
      </view>
    </view>
    <!-- 加载动画 -->
    <uni-load-more
      v-if="loading"
      status="loading"
      :icon-size="16"
      :content-text="{
        contentdown: '上拉显示更多',
        contentrefresh: '正在加载...',
        contentnomore: '没有更多数据了',
      }"
    />

    <view class="header-section">
      <view class="nav-bar">
        <view @click="navigateToSearchPage">
          <uni-search-bar
            placeholder="搜索考研经验、资料、问答"
            radius="40"
            clearButton="auto"
          />
        </view>
        <view class="post-button" @click="navigateToPostPage">
          <uni-icons type="plus" color="#fff" size="15" />
          <text style="color: #fff; font-size: 24rpx">发帖</text>
        </view>
      </view>

      <!-- 分类栏 -->
      <scroll-view class="category-bar" scroll-x="true">
        <view
          v-for="(category, index) in categories"
          :key="index"
          class="category-item"
          :class="{ active: currentCategory === index }"
          @click="handleCategoryClick(index)"
        >
          {{ category }}
        </view>
      </scroll-view>
    </view>

    <!-- 热门话题 -->
    <!-- <view class="hot-topics">
      <view class="section-title">
        <uni-icons type="fire" size="20" color="#ff0000" />
        <text>热门话题</text>
      </view>
      <view class="topic-tags">
        <view class="topic-tag" v-for="(tag, index) in hotTopics" :key="index">
          #{{ tag }}
        </view>
      </view>
    </view> -->
    <view class="scrolling-announcement">
      <scroll-view scroll-x="true" class="announcement-bar">
        <view
          class="announcement-item"
          v-for="(announcement, index) in announcements"
          :key="index"
        >
          {{ announcement }}
        </view>
      </scroll-view>
    </view>
    <view class="post-list">
      <view
        v-for="(post, index) in posts"
        :key="index"
        class="post-item"
        @click="navigateToPostDetail(post)"
      >
        <view class="post-header">
          <image class="avatar" :src="post.avatar" mode="aspectFill"></image>
          <view class="user-info">
            <view class="user-basic">
              <text class="username">{{ post.username }}</text>
              <text class="university">{{ post.userUniversity }}</text>
            </view>
            <view class="post-tags" v-if="post.tags && post.tags.length > 0">
              <text class="tag">{{ post.tags }}</text>
            </view>
          </view>
        </view>
        <view class="post-content">
          <text class="title">{{ post.title }}</text>
          <text class="content">{{ post.content }}</text>
          <view
            class="post-images"
            v-if="post.imageList && post.imageList.length > 0"
          >
            <image
              v-for="(img, idx) in post.imageList.slice(0, 3)"
              :key="idx"
              :src="img"
              mode="aspectFill"
              class="post-image"
              @click="previewImage(post.imageList, idx)"
            />
          </view>
        </view>
        <view class="post-footer">
          <view class="actions-left">
            <view class="action-item">
              <uni-icons type="chat" size="20"></uni-icons>
              <!-- <text>{{ post.comments }}</text> -->
            </view>
            <view class="action-item" @click.stop="toggleLike(index)">
              <uni-icons
                :type="post.isLiked ? 'heart-filled' : 'heart'"
                size="20"
                :color="post.isLiked ? '#ff0000' : '#000000'"
              ></uni-icons>
              <text>{{ post.likes }}</text>
            </view>
          </view>
          <view class="location">
            <text>{{ post.location }}</text>
            <text>{{ post.updateTime }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  onShow,
  onLoad,
  onReachBottom,
  onPullDownRefresh,
} from "@dcloudio/uni-app";
import { postApi } from "@/api";

interface Post {
  id: number;
  avatar: string;
  username: string;
  userUniversity: string;
  updateTime: string;
  title: string;
  content: string;
  likes: number;
  isLiked: boolean;
  imageList?: string[];
  location: string;
  tags?: string[];
  comments: 0;
}

const showLoginModal = ref(false);
const isLoggedIn = ref(false);

const currentCategory = ref(0);
const loading = ref(false);
const page = ref(1);
const size = ref(10);

const categories = ["推荐", "难题问答", "考研新闻", "资料下载"];

const hotTopics = ["考研英语", "数学真题", "调剂信息", "院校选择"];

const announcements = ["🎉欢迎来到研习宝！", "分享最新的考研经验和资料。"];

const posts = ref<Post[]>([
  {
    id: 1,
    avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/THU.svg",
    username: "考研人加油",
    userUniversity: "清华大学",
    updateTime: "2024-01-20",
    title: "分享我的考研复习时间规划，建议收藏！",
    content:
      "大家好，我是24考研备考的同学，这里分享一下我的复习计划和时间安排。数学每天4小时，英语2小时，专业课3小时...",
    likes: 128,
    isLiked: false,
    imageList: [
      "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/post-2.png",
      "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/post-3.png",
    ],
    location: "北京",
    tags: "考研规划",
  },
  {
    id: 2,
    avatar: "/static/logo.png",
    username: "英语学姐",
    userUniversity: "北京外国语大学",
    updateTime: "2024-01-20",
    title: "考研英语长难句解析技巧",
    content:
      "今天给大家分享几个实用的长难句解析方法，让你轻松应对考研英语阅读理解...",
    likes: 96,
    isLiked: false,
    imageList: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
    location: "北京",
    tags: "英语学习",
  },
  {
    id: 3,
    avatar: "/static/logo.png",
    username: "数学大神",
    userUniversity: "北京大学",
    updateTime: "2024-01-20",
    title: "考研数学高频考点整理",
    content:
      "整理了最近五年考研数学的高频考点，包括微积分、线性代数、概率论重要知识点...",
    likes: 215,
    isLiked: false,
    imageList: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
    location: "北京",
    tags: "数学",
  },
  {
    id: 4,
    avatar: "/static/logo.png",
    username: "政治小帮手",
    userUniversity: "中国人民大学",
    updateTime: "2024-01-20",
    title: "2024考研政治大纲变化解析",
    content: "最新的考研政治大纲已经公布，本文详细分析了变化内容和复习建议...",
    likes: 342,
    isLiked: false,
    imageList: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
    location: "北京",
    tags: "政治",
  },
  {
    id: 5,
    avatar: "/static/logo.png",
    username: "计科老学长",
    userUniversity: "浙江大学",
    updateTime: "2024-01-20",
    title: "计算机专业课408复习经验",
    content:
      "分享一下408四门课程的复习方法和重点内容，希望对计算机考研的同学有帮助...",
    likes: 167,
    isLiked: false,
    imageList: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
    location: "浙江",
    tags: "经验分享",
  },
  {
    id: 6,
    avatar: "/static/logo.png",
    username: "考研规划师",
    userUniversity: "复旦大学",
    updateTime: "2024-01-20",
    title: "暑假考研复习如何规划？",
    content:
      "暑假是考研复习的黄金时期，如何合理安排时间和调整状态？这里有详细的建议...",
    likes: 245,
    isLiked: false,
    imageList: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
    location: "上海",
    tags: "暑假规划",
  },
]);

const router = useRouter();

const navigateToSearchPage = () => {
  uni.navigateTo({ url: "/pages/searchPage/index" });
};

const navigateToPostPage = () => {
  uni.navigateTo({ url: "/pages/postPage/index" });
};

const navigateToPostDetail = (post: Post) => {
  uni.navigateTo({ url: `/pages/postDetail/index?id=${post.id}` });
};

// 加载帖子列表数据
const loadPosts = async (isRefresh = false) => {
  loading.value = true;
  try {
    // 如果未登录且非跳过登录，则不加载帖子
    if (!isLoggedIn.value && showLoginModal.value) {
      loading.value = false;
      return;
    }
    const response = await postApi.getPostList({
      page: isRefresh ? 1 : page.value++,
      size: size.value,
    });

    let newPosts = [];
    if (!response.data || response.data.length === 0) {
      // 如果接口返回空数据，使用示例数据
      newPosts = posts.value.map((post) => ({
        ...post,
        updateTime: `${new Date().getFullYear()}-${String(
          new Date().getMonth() + 1
        ).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`,
        comments: post.comments,
      }));
    } else {
      newPosts = response.data.list.map((post) => ({
        ...post,
        updateTime: `${new Date(post.updateTime).getFullYear()}-${String(
          new Date(post.updateTime).getMonth() + 1
        ).padStart(2, "0")}-${String(
          new Date(post.updateTime).getDate()
        ).padStart(2, "0")}`,
        comments: post.comments,
      }));
    }

    posts.value = isRefresh ? newPosts : [...posts.value, ...newPosts];
  } finally {
    loading.value = false;
  }
};

// 下拉刷新
onPullDownRefresh(() => {
  page.value = 1;
  loadPosts(true);
  uni.stopPullDownRefresh();
});

// 页面加载时获取数据
onLoad(async () => {
  // 检查本地存储的登录状态
  try {
    const storedLoginStatus = uni.getStorageSync("isLoggedIn");
    if (storedLoginStatus) {
      isLoggedIn.value = true;
      await loadPosts(true); // 已登录，直接加载数据
    } else {
      showLoginModal.value = true; // 未登录，显示登录弹窗
    }
  } catch (e) {
    console.error("Failed to get login status from storage:", e);
    showLoginModal.value = true; // 发生错误时也显示登录弹窗
  }
});

const handleAuthorizeLogin = async () => {
  try {
    // @ts-ignore
    const loginRes = await uni.login({ provider: "weixin" });
    if (loginRes.errMsg === "login:ok") {
      console.log("微信登录凭证:", loginRes.code);
      uni.setStorageSync("isLoggedIn", true);
      isLoggedIn.value = true;
      showLoginModal.value = false;
      await loadPosts(true); 
      uni.showToast({ title: "登录成功", icon: "success" });
    } else {
      uni.showToast({ title: "微信登录取消或失败", icon: "none" });
      await loadPosts(true);
      showLoginModal.value = false; 
    }
  } catch (error) {
    console.error("微信登录过程中发生错误:", error);
    uni.showToast({ title: "微信登录失败", icon: "none" });
    await loadPosts(true);
    showLoginModal.value = false; 
  }
};

const handleSkipLogin = async () => {
  showLoginModal.value = false;
  isLoggedIn.value = false; 
  await loadPosts(true); 
};

const handleCategoryClick = (index: number) => {
  currentCategory.value = index;
  if (index !== 0) {
    const categoryPages = [
      "",
      "/pages/qa/index",
      "/pages/news/index",
      "/pages/study/index",
    ];
    uni.navigateTo({
      url: categoryPages[index],
    });
  }
};

// 触底加载更多
onReachBottom(() => {
  if (!loading.value) {
    loadPosts();
  }
});

// 页面加载时获取数据
// onLoad(() => {
//   loadPosts(true);
// }); // Removed duplicate onLoad

// 页面显示时重置分类为推荐并加载数据
onShow(() => {
  currentCategory.value = 0;
});

const toggleLike = (index: number) => {
  const post = posts.value[index];
  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;
};
</script>

<style lang="scss">
.container {
  padding: 0; /* Remove padding to allow header to span full width */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.header-section {
  background: linear-gradient(
    180deg,
    #87ceeb,
    #eef1f5
  ); /* Add gradient from sky blue to light color */
  padding: 16rpx 20rpx 0; /* Add padding top/sides, remove bottom */
  margin-bottom: 10rpx; /* Add margin below the whole section */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  border-radius: 20rpx;
}

.category-bar {
  white-space: nowrap;
  padding: 0rpx 0 20rpx; /* Adjust padding, remove side padding as parent has it */
  /* margin-bottom: 20rpx; */ /* Removed margin, handled by parent */
  background-color: transparent; /* Removed background, handled by parent */
  /* padding-bottom: 20rpx; */ /* Padding adjusted above */
  /* box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05); */ /* Removed shadow, handled by parent */

  .category-item {
    display: inline-block;
    padding: 0rpx 20rpx; /* Adjusted padding */
    margin-right: 0rpx; /* Increased spacing */
    font-size: 28rpx;
    color: #666;
    background-color: transparent; /* Removed background */
    border-bottom: 4rpx solid transparent; /* Add transparent border for spacing */
    transition: color 0.3s, border-color 0.3s;

    &.active {
      color: #007aff; /* Active text color */
      font-weight: bold;
      border-bottom-color: #007aff; /* Blue underline */
      background-color: transparent; /* Ensure no background on active */
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

/* Add padding to content sections since container padding was removed */
.hot-topics,
.post-list {
  padding-left: 20rpx;
  padding-right: 20rpx;
}

.hot-topics {
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* Slightly transparent background */
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;

    text {
      font-size: 32rpx;
      font-weight: bold;
      margin-left: 8rpx;
    }
  }

  .topic-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .topic-tag {
      padding: 8rpx 24rpx;
      background-color: #f5f5f5;
      border-radius: 24rpx;
      font-size: 24rpx;
      color: #007aff;
    }
  }
}

.post-list {
  .post-item {
    position: relative;
    overflow: hidden;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(31, 45, 61, 0.1),
      0 8rpx 24rpx rgba(31, 45, 61, 0.06);
    border: 1rpx solid rgba(0, 0, 0, 0.05); /* Added subtle border */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 16rpx; /* Increased height */
      background: linear-gradient(90deg, #007aff, #00c6ff);
    }

    &:hover {
      transform: translateY(-2rpx);
      box-shadow: 0 8rpx 24rpx rgba(31, 45, 61, 0.15),
        0 16rpx 32rpx rgba(31, 45, 61, 0.1);
    }
  }

  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;

    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 16rpx;
    }

    .user-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex: 1;

      .user-basic {
        display: flex;
        flex-direction: column;

        .username {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
        }

        .university {
          font-size: 24rpx;
          color: #666;
        }
      }

      .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8rpx;

        .tag {
          font-size: 20rpx;
          color: #007aff;
          background-color: rgba(0, 122, 255, 0.1);
          padding: 4rpx 12rpx;
          border-radius: 12rpx;
          border: 1rpx solid rgba(0, 122, 255, 0.2);
        }
      }
    }
  }

  .post-content {
    margin-bottom: 24rpx; /* Increased margin */

    .title {
      display: block; // Ensure title is on its own line
      font-size: 34rpx;
      font-weight: bold;
      color: #222;
      margin-bottom: 12rpx;
      line-height: 1.4;
    }

    .content {
      display: block; // Ensure content is on its own line
      font-size: 28rpx;
      color: #555;
      line-height: 1.6;
      margin-bottom: 4rpx;
    }

    .post-images {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10rpx;
      margin-top: 16rpx;

      .post-image {
        width: 100%;
        height: 180rpx;
        border-radius: 8rpx;
        background-color: #f5f5f5;
      }
    }
  }

  .post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1rpx solid #f0f0f0;
    padding-top: 20rpx;

    .actions-left {
      display: flex;
      align-items: center;
    }

    .location {
      font-size: 24rpx;
      color: #666;
      display: flex;
      background-color: #f5f7fa;
      padding: 4rpx 12rpx;
      border-radius: 16rpx;
      gap: 15rpx;

      &::before {
        content: "📍";
        font-size: 24rpx;
      }
    }

    .action-item {
      display: flex;
      align-items: center;
      margin-right: 32rpx;

      text {
        font-size: 24rpx;
        color: #999;
        margin-left: 8rpx;
      }
    }
  }
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 8rpx;
  padding: 0 0 16rpx;
  width: 100%;

  .post-button {
    flex-shrink: 0;
    background-color: #007aff;
    border-radius: 30rpx;
    padding: 10rpx 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    height: 50rpx;
    box-shadow: 0 2rpx 6rpx rgba(0, 122, 255, 0.3);
  }

  > view:first-child {
    flex-grow: 1;
  }
}
.scrolling-announcement {
  background-color: rgba(
    230,
    247,
    255,
    0.9
  ); /* Light blue, slightly transparent */
  border: 1px solid #b3e5fc; /* Softer border color */
  border-radius: 12rpx; /* Rounded corners */
  padding: 12rpx 20rpx; /* Adjusted padding */
  margin: 0 20rpx 20rpx 20rpx; /* Align with post-list and add bottom margin */
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08); /* Subtle shadow */
  overflow: hidden; /* Ensure content respects border-radius */
}

.announcement-item {
  display: inline-block;
  font-size: 26rpx; /* Slightly larger font */
  color: #0284c7; /* Darker blue for better contrast and theme alignment */
  padding-right: 50rpx; /* Add some spacing between repeated items if they are close */
}

.announcement-bar {
  /* overflow: hidden; // Already handled by scrolling-announcement */
  white-space: nowrap;
  animation: scroll-left 15s linear infinite; /* Slightly slower animation */
}

@keyframes scroll-left {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%); /* Ensure it scrolls completely out */
  }
}

/* 登录弹窗样式 */
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Align to bottom */
  z-index: 999;
}

.login-modal-content {
  background-color: #fff;
  padding: 40rpx;
  border-top-left-radius: 30rpx; /* Rounded corners for top */
  border-top-right-radius: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Full width */
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.1); /* Shadow on top */
  padding-bottom: env(safe-area-inset-bottom); /*适配全面屏底部安全区域*/
}

.modal-title {
  font-size: 40rpx; /* Increased font size */
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx; /* Increased margin */
}

.modal-subtitle {
  font-size: 30rpx; /* Increased font size */
  color: #666;
  margin-bottom: 60rpx; /* Increased margin for more space */
  text-align: center;
}

.authorize-button {
  background-color: #07c160; /* 统一微信绿 */
  color: #fff;
  border: none;
  border-radius: 50rpx; /* More rounded */
  padding: 24rpx 0; /* Increased padding */
  font-size: 34rpx; /* Increased font size */
  width: 90%; /* Slightly less than full width for better aesthetics */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx; /* Increased margin */
  box-shadow: 0 4rpx 10rpx rgba(7, 193, 96, 0.4); /* Enhanced shadow */
}

.authorize-button text {
  margin-left: 12rpx; /* Adjusted margin */
}

.skip-button {
  background-color: #f0f0f0; /* Slightly darker for better contrast */
  color: #555; /* Darker text */
  border: none; /* Removed border for a cleaner look */
  border-radius: 50rpx; /* More rounded */
  padding: 24rpx 0; /* Increased padding */
  font-size: 34rpx; /* Increased font size */
  width: 90%; /* Slightly less than full width */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1); /* Enhanced shadow */
  margin-bottom: 20rpx; /* Add some bottom margin */
}
</style>
