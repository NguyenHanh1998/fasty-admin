<template>
  <router-view />
</template>

<script>
  import * as $ from 'jquery'
  import BigNumber from 'bignumber.js'

  let reloadTimeout
  export default {
    name: 'App',

    data: () => {
      return {
        loaded: false,
        inputNumberKeysAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
      }
    },

    mounted () {
      // fixed a bug that caused reload repeatedly to call back
      setTimeout(() => {
        this.loaded = true
      }, 1500)

      setInterval(() => {
        this.listenInputNumbers()
      }, 1000)

      this.ethereumListener()

      const dimensions = {
        width: $(window).width(),
        height: $(window).height(),
      }
      this.calculateZoomSite(null, dimensions)
      window.addEventListener('resize', this.calculateZoomSite)
    },

    methods: {
      // should use vue filter if possible
      listenInputNumbers () {
        const inputElements = document.getElementsByClassName('cards__input-number')
        for (let i = 0; i < inputElements.length; i++) {
          const element = inputElements[i]
          if (element.getAttribute('listener') !== 'true') {
            element.addEventListener('keypress', ($evt) => {
              if (!this.inputNumberKeysAllowed.includes($evt.key)) {
                $evt.preventDefault()
              }
              if ($evt.key === '.') {
                if ($evt.target.value.toString().indexOf('.') !== -1) {
                  $evt.preventDefault()
                }
                if (!$evt.target.value) {
                  $evt.preventDefault()
                }
              }
            })
            element.addEventListener('input', ($evt) => {
              if (!this.numberInputValidator($evt.target.value, element)) {
                $evt.target.value = element.getAttribute('previous-val')
              } else {
                element.setAttribute('previous-val', $evt.target.value)
              }
            })
            element.addEventListener('paste', ($evt) => {
              if (!this.numberInputValidator($evt.clipboardData.getData('Text'), element)) {
                $evt.preventDefault()
              } else {
                element.setAttribute('previous-val', $evt.clipboardData.getData('Text'))
              }
            })
            element.addEventListener('change', ($evt) => {
              if (!this.numberInputValidator($evt.target.value, element)) {
                $evt.target.value = element.getAttribute('previous-val')
              } else {
                element.setAttribute('previous-val', $evt.target.value)
              }
            })
            element.addEventListener('blur', ($evt) => {
              if (!this.numberInputValidator($evt.target.value, element)) {
                $evt.target.value = element.getAttribute('previous-val')
              } else {
                element.setAttribute('previous-val', $evt.target.value)
              }
            })
            element.setAttribute('listener', 'true')
          }
        }
      },
      // listener when metamask network or account changed and reload then
      ethereumListener () {
        const _this = this
        // remove beforeunload events before
        window.removeEventListener('beforeunload', this.beforeunloadListener)
        // listen metamask events
        if (typeof window.ethereum !== 'undefined') {
          // disable metamask default events
          window.ethereum.autoRefreshOnNetworkChange = false
          window.ethereum.on('accountsChanged', function (_) {
            // Time to reload your interface with accounts[0]!
            console.debug('accountsChanged::reloading...')
            _this.handleReload()
          })
          window.ethereum.on('chainChanged', function (_) {
            // Time to reload your interface with netId
            console.debug('chainChained::reloading...')
            _this.handleReload()
          })
        }
      },
      numberInputValidator (value, element) {
        if (!element) {
          return false
        }
        if (value && value.length !== 0 && !/^\d*\.?\d*$/.test(value)) {
          return false
        }
        if (value && value.length !== 0 && /[\uD800-\uDFFF]/.test(value)) {
          return false
        }
        return true
      },
      // ask before reload
      beforeunloadListener (e) {
        var dialogText = 'Reload site?'
        e.returnValue = dialogText
        return dialogText
      },
      handleReload () {
        if (!this.loaded) {
          console.debug('handleReload::load not ended...')
          return
        }
        if (reloadTimeout) {
          reloadTimeout = null
          return
        }
        const _this = this
        reloadTimeout = setTimeout(() => {
          reloadTimeout = null
          window.addEventListener('beforeunload', this.beforeunloadListener)
          console.debug('handleReload::reloading...')
          window.location.reload()
          window.removeEventListener('beforeunload', _this.beforeunloadListener)
          console.debug('handleReload::removed beforeunload...')
        }, 1000)
      },
      calculateZoomSite (e, dimensions) {
        let width
        let height

        if (e) {
          width = (e.srcElement || e.currentTarget).innerWidth
          height = (e.srcElement || e.currentTarget).innerHeight
        } else if (dimensions) {
          width = dimensions.width
          height = dimensions.height
        }

        let scale = 1.0
        // if (width > 991 && width < 1921) {
        //   scale = new BigNumber(width).div(1920).decimalPlaces(8).toNumber()
        //   console.debug('calcualteZoomSite::Will scale by width')
        // }
        const idealHeight = width * 9 / 16
        if (idealHeight < height) {
          if (width > 991 && width < 1367) {
            scale = new BigNumber(width).div(1366).decimalPlaces(8).toNumber()
            console.debug('calcualteZoomSite::Will scale by width')
          } else {
            console.debug('calcualteZoomSite::Ignore scale')
          }
        } else {
          if (height < 769) {
            scale = new BigNumber(height).div(768).decimalPlaces(8, BigNumber.ROUND_HALF_DOWN).toNumber()
            console.debug('calcualteZoomSite::Will scale by height')
          } else {
            console.debug('calcualteZoomSite::Ignore scale')
          }
        }
        console.debug('calcualteZoomSite::height', height)
        console.debug('calcualteZoomSite::idealHeight', idealHeight)
        console.debug('calcualteZoomSite::width', width)
        console.debug('calcualteZoomSite::scaleTo', scale)
        const html = document.documentElement
        html.style.zoom = scale
      },
    },
  }
</script>
