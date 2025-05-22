<template>
  <view class="container">
    <!-- 页面标题 -->
    <view class="header">
      <text class="title">创建群聊</text>
    </view>

    <!-- 表单区域 -->
    <view class="form-area">
      <view class="form-item">
        <text class="label">群聊头像</text>
        <view class="avatar-placeholder">
          <image class="avatar-image" src="/static/lls.svg" />
        </view>
      </view>
      <view class="form-item">
        <text class="label">群聊名称</text>
        <input class="input" placeholder="请输入群聊名称" v-model="groupName" />
      </view>
      <view class="form-item">
        <text class="label">群聊类型</text>
        <input class="input" placeholder="请输入群聊名称" v-model="groupType" />
      </view>
      <view class="form-item">
        <text class="label">群聊简介</text>
        <textarea
          class="textarea"
          placeholder="请输入群聊简介"
          v-model="groupDescription"
        />
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="button create-btn" @click="handleCreateGroup">
        创建群聊
      </button>
      <button class="button cancel-btn" @click="handleCancel">取消</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { chatApi } from "@/api";
import { useUserStore } from "@/store/userStore";
const userStore = useUserStore();
const userInfo = userStore.getUserInfo;

const groupName = ref("");
const groupType = ref("");
const groupDescription = ref("");

const handleCreateGroup = async () => {
  // 创建群聊逻辑
  if (!groupName.value) {
    uni.showToast({
      title: "请输入群聊名称",
      icon: "none",
    });
    return;
  }
  const res = await chatApi.createGroup({
    name: groupName.value,
    type: groupType.value,
    tags: groupDescription.value,
    ownerId: userInfo.uid,
    status: 1,
  });
  uni.showToast({
    title: "创建成功 (模拟)",
    icon: "success",
  });
  setTimeout(() => {
    uni.navigateBack();
  }, 1500);
};


const handleCancel = () => {
  uni.navigateBack();
};

</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(to bottom, #e6f2ff, #f5f5f5 1000rpx);
  padding: 20rpx;
}

.header {
  text-align: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.form-area {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 40rpx;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.label {
  width: 180rpx;
  font-size: 30rpx;
  color: #333;
}

.input,
.textarea {
  flex: 1;
  font-size: 30rpx;
  color: #555;
}

.textarea {
  height: 150rpx;
  padding-top: 10rpx; /* Align text better */
}

.avatar-placeholder {
  width: 100rpx;
  height: 100rpx;
  background-color: #f0f0f0;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.button {
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
  text-align: center;
}

.create-btn {
  background-color: #007aff;
  color: white;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}
</style>
