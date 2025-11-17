<template>
  <Card className="p-6">
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold mb-2">资源计算器</h2>
        <p class="text-sm text-muted-foreground">
          填写您的网络规模和功能需求，系统将自动推荐合适的一体机型号
        </p>
      </div>

      <!-- 网络设备 -->
      <InputSection title="网络设备">
        <InputField
          id="apCount"
          label="AP 数量"
          type="number"
          :modelValue="params.apCount"
          @update:modelValue="params.apCount = Number($event)"
          :min="0"
          :max="500"
          placeholder="0"
          tooltip="接入点（Access Point）数量"
          description="支持的 AP 数量：0-500"
        />
        <InputField
          id="switchCount"
          label="Switch 数量"
          type="number"
          :modelValue="params.switchCount"
          @update:modelValue="params.switchCount = Number($event)"
          :min="0"
          :max="200"
          placeholder="0"
          tooltip="交换机数量"
          description="支持的交换机数量：0-200"
        />
      </InputSection>

      <!-- 安防设备 -->
      <InputSection title="安防设备">
        <InputField
          id="ipcCount"
          label="IPC 数量"
          type="number"
          :modelValue="params.ipcCount"
          @update:modelValue="params.ipcCount = Number($event)"
          :min="0"
          :max="100"
          placeholder="0"
          tooltip="IP Camera（网络摄像头）数量"
          description="支持的摄像头数量：0-100"
        />

        <div v-if="params.ipcCount > 0" class="space-y-2">
          <Label>NVR 类型</Label>
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <input
                id="nvr-builtin"
                type="radio"
                name="nvrType"
                value="builtin"
                :checked="params.nvrType === 'builtin'"
                @change="params.nvrType = 'builtin'"
                class="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
              />
              <Label for="nvr-builtin" class="cursor-pointer">内置 NVR</Label>
            </div>
            <div class="flex items-center space-x-2">
              <input
                id="nvr-external"
                type="radio"
                name="nvrType"
                value="external"
                :checked="params.nvrType === 'external'"
                @change="params.nvrType = 'external'"
                class="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
              />
              <Label for="nvr-external" class="cursor-pointer">外置 NVR</Label>
            </div>
          </div>
        </div>
      </InputSection>

      <!-- 功能选项 -->
      <InputSection title="功能选项">
        <!-- AI 功能 -->
        <div class="space-y-3">
          <Checkbox
            id="enableAI"
            v-model="params.enableAI"
          >
            <span>AI 功能</span>
            <span class="ml-1 text-xs text-muted-foreground">（会显著增加资源消耗）</span>
          </Checkbox>

          <div v-if="params.enableAI && params.ipcCount > 0" class="ml-6 space-y-2">
            <Label>AI 模式</Label>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <input
                  id="ai-detection"
                  type="radio"
                  name="aiMode"
                  value="detection"
                  :checked="params.aiMode === 'detection'"
                  @change="params.aiMode = 'detection'"
                  class="h-4 w-4 text-primary"
                />
                <Label for="ai-detection" class="cursor-pointer text-sm">
                  人形车形检测
                </Label>
              </div>
              <div class="flex items-center space-x-2">
                <input
                  id="ai-peopleCount"
                  type="radio"
                  name="aiMode"
                  value="peopleCount"
                  :checked="params.aiMode === 'peopleCount'"
                  @change="params.aiMode = 'peopleCount'"
                  class="h-4 w-4 text-primary"
                />
                <Label for="ai-peopleCount" class="cursor-pointer text-sm">
                  People Count（人头计数）
                </Label>
              </div>
            </div>
          </div>
        </div>

        <!-- Security 功能 -->
        <div class="space-y-2">
          <Checkbox id="enableIPS" v-model="params.enableIPS">
            <span>IPS (入侵防御系统)</span>
            <span class="ml-1 text-xs text-orange-500">⚠️ 预估值</span>
          </Checkbox>

          <Checkbox id="enableDPI" v-model="params.enableDPI">
            DPI (深度包检测)
          </Checkbox>

          <Checkbox id="enableContentFilter" v-model="params.enableContentFilter">
            Content Filter (内容过滤)
          </Checkbox>
        </div>

        <!-- VPN & QoS -->
        <div class="space-y-2">
          <Checkbox id="enableVPN" v-model="params.enableVPN">
            <span>VPN 功能</span>
            <span class="ml-1 text-xs text-orange-500">⚠️ 预估值</span>
          </Checkbox>

          <Checkbox id="enableQoS" v-model="params.enableQoS">
            <span>QoS 功能</span>
            <span class="ml-1 text-xs text-orange-500">⚠️ 预估值</span>
          </Checkbox>
        </div>
      </InputSection>

      <!-- 重置按钮 -->
      <button
        @click="$emit('reset')"
        class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        重置参数
      </button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { InputParams } from '@/types';
import Card from '@/components/ui/Card.vue';
import Label from '@/components/ui/Label.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import InputSection from './InputSection.vue';
import InputField from './InputField.vue';

defineProps<{
  params: InputParams;
}>();

defineEmits<{
  reset: [];
}>();
</script>
