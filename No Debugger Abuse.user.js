// ==UserScript==
// @name        No Debugger Abuse
// @namespace   https://github.com/pepeloni-away
// @match       *://*/*
// @run-at      document-start
// @insert-into page
// @grant       none
// @version     1.0
// @author      pploni
// @description disable and log calls to javsacript debugger
// ==/UserScript==

const logs = true
const details = true
const here = location.href.replace(/^http(s)?:\/\//, '') > 75 ?
      location.href.replace(/^http(s)?:\/\//, '').substring(0,75) + '...' : location.href.replace(/^http(s)?:\/\//, '')
const l = (...args) => (console.log?.name == 'log' ? console.log : false || console.log?.name == 'info' ? console.log : false || console.debug)(...args)
let lastCall
self.Function.prototype.constructor = new Proxy(self.Function.prototype.constructor, {
   apply: function(target, thisArg, args) {
       let fnContent, callerContent, date, diff
       try {
           fnContent = args[0]
           callerContent = thisArg?.toString()
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
