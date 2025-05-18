<template>
  <view class="container">
    <view class="profile-header">
      <image class="avatar" src="https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/myav.svg" mode="aspectFill"></image>
      <view class="user-info">
        <text class="username">一研为定</text>
        <text class="bio">UID: 123456</text>
        <view class="qr-code">
          <uni-icons type="person" size="20"></uni-icons>
        </view>
      </view>
    </view>

    <view class="menu-list">
      <view class="menu-item" @click="navigateTo('/pages/settings/index')">
        <uni-icons type="settings" size="20"></uni-icons>
        <text>设置</text>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/collections/index')">
        <uni-icons type="star" size="20"></uni-icons>
        <text>关注收藏</text>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/posts/index')">
        <uni-icons type="home" size="20"></uni-icons>
        <text>我的帖子</text>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/about/index')">
        <uni-icons type="info" size="20"></uni-icons>
        <text>关于</text>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const navigateTo = (url: string) => {
  uni.navigateTo({ url });
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 20rpx;
  position: relative;

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
    margin-right: 30rpx;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    flex: 1;

    .username {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .bio {
      font-size: 28rpx;
      color: #999;
    }

    .qr-code {
      position: absolute;
      right: 30rpx;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.menu-list {
  // background: linear-gradient(to bottom, #e6f2ff, #f5f5f5 1000rpx);
  margin-top: 20rpx;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 5rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    uni-icons {
      margin-right: 20rpx;
    }

    text {
      flex: 1;
    }
  }
}
</style>
