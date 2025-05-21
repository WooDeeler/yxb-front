<template>
  <view class="container">
    <!-- 加载动画 -->
    <uni-load-more
      v-if="loading"
      status="loading"
      :icon-size="16"
      :content-text="{
        contentdown: '上拉显示更多',
        contentrefresh: '正在加载...',
        contentnomore: '没有更多数据了',
      }"
    />

    <view class="post-list" v-if="posts.length > 0">
      <view v-for="(post, index) in posts" :key="post.id" class="post-item">
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
        <view class="post-content" @click="navigateToPostDetail(post)">
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
            />
          </view>
        </view>
        <view class="post-footer">
          <view class="actions-left">
            <view class="action-item">
              <uni-icons type="chat" size="20"></uni-icons>
            </view>
            <view class="action-item">
              <uni-icons
                :type="post.isLiked ? 'heart-filled' : 'heart'"
                size="20"
                :color="post.isLiked ? '#ff0000' : '#000000'"
              ></uni-icons>
              <text>{{ post.likes }}</text>
            </view>
          </view>
          <view class="actions-right">
            <button
              class="action-button edit-button"
              @click="handleEditPost(post.id)"
            >
              修改
            </button>
            <button
              class="action-button delete-button"
              @click="handleDeletePost(post.id, index)"
            >
              删除
            </button>
          </view>
        </view>
      </view>
    </view>
    <view v-else-if="!loading && posts.length === 0" class="empty-state">
      <uni-icons type="list" size="60" color="#ccc"></uni-icons>
      <text class="empty-text">您还没有发布任何帖子</text>
      <button class="empty-button" @click="navigateToPostPage">去发布</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { postApi } from "@/api"; 
import { useUserStore } from "@/store/userStore";
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
  comments: number;
}

const userStore = useUserStore();
const userInfo = userStore.getUserInfo;
const userId = ref<string | null>(null);
const posts = ref<Post[]>([]);
const loading = ref(false);
const page = ref(1);
const size = ref(10);

const navigateToPostDetail = (post: Post) => {
  uni.navigateTo({ url: `/pages/postDetail/index?id=${post.id}` });
};

const navigateToPostPage = () => {
  uni.navigateTo({ url: "/pages/postPage/index" });
};

const loadUserPosts = async (isRefresh = false) => {
  if (!userId.value) return;
  loading.value = true;
  try {
    const response = await postApi.getUserPost(userId.value);
    if (response.data && response.data.length > 0) {
      const newPosts = response.data.map((post) => ({
        ...post,
        updateTime: new Date(post.updateTime).toISOString().split("T")[0],
      }));
      posts.value = newPosts;
      if (!isRefresh) {
        page.value++;
      }
    } else {
      if (isRefresh) posts.value = [];
    }
  } catch (error) {
    console.error("Failed to load user posts:", error);
    uni.showToast({ title: "网络异常，加载帖子失败", icon: "none" });
  } finally {
    loading.value = false;
  }
};

onLoad(async (options) => {
  if (options && options.id) {
    userId.value = options.id;
    await loadUserPosts(true);
  } else {
    // 如果没有uid，尝试从store获取，如果store也没有，则提示错误或跳转
    if (userInfo && userInfo.uid) {
      userId.value = userInfo.uid;
      await loadUserPosts(true);
    } else {
      uni.showToast({
        title: "未获取到用户信息",
        icon: "none",
        duration: 2000,
        complete: () => {
          setTimeout(() => {
            uni.navigateBack();
          }, 2000);
        },
      });
    }
  }
});

onPullDownRefresh(() => {
  page.value = 1;
  loadUserPosts(true);
  uni.stopPullDownRefresh();
});

onReachBottom(() => {
  if (!loading.value) {
    loadUserPosts();
  }
});

const handleEditPost = (postId: number) => {
  uni.navigateTo({ url: `/pages/postPage/index?id=${postId}` });
};

const handleDeletePost = async (postId: number, index: number) => {
  uni.showModal({
    title: "提示",
    content: "确定要删除这篇帖子吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          // 调用删除接口
          await postApi.deletePost(postId);
          posts.value.splice(index, 1);
          uni.showToast({ title: "删除成功", icon: "success" });
        } catch (error) {
          console.error("Failed to delete post:", error);
          uni.showToast({ title: "网络异常！删除失败", icon: "none" });
        }
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.post-list {
  .post-item {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);

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
          .tag {
            font-size: 20rpx;
            color: #007aff;
            background-color: rgba(0, 122, 255, 0.1);
            padding: 4rpx 12rpx;
            border-radius: 12rpx;
          }
        }
      }
    }

    .post-content {
      margin-bottom: 16rpx;
      .title {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        color: #222;
        margin-bottom: 8rpx;
        line-height: 1.4;
      }

      .content {
        display: block;
        font-size: 28rpx;
        color: #555;
        line-height: 1.6;
        margin-bottom: 12rpx;
        // 多行省略
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3; // 显示3行
        -webkit-box-orient: vertical;
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
          background-color: #f0f0f0;
        }
      }
    }

    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1rpx solid #f0f0f0;
      padding-top: 16rpx;

      .actions-left {
        display: flex;
        align-items: center;
        .action-item {
          display: flex;
          align-items: center;
          margin-right: 24rpx;
          color: #666;
          font-size: 24rpx;
          uni-icons {
            margin-right: 6rpx;
          }
        }
      }

      .actions-right {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .action-button {
          font-size: 24rpx;
          padding: 8rpx 20rpx;
          border-radius: 30rpx;
          line-height: 1.5;
          margin: 0; // uni-app button 默认有 margin
          &::after {
            border: none; // uni-app button 默认有 border
          }
        }
        .edit-button {
          background-color: #007aff;
          color: white;
        }
        .delete-button {
          background-color: #ff4d4f;
          color: white;
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
  color: #999;

  .empty-text {
    font-size: 28rpx;
    margin-top: 20rpx;
    margin-bottom: 40rpx;
  }

  .empty-button {
    font-size: 28rpx;
    background-color: #007aff;
    color: white;
    padding: 10rpx 40rpx;
    border-radius: 40rpx;
    &::after {
      border: none;
    }
  }
}
</style>
