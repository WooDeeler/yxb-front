<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="iconfont icon-search"></text>
        <input placeholder="搜索" />
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view class="message-list" scroll-y>
      <view
        v-for="(item, index) in messages"
        :key="index"
        class="message-item"
        @longpress="() => showDeleteBtn(index)"
      >
        <image class="avatar" :src="item.avatar" />
        <view class="content">
          <view class="top">
            <text class="name">{{ item.name }}</text>
            <text class="time">{{ item.time }}</text>
          </view>
          <text class="preview">{{ item.preview }}</text>
        </view>
        <view class="delete-btn" @click="deleteMessage(index)">删除</view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface MessageItem {
  avatar: string;
  name: string;
  time: string;
  preview: string;
  showDelete: boolean;
}

const messages = ref<MessageItem[]>([
  {
    avatar: "/static/logo.png",
    name: "张三",
    time: "12:30",
    preview: "你好，最近怎么样？",
    showDelete: false,
  },
  {
    avatar: "/static/logo.png",
    name: "李四",
    time: "昨天",
    preview: "项目进展如何？",
    showDelete: false,
  },
  {
    avatar: "/static/logo.png",
    name: "王五",
    time: "星期一",
    preview: "记得明天开会",
    showDelete: false,
  },
]);

const showDeleteBtn = (index: number) => {
  messages.value.forEach((item, i) => {
    item.showDelete = i === index;
  });
};

const deleteMessage = (index: number) => {
  messages.value.splice(index, 1);
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  padding: 20rpx;
  background-color: #007aff;
}

.search-input {
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background-color: white;
  border-radius: 10rpx;
}

.search-input input {
  flex: 1;
  margin-left: 10rpx;
}

.message-list {
  flex: 1;
  overflow: hidden;
}

.message-item {
  position: relative;
  display: flex;
  padding: 20rpx;
  background-color: white;
  border-bottom: 1rpx solid #eee;
  transition: transform 0.3s;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.content {
  flex: 1;
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.name {
  font-size: 32rpx;
  color: #333;
}

.time {
  font-size: 24rpx;
  color: #999;
}

.preview {
  font-size: 28rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 80rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f00;
  color: white;
  border-radius: 10rpx;
  opacity: 0;
  transition: opacity 0.3s;
}

.message-item:hover .delete-btn,
.message-item.active .delete-btn {
  opacity: 1;
}
</style>
