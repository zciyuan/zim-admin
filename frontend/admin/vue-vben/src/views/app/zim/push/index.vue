<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Input, Table } from 'ant-design-vue';

interface PushCert { platform: number; configured: boolean; updated_at: number; }
const items = ref<PushCert[]>([]);
const platform = ref('2');
const cert = ref('');

function headers() {
  return {
    'Content-Type': 'application/json',
    'X-ZIM-Admin-Token': import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token',
  };
}

async function load() {
  const response = await fetch('/zim-admin/push/certs', { headers: headers() });
  const payload = await response.json();
  items.value = payload?.data?.items ?? [];
}

async function save() {
  await fetch(`/zim-admin/push/certs/${platform.value}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify({ cert: cert.value }),
  });
  cert.value = '';
  await load();
}

const columns = [
  { title: '平台', dataIndex: 'platform', key: 'platform' },
  { title: '已配置', dataIndex: 'configured', key: 'configured' },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at' },
];

onMounted(() => void load());
</script>

<template>
  <Page title="ZIM 推送" description="推送平台证书">
    <div class="mb-4 flex gap-2">
      <Input v-model:value="platform" placeholder="平台" class="max-w-24" />
      <Input v-model:value="cert" placeholder="证书内容" class="max-w-80" />
      <Button type="primary" @click="save">保存</Button>
    </div>
    <Table :columns="columns" :data-source="items" row-key="platform" :pagination="false" />
  </Page>
</template>
