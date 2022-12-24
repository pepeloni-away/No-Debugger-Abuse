// The lines below are skipped by the resource parser. Purpose is clean
// jshinting.
(function() {
// >>>> start of private namespace
'use strict';




/// no-debugger-abuse.js
/// alias nda.js
(function(){
	console.log('{{1}}')
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

})();



// These lines below are skipped by the resource parser.
// <<<< end of private namespace
})();

