<template>
  <view class="container">
    <uni-search-bar
      placeholder="请输入搜索内容"
      v-model="searchValue"
      @confirm="handleSearch"
      radius="40"
      clearButton="auto"
      focus
    />
    <view class="hot-list">
      <text class="title">热搜榜</text>
      <view
        v-for="(item, index) in hotList"
        :key="index"
        class="hot-item"
        @click="selectHot(item)"
      >
        <text class="index">{{ index + 1 }}.</text>
        <text class="keyword">{{ item.keyword }}</text>
        <text v-if="item.hot" class="hot-tag">热</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchValue = ref("");

const hotList = ref([
  { keyword: "前端开发", hot: true },
  { keyword: "uni-app教程", hot: true },
  { keyword: "Vue3更新" },
  { keyword: "小程序开发" },
  { keyword: "JavaScript基础" },
]);

const handleSearch = () => {
  if (searchValue.value.trim()) {
    uni.navigateTo({
      url: `/pages/searchResult/index?keyword=${encodeURIComponent(
        searchValue.value
      )}`,
    });
  }
};

const selectHot = (item: { keyword: string }) => {
  searchValue.value = item.keyword;
  handleSearch();
};
</script>

<style lang="scss">
.container {
  padding: 20rpx;
}

.hot-list {
  margin-top: 40rpx;
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 30rpx;
  }
  .hot-item {
    padding: 20rpx 0;
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #eee;
    .index {
      color: #f40;
      font-size: 28rpx;
      margin-right: 20rpx;
    }
    .keyword {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }
    .hot-tag {
      background: #f40;
      color: #fff;
      font-size: 20rpx;
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
    }
  }
}
</style>
