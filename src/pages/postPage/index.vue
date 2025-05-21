<template>
  <view class="container">
    <!-- 头部导航 -->
    <view class="nav-bar">
      <text class="page-title">发布帖子</text>
      <button class="submit-btn" :disabled="!postContent" @click="handlePush">
        发布
      </button>
    </view>

    <view class="content-wrapper">
      <!-- 内容编辑区 -->
      <view class="card">
        <input
          class="title-input"
          placeholder="请输入帖子标题"
          v-model="postTitle"
          maxlength="50"
        />
        <view class="divider"></view>
        <textarea
          class="content-input"
          placeholder="分享你的想法..."
          v-model="postContent"
          auto-height
          maxlength="500"
        />
      </view>

      <!-- 图片上传 -->
      <view class="card upload-section">
        <button class="upload-button" @click="chooseImage">+ 添加图片</button>
        <scroll-view class="preview-container" scroll-x>
          <view
            v-for="(img, index) in selectedImages"
            :key="index"
            class="preview-item"
          >
            <image :src="img" class="preview-image" mode="aspectFill" />
            <text class="iconfont icon-close" @click="handleImageDelete(index)"
              >&#xe602;</text
            >
          </view>
        </scroll-view>
      </view>

      <!-- 功能选项 -->
      <view class="card options-section">
        <view class="option-item" @click="selectTags">
          <uni-icons type="chat" size="20" />
          <text>{{ showTag || "选择标签" }}</text>
        </view>
        <view class="option-item" @click="getLocation">
          <uni-icons type="location" size="20" />
          <text>{{ location || "添加位置" }}</text>
        </view>
      </view>
    </view>

    <!-- 底部工具栏 -->
    <view class="toolbar">
      <uni-icons type="emoji" size="24" @click="openEmoji" />
      <uni-icons type="at" size="24" @click="mentionUser" />
      <uni-icons type="tag" size="24" @click="addTopic" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { postApi, fileApi } from "@/api";
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useUserStore } from "@/store/userStore";
const userStore = useUserStore();
const userInfo = userStore.getUserInfo;

const postTitle = ref("");
const postContent = ref("");
const selectedImages = ref<String[]>([]);
const location = ref("");
const showTag = ref("");
const comments = ref(1);
const uid = ref(0);
const postId = ref(0);
const selectedTags = ref<string[]>([
  "考研经验",
  "学习方法",
  "心态调整",
  "择校指导",
]);

const imageStyles = {
  width: 160,
  height: 160,
  border: {
    color: "#eee",
    width: "2rpx",
    style: "solid",
  },
};

const selectTags = () => {
  uni.showActionSheet({
    itemList: selectedTags.value,
    success: (res) => {
      const selectedTag = selectedTags.value[res.tapIndex];
      showTag.value = selectedTag;
    },
    fail: (res) => {
      console.log(res.errMsg);
    },
  });
};

const getLocation = async () => {
  try {
    const res = await uni.chooseLocation();
    location.value = res.address;
  } catch (error) {
    console.error("获取位置失败:", error);
  }
};

const chooseImage = () => {
  uni.chooseImage({
    count: 9,
    sizeType: ["original", "compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      const uploadPromises = res.tempFilePaths.map((path) => {
        return fileApi.upload(path).then((response) => {
          return response.data;
        });
      });
      Promise.all(uploadPromises).then((uploadedImages) => {
        selectedImages.value = selectedImages.value.concat(
          uploadedImages.map((image) => image)
        );
      });
    },
  });
};

const handleImageDelete = (index: number) => {
  selectedImages.value.splice(index, 1);
};

const handlePush = () => {
  if (postId.value === 0) {
    handleSubmit();
  } else {
    handleUpdate();
  }
}

const handleSubmit = async () => {
  if (!postTitle.value || !postContent.value) {
    uni.showToast({ title: "发布失败！请填写完整", icon: "none" });
    return;
  }
  if (userInfo.uid === 0) {
    uni.showToast({ title: "登录状态失效", icon: "none" });
    return;
  }
  const formData = {
    title: postTitle.value,
    content: postContent.value,
    imageList: selectedImages.value,
    location: location.value,
    tags: showTag.value,
    authorId: userInfo.uid,
  };

  uni.showLoading({ title: "发布中..." });
  try {
    postApi.createPost(formData).then(() => {
      uni.hideLoading();
      uni.showToast({ title: "发布成功" });
      uni.navigateBack();
    });
  } catch (error) {
    console.error("发布失败:", error);
    uni.hideLoading();
    uni.showToast({ title: "发布失败! 网络异常", icon: "none" });
  }
};

const handleUpdate = () => {
  if (!postTitle.value || !postContent.value) {
    uni.showToast({ title: "发布失败！请填写完整", icon: "none" });
    return;
  }
  if (userInfo.uid === 0) {
    uni.showToast({ title: "登录状态失效", icon: "none" });
    return;
  }
  if (postId.value === 0) {
    uni.showToast({ title: "网络异常，发布失败", icon: "none" });
    return;
  }
  const formData = {
    id: postId.value,
    title: postTitle.value,
    content: postContent.value,
    imageList: selectedImages.value,
    location: location.value,
    tags: showTag.value,
  };
  uni.showLoading({ title: "发布中..." });
  try {
    postApi.updatePost(formData).then(() => {
      uni.hideLoading();
      uni.showToast({ title: "发布成功" });
      uni.navigateBack();
    })
  } catch (error) {
    console.error("发布失败:", error);
    uni.hideLoading();
    uni.showToast({ title: "发布失败! 网络异常", icon: "none" });
  }
};

const navigateBack = () => {
  uni.navigateBack();
};

onLoad( async (options) => {
  if (options && options.id) {
    postId.value = Number(options.id);
    const res = await postApi.getPostDetail(postId.value);
    postContent.value = res.data.content;
    postTitle.value = res.data.title;
    location.value = res.data.location;
    showTag.value = res.data.tags;
    comments.value = res.data.comments;
    if (res.data.imageList.length > 0) {
      selectedImages.value = [...selectedImages.value, ...res.data.imageList];
    }
  }
});

</script>

<style lang="scss">
.container {
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding-bottom: 120rpx; // 为底部工具栏留出空间
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between; // 使标题和按钮分布在两端
  padding: 20rpx 30rpx;
  background: linear-gradient(0deg, #f5f7fa 0%, #bbd3f9 100%);
  border-bottom: 5rpx solid #e0e0e0; // 更柔和的边框
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 10rpx;
  position: sticky; // 可选：使导航栏在滚动时固定在顶部
  top: 0;
  z-index: 1000;

  .page-title {
    font-size: 35rpx; // 稍大字体
    font-weight: bold;
    color: #333;
  }

  .submit-btn {
    background-color: #007aff;
    color: #fff;
    padding: 5rpx 30rpx; // 调整内边距
    border-radius: 30rpx; // 更圆润的边角
    font-size: 28rpx;
    font-weight: 50;
    box-shadow: 0 2rpx 6rpx rgba(0, 122, 255, 0.3);
    transition: background-color 0.2s;
    left: 220rpx;

    &:active {
      background-color: #0056b3;
    }

    &[disabled] {
      background-color: #9cccf9;
      color: #ffffff;
      border-color: #cccccc;
      box-shadow: none;
    }
  }
}

.content-wrapper {
  padding: 0 20rpx; // 为内部卡片元素添加左右边距
}

.card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(31, 45, 61, 0.08);
}

.title-input {
  width: 100%;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  padding-bottom: 20rpx;
  border: none;
  background-color: transparent;
  &:focus {
    outline: none;
  }
}

.divider {
  height: 1rpx;
  background-color: #e0e0e0;
  margin: 20rpx 0;
}

.content-input {
  width: 100%;
  min-height: 200rpx; // 调整最小高度
  font-size: 30rpx;
  line-height: 1.6;
  color: #555;
  background-color: transparent;
  padding: 0;
}

.upload-section {
  // 使用card样式
  .upload-button {
    background-color: #489df8;
    color: white;
    border: none;
    border-radius: 18rpx;
    font-size: 28rpx;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    &:active {
      background-color: #63a8f1;
    }
  }
}

.preview-container {
  margin-top: 20rpx;
  white-space: nowrap;

  .preview-item {
    position: relative;
    display: inline-block;
    margin-right: 16rpx;
    width: 180rpx; // 调整预览图大小
    height: 180rpx;
    border-radius: 8rpx;
    overflow: hidden; // 确保图片在圆角内

    .preview-image {
      width: 100%;
      height: 100%;
    }

    .icon-close {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      border-radius: 50%;
      width: 36rpx;
      height: 36rpx;
      font-size: 20rpx; // 调整图标大小
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 36rpx; // 确保图标垂直居中
    }
  }
}

.options-section {
  // 使用card样式
  .option-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eee;

    text {
      font-size: 28rpx;
      color: #333;
    }
  }
}

.toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1rpx solid #e0e0e0;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
  z-index: 100;

  uni-icons {
    font-size: 48rpx; // 增大图标
    color: #555; // 图标颜色
    padding: 10rpx; // 增加点击区域
    transition: color 0.2s;
    &:active {
      color: #007aff;
    }
  }
}
</style>
