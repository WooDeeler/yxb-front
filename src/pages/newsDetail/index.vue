<template>
  <view class="container">
    <view v-if="newsItem" class="news-detail-content">
      <image
        v-if="newsItem.images"
        :src="newsItem.images"
        mode="aspectFill"
        class="news-image-header"
      />
      <view class="news-header">
        <text class="title">{{ newsItem.title }}</text>
        <view class="meta">
          <text class="source">{{ newsItem.publishSource }}</text>
          <text class="time">发布于: {{ newsItem.publishTime }}</text>
        </view>
      </view>
      <view class="content-body">
        <rich-text :nodes="newsItem.content"></rich-text>
      </view>
      <view v-if="newsItem.relatedUniversity" class="related-info">
        <text class="info-label">相关院校:</text>
        <text class="info-value">{{ newsItem.relatedUniversity }}</text>
      </view>
      <view v-if="newsItem.tags" class="related-info">
        <text class="info-label">标签:</text>
        <text class="info-value">{{ newsItem.tags }}</text>
      </view>
    </view>
    <uni-load-more
      v-else
      status="loading"
      :content-text="{ contentrefresh: '加载中...' }"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { newsApi } from "@/api"; 

interface NewsDetail {
  id: string;
  title: string;
  content: string;
  publishSource: string;
  publishTime: string;
  images?: string;
  relatedUniversity?: string;
  tags?: string;
}

const newsItem = ref<NewsDetail | null>(null);
const loading = ref(false);

onLoad(async (options) => {
  if (options && options.id) {
    await fetchNewsDetail(options.id as string);
  }
});

const fetchNewsDetail = async (id: string) => {
  loading.value = true;
  try {
    const res = await newsApi.getNewsDetail(id);
    if (res.data) {
      newsItem.value = {
        ...res.data,
        publishTime: new Date(res.data.publishTime).toISOString().split("T")[0],
      };
    } else {
      newsItem.value = {
        id: id,
        title: "新闻标题加载失败",
        content: "新闻内容加载失败，请稍后再试。",
        publishSource: "未知来源",
        publishTime: new Date().toLocaleString().toISOString().split("T")[0],
        images: "/static/placeholder-image.png", // Placeholder image
      };
      uni.showToast({
        title: "加载新闻详情失败",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("获取新闻详情失败:", error);
    newsItem.value = {
      // Fallback in case of error
      id: id,
      title: "无法加载新闻",
      content: "获取新闻详情时发生错误。",
      publishSource: "系统",
      publishTime: new Date().toLocaleString().toISOString().split("T")[0],
    };
    uni.showToast({
      title: "获取详情失败，请检查网络",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss">
.container {
  padding: 20rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

.news-detail-content {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(31, 45, 61, 0.08);
}

.news-image-header {
  width: 100%;
  height: 400rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  object-fit: cover;
}

.news-header {
  margin-bottom: 30rpx;
  .title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
    display: block;
  }
  .meta {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    color: #999;
    .source {
      color: #007aff;
    }
  }
}

.content-body {
  font-size: 30rpx;
  line-height: 1.8;
  color: #555;
  word-wrap: break-word;
  white-space: pre-wrap; /* Preserve whitespace and newlines */
  margin-bottom: 30rpx;
}

.related-info {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #666;
  .info-label {
    font-weight: bold;
    margin-right: 10rpx;
  }
  .info-value {
    color: #007aff;
  }
}
</style>
