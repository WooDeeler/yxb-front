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

    <view class="content-container">
      <view class="article-content">
        <text>{{ post.content }}</text>
      </view>

      <view class="image-preview" v-if="post.images && post.images.length > 0">
        <view class="image-grid">
          <image
            v-for="(img, index) in post.images"
            :key="index"
            :src="img"
            mode="aspectFill"
            class="preview-image"
            @click="previewImage(index)"
          />
        </view>
      </view>
    </view>

    <view class="comment-section">
      <text class="section-title">评论区</text>

      <view class="comment-list">
        <view
          class="comment-item"
          v-for="(comment, index) in comments"
          :key="index"
        >
          <image
            class="comment-avatar"
            :src="comment.avatar"
            mode="aspectFill"
          ></image>
          <view class="comment-content">
            <text class="comment-name">{{ comment.username }}</text>
            <text class="comment-text">{{ comment.content }}</text>
            <text class="comment-time">{{ comment.time }}</text>
          </view>
        </view>
      </view>
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
  images?: string[];
}

interface Comment {
  username: string;
  avatar: string;
  content: string;
  time: string;
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
  images: [],
});

const comments = ref<Comment[]>([
  {
    username: "考研上岸",
    avatar: "/static/logo.png",
    content: "这个时间规划很合理，我也在这样安排",
    time: "5分钟前",
  },
  {
    username: "数学小王子",
    avatar: "/static/logo.png",
    content: "数学每天4小时会不会太少了？",
    time: "15分钟前",
  },
]);

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
    images: ["/static/posts/post-2.png", "/static/posts/post-3.png"],
  };
});

const previewImage = (index: number) => {
  uni.previewImage({
    current: index,
    urls: post.value.images || [],
  });
};
</script>

<style lang="scss">
.container {
  padding: 32rpx;
  background: linear-gradient(to bottom, #e6f2ff, #f5f5f5 200rpx);
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
      display: flex;
      flex-direction: column;
      .name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        margin-bottom: 4rpx;
      }

      .time {
        font-size: 24rpx;
        color: #999;
        margin-top: 8rpx;
      }
    }
  }
}

.content-container {
  margin-bottom: 40rpx;
  background-color: #f9f9f9;
  border-radius: 16rpx;
  padding: 32rpx;
}

.article-content {
  font-size: 30rpx;
  color: #333;
  line-height: 1.8;
  margin-bottom: 60rpx;
  white-space: pre-wrap;
}

.image-preview {
  margin-bottom: 40rpx;

  .image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;
    padding: 0 32rpx;

    .preview-image {
      width: 100%;
      height: 200rpx;
      border-radius: 8rpx;
      background-color: #f5f5f5;
    }
  }
}

.comment-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 120rpx;
  margin-top: 20rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }

  .comment-list {
    .comment-item {
      display: flex;
      margin-bottom: 32rpx;
      padding-bottom: 32rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .comment-avatar {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        margin-right: 16rpx;
      }

      .comment-content {
        flex: 1;

        .comment-name {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 8rpx;
        }

        .comment-text {
          font-size: 28rpx;
          color: #333;
          line-height: 1.5;
          margin-bottom: 8rpx;
          display: block;
        }

        .comment-time {
          font-size: 24rpx;
          color: #999;
          display: block;
          margin-top: 8rpx;
        }
      }
    }
  }
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
