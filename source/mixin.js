// @ts-check

export default {
  /**
   * Called before create component
   */
  beforeCreate() {
    this.$acl = {
      /**
       * Change current language
       * @param {string|Array} param 
       */
      change(param) {
        console.log('trocando', param)
      }
    }
  }
}