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
  { keyword: "考研数学", hot: true },
  { keyword: "英语真题", hot: true },
  { keyword: "政治大纲" },
  { keyword: "专业课复习" },
  { keyword: "考研调剂" },
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
  background: linear-gradient(40deg, #f5f7fa 0%, #e6f2ff 100%);
  // background: linear-gradient(180deg, #c1e4f2, #eef1f5);
  min-height: 100vh;
  padding: 20rpx;
}

.uni-searchbar {
  padding: 10rpx 0 !important; // Reduce padding around search bar
}

.hot-list {
  margin-top: 30rpx;
  background-color: #fff; // Card background
  border-radius: 16rpx; // Rounded corners for card
  padding: 20rpx; // Padding inside card
  box-shadow: 0 4rpx 16rpx rgba(31, 45, 61, 0.1); // Subtle shadow

  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 20rpx; // Spacing below title
    padding-bottom: 10rpx;
    border-bottom: 1rpx solid #f0f0f0; // Separator line
  }

  .hot-item {
    padding: 24rpx 10rpx; // Increased padding for items
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #f5f5f5; // Lighter separator for items
    transition: background-color 0.2s;

    &:last-child {
      border-bottom: none; // No border for the last item
    }

    &:hover {
      background-color: #f9f9f9; // Hover effect
    }

    .index {
      color: #007aff; // Theme color for index
      font-size: 28rpx;
      font-weight: bold;
      margin-right: 20rpx;
      width: 40rpx; // Fixed width for alignment
    }

    .keyword {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .hot-tag {
      background: linear-gradient(
        45deg,
        #ff9a9e 0%,
        #fad0c4 99%,
        #fad0c4 100%
      ); // Gradient for hot tag
      color: #fff;
      font-size: 20rpx;
      padding: 6rpx 14rpx;
      border-radius: 20rpx; // More rounded tag
      font-weight: bold;
    }
  }
}
</style>
