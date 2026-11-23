<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Input, Table } from 'ant-design-vue';

interface ZimMessage {
  server_msg_id: string;
  client_msg_id: string;
  conversation_id: string;
  seq: number;
  send_id: number;
  recv_id: number;
  group_id: number;
  msg_type: number;
  content: string;
}

const cid = ref('s_10001_10002');
const messages = ref<ZimMessage[]>([]);
const loading = ref(false);
const columns = [
  { title: 'Seq', dataIndex: 'seq', key: 'seq' },
  { title: '发送者', dataIndex: 'send_id', key: 'send_id' },
  { title: '接收者', dataIndex: 'recv_id', key: 'recv_id' },
  { title: '类型', dataIndex: 'msg_type', key: 'msg_type' },
  { title: '内容', dataIndex: 'content', key: 'content' },
];

async function load() {
  loading.value = true;
  try {
    const token = import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token';
    const query = new URLSearchParams({ conversation_id: cid.value, begin_seq: '0', end_seq: '0', limit: '50' });
    const response = await fetch(`/zim-admin/messages?${query}`, {
      headers: { 'X-ZIM-Admin-Token': token },
    });
    const payload = await response.json();
    messages.value = payload?.data?.items ?? [];
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Page title="ZIM 消息" description="按会话查询消息">
    <div class="mb-4 flex gap-2">
      <Input v-model:value="cid" class="max-w-80" placeholder="conversation_id" />
      <Button type="primary" @click="load">查询</Button>
    </div>
    <Table :columns="columns" :data-source="messages" :loading="loading" row-key="server_msg_id" :pagination="false" />
  </Page>
</template>
