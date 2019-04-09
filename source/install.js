import { register } from './mixin'

export const _install = (_Vue, options) => {
  const { initial, acceptLocalRules, globalRules, router, notfound, middleware } = options

  _Vue.mixin(
    register(
      initial,
      acceptLocalRules || false,
      globalRules || {},
      router,
      notfound,
      middleware
    )
  )
}