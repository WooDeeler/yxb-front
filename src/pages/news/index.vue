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
        <view>
          <uni-search-bar
            placeholder="搜索考研新闻资讯"
            radius="40"
            clearButton="auto"
            @confirm="onSearch"
            @input="onInput"
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
          <text class="summary">{{ news.content }}</text>
          <view class="news-footer">
            <view class="source">{{ news.publishSource }}</view>
            <text class="time">{{ news.publishTime }}</text>
          </view>
        </view>
        <image
          v-if="news.images"
          :src="news.images"
          mode="aspectFill"
          class="news-image"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { newsApi } from "@/api";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";

const currentCategory = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const title = ref("");
const theme = ref("");
const loading = ref(false);
const newsList = ref<News[]>([
  {
    title: "2024年全国硕士研究生考试大纲公布",
    content:
      "教育部近日公布2024年全国硕士研究生招生考试大纲，本次大纲较去年有以下变化...",
    publishSource: "教育部官网",
    publishTime: "2小时前",
    images: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/post-2.png",
  },
  {
    title: "多所高校公布2024年硕士研究生招生计划",
    content:
      "近期，包括清华大学、北京大学在内的多所高校陆续公布2024年硕士研究生招生计划...",
    publishSource: "中国教育在线",
    publishTime: "4小时前",
    images: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/post-3.png",
  },
]);

interface News {
  title: string;
  content: string;
  publishSource: string;
  publishTime: string;
  images: string;
  relatedUniversity: string;
  tags: string;
}

const categories = ["全部", "考研政策", "院校动态", "调剂信息", "考研大纲"];

// 获取新闻列表数据
const fetchNewsList = async (isRefresh = false) => {
  try {
    loading.value = true;
    let news = [];
    const params: {
      titles?: string;
      theme?: string;
      page?: number;
      size?: number;
    } = {
      page: isRefresh ? 1 : currentPage.value++,
      size: pageSize.value,
      title: title.value,
      theme: theme.value,
    };
    const res = await newsApi.searchNews(params);
    news = res.data.list.map((n) => ({
      ...n,
      publishTime: new Date(n.publishTime).toISOString().split("T")[0],
    }));
    newsList.value = isRefresh ? news : [...newsList.value, ...news];
  } catch (error) {
    console.error("获取新闻列表失败:", error);
  } finally {
    loading.value = false;
  }
};

const navigateToNewsDetail = (news: any) => {
  const newsId = news.id || "1";
  uni.navigateTo({ url: `/pages/newsDetail/index?id=${newsId}` });
};

const handleCategoryClick = (index: number) => {
  currentCategory.value = index;
  // 根据分类获取新闻
  const category = categories[index];
  if (category === "全部") {
    theme.value = "";
    fetchNewsList(true);
    return;
  }
  theme.value = categories[index];
  fetchNewsList(true);
};

const onInput = (event) => {
  title.value = event.value;
}

const onSearch = (event) => {
  title.value = event.value;
  fetchNewsList(true);
};
// 触底加载更多
onReachBottom(() => {
  if (!loading.value) {
    fetchNewsList();
  }
});
// 页面加载时获取新闻数据
onLoad(() => {
  fetchNewsList(true);
});
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
