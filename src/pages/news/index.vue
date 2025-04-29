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
            placeholder="搜索考研新闻资讯"
            radius="40"
            clearButton="auto"
          />
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

    <!-- 新闻列表 -->
    <view class="news-list">
      <view
        v-for="(news, index) in newsList"
        :key="index"
        class="news-item"
        @click="navigateToNewsDetail(news)"
      >
        <view class="news-content">
          <text class="title">{{ news.title }}</text>
          <text class="summary">{{ news.summary }}</text>
          <view class="news-footer">
            <view class="source">{{ news.source }}</view>
            <text class="time">{{ news.time }}</text>
          </view>
        </view>
        <image
          v-if="news.image"
          :src="news.image"
          mode="aspectFill"
          class="news-image"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const currentCategory = ref(0);
const loading = ref(false);

const categories = ["全部", "考研政策", "院校动态", "调剂信息", "考研大纲"];

const newsList = ref([
  {
    title: "2024年全国硕士研究生考试大纲公布",
    summary:
      "教育部近日公布2024年全国硕士研究生招生考试大纲，本次大纲较去年有以下变化...",
    source: "教育部官网",
    time: "2小时前",
    image: "/static/posts/post-2.png",
  },
  {
    title: "多所高校公布2024年硕士研究生招生计划",
    summary:
      "近期，包括清华大学、北京大学在内的多所高校陆续公布2024年硕士研究生招生计划...",
    source: "中国教育在线",
    time: "4小时前",
    image: "/static/posts/post-3.png",
  },
  {
    title: "2023年考研国家线公布，历年最低",
    summary:
      "2023年全国硕士研究生招生考试考生进入复试的初试成绩基本要求（国家线）公布...",
    source: "人民日报",
    time: "昨天",
    image: "/static/posts/post-4.png",
  },
  {
    title: "教育部：做好2024年全国硕士研究生考试疫情防控工作",
    summary:
      "教育部下发通知，要求各地各高校科学精准做好2024年全国硕士研究生考试疫情防控工作...",
    source: "新华网",
    time: "昨天",
    image: "/static/posts/post-1.png",
  },
  {
    title: "2024考研预报名系统将于9月开通",
    summary:
      "2024年全国硕士研究生考试预报名系统将于9月开通，考生可提前准备相关材料...",
    source: "中国教育报",
    time: "2天前",
    image: "/static/posts/post-2.png",
  },
]);

const router = useRouter();

const navigateToSearchPage = () => {
  uni.navigateTo({ url: "/pages/searchPage/index" });
};

const navigateToNewsDetail = (news: any) => {
  uni.navigateTo({ url: `/pages/postDetail/index` });
};

const handleCategoryClick = (index: number) => {
  currentCategory.value = index;
  // 这里可以根据分类筛选新闻
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

.news-list {
  padding: 20rpx;

  .news-item {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(31, 45, 61, 0.1);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 16rpx;
      background: linear-gradient(90deg, #007aff, #00c6ff);
    }

    .news-content {
      flex: 1;
      margin-right: 20rpx;

      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 16rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .summary {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 16rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .news-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 24rpx;
        color: #999;

        .source {
          color: #007aff;
        }
      }
    }

    .news-image {
      width: 200rpx;
      height: 160rpx;
      border-radius: 8rpx;
      object-fit: cover;
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

  > view:first-child {
    flex-grow: 1;
  }
}
</style>
