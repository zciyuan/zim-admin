<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Table } from 'ant-design-vue';

interface ZimFamily {
  gid: number;
  name: string;
  owner_uid: number;
  created_at: number;
}

const families = ref<ZimFamily[]>([]);
const loading = ref(false);
const columns = [
  { title: 'GID', dataIndex: 'gid', key: 'gid' },
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '群主 UID', dataIndex: 'owner_uid', key: 'owner_uid' },
];

async function load() {
  loading.value = true;
  try {
    const token = import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token';
    const response = await fetch('/zim-admin/families?limit=50', {
      headers: { 'X-ZIM-Admin-Token': token },
    });
    const payload = await response.json();
    families.value = payload?.data?.items ?? [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => void load());
</script>

<template>
  <Page title="ZIM 家庭组" description="家庭组只读列表">
    <Table :columns="columns" :data-source="families" :loading="loading" row-key="gid" :pagination="false" />
  </Page>
</template>
