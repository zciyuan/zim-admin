<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Table } from 'ant-design-vue';

interface ZimAudit {
  id: number;
  operator: string;
  action: string;
  target: string;
  request_id: string;
  created_at: number;
}

const items = ref<ZimAudit[]>([]);
const loading = ref(false);
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '操作人', dataIndex: 'operator', key: 'operator' },
  { title: '动作', dataIndex: 'action', key: 'action' },
  { title: '目标', dataIndex: 'target', key: 'target' },
  { title: '时间', dataIndex: 'created_at', key: 'created_at' },
];

async function load() {
  loading.value = true;
  try {
    const token = import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token';
    const response = await fetch('/zim-admin/audit?limit=100', {
      headers: { 'X-ZIM-Admin-Token': token },
    });
    const payload = await response.json();
    items.value = payload?.data?.items ?? [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => void load());
</script>

<template>
  <Page title="ZIM 审计" description="ZIM 管理端操作审计">
    <Table :columns="columns" :data-source="items" :loading="loading" row-key="id" :pagination="false" />
  </Page>
</template>
