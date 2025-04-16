<template>
  <view class="container">
    <view class="header">
      <text class="title">收藏</text>
    </view>

    <view class="empty-state">
      <uni-icons type="star" size="48" color="#999"></uni-icons>
      <text class="empty-text">暂无收藏内容</text>
    </view>
  </view>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.container {
  padding: 20rpx;
}

.header {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;

  .title {
    font-size: 36rpx;
    font-weight: bold;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;

  .empty-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #999;
  }
}
</style>
