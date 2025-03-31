<template>
  <view class="container">
    <view class="search-header">
      <text class="keyword">搜索关键词：{{ searchKeyword }}</text>
    </view>
    <view class="result-list">
      <view v-if="results.length === 0" class="empty">
        <uni-icons type="search" size="48" color="#999" />
        <text class="empty-text">暂无搜索结果</text>
      </view>
      <view
        v-else
        v-for="(item, index) in results"
        :key="index"
        class="result-item"
      >
        <text class="title">{{ item.title }}</text>
        <text class="content">{{ item.content }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const searchKeyword = ref("");
const results = ref<any[]>([]);

onLoad((options) => {
  if (options?.keyword) {
    searchKeyword.value = decodeURIComponent(options.keyword);
    // 模拟搜索结果数据
    results.value = [
      {
        title: "搜索结果1",
        content: "这是关于" + searchKeyword.value + "的示例内容...",
      },
      {
        title: "搜索结果2",
        content: "另一个关于" + searchKeyword.value + "的示例说明...",
      },
    ];
  }
});
</script>

<style lang="scss">
.container {
  padding: 20rpx;

  .search-header {
    padding: 20rpx 0;
    .keyword {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
    }
  }

  .result-list {
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 100rpx 0;
      .empty-text {
        margin-top: 20rpx;
        color: #999;
      }
    }

    .result-item {
      padding: 30rpx 0;
      border-bottom: 1rpx solid #eee;
      .title {
        font-size: 28rpx;
        color: #007aff;
        margin-bottom: 10rpx;
      }
      .content {
        font-size: 26rpx;
        color: #666;
        line-height: 1.5;
      }
    }
  }
}
</style>
