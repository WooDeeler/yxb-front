<template>
  <view class="container">
    <view class="search-header">
      <view class="keyword-title">
        <text>搜索：</text>
        <text class="keyword">{{ searchKeyword }}</text>
      </view>
    </view>
    <view class="result-list">
      <view v-if="results.length === 0" class="empty">
        <uni-icons type="search" size="48" color="#999" />
        <text class="empty-text">暂无搜索结果</text>
        <text class="empty-tip">换个关键词试试吧</text>
      </view>
      <view
        v-else
        v-for="(item, index) in results"
        :key="index"
        class="post-item"
        @click="navigateToPostDetail(item)"
      >
        <view class="post-header">
          <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
          <view class="user-info">
            <text class="username">{{ item.username }}</text>
            <text class="time">{{ item.time }}</text>
          </view>
        </view>
        <view class="post-content">
          <text class="title">{{ item.title }}</text>
          <text class="content">{{ item.content }}</text>
        </view>
        <view class="post-footer">
          <view class="action-item">
            <uni-icons type="chat" size="18" color="#666" />
            <text>{{ item.comments || 0 }}</text>
          </view>
          <view class="action-item" @click.stop="handleLike(item)">
            <uni-icons
              :type="item.isLiked ? 'heart-filled' : 'heart'"
              size="18"
              :color="item.isLiked ? '#ff0000' : '#666'"
            />
            <text>{{ item.likes || 0 }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const searchKeyword = ref("");
interface PostItem {
  id: number;
  title: string;
  content: string;
  username: string;
  avatar: string;
  time: string;
  comments: number;
  likes: number;
  isLiked: boolean;
}

const results = ref<PostItem[]>([]);

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    loadSearchResults(searchKeyword.value);
  }
};

const loadSearchResults = (keyword: string) => {
  // 模拟搜索结果数据
  results.value = [
    {
      id: 1,
      title: "考研数学复习经验分享",
      content: "分享一下我考研数学从140分到172分的心得体会...",
      username: "数学大神",
      avatar: "/static/logo.png",
      time: "2小时前",
      comments: 23,
      likes: 45,
      isLiked: false,
    },
    {
      id: 2,
      title: "英语作文高分技巧",
      content: "总结了近五年考研英语作文的答题技巧和常见话题...",
      username: "英语达人",
      avatar: "/static/logo.png",
      time: "4小时前",
      comments: 15,
      likes: 32,
      isLiked: false,
    },
  ];
};

const handleLike = (post: PostItem) => {
  post.isLiked = !post.isLiked;
  if (post.isLiked) {
    post.likes++;
  } else {
    post.likes--;
  }
};

const navigateToPostDetail = (post: PostItem) => {
  uni.navigateTo({
    url: `/pages/postDetail/index?id=${post.id}`,
  });
};

onLoad((options) => {
  if (options?.keyword) {
    searchKeyword.value = decodeURIComponent(options.keyword);
    loadSearchResults(searchKeyword.value);
  }
});
</script>

<style lang="scss">
.container {
  padding: 20rpx;
  background-color: #f5f5f5;

  .search-header {
    padding: 20rpx 0;
    margin-bottom: 20rpx;

    .keyword-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: #333;

      .keyword {
        color: #007aff;
        font-weight: bold;
        margin-left: 10rpx;
      }
    }
  }

  .result-list {
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 100rpx 0;
      .empty-text {
        margin-top: 20rpx;
        font-size: 32rpx;
        color: #666;
      }
      .empty-tip {
        margin-top: 10rpx;
        font-size: 26rpx;
        color: #999;
      }
    }

    .post-item {
      margin-bottom: 20rpx;
      padding: 30rpx;
      background-color: #fff;
      border-radius: 12rpx;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);

      .post-header {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;

        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }

        .user-info {
          flex: 1;
          .username {
            font-size: 28rpx;
            color: #333;
            font-weight: bold;
          }
          .time {
            font-size: 24rpx;
            color: #999;
            margin-top: 4rpx;
          }
        }
      }

      .post-content {
        .title {
          font-size: 32rpx;
          color: #333;
          font-weight: bold;
          margin-bottom: 10rpx;
        }
        .content {
          font-size: 28rpx;
          color: #666;
          line-height: 1.6;
        }
      }

      .post-footer {
        display: flex;
        margin-top: 20rpx;
        padding-top: 20rpx;
        border-top: 1rpx solid #eee;

        .action-item {
          display: flex;
          align-items: center;
          margin-right: 40rpx;

          text {
            font-size: 24rpx;
            color: #666;
            margin-left: 8rpx;
          }
        }
      }
    }
  }
}
</style>
