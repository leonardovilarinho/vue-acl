import { _install } from './install'

let options = {
  initial: '',
  router: null,
  notfound: {
    path: '',
    forwardQueryParams: false,
  }
}

let Vue

export const AclInstaller = 
(_Vue) => {
  Vue = _Vue
  _install(_Vue, options)
}

export class AclCreate {
  constructor(_options) {
    options = _options
    _install(Vue, options)
  }
}
  
export class AclRule {
  constructor(permission) {
    this.current = permission
  }

  or(permission) {
    this.current += this.current === '' ? permission : `||${permission}`
    return this
  }

  and(permission) {
    this.current += this.current === '' ? permission : `&&${permission}`
    return this
  }

  generate() {
    const splitOrs = this.current.split('||')
    return splitOrs.map(o => o.split('&&'))
  }
}