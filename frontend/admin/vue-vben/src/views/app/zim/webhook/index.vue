<script lang="ts" setup>
import { Page } from '@vben/common-ui';

const events = [
  'message.created',
  'message.recalled',
  'friend.request',
  'friend.accepted',
  'friend.rejected',
  'friend.deleted',
  'group.created',
  'group.apply',
  'group.member.joined',
  'group.member.updated',
  'group.member.left',
  'group.dismissed',
];
</script>

<template>
  <Page title="ZIM Webhook" description="回调事件与失败重试">
    <div class="max-w-3xl space-y-3">
      <p>回调失败重试 3 次，最终写入 <code>zim_webhook_dlq</code>，可用 <code>tools/webhookdlq</code> 重放。</p>
      <ul class="list-disc pl-6">
        <li v-for="event in events" :key="event">{{ event }}</li>
      </ul>
    </div>
  </Page>
</template>
