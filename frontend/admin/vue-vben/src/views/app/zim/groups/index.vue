<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Table } from 'ant-design-vue';

interface ZimGroup {
  gid: number;
  name: string;
  owner_uid: number;
  group_type: number;
  created_at: number;
}

const groups = ref<ZimGroup[]>([]);
const loading = ref(false);
const pagination = ref({ current: 1, pageSize: 20, total: 0 });
const columns = [
  { title: 'GID', dataIndex: 'gid', key: 'gid' },
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '群主 UID', dataIndex: 'owner_uid', key: 'owner_uid' },
  { title: '类型', dataIndex: 'group_type', key: 'group_type' },
];

async function load(page = 1) {
  loading.value = true;
  try {
    const offset = (page - 1) * pagination.value.pageSize;
    const token = import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token';
    const response = await fetch(`/zim-admin/groups?limit=${pagination.value.pageSize}&offset=${offset}`, {
      headers: { 'X-ZIM-Admin-Token': token },
    });
    const payload = await response.json();
    groups.value = payload?.data?.items ?? [];
    pagination.value = { ...pagination.value, current: page, total: groups.value.length };
  } finally {
    loading.value = false;
  }
}

function onChange(page: { current?: number }) {
  void load(page.current ?? 1);
}

onMounted(() => void load());
</script>

<template>
  <Page title="ZIM 群" description="ZIM 管理端只读群列表">
    <Table :columns="columns" :data-source="groups" :loading="loading" :pagination="pagination" row-key="gid" @change="onChange" />
  </Page>
</template>
