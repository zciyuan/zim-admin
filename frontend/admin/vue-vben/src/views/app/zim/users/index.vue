<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Table } from 'ant-design-vue';

interface ZimUser {
  uid: number;
  username: string;
  nickname: string;
  status: number;
  created_at: number;
}

const users = ref<ZimUser[]>([]);
const loading = ref(false);
const pagination = ref({ current: 1, pageSize: 20, total: 0 });

const columns = [
  { title: 'UID', dataIndex: 'uid', key: 'uid' },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }: { text: number }) => (text === 0 ? '正常' : '封禁'),
  },
];

async function loadUsers(page = 1) {
  loading.value = true;
  try {
    const offset = (page - 1) * pagination.value.pageSize;
    const token = import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token';
    const response = await fetch(
      `/zim-admin/users?limit=${pagination.value.pageSize}&offset=${offset}`,
      { headers: { 'X-ZIM-Admin-Token': token } },
    );
    const payload = await response.json();
    users.value = payload?.data?.items ?? [];
    pagination.value = { ...pagination.value, current: page, total: users.value.length };
  } finally {
    loading.value = false;
  }
}

function handleTableChange(page: { current?: number }) {
  void loadUsers(page.current ?? 1);
}

onMounted(() => {
  void loadUsers();
});
</script>

<template>
  <Page title="ZIM 用户" description="ZIM 管理端只读用户列表">
    <Table
      :columns="columns"
      :data-source="users"
      :loading="loading"
      :pagination="pagination"
      row-key="uid"
      @change="handleTableChange"
    />
  </Page>
</template>
