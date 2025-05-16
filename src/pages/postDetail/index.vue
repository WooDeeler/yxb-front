<template>
  <view class="container">
    <view class="article-header">
      <text class="title">{{ post.title }}</text>
      <view class="author-info">
        <image class="avatar" :src="post.avatar" mode="aspectFill"></image>
        <view class="info">
          <text class="name">{{ post.username }}</text>
          <text class="time">{{ post.userUniversity }}</text>
        </view>
        <view
          class="follow-button"
          @click="toggleFollow"
          style="margin-left: auto"
        >
          <text>{{ post.isFav ? "已关注" : "关注" }}</text>
        </view>
      </view>
    </view>

    <view class="content-container">
      <view class="article-content">
        <text>{{ post.content }}</text>
      </view>

      <view class="image-preview">
        <view class="image-grid">
          <image
            v-for="(img, index) in post.imageList"
            :key="index"
            :src="img"
            mode="aspectFill"
            class="preview-image"
            @click="previewImage(index)"
          />
        </view>
      </view>
      <view class="location">
        <text>{{ post.location }}</text>
        <text>{{ post.updateTime }}</text>
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
          <view
            class="comment-content"
            @click="openCommentInput(comment.username)"
          >
            <text class="comment-name">{{ comment.username }}</text>
            <text class="comment-text">{{ comment.content }}</text>
            <view style="display: flex; width: 100%">
              <text class="comment-time">{{ comment.superName }}</text>
              <text class="comment-time" style="margin-left: auto">{{
                comment.createTime
              }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="interaction-bar">
      <view class="action-item" @click="openCommentInput()">
        <uni-icons type="chat" size="24"></uni-icons>
        <text>{{ post.comments }}</text>
      </view>
      <view class="action-item" @click.stop="toggleLike()">
        <uni-icons
          :type="post.isLiked ? 'heart-filled' : 'heart'"
          size="24"
          :color="post.isLiked ? '#ff0000' : '#000000'"
        ></uni-icons>
        <text>{{ post.likes }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { postApi, commentApi } from "@/api";

interface PostDetail {
  id: number;
  avatar: string;
  username: string;
  userUniversity: string;
  updateTime: string;
  title: string;
  content: string;
  likes: number;
  isLiked: boolean;
  imageList?: string[];
  location: string;
  tags?: string[];
}

interface Comment {
  superName: string;
  username: string;
  avatar: string;
  content: string;
  createTime: string;
}

const post = ref<PostDetail>({
  id: 0,
  avatar: "",
  username: "",
  userUniversity: "",
  updateTime: "",
  title: "",
  content: "",
  likes: 0,
  isLiked: false,
  imageList: [],
  location: "",
  tags: [],
  isFav: false,
});

const comments = ref<Comment[]>([]);

const postId = ref("");

onLoad((options) => {
  console.log("onLoad", options);
  if (options?.id) {
    postId.value = decodeURIComponent(options.id);
    getPostDetail(postId.value);
    queryComments(postId.value);
  }
});

const getPostDetail = async (pid: number) => {
  try {
    postApi.getPostDetail(pid).then((res) => {
      post.value = res.data;
      post.value.updateTime = new Date(post.value.updateTime)
        .toISOString()
        .split("T")[0];
    });
  } catch (error) {
    console.error("获取帖子详情失败:", error);
  }
};
const toggleLike = (index: number) => {
  post.value.isLiked = !post.value.isLiked;
  post.value.likes += post.value.isLiked ? 1 : -1;
};

const previewImage = (index: number) => {
  uni.previewImage({
    current: index,
    urls: post.value.images || [],
  });
};

const queryComments = async (pid: number) => {
  try {
    commentApi.commentList(pid).then((res) => {
      comments.value = res.data;
      post.value.comments = res.data.length;
    });
  } catch (error) {
    console.error("获取评论列表失败:", error);
  }
};

const commentInput = ref("");

const openCommentInput = (sname: string) => {
  uni.showModal({
    title: "添加评论",
    editable: true,
    placeholderText: "输入你的评论...",
    success: (res) => {
      if (res.confirm) {
        addComment(res.content, sname);
      }
    },
  });
};

const addComment = async (content, sname) => {
  if (!content) return;
  if (sname) {
    sname = "回复:" + sname;
  };
  const response = await commentApi.createComment({
      postId: postId.value,
      content: content,
      superName: sname,
      uid: 27,
  });
  queryComments(postId.value);
  post.value.comments += 1;
};

const toggleFollow = () => {
  post.value.isFav = !post.value.isFav;
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

    .follow-button {
      flex-shrink: 0;
      background-color: #71b3f8;
      border-radius: 20rpx;
      padding: 5rpx 22rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      height: 50rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 122, 255, 0.3);
      color: white; 
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
.location {
  font-size: 24rpx;
  color: #666;
  display: flex;
  background-color: #f5f7fa;
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
  gap: 15rpx;

  &::before {
    content: "📍";
    font-size: 24rpx;
  }
}
</style>
