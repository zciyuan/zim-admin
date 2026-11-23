<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Table } from 'ant-design-vue';

interface Report {
  id: number;
  reporter_id: number;
  target_type: string;
  target_id: string;
  reason: string;
  status: number;
}
const items = ref<Report[]>([]);

function headers() {
  return {
    'Content-Type': 'application/json',
    'X-ZIM-Admin-Token': import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token',
  };
}

async function load() {
  const response = await fetch('/zim-admin/reports', { headers: headers() });
  const payload = await response.json();
  items.value = payload?.data?.items ?? [];
}

async function handle(id: number) {
  await fetch(`/zim-admin/reports/${id}/handle`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ status: 1 }),
  });
  await load();
}

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '举报人', dataIndex: 'reporter_id', key: 'reporter_id' },
  { title: '对象', dataIndex: 'target_id', key: 'target_id' },
  { title: '原因', dataIndex: 'reason', key: 'reason' },
  { title: '状态', dataIndex: 'status', key: 'status' },
];

onMounted(() => void load());
</script>

<template>
  <Page title="ZIM 举报" description="举报处理">
    <Table :columns="columns" :data-source="items" row-key="id" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Button v-if="record.status === 0" size="small" type="primary" @click="handle(record.id)">标记处理</Button>
          <span v-else>已处理</span>
        </template>
      </template>
    </Table>
  </Page>
</template>
