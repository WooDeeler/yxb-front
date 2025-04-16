<template>
  <view class="container">
    <view class="header">
      <text class="title">设置</text>
    </view>

    <view class="settings-list">
      <view class="setting-item">
        <text>账号与安全</text>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
      <view class="setting-item">
        <text>通知设置</text>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
      <view class="setting-item">
        <text>隐私设置</text>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
      <view class="setting-item">
        <text>通用设置</text>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
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

.settings-list {
  background-color: #fff;
  margin-top: 20rpx;

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
