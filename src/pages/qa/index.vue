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
            placeholder="搜索难题问答"
            radius="40"
            clearButton="auto"
          />
        </view>
        <view class="post-button" @click="navigateToPostPage">
          <uni-icons type="plus" color="#fff" size="15" />
          <text style="color: #fff; font-size: 24rpx">提问</text>
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

    <!-- 问题列表 -->
    <view class="qa-list">
      <view
        v-for="(question, index) in questions"
        :key="index"
        class="qa-item"
        @click="navigateToQuestionDetail(question)"
      >
        <view class="qa-header">
          <image
            class="avatar"
            :src="question.avatar"
            mode="aspectFill"
          ></image>
          <view class="user-info">
            <text class="username">{{ question.username }}</text>
          </view>
        </view>
        <view class="qa-content">
          <text class="qa-tag">问答</text>
          <text class="title">{{ question.title }}</text>
          <text class="content">{{ question.content }}</text>
        </view>
        <view class="qa-footer">
          <view class="actions-left">
            <view class="action-item">
              <uni-icons type="chat" size="20"></uni-icons>
              <text>{{ question.answers }} 回答</text>
            </view>
            <view class="action-item">
              <uni-icons type="heart" size="20"></uni-icons>
              <text>{{ question.likes }}</text>
            </view>
          </view>
          <text class="time">{{ question.time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const currentCategory = ref(0);
const loading = ref(false);

const categories = ["全部", "数学", "英语", "政治", "专业课"];

const questions = ref([
  {
    avatar: "/static/myav.svg",
    username: "考研小白",
    time: "10分钟前",
    title: "高数中的泰勒公式如何理解和运用？",
    content:
      "在复习高等数学时遇到了泰勒公式，感觉很难理解，希望有大神能详细讲解一下...",
    answers: 5,
    likes: 128,
  },
  {
    avatar: "/static/ulogo/PKU.svg",
    username: "英语达人",
    time: "30分钟前",
    title: "考研英语长难句如何破解？",
    content: "英语阅读理解中经常遇到特别长的句子，求解析方法...",
    answers: 8,
    likes: 256,
  },
  {
    avatar: "/static/ulogo/FDU.svg",
    username: "政治思考者",
    time: "1小时前",
    title: "如何理解马克思主义政治经济学的基本原理？",
    content: "在复习政治时对这部分内容理解不够深入，希望能得到详细解答...",
    answers: 12,
    likes: 345,
  },
]);

const router = useRouter();

const navigateToSearchPage = () => {
  uni.navigateTo({ url: "/pages/searchPage/index" });
};

const navigateToPostPage = () => {
  uni.navigateTo({ url: "/pages/postPage/index" });
};

const navigateToQuestionDetail = (question: any) => {
  uni.navigateTo({ url: `/pages/postDetail/index` });
};

const handleCategoryClick = (index: number) => {
  currentCategory.value = index;
  // 这里可以根据分类筛选问题列表
};
</script>

<style lang="scss">
.container {
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.header-section {
  background: linear-gradient(180deg, #87ceeb, #eef1f5);
  padding: 16rpx 20rpx 0;
  margin-bottom: 10rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  border-radius: 20rpx;
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

.category-bar {
  white-space: nowrap;
  padding: 0rpx 0 20rpx;
  background-color: transparent;

  .category-item {
    display: inline-block;
    padding: 0rpx 20rpx;
    margin-right: 0rpx;
    font-size: 28rpx;
    color: #666;
    background-color: transparent;
    border-bottom: 4rpx solid transparent;
    transition: color 0.3s, border-color 0.3s;

    &.active {
      color: #007aff;
      font-weight: bold;
      border-bottom-color: #007aff;
      background-color: transparent;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

.qa-list {
  padding: 20rpx;

  .qa-item {
    position: relative;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 28rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
    border: 1rpx solid rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 8rpx;
      border-radius: 20rpx 20rpx 0 0;
      background: linear-gradient(90deg, #007aff, #00c6ff);
    }

    &::after {
      content: "Q&A";
      position: absolute;
      top: 16rpx;
      right: 16rpx;
      font-size: 24rpx;
      color: #007aff;
      font-weight: bold;
      opacity: 0.6;
      letter-spacing: 1px;
    }

    &:hover {
      transform: translateY(-2rpx);
      box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.12);
      border-color: rgba(0, 122, 255, 0.1);
    }
  }

  .qa-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 16rpx;
      box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
    }

    .user-info {
      flex: 1;

      .username {
        font-size: 28rpx;
        font-weight: 600;
        color: #2c3e50;
      }
    }
  }

  .qa-content {
    margin-bottom: 24rpx;

    .qa-tag {
      display: inline-block;
      background-color: #007aff;
      color: #fff;
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
      font-size: 24rpx;
      margin-right: 12rpx;
      margin-bottom: 8rpx;
    }

    .title {
      display: inline;
      font-size: 32rpx;
      font-weight: 600;
      color: #2c3e50;
      line-height: 1.4;
    }

    .content {
      display: block;
      font-size: 28rpx;
      color: #5c6b7f;
      line-height: 1.6;
    }
  }

  .qa-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1rpx solid rgba(0, 0, 0, 0.05);
    padding-top: 20rpx;

    .actions-left {
      display: flex;
      align-items: center;
    }

    .time {
      font-size: 24rpx;
      color: #8795a1;
    }

    .action-item {
      display: flex;
      align-items: center;
      margin-right: 32rpx;
      transition: all 0.2s ease;

      &:hover {
        opacity: 0.8;
      }

      text {
        font-size: 24rpx;
        color: #8795a1;
        margin-left: 8rpx;
      }
    }
  }
}
</style>
