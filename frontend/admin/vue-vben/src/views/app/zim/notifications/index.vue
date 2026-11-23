<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Input, Table } from 'ant-design-vue';
import { useAccessStore } from '@vben/stores';

interface Notice { id: number; title: string; content: string; published_at: number; }
const items = ref<Notice[]>([]);
const access = useAccessStore();
const canPublish = computed(() => access.accessCodes.includes('zim:config:write'));
const title = ref('''');
const content = ref('');

function headers() {
  return {
    'Content-Type': 'application/json',
    'X-ZIM-Admin-Token': import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token',
  };
}

async function load() {
  const response = await fetch('/zim-admin/notifications', { headers: headers() });
  const payload = await response.json();
  items.value = payload?.data?.items ?? [];
}

async function publish() {
  if (!title.value) return;
  await fetch('/zim-admin/notifications', {
    method: 'POST', headers: headers(), body: JSON.stringify({ title: title.value, content: content.value }),
  });
  title.value = '';
  content.value = '';
  await load();
}

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '发布时间', dataIndex: 'published_at', key: 'published_at' },
];

onMounted(() => void load());
</script>

<template>
  <Page title="ZIM 公告" description="系统公告发布">
    <div class="mb-4 flex gap-2">
      <Input v-model:value="title" placeholder="标题" class="max-w-60" />
      <Input v-model:value="content" placeholder="内容" class="max-w-80" />
      <Button v-if="canPublish" type="primary" @click="publish">发布</Button>
    </div>
    <Table :columns="columns" :data-source="items" row-key="id" :pagination="false" />
  </Page>
</template>

