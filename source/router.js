// @ts-check
import VueRouter from 'vue-router'
import { testPermission } from './checker'

/**
 * Up vue router middleware
 * @param {VueRouter} router  router object
 * @param {Array} currentGlobal global current permissions
 * @param {string} notfound not fount route path
 */
export const upRouter = (router, currentGlobal, notfound) => {
  if (router === null)
    return
  router.beforeRouteEnter((to, from, next) => {

    /** @type {Array} */
    const routePermission = to.meta.rule

    if (!testPermission(currentGlobal, routePermission))
      return next(notfound)

    return next()
  })
}