<template>
  <view class="container">
    <view class="search-header">
      <view class="keyword-title">
        <text>搜索：</text>
        <text class="keyword">{{ searchKeyword }}</text>
      </view>
    </view>
    <view class="result-list">
      <view v-if="posts.length === 0" class="empty">
        <uni-icons type="search" size="48" color="#999" />
        <text class="empty-text">暂无搜索结果</text>
        <text class="empty-tip">换个关键词试试吧</text>
      </view>
      <view
        v-else
        v-for="(post, index) in posts"
        :key="index"
        class="post-item"
        @click="navigateToPostDetail(post)"
      >
        <view class="post-header">
          <image class="avatar" :src="post.avatar" mode="aspectFill"></image>
          <view class="user-info">
            <view class="user-basic">
              <text class="username">{{ post.username }}</text>
              <text class="university">{{ post.userUniversity }}</text>
            </view>
            <view class="post-tags" v-if="post.tags && post.tags.length > 0">
              <text class="tag">{{ post.tags }}</text>
            </view>
          </view>
        </view>
        <view class="post-content">
          <text class="title">{{ post.title }}</text>
          <text class="content">{{ post.content }}</text>
          <view
            class="post-images"
            v-if="post.imageList && post.imageList.length > 0"
          >
            <image
              v-for="(img, idx) in post.imageList.slice(0, 3)"
              :key="idx"
              :src="img"
              mode="aspectFill"
              class="post-image"
              @click="previewImage(post.imageList, idx)"
            />
          </view>
        </view>
        <view class="post-footer">
          <view class="actions-left">
            <view class="action-item">
              <uni-icons type="chat" size="20"></uni-icons>
              <text>{{ post.comments }}</text>
            </view>
            <view class="action-item" @click.stop="toggleLike(index)">
              <uni-icons
                :type="post.isLiked ? 'heart-filled' : 'heart'"
                size="20"
                :color="post.isLiked ? '#ff0000' : '#000000'"
              ></uni-icons>
              <text>{{ post.likes }}</text>
            </view>
          </view>
          <view class="location">
            <text>{{ post.location }}</text>
            <text>{{ post.updateTime }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { postApi } from "@/api";
interface Post {
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
const searchKeyword = ref("");

const posts = ref<Post[]>([]);

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    loadSearchResults(searchKeyword.value, true);
  }
};

const loadSearchResults = async (keyword: string) => {
  try {
    const response = await postApi.condQuery({
      title: keyword,
      type: "1",
    });

    let newPosts = [];
    if (!response.data || response.data.length === 0) {
      // 如果接口返回空数据，使用示例数据
      newPosts = posts.value.map((post) => ({
        ...post,
        updateTime: `${new Date().getFullYear()}-${String(
          new Date().getMonth() + 1
        ).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`,
        comments: countComments(post.comments),
      }));
    } else {
      newPosts = response.data.list.map((post) => ({
        ...post,
        updateTime: `${new Date(post.updateTime).getFullYear()}-${String(
          new Date(post.updateTime).getMonth() + 1
        ).padStart(2, "0")}-${String(
          new Date(post.updateTime).getDate()
        ).padStart(2, "0")}`,
        comments: countComments(post.comments),
      }));
    }
    posts.value = newPosts;
  } catch (error) {
    console.error("搜索失败:", error);
    uni.showToast({
      title: "搜索失败，请稍后重试",
      icon: "none",
    });
  }
};
const countComments = (str: string) => {
  if (!str) return 0;
  return str.split(",").length;
};

const handleLike = (post: Post) => {
  post.isLiked = !post.isLiked;
  if (post.isLiked) {
    post.likes++;
  } else {
    post.likes--;
  }
};

const navigateToPostDetail = (post: Post) => {
  uni.navigateTo({
    url: `/pages/postDetail/index?id=${post.id}`,
  });
};

onLoad((options) => {
  if (options?.keyword) {
    searchKeyword.value = decodeURIComponent(options.keyword);
    loadSearchResults(searchKeyword.value, true);
  }
});
</script>

<style lang="scss">
.container {
  padding: 20rpx;
  background-color: #f5f5f5;

  .search-header {
    padding: 30rpx 0;
    margin-bottom: 30rpx;
    background: linear-gradient(135deg, #007aff, #00c6ff);
    border-radius: 0 0 30rpx 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.2);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 60%
      );
      animation: shine 3s infinite linear;
    }

    .keyword-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34rpx;
      color: #ffffff;
      text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 1;

      &::before {
        content: "🔍";
        margin-right: 12rpx;
        font-size: 36rpx;
      }

      text {
        opacity: 0.9;
      }

      .keyword {
        color: #ffffff;
        font-weight: bold;
        margin-left: 12rpx;
        padding: 4rpx 16rpx;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 20rpx;
        backdrop-filter: blur(4px);
        transition: all 0.3s ease;

        &:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.25);
        }
      }
    }
  }

  @keyframes shine {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .result-list {
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 120rpx 40rpx;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.9),
        rgba(245, 247, 250, 0.9)
      );
      border-radius: 24rpx;
      box-shadow: 0 8rpx 32rpx rgba(31, 45, 61, 0.08);
      animation: fadeInUp 0.6s ease-out;

      .uni-icons {
        background: linear-gradient(135deg, #1e90ff, #00ffff);
        border-radius: 50%;
        padding: 24rpx;
        margin-bottom: 24rpx;
        box-shadow: 0 8rpx 24rpx rgba(30, 144, 255, 0.4),
          0 0 40rpx rgba(0, 255, 255, 0.2);
        animation: pulse 2s infinite;
      }

      .empty-text {
        margin-top: 24rpx;
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
        text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
      }

      .empty-tip {
        margin-top: 16rpx;
        font-size: 28rpx;
        color: #666;
        background: rgba(102, 102, 102, 0.1);
        padding: 8rpx 24rpx;
        border-radius: 32rpx;
        transition: all 0.3s ease;

        &:active {
          transform: scale(0.98);
          background: rgba(102, 102, 102, 0.15);
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(40rpx);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }
    }

    .post-item {
      position: relative;
      overflow: hidden;
      background-color: #fff;
      border-radius: 16rpx;
      padding: 24rpx;
      margin-bottom: 24rpx;
      box-shadow: 0 4rpx 16rpx rgba(31, 45, 61, 0.1),
        0 8rpx 24rpx rgba(31, 45, 61, 0.06);
      border: 1rpx solid rgba(0, 0, 0, 0.05);
      /* Added subtle border */
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 16rpx;
        /* Increased height */
        background: linear-gradient(90deg, #007aff, #00c6ff);
      }

      &:hover {
        transform: translateY(-2rpx);
        box-shadow: 0 8rpx 24rpx rgba(31, 45, 61, 0.15),
          0 16rpx 32rpx rgba(31, 45, 61, 0.1);
      }
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
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex: 1;

        .user-basic {
          display: flex;
          flex-direction: column;

          .username {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
          }

          .university {
            font-size: 24rpx;
            color: #666;
          }
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8rpx;

          .tag {
            font-size: 20rpx;
            color: #007aff;
            background-color: rgba(0, 122, 255, 0.1);
            padding: 4rpx 12rpx;
            border-radius: 12rpx;
            border: 1rpx solid rgba(0, 122, 255, 0.2);
          }
        }
      }
    }

    .post-content {
      margin-bottom: 24rpx;
      /* Increased margin */

      .title {
        display: block; // Ensure title is on its own line
        font-size: 34rpx;
        font-weight: bold;
        color: #222;
        margin-bottom: 12rpx;
        line-height: 1.4;
      }

      .content {
        display: block; // Ensure content is on its own line
        font-size: 28rpx;
        color: #555;
        line-height: 1.6;
        margin-bottom: 4rpx;
      }

      .post-images {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10rpx;
        margin-top: 16rpx;

        .post-image {
          width: 100%;
          height: 180rpx;
          border-radius: 8rpx;
          background-color: #f5f5f5;
        }
      }
    }

    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1rpx solid #f0f0f0;
      padding-top: 20rpx;

      .actions-left {
        display: flex;
        align-items: center;
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
}
</style>
