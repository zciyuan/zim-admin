<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Input, Table } from 'ant-design-vue';

interface Word { id: number; word: string; action: number; }
const items = ref<Word[]>([]);
const word = ref('');

function headers() {
  return {
    'Content-Type': 'application/json',
    'X-ZIM-Admin-Token': import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token',
  };
}

async function load() {
  const response = await fetch('/zim-admin/sensitive-words', { headers: headers() });
  const payload = await response.json();
  items.value = payload?.data?.items ?? [];
}

async function add() {
  if (!word.value) return;
  await fetch('/zim-admin/sensitive-words', {
    method: 'POST', headers: headers(), body: JSON.stringify({ word: word.value, action: 1 }),
  });
  word.value = '';
  await load();
}

async function remove(id: number) {
  await fetch(`/zim-admin/sensitive-words/${id}`, { method: 'DELETE', headers: headers() });
  await load();
}

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '敏感词', dataIndex: 'word', key: 'word' },
  {
    title: '操作', key: 'action',
    customRender: ({ record }: { record: Word }) => record.id,
  },
];

onMounted(() => void load());
</script>

<template>
  <Page title="ZIM 敏感词" description="敏感词管理">
    <div class="mb-4 flex gap-2">
      <Input v-model:value="word" placeholder="新增敏感词" class="max-w-60" />
      <Button type="primary" @click="add">添加</Button>
    </div>
    <Table :columns="columns" :data-source="items" row-key="id" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Button danger size="small" @click="remove(record.id)">删除</Button>
        </template>
      </template>
    </Table>
  </Page>
</template>
