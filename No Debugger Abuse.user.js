// ==UserScript==
// @name        No Debugger Abuse
// @namespace   https://github.com/pepeloni-away
// @match       *://*/*
// @run-at      document-start
// @insert-into page
// @grant       none
// @version     1.1
// @author      pploni
// @description disable and log calls to javsacript debugger
// ==/UserScript==

const logs = false,
      details = true,
      here = (url => { url = url.replace('https://', ''); return url.length < 75 ? url : url.substring(0, 75) + "..." })(location.href),
      {log, info, debug, warn} = console,
      l = (...args) => (log || info || debug || warn)(...args)
let lastCall
self.Function.prototype.constructor = new Proxy(self.Function.prototype.constructor, {
   apply: function(target, thisArg, args) {
       let fnContent, callerContent, date, diff
       try {
           fnContent = args[0]
           try { callerContent = thisArg.toString() } catch(e) { callerContent = "Function.prototype.toString called on incompatible object" }
           date = new Date()
           lastCall ? diff = date.getTime() - lastCall.getTime() : diff = 0
           logs ? details ? l(`debugger call on ${here}`, diff, `ms since last call\ncalled by`, thisArg, `content:\n${callerContent}`) :
           l(`debugger call on ${here}`, diff, `ms since last call`) : null
           lastCall = date
       } catch (err) {
           if (logs) l(err, '\ndebugger logger failed\narguments:', arguments)
       }
       if ('debugger' === fnContent) return
       return target.apply(thisArg, args)
   }
})
self.Function = self.Function.constructor // some libs check if sth is a function by comparing its constructor with Function
