<template>
  <view class="container">
    <view class="post-list">
      <view v-for="(post, index) in posts" :key="index" class="post-item">
        <view class="post-header">
          <image class="avatar" :src="post.avatar" mode="aspectFill"></image>
          <view class="user-info">
            <text class="username">{{ post.username }}</text>
            <text class="time">{{ post.time }}</text>
          </view>
        </view>
        <view class="post-content">
          <text class="title">{{ post.title }}</text>
          <text class="content">{{ post.content }}</text>
        </view>
        <view class="post-footer">
          <view class="action-item">
            <uni-icons type="chat" size="20"></uni-icons>
            <text>{{ post.comments }}</text>
          </view>
          <view class="action-item">
            <uni-icons type="heart" size="20"></uni-icons>
            <text>{{ post.likes }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

const posts = ref([
  {
    avatar: "/static/avatar.png",
    username: "用户1",
    time: "10分钟前",
    title: "这是一个帖子标题",
    content: "这是帖子内容，可以包含很多文字描述...",
    comments: 10,
    likes: 20,
  },
  {
    avatar: "/static/avatar.png",
    username: "用户2",
    time: "30分钟前",
    title: "另一个帖子标题",
    content: "这是另一个帖子的内容描述...",
    comments: 5,
    likes: 15,
  },
]);
</script>

<style lang="scss">
.container {
  padding: 20rpx;
}

.post-list {
  .post-item {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
  }

  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;

    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 16rpx;
    }

    .user-info {
      flex: 1;

      .username {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
      }

      .time {
        font-size: 24rpx;
        color: #999;
        margin-top: 4rpx;
      }
    }
  }

  .post-content {
    margin-bottom: 16rpx;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
    }

    .content {
      font-size: 28rpx;
      color: #666;
      line-height: 1.5;
    }
  }

  .post-footer {
    display: flex;
    border-top: 1rpx solid #eee;
    padding-top: 16rpx;

    .action-item {
      display: flex;
      align-items: center;
      margin-right: 32rpx;

      text {
        font-size: 24rpx;
        color: #999;
        margin-left: 8rpx;
      }
    }
  }
}
</style>
