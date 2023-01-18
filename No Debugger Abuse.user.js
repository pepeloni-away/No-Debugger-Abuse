// ==UserScript==
// @name        No Debugger Abuse
// @namespace   https://github.com/pepeloni-away
// @match       *://*/*
// @run-at      document-start
// @insert-into page
// @grant       none
// @version     1.2
// @author      pploni
// @description Disable and optinally log calls to javascript debugger
// ==/UserScript==

const logs = false,
      details = true,
      here = (url => { url = url.replace('https://', ''); return url.length < 75 ? url : url.substring(0, 75) + "..." })(location.href),
      {log, info, debug, warn} = console,
      l = (...args) => (log || info || debug || warn)(...args)
let lastCall
self.Function.prototype.constructor = new Proxy(self.Function.prototype.constructor, {
   apply: function(target, thisArg, args) {
       let fnContent, caller = this.apply?.caller, callerContent, date, diff
       try {
           fnContent = args[0]
           /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/caller#browser_compatibility
            * Function.prototype.caller is non-standard but supported by everything
            * you may use it like in the line below to "walk the stack" i.e. see caller of this apply trap and its caller and its caller ...
            * l(this.apply.caller, this.apply.caller.caller, this.apply.caller.caller.caller) */
           if (!caller) caller = thisArg
           try { callerContent = caller.toString() } catch(e) { callerContent = e.toString() }
           date = new Date()
           lastCall ? diff = date.getTime() - lastCall.getTime() : diff = 0
           logs ? details ? l(`debugger call on ${here}`, diff, `ms since last call\ncalled by`, caller, `content:\n${callerContent}`) :
           l(`debugger call on ${here}`, diff, `ms since last call`) : null
           lastCall = date
       } catch (err) {
           if (logs) l(err, '\ndebugger logger failed\narguments:', arguments)
       }
       if ('debugger' === fnContent) return
       return target.apply(thisArg, args)
   }
})
// keep this equality because some libraries check if something is a function by comparing its constructor with Function
self.Function = self.Function.constructor
