<template>
  <view class="container">
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
    <scroll-view class="category-bar" scroll-x>
      <view
        v-for="(category, index) in categories"
        :key="index"
        class="category-item"
        :class="{ active: currentCategory === index }"
        @click="currentCategory = index"
      >
        {{ category }}
      </view>
    </scroll-view>
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
            <text class="username">{{ post.username }}</text>
            <text class="time">{{ post.time }}</text>
          </view>
        </view>
        <view class="post-content">
          <text class="title">{{ post.title }}</text>
          <text class="content">{{ post.content }}</text>
        </view>
        <view class="post-footer">
          <view class="action-item">
            <uni-icons type="chat" size="20"></uni-icons>
            <text>{{ post.comments }}</text>
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
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const currentCategory = ref(0);

const categories = [
  "推荐",
  "备考经验",
  "资料分享",
  "考研问答",
  "调剂信息",
];

const posts = ref<
  Array<{
    avatar: string;
    username: string;
    time: string;
    title: string;
    content: string;
    comments: number;
    likes: number;
    isLiked: boolean;
  }>
>([
  {
    avatar: "/static/logo.png",
    username: "考研人加油",
    time: "10分钟前",
    title: "分享我的考研复习时间规划，建议收藏！",
    content:
      "大家好，我是24考研备考的同学，这里分享一下我的复习计划和时间安排。数学每天4小时，英语2小时，专业课3小时...",
    comments: 45,
    likes: 128,
    isLiked: false,
  },
  {
    avatar: "/static/logo.png",
    username: "英语学霸",
    time: "30分钟前",
    title: "考研英语长难句解析技巧",
    content:
      "今天给大家分享几个实用的长难句解析方法，让你轻松应对考研英语阅读理解...",
    comments: 32,
    likes: 96,
  },
  {
    avatar: "/static/logo.png",
    username: "数学大神",
    time: "1小时前",
    title: "考研数学高频考点整理",
    content:
      "整理了最近五年考研数学的高频考点，包括微积分、线性代数、概率论重要知识点...",
    comments: 67,
    likes: 215,
  },
  {
    avatar: "/static/logo.png",
    username: "政治研究生",
    time: "2小时前",
    title: "2024考研政治大纲变化解析",
    content: "最新的考研政治大纲已经公布，本文详细分析了变化内容和复习建议...",
    comments: 89,
    likes: 342,
  },
  {
    avatar: "/static/logo.png",
    username: "专业课达人",
    time: "3小时前",
    title: "计算机专业课408复习经验",
    content:
      "分享一下408四门课程的复习方法和重点内容，希望对计算机考研的同学有帮助...",
    comments: 56,
    likes: 167,
  },
  {
    avatar: "/static/logo.png",
    username: "考研规划师",
    time: "4小时前",
    title: "暑假考研复习如何规划？",
    content:
      "暑假是考研复习的黄金时期，如何合理安排时间和调整状态？这里有详细的建议...",
    comments: 78,
    likes: 245,
  },
  {
    avatar: "/static/logo.png",
    username: "考研心理",
    time: "5小时前",
    title: "考研备考期间如何调节心理压力",
    content:
      "备考压力大是很多同学都会遇到的问题，分享几个实用的心理调节方法...",
    comments: 92,
    likes: 301,
  },
  {
    avatar: "/static/logo.png",
    username: "资料分享官",
    time: "6小时前",
    title: "最新考研资料合集分享",
    content:
      "整理了各个科目的复习资料，包括视频、讲义、真题等，欢迎大家下载学习...",
    comments: 120,
    likes: 458,
  },
  {
    avatar: "/static/logo.png",
    username: "考研答疑",
    time: "7小时前",
    title: "考研常见问题解答汇总",
    content:
      "收集了考研备考过程中的常见问题，包括报考、调剂、复试等各个方面的详细解答...",
    comments: 86,
    likes: 279,
  },
  {
    avatar: "/static/logo.png",
    username: "院校信息库",
    time: "8小时前",
    title: "2024年热门院校报考分析",
    content:
      "详细分析了各个热门院校的报考情况、录取分数、专业设置等信息，供大家参考...",
    comments: 95,
    likes: 334,
  },
]);

const router = useRouter();

const navigateToSearchPage = () => {
  uni.navigateTo({ url: "/pages/searchPage/index" });
};

const navigateToPostPage = () => {
  uni.navigateTo({ url: "/pages/postPage/index" });
};

const navigateToPostDetail = (post: any) => {
  uni.navigateTo({ url: `/pages/postDetail/index` });
};

const toggleLike = (index: number) => {
  const post = posts.value[index];
  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;
};
</script>

<style lang="scss">
.container {
  padding: 20rpx;
}

.category-bar {
  white-space: nowrap;
  padding: 20rpx 0;
  margin: 0 -20rpx;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;

  .category-item {
    display: inline-block;
    padding: 12rpx 32rpx;
    margin-right: 20rpx;
    border-radius: 32rpx;
    font-size: 28rpx;
    color: #666;
    background-color: #f5f5f5;

    &.active {
      color: #fff;
      background-color: #007aff;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

.hot-topics {
  background-color: #fff;
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
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(31, 45, 61, 0.1),
      0 8rpx 24rpx rgba(31, 45, 61, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

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
      flex: 1;

      .username {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
      }

      .time {
        font-size: 24rpx;
        color: #999;
        margin-top: 4rpx;
      }
    }
  }

  .post-content {
    margin-bottom: 20rpx;

    .title {
      font-size: 34rpx;
      font-weight: bold;
      color: #222;
      margin-bottom: 12rpx;
      line-height: 1.4;
    }

    .content {
      font-size: 28rpx;
      color: #555;
      line-height: 1.6;
      margin-bottom: 4rpx;
    }
  }

  .post-footer {
    display: flex;
    border-top: 1rpx solid #f0f0f0;
    padding-top: 20rpx;

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
  gap: 20rpx;

  > view:first-child {
    flex-grow: 1;
    max-width: 80%;
  }

  .post-button {
    flex-shrink: 0;
    background-color: #007aff;
    border-radius: 30rpx;
    padding: 10rpx 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    height: 50rpx; /* 与搜索框保持一致的高度 */
  }
}
</style>
