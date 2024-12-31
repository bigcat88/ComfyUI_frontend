import { createPinia, setActivePinia } from 'pinia'

import { api } from '@/scripts/api'
import { useSettingStore } from '@/stores/settingStore'
import type { SettingParams } from '@/types/settingTypes'

// Mock the api
jest.mock('@/scripts/api', () => ({
  api: {
    getSettings: jest.fn(),
    storeSetting: jest.fn()
  }
}))

// Mock the app
jest.mock('@/scripts/app', () => ({
  app: {
    ui: {
      settings: {
        dispatchChange: jest.fn()
      }
    }
  }
}))

describe('useSettingStore', () => {
  let store: ReturnType<typeof useSettingStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useSettingStore()
    jest.clearAllMocks()
  })

  it('should initialize with empty settings', () => {
    expect(store.settingValues).toEqual({})
    expect(store.settingsById).toEqual({})
    expect(store.settingTree.children).toEqual([])
  })

  describe('loadSettingValues', () => {
    it('should load settings from API', async () => {
      const mockSettings = { 'test.setting': 'value' }
      ;(api.getSettings as jest.Mock).mockResolvedValue(mockSettings)

      await store.loadSettingValues()

      expect(store.settingValues).toEqual(mockSettings)
      expect(api.getSettings).toHaveBeenCalled()
    })

    it('should throw error if settings are loaded after registration', async () => {
      const setting: SettingParams = {
        id: 'test.setting',
        name: 'test.setting',
        type: 'text',
        defaultValue: 'default'
      }
      store.addSetting(setting)

      await expect(store.loadSettingValues()).rejects.toThrow(
        'Setting values must be loaded before any setting is registered.'
      )
    })
  })

  describe('addSetting', () => {
    it('should register a new setting', () => {
      const setting: SettingParams = {
        id: 'test.setting',
        name: 'test.setting',
        type: 'text',
        defaultValue: 'default'
      }

      store.addSetting(setting)

      expect(store.settingsById['test.setting']).toEqual(setting)
    })

    it('should throw error for duplicate setting ID', () => {
      const setting: SettingParams = {
        id: 'test.setting',
        name: 'test.setting',
        type: 'text',
        defaultValue: 'default'
      }

      store.addSetting(setting)
      expect(() => store.addSetting(setting)).toThrow(
        'Setting test.setting must have a unique ID.'
      )
    })

    it('should migrate deprecated values', () => {
      const setting: SettingParams = {
        id: 'test.setting',
        name: 'test.setting',
        type: 'text',
        defaultValue: 'default',
        migrateDeprecatedValue: (value: string) => value.toUpperCase()
      }

      store.settingValues['test.setting'] = 'oldvalue'
      store.addSetting(setting)

      expect(store.settingValues['test.setting']).toBe('OLDVALUE')
    })
  })

  describe('get and set', () => {
    it('should get default value when setting not exists', () => {
      const setting: SettingParams = {
        id: 'test.setting',
        name: 'test.setting',
        type: 'text',
        defaultValue: 'default'
      }
      store.addSetting(setting)

      expect(store.get('test.setting')).toBe('default')
    })

    it('should set value and trigger onChange', async () => {
      const onChangeMock = jest.fn()
      const setting: SettingParams = {
        id: 'test.setting',
        name: 'test.setting',
        type: 'text',
        defaultValue: 'default',
        onChange: onChangeMock
      }
      store.addSetting(setting)

      await store.set('test.setting', 'newvalue')

      expect(store.get('test.setting')).toBe('newvalue')
      expect(onChangeMock).toHaveBeenCalledWith('newvalue')
      expect(api.storeSetting).toHaveBeenCalledWith('test.setting', 'newvalue')
    })
  })
})