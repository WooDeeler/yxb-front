<template>
  <view class="container">
    <view class="profile-header">
      <image
        class="avatar"
        src="https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/myav.svg"
        mode="aspectFill"
      ></image>
      <view class="user-info">
        <text class="username">{{ editedUsername }}</text>
        <text class="bio">{{ editedBio }}</text>
        <view class="qr-code" @click="openEditModal">
          <uni-icons type="compose" size="20"></uni-icons>
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
      <view
        class="menu-item"
        @click="navigateTo(`/pages/myPost/index?id=${userInfo.uid}`)"
      >
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

    <!-- 编辑个人信息弹窗 -->
    <view
      v-if="showEditModal"
      class="edit-modal-overlay"
      @click.self="closeEditModal"
    >
      <view class="edit-modal-content" @click.stop>
        <text class="modal-title">编辑个人信息</text>
        <view class="form-item">
          <text class="form-label">用户名:</text>
          <input
            class="form-input"
            v-model="editedUsername"
            placeholder="请输入用户名"
          />
        </view>
        <view class="form-item">
          <text class="form-label">简介:</text>
          <input
            class="form-input"
            v-model="editedBio"
            placeholder="请输入简介"
          />
        </view>
        <view class="modal-actions">
          <button class="modal-button cancel-button" @click="closeEditModal">
            取消
          </button>
          <button class="modal-button save-button" @click="saveProfile">
            保存
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { chatApi } from "@/api";
import { onLoad, onPullDownRefresh } from "@dcloudio/uni-app";

import { useUserStore } from "@/store/userStore";
const userStore = useUserStore();
const userInfo = userStore.getUserInfo;

const showEditModal = ref(false);
const editedUsername = ref("一研为定");
const editedBio = ref("目标院校: 华东交通大学");

const openEditModal = () => {
  editedUsername.value = "一研为定";
  editedBio.value = "目标院校: 华东交通大学";
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const saveProfile = () => {
  console.log("Saving profile:", editedUsername.value, editedBio.value);
  uni.showToast({
    title: "信息已更新",
    icon: "success",
  });
  closeEditModal();
};

const navigateTo = (url: string) => {
  uni.navigateTo({ url });
};
</script>

<style lang="scss">
.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-modal-content {
  background-color: white;
  padding: 40rpx;
  border-radius: 16rpx;
  width: 80%;
  max-width: 600rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
  display: block;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.form-input {
  width: 100%;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  height: 80rpx;
  line-height: 58rpx;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #007aff;
    box-shadow: 0 0 0 3rpx rgba(0, 122, 255, 0.25);
    outline: none;
  }
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}

.modal-button {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 30rpx;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:active {
    transform: scale(0.98);
  }
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
  margin-right: 20rpx;
}

.save-button {
  background-color: #007aff;
  color: white;
}

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
