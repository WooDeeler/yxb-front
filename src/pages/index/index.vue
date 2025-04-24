<template>
  <view class="container">
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
    <view class="hot-topics">
      <view class="section-title">
        <uni-icons type="fire" size="20" color="#ff0000" />
        <text>热门话题</text>
      </view>
      <view class="topic-tags">
        <view class="topic-tag" v-for="(tag, index) in hotTopics" :key="index">
          #{{ tag }}
        </view>
      </view>
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
            <text class="username">{{ post.username }}</text>
            <!-- Time moved to footer -->
          </view>
        </view>
        <view class="post-content">
          <text class="title">{{ post.title }}</text>
          <text class="content">{{ post.content }}</text>
          <view
            class="post-images"
            v-if="post.images && post.images.length > 0"
          >
            <image
              v-for="(img, idx) in post.images.slice(0, 3)"
              :key="idx"
              :src="img"
              mode="aspectFill"
              class="post-image"
              @click="previewImage(post.images, idx)"
            />
          </view>
        </view>
        <view class="post-footer">
          <view class="actions-left">
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
          <text class="time">{{ post.time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { onShow } from "@dcloudio/uni-app";

const currentCategory = ref(0);
const loading = ref(false);

const categories = ["推荐", "难题问答", "考研新闻"];

const hotTopics = ["考研英语", "数学真题", "调剂信息", "院校选择"];

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
    images?: string[];
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
    images: ["/static/posts/post-2.png", "/static/posts/post-3.png"],
  },
  {
    avatar: "/static/logo.png",
    username: "英语学姐",
    time: "30分钟前",
    title: "考研英语长难句解析技巧",
    content:
      "今天给大家分享几个实用的长难句解析方法，让你轻松应对考研英语阅读理解...",
    comments: 32,
    likes: 96,
    images: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
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
    images: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
  },
  {
    avatar: "/static/logo.png",
    username: "政治小帮手",
    time: "2小时前",
    title: "2024考研政治大纲变化解析",
    content: "最新的考研政治大纲已经公布，本文详细分析了变化内容和复习建议...",
    comments: 89,
    likes: 342,
    images: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
  },
  {
    avatar: "/static/logo.png",
    username: "计科老学长",
    time: "3小时前",
    title: "计算机专业课408复习经验",
    content:
      "分享一下408四门课程的复习方法和重点内容，希望对计算机考研的同学有帮助...",
    comments: 56,
    likes: 167,
    images: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
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
    images: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
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
    images: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
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
    images: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
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
    images: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
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
    images: ["/static/logo.png", "/static/logo.png", "/static/logo.png"],
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

const handleCategoryClick = (index: number) => {
  currentCategory.value = index;
  if (index !== 0) {
    // 如果不是推荐分类
    const categoryPages = ["", "/pages/qa/index", "/pages/news/index"];
    uni.navigateTo({
      url: categoryPages[index],
    });
  }
};

// 页面显示时重置分类为推荐
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
    justify-content: space-between; // Align items to start and end
    align-items: center; // Vertically center items
    border-top: 1rpx solid #f0f0f0;
    padding-top: 20rpx;

    .actions-left {
      display: flex;
      align-items: center;
    }

    .time {
      font-size: 24rpx;
      color: #999;
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
</style>
