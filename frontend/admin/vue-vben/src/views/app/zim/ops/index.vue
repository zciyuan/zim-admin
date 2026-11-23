<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Table } from 'ant-design-vue';

interface PushCert { platform: number; configured: boolean; updated_at: number; }
const stats = ref<Record<string, number>>({});
const certs = ref<PushCert[]>([]);
const columns = [
  { title: '平台', dataIndex: 'platform', key: 'platform' },
  { title: '已配置', dataIndex: 'configured', key: 'configured' },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at' },
];

onMounted(async () => {
  const token = import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token';
  const response = await fetch('/zim-admin/ops', { headers: { 'X-ZIM-Admin-Token': token } });
  const payload = await response.json();
  stats.value = payload?.data?.stats ?? {};
  certs.value = payload?.data?.push_certs ?? [];
});
</script>

<template>
  <Page title="ZIM 运营" description="运营概览与推送证书">
    <div class="mb-4 flex gap-4">
      <Card title="用户总数">{{ stats.users ?? 0 }}</Card>
      <Card title="群总数">{{ stats.groups ?? 0 }}</Card>
    </div>
    <Table :columns="columns" :data-source="certs" row-key="platform" :pagination="false" />
  </Page>
</template>
