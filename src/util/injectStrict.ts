import { inject, type InjectionKey } from 'vue'

export function injectStrict<T>(key: InjectionKey<T>): T {
  const value = inject(key)
  if (value === undefined) {
    throw new Error(`Missing provider for injection key: ${String(key)}`)
  }
  return value as T
}
