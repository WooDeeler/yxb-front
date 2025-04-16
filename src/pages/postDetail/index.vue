<template>
  <view class="container">
    <view class="article-header">
      <text class="title">{{ post.title }}</text>
      <view class="author-info">
        <image class="avatar" :src="post.avatar" mode="aspectFill"></image>
        <view class="info">
          <text class="name">{{ post.username }}</text>
          <text class="time">{{ post.time }}</text>
        </view>
      </view>
    </view>

    <view class="article-content">
      <text>{{ post.content }}</text>
    </view>

    <view class="interaction-bar">
      <view class="action-item">
        <uni-icons type="chat" size="24"></uni-icons>
        <text>{{ post.comments }}</text>
      </view>
      <view class="action-item">
        <uni-icons
          :type="post.isLiked ? 'heart-filled' : 'heart'"
          size="24"
          :color="post.isLiked ? '#ff0000' : '#000000'"
        ></uni-icons>
        <text>{{ post.likes }}</text>
      </view>
      <view class="action-item">
        <uni-icons type="forward" size="24"></uni-icons>
        <text>分享</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";

interface PostDetail {
  title: string;
  username: string;
  avatar: string;
  time: string;
  content: string;
  comments: number;
  likes: number;
  isLiked: boolean;
}

const post = ref<PostDetail>({
  title: "",
  username: "",
  avatar: "",
  time: "",
  content: "",
  comments: 0,
  likes: 0,
  isLiked: false,
});

onLoad((options) => {
  // 模拟获取帖子详情数据
  post.value = {
    title: "分享我的考研复习时间规划，建议收藏！",
    username: "考研人加油",
    avatar: "/static/logo.png",
    time: "10分钟前",
    content:
      "大家好，我是24考研备考的同学，这里分享一下我的复习计划和时间安排。\n\n1. 数学每天4小时\n- 上午2小时：复习基础知识点\n- 下午2小时：刷题训练\n\n2. 英语每天2小时\n- 早上1小时：背单词\n- 晚上1小时：阅读训练\n\n3. 专业课3小时\n- 按照考试大纲逐章学习\n- 配合视频讲解加深理解\n\n希望这个时间规划对大家有帮助！",
    comments: 45,
    likes: 128,
    isLiked: false,
  };
});
</script>

<style lang="scss">
.container {
  padding: 32rpx;
  background-color: #fff;
}

.article-header {
  margin-bottom: 40rpx;

  .title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    line-height: 1.4;
    margin-bottom: 24rpx;
  }

  .author-info {
    display: flex;
    align-items: center;

    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 16rpx;
    }

    .info {
      .name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        margin-bottom: 4rpx;
      }

      .time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.article-content {
  font-size: 30rpx;
  color: #333;
  line-height: 1.8;
  margin-bottom: 60rpx;
  white-space: pre-wrap;
}

.interaction-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  padding: 0 32rpx;

  .action-item {
    display: flex;
    align-items: center;
    gap: 8rpx;

    text {
      font-size: 28rpx;
      color: #666;
    }
  }
}
</style>
