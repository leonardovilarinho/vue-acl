let current = ''

export default (permission) => {
  current = permission

  return {
    or (permission) {
      current += current === '' ? permission : `||${permission}`
      return this
    },
    and (permission) {
      current += current === '' ? permission : `&&${permission}`
      return this
    },
    query () {
      const splitOrs = current.split('||')
      current = ''

      return splitOrs.map(o => o.split('&&'))
    }
  }
}