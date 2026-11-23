<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Input } from 'ant-design-vue';

const key = ref('site.name');
const value = ref('');
const message = ref('');

function headers() {
  return {
    'Content-Type': 'application/json',
    'X-ZIM-Admin-Token': import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token',
  };
}

async function load() {
  const response = await fetch(`/zim-admin/config/${key.value}`, { headers: headers() });
  const payload = await response.json();
  value.value = payload?.data?.value ?? '';
  message.value = '已读取';
}

async function save() {
  const response = await fetch(`/zim-admin/config/${key.value}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify({ value: value.value }),
  });
  message.value = response.ok ? '已保存' : '保存失败';
}
</script>

<template>
  <Page title="ZIM 配置" description="管理端键值配置">
    <div class="max-w-xl space-y-3">
      <Input v-model:value="key" addon-before="Key" />
      <Input v-model:value="value" addon-before="Value" />
      <div class="flex gap-2">
        <Button @click="load">读取</Button>
        <Button type="primary" @click="save">保存</Button>
        <span>{{ message }}</span>
      </div>
    </div>
  </Page>
</template>
