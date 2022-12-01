<template>
  <div class="icons-preview">
    <div class="title" title="点击展开收起" @click="handleCollapse(0)">symbol图标</div>
    <div class="wrapper" :class="{ show: collapsedArr.includes(0) }">
      <ul>
        <li
          class="item"
          :class="{ active: current === iconComponentName }"
          v-for="iconComponentName in iconNames2"
          :key="iconComponentName"
        >
          <svg-icon class="svg-icon" :name="iconComponentName" />
          <div class="item-name">{{ iconComponentName }}</div>
        </li>
      </ul>
    </div>
    <div class="title" title="点击展开收起" @click="handleCollapse(1)">component图标</div>
    <div class="wrapper" :class="{ show: collapsedArr.includes(1) }">
      <div class="search">
        <input v-model="keyword" placeholder="请输入关键字搜索" />点击图标进行复制
        <span v-if="copyText">{{ copyText }}</span>
      </div>
      <ul>
        <li
          class="item"
          :class="{ active: current === iconComponentName }"
          v-for="iconComponentName in icons"
          :key="iconComponentName"
          :title="iconComponentName"
          @click="copyName(iconComponentName)"
          @mouseenter="handleHover(iconComponentName, true)"
          @mouseleave="handleHover(iconComponentName)"
        >
          <component
            :is="iconComponentName"
            :style="{ fontSize: '36px' }"
            :color="current === iconComponentName ? '#2254f4' : '#486491'"
            size="36px"
          />
          <div class="item-name">{{ iconComponentName }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import * as icons from './components/icons/index.js';

export default {
  name: 'icons-preview',
  components: {
    ...icons,
  },
  data() {
    return {
      iconNames: Object.keys(icons),
      iconNames2: Object.values(icons).map((it) => it.name),
      keyword: '',
      copyText: '',
      current: '',
      collapsedArr: [0, 1],
    };
  },
  computed: {
    icons() {
      return this.iconNames.filter((name) => name.toLowerCase().indexOf(this.keyword) !== -1);
    },
  },
  methods: {
    handleCollapse(n) {
      if (this.collapsedArr.includes(n)) {
        this.collapsedArr = this.collapsedArr.filter((it) => it !== n);
      } else {
        this.collapsedArr = [...this.collapsedArr, n];
      }
    },
    handleHover(name, isHover) {
      if (isHover) {
        this.current = name;
      } else {
        this.current = '';
      }
    },
    copyName(name) {
      const input = document.createElement('input');
      input.setAttribute('readonly', 'readonly');
      input.setAttribute('value', name);
      document.body.appendChild(input);
      input.setSelectionRange(0, 9999);
      input.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
      }
      document.body.removeChild(input);
      this.copyText = `${name}复制成功`;
    },
  },
};
</script>

<style>
.icons-preview {
  width: 100%;
  max-width: 1200px;
  padding: 15px;
  margin: 0 auto;
  text-align: left;
}

.title {
  padding: 20px;
  font-size: 32px;
  border-bottom: 1px solid #f1f2f4;
  cursor: pointer;
}

.icons-preview .search {
  display: flex;
  align-items: center;
  padding: 16px 0;
}

.icons-preview .search input {
  width: 240px;
  box-sizing: border-box;
  margin: 0 12px 0 0;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: 'tnum';
  position: relative;
  display: inline-block;
  min-width: 0;
  padding: 4px 11px;
  color: #000000d9;
  font-size: 14px;
  line-height: 1.5715;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
}

.icons-preview .search input:hover {
  border-color: #2254f4;
  border-right-width: 1px !important;
}

.icons-preview .search input:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  border-right-width: 1px !important;
  outline: 0;
}

.icons-preview .search span {
  margin-left: 12px;
  color: #24b35f;
}

.icons-preview .wrapper {
  margin: 16px 0;
  margin: 0;
  height: 0;
  overflow: hidden;
}

.icons-preview .wrapper.show {
  height: auto;
}

.icons-preview .wrapper ul {
  display: flex;
  flex-flow: wrap;
  margin: 0;
  list-style: none;
  padding: 20px;
}

.icons-preview .item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 80px;
  padding: 8px;
  font-size: 24px;
  color: #486491;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color, transform 0.2s;
  --main-color: yellow;
  --second-color: black;
}

.icons-preview .item.active {
  --main-color: #2254f4;
  --second-color: red;
}

.icons-preview .item-name {
  margin-top: 12px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icons-preview .item:hover {
  transform: scale(1.2);
  background-color: #e7ecf3;
  --main-color: #2254f4;
  --second-color: red;
  color: #2254f4;
}

.item .svg-icon {
  flex-shrink: 0;
  font-size: 36px;
}
</style>
