<template>
  <div class="flex flex-col gap-6 w-[600px]">
    <div class="flex flex-col gap-4">
      <h2 class="text-2xl font-semibold text-neutral-100">
        {{ $t('install.desktopAppSettings') }}
      </h2>

      <p class="text-neutral-400 my-0">
        {{ $t('install.desktopAppSettingsDescription') }}
      </p>
    </div>

    <div class="flex flex-col bg-neutral-800 p-4 rounded-lg">
      <!-- Auto Update Setting -->
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-medium text-neutral-100">
            {{ $t('install.settings.autoUpdate') }}
          </h3>
          <p class="text-sm text-neutral-400 mt-1">
            {{ $t('install.settings.autoUpdateDescription') }}
          </p>
        </div>
        <ToggleSwitch v-model="autoUpdate" />
      </div>

      <Divider />

      <!-- Metrics Collection Setting -->
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-medium text-neutral-100">
            {{ $t('install.settings.allowMetrics') }}
          </h3>
          <p class="text-sm text-neutral-400 mt-1">
            {{ $t('install.settings.allowMetricsDescription') }}
          </p>
          <a
            href="#"
            class="text-sm text-blue-400 hover:text-blue-300 mt-1 inline-block"
            @click.prevent="showMetricsInfo"
          >
            {{ $t('install.settings.learnMoreAboutData') }}
          </a>
        </div>
        <ToggleSwitch v-model="allowMetrics" />
      </div>
    </div>

    <!-- Info Dialog -->
    <Dialog
      v-model:visible="showDialog"
      modal
      :header="$t('install.settings.dataCollectionDialog.title')"
    >
      <div class="text-neutral-300">
        <h4 class="font-medium mb-2">
          {{ $t('install.settings.dataCollectionDialog.whatWeCollect') }}
        </h4>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            {{ $t('install.settings.dataCollectionDialog.errorReports') }}
          </li>
          <li>
            {{ $t('install.settings.dataCollectionDialog.systemInfo') }}
          </li>
        </ul>

        <h4 class="font-medium mt-4 mb-2">
          {{ $t('install.settings.dataCollectionDialog.whatWeDoNotCollect') }}
        </h4>
        <ul class="list-disc pl-6 space-y-1">
          <li>
            {{
              $t('install.settings.dataCollectionDialog.personalInformation')
            }}
          </li>
          <li>
            {{ $t('install.settings.dataCollectionDialog.workflowContents') }}
          </li>
          <li>
            {{
              $t('install.settings.dataCollectionDialog.fileSystemInformation')
            }}
          </li>
          <li>
            {{
              $t(
                'install.settings.dataCollectionDialog.customNodeConfigurations'
              )
            }}
          </li>
        </ul>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import ToggleSwitch from 'primevue/toggleswitch'
import { ref } from 'vue'

const showDialog = ref(false)
const autoUpdate = defineModel('autoUpdate', { required: true })
const allowMetrics = defineModel('allowMetrics', { required: true })

const showMetricsInfo = () => {
  showDialog.value = true
}
</script>
