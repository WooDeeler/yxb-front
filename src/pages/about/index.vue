<template>
  <view class="container">
    <view class="header">
      <text class="title">关于</text>
    </view>

    <view class="about-content">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">研习宝</text>
      <text class="version">版本: 1.0.0</text>
      <text class="copyright">© 2025 kongke</text>
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

.about-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;

  .logo {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }

  .app-name {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .version,
  .copyright {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 10rpx;
  }
}
</style>
