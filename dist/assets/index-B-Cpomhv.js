(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const h of l.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&i(h)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function x_(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var Sd={exports:{}},$a={},xd={exports:{}},Re={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Og;function Cw(){if(Og)return Re;Og=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),h=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),_=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),x=Symbol.iterator;function A(V){return V===null||typeof V!="object"?null:(V=x&&V[x]||V["@@iterator"],typeof V=="function"?V:null)}var O={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},W=Object.assign,q={};function $(V,K,de){this.props=V,this.context=K,this.refs=q,this.updater=de||O}$.prototype.isReactComponent={},$.prototype.setState=function(V,K){if(typeof V!="object"&&typeof V!="function"&&V!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,V,K,"setState")},$.prototype.forceUpdate=function(V){this.updater.enqueueForceUpdate(this,V,"forceUpdate")};function he(){}he.prototype=$.prototype;function M(V,K,de){this.props=V,this.context=K,this.refs=q,this.updater=de||O}var J=M.prototype=new he;J.constructor=M,W(J,$.prototype),J.isPureReactComponent=!0;var re=Array.isArray,Ce=Object.prototype.hasOwnProperty,Ee={current:null},D={key:!0,ref:!0,__self:!0,__source:!0};function S(V,K,de){var Se,Ae={},Ne=null,je=null;if(K!=null)for(Se in K.ref!==void 0&&(je=K.ref),K.key!==void 0&&(Ne=""+K.key),K)Ce.call(K,Se)&&!D.hasOwnProperty(Se)&&(Ae[Se]=K[Se]);var Fe=arguments.length-2;if(Fe===1)Ae.children=de;else if(1<Fe){for(var He=Array(Fe),St=0;St<Fe;St++)He[St]=arguments[St+2];Ae.children=He}if(V&&V.defaultProps)for(Se in Fe=V.defaultProps,Fe)Ae[Se]===void 0&&(Ae[Se]=Fe[Se]);return{$$typeof:r,type:V,key:Ne,ref:je,props:Ae,_owner:Ee.current}}function C(V,K){return{$$typeof:r,type:V.type,key:K,ref:V.ref,props:V.props,_owner:V._owner}}function P(V){return typeof V=="object"&&V!==null&&V.$$typeof===r}function N(V){var K={"=":"=0",":":"=2"};return"$"+V.replace(/[=:]/g,function(de){return K[de]})}var L=/\/+/g;function R(V,K){return typeof V=="object"&&V!==null&&V.key!=null?N(""+V.key):K.toString(36)}function lt(V,K,de,Se,Ae){var Ne=typeof V;(Ne==="undefined"||Ne==="boolean")&&(V=null);var je=!1;if(V===null)je=!0;else switch(Ne){case"string":case"number":je=!0;break;case"object":switch(V.$$typeof){case r:case e:je=!0}}if(je)return je=V,Ae=Ae(je),V=Se===""?"."+R(je,0):Se,re(Ae)?(de="",V!=null&&(de=V.replace(L,"$&/")+"/"),lt(Ae,K,de,"",function(St){return St})):Ae!=null&&(P(Ae)&&(Ae=C(Ae,de+(!Ae.key||je&&je.key===Ae.key?"":(""+Ae.key).replace(L,"$&/")+"/")+V)),K.push(Ae)),1;if(je=0,Se=Se===""?".":Se+":",re(V))for(var Fe=0;Fe<V.length;Fe++){Ne=V[Fe];var He=Se+R(Ne,Fe);je+=lt(Ne,K,de,He,Ae)}else if(He=A(V),typeof He=="function")for(V=He.call(V),Fe=0;!(Ne=V.next()).done;)Ne=Ne.value,He=Se+R(Ne,Fe++),je+=lt(Ne,K,de,He,Ae);else if(Ne==="object")throw K=String(V),Error("Objects are not valid as a React child (found: "+(K==="[object Object]"?"object with keys {"+Object.keys(V).join(", ")+"}":K)+"). If you meant to render a collection of children, use an array instead.");return je}function Mt(V,K,de){if(V==null)return V;var Se=[],Ae=0;return lt(V,Se,"","",function(Ne){return K.call(de,Ne,Ae++)}),Se}function jt(V){if(V._status===-1){var K=V._result;K=K(),K.then(function(de){(V._status===0||V._status===-1)&&(V._status=1,V._result=de)},function(de){(V._status===0||V._status===-1)&&(V._status=2,V._result=de)}),V._status===-1&&(V._status=0,V._result=K)}if(V._status===1)return V._result.default;throw V._result}var $e={current:null},te={transition:null},pe={ReactCurrentDispatcher:$e,ReactCurrentBatchConfig:te,ReactCurrentOwner:Ee};function oe(){throw Error("act(...) is not supported in production builds of React.")}return Re.Children={map:Mt,forEach:function(V,K,de){Mt(V,function(){K.apply(this,arguments)},de)},count:function(V){var K=0;return Mt(V,function(){K++}),K},toArray:function(V){return Mt(V,function(K){return K})||[]},only:function(V){if(!P(V))throw Error("React.Children.only expected to receive a single React element child.");return V}},Re.Component=$,Re.Fragment=t,Re.Profiler=o,Re.PureComponent=M,Re.StrictMode=i,Re.Suspense=g,Re.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=pe,Re.act=oe,Re.cloneElement=function(V,K,de){if(V==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+V+".");var Se=W({},V.props),Ae=V.key,Ne=V.ref,je=V._owner;if(K!=null){if(K.ref!==void 0&&(Ne=K.ref,je=Ee.current),K.key!==void 0&&(Ae=""+K.key),V.type&&V.type.defaultProps)var Fe=V.type.defaultProps;for(He in K)Ce.call(K,He)&&!D.hasOwnProperty(He)&&(Se[He]=K[He]===void 0&&Fe!==void 0?Fe[He]:K[He])}var He=arguments.length-2;if(He===1)Se.children=de;else if(1<He){Fe=Array(He);for(var St=0;St<He;St++)Fe[St]=arguments[St+2];Se.children=Fe}return{$$typeof:r,type:V.type,key:Ae,ref:Ne,props:Se,_owner:je}},Re.createContext=function(V){return V={$$typeof:h,_currentValue:V,_currentValue2:V,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},V.Provider={$$typeof:l,_context:V},V.Consumer=V},Re.createElement=S,Re.createFactory=function(V){var K=S.bind(null,V);return K.type=V,K},Re.createRef=function(){return{current:null}},Re.forwardRef=function(V){return{$$typeof:f,render:V}},Re.isValidElement=P,Re.lazy=function(V){return{$$typeof:w,_payload:{_status:-1,_result:V},_init:jt}},Re.memo=function(V,K){return{$$typeof:_,type:V,compare:K===void 0?null:K}},Re.startTransition=function(V){var K=te.transition;te.transition={};try{V()}finally{te.transition=K}},Re.unstable_act=oe,Re.useCallback=function(V,K){return $e.current.useCallback(V,K)},Re.useContext=function(V){return $e.current.useContext(V)},Re.useDebugValue=function(){},Re.useDeferredValue=function(V){return $e.current.useDeferredValue(V)},Re.useEffect=function(V,K){return $e.current.useEffect(V,K)},Re.useId=function(){return $e.current.useId()},Re.useImperativeHandle=function(V,K,de){return $e.current.useImperativeHandle(V,K,de)},Re.useInsertionEffect=function(V,K){return $e.current.useInsertionEffect(V,K)},Re.useLayoutEffect=function(V,K){return $e.current.useLayoutEffect(V,K)},Re.useMemo=function(V,K){return $e.current.useMemo(V,K)},Re.useReducer=function(V,K,de){return $e.current.useReducer(V,K,de)},Re.useRef=function(V){return $e.current.useRef(V)},Re.useState=function(V){return $e.current.useState(V)},Re.useSyncExternalStore=function(V,K,de){return $e.current.useSyncExternalStore(V,K,de)},Re.useTransition=function(){return $e.current.useTransition()},Re.version="18.3.1",Re}var Vg;function yf(){return Vg||(Vg=1,xd.exports=Cw()),xd.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Lg;function kw(){if(Lg)return $a;Lg=1;var r=yf(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function h(f,g,_){var w,x={},A=null,O=null;_!==void 0&&(A=""+_),g.key!==void 0&&(A=""+g.key),g.ref!==void 0&&(O=g.ref);for(w in g)i.call(g,w)&&!l.hasOwnProperty(w)&&(x[w]=g[w]);if(f&&f.defaultProps)for(w in g=f.defaultProps,g)x[w]===void 0&&(x[w]=g[w]);return{$$typeof:e,type:f,key:A,ref:O,props:x,_owner:o.current}}return $a.Fragment=t,$a.jsx=h,$a.jsxs=h,$a}var Mg;function Pw(){return Mg||(Mg=1,Sd.exports=kw()),Sd.exports}var E=Pw(),Ue=yf();const bw=x_(Ue);var Wu={},Ad={exports:{}},on={},Rd={exports:{}},Cd={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var jg;function Dw(){return jg||(jg=1,(function(r){function e(te,pe){var oe=te.length;te.push(pe);e:for(;0<oe;){var V=oe-1>>>1,K=te[V];if(0<o(K,pe))te[V]=pe,te[oe]=K,oe=V;else break e}}function t(te){return te.length===0?null:te[0]}function i(te){if(te.length===0)return null;var pe=te[0],oe=te.pop();if(oe!==pe){te[0]=oe;e:for(var V=0,K=te.length,de=K>>>1;V<de;){var Se=2*(V+1)-1,Ae=te[Se],Ne=Se+1,je=te[Ne];if(0>o(Ae,oe))Ne<K&&0>o(je,Ae)?(te[V]=je,te[Ne]=oe,V=Ne):(te[V]=Ae,te[Se]=oe,V=Se);else if(Ne<K&&0>o(je,oe))te[V]=je,te[Ne]=oe,V=Ne;else break e}}return pe}function o(te,pe){var oe=te.sortIndex-pe.sortIndex;return oe!==0?oe:te.id-pe.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var h=Date,f=h.now();r.unstable_now=function(){return h.now()-f}}var g=[],_=[],w=1,x=null,A=3,O=!1,W=!1,q=!1,$=typeof setTimeout=="function"?setTimeout:null,he=typeof clearTimeout=="function"?clearTimeout:null,M=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function J(te){for(var pe=t(_);pe!==null;){if(pe.callback===null)i(_);else if(pe.startTime<=te)i(_),pe.sortIndex=pe.expirationTime,e(g,pe);else break;pe=t(_)}}function re(te){if(q=!1,J(te),!W)if(t(g)!==null)W=!0,jt(Ce);else{var pe=t(_);pe!==null&&$e(re,pe.startTime-te)}}function Ce(te,pe){W=!1,q&&(q=!1,he(S),S=-1),O=!0;var oe=A;try{for(J(pe),x=t(g);x!==null&&(!(x.expirationTime>pe)||te&&!N());){var V=x.callback;if(typeof V=="function"){x.callback=null,A=x.priorityLevel;var K=V(x.expirationTime<=pe);pe=r.unstable_now(),typeof K=="function"?x.callback=K:x===t(g)&&i(g),J(pe)}else i(g);x=t(g)}if(x!==null)var de=!0;else{var Se=t(_);Se!==null&&$e(re,Se.startTime-pe),de=!1}return de}finally{x=null,A=oe,O=!1}}var Ee=!1,D=null,S=-1,C=5,P=-1;function N(){return!(r.unstable_now()-P<C)}function L(){if(D!==null){var te=r.unstable_now();P=te;var pe=!0;try{pe=D(!0,te)}finally{pe?R():(Ee=!1,D=null)}}else Ee=!1}var R;if(typeof M=="function")R=function(){M(L)};else if(typeof MessageChannel<"u"){var lt=new MessageChannel,Mt=lt.port2;lt.port1.onmessage=L,R=function(){Mt.postMessage(null)}}else R=function(){$(L,0)};function jt(te){D=te,Ee||(Ee=!0,R())}function $e(te,pe){S=$(function(){te(r.unstable_now())},pe)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(te){te.callback=null},r.unstable_continueExecution=function(){W||O||(W=!0,jt(Ce))},r.unstable_forceFrameRate=function(te){0>te||125<te?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<te?Math.floor(1e3/te):5},r.unstable_getCurrentPriorityLevel=function(){return A},r.unstable_getFirstCallbackNode=function(){return t(g)},r.unstable_next=function(te){switch(A){case 1:case 2:case 3:var pe=3;break;default:pe=A}var oe=A;A=pe;try{return te()}finally{A=oe}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(te,pe){switch(te){case 1:case 2:case 3:case 4:case 5:break;default:te=3}var oe=A;A=te;try{return pe()}finally{A=oe}},r.unstable_scheduleCallback=function(te,pe,oe){var V=r.unstable_now();switch(typeof oe=="object"&&oe!==null?(oe=oe.delay,oe=typeof oe=="number"&&0<oe?V+oe:V):oe=V,te){case 1:var K=-1;break;case 2:K=250;break;case 5:K=1073741823;break;case 4:K=1e4;break;default:K=5e3}return K=oe+K,te={id:w++,callback:pe,priorityLevel:te,startTime:oe,expirationTime:K,sortIndex:-1},oe>V?(te.sortIndex=oe,e(_,te),t(g)===null&&te===t(_)&&(q?(he(S),S=-1):q=!0,$e(re,oe-V))):(te.sortIndex=K,e(g,te),W||O||(W=!0,jt(Ce))),te},r.unstable_shouldYield=N,r.unstable_wrapCallback=function(te){var pe=A;return function(){var oe=A;A=pe;try{return te.apply(this,arguments)}finally{A=oe}}}})(Cd)),Cd}var Fg;function Nw(){return Fg||(Fg=1,Rd.exports=Dw()),Rd.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ug;function Ow(){if(Ug)return on;Ug=1;var r=yf(),e=Nw();function t(n){for(var s="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)s+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+s+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i=new Set,o={};function l(n,s){h(n,s),h(n+"Capture",s)}function h(n,s){for(o[n]=s,n=0;n<s.length;n++)i.add(s[n])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),g=Object.prototype.hasOwnProperty,_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,w={},x={};function A(n){return g.call(x,n)?!0:g.call(w,n)?!1:_.test(n)?x[n]=!0:(w[n]=!0,!1)}function O(n,s,a,c){if(a!==null&&a.type===0)return!1;switch(typeof s){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function W(n,s,a,c){if(s===null||typeof s>"u"||O(n,s,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!s;case 4:return s===!1;case 5:return isNaN(s);case 6:return isNaN(s)||1>s}return!1}function q(n,s,a,c,d,m,v){this.acceptsBooleans=s===2||s===3||s===4,this.attributeName=c,this.attributeNamespace=d,this.mustUseProperty=a,this.propertyName=n,this.type=s,this.sanitizeURL=m,this.removeEmptyString=v}var $={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){$[n]=new q(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var s=n[0];$[s]=new q(s,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){$[n]=new q(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){$[n]=new q(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){$[n]=new q(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){$[n]=new q(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){$[n]=new q(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){$[n]=new q(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){$[n]=new q(n,5,!1,n.toLowerCase(),null,!1,!1)});var he=/[\-:]([a-z])/g;function M(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var s=n.replace(he,M);$[s]=new q(s,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var s=n.replace(he,M);$[s]=new q(s,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var s=n.replace(he,M);$[s]=new q(s,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){$[n]=new q(n,1,!1,n.toLowerCase(),null,!1,!1)}),$.xlinkHref=new q("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){$[n]=new q(n,1,!1,n.toLowerCase(),null,!0,!0)});function J(n,s,a,c){var d=$.hasOwnProperty(s)?$[s]:null;(d!==null?d.type!==0:c||!(2<s.length)||s[0]!=="o"&&s[0]!=="O"||s[1]!=="n"&&s[1]!=="N")&&(W(s,a,d,c)&&(a=null),c||d===null?A(s)&&(a===null?n.removeAttribute(s):n.setAttribute(s,""+a)):d.mustUseProperty?n[d.propertyName]=a===null?d.type===3?!1:"":a:(s=d.attributeName,c=d.attributeNamespace,a===null?n.removeAttribute(s):(d=d.type,a=d===3||d===4&&a===!0?"":""+a,c?n.setAttributeNS(c,s,a):n.setAttribute(s,a))))}var re=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ce=Symbol.for("react.element"),Ee=Symbol.for("react.portal"),D=Symbol.for("react.fragment"),S=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),P=Symbol.for("react.provider"),N=Symbol.for("react.context"),L=Symbol.for("react.forward_ref"),R=Symbol.for("react.suspense"),lt=Symbol.for("react.suspense_list"),Mt=Symbol.for("react.memo"),jt=Symbol.for("react.lazy"),$e=Symbol.for("react.offscreen"),te=Symbol.iterator;function pe(n){return n===null||typeof n!="object"?null:(n=te&&n[te]||n["@@iterator"],typeof n=="function"?n:null)}var oe=Object.assign,V;function K(n){if(V===void 0)try{throw Error()}catch(a){var s=a.stack.trim().match(/\n( *(at )?)/);V=s&&s[1]||""}return`
`+V+n}var de=!1;function Se(n,s){if(!n||de)return"";de=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(s)if(s=function(){throw Error()},Object.defineProperty(s.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(s,[])}catch(B){var c=B}Reflect.construct(n,[],s)}else{try{s.call()}catch(B){c=B}n.call(s.prototype)}else{try{throw Error()}catch(B){c=B}n()}}catch(B){if(B&&c&&typeof B.stack=="string"){for(var d=B.stack.split(`
`),m=c.stack.split(`
`),v=d.length-1,I=m.length-1;1<=v&&0<=I&&d[v]!==m[I];)I--;for(;1<=v&&0<=I;v--,I--)if(d[v]!==m[I]){if(v!==1||I!==1)do if(v--,I--,0>I||d[v]!==m[I]){var k=`
`+d[v].replace(" at new "," at ");return n.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",n.displayName)),k}while(1<=v&&0<=I);break}}}finally{de=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?K(n):""}function Ae(n){switch(n.tag){case 5:return K(n.type);case 16:return K("Lazy");case 13:return K("Suspense");case 19:return K("SuspenseList");case 0:case 2:case 15:return n=Se(n.type,!1),n;case 11:return n=Se(n.type.render,!1),n;case 1:return n=Se(n.type,!0),n;default:return""}}function Ne(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case D:return"Fragment";case Ee:return"Portal";case C:return"Profiler";case S:return"StrictMode";case R:return"Suspense";case lt:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case N:return(n.displayName||"Context")+".Consumer";case P:return(n._context.displayName||"Context")+".Provider";case L:var s=n.render;return n=n.displayName,n||(n=s.displayName||s.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Mt:return s=n.displayName||null,s!==null?s:Ne(n.type)||"Memo";case jt:s=n._payload,n=n._init;try{return Ne(n(s))}catch{}}return null}function je(n){var s=n.type;switch(n.tag){case 24:return"Cache";case 9:return(s.displayName||"Context")+".Consumer";case 10:return(s._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=s.render,n=n.displayName||n.name||"",s.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return s;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ne(s);case 8:return s===S?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof s=="function")return s.displayName||s.name||null;if(typeof s=="string")return s}return null}function Fe(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function He(n){var s=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(s==="checkbox"||s==="radio")}function St(n){var s=He(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,s),c=""+n[s];if(!n.hasOwnProperty(s)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var d=a.get,m=a.set;return Object.defineProperty(n,s,{configurable:!0,get:function(){return d.call(this)},set:function(v){c=""+v,m.call(this,v)}}),Object.defineProperty(n,s,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(v){c=""+v},stopTracking:function(){n._valueTracker=null,delete n[s]}}}}function Er(n){n._valueTracker||(n._valueTracker=St(n))}function Ns(n){if(!n)return!1;var s=n._valueTracker;if(!s)return!0;var a=s.getValue(),c="";return n&&(c=He(n)?n.checked?"true":"false":n.value),n=c,n!==a?(s.setValue(n),!0):!1}function qr(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Wi(n,s){var a=s.checked;return oe({},s,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function Os(n,s){var a=s.defaultValue==null?"":s.defaultValue,c=s.checked!=null?s.checked:s.defaultChecked;a=Fe(s.value!=null?s.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:s.type==="checkbox"||s.type==="radio"?s.checked!=null:s.value!=null}}function Qo(n,s){s=s.checked,s!=null&&J(n,"checked",s,!1)}function Xo(n,s){Qo(n,s);var a=Fe(s.value),c=s.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}s.hasOwnProperty("value")?Vs(n,s.type,a):s.hasOwnProperty("defaultValue")&&Vs(n,s.type,Fe(s.defaultValue)),s.checked==null&&s.defaultChecked!=null&&(n.defaultChecked=!!s.defaultChecked)}function kl(n,s,a){if(s.hasOwnProperty("value")||s.hasOwnProperty("defaultValue")){var c=s.type;if(!(c!=="submit"&&c!=="reset"||s.value!==void 0&&s.value!==null))return;s=""+n._wrapperState.initialValue,a||s===n.value||(n.value=s),n.defaultValue=s}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function Vs(n,s,a){(s!=="number"||qr(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var wr=Array.isArray;function Tr(n,s,a,c){if(n=n.options,s){s={};for(var d=0;d<a.length;d++)s["$"+a[d]]=!0;for(a=0;a<n.length;a++)d=s.hasOwnProperty("$"+n[a].value),n[a].selected!==d&&(n[a].selected=d),d&&c&&(n[a].defaultSelected=!0)}else{for(a=""+Fe(a),s=null,d=0;d<n.length;d++){if(n[d].value===a){n[d].selected=!0,c&&(n[d].defaultSelected=!0);return}s!==null||n[d].disabled||(s=n[d])}s!==null&&(s.selected=!0)}}function Yo(n,s){if(s.dangerouslySetInnerHTML!=null)throw Error(t(91));return oe({},s,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Ls(n,s){var a=s.value;if(a==null){if(a=s.children,s=s.defaultValue,a!=null){if(s!=null)throw Error(t(92));if(wr(a)){if(1<a.length)throw Error(t(93));a=a[0]}s=a}s==null&&(s=""),a=s}n._wrapperState={initialValue:Fe(a)}}function Ms(n,s){var a=Fe(s.value),c=Fe(s.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),s.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function Jo(n){var s=n.textContent;s===n._wrapperState.initialValue&&s!==""&&s!==null&&(n.value=s)}function _t(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function vt(n,s){return n==null||n==="http://www.w3.org/1999/xhtml"?_t(s):n==="http://www.w3.org/2000/svg"&&s==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Ir,Zo=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(s,a,c,d){MSApp.execUnsafeLocalFunction(function(){return n(s,a,c,d)})}:n})(function(n,s){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=s;else{for(Ir=Ir||document.createElement("div"),Ir.innerHTML="<svg>"+s.valueOf().toString()+"</svg>",s=Ir.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;s.firstChild;)n.appendChild(s.firstChild)}});function Gr(n,s){if(s){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=s;return}}n.textContent=s}var Hi={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qi=["Webkit","ms","Moz","O"];Object.keys(Hi).forEach(function(n){qi.forEach(function(s){s=s+n.charAt(0).toUpperCase()+n.substring(1),Hi[s]=Hi[n]})});function ea(n,s,a){return s==null||typeof s=="boolean"||s===""?"":a||typeof s!="number"||s===0||Hi.hasOwnProperty(n)&&Hi[n]?(""+s).trim():s+"px"}function ta(n,s){n=n.style;for(var a in s)if(s.hasOwnProperty(a)){var c=a.indexOf("--")===0,d=ea(a,s[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,d):n[a]=d}}var na=oe({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ra(n,s){if(s){if(na[n]&&(s.children!=null||s.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(s.dangerouslySetInnerHTML!=null){if(s.children!=null)throw Error(t(60));if(typeof s.dangerouslySetInnerHTML!="object"||!("__html"in s.dangerouslySetInnerHTML))throw Error(t(61))}if(s.style!=null&&typeof s.style!="object")throw Error(t(62))}}function ia(n,s){if(n.indexOf("-")===-1)return typeof s.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Gi=null;function js(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Fs=null,En=null,Yn=null;function Us(n){if(n=Ca(n)){if(typeof Fs!="function")throw Error(t(280));var s=n.stateNode;s&&(s=su(s),Fs(n.stateNode,n.type,s))}}function Jn(n){En?Yn?Yn.push(n):Yn=[n]:En=n}function sa(){if(En){var n=En,s=Yn;if(Yn=En=null,Us(n),s)for(n=0;n<s.length;n++)Us(s[n])}}function Ki(n,s){return n(s)}function oa(){}var Sr=!1;function aa(n,s,a){if(Sr)return n(s,a);Sr=!0;try{return Ki(n,s,a)}finally{Sr=!1,(En!==null||Yn!==null)&&(oa(),sa())}}function ut(n,s){var a=n.stateNode;if(a===null)return null;var c=su(a);if(c===null)return null;a=c[s];e:switch(s){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,s,typeof a));return a}var Bs=!1;if(f)try{var bn={};Object.defineProperty(bn,"passive",{get:function(){Bs=!0}}),window.addEventListener("test",bn,bn),window.removeEventListener("test",bn,bn)}catch{Bs=!1}function Qi(n,s,a,c,d,m,v,I,k){var B=Array.prototype.slice.call(arguments,3);try{s.apply(a,B)}catch(X){this.onError(X)}}var Xi=!1,zs=null,Dn=!1,la=null,Jc={onError:function(n){Xi=!0,zs=n}};function $s(n,s,a,c,d,m,v,I,k){Xi=!1,zs=null,Qi.apply(Jc,arguments)}function Pl(n,s,a,c,d,m,v,I,k){if($s.apply(this,arguments),Xi){if(Xi){var B=zs;Xi=!1,zs=null}else throw Error(t(198));Dn||(Dn=!0,la=B)}}function Nn(n){var s=n,a=n;if(n.alternate)for(;s.return;)s=s.return;else{n=s;do s=n,(s.flags&4098)!==0&&(a=s.return),n=s.return;while(n)}return s.tag===3?a:null}function Yi(n){if(n.tag===13){var s=n.memoizedState;if(s===null&&(n=n.alternate,n!==null&&(s=n.memoizedState)),s!==null)return s.dehydrated}return null}function On(n){if(Nn(n)!==n)throw Error(t(188))}function bl(n){var s=n.alternate;if(!s){if(s=Nn(n),s===null)throw Error(t(188));return s!==n?null:n}for(var a=n,c=s;;){var d=a.return;if(d===null)break;var m=d.alternate;if(m===null){if(c=d.return,c!==null){a=c;continue}break}if(d.child===m.child){for(m=d.child;m;){if(m===a)return On(d),n;if(m===c)return On(d),s;m=m.sibling}throw Error(t(188))}if(a.return!==c.return)a=d,c=m;else{for(var v=!1,I=d.child;I;){if(I===a){v=!0,a=d,c=m;break}if(I===c){v=!0,c=d,a=m;break}I=I.sibling}if(!v){for(I=m.child;I;){if(I===a){v=!0,a=m,c=d;break}if(I===c){v=!0,c=m,a=d;break}I=I.sibling}if(!v)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:s}function ua(n){return n=bl(n),n!==null?Ws(n):null}function Ws(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var s=Ws(n);if(s!==null)return s;n=n.sibling}return null}var Hs=e.unstable_scheduleCallback,ca=e.unstable_cancelCallback,Dl=e.unstable_shouldYield,Zc=e.unstable_requestPaint,qe=e.unstable_now,Nl=e.unstable_getCurrentPriorityLevel,Ji=e.unstable_ImmediatePriority,Kr=e.unstable_UserBlockingPriority,wn=e.unstable_NormalPriority,ha=e.unstable_LowPriority,Ol=e.unstable_IdlePriority,Zi=null,cn=null;function Vl(n){if(cn&&typeof cn.onCommitFiberRoot=="function")try{cn.onCommitFiberRoot(Zi,n,void 0,(n.current.flags&128)===128)}catch{}}var Gt=Math.clz32?Math.clz32:Ml,da=Math.log,Ll=Math.LN2;function Ml(n){return n>>>=0,n===0?32:31-(da(n)/Ll|0)|0}var qs=64,Gs=4194304;function Qr(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function es(n,s){var a=n.pendingLanes;if(a===0)return 0;var c=0,d=n.suspendedLanes,m=n.pingedLanes,v=a&268435455;if(v!==0){var I=v&~d;I!==0?c=Qr(I):(m&=v,m!==0&&(c=Qr(m)))}else v=a&~d,v!==0?c=Qr(v):m!==0&&(c=Qr(m));if(c===0)return 0;if(s!==0&&s!==c&&(s&d)===0&&(d=c&-c,m=s&-s,d>=m||d===16&&(m&4194240)!==0))return s;if((c&4)!==0&&(c|=a&16),s=n.entangledLanes,s!==0)for(n=n.entanglements,s&=c;0<s;)a=31-Gt(s),d=1<<a,c|=n[a],s&=~d;return c}function eh(n,s){switch(n){case 1:case 2:case 4:return s+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return s+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function xr(n,s){for(var a=n.suspendedLanes,c=n.pingedLanes,d=n.expirationTimes,m=n.pendingLanes;0<m;){var v=31-Gt(m),I=1<<v,k=d[v];k===-1?((I&a)===0||(I&c)!==0)&&(d[v]=eh(I,s)):k<=s&&(n.expiredLanes|=I),m&=~I}}function hn(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function ts(){var n=qs;return qs<<=1,(qs&4194240)===0&&(qs=64),n}function Xr(n){for(var s=[],a=0;31>a;a++)s.push(n);return s}function Yr(n,s,a){n.pendingLanes|=s,s!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,s=31-Gt(s),n[s]=a}function We(n,s){var a=n.pendingLanes&~s;n.pendingLanes=s,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=s,n.mutableReadLanes&=s,n.entangledLanes&=s,s=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var d=31-Gt(a),m=1<<d;s[d]=0,c[d]=-1,n[d]=-1,a&=~m}}function Jr(n,s){var a=n.entangledLanes|=s;for(n=n.entanglements;a;){var c=31-Gt(a),d=1<<c;d&s|n[c]&s&&(n[c]|=s),a&=~d}}var be=0;function Zr(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var jl,Ks,Fl,Ul,Bl,fa=!1,Zn=[],Pt=null,Vn=null,Ln=null,ei=new Map,Tn=new Map,er=[],th="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function zl(n,s){switch(n){case"focusin":case"focusout":Pt=null;break;case"dragenter":case"dragleave":Vn=null;break;case"mouseover":case"mouseout":Ln=null;break;case"pointerover":case"pointerout":ei.delete(s.pointerId);break;case"gotpointercapture":case"lostpointercapture":Tn.delete(s.pointerId)}}function Jt(n,s,a,c,d,m){return n===null||n.nativeEvent!==m?(n={blockedOn:s,domEventName:a,eventSystemFlags:c,nativeEvent:m,targetContainers:[d]},s!==null&&(s=Ca(s),s!==null&&Ks(s)),n):(n.eventSystemFlags|=c,s=n.targetContainers,d!==null&&s.indexOf(d)===-1&&s.push(d),n)}function nh(n,s,a,c,d){switch(s){case"focusin":return Pt=Jt(Pt,n,s,a,c,d),!0;case"dragenter":return Vn=Jt(Vn,n,s,a,c,d),!0;case"mouseover":return Ln=Jt(Ln,n,s,a,c,d),!0;case"pointerover":var m=d.pointerId;return ei.set(m,Jt(ei.get(m)||null,n,s,a,c,d)),!0;case"gotpointercapture":return m=d.pointerId,Tn.set(m,Jt(Tn.get(m)||null,n,s,a,c,d)),!0}return!1}function $l(n){var s=os(n.target);if(s!==null){var a=Nn(s);if(a!==null){if(s=a.tag,s===13){if(s=Yi(a),s!==null){n.blockedOn=s,Bl(n.priority,function(){Fl(a)});return}}else if(s===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Ar(n){if(n.blockedOn!==null)return!1;for(var s=n.targetContainers;0<s.length;){var a=Qs(n.domEventName,n.eventSystemFlags,s[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);Gi=c,a.target.dispatchEvent(c),Gi=null}else return s=Ca(a),s!==null&&Ks(s),n.blockedOn=a,!1;s.shift()}return!0}function ns(n,s,a){Ar(n)&&a.delete(s)}function Wl(){fa=!1,Pt!==null&&Ar(Pt)&&(Pt=null),Vn!==null&&Ar(Vn)&&(Vn=null),Ln!==null&&Ar(Ln)&&(Ln=null),ei.forEach(ns),Tn.forEach(ns)}function Mn(n,s){n.blockedOn===s&&(n.blockedOn=null,fa||(fa=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Wl)))}function jn(n){function s(d){return Mn(d,n)}if(0<Zn.length){Mn(Zn[0],n);for(var a=1;a<Zn.length;a++){var c=Zn[a];c.blockedOn===n&&(c.blockedOn=null)}}for(Pt!==null&&Mn(Pt,n),Vn!==null&&Mn(Vn,n),Ln!==null&&Mn(Ln,n),ei.forEach(s),Tn.forEach(s),a=0;a<er.length;a++)c=er[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<er.length&&(a=er[0],a.blockedOn===null);)$l(a),a.blockedOn===null&&er.shift()}var Rr=re.ReactCurrentBatchConfig,ti=!0;function Ze(n,s,a,c){var d=be,m=Rr.transition;Rr.transition=null;try{be=1,pa(n,s,a,c)}finally{be=d,Rr.transition=m}}function rh(n,s,a,c){var d=be,m=Rr.transition;Rr.transition=null;try{be=4,pa(n,s,a,c)}finally{be=d,Rr.transition=m}}function pa(n,s,a,c){if(ti){var d=Qs(n,s,a,c);if(d===null)ph(n,s,c,rs,a),zl(n,c);else if(nh(d,n,s,a,c))c.stopPropagation();else if(zl(n,c),s&4&&-1<th.indexOf(n)){for(;d!==null;){var m=Ca(d);if(m!==null&&jl(m),m=Qs(n,s,a,c),m===null&&ph(n,s,c,rs,a),m===d)break;d=m}d!==null&&c.stopPropagation()}else ph(n,s,c,null,a)}}var rs=null;function Qs(n,s,a,c){if(rs=null,n=js(c),n=os(n),n!==null)if(s=Nn(n),s===null)n=null;else if(a=s.tag,a===13){if(n=Yi(s),n!==null)return n;n=null}else if(a===3){if(s.stateNode.current.memoizedState.isDehydrated)return s.tag===3?s.stateNode.containerInfo:null;n=null}else s!==n&&(n=null);return rs=n,null}function ma(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Nl()){case Ji:return 1;case Kr:return 4;case wn:case ha:return 16;case Ol:return 536870912;default:return 16}default:return 16}}var dn=null,Xs=null,Zt=null;function ga(){if(Zt)return Zt;var n,s=Xs,a=s.length,c,d="value"in dn?dn.value:dn.textContent,m=d.length;for(n=0;n<a&&s[n]===d[n];n++);var v=a-n;for(c=1;c<=v&&s[a-c]===d[m-c];c++);return Zt=d.slice(n,1<c?1-c:void 0)}function Ys(n){var s=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&s===13&&(n=13)):n=s,n===10&&(n=13),32<=n||n===13?n:0}function tr(){return!0}function ya(){return!1}function bt(n){function s(a,c,d,m,v){this._reactName=a,this._targetInst=d,this.type=c,this.nativeEvent=m,this.target=v,this.currentTarget=null;for(var I in n)n.hasOwnProperty(I)&&(a=n[I],this[I]=a?a(m):m[I]);return this.isDefaultPrevented=(m.defaultPrevented!=null?m.defaultPrevented:m.returnValue===!1)?tr:ya,this.isPropagationStopped=ya,this}return oe(s.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=tr)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=tr)},persist:function(){},isPersistent:tr}),s}var Fn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Js=bt(Fn),nr=oe({},Fn,{view:0,detail:0}),ih=bt(nr),Zs,Cr,ni,is=oe({},nr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:rr,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==ni&&(ni&&n.type==="mousemove"?(Zs=n.screenX-ni.screenX,Cr=n.screenY-ni.screenY):Cr=Zs=0,ni=n),Zs)},movementY:function(n){return"movementY"in n?n.movementY:Cr}}),eo=bt(is),_a=oe({},is,{dataTransfer:0}),Hl=bt(_a),to=oe({},nr,{relatedTarget:0}),no=bt(to),ql=oe({},Fn,{animationName:0,elapsedTime:0,pseudoElement:0}),kr=bt(ql),Gl=oe({},Fn,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Kl=bt(Gl),Ql=oe({},Fn,{data:0}),va=bt(Ql),ro={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Kt={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Xl={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Yl(n){var s=this.nativeEvent;return s.getModifierState?s.getModifierState(n):(n=Xl[n])?!!s[n]:!1}function rr(){return Yl}var u=oe({},nr,{key:function(n){if(n.key){var s=ro[n.key]||n.key;if(s!=="Unidentified")return s}return n.type==="keypress"?(n=Ys(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Kt[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:rr,charCode:function(n){return n.type==="keypress"?Ys(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Ys(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),p=bt(u),y=oe({},is,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),T=bt(y),j=oe({},nr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:rr}),z=bt(j),ee=oe({},Fn,{propertyName:0,elapsedTime:0,pseudoElement:0}),ze=bt(ee),Et=oe({},is,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Oe=bt(Et),xt=[9,13,27,32],ft=f&&"CompositionEvent"in window,In=null;f&&"documentMode"in document&&(In=document.documentMode);var fn=f&&"TextEvent"in window&&!In,ss=f&&(!ft||In&&8<In&&11>=In),io=" ",Cp=!1;function kp(n,s){switch(n){case"keyup":return xt.indexOf(s.keyCode)!==-1;case"keydown":return s.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Pp(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var so=!1;function xE(n,s){switch(n){case"compositionend":return Pp(s);case"keypress":return s.which!==32?null:(Cp=!0,io);case"textInput":return n=s.data,n===io&&Cp?null:n;default:return null}}function AE(n,s){if(so)return n==="compositionend"||!ft&&kp(n,s)?(n=ga(),Zt=Xs=dn=null,so=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(s.ctrlKey||s.altKey||s.metaKey)||s.ctrlKey&&s.altKey){if(s.char&&1<s.char.length)return s.char;if(s.which)return String.fromCharCode(s.which)}return null;case"compositionend":return ss&&s.locale!=="ko"?null:s.data;default:return null}}var RE={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function bp(n){var s=n&&n.nodeName&&n.nodeName.toLowerCase();return s==="input"?!!RE[n.type]:s==="textarea"}function Dp(n,s,a,c){Jn(c),s=nu(s,"onChange"),0<s.length&&(a=new Js("onChange","change",null,a,c),n.push({event:a,listeners:s}))}var Ea=null,wa=null;function CE(n){Xp(n,0)}function Jl(n){var s=co(n);if(Ns(s))return n}function kE(n,s){if(n==="change")return s}var Np=!1;if(f){var sh;if(f){var oh="oninput"in document;if(!oh){var Op=document.createElement("div");Op.setAttribute("oninput","return;"),oh=typeof Op.oninput=="function"}sh=oh}else sh=!1;Np=sh&&(!document.documentMode||9<document.documentMode)}function Vp(){Ea&&(Ea.detachEvent("onpropertychange",Lp),wa=Ea=null)}function Lp(n){if(n.propertyName==="value"&&Jl(wa)){var s=[];Dp(s,wa,n,js(n)),aa(CE,s)}}function PE(n,s,a){n==="focusin"?(Vp(),Ea=s,wa=a,Ea.attachEvent("onpropertychange",Lp)):n==="focusout"&&Vp()}function bE(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Jl(wa)}function DE(n,s){if(n==="click")return Jl(s)}function NE(n,s){if(n==="input"||n==="change")return Jl(s)}function OE(n,s){return n===s&&(n!==0||1/n===1/s)||n!==n&&s!==s}var Un=typeof Object.is=="function"?Object.is:OE;function Ta(n,s){if(Un(n,s))return!0;if(typeof n!="object"||n===null||typeof s!="object"||s===null)return!1;var a=Object.keys(n),c=Object.keys(s);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var d=a[c];if(!g.call(s,d)||!Un(n[d],s[d]))return!1}return!0}function Mp(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function jp(n,s){var a=Mp(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=s&&c>=s)return{node:a,offset:s-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Mp(a)}}function Fp(n,s){return n&&s?n===s?!0:n&&n.nodeType===3?!1:s&&s.nodeType===3?Fp(n,s.parentNode):"contains"in n?n.contains(s):n.compareDocumentPosition?!!(n.compareDocumentPosition(s)&16):!1:!1}function Up(){for(var n=window,s=qr();s instanceof n.HTMLIFrameElement;){try{var a=typeof s.contentWindow.location.href=="string"}catch{a=!1}if(a)n=s.contentWindow;else break;s=qr(n.document)}return s}function ah(n){var s=n&&n.nodeName&&n.nodeName.toLowerCase();return s&&(s==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||s==="textarea"||n.contentEditable==="true")}function VE(n){var s=Up(),a=n.focusedElem,c=n.selectionRange;if(s!==a&&a&&a.ownerDocument&&Fp(a.ownerDocument.documentElement,a)){if(c!==null&&ah(a)){if(s=c.start,n=c.end,n===void 0&&(n=s),"selectionStart"in a)a.selectionStart=s,a.selectionEnd=Math.min(n,a.value.length);else if(n=(s=a.ownerDocument||document)&&s.defaultView||window,n.getSelection){n=n.getSelection();var d=a.textContent.length,m=Math.min(c.start,d);c=c.end===void 0?m:Math.min(c.end,d),!n.extend&&m>c&&(d=c,c=m,m=d),d=jp(a,m);var v=jp(a,c);d&&v&&(n.rangeCount!==1||n.anchorNode!==d.node||n.anchorOffset!==d.offset||n.focusNode!==v.node||n.focusOffset!==v.offset)&&(s=s.createRange(),s.setStart(d.node,d.offset),n.removeAllRanges(),m>c?(n.addRange(s),n.extend(v.node,v.offset)):(s.setEnd(v.node,v.offset),n.addRange(s)))}}for(s=[],n=a;n=n.parentNode;)n.nodeType===1&&s.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<s.length;a++)n=s[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var LE=f&&"documentMode"in document&&11>=document.documentMode,oo=null,lh=null,Ia=null,uh=!1;function Bp(n,s,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;uh||oo==null||oo!==qr(c)||(c=oo,"selectionStart"in c&&ah(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),Ia&&Ta(Ia,c)||(Ia=c,c=nu(lh,"onSelect"),0<c.length&&(s=new Js("onSelect","select",null,s,a),n.push({event:s,listeners:c}),s.target=oo)))}function Zl(n,s){var a={};return a[n.toLowerCase()]=s.toLowerCase(),a["Webkit"+n]="webkit"+s,a["Moz"+n]="moz"+s,a}var ao={animationend:Zl("Animation","AnimationEnd"),animationiteration:Zl("Animation","AnimationIteration"),animationstart:Zl("Animation","AnimationStart"),transitionend:Zl("Transition","TransitionEnd")},ch={},zp={};f&&(zp=document.createElement("div").style,"AnimationEvent"in window||(delete ao.animationend.animation,delete ao.animationiteration.animation,delete ao.animationstart.animation),"TransitionEvent"in window||delete ao.transitionend.transition);function eu(n){if(ch[n])return ch[n];if(!ao[n])return n;var s=ao[n],a;for(a in s)if(s.hasOwnProperty(a)&&a in zp)return ch[n]=s[a];return n}var $p=eu("animationend"),Wp=eu("animationiteration"),Hp=eu("animationstart"),qp=eu("transitionend"),Gp=new Map,Kp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ri(n,s){Gp.set(n,s),l(s,[n])}for(var hh=0;hh<Kp.length;hh++){var dh=Kp[hh],ME=dh.toLowerCase(),jE=dh[0].toUpperCase()+dh.slice(1);ri(ME,"on"+jE)}ri($p,"onAnimationEnd"),ri(Wp,"onAnimationIteration"),ri(Hp,"onAnimationStart"),ri("dblclick","onDoubleClick"),ri("focusin","onFocus"),ri("focusout","onBlur"),ri(qp,"onTransitionEnd"),h("onMouseEnter",["mouseout","mouseover"]),h("onMouseLeave",["mouseout","mouseover"]),h("onPointerEnter",["pointerout","pointerover"]),h("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Sa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),FE=new Set("cancel close invalid load scroll toggle".split(" ").concat(Sa));function Qp(n,s,a){var c=n.type||"unknown-event";n.currentTarget=a,Pl(c,s,void 0,n),n.currentTarget=null}function Xp(n,s){s=(s&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],d=c.event;c=c.listeners;e:{var m=void 0;if(s)for(var v=c.length-1;0<=v;v--){var I=c[v],k=I.instance,B=I.currentTarget;if(I=I.listener,k!==m&&d.isPropagationStopped())break e;Qp(d,I,B),m=k}else for(v=0;v<c.length;v++){if(I=c[v],k=I.instance,B=I.currentTarget,I=I.listener,k!==m&&d.isPropagationStopped())break e;Qp(d,I,B),m=k}}}if(Dn)throw n=la,Dn=!1,la=null,n}function Xe(n,s){var a=s[Eh];a===void 0&&(a=s[Eh]=new Set);var c=n+"__bubble";a.has(c)||(Yp(s,n,2,!1),a.add(c))}function fh(n,s,a){var c=0;s&&(c|=4),Yp(a,n,c,s)}var tu="_reactListening"+Math.random().toString(36).slice(2);function xa(n){if(!n[tu]){n[tu]=!0,i.forEach(function(a){a!=="selectionchange"&&(FE.has(a)||fh(a,!1,n),fh(a,!0,n))});var s=n.nodeType===9?n:n.ownerDocument;s===null||s[tu]||(s[tu]=!0,fh("selectionchange",!1,s))}}function Yp(n,s,a,c){switch(ma(s)){case 1:var d=Ze;break;case 4:d=rh;break;default:d=pa}a=d.bind(null,s,a,n),d=void 0,!Bs||s!=="touchstart"&&s!=="touchmove"&&s!=="wheel"||(d=!0),c?d!==void 0?n.addEventListener(s,a,{capture:!0,passive:d}):n.addEventListener(s,a,!0):d!==void 0?n.addEventListener(s,a,{passive:d}):n.addEventListener(s,a,!1)}function ph(n,s,a,c,d){var m=c;if((s&1)===0&&(s&2)===0&&c!==null)e:for(;;){if(c===null)return;var v=c.tag;if(v===3||v===4){var I=c.stateNode.containerInfo;if(I===d||I.nodeType===8&&I.parentNode===d)break;if(v===4)for(v=c.return;v!==null;){var k=v.tag;if((k===3||k===4)&&(k=v.stateNode.containerInfo,k===d||k.nodeType===8&&k.parentNode===d))return;v=v.return}for(;I!==null;){if(v=os(I),v===null)return;if(k=v.tag,k===5||k===6){c=m=v;continue e}I=I.parentNode}}c=c.return}aa(function(){var B=m,X=js(a),Y=[];e:{var Q=Gp.get(n);if(Q!==void 0){var ie=Js,le=n;switch(n){case"keypress":if(Ys(a)===0)break e;case"keydown":case"keyup":ie=p;break;case"focusin":le="focus",ie=no;break;case"focusout":le="blur",ie=no;break;case"beforeblur":case"afterblur":ie=no;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ie=eo;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ie=Hl;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ie=z;break;case $p:case Wp:case Hp:ie=kr;break;case qp:ie=ze;break;case"scroll":ie=ih;break;case"wheel":ie=Oe;break;case"copy":case"cut":case"paste":ie=Kl;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ie=T}var ue=(s&4)!==0,ct=!ue&&n==="scroll",F=ue?Q!==null?Q+"Capture":null:Q;ue=[];for(var b=B,U;b!==null;){U=b;var Z=U.stateNode;if(U.tag===5&&Z!==null&&(U=Z,F!==null&&(Z=ut(b,F),Z!=null&&ue.push(Aa(b,Z,U)))),ct)break;b=b.return}0<ue.length&&(Q=new ie(Q,le,null,a,X),Y.push({event:Q,listeners:ue}))}}if((s&7)===0){e:{if(Q=n==="mouseover"||n==="pointerover",ie=n==="mouseout"||n==="pointerout",Q&&a!==Gi&&(le=a.relatedTarget||a.fromElement)&&(os(le)||le[Pr]))break e;if((ie||Q)&&(Q=X.window===X?X:(Q=X.ownerDocument)?Q.defaultView||Q.parentWindow:window,ie?(le=a.relatedTarget||a.toElement,ie=B,le=le?os(le):null,le!==null&&(ct=Nn(le),le!==ct||le.tag!==5&&le.tag!==6)&&(le=null)):(ie=null,le=B),ie!==le)){if(ue=eo,Z="onMouseLeave",F="onMouseEnter",b="mouse",(n==="pointerout"||n==="pointerover")&&(ue=T,Z="onPointerLeave",F="onPointerEnter",b="pointer"),ct=ie==null?Q:co(ie),U=le==null?Q:co(le),Q=new ue(Z,b+"leave",ie,a,X),Q.target=ct,Q.relatedTarget=U,Z=null,os(X)===B&&(ue=new ue(F,b+"enter",le,a,X),ue.target=U,ue.relatedTarget=ct,Z=ue),ct=Z,ie&&le)t:{for(ue=ie,F=le,b=0,U=ue;U;U=lo(U))b++;for(U=0,Z=F;Z;Z=lo(Z))U++;for(;0<b-U;)ue=lo(ue),b--;for(;0<U-b;)F=lo(F),U--;for(;b--;){if(ue===F||F!==null&&ue===F.alternate)break t;ue=lo(ue),F=lo(F)}ue=null}else ue=null;ie!==null&&Jp(Y,Q,ie,ue,!1),le!==null&&ct!==null&&Jp(Y,ct,le,ue,!0)}}e:{if(Q=B?co(B):window,ie=Q.nodeName&&Q.nodeName.toLowerCase(),ie==="select"||ie==="input"&&Q.type==="file")var ce=kE;else if(bp(Q))if(Np)ce=NE;else{ce=bE;var me=PE}else(ie=Q.nodeName)&&ie.toLowerCase()==="input"&&(Q.type==="checkbox"||Q.type==="radio")&&(ce=DE);if(ce&&(ce=ce(n,B))){Dp(Y,ce,a,X);break e}me&&me(n,Q,B),n==="focusout"&&(me=Q._wrapperState)&&me.controlled&&Q.type==="number"&&Vs(Q,"number",Q.value)}switch(me=B?co(B):window,n){case"focusin":(bp(me)||me.contentEditable==="true")&&(oo=me,lh=B,Ia=null);break;case"focusout":Ia=lh=oo=null;break;case"mousedown":uh=!0;break;case"contextmenu":case"mouseup":case"dragend":uh=!1,Bp(Y,a,X);break;case"selectionchange":if(LE)break;case"keydown":case"keyup":Bp(Y,a,X)}var ge;if(ft)e:{switch(n){case"compositionstart":var ve="onCompositionStart";break e;case"compositionend":ve="onCompositionEnd";break e;case"compositionupdate":ve="onCompositionUpdate";break e}ve=void 0}else so?kp(n,a)&&(ve="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(ve="onCompositionStart");ve&&(ss&&a.locale!=="ko"&&(so||ve!=="onCompositionStart"?ve==="onCompositionEnd"&&so&&(ge=ga()):(dn=X,Xs="value"in dn?dn.value:dn.textContent,so=!0)),me=nu(B,ve),0<me.length&&(ve=new va(ve,n,null,a,X),Y.push({event:ve,listeners:me}),ge?ve.data=ge:(ge=Pp(a),ge!==null&&(ve.data=ge)))),(ge=fn?xE(n,a):AE(n,a))&&(B=nu(B,"onBeforeInput"),0<B.length&&(X=new va("onBeforeInput","beforeinput",null,a,X),Y.push({event:X,listeners:B}),X.data=ge))}Xp(Y,s)})}function Aa(n,s,a){return{instance:n,listener:s,currentTarget:a}}function nu(n,s){for(var a=s+"Capture",c=[];n!==null;){var d=n,m=d.stateNode;d.tag===5&&m!==null&&(d=m,m=ut(n,a),m!=null&&c.unshift(Aa(n,m,d)),m=ut(n,s),m!=null&&c.push(Aa(n,m,d))),n=n.return}return c}function lo(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Jp(n,s,a,c,d){for(var m=s._reactName,v=[];a!==null&&a!==c;){var I=a,k=I.alternate,B=I.stateNode;if(k!==null&&k===c)break;I.tag===5&&B!==null&&(I=B,d?(k=ut(a,m),k!=null&&v.unshift(Aa(a,k,I))):d||(k=ut(a,m),k!=null&&v.push(Aa(a,k,I)))),a=a.return}v.length!==0&&n.push({event:s,listeners:v})}var UE=/\r\n?/g,BE=/\u0000|\uFFFD/g;function Zp(n){return(typeof n=="string"?n:""+n).replace(UE,`
`).replace(BE,"")}function ru(n,s,a){if(s=Zp(s),Zp(n)!==s&&a)throw Error(t(425))}function iu(){}var mh=null,gh=null;function yh(n,s){return n==="textarea"||n==="noscript"||typeof s.children=="string"||typeof s.children=="number"||typeof s.dangerouslySetInnerHTML=="object"&&s.dangerouslySetInnerHTML!==null&&s.dangerouslySetInnerHTML.__html!=null}var _h=typeof setTimeout=="function"?setTimeout:void 0,zE=typeof clearTimeout=="function"?clearTimeout:void 0,em=typeof Promise=="function"?Promise:void 0,$E=typeof queueMicrotask=="function"?queueMicrotask:typeof em<"u"?function(n){return em.resolve(null).then(n).catch(WE)}:_h;function WE(n){setTimeout(function(){throw n})}function vh(n,s){var a=s,c=0;do{var d=a.nextSibling;if(n.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(c===0){n.removeChild(d),jn(s);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=d}while(a);jn(s)}function ii(n){for(;n!=null;n=n.nextSibling){var s=n.nodeType;if(s===1||s===3)break;if(s===8){if(s=n.data,s==="$"||s==="$!"||s==="$?")break;if(s==="/$")return null}}return n}function tm(n){n=n.previousSibling;for(var s=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(s===0)return n;s--}else a==="/$"&&s++}n=n.previousSibling}return null}var uo=Math.random().toString(36).slice(2),ir="__reactFiber$"+uo,Ra="__reactProps$"+uo,Pr="__reactContainer$"+uo,Eh="__reactEvents$"+uo,HE="__reactListeners$"+uo,qE="__reactHandles$"+uo;function os(n){var s=n[ir];if(s)return s;for(var a=n.parentNode;a;){if(s=a[Pr]||a[ir]){if(a=s.alternate,s.child!==null||a!==null&&a.child!==null)for(n=tm(n);n!==null;){if(a=n[ir])return a;n=tm(n)}return s}n=a,a=n.parentNode}return null}function Ca(n){return n=n[ir]||n[Pr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function co(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function su(n){return n[Ra]||null}var wh=[],ho=-1;function si(n){return{current:n}}function Ye(n){0>ho||(n.current=wh[ho],wh[ho]=null,ho--)}function Ge(n,s){ho++,wh[ho]=n.current,n.current=s}var oi={},Ft=si(oi),en=si(!1),as=oi;function fo(n,s){var a=n.type.contextTypes;if(!a)return oi;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===s)return c.__reactInternalMemoizedMaskedChildContext;var d={},m;for(m in a)d[m]=s[m];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=s,n.__reactInternalMemoizedMaskedChildContext=d),d}function tn(n){return n=n.childContextTypes,n!=null}function ou(){Ye(en),Ye(Ft)}function nm(n,s,a){if(Ft.current!==oi)throw Error(t(168));Ge(Ft,s),Ge(en,a)}function rm(n,s,a){var c=n.stateNode;if(s=s.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var d in c)if(!(d in s))throw Error(t(108,je(n)||"Unknown",d));return oe({},a,c)}function au(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||oi,as=Ft.current,Ge(Ft,n),Ge(en,en.current),!0}function im(n,s,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=rm(n,s,as),c.__reactInternalMemoizedMergedChildContext=n,Ye(en),Ye(Ft),Ge(Ft,n)):Ye(en),Ge(en,a)}var br=null,lu=!1,Th=!1;function sm(n){br===null?br=[n]:br.push(n)}function GE(n){lu=!0,sm(n)}function ai(){if(!Th&&br!==null){Th=!0;var n=0,s=be;try{var a=br;for(be=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}br=null,lu=!1}catch(d){throw br!==null&&(br=br.slice(n+1)),Hs(Ji,ai),d}finally{be=s,Th=!1}}return null}var po=[],mo=0,uu=null,cu=0,Sn=[],xn=0,ls=null,Dr=1,Nr="";function us(n,s){po[mo++]=cu,po[mo++]=uu,uu=n,cu=s}function om(n,s,a){Sn[xn++]=Dr,Sn[xn++]=Nr,Sn[xn++]=ls,ls=n;var c=Dr;n=Nr;var d=32-Gt(c)-1;c&=~(1<<d),a+=1;var m=32-Gt(s)+d;if(30<m){var v=d-d%5;m=(c&(1<<v)-1).toString(32),c>>=v,d-=v,Dr=1<<32-Gt(s)+d|a<<d|c,Nr=m+n}else Dr=1<<m|a<<d|c,Nr=n}function Ih(n){n.return!==null&&(us(n,1),om(n,1,0))}function Sh(n){for(;n===uu;)uu=po[--mo],po[mo]=null,cu=po[--mo],po[mo]=null;for(;n===ls;)ls=Sn[--xn],Sn[xn]=null,Nr=Sn[--xn],Sn[xn]=null,Dr=Sn[--xn],Sn[xn]=null}var pn=null,mn=null,et=!1,Bn=null;function am(n,s){var a=kn(5,null,null,0);a.elementType="DELETED",a.stateNode=s,a.return=n,s=n.deletions,s===null?(n.deletions=[a],n.flags|=16):s.push(a)}function lm(n,s){switch(n.tag){case 5:var a=n.type;return s=s.nodeType!==1||a.toLowerCase()!==s.nodeName.toLowerCase()?null:s,s!==null?(n.stateNode=s,pn=n,mn=ii(s.firstChild),!0):!1;case 6:return s=n.pendingProps===""||s.nodeType!==3?null:s,s!==null?(n.stateNode=s,pn=n,mn=null,!0):!1;case 13:return s=s.nodeType!==8?null:s,s!==null?(a=ls!==null?{id:Dr,overflow:Nr}:null,n.memoizedState={dehydrated:s,treeContext:a,retryLane:1073741824},a=kn(18,null,null,0),a.stateNode=s,a.return=n,n.child=a,pn=n,mn=null,!0):!1;default:return!1}}function xh(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Ah(n){if(et){var s=mn;if(s){var a=s;if(!lm(n,s)){if(xh(n))throw Error(t(418));s=ii(a.nextSibling);var c=pn;s&&lm(n,s)?am(c,a):(n.flags=n.flags&-4097|2,et=!1,pn=n)}}else{if(xh(n))throw Error(t(418));n.flags=n.flags&-4097|2,et=!1,pn=n}}}function um(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;pn=n}function hu(n){if(n!==pn)return!1;if(!et)return um(n),et=!0,!1;var s;if((s=n.tag!==3)&&!(s=n.tag!==5)&&(s=n.type,s=s!=="head"&&s!=="body"&&!yh(n.type,n.memoizedProps)),s&&(s=mn)){if(xh(n))throw cm(),Error(t(418));for(;s;)am(n,s),s=ii(s.nextSibling)}if(um(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,s=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(s===0){mn=ii(n.nextSibling);break e}s--}else a!=="$"&&a!=="$!"&&a!=="$?"||s++}n=n.nextSibling}mn=null}}else mn=pn?ii(n.stateNode.nextSibling):null;return!0}function cm(){for(var n=mn;n;)n=ii(n.nextSibling)}function go(){mn=pn=null,et=!1}function Rh(n){Bn===null?Bn=[n]:Bn.push(n)}var KE=re.ReactCurrentBatchConfig;function ka(n,s,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var d=c,m=""+n;return s!==null&&s.ref!==null&&typeof s.ref=="function"&&s.ref._stringRef===m?s.ref:(s=function(v){var I=d.refs;v===null?delete I[m]:I[m]=v},s._stringRef=m,s)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function du(n,s){throw n=Object.prototype.toString.call(s),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(s).join(", ")+"}":n))}function hm(n){var s=n._init;return s(n._payload)}function dm(n){function s(F,b){if(n){var U=F.deletions;U===null?(F.deletions=[b],F.flags|=16):U.push(b)}}function a(F,b){if(!n)return null;for(;b!==null;)s(F,b),b=b.sibling;return null}function c(F,b){for(F=new Map;b!==null;)b.key!==null?F.set(b.key,b):F.set(b.index,b),b=b.sibling;return F}function d(F,b){return F=mi(F,b),F.index=0,F.sibling=null,F}function m(F,b,U){return F.index=U,n?(U=F.alternate,U!==null?(U=U.index,U<b?(F.flags|=2,b):U):(F.flags|=2,b)):(F.flags|=1048576,b)}function v(F){return n&&F.alternate===null&&(F.flags|=2),F}function I(F,b,U,Z){return b===null||b.tag!==6?(b=_d(U,F.mode,Z),b.return=F,b):(b=d(b,U),b.return=F,b)}function k(F,b,U,Z){var ce=U.type;return ce===D?X(F,b,U.props.children,Z,U.key):b!==null&&(b.elementType===ce||typeof ce=="object"&&ce!==null&&ce.$$typeof===jt&&hm(ce)===b.type)?(Z=d(b,U.props),Z.ref=ka(F,b,U),Z.return=F,Z):(Z=Lu(U.type,U.key,U.props,null,F.mode,Z),Z.ref=ka(F,b,U),Z.return=F,Z)}function B(F,b,U,Z){return b===null||b.tag!==4||b.stateNode.containerInfo!==U.containerInfo||b.stateNode.implementation!==U.implementation?(b=vd(U,F.mode,Z),b.return=F,b):(b=d(b,U.children||[]),b.return=F,b)}function X(F,b,U,Z,ce){return b===null||b.tag!==7?(b=ys(U,F.mode,Z,ce),b.return=F,b):(b=d(b,U),b.return=F,b)}function Y(F,b,U){if(typeof b=="string"&&b!==""||typeof b=="number")return b=_d(""+b,F.mode,U),b.return=F,b;if(typeof b=="object"&&b!==null){switch(b.$$typeof){case Ce:return U=Lu(b.type,b.key,b.props,null,F.mode,U),U.ref=ka(F,null,b),U.return=F,U;case Ee:return b=vd(b,F.mode,U),b.return=F,b;case jt:var Z=b._init;return Y(F,Z(b._payload),U)}if(wr(b)||pe(b))return b=ys(b,F.mode,U,null),b.return=F,b;du(F,b)}return null}function Q(F,b,U,Z){var ce=b!==null?b.key:null;if(typeof U=="string"&&U!==""||typeof U=="number")return ce!==null?null:I(F,b,""+U,Z);if(typeof U=="object"&&U!==null){switch(U.$$typeof){case Ce:return U.key===ce?k(F,b,U,Z):null;case Ee:return U.key===ce?B(F,b,U,Z):null;case jt:return ce=U._init,Q(F,b,ce(U._payload),Z)}if(wr(U)||pe(U))return ce!==null?null:X(F,b,U,Z,null);du(F,U)}return null}function ie(F,b,U,Z,ce){if(typeof Z=="string"&&Z!==""||typeof Z=="number")return F=F.get(U)||null,I(b,F,""+Z,ce);if(typeof Z=="object"&&Z!==null){switch(Z.$$typeof){case Ce:return F=F.get(Z.key===null?U:Z.key)||null,k(b,F,Z,ce);case Ee:return F=F.get(Z.key===null?U:Z.key)||null,B(b,F,Z,ce);case jt:var me=Z._init;return ie(F,b,U,me(Z._payload),ce)}if(wr(Z)||pe(Z))return F=F.get(U)||null,X(b,F,Z,ce,null);du(b,Z)}return null}function le(F,b,U,Z){for(var ce=null,me=null,ge=b,ve=b=0,Ct=null;ge!==null&&ve<U.length;ve++){ge.index>ve?(Ct=ge,ge=null):Ct=ge.sibling;var Me=Q(F,ge,U[ve],Z);if(Me===null){ge===null&&(ge=Ct);break}n&&ge&&Me.alternate===null&&s(F,ge),b=m(Me,b,ve),me===null?ce=Me:me.sibling=Me,me=Me,ge=Ct}if(ve===U.length)return a(F,ge),et&&us(F,ve),ce;if(ge===null){for(;ve<U.length;ve++)ge=Y(F,U[ve],Z),ge!==null&&(b=m(ge,b,ve),me===null?ce=ge:me.sibling=ge,me=ge);return et&&us(F,ve),ce}for(ge=c(F,ge);ve<U.length;ve++)Ct=ie(ge,F,ve,U[ve],Z),Ct!==null&&(n&&Ct.alternate!==null&&ge.delete(Ct.key===null?ve:Ct.key),b=m(Ct,b,ve),me===null?ce=Ct:me.sibling=Ct,me=Ct);return n&&ge.forEach(function(gi){return s(F,gi)}),et&&us(F,ve),ce}function ue(F,b,U,Z){var ce=pe(U);if(typeof ce!="function")throw Error(t(150));if(U=ce.call(U),U==null)throw Error(t(151));for(var me=ce=null,ge=b,ve=b=0,Ct=null,Me=U.next();ge!==null&&!Me.done;ve++,Me=U.next()){ge.index>ve?(Ct=ge,ge=null):Ct=ge.sibling;var gi=Q(F,ge,Me.value,Z);if(gi===null){ge===null&&(ge=Ct);break}n&&ge&&gi.alternate===null&&s(F,ge),b=m(gi,b,ve),me===null?ce=gi:me.sibling=gi,me=gi,ge=Ct}if(Me.done)return a(F,ge),et&&us(F,ve),ce;if(ge===null){for(;!Me.done;ve++,Me=U.next())Me=Y(F,Me.value,Z),Me!==null&&(b=m(Me,b,ve),me===null?ce=Me:me.sibling=Me,me=Me);return et&&us(F,ve),ce}for(ge=c(F,ge);!Me.done;ve++,Me=U.next())Me=ie(ge,F,ve,Me.value,Z),Me!==null&&(n&&Me.alternate!==null&&ge.delete(Me.key===null?ve:Me.key),b=m(Me,b,ve),me===null?ce=Me:me.sibling=Me,me=Me);return n&&ge.forEach(function(Rw){return s(F,Rw)}),et&&us(F,ve),ce}function ct(F,b,U,Z){if(typeof U=="object"&&U!==null&&U.type===D&&U.key===null&&(U=U.props.children),typeof U=="object"&&U!==null){switch(U.$$typeof){case Ce:e:{for(var ce=U.key,me=b;me!==null;){if(me.key===ce){if(ce=U.type,ce===D){if(me.tag===7){a(F,me.sibling),b=d(me,U.props.children),b.return=F,F=b;break e}}else if(me.elementType===ce||typeof ce=="object"&&ce!==null&&ce.$$typeof===jt&&hm(ce)===me.type){a(F,me.sibling),b=d(me,U.props),b.ref=ka(F,me,U),b.return=F,F=b;break e}a(F,me);break}else s(F,me);me=me.sibling}U.type===D?(b=ys(U.props.children,F.mode,Z,U.key),b.return=F,F=b):(Z=Lu(U.type,U.key,U.props,null,F.mode,Z),Z.ref=ka(F,b,U),Z.return=F,F=Z)}return v(F);case Ee:e:{for(me=U.key;b!==null;){if(b.key===me)if(b.tag===4&&b.stateNode.containerInfo===U.containerInfo&&b.stateNode.implementation===U.implementation){a(F,b.sibling),b=d(b,U.children||[]),b.return=F,F=b;break e}else{a(F,b);break}else s(F,b);b=b.sibling}b=vd(U,F.mode,Z),b.return=F,F=b}return v(F);case jt:return me=U._init,ct(F,b,me(U._payload),Z)}if(wr(U))return le(F,b,U,Z);if(pe(U))return ue(F,b,U,Z);du(F,U)}return typeof U=="string"&&U!==""||typeof U=="number"?(U=""+U,b!==null&&b.tag===6?(a(F,b.sibling),b=d(b,U),b.return=F,F=b):(a(F,b),b=_d(U,F.mode,Z),b.return=F,F=b),v(F)):a(F,b)}return ct}var yo=dm(!0),fm=dm(!1),fu=si(null),pu=null,_o=null,Ch=null;function kh(){Ch=_o=pu=null}function Ph(n){var s=fu.current;Ye(fu),n._currentValue=s}function bh(n,s,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&s)!==s?(n.childLanes|=s,c!==null&&(c.childLanes|=s)):c!==null&&(c.childLanes&s)!==s&&(c.childLanes|=s),n===a)break;n=n.return}}function vo(n,s){pu=n,Ch=_o=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&s)!==0&&(nn=!0),n.firstContext=null)}function An(n){var s=n._currentValue;if(Ch!==n)if(n={context:n,memoizedValue:s,next:null},_o===null){if(pu===null)throw Error(t(308));_o=n,pu.dependencies={lanes:0,firstContext:n}}else _o=_o.next=n;return s}var cs=null;function Dh(n){cs===null?cs=[n]:cs.push(n)}function pm(n,s,a,c){var d=s.interleaved;return d===null?(a.next=a,Dh(s)):(a.next=d.next,d.next=a),s.interleaved=a,Or(n,c)}function Or(n,s){n.lanes|=s;var a=n.alternate;for(a!==null&&(a.lanes|=s),a=n,n=n.return;n!==null;)n.childLanes|=s,a=n.alternate,a!==null&&(a.childLanes|=s),a=n,n=n.return;return a.tag===3?a.stateNode:null}var li=!1;function Nh(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function mm(n,s){n=n.updateQueue,s.updateQueue===n&&(s.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Vr(n,s){return{eventTime:n,lane:s,tag:0,payload:null,callback:null,next:null}}function ui(n,s,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(Le&2)!==0){var d=c.pending;return d===null?s.next=s:(s.next=d.next,d.next=s),c.pending=s,Or(n,a)}return d=c.interleaved,d===null?(s.next=s,Dh(c)):(s.next=d.next,d.next=s),c.interleaved=s,Or(n,a)}function mu(n,s,a){if(s=s.updateQueue,s!==null&&(s=s.shared,(a&4194240)!==0)){var c=s.lanes;c&=n.pendingLanes,a|=c,s.lanes=a,Jr(n,a)}}function gm(n,s){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var d=null,m=null;if(a=a.firstBaseUpdate,a!==null){do{var v={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};m===null?d=m=v:m=m.next=v,a=a.next}while(a!==null);m===null?d=m=s:m=m.next=s}else d=m=s;a={baseState:c.baseState,firstBaseUpdate:d,lastBaseUpdate:m,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=s:n.next=s,a.lastBaseUpdate=s}function gu(n,s,a,c){var d=n.updateQueue;li=!1;var m=d.firstBaseUpdate,v=d.lastBaseUpdate,I=d.shared.pending;if(I!==null){d.shared.pending=null;var k=I,B=k.next;k.next=null,v===null?m=B:v.next=B,v=k;var X=n.alternate;X!==null&&(X=X.updateQueue,I=X.lastBaseUpdate,I!==v&&(I===null?X.firstBaseUpdate=B:I.next=B,X.lastBaseUpdate=k))}if(m!==null){var Y=d.baseState;v=0,X=B=k=null,I=m;do{var Q=I.lane,ie=I.eventTime;if((c&Q)===Q){X!==null&&(X=X.next={eventTime:ie,lane:0,tag:I.tag,payload:I.payload,callback:I.callback,next:null});e:{var le=n,ue=I;switch(Q=s,ie=a,ue.tag){case 1:if(le=ue.payload,typeof le=="function"){Y=le.call(ie,Y,Q);break e}Y=le;break e;case 3:le.flags=le.flags&-65537|128;case 0:if(le=ue.payload,Q=typeof le=="function"?le.call(ie,Y,Q):le,Q==null)break e;Y=oe({},Y,Q);break e;case 2:li=!0}}I.callback!==null&&I.lane!==0&&(n.flags|=64,Q=d.effects,Q===null?d.effects=[I]:Q.push(I))}else ie={eventTime:ie,lane:Q,tag:I.tag,payload:I.payload,callback:I.callback,next:null},X===null?(B=X=ie,k=Y):X=X.next=ie,v|=Q;if(I=I.next,I===null){if(I=d.shared.pending,I===null)break;Q=I,I=Q.next,Q.next=null,d.lastBaseUpdate=Q,d.shared.pending=null}}while(!0);if(X===null&&(k=Y),d.baseState=k,d.firstBaseUpdate=B,d.lastBaseUpdate=X,s=d.shared.interleaved,s!==null){d=s;do v|=d.lane,d=d.next;while(d!==s)}else m===null&&(d.shared.lanes=0);fs|=v,n.lanes=v,n.memoizedState=Y}}function ym(n,s,a){if(n=s.effects,s.effects=null,n!==null)for(s=0;s<n.length;s++){var c=n[s],d=c.callback;if(d!==null){if(c.callback=null,c=a,typeof d!="function")throw Error(t(191,d));d.call(c)}}}var Pa={},sr=si(Pa),ba=si(Pa),Da=si(Pa);function hs(n){if(n===Pa)throw Error(t(174));return n}function Oh(n,s){switch(Ge(Da,s),Ge(ba,n),Ge(sr,Pa),n=s.nodeType,n){case 9:case 11:s=(s=s.documentElement)?s.namespaceURI:vt(null,"");break;default:n=n===8?s.parentNode:s,s=n.namespaceURI||null,n=n.tagName,s=vt(s,n)}Ye(sr),Ge(sr,s)}function Eo(){Ye(sr),Ye(ba),Ye(Da)}function _m(n){hs(Da.current);var s=hs(sr.current),a=vt(s,n.type);s!==a&&(Ge(ba,n),Ge(sr,a))}function Vh(n){ba.current===n&&(Ye(sr),Ye(ba))}var tt=si(0);function yu(n){for(var s=n;s!==null;){if(s.tag===13){var a=s.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return s}else if(s.tag===19&&s.memoizedProps.revealOrder!==void 0){if((s.flags&128)!==0)return s}else if(s.child!==null){s.child.return=s,s=s.child;continue}if(s===n)break;for(;s.sibling===null;){if(s.return===null||s.return===n)return null;s=s.return}s.sibling.return=s.return,s=s.sibling}return null}var Lh=[];function Mh(){for(var n=0;n<Lh.length;n++)Lh[n]._workInProgressVersionPrimary=null;Lh.length=0}var _u=re.ReactCurrentDispatcher,jh=re.ReactCurrentBatchConfig,ds=0,nt=null,wt=null,At=null,vu=!1,Na=!1,Oa=0,QE=0;function Ut(){throw Error(t(321))}function Fh(n,s){if(s===null)return!1;for(var a=0;a<s.length&&a<n.length;a++)if(!Un(n[a],s[a]))return!1;return!0}function Uh(n,s,a,c,d,m){if(ds=m,nt=s,s.memoizedState=null,s.updateQueue=null,s.lanes=0,_u.current=n===null||n.memoizedState===null?ZE:ew,n=a(c,d),Na){m=0;do{if(Na=!1,Oa=0,25<=m)throw Error(t(301));m+=1,At=wt=null,s.updateQueue=null,_u.current=tw,n=a(c,d)}while(Na)}if(_u.current=Tu,s=wt!==null&&wt.next!==null,ds=0,At=wt=nt=null,vu=!1,s)throw Error(t(300));return n}function Bh(){var n=Oa!==0;return Oa=0,n}function or(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return At===null?nt.memoizedState=At=n:At=At.next=n,At}function Rn(){if(wt===null){var n=nt.alternate;n=n!==null?n.memoizedState:null}else n=wt.next;var s=At===null?nt.memoizedState:At.next;if(s!==null)At=s,wt=n;else{if(n===null)throw Error(t(310));wt=n,n={memoizedState:wt.memoizedState,baseState:wt.baseState,baseQueue:wt.baseQueue,queue:wt.queue,next:null},At===null?nt.memoizedState=At=n:At=At.next=n}return At}function Va(n,s){return typeof s=="function"?s(n):s}function zh(n){var s=Rn(),a=s.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=wt,d=c.baseQueue,m=a.pending;if(m!==null){if(d!==null){var v=d.next;d.next=m.next,m.next=v}c.baseQueue=d=m,a.pending=null}if(d!==null){m=d.next,c=c.baseState;var I=v=null,k=null,B=m;do{var X=B.lane;if((ds&X)===X)k!==null&&(k=k.next={lane:0,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null}),c=B.hasEagerState?B.eagerState:n(c,B.action);else{var Y={lane:X,action:B.action,hasEagerState:B.hasEagerState,eagerState:B.eagerState,next:null};k===null?(I=k=Y,v=c):k=k.next=Y,nt.lanes|=X,fs|=X}B=B.next}while(B!==null&&B!==m);k===null?v=c:k.next=I,Un(c,s.memoizedState)||(nn=!0),s.memoizedState=c,s.baseState=v,s.baseQueue=k,a.lastRenderedState=c}if(n=a.interleaved,n!==null){d=n;do m=d.lane,nt.lanes|=m,fs|=m,d=d.next;while(d!==n)}else d===null&&(a.lanes=0);return[s.memoizedState,a.dispatch]}function $h(n){var s=Rn(),a=s.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,d=a.pending,m=s.memoizedState;if(d!==null){a.pending=null;var v=d=d.next;do m=n(m,v.action),v=v.next;while(v!==d);Un(m,s.memoizedState)||(nn=!0),s.memoizedState=m,s.baseQueue===null&&(s.baseState=m),a.lastRenderedState=m}return[m,c]}function vm(){}function Em(n,s){var a=nt,c=Rn(),d=s(),m=!Un(c.memoizedState,d);if(m&&(c.memoizedState=d,nn=!0),c=c.queue,Wh(Im.bind(null,a,c,n),[n]),c.getSnapshot!==s||m||At!==null&&At.memoizedState.tag&1){if(a.flags|=2048,La(9,Tm.bind(null,a,c,d,s),void 0,null),Rt===null)throw Error(t(349));(ds&30)!==0||wm(a,s,d)}return d}function wm(n,s,a){n.flags|=16384,n={getSnapshot:s,value:a},s=nt.updateQueue,s===null?(s={lastEffect:null,stores:null},nt.updateQueue=s,s.stores=[n]):(a=s.stores,a===null?s.stores=[n]:a.push(n))}function Tm(n,s,a,c){s.value=a,s.getSnapshot=c,Sm(s)&&xm(n)}function Im(n,s,a){return a(function(){Sm(s)&&xm(n)})}function Sm(n){var s=n.getSnapshot;n=n.value;try{var a=s();return!Un(n,a)}catch{return!0}}function xm(n){var s=Or(n,1);s!==null&&Hn(s,n,1,-1)}function Am(n){var s=or();return typeof n=="function"&&(n=n()),s.memoizedState=s.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Va,lastRenderedState:n},s.queue=n,n=n.dispatch=JE.bind(null,nt,n),[s.memoizedState,n]}function La(n,s,a,c){return n={tag:n,create:s,destroy:a,deps:c,next:null},s=nt.updateQueue,s===null?(s={lastEffect:null,stores:null},nt.updateQueue=s,s.lastEffect=n.next=n):(a=s.lastEffect,a===null?s.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,s.lastEffect=n)),n}function Rm(){return Rn().memoizedState}function Eu(n,s,a,c){var d=or();nt.flags|=n,d.memoizedState=La(1|s,a,void 0,c===void 0?null:c)}function wu(n,s,a,c){var d=Rn();c=c===void 0?null:c;var m=void 0;if(wt!==null){var v=wt.memoizedState;if(m=v.destroy,c!==null&&Fh(c,v.deps)){d.memoizedState=La(s,a,m,c);return}}nt.flags|=n,d.memoizedState=La(1|s,a,m,c)}function Cm(n,s){return Eu(8390656,8,n,s)}function Wh(n,s){return wu(2048,8,n,s)}function km(n,s){return wu(4,2,n,s)}function Pm(n,s){return wu(4,4,n,s)}function bm(n,s){if(typeof s=="function")return n=n(),s(n),function(){s(null)};if(s!=null)return n=n(),s.current=n,function(){s.current=null}}function Dm(n,s,a){return a=a!=null?a.concat([n]):null,wu(4,4,bm.bind(null,s,n),a)}function Hh(){}function Nm(n,s){var a=Rn();s=s===void 0?null:s;var c=a.memoizedState;return c!==null&&s!==null&&Fh(s,c[1])?c[0]:(a.memoizedState=[n,s],n)}function Om(n,s){var a=Rn();s=s===void 0?null:s;var c=a.memoizedState;return c!==null&&s!==null&&Fh(s,c[1])?c[0]:(n=n(),a.memoizedState=[n,s],n)}function Vm(n,s,a){return(ds&21)===0?(n.baseState&&(n.baseState=!1,nn=!0),n.memoizedState=a):(Un(a,s)||(a=ts(),nt.lanes|=a,fs|=a,n.baseState=!0),s)}function XE(n,s){var a=be;be=a!==0&&4>a?a:4,n(!0);var c=jh.transition;jh.transition={};try{n(!1),s()}finally{be=a,jh.transition=c}}function Lm(){return Rn().memoizedState}function YE(n,s,a){var c=fi(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},Mm(n))jm(s,a);else if(a=pm(n,s,a,c),a!==null){var d=Xt();Hn(a,n,c,d),Fm(a,s,c)}}function JE(n,s,a){var c=fi(n),d={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(Mm(n))jm(s,d);else{var m=n.alternate;if(n.lanes===0&&(m===null||m.lanes===0)&&(m=s.lastRenderedReducer,m!==null))try{var v=s.lastRenderedState,I=m(v,a);if(d.hasEagerState=!0,d.eagerState=I,Un(I,v)){var k=s.interleaved;k===null?(d.next=d,Dh(s)):(d.next=k.next,k.next=d),s.interleaved=d;return}}catch{}finally{}a=pm(n,s,d,c),a!==null&&(d=Xt(),Hn(a,n,c,d),Fm(a,s,c))}}function Mm(n){var s=n.alternate;return n===nt||s!==null&&s===nt}function jm(n,s){Na=vu=!0;var a=n.pending;a===null?s.next=s:(s.next=a.next,a.next=s),n.pending=s}function Fm(n,s,a){if((a&4194240)!==0){var c=s.lanes;c&=n.pendingLanes,a|=c,s.lanes=a,Jr(n,a)}}var Tu={readContext:An,useCallback:Ut,useContext:Ut,useEffect:Ut,useImperativeHandle:Ut,useInsertionEffect:Ut,useLayoutEffect:Ut,useMemo:Ut,useReducer:Ut,useRef:Ut,useState:Ut,useDebugValue:Ut,useDeferredValue:Ut,useTransition:Ut,useMutableSource:Ut,useSyncExternalStore:Ut,useId:Ut,unstable_isNewReconciler:!1},ZE={readContext:An,useCallback:function(n,s){return or().memoizedState=[n,s===void 0?null:s],n},useContext:An,useEffect:Cm,useImperativeHandle:function(n,s,a){return a=a!=null?a.concat([n]):null,Eu(4194308,4,bm.bind(null,s,n),a)},useLayoutEffect:function(n,s){return Eu(4194308,4,n,s)},useInsertionEffect:function(n,s){return Eu(4,2,n,s)},useMemo:function(n,s){var a=or();return s=s===void 0?null:s,n=n(),a.memoizedState=[n,s],n},useReducer:function(n,s,a){var c=or();return s=a!==void 0?a(s):s,c.memoizedState=c.baseState=s,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:s},c.queue=n,n=n.dispatch=YE.bind(null,nt,n),[c.memoizedState,n]},useRef:function(n){var s=or();return n={current:n},s.memoizedState=n},useState:Am,useDebugValue:Hh,useDeferredValue:function(n){return or().memoizedState=n},useTransition:function(){var n=Am(!1),s=n[0];return n=XE.bind(null,n[1]),or().memoizedState=n,[s,n]},useMutableSource:function(){},useSyncExternalStore:function(n,s,a){var c=nt,d=or();if(et){if(a===void 0)throw Error(t(407));a=a()}else{if(a=s(),Rt===null)throw Error(t(349));(ds&30)!==0||wm(c,s,a)}d.memoizedState=a;var m={value:a,getSnapshot:s};return d.queue=m,Cm(Im.bind(null,c,m,n),[n]),c.flags|=2048,La(9,Tm.bind(null,c,m,a,s),void 0,null),a},useId:function(){var n=or(),s=Rt.identifierPrefix;if(et){var a=Nr,c=Dr;a=(c&~(1<<32-Gt(c)-1)).toString(32)+a,s=":"+s+"R"+a,a=Oa++,0<a&&(s+="H"+a.toString(32)),s+=":"}else a=QE++,s=":"+s+"r"+a.toString(32)+":";return n.memoizedState=s},unstable_isNewReconciler:!1},ew={readContext:An,useCallback:Nm,useContext:An,useEffect:Wh,useImperativeHandle:Dm,useInsertionEffect:km,useLayoutEffect:Pm,useMemo:Om,useReducer:zh,useRef:Rm,useState:function(){return zh(Va)},useDebugValue:Hh,useDeferredValue:function(n){var s=Rn();return Vm(s,wt.memoizedState,n)},useTransition:function(){var n=zh(Va)[0],s=Rn().memoizedState;return[n,s]},useMutableSource:vm,useSyncExternalStore:Em,useId:Lm,unstable_isNewReconciler:!1},tw={readContext:An,useCallback:Nm,useContext:An,useEffect:Wh,useImperativeHandle:Dm,useInsertionEffect:km,useLayoutEffect:Pm,useMemo:Om,useReducer:$h,useRef:Rm,useState:function(){return $h(Va)},useDebugValue:Hh,useDeferredValue:function(n){var s=Rn();return wt===null?s.memoizedState=n:Vm(s,wt.memoizedState,n)},useTransition:function(){var n=$h(Va)[0],s=Rn().memoizedState;return[n,s]},useMutableSource:vm,useSyncExternalStore:Em,useId:Lm,unstable_isNewReconciler:!1};function zn(n,s){if(n&&n.defaultProps){s=oe({},s),n=n.defaultProps;for(var a in n)s[a]===void 0&&(s[a]=n[a]);return s}return s}function qh(n,s,a,c){s=n.memoizedState,a=a(c,s),a=a==null?s:oe({},s,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var Iu={isMounted:function(n){return(n=n._reactInternals)?Nn(n)===n:!1},enqueueSetState:function(n,s,a){n=n._reactInternals;var c=Xt(),d=fi(n),m=Vr(c,d);m.payload=s,a!=null&&(m.callback=a),s=ui(n,m,d),s!==null&&(Hn(s,n,d,c),mu(s,n,d))},enqueueReplaceState:function(n,s,a){n=n._reactInternals;var c=Xt(),d=fi(n),m=Vr(c,d);m.tag=1,m.payload=s,a!=null&&(m.callback=a),s=ui(n,m,d),s!==null&&(Hn(s,n,d,c),mu(s,n,d))},enqueueForceUpdate:function(n,s){n=n._reactInternals;var a=Xt(),c=fi(n),d=Vr(a,c);d.tag=2,s!=null&&(d.callback=s),s=ui(n,d,c),s!==null&&(Hn(s,n,c,a),mu(s,n,c))}};function Um(n,s,a,c,d,m,v){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,m,v):s.prototype&&s.prototype.isPureReactComponent?!Ta(a,c)||!Ta(d,m):!0}function Bm(n,s,a){var c=!1,d=oi,m=s.contextType;return typeof m=="object"&&m!==null?m=An(m):(d=tn(s)?as:Ft.current,c=s.contextTypes,m=(c=c!=null)?fo(n,d):oi),s=new s(a,m),n.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,s.updater=Iu,n.stateNode=s,s._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=d,n.__reactInternalMemoizedMaskedChildContext=m),s}function zm(n,s,a,c){n=s.state,typeof s.componentWillReceiveProps=="function"&&s.componentWillReceiveProps(a,c),typeof s.UNSAFE_componentWillReceiveProps=="function"&&s.UNSAFE_componentWillReceiveProps(a,c),s.state!==n&&Iu.enqueueReplaceState(s,s.state,null)}function Gh(n,s,a,c){var d=n.stateNode;d.props=a,d.state=n.memoizedState,d.refs={},Nh(n);var m=s.contextType;typeof m=="object"&&m!==null?d.context=An(m):(m=tn(s)?as:Ft.current,d.context=fo(n,m)),d.state=n.memoizedState,m=s.getDerivedStateFromProps,typeof m=="function"&&(qh(n,s,m,a),d.state=n.memoizedState),typeof s.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(s=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),s!==d.state&&Iu.enqueueReplaceState(d,d.state,null),gu(n,a,d,c),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308)}function wo(n,s){try{var a="",c=s;do a+=Ae(c),c=c.return;while(c);var d=a}catch(m){d=`
Error generating stack: `+m.message+`
`+m.stack}return{value:n,source:s,stack:d,digest:null}}function Kh(n,s,a){return{value:n,source:null,stack:a??null,digest:s??null}}function Qh(n,s){try{console.error(s.value)}catch(a){setTimeout(function(){throw a})}}var nw=typeof WeakMap=="function"?WeakMap:Map;function $m(n,s,a){a=Vr(-1,a),a.tag=3,a.payload={element:null};var c=s.value;return a.callback=function(){Pu||(Pu=!0,cd=c),Qh(n,s)},a}function Wm(n,s,a){a=Vr(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var d=s.value;a.payload=function(){return c(d)},a.callback=function(){Qh(n,s)}}var m=n.stateNode;return m!==null&&typeof m.componentDidCatch=="function"&&(a.callback=function(){Qh(n,s),typeof c!="function"&&(hi===null?hi=new Set([this]):hi.add(this));var v=s.stack;this.componentDidCatch(s.value,{componentStack:v!==null?v:""})}),a}function Hm(n,s,a){var c=n.pingCache;if(c===null){c=n.pingCache=new nw;var d=new Set;c.set(s,d)}else d=c.get(s),d===void 0&&(d=new Set,c.set(s,d));d.has(a)||(d.add(a),n=gw.bind(null,n,s,a),s.then(n,n))}function qm(n){do{var s;if((s=n.tag===13)&&(s=n.memoizedState,s=s!==null?s.dehydrated!==null:!0),s)return n;n=n.return}while(n!==null);return null}function Gm(n,s,a,c,d){return(n.mode&1)===0?(n===s?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(s=Vr(-1,1),s.tag=2,ui(a,s,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=d,n)}var rw=re.ReactCurrentOwner,nn=!1;function Qt(n,s,a,c){s.child=n===null?fm(s,null,a,c):yo(s,n.child,a,c)}function Km(n,s,a,c,d){a=a.render;var m=s.ref;return vo(s,d),c=Uh(n,s,a,c,m,d),a=Bh(),n!==null&&!nn?(s.updateQueue=n.updateQueue,s.flags&=-2053,n.lanes&=~d,Lr(n,s,d)):(et&&a&&Ih(s),s.flags|=1,Qt(n,s,c,d),s.child)}function Qm(n,s,a,c,d){if(n===null){var m=a.type;return typeof m=="function"&&!yd(m)&&m.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(s.tag=15,s.type=m,Xm(n,s,m,c,d)):(n=Lu(a.type,null,c,s,s.mode,d),n.ref=s.ref,n.return=s,s.child=n)}if(m=n.child,(n.lanes&d)===0){var v=m.memoizedProps;if(a=a.compare,a=a!==null?a:Ta,a(v,c)&&n.ref===s.ref)return Lr(n,s,d)}return s.flags|=1,n=mi(m,c),n.ref=s.ref,n.return=s,s.child=n}function Xm(n,s,a,c,d){if(n!==null){var m=n.memoizedProps;if(Ta(m,c)&&n.ref===s.ref)if(nn=!1,s.pendingProps=c=m,(n.lanes&d)!==0)(n.flags&131072)!==0&&(nn=!0);else return s.lanes=n.lanes,Lr(n,s,d)}return Xh(n,s,a,c,d)}function Ym(n,s,a){var c=s.pendingProps,d=c.children,m=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((s.mode&1)===0)s.memoizedState={baseLanes:0,cachePool:null,transitions:null},Ge(Io,gn),gn|=a;else{if((a&1073741824)===0)return n=m!==null?m.baseLanes|a:a,s.lanes=s.childLanes=1073741824,s.memoizedState={baseLanes:n,cachePool:null,transitions:null},s.updateQueue=null,Ge(Io,gn),gn|=n,null;s.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=m!==null?m.baseLanes:a,Ge(Io,gn),gn|=c}else m!==null?(c=m.baseLanes|a,s.memoizedState=null):c=a,Ge(Io,gn),gn|=c;return Qt(n,s,d,a),s.child}function Jm(n,s){var a=s.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(s.flags|=512,s.flags|=2097152)}function Xh(n,s,a,c,d){var m=tn(a)?as:Ft.current;return m=fo(s,m),vo(s,d),a=Uh(n,s,a,c,m,d),c=Bh(),n!==null&&!nn?(s.updateQueue=n.updateQueue,s.flags&=-2053,n.lanes&=~d,Lr(n,s,d)):(et&&c&&Ih(s),s.flags|=1,Qt(n,s,a,d),s.child)}function Zm(n,s,a,c,d){if(tn(a)){var m=!0;au(s)}else m=!1;if(vo(s,d),s.stateNode===null)xu(n,s),Bm(s,a,c),Gh(s,a,c,d),c=!0;else if(n===null){var v=s.stateNode,I=s.memoizedProps;v.props=I;var k=v.context,B=a.contextType;typeof B=="object"&&B!==null?B=An(B):(B=tn(a)?as:Ft.current,B=fo(s,B));var X=a.getDerivedStateFromProps,Y=typeof X=="function"||typeof v.getSnapshotBeforeUpdate=="function";Y||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(I!==c||k!==B)&&zm(s,v,c,B),li=!1;var Q=s.memoizedState;v.state=Q,gu(s,c,v,d),k=s.memoizedState,I!==c||Q!==k||en.current||li?(typeof X=="function"&&(qh(s,a,X,c),k=s.memoizedState),(I=li||Um(s,a,I,c,Q,k,B))?(Y||typeof v.UNSAFE_componentWillMount!="function"&&typeof v.componentWillMount!="function"||(typeof v.componentWillMount=="function"&&v.componentWillMount(),typeof v.UNSAFE_componentWillMount=="function"&&v.UNSAFE_componentWillMount()),typeof v.componentDidMount=="function"&&(s.flags|=4194308)):(typeof v.componentDidMount=="function"&&(s.flags|=4194308),s.memoizedProps=c,s.memoizedState=k),v.props=c,v.state=k,v.context=B,c=I):(typeof v.componentDidMount=="function"&&(s.flags|=4194308),c=!1)}else{v=s.stateNode,mm(n,s),I=s.memoizedProps,B=s.type===s.elementType?I:zn(s.type,I),v.props=B,Y=s.pendingProps,Q=v.context,k=a.contextType,typeof k=="object"&&k!==null?k=An(k):(k=tn(a)?as:Ft.current,k=fo(s,k));var ie=a.getDerivedStateFromProps;(X=typeof ie=="function"||typeof v.getSnapshotBeforeUpdate=="function")||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(I!==Y||Q!==k)&&zm(s,v,c,k),li=!1,Q=s.memoizedState,v.state=Q,gu(s,c,v,d);var le=s.memoizedState;I!==Y||Q!==le||en.current||li?(typeof ie=="function"&&(qh(s,a,ie,c),le=s.memoizedState),(B=li||Um(s,a,B,c,Q,le,k)||!1)?(X||typeof v.UNSAFE_componentWillUpdate!="function"&&typeof v.componentWillUpdate!="function"||(typeof v.componentWillUpdate=="function"&&v.componentWillUpdate(c,le,k),typeof v.UNSAFE_componentWillUpdate=="function"&&v.UNSAFE_componentWillUpdate(c,le,k)),typeof v.componentDidUpdate=="function"&&(s.flags|=4),typeof v.getSnapshotBeforeUpdate=="function"&&(s.flags|=1024)):(typeof v.componentDidUpdate!="function"||I===n.memoizedProps&&Q===n.memoizedState||(s.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||I===n.memoizedProps&&Q===n.memoizedState||(s.flags|=1024),s.memoizedProps=c,s.memoizedState=le),v.props=c,v.state=le,v.context=k,c=B):(typeof v.componentDidUpdate!="function"||I===n.memoizedProps&&Q===n.memoizedState||(s.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||I===n.memoizedProps&&Q===n.memoizedState||(s.flags|=1024),c=!1)}return Yh(n,s,a,c,m,d)}function Yh(n,s,a,c,d,m){Jm(n,s);var v=(s.flags&128)!==0;if(!c&&!v)return d&&im(s,a,!1),Lr(n,s,m);c=s.stateNode,rw.current=s;var I=v&&typeof a.getDerivedStateFromError!="function"?null:c.render();return s.flags|=1,n!==null&&v?(s.child=yo(s,n.child,null,m),s.child=yo(s,null,I,m)):Qt(n,s,I,m),s.memoizedState=c.state,d&&im(s,a,!0),s.child}function eg(n){var s=n.stateNode;s.pendingContext?nm(n,s.pendingContext,s.pendingContext!==s.context):s.context&&nm(n,s.context,!1),Oh(n,s.containerInfo)}function tg(n,s,a,c,d){return go(),Rh(d),s.flags|=256,Qt(n,s,a,c),s.child}var Jh={dehydrated:null,treeContext:null,retryLane:0};function Zh(n){return{baseLanes:n,cachePool:null,transitions:null}}function ng(n,s,a){var c=s.pendingProps,d=tt.current,m=!1,v=(s.flags&128)!==0,I;if((I=v)||(I=n!==null&&n.memoizedState===null?!1:(d&2)!==0),I?(m=!0,s.flags&=-129):(n===null||n.memoizedState!==null)&&(d|=1),Ge(tt,d&1),n===null)return Ah(s),n=s.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((s.mode&1)===0?s.lanes=1:n.data==="$!"?s.lanes=8:s.lanes=1073741824,null):(v=c.children,n=c.fallback,m?(c=s.mode,m=s.child,v={mode:"hidden",children:v},(c&1)===0&&m!==null?(m.childLanes=0,m.pendingProps=v):m=Mu(v,c,0,null),n=ys(n,c,a,null),m.return=s,n.return=s,m.sibling=n,s.child=m,s.child.memoizedState=Zh(a),s.memoizedState=Jh,n):ed(s,v));if(d=n.memoizedState,d!==null&&(I=d.dehydrated,I!==null))return iw(n,s,v,c,I,d,a);if(m){m=c.fallback,v=s.mode,d=n.child,I=d.sibling;var k={mode:"hidden",children:c.children};return(v&1)===0&&s.child!==d?(c=s.child,c.childLanes=0,c.pendingProps=k,s.deletions=null):(c=mi(d,k),c.subtreeFlags=d.subtreeFlags&14680064),I!==null?m=mi(I,m):(m=ys(m,v,a,null),m.flags|=2),m.return=s,c.return=s,c.sibling=m,s.child=c,c=m,m=s.child,v=n.child.memoizedState,v=v===null?Zh(a):{baseLanes:v.baseLanes|a,cachePool:null,transitions:v.transitions},m.memoizedState=v,m.childLanes=n.childLanes&~a,s.memoizedState=Jh,c}return m=n.child,n=m.sibling,c=mi(m,{mode:"visible",children:c.children}),(s.mode&1)===0&&(c.lanes=a),c.return=s,c.sibling=null,n!==null&&(a=s.deletions,a===null?(s.deletions=[n],s.flags|=16):a.push(n)),s.child=c,s.memoizedState=null,c}function ed(n,s){return s=Mu({mode:"visible",children:s},n.mode,0,null),s.return=n,n.child=s}function Su(n,s,a,c){return c!==null&&Rh(c),yo(s,n.child,null,a),n=ed(s,s.pendingProps.children),n.flags|=2,s.memoizedState=null,n}function iw(n,s,a,c,d,m,v){if(a)return s.flags&256?(s.flags&=-257,c=Kh(Error(t(422))),Su(n,s,v,c)):s.memoizedState!==null?(s.child=n.child,s.flags|=128,null):(m=c.fallback,d=s.mode,c=Mu({mode:"visible",children:c.children},d,0,null),m=ys(m,d,v,null),m.flags|=2,c.return=s,m.return=s,c.sibling=m,s.child=c,(s.mode&1)!==0&&yo(s,n.child,null,v),s.child.memoizedState=Zh(v),s.memoizedState=Jh,m);if((s.mode&1)===0)return Su(n,s,v,null);if(d.data==="$!"){if(c=d.nextSibling&&d.nextSibling.dataset,c)var I=c.dgst;return c=I,m=Error(t(419)),c=Kh(m,c,void 0),Su(n,s,v,c)}if(I=(v&n.childLanes)!==0,nn||I){if(c=Rt,c!==null){switch(v&-v){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(c.suspendedLanes|v))!==0?0:d,d!==0&&d!==m.retryLane&&(m.retryLane=d,Or(n,d),Hn(c,n,d,-1))}return gd(),c=Kh(Error(t(421))),Su(n,s,v,c)}return d.data==="$?"?(s.flags|=128,s.child=n.child,s=yw.bind(null,n),d._reactRetry=s,null):(n=m.treeContext,mn=ii(d.nextSibling),pn=s,et=!0,Bn=null,n!==null&&(Sn[xn++]=Dr,Sn[xn++]=Nr,Sn[xn++]=ls,Dr=n.id,Nr=n.overflow,ls=s),s=ed(s,c.children),s.flags|=4096,s)}function rg(n,s,a){n.lanes|=s;var c=n.alternate;c!==null&&(c.lanes|=s),bh(n.return,s,a)}function td(n,s,a,c,d){var m=n.memoizedState;m===null?n.memoizedState={isBackwards:s,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:d}:(m.isBackwards=s,m.rendering=null,m.renderingStartTime=0,m.last=c,m.tail=a,m.tailMode=d)}function ig(n,s,a){var c=s.pendingProps,d=c.revealOrder,m=c.tail;if(Qt(n,s,c.children,a),c=tt.current,(c&2)!==0)c=c&1|2,s.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=s.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&rg(n,a,s);else if(n.tag===19)rg(n,a,s);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===s)break e;for(;n.sibling===null;){if(n.return===null||n.return===s)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(Ge(tt,c),(s.mode&1)===0)s.memoizedState=null;else switch(d){case"forwards":for(a=s.child,d=null;a!==null;)n=a.alternate,n!==null&&yu(n)===null&&(d=a),a=a.sibling;a=d,a===null?(d=s.child,s.child=null):(d=a.sibling,a.sibling=null),td(s,!1,d,a,m);break;case"backwards":for(a=null,d=s.child,s.child=null;d!==null;){if(n=d.alternate,n!==null&&yu(n)===null){s.child=d;break}n=d.sibling,d.sibling=a,a=d,d=n}td(s,!0,a,null,m);break;case"together":td(s,!1,null,null,void 0);break;default:s.memoizedState=null}return s.child}function xu(n,s){(s.mode&1)===0&&n!==null&&(n.alternate=null,s.alternate=null,s.flags|=2)}function Lr(n,s,a){if(n!==null&&(s.dependencies=n.dependencies),fs|=s.lanes,(a&s.childLanes)===0)return null;if(n!==null&&s.child!==n.child)throw Error(t(153));if(s.child!==null){for(n=s.child,a=mi(n,n.pendingProps),s.child=a,a.return=s;n.sibling!==null;)n=n.sibling,a=a.sibling=mi(n,n.pendingProps),a.return=s;a.sibling=null}return s.child}function sw(n,s,a){switch(s.tag){case 3:eg(s),go();break;case 5:_m(s);break;case 1:tn(s.type)&&au(s);break;case 4:Oh(s,s.stateNode.containerInfo);break;case 10:var c=s.type._context,d=s.memoizedProps.value;Ge(fu,c._currentValue),c._currentValue=d;break;case 13:if(c=s.memoizedState,c!==null)return c.dehydrated!==null?(Ge(tt,tt.current&1),s.flags|=128,null):(a&s.child.childLanes)!==0?ng(n,s,a):(Ge(tt,tt.current&1),n=Lr(n,s,a),n!==null?n.sibling:null);Ge(tt,tt.current&1);break;case 19:if(c=(a&s.childLanes)!==0,(n.flags&128)!==0){if(c)return ig(n,s,a);s.flags|=128}if(d=s.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),Ge(tt,tt.current),c)break;return null;case 22:case 23:return s.lanes=0,Ym(n,s,a)}return Lr(n,s,a)}var sg,nd,og,ag;sg=function(n,s){for(var a=s.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===s)break;for(;a.sibling===null;){if(a.return===null||a.return===s)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},nd=function(){},og=function(n,s,a,c){var d=n.memoizedProps;if(d!==c){n=s.stateNode,hs(sr.current);var m=null;switch(a){case"input":d=Wi(n,d),c=Wi(n,c),m=[];break;case"select":d=oe({},d,{value:void 0}),c=oe({},c,{value:void 0}),m=[];break;case"textarea":d=Yo(n,d),c=Yo(n,c),m=[];break;default:typeof d.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=iu)}ra(a,c);var v;a=null;for(B in d)if(!c.hasOwnProperty(B)&&d.hasOwnProperty(B)&&d[B]!=null)if(B==="style"){var I=d[B];for(v in I)I.hasOwnProperty(v)&&(a||(a={}),a[v]="")}else B!=="dangerouslySetInnerHTML"&&B!=="children"&&B!=="suppressContentEditableWarning"&&B!=="suppressHydrationWarning"&&B!=="autoFocus"&&(o.hasOwnProperty(B)?m||(m=[]):(m=m||[]).push(B,null));for(B in c){var k=c[B];if(I=d!=null?d[B]:void 0,c.hasOwnProperty(B)&&k!==I&&(k!=null||I!=null))if(B==="style")if(I){for(v in I)!I.hasOwnProperty(v)||k&&k.hasOwnProperty(v)||(a||(a={}),a[v]="");for(v in k)k.hasOwnProperty(v)&&I[v]!==k[v]&&(a||(a={}),a[v]=k[v])}else a||(m||(m=[]),m.push(B,a)),a=k;else B==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,I=I?I.__html:void 0,k!=null&&I!==k&&(m=m||[]).push(B,k)):B==="children"?typeof k!="string"&&typeof k!="number"||(m=m||[]).push(B,""+k):B!=="suppressContentEditableWarning"&&B!=="suppressHydrationWarning"&&(o.hasOwnProperty(B)?(k!=null&&B==="onScroll"&&Xe("scroll",n),m||I===k||(m=[])):(m=m||[]).push(B,k))}a&&(m=m||[]).push("style",a);var B=m;(s.updateQueue=B)&&(s.flags|=4)}},ag=function(n,s,a,c){a!==c&&(s.flags|=4)};function Ma(n,s){if(!et)switch(n.tailMode){case"hidden":s=n.tail;for(var a=null;s!==null;)s.alternate!==null&&(a=s),s=s.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?s||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function Bt(n){var s=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(s)for(var d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags&14680064,c|=d.flags&14680064,d.return=n,d=d.sibling;else for(d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags,c|=d.flags,d.return=n,d=d.sibling;return n.subtreeFlags|=c,n.childLanes=a,s}function ow(n,s,a){var c=s.pendingProps;switch(Sh(s),s.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Bt(s),null;case 1:return tn(s.type)&&ou(),Bt(s),null;case 3:return c=s.stateNode,Eo(),Ye(en),Ye(Ft),Mh(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(hu(s)?s.flags|=4:n===null||n.memoizedState.isDehydrated&&(s.flags&256)===0||(s.flags|=1024,Bn!==null&&(fd(Bn),Bn=null))),nd(n,s),Bt(s),null;case 5:Vh(s);var d=hs(Da.current);if(a=s.type,n!==null&&s.stateNode!=null)og(n,s,a,c,d),n.ref!==s.ref&&(s.flags|=512,s.flags|=2097152);else{if(!c){if(s.stateNode===null)throw Error(t(166));return Bt(s),null}if(n=hs(sr.current),hu(s)){c=s.stateNode,a=s.type;var m=s.memoizedProps;switch(c[ir]=s,c[Ra]=m,n=(s.mode&1)!==0,a){case"dialog":Xe("cancel",c),Xe("close",c);break;case"iframe":case"object":case"embed":Xe("load",c);break;case"video":case"audio":for(d=0;d<Sa.length;d++)Xe(Sa[d],c);break;case"source":Xe("error",c);break;case"img":case"image":case"link":Xe("error",c),Xe("load",c);break;case"details":Xe("toggle",c);break;case"input":Os(c,m),Xe("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!m.multiple},Xe("invalid",c);break;case"textarea":Ls(c,m),Xe("invalid",c)}ra(a,m),d=null;for(var v in m)if(m.hasOwnProperty(v)){var I=m[v];v==="children"?typeof I=="string"?c.textContent!==I&&(m.suppressHydrationWarning!==!0&&ru(c.textContent,I,n),d=["children",I]):typeof I=="number"&&c.textContent!==""+I&&(m.suppressHydrationWarning!==!0&&ru(c.textContent,I,n),d=["children",""+I]):o.hasOwnProperty(v)&&I!=null&&v==="onScroll"&&Xe("scroll",c)}switch(a){case"input":Er(c),kl(c,m,!0);break;case"textarea":Er(c),Jo(c);break;case"select":case"option":break;default:typeof m.onClick=="function"&&(c.onclick=iu)}c=d,s.updateQueue=c,c!==null&&(s.flags|=4)}else{v=d.nodeType===9?d:d.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=_t(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=v.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=v.createElement(a,{is:c.is}):(n=v.createElement(a),a==="select"&&(v=n,c.multiple?v.multiple=!0:c.size&&(v.size=c.size))):n=v.createElementNS(n,a),n[ir]=s,n[Ra]=c,sg(n,s,!1,!1),s.stateNode=n;e:{switch(v=ia(a,c),a){case"dialog":Xe("cancel",n),Xe("close",n),d=c;break;case"iframe":case"object":case"embed":Xe("load",n),d=c;break;case"video":case"audio":for(d=0;d<Sa.length;d++)Xe(Sa[d],n);d=c;break;case"source":Xe("error",n),d=c;break;case"img":case"image":case"link":Xe("error",n),Xe("load",n),d=c;break;case"details":Xe("toggle",n),d=c;break;case"input":Os(n,c),d=Wi(n,c),Xe("invalid",n);break;case"option":d=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},d=oe({},c,{value:void 0}),Xe("invalid",n);break;case"textarea":Ls(n,c),d=Yo(n,c),Xe("invalid",n);break;default:d=c}ra(a,d),I=d;for(m in I)if(I.hasOwnProperty(m)){var k=I[m];m==="style"?ta(n,k):m==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,k!=null&&Zo(n,k)):m==="children"?typeof k=="string"?(a!=="textarea"||k!=="")&&Gr(n,k):typeof k=="number"&&Gr(n,""+k):m!=="suppressContentEditableWarning"&&m!=="suppressHydrationWarning"&&m!=="autoFocus"&&(o.hasOwnProperty(m)?k!=null&&m==="onScroll"&&Xe("scroll",n):k!=null&&J(n,m,k,v))}switch(a){case"input":Er(n),kl(n,c,!1);break;case"textarea":Er(n),Jo(n);break;case"option":c.value!=null&&n.setAttribute("value",""+Fe(c.value));break;case"select":n.multiple=!!c.multiple,m=c.value,m!=null?Tr(n,!!c.multiple,m,!1):c.defaultValue!=null&&Tr(n,!!c.multiple,c.defaultValue,!0);break;default:typeof d.onClick=="function"&&(n.onclick=iu)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(s.flags|=4)}s.ref!==null&&(s.flags|=512,s.flags|=2097152)}return Bt(s),null;case 6:if(n&&s.stateNode!=null)ag(n,s,n.memoizedProps,c);else{if(typeof c!="string"&&s.stateNode===null)throw Error(t(166));if(a=hs(Da.current),hs(sr.current),hu(s)){if(c=s.stateNode,a=s.memoizedProps,c[ir]=s,(m=c.nodeValue!==a)&&(n=pn,n!==null))switch(n.tag){case 3:ru(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&ru(c.nodeValue,a,(n.mode&1)!==0)}m&&(s.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[ir]=s,s.stateNode=c}return Bt(s),null;case 13:if(Ye(tt),c=s.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(et&&mn!==null&&(s.mode&1)!==0&&(s.flags&128)===0)cm(),go(),s.flags|=98560,m=!1;else if(m=hu(s),c!==null&&c.dehydrated!==null){if(n===null){if(!m)throw Error(t(318));if(m=s.memoizedState,m=m!==null?m.dehydrated:null,!m)throw Error(t(317));m[ir]=s}else go(),(s.flags&128)===0&&(s.memoizedState=null),s.flags|=4;Bt(s),m=!1}else Bn!==null&&(fd(Bn),Bn=null),m=!0;if(!m)return s.flags&65536?s:null}return(s.flags&128)!==0?(s.lanes=a,s):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(s.child.flags|=8192,(s.mode&1)!==0&&(n===null||(tt.current&1)!==0?Tt===0&&(Tt=3):gd())),s.updateQueue!==null&&(s.flags|=4),Bt(s),null);case 4:return Eo(),nd(n,s),n===null&&xa(s.stateNode.containerInfo),Bt(s),null;case 10:return Ph(s.type._context),Bt(s),null;case 17:return tn(s.type)&&ou(),Bt(s),null;case 19:if(Ye(tt),m=s.memoizedState,m===null)return Bt(s),null;if(c=(s.flags&128)!==0,v=m.rendering,v===null)if(c)Ma(m,!1);else{if(Tt!==0||n!==null&&(n.flags&128)!==0)for(n=s.child;n!==null;){if(v=yu(n),v!==null){for(s.flags|=128,Ma(m,!1),c=v.updateQueue,c!==null&&(s.updateQueue=c,s.flags|=4),s.subtreeFlags=0,c=a,a=s.child;a!==null;)m=a,n=c,m.flags&=14680066,v=m.alternate,v===null?(m.childLanes=0,m.lanes=n,m.child=null,m.subtreeFlags=0,m.memoizedProps=null,m.memoizedState=null,m.updateQueue=null,m.dependencies=null,m.stateNode=null):(m.childLanes=v.childLanes,m.lanes=v.lanes,m.child=v.child,m.subtreeFlags=0,m.deletions=null,m.memoizedProps=v.memoizedProps,m.memoizedState=v.memoizedState,m.updateQueue=v.updateQueue,m.type=v.type,n=v.dependencies,m.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return Ge(tt,tt.current&1|2),s.child}n=n.sibling}m.tail!==null&&qe()>So&&(s.flags|=128,c=!0,Ma(m,!1),s.lanes=4194304)}else{if(!c)if(n=yu(v),n!==null){if(s.flags|=128,c=!0,a=n.updateQueue,a!==null&&(s.updateQueue=a,s.flags|=4),Ma(m,!0),m.tail===null&&m.tailMode==="hidden"&&!v.alternate&&!et)return Bt(s),null}else 2*qe()-m.renderingStartTime>So&&a!==1073741824&&(s.flags|=128,c=!0,Ma(m,!1),s.lanes=4194304);m.isBackwards?(v.sibling=s.child,s.child=v):(a=m.last,a!==null?a.sibling=v:s.child=v,m.last=v)}return m.tail!==null?(s=m.tail,m.rendering=s,m.tail=s.sibling,m.renderingStartTime=qe(),s.sibling=null,a=tt.current,Ge(tt,c?a&1|2:a&1),s):(Bt(s),null);case 22:case 23:return md(),c=s.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(s.flags|=8192),c&&(s.mode&1)!==0?(gn&1073741824)!==0&&(Bt(s),s.subtreeFlags&6&&(s.flags|=8192)):Bt(s),null;case 24:return null;case 25:return null}throw Error(t(156,s.tag))}function aw(n,s){switch(Sh(s),s.tag){case 1:return tn(s.type)&&ou(),n=s.flags,n&65536?(s.flags=n&-65537|128,s):null;case 3:return Eo(),Ye(en),Ye(Ft),Mh(),n=s.flags,(n&65536)!==0&&(n&128)===0?(s.flags=n&-65537|128,s):null;case 5:return Vh(s),null;case 13:if(Ye(tt),n=s.memoizedState,n!==null&&n.dehydrated!==null){if(s.alternate===null)throw Error(t(340));go()}return n=s.flags,n&65536?(s.flags=n&-65537|128,s):null;case 19:return Ye(tt),null;case 4:return Eo(),null;case 10:return Ph(s.type._context),null;case 22:case 23:return md(),null;case 24:return null;default:return null}}var Au=!1,zt=!1,lw=typeof WeakSet=="function"?WeakSet:Set,ae=null;function To(n,s){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){it(n,s,c)}else a.current=null}function rd(n,s,a){try{a()}catch(c){it(n,s,c)}}var lg=!1;function uw(n,s){if(mh=ti,n=Up(),ah(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var d=c.anchorOffset,m=c.focusNode;c=c.focusOffset;try{a.nodeType,m.nodeType}catch{a=null;break e}var v=0,I=-1,k=-1,B=0,X=0,Y=n,Q=null;t:for(;;){for(var ie;Y!==a||d!==0&&Y.nodeType!==3||(I=v+d),Y!==m||c!==0&&Y.nodeType!==3||(k=v+c),Y.nodeType===3&&(v+=Y.nodeValue.length),(ie=Y.firstChild)!==null;)Q=Y,Y=ie;for(;;){if(Y===n)break t;if(Q===a&&++B===d&&(I=v),Q===m&&++X===c&&(k=v),(ie=Y.nextSibling)!==null)break;Y=Q,Q=Y.parentNode}Y=ie}a=I===-1||k===-1?null:{start:I,end:k}}else a=null}a=a||{start:0,end:0}}else a=null;for(gh={focusedElem:n,selectionRange:a},ti=!1,ae=s;ae!==null;)if(s=ae,n=s.child,(s.subtreeFlags&1028)!==0&&n!==null)n.return=s,ae=n;else for(;ae!==null;){s=ae;try{var le=s.alternate;if((s.flags&1024)!==0)switch(s.tag){case 0:case 11:case 15:break;case 1:if(le!==null){var ue=le.memoizedProps,ct=le.memoizedState,F=s.stateNode,b=F.getSnapshotBeforeUpdate(s.elementType===s.type?ue:zn(s.type,ue),ct);F.__reactInternalSnapshotBeforeUpdate=b}break;case 3:var U=s.stateNode.containerInfo;U.nodeType===1?U.textContent="":U.nodeType===9&&U.documentElement&&U.removeChild(U.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Z){it(s,s.return,Z)}if(n=s.sibling,n!==null){n.return=s.return,ae=n;break}ae=s.return}return le=lg,lg=!1,le}function ja(n,s,a){var c=s.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var d=c=c.next;do{if((d.tag&n)===n){var m=d.destroy;d.destroy=void 0,m!==void 0&&rd(s,a,m)}d=d.next}while(d!==c)}}function Ru(n,s){if(s=s.updateQueue,s=s!==null?s.lastEffect:null,s!==null){var a=s=s.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==s)}}function id(n){var s=n.ref;if(s!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof s=="function"?s(n):s.current=n}}function ug(n){var s=n.alternate;s!==null&&(n.alternate=null,ug(s)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(s=n.stateNode,s!==null&&(delete s[ir],delete s[Ra],delete s[Eh],delete s[HE],delete s[qE])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function cg(n){return n.tag===5||n.tag===3||n.tag===4}function hg(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||cg(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function sd(n,s,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,s?a.nodeType===8?a.parentNode.insertBefore(n,s):a.insertBefore(n,s):(a.nodeType===8?(s=a.parentNode,s.insertBefore(n,a)):(s=a,s.appendChild(n)),a=a._reactRootContainer,a!=null||s.onclick!==null||(s.onclick=iu));else if(c!==4&&(n=n.child,n!==null))for(sd(n,s,a),n=n.sibling;n!==null;)sd(n,s,a),n=n.sibling}function od(n,s,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,s?a.insertBefore(n,s):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(od(n,s,a),n=n.sibling;n!==null;)od(n,s,a),n=n.sibling}var Dt=null,$n=!1;function ci(n,s,a){for(a=a.child;a!==null;)dg(n,s,a),a=a.sibling}function dg(n,s,a){if(cn&&typeof cn.onCommitFiberUnmount=="function")try{cn.onCommitFiberUnmount(Zi,a)}catch{}switch(a.tag){case 5:zt||To(a,s);case 6:var c=Dt,d=$n;Dt=null,ci(n,s,a),Dt=c,$n=d,Dt!==null&&($n?(n=Dt,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):Dt.removeChild(a.stateNode));break;case 18:Dt!==null&&($n?(n=Dt,a=a.stateNode,n.nodeType===8?vh(n.parentNode,a):n.nodeType===1&&vh(n,a),jn(n)):vh(Dt,a.stateNode));break;case 4:c=Dt,d=$n,Dt=a.stateNode.containerInfo,$n=!0,ci(n,s,a),Dt=c,$n=d;break;case 0:case 11:case 14:case 15:if(!zt&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){d=c=c.next;do{var m=d,v=m.destroy;m=m.tag,v!==void 0&&((m&2)!==0||(m&4)!==0)&&rd(a,s,v),d=d.next}while(d!==c)}ci(n,s,a);break;case 1:if(!zt&&(To(a,s),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(I){it(a,s,I)}ci(n,s,a);break;case 21:ci(n,s,a);break;case 22:a.mode&1?(zt=(c=zt)||a.memoizedState!==null,ci(n,s,a),zt=c):ci(n,s,a);break;default:ci(n,s,a)}}function fg(n){var s=n.updateQueue;if(s!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new lw),s.forEach(function(c){var d=_w.bind(null,n,c);a.has(c)||(a.add(c),c.then(d,d))})}}function Wn(n,s){var a=s.deletions;if(a!==null)for(var c=0;c<a.length;c++){var d=a[c];try{var m=n,v=s,I=v;e:for(;I!==null;){switch(I.tag){case 5:Dt=I.stateNode,$n=!1;break e;case 3:Dt=I.stateNode.containerInfo,$n=!0;break e;case 4:Dt=I.stateNode.containerInfo,$n=!0;break e}I=I.return}if(Dt===null)throw Error(t(160));dg(m,v,d),Dt=null,$n=!1;var k=d.alternate;k!==null&&(k.return=null),d.return=null}catch(B){it(d,s,B)}}if(s.subtreeFlags&12854)for(s=s.child;s!==null;)pg(s,n),s=s.sibling}function pg(n,s){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Wn(s,n),ar(n),c&4){try{ja(3,n,n.return),Ru(3,n)}catch(ue){it(n,n.return,ue)}try{ja(5,n,n.return)}catch(ue){it(n,n.return,ue)}}break;case 1:Wn(s,n),ar(n),c&512&&a!==null&&To(a,a.return);break;case 5:if(Wn(s,n),ar(n),c&512&&a!==null&&To(a,a.return),n.flags&32){var d=n.stateNode;try{Gr(d,"")}catch(ue){it(n,n.return,ue)}}if(c&4&&(d=n.stateNode,d!=null)){var m=n.memoizedProps,v=a!==null?a.memoizedProps:m,I=n.type,k=n.updateQueue;if(n.updateQueue=null,k!==null)try{I==="input"&&m.type==="radio"&&m.name!=null&&Qo(d,m),ia(I,v);var B=ia(I,m);for(v=0;v<k.length;v+=2){var X=k[v],Y=k[v+1];X==="style"?ta(d,Y):X==="dangerouslySetInnerHTML"?Zo(d,Y):X==="children"?Gr(d,Y):J(d,X,Y,B)}switch(I){case"input":Xo(d,m);break;case"textarea":Ms(d,m);break;case"select":var Q=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!m.multiple;var ie=m.value;ie!=null?Tr(d,!!m.multiple,ie,!1):Q!==!!m.multiple&&(m.defaultValue!=null?Tr(d,!!m.multiple,m.defaultValue,!0):Tr(d,!!m.multiple,m.multiple?[]:"",!1))}d[Ra]=m}catch(ue){it(n,n.return,ue)}}break;case 6:if(Wn(s,n),ar(n),c&4){if(n.stateNode===null)throw Error(t(162));d=n.stateNode,m=n.memoizedProps;try{d.nodeValue=m}catch(ue){it(n,n.return,ue)}}break;case 3:if(Wn(s,n),ar(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{jn(s.containerInfo)}catch(ue){it(n,n.return,ue)}break;case 4:Wn(s,n),ar(n);break;case 13:Wn(s,n),ar(n),d=n.child,d.flags&8192&&(m=d.memoizedState!==null,d.stateNode.isHidden=m,!m||d.alternate!==null&&d.alternate.memoizedState!==null||(ud=qe())),c&4&&fg(n);break;case 22:if(X=a!==null&&a.memoizedState!==null,n.mode&1?(zt=(B=zt)||X,Wn(s,n),zt=B):Wn(s,n),ar(n),c&8192){if(B=n.memoizedState!==null,(n.stateNode.isHidden=B)&&!X&&(n.mode&1)!==0)for(ae=n,X=n.child;X!==null;){for(Y=ae=X;ae!==null;){switch(Q=ae,ie=Q.child,Q.tag){case 0:case 11:case 14:case 15:ja(4,Q,Q.return);break;case 1:To(Q,Q.return);var le=Q.stateNode;if(typeof le.componentWillUnmount=="function"){c=Q,a=Q.return;try{s=c,le.props=s.memoizedProps,le.state=s.memoizedState,le.componentWillUnmount()}catch(ue){it(c,a,ue)}}break;case 5:To(Q,Q.return);break;case 22:if(Q.memoizedState!==null){yg(Y);continue}}ie!==null?(ie.return=Q,ae=ie):yg(Y)}X=X.sibling}e:for(X=null,Y=n;;){if(Y.tag===5){if(X===null){X=Y;try{d=Y.stateNode,B?(m=d.style,typeof m.setProperty=="function"?m.setProperty("display","none","important"):m.display="none"):(I=Y.stateNode,k=Y.memoizedProps.style,v=k!=null&&k.hasOwnProperty("display")?k.display:null,I.style.display=ea("display",v))}catch(ue){it(n,n.return,ue)}}}else if(Y.tag===6){if(X===null)try{Y.stateNode.nodeValue=B?"":Y.memoizedProps}catch(ue){it(n,n.return,ue)}}else if((Y.tag!==22&&Y.tag!==23||Y.memoizedState===null||Y===n)&&Y.child!==null){Y.child.return=Y,Y=Y.child;continue}if(Y===n)break e;for(;Y.sibling===null;){if(Y.return===null||Y.return===n)break e;X===Y&&(X=null),Y=Y.return}X===Y&&(X=null),Y.sibling.return=Y.return,Y=Y.sibling}}break;case 19:Wn(s,n),ar(n),c&4&&fg(n);break;case 21:break;default:Wn(s,n),ar(n)}}function ar(n){var s=n.flags;if(s&2){try{e:{for(var a=n.return;a!==null;){if(cg(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var d=c.stateNode;c.flags&32&&(Gr(d,""),c.flags&=-33);var m=hg(n);od(n,m,d);break;case 3:case 4:var v=c.stateNode.containerInfo,I=hg(n);sd(n,I,v);break;default:throw Error(t(161))}}catch(k){it(n,n.return,k)}n.flags&=-3}s&4096&&(n.flags&=-4097)}function cw(n,s,a){ae=n,mg(n)}function mg(n,s,a){for(var c=(n.mode&1)!==0;ae!==null;){var d=ae,m=d.child;if(d.tag===22&&c){var v=d.memoizedState!==null||Au;if(!v){var I=d.alternate,k=I!==null&&I.memoizedState!==null||zt;I=Au;var B=zt;if(Au=v,(zt=k)&&!B)for(ae=d;ae!==null;)v=ae,k=v.child,v.tag===22&&v.memoizedState!==null?_g(d):k!==null?(k.return=v,ae=k):_g(d);for(;m!==null;)ae=m,mg(m),m=m.sibling;ae=d,Au=I,zt=B}gg(n)}else(d.subtreeFlags&8772)!==0&&m!==null?(m.return=d,ae=m):gg(n)}}function gg(n){for(;ae!==null;){var s=ae;if((s.flags&8772)!==0){var a=s.alternate;try{if((s.flags&8772)!==0)switch(s.tag){case 0:case 11:case 15:zt||Ru(5,s);break;case 1:var c=s.stateNode;if(s.flags&4&&!zt)if(a===null)c.componentDidMount();else{var d=s.elementType===s.type?a.memoizedProps:zn(s.type,a.memoizedProps);c.componentDidUpdate(d,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var m=s.updateQueue;m!==null&&ym(s,m,c);break;case 3:var v=s.updateQueue;if(v!==null){if(a=null,s.child!==null)switch(s.child.tag){case 5:a=s.child.stateNode;break;case 1:a=s.child.stateNode}ym(s,v,a)}break;case 5:var I=s.stateNode;if(a===null&&s.flags&4){a=I;var k=s.memoizedProps;switch(s.type){case"button":case"input":case"select":case"textarea":k.autoFocus&&a.focus();break;case"img":k.src&&(a.src=k.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(s.memoizedState===null){var B=s.alternate;if(B!==null){var X=B.memoizedState;if(X!==null){var Y=X.dehydrated;Y!==null&&jn(Y)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}zt||s.flags&512&&id(s)}catch(Q){it(s,s.return,Q)}}if(s===n){ae=null;break}if(a=s.sibling,a!==null){a.return=s.return,ae=a;break}ae=s.return}}function yg(n){for(;ae!==null;){var s=ae;if(s===n){ae=null;break}var a=s.sibling;if(a!==null){a.return=s.return,ae=a;break}ae=s.return}}function _g(n){for(;ae!==null;){var s=ae;try{switch(s.tag){case 0:case 11:case 15:var a=s.return;try{Ru(4,s)}catch(k){it(s,a,k)}break;case 1:var c=s.stateNode;if(typeof c.componentDidMount=="function"){var d=s.return;try{c.componentDidMount()}catch(k){it(s,d,k)}}var m=s.return;try{id(s)}catch(k){it(s,m,k)}break;case 5:var v=s.return;try{id(s)}catch(k){it(s,v,k)}}}catch(k){it(s,s.return,k)}if(s===n){ae=null;break}var I=s.sibling;if(I!==null){I.return=s.return,ae=I;break}ae=s.return}}var hw=Math.ceil,Cu=re.ReactCurrentDispatcher,ad=re.ReactCurrentOwner,Cn=re.ReactCurrentBatchConfig,Le=0,Rt=null,pt=null,Nt=0,gn=0,Io=si(0),Tt=0,Fa=null,fs=0,ku=0,ld=0,Ua=null,rn=null,ud=0,So=1/0,Mr=null,Pu=!1,cd=null,hi=null,bu=!1,di=null,Du=0,Ba=0,hd=null,Nu=-1,Ou=0;function Xt(){return(Le&6)!==0?qe():Nu!==-1?Nu:Nu=qe()}function fi(n){return(n.mode&1)===0?1:(Le&2)!==0&&Nt!==0?Nt&-Nt:KE.transition!==null?(Ou===0&&(Ou=ts()),Ou):(n=be,n!==0||(n=window.event,n=n===void 0?16:ma(n.type)),n)}function Hn(n,s,a,c){if(50<Ba)throw Ba=0,hd=null,Error(t(185));Yr(n,a,c),((Le&2)===0||n!==Rt)&&(n===Rt&&((Le&2)===0&&(ku|=a),Tt===4&&pi(n,Nt)),sn(n,c),a===1&&Le===0&&(s.mode&1)===0&&(So=qe()+500,lu&&ai()))}function sn(n,s){var a=n.callbackNode;xr(n,s);var c=es(n,n===Rt?Nt:0);if(c===0)a!==null&&ca(a),n.callbackNode=null,n.callbackPriority=0;else if(s=c&-c,n.callbackPriority!==s){if(a!=null&&ca(a),s===1)n.tag===0?GE(Eg.bind(null,n)):sm(Eg.bind(null,n)),$E(function(){(Le&6)===0&&ai()}),a=null;else{switch(Zr(c)){case 1:a=Ji;break;case 4:a=Kr;break;case 16:a=wn;break;case 536870912:a=Ol;break;default:a=wn}a=Cg(a,vg.bind(null,n))}n.callbackPriority=s,n.callbackNode=a}}function vg(n,s){if(Nu=-1,Ou=0,(Le&6)!==0)throw Error(t(327));var a=n.callbackNode;if(xo()&&n.callbackNode!==a)return null;var c=es(n,n===Rt?Nt:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||s)s=Vu(n,c);else{s=c;var d=Le;Le|=2;var m=Tg();(Rt!==n||Nt!==s)&&(Mr=null,So=qe()+500,ms(n,s));do try{pw();break}catch(I){wg(n,I)}while(!0);kh(),Cu.current=m,Le=d,pt!==null?s=0:(Rt=null,Nt=0,s=Tt)}if(s!==0){if(s===2&&(d=hn(n),d!==0&&(c=d,s=dd(n,d))),s===1)throw a=Fa,ms(n,0),pi(n,c),sn(n,qe()),a;if(s===6)pi(n,c);else{if(d=n.current.alternate,(c&30)===0&&!dw(d)&&(s=Vu(n,c),s===2&&(m=hn(n),m!==0&&(c=m,s=dd(n,m))),s===1))throw a=Fa,ms(n,0),pi(n,c),sn(n,qe()),a;switch(n.finishedWork=d,n.finishedLanes=c,s){case 0:case 1:throw Error(t(345));case 2:gs(n,rn,Mr);break;case 3:if(pi(n,c),(c&130023424)===c&&(s=ud+500-qe(),10<s)){if(es(n,0)!==0)break;if(d=n.suspendedLanes,(d&c)!==c){Xt(),n.pingedLanes|=n.suspendedLanes&d;break}n.timeoutHandle=_h(gs.bind(null,n,rn,Mr),s);break}gs(n,rn,Mr);break;case 4:if(pi(n,c),(c&4194240)===c)break;for(s=n.eventTimes,d=-1;0<c;){var v=31-Gt(c);m=1<<v,v=s[v],v>d&&(d=v),c&=~m}if(c=d,c=qe()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*hw(c/1960))-c,10<c){n.timeoutHandle=_h(gs.bind(null,n,rn,Mr),c);break}gs(n,rn,Mr);break;case 5:gs(n,rn,Mr);break;default:throw Error(t(329))}}}return sn(n,qe()),n.callbackNode===a?vg.bind(null,n):null}function dd(n,s){var a=Ua;return n.current.memoizedState.isDehydrated&&(ms(n,s).flags|=256),n=Vu(n,s),n!==2&&(s=rn,rn=a,s!==null&&fd(s)),n}function fd(n){rn===null?rn=n:rn.push.apply(rn,n)}function dw(n){for(var s=n;;){if(s.flags&16384){var a=s.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var d=a[c],m=d.getSnapshot;d=d.value;try{if(!Un(m(),d))return!1}catch{return!1}}}if(a=s.child,s.subtreeFlags&16384&&a!==null)a.return=s,s=a;else{if(s===n)break;for(;s.sibling===null;){if(s.return===null||s.return===n)return!0;s=s.return}s.sibling.return=s.return,s=s.sibling}}return!0}function pi(n,s){for(s&=~ld,s&=~ku,n.suspendedLanes|=s,n.pingedLanes&=~s,n=n.expirationTimes;0<s;){var a=31-Gt(s),c=1<<a;n[a]=-1,s&=~c}}function Eg(n){if((Le&6)!==0)throw Error(t(327));xo();var s=es(n,0);if((s&1)===0)return sn(n,qe()),null;var a=Vu(n,s);if(n.tag!==0&&a===2){var c=hn(n);c!==0&&(s=c,a=dd(n,c))}if(a===1)throw a=Fa,ms(n,0),pi(n,s),sn(n,qe()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=s,gs(n,rn,Mr),sn(n,qe()),null}function pd(n,s){var a=Le;Le|=1;try{return n(s)}finally{Le=a,Le===0&&(So=qe()+500,lu&&ai())}}function ps(n){di!==null&&di.tag===0&&(Le&6)===0&&xo();var s=Le;Le|=1;var a=Cn.transition,c=be;try{if(Cn.transition=null,be=1,n)return n()}finally{be=c,Cn.transition=a,Le=s,(Le&6)===0&&ai()}}function md(){gn=Io.current,Ye(Io)}function ms(n,s){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,zE(a)),pt!==null)for(a=pt.return;a!==null;){var c=a;switch(Sh(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&ou();break;case 3:Eo(),Ye(en),Ye(Ft),Mh();break;case 5:Vh(c);break;case 4:Eo();break;case 13:Ye(tt);break;case 19:Ye(tt);break;case 10:Ph(c.type._context);break;case 22:case 23:md()}a=a.return}if(Rt=n,pt=n=mi(n.current,null),Nt=gn=s,Tt=0,Fa=null,ld=ku=fs=0,rn=Ua=null,cs!==null){for(s=0;s<cs.length;s++)if(a=cs[s],c=a.interleaved,c!==null){a.interleaved=null;var d=c.next,m=a.pending;if(m!==null){var v=m.next;m.next=d,c.next=v}a.pending=c}cs=null}return n}function wg(n,s){do{var a=pt;try{if(kh(),_u.current=Tu,vu){for(var c=nt.memoizedState;c!==null;){var d=c.queue;d!==null&&(d.pending=null),c=c.next}vu=!1}if(ds=0,At=wt=nt=null,Na=!1,Oa=0,ad.current=null,a===null||a.return===null){Tt=1,Fa=s,pt=null;break}e:{var m=n,v=a.return,I=a,k=s;if(s=Nt,I.flags|=32768,k!==null&&typeof k=="object"&&typeof k.then=="function"){var B=k,X=I,Y=X.tag;if((X.mode&1)===0&&(Y===0||Y===11||Y===15)){var Q=X.alternate;Q?(X.updateQueue=Q.updateQueue,X.memoizedState=Q.memoizedState,X.lanes=Q.lanes):(X.updateQueue=null,X.memoizedState=null)}var ie=qm(v);if(ie!==null){ie.flags&=-257,Gm(ie,v,I,m,s),ie.mode&1&&Hm(m,B,s),s=ie,k=B;var le=s.updateQueue;if(le===null){var ue=new Set;ue.add(k),s.updateQueue=ue}else le.add(k);break e}else{if((s&1)===0){Hm(m,B,s),gd();break e}k=Error(t(426))}}else if(et&&I.mode&1){var ct=qm(v);if(ct!==null){(ct.flags&65536)===0&&(ct.flags|=256),Gm(ct,v,I,m,s),Rh(wo(k,I));break e}}m=k=wo(k,I),Tt!==4&&(Tt=2),Ua===null?Ua=[m]:Ua.push(m),m=v;do{switch(m.tag){case 3:m.flags|=65536,s&=-s,m.lanes|=s;var F=$m(m,k,s);gm(m,F);break e;case 1:I=k;var b=m.type,U=m.stateNode;if((m.flags&128)===0&&(typeof b.getDerivedStateFromError=="function"||U!==null&&typeof U.componentDidCatch=="function"&&(hi===null||!hi.has(U)))){m.flags|=65536,s&=-s,m.lanes|=s;var Z=Wm(m,I,s);gm(m,Z);break e}}m=m.return}while(m!==null)}Sg(a)}catch(ce){s=ce,pt===a&&a!==null&&(pt=a=a.return);continue}break}while(!0)}function Tg(){var n=Cu.current;return Cu.current=Tu,n===null?Tu:n}function gd(){(Tt===0||Tt===3||Tt===2)&&(Tt=4),Rt===null||(fs&268435455)===0&&(ku&268435455)===0||pi(Rt,Nt)}function Vu(n,s){var a=Le;Le|=2;var c=Tg();(Rt!==n||Nt!==s)&&(Mr=null,ms(n,s));do try{fw();break}catch(d){wg(n,d)}while(!0);if(kh(),Le=a,Cu.current=c,pt!==null)throw Error(t(261));return Rt=null,Nt=0,Tt}function fw(){for(;pt!==null;)Ig(pt)}function pw(){for(;pt!==null&&!Dl();)Ig(pt)}function Ig(n){var s=Rg(n.alternate,n,gn);n.memoizedProps=n.pendingProps,s===null?Sg(n):pt=s,ad.current=null}function Sg(n){var s=n;do{var a=s.alternate;if(n=s.return,(s.flags&32768)===0){if(a=ow(a,s,gn),a!==null){pt=a;return}}else{if(a=aw(a,s),a!==null){a.flags&=32767,pt=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Tt=6,pt=null;return}}if(s=s.sibling,s!==null){pt=s;return}pt=s=n}while(s!==null);Tt===0&&(Tt=5)}function gs(n,s,a){var c=be,d=Cn.transition;try{Cn.transition=null,be=1,mw(n,s,a,c)}finally{Cn.transition=d,be=c}return null}function mw(n,s,a,c){do xo();while(di!==null);if((Le&6)!==0)throw Error(t(327));a=n.finishedWork;var d=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var m=a.lanes|a.childLanes;if(We(n,m),n===Rt&&(pt=Rt=null,Nt=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||bu||(bu=!0,Cg(wn,function(){return xo(),null})),m=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||m){m=Cn.transition,Cn.transition=null;var v=be;be=1;var I=Le;Le|=4,ad.current=null,uw(n,a),pg(a,n),VE(gh),ti=!!mh,gh=mh=null,n.current=a,cw(a),Zc(),Le=I,be=v,Cn.transition=m}else n.current=a;if(bu&&(bu=!1,di=n,Du=d),m=n.pendingLanes,m===0&&(hi=null),Vl(a.stateNode),sn(n,qe()),s!==null)for(c=n.onRecoverableError,a=0;a<s.length;a++)d=s[a],c(d.value,{componentStack:d.stack,digest:d.digest});if(Pu)throw Pu=!1,n=cd,cd=null,n;return(Du&1)!==0&&n.tag!==0&&xo(),m=n.pendingLanes,(m&1)!==0?n===hd?Ba++:(Ba=0,hd=n):Ba=0,ai(),null}function xo(){if(di!==null){var n=Zr(Du),s=Cn.transition,a=be;try{if(Cn.transition=null,be=16>n?16:n,di===null)var c=!1;else{if(n=di,di=null,Du=0,(Le&6)!==0)throw Error(t(331));var d=Le;for(Le|=4,ae=n.current;ae!==null;){var m=ae,v=m.child;if((ae.flags&16)!==0){var I=m.deletions;if(I!==null){for(var k=0;k<I.length;k++){var B=I[k];for(ae=B;ae!==null;){var X=ae;switch(X.tag){case 0:case 11:case 15:ja(8,X,m)}var Y=X.child;if(Y!==null)Y.return=X,ae=Y;else for(;ae!==null;){X=ae;var Q=X.sibling,ie=X.return;if(ug(X),X===B){ae=null;break}if(Q!==null){Q.return=ie,ae=Q;break}ae=ie}}}var le=m.alternate;if(le!==null){var ue=le.child;if(ue!==null){le.child=null;do{var ct=ue.sibling;ue.sibling=null,ue=ct}while(ue!==null)}}ae=m}}if((m.subtreeFlags&2064)!==0&&v!==null)v.return=m,ae=v;else e:for(;ae!==null;){if(m=ae,(m.flags&2048)!==0)switch(m.tag){case 0:case 11:case 15:ja(9,m,m.return)}var F=m.sibling;if(F!==null){F.return=m.return,ae=F;break e}ae=m.return}}var b=n.current;for(ae=b;ae!==null;){v=ae;var U=v.child;if((v.subtreeFlags&2064)!==0&&U!==null)U.return=v,ae=U;else e:for(v=b;ae!==null;){if(I=ae,(I.flags&2048)!==0)try{switch(I.tag){case 0:case 11:case 15:Ru(9,I)}}catch(ce){it(I,I.return,ce)}if(I===v){ae=null;break e}var Z=I.sibling;if(Z!==null){Z.return=I.return,ae=Z;break e}ae=I.return}}if(Le=d,ai(),cn&&typeof cn.onPostCommitFiberRoot=="function")try{cn.onPostCommitFiberRoot(Zi,n)}catch{}c=!0}return c}finally{be=a,Cn.transition=s}}return!1}function xg(n,s,a){s=wo(a,s),s=$m(n,s,1),n=ui(n,s,1),s=Xt(),n!==null&&(Yr(n,1,s),sn(n,s))}function it(n,s,a){if(n.tag===3)xg(n,n,a);else for(;s!==null;){if(s.tag===3){xg(s,n,a);break}else if(s.tag===1){var c=s.stateNode;if(typeof s.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(hi===null||!hi.has(c))){n=wo(a,n),n=Wm(s,n,1),s=ui(s,n,1),n=Xt(),s!==null&&(Yr(s,1,n),sn(s,n));break}}s=s.return}}function gw(n,s,a){var c=n.pingCache;c!==null&&c.delete(s),s=Xt(),n.pingedLanes|=n.suspendedLanes&a,Rt===n&&(Nt&a)===a&&(Tt===4||Tt===3&&(Nt&130023424)===Nt&&500>qe()-ud?ms(n,0):ld|=a),sn(n,s)}function Ag(n,s){s===0&&((n.mode&1)===0?s=1:(s=Gs,Gs<<=1,(Gs&130023424)===0&&(Gs=4194304)));var a=Xt();n=Or(n,s),n!==null&&(Yr(n,s,a),sn(n,a))}function yw(n){var s=n.memoizedState,a=0;s!==null&&(a=s.retryLane),Ag(n,a)}function _w(n,s){var a=0;switch(n.tag){case 13:var c=n.stateNode,d=n.memoizedState;d!==null&&(a=d.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(s),Ag(n,a)}var Rg;Rg=function(n,s,a){if(n!==null)if(n.memoizedProps!==s.pendingProps||en.current)nn=!0;else{if((n.lanes&a)===0&&(s.flags&128)===0)return nn=!1,sw(n,s,a);nn=(n.flags&131072)!==0}else nn=!1,et&&(s.flags&1048576)!==0&&om(s,cu,s.index);switch(s.lanes=0,s.tag){case 2:var c=s.type;xu(n,s),n=s.pendingProps;var d=fo(s,Ft.current);vo(s,a),d=Uh(null,s,c,n,d,a);var m=Bh();return s.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(s.tag=1,s.memoizedState=null,s.updateQueue=null,tn(c)?(m=!0,au(s)):m=!1,s.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,Nh(s),d.updater=Iu,s.stateNode=d,d._reactInternals=s,Gh(s,c,n,a),s=Yh(null,s,c,!0,m,a)):(s.tag=0,et&&m&&Ih(s),Qt(null,s,d,a),s=s.child),s;case 16:c=s.elementType;e:{switch(xu(n,s),n=s.pendingProps,d=c._init,c=d(c._payload),s.type=c,d=s.tag=Ew(c),n=zn(c,n),d){case 0:s=Xh(null,s,c,n,a);break e;case 1:s=Zm(null,s,c,n,a);break e;case 11:s=Km(null,s,c,n,a);break e;case 14:s=Qm(null,s,c,zn(c.type,n),a);break e}throw Error(t(306,c,""))}return s;case 0:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:zn(c,d),Xh(n,s,c,d,a);case 1:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:zn(c,d),Zm(n,s,c,d,a);case 3:e:{if(eg(s),n===null)throw Error(t(387));c=s.pendingProps,m=s.memoizedState,d=m.element,mm(n,s),gu(s,c,null,a);var v=s.memoizedState;if(c=v.element,m.isDehydrated)if(m={element:c,isDehydrated:!1,cache:v.cache,pendingSuspenseBoundaries:v.pendingSuspenseBoundaries,transitions:v.transitions},s.updateQueue.baseState=m,s.memoizedState=m,s.flags&256){d=wo(Error(t(423)),s),s=tg(n,s,c,a,d);break e}else if(c!==d){d=wo(Error(t(424)),s),s=tg(n,s,c,a,d);break e}else for(mn=ii(s.stateNode.containerInfo.firstChild),pn=s,et=!0,Bn=null,a=fm(s,null,c,a),s.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(go(),c===d){s=Lr(n,s,a);break e}Qt(n,s,c,a)}s=s.child}return s;case 5:return _m(s),n===null&&Ah(s),c=s.type,d=s.pendingProps,m=n!==null?n.memoizedProps:null,v=d.children,yh(c,d)?v=null:m!==null&&yh(c,m)&&(s.flags|=32),Jm(n,s),Qt(n,s,v,a),s.child;case 6:return n===null&&Ah(s),null;case 13:return ng(n,s,a);case 4:return Oh(s,s.stateNode.containerInfo),c=s.pendingProps,n===null?s.child=yo(s,null,c,a):Qt(n,s,c,a),s.child;case 11:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:zn(c,d),Km(n,s,c,d,a);case 7:return Qt(n,s,s.pendingProps,a),s.child;case 8:return Qt(n,s,s.pendingProps.children,a),s.child;case 12:return Qt(n,s,s.pendingProps.children,a),s.child;case 10:e:{if(c=s.type._context,d=s.pendingProps,m=s.memoizedProps,v=d.value,Ge(fu,c._currentValue),c._currentValue=v,m!==null)if(Un(m.value,v)){if(m.children===d.children&&!en.current){s=Lr(n,s,a);break e}}else for(m=s.child,m!==null&&(m.return=s);m!==null;){var I=m.dependencies;if(I!==null){v=m.child;for(var k=I.firstContext;k!==null;){if(k.context===c){if(m.tag===1){k=Vr(-1,a&-a),k.tag=2;var B=m.updateQueue;if(B!==null){B=B.shared;var X=B.pending;X===null?k.next=k:(k.next=X.next,X.next=k),B.pending=k}}m.lanes|=a,k=m.alternate,k!==null&&(k.lanes|=a),bh(m.return,a,s),I.lanes|=a;break}k=k.next}}else if(m.tag===10)v=m.type===s.type?null:m.child;else if(m.tag===18){if(v=m.return,v===null)throw Error(t(341));v.lanes|=a,I=v.alternate,I!==null&&(I.lanes|=a),bh(v,a,s),v=m.sibling}else v=m.child;if(v!==null)v.return=m;else for(v=m;v!==null;){if(v===s){v=null;break}if(m=v.sibling,m!==null){m.return=v.return,v=m;break}v=v.return}m=v}Qt(n,s,d.children,a),s=s.child}return s;case 9:return d=s.type,c=s.pendingProps.children,vo(s,a),d=An(d),c=c(d),s.flags|=1,Qt(n,s,c,a),s.child;case 14:return c=s.type,d=zn(c,s.pendingProps),d=zn(c.type,d),Qm(n,s,c,d,a);case 15:return Xm(n,s,s.type,s.pendingProps,a);case 17:return c=s.type,d=s.pendingProps,d=s.elementType===c?d:zn(c,d),xu(n,s),s.tag=1,tn(c)?(n=!0,au(s)):n=!1,vo(s,a),Bm(s,c,d),Gh(s,c,d,a),Yh(null,s,c,!0,n,a);case 19:return ig(n,s,a);case 22:return Ym(n,s,a)}throw Error(t(156,s.tag))};function Cg(n,s){return Hs(n,s)}function vw(n,s,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=s,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function kn(n,s,a,c){return new vw(n,s,a,c)}function yd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function Ew(n){if(typeof n=="function")return yd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===L)return 11;if(n===Mt)return 14}return 2}function mi(n,s){var a=n.alternate;return a===null?(a=kn(n.tag,s,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=s,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,s=n.dependencies,a.dependencies=s===null?null:{lanes:s.lanes,firstContext:s.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function Lu(n,s,a,c,d,m){var v=2;if(c=n,typeof n=="function")yd(n)&&(v=1);else if(typeof n=="string")v=5;else e:switch(n){case D:return ys(a.children,d,m,s);case S:v=8,d|=8;break;case C:return n=kn(12,a,s,d|2),n.elementType=C,n.lanes=m,n;case R:return n=kn(13,a,s,d),n.elementType=R,n.lanes=m,n;case lt:return n=kn(19,a,s,d),n.elementType=lt,n.lanes=m,n;case $e:return Mu(a,d,m,s);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case P:v=10;break e;case N:v=9;break e;case L:v=11;break e;case Mt:v=14;break e;case jt:v=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return s=kn(v,a,s,d),s.elementType=n,s.type=c,s.lanes=m,s}function ys(n,s,a,c){return n=kn(7,n,c,s),n.lanes=a,n}function Mu(n,s,a,c){return n=kn(22,n,c,s),n.elementType=$e,n.lanes=a,n.stateNode={isHidden:!1},n}function _d(n,s,a){return n=kn(6,n,null,s),n.lanes=a,n}function vd(n,s,a){return s=kn(4,n.children!==null?n.children:[],n.key,s),s.lanes=a,s.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},s}function ww(n,s,a,c,d){this.tag=s,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Xr(0),this.expirationTimes=Xr(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Xr(0),this.identifierPrefix=c,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function Ed(n,s,a,c,d,m,v,I,k){return n=new ww(n,s,a,I,k),s===1?(s=1,m===!0&&(s|=8)):s=0,m=kn(3,null,null,s),n.current=m,m.stateNode=n,m.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},Nh(m),n}function Tw(n,s,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Ee,key:c==null?null:""+c,children:n,containerInfo:s,implementation:a}}function kg(n){if(!n)return oi;n=n._reactInternals;e:{if(Nn(n)!==n||n.tag!==1)throw Error(t(170));var s=n;do{switch(s.tag){case 3:s=s.stateNode.context;break e;case 1:if(tn(s.type)){s=s.stateNode.__reactInternalMemoizedMergedChildContext;break e}}s=s.return}while(s!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(tn(a))return rm(n,a,s)}return s}function Pg(n,s,a,c,d,m,v,I,k){return n=Ed(a,c,!0,n,d,m,v,I,k),n.context=kg(null),a=n.current,c=Xt(),d=fi(a),m=Vr(c,d),m.callback=s??null,ui(a,m,d),n.current.lanes=d,Yr(n,d,c),sn(n,c),n}function ju(n,s,a,c){var d=s.current,m=Xt(),v=fi(d);return a=kg(a),s.context===null?s.context=a:s.pendingContext=a,s=Vr(m,v),s.payload={element:n},c=c===void 0?null:c,c!==null&&(s.callback=c),n=ui(d,s,v),n!==null&&(Hn(n,d,v,m),mu(n,d,v)),v}function Fu(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function bg(n,s){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<s?a:s}}function wd(n,s){bg(n,s),(n=n.alternate)&&bg(n,s)}function Iw(){return null}var Dg=typeof reportError=="function"?reportError:function(n){console.error(n)};function Td(n){this._internalRoot=n}Uu.prototype.render=Td.prototype.render=function(n){var s=this._internalRoot;if(s===null)throw Error(t(409));ju(n,s,null,null)},Uu.prototype.unmount=Td.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var s=n.containerInfo;ps(function(){ju(null,n,null,null)}),s[Pr]=null}};function Uu(n){this._internalRoot=n}Uu.prototype.unstable_scheduleHydration=function(n){if(n){var s=Ul();n={blockedOn:null,target:n,priority:s};for(var a=0;a<er.length&&s!==0&&s<er[a].priority;a++);er.splice(a,0,n),a===0&&$l(n)}};function Id(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Bu(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Ng(){}function Sw(n,s,a,c,d){if(d){if(typeof c=="function"){var m=c;c=function(){var B=Fu(v);m.call(B)}}var v=Pg(s,c,n,0,null,!1,!1,"",Ng);return n._reactRootContainer=v,n[Pr]=v.current,xa(n.nodeType===8?n.parentNode:n),ps(),v}for(;d=n.lastChild;)n.removeChild(d);if(typeof c=="function"){var I=c;c=function(){var B=Fu(k);I.call(B)}}var k=Ed(n,0,!1,null,null,!1,!1,"",Ng);return n._reactRootContainer=k,n[Pr]=k.current,xa(n.nodeType===8?n.parentNode:n),ps(function(){ju(s,k,a,c)}),k}function zu(n,s,a,c,d){var m=a._reactRootContainer;if(m){var v=m;if(typeof d=="function"){var I=d;d=function(){var k=Fu(v);I.call(k)}}ju(s,v,n,d)}else v=Sw(a,s,n,d,c);return Fu(v)}jl=function(n){switch(n.tag){case 3:var s=n.stateNode;if(s.current.memoizedState.isDehydrated){var a=Qr(s.pendingLanes);a!==0&&(Jr(s,a|1),sn(s,qe()),(Le&6)===0&&(So=qe()+500,ai()))}break;case 13:ps(function(){var c=Or(n,1);if(c!==null){var d=Xt();Hn(c,n,1,d)}}),wd(n,1)}},Ks=function(n){if(n.tag===13){var s=Or(n,134217728);if(s!==null){var a=Xt();Hn(s,n,134217728,a)}wd(n,134217728)}},Fl=function(n){if(n.tag===13){var s=fi(n),a=Or(n,s);if(a!==null){var c=Xt();Hn(a,n,s,c)}wd(n,s)}},Ul=function(){return be},Bl=function(n,s){var a=be;try{return be=n,s()}finally{be=a}},Fs=function(n,s,a){switch(s){case"input":if(Xo(n,a),s=a.name,a.type==="radio"&&s!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+s)+'][type="radio"]'),s=0;s<a.length;s++){var c=a[s];if(c!==n&&c.form===n.form){var d=su(c);if(!d)throw Error(t(90));Ns(c),Xo(c,d)}}}break;case"textarea":Ms(n,a);break;case"select":s=a.value,s!=null&&Tr(n,!!a.multiple,s,!1)}},Ki=pd,oa=ps;var xw={usingClientEntryPoint:!1,Events:[Ca,co,su,Jn,sa,pd]},za={findFiberByHostInstance:os,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Aw={bundleType:za.bundleType,version:za.version,rendererPackageName:za.rendererPackageName,rendererConfig:za.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:re.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=ua(n),n===null?null:n.stateNode},findFiberByHostInstance:za.findFiberByHostInstance||Iw,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var $u=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!$u.isDisabled&&$u.supportsFiber)try{Zi=$u.inject(Aw),cn=$u}catch{}}return on.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=xw,on.createPortal=function(n,s){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Id(s))throw Error(t(200));return Tw(n,s,null,a)},on.createRoot=function(n,s){if(!Id(n))throw Error(t(299));var a=!1,c="",d=Dg;return s!=null&&(s.unstable_strictMode===!0&&(a=!0),s.identifierPrefix!==void 0&&(c=s.identifierPrefix),s.onRecoverableError!==void 0&&(d=s.onRecoverableError)),s=Ed(n,1,!1,null,null,a,!1,c,d),n[Pr]=s.current,xa(n.nodeType===8?n.parentNode:n),new Td(s)},on.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var s=n._reactInternals;if(s===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=ua(s),n=n===null?null:n.stateNode,n},on.flushSync=function(n){return ps(n)},on.hydrate=function(n,s,a){if(!Bu(s))throw Error(t(200));return zu(null,n,s,!0,a)},on.hydrateRoot=function(n,s,a){if(!Id(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,d=!1,m="",v=Dg;if(a!=null&&(a.unstable_strictMode===!0&&(d=!0),a.identifierPrefix!==void 0&&(m=a.identifierPrefix),a.onRecoverableError!==void 0&&(v=a.onRecoverableError)),s=Pg(s,null,n,1,a??null,d,!1,m,v),n[Pr]=s.current,xa(n),c)for(n=0;n<c.length;n++)a=c[n],d=a._getVersion,d=d(a._source),s.mutableSourceEagerHydrationData==null?s.mutableSourceEagerHydrationData=[a,d]:s.mutableSourceEagerHydrationData.push(a,d);return new Uu(s)},on.render=function(n,s,a){if(!Bu(s))throw Error(t(200));return zu(null,n,s,!1,a)},on.unmountComponentAtNode=function(n){if(!Bu(n))throw Error(t(40));return n._reactRootContainer?(ps(function(){zu(null,null,n,!1,function(){n._reactRootContainer=null,n[Pr]=null})}),!0):!1},on.unstable_batchedUpdates=pd,on.unstable_renderSubtreeIntoContainer=function(n,s,a,c){if(!Bu(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return zu(n,s,a,!1,c)},on.version="18.3.1-next-f1338f8080-20240426",on}var Bg;function Vw(){if(Bg)return Ad.exports;Bg=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),Ad.exports=Ow(),Ad.exports}var zg;function Lw(){if(zg)return Wu;zg=1;var r=Vw();return Wu.createRoot=r.createRoot,Wu.hydrateRoot=r.hydrateRoot,Wu}var Mw=Lw();const jw=x_(Mw),Fw=()=>{};var $g={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const A_=function(r){const e=[];let t=0;for(let i=0;i<r.length;i++){let o=r.charCodeAt(i);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&i+1<r.length&&(r.charCodeAt(i+1)&64512)===56320?(o=65536+((o&1023)<<10)+(r.charCodeAt(++i)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},Uw=function(r){const e=[];let t=0,i=0;for(;t<r.length;){const o=r[t++];if(o<128)e[i++]=String.fromCharCode(o);else if(o>191&&o<224){const l=r[t++];e[i++]=String.fromCharCode((o&31)<<6|l&63)}else if(o>239&&o<365){const l=r[t++],h=r[t++],f=r[t++],g=((o&7)<<18|(l&63)<<12|(h&63)<<6|f&63)-65536;e[i++]=String.fromCharCode(55296+(g>>10)),e[i++]=String.fromCharCode(56320+(g&1023))}else{const l=r[t++],h=r[t++];e[i++]=String.fromCharCode((o&15)<<12|(l&63)<<6|h&63)}}return e.join("")},R_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let o=0;o<r.length;o+=3){const l=r[o],h=o+1<r.length,f=h?r[o+1]:0,g=o+2<r.length,_=g?r[o+2]:0,w=l>>2,x=(l&3)<<4|f>>4;let A=(f&15)<<2|_>>6,O=_&63;g||(O=64,h||(A=64)),i.push(t[w],t[x],t[A],t[O])}return i.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(A_(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):Uw(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let o=0;o<r.length;){const l=t[r.charAt(o++)],f=o<r.length?t[r.charAt(o)]:0;++o;const _=o<r.length?t[r.charAt(o)]:64;++o;const x=o<r.length?t[r.charAt(o)]:64;if(++o,l==null||f==null||_==null||x==null)throw new Bw;const A=l<<2|f>>4;if(i.push(A),_!==64){const O=f<<4&240|_>>2;if(i.push(O),x!==64){const W=_<<6&192|x;i.push(W)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class Bw extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const zw=function(r){const e=A_(r);return R_.encodeByteArray(e,!0)},uc=function(r){return zw(r).replace(/\./g,"")},C_=function(r){try{return R_.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $w(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ww=()=>$w().__FIREBASE_DEFAULTS__,Hw=()=>{if(typeof process>"u"||typeof $g>"u")return;const r=$g.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},qw=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&C_(r[1]);return e&&JSON.parse(e)},Cc=()=>{try{return Fw()||Ww()||Hw()||qw()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},k_=r=>{var e,t;return(t=(e=Cc())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[r]},P_=r=>{const e=k_(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),i]:[e.substring(0,t),i]},b_=()=>{var r;return(r=Cc())===null||r===void 0?void 0:r.config},D_=r=>{var e;return(e=Cc())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gw{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ji(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function _f(r){return(await fetch(r,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N_(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},i=e||"demo-project",o=r.iat||0,l=r.sub||r.user_id;if(!l)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:o,exp:o+3600,auth_time:o,sub:l,user_id:l,firebase:{sign_in_provider:"custom",identities:{}}},r);return[uc(JSON.stringify(t)),uc(JSON.stringify(h)),""].join(".")}const Ya={};function Kw(){const r={prod:[],emulator:[]};for(const e of Object.keys(Ya))Ya[e]?r.emulator.push(e):r.prod.push(e);return r}function Qw(r){let e=document.getElementById(r),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",r),t=!0),{created:t,element:e}}let Wg=!1;function vf(r,e){if(typeof window>"u"||typeof document>"u"||!ji(window.location.host)||Ya[r]===e||Ya[r]||Wg)return;Ya[r]=e;function t(A){return`__firebase__banner__${A}`}const i="__firebase__banner",l=Kw().prod.length>0;function h(){const A=document.getElementById(i);A&&A.remove()}function f(A){A.style.display="flex",A.style.background="#7faaf0",A.style.position="fixed",A.style.bottom="5px",A.style.left="5px",A.style.padding=".5em",A.style.borderRadius="5px",A.style.alignItems="center"}function g(A,O){A.setAttribute("width","24"),A.setAttribute("id",O),A.setAttribute("height","24"),A.setAttribute("viewBox","0 0 24 24"),A.setAttribute("fill","none"),A.style.marginLeft="-6px"}function _(){const A=document.createElement("span");return A.style.cursor="pointer",A.style.marginLeft="16px",A.style.fontSize="24px",A.innerHTML=" &times;",A.onclick=()=>{Wg=!0,h()},A}function w(A,O){A.setAttribute("id",O),A.innerText="Learn more",A.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",A.setAttribute("target","__blank"),A.style.paddingLeft="5px",A.style.textDecoration="underline"}function x(){const A=Qw(i),O=t("text"),W=document.getElementById(O)||document.createElement("span"),q=t("learnmore"),$=document.getElementById(q)||document.createElement("a"),he=t("preprendIcon"),M=document.getElementById(he)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(A.created){const J=A.element;f(J),w($,q);const re=_();g(M,he),J.append(M,W,$,re),document.body.appendChild(J)}l?(W.innerText="Preview backend disconnected.",M.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(M.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,W.innerText="Preview backend running in this workspace."),W.setAttribute("id",O)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",x):x()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Xw(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(qt())}function Yw(){var r;const e=(r=Cc())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Jw(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Zw(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function eT(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function tT(){const r=qt();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function nT(){return!Yw()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function rT(){try{return typeof indexedDB=="object"}catch{return!1}}function iT(){return new Promise((r,e)=>{try{let t=!0;const i="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(i);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(i),r(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var l;e(((l=o.error)===null||l===void 0?void 0:l.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sT="FirebaseError";class vr extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=sT,Object.setPrototypeOf(this,vr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ml.prototype.create)}}class ml{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){const i=t[0]||{},o=`${this.service}/${e}`,l=this.errors[e],h=l?oT(l,i):"Error",f=`${this.serviceName}: ${h} (${o}).`;return new vr(o,f,i)}}function oT(r,e){return r.replace(aT,(t,i)=>{const o=e[i];return o!=null?String(o):`<${i}?>`})}const aT=/\{\$([^}]+)}/g;function lT(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function Ts(r,e){if(r===e)return!0;const t=Object.keys(r),i=Object.keys(e);for(const o of t){if(!i.includes(o))return!1;const l=r[o],h=e[o];if(Hg(l)&&Hg(h)){if(!Ts(l,h))return!1}else if(l!==h)return!1}for(const o of i)if(!t.includes(o))return!1;return!0}function Hg(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gl(r){const e=[];for(const[t,i]of Object.entries(r))Array.isArray(i)?i.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function Ha(r){const e={};return r.replace(/^\?/,"").split("&").forEach(i=>{if(i){const[o,l]=i.split("=");e[decodeURIComponent(o)]=decodeURIComponent(l)}}),e}function qa(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function uT(r,e){const t=new cT(r,e);return t.subscribe.bind(t)}class cT{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let o;if(e===void 0&&t===void 0&&i===void 0)throw new Error("Missing Observer.");hT(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:i},o.next===void 0&&(o.next=kd),o.error===void 0&&(o.error=kd),o.complete===void 0&&(o.complete=kd);const l=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),l}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function hT(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function kd(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function st(r){return r&&r._delegate?r._delegate:r}class ki{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _s="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dT{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const i=new Gw;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&i.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),o=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(l){if(o)return null;throw l}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(pT(e))try{this.getOrInitializeService({instanceIdentifier:_s})}catch{}for(const[t,i]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const l=this.getOrInitializeService({instanceIdentifier:o});i.resolve(l)}catch{}}}}clearInstance(e=_s){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=_s){return this.instances.has(e)}getOptions(e=_s){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:i,options:t});for(const[l,h]of this.instancesDeferred.entries()){const f=this.normalizeInstanceIdentifier(l);i===f&&h.resolve(o)}return o}onInit(e,t){var i;const o=this.normalizeInstanceIdentifier(t),l=(i=this.onInitCallbacks.get(o))!==null&&i!==void 0?i:new Set;l.add(e),this.onInitCallbacks.set(o,l);const h=this.instances.get(o);return h&&e(h,o),()=>{l.delete(e)}}invokeOnInitCallbacks(e,t){const i=this.onInitCallbacks.get(t);if(i)for(const o of i)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:fT(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=_s){return this.component?this.component.multipleInstances?e:_s:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function fT(r){return r===_s?void 0:r}function pT(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mT{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new dT(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ke;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(ke||(ke={}));const gT={debug:ke.DEBUG,verbose:ke.VERBOSE,info:ke.INFO,warn:ke.WARN,error:ke.ERROR,silent:ke.SILENT},yT=ke.INFO,_T={[ke.DEBUG]:"log",[ke.VERBOSE]:"log",[ke.INFO]:"info",[ke.WARN]:"warn",[ke.ERROR]:"error"},vT=(r,e,...t)=>{if(e<r.logLevel)return;const i=new Date().toISOString(),o=_T[e];if(o)console[o](`[${i}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ef{constructor(e){this.name=e,this._logLevel=yT,this._logHandler=vT,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ke))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?gT[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ke.DEBUG,...e),this._logHandler(this,ke.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ke.VERBOSE,...e),this._logHandler(this,ke.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ke.INFO,...e),this._logHandler(this,ke.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ke.WARN,...e),this._logHandler(this,ke.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ke.ERROR,...e),this._logHandler(this,ke.ERROR,...e)}}const ET=(r,e)=>e.some(t=>r instanceof t);let qg,Gg;function wT(){return qg||(qg=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function TT(){return Gg||(Gg=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const O_=new WeakMap,zd=new WeakMap,V_=new WeakMap,Pd=new WeakMap,wf=new WeakMap;function IT(r){const e=new Promise((t,i)=>{const o=()=>{r.removeEventListener("success",l),r.removeEventListener("error",h)},l=()=>{t(xi(r.result)),o()},h=()=>{i(r.error),o()};r.addEventListener("success",l),r.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&O_.set(t,r)}).catch(()=>{}),wf.set(e,r),e}function ST(r){if(zd.has(r))return;const e=new Promise((t,i)=>{const o=()=>{r.removeEventListener("complete",l),r.removeEventListener("error",h),r.removeEventListener("abort",h)},l=()=>{t(),o()},h=()=>{i(r.error||new DOMException("AbortError","AbortError")),o()};r.addEventListener("complete",l),r.addEventListener("error",h),r.addEventListener("abort",h)});zd.set(r,e)}let $d={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return zd.get(r);if(e==="objectStoreNames")return r.objectStoreNames||V_.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return xi(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function xT(r){$d=r($d)}function AT(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const i=r.call(bd(this),e,...t);return V_.set(i,e.sort?e.sort():[e]),xi(i)}:TT().includes(r)?function(...e){return r.apply(bd(this),e),xi(O_.get(this))}:function(...e){return xi(r.apply(bd(this),e))}}function RT(r){return typeof r=="function"?AT(r):(r instanceof IDBTransaction&&ST(r),ET(r,wT())?new Proxy(r,$d):r)}function xi(r){if(r instanceof IDBRequest)return IT(r);if(Pd.has(r))return Pd.get(r);const e=RT(r);return e!==r&&(Pd.set(r,e),wf.set(e,r)),e}const bd=r=>wf.get(r);function CT(r,e,{blocked:t,upgrade:i,blocking:o,terminated:l}={}){const h=indexedDB.open(r,e),f=xi(h);return i&&h.addEventListener("upgradeneeded",g=>{i(xi(h.result),g.oldVersion,g.newVersion,xi(h.transaction),g)}),t&&h.addEventListener("blocked",g=>t(g.oldVersion,g.newVersion,g)),f.then(g=>{l&&g.addEventListener("close",()=>l()),o&&g.addEventListener("versionchange",_=>o(_.oldVersion,_.newVersion,_))}).catch(()=>{}),f}const kT=["get","getKey","getAll","getAllKeys","count"],PT=["put","add","delete","clear"],Dd=new Map;function Kg(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(Dd.get(e))return Dd.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,o=PT.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(o||kT.includes(t)))return;const l=async function(h,...f){const g=this.transaction(h,o?"readwrite":"readonly");let _=g.store;return i&&(_=_.index(f.shift())),(await Promise.all([_[t](...f),o&&g.done]))[0]};return Dd.set(e,l),l}xT(r=>({...r,get:(e,t,i)=>Kg(e,t)||r.get(e,t,i),has:(e,t)=>!!Kg(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bT{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(DT(t)){const i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}}function DT(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Wd="@firebase/app",Qg="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zr=new Ef("@firebase/app"),NT="@firebase/app-compat",OT="@firebase/analytics-compat",VT="@firebase/analytics",LT="@firebase/app-check-compat",MT="@firebase/app-check",jT="@firebase/auth",FT="@firebase/auth-compat",UT="@firebase/database",BT="@firebase/data-connect",zT="@firebase/database-compat",$T="@firebase/functions",WT="@firebase/functions-compat",HT="@firebase/installations",qT="@firebase/installations-compat",GT="@firebase/messaging",KT="@firebase/messaging-compat",QT="@firebase/performance",XT="@firebase/performance-compat",YT="@firebase/remote-config",JT="@firebase/remote-config-compat",ZT="@firebase/storage",eI="@firebase/storage-compat",tI="@firebase/firestore",nI="@firebase/ai",rI="@firebase/firestore-compat",iI="firebase",sI="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hd="[DEFAULT]",oI={[Wd]:"fire-core",[NT]:"fire-core-compat",[VT]:"fire-analytics",[OT]:"fire-analytics-compat",[MT]:"fire-app-check",[LT]:"fire-app-check-compat",[jT]:"fire-auth",[FT]:"fire-auth-compat",[UT]:"fire-rtdb",[BT]:"fire-data-connect",[zT]:"fire-rtdb-compat",[$T]:"fire-fn",[WT]:"fire-fn-compat",[HT]:"fire-iid",[qT]:"fire-iid-compat",[GT]:"fire-fcm",[KT]:"fire-fcm-compat",[QT]:"fire-perf",[XT]:"fire-perf-compat",[YT]:"fire-rc",[JT]:"fire-rc-compat",[ZT]:"fire-gcs",[eI]:"fire-gcs-compat",[tI]:"fire-fst",[rI]:"fire-fst-compat",[nI]:"fire-vertex","fire-js":"fire-js",[iI]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cc=new Map,aI=new Map,qd=new Map;function Xg(r,e){try{r.container.addComponent(e)}catch(t){zr.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Is(r){const e=r.name;if(qd.has(e))return zr.debug(`There were multiple attempts to register component ${e}.`),!1;qd.set(e,r);for(const t of cc.values())Xg(t,r);for(const t of aI.values())Xg(t,r);return!0}function kc(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function yn(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lI={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ai=new ml("app","Firebase",lI);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uI{constructor(e,t,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new ki("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ai.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ks=sI;function L_(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const i=Object.assign({name:Hd,automaticDataCollectionEnabled:!0},e),o=i.name;if(typeof o!="string"||!o)throw Ai.create("bad-app-name",{appName:String(o)});if(t||(t=b_()),!t)throw Ai.create("no-options");const l=cc.get(o);if(l){if(Ts(t,l.options)&&Ts(i,l.config))return l;throw Ai.create("duplicate-app",{appName:o})}const h=new mT(o);for(const g of qd.values())h.addComponent(g);const f=new uI(t,i,h);return cc.set(o,f),f}function Tf(r=Hd){const e=cc.get(r);if(!e&&r===Hd&&b_())return L_();if(!e)throw Ai.create("no-app",{appName:r});return e}function cr(r,e,t){var i;let o=(i=oI[r])!==null&&i!==void 0?i:r;t&&(o+=`-${t}`);const l=o.match(/\s|\//),h=e.match(/\s|\//);if(l||h){const f=[`Unable to register library "${o}" with version "${e}":`];l&&f.push(`library name "${o}" contains illegal characters (whitespace or "/")`),l&&h&&f.push("and"),h&&f.push(`version name "${e}" contains illegal characters (whitespace or "/")`),zr.warn(f.join(" "));return}Is(new ki(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cI="firebase-heartbeat-database",hI=1,il="firebase-heartbeat-store";let Nd=null;function M_(){return Nd||(Nd=CT(cI,hI,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(il)}catch(t){console.warn(t)}}}}).catch(r=>{throw Ai.create("idb-open",{originalErrorMessage:r.message})})),Nd}async function dI(r){try{const t=(await M_()).transaction(il),i=await t.objectStore(il).get(j_(r));return await t.done,i}catch(e){if(e instanceof vr)zr.warn(e.message);else{const t=Ai.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});zr.warn(t.message)}}}async function Yg(r,e){try{const i=(await M_()).transaction(il,"readwrite");await i.objectStore(il).put(e,j_(r)),await i.done}catch(t){if(t instanceof vr)zr.warn(t.message);else{const i=Ai.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});zr.warn(i.message)}}}function j_(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fI=1024,pI=30;class mI{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new yI(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),l=Jg();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===l||this._heartbeatsCache.heartbeats.some(h=>h.date===l))return;if(this._heartbeatsCache.heartbeats.push({date:l,agent:o}),this._heartbeatsCache.heartbeats.length>pI){const h=_I(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){zr.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Jg(),{heartbeatsToSend:i,unsentEntries:o}=gI(this._heartbeatsCache.heartbeats),l=uc(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),l}catch(t){return zr.warn(t),""}}}function Jg(){return new Date().toISOString().substring(0,10)}function gI(r,e=fI){const t=[];let i=r.slice();for(const o of r){const l=t.find(h=>h.agent===o.agent);if(l){if(l.dates.push(o.date),Zg(t)>e){l.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),Zg(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}class yI{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return rT()?iT().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await dI(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return Yg(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return Yg(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}}function Zg(r){return uc(JSON.stringify({version:2,heartbeats:r})).length}function _I(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let i=1;i<r.length;i++)r[i].date<t&&(t=r[i].date,e=i);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vI(r){Is(new ki("platform-logger",e=>new bT(e),"PRIVATE")),Is(new ki("heartbeat",e=>new mI(e),"PRIVATE")),cr(Wd,Qg,r),cr(Wd,Qg,"esm2017"),cr("fire-js","")}vI("");var EI="firebase",wI="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */cr(EI,wI,"app");function If(r,e){var t={};for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&e.indexOf(i)<0&&(t[i]=r[i]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,i=Object.getOwnPropertySymbols(r);o<i.length;o++)e.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(r,i[o])&&(t[i[o]]=r[i[o]]);return t}function F_(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const TI=F_,U_=new ml("auth","Firebase",F_());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hc=new Ef("@firebase/auth");function II(r,...e){hc.logLevel<=ke.WARN&&hc.warn(`Auth (${ks}): ${r}`,...e)}function Zu(r,...e){hc.logLevel<=ke.ERROR&&hc.error(`Auth (${ks}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kn(r,...e){throw Sf(r,...e)}function hr(r,...e){return Sf(r,...e)}function B_(r,e,t){const i=Object.assign(Object.assign({},TI()),{[e]:t});return new ml("auth","Firebase",i).create(e,{appName:r.name})}function Ur(r){return B_(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Sf(r,...e){if(typeof r!="string"){const t=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=r.name),r._errorFactory.create(t,...i)}return U_.create(r,...e)}function ye(r,e,...t){if(!r)throw Sf(e,...t)}function jr(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Zu(e),new Error(e)}function $r(r,e){r||jr(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gd(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function SI(){return ey()==="http:"||ey()==="https:"}function ey(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xI(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(SI()||Zw()||"connection"in navigator)?navigator.onLine:!0}function AI(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yl{constructor(e,t){this.shortDelay=e,this.longDelay=t,$r(t>e,"Short delay should be less than long delay!"),this.isMobile=Xw()||eT()}get(){return xI()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xf(r,e){$r(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z_{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;jr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;jr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;jr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RI={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CI=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],kI=new yl(3e4,6e4);function Fi(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function Ui(r,e,t,i,o={}){return $_(r,o,async()=>{let l={},h={};i&&(e==="GET"?h=i:l={body:JSON.stringify(i)});const f=gl(Object.assign({key:r.config.apiKey},h)).slice(1),g=await r._getAdditionalHeaders();g["Content-Type"]="application/json",r.languageCode&&(g["X-Firebase-Locale"]=r.languageCode);const _=Object.assign({method:e,headers:g},l);return Jw()||(_.referrerPolicy="no-referrer"),r.emulatorConfig&&ji(r.emulatorConfig.host)&&(_.credentials="include"),z_.fetch()(await W_(r,r.config.apiHost,t,f),_)})}async function $_(r,e,t){r._canInitEmulator=!1;const i=Object.assign(Object.assign({},RI),e);try{const o=new bI(r),l=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const h=await l.json();if("needConfirmation"in h)throw Hu(r,"account-exists-with-different-credential",h);if(l.ok&&!("errorMessage"in h))return h;{const f=l.ok?h.errorMessage:h.error.message,[g,_]=f.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw Hu(r,"credential-already-in-use",h);if(g==="EMAIL_EXISTS")throw Hu(r,"email-already-in-use",h);if(g==="USER_DISABLED")throw Hu(r,"user-disabled",h);const w=i[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(_)throw B_(r,w,_);Kn(r,w)}}catch(o){if(o instanceof vr)throw o;Kn(r,"network-request-failed",{message:String(o)})}}async function _l(r,e,t,i,o={}){const l=await Ui(r,e,t,i,o);return"mfaPendingCredential"in l&&Kn(r,"multi-factor-auth-required",{_serverResponse:l}),l}async function W_(r,e,t,i){const o=`${e}${t}?${i}`,l=r,h=l.config.emulator?xf(r.config,o):`${r.config.apiScheme}://${o}`;return CI.includes(t)&&(await l._persistenceManagerAvailable,l._getPersistenceType()==="COOKIE")?l._getPersistence()._getFinalTarget(h).toString():h}function PI(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class bI{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,i)=>{this.timer=setTimeout(()=>i(hr(this.auth,"network-request-failed")),kI.get())})}}function Hu(r,e,t){const i={appName:r.name};t.email&&(i.email=t.email),t.phoneNumber&&(i.phoneNumber=t.phoneNumber);const o=hr(r,e,i);return o.customData._tokenResponse=t,o}function ty(r){return r!==void 0&&r.enterprise!==void 0}class DI{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return PI(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function NI(r,e){return Ui(r,"GET","/v2/recaptchaConfig",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function OI(r,e){return Ui(r,"POST","/v1/accounts:delete",e)}async function dc(r,e){return Ui(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ja(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function VI(r,e=!1){const t=st(r),i=await t.getIdToken(e),o=Af(i);ye(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const l=typeof o.firebase=="object"?o.firebase:void 0,h=l==null?void 0:l.sign_in_provider;return{claims:o,token:i,authTime:Ja(Od(o.auth_time)),issuedAtTime:Ja(Od(o.iat)),expirationTime:Ja(Od(o.exp)),signInProvider:h||null,signInSecondFactor:(l==null?void 0:l.sign_in_second_factor)||null}}function Od(r){return Number(r)*1e3}function Af(r){const[e,t,i]=r.split(".");if(e===void 0||t===void 0||i===void 0)return Zu("JWT malformed, contained fewer than 3 sections"),null;try{const o=C_(t);return o?JSON.parse(o):(Zu("Failed to decode base64 JWT payload"),null)}catch(o){return Zu("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function ny(r){const e=Af(r);return ye(e,"internal-error"),ye(typeof e.exp<"u","internal-error"),ye(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sl(r,e,t=!1){if(t)return e;try{return await e}catch(i){throw i instanceof vr&&LI(i)&&r.auth.currentUser===r&&await r.auth.signOut(),i}}function LI({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MI{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const i=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),i}else{this.errorBackoff=3e4;const o=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,o)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kd{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ja(this.lastLoginAt),this.creationTime=Ja(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fc(r){var e;const t=r.auth,i=await r.getIdToken(),o=await sl(r,dc(t,{idToken:i}));ye(o==null?void 0:o.users.length,t,"internal-error");const l=o.users[0];r._notifyReloadListener(l);const h=!((e=l.providerUserInfo)===null||e===void 0)&&e.length?H_(l.providerUserInfo):[],f=FI(r.providerData,h),g=r.isAnonymous,_=!(r.email&&l.passwordHash)&&!(f!=null&&f.length),w=g?_:!1,x={uid:l.localId,displayName:l.displayName||null,photoURL:l.photoUrl||null,email:l.email||null,emailVerified:l.emailVerified||!1,phoneNumber:l.phoneNumber||null,tenantId:l.tenantId||null,providerData:f,metadata:new Kd(l.createdAt,l.lastLoginAt),isAnonymous:w};Object.assign(r,x)}async function jI(r){const e=st(r);await fc(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function FI(r,e){return[...r.filter(i=>!e.some(o=>o.providerId===i.providerId)),...e]}function H_(r){return r.map(e=>{var{providerId:t}=e,i=If(e,["providerId"]);return{providerId:t,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function UI(r,e){const t=await $_(r,{},async()=>{const i=gl({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:l}=r.config,h=await W_(r,o,"/v1/token",`key=${l}`),f=await r._getAdditionalHeaders();f["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:f,body:i};return r.emulatorConfig&&ji(r.emulatorConfig.host)&&(g.credentials="include"),z_.fetch()(h,g)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function BI(r,e){return Ui(r,"POST","/v2/accounts:revokeToken",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){ye(e.idToken,"internal-error"),ye(typeof e.idToken<"u","internal-error"),ye(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):ny(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){ye(e.length!==0,"internal-error");const t=ny(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(ye(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:i,refreshToken:o,expiresIn:l}=await UI(e,t);this.updateTokensAndExpiration(i,o,Number(l))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,t){const{refreshToken:i,accessToken:o,expirationTime:l}=t,h=new bo;return i&&(ye(typeof i=="string","internal-error",{appName:e}),h.refreshToken=i),o&&(ye(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),l&&(ye(typeof l=="number","internal-error",{appName:e}),h.expirationTime=l),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new bo,this.toJSON())}_performRefresh(){return jr("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yi(r,e){ye(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class qn{constructor(e){var{uid:t,auth:i,stsTokenManager:o}=e,l=If(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new MI(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=i,this.stsTokenManager=o,this.accessToken=o.accessToken,this.displayName=l.displayName||null,this.email=l.email||null,this.emailVerified=l.emailVerified||!1,this.phoneNumber=l.phoneNumber||null,this.photoURL=l.photoURL||null,this.isAnonymous=l.isAnonymous||!1,this.tenantId=l.tenantId||null,this.providerData=l.providerData?[...l.providerData]:[],this.metadata=new Kd(l.createdAt||void 0,l.lastLoginAt||void 0)}async getIdToken(e){const t=await sl(this,this.stsTokenManager.getToken(this.auth,e));return ye(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return VI(this,e)}reload(){return jI(this)}_assign(e){this!==e&&(ye(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new qn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){ye(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await fc(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(yn(this.auth.app))return Promise.reject(Ur(this.auth));const e=await this.getIdToken();return await sl(this,OI(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var i,o,l,h,f,g,_,w;const x=(i=t.displayName)!==null&&i!==void 0?i:void 0,A=(o=t.email)!==null&&o!==void 0?o:void 0,O=(l=t.phoneNumber)!==null&&l!==void 0?l:void 0,W=(h=t.photoURL)!==null&&h!==void 0?h:void 0,q=(f=t.tenantId)!==null&&f!==void 0?f:void 0,$=(g=t._redirectEventId)!==null&&g!==void 0?g:void 0,he=(_=t.createdAt)!==null&&_!==void 0?_:void 0,M=(w=t.lastLoginAt)!==null&&w!==void 0?w:void 0,{uid:J,emailVerified:re,isAnonymous:Ce,providerData:Ee,stsTokenManager:D}=t;ye(J&&D,e,"internal-error");const S=bo.fromJSON(this.name,D);ye(typeof J=="string",e,"internal-error"),yi(x,e.name),yi(A,e.name),ye(typeof re=="boolean",e,"internal-error"),ye(typeof Ce=="boolean",e,"internal-error"),yi(O,e.name),yi(W,e.name),yi(q,e.name),yi($,e.name),yi(he,e.name),yi(M,e.name);const C=new qn({uid:J,auth:e,email:A,emailVerified:re,displayName:x,isAnonymous:Ce,photoURL:W,phoneNumber:O,tenantId:q,stsTokenManager:S,createdAt:he,lastLoginAt:M});return Ee&&Array.isArray(Ee)&&(C.providerData=Ee.map(P=>Object.assign({},P))),$&&(C._redirectEventId=$),C}static async _fromIdTokenResponse(e,t,i=!1){const o=new bo;o.updateFromServerResponse(t);const l=new qn({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:i});return await fc(l),l}static async _fromGetAccountInfoResponse(e,t,i){const o=t.users[0];ye(o.localId!==void 0,"internal-error");const l=o.providerUserInfo!==void 0?H_(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!(l!=null&&l.length),f=new bo;f.updateFromIdToken(i);const g=new qn({uid:o.localId,auth:e,stsTokenManager:f,isAnonymous:h}),_={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:l,metadata:new Kd(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(l!=null&&l.length)};return Object.assign(g,_),g}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ry=new Map;function Fr(r){$r(r instanceof Function,"Expected a class definition");let e=ry.get(r);return e?($r(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,ry.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q_{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}q_.type="NONE";const iy=q_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ec(r,e,t){return`firebase:${r}:${e}:${t}`}class Do{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;const{config:o,name:l}=this.auth;this.fullUserKey=ec(this.userKey,o.apiKey,l),this.fullPersistenceKey=ec("persistence",o.apiKey,l),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await dc(this.auth,{idToken:e}).catch(()=>{});return t?qn._fromGetAccountInfoResponse(this.auth,t,e):null}return qn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new Do(Fr(iy),e,i);const o=(await Promise.all(t.map(async _=>{if(await _._isAvailable())return _}))).filter(_=>_);let l=o[0]||Fr(iy);const h=ec(i,e.config.apiKey,e.name);let f=null;for(const _ of t)try{const w=await _._get(h);if(w){let x;if(typeof w=="string"){const A=await dc(e,{idToken:w}).catch(()=>{});if(!A)break;x=await qn._fromGetAccountInfoResponse(e,A,w)}else x=qn._fromJSON(e,w);_!==l&&(f=x),l=_;break}}catch{}const g=o.filter(_=>_._shouldAllowMigration);return!l._shouldAllowMigration||!g.length?new Do(l,e,i):(l=g[0],f&&await l._set(h,f.toJSON()),await Promise.all(t.map(async _=>{if(_!==l)try{await _._remove(h)}catch{}})),new Do(l,e,i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sy(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(X_(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(G_(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(J_(e))return"Blackberry";if(Z_(e))return"Webos";if(K_(e))return"Safari";if((e.includes("chrome/")||Q_(e))&&!e.includes("edge/"))return"Chrome";if(Y_(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=r.match(t);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function G_(r=qt()){return/firefox\//i.test(r)}function K_(r=qt()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Q_(r=qt()){return/crios\//i.test(r)}function X_(r=qt()){return/iemobile/i.test(r)}function Y_(r=qt()){return/android/i.test(r)}function J_(r=qt()){return/blackberry/i.test(r)}function Z_(r=qt()){return/webos/i.test(r)}function Rf(r=qt()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function zI(r=qt()){var e;return Rf(r)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function $I(){return tT()&&document.documentMode===10}function ev(r=qt()){return Rf(r)||Y_(r)||Z_(r)||J_(r)||/windows phone/i.test(r)||X_(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tv(r,e=[]){let t;switch(r){case"Browser":t=sy(qt());break;case"Worker":t=`${sy(qt())}-${r}`;break;default:t=r}const i=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${ks}/${i}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WI{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const i=l=>new Promise((h,f)=>{try{const g=e(l);h(g)}catch(g){f(g)}});i.onAbort=t,this.queue.push(i);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(i){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function HI(r,e={}){return Ui(r,"GET","/v2/passwordPolicy",Fi(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qI=6;class GI{constructor(e){var t,i,o,l;const h=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=h.minPasswordLength)!==null&&t!==void 0?t:qI,h.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=h.maxPasswordLength),h.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=h.containsLowercaseCharacter),h.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=h.containsUppercaseCharacter),h.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=h.containsNumericCharacter),h.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=h.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(o=(i=e.allowedNonAlphanumericCharacters)===null||i===void 0?void 0:i.join(""))!==null&&o!==void 0?o:"",this.forceUpgradeOnSignin=(l=e.forceUpgradeOnSignin)!==null&&l!==void 0?l:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,i,o,l,h,f;const g={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,g),this.validatePasswordCharacterOptions(e,g),g.isValid&&(g.isValid=(t=g.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),g.isValid&&(g.isValid=(i=g.meetsMaxPasswordLength)!==null&&i!==void 0?i:!0),g.isValid&&(g.isValid=(o=g.containsLowercaseLetter)!==null&&o!==void 0?o:!0),g.isValid&&(g.isValid=(l=g.containsUppercaseLetter)!==null&&l!==void 0?l:!0),g.isValid&&(g.isValid=(h=g.containsNumericCharacter)!==null&&h!==void 0?h:!0),g.isValid&&(g.isValid=(f=g.containsNonAlphanumericCharacter)!==null&&f!==void 0?f:!0),g}validatePasswordLengthOptions(e,t){const i=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;i&&(t.meetsMinPasswordLength=e.length>=i),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let i;for(let o=0;o<e.length;o++)i=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,t,i,o,l){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=l))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KI{constructor(e,t,i,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new oy(this),this.idTokenSubscription=new oy(this),this.beforeStateQueue=new WI(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=U_,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(l=>this._resolvePersistenceManagerAvailable=l)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Fr(t)),this._initializationPromise=this.queue(async()=>{var i,o,l;if(!this._deleted&&(this.persistenceManager=await Do.create(this,e),(i=this._resolvePersistenceManagerAvailable)===null||i===void 0||i.call(this),!this._deleted)){if(!((o=this._popupRedirectResolver)===null||o===void 0)&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((l=this.currentUser)===null||l===void 0?void 0:l.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await dc(this,{idToken:e}),i=await qn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(i)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(yn(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(f=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(f,f))}):this.directlySetCurrentUser(null)}const i=await this.assertedPersistence.getCurrentUser();let o=i,l=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,f=o==null?void 0:o._redirectEventId,g=await this.tryRedirectSignIn(e);(!h||h===f)&&(g!=null&&g.user)&&(o=g.user,l=!0)}if(!o)return this.directlySetCurrentUser(null);if(!o._redirectEventId){if(l)try{await this.beforeStateQueue.runMiddleware(o)}catch(h){o=i,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return o?this.reloadAndSetCurrentUserOrClear(o):this.directlySetCurrentUser(null)}return ye(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===o._redirectEventId?this.directlySetCurrentUser(o):this.reloadAndSetCurrentUserOrClear(o)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await fc(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=AI()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(yn(this.app))return Promise.reject(Ur(this));const t=e?st(e):null;return t&&ye(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&ye(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return yn(this.app)?Promise.reject(Ur(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return yn(this.app)?Promise.reject(Ur(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Fr(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await HI(this),t=new GI(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ml("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(i.tenantId=this.tenantId),await BI(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const i=await this.getOrInitRedirectPersistenceManager(t);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Fr(e)||this._popupRedirectResolver;ye(t,this,"argument-error"),this.redirectPersistenceManager=await Do.create(this,[Fr(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,i;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const i=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,o){if(this._deleted)return()=>{};const l=typeof t=="function"?t:t.next.bind(t);let h=!1;const f=this._isInitialized?Promise.resolve():this._initializationPromise;if(ye(f,this,"internal-error"),f.then(()=>{h||l(this.currentUser)}),typeof t=="function"){const g=e.addObserver(t,i,o);return()=>{h=!0,g()}}else{const g=e.addObserver(t);return()=>{h=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return ye(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=tv(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const i=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());i&&(t["X-Firebase-Client"]=i);const o=await this._getAppCheckToken();return o&&(t["X-Firebase-AppCheck"]=o),t}async _getAppCheckToken(){var e;if(yn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&II(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Ps(r){return st(r)}class oy{constructor(e){this.auth=e,this.observer=null,this.addObserver=uT(t=>this.observer=t)}get next(){return ye(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Pc={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function QI(r){Pc=r}function nv(r){return Pc.loadJS(r)}function XI(){return Pc.recaptchaEnterpriseScript}function YI(){return Pc.gapiScript}function JI(r){return`__${r}${Math.floor(Math.random()*1e6)}`}class ZI{constructor(){this.enterprise=new e1}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class e1{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const t1="recaptcha-enterprise",rv="NO_RECAPTCHA";class n1{constructor(e){this.type=t1,this.auth=Ps(e)}async verify(e="verify",t=!1){async function i(l){if(!t){if(l.tenantId==null&&l._agentRecaptchaConfig!=null)return l._agentRecaptchaConfig.siteKey;if(l.tenantId!=null&&l._tenantRecaptchaConfigs[l.tenantId]!==void 0)return l._tenantRecaptchaConfigs[l.tenantId].siteKey}return new Promise(async(h,f)=>{NI(l,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(g=>{if(g.recaptchaKey===void 0)f(new Error("recaptcha Enterprise site key undefined"));else{const _=new DI(g);return l.tenantId==null?l._agentRecaptchaConfig=_:l._tenantRecaptchaConfigs[l.tenantId]=_,h(_.siteKey)}}).catch(g=>{f(g)})})}function o(l,h,f){const g=window.grecaptcha;ty(g)?g.enterprise.ready(()=>{g.enterprise.execute(l,{action:e}).then(_=>{h(_)}).catch(()=>{h(rv)})}):f(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new ZI().execute("siteKey",{action:"verify"}):new Promise((l,h)=>{i(this.auth).then(f=>{if(!t&&ty(window.grecaptcha))o(f,l,h);else{if(typeof window>"u"){h(new Error("RecaptchaVerifier is only supported in browser"));return}let g=XI();g.length!==0&&(g+=f),nv(g).then(()=>{o(f,l,h)}).catch(_=>{h(_)})}}).catch(f=>{h(f)})})}}async function ay(r,e,t,i=!1,o=!1){const l=new n1(r);let h;if(o)h=rv;else try{h=await l.verify(t)}catch{h=await l.verify(t,!0)}const f=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in f){const g=f.phoneEnrollmentInfo.phoneNumber,_=f.phoneEnrollmentInfo.recaptchaToken;Object.assign(f,{phoneEnrollmentInfo:{phoneNumber:g,recaptchaToken:_,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in f){const g=f.phoneSignInInfo.recaptchaToken;Object.assign(f,{phoneSignInInfo:{recaptchaToken:g,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return f}return i?Object.assign(f,{captchaResp:h}):Object.assign(f,{captchaResponse:h}),Object.assign(f,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(f,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),f}async function Qd(r,e,t,i,o){var l;if(!((l=r._getRecaptchaConfig())===null||l===void 0)&&l.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const h=await ay(r,e,t,t==="getOobCode");return i(r,h)}else return i(r,e).catch(async h=>{if(h.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const f=await ay(r,e,t,t==="getOobCode");return i(r,f)}else return Promise.reject(h)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r1(r,e){const t=kc(r,"auth");if(t.isInitialized()){const o=t.getImmediate(),l=t.getOptions();if(Ts(l,e??{}))return o;Kn(o,"already-initialized")}return t.initialize({options:e})}function i1(r,e){const t=(e==null?void 0:e.persistence)||[],i=(Array.isArray(t)?t:[t]).map(Fr);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function s1(r,e,t){const i=Ps(r);ye(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const o=!1,l=iv(e),{host:h,port:f}=o1(e),g=f===null?"":`:${f}`,_={url:`${l}//${h}${g}/`},w=Object.freeze({host:h,port:f,protocol:l.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!i._canInitEmulator){ye(i.config.emulator&&i.emulatorConfig,i,"emulator-config-failed"),ye(Ts(_,i.config.emulator)&&Ts(w,i.emulatorConfig),i,"emulator-config-failed");return}i.config.emulator=_,i.emulatorConfig=w,i.settings.appVerificationDisabledForTesting=!0,ji(h)?(_f(`${l}//${h}${g}`),vf("Auth",!0)):a1()}function iv(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function o1(r){const e=iv(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const i=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(i);if(o){const l=o[1];return{host:l,port:ly(i.substr(l.length+1))}}else{const[l,h]=i.split(":");return{host:l,port:ly(h)}}}function ly(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function a1(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cf{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return jr("not implemented")}_getIdTokenResponse(e){return jr("not implemented")}_linkToIdToken(e,t){return jr("not implemented")}_getReauthenticationResolver(e){return jr("not implemented")}}async function l1(r,e){return Ui(r,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function u1(r,e){return _l(r,"POST","/v1/accounts:signInWithPassword",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function c1(r,e){return _l(r,"POST","/v1/accounts:signInWithEmailLink",Fi(r,e))}async function h1(r,e){return _l(r,"POST","/v1/accounts:signInWithEmailLink",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ol extends Cf{constructor(e,t,i,o=null){super("password",i),this._email=e,this._password=t,this._tenantId=o}static _fromEmailAndPassword(e,t){return new ol(e,t,"password")}static _fromEmailAndCode(e,t,i=null){return new ol(e,t,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qd(e,t,"signInWithPassword",u1);case"emailLink":return c1(e,{email:this._email,oobCode:this._password});default:Kn(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const i={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Qd(e,i,"signUpPassword",l1);case"emailLink":return h1(e,{idToken:t,email:this._email,oobCode:this._password});default:Kn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function No(r,e){return _l(r,"POST","/v1/accounts:signInWithIdp",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const d1="http://localhost";class Ss extends Cf{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ss(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Kn("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:o}=t,l=If(t,["providerId","signInMethod"]);if(!i||!o)return null;const h=new Ss(i,o);return h.idToken=l.idToken||void 0,h.accessToken=l.accessToken||void 0,h.secret=l.secret,h.nonce=l.nonce,h.pendingToken=l.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return No(e,t)}_linkToIdToken(e,t){const i=this.buildRequest();return i.idToken=t,No(e,i)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,No(e,t)}buildRequest(){const e={requestUri:d1,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=gl(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f1(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function p1(r){const e=Ha(qa(r)).link,t=e?Ha(qa(e)).deep_link_id:null,i=Ha(qa(r)).deep_link_id;return(i?Ha(qa(i)).link:null)||i||t||e||r}class kf{constructor(e){var t,i,o,l,h,f;const g=Ha(qa(e)),_=(t=g.apiKey)!==null&&t!==void 0?t:null,w=(i=g.oobCode)!==null&&i!==void 0?i:null,x=f1((o=g.mode)!==null&&o!==void 0?o:null);ye(_&&w&&x,"argument-error"),this.apiKey=_,this.operation=x,this.code=w,this.continueUrl=(l=g.continueUrl)!==null&&l!==void 0?l:null,this.languageCode=(h=g.lang)!==null&&h!==void 0?h:null,this.tenantId=(f=g.tenantId)!==null&&f!==void 0?f:null}static parseLink(e){const t=p1(e);try{return new kf(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bo{constructor(){this.providerId=Bo.PROVIDER_ID}static credential(e,t){return ol._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const i=kf.parseLink(t);return ye(i,"argument-error"),ol._fromEmailAndCode(e,i.code,i.tenantId)}}Bo.PROVIDER_ID="password";Bo.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Bo.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sv{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vl extends sv{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _i extends vl{constructor(){super("facebook.com")}static credential(e){return Ss._fromParams({providerId:_i.PROVIDER_ID,signInMethod:_i.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return _i.credentialFromTaggedObject(e)}static credentialFromError(e){return _i.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return _i.credential(e.oauthAccessToken)}catch{return null}}}_i.FACEBOOK_SIGN_IN_METHOD="facebook.com";_i.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vi extends vl{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ss._fromParams({providerId:vi.PROVIDER_ID,signInMethod:vi.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return vi.credentialFromTaggedObject(e)}static credentialFromError(e){return vi.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return vi.credential(t,i)}catch{return null}}}vi.GOOGLE_SIGN_IN_METHOD="google.com";vi.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ei extends vl{constructor(){super("github.com")}static credential(e){return Ss._fromParams({providerId:Ei.PROVIDER_ID,signInMethod:Ei.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ei.credentialFromTaggedObject(e)}static credentialFromError(e){return Ei.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ei.credential(e.oauthAccessToken)}catch{return null}}}Ei.GITHUB_SIGN_IN_METHOD="github.com";Ei.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wi extends vl{constructor(){super("twitter.com")}static credential(e,t){return Ss._fromParams({providerId:wi.PROVIDER_ID,signInMethod:wi.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return wi.credentialFromTaggedObject(e)}static credentialFromError(e){return wi.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return wi.credential(t,i)}catch{return null}}}wi.TWITTER_SIGN_IN_METHOD="twitter.com";wi.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function m1(r,e){return _l(r,"POST","/v1/accounts:signUp",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xs{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,o=!1){const l=await qn._fromIdTokenResponse(e,i,o),h=uy(i);return new xs({user:l,providerId:h,_tokenResponse:i,operationType:t})}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);const o=uy(i);return new xs({user:e,providerId:o,_tokenResponse:i,operationType:t})}}function uy(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pc extends vr{constructor(e,t,i,o){var l;super(t.code,t.message),this.operationType=i,this.user=o,Object.setPrototypeOf(this,pc.prototype),this.customData={appName:e.name,tenantId:(l=e.tenantId)!==null&&l!==void 0?l:void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,o){return new pc(e,t,i,o)}}function ov(r,e,t,i){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(l=>{throw l.code==="auth/multi-factor-auth-required"?pc._fromErrorAndOperation(r,l,e,i):l})}async function g1(r,e,t=!1){const i=await sl(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return xs._forOperation(r,"link",i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function y1(r,e,t=!1){const{auth:i}=r;if(yn(i.app))return Promise.reject(Ur(i));const o="reauthenticate";try{const l=await sl(r,ov(i,o,e,r),t);ye(l.idToken,i,"internal-error");const h=Af(l.idToken);ye(h,i,"internal-error");const{sub:f}=h;return ye(r.uid===f,i,"user-mismatch"),xs._forOperation(r,o,l)}catch(l){throw(l==null?void 0:l.code)==="auth/user-not-found"&&Kn(i,"user-mismatch"),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function av(r,e,t=!1){if(yn(r.app))return Promise.reject(Ur(r));const i="signIn",o=await ov(r,i,e),l=await xs._fromIdTokenResponse(r,i,o);return t||await r._updateCurrentUser(l.user),l}async function _1(r,e){return av(Ps(r),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lv(r){const e=Ps(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function v1(r,e,t){if(yn(r.app))return Promise.reject(Ur(r));const i=Ps(r),h=await Qd(i,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",m1).catch(g=>{throw g.code==="auth/password-does-not-meet-requirements"&&lv(r),g}),f=await xs._fromIdTokenResponse(i,"signIn",h);return await i._updateCurrentUser(f.user),f}function E1(r,e,t){return yn(r.app)?Promise.reject(Ur(r)):_1(st(r),Bo.credential(e,t)).catch(async i=>{throw i.code==="auth/password-does-not-meet-requirements"&&lv(r),i})}function w1(r,e,t,i){return st(r).onIdTokenChanged(e,t,i)}function T1(r,e,t){return st(r).beforeAuthStateChanged(e,t)}function I1(r,e,t,i){return st(r).onAuthStateChanged(e,t,i)}function S1(r){return st(r).signOut()}const mc="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uv{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(mc,"1"),this.storage.removeItem(mc),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x1=1e3,A1=10;class cv extends uv{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ev(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const i=this.storage.getItem(t),o=this.localCache[t];i!==o&&e(t,o,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,f,g)=>{this.notifyListeners(h,g)});return}const i=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(i);!t&&this.localCache[i]===h||this.notifyListeners(i,h)},l=this.storage.getItem(i);$I()&&l!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,A1):o()}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const o of Array.from(i))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},x1)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}cv.type="LOCAL";const R1=cv;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hv extends uv{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}hv.type="SESSION";const dv=hv;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function C1(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bc{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const i=new bc(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:i,eventType:o,data:l}=t.data,h=this.handlersMap[o];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:i,eventType:o});const f=Array.from(h).map(async _=>_(t.origin,l)),g=await C1(f);t.ports[0].postMessage({status:"done",eventId:i,eventType:o,response:g})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}bc.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pf(r="",e=10){let t="";for(let i=0;i<e;i++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k1{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let l,h;return new Promise((f,g)=>{const _=Pf("",20);o.port1.start();const w=setTimeout(()=>{g(new Error("unsupported_event"))},i);h={messageChannel:o,onMessage(x){const A=x;if(A.data.eventId===_)switch(A.data.status){case"ack":clearTimeout(w),l=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(l),f(A.data.response);break;default:clearTimeout(w),clearTimeout(l),g(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:_,data:t},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dr(){return window}function P1(r){dr().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fv(){return typeof dr().WorkerGlobalScope<"u"&&typeof dr().importScripts=="function"}async function b1(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function D1(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function N1(){return fv()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pv="firebaseLocalStorageDb",O1=1,gc="firebaseLocalStorage",mv="fbase_key";class El{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Dc(r,e){return r.transaction([gc],e?"readwrite":"readonly").objectStore(gc)}function V1(){const r=indexedDB.deleteDatabase(pv);return new El(r).toPromise()}function Xd(){const r=indexedDB.open(pv,O1);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const i=r.result;try{i.createObjectStore(gc,{keyPath:mv})}catch(o){t(o)}}),r.addEventListener("success",async()=>{const i=r.result;i.objectStoreNames.contains(gc)?e(i):(i.close(),await V1(),e(await Xd()))})})}async function cy(r,e,t){const i=Dc(r,!0).put({[mv]:e,value:t});return new El(i).toPromise()}async function L1(r,e){const t=Dc(r,!1).get(e),i=await new El(t).toPromise();return i===void 0?null:i.value}function hy(r,e){const t=Dc(r,!0).delete(e);return new El(t).toPromise()}const M1=800,j1=3;class gv{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Xd(),this.db)}async _withRetries(e){let t=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(t++>j1)throw i;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return fv()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=bc._getInstance(N1()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await b1(),!this.activeServiceWorker)return;this.sender=new k1(this.activeServiceWorker);const i=await this.sender._send("ping",{},800);i&&!((e=i[0])===null||e===void 0)&&e.fulfilled&&!((t=i[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||D1()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Xd();return await cy(e,mc,"1"),await hy(e,mc),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>cy(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(i=>L1(i,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>hy(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const l=Dc(o,!1).getAll();return new El(l).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],i=new Set;if(e.length!==0)for(const{fbase_key:o,value:l}of e)i.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(l)&&(this.notifyListeners(o,l),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!i.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const o of Array.from(i))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),M1)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}gv.type="LOCAL";const F1=gv;new yl(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function U1(r,e){return e?Fr(e):(ye(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bf extends Cf{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return No(e,this._buildIdpRequest())}_linkToIdToken(e,t){return No(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return No(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function B1(r){return av(r.auth,new bf(r),r.bypassAuthState)}function z1(r){const{auth:e,user:t}=r;return ye(t,e,"internal-error"),y1(t,new bf(r),r.bypassAuthState)}async function $1(r){const{auth:e,user:t}=r;return ye(t,e,"internal-error"),g1(t,new bf(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yv{constructor(e,t,i,o,l=!1){this.auth=e,this.resolver=i,this.user=o,this.bypassAuthState=l,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:i,postBody:o,tenantId:l,error:h,type:f}=e;if(h){this.reject(h);return}const g={auth:this.auth,requestUri:t,sessionId:i,tenantId:l||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(f)(g))}catch(_){this.reject(_)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return B1;case"linkViaPopup":case"linkViaRedirect":return $1;case"reauthViaPopup":case"reauthViaRedirect":return z1;default:Kn(this.auth,"internal-error")}}resolve(e){$r(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){$r(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W1=new yl(2e3,1e4);class Po extends yv{constructor(e,t,i,o,l){super(e,t,o,l),this.provider=i,this.authWindow=null,this.pollId=null,Po.currentPopupAction&&Po.currentPopupAction.cancel(),Po.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return ye(e,this.auth,"internal-error"),e}async onExecution(){$r(this.filter.length===1,"Popup operations only handle one event");const e=Pf();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(hr(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(hr(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Po.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,i;if(!((i=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||i===void 0)&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(hr(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,W1.get())};e()}}Po.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H1="pendingRedirect",tc=new Map;class q1 extends yv{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=tc.get(this.auth._key());if(!e){try{const i=await G1(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}tc.set(this.auth._key(),e)}return this.bypassAuthState||tc.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function G1(r,e){const t=X1(e),i=Q1(r);if(!await i._isAvailable())return!1;const o=await i._get(t)==="true";return await i._remove(t),o}function K1(r,e){tc.set(r._key(),e)}function Q1(r){return Fr(r._redirectPersistence)}function X1(r){return ec(H1,r.config.apiKey,r.name)}async function Y1(r,e,t=!1){if(yn(r.app))return Promise.reject(Ur(r));const i=Ps(r),o=U1(i,e),h=await new q1(i,o,t).execute();return h&&!t&&(delete h.user._redirectEventId,await i._persistUserIfCurrent(h.user),await i._setRedirectUser(null,e)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const J1=600*1e3;class Z1{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!eS(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var i;if(e.error&&!_v(e)){const o=((i=e.error.code)===null||i===void 0?void 0:i.split("auth/")[1])||"internal-error";t.onError(hr(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const i=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=J1&&this.cachedEventUids.clear(),this.cachedEventUids.has(dy(e))}saveEventToCache(e){this.cachedEventUids.add(dy(e)),this.lastProcessedEventTime=Date.now()}}function dy(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function _v({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function eS(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return _v(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tS(r,e={}){return Ui(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nS=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,rS=/^https?/;async function iS(r){if(r.config.emulator)return;const{authorizedDomains:e}=await tS(r);for(const t of e)try{if(sS(t))return}catch{}Kn(r,"unauthorized-domain")}function sS(r){const e=Gd(),{protocol:t,hostname:i}=new URL(e);if(r.startsWith("chrome-extension://")){const h=new URL(r);return h.hostname===""&&i===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===i}if(!rS.test(t))return!1;if(nS.test(r))return i===r;const o=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(i)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oS=new yl(3e4,6e4);function fy(){const r=dr().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function aS(r){return new Promise((e,t)=>{var i,o,l;function h(){fy(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{fy(),t(hr(r,"network-request-failed"))},timeout:oS.get()})}if(!((o=(i=dr().gapi)===null||i===void 0?void 0:i.iframes)===null||o===void 0)&&o.Iframe)e(gapi.iframes.getContext());else if(!((l=dr().gapi)===null||l===void 0)&&l.load)h();else{const f=JI("iframefcb");return dr()[f]=()=>{gapi.load?h():t(hr(r,"network-request-failed"))},nv(`${YI()}?onload=${f}`).catch(g=>t(g))}}).catch(e=>{throw nc=null,e})}let nc=null;function lS(r){return nc=nc||aS(r),nc}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uS=new yl(5e3,15e3),cS="__/auth/iframe",hS="emulator/auth/iframe",dS={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},fS=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function pS(r){const e=r.config;ye(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?xf(e,hS):`https://${r.config.authDomain}/${cS}`,i={apiKey:e.apiKey,appName:r.name,v:ks},o=fS.get(r.config.apiHost);o&&(i.eid=o);const l=r._getFrameworks();return l.length&&(i.fw=l.join(",")),`${t}?${gl(i).slice(1)}`}async function mS(r){const e=await lS(r),t=dr().gapi;return ye(t,r,"internal-error"),e.open({where:document.body,url:pS(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:dS,dontclear:!0},i=>new Promise(async(o,l)=>{await i.restyle({setHideOnLeave:!1});const h=hr(r,"network-request-failed"),f=dr().setTimeout(()=>{l(h)},uS.get());function g(){dr().clearTimeout(f),o(i)}i.ping(g).then(g,()=>{l(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gS={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},yS=500,_S=600,vS="_blank",ES="http://localhost";class py{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function wS(r,e,t,i=yS,o=_S){const l=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-i)/2,0).toString();let f="";const g=Object.assign(Object.assign({},gS),{width:i.toString(),height:o.toString(),top:l,left:h}),_=qt().toLowerCase();t&&(f=Q_(_)?vS:t),G_(_)&&(e=e||ES,g.scrollbars="yes");const w=Object.entries(g).reduce((A,[O,W])=>`${A}${O}=${W},`,"");if(zI(_)&&f!=="_self")return TS(e||"",f),new py(null);const x=window.open(e||"",f,w);ye(x,r,"popup-blocked");try{x.focus()}catch{}return new py(x)}function TS(r,e){const t=document.createElement("a");t.href=r,t.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const IS="__/auth/handler",SS="emulator/auth/handler",xS=encodeURIComponent("fac");async function my(r,e,t,i,o,l){ye(r.config.authDomain,r,"auth-domain-config-required"),ye(r.config.apiKey,r,"invalid-api-key");const h={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:i,v:ks,eventId:o};if(e instanceof sv){e.setDefaultLanguage(r.languageCode),h.providerId=e.providerId||"",lT(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[w,x]of Object.entries({}))h[w]=x}if(e instanceof vl){const w=e.getScopes().filter(x=>x!=="");w.length>0&&(h.scopes=w.join(","))}r.tenantId&&(h.tid=r.tenantId);const f=h;for(const w of Object.keys(f))f[w]===void 0&&delete f[w];const g=await r._getAppCheckToken(),_=g?`#${xS}=${encodeURIComponent(g)}`:"";return`${AS(r)}?${gl(f).slice(1)}${_}`}function AS({config:r}){return r.emulator?xf(r,SS):`https://${r.authDomain}/${IS}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vd="webStorageSupport";class RS{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=dv,this._completeRedirectFn=Y1,this._overrideRedirectResult=K1}async _openPopup(e,t,i,o){var l;$r((l=this.eventManagers[e._key()])===null||l===void 0?void 0:l.manager,"_initialize() not called before _openPopup()");const h=await my(e,t,i,Gd(),o);return wS(e,h,Pf())}async _openRedirect(e,t,i,o){await this._originValidation(e);const l=await my(e,t,i,Gd(),o);return P1(l),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:l}=this.eventManagers[t];return o?Promise.resolve(o):($r(l,"If manager is not set, promise should be"),l)}const i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){const t=await mS(e),i=new Z1(e);return t.register("authEvent",o=>(ye(o==null?void 0:o.authEvent,e,"invalid-auth-event"),{status:i.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Vd,{type:Vd},o=>{var l;const h=(l=o==null?void 0:o[0])===null||l===void 0?void 0:l[Vd];h!==void 0&&t(!!h),Kn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=iS(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return ev()||K_()||Rf()}}const CS=RS;var gy="@firebase/auth",yy="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kS{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){ye(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function PS(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function bS(r){Is(new ki("auth",(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),l=e.getProvider("app-check-internal"),{apiKey:h,authDomain:f}=i.options;ye(h&&!h.includes(":"),"invalid-api-key",{appName:i.name});const g={apiKey:h,authDomain:f,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:tv(r)},_=new KI(i,o,l,g);return i1(_,t),_},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{e.getProvider("auth-internal").initialize()})),Is(new ki("auth-internal",e=>{const t=Ps(e.getProvider("auth").getImmediate());return(i=>new kS(i))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),cr(gy,yy,PS(r)),cr(gy,yy,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DS=300,NS=D_("authIdTokenMaxAge")||DS;let _y=null;const OS=r=>async e=>{const t=e&&await e.getIdTokenResult(),i=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(i&&i>NS)return;const o=t==null?void 0:t.token;_y!==o&&(_y=o,await fetch(r,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function VS(r=Tf()){const e=kc(r,"auth");if(e.isInitialized())return e.getImmediate();const t=r1(r,{popupRedirectResolver:CS,persistence:[F1,R1,dv]}),i=D_("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const l=new URL(i,location.origin);if(location.origin===l.origin){const h=OS(l.toString());T1(t,h,()=>h(t.currentUser)),w1(t,f=>h(f))}}const o=k_("auth");return o&&s1(t,`http://${o}`),t}function LS(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}QI({loadJS(r){return new Promise((e,t)=>{const i=document.createElement("script");i.setAttribute("src",r),i.onload=e,i.onerror=o=>{const l=hr("internal-error");l.customData=o,t(l)},i.type="text/javascript",i.charset="UTF-8",LS().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});bS("Browser");var vy=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ri,vv;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(D,S){function C(){}C.prototype=S.prototype,D.D=S.prototype,D.prototype=new C,D.prototype.constructor=D,D.C=function(P,N,L){for(var R=Array(arguments.length-2),lt=2;lt<arguments.length;lt++)R[lt-2]=arguments[lt];return S.prototype[N].apply(P,R)}}function t(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(i,t),i.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(D,S,C){C||(C=0);var P=Array(16);if(typeof S=="string")for(var N=0;16>N;++N)P[N]=S.charCodeAt(C++)|S.charCodeAt(C++)<<8|S.charCodeAt(C++)<<16|S.charCodeAt(C++)<<24;else for(N=0;16>N;++N)P[N]=S[C++]|S[C++]<<8|S[C++]<<16|S[C++]<<24;S=D.g[0],C=D.g[1],N=D.g[2];var L=D.g[3],R=S+(L^C&(N^L))+P[0]+3614090360&4294967295;S=C+(R<<7&4294967295|R>>>25),R=L+(N^S&(C^N))+P[1]+3905402710&4294967295,L=S+(R<<12&4294967295|R>>>20),R=N+(C^L&(S^C))+P[2]+606105819&4294967295,N=L+(R<<17&4294967295|R>>>15),R=C+(S^N&(L^S))+P[3]+3250441966&4294967295,C=N+(R<<22&4294967295|R>>>10),R=S+(L^C&(N^L))+P[4]+4118548399&4294967295,S=C+(R<<7&4294967295|R>>>25),R=L+(N^S&(C^N))+P[5]+1200080426&4294967295,L=S+(R<<12&4294967295|R>>>20),R=N+(C^L&(S^C))+P[6]+2821735955&4294967295,N=L+(R<<17&4294967295|R>>>15),R=C+(S^N&(L^S))+P[7]+4249261313&4294967295,C=N+(R<<22&4294967295|R>>>10),R=S+(L^C&(N^L))+P[8]+1770035416&4294967295,S=C+(R<<7&4294967295|R>>>25),R=L+(N^S&(C^N))+P[9]+2336552879&4294967295,L=S+(R<<12&4294967295|R>>>20),R=N+(C^L&(S^C))+P[10]+4294925233&4294967295,N=L+(R<<17&4294967295|R>>>15),R=C+(S^N&(L^S))+P[11]+2304563134&4294967295,C=N+(R<<22&4294967295|R>>>10),R=S+(L^C&(N^L))+P[12]+1804603682&4294967295,S=C+(R<<7&4294967295|R>>>25),R=L+(N^S&(C^N))+P[13]+4254626195&4294967295,L=S+(R<<12&4294967295|R>>>20),R=N+(C^L&(S^C))+P[14]+2792965006&4294967295,N=L+(R<<17&4294967295|R>>>15),R=C+(S^N&(L^S))+P[15]+1236535329&4294967295,C=N+(R<<22&4294967295|R>>>10),R=S+(N^L&(C^N))+P[1]+4129170786&4294967295,S=C+(R<<5&4294967295|R>>>27),R=L+(C^N&(S^C))+P[6]+3225465664&4294967295,L=S+(R<<9&4294967295|R>>>23),R=N+(S^C&(L^S))+P[11]+643717713&4294967295,N=L+(R<<14&4294967295|R>>>18),R=C+(L^S&(N^L))+P[0]+3921069994&4294967295,C=N+(R<<20&4294967295|R>>>12),R=S+(N^L&(C^N))+P[5]+3593408605&4294967295,S=C+(R<<5&4294967295|R>>>27),R=L+(C^N&(S^C))+P[10]+38016083&4294967295,L=S+(R<<9&4294967295|R>>>23),R=N+(S^C&(L^S))+P[15]+3634488961&4294967295,N=L+(R<<14&4294967295|R>>>18),R=C+(L^S&(N^L))+P[4]+3889429448&4294967295,C=N+(R<<20&4294967295|R>>>12),R=S+(N^L&(C^N))+P[9]+568446438&4294967295,S=C+(R<<5&4294967295|R>>>27),R=L+(C^N&(S^C))+P[14]+3275163606&4294967295,L=S+(R<<9&4294967295|R>>>23),R=N+(S^C&(L^S))+P[3]+4107603335&4294967295,N=L+(R<<14&4294967295|R>>>18),R=C+(L^S&(N^L))+P[8]+1163531501&4294967295,C=N+(R<<20&4294967295|R>>>12),R=S+(N^L&(C^N))+P[13]+2850285829&4294967295,S=C+(R<<5&4294967295|R>>>27),R=L+(C^N&(S^C))+P[2]+4243563512&4294967295,L=S+(R<<9&4294967295|R>>>23),R=N+(S^C&(L^S))+P[7]+1735328473&4294967295,N=L+(R<<14&4294967295|R>>>18),R=C+(L^S&(N^L))+P[12]+2368359562&4294967295,C=N+(R<<20&4294967295|R>>>12),R=S+(C^N^L)+P[5]+4294588738&4294967295,S=C+(R<<4&4294967295|R>>>28),R=L+(S^C^N)+P[8]+2272392833&4294967295,L=S+(R<<11&4294967295|R>>>21),R=N+(L^S^C)+P[11]+1839030562&4294967295,N=L+(R<<16&4294967295|R>>>16),R=C+(N^L^S)+P[14]+4259657740&4294967295,C=N+(R<<23&4294967295|R>>>9),R=S+(C^N^L)+P[1]+2763975236&4294967295,S=C+(R<<4&4294967295|R>>>28),R=L+(S^C^N)+P[4]+1272893353&4294967295,L=S+(R<<11&4294967295|R>>>21),R=N+(L^S^C)+P[7]+4139469664&4294967295,N=L+(R<<16&4294967295|R>>>16),R=C+(N^L^S)+P[10]+3200236656&4294967295,C=N+(R<<23&4294967295|R>>>9),R=S+(C^N^L)+P[13]+681279174&4294967295,S=C+(R<<4&4294967295|R>>>28),R=L+(S^C^N)+P[0]+3936430074&4294967295,L=S+(R<<11&4294967295|R>>>21),R=N+(L^S^C)+P[3]+3572445317&4294967295,N=L+(R<<16&4294967295|R>>>16),R=C+(N^L^S)+P[6]+76029189&4294967295,C=N+(R<<23&4294967295|R>>>9),R=S+(C^N^L)+P[9]+3654602809&4294967295,S=C+(R<<4&4294967295|R>>>28),R=L+(S^C^N)+P[12]+3873151461&4294967295,L=S+(R<<11&4294967295|R>>>21),R=N+(L^S^C)+P[15]+530742520&4294967295,N=L+(R<<16&4294967295|R>>>16),R=C+(N^L^S)+P[2]+3299628645&4294967295,C=N+(R<<23&4294967295|R>>>9),R=S+(N^(C|~L))+P[0]+4096336452&4294967295,S=C+(R<<6&4294967295|R>>>26),R=L+(C^(S|~N))+P[7]+1126891415&4294967295,L=S+(R<<10&4294967295|R>>>22),R=N+(S^(L|~C))+P[14]+2878612391&4294967295,N=L+(R<<15&4294967295|R>>>17),R=C+(L^(N|~S))+P[5]+4237533241&4294967295,C=N+(R<<21&4294967295|R>>>11),R=S+(N^(C|~L))+P[12]+1700485571&4294967295,S=C+(R<<6&4294967295|R>>>26),R=L+(C^(S|~N))+P[3]+2399980690&4294967295,L=S+(R<<10&4294967295|R>>>22),R=N+(S^(L|~C))+P[10]+4293915773&4294967295,N=L+(R<<15&4294967295|R>>>17),R=C+(L^(N|~S))+P[1]+2240044497&4294967295,C=N+(R<<21&4294967295|R>>>11),R=S+(N^(C|~L))+P[8]+1873313359&4294967295,S=C+(R<<6&4294967295|R>>>26),R=L+(C^(S|~N))+P[15]+4264355552&4294967295,L=S+(R<<10&4294967295|R>>>22),R=N+(S^(L|~C))+P[6]+2734768916&4294967295,N=L+(R<<15&4294967295|R>>>17),R=C+(L^(N|~S))+P[13]+1309151649&4294967295,C=N+(R<<21&4294967295|R>>>11),R=S+(N^(C|~L))+P[4]+4149444226&4294967295,S=C+(R<<6&4294967295|R>>>26),R=L+(C^(S|~N))+P[11]+3174756917&4294967295,L=S+(R<<10&4294967295|R>>>22),R=N+(S^(L|~C))+P[2]+718787259&4294967295,N=L+(R<<15&4294967295|R>>>17),R=C+(L^(N|~S))+P[9]+3951481745&4294967295,D.g[0]=D.g[0]+S&4294967295,D.g[1]=D.g[1]+(N+(R<<21&4294967295|R>>>11))&4294967295,D.g[2]=D.g[2]+N&4294967295,D.g[3]=D.g[3]+L&4294967295}i.prototype.u=function(D,S){S===void 0&&(S=D.length);for(var C=S-this.blockSize,P=this.B,N=this.h,L=0;L<S;){if(N==0)for(;L<=C;)o(this,D,L),L+=this.blockSize;if(typeof D=="string"){for(;L<S;)if(P[N++]=D.charCodeAt(L++),N==this.blockSize){o(this,P),N=0;break}}else for(;L<S;)if(P[N++]=D[L++],N==this.blockSize){o(this,P),N=0;break}}this.h=N,this.o+=S},i.prototype.v=function(){var D=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);D[0]=128;for(var S=1;S<D.length-8;++S)D[S]=0;var C=8*this.o;for(S=D.length-8;S<D.length;++S)D[S]=C&255,C/=256;for(this.u(D),D=Array(16),S=C=0;4>S;++S)for(var P=0;32>P;P+=8)D[C++]=this.g[S]>>>P&255;return D};function l(D,S){var C=f;return Object.prototype.hasOwnProperty.call(C,D)?C[D]:C[D]=S(D)}function h(D,S){this.h=S;for(var C=[],P=!0,N=D.length-1;0<=N;N--){var L=D[N]|0;P&&L==S||(C[N]=L,P=!1)}this.g=C}var f={};function g(D){return-128<=D&&128>D?l(D,function(S){return new h([S|0],0>S?-1:0)}):new h([D|0],0>D?-1:0)}function _(D){if(isNaN(D)||!isFinite(D))return x;if(0>D)return $(_(-D));for(var S=[],C=1,P=0;D>=C;P++)S[P]=D/C|0,C*=4294967296;return new h(S,0)}function w(D,S){if(D.length==0)throw Error("number format error: empty string");if(S=S||10,2>S||36<S)throw Error("radix out of range: "+S);if(D.charAt(0)=="-")return $(w(D.substring(1),S));if(0<=D.indexOf("-"))throw Error('number format error: interior "-" character');for(var C=_(Math.pow(S,8)),P=x,N=0;N<D.length;N+=8){var L=Math.min(8,D.length-N),R=parseInt(D.substring(N,N+L),S);8>L?(L=_(Math.pow(S,L)),P=P.j(L).add(_(R))):(P=P.j(C),P=P.add(_(R)))}return P}var x=g(0),A=g(1),O=g(16777216);r=h.prototype,r.m=function(){if(q(this))return-$(this).m();for(var D=0,S=1,C=0;C<this.g.length;C++){var P=this.i(C);D+=(0<=P?P:4294967296+P)*S,S*=4294967296}return D},r.toString=function(D){if(D=D||10,2>D||36<D)throw Error("radix out of range: "+D);if(W(this))return"0";if(q(this))return"-"+$(this).toString(D);for(var S=_(Math.pow(D,6)),C=this,P="";;){var N=re(C,S).g;C=he(C,N.j(S));var L=((0<C.g.length?C.g[0]:C.h)>>>0).toString(D);if(C=N,W(C))return L+P;for(;6>L.length;)L="0"+L;P=L+P}},r.i=function(D){return 0>D?0:D<this.g.length?this.g[D]:this.h};function W(D){if(D.h!=0)return!1;for(var S=0;S<D.g.length;S++)if(D.g[S]!=0)return!1;return!0}function q(D){return D.h==-1}r.l=function(D){return D=he(this,D),q(D)?-1:W(D)?0:1};function $(D){for(var S=D.g.length,C=[],P=0;P<S;P++)C[P]=~D.g[P];return new h(C,~D.h).add(A)}r.abs=function(){return q(this)?$(this):this},r.add=function(D){for(var S=Math.max(this.g.length,D.g.length),C=[],P=0,N=0;N<=S;N++){var L=P+(this.i(N)&65535)+(D.i(N)&65535),R=(L>>>16)+(this.i(N)>>>16)+(D.i(N)>>>16);P=R>>>16,L&=65535,R&=65535,C[N]=R<<16|L}return new h(C,C[C.length-1]&-2147483648?-1:0)};function he(D,S){return D.add($(S))}r.j=function(D){if(W(this)||W(D))return x;if(q(this))return q(D)?$(this).j($(D)):$($(this).j(D));if(q(D))return $(this.j($(D)));if(0>this.l(O)&&0>D.l(O))return _(this.m()*D.m());for(var S=this.g.length+D.g.length,C=[],P=0;P<2*S;P++)C[P]=0;for(P=0;P<this.g.length;P++)for(var N=0;N<D.g.length;N++){var L=this.i(P)>>>16,R=this.i(P)&65535,lt=D.i(N)>>>16,Mt=D.i(N)&65535;C[2*P+2*N]+=R*Mt,M(C,2*P+2*N),C[2*P+2*N+1]+=L*Mt,M(C,2*P+2*N+1),C[2*P+2*N+1]+=R*lt,M(C,2*P+2*N+1),C[2*P+2*N+2]+=L*lt,M(C,2*P+2*N+2)}for(P=0;P<S;P++)C[P]=C[2*P+1]<<16|C[2*P];for(P=S;P<2*S;P++)C[P]=0;return new h(C,0)};function M(D,S){for(;(D[S]&65535)!=D[S];)D[S+1]+=D[S]>>>16,D[S]&=65535,S++}function J(D,S){this.g=D,this.h=S}function re(D,S){if(W(S))throw Error("division by zero");if(W(D))return new J(x,x);if(q(D))return S=re($(D),S),new J($(S.g),$(S.h));if(q(S))return S=re(D,$(S)),new J($(S.g),S.h);if(30<D.g.length){if(q(D)||q(S))throw Error("slowDivide_ only works with positive integers.");for(var C=A,P=S;0>=P.l(D);)C=Ce(C),P=Ce(P);var N=Ee(C,1),L=Ee(P,1);for(P=Ee(P,2),C=Ee(C,2);!W(P);){var R=L.add(P);0>=R.l(D)&&(N=N.add(C),L=R),P=Ee(P,1),C=Ee(C,1)}return S=he(D,N.j(S)),new J(N,S)}for(N=x;0<=D.l(S);){for(C=Math.max(1,Math.floor(D.m()/S.m())),P=Math.ceil(Math.log(C)/Math.LN2),P=48>=P?1:Math.pow(2,P-48),L=_(C),R=L.j(S);q(R)||0<R.l(D);)C-=P,L=_(C),R=L.j(S);W(L)&&(L=A),N=N.add(L),D=he(D,R)}return new J(N,D)}r.A=function(D){return re(this,D).h},r.and=function(D){for(var S=Math.max(this.g.length,D.g.length),C=[],P=0;P<S;P++)C[P]=this.i(P)&D.i(P);return new h(C,this.h&D.h)},r.or=function(D){for(var S=Math.max(this.g.length,D.g.length),C=[],P=0;P<S;P++)C[P]=this.i(P)|D.i(P);return new h(C,this.h|D.h)},r.xor=function(D){for(var S=Math.max(this.g.length,D.g.length),C=[],P=0;P<S;P++)C[P]=this.i(P)^D.i(P);return new h(C,this.h^D.h)};function Ce(D){for(var S=D.g.length+1,C=[],P=0;P<S;P++)C[P]=D.i(P)<<1|D.i(P-1)>>>31;return new h(C,D.h)}function Ee(D,S){var C=S>>5;S%=32;for(var P=D.g.length-C,N=[],L=0;L<P;L++)N[L]=0<S?D.i(L+C)>>>S|D.i(L+C+1)<<32-S:D.i(L+C);return new h(N,D.h)}i.prototype.digest=i.prototype.v,i.prototype.reset=i.prototype.s,i.prototype.update=i.prototype.u,vv=i,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.A,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=_,h.fromString=w,Ri=h}).apply(typeof vy<"u"?vy:typeof self<"u"?self:typeof window<"u"?window:{});var qu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ev,Ga,wv,rc,Yd,Tv,Iv,Sv;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(u,p,y){return u==Array.prototype||u==Object.prototype||(u[p]=y.value),u};function t(u){u=[typeof globalThis=="object"&&globalThis,u,typeof window=="object"&&window,typeof self=="object"&&self,typeof qu=="object"&&qu];for(var p=0;p<u.length;++p){var y=u[p];if(y&&y.Math==Math)return y}throw Error("Cannot find global object")}var i=t(this);function o(u,p){if(p)e:{var y=i;u=u.split(".");for(var T=0;T<u.length-1;T++){var j=u[T];if(!(j in y))break e;y=y[j]}u=u[u.length-1],T=y[u],p=p(T),p!=T&&p!=null&&e(y,u,{configurable:!0,writable:!0,value:p})}}function l(u,p){u instanceof String&&(u+="");var y=0,T=!1,j={next:function(){if(!T&&y<u.length){var z=y++;return{value:p(z,u[z]),done:!1}}return T=!0,{done:!0,value:void 0}}};return j[Symbol.iterator]=function(){return j},j}o("Array.prototype.values",function(u){return u||function(){return l(this,function(p,y){return y})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var h=h||{},f=this||self;function g(u){var p=typeof u;return p=p!="object"?p:u?Array.isArray(u)?"array":p:"null",p=="array"||p=="object"&&typeof u.length=="number"}function _(u){var p=typeof u;return p=="object"&&u!=null||p=="function"}function w(u,p,y){return u.call.apply(u.bind,arguments)}function x(u,p,y){if(!u)throw Error();if(2<arguments.length){var T=Array.prototype.slice.call(arguments,2);return function(){var j=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(j,T),u.apply(p,j)}}return function(){return u.apply(p,arguments)}}function A(u,p,y){return A=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?w:x,A.apply(null,arguments)}function O(u,p){var y=Array.prototype.slice.call(arguments,1);return function(){var T=y.slice();return T.push.apply(T,arguments),u.apply(this,T)}}function W(u,p){function y(){}y.prototype=p.prototype,u.aa=p.prototype,u.prototype=new y,u.prototype.constructor=u,u.Qb=function(T,j,z){for(var ee=Array(arguments.length-2),ze=2;ze<arguments.length;ze++)ee[ze-2]=arguments[ze];return p.prototype[j].apply(T,ee)}}function q(u){const p=u.length;if(0<p){const y=Array(p);for(let T=0;T<p;T++)y[T]=u[T];return y}return[]}function $(u,p){for(let y=1;y<arguments.length;y++){const T=arguments[y];if(g(T)){const j=u.length||0,z=T.length||0;u.length=j+z;for(let ee=0;ee<z;ee++)u[j+ee]=T[ee]}else u.push(T)}}class he{constructor(p,y){this.i=p,this.j=y,this.h=0,this.g=null}get(){let p;return 0<this.h?(this.h--,p=this.g,this.g=p.next,p.next=null):p=this.i(),p}}function M(u){return/^[\s\xa0]*$/.test(u)}function J(){var u=f.navigator;return u&&(u=u.userAgent)?u:""}function re(u){return re[" "](u),u}re[" "]=function(){};var Ce=J().indexOf("Gecko")!=-1&&!(J().toLowerCase().indexOf("webkit")!=-1&&J().indexOf("Edge")==-1)&&!(J().indexOf("Trident")!=-1||J().indexOf("MSIE")!=-1)&&J().indexOf("Edge")==-1;function Ee(u,p,y){for(const T in u)p.call(y,u[T],T,u)}function D(u,p){for(const y in u)p.call(void 0,u[y],y,u)}function S(u){const p={};for(const y in u)p[y]=u[y];return p}const C="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function P(u,p){let y,T;for(let j=1;j<arguments.length;j++){T=arguments[j];for(y in T)u[y]=T[y];for(let z=0;z<C.length;z++)y=C[z],Object.prototype.hasOwnProperty.call(T,y)&&(u[y]=T[y])}}function N(u){var p=1;u=u.split(":");const y=[];for(;0<p&&u.length;)y.push(u.shift()),p--;return u.length&&y.push(u.join(":")),y}function L(u){f.setTimeout(()=>{throw u},0)}function R(){var u=pe;let p=null;return u.g&&(p=u.g,u.g=u.g.next,u.g||(u.h=null),p.next=null),p}class lt{constructor(){this.h=this.g=null}add(p,y){const T=Mt.get();T.set(p,y),this.h?this.h.next=T:this.g=T,this.h=T}}var Mt=new he(()=>new jt,u=>u.reset());class jt{constructor(){this.next=this.g=this.h=null}set(p,y){this.h=p,this.g=y,this.next=null}reset(){this.next=this.g=this.h=null}}let $e,te=!1,pe=new lt,oe=()=>{const u=f.Promise.resolve(void 0);$e=()=>{u.then(V)}};var V=()=>{for(var u;u=R();){try{u.h.call(u.g)}catch(y){L(y)}var p=Mt;p.j(u),100>p.h&&(p.h++,u.next=p.g,p.g=u)}te=!1};function K(){this.s=this.s,this.C=this.C}K.prototype.s=!1,K.prototype.ma=function(){this.s||(this.s=!0,this.N())},K.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function de(u,p){this.type=u,this.g=this.target=p,this.defaultPrevented=!1}de.prototype.h=function(){this.defaultPrevented=!0};var Se=(function(){if(!f.addEventListener||!Object.defineProperty)return!1;var u=!1,p=Object.defineProperty({},"passive",{get:function(){u=!0}});try{const y=()=>{};f.addEventListener("test",y,p),f.removeEventListener("test",y,p)}catch{}return u})();function Ae(u,p){if(de.call(this,u?u.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,u){var y=this.type=u.type,T=u.changedTouches&&u.changedTouches.length?u.changedTouches[0]:null;if(this.target=u.target||u.srcElement,this.g=p,p=u.relatedTarget){if(Ce){e:{try{re(p.nodeName);var j=!0;break e}catch{}j=!1}j||(p=null)}}else y=="mouseover"?p=u.fromElement:y=="mouseout"&&(p=u.toElement);this.relatedTarget=p,T?(this.clientX=T.clientX!==void 0?T.clientX:T.pageX,this.clientY=T.clientY!==void 0?T.clientY:T.pageY,this.screenX=T.screenX||0,this.screenY=T.screenY||0):(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0),this.button=u.button,this.key=u.key||"",this.ctrlKey=u.ctrlKey,this.altKey=u.altKey,this.shiftKey=u.shiftKey,this.metaKey=u.metaKey,this.pointerId=u.pointerId||0,this.pointerType=typeof u.pointerType=="string"?u.pointerType:Ne[u.pointerType]||"",this.state=u.state,this.i=u,u.defaultPrevented&&Ae.aa.h.call(this)}}W(Ae,de);var Ne={2:"touch",3:"pen",4:"mouse"};Ae.prototype.h=function(){Ae.aa.h.call(this);var u=this.i;u.preventDefault?u.preventDefault():u.returnValue=!1};var je="closure_listenable_"+(1e6*Math.random()|0),Fe=0;function He(u,p,y,T,j){this.listener=u,this.proxy=null,this.src=p,this.type=y,this.capture=!!T,this.ha=j,this.key=++Fe,this.da=this.fa=!1}function St(u){u.da=!0,u.listener=null,u.proxy=null,u.src=null,u.ha=null}function Er(u){this.src=u,this.g={},this.h=0}Er.prototype.add=function(u,p,y,T,j){var z=u.toString();u=this.g[z],u||(u=this.g[z]=[],this.h++);var ee=qr(u,p,T,j);return-1<ee?(p=u[ee],y||(p.fa=!1)):(p=new He(p,this.src,z,!!T,j),p.fa=y,u.push(p)),p};function Ns(u,p){var y=p.type;if(y in u.g){var T=u.g[y],j=Array.prototype.indexOf.call(T,p,void 0),z;(z=0<=j)&&Array.prototype.splice.call(T,j,1),z&&(St(p),u.g[y].length==0&&(delete u.g[y],u.h--))}}function qr(u,p,y,T){for(var j=0;j<u.length;++j){var z=u[j];if(!z.da&&z.listener==p&&z.capture==!!y&&z.ha==T)return j}return-1}var Wi="closure_lm_"+(1e6*Math.random()|0),Os={};function Qo(u,p,y,T,j){if(Array.isArray(p)){for(var z=0;z<p.length;z++)Qo(u,p[z],y,T,j);return null}return y=Jo(y),u&&u[je]?u.K(p,y,_(T)?!!T.capture:!1,j):Xo(u,p,y,!1,T,j)}function Xo(u,p,y,T,j,z){if(!p)throw Error("Invalid event type");var ee=_(j)?!!j.capture:!!j,ze=Ls(u);if(ze||(u[Wi]=ze=new Er(u)),y=ze.add(p,y,T,ee,z),y.proxy)return y;if(T=kl(),y.proxy=T,T.src=u,T.listener=y,u.addEventListener)Se||(j=ee),j===void 0&&(j=!1),u.addEventListener(p.toString(),T,j);else if(u.attachEvent)u.attachEvent(Tr(p.toString()),T);else if(u.addListener&&u.removeListener)u.addListener(T);else throw Error("addEventListener and attachEvent are unavailable.");return y}function kl(){function u(y){return p.call(u.src,u.listener,y)}const p=Yo;return u}function Vs(u,p,y,T,j){if(Array.isArray(p))for(var z=0;z<p.length;z++)Vs(u,p[z],y,T,j);else T=_(T)?!!T.capture:!!T,y=Jo(y),u&&u[je]?(u=u.i,p=String(p).toString(),p in u.g&&(z=u.g[p],y=qr(z,y,T,j),-1<y&&(St(z[y]),Array.prototype.splice.call(z,y,1),z.length==0&&(delete u.g[p],u.h--)))):u&&(u=Ls(u))&&(p=u.g[p.toString()],u=-1,p&&(u=qr(p,y,T,j)),(y=-1<u?p[u]:null)&&wr(y))}function wr(u){if(typeof u!="number"&&u&&!u.da){var p=u.src;if(p&&p[je])Ns(p.i,u);else{var y=u.type,T=u.proxy;p.removeEventListener?p.removeEventListener(y,T,u.capture):p.detachEvent?p.detachEvent(Tr(y),T):p.addListener&&p.removeListener&&p.removeListener(T),(y=Ls(p))?(Ns(y,u),y.h==0&&(y.src=null,p[Wi]=null)):St(u)}}}function Tr(u){return u in Os?Os[u]:Os[u]="on"+u}function Yo(u,p){if(u.da)u=!0;else{p=new Ae(p,this);var y=u.listener,T=u.ha||u.src;u.fa&&wr(u),u=y.call(T,p)}return u}function Ls(u){return u=u[Wi],u instanceof Er?u:null}var Ms="__closure_events_fn_"+(1e9*Math.random()>>>0);function Jo(u){return typeof u=="function"?u:(u[Ms]||(u[Ms]=function(p){return u.handleEvent(p)}),u[Ms])}function _t(){K.call(this),this.i=new Er(this),this.M=this,this.F=null}W(_t,K),_t.prototype[je]=!0,_t.prototype.removeEventListener=function(u,p,y,T){Vs(this,u,p,y,T)};function vt(u,p){var y,T=u.F;if(T)for(y=[];T;T=T.F)y.push(T);if(u=u.M,T=p.type||p,typeof p=="string")p=new de(p,u);else if(p instanceof de)p.target=p.target||u;else{var j=p;p=new de(T,u),P(p,j)}if(j=!0,y)for(var z=y.length-1;0<=z;z--){var ee=p.g=y[z];j=Ir(ee,T,!0,p)&&j}if(ee=p.g=u,j=Ir(ee,T,!0,p)&&j,j=Ir(ee,T,!1,p)&&j,y)for(z=0;z<y.length;z++)ee=p.g=y[z],j=Ir(ee,T,!1,p)&&j}_t.prototype.N=function(){if(_t.aa.N.call(this),this.i){var u=this.i,p;for(p in u.g){for(var y=u.g[p],T=0;T<y.length;T++)St(y[T]);delete u.g[p],u.h--}}this.F=null},_t.prototype.K=function(u,p,y,T){return this.i.add(String(u),p,!1,y,T)},_t.prototype.L=function(u,p,y,T){return this.i.add(String(u),p,!0,y,T)};function Ir(u,p,y,T){if(p=u.i.g[String(p)],!p)return!0;p=p.concat();for(var j=!0,z=0;z<p.length;++z){var ee=p[z];if(ee&&!ee.da&&ee.capture==y){var ze=ee.listener,Et=ee.ha||ee.src;ee.fa&&Ns(u.i,ee),j=ze.call(Et,T)!==!1&&j}}return j&&!T.defaultPrevented}function Zo(u,p,y){if(typeof u=="function")y&&(u=A(u,y));else if(u&&typeof u.handleEvent=="function")u=A(u.handleEvent,u);else throw Error("Invalid listener argument");return 2147483647<Number(p)?-1:f.setTimeout(u,p||0)}function Gr(u){u.g=Zo(()=>{u.g=null,u.i&&(u.i=!1,Gr(u))},u.l);const p=u.h;u.h=null,u.m.apply(null,p)}class Hi extends K{constructor(p,y){super(),this.m=p,this.l=y,this.h=null,this.i=!1,this.g=null}j(p){this.h=arguments,this.g?this.i=!0:Gr(this)}N(){super.N(),this.g&&(f.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function qi(u){K.call(this),this.h=u,this.g={}}W(qi,K);var ea=[];function ta(u){Ee(u.g,function(p,y){this.g.hasOwnProperty(y)&&wr(p)},u),u.g={}}qi.prototype.N=function(){qi.aa.N.call(this),ta(this)},qi.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var na=f.JSON.stringify,ra=f.JSON.parse,ia=class{stringify(u){return f.JSON.stringify(u,void 0)}parse(u){return f.JSON.parse(u,void 0)}};function Gi(){}Gi.prototype.h=null;function js(u){return u.h||(u.h=u.i())}function Fs(){}var En={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Yn(){de.call(this,"d")}W(Yn,de);function Us(){de.call(this,"c")}W(Us,de);var Jn={},sa=null;function Ki(){return sa=sa||new _t}Jn.La="serverreachability";function oa(u){de.call(this,Jn.La,u)}W(oa,de);function Sr(u){const p=Ki();vt(p,new oa(p))}Jn.STAT_EVENT="statevent";function aa(u,p){de.call(this,Jn.STAT_EVENT,u),this.stat=p}W(aa,de);function ut(u){const p=Ki();vt(p,new aa(p,u))}Jn.Ma="timingevent";function Bs(u,p){de.call(this,Jn.Ma,u),this.size=p}W(Bs,de);function bn(u,p){if(typeof u!="function")throw Error("Fn must not be null and must be a function");return f.setTimeout(function(){u()},p)}function Qi(){this.g=!0}Qi.prototype.xa=function(){this.g=!1};function Xi(u,p,y,T,j,z){u.info(function(){if(u.g)if(z)for(var ee="",ze=z.split("&"),Et=0;Et<ze.length;Et++){var Oe=ze[Et].split("=");if(1<Oe.length){var xt=Oe[0];Oe=Oe[1];var ft=xt.split("_");ee=2<=ft.length&&ft[1]=="type"?ee+(xt+"="+Oe+"&"):ee+(xt+"=redacted&")}}else ee=null;else ee=z;return"XMLHTTP REQ ("+T+") [attempt "+j+"]: "+p+`
`+y+`
`+ee})}function zs(u,p,y,T,j,z,ee){u.info(function(){return"XMLHTTP RESP ("+T+") [ attempt "+j+"]: "+p+`
`+y+`
`+z+" "+ee})}function Dn(u,p,y,T){u.info(function(){return"XMLHTTP TEXT ("+p+"): "+Jc(u,y)+(T?" "+T:"")})}function la(u,p){u.info(function(){return"TIMEOUT: "+p})}Qi.prototype.info=function(){};function Jc(u,p){if(!u.g)return p;if(!p)return null;try{var y=JSON.parse(p);if(y){for(u=0;u<y.length;u++)if(Array.isArray(y[u])){var T=y[u];if(!(2>T.length)){var j=T[1];if(Array.isArray(j)&&!(1>j.length)){var z=j[0];if(z!="noop"&&z!="stop"&&z!="close")for(var ee=1;ee<j.length;ee++)j[ee]=""}}}}return na(y)}catch{return p}}var $s={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Pl={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Nn;function Yi(){}W(Yi,Gi),Yi.prototype.g=function(){return new XMLHttpRequest},Yi.prototype.i=function(){return{}},Nn=new Yi;function On(u,p,y,T){this.j=u,this.i=p,this.l=y,this.R=T||1,this.U=new qi(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new bl}function bl(){this.i=null,this.g="",this.h=!1}var ua={},Ws={};function Hs(u,p,y){u.L=1,u.v=Jr(hn(p)),u.m=y,u.P=!0,ca(u,null)}function ca(u,p){u.F=Date.now(),qe(u),u.A=hn(u.v);var y=u.A,T=u.R;Array.isArray(T)||(T=[String(T)]),ei(y.i,"t",T),u.C=0,y=u.j.J,u.h=new bl,u.g=Ql(u.j,y?p:null,!u.m),0<u.O&&(u.M=new Hi(A(u.Y,u,u.g),u.O)),p=u.U,y=u.g,T=u.ca;var j="readystatechange";Array.isArray(j)||(j&&(ea[0]=j.toString()),j=ea);for(var z=0;z<j.length;z++){var ee=Qo(y,j[z],T||p.handleEvent,!1,p.h||p);if(!ee)break;p.g[ee.key]=ee}p=u.H?S(u.H):{},u.m?(u.u||(u.u="POST"),p["Content-Type"]="application/x-www-form-urlencoded",u.g.ea(u.A,u.u,u.m,p)):(u.u="GET",u.g.ea(u.A,u.u,null,p)),Sr(),Xi(u.i,u.u,u.A,u.l,u.R,u.m)}On.prototype.ca=function(u){u=u.target;const p=this.M;p&&Zt(u)==3?p.j():this.Y(u)},On.prototype.Y=function(u){try{if(u==this.g)e:{const ft=Zt(this.g);var p=this.g.Ba();const In=this.g.Z();if(!(3>ft)&&(ft!=3||this.g&&(this.h.h||this.g.oa()||ga(this.g)))){this.J||ft!=4||p==7||(p==8||0>=In?Sr(3):Sr(2)),Ji(this);var y=this.g.Z();this.X=y;t:if(Dl(this)){var T=ga(this.g);u="";var j=T.length,z=Zt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){wn(this),Kr(this);var ee="";break t}this.h.i=new f.TextDecoder}for(p=0;p<j;p++)this.h.h=!0,u+=this.h.i.decode(T[p],{stream:!(z&&p==j-1)});T.length=0,this.h.g+=u,this.C=0,ee=this.h.g}else ee=this.g.oa();if(this.o=y==200,zs(this.i,this.u,this.A,this.l,this.R,ft,y),this.o){if(this.T&&!this.K){t:{if(this.g){var ze,Et=this.g;if((ze=Et.g?Et.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!M(ze)){var Oe=ze;break t}}Oe=null}if(y=Oe)Dn(this.i,this.l,y,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,ha(this,y);else{this.o=!1,this.s=3,ut(12),wn(this),Kr(this);break e}}if(this.P){y=!0;let fn;for(;!this.J&&this.C<ee.length;)if(fn=Zc(this,ee),fn==Ws){ft==4&&(this.s=4,ut(14),y=!1),Dn(this.i,this.l,null,"[Incomplete Response]");break}else if(fn==ua){this.s=4,ut(15),Dn(this.i,this.l,ee,"[Invalid Chunk]"),y=!1;break}else Dn(this.i,this.l,fn,null),ha(this,fn);if(Dl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ft!=4||ee.length!=0||this.h.h||(this.s=1,ut(16),y=!1),this.o=this.o&&y,!y)Dn(this.i,this.l,ee,"[Invalid Chunked Response]"),wn(this),Kr(this);else if(0<ee.length&&!this.W){this.W=!0;var xt=this.j;xt.g==this&&xt.ba&&!xt.M&&(xt.j.info("Great, no buffering proxy detected. Bytes received: "+ee.length),_a(xt),xt.M=!0,ut(11))}}else Dn(this.i,this.l,ee,null),ha(this,ee);ft==4&&wn(this),this.o&&!this.J&&(ft==4?no(this.j,this):(this.o=!1,qe(this)))}else Ys(this.g),y==400&&0<ee.indexOf("Unknown SID")?(this.s=3,ut(12)):(this.s=0,ut(13)),wn(this),Kr(this)}}}catch{}finally{}};function Dl(u){return u.g?u.u=="GET"&&u.L!=2&&u.j.Ca:!1}function Zc(u,p){var y=u.C,T=p.indexOf(`
`,y);return T==-1?Ws:(y=Number(p.substring(y,T)),isNaN(y)?ua:(T+=1,T+y>p.length?Ws:(p=p.slice(T,T+y),u.C=T+y,p)))}On.prototype.cancel=function(){this.J=!0,wn(this)};function qe(u){u.S=Date.now()+u.I,Nl(u,u.I)}function Nl(u,p){if(u.B!=null)throw Error("WatchDog timer not null");u.B=bn(A(u.ba,u),p)}function Ji(u){u.B&&(f.clearTimeout(u.B),u.B=null)}On.prototype.ba=function(){this.B=null;const u=Date.now();0<=u-this.S?(la(this.i,this.A),this.L!=2&&(Sr(),ut(17)),wn(this),this.s=2,Kr(this)):Nl(this,this.S-u)};function Kr(u){u.j.G==0||u.J||no(u.j,u)}function wn(u){Ji(u);var p=u.M;p&&typeof p.ma=="function"&&p.ma(),u.M=null,ta(u.U),u.g&&(p=u.g,u.g=null,p.abort(),p.ma())}function ha(u,p){try{var y=u.j;if(y.G!=0&&(y.g==u||Gt(y.h,u))){if(!u.K&&Gt(y.h,u)&&y.G==3){try{var T=y.Da.g.parse(p)}catch{T=null}if(Array.isArray(T)&&T.length==3){var j=T;if(j[0]==0){e:if(!y.u){if(y.g)if(y.g.F+3e3<u.F)to(y),Fn(y);else break e;eo(y),ut(18)}}else y.za=j[1],0<y.za-y.T&&37500>j[2]&&y.F&&y.v==0&&!y.C&&(y.C=bn(A(y.Za,y),6e3));if(1>=Vl(y.h)&&y.ca){try{y.ca()}catch{}y.ca=void 0}}else kr(y,11)}else if((u.K||y.g==u)&&to(y),!M(p))for(j=y.Da.g.parse(p),p=0;p<j.length;p++){let Oe=j[p];if(y.T=Oe[0],Oe=Oe[1],y.G==2)if(Oe[0]=="c"){y.K=Oe[1],y.ia=Oe[2];const xt=Oe[3];xt!=null&&(y.la=xt,y.j.info("VER="+y.la));const ft=Oe[4];ft!=null&&(y.Aa=ft,y.j.info("SVER="+y.Aa));const In=Oe[5];In!=null&&typeof In=="number"&&0<In&&(T=1.5*In,y.L=T,y.j.info("backChannelRequestTimeoutMs_="+T)),T=y;const fn=u.g;if(fn){const ss=fn.g?fn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ss){var z=T.h;z.g||ss.indexOf("spdy")==-1&&ss.indexOf("quic")==-1&&ss.indexOf("h2")==-1||(z.j=z.l,z.g=new Set,z.h&&(da(z,z.h),z.h=null))}if(T.D){const io=fn.g?fn.g.getResponseHeader("X-HTTP-Session-Id"):null;io&&(T.ya=io,We(T.I,T.D,io))}}y.G=3,y.l&&y.l.ua(),y.ba&&(y.R=Date.now()-u.F,y.j.info("Handshake RTT: "+y.R+"ms")),T=y;var ee=u;if(T.qa=Kl(T,T.J?T.ia:null,T.W),ee.K){Ll(T.h,ee);var ze=ee,Et=T.L;Et&&(ze.I=Et),ze.B&&(Ji(ze),qe(ze)),T.g=ee}else is(T);0<y.i.length&&nr(y)}else Oe[0]!="stop"&&Oe[0]!="close"||kr(y,7);else y.G==3&&(Oe[0]=="stop"||Oe[0]=="close"?Oe[0]=="stop"?kr(y,7):bt(y):Oe[0]!="noop"&&y.l&&y.l.ta(Oe),y.v=0)}}Sr(4)}catch{}}var Ol=class{constructor(u,p){this.g=u,this.map=p}};function Zi(u){this.l=u||10,f.PerformanceNavigationTiming?(u=f.performance.getEntriesByType("navigation"),u=0<u.length&&(u[0].nextHopProtocol=="hq"||u[0].nextHopProtocol=="h2")):u=!!(f.chrome&&f.chrome.loadTimes&&f.chrome.loadTimes()&&f.chrome.loadTimes().wasFetchedViaSpdy),this.j=u?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function cn(u){return u.h?!0:u.g?u.g.size>=u.j:!1}function Vl(u){return u.h?1:u.g?u.g.size:0}function Gt(u,p){return u.h?u.h==p:u.g?u.g.has(p):!1}function da(u,p){u.g?u.g.add(p):u.h=p}function Ll(u,p){u.h&&u.h==p?u.h=null:u.g&&u.g.has(p)&&u.g.delete(p)}Zi.prototype.cancel=function(){if(this.i=Ml(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const u of this.g.values())u.cancel();this.g.clear()}};function Ml(u){if(u.h!=null)return u.i.concat(u.h.D);if(u.g!=null&&u.g.size!==0){let p=u.i;for(const y of u.g.values())p=p.concat(y.D);return p}return q(u.i)}function qs(u){if(u.V&&typeof u.V=="function")return u.V();if(typeof Map<"u"&&u instanceof Map||typeof Set<"u"&&u instanceof Set)return Array.from(u.values());if(typeof u=="string")return u.split("");if(g(u)){for(var p=[],y=u.length,T=0;T<y;T++)p.push(u[T]);return p}p=[],y=0;for(T in u)p[y++]=u[T];return p}function Gs(u){if(u.na&&typeof u.na=="function")return u.na();if(!u.V||typeof u.V!="function"){if(typeof Map<"u"&&u instanceof Map)return Array.from(u.keys());if(!(typeof Set<"u"&&u instanceof Set)){if(g(u)||typeof u=="string"){var p=[];u=u.length;for(var y=0;y<u;y++)p.push(y);return p}p=[],y=0;for(const T in u)p[y++]=T;return p}}}function Qr(u,p){if(u.forEach&&typeof u.forEach=="function")u.forEach(p,void 0);else if(g(u)||typeof u=="string")Array.prototype.forEach.call(u,p,void 0);else for(var y=Gs(u),T=qs(u),j=T.length,z=0;z<j;z++)p.call(void 0,T[z],y&&y[z],u)}var es=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function eh(u,p){if(u){u=u.split("&");for(var y=0;y<u.length;y++){var T=u[y].indexOf("="),j=null;if(0<=T){var z=u[y].substring(0,T);j=u[y].substring(T+1)}else z=u[y];p(z,j?decodeURIComponent(j.replace(/\+/g," ")):"")}}}function xr(u){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,u instanceof xr){this.h=u.h,ts(this,u.j),this.o=u.o,this.g=u.g,Xr(this,u.s),this.l=u.l;var p=u.i,y=new Zn;y.i=p.i,p.g&&(y.g=new Map(p.g),y.h=p.h),Yr(this,y),this.m=u.m}else u&&(p=String(u).match(es))?(this.h=!1,ts(this,p[1]||"",!0),this.o=be(p[2]||""),this.g=be(p[3]||"",!0),Xr(this,p[4]),this.l=be(p[5]||"",!0),Yr(this,p[6]||"",!0),this.m=be(p[7]||"")):(this.h=!1,this.i=new Zn(null,this.h))}xr.prototype.toString=function(){var u=[],p=this.j;p&&u.push(Zr(p,Ks,!0),":");var y=this.g;return(y||p=="file")&&(u.push("//"),(p=this.o)&&u.push(Zr(p,Ks,!0),"@"),u.push(encodeURIComponent(String(y)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),y=this.s,y!=null&&u.push(":",String(y))),(y=this.l)&&(this.g&&y.charAt(0)!="/"&&u.push("/"),u.push(Zr(y,y.charAt(0)=="/"?Ul:Fl,!0))),(y=this.i.toString())&&u.push("?",y),(y=this.m)&&u.push("#",Zr(y,fa)),u.join("")};function hn(u){return new xr(u)}function ts(u,p,y){u.j=y?be(p,!0):p,u.j&&(u.j=u.j.replace(/:$/,""))}function Xr(u,p){if(p){if(p=Number(p),isNaN(p)||0>p)throw Error("Bad port number "+p);u.s=p}else u.s=null}function Yr(u,p,y){p instanceof Zn?(u.i=p,er(u.i,u.h)):(y||(p=Zr(p,Bl)),u.i=new Zn(p,u.h))}function We(u,p,y){u.i.set(p,y)}function Jr(u){return We(u,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),u}function be(u,p){return u?p?decodeURI(u.replace(/%25/g,"%2525")):decodeURIComponent(u):""}function Zr(u,p,y){return typeof u=="string"?(u=encodeURI(u).replace(p,jl),y&&(u=u.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u):null}function jl(u){return u=u.charCodeAt(0),"%"+(u>>4&15).toString(16)+(u&15).toString(16)}var Ks=/[#\/\?@]/g,Fl=/[#\?:]/g,Ul=/[#\?]/g,Bl=/[#\?@]/g,fa=/#/g;function Zn(u,p){this.h=this.g=null,this.i=u||null,this.j=!!p}function Pt(u){u.g||(u.g=new Map,u.h=0,u.i&&eh(u.i,function(p,y){u.add(decodeURIComponent(p.replace(/\+/g," ")),y)}))}r=Zn.prototype,r.add=function(u,p){Pt(this),this.i=null,u=Tn(this,u);var y=this.g.get(u);return y||this.g.set(u,y=[]),y.push(p),this.h+=1,this};function Vn(u,p){Pt(u),p=Tn(u,p),u.g.has(p)&&(u.i=null,u.h-=u.g.get(p).length,u.g.delete(p))}function Ln(u,p){return Pt(u),p=Tn(u,p),u.g.has(p)}r.forEach=function(u,p){Pt(this),this.g.forEach(function(y,T){y.forEach(function(j){u.call(p,j,T,this)},this)},this)},r.na=function(){Pt(this);const u=Array.from(this.g.values()),p=Array.from(this.g.keys()),y=[];for(let T=0;T<p.length;T++){const j=u[T];for(let z=0;z<j.length;z++)y.push(p[T])}return y},r.V=function(u){Pt(this);let p=[];if(typeof u=="string")Ln(this,u)&&(p=p.concat(this.g.get(Tn(this,u))));else{u=Array.from(this.g.values());for(let y=0;y<u.length;y++)p=p.concat(u[y])}return p},r.set=function(u,p){return Pt(this),this.i=null,u=Tn(this,u),Ln(this,u)&&(this.h-=this.g.get(u).length),this.g.set(u,[p]),this.h+=1,this},r.get=function(u,p){return u?(u=this.V(u),0<u.length?String(u[0]):p):p};function ei(u,p,y){Vn(u,p),0<y.length&&(u.i=null,u.g.set(Tn(u,p),q(y)),u.h+=y.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const u=[],p=Array.from(this.g.keys());for(var y=0;y<p.length;y++){var T=p[y];const z=encodeURIComponent(String(T)),ee=this.V(T);for(T=0;T<ee.length;T++){var j=z;ee[T]!==""&&(j+="="+encodeURIComponent(String(ee[T]))),u.push(j)}}return this.i=u.join("&")};function Tn(u,p){return p=String(p),u.j&&(p=p.toLowerCase()),p}function er(u,p){p&&!u.j&&(Pt(u),u.i=null,u.g.forEach(function(y,T){var j=T.toLowerCase();T!=j&&(Vn(this,T),ei(this,j,y))},u)),u.j=p}function th(u,p){const y=new Qi;if(f.Image){const T=new Image;T.onload=O(Jt,y,"TestLoadImage: loaded",!0,p,T),T.onerror=O(Jt,y,"TestLoadImage: error",!1,p,T),T.onabort=O(Jt,y,"TestLoadImage: abort",!1,p,T),T.ontimeout=O(Jt,y,"TestLoadImage: timeout",!1,p,T),f.setTimeout(function(){T.ontimeout&&T.ontimeout()},1e4),T.src=u}else p(!1)}function zl(u,p){const y=new Qi,T=new AbortController,j=setTimeout(()=>{T.abort(),Jt(y,"TestPingServer: timeout",!1,p)},1e4);fetch(u,{signal:T.signal}).then(z=>{clearTimeout(j),z.ok?Jt(y,"TestPingServer: ok",!0,p):Jt(y,"TestPingServer: server error",!1,p)}).catch(()=>{clearTimeout(j),Jt(y,"TestPingServer: error",!1,p)})}function Jt(u,p,y,T,j){try{j&&(j.onload=null,j.onerror=null,j.onabort=null,j.ontimeout=null),T(y)}catch{}}function nh(){this.g=new ia}function $l(u,p,y){const T=y||"";try{Qr(u,function(j,z){let ee=j;_(j)&&(ee=na(j)),p.push(T+z+"="+encodeURIComponent(ee))})}catch(j){throw p.push(T+"type="+encodeURIComponent("_badmap")),j}}function Ar(u){this.l=u.Ub||null,this.j=u.eb||!1}W(Ar,Gi),Ar.prototype.g=function(){return new ns(this.l,this.j)},Ar.prototype.i=(function(u){return function(){return u}})({});function ns(u,p){_t.call(this),this.D=u,this.o=p,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}W(ns,_t),r=ns.prototype,r.open=function(u,p){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=u,this.A=p,this.readyState=1,jn(this)},r.send=function(u){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const p={headers:this.u,method:this.B,credentials:this.m,cache:void 0};u&&(p.body=u),(this.D||f).fetch(new Request(this.A,p)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Mn(this)),this.readyState=0},r.Sa=function(u){if(this.g&&(this.l=u,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=u.headers,this.readyState=2,jn(this)),this.g&&(this.readyState=3,jn(this),this.g)))if(this.responseType==="arraybuffer")u.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof f.ReadableStream<"u"&&"body"in u){if(this.j=u.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Wl(this)}else u.text().then(this.Ra.bind(this),this.ga.bind(this))};function Wl(u){u.j.read().then(u.Pa.bind(u)).catch(u.ga.bind(u))}r.Pa=function(u){if(this.g){if(this.o&&u.value)this.response.push(u.value);else if(!this.o){var p=u.value?u.value:new Uint8Array(0);(p=this.v.decode(p,{stream:!u.done}))&&(this.response=this.responseText+=p)}u.done?Mn(this):jn(this),this.readyState==3&&Wl(this)}},r.Ra=function(u){this.g&&(this.response=this.responseText=u,Mn(this))},r.Qa=function(u){this.g&&(this.response=u,Mn(this))},r.ga=function(){this.g&&Mn(this)};function Mn(u){u.readyState=4,u.l=null,u.j=null,u.v=null,jn(u)}r.setRequestHeader=function(u,p){this.u.append(u,p)},r.getResponseHeader=function(u){return this.h&&this.h.get(u.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const u=[],p=this.h.entries();for(var y=p.next();!y.done;)y=y.value,u.push(y[0]+": "+y[1]),y=p.next();return u.join(`\r
`)};function jn(u){u.onreadystatechange&&u.onreadystatechange.call(u)}Object.defineProperty(ns.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(u){this.m=u?"include":"same-origin"}});function Rr(u){let p="";return Ee(u,function(y,T){p+=T,p+=":",p+=y,p+=`\r
`}),p}function ti(u,p,y){e:{for(T in y){var T=!1;break e}T=!0}T||(y=Rr(y),typeof u=="string"?y!=null&&encodeURIComponent(String(y)):We(u,p,y))}function Ze(u){_t.call(this),this.headers=new Map,this.o=u||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}W(Ze,_t);var rh=/^https?$/i,pa=["POST","PUT"];r=Ze.prototype,r.Ha=function(u){this.J=u},r.ea=function(u,p,y,T){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+u);p=p?p.toUpperCase():"GET",this.D=u,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Nn.g(),this.v=this.o?js(this.o):js(Nn),this.g.onreadystatechange=A(this.Ea,this);try{this.B=!0,this.g.open(p,String(u),!0),this.B=!1}catch(z){rs(this,z);return}if(u=y||"",y=new Map(this.headers),T)if(Object.getPrototypeOf(T)===Object.prototype)for(var j in T)y.set(j,T[j]);else if(typeof T.keys=="function"&&typeof T.get=="function")for(const z of T.keys())y.set(z,T.get(z));else throw Error("Unknown input type for opt_headers: "+String(T));T=Array.from(y.keys()).find(z=>z.toLowerCase()=="content-type"),j=f.FormData&&u instanceof f.FormData,!(0<=Array.prototype.indexOf.call(pa,p,void 0))||T||j||y.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[z,ee]of y)this.g.setRequestHeader(z,ee);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Xs(this),this.u=!0,this.g.send(u),this.u=!1}catch(z){rs(this,z)}};function rs(u,p){u.h=!1,u.g&&(u.j=!0,u.g.abort(),u.j=!1),u.l=p,u.m=5,Qs(u),dn(u)}function Qs(u){u.A||(u.A=!0,vt(u,"complete"),vt(u,"error"))}r.abort=function(u){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=u||7,vt(this,"complete"),vt(this,"abort"),dn(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),dn(this,!0)),Ze.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?ma(this):this.bb())},r.bb=function(){ma(this)};function ma(u){if(u.h&&typeof h<"u"&&(!u.v[1]||Zt(u)!=4||u.Z()!=2)){if(u.u&&Zt(u)==4)Zo(u.Ea,0,u);else if(vt(u,"readystatechange"),Zt(u)==4){u.h=!1;try{const ee=u.Z();e:switch(ee){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var p=!0;break e;default:p=!1}var y;if(!(y=p)){var T;if(T=ee===0){var j=String(u.D).match(es)[1]||null;!j&&f.self&&f.self.location&&(j=f.self.location.protocol.slice(0,-1)),T=!rh.test(j?j.toLowerCase():"")}y=T}if(y)vt(u,"complete"),vt(u,"success");else{u.m=6;try{var z=2<Zt(u)?u.g.statusText:""}catch{z=""}u.l=z+" ["+u.Z()+"]",Qs(u)}}finally{dn(u)}}}}function dn(u,p){if(u.g){Xs(u);const y=u.g,T=u.v[0]?()=>{}:null;u.g=null,u.v=null,p||vt(u,"ready");try{y.onreadystatechange=T}catch{}}}function Xs(u){u.I&&(f.clearTimeout(u.I),u.I=null)}r.isActive=function(){return!!this.g};function Zt(u){return u.g?u.g.readyState:0}r.Z=function(){try{return 2<Zt(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(u){if(this.g){var p=this.g.responseText;return u&&p.indexOf(u)==0&&(p=p.substring(u.length)),ra(p)}};function ga(u){try{if(!u.g)return null;if("response"in u.g)return u.g.response;switch(u.H){case"":case"text":return u.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in u.g)return u.g.mozResponseArrayBuffer}return null}catch{return null}}function Ys(u){const p={};u=(u.g&&2<=Zt(u)&&u.g.getAllResponseHeaders()||"").split(`\r
`);for(let T=0;T<u.length;T++){if(M(u[T]))continue;var y=N(u[T]);const j=y[0];if(y=y[1],typeof y!="string")continue;y=y.trim();const z=p[j]||[];p[j]=z,z.push(y)}D(p,function(T){return T.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function tr(u,p,y){return y&&y.internalChannelParams&&y.internalChannelParams[u]||p}function ya(u){this.Aa=0,this.i=[],this.j=new Qi,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=tr("failFast",!1,u),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=tr("baseRetryDelayMs",5e3,u),this.cb=tr("retryDelaySeedMs",1e4,u),this.Wa=tr("forwardChannelMaxRetries",2,u),this.wa=tr("forwardChannelRequestTimeoutMs",2e4,u),this.pa=u&&u.xmlHttpFactory||void 0,this.Xa=u&&u.Tb||void 0,this.Ca=u&&u.useFetchStreams||!1,this.L=void 0,this.J=u&&u.supportsCrossDomainXhr||!1,this.K="",this.h=new Zi(u&&u.concurrentRequestLimit),this.Da=new nh,this.P=u&&u.fastHandshake||!1,this.O=u&&u.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=u&&u.Rb||!1,u&&u.xa&&this.j.xa(),u&&u.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&u&&u.detectBufferingProxy||!1,this.ja=void 0,u&&u.longPollingTimeout&&0<u.longPollingTimeout&&(this.ja=u.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=ya.prototype,r.la=8,r.G=1,r.connect=function(u,p,y,T){ut(0),this.W=u,this.H=p||{},y&&T!==void 0&&(this.H.OSID=y,this.H.OAID=T),this.F=this.X,this.I=Kl(this,null,this.W),nr(this)};function bt(u){if(Js(u),u.G==3){var p=u.U++,y=hn(u.I);if(We(y,"SID",u.K),We(y,"RID",p),We(y,"TYPE","terminate"),Cr(u,y),p=new On(u,u.j,p),p.L=2,p.v=Jr(hn(y)),y=!1,f.navigator&&f.navigator.sendBeacon)try{y=f.navigator.sendBeacon(p.v.toString(),"")}catch{}!y&&f.Image&&(new Image().src=p.v,y=!0),y||(p.g=Ql(p.j,null),p.g.ea(p.v)),p.F=Date.now(),qe(p)}Gl(u)}function Fn(u){u.g&&(_a(u),u.g.cancel(),u.g=null)}function Js(u){Fn(u),u.u&&(f.clearTimeout(u.u),u.u=null),to(u),u.h.cancel(),u.s&&(typeof u.s=="number"&&f.clearTimeout(u.s),u.s=null)}function nr(u){if(!cn(u.h)&&!u.s){u.s=!0;var p=u.Ga;$e||oe(),te||($e(),te=!0),pe.add(p,u),u.B=0}}function ih(u,p){return Vl(u.h)>=u.h.j-(u.s?1:0)?!1:u.s?(u.i=p.D.concat(u.i),!0):u.G==1||u.G==2||u.B>=(u.Va?0:u.Wa)?!1:(u.s=bn(A(u.Ga,u,p),ql(u,u.B)),u.B++,!0)}r.Ga=function(u){if(this.s)if(this.s=null,this.G==1){if(!u){this.U=Math.floor(1e5*Math.random()),u=this.U++;const j=new On(this,this.j,u);let z=this.o;if(this.S&&(z?(z=S(z),P(z,this.S)):z=this.S),this.m!==null||this.O||(j.H=z,z=null),this.P)e:{for(var p=0,y=0;y<this.i.length;y++){t:{var T=this.i[y];if("__data__"in T.map&&(T=T.map.__data__,typeof T=="string")){T=T.length;break t}T=void 0}if(T===void 0)break;if(p+=T,4096<p){p=y;break e}if(p===4096||y===this.i.length-1){p=y+1;break e}}p=1e3}else p=1e3;p=ni(this,j,p),y=hn(this.I),We(y,"RID",u),We(y,"CVER",22),this.D&&We(y,"X-HTTP-Session-Id",this.D),Cr(this,y),z&&(this.O?p="headers="+encodeURIComponent(String(Rr(z)))+"&"+p:this.m&&ti(y,this.m,z)),da(this.h,j),this.Ua&&We(y,"TYPE","init"),this.P?(We(y,"$req",p),We(y,"SID","null"),j.T=!0,Hs(j,y,null)):Hs(j,y,p),this.G=2}}else this.G==3&&(u?Zs(this,u):this.i.length==0||cn(this.h)||Zs(this))};function Zs(u,p){var y;p?y=p.l:y=u.U++;const T=hn(u.I);We(T,"SID",u.K),We(T,"RID",y),We(T,"AID",u.T),Cr(u,T),u.m&&u.o&&ti(T,u.m,u.o),y=new On(u,u.j,y,u.B+1),u.m===null&&(y.H=u.o),p&&(u.i=p.D.concat(u.i)),p=ni(u,y,1e3),y.I=Math.round(.5*u.wa)+Math.round(.5*u.wa*Math.random()),da(u.h,y),Hs(y,T,p)}function Cr(u,p){u.H&&Ee(u.H,function(y,T){We(p,T,y)}),u.l&&Qr({},function(y,T){We(p,T,y)})}function ni(u,p,y){y=Math.min(u.i.length,y);var T=u.l?A(u.l.Na,u.l,u):null;e:{var j=u.i;let z=-1;for(;;){const ee=["count="+y];z==-1?0<y?(z=j[0].g,ee.push("ofs="+z)):z=0:ee.push("ofs="+z);let ze=!0;for(let Et=0;Et<y;Et++){let Oe=j[Et].g;const xt=j[Et].map;if(Oe-=z,0>Oe)z=Math.max(0,j[Et].g-100),ze=!1;else try{$l(xt,ee,"req"+Oe+"_")}catch{T&&T(xt)}}if(ze){T=ee.join("&");break e}}}return u=u.i.splice(0,y),p.D=u,T}function is(u){if(!u.g&&!u.u){u.Y=1;var p=u.Fa;$e||oe(),te||($e(),te=!0),pe.add(p,u),u.v=0}}function eo(u){return u.g||u.u||3<=u.v?!1:(u.Y++,u.u=bn(A(u.Fa,u),ql(u,u.v)),u.v++,!0)}r.Fa=function(){if(this.u=null,Hl(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var u=2*this.R;this.j.info("BP detection timer enabled: "+u),this.A=bn(A(this.ab,this),u)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,ut(10),Fn(this),Hl(this))};function _a(u){u.A!=null&&(f.clearTimeout(u.A),u.A=null)}function Hl(u){u.g=new On(u,u.j,"rpc",u.Y),u.m===null&&(u.g.H=u.o),u.g.O=0;var p=hn(u.qa);We(p,"RID","rpc"),We(p,"SID",u.K),We(p,"AID",u.T),We(p,"CI",u.F?"0":"1"),!u.F&&u.ja&&We(p,"TO",u.ja),We(p,"TYPE","xmlhttp"),Cr(u,p),u.m&&u.o&&ti(p,u.m,u.o),u.L&&(u.g.I=u.L);var y=u.g;u=u.ia,y.L=1,y.v=Jr(hn(p)),y.m=null,y.P=!0,ca(y,u)}r.Za=function(){this.C!=null&&(this.C=null,Fn(this),eo(this),ut(19))};function to(u){u.C!=null&&(f.clearTimeout(u.C),u.C=null)}function no(u,p){var y=null;if(u.g==p){to(u),_a(u),u.g=null;var T=2}else if(Gt(u.h,p))y=p.D,Ll(u.h,p),T=1;else return;if(u.G!=0){if(p.o)if(T==1){y=p.m?p.m.length:0,p=Date.now()-p.F;var j=u.B;T=Ki(),vt(T,new Bs(T,y)),nr(u)}else is(u);else if(j=p.s,j==3||j==0&&0<p.X||!(T==1&&ih(u,p)||T==2&&eo(u)))switch(y&&0<y.length&&(p=u.h,p.i=p.i.concat(y)),j){case 1:kr(u,5);break;case 4:kr(u,10);break;case 3:kr(u,6);break;default:kr(u,2)}}}function ql(u,p){let y=u.Ta+Math.floor(Math.random()*u.cb);return u.isActive()||(y*=2),y*p}function kr(u,p){if(u.j.info("Error code "+p),p==2){var y=A(u.fb,u),T=u.Xa;const j=!T;T=new xr(T||"//www.google.com/images/cleardot.gif"),f.location&&f.location.protocol=="http"||ts(T,"https"),Jr(T),j?th(T.toString(),y):zl(T.toString(),y)}else ut(2);u.G=0,u.l&&u.l.sa(p),Gl(u),Js(u)}r.fb=function(u){u?(this.j.info("Successfully pinged google.com"),ut(2)):(this.j.info("Failed to ping google.com"),ut(1))};function Gl(u){if(u.G=0,u.ka=[],u.l){const p=Ml(u.h);(p.length!=0||u.i.length!=0)&&($(u.ka,p),$(u.ka,u.i),u.h.i.length=0,q(u.i),u.i.length=0),u.l.ra()}}function Kl(u,p,y){var T=y instanceof xr?hn(y):new xr(y);if(T.g!="")p&&(T.g=p+"."+T.g),Xr(T,T.s);else{var j=f.location;T=j.protocol,p=p?p+"."+j.hostname:j.hostname,j=+j.port;var z=new xr(null);T&&ts(z,T),p&&(z.g=p),j&&Xr(z,j),y&&(z.l=y),T=z}return y=u.D,p=u.ya,y&&p&&We(T,y,p),We(T,"VER",u.la),Cr(u,T),T}function Ql(u,p,y){if(p&&!u.J)throw Error("Can't create secondary domain capable XhrIo object.");return p=u.Ca&&!u.pa?new Ze(new Ar({eb:y})):new Ze(u.pa),p.Ha(u.J),p}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function va(){}r=va.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function ro(){}ro.prototype.g=function(u,p){return new Kt(u,p)};function Kt(u,p){_t.call(this),this.g=new ya(p),this.l=u,this.h=p&&p.messageUrlParams||null,u=p&&p.messageHeaders||null,p&&p.clientProtocolHeaderRequired&&(u?u["X-Client-Protocol"]="webchannel":u={"X-Client-Protocol":"webchannel"}),this.g.o=u,u=p&&p.initMessageHeaders||null,p&&p.messageContentType&&(u?u["X-WebChannel-Content-Type"]=p.messageContentType:u={"X-WebChannel-Content-Type":p.messageContentType}),p&&p.va&&(u?u["X-WebChannel-Client-Profile"]=p.va:u={"X-WebChannel-Client-Profile":p.va}),this.g.S=u,(u=p&&p.Sb)&&!M(u)&&(this.g.m=u),this.v=p&&p.supportsCrossDomainXhr||!1,this.u=p&&p.sendRawJson||!1,(p=p&&p.httpSessionIdParam)&&!M(p)&&(this.g.D=p,u=this.h,u!==null&&p in u&&(u=this.h,p in u&&delete u[p])),this.j=new rr(this)}W(Kt,_t),Kt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Kt.prototype.close=function(){bt(this.g)},Kt.prototype.o=function(u){var p=this.g;if(typeof u=="string"){var y={};y.__data__=u,u=y}else this.u&&(y={},y.__data__=na(u),u=y);p.i.push(new Ol(p.Ya++,u)),p.G==3&&nr(p)},Kt.prototype.N=function(){this.g.l=null,delete this.j,bt(this.g),delete this.g,Kt.aa.N.call(this)};function Xl(u){Yn.call(this),u.__headers__&&(this.headers=u.__headers__,this.statusCode=u.__status__,delete u.__headers__,delete u.__status__);var p=u.__sm__;if(p){e:{for(const y in p){u=y;break e}u=void 0}(this.i=u)&&(u=this.i,p=p!==null&&u in p?p[u]:void 0),this.data=p}else this.data=u}W(Xl,Yn);function Yl(){Us.call(this),this.status=1}W(Yl,Us);function rr(u){this.g=u}W(rr,va),rr.prototype.ua=function(){vt(this.g,"a")},rr.prototype.ta=function(u){vt(this.g,new Xl(u))},rr.prototype.sa=function(u){vt(this.g,new Yl)},rr.prototype.ra=function(){vt(this.g,"b")},ro.prototype.createWebChannel=ro.prototype.g,Kt.prototype.send=Kt.prototype.o,Kt.prototype.open=Kt.prototype.m,Kt.prototype.close=Kt.prototype.close,Sv=function(){return new ro},Iv=function(){return Ki()},Tv=Jn,Yd={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},$s.NO_ERROR=0,$s.TIMEOUT=8,$s.HTTP_ERROR=6,rc=$s,Pl.COMPLETE="complete",wv=Pl,Fs.EventType=En,En.OPEN="a",En.CLOSE="b",En.ERROR="c",En.MESSAGE="d",_t.prototype.listen=_t.prototype.K,Ga=Fs,Ze.prototype.listenOnce=Ze.prototype.L,Ze.prototype.getLastError=Ze.prototype.Ka,Ze.prototype.getLastErrorCode=Ze.prototype.Ba,Ze.prototype.getStatus=Ze.prototype.Z,Ze.prototype.getResponseJson=Ze.prototype.Oa,Ze.prototype.getResponseText=Ze.prototype.oa,Ze.prototype.send=Ze.prototype.ea,Ze.prototype.setWithCredentials=Ze.prototype.Ha,Ev=Ze}).apply(typeof qu<"u"?qu:typeof self<"u"?self:typeof window<"u"?window:{});const Ey="@firebase/firestore",wy="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Wt.UNAUTHENTICATED=new Wt(null),Wt.GOOGLE_CREDENTIALS=new Wt("google-credentials-uid"),Wt.FIRST_PARTY=new Wt("first-party-uid"),Wt.MOCK_USER=new Wt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let zo="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const As=new Ef("@firebase/firestore");function Ao(){return As.logLevel}function se(r,...e){if(As.logLevel<=ke.DEBUG){const t=e.map(Df);As.debug(`Firestore (${zo}): ${r}`,...t)}}function Wr(r,...e){if(As.logLevel<=ke.ERROR){const t=e.map(Df);As.error(`Firestore (${zo}): ${r}`,...t)}}function Pi(r,...e){if(As.logLevel<=ke.WARN){const t=e.map(Df);As.warn(`Firestore (${zo}): ${r}`,...t)}}function Df(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _e(r,e,t){let i="Unexpected state";typeof e=="string"?i=e:t=e,xv(r,i,t)}function xv(r,e,t){let i=`FIRESTORE (${zo}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{i+=" CONTEXT: "+JSON.stringify(t)}catch{i+=" CONTEXT: "+t}throw Wr(i),new Error(i)}function Be(r,e,t,i){let o="Unexpected state";typeof t=="string"?o=t:i=t,r||xv(e,o,i)}function Te(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class ne extends vr{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Br{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Av{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class MS{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Wt.UNAUTHENTICATED)))}shutdown(){}}class jS{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class FS{constructor(e){this.t=e,this.currentUser=Wt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Be(this.o===void 0,42304);let i=this.i;const o=g=>this.i!==i?(i=this.i,t(g)):Promise.resolve();let l=new Br;this.o=()=>{this.i++,this.currentUser=this.u(),l.resolve(),l=new Br,e.enqueueRetryable((()=>o(this.currentUser)))};const h=()=>{const g=l;e.enqueueRetryable((async()=>{await g.promise,await o(this.currentUser)}))},f=g=>{se("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit((g=>f(g))),setTimeout((()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?f(g):(se("FirebaseAuthCredentialsProvider","Auth not yet detected"),l.resolve(),l=new Br)}}),0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((i=>this.i!==e?(se("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(Be(typeof i.accessToken=="string",31837,{l:i}),new Av(i.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Be(e===null||typeof e=="string",2055,{h:e}),new Wt(e)}}class US{constructor(e,t,i){this.P=e,this.T=t,this.I=i,this.type="FirstParty",this.user=Wt.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class BS{constructor(e,t,i){this.P=e,this.T=t,this.I=i}getToken(){return Promise.resolve(new US(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Wt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Ty{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class zS{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,yn(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Be(this.o===void 0,3512);const i=l=>{l.error!=null&&se("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${l.error.message}`);const h=l.token!==this.m;return this.m=l.token,se("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(l.token):Promise.resolve()};this.o=l=>{e.enqueueRetryable((()=>i(l)))};const o=l=>{se("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=l,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((l=>o(l))),setTimeout((()=>{if(!this.appCheck){const l=this.V.getImmediate({optional:!0});l?o(l):se("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Ty(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Be(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Ty(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $S(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let i=0;i<r;i++)t[i]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rv(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let i="";for(;i.length<20;){const o=$S(40);for(let l=0;l<o.length;++l)i.length<20&&o[l]<t&&(i+=e.charAt(o[l]%62))}return i}}function xe(r,e){return r<e?-1:r>e?1:0}function Jd(r,e){let t=0;for(;t<r.length&&t<e.length;){const i=r.codePointAt(t),o=e.codePointAt(t);if(i!==o){if(i<128&&o<128)return xe(i,o);{const l=Rv(),h=WS(l.encode(Iy(r,t)),l.encode(Iy(e,t)));return h!==0?h:xe(i,o)}}t+=i>65535?2:1}return xe(r.length,e.length)}function Iy(r,e){return r.codePointAt(e)>65535?r.substring(e,e+2):r.substring(e,e+1)}function WS(r,e){for(let t=0;t<r.length&&t<e.length;++t)if(r[t]!==e[t])return xe(r[t],e[t]);return xe(r.length,e.length)}function Lo(r,e,t){return r.length===e.length&&r.every(((i,o)=>t(i,e[o])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sy="__name__";class lr{constructor(e,t,i){t===void 0?t=0:t>e.length&&_e(637,{offset:t,range:e.length}),i===void 0?i=e.length-t:i>e.length-t&&_e(1746,{length:i,range:e.length-t}),this.segments=e,this.offset=t,this.len=i}get length(){return this.len}isEqual(e){return lr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof lr?e.forEach((i=>{t.push(i)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,i=this.limit();t<i;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const i=Math.min(e.length,t.length);for(let o=0;o<i;o++){const l=lr.compareSegments(e.get(o),t.get(o));if(l!==0)return l}return xe(e.length,t.length)}static compareSegments(e,t){const i=lr.isNumericId(e),o=lr.isNumericId(t);return i&&!o?-1:!i&&o?1:i&&o?lr.extractNumericId(e).compare(lr.extractNumericId(t)):Jd(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Ri.fromString(e.substring(4,e.length-2))}}class Qe extends lr{construct(e,t,i){return new Qe(e,t,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const i of e){if(i.indexOf("//")>=0)throw new ne(H.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);t.push(...i.split("/").filter((o=>o.length>0)))}return new Qe(t)}static emptyPath(){return new Qe([])}}const HS=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Vt extends lr{construct(e,t,i){return new Vt(e,t,i)}static isValidIdentifier(e){return HS.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Vt.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Sy}static keyField(){return new Vt([Sy])}static fromServerFormat(e){const t=[];let i="",o=0;const l=()=>{if(i.length===0)throw new ne(H.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(i),i=""};let h=!1;for(;o<e.length;){const f=e[o];if(f==="\\"){if(o+1===e.length)throw new ne(H.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const g=e[o+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new ne(H.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=g,o+=2}else f==="`"?(h=!h,o++):f!=="."||h?(i+=f,o++):(l(),o++)}if(l(),h)throw new ne(H.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Vt(t)}static emptyPath(){return new Vt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(e){this.path=e}static fromPath(e){return new fe(Qe.fromString(e))}static fromName(e){return new fe(Qe.fromString(e).popFirst(5))}static empty(){return new fe(Qe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Qe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Qe.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new fe(new Qe(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cv(r,e,t){if(!t)throw new ne(H.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function qS(r,e,t,i){if(e===!0&&i===!0)throw new ne(H.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function xy(r){if(!fe.isDocumentKey(r))throw new ne(H.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Ay(r){if(fe.isDocumentKey(r))throw new ne(H.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function kv(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function Nc(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(i){return i.constructor?i.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":_e(12329,{type:typeof r})}function yr(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new ne(H.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Nc(r);throw new ne(H.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function GS(r,e){if(e<=0)throw new ne(H.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yt(r,e){const t={typeString:r};return e&&(t.value=e),t}function wl(r,e){if(!kv(r))throw new ne(H.INVALID_ARGUMENT,"JSON must be an object");let t;for(const i in e)if(e[i]){const o=e[i].typeString,l="value"in e[i]?{value:e[i].value}:void 0;if(!(i in r)){t=`JSON missing required field: '${i}'`;break}const h=r[i];if(o&&typeof h!==o){t=`JSON field '${i}' must be a ${o}.`;break}if(l!==void 0&&h!==l.value){t=`Expected '${i}' field to equal '${l.value}'`;break}}if(t)throw new ne(H.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ry=-62135596800,Cy=1e6;class Je{static now(){return Je.fromMillis(Date.now())}static fromDate(e){return Je.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),i=Math.floor((e-1e3*t)*Cy);return new Je(t,i)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new ne(H.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new ne(H.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Ry)throw new ne(H.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new ne(H.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Cy}_compareTo(e){return this.seconds===e.seconds?xe(this.nanoseconds,e.nanoseconds):xe(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Je._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(wl(e,Je._jsonSchema))return new Je(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Ry;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Je._jsonSchemaVersion="firestore/timestamp/1.0",Je._jsonSchema={type:yt("string",Je._jsonSchemaVersion),seconds:yt("number"),nanoseconds:yt("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{static fromTimestamp(e){return new we(e)}static min(){return new we(new Je(0,0))}static max(){return new we(new Je(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const al=-1;function KS(r,e){const t=r.toTimestamp().seconds,i=r.toTimestamp().nanoseconds+1,o=we.fromTimestamp(i===1e9?new Je(t+1,0):new Je(t,i));return new bi(o,fe.empty(),e)}function QS(r){return new bi(r.readTime,r.key,al)}class bi{constructor(e,t,i){this.readTime=e,this.documentKey=t,this.largestBatchId=i}static min(){return new bi(we.min(),fe.empty(),al)}static max(){return new bi(we.max(),fe.empty(),al)}}function XS(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=fe.comparator(r.documentKey,e.documentKey),t!==0?t:xe(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YS="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class JS{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $o(r){if(r.code!==H.FAILED_PRECONDITION||r.message!==YS)throw r;se("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&_e(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new G(((i,o)=>{this.nextCallback=l=>{this.wrapSuccess(e,l).next(i,o)},this.catchCallback=l=>{this.wrapFailure(t,l).next(i,o)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof G?t:G.resolve(t)}catch(t){return G.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):G.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):G.reject(t)}static resolve(e){return new G(((t,i)=>{t(e)}))}static reject(e){return new G(((t,i)=>{i(e)}))}static waitFor(e){return new G(((t,i)=>{let o=0,l=0,h=!1;e.forEach((f=>{++o,f.next((()=>{++l,h&&l===o&&t()}),(g=>i(g)))})),h=!0,l===o&&t()}))}static or(e){let t=G.resolve(!1);for(const i of e)t=t.next((o=>o?G.resolve(o):i()));return t}static forEach(e,t){const i=[];return e.forEach(((o,l)=>{i.push(t.call(this,o,l))})),this.waitFor(i)}static mapArray(e,t){return new G(((i,o)=>{const l=e.length,h=new Array(l);let f=0;for(let g=0;g<l;g++){const _=g;t(e[_]).next((w=>{h[_]=w,++f,f===l&&i(h)}),(w=>o(w)))}}))}static doWhile(e,t){return new G(((i,o)=>{const l=()=>{e()===!0?t().next((()=>{l()}),o):i()};l()}))}}function ZS(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Wo(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=i=>this._e(i),this.ae=i=>t.writeSequenceNumber(i))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Oc.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Of=-1;function Vc(r){return r==null}function yc(r){return r===0&&1/r==-1/0}function ex(r){return typeof r=="number"&&Number.isInteger(r)&&!yc(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pv="";function tx(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=ky(e)),e=nx(r.get(t),e);return ky(e)}function nx(r,e){let t=e;const i=r.length;for(let o=0;o<i;o++){const l=r.charAt(o);switch(l){case"\0":t+="";break;case Pv:t+="";break;default:t+=l}}return t}function ky(r){return r+Pv+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Py(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Bi(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function bv(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e,t){this.comparator=e,this.root=t||Ot.EMPTY}insert(e,t){return new rt(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Ot.BLACK,null,null))}remove(e){return new rt(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ot.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const i=this.comparator(e,t.key);if(i===0)return t.value;i<0?t=t.left:i>0&&(t=t.right)}return null}indexOf(e){let t=0,i=this.root;for(;!i.isEmpty();){const o=this.comparator(e,i.key);if(o===0)return t+i.left.size;o<0?i=i.left:(t+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,i)=>(e(t,i),!1)))}toString(){const e=[];return this.inorderTraversal(((t,i)=>(e.push(`${t}:${i}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Gu(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Gu(this.root,e,this.comparator,!1)}getReverseIterator(){return new Gu(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Gu(this.root,e,this.comparator,!0)}}class Gu{constructor(e,t,i,o){this.isReverse=o,this.nodeStack=[];let l=1;for(;!e.isEmpty();)if(l=t?i(e.key,t):1,t&&o&&(l*=-1),l<0)e=this.isReverse?e.left:e.right;else{if(l===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ot{constructor(e,t,i,o,l){this.key=e,this.value=t,this.color=i??Ot.RED,this.left=o??Ot.EMPTY,this.right=l??Ot.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,i,o,l){return new Ot(e??this.key,t??this.value,i??this.color,o??this.left,l??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let o=this;const l=i(e,o.key);return o=l<0?o.copy(null,null,null,o.left.insert(e,t,i),null):l===0?o.copy(null,t,null,null,null):o.copy(null,null,null,null,o.right.insert(e,t,i)),o.fixUp()}removeMin(){if(this.left.isEmpty())return Ot.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let i,o=this;if(t(e,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(e,t),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),t(e,o.key)===0){if(o.right.isEmpty())return Ot.EMPTY;i=o.right.min(),o=o.copy(i.key,i.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(e,t))}return o.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ot.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ot.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw _e(43730,{key:this.key,value:this.value});if(this.right.isRed())throw _e(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw _e(27949);return e+(this.isRed()?0:1)}}Ot.EMPTY=null,Ot.RED=!0,Ot.BLACK=!1;Ot.EMPTY=new class{constructor(){this.size=0}get key(){throw _e(57766)}get value(){throw _e(16141)}get color(){throw _e(16727)}get left(){throw _e(29726)}get right(){throw _e(36894)}copy(e,t,i,o,l){return this}insert(e,t,i){return new Ot(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(e){this.comparator=e,this.data=new rt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,i)=>(e(t),!1)))}forEachInRange(e,t){const i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){const o=i.getNext();if(this.comparator(o.key,e[1])>=0)return;t(o.key)}}forEachWhile(e,t){let i;for(i=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new by(this.data.getIterator())}getIteratorFrom(e){return new by(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((i=>{t=t.add(i)})),t}isEqual(e){if(!(e instanceof It)||this.size!==e.size)return!1;const t=this.data.getIterator(),i=e.data.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=i.getNext().key;if(this.comparator(o,l)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new It(this.comparator);return t.data=e,t}}class by{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _n{constructor(e){this.fields=e,e.sort(Vt.comparator)}static empty(){return new _n([])}unionWith(e){let t=new It(Vt.comparator);for(const i of this.fields)t=t.add(i);for(const i of e)t=t.add(i);return new _n(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Lo(this.fields,e.fields,((t,i)=>t.isEqual(i)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dv extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(l){throw typeof DOMException<"u"&&l instanceof DOMException?new Dv("Invalid base64 string: "+l):l}})(e);return new Lt(t)}static fromUint8Array(e){const t=(function(o){let l="";for(let h=0;h<o.length;++h)l+=String.fromCharCode(o[h]);return l})(e);return new Lt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const i=new Uint8Array(t.length);for(let o=0;o<t.length;o++)i[o]=t.charCodeAt(o);return i})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return xe(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Lt.EMPTY_BYTE_STRING=new Lt("");const rx=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Di(r){if(Be(!!r,39018),typeof r=="string"){let e=0;const t=rx.exec(r);if(Be(!!t,46558,{timestamp:r}),t[1]){let o=t[1];o=(o+"000000000").substr(0,9),e=Number(o)}const i=new Date(r);return{seconds:Math.floor(i.getTime()/1e3),nanos:e}}return{seconds:ht(r.seconds),nanos:ht(r.nanos)}}function ht(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Ni(r){return typeof r=="string"?Lt.fromBase64String(r):Lt.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nv="server_timestamp",Ov="__type__",Vv="__previous_value__",Lv="__local_write_time__";function Vf(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[Ov])===null||t===void 0?void 0:t.stringValue)===Nv}function Lc(r){const e=r.mapValue.fields[Vv];return Vf(e)?Lc(e):e}function ll(r){const e=Di(r.mapValue.fields[Lv].timestampValue);return new Je(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ix{constructor(e,t,i,o,l,h,f,g,_,w){this.databaseId=e,this.appId=t,this.persistenceKey=i,this.host=o,this.ssl=l,this.forceLongPolling=h,this.autoDetectLongPolling=f,this.longPollingOptions=g,this.useFetchStreams=_,this.isUsingEmulator=w}}const _c="(default)";class ul{constructor(e,t){this.projectId=e,this.database=t||_c}static empty(){return new ul("","")}get isDefaultDatabase(){return this.database===_c}isEqual(e){return e instanceof ul&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mv="__type__",sx="__max__",Ku={mapValue:{}},jv="__vector__",vc="value";function Oi(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Vf(r)?4:ax(r)?9007199254740991:ox(r)?10:11:_e(28295,{value:r})}function _r(r,e){if(r===e)return!0;const t=Oi(r);if(t!==Oi(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return ll(r).isEqual(ll(e));case 3:return(function(o,l){if(typeof o.timestampValue=="string"&&typeof l.timestampValue=="string"&&o.timestampValue.length===l.timestampValue.length)return o.timestampValue===l.timestampValue;const h=Di(o.timestampValue),f=Di(l.timestampValue);return h.seconds===f.seconds&&h.nanos===f.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(o,l){return Ni(o.bytesValue).isEqual(Ni(l.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(o,l){return ht(o.geoPointValue.latitude)===ht(l.geoPointValue.latitude)&&ht(o.geoPointValue.longitude)===ht(l.geoPointValue.longitude)})(r,e);case 2:return(function(o,l){if("integerValue"in o&&"integerValue"in l)return ht(o.integerValue)===ht(l.integerValue);if("doubleValue"in o&&"doubleValue"in l){const h=ht(o.doubleValue),f=ht(l.doubleValue);return h===f?yc(h)===yc(f):isNaN(h)&&isNaN(f)}return!1})(r,e);case 9:return Lo(r.arrayValue.values||[],e.arrayValue.values||[],_r);case 10:case 11:return(function(o,l){const h=o.mapValue.fields||{},f=l.mapValue.fields||{};if(Py(h)!==Py(f))return!1;for(const g in h)if(h.hasOwnProperty(g)&&(f[g]===void 0||!_r(h[g],f[g])))return!1;return!0})(r,e);default:return _e(52216,{left:r})}}function cl(r,e){return(r.values||[]).find((t=>_r(t,e)))!==void 0}function Mo(r,e){if(r===e)return 0;const t=Oi(r),i=Oi(e);if(t!==i)return xe(t,i);switch(t){case 0:case 9007199254740991:return 0;case 1:return xe(r.booleanValue,e.booleanValue);case 2:return(function(l,h){const f=ht(l.integerValue||l.doubleValue),g=ht(h.integerValue||h.doubleValue);return f<g?-1:f>g?1:f===g?0:isNaN(f)?isNaN(g)?0:-1:1})(r,e);case 3:return Dy(r.timestampValue,e.timestampValue);case 4:return Dy(ll(r),ll(e));case 5:return Jd(r.stringValue,e.stringValue);case 6:return(function(l,h){const f=Ni(l),g=Ni(h);return f.compareTo(g)})(r.bytesValue,e.bytesValue);case 7:return(function(l,h){const f=l.split("/"),g=h.split("/");for(let _=0;_<f.length&&_<g.length;_++){const w=xe(f[_],g[_]);if(w!==0)return w}return xe(f.length,g.length)})(r.referenceValue,e.referenceValue);case 8:return(function(l,h){const f=xe(ht(l.latitude),ht(h.latitude));return f!==0?f:xe(ht(l.longitude),ht(h.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return Ny(r.arrayValue,e.arrayValue);case 10:return(function(l,h){var f,g,_,w;const x=l.fields||{},A=h.fields||{},O=(f=x[vc])===null||f===void 0?void 0:f.arrayValue,W=(g=A[vc])===null||g===void 0?void 0:g.arrayValue,q=xe(((_=O==null?void 0:O.values)===null||_===void 0?void 0:_.length)||0,((w=W==null?void 0:W.values)===null||w===void 0?void 0:w.length)||0);return q!==0?q:Ny(O,W)})(r.mapValue,e.mapValue);case 11:return(function(l,h){if(l===Ku.mapValue&&h===Ku.mapValue)return 0;if(l===Ku.mapValue)return 1;if(h===Ku.mapValue)return-1;const f=l.fields||{},g=Object.keys(f),_=h.fields||{},w=Object.keys(_);g.sort(),w.sort();for(let x=0;x<g.length&&x<w.length;++x){const A=Jd(g[x],w[x]);if(A!==0)return A;const O=Mo(f[g[x]],_[w[x]]);if(O!==0)return O}return xe(g.length,w.length)})(r.mapValue,e.mapValue);default:throw _e(23264,{le:t})}}function Dy(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return xe(r,e);const t=Di(r),i=Di(e),o=xe(t.seconds,i.seconds);return o!==0?o:xe(t.nanos,i.nanos)}function Ny(r,e){const t=r.values||[],i=e.values||[];for(let o=0;o<t.length&&o<i.length;++o){const l=Mo(t[o],i[o]);if(l)return l}return xe(t.length,i.length)}function jo(r){return Zd(r)}function Zd(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const i=Di(t);return`time(${i.seconds},${i.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Ni(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return fe.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let i="[",o=!0;for(const l of t.values||[])o?o=!1:i+=",",i+=Zd(l);return i+"]"})(r.arrayValue):"mapValue"in r?(function(t){const i=Object.keys(t.fields||{}).sort();let o="{",l=!0;for(const h of i)l?l=!1:o+=",",o+=`${h}:${Zd(t.fields[h])}`;return o+"}"})(r.mapValue):_e(61005,{value:r})}function ic(r){switch(Oi(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Lc(r);return e?16+ic(e):16;case 5:return 2*r.stringValue.length;case 6:return Ni(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(i){return(i.values||[]).reduce(((o,l)=>o+ic(l)),0)})(r.arrayValue);case 10:case 11:return(function(i){let o=0;return Bi(i.fields,((l,h)=>{o+=l.length+ic(h)})),o})(r.mapValue);default:throw _e(13486,{value:r})}}function Oy(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function ef(r){return!!r&&"integerValue"in r}function Lf(r){return!!r&&"arrayValue"in r}function Vy(r){return!!r&&"nullValue"in r}function Ly(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function sc(r){return!!r&&"mapValue"in r}function ox(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[Mv])===null||t===void 0?void 0:t.stringValue)===jv}function Za(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return Bi(r.mapValue.fields,((t,i)=>e.mapValue.fields[t]=Za(i))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Za(r.arrayValue.values[t]);return e}return Object.assign({},r)}function ax(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===sx}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class un{constructor(e){this.value=e}static empty(){return new un({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let i=0;i<e.length-1;++i)if(t=(t.mapValue.fields||{})[e.get(i)],!sc(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Za(t)}setAll(e){let t=Vt.emptyPath(),i={},o=[];e.forEach(((h,f)=>{if(!t.isImmediateParentOf(f)){const g=this.getFieldsMap(t);this.applyChanges(g,i,o),i={},o=[],t=f.popLast()}h?i[f.lastSegment()]=Za(h):o.push(f.lastSegment())}));const l=this.getFieldsMap(t);this.applyChanges(l,i,o)}delete(e){const t=this.field(e.popLast());sc(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return _r(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let i=0;i<e.length;++i){let o=t.mapValue.fields[e.get(i)];sc(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},t.mapValue.fields[e.get(i)]=o),t=o}return t.mapValue.fields}applyChanges(e,t,i){Bi(t,((o,l)=>e[o]=l));for(const o of i)delete e[o]}clone(){return new un(Za(this.value))}}function Fv(r){const e=[];return Bi(r.fields,((t,i)=>{const o=new Vt([t]);if(sc(i)){const l=Fv(i.mapValue).fields;if(l.length===0)e.push(o);else for(const h of l)e.push(o.child(h))}else e.push(o)})),new _n(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(e,t,i,o,l,h,f){this.key=e,this.documentType=t,this.version=i,this.readTime=o,this.createTime=l,this.data=h,this.documentState=f}static newInvalidDocument(e){return new Ht(e,0,we.min(),we.min(),we.min(),un.empty(),0)}static newFoundDocument(e,t,i,o){return new Ht(e,1,t,we.min(),i,o,0)}static newNoDocument(e,t){return new Ht(e,2,t,we.min(),we.min(),un.empty(),0)}static newUnknownDocument(e,t){return new Ht(e,3,t,we.min(),we.min(),un.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(we.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=un.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=un.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=we.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ht&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ht(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ec{constructor(e,t){this.position=e,this.inclusive=t}}function My(r,e,t){let i=0;for(let o=0;o<r.position.length;o++){const l=e[o],h=r.position[o];if(l.field.isKeyField()?i=fe.comparator(fe.fromName(h.referenceValue),t.key):i=Mo(h,t.data.field(l.field)),l.dir==="desc"&&(i*=-1),i!==0)break}return i}function jy(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!_r(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl{constructor(e,t="asc"){this.field=e,this.dir=t}}function lx(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uv{}class gt extends Uv{constructor(e,t,i){super(),this.field=e,this.op=t,this.value=i}static create(e,t,i){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,i):new cx(e,t,i):t==="array-contains"?new fx(e,i):t==="in"?new px(e,i):t==="not-in"?new mx(e,i):t==="array-contains-any"?new gx(e,i):new gt(e,t,i)}static createKeyFieldInFilter(e,t,i){return t==="in"?new hx(e,i):new dx(e,i)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Mo(t,this.value)):t!==null&&Oi(this.value)===Oi(t)&&this.matchesComparison(Mo(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return _e(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Qn extends Uv{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new Qn(e,t)}matches(e){return Bv(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function Bv(r){return r.op==="and"}function zv(r){return ux(r)&&Bv(r)}function ux(r){for(const e of r.filters)if(e instanceof Qn)return!1;return!0}function tf(r){if(r instanceof gt)return r.field.canonicalString()+r.op.toString()+jo(r.value);if(zv(r))return r.filters.map((e=>tf(e))).join(",");{const e=r.filters.map((t=>tf(t))).join(",");return`${r.op}(${e})`}}function $v(r,e){return r instanceof gt?(function(i,o){return o instanceof gt&&i.op===o.op&&i.field.isEqual(o.field)&&_r(i.value,o.value)})(r,e):r instanceof Qn?(function(i,o){return o instanceof Qn&&i.op===o.op&&i.filters.length===o.filters.length?i.filters.reduce(((l,h,f)=>l&&$v(h,o.filters[f])),!0):!1})(r,e):void _e(19439)}function Wv(r){return r instanceof gt?(function(t){return`${t.field.canonicalString()} ${t.op} ${jo(t.value)}`})(r):r instanceof Qn?(function(t){return t.op.toString()+" {"+t.getFilters().map(Wv).join(" ,")+"}"})(r):"Filter"}class cx extends gt{constructor(e,t,i){super(e,t,i),this.key=fe.fromName(i.referenceValue)}matches(e){const t=fe.comparator(e.key,this.key);return this.matchesComparison(t)}}class hx extends gt{constructor(e,t){super(e,"in",t),this.keys=Hv("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class dx extends gt{constructor(e,t){super(e,"not-in",t),this.keys=Hv("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Hv(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((i=>fe.fromName(i.referenceValue)))}class fx extends gt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Lf(t)&&cl(t.arrayValue,this.value)}}class px extends gt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&cl(this.value.arrayValue,t)}}class mx extends gt{constructor(e,t){super(e,"not-in",t)}matches(e){if(cl(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!cl(this.value.arrayValue,t)}}class gx extends gt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Lf(t)||!t.arrayValue.values)&&t.arrayValue.values.some((i=>cl(this.value.arrayValue,i)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yx{constructor(e,t=null,i=[],o=[],l=null,h=null,f=null){this.path=e,this.collectionGroup=t,this.orderBy=i,this.filters=o,this.limit=l,this.startAt=h,this.endAt=f,this.Pe=null}}function Fy(r,e=null,t=[],i=[],o=null,l=null,h=null){return new yx(r,e,t,i,o,l,h)}function Mf(r){const e=Te(r);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((i=>tf(i))).join(","),t+="|ob:",t+=e.orderBy.map((i=>(function(l){return l.field.canonicalString()+l.dir})(i))).join(","),Vc(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((i=>jo(i))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((i=>jo(i))).join(",")),e.Pe=t}return e.Pe}function jf(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!lx(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!$v(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!jy(r.startAt,e.startAt)&&jy(r.endAt,e.endAt)}function nf(r){return fe.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e,t=null,i=[],o=[],l=null,h="F",f=null,g=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=i,this.filters=o,this.limit=l,this.limitType=h,this.startAt=f,this.endAt=g,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function _x(r,e,t,i,o,l,h,f){return new Ho(r,e,t,i,o,l,h,f)}function Ff(r){return new Ho(r)}function Uy(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function qv(r){return r.collectionGroup!==null}function el(r){const e=Te(r);if(e.Te===null){e.Te=[];const t=new Set;for(const l of e.explicitOrderBy)e.Te.push(l),t.add(l.field.canonicalString());const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(h){let f=new It(Vt.comparator);return h.filters.forEach((g=>{g.getFlattenedFilters().forEach((_=>{_.isInequality()&&(f=f.add(_.field))}))})),f})(e).forEach((l=>{t.has(l.canonicalString())||l.isKeyField()||e.Te.push(new hl(l,i))})),t.has(Vt.keyField().canonicalString())||e.Te.push(new hl(Vt.keyField(),i))}return e.Te}function fr(r){const e=Te(r);return e.Ie||(e.Ie=vx(e,el(r))),e.Ie}function vx(r,e){if(r.limitType==="F")return Fy(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((o=>{const l=o.dir==="desc"?"asc":"desc";return new hl(o.field,l)}));const t=r.endAt?new Ec(r.endAt.position,r.endAt.inclusive):null,i=r.startAt?new Ec(r.startAt.position,r.startAt.inclusive):null;return Fy(r.path,r.collectionGroup,e,r.filters,r.limit,t,i)}}function rf(r,e){const t=r.filters.concat([e]);return new Ho(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function wc(r,e,t){return new Ho(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function Mc(r,e){return jf(fr(r),fr(e))&&r.limitType===e.limitType}function Gv(r){return`${Mf(fr(r))}|lt:${r.limitType}`}function Ro(r){return`Query(target=${(function(t){let i=t.path.canonicalString();return t.collectionGroup!==null&&(i+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(i+=`, filters: [${t.filters.map((o=>Wv(o))).join(", ")}]`),Vc(t.limit)||(i+=", limit: "+t.limit),t.orderBy.length>0&&(i+=`, orderBy: [${t.orderBy.map((o=>(function(h){return`${h.field.canonicalString()} (${h.dir})`})(o))).join(", ")}]`),t.startAt&&(i+=", startAt: ",i+=t.startAt.inclusive?"b:":"a:",i+=t.startAt.position.map((o=>jo(o))).join(",")),t.endAt&&(i+=", endAt: ",i+=t.endAt.inclusive?"a:":"b:",i+=t.endAt.position.map((o=>jo(o))).join(",")),`Target(${i})`})(fr(r))}; limitType=${r.limitType})`}function jc(r,e){return e.isFoundDocument()&&(function(i,o){const l=o.key.path;return i.collectionGroup!==null?o.key.hasCollectionId(i.collectionGroup)&&i.path.isPrefixOf(l):fe.isDocumentKey(i.path)?i.path.isEqual(l):i.path.isImmediateParentOf(l)})(r,e)&&(function(i,o){for(const l of el(i))if(!l.field.isKeyField()&&o.data.field(l.field)===null)return!1;return!0})(r,e)&&(function(i,o){for(const l of i.filters)if(!l.matches(o))return!1;return!0})(r,e)&&(function(i,o){return!(i.startAt&&!(function(h,f,g){const _=My(h,f,g);return h.inclusive?_<=0:_<0})(i.startAt,el(i),o)||i.endAt&&!(function(h,f,g){const _=My(h,f,g);return h.inclusive?_>=0:_>0})(i.endAt,el(i),o))})(r,e)}function Ex(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Kv(r){return(e,t)=>{let i=!1;for(const o of el(r)){const l=wx(o,e,t);if(l!==0)return l;i=i||o.field.isKeyField()}return 0}}function wx(r,e,t){const i=r.field.isKeyField()?fe.comparator(e.key,t.key):(function(l,h,f){const g=h.data.field(l),_=f.data.field(l);return g!==null&&_!==null?Mo(g,_):_e(42886)})(r.field,e,t);switch(r.dir){case"asc":return i;case"desc":return-1*i;default:return _e(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bs{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i!==void 0){for(const[o,l]of i)if(this.equalsFn(o,e))return l}}has(e){return this.get(e)!==void 0}set(e,t){const i=this.mapKeyFn(e),o=this.inner[i];if(o===void 0)return this.inner[i]=[[e,t]],void this.innerSize++;for(let l=0;l<o.length;l++)if(this.equalsFn(o[l][0],e))return void(o[l]=[e,t]);o.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i===void 0)return!1;for(let o=0;o<i.length;o++)if(this.equalsFn(i[o][0],e))return i.length===1?delete this.inner[t]:i.splice(o,1),this.innerSize--,!0;return!1}forEach(e){Bi(this.inner,((t,i)=>{for(const[o,l]of i)e(o,l)}))}isEmpty(){return bv(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tx=new rt(fe.comparator);function Hr(){return Tx}const Qv=new rt(fe.comparator);function Ka(...r){let e=Qv;for(const t of r)e=e.insert(t.key,t);return e}function Xv(r){let e=Qv;return r.forEach(((t,i)=>e=e.insert(t,i.overlayedDocument))),e}function vs(){return tl()}function Yv(){return tl()}function tl(){return new bs((r=>r.toString()),((r,e)=>r.isEqual(e)))}const Ix=new rt(fe.comparator),Sx=new It(fe.comparator);function Pe(...r){let e=Sx;for(const t of r)e=e.add(t);return e}const xx=new It(xe);function Ax(){return xx}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uf(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:yc(e)?"-0":e}}function Jv(r){return{integerValue:""+r}}function Rx(r,e){return ex(e)?Jv(e):Uf(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fc{constructor(){this._=void 0}}function Cx(r,e,t){return r instanceof dl?(function(o,l){const h={fields:{[Ov]:{stringValue:Nv},[Lv]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return l&&Vf(l)&&(l=Lc(l)),l&&(h.fields[Vv]=l),{mapValue:h}})(t,e):r instanceof fl?e0(r,e):r instanceof pl?t0(r,e):(function(o,l){const h=Zv(o,l),f=By(h)+By(o.Ee);return ef(h)&&ef(o.Ee)?Jv(f):Uf(o.serializer,f)})(r,e)}function kx(r,e,t){return r instanceof fl?e0(r,e):r instanceof pl?t0(r,e):t}function Zv(r,e){return r instanceof Tc?(function(i){return ef(i)||(function(l){return!!l&&"doubleValue"in l})(i)})(e)?e:{integerValue:0}:null}class dl extends Fc{}class fl extends Fc{constructor(e){super(),this.elements=e}}function e0(r,e){const t=n0(e);for(const i of r.elements)t.some((o=>_r(o,i)))||t.push(i);return{arrayValue:{values:t}}}class pl extends Fc{constructor(e){super(),this.elements=e}}function t0(r,e){let t=n0(e);for(const i of r.elements)t=t.filter((o=>!_r(o,i)));return{arrayValue:{values:t}}}class Tc extends Fc{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function By(r){return ht(r.integerValue||r.doubleValue)}function n0(r){return Lf(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Px{constructor(e,t){this.field=e,this.transform=t}}function bx(r,e){return r.field.isEqual(e.field)&&(function(i,o){return i instanceof fl&&o instanceof fl||i instanceof pl&&o instanceof pl?Lo(i.elements,o.elements,_r):i instanceof Tc&&o instanceof Tc?_r(i.Ee,o.Ee):i instanceof dl&&o instanceof dl})(r.transform,e.transform)}class Dx{constructor(e,t){this.version=e,this.transformResults=t}}class Gn{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Gn}static exists(e){return new Gn(void 0,e)}static updateTime(e){return new Gn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function oc(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Uc{}function r0(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new s0(r.key,Gn.none()):new Tl(r.key,r.data,Gn.none());{const t=r.data,i=un.empty();let o=new It(Vt.comparator);for(let l of e.fields)if(!o.has(l)){let h=t.field(l);h===null&&l.length>1&&(l=l.popLast(),h=t.field(l)),h===null?i.delete(l):i.set(l,h),o=o.add(l)}return new zi(r.key,i,new _n(o.toArray()),Gn.none())}}function Nx(r,e,t){r instanceof Tl?(function(o,l,h){const f=o.value.clone(),g=$y(o.fieldTransforms,l,h.transformResults);f.setAll(g),l.convertToFoundDocument(h.version,f).setHasCommittedMutations()})(r,e,t):r instanceof zi?(function(o,l,h){if(!oc(o.precondition,l))return void l.convertToUnknownDocument(h.version);const f=$y(o.fieldTransforms,l,h.transformResults),g=l.data;g.setAll(i0(o)),g.setAll(f),l.convertToFoundDocument(h.version,g).setHasCommittedMutations()})(r,e,t):(function(o,l,h){l.convertToNoDocument(h.version).setHasCommittedMutations()})(0,e,t)}function nl(r,e,t,i){return r instanceof Tl?(function(l,h,f,g){if(!oc(l.precondition,h))return f;const _=l.value.clone(),w=Wy(l.fieldTransforms,g,h);return _.setAll(w),h.convertToFoundDocument(h.version,_).setHasLocalMutations(),null})(r,e,t,i):r instanceof zi?(function(l,h,f,g){if(!oc(l.precondition,h))return f;const _=Wy(l.fieldTransforms,g,h),w=h.data;return w.setAll(i0(l)),w.setAll(_),h.convertToFoundDocument(h.version,w).setHasLocalMutations(),f===null?null:f.unionWith(l.fieldMask.fields).unionWith(l.fieldTransforms.map((x=>x.field)))})(r,e,t,i):(function(l,h,f){return oc(l.precondition,h)?(h.convertToNoDocument(h.version).setHasLocalMutations(),null):f})(r,e,t)}function Ox(r,e){let t=null;for(const i of r.fieldTransforms){const o=e.data.field(i.field),l=Zv(i.transform,o||null);l!=null&&(t===null&&(t=un.empty()),t.set(i.field,l))}return t||null}function zy(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(i,o){return i===void 0&&o===void 0||!(!i||!o)&&Lo(i,o,((l,h)=>bx(l,h)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class Tl extends Uc{constructor(e,t,i,o=[]){super(),this.key=e,this.value=t,this.precondition=i,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class zi extends Uc{constructor(e,t,i,o,l=[]){super(),this.key=e,this.data=t,this.fieldMask=i,this.precondition=o,this.fieldTransforms=l,this.type=1}getFieldMask(){return this.fieldMask}}function i0(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const i=r.data.field(t);e.set(t,i)}})),e}function $y(r,e,t){const i=new Map;Be(r.length===t.length,32656,{Ae:t.length,Re:r.length});for(let o=0;o<t.length;o++){const l=r[o],h=l.transform,f=e.data.field(l.field);i.set(l.field,kx(h,f,t[o]))}return i}function Wy(r,e,t){const i=new Map;for(const o of r){const l=o.transform,h=t.data.field(o.field);i.set(o.field,Cx(l,h,e))}return i}class s0 extends Uc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Vx extends Uc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lx{constructor(e,t,i,o){this.batchId=e,this.localWriteTime=t,this.baseMutations=i,this.mutations=o}applyToRemoteDocument(e,t){const i=t.mutationResults;for(let o=0;o<this.mutations.length;o++){const l=this.mutations[o];l.key.isEqual(e.key)&&Nx(l,e,i[o])}}applyToLocalView(e,t){for(const i of this.baseMutations)i.key.isEqual(e.key)&&(t=nl(i,e,t,this.localWriteTime));for(const i of this.mutations)i.key.isEqual(e.key)&&(t=nl(i,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const i=Yv();return this.mutations.forEach((o=>{const l=e.get(o.key),h=l.overlayedDocument;let f=this.applyToLocalView(h,l.mutatedFields);f=t.has(o.key)?null:f;const g=r0(h,f);g!==null&&i.set(o.key,g),h.isValidDocument()||h.convertToNoDocument(we.min())})),i}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Pe())}isEqual(e){return this.batchId===e.batchId&&Lo(this.mutations,e.mutations,((t,i)=>zy(t,i)))&&Lo(this.baseMutations,e.baseMutations,((t,i)=>zy(t,i)))}}class Bf{constructor(e,t,i,o){this.batch=e,this.commitVersion=t,this.mutationResults=i,this.docVersions=o}static from(e,t,i){Be(e.mutations.length===i.length,58842,{Ve:e.mutations.length,me:i.length});let o=(function(){return Ix})();const l=e.mutations;for(let h=0;h<l.length;h++)o=o.insert(l[h].key,i[h].version);return new Bf(e,t,i,o)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mx{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jx{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var mt,Ve;function Fx(r){switch(r){case H.OK:return _e(64938);case H.CANCELLED:case H.UNKNOWN:case H.DEADLINE_EXCEEDED:case H.RESOURCE_EXHAUSTED:case H.INTERNAL:case H.UNAVAILABLE:case H.UNAUTHENTICATED:return!1;case H.INVALID_ARGUMENT:case H.NOT_FOUND:case H.ALREADY_EXISTS:case H.PERMISSION_DENIED:case H.FAILED_PRECONDITION:case H.ABORTED:case H.OUT_OF_RANGE:case H.UNIMPLEMENTED:case H.DATA_LOSS:return!0;default:return _e(15467,{code:r})}}function o0(r){if(r===void 0)return Wr("GRPC error has no .code"),H.UNKNOWN;switch(r){case mt.OK:return H.OK;case mt.CANCELLED:return H.CANCELLED;case mt.UNKNOWN:return H.UNKNOWN;case mt.DEADLINE_EXCEEDED:return H.DEADLINE_EXCEEDED;case mt.RESOURCE_EXHAUSTED:return H.RESOURCE_EXHAUSTED;case mt.INTERNAL:return H.INTERNAL;case mt.UNAVAILABLE:return H.UNAVAILABLE;case mt.UNAUTHENTICATED:return H.UNAUTHENTICATED;case mt.INVALID_ARGUMENT:return H.INVALID_ARGUMENT;case mt.NOT_FOUND:return H.NOT_FOUND;case mt.ALREADY_EXISTS:return H.ALREADY_EXISTS;case mt.PERMISSION_DENIED:return H.PERMISSION_DENIED;case mt.FAILED_PRECONDITION:return H.FAILED_PRECONDITION;case mt.ABORTED:return H.ABORTED;case mt.OUT_OF_RANGE:return H.OUT_OF_RANGE;case mt.UNIMPLEMENTED:return H.UNIMPLEMENTED;case mt.DATA_LOSS:return H.DATA_LOSS;default:return _e(39323,{code:r})}}(Ve=mt||(mt={}))[Ve.OK=0]="OK",Ve[Ve.CANCELLED=1]="CANCELLED",Ve[Ve.UNKNOWN=2]="UNKNOWN",Ve[Ve.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Ve[Ve.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Ve[Ve.NOT_FOUND=5]="NOT_FOUND",Ve[Ve.ALREADY_EXISTS=6]="ALREADY_EXISTS",Ve[Ve.PERMISSION_DENIED=7]="PERMISSION_DENIED",Ve[Ve.UNAUTHENTICATED=16]="UNAUTHENTICATED",Ve[Ve.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Ve[Ve.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Ve[Ve.ABORTED=10]="ABORTED",Ve[Ve.OUT_OF_RANGE=11]="OUT_OF_RANGE",Ve[Ve.UNIMPLEMENTED=12]="UNIMPLEMENTED",Ve[Ve.INTERNAL=13]="INTERNAL",Ve[Ve.UNAVAILABLE=14]="UNAVAILABLE",Ve[Ve.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ux=new Ri([4294967295,4294967295],0);function Hy(r){const e=Rv().encode(r),t=new vv;return t.update(e),new Uint8Array(t.digest())}function qy(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),i=e.getUint32(4,!0),o=e.getUint32(8,!0),l=e.getUint32(12,!0);return[new Ri([t,i],0),new Ri([o,l],0)]}class zf{constructor(e,t,i){if(this.bitmap=e,this.padding=t,this.hashCount=i,t<0||t>=8)throw new Qa(`Invalid padding: ${t}`);if(i<0)throw new Qa(`Invalid hash count: ${i}`);if(e.length>0&&this.hashCount===0)throw new Qa(`Invalid hash count: ${i}`);if(e.length===0&&t!==0)throw new Qa(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=Ri.fromNumber(this.fe)}pe(e,t,i){let o=e.add(t.multiply(Ri.fromNumber(i)));return o.compare(Ux)===1&&(o=new Ri([o.getBits(0),o.getBits(1)],0)),o.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=Hy(e),[i,o]=qy(t);for(let l=0;l<this.hashCount;l++){const h=this.pe(i,o,l);if(!this.ye(h))return!1}return!0}static create(e,t,i){const o=e%8==0?0:8-e%8,l=new Uint8Array(Math.ceil(e/8)),h=new zf(l,o,t);return i.forEach((f=>h.insert(f))),h}insert(e){if(this.fe===0)return;const t=Hy(e),[i,o]=qy(t);for(let l=0;l<this.hashCount;l++){const h=this.pe(i,o,l);this.we(h)}}we(e){const t=Math.floor(e/8),i=e%8;this.bitmap[t]|=1<<i}}class Qa extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bc{constructor(e,t,i,o,l){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=i,this.documentUpdates=o,this.resolvedLimboDocuments=l}static createSynthesizedRemoteEventForCurrentChange(e,t,i){const o=new Map;return o.set(e,Il.createSynthesizedTargetChangeForCurrentChange(e,t,i)),new Bc(we.min(),o,new rt(xe),Hr(),Pe())}}class Il{constructor(e,t,i,o,l){this.resumeToken=e,this.current=t,this.addedDocuments=i,this.modifiedDocuments=o,this.removedDocuments=l}static createSynthesizedTargetChangeForCurrentChange(e,t,i){return new Il(i,t,Pe(),Pe(),Pe())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ac{constructor(e,t,i,o){this.Se=e,this.removedTargetIds=t,this.key=i,this.be=o}}class a0{constructor(e,t){this.targetId=e,this.De=t}}class l0{constructor(e,t,i=Lt.EMPTY_BYTE_STRING,o=null){this.state=e,this.targetIds=t,this.resumeToken=i,this.cause=o}}class Gy{constructor(){this.ve=0,this.Ce=Ky(),this.Fe=Lt.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=Pe(),t=Pe(),i=Pe();return this.Ce.forEach(((o,l)=>{switch(l){case 0:e=e.add(o);break;case 2:t=t.add(o);break;case 1:i=i.add(o);break;default:_e(38017,{changeType:l})}})),new Il(this.Fe,this.Me,e,t,i)}ke(){this.xe=!1,this.Ce=Ky()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Be(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class Bx{constructor(e){this.We=e,this.Ge=new Map,this.ze=Hr(),this.je=Qu(),this.Je=Qu(),this.He=new rt(xe)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const i=this.tt(t);switch(e.state){case 0:this.nt(t)&&i.Be(e.resumeToken);break;case 1:i.Ue(),i.Oe||i.ke(),i.Be(e.resumeToken);break;case 2:i.Ue(),i.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(i.Ke(),i.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),i.Be(e.resumeToken));break;default:_e(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((i,o)=>{this.nt(o)&&t(o)}))}it(e){const t=e.targetId,i=e.De.count,o=this.st(t);if(o){const l=o.target;if(nf(l))if(i===0){const h=new fe(l.path);this.Xe(t,h,Ht.newNoDocument(h,we.min()))}else Be(i===1,20013,{expectedCount:i});else{const h=this.ot(t);if(h!==i){const f=this._t(e),g=f?this.ut(f,e,h):1;if(g!==0){this.rt(t);const _=g===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,_)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:i="",padding:o=0},hashCount:l=0}=t;let h,f;try{h=Ni(i).toUint8Array()}catch(g){if(g instanceof Dv)return Pi("Decoding the base64 bloom filter in existence filter failed ("+g.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw g}try{f=new zf(h,o,l)}catch(g){return Pi(g instanceof Qa?"BloomFilter error: ":"Applying bloom filter failed: ",g),null}return f.fe===0?null:f}ut(e,t,i){return t.De.count===i-this.ht(e,t.targetId)?0:2}ht(e,t){const i=this.We.getRemoteKeysForTarget(t);let o=0;return i.forEach((l=>{const h=this.We.lt(),f=`projects/${h.projectId}/databases/${h.database}/documents/${l.path.canonicalString()}`;e.mightContain(f)||(this.Xe(t,l,null),o++)})),o}Pt(e){const t=new Map;this.Ge.forEach(((l,h)=>{const f=this.st(h);if(f){if(l.current&&nf(f.target)){const g=new fe(f.target.path);this.Tt(g).has(h)||this.It(h,g)||this.Xe(h,g,Ht.newNoDocument(g,e))}l.Ne&&(t.set(h,l.Le()),l.ke())}}));let i=Pe();this.Je.forEach(((l,h)=>{let f=!0;h.forEachWhile((g=>{const _=this.st(g);return!_||_.purpose==="TargetPurposeLimboResolution"||(f=!1,!1)})),f&&(i=i.add(l))})),this.ze.forEach(((l,h)=>h.setReadTime(e)));const o=new Bc(e,t,this.He,this.ze,i);return this.ze=Hr(),this.je=Qu(),this.Je=Qu(),this.He=new rt(xe),o}Ze(e,t){if(!this.nt(e))return;const i=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,i),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,i){if(!this.nt(e))return;const o=this.tt(e);this.It(e,t)?o.qe(t,1):o.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),i&&(this.ze=this.ze.insert(t,i))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new Gy,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new It(xe),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new It(xe),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||se("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new Gy),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function Qu(){return new rt(fe.comparator)}function Ky(){return new rt(fe.comparator)}const zx={asc:"ASCENDING",desc:"DESCENDING"},$x={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Wx={and:"AND",or:"OR"};class Hx{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function sf(r,e){return r.useProto3Json||Vc(e)?e:{value:e}}function Ic(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function u0(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function qx(r,e){return Ic(r,e.toTimestamp())}function pr(r){return Be(!!r,49232),we.fromTimestamp((function(t){const i=Di(t);return new Je(i.seconds,i.nanos)})(r))}function $f(r,e){return of(r,e).canonicalString()}function of(r,e){const t=(function(o){return new Qe(["projects",o.projectId,"databases",o.database])})(r).child("documents");return e===void 0?t:t.child(e)}function c0(r){const e=Qe.fromString(r);return Be(m0(e),10190,{key:e.toString()}),e}function af(r,e){return $f(r.databaseId,e.path)}function Ld(r,e){const t=c0(e);if(t.get(1)!==r.databaseId.projectId)throw new ne(H.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new ne(H.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new fe(d0(t))}function h0(r,e){return $f(r.databaseId,e)}function Gx(r){const e=c0(r);return e.length===4?Qe.emptyPath():d0(e)}function lf(r){return new Qe(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function d0(r){return Be(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Qy(r,e,t){return{name:af(r,e),fields:t.value.mapValue.fields}}function Kx(r,e){let t;if("targetChange"in e){e.targetChange;const i=(function(_){return _==="NO_CHANGE"?0:_==="ADD"?1:_==="REMOVE"?2:_==="CURRENT"?3:_==="RESET"?4:_e(39313,{state:_})})(e.targetChange.targetChangeType||"NO_CHANGE"),o=e.targetChange.targetIds||[],l=(function(_,w){return _.useProto3Json?(Be(w===void 0||typeof w=="string",58123),Lt.fromBase64String(w||"")):(Be(w===void 0||w instanceof Buffer||w instanceof Uint8Array,16193),Lt.fromUint8Array(w||new Uint8Array))})(r,e.targetChange.resumeToken),h=e.targetChange.cause,f=h&&(function(_){const w=_.code===void 0?H.UNKNOWN:o0(_.code);return new ne(w,_.message||"")})(h);t=new l0(i,o,l,f||null)}else if("documentChange"in e){e.documentChange;const i=e.documentChange;i.document,i.document.name,i.document.updateTime;const o=Ld(r,i.document.name),l=pr(i.document.updateTime),h=i.document.createTime?pr(i.document.createTime):we.min(),f=new un({mapValue:{fields:i.document.fields}}),g=Ht.newFoundDocument(o,l,h,f),_=i.targetIds||[],w=i.removedTargetIds||[];t=new ac(_,w,g.key,g)}else if("documentDelete"in e){e.documentDelete;const i=e.documentDelete;i.document;const o=Ld(r,i.document),l=i.readTime?pr(i.readTime):we.min(),h=Ht.newNoDocument(o,l),f=i.removedTargetIds||[];t=new ac([],f,h.key,h)}else if("documentRemove"in e){e.documentRemove;const i=e.documentRemove;i.document;const o=Ld(r,i.document),l=i.removedTargetIds||[];t=new ac([],l,o,null)}else{if(!("filter"in e))return _e(11601,{At:e});{e.filter;const i=e.filter;i.targetId;const{count:o=0,unchangedNames:l}=i,h=new jx(o,l),f=i.targetId;t=new a0(f,h)}}return t}function Qx(r,e){let t;if(e instanceof Tl)t={update:Qy(r,e.key,e.value)};else if(e instanceof s0)t={delete:af(r,e.key)};else if(e instanceof zi)t={update:Qy(r,e.key,e.data),updateMask:iA(e.fieldMask)};else{if(!(e instanceof Vx))return _e(16599,{Rt:e.type});t={verify:af(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((i=>(function(l,h){const f=h.transform;if(f instanceof dl)return{fieldPath:h.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(f instanceof fl)return{fieldPath:h.field.canonicalString(),appendMissingElements:{values:f.elements}};if(f instanceof pl)return{fieldPath:h.field.canonicalString(),removeAllFromArray:{values:f.elements}};if(f instanceof Tc)return{fieldPath:h.field.canonicalString(),increment:f.Ee};throw _e(20930,{transform:h.transform})})(0,i)))),e.precondition.isNone||(t.currentDocument=(function(o,l){return l.updateTime!==void 0?{updateTime:qx(o,l.updateTime)}:l.exists!==void 0?{exists:l.exists}:_e(27497)})(r,e.precondition)),t}function Xx(r,e){return r&&r.length>0?(Be(e!==void 0,14353),r.map((t=>(function(o,l){let h=o.updateTime?pr(o.updateTime):pr(l);return h.isEqual(we.min())&&(h=pr(l)),new Dx(h,o.transformResults||[])})(t,e)))):[]}function Yx(r,e){return{documents:[h0(r,e.path)]}}function Jx(r,e){const t={structuredQuery:{}},i=e.path;let o;e.collectionGroup!==null?(o=i,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(o=i.popLast(),t.structuredQuery.from=[{collectionId:i.lastSegment()}]),t.parent=h0(r,o);const l=(function(_){if(_.length!==0)return p0(Qn.create(_,"and"))})(e.filters);l&&(t.structuredQuery.where=l);const h=(function(_){if(_.length!==0)return _.map((w=>(function(A){return{field:Co(A.field),direction:tA(A.dir)}})(w)))})(e.orderBy);h&&(t.structuredQuery.orderBy=h);const f=sf(r,e.limit);return f!==null&&(t.structuredQuery.limit=f),e.startAt&&(t.structuredQuery.startAt=(function(_){return{before:_.inclusive,values:_.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(_){return{before:!_.inclusive,values:_.position}})(e.endAt)),{Vt:t,parent:o}}function Zx(r){let e=Gx(r.parent);const t=r.structuredQuery,i=t.from?t.from.length:0;let o=null;if(i>0){Be(i===1,65062);const w=t.from[0];w.allDescendants?o=w.collectionId:e=e.child(w.collectionId)}let l=[];t.where&&(l=(function(x){const A=f0(x);return A instanceof Qn&&zv(A)?A.getFilters():[A]})(t.where));let h=[];t.orderBy&&(h=(function(x){return x.map((A=>(function(W){return new hl(ko(W.field),(function($){switch($){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(W.direction))})(A)))})(t.orderBy));let f=null;t.limit&&(f=(function(x){let A;return A=typeof x=="object"?x.value:x,Vc(A)?null:A})(t.limit));let g=null;t.startAt&&(g=(function(x){const A=!!x.before,O=x.values||[];return new Ec(O,A)})(t.startAt));let _=null;return t.endAt&&(_=(function(x){const A=!x.before,O=x.values||[];return new Ec(O,A)})(t.endAt)),_x(e,o,h,l,f,"F",g,_)}function eA(r,e){const t=(function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return _e(28987,{purpose:o})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function f0(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const i=ko(t.unaryFilter.field);return gt.create(i,"==",{doubleValue:NaN});case"IS_NULL":const o=ko(t.unaryFilter.field);return gt.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const l=ko(t.unaryFilter.field);return gt.create(l,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const h=ko(t.unaryFilter.field);return gt.create(h,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return _e(61313);default:return _e(60726)}})(r):r.fieldFilter!==void 0?(function(t){return gt.create(ko(t.fieldFilter.field),(function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return _e(58110);default:return _e(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return Qn.create(t.compositeFilter.filters.map((i=>f0(i))),(function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return _e(1026)}})(t.compositeFilter.op))})(r):_e(30097,{filter:r})}function tA(r){return zx[r]}function nA(r){return $x[r]}function rA(r){return Wx[r]}function Co(r){return{fieldPath:r.canonicalString()}}function ko(r){return Vt.fromServerFormat(r.fieldPath)}function p0(r){return r instanceof gt?(function(t){if(t.op==="=="){if(Ly(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NAN"}};if(Vy(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Ly(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NOT_NAN"}};if(Vy(t.value))return{unaryFilter:{field:Co(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Co(t.field),op:nA(t.op),value:t.value}}})(r):r instanceof Qn?(function(t){const i=t.getFilters().map((o=>p0(o)));return i.length===1?i[0]:{compositeFilter:{op:rA(t.op),filters:i}}})(r):_e(54877,{filter:r})}function iA(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function m0(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(e,t,i,o,l=we.min(),h=we.min(),f=Lt.EMPTY_BYTE_STRING,g=null){this.target=e,this.targetId=t,this.purpose=i,this.sequenceNumber=o,this.snapshotVersion=l,this.lastLimboFreeSnapshotVersion=h,this.resumeToken=f,this.expectedCount=g}withSequenceNumber(e){return new Si(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Si(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Si(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Si(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sA{constructor(e){this.gt=e}}function oA(r){const e=Zx({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?wc(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aA{constructor(){this.Dn=new lA}addToCollectionParentIndex(e,t){return this.Dn.add(t),G.resolve()}getCollectionParents(e,t){return G.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return G.resolve()}deleteFieldIndex(e,t){return G.resolve()}deleteAllFieldIndexes(e){return G.resolve()}createTargetIndexes(e,t){return G.resolve()}getDocumentsMatchingTarget(e,t){return G.resolve(null)}getIndexType(e,t){return G.resolve(0)}getFieldIndexes(e,t){return G.resolve([])}getNextCollectionGroupToUpdate(e){return G.resolve(null)}getMinOffset(e,t){return G.resolve(bi.min())}getMinOffsetFromCollectionGroup(e,t){return G.resolve(bi.min())}updateCollectionGroup(e,t,i){return G.resolve()}updateIndexEntries(e,t){return G.resolve()}}class lA{constructor(){this.index={}}add(e){const t=e.lastSegment(),i=e.popLast(),o=this.index[t]||new It(Qe.comparator),l=!o.has(i);return this.index[t]=o.add(i),l}has(e){const t=e.lastSegment(),i=e.popLast(),o=this.index[t];return o&&o.has(i)}getEntries(e){return(this.index[e]||new It(Qe.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xy={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},g0=41943040;class ln{static withCacheSize(e){return new ln(e,ln.DEFAULT_COLLECTION_PERCENTILE,ln.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,i){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ln.DEFAULT_COLLECTION_PERCENTILE=10,ln.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,ln.DEFAULT=new ln(g0,ln.DEFAULT_COLLECTION_PERCENTILE,ln.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),ln.DISABLED=new ln(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fo{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new Fo(0)}static ur(){return new Fo(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yy="LruGarbageCollector",uA=1048576;function Jy([r,e],[t,i]){const o=xe(r,t);return o===0?xe(e,i):o}class cA{constructor(e){this.Tr=e,this.buffer=new It(Jy),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const i=this.buffer.last();Jy(t,i)<0&&(this.buffer=this.buffer.delete(i).add(t))}}get maxValue(){return this.buffer.last()[0]}}class hA{constructor(e,t,i){this.garbageCollector=e,this.asyncQueue=t,this.localStore=i,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){se(Yy,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Wo(t)?se(Yy,"Ignoring IndexedDB error during garbage collection: ",t):await $o(t)}await this.Rr(3e5)}))}}class dA{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((i=>Math.floor(t/100*i)))}nthSequenceNumber(e,t){if(t===0)return G.resolve(Oc.ue);const i=new cA(t);return this.Vr.forEachTarget(e,(o=>i.Er(o.sequenceNumber))).next((()=>this.Vr.gr(e,(o=>i.Er(o))))).next((()=>i.maxValue))}removeTargets(e,t,i){return this.Vr.removeTargets(e,t,i)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(se("LruGarbageCollector","Garbage collection skipped; disabled"),G.resolve(Xy)):this.getCacheSize(e).next((i=>i<this.params.cacheSizeCollectionThreshold?(se("LruGarbageCollector",`Garbage collection skipped; Cache size ${i} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Xy):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let i,o,l,h,f,g,_;const w=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((x=>(x>this.params.maximumSequenceNumbersToCollect?(se("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${x}`),o=this.params.maximumSequenceNumbersToCollect):o=x,h=Date.now(),this.nthSequenceNumber(e,o)))).next((x=>(i=x,f=Date.now(),this.removeTargets(e,i,t)))).next((x=>(l=x,g=Date.now(),this.removeOrphanedDocuments(e,i)))).next((x=>(_=Date.now(),Ao()<=ke.DEBUG&&se("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${h-w}ms
	Determined least recently used ${o} in `+(f-h)+`ms
	Removed ${l} targets in `+(g-f)+`ms
	Removed ${x} documents in `+(_-g)+`ms
Total Duration: ${_-w}ms`),G.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:l,documentsRemoved:x}))))}}function fA(r,e){return new dA(r,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pA{constructor(){this.changes=new bs((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ht.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const i=this.changes.get(t);return i!==void 0?G.resolve(i):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mA{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gA{constructor(e,t,i,o){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=i,this.indexManager=o}getDocument(e,t){let i=null;return this.documentOverlayCache.getOverlay(e,t).next((o=>(i=o,this.remoteDocumentCache.getEntry(e,t)))).next((o=>(i!==null&&nl(i.mutation,o,_n.empty(),Je.now()),o)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.getLocalViewOfDocuments(e,i,Pe()).next((()=>i))))}getLocalViewOfDocuments(e,t,i=Pe()){const o=vs();return this.populateOverlays(e,o,t).next((()=>this.computeViews(e,t,o,i).next((l=>{let h=Ka();return l.forEach(((f,g)=>{h=h.insert(f,g.overlayedDocument)})),h}))))}getOverlayedDocuments(e,t){const i=vs();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,Pe())))}populateOverlays(e,t,i){const o=[];return i.forEach((l=>{t.has(l)||o.push(l)})),this.documentOverlayCache.getOverlays(e,o).next((l=>{l.forEach(((h,f)=>{t.set(h,f)}))}))}computeViews(e,t,i,o){let l=Hr();const h=tl(),f=(function(){return tl()})();return t.forEach(((g,_)=>{const w=i.get(_.key);o.has(_.key)&&(w===void 0||w.mutation instanceof zi)?l=l.insert(_.key,_):w!==void 0?(h.set(_.key,w.mutation.getFieldMask()),nl(w.mutation,_,w.mutation.getFieldMask(),Je.now())):h.set(_.key,_n.empty())})),this.recalculateAndSaveOverlays(e,l).next((g=>(g.forEach(((_,w)=>h.set(_,w))),t.forEach(((_,w)=>{var x;return f.set(_,new mA(w,(x=h.get(_))!==null&&x!==void 0?x:null))})),f)))}recalculateAndSaveOverlays(e,t){const i=tl();let o=new rt(((h,f)=>h-f)),l=Pe();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((h=>{for(const f of h)f.keys().forEach((g=>{const _=t.get(g);if(_===null)return;let w=i.get(g)||_n.empty();w=f.applyToLocalView(_,w),i.set(g,w);const x=(o.get(f.batchId)||Pe()).add(g);o=o.insert(f.batchId,x)}))})).next((()=>{const h=[],f=o.getReverseIterator();for(;f.hasNext();){const g=f.getNext(),_=g.key,w=g.value,x=Yv();w.forEach((A=>{if(!l.has(A)){const O=r0(t.get(A),i.get(A));O!==null&&x.set(A,O),l=l.add(A)}})),h.push(this.documentOverlayCache.saveOverlays(e,_,x))}return G.waitFor(h)})).next((()=>i))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.recalculateAndSaveOverlays(e,i)))}getDocumentsMatchingQuery(e,t,i,o){return(function(h){return fe.isDocumentKey(h.path)&&h.collectionGroup===null&&h.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):qv(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,i,o):this.getDocumentsMatchingCollectionQuery(e,t,i,o)}getNextDocuments(e,t,i,o){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,i,o).next((l=>{const h=o-l.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,i.largestBatchId,o-l.size):G.resolve(vs());let f=al,g=l;return h.next((_=>G.forEach(_,((w,x)=>(f<x.largestBatchId&&(f=x.largestBatchId),l.get(w)?G.resolve():this.remoteDocumentCache.getEntry(e,w).next((A=>{g=g.insert(w,A)}))))).next((()=>this.populateOverlays(e,_,l))).next((()=>this.computeViews(e,g,_,Pe()))).next((w=>({batchId:f,changes:Xv(w)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new fe(t)).next((i=>{let o=Ka();return i.isFoundDocument()&&(o=o.insert(i.key,i)),o}))}getDocumentsMatchingCollectionGroupQuery(e,t,i,o){const l=t.collectionGroup;let h=Ka();return this.indexManager.getCollectionParents(e,l).next((f=>G.forEach(f,(g=>{const _=(function(x,A){return new Ho(A,null,x.explicitOrderBy.slice(),x.filters.slice(),x.limit,x.limitType,x.startAt,x.endAt)})(t,g.child(l));return this.getDocumentsMatchingCollectionQuery(e,_,i,o).next((w=>{w.forEach(((x,A)=>{h=h.insert(x,A)}))}))})).next((()=>h))))}getDocumentsMatchingCollectionQuery(e,t,i,o){let l;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,i.largestBatchId).next((h=>(l=h,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,i,l,o)))).next((h=>{l.forEach(((g,_)=>{const w=_.getKey();h.get(w)===null&&(h=h.insert(w,Ht.newInvalidDocument(w)))}));let f=Ka();return h.forEach(((g,_)=>{const w=l.get(g);w!==void 0&&nl(w.mutation,_,_n.empty(),Je.now()),jc(t,_)&&(f=f.insert(g,_))})),f}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yA{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return G.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(o){return{id:o.id,version:o.version,createTime:pr(o.createTime)}})(t)),G.resolve()}getNamedQuery(e,t){return G.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(o){return{name:o.name,query:oA(o.bundledQuery),readTime:pr(o.readTime)}})(t)),G.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _A{constructor(){this.overlays=new rt(fe.comparator),this.kr=new Map}getOverlay(e,t){return G.resolve(this.overlays.get(t))}getOverlays(e,t){const i=vs();return G.forEach(t,(o=>this.getOverlay(e,o).next((l=>{l!==null&&i.set(o,l)})))).next((()=>i))}saveOverlays(e,t,i){return i.forEach(((o,l)=>{this.wt(e,t,l)})),G.resolve()}removeOverlaysForBatchId(e,t,i){const o=this.kr.get(i);return o!==void 0&&(o.forEach((l=>this.overlays=this.overlays.remove(l))),this.kr.delete(i)),G.resolve()}getOverlaysForCollection(e,t,i){const o=vs(),l=t.length+1,h=new fe(t.child("")),f=this.overlays.getIteratorFrom(h);for(;f.hasNext();){const g=f.getNext().value,_=g.getKey();if(!t.isPrefixOf(_.path))break;_.path.length===l&&g.largestBatchId>i&&o.set(g.getKey(),g)}return G.resolve(o)}getOverlaysForCollectionGroup(e,t,i,o){let l=new rt(((_,w)=>_-w));const h=this.overlays.getIterator();for(;h.hasNext();){const _=h.getNext().value;if(_.getKey().getCollectionGroup()===t&&_.largestBatchId>i){let w=l.get(_.largestBatchId);w===null&&(w=vs(),l=l.insert(_.largestBatchId,w)),w.set(_.getKey(),_)}}const f=vs(),g=l.getIterator();for(;g.hasNext()&&(g.getNext().value.forEach(((_,w)=>f.set(_,w))),!(f.size()>=o)););return G.resolve(f)}wt(e,t,i){const o=this.overlays.get(i.key);if(o!==null){const h=this.kr.get(o.largestBatchId).delete(i.key);this.kr.set(o.largestBatchId,h)}this.overlays=this.overlays.insert(i.key,new Mx(t,i));let l=this.kr.get(t);l===void 0&&(l=Pe(),this.kr.set(t,l)),this.kr.set(t,l.add(i.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vA{constructor(){this.sessionToken=Lt.EMPTY_BYTE_STRING}getSessionToken(e){return G.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,G.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wf{constructor(){this.qr=new It(kt.Qr),this.$r=new It(kt.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const i=new kt(e,t);this.qr=this.qr.add(i),this.$r=this.$r.add(i)}Kr(e,t){e.forEach((i=>this.addReference(i,t)))}removeReference(e,t){this.Wr(new kt(e,t))}Gr(e,t){e.forEach((i=>this.removeReference(i,t)))}zr(e){const t=new fe(new Qe([])),i=new kt(t,e),o=new kt(t,e+1),l=[];return this.$r.forEachInRange([i,o],(h=>{this.Wr(h),l.push(h.key)})),l}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new fe(new Qe([])),i=new kt(t,e),o=new kt(t,e+1);let l=Pe();return this.$r.forEachInRange([i,o],(h=>{l=l.add(h.key)})),l}containsKey(e){const t=new kt(e,0),i=this.qr.firstAfterOrEqual(t);return i!==null&&e.isEqual(i.key)}}class kt{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return fe.comparator(e.key,t.key)||xe(e.Hr,t.Hr)}static Ur(e,t){return xe(e.Hr,t.Hr)||fe.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EA{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new It(kt.Qr)}checkEmpty(e){return G.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,i,o){const l=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const h=new Lx(l,t,i,o);this.mutationQueue.push(h);for(const f of o)this.Yr=this.Yr.add(new kt(f.key,l)),this.indexManager.addToCollectionParentIndex(e,f.key.path.popLast());return G.resolve(h)}lookupMutationBatch(e,t){return G.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const i=t+1,o=this.Xr(i),l=o<0?0:o;return G.resolve(this.mutationQueue.length>l?this.mutationQueue[l]:null)}getHighestUnacknowledgedBatchId(){return G.resolve(this.mutationQueue.length===0?Of:this.er-1)}getAllMutationBatches(e){return G.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const i=new kt(t,0),o=new kt(t,Number.POSITIVE_INFINITY),l=[];return this.Yr.forEachInRange([i,o],(h=>{const f=this.Zr(h.Hr);l.push(f)})),G.resolve(l)}getAllMutationBatchesAffectingDocumentKeys(e,t){let i=new It(xe);return t.forEach((o=>{const l=new kt(o,0),h=new kt(o,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([l,h],(f=>{i=i.add(f.Hr)}))})),G.resolve(this.ei(i))}getAllMutationBatchesAffectingQuery(e,t){const i=t.path,o=i.length+1;let l=i;fe.isDocumentKey(l)||(l=l.child(""));const h=new kt(new fe(l),0);let f=new It(xe);return this.Yr.forEachWhile((g=>{const _=g.key.path;return!!i.isPrefixOf(_)&&(_.length===o&&(f=f.add(g.Hr)),!0)}),h),G.resolve(this.ei(f))}ei(e){const t=[];return e.forEach((i=>{const o=this.Zr(i);o!==null&&t.push(o)})),t}removeMutationBatch(e,t){Be(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let i=this.Yr;return G.forEach(t.mutations,(o=>{const l=new kt(o.key,t.batchId);return i=i.delete(l),this.referenceDelegate.markPotentiallyOrphaned(e,o.key)})).next((()=>{this.Yr=i}))}rr(e){}containsKey(e,t){const i=new kt(t,0),o=this.Yr.firstAfterOrEqual(i);return G.resolve(t.isEqual(o&&o.key))}performConsistencyCheck(e){return this.mutationQueue.length,G.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wA{constructor(e){this.ni=e,this.docs=(function(){return new rt(fe.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const i=t.key,o=this.docs.get(i),l=o?o.size:0,h=this.ni(t);return this.docs=this.docs.insert(i,{document:t.mutableCopy(),size:h}),this.size+=h-l,this.indexManager.addToCollectionParentIndex(e,i.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const i=this.docs.get(t);return G.resolve(i?i.document.mutableCopy():Ht.newInvalidDocument(t))}getEntries(e,t){let i=Hr();return t.forEach((o=>{const l=this.docs.get(o);i=i.insert(o,l?l.document.mutableCopy():Ht.newInvalidDocument(o))})),G.resolve(i)}getDocumentsMatchingQuery(e,t,i,o){let l=Hr();const h=t.path,f=new fe(h.child("__id-9223372036854775808__")),g=this.docs.getIteratorFrom(f);for(;g.hasNext();){const{key:_,value:{document:w}}=g.getNext();if(!h.isPrefixOf(_.path))break;_.path.length>h.length+1||XS(QS(w),i)<=0||(o.has(w.key)||jc(t,w))&&(l=l.insert(w.key,w.mutableCopy()))}return G.resolve(l)}getAllFromCollectionGroup(e,t,i,o){_e(9500)}ri(e,t){return G.forEach(this.docs,(i=>t(i)))}newChangeBuffer(e){return new TA(this)}getSize(e){return G.resolve(this.size)}}class TA extends pA{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((i,o)=>{o.isValidDocument()?t.push(this.Or.addEntry(e,o)):this.Or.removeEntry(i)})),G.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IA{constructor(e){this.persistence=e,this.ii=new bs((t=>Mf(t)),jf),this.lastRemoteSnapshotVersion=we.min(),this.highestTargetId=0,this.si=0,this.oi=new Wf,this.targetCount=0,this._i=Fo.ar()}forEachTarget(e,t){return this.ii.forEach(((i,o)=>t(o))),G.resolve()}getLastRemoteSnapshotVersion(e){return G.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return G.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),G.resolve(this.highestTargetId)}setTargetsMetadata(e,t,i){return i&&(this.lastRemoteSnapshotVersion=i),t>this.si&&(this.si=t),G.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new Fo(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,G.resolve()}updateTargetData(e,t){return this.hr(t),G.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,G.resolve()}removeTargets(e,t,i){let o=0;const l=[];return this.ii.forEach(((h,f)=>{f.sequenceNumber<=t&&i.get(f.targetId)===null&&(this.ii.delete(h),l.push(this.removeMatchingKeysForTargetId(e,f.targetId)),o++)})),G.waitFor(l).next((()=>o))}getTargetCount(e){return G.resolve(this.targetCount)}getTargetData(e,t){const i=this.ii.get(t)||null;return G.resolve(i)}addMatchingKeys(e,t,i){return this.oi.Kr(t,i),G.resolve()}removeMatchingKeys(e,t,i){this.oi.Gr(t,i);const o=this.persistence.referenceDelegate,l=[];return o&&t.forEach((h=>{l.push(o.markPotentiallyOrphaned(e,h))})),G.waitFor(l)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),G.resolve()}getMatchingKeysForTargetId(e,t){const i=this.oi.Jr(t);return G.resolve(i)}containsKey(e,t){return G.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y0{constructor(e,t){this.ai={},this.overlays={},this.ui=new Oc(0),this.ci=!1,this.ci=!0,this.li=new vA,this.referenceDelegate=e(this),this.hi=new IA(this),this.indexManager=new aA,this.remoteDocumentCache=(function(o){return new wA(o)})((i=>this.referenceDelegate.Pi(i))),this.serializer=new sA(t),this.Ti=new yA(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new _A,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let i=this.ai[e.toKey()];return i||(i=new EA(t,this.referenceDelegate),this.ai[e.toKey()]=i),i}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,i){se("MemoryPersistence","Starting transaction:",e);const o=new SA(this.ui.next());return this.referenceDelegate.Ii(),i(o).next((l=>this.referenceDelegate.di(o).next((()=>l)))).toPromise().then((l=>(o.raiseOnCommittedEvent(),l)))}Ei(e,t){return G.or(Object.values(this.ai).map((i=>()=>i.containsKey(e,t))))}}class SA extends JS{constructor(e){super(),this.currentSequenceNumber=e}}class Hf{constructor(e){this.persistence=e,this.Ai=new Wf,this.Ri=null}static Vi(e){return new Hf(e)}get mi(){if(this.Ri)return this.Ri;throw _e(60996)}addReference(e,t,i){return this.Ai.addReference(i,t),this.mi.delete(i.toString()),G.resolve()}removeReference(e,t,i){return this.Ai.removeReference(i,t),this.mi.add(i.toString()),G.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),G.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((o=>this.mi.add(o.toString())));const i=this.persistence.getTargetCache();return i.getMatchingKeysForTargetId(e,t.targetId).next((o=>{o.forEach((l=>this.mi.add(l.toString())))})).next((()=>i.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return G.forEach(this.mi,(i=>{const o=fe.fromPath(i);return this.fi(e,o).next((l=>{l||t.removeEntry(o,we.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((i=>{i?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return G.or([()=>G.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Sc{constructor(e,t){this.persistence=e,this.gi=new bs((i=>tx(i.path)),((i,o)=>i.isEqual(o))),this.garbageCollector=fA(this,t)}static Vi(e,t){return new Sc(e,t)}Ii(){}di(e){return G.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((i=>t.next((o=>i+o))))}yr(e){let t=0;return this.gr(e,(i=>{t++})).next((()=>t))}gr(e,t){return G.forEach(this.gi,((i,o)=>this.Sr(e,i,o).next((l=>l?G.resolve():t(o)))))}removeTargets(e,t,i){return this.persistence.getTargetCache().removeTargets(e,t,i)}removeOrphanedDocuments(e,t){let i=0;const o=this.persistence.getRemoteDocumentCache(),l=o.newChangeBuffer();return o.ri(e,(h=>this.Sr(e,h,t).next((f=>{f||(i++,l.removeEntry(h,we.min()))})))).next((()=>l.apply(e))).next((()=>i))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),G.resolve()}removeTarget(e,t){const i=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,i)}addReference(e,t,i){return this.gi.set(i,e.currentSequenceNumber),G.resolve()}removeReference(e,t,i){return this.gi.set(i,e.currentSequenceNumber),G.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),G.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ic(e.data.value)),t}Sr(e,t,i){return G.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const o=this.gi.get(t);return G.resolve(o!==void 0&&o>i)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qf{constructor(e,t,i,o){this.targetId=e,this.fromCache=t,this.Is=i,this.ds=o}static Es(e,t){let i=Pe(),o=Pe();for(const l of t.docChanges)switch(l.type){case 0:i=i.add(l.doc.key);break;case 1:o=o.add(l.doc.key)}return new qf(e,t.fromCache,i,o)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xA{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AA{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return nT()?8:ZS(qt())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,i,o){const l={result:null};return this.ps(e,t).next((h=>{l.result=h})).next((()=>{if(!l.result)return this.ys(e,t,o,i).next((h=>{l.result=h}))})).next((()=>{if(l.result)return;const h=new xA;return this.ws(e,t,h).next((f=>{if(l.result=f,this.Rs)return this.Ss(e,t,h,f.size)}))})).next((()=>l.result))}Ss(e,t,i,o){return i.documentReadCount<this.Vs?(Ao()<=ke.DEBUG&&se("QueryEngine","SDK will not create cache indexes for query:",Ro(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),G.resolve()):(Ao()<=ke.DEBUG&&se("QueryEngine","Query:",Ro(t),"scans",i.documentReadCount,"local documents and returns",o,"documents as results."),i.documentReadCount>this.fs*o?(Ao()<=ke.DEBUG&&se("QueryEngine","The SDK decides to create cache indexes for query:",Ro(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,fr(t))):G.resolve())}ps(e,t){if(Uy(t))return G.resolve(null);let i=fr(t);return this.indexManager.getIndexType(e,i).next((o=>o===0?null:(t.limit!==null&&o===1&&(t=wc(t,null,"F"),i=fr(t)),this.indexManager.getDocumentsMatchingTarget(e,i).next((l=>{const h=Pe(...l);return this.gs.getDocuments(e,h).next((f=>this.indexManager.getMinOffset(e,i).next((g=>{const _=this.bs(t,f);return this.Ds(t,_,h,g.readTime)?this.ps(e,wc(t,null,"F")):this.vs(e,_,t,g)}))))})))))}ys(e,t,i,o){return Uy(t)||o.isEqual(we.min())?G.resolve(null):this.gs.getDocuments(e,i).next((l=>{const h=this.bs(t,l);return this.Ds(t,h,i,o)?G.resolve(null):(Ao()<=ke.DEBUG&&se("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),Ro(t)),this.vs(e,h,t,KS(o,al)).next((f=>f)))}))}bs(e,t){let i=new It(Kv(e));return t.forEach(((o,l)=>{jc(e,l)&&(i=i.add(l))})),i}Ds(e,t,i,o){if(e.limit===null)return!1;if(i.size!==t.size)return!0;const l=e.limitType==="F"?t.last():t.first();return!!l&&(l.hasPendingWrites||l.version.compareTo(o)>0)}ws(e,t,i){return Ao()<=ke.DEBUG&&se("QueryEngine","Using full collection scan to execute query:",Ro(t)),this.gs.getDocumentsMatchingQuery(e,t,bi.min(),i)}vs(e,t,i,o){return this.gs.getDocumentsMatchingQuery(e,i,o).next((l=>(t.forEach((h=>{l=l.insert(h.key,h)})),l)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gf="LocalStore",RA=3e8;class CA{constructor(e,t,i,o){this.persistence=e,this.Cs=t,this.serializer=o,this.Fs=new rt(xe),this.Ms=new bs((l=>Mf(l)),jf),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(i)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new gA(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function kA(r,e,t,i){return new CA(r,e,t,i)}async function _0(r,e){const t=Te(r);return await t.persistence.runTransaction("Handle user change","readonly",(i=>{let o;return t.mutationQueue.getAllMutationBatches(i).next((l=>(o=l,t.Ns(e),t.mutationQueue.getAllMutationBatches(i)))).next((l=>{const h=[],f=[];let g=Pe();for(const _ of o){h.push(_.batchId);for(const w of _.mutations)g=g.add(w.key)}for(const _ of l){f.push(_.batchId);for(const w of _.mutations)g=g.add(w.key)}return t.localDocuments.getDocuments(i,g).next((_=>({Bs:_,removedBatchIds:h,addedBatchIds:f})))}))}))}function PA(r,e){const t=Te(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(i=>{const o=e.batch.keys(),l=t.Os.newChangeBuffer({trackRemovals:!0});return(function(f,g,_,w){const x=_.batch,A=x.keys();let O=G.resolve();return A.forEach((W=>{O=O.next((()=>w.getEntry(g,W))).next((q=>{const $=_.docVersions.get(W);Be($!==null,48541),q.version.compareTo($)<0&&(x.applyToRemoteDocument(q,_),q.isValidDocument()&&(q.setReadTime(_.commitVersion),w.addEntry(q)))}))})),O.next((()=>f.mutationQueue.removeMutationBatch(g,x)))})(t,i,e,l).next((()=>l.apply(i))).next((()=>t.mutationQueue.performConsistencyCheck(i))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(i,o,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(i,(function(f){let g=Pe();for(let _=0;_<f.mutationResults.length;++_)f.mutationResults[_].transformResults.length>0&&(g=g.add(f.batch.mutations[_].key));return g})(e)))).next((()=>t.localDocuments.getDocuments(i,o)))}))}function v0(r){const e=Te(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function bA(r,e){const t=Te(r),i=e.snapshotVersion;let o=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(l=>{const h=t.Os.newChangeBuffer({trackRemovals:!0});o=t.Fs;const f=[];e.targetChanges.forEach(((w,x)=>{const A=o.get(x);if(!A)return;f.push(t.hi.removeMatchingKeys(l,w.removedDocuments,x).next((()=>t.hi.addMatchingKeys(l,w.addedDocuments,x))));let O=A.withSequenceNumber(l.currentSequenceNumber);e.targetMismatches.get(x)!==null?O=O.withResumeToken(Lt.EMPTY_BYTE_STRING,we.min()).withLastLimboFreeSnapshotVersion(we.min()):w.resumeToken.approximateByteSize()>0&&(O=O.withResumeToken(w.resumeToken,i)),o=o.insert(x,O),(function(q,$,he){return q.resumeToken.approximateByteSize()===0||$.snapshotVersion.toMicroseconds()-q.snapshotVersion.toMicroseconds()>=RA?!0:he.addedDocuments.size+he.modifiedDocuments.size+he.removedDocuments.size>0})(A,O,w)&&f.push(t.hi.updateTargetData(l,O))}));let g=Hr(),_=Pe();if(e.documentUpdates.forEach((w=>{e.resolvedLimboDocuments.has(w)&&f.push(t.persistence.referenceDelegate.updateLimboDocument(l,w))})),f.push(DA(l,h,e.documentUpdates).next((w=>{g=w.Ls,_=w.ks}))),!i.isEqual(we.min())){const w=t.hi.getLastRemoteSnapshotVersion(l).next((x=>t.hi.setTargetsMetadata(l,l.currentSequenceNumber,i)));f.push(w)}return G.waitFor(f).next((()=>h.apply(l))).next((()=>t.localDocuments.getLocalViewOfDocuments(l,g,_))).next((()=>g))})).then((l=>(t.Fs=o,l)))}function DA(r,e,t){let i=Pe(),o=Pe();return t.forEach((l=>i=i.add(l))),e.getEntries(r,i).next((l=>{let h=Hr();return t.forEach(((f,g)=>{const _=l.get(f);g.isFoundDocument()!==_.isFoundDocument()&&(o=o.add(f)),g.isNoDocument()&&g.version.isEqual(we.min())?(e.removeEntry(f,g.readTime),h=h.insert(f,g)):!_.isValidDocument()||g.version.compareTo(_.version)>0||g.version.compareTo(_.version)===0&&_.hasPendingWrites?(e.addEntry(g),h=h.insert(f,g)):se(Gf,"Ignoring outdated watch update for ",f,". Current version:",_.version," Watch version:",g.version)})),{Ls:h,ks:o}}))}function NA(r,e){const t=Te(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(i=>(e===void 0&&(e=Of),t.mutationQueue.getNextMutationBatchAfterBatchId(i,e))))}function OA(r,e){const t=Te(r);return t.persistence.runTransaction("Allocate target","readwrite",(i=>{let o;return t.hi.getTargetData(i,e).next((l=>l?(o=l,G.resolve(o)):t.hi.allocateTargetId(i).next((h=>(o=new Si(e,h,"TargetPurposeListen",i.currentSequenceNumber),t.hi.addTargetData(i,o).next((()=>o)))))))})).then((i=>{const o=t.Fs.get(i.targetId);return(o===null||i.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(i.targetId,i),t.Ms.set(e,i.targetId)),i}))}async function uf(r,e,t){const i=Te(r),o=i.Fs.get(e),l=t?"readwrite":"readwrite-primary";try{t||await i.persistence.runTransaction("Release target",l,(h=>i.persistence.referenceDelegate.removeTarget(h,o)))}catch(h){if(!Wo(h))throw h;se(Gf,`Failed to update sequence numbers for target ${e}: ${h}`)}i.Fs=i.Fs.remove(e),i.Ms.delete(o.target)}function Zy(r,e,t){const i=Te(r);let o=we.min(),l=Pe();return i.persistence.runTransaction("Execute query","readwrite",(h=>(function(g,_,w){const x=Te(g),A=x.Ms.get(w);return A!==void 0?G.resolve(x.Fs.get(A)):x.hi.getTargetData(_,w)})(i,h,fr(e)).next((f=>{if(f)return o=f.lastLimboFreeSnapshotVersion,i.hi.getMatchingKeysForTargetId(h,f.targetId).next((g=>{l=g}))})).next((()=>i.Cs.getDocumentsMatchingQuery(h,e,t?o:we.min(),t?l:Pe()))).next((f=>(VA(i,Ex(e),f),{documents:f,qs:l})))))}function VA(r,e,t){let i=r.xs.get(e)||we.min();t.forEach(((o,l)=>{l.readTime.compareTo(i)>0&&(i=l.readTime)})),r.xs.set(e,i)}class e_{constructor(){this.activeTargetIds=Ax()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class LA{constructor(){this.Fo=new e_,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,i){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,i){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new e_,Promise.resolve()}handleUserChange(e,t,i){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MA{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t_="ConnectivityMonitor";class n_{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){se(t_,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){se(t_,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Xu=null;function cf(){return Xu===null?Xu=(function(){return 268435456+Math.round(2147483648*Math.random())})():Xu++,"0x"+Xu.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Md="RestConnection",jA={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class FA{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${i}/databases/${o}`,this.Ko=this.databaseId.database===_c?`project_id=${i}`:`project_id=${i}&database_id=${o}`}Wo(e,t,i,o,l){const h=cf(),f=this.Go(e,t.toUriEncodedString());se(Md,`Sending RPC '${e}' ${h}:`,f,i);const g={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(g,o,l);const{host:_}=new URL(f),w=ji(_);return this.jo(e,f,g,i,w).then((x=>(se(Md,`Received RPC '${e}' ${h}: `,x),x)),(x=>{throw Pi(Md,`RPC '${e}' ${h} failed with error: `,x,"url: ",f,"request:",i),x}))}Jo(e,t,i,o,l,h){return this.Wo(e,t,i,o,l)}zo(e,t,i){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+zo})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((o,l)=>e[l]=o)),i&&i.headers.forEach(((o,l)=>e[l]=o))}Go(e,t){const i=jA[e];return`${this.$o}/v1/${t}:${i}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UA{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $t="WebChannelConnection";class BA extends FA{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,i,o,l){const h=cf();return new Promise(((f,g)=>{const _=new Ev;_.setWithCredentials(!0),_.listenOnce(wv.COMPLETE,(()=>{try{switch(_.getLastErrorCode()){case rc.NO_ERROR:const x=_.getResponseJson();se($t,`XHR for RPC '${e}' ${h} received:`,JSON.stringify(x)),f(x);break;case rc.TIMEOUT:se($t,`RPC '${e}' ${h} timed out`),g(new ne(H.DEADLINE_EXCEEDED,"Request time out"));break;case rc.HTTP_ERROR:const A=_.getStatus();if(se($t,`RPC '${e}' ${h} failed with status:`,A,"response text:",_.getResponseText()),A>0){let O=_.getResponseJson();Array.isArray(O)&&(O=O[0]);const W=O==null?void 0:O.error;if(W&&W.status&&W.message){const q=(function(he){const M=he.toLowerCase().replace(/_/g,"-");return Object.values(H).indexOf(M)>=0?M:H.UNKNOWN})(W.status);g(new ne(q,W.message))}else g(new ne(H.UNKNOWN,"Server responded with status "+_.getStatus()))}else g(new ne(H.UNAVAILABLE,"Connection failed."));break;default:_e(9055,{c_:e,streamId:h,l_:_.getLastErrorCode(),h_:_.getLastError()})}}finally{se($t,`RPC '${e}' ${h} completed.`)}}));const w=JSON.stringify(o);se($t,`RPC '${e}' ${h} sending request:`,o),_.send(t,"POST",w,i,15)}))}P_(e,t,i){const o=cf(),l=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],h=Sv(),f=Iv(),g={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},_=this.longPollingOptions.timeoutSeconds;_!==void 0&&(g.longPollingTimeout=Math.round(1e3*_)),this.useFetchStreams&&(g.useFetchStreams=!0),this.zo(g.initMessageHeaders,t,i),g.encodeInitMessageHeaders=!0;const w=l.join("");se($t,`Creating RPC '${e}' stream ${o}: ${w}`,g);const x=h.createWebChannel(w,g);this.T_(x);let A=!1,O=!1;const W=new UA({Ho:$=>{O?se($t,`Not sending because RPC '${e}' stream ${o} is closed:`,$):(A||(se($t,`Opening RPC '${e}' stream ${o} transport.`),x.open(),A=!0),se($t,`RPC '${e}' stream ${o} sending:`,$),x.send($))},Yo:()=>x.close()}),q=($,he,M)=>{$.listen(he,(J=>{try{M(J)}catch(re){setTimeout((()=>{throw re}),0)}}))};return q(x,Ga.EventType.OPEN,(()=>{O||(se($t,`RPC '${e}' stream ${o} transport opened.`),W.s_())})),q(x,Ga.EventType.CLOSE,(()=>{O||(O=!0,se($t,`RPC '${e}' stream ${o} transport closed`),W.__(),this.I_(x))})),q(x,Ga.EventType.ERROR,($=>{O||(O=!0,Pi($t,`RPC '${e}' stream ${o} transport errored. Name:`,$.name,"Message:",$.message),W.__(new ne(H.UNAVAILABLE,"The operation could not be completed")))})),q(x,Ga.EventType.MESSAGE,($=>{var he;if(!O){const M=$.data[0];Be(!!M,16349);const J=M,re=(J==null?void 0:J.error)||((he=J[0])===null||he===void 0?void 0:he.error);if(re){se($t,`RPC '${e}' stream ${o} received error:`,re);const Ce=re.status;let Ee=(function(C){const P=mt[C];if(P!==void 0)return o0(P)})(Ce),D=re.message;Ee===void 0&&(Ee=H.INTERNAL,D="Unknown error status: "+Ce+" with message "+re.message),O=!0,W.__(new ne(Ee,D)),x.close()}else se($t,`RPC '${e}' stream ${o} received:`,M),W.a_(M)}})),q(f,Tv.STAT_EVENT,($=>{$.stat===Yd.PROXY?se($t,`RPC '${e}' stream ${o} detected buffering proxy`):$.stat===Yd.NOPROXY&&se($t,`RPC '${e}' stream ${o} detected no buffering proxy`)})),setTimeout((()=>{W.o_()}),0),W}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function jd(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zc(r){return new Hx(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E0{constructor(e,t,i=1e3,o=1.5,l=6e4){this.Fi=e,this.timerId=t,this.d_=i,this.E_=o,this.A_=l,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),i=Math.max(0,Date.now()-this.m_),o=Math.max(0,t-i);o>0&&se("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${i} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,o,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const r_="PersistentStream";class w0{constructor(e,t,i,o,l,h,f,g){this.Fi=e,this.w_=i,this.S_=o,this.connection=l,this.authCredentialsProvider=h,this.appCheckCredentialsProvider=f,this.listener=g,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new E0(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===H.RESOURCE_EXHAUSTED?(Wr(t.toString()),Wr("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===H.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([i,o])=>{this.b_===t&&this.W_(i,o)}),(i=>{e((()=>{const o=new ne(H.UNKNOWN,"Fetching auth token failed: "+i.message);return this.G_(o)}))}))}W_(e,t){const i=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{i((()=>this.listener.Zo()))})),this.stream.e_((()=>{i((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((o=>{i((()=>this.G_(o)))})),this.stream.onMessage((o=>{i((()=>++this.C_==1?this.j_(o):this.onNext(o)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return se(r_,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(se(r_,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class zA extends w0{constructor(e,t,i,o,l,h){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,i,o,h),this.serializer=l}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=Kx(this.serializer,e),i=(function(l){if(!("targetChange"in l))return we.min();const h=l.targetChange;return h.targetIds&&h.targetIds.length?we.min():h.readTime?pr(h.readTime):we.min()})(e);return this.listener.J_(t,i)}H_(e){const t={};t.database=lf(this.serializer),t.addTarget=(function(l,h){let f;const g=h.target;if(f=nf(g)?{documents:Yx(l,g)}:{query:Jx(l,g).Vt},f.targetId=h.targetId,h.resumeToken.approximateByteSize()>0){f.resumeToken=u0(l,h.resumeToken);const _=sf(l,h.expectedCount);_!==null&&(f.expectedCount=_)}else if(h.snapshotVersion.compareTo(we.min())>0){f.readTime=Ic(l,h.snapshotVersion.toTimestamp());const _=sf(l,h.expectedCount);_!==null&&(f.expectedCount=_)}return f})(this.serializer,e);const i=eA(this.serializer,e);i&&(t.labels=i),this.k_(t)}Y_(e){const t={};t.database=lf(this.serializer),t.removeTarget=e,this.k_(t)}}class $A extends w0{constructor(e,t,i,o,l,h){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,i,o,h),this.serializer=l}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Be(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Be(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){Be(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=Xx(e.writeResults,e.commitTime),i=pr(e.commitTime);return this.listener.ta(i,t)}na(){const e={};e.database=lf(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((i=>Qx(this.serializer,i)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WA{}class HA extends WA{constructor(e,t,i,o){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=i,this.serializer=o,this.ra=!1}ia(){if(this.ra)throw new ne(H.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,i,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,h])=>this.connection.Wo(e,of(t,i),o,l,h))).catch((l=>{throw l.name==="FirebaseError"?(l.code===H.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new ne(H.UNKNOWN,l.toString())}))}Jo(e,t,i,o,l){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([h,f])=>this.connection.Jo(e,of(t,i),o,h,f,l))).catch((h=>{throw h.name==="FirebaseError"?(h.code===H.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),h):new ne(H.UNKNOWN,h.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class qA{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Wr(t),this._a=!1):se("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rs="RemoteStore";class GA{constructor(e,t,i,o,l){this.localStore=e,this.datastore=t,this.asyncQueue=i,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=l,this.Ea.xo((h=>{i.enqueueAndForget((async()=>{Ds(this)&&(se(Rs,"Restarting streams for network reachability change."),await(async function(g){const _=Te(g);_.Ia.add(4),await Sl(_),_.Aa.set("Unknown"),_.Ia.delete(4),await $c(_)})(this))}))})),this.Aa=new qA(i,o)}}async function $c(r){if(Ds(r))for(const e of r.da)await e(!0)}async function Sl(r){for(const e of r.da)await e(!1)}function T0(r,e){const t=Te(r);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),Yf(t)?Xf(t):qo(t).x_()&&Qf(t,e))}function Kf(r,e){const t=Te(r),i=qo(t);t.Ta.delete(e),i.x_()&&I0(t,e),t.Ta.size===0&&(i.x_()?i.B_():Ds(t)&&t.Aa.set("Unknown"))}function Qf(r,e){if(r.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(we.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}qo(r).H_(e)}function I0(r,e){r.Ra.$e(e),qo(r).Y_(e)}function Xf(r){r.Ra=new Bx({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>r.Ta.get(e)||null,lt:()=>r.datastore.serializer.databaseId}),qo(r).start(),r.Aa.aa()}function Yf(r){return Ds(r)&&!qo(r).M_()&&r.Ta.size>0}function Ds(r){return Te(r).Ia.size===0}function S0(r){r.Ra=void 0}async function KA(r){r.Aa.set("Online")}async function QA(r){r.Ta.forEach(((e,t)=>{Qf(r,e)}))}async function XA(r,e){S0(r),Yf(r)?(r.Aa.la(e),Xf(r)):r.Aa.set("Unknown")}async function YA(r,e,t){if(r.Aa.set("Online"),e instanceof l0&&e.state===2&&e.cause)try{await(async function(o,l){const h=l.cause;for(const f of l.targetIds)o.Ta.has(f)&&(await o.remoteSyncer.rejectListen(f,h),o.Ta.delete(f),o.Ra.removeTarget(f))})(r,e)}catch(i){se(Rs,"Failed to remove targets %s: %s ",e.targetIds.join(","),i),await xc(r,i)}else if(e instanceof ac?r.Ra.Ye(e):e instanceof a0?r.Ra.it(e):r.Ra.et(e),!t.isEqual(we.min()))try{const i=await v0(r.localStore);t.compareTo(i)>=0&&await(function(l,h){const f=l.Ra.Pt(h);return f.targetChanges.forEach(((g,_)=>{if(g.resumeToken.approximateByteSize()>0){const w=l.Ta.get(_);w&&l.Ta.set(_,w.withResumeToken(g.resumeToken,h))}})),f.targetMismatches.forEach(((g,_)=>{const w=l.Ta.get(g);if(!w)return;l.Ta.set(g,w.withResumeToken(Lt.EMPTY_BYTE_STRING,w.snapshotVersion)),I0(l,g);const x=new Si(w.target,g,_,w.sequenceNumber);Qf(l,x)})),l.remoteSyncer.applyRemoteEvent(f)})(r,t)}catch(i){se(Rs,"Failed to raise snapshot:",i),await xc(r,i)}}async function xc(r,e,t){if(!Wo(e))throw e;r.Ia.add(1),await Sl(r),r.Aa.set("Offline"),t||(t=()=>v0(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{se(Rs,"Retrying IndexedDB access"),await t(),r.Ia.delete(1),await $c(r)}))}function x0(r,e){return e().catch((t=>xc(r,t,e)))}async function Wc(r){const e=Te(r),t=Vi(e);let i=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Of;for(;JA(e);)try{const o=await NA(e.localStore,i);if(o===null){e.Pa.length===0&&t.B_();break}i=o.batchId,ZA(e,o)}catch(o){await xc(e,o)}A0(e)&&R0(e)}function JA(r){return Ds(r)&&r.Pa.length<10}function ZA(r,e){r.Pa.push(e);const t=Vi(r);t.x_()&&t.Z_&&t.X_(e.mutations)}function A0(r){return Ds(r)&&!Vi(r).M_()&&r.Pa.length>0}function R0(r){Vi(r).start()}async function eR(r){Vi(r).na()}async function tR(r){const e=Vi(r);for(const t of r.Pa)e.X_(t.mutations)}async function nR(r,e,t){const i=r.Pa.shift(),o=Bf.from(i,e,t);await x0(r,(()=>r.remoteSyncer.applySuccessfulWrite(o))),await Wc(r)}async function rR(r,e){e&&Vi(r).Z_&&await(async function(i,o){if((function(h){return Fx(h)&&h!==H.ABORTED})(o.code)){const l=i.Pa.shift();Vi(i).N_(),await x0(i,(()=>i.remoteSyncer.rejectFailedWrite(l.batchId,o))),await Wc(i)}})(r,e),A0(r)&&R0(r)}async function i_(r,e){const t=Te(r);t.asyncQueue.verifyOperationInProgress(),se(Rs,"RemoteStore received new credentials");const i=Ds(t);t.Ia.add(3),await Sl(t),i&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await $c(t)}async function iR(r,e){const t=Te(r);e?(t.Ia.delete(2),await $c(t)):e||(t.Ia.add(2),await Sl(t),t.Aa.set("Unknown"))}function qo(r){return r.Va||(r.Va=(function(t,i,o){const l=Te(t);return l.ia(),new zA(i,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Zo:KA.bind(null,r),e_:QA.bind(null,r),n_:XA.bind(null,r),J_:YA.bind(null,r)}),r.da.push((async e=>{e?(r.Va.N_(),Yf(r)?Xf(r):r.Aa.set("Unknown")):(await r.Va.stop(),S0(r))}))),r.Va}function Vi(r){return r.ma||(r.ma=(function(t,i,o){const l=Te(t);return l.ia(),new $A(i,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Zo:()=>Promise.resolve(),e_:eR.bind(null,r),n_:rR.bind(null,r),ea:tR.bind(null,r),ta:nR.bind(null,r)}),r.da.push((async e=>{e?(r.ma.N_(),await Wc(r)):(await r.ma.stop(),r.Pa.length>0&&(se(Rs,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))}))),r.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jf{constructor(e,t,i,o,l){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=i,this.op=o,this.removalCallback=l,this.deferred=new Br,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((h=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,i,o,l){const h=Date.now()+i,f=new Jf(e,t,h,o,l);return f.start(i),f}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new ne(H.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Zf(r,e){if(Wr("AsyncQueue",`${e}: ${r}`),Wo(r))return new ne(H.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oo{static emptySet(e){return new Oo(e.comparator)}constructor(e){this.comparator=e?(t,i)=>e(t,i)||fe.comparator(t.key,i.key):(t,i)=>fe.comparator(t.key,i.key),this.keyedMap=Ka(),this.sortedSet=new rt(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,i)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Oo)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),i=e.sortedSet.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=i.getNext().key;if(!o.isEqual(l))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const i=new Oo;return i.comparator=this.comparator,i.keyedMap=e,i.sortedSet=t,i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s_{constructor(){this.fa=new rt(fe.comparator)}track(e){const t=e.doc.key,i=this.fa.get(t);i?e.type!==0&&i.type===3?this.fa=this.fa.insert(t,e):e.type===3&&i.type!==1?this.fa=this.fa.insert(t,{type:i.type,doc:e.doc}):e.type===2&&i.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&i.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&i.type===0?this.fa=this.fa.remove(t):e.type===1&&i.type===2?this.fa=this.fa.insert(t,{type:1,doc:i.doc}):e.type===0&&i.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):_e(63341,{At:e,ga:i}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,i)=>{e.push(i)})),e}}class Uo{constructor(e,t,i,o,l,h,f,g,_){this.query=e,this.docs=t,this.oldDocs=i,this.docChanges=o,this.mutatedKeys=l,this.fromCache=h,this.syncStateChanged=f,this.excludesMetadataChanges=g,this.hasCachedResults=_}static fromInitialDocuments(e,t,i,o,l){const h=[];return t.forEach((f=>{h.push({type:0,doc:f})})),new Uo(e,t,Oo.emptySet(t),h,i,o,!0,!1,l)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Mc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,i=e.docChanges;if(t.length!==i.length)return!1;for(let o=0;o<t.length;o++)if(t[o].type!==i[o].type||!t[o].doc.isEqual(i[o].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sR{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class oR{constructor(){this.queries=o_(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,i){const o=Te(t),l=o.queries;o.queries=o_(),l.forEach(((h,f)=>{for(const g of f.wa)g.onError(i)}))})(this,new ne(H.ABORTED,"Firestore shutting down"))}}function o_(){return new bs((r=>Gv(r)),Mc)}async function C0(r,e){const t=Te(r);let i=3;const o=e.query;let l=t.queries.get(o);l?!l.Sa()&&e.ba()&&(i=2):(l=new sR,i=e.ba()?0:1);try{switch(i){case 0:l.ya=await t.onListen(o,!0);break;case 1:l.ya=await t.onListen(o,!1);break;case 2:await t.onFirstRemoteStoreListen(o)}}catch(h){const f=Zf(h,`Initialization of query '${Ro(e.query)}' failed`);return void e.onError(f)}t.queries.set(o,l),l.wa.push(e),e.va(t.onlineState),l.ya&&e.Ca(l.ya)&&ep(t)}async function k0(r,e){const t=Te(r),i=e.query;let o=3;const l=t.queries.get(i);if(l){const h=l.wa.indexOf(e);h>=0&&(l.wa.splice(h,1),l.wa.length===0?o=e.ba()?0:1:!l.Sa()&&e.ba()&&(o=2))}switch(o){case 0:return t.queries.delete(i),t.onUnlisten(i,!0);case 1:return t.queries.delete(i),t.onUnlisten(i,!1);case 2:return t.onLastRemoteStoreUnlisten(i);default:return}}function aR(r,e){const t=Te(r);let i=!1;for(const o of e){const l=o.query,h=t.queries.get(l);if(h){for(const f of h.wa)f.Ca(o)&&(i=!0);h.ya=o}}i&&ep(t)}function lR(r,e,t){const i=Te(r),o=i.queries.get(e);if(o)for(const l of o.wa)l.onError(t);i.queries.delete(e)}function ep(r){r.Da.forEach((e=>{e.next()}))}var hf,a_;(a_=hf||(hf={})).Fa="default",a_.Cache="cache";class P0{constructor(e,t,i){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=i||{}}Ca(e){if(!this.options.includeMetadataChanges){const i=[];for(const o of e.docChanges)o.type!==3&&i.push(o);e=new Uo(e.query,e.docs,e.oldDocs,i,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const i=t!=="Offline";return(!this.options.ka||!i)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Uo.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==hf.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b0{constructor(e){this.key=e}}class D0{constructor(e){this.key=e}}class uR{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=Pe(),this.mutatedKeys=Pe(),this.Xa=Kv(e),this.eu=new Oo(this.Xa)}get tu(){return this.Ha}nu(e,t){const i=t?t.ru:new s_,o=t?t.eu:this.eu;let l=t?t.mutatedKeys:this.mutatedKeys,h=o,f=!1;const g=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,_=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(e.inorderTraversal(((w,x)=>{const A=o.get(w),O=jc(this.query,x)?x:null,W=!!A&&this.mutatedKeys.has(A.key),q=!!O&&(O.hasLocalMutations||this.mutatedKeys.has(O.key)&&O.hasCommittedMutations);let $=!1;A&&O?A.data.isEqual(O.data)?W!==q&&(i.track({type:3,doc:O}),$=!0):this.iu(A,O)||(i.track({type:2,doc:O}),$=!0,(g&&this.Xa(O,g)>0||_&&this.Xa(O,_)<0)&&(f=!0)):!A&&O?(i.track({type:0,doc:O}),$=!0):A&&!O&&(i.track({type:1,doc:A}),$=!0,(g||_)&&(f=!0)),$&&(O?(h=h.add(O),l=q?l.add(w):l.delete(w)):(h=h.delete(w),l=l.delete(w)))})),this.query.limit!==null)for(;h.size>this.query.limit;){const w=this.query.limitType==="F"?h.last():h.first();h=h.delete(w.key),l=l.delete(w.key),i.track({type:1,doc:w})}return{eu:h,ru:i,Ds:f,mutatedKeys:l}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,i,o){const l=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const h=e.ru.pa();h.sort(((w,x)=>(function(O,W){const q=$=>{switch($){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return _e(20277,{At:$})}};return q(O)-q(W)})(w.type,x.type)||this.Xa(w.doc,x.doc))),this.su(i),o=o!=null&&o;const f=t&&!o?this.ou():[],g=this.Za.size===0&&this.current&&!o?1:0,_=g!==this.Ya;return this.Ya=g,h.length!==0||_?{snapshot:new Uo(this.query,e.eu,l,h,e.mutatedKeys,g===0,_,!1,!!i&&i.resumeToken.approximateByteSize()>0),_u:f}:{_u:f}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new s_,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=Pe(),this.eu.forEach((i=>{this.au(i.key)&&(this.Za=this.Za.add(i.key))}));const t=[];return e.forEach((i=>{this.Za.has(i)||t.push(new D0(i))})),this.Za.forEach((i=>{e.has(i)||t.push(new b0(i))})),t}uu(e){this.Ha=e.qs,this.Za=Pe();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Uo.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const tp="SyncEngine";class cR{constructor(e,t,i){this.query=e,this.targetId=t,this.view=i}}class hR{constructor(e){this.key=e,this.lu=!1}}class dR{constructor(e,t,i,o,l,h){this.localStore=e,this.remoteStore=t,this.eventManager=i,this.sharedClientState=o,this.currentUser=l,this.maxConcurrentLimboResolutions=h,this.hu={},this.Pu=new bs((f=>Gv(f)),Mc),this.Tu=new Map,this.Iu=new Set,this.du=new rt(fe.comparator),this.Eu=new Map,this.Au=new Wf,this.Ru={},this.Vu=new Map,this.mu=Fo.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function fR(r,e,t=!0){const i=j0(r);let o;const l=i.Pu.get(e);return l?(i.sharedClientState.addLocalQueryTarget(l.targetId),o=l.view.cu()):o=await N0(i,e,t,!0),o}async function pR(r,e){const t=j0(r);await N0(t,e,!0,!1)}async function N0(r,e,t,i){const o=await OA(r.localStore,fr(e)),l=o.targetId,h=r.sharedClientState.addLocalQueryTarget(l,t);let f;return i&&(f=await mR(r,e,l,h==="current",o.resumeToken)),r.isPrimaryClient&&t&&T0(r.remoteStore,o),f}async function mR(r,e,t,i,o){r.gu=(x,A,O)=>(async function(q,$,he,M){let J=$.view.nu(he);J.Ds&&(J=await Zy(q.localStore,$.query,!1).then((({documents:D})=>$.view.nu(D,J))));const re=M&&M.targetChanges.get($.targetId),Ce=M&&M.targetMismatches.get($.targetId)!=null,Ee=$.view.applyChanges(J,q.isPrimaryClient,re,Ce);return u_(q,$.targetId,Ee._u),Ee.snapshot})(r,x,A,O);const l=await Zy(r.localStore,e,!0),h=new uR(e,l.qs),f=h.nu(l.documents),g=Il.createSynthesizedTargetChangeForCurrentChange(t,i&&r.onlineState!=="Offline",o),_=h.applyChanges(f,r.isPrimaryClient,g);u_(r,t,_._u);const w=new cR(e,t,h);return r.Pu.set(e,w),r.Tu.has(t)?r.Tu.get(t).push(e):r.Tu.set(t,[e]),_.snapshot}async function gR(r,e,t){const i=Te(r),o=i.Pu.get(e),l=i.Tu.get(o.targetId);if(l.length>1)return i.Tu.set(o.targetId,l.filter((h=>!Mc(h,e)))),void i.Pu.delete(e);i.isPrimaryClient?(i.sharedClientState.removeLocalQueryTarget(o.targetId),i.sharedClientState.isActiveQueryTarget(o.targetId)||await uf(i.localStore,o.targetId,!1).then((()=>{i.sharedClientState.clearQueryState(o.targetId),t&&Kf(i.remoteStore,o.targetId),df(i,o.targetId)})).catch($o)):(df(i,o.targetId),await uf(i.localStore,o.targetId,!0))}async function yR(r,e){const t=Te(r),i=t.Pu.get(e),o=t.Tu.get(i.targetId);t.isPrimaryClient&&o.length===1&&(t.sharedClientState.removeLocalQueryTarget(i.targetId),Kf(t.remoteStore,i.targetId))}async function _R(r,e,t){const i=xR(r);try{const o=await(function(h,f){const g=Te(h),_=Je.now(),w=f.reduce(((O,W)=>O.add(W.key)),Pe());let x,A;return g.persistence.runTransaction("Locally write mutations","readwrite",(O=>{let W=Hr(),q=Pe();return g.Os.getEntries(O,w).next(($=>{W=$,W.forEach(((he,M)=>{M.isValidDocument()||(q=q.add(he))}))})).next((()=>g.localDocuments.getOverlayedDocuments(O,W))).next(($=>{x=$;const he=[];for(const M of f){const J=Ox(M,x.get(M.key).overlayedDocument);J!=null&&he.push(new zi(M.key,J,Fv(J.value.mapValue),Gn.exists(!0)))}return g.mutationQueue.addMutationBatch(O,_,he,f)})).next(($=>{A=$;const he=$.applyToLocalDocumentSet(x,q);return g.documentOverlayCache.saveOverlays(O,$.batchId,he)}))})).then((()=>({batchId:A.batchId,changes:Xv(x)})))})(i.localStore,e);i.sharedClientState.addPendingMutation(o.batchId),(function(h,f,g){let _=h.Ru[h.currentUser.toKey()];_||(_=new rt(xe)),_=_.insert(f,g),h.Ru[h.currentUser.toKey()]=_})(i,o.batchId,t),await xl(i,o.changes),await Wc(i.remoteStore)}catch(o){const l=Zf(o,"Failed to persist write");t.reject(l)}}async function O0(r,e){const t=Te(r);try{const i=await bA(t.localStore,e);e.targetChanges.forEach(((o,l)=>{const h=t.Eu.get(l);h&&(Be(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?h.lu=!0:o.modifiedDocuments.size>0?Be(h.lu,14607):o.removedDocuments.size>0&&(Be(h.lu,42227),h.lu=!1))})),await xl(t,i,e)}catch(i){await $o(i)}}function l_(r,e,t){const i=Te(r);if(i.isPrimaryClient&&t===0||!i.isPrimaryClient&&t===1){const o=[];i.Pu.forEach(((l,h)=>{const f=h.view.va(e);f.snapshot&&o.push(f.snapshot)})),(function(h,f){const g=Te(h);g.onlineState=f;let _=!1;g.queries.forEach(((w,x)=>{for(const A of x.wa)A.va(f)&&(_=!0)})),_&&ep(g)})(i.eventManager,e),o.length&&i.hu.J_(o),i.onlineState=e,i.isPrimaryClient&&i.sharedClientState.setOnlineState(e)}}async function vR(r,e,t){const i=Te(r);i.sharedClientState.updateQueryState(e,"rejected",t);const o=i.Eu.get(e),l=o&&o.key;if(l){let h=new rt(fe.comparator);h=h.insert(l,Ht.newNoDocument(l,we.min()));const f=Pe().add(l),g=new Bc(we.min(),new Map,new rt(xe),h,f);await O0(i,g),i.du=i.du.remove(l),i.Eu.delete(e),np(i)}else await uf(i.localStore,e,!1).then((()=>df(i,e,t))).catch($o)}async function ER(r,e){const t=Te(r),i=e.batch.batchId;try{const o=await PA(t.localStore,e);L0(t,i,null),V0(t,i),t.sharedClientState.updateMutationState(i,"acknowledged"),await xl(t,o)}catch(o){await $o(o)}}async function wR(r,e,t){const i=Te(r);try{const o=await(function(h,f){const g=Te(h);return g.persistence.runTransaction("Reject batch","readwrite-primary",(_=>{let w;return g.mutationQueue.lookupMutationBatch(_,f).next((x=>(Be(x!==null,37113),w=x.keys(),g.mutationQueue.removeMutationBatch(_,x)))).next((()=>g.mutationQueue.performConsistencyCheck(_))).next((()=>g.documentOverlayCache.removeOverlaysForBatchId(_,w,f))).next((()=>g.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(_,w))).next((()=>g.localDocuments.getDocuments(_,w)))}))})(i.localStore,e);L0(i,e,t),V0(i,e),i.sharedClientState.updateMutationState(e,"rejected",t),await xl(i,o)}catch(o){await $o(o)}}function V0(r,e){(r.Vu.get(e)||[]).forEach((t=>{t.resolve()})),r.Vu.delete(e)}function L0(r,e,t){const i=Te(r);let o=i.Ru[i.currentUser.toKey()];if(o){const l=o.get(e);l&&(t?l.reject(t):l.resolve(),o=o.remove(e)),i.Ru[i.currentUser.toKey()]=o}}function df(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const i of r.Tu.get(e))r.Pu.delete(i),t&&r.hu.pu(i,t);r.Tu.delete(e),r.isPrimaryClient&&r.Au.zr(e).forEach((i=>{r.Au.containsKey(i)||M0(r,i)}))}function M0(r,e){r.Iu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(Kf(r.remoteStore,t),r.du=r.du.remove(e),r.Eu.delete(t),np(r))}function u_(r,e,t){for(const i of t)i instanceof b0?(r.Au.addReference(i.key,e),TR(r,i)):i instanceof D0?(se(tp,"Document no longer in limbo: "+i.key),r.Au.removeReference(i.key,e),r.Au.containsKey(i.key)||M0(r,i.key)):_e(19791,{yu:i})}function TR(r,e){const t=e.key,i=t.path.canonicalString();r.du.get(t)||r.Iu.has(i)||(se(tp,"New document in limbo: "+t),r.Iu.add(i),np(r))}function np(r){for(;r.Iu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Iu.values().next().value;r.Iu.delete(e);const t=new fe(Qe.fromString(e)),i=r.mu.next();r.Eu.set(i,new hR(t)),r.du=r.du.insert(t,i),T0(r.remoteStore,new Si(fr(Ff(t.path)),i,"TargetPurposeLimboResolution",Oc.ue))}}async function xl(r,e,t){const i=Te(r),o=[],l=[],h=[];i.Pu.isEmpty()||(i.Pu.forEach(((f,g)=>{h.push(i.gu(g,e,t).then((_=>{var w;if((_||t)&&i.isPrimaryClient){const x=_?!_.fromCache:(w=t==null?void 0:t.targetChanges.get(g.targetId))===null||w===void 0?void 0:w.current;i.sharedClientState.updateQueryState(g.targetId,x?"current":"not-current")}if(_){o.push(_);const x=qf.Es(g.targetId,_);l.push(x)}})))})),await Promise.all(h),i.hu.J_(o),await(async function(g,_){const w=Te(g);try{await w.persistence.runTransaction("notifyLocalViewChanges","readwrite",(x=>G.forEach(_,(A=>G.forEach(A.Is,(O=>w.persistence.referenceDelegate.addReference(x,A.targetId,O))).next((()=>G.forEach(A.ds,(O=>w.persistence.referenceDelegate.removeReference(x,A.targetId,O)))))))))}catch(x){if(!Wo(x))throw x;se(Gf,"Failed to update sequence numbers: "+x)}for(const x of _){const A=x.targetId;if(!x.fromCache){const O=w.Fs.get(A),W=O.snapshotVersion,q=O.withLastLimboFreeSnapshotVersion(W);w.Fs=w.Fs.insert(A,q)}}})(i.localStore,l))}async function IR(r,e){const t=Te(r);if(!t.currentUser.isEqual(e)){se(tp,"User change. New user:",e.toKey());const i=await _0(t.localStore,e);t.currentUser=e,(function(l,h){l.Vu.forEach((f=>{f.forEach((g=>{g.reject(new ne(H.CANCELLED,h))}))})),l.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,i.removedBatchIds,i.addedBatchIds),await xl(t,i.Bs)}}function SR(r,e){const t=Te(r),i=t.Eu.get(e);if(i&&i.lu)return Pe().add(i.key);{let o=Pe();const l=t.Tu.get(e);if(!l)return o;for(const h of l){const f=t.Pu.get(h);o=o.unionWith(f.view.tu)}return o}}function j0(r){const e=Te(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=O0.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=SR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=vR.bind(null,e),e.hu.J_=aR.bind(null,e.eventManager),e.hu.pu=lR.bind(null,e.eventManager),e}function xR(r){const e=Te(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=ER.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=wR.bind(null,e),e}class Ac{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=zc(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return kA(this.persistence,new AA,e.initialUser,this.serializer)}Du(e){return new y0(Hf.Vi,this.serializer)}bu(e){return new LA}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ac.provider={build:()=>new Ac};class AR extends Ac{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Be(this.persistence.referenceDelegate instanceof Sc,46915);const i=this.persistence.referenceDelegate.garbageCollector;return new hA(i,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?ln.withCacheSize(this.cacheSizeBytes):ln.DEFAULT;return new y0((i=>Sc.Vi(i,t)),this.serializer)}}class ff{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=i=>l_(this.syncEngine,i,1),this.remoteStore.remoteSyncer.handleCredentialChange=IR.bind(null,this.syncEngine),await iR(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new oR})()}createDatastore(e){const t=zc(e.databaseInfo.databaseId),i=(function(l){return new BA(l)})(e.databaseInfo);return(function(l,h,f,g){return new HA(l,h,f,g)})(e.authCredentials,e.appCheckCredentials,i,t)}createRemoteStore(e){return(function(i,o,l,h,f){return new GA(i,o,l,h,f)})(this.localStore,this.datastore,e.asyncQueue,(t=>l_(this.syncEngine,t,0)),(function(){return n_.C()?new n_:new MA})())}createSyncEngine(e,t){return(function(o,l,h,f,g,_,w){const x=new dR(o,l,h,f,g,_);return w&&(x.fu=!0),x})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(o){const l=Te(o);se(Rs,"RemoteStore shutting down."),l.Ia.add(5),await Sl(l),l.Ea.shutdown(),l.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}ff.provider={build:()=>new ff};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F0{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):Wr("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Li="FirestoreClient";class RR{constructor(e,t,i,o,l){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=i,this.databaseInfo=o,this.user=Wt.UNAUTHENTICATED,this.clientId=Nf.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=l,this.authCredentials.start(i,(async h=>{se(Li,"Received user=",h.uid),await this.authCredentialListener(h),this.user=h})),this.appCheckCredentials.start(i,(h=>(se(Li,"Received new app check token=",h),this.appCheckCredentialListener(h,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Br;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const i=Zf(t,"Failed to shutdown persistence");e.reject(i)}})),e.promise}}async function Fd(r,e){r.asyncQueue.verifyOperationInProgress(),se(Li,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let i=t.initialUser;r.setCredentialChangeListener((async o=>{i.isEqual(o)||(await _0(e.localStore,o),i=o)})),e.persistence.setDatabaseDeletedListener((()=>{Pi("Terminating Firestore due to IndexedDb database deletion"),r.terminate().then((()=>{se("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((o=>{Pi("Terminating Firestore due to IndexedDb database deletion failed",o)}))})),r._offlineComponents=e}async function c_(r,e){r.asyncQueue.verifyOperationInProgress();const t=await CR(r);se(Li,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((i=>i_(e.remoteStore,i))),r.setAppCheckTokenChangeListener(((i,o)=>i_(e.remoteStore,o))),r._onlineComponents=e}async function CR(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){se(Li,"Using user provided OfflineComponentProvider");try{await Fd(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(o){return o.name==="FirebaseError"?o.code===H.FAILED_PRECONDITION||o.code===H.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11})(t))throw t;Pi("Error using user provided cache. Falling back to memory cache: "+t),await Fd(r,new Ac)}}else se(Li,"Using default OfflineComponentProvider"),await Fd(r,new AR(void 0));return r._offlineComponents}async function U0(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(se(Li,"Using user provided OnlineComponentProvider"),await c_(r,r._uninitializedComponentsProvider._online)):(se(Li,"Using default OnlineComponentProvider"),await c_(r,new ff))),r._onlineComponents}function kR(r){return U0(r).then((e=>e.syncEngine))}async function B0(r){const e=await U0(r),t=e.eventManager;return t.onListen=fR.bind(null,e.syncEngine),t.onUnlisten=gR.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=pR.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=yR.bind(null,e.syncEngine),t}function PR(r,e,t={}){const i=new Br;return r.asyncQueue.enqueueAndForget((async()=>(function(l,h,f,g,_){const w=new F0({next:A=>{w.Ou(),h.enqueueAndForget((()=>k0(l,x)));const O=A.docs.has(f);!O&&A.fromCache?_.reject(new ne(H.UNAVAILABLE,"Failed to get document because the client is offline.")):O&&A.fromCache&&g&&g.source==="server"?_.reject(new ne(H.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):_.resolve(A)},error:A=>_.reject(A)}),x=new P0(Ff(f.path),w,{includeMetadataChanges:!0,ka:!0});return C0(l,x)})(await B0(r),r.asyncQueue,e,t,i))),i.promise}function bR(r,e,t={}){const i=new Br;return r.asyncQueue.enqueueAndForget((async()=>(function(l,h,f,g,_){const w=new F0({next:A=>{w.Ou(),h.enqueueAndForget((()=>k0(l,x))),A.fromCache&&g.source==="server"?_.reject(new ne(H.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):_.resolve(A)},error:A=>_.reject(A)}),x=new P0(f,w,{includeMetadataChanges:!0,ka:!0});return C0(l,x)})(await B0(r),r.asyncQueue,e,t,i))),i.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z0(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const h_=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $0="firestore.googleapis.com",d_=!0;class f_{constructor(e){var t,i;if(e.host===void 0){if(e.ssl!==void 0)throw new ne(H.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=$0,this.ssl=d_}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:d_;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=g0;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<uA)throw new ne(H.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}qS("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=z0((i=e.experimentalLongPollingOptions)!==null&&i!==void 0?i:{}),(function(l){if(l.timeoutSeconds!==void 0){if(isNaN(l.timeoutSeconds))throw new ne(H.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (must not be NaN)`);if(l.timeoutSeconds<5)throw new ne(H.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (minimum allowed value is 5)`);if(l.timeoutSeconds>30)throw new ne(H.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(i,o){return i.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Hc{constructor(e,t,i,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=i,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new f_({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new ne(H.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new ne(H.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new f_(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(i){if(!i)return new MS;switch(i.type){case"firstParty":return new BS(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new ne(H.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const i=h_.get(t);i&&(se("ComponentProvider","Removing Datastore"),h_.delete(t),i.terminate())})(this),Promise.resolve()}}function DR(r,e,t,i={}){var o;r=yr(r,Hc);const l=ji(e),h=r._getSettings(),f=Object.assign(Object.assign({},h),{emulatorOptions:r._getEmulatorOptions()}),g=`${e}:${t}`;l&&(_f(`https://${g}`),vf("Firestore",!0)),h.host!==$0&&h.host!==g&&Pi("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const _=Object.assign(Object.assign({},h),{host:g,ssl:l,emulatorOptions:i});if(!Ts(_,f)&&(r._setSettings(_),i.mockUserToken)){let w,x;if(typeof i.mockUserToken=="string")w=i.mockUserToken,x=Wt.MOCK_USER;else{w=N_(i.mockUserToken,(o=r._app)===null||o===void 0?void 0:o.options.projectId);const A=i.mockUserToken.sub||i.mockUserToken.user_id;if(!A)throw new ne(H.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");x=new Wt(A)}r._authCredentials=new jS(new Av(w,x))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{constructor(e,t,i){this.converter=t,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new $i(this.firestore,e,this._query)}}class dt{constructor(e,t,i){this.converter=t,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ci(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new dt(this.firestore,e,this._key)}toJSON(){return{type:dt._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,i){if(wl(t,dt._jsonSchema))return new dt(e,i||null,new fe(Qe.fromString(t.referencePath)))}}dt._jsonSchemaVersion="firestore/documentReference/1.0",dt._jsonSchema={type:yt("string",dt._jsonSchemaVersion),referencePath:yt("string")};class Ci extends $i{constructor(e,t,i){super(e,t,Ff(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new dt(this.firestore,null,new fe(e))}withConverter(e){return new Ci(this.firestore,e,this._path)}}function Al(r,e,...t){if(r=st(r),Cv("collection","path",e),r instanceof Hc){const i=Qe.fromString(e,...t);return Ay(i),new Ci(r,null,i)}{if(!(r instanceof dt||r instanceof Ci))throw new ne(H.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=r._path.child(Qe.fromString(e,...t));return Ay(i),new Ci(r.firestore,null,i)}}function Go(r,e,...t){if(r=st(r),arguments.length===1&&(e=Nf.newId()),Cv("doc","path",e),r instanceof Hc){const i=Qe.fromString(e,...t);return xy(i),new dt(r,null,new fe(i))}{if(!(r instanceof dt||r instanceof Ci))throw new ne(H.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=r._path.child(Qe.fromString(e,...t));return xy(i),new dt(r.firestore,r instanceof Ci?r.converter:null,new fe(i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p_="AsyncQueue";class m_{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new E0(this,"async_queue_retry"),this.oc=()=>{const i=jd();i&&se(p_,"Visibility state changed to "+i.visibilityState),this.F_.y_()},this._c=e;const t=jd();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=jd();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new Br;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Wo(e))throw e;se(p_,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((i=>{throw this.tc=i,this.nc=!1,Wr("INTERNAL UNHANDLED ERROR: ",g_(i)),i})).then((i=>(this.nc=!1,i))))));return this._c=t,t}enqueueAfterDelay(e,t,i){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const o=Jf.createAndSchedule(this,e,t,i,(l=>this.lc(l)));return this.ec.push(o),o}ac(){this.tc&&_e(47125,{hc:g_(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,i)=>t.targetTimeMs-i.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function g_(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class Ko extends Hc{constructor(e,t,i,o){super(e,t,i,o),this.type="firestore",this._queue=new m_,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new m_(e),this._firestoreClient=void 0,await e}}}function NR(r,e){const t=typeof r=="object"?r:Tf(),i=typeof r=="string"?r:_c,o=kc(t,"firestore").getImmediate({identifier:i});if(!o._initialized){const l=P_("firestore");l&&DR(o,...l)}return o}function rp(r){if(r._terminated)throw new ne(H.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||OR(r),r._firestoreClient}function OR(r){var e,t,i;const o=r._freezeSettings(),l=(function(f,g,_,w){return new ix(f,g,_,w.host,w.ssl,w.experimentalForceLongPolling,w.experimentalAutoDetectLongPolling,z0(w.experimentalLongPollingOptions),w.useFetchStreams,w.isUsingEmulator)})(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,o);r._componentsProvider||!((t=o.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((i=o.localCache)===null||i===void 0)&&i._onlineComponentProvider)&&(r._componentsProvider={_offline:o.localCache._offlineComponentProvider,_online:o.localCache._onlineComponentProvider}),r._firestoreClient=new RR(r._authCredentials,r._appCheckCredentials,r._queue,l,r._componentsProvider&&(function(f){const g=f==null?void 0:f._online.build();return{_offline:f==null?void 0:f._offline.build(g),_online:g}})(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Pn(Lt.fromBase64String(e))}catch(t){throw new ne(H.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Pn(Lt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Pn._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(wl(e,Pn._jsonSchema))return Pn.fromBase64String(e.bytes)}}Pn._jsonSchemaVersion="firestore/bytes/1.0",Pn._jsonSchema={type:yt("string",Pn._jsonSchemaVersion),bytes:yt("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qc{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new ne(H.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Vt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gc{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new ne(H.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new ne(H.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return xe(this._lat,e._lat)||xe(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:mr._jsonSchemaVersion}}static fromJSON(e){if(wl(e,mr._jsonSchema))return new mr(e.latitude,e.longitude)}}mr._jsonSchemaVersion="firestore/geoPoint/1.0",mr._jsonSchema={type:yt("string",mr._jsonSchemaVersion),latitude:yt("number"),longitude:yt("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gr{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(i,o){if(i.length!==o.length)return!1;for(let l=0;l<i.length;++l)if(i[l]!==o[l])return!1;return!0})(this._values,e._values)}toJSON(){return{type:gr._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(wl(e,gr._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new gr(e.vectorValues);throw new ne(H.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}gr._jsonSchemaVersion="firestore/vectorValue/1.0",gr._jsonSchema={type:yt("string",gr._jsonSchemaVersion),vectorValues:yt("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VR=/^__.*__$/;class LR{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return this.fieldMask!==null?new zi(e,this.data,this.fieldMask,t,this.fieldTransforms):new Tl(e,this.data,t,this.fieldTransforms)}}class W0{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return new zi(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function H0(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw _e(40011,{Ec:r})}}class ip{constructor(e,t,i,o,l,h){this.settings=e,this.databaseId=t,this.serializer=i,this.ignoreUndefinedProperties=o,l===void 0&&this.Ac(),this.fieldTransforms=l||[],this.fieldMask=h||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new ip(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const i=(t=this.path)===null||t===void 0?void 0:t.child(e),o=this.Rc({path:i,mc:!1});return o.fc(e),o}gc(e){var t;const i=(t=this.path)===null||t===void 0?void 0:t.child(e),o=this.Rc({path:i,mc:!1});return o.Ac(),o}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return Rc(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(H0(this.Ec)&&VR.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class MR{constructor(e,t,i){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=i||zc(e)}Dc(e,t,i,o=!1){return new ip({Ec:e,methodName:t,bc:i,path:Vt.emptyPath(),mc:!1,Sc:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Kc(r){const e=r._freezeSettings(),t=zc(r._databaseId);return new MR(r._databaseId,!!e.ignoreUndefinedProperties,t)}function q0(r,e,t,i,o,l={}){const h=r.Dc(l.merge||l.mergeFields?2:0,e,t,o);op("Data must be an object, but it was:",h,i);const f=G0(i,h);let g,_;if(l.merge)g=new _n(h.fieldMask),_=h.fieldTransforms;else if(l.mergeFields){const w=[];for(const x of l.mergeFields){const A=pf(e,x,t);if(!h.contains(A))throw new ne(H.INVALID_ARGUMENT,`Field '${A}' is specified in your field mask but missing from your input data.`);Q0(w,A)||w.push(A)}g=new _n(w),_=h.fieldTransforms.filter((x=>g.covers(x.field)))}else g=null,_=h.fieldTransforms;return new LR(new un(f),g,_)}class Qc extends Gc{_toFieldTransform(e){if(e.Ec!==2)throw e.Ec===1?e.wc(`${this._methodName}() can only appear at the top level of your update data`):e.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Qc}}class sp extends Gc{_toFieldTransform(e){return new Px(e.path,new dl)}isEqual(e){return e instanceof sp}}function jR(r,e,t,i){const o=r.Dc(1,e,t);op("Data must be an object, but it was:",o,i);const l=[],h=un.empty();Bi(i,((g,_)=>{const w=ap(e,g,t);_=st(_);const x=o.gc(w);if(_ instanceof Qc)l.push(w);else{const A=Rl(_,x);A!=null&&(l.push(w),h.set(w,A))}}));const f=new _n(l);return new W0(h,f,o.fieldTransforms)}function FR(r,e,t,i,o,l){const h=r.Dc(1,e,t),f=[pf(e,i,t)],g=[o];if(l.length%2!=0)throw new ne(H.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let A=0;A<l.length;A+=2)f.push(pf(e,l[A])),g.push(l[A+1]);const _=[],w=un.empty();for(let A=f.length-1;A>=0;--A)if(!Q0(_,f[A])){const O=f[A];let W=g[A];W=st(W);const q=h.gc(O);if(W instanceof Qc)_.push(O);else{const $=Rl(W,q);$!=null&&(_.push(O),w.set(O,$))}}const x=new _n(_);return new W0(w,x,h.fieldTransforms)}function UR(r,e,t,i=!1){return Rl(t,r.Dc(i?4:3,e))}function Rl(r,e){if(K0(r=st(r)))return op("Unsupported field value:",e,r),G0(r,e);if(r instanceof Gc)return(function(i,o){if(!H0(o.Ec))throw o.wc(`${i._methodName}() can only be used with update() and set()`);if(!o.path)throw o.wc(`${i._methodName}() is not currently supported inside arrays`);const l=i._toFieldTransform(o);l&&o.fieldTransforms.push(l)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(i,o){const l=[];let h=0;for(const f of i){let g=Rl(f,o.yc(h));g==null&&(g={nullValue:"NULL_VALUE"}),l.push(g),h++}return{arrayValue:{values:l}}})(r,e)}return(function(i,o){if((i=st(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return Rx(o.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){const l=Je.fromDate(i);return{timestampValue:Ic(o.serializer,l)}}if(i instanceof Je){const l=new Je(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:Ic(o.serializer,l)}}if(i instanceof mr)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof Pn)return{bytesValue:u0(o.serializer,i._byteString)};if(i instanceof dt){const l=o.databaseId,h=i.firestore._databaseId;if(!h.isEqual(l))throw o.wc(`Document reference is for database ${h.projectId}/${h.database} but should be for database ${l.projectId}/${l.database}`);return{referenceValue:$f(i.firestore._databaseId||o.databaseId,i._key.path)}}if(i instanceof gr)return(function(h,f){return{mapValue:{fields:{[Mv]:{stringValue:jv},[vc]:{arrayValue:{values:h.toArray().map((_=>{if(typeof _!="number")throw f.wc("VectorValues must only contain numeric values.");return Uf(f.serializer,_)}))}}}}}})(i,o);throw o.wc(`Unsupported field value: ${Nc(i)}`)})(r,e)}function G0(r,e){const t={};return bv(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Bi(r,((i,o)=>{const l=Rl(o,e.Vc(i));l!=null&&(t[i]=l)})),{mapValue:{fields:t}}}function K0(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Je||r instanceof mr||r instanceof Pn||r instanceof dt||r instanceof Gc||r instanceof gr)}function op(r,e,t){if(!K0(t)||!kv(t)){const i=Nc(t);throw i==="an object"?e.wc(r+" a custom object"):e.wc(r+" "+i)}}function pf(r,e,t){if((e=st(e))instanceof qc)return e._internalPath;if(typeof e=="string")return ap(r,e);throw Rc("Field path arguments must be of type string or ",r,!1,void 0,t)}const BR=new RegExp("[~\\*/\\[\\]]");function ap(r,e,t){if(e.search(BR)>=0)throw Rc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new qc(...e.split("."))._internalPath}catch{throw Rc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Rc(r,e,t,i,o){const l=i&&!i.isEmpty(),h=o!==void 0;let f=`Function ${e}() called with invalid data`;t&&(f+=" (via `toFirestore()`)"),f+=". ";let g="";return(l||h)&&(g+=" (found",l&&(g+=` in field ${i}`),h&&(g+=` in document ${o}`),g+=")"),new ne(H.INVALID_ARGUMENT,f+r+g)}function Q0(r,e){return r.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X0{constructor(e,t,i,o,l){this._firestore=e,this._userDataWriter=t,this._key=i,this._document=o,this._converter=l}get id(){return this._key.path.lastSegment()}get ref(){return new dt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new zR(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Xc("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class zR extends X0{data(){return super.data()}}function Xc(r,e){return typeof e=="string"?ap(r,e):e instanceof qc?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $R(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new ne(H.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class lp{}class up extends lp{}function cp(r,e,...t){let i=[];e instanceof lp&&i.push(e),i=i.concat(t),(function(l){const h=l.filter((g=>g instanceof hp)).length,f=l.filter((g=>g instanceof Yc)).length;if(h>1||h>0&&f>0)throw new ne(H.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(i);for(const o of i)r=o._apply(r);return r}class Yc extends up{constructor(e,t,i){super(),this._field=e,this._op=t,this._value=i,this.type="where"}static _create(e,t,i){return new Yc(e,t,i)}_apply(e){const t=this._parse(e);return Y0(e._query,t),new $i(e.firestore,e.converter,rf(e._query,t))}_parse(e){const t=Kc(e.firestore);return(function(l,h,f,g,_,w,x){let A;if(_.isKeyField()){if(w==="array-contains"||w==="array-contains-any")throw new ne(H.INVALID_ARGUMENT,`Invalid Query. You can't perform '${w}' queries on documentId().`);if(w==="in"||w==="not-in"){__(x,w);const W=[];for(const q of x)W.push(y_(g,l,q));A={arrayValue:{values:W}}}else A=y_(g,l,x)}else w!=="in"&&w!=="not-in"&&w!=="array-contains-any"||__(x,w),A=UR(f,h,x,w==="in"||w==="not-in");return gt.create(_,w,A)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Ti(r,e,t){const i=e,o=Xc("where",r);return Yc._create(o,i,t)}class hp extends lp{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new hp(e,t)}_parse(e){const t=this._queryConstraints.map((i=>i._parse(e))).filter((i=>i.getFilters().length>0));return t.length===1?t[0]:Qn.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(o,l){let h=o;const f=l.getFlattenedFilters();for(const g of f)Y0(h,g),h=rf(h,g)})(e._query,t),new $i(e.firestore,e.converter,rf(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class dp extends up{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new dp(e,t)}_apply(e){const t=(function(o,l,h){if(o.startAt!==null)throw new ne(H.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(o.endAt!==null)throw new ne(H.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new hl(l,h)})(e._query,this._field,this._direction);return new $i(e.firestore,e.converter,(function(o,l){const h=o.explicitOrderBy.concat([l]);return new Ho(o.path,o.collectionGroup,h,o.filters.slice(),o.limit,o.limitType,o.startAt,o.endAt)})(e._query,t))}}function fp(r,e="asc"){const t=e,i=Xc("orderBy",r);return dp._create(i,t)}class pp extends up{constructor(e,t,i){super(),this.type=e,this._limit=t,this._limitType=i}static _create(e,t,i){return new pp(e,t,i)}_apply(e){return new $i(e.firestore,e.converter,wc(e._query,this._limit,this._limitType))}}function mp(r){return GS("limit",r),pp._create("limit",r,"F")}function y_(r,e,t){if(typeof(t=st(t))=="string"){if(t==="")throw new ne(H.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!qv(e)&&t.indexOf("/")!==-1)throw new ne(H.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const i=e.path.child(Qe.fromString(t));if(!fe.isDocumentKey(i))throw new ne(H.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${i}' is not because it has an odd number of segments (${i.length}).`);return Oy(r,new fe(i))}if(t instanceof dt)return Oy(r,t._key);throw new ne(H.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Nc(t)}.`)}function __(r,e){if(!Array.isArray(r)||r.length===0)throw new ne(H.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Y0(r,e){const t=(function(o,l){for(const h of o)for(const f of h.getFlattenedFilters())if(l.indexOf(f.op)>=0)return f.op;return null})(r.filters,(function(o){switch(o){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new ne(H.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new ne(H.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class WR{convertValue(e,t="none"){switch(Oi(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ht(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ni(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw _e(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const i={};return Bi(e,((o,l)=>{i[o]=this.convertValue(l,t)})),i}convertVectorValue(e){var t,i,o;const l=(o=(i=(t=e.fields)===null||t===void 0?void 0:t[vc].arrayValue)===null||i===void 0?void 0:i.values)===null||o===void 0?void 0:o.map((h=>ht(h.doubleValue)));return new gr(l)}convertGeoPoint(e){return new mr(ht(e.latitude),ht(e.longitude))}convertArray(e,t){return(e.values||[]).map((i=>this.convertValue(i,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const i=Lc(e);return i==null?null:this.convertValue(i,t);case"estimate":return this.convertTimestamp(ll(e));default:return null}}convertTimestamp(e){const t=Di(e);return new Je(t.seconds,t.nanos)}convertDocumentKey(e,t){const i=Qe.fromString(e);Be(m0(i),9688,{name:e});const o=new ul(i.get(1),i.get(3)),l=new fe(i.popFirst(5));return o.isEqual(t)||Wr(`Document ${l} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function J0(r,e,t){let i;return i=r?r.toFirestore(e):e,i}class Xa{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Es extends X0{constructor(e,t,i,o,l,h){super(e,t,i,o,h),this._firestore=e,this._firestoreImpl=e,this.metadata=l}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new lc(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const i=this._document.data.field(Xc("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new ne(H.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Es._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Es._jsonSchemaVersion="firestore/documentSnapshot/1.0",Es._jsonSchema={type:yt("string",Es._jsonSchemaVersion),bundleSource:yt("string","DocumentSnapshot"),bundleName:yt("string"),bundle:yt("string")};class lc extends Es{data(e={}){return super.data(e)}}class Vo{constructor(e,t,i,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new Xa(o.hasPendingWrites,o.fromCache),this.query=i}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((i=>{e.call(t,new lc(this._firestore,this._userDataWriter,i.key,i,new Xa(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new ne(H.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,l){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map((f=>{const g=new lc(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Xa(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);return f.doc,{type:"added",doc:g,oldIndex:-1,newIndex:h++}}))}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((f=>l||f.type!==3)).map((f=>{const g=new lc(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Xa(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);let _=-1,w=-1;return f.type!==0&&(_=h.indexOf(f.doc.key),h=h.delete(f.doc.key)),f.type!==1&&(h=h.add(f.doc),w=h.indexOf(f.doc.key)),{type:HR(f.type),doc:g,oldIndex:_,newIndex:w}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new ne(H.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Vo._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Nf.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],i=[],o=[];return this.docs.forEach((l=>{l._document!==null&&(t.push(l._document),i.push(this._userDataWriter.convertObjectMap(l._document.data.value.mapValue.fields,"previous")),o.push(l.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function HR(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return _e(61501,{type:r})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qR(r){r=yr(r,dt);const e=yr(r.firestore,Ko);return PR(rp(e),r._key).then((t=>KR(e,r,t)))}Vo._jsonSchemaVersion="firestore/querySnapshot/1.0",Vo._jsonSchema={type:yt("string",Vo._jsonSchemaVersion),bundleSource:yt("string","QuerySnapshot"),bundleName:yt("string"),bundle:yt("string")};class Z0 extends WR{constructor(e){super(),this.firestore=e}convertBytes(e){return new Pn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new dt(this.firestore,null,t)}}function gp(r){r=yr(r,$i);const e=yr(r.firestore,Ko),t=rp(e),i=new Z0(e);return $R(r._query),bR(t,r._query).then((o=>new Vo(e,i,r,o)))}function GR(r,e,t){r=yr(r,dt);const i=yr(r.firestore,Ko),o=J0(r.converter,e);return _p(i,[q0(Kc(i),"setDoc",r._key,o,r.converter!==null,t).toMutation(r._key,Gn.none())])}function yp(r,e,t,...i){r=yr(r,dt);const o=yr(r.firestore,Ko),l=Kc(o);let h;return h=typeof(e=st(e))=="string"||e instanceof qc?FR(l,"updateDoc",r._key,e,t,i):jR(l,"updateDoc",r._key,e),_p(o,[h.toMutation(r._key,Gn.exists(!0))])}function eE(r,e){const t=yr(r.firestore,Ko),i=Go(r),o=J0(r.converter,e);return _p(t,[q0(Kc(r.firestore),"addDoc",i._key,o,r.converter!==null,{}).toMutation(i._key,Gn.exists(!1))]).then((()=>i))}function _p(r,e){return(function(i,o){const l=new Br;return i.asyncQueue.enqueueAndForget((async()=>_R(await kR(i),o,l))),l.promise})(rp(r),e)}function KR(r,e,t){const i=t.docs.get(e._key),o=new Z0(r);return new Es(r,o,e._key,i,new Xa(t.hasPendingWrites,t.fromCache),e.converter)}function Mi(){return new sp("serverTimestamp")}(function(e,t=!0){(function(o){zo=o})(ks),Is(new ki("firestore",((i,{instanceIdentifier:o,options:l})=>{const h=i.getProvider("app").getImmediate(),f=new Ko(new FS(i.getProvider("auth-internal")),new zS(h,i.getProvider("app-check-internal")),(function(_,w){if(!Object.prototype.hasOwnProperty.apply(_.options,["projectId"]))throw new ne(H.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ul(_.options.projectId,w)})(h,o),h);return l=Object.assign({useFetchStreams:t},l),f._setSettings(l),f}),"PUBLIC").setMultipleInstances(!0)),cr(Ey,wy,e),cr(Ey,wy,"esm2017")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tE="firebasestorage.googleapis.com",nE="storageBucket",QR=120*1e3,XR=600*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at extends vr{constructor(e,t,i=0){super(Ud(e),`Firebase Storage: ${t} (${Ud(e)})`),this.status_=i,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,at.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Ud(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var ot;(function(r){r.UNKNOWN="unknown",r.OBJECT_NOT_FOUND="object-not-found",r.BUCKET_NOT_FOUND="bucket-not-found",r.PROJECT_NOT_FOUND="project-not-found",r.QUOTA_EXCEEDED="quota-exceeded",r.UNAUTHENTICATED="unauthenticated",r.UNAUTHORIZED="unauthorized",r.UNAUTHORIZED_APP="unauthorized-app",r.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",r.INVALID_CHECKSUM="invalid-checksum",r.CANCELED="canceled",r.INVALID_EVENT_NAME="invalid-event-name",r.INVALID_URL="invalid-url",r.INVALID_DEFAULT_BUCKET="invalid-default-bucket",r.NO_DEFAULT_BUCKET="no-default-bucket",r.CANNOT_SLICE_BLOB="cannot-slice-blob",r.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",r.NO_DOWNLOAD_URL="no-download-url",r.INVALID_ARGUMENT="invalid-argument",r.INVALID_ARGUMENT_COUNT="invalid-argument-count",r.APP_DELETED="app-deleted",r.INVALID_ROOT_OPERATION="invalid-root-operation",r.INVALID_FORMAT="invalid-format",r.INTERNAL_ERROR="internal-error",r.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(ot||(ot={}));function Ud(r){return"storage/"+r}function vp(){const r="An unknown error occurred, please check the error payload for server response.";return new at(ot.UNKNOWN,r)}function YR(r){return new at(ot.OBJECT_NOT_FOUND,"Object '"+r+"' does not exist.")}function JR(r){return new at(ot.QUOTA_EXCEEDED,"Quota for bucket '"+r+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function ZR(){const r="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new at(ot.UNAUTHENTICATED,r)}function eC(){return new at(ot.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function tC(r){return new at(ot.UNAUTHORIZED,"User does not have permission to access '"+r+"'.")}function nC(){return new at(ot.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function rC(){return new at(ot.CANCELED,"User canceled the upload/download.")}function iC(r){return new at(ot.INVALID_URL,"Invalid URL '"+r+"'.")}function sC(r){return new at(ot.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.")}function oC(){return new at(ot.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+nE+"' property when initializing the app?")}function aC(){return new at(ot.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function lC(){return new at(ot.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function uC(r){return new at(ot.UNSUPPORTED_ENVIRONMENT,`${r} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function mf(r){return new at(ot.INVALID_ARGUMENT,r)}function rE(){return new at(ot.APP_DELETED,"The Firebase app was deleted.")}function cC(r){return new at(ot.INVALID_ROOT_OPERATION,"The operation '"+r+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function rl(r,e){return new at(ot.INVALID_FORMAT,"String does not match format '"+r+"': "+e)}function Wa(r){throw new at(ot.INTERNAL_ERROR,"Internal error: "+r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let i;try{i=vn.makeFromUrl(e,t)}catch{return new vn(e,"")}if(i.path==="")return i;throw sC(e)}static makeFromUrl(e,t){let i=null;const o="([A-Za-z0-9.\\-_]+)";function l(re){re.path.charAt(re.path.length-1)==="/"&&(re.path_=re.path_.slice(0,-1))}const h="(/(.*))?$",f=new RegExp("^gs://"+o+h,"i"),g={bucket:1,path:3};function _(re){re.path_=decodeURIComponent(re.path)}const w="v[A-Za-z0-9_]+",x=t.replace(/[.]/g,"\\."),A="(/([^?#]*).*)?$",O=new RegExp(`^https?://${x}/${w}/b/${o}/o${A}`,"i"),W={bucket:1,path:3},q=t===tE?"(?:storage.googleapis.com|storage.cloud.google.com)":t,$="([^?#]*)",he=new RegExp(`^https?://${q}/${o}/${$}`,"i"),J=[{regex:f,indices:g,postModify:l},{regex:O,indices:W,postModify:_},{regex:he,indices:{bucket:1,path:2},postModify:_}];for(let re=0;re<J.length;re++){const Ce=J[re],Ee=Ce.regex.exec(e);if(Ee){const D=Ee[Ce.indices.bucket];let S=Ee[Ce.indices.path];S||(S=""),i=new vn(D,S),Ce.postModify(i);break}}if(i==null)throw iC(e);return i}}class hC{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dC(r,e,t){let i=1,o=null,l=null,h=!1,f=0;function g(){return f===2}let _=!1;function w(...$){_||(_=!0,e.apply(null,$))}function x($){o=setTimeout(()=>{o=null,r(O,g())},$)}function A(){l&&clearTimeout(l)}function O($,...he){if(_){A();return}if($){A(),w.call(null,$,...he);return}if(g()||h){A(),w.call(null,$,...he);return}i<64&&(i*=2);let J;f===1?(f=2,J=0):J=(i+Math.random())*1e3,x(J)}let W=!1;function q($){W||(W=!0,A(),!_&&(o!==null?($||(f=2),clearTimeout(o),x(0)):$||(f=1)))}return x(0),l=setTimeout(()=>{h=!0,q(!0)},t),q}function fC(r){r(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pC(r){return r!==void 0}function mC(r){return typeof r=="object"&&!Array.isArray(r)}function Ep(r){return typeof r=="string"||r instanceof String}function v_(r){return wp()&&r instanceof Blob}function wp(){return typeof Blob<"u"}function E_(r,e,t,i){if(i<e)throw mf(`Invalid value for '${r}'. Expected ${e} or greater.`);if(i>t)throw mf(`Invalid value for '${r}'. Expected ${t} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tp(r,e,t){let i=e;return t==null&&(i=`https://${e}`),`${t}://${i}/v0${r}`}function iE(r){const e=encodeURIComponent;let t="?";for(const i in r)if(r.hasOwnProperty(i)){const o=e(i)+"="+e(r[i]);t=t+o+"&"}return t=t.slice(0,-1),t}var ws;(function(r){r[r.NO_ERROR=0]="NO_ERROR",r[r.NETWORK_ERROR=1]="NETWORK_ERROR",r[r.ABORT=2]="ABORT"})(ws||(ws={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gC(r,e){const t=r>=500&&r<600,o=[408,429].indexOf(r)!==-1,l=e.indexOf(r)!==-1;return t||o||l}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yC{constructor(e,t,i,o,l,h,f,g,_,w,x,A=!0,O=!1){this.url_=e,this.method_=t,this.headers_=i,this.body_=o,this.successCodes_=l,this.additionalRetryCodes_=h,this.callback_=f,this.errorCallback_=g,this.timeout_=_,this.progressCallback_=w,this.connectionFactory_=x,this.retry=A,this.isUsingEmulator=O,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((W,q)=>{this.resolve_=W,this.reject_=q,this.start_()})}start_(){const e=(i,o)=>{if(o){i(!1,new Yu(!1,null,!0));return}const l=this.connectionFactory_();this.pendingConnection_=l;const h=f=>{const g=f.loaded,_=f.lengthComputable?f.total:-1;this.progressCallback_!==null&&this.progressCallback_(g,_)};this.progressCallback_!==null&&l.addUploadProgressListener(h),l.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&l.removeUploadProgressListener(h),this.pendingConnection_=null;const f=l.getErrorCode()===ws.NO_ERROR,g=l.getStatus();if(!f||gC(g,this.additionalRetryCodes_)&&this.retry){const w=l.getErrorCode()===ws.ABORT;i(!1,new Yu(!1,null,w));return}const _=this.successCodes_.indexOf(g)!==-1;i(!0,new Yu(_,l))})},t=(i,o)=>{const l=this.resolve_,h=this.reject_,f=o.connection;if(o.wasSuccessCode)try{const g=this.callback_(f,f.getResponse());pC(g)?l(g):l()}catch(g){h(g)}else if(f!==null){const g=vp();g.serverResponse=f.getErrorText(),this.errorCallback_?h(this.errorCallback_(f,g)):h(g)}else if(o.canceled){const g=this.appDelete_?rE():rC();h(g)}else{const g=nC();h(g)}};this.canceled_?t(!1,new Yu(!1,null,!0)):this.backoffId_=dC(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&fC(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Yu{constructor(e,t,i){this.wasSuccessCode=e,this.connection=t,this.canceled=!!i}}function _C(r,e){e!==null&&e.length>0&&(r.Authorization="Firebase "+e)}function vC(r,e){r["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function EC(r,e){e&&(r["X-Firebase-GMPID"]=e)}function wC(r,e){e!==null&&(r["X-Firebase-AppCheck"]=e)}function TC(r,e,t,i,o,l,h=!0,f=!1){const g=iE(r.urlParams),_=r.url+g,w=Object.assign({},r.headers);return EC(w,e),_C(w,t),vC(w,l),wC(w,i),new yC(_,r.method,w,r.body,r.successCodes,r.additionalRetryCodes,r.handler,r.errorHandler,r.timeout,r.progressCallback,o,h,f)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function IC(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function SC(...r){const e=IC();if(e!==void 0){const t=new e;for(let i=0;i<r.length;i++)t.append(r[i]);return t.getBlob()}else{if(wp())return new Blob(r);throw new at(ot.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function xC(r,e,t){return r.webkitSlice?r.webkitSlice(e,t):r.mozSlice?r.mozSlice(e,t):r.slice?r.slice(e,t):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AC(r){if(typeof atob>"u")throw uC("base-64");return atob(r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ur={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class Bd{constructor(e,t){this.data=e,this.contentType=t||null}}function RC(r,e){switch(r){case ur.RAW:return new Bd(sE(e));case ur.BASE64:case ur.BASE64URL:return new Bd(oE(r,e));case ur.DATA_URL:return new Bd(kC(e),PC(e))}throw vp()}function sE(r){const e=[];for(let t=0;t<r.length;t++){let i=r.charCodeAt(t);if(i<=127)e.push(i);else if(i<=2047)e.push(192|i>>6,128|i&63);else if((i&64512)===55296)if(!(t<r.length-1&&(r.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{const l=i,h=r.charCodeAt(++t);i=65536|(l&1023)<<10|h&1023,e.push(240|i>>18,128|i>>12&63,128|i>>6&63,128|i&63)}else(i&64512)===56320?e.push(239,191,189):e.push(224|i>>12,128|i>>6&63,128|i&63)}return new Uint8Array(e)}function CC(r){let e;try{e=decodeURIComponent(r)}catch{throw rl(ur.DATA_URL,"Malformed data URL.")}return sE(e)}function oE(r,e){switch(r){case ur.BASE64:{const o=e.indexOf("-")!==-1,l=e.indexOf("_")!==-1;if(o||l)throw rl(r,"Invalid character '"+(o?"-":"_")+"' found: is it base64url encoded?");break}case ur.BASE64URL:{const o=e.indexOf("+")!==-1,l=e.indexOf("/")!==-1;if(o||l)throw rl(r,"Invalid character '"+(o?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=AC(e)}catch(o){throw o.message.includes("polyfill")?o:rl(r,"Invalid character found")}const i=new Uint8Array(t.length);for(let o=0;o<t.length;o++)i[o]=t.charCodeAt(o);return i}class aE{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(t===null)throw rl(ur.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const i=t[1]||null;i!=null&&(this.base64=bC(i,";base64"),this.contentType=this.base64?i.substring(0,i.length-7):i),this.rest=e.substring(e.indexOf(",")+1)}}function kC(r){const e=new aE(r);return e.base64?oE(ur.BASE64,e.rest):CC(e.rest)}function PC(r){return new aE(r).contentType}function bC(r,e){return r.length>=e.length?r.substring(r.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ii{constructor(e,t){let i=0,o="";v_(e)?(this.data_=e,i=e.size,o=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),i=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),i=e.length),this.size_=i,this.type_=o}size(){return this.size_}type(){return this.type_}slice(e,t){if(v_(this.data_)){const i=this.data_,o=xC(i,e,t);return o===null?null:new Ii(o)}else{const i=new Uint8Array(this.data_.buffer,e,t-e);return new Ii(i,!0)}}static getBlob(...e){if(wp()){const t=e.map(i=>i instanceof Ii?i.data_:i);return new Ii(SC.apply(null,t))}else{const t=e.map(h=>Ep(h)?RC(ur.RAW,h).data:h.data_);let i=0;t.forEach(h=>{i+=h.byteLength});const o=new Uint8Array(i);let l=0;return t.forEach(h=>{for(let f=0;f<h.length;f++)o[l++]=h[f]}),new Ii(o,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lE(r){let e;try{e=JSON.parse(r)}catch{return null}return mC(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function DC(r){if(r.length===0)return null;const e=r.lastIndexOf("/");return e===-1?"":r.slice(0,e)}function NC(r,e){const t=e.split("/").filter(i=>i.length>0).join("/");return r.length===0?t:r+"/"+t}function uE(r){const e=r.lastIndexOf("/",r.length-2);return e===-1?r:r.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function OC(r,e){return e}class Yt{constructor(e,t,i,o){this.server=e,this.local=t||e,this.writable=!!i,this.xform=o||OC}}let Ju=null;function VC(r){return!Ep(r)||r.length<2?r:uE(r)}function cE(){if(Ju)return Ju;const r=[];r.push(new Yt("bucket")),r.push(new Yt("generation")),r.push(new Yt("metageneration")),r.push(new Yt("name","fullPath",!0));function e(l,h){return VC(h)}const t=new Yt("name");t.xform=e,r.push(t);function i(l,h){return h!==void 0?Number(h):h}const o=new Yt("size");return o.xform=i,r.push(o),r.push(new Yt("timeCreated")),r.push(new Yt("updated")),r.push(new Yt("md5Hash",null,!0)),r.push(new Yt("cacheControl",null,!0)),r.push(new Yt("contentDisposition",null,!0)),r.push(new Yt("contentEncoding",null,!0)),r.push(new Yt("contentLanguage",null,!0)),r.push(new Yt("contentType",null,!0)),r.push(new Yt("metadata","customMetadata",!0)),Ju=r,Ju}function LC(r,e){function t(){const i=r.bucket,o=r.fullPath,l=new vn(i,o);return e._makeStorageReference(l)}Object.defineProperty(r,"ref",{get:t})}function MC(r,e,t){const i={};i.type="file";const o=t.length;for(let l=0;l<o;l++){const h=t[l];i[h.local]=h.xform(i,e[h.server])}return LC(i,r),i}function hE(r,e,t){const i=lE(e);return i===null?null:MC(r,i,t)}function jC(r,e,t,i){const o=lE(e);if(o===null||!Ep(o.downloadTokens))return null;const l=o.downloadTokens;if(l.length===0)return null;const h=encodeURIComponent;return l.split(",").map(_=>{const w=r.bucket,x=r.fullPath,A="/b/"+h(w)+"/o/"+h(x),O=Tp(A,t,i),W=iE({alt:"media",token:_});return O+W})[0]}function FC(r,e){const t={},i=e.length;for(let o=0;o<i;o++){const l=e[o];l.writable&&(t[l.server]=r[l.local])}return JSON.stringify(t)}class dE{constructor(e,t,i,o){this.url=e,this.method=t,this.handler=i,this.timeout=o,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fE(r){if(!r)throw vp()}function UC(r,e){function t(i,o){const l=hE(r,o,e);return fE(l!==null),l}return t}function BC(r,e){function t(i,o){const l=hE(r,o,e);return fE(l!==null),jC(l,o,r.host,r._protocol)}return t}function pE(r){function e(t,i){let o;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?o=eC():o=ZR():t.getStatus()===402?o=JR(r.bucket):t.getStatus()===403?o=tC(r.path):o=i,o.status=t.getStatus(),o.serverResponse=i.serverResponse,o}return e}function zC(r){const e=pE(r);function t(i,o){let l=e(i,o);return i.getStatus()===404&&(l=YR(r.path)),l.serverResponse=o.serverResponse,l}return t}function $C(r,e,t){const i=e.fullServerUrl(),o=Tp(i,r.host,r._protocol),l="GET",h=r.maxOperationRetryTime,f=new dE(o,l,BC(r,t),h);return f.errorHandler=zC(e),f}function WC(r,e){return r&&r.contentType||e&&e.type()||"application/octet-stream"}function HC(r,e,t){const i=Object.assign({},t);return i.fullPath=r.path,i.size=e.size(),i.contentType||(i.contentType=WC(null,e)),i}function qC(r,e,t,i,o){const l=e.bucketOnlyServerUrl(),h={"X-Goog-Upload-Protocol":"multipart"};function f(){let J="";for(let re=0;re<2;re++)J=J+Math.random().toString().slice(2);return J}const g=f();h["Content-Type"]="multipart/related; boundary="+g;const _=HC(e,i,o),w=FC(_,t),x="--"+g+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+w+`\r
--`+g+`\r
Content-Type: `+_.contentType+`\r
\r
`,A=`\r
--`+g+"--",O=Ii.getBlob(x,i,A);if(O===null)throw aC();const W={name:_.fullPath},q=Tp(l,r.host,r._protocol),$="POST",he=r.maxUploadRetryTime,M=new dE(q,$,UC(r,t),he);return M.urlParams=W,M.headers=h,M.body=O.uploadData(),M.errorHandler=pE(e),M}class GC{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=ws.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=ws.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=ws.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,i,o,l){if(this.sent_)throw Wa("cannot .send() more than once");if(ji(e)&&i&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),l!==void 0)for(const h in l)l.hasOwnProperty(h)&&this.xhr_.setRequestHeader(h,l[h].toString());return o!==void 0?this.xhr_.send(o):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw Wa("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw Wa("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw Wa("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw Wa("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class KC extends GC{initXhr(){this.xhr_.responseType="text"}}function mE(){return new KC}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs{constructor(e,t){this._service=e,t instanceof vn?this._location=t:this._location=vn.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Cs(e,t)}get root(){const e=new vn(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return uE(this._location.path)}get storage(){return this._service}get parent(){const e=DC(this._location.path);if(e===null)return null;const t=new vn(this._location.bucket,e);return new Cs(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw cC(e)}}function QC(r,e,t){r._throwIfRoot("uploadBytes");const i=qC(r.storage,r._location,cE(),new Ii(e,!0),t);return r.storage.makeRequestWithTokens(i,mE).then(o=>({metadata:o,ref:r}))}function XC(r){r._throwIfRoot("getDownloadURL");const e=$C(r.storage,r._location,cE());return r.storage.makeRequestWithTokens(e,mE).then(t=>{if(t===null)throw lC();return t})}function YC(r,e){const t=NC(r._location.path,e),i=new vn(r._location.bucket,t);return new Cs(r.storage,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JC(r){return/^[A-Za-z]+:\/\//.test(r)}function ZC(r,e){return new Cs(r,e)}function gE(r,e){if(r instanceof Ip){const t=r;if(t._bucket==null)throw oC();const i=new Cs(t,t._bucket);return e!=null?gE(i,e):i}else return e!==void 0?YC(r,e):r}function ek(r,e){if(e&&JC(e)){if(r instanceof Ip)return ZC(r,e);throw mf("To use ref(service, url), the first argument must be a Storage instance.")}else return gE(r,e)}function w_(r,e){const t=e==null?void 0:e[nE];return t==null?null:vn.makeFromBucketSpec(t,r)}function tk(r,e,t,i={}){r.host=`${e}:${t}`;const o=ji(e);o&&(_f(`https://${r.host}/b`),vf("Storage",!0)),r._isUsingEmulator=!0,r._protocol=o?"https":"http";const{mockUserToken:l}=i;l&&(r._overrideAuthToken=typeof l=="string"?l:N_(l,r.app.options.projectId))}class Ip{constructor(e,t,i,o,l,h=!1){this.app=e,this._authProvider=t,this._appCheckProvider=i,this._url=o,this._firebaseVersion=l,this._isUsingEmulator=h,this._bucket=null,this._host=tE,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=QR,this._maxUploadRetryTime=XR,this._requests=new Set,o!=null?this._bucket=vn.makeFromBucketSpec(o,this._host):this._bucket=w_(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=vn.makeFromBucketSpec(this._url,e):this._bucket=w_(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){E_("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){E_("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(yn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Cs(this,e)}_makeRequest(e,t,i,o,l=!0){if(this._deleted)return new hC(rE());{const h=TC(e,this._appId,i,o,t,this._firebaseVersion,l,this._isUsingEmulator);return this._requests.add(h),h.getPromise().then(()=>this._requests.delete(h),()=>this._requests.delete(h)),h}}async makeRequestWithTokens(e,t){const[i,o]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,i,o).getPromise()}}const T_="@firebase/storage",I_="0.13.14";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yE="storage";function nk(r,e,t){return r=st(r),QC(r,e,t)}function rk(r){return r=st(r),XC(r)}function ik(r,e){return r=st(r),ek(r,e)}function sk(r=Tf(),e){r=st(r);const i=kc(r,yE).getImmediate({identifier:e}),o=P_("storage");return o&&ok(i,...o),i}function ok(r,e,t,i={}){tk(r,e,t,i)}function ak(r,{instanceIdentifier:e}){const t=r.getProvider("app").getImmediate(),i=r.getProvider("auth-internal"),o=r.getProvider("app-check-internal");return new Ip(t,i,o,e,ks)}function lk(){Is(new ki(yE,ak,"PUBLIC").setMultipleInstances(!0)),cr(T_,I_,""),cr(T_,I_,"esm2017")}lk();const uk={apiKey:"AIzaSyB0HWg3uqpMiAf0lNihsgI-ys-24VZP3J4",authDomain:"habilis-eb89c.firebaseapp.com",projectId:"habilis-eb89c",storageBucket:"habilis-eb89c.firebasestorage.app",messagingSenderId:"947440925461",appId:"1:947440925461:web:e19cd4c3b639f438fb471c",measurementId:"G-NXTTH01G1N"},ck="PEGA_TU_GEMINI_API_KEY_AQUI",hk="gemini-2.0-flash",Sp=L_(uk),Cl=VS(Sp),Xn=NR(Sp),_E=sk(Sp),vE=(r,e)=>v1(Cl,r,e),dk=(r,e)=>E1(Cl,r,e),EE=()=>S1(Cl),wE=r=>I1(Cl,r);async function TE(r,e){await GR(Go(Xn,"tecnicos",r),{...e,uid:r,plan:"gratis",verificado:!1,rating:0,totalReviews:0,totalTrabajos:0,disponible:!0,createdAt:Mi(),updatedAt:Mi()})}async function xp(r){const e=await qR(Go(Xn,"tecnicos",r));return e.exists()?{id:e.id,...e.data()}:null}async function fk(r,e){await yp(Go(Xn,"tecnicos",r),{...e,updatedAt:Mi()})}async function gf({oficio:r,ciudad:e,soloVerificados:t,soloPro:i,limite:o=20}={}){let l=Al(Xn,"tecnicos");const h=[Ti("disponible","==",!0)];return r&&h.push(Ti("oficio","==",r)),e&&h.push(Ti("ciudad","==",e)),t&&h.push(Ti("verificado","==",!0)),i&&h.push(Ti("plan","==","pro")),l=cp(l,...h,fp("rating","desc"),mp(o)),(await gp(l)).docs.map(g=>({id:g.id,...g.data()}))}async function IE(r){return(await eE(Al(Xn,"trabajos"),{...r,estado:"pendiente",evidencias:[],createdAt:Mi(),updatedAt:Mi()})).id}async function pk(r,e){await yp(Go(Xn,"trabajos",r),{...e,updatedAt:Mi()})}async function Ap(r){const e=cp(Al(Xn,"trabajos"),Ti("tecnicoId","==",r),fp("createdAt","desc"),mp(50));return(await gp(e)).docs.map(i=>({id:i.id,...i.data()}))}async function mk(r){return(await eE(Al(Xn,"solicitudes"),{...r,estado:"abierta",respuestas:0,createdAt:Mi()})).id}async function gk(r){const e=cp(Al(Xn,"solicitudes"),Ti("ciudad","==",r),Ti("estado","==","abierta"),fp("createdAt","desc"),mp(20));return(await gp(e)).docs.map(i=>({id:i.id,...i.data()}))}async function SE(r,e,t="evidencia"){const i=ik(_E,`trabajos/${r}/${t}_${Date.now()}`),o=await nk(i,e);return await rk(o.ref)}async function yk(r,e){await yp(Go(Xn,"tecnicos",r),{plan:"pro",planActivadoEn:Mi(),planVenceEn:new Date(Date.now()+720*60*60*1e3),conektaCustomerId:(e==null?void 0:e.customerId)||null})}const _k=Object.freeze(Object.defineProperty({__proto__:null,activarPlanPro:yk,actualizarTecnico:fk,actualizarTrabajo:pk,auth:Cl,buscarTecnicos:gf,cerrarSesion:EE,crearPerfilTecnico:TE,crearSolicitud:mk,crearTrabajo:IE,db:Xn,iniciarSesion:dk,obtenerSolicitudesRecientes:gk,obtenerTecnico:xp,obtenerTrabajosDelTecnico:Ap,onAuth:wE,registrarUsuario:vE,storage:_E,subirFoto:SE},Symbol.toStringTag,{value:"Module"})),an={hero:{background:"#1E2A3B",color:"#fff",padding:"80px 20px",textAlign:"center"},logo:{background:"#D97706",color:"#fff",fontWeight:900,fontSize:"18px",padding:"5px 12px",borderRadius:"8px",display:"inline-block",marginBottom:"24px"},h1:{fontSize:"clamp(28px,5vw,48px)",fontWeight:900,lineHeight:1.1,marginBottom:"16px"},accent:{color:"#D97706"},sub:{color:"rgba(255,255,255,0.6)",fontSize:"16px",marginBottom:"36px",maxWidth:"480px",margin:"0 auto 36px",lineHeight:1.6},cats:{maxWidth:"960px",margin:"0 auto",padding:"40px 20px"},cat:{background:"#fff",border:"1px solid #E5E7EB",borderRadius:"12px",padding:"16px 10px",textAlign:"center",cursor:"pointer"},btn:{background:"#D97706",color:"#fff",border:"none",borderRadius:"12px",padding:"13px 26px",fontSize:"15px",fontWeight:700,cursor:"pointer"},btnOut:{background:"transparent",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:"12px",padding:"13px 26px",fontSize:"15px",fontWeight:600,cursor:"pointer"}},vk=[["⚡","Electricidad"],["❄️","Minisplits"],["🔧","Mecánica"],["🚿","Plomería"],["📷","Cámaras"],["🏗️","Herrería"],["🪟","Tablaroca"],["🎨","Pintura"],["⚙️","Motores"],["🌡️","Refrigeración"]];function Ek({nav:r}){return E.jsxs("div",{style:{minHeight:"100vh",background:"#F4F5F7",fontFamily:"'Inter',system-ui"},children:[E.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",rel:"stylesheet"}),E.jsxs("nav",{style:{background:"#1E2A3B",padding:"0 20px",height:"56px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[E.jsx("span",{style:{...an.logo,marginBottom:0,fontSize:"15px",padding:"4px 10px"},children:"OFICIO"}),E.jsxs("div",{style:{display:"flex",gap:"8px"},children:[E.jsx("button",{onClick:()=>r("buscar"),style:{...an.btnOut,padding:"7px 14px",fontSize:"12px"},children:"Buscar técnico"}),E.jsx("button",{onClick:()=>r("registro"),style:{...an.btn,padding:"7px 14px",fontSize:"12px"},children:"Registrarme"})]})]}),E.jsxs("div",{style:an.hero,children:[E.jsx("div",{style:an.logo,children:"OFICIO.MX"}),E.jsxs("h1",{style:an.h1,children:["Técnicos verificados con",E.jsx("br",{}),E.jsx("span",{style:an.accent,children:"trabajos documentados"})]}),E.jsx("p",{style:an.sub,children:"Perfiles reales · Evidencia antes/después · Reputación basada en hechos"}),E.jsxs("div",{style:{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"},children:[E.jsx("button",{style:an.btn,onClick:()=>r("buscar"),children:"Buscar técnico →"}),E.jsx("button",{style:an.btnOut,onClick:()=>r("registro",{modo:"tecnico"}),children:"Soy técnico — registro gratis"})]}),E.jsx("div",{style:{display:"flex",gap:"32px",justifyContent:"center",marginTop:"40px",flexWrap:"wrap"},children:[["30M+","Trabajadores en México sin reputación digital"],["$100","MXN/mes Plan Pro para técnicos"],["Gratis","Para clientes siempre"]].map(([e,t])=>E.jsxs("div",{style:{textAlign:"center"},children:[E.jsx("div",{style:{fontWeight:900,fontSize:"22px",color:"#D97706"},children:e}),E.jsx("div",{style:{color:"rgba(255,255,255,0.5)",fontSize:"12px",marginTop:"3px"},children:t})]},e))})]}),E.jsxs("div",{style:an.cats,children:[E.jsx("p",{style:{fontSize:"11px",fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"16px",textAlign:"center"},children:"Servicios disponibles"}),E.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"10px"},children:vk.map(([e,t])=>E.jsxs("button",{style:an.cat,onClick:()=>r("buscar",{oficio:t}),children:[E.jsx("div",{style:{fontSize:"26px",marginBottom:"8px"},children:e}),E.jsx("div",{style:{fontSize:"12px",fontWeight:600,color:"#111827",lineHeight:1.3},children:t})]},t))})]}),E.jsxs("div",{style:{background:"#1E2A3B",color:"#fff",padding:"60px 20px",textAlign:"center"},children:[E.jsx("p",{style:{color:"#D97706",fontSize:"12px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"12px"},children:"¿Eres técnico?"}),E.jsx("h2",{style:{fontSize:"28px",fontWeight:900,marginBottom:"12px"},children:"Construye tu historial profesional"}),E.jsx("p",{style:{color:"rgba(255,255,255,0.55)",fontSize:"14px",maxWidth:"420px",margin:"0 auto 28px",lineHeight:1.6},children:"Registra tus trabajos con fotos, acumula reputación real, consigue más clientes. La IA de Gemini escribe tu perfil aunque no escribas bien."}),E.jsx("button",{style:an.btn,onClick:()=>r("registro"),children:"Crear perfil gratis →"})]}),E.jsxs("div",{style:{background:"#fff",borderTop:"1px solid #E5E7EB",padding:"20px",textAlign:"center"},children:[E.jsx("span",{style:{...an.logo,fontSize:"13px",padding:"3px 8px"},children:"OFICIO"}),E.jsx("p",{style:{color:"#9CA3AF",fontSize:"12px",marginTop:"8px"},children:"Infraestructura de confianza para trabajadores técnicos · México 2025"})]})]})}const wk=`https://generativelanguage.googleapis.com/v1beta/models/${hk}:generateContent?key=${ck}`;async function Rp(r,e=.7){var o,l,h,f,g;const t=await fetch(wk,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:r}]}],generationConfig:{temperature:e,maxOutputTokens:1024}})});if(!t.ok)throw new Error(`Gemini error: ${t.status}`);return((g=(f=(h=(l=(o=(await t.json()).candidates)==null?void 0:o[0])==null?void 0:l.content)==null?void 0:h.parts)==null?void 0:f[0])==null?void 0:g.text)||""}async function Tk(r,e){const t=`Eres un asistente que ayuda a trabajadores técnicos en México a crear perfiles profesionales.

El siguiente texto fue escrito por un ${e} para describirse:
"${r}"

Transforma este texto en un perfil profesional bien redactado en español. 
Reglas:
- Mantén los datos reales que menciona (años de experiencia, especialidades, zona)
- No inventes información que no esté en el texto original
- Tono: profesional pero cercano, no corporativo
- Formato: párrafo de presentación + lista de lo que incluye su servicio
- Máximo 150 palabras
- No uses frases como "con mucho gusto" o "a sus órdenes"

Responde SOLO con el perfil mejorado, sin explicaciones.`;return await Rp(t,.5)}async function Ik(r){const e=`Clasifica este trabajo técnico en México.

Descripción: "${r}"

Responde SOLO con JSON válido:
{
  "tipo": "Instalación|Reparación|Mantenimiento|Diagnóstico|Otro",
  "categoria": "Electricidad|Plomería|HVAC|Redes|Cámaras|Herrería|Tablaroca|Pintura|Mecánica|Otro",
  "urgencia": "baja|media|alta",
  "palabrasClave": ["keyword1", "keyword2"]
}`;try{const i=(await Rp(e,.1)).replace(/```json|```/g,"").trim();return JSON.parse(i)}catch{return{tipo:"Otro",categoria:"Otro",urgencia:"media",palabrasClave:[]}}}async function Sk(r,e){const t=`Eres asistente de un técnico mexicano. Ayúdale a responder esta solicitud de cliente.

Perfil del técnico: ${e.nombre}, ${e.oficio}, ${e.experiencia} años de experiencia.

Solicitud del cliente: "${r}"

Escribe una respuesta profesional y directa (máximo 80 palabras) que:
- Confirme que puede hacer el trabajo
- Mencione su experiencia relevante
- Indique que puede dar presupuesto
- Sea amable pero no exagerada

Responde SOLO con el texto de la respuesta.`;return await Rp(t,.6)}const xk=["Electricista","Plomero","Técnico HVAC / Minisplits","Albañil","Tablaroquero","Mecánico","Técnico en redes","Instalador CCTV","Pintor","Soldador","Refrigeración","Otro"],Ie={page:{minHeight:"100vh",background:"#F4F5F7"},header:{background:"#1E2A3B",color:"#fff",padding:"16px 20px",display:"flex",alignItems:"center",gap:"16px"},logo:{background:"#D97706",color:"#fff",fontWeight:800,fontSize:"15px",padding:"4px 10px",borderRadius:"8px"},wrap:{maxWidth:"560px",margin:"0 auto",padding:"32px 20px"},card:{background:"#fff",border:"1px solid #E5E7EB",borderRadius:"16px",padding:"24px"},h1:{fontSize:"22px",fontWeight:800,marginBottom:"6px"},sub:{color:"#6B7280",fontSize:"14px",marginBottom:"24px"},label:{display:"block",fontSize:"11px",fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"5px"},inp:{width:"100%",border:"1px solid #D1D5DB",borderRadius:"10px",padding:"10px 14px",fontSize:"13px",outline:"none",background:"#F9FAFB"},btn:{width:"100%",background:"#D97706",color:"#fff",border:"none",borderRadius:"10px",padding:"12px",fontSize:"14px",fontWeight:700},btnSec:{width:"100%",background:"#fff",color:"#374151",border:"1px solid #D1D5DB",borderRadius:"10px",padding:"12px",fontSize:"14px",fontWeight:600},grid2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"},err:{background:"#FEE2E2",border:"1px solid #FECACA",borderRadius:"10px",padding:"10px 14px",fontSize:"13px",color:"#991B1B"},aiBox:{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:"12px",padding:"16px",marginTop:"12px"},aiBtn:{background:"#D97706",color:"#fff",border:"none",borderRadius:"8px",padding:"8px 14px",fontSize:"12px",fontWeight:700},spinner:{width:"16px",height:"16px",border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite",marginRight:"6px"}};function Ak({nav:r,user:e,params:t}){t!=null&&t.modo;const[i,o]=Ue.useState(1),[l,h]=Ue.useState(!1),[f,g]=Ue.useState(!1),[_,w]=Ue.useState(""),[x,A]=Ue.useState(""),[O,W]=Ue.useState({nombre:"",apellido:"",email:"",password:"",oficio:"Electricista",ciudad:"",experiencia:"",textoRaw:"",perfilFinal:"",especialidades:[],herramientas:!1,disponibilidad:""}),q=M=>J=>W(re=>({...re,[M]:J.target.value})),$=async()=>{if(O.textoRaw.trim()){g(!0);try{const M=await Tk(O.textoRaw,O.oficio);A(M),W(J=>({...J,perfilFinal:M}))}catch{w("Error con Gemini IA. Revisa tu API key.")}finally{g(!1)}}},he=async()=>{w(""),h(!0);try{const M=await vE(O.email,O.password);await TE(M.user.uid,{nombre:`${O.nombre} ${O.apellido}`.trim(),email:O.email,oficio:O.oficio,ciudad:O.ciudad,experiencia:parseInt(O.experiencia)||0,bio:O.perfilFinal||O.textoRaw,herramientas:O.herramientas,disponibilidad:O.disponibilidad,tipo:"tecnico"}),r("panel")}catch(M){w(M.code==="auth/email-already-in-use"?"Ese correo ya está registrado.":"Error al registrar. Intenta de nuevo.")}finally{h(!1)}};return E.jsxs("div",{style:Ie.page,children:[E.jsx("style",{children:"@keyframes spin{to{transform:rotate(360deg)}}"}),E.jsxs("div",{style:Ie.header,children:[E.jsx("button",{onClick:()=>r("landing"),style:{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontSize:"13px",fontWeight:600},children:"← Inicio"}),E.jsx("span",{style:Ie.logo,children:"OFICIO"}),E.jsx("span",{style:{color:"rgba(255,255,255,0.5)",fontSize:"13px"},children:"Crear perfil técnico"})]}),E.jsxs("div",{style:Ie.wrap,children:[E.jsx("div",{style:{display:"flex",gap:"8px",marginBottom:"24px"},children:[1,2,3].map(M=>E.jsx("div",{style:{flex:1,height:"4px",borderRadius:"2px",background:i>=M?"#D97706":"#E5E7EB"}},M))}),E.jsxs("div",{style:Ie.card,children:[i===1&&E.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[E.jsxs("div",{children:[E.jsx("h1",{style:Ie.h1,children:"Crea tu perfil"}),E.jsx("p",{style:Ie.sub,children:"Es gratis. En 24 hrs estás en las búsquedas."})]}),E.jsxs("div",{style:Ie.grid2,children:[E.jsxs("div",{children:[E.jsx("label",{style:Ie.label,children:"Nombre *"}),E.jsx("input",{style:Ie.inp,value:O.nombre,onChange:q("nombre"),placeholder:"Juan"})]}),E.jsxs("div",{children:[E.jsx("label",{style:Ie.label,children:"Apellido *"}),E.jsx("input",{style:Ie.inp,value:O.apellido,onChange:q("apellido"),placeholder:"Pérez"})]})]}),E.jsxs("div",{children:[E.jsx("label",{style:Ie.label,children:"Correo *"}),E.jsx("input",{style:Ie.inp,type:"email",value:O.email,onChange:q("email"),placeholder:"tu@correo.com"})]}),E.jsxs("div",{children:[E.jsx("label",{style:Ie.label,children:"Contraseña *"}),E.jsx("input",{style:Ie.inp,type:"password",value:O.password,onChange:q("password"),placeholder:"Mínimo 6 caracteres"})]}),E.jsxs("div",{style:Ie.grid2,children:[E.jsxs("div",{children:[E.jsx("label",{style:Ie.label,children:"Oficio principal *"}),E.jsx("select",{style:Ie.inp,value:O.oficio,onChange:q("oficio"),children:xk.map(M=>E.jsx("option",{children:M},M))})]}),E.jsxs("div",{children:[E.jsx("label",{style:Ie.label,children:"Ciudad *"}),E.jsx("input",{style:Ie.inp,value:O.ciudad,onChange:q("ciudad"),placeholder:"CDMX, GDL..."})]})]}),E.jsxs("div",{children:[E.jsx("label",{style:Ie.label,children:"Años de experiencia"}),E.jsx("input",{style:Ie.inp,type:"number",value:O.experiencia,onChange:q("experiencia"),placeholder:"0",min:"0",max:"60"})]}),_&&E.jsx("div",{style:Ie.err,children:_}),E.jsx("button",{style:Ie.btn,onClick:()=>{O.nombre&&O.email&&O.password&&O.ciudad?o(2):w("Llena todos los campos marcados con *")},children:"Continuar →"})]}),i===2&&E.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[E.jsxs("div",{children:[E.jsx("h1",{style:Ie.h1,children:"Cuéntanos sobre ti"}),E.jsx("p",{style:Ie.sub,children:"Escribe como quieras — la IA de Gemini lo mejora."})]}),E.jsxs("div",{children:[E.jsx("label",{style:Ie.label,children:"Descríbete con tus propias palabras"}),E.jsx("textarea",{style:{...Ie.inp,resize:"vertical",minHeight:"100px"},value:O.textoRaw,onChange:q("textoRaw"),placeholder:"Soy electricista con 10 años de experiencia, hago instalaciones en casas y negocios, tengo mis herramientas y garantizo mi trabajo..."}),E.jsxs("button",{style:{...Ie.aiBtn,marginTop:"8px"},onClick:$,disabled:f||!O.textoRaw,children:[f&&E.jsx("span",{style:Ie.spinner}),f?"Gemini mejorando...":"✨ Mejorar con Gemini IA"]})]}),x&&E.jsxs("div",{style:Ie.aiBox,children:[E.jsx("p",{style:{fontSize:"11px",fontWeight:700,color:"#92400E",marginBottom:"8px"},children:"✅ VERSIÓN MEJORADA POR GEMINI"}),E.jsx("textarea",{style:{...Ie.inp,resize:"vertical",minHeight:"120px",background:"transparent",border:"none",padding:"0",fontSize:"13px",lineHeight:"1.6"},value:O.perfilFinal,onChange:q("perfilFinal")}),E.jsx("p",{style:{fontSize:"11px",color:"#92400E",marginTop:"6px"},children:"Puedes editar el texto antes de publicar."})]}),E.jsxs("div",{children:[E.jsx("label",{style:Ie.label,children:"Disponibilidad"}),E.jsx("input",{style:Ie.inp,value:O.disponibilidad,onChange:q("disponibilidad"),placeholder:"Lun–Vie 8am–6pm · Sáb mañanas"})]}),E.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:"#374151"},children:[E.jsx("input",{type:"checkbox",checked:O.herramientas,onChange:M=>W(J=>({...J,herramientas:M.target.checked}))}),"Tengo herramienta propia"]}),E.jsxs("div",{style:{display:"flex",gap:"10px"},children:[E.jsx("button",{style:{...Ie.btnSec,flex:1},onClick:()=>o(1),children:"← Atrás"}),E.jsx("button",{style:{...Ie.btn,flex:2},onClick:()=>o(3),children:"Continuar →"})]})]}),i===3&&E.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[E.jsxs("div",{children:[E.jsx("h1",{style:Ie.h1,children:"¡Listo para publicar!"}),E.jsx("p",{style:Ie.sub,children:"Revisa tu información antes de crear tu cuenta."})]}),E.jsx("div",{style:{background:"#F9FAFB",borderRadius:"12px",padding:"16px",display:"flex",flexDirection:"column",gap:"8px"},children:[["Nombre",`${O.nombre} ${O.apellido}`],["Oficio",O.oficio],["Ciudad",O.ciudad],["Experiencia",`${O.experiencia} años`],["Plan","Gratuito — puedes actualizar a Pro después"]].map(([M,J])=>E.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"13px"},children:[E.jsx("span",{style:{color:"#6B7280"},children:M}),E.jsx("span",{style:{fontWeight:600},children:J})]},M))}),E.jsxs("div",{style:{background:"#FEF3C7",border:"1px solid #FDE68A",borderRadius:"10px",padding:"12px",fontSize:"13px",color:"#92400E"},children:["🔑 Tu perfil aparecerá en búsquedas en las próximas 24 horas después de revisión. Para aparecer primero, actualiza a ",E.jsx("b",{children:"Plan Pro por $100 MXN/mes"}),"."]}),_&&E.jsx("div",{style:Ie.err,children:_}),E.jsxs("div",{style:{display:"flex",gap:"10px"},children:[E.jsx("button",{style:{...Ie.btnSec,flex:1},onClick:()=>o(2),children:"← Atrás"}),E.jsxs("button",{style:{...Ie.btn,flex:2},onClick:he,disabled:l,children:[l&&E.jsx("span",{style:Ie.spinner}),l?"Creando cuenta...":"Crear mi perfil gratis →"]})]}),E.jsx("p",{style:{fontSize:"11px",color:"#9CA3AF",textAlign:"center",lineHeight:"1.5"},children:"Al registrarte aceptas los términos. Oficio.mx conecta técnicos con clientes pero no garantiza trabajos ni se responsabiliza por acuerdos entre partes."})]})]})]})]})}function Rk({nav:r,params:e}){var f;const[t,i]=Ue.useState(null),[o,l]=Ue.useState([]);Ue.useEffect(()=>{e!=null&&e.tecnicoId&&xp(e.tecnicoId).then(g=>{i(g),g&&Ap(g.uid).then(l)})},[e==null?void 0:e.tecnicoId]);const h={page:{minHeight:"100vh",background:"#F4F5F7"},header:{background:"#1E2A3B",color:"#fff",padding:"14px 20px",display:"flex",gap:"14px",alignItems:"center"},logo:{background:"#D97706",color:"#fff",fontWeight:900,fontSize:"15px",padding:"4px 10px",borderRadius:"8px"},wrap:{maxWidth:"680px",margin:"0 auto",padding:"20px"},card:{background:"#fff",border:"1px solid #E5E7EB",borderRadius:"16px",padding:"20px",marginBottom:"14px"},btn:{background:"#D97706",color:"#fff",border:"none",borderRadius:"10px",padding:"11px 20px",fontSize:"14px",fontWeight:700,cursor:"pointer"}};return t?E.jsxs("div",{style:h.page,children:[E.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",rel:"stylesheet"}),E.jsxs("div",{style:h.header,children:[E.jsx("button",{onClick:()=>r("buscar"),style:{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontSize:"13px",fontWeight:600},children:"← Buscar"}),E.jsx("span",{style:h.logo,children:"OFICIO"})]}),E.jsxs("div",{style:h.wrap,children:[E.jsxs("div",{style:h.card,children:[E.jsxs("div",{style:{display:"flex",gap:"16px",alignItems:"flex-start",marginBottom:"16px"},children:[E.jsx("div",{style:{width:"64px",height:"64px",background:"linear-gradient(135deg,#1E2A3B,#2D3F55)",borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"22px",color:"#fff",flexShrink:0,border:t.plan==="pro"?"3px solid #D97706":"none"},children:(f=t.nombre)==null?void 0:f.charAt(0)}),E.jsxs("div",{style:{flex:1},children:[E.jsx("h1",{style:{fontSize:"20px",fontWeight:800,marginBottom:"3px"},children:t.nombre}),E.jsx("p",{style:{color:"#D97706",fontWeight:600,fontSize:"14px"},children:t.oficio}),E.jsxs("p",{style:{color:"#9CA3AF",fontSize:"13px"},children:["📍 ",t.ciudad," · ",t.experiencia," años"]}),t.verificado&&E.jsx("span",{style:{background:"#D1FAE5",color:"#059669",fontSize:"11px",fontWeight:700,padding:"2px 8px",borderRadius:"6px",display:"inline-block",marginTop:"6px"},children:"✅ Verificado"})]})]}),t.bio&&E.jsx("p",{style:{color:"#4B5563",fontSize:"13px",lineHeight:1.6,marginBottom:"16px"},children:t.bio}),E.jsxs("div",{style:{display:"flex",gap:"8px"},children:[E.jsx("button",{style:{...h.btn,flex:2},children:"💬 Contactar"}),E.jsx("button",{style:{...h.btn,flex:1,background:"#fff",color:"#374151",border:"1px solid #D1D5DB"},children:"Guardar"})]})]}),o.length>0&&E.jsxs("div",{style:h.card,children:[E.jsxs("h2",{style:{fontWeight:700,fontSize:"15px",marginBottom:"14px"},children:["Trabajos registrados (",o.length,")"]}),o.map(g=>E.jsxs("div",{style:{padding:"12px",background:"#F9FAFB",borderRadius:"10px",marginBottom:"8px",border:"1px solid #E5E7EB"},children:[E.jsx("p",{style:{fontWeight:600,fontSize:"13px",marginBottom:"3px"},children:g.titulo}),E.jsxs("p",{style:{color:"#6B7280",fontSize:"12px"},children:[g.tipo," · ",g.ciudad," · ⏱ ",g.tiempoHoras,"h"]})]},g.id))]}),E.jsx("div",{style:{...h.card,background:"#FFFBEB",border:"1px solid #FDE68A"},children:E.jsxs("p",{style:{color:"#92400E",fontSize:"13px",lineHeight:1.5},children:[E.jsx("b",{children:"Oficio.mx conecta clientes con técnicos"})," pero no garantiza trabajos ni se hace responsable por acuerdos entre partes. Valida siempre el trabajo antes de pagar."]})})]})]}):E.jsxs("div",{style:h.page,children:[E.jsx("div",{style:h.header,children:E.jsx("span",{style:h.logo,children:"OFICIO"})}),E.jsx("p",{style:{textAlign:"center",padding:"60px",color:"#6B7280"},children:"Cargando perfil..."})]})}function Ck({nav:r,params:e}){const[t,i]=Ue.useState([]),[o,l]=Ue.useState(!0),[h,f]=Ue.useState((e==null?void 0:e.oficio)||"");Ue.useEffect(()=>{gf({oficio:e==null?void 0:e.oficio}).then(_=>{i(_),l(!1)})},[]);const g={page:{minHeight:"100vh",background:"#F4F5F7"},header:{background:"#1E2A3B",color:"#fff",padding:"14px 20px",display:"flex",alignItems:"center",gap:"14px"},logo:{background:"#D97706",color:"#fff",fontWeight:900,fontSize:"15px",padding:"4px 10px",borderRadius:"8px"},card:{background:"#fff",border:"1px solid #E5E7EB",borderRadius:"16px",padding:"18px",cursor:"pointer"},inp:{flex:1,border:"1px solid #D1D5DB",borderRadius:"10px",padding:"10px 14px",fontSize:"13px",outline:"none",background:"#F9FAFB"},btn:{background:"#D97706",color:"#fff",border:"none",borderRadius:"10px",padding:"10px 18px",fontSize:"13px",fontWeight:700}};return E.jsxs("div",{style:g.page,children:[E.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",rel:"stylesheet"}),E.jsxs("div",{style:g.header,children:[E.jsx("button",{onClick:()=>r("landing"),style:{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontSize:"13px",fontWeight:600},children:"← Inicio"}),E.jsx("span",{style:g.logo,children:"OFICIO"})]}),E.jsx("div",{style:{background:"#fff",borderBottom:"1px solid #E5E7EB",padding:"14px 20px"},children:E.jsxs("div",{style:{display:"flex",gap:"8px",maxWidth:"960px",margin:"0 auto"},children:[E.jsx("input",{style:g.inp,value:h,onChange:_=>f(_.target.value),placeholder:"¿Qué necesitas? (electricista, plomero...)"}),E.jsx("button",{style:g.btn,onClick:()=>gf({oficio:h}).then(i),children:"Buscar"})]})}),E.jsx("div",{style:{maxWidth:"960px",margin:"0 auto",padding:"20px"},children:o?E.jsx("p",{style:{color:"#6B7280",textAlign:"center",padding:"40px"},children:"Cargando técnicos..."}):t.length===0?E.jsxs("div",{style:{textAlign:"center",padding:"60px 20px"},children:[E.jsx("p",{style:{fontSize:"40px",marginBottom:"12px"},children:"🔍"}),E.jsx("p",{style:{fontWeight:700,marginBottom:"6px"},children:"Nadie registrado aún en esta zona"}),E.jsx("p",{style:{color:"#6B7280",fontSize:"13px",marginBottom:"16px"},children:"Sé el primero en registrarte"}),E.jsx("button",{style:{...g.btn,borderRadius:"12px",padding:"12px 24px"},onClick:()=>r("registro"),children:"Registrarme gratis →"})]}):E.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[E.jsxs("p",{style:{color:"#6B7280",fontSize:"13px"},children:[t.length," técnicos encontrados"]}),t.map(_=>{var w;return E.jsx("div",{style:g.card,onClick:()=>r("perfil",{tecnicoId:_.id}),children:E.jsxs("div",{style:{display:"flex",gap:"14px",alignItems:"flex-start"},children:[E.jsx("div",{style:{width:"48px",height:"48px",background:"linear-gradient(135deg,#1E2A3B,#2D3F55)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"16px",color:"#fff",flexShrink:0},children:((w=_.nombre)==null?void 0:w.charAt(0))||"T"}),E.jsxs("div",{style:{flex:1},children:[E.jsx("p",{style:{fontWeight:700,fontSize:"15px"},children:_.nombre}),E.jsx("p",{style:{color:"#D97706",fontSize:"13px"},children:_.oficio}),E.jsxs("p",{style:{color:"#9CA3AF",fontSize:"12px"},children:["📍 ",_.ciudad," · ",_.experiencia," años · ⭐ ",_.rating||"Nuevo"]}),_.plan==="pro"&&E.jsx("span",{style:{background:"#FEF3C7",color:"#92400E",fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"6px"},children:"⚡ PRO"})]}),E.jsx("button",{style:{...g.btn,padding:"7px 14px",fontSize:"12px"},children:"Contactar"})]})},_.id)})]})})]})}const kk=r=>`$${(r||0).toLocaleString("es-MX",{minimumFractionDigits:0})}`,Ke={page:{minHeight:"100vh",background:"#F4F5F7"},header:{background:"#1E2A3B",color:"#fff",padding:"0 20px",height:"56px",display:"flex",alignItems:"center",justifyContent:"space-between"},logo:{background:"#D97706",color:"#fff",fontWeight:900,fontSize:"15px",padding:"4px 10px",borderRadius:"8px"},banner:{background:"#FFFBEB",borderBottom:"1px solid #FDE68A",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",flexWrap:"wrap"},wrap:{maxWidth:"960px",margin:"0 auto",padding:"20px"},card:{background:"#fff",border:"1px solid #E5E7EB",borderRadius:"16px",padding:"20px"},metric:{background:"#F9FAFB",borderRadius:"12px",padding:"14px",textAlign:"center"},tab:r=>({flex:1,padding:"9px",background:r?"#1E2A3B":"transparent",color:r?"#fff":"#6B7280",border:"none",borderRadius:"10px",fontSize:"12px",fontWeight:700,whiteSpace:"nowrap"}),btn:{background:"#D97706",color:"#fff",border:"none",borderRadius:"10px",padding:"9px 16px",fontSize:"13px",fontWeight:700},btnSm:{background:"#D97706",color:"#fff",border:"none",borderRadius:"8px",padding:"6px 12px",fontSize:"12px",fontWeight:700},btnGh:{background:"#fff",color:"#374151",border:"1px solid #D1D5DB",borderRadius:"8px",padding:"6px 12px",fontSize:"12px",fontWeight:600}};function Pk({nav:r,user:e}){const[t,i]=Ue.useState(null),[o,l]=Ue.useState([]),[h,f]=Ue.useState("inicio"),[g,_]=Ue.useState(""),[w,x]=Ue.useState(!1),[A,O]=Ue.useState("Necesito instalar un foco nuevo en la cocina, ¿puede venir mañana?");Ue.useEffect(()=>{if(!e){r("landing");return}xp(e.uid).then(i),Ap(e.uid).then(l)},[e]);const W=async()=>{if(t){x(!0);try{const M=await Sk(A,t);_(M)}finally{x(!1)}}},q=async()=>{await EE(),r("landing")},$=(t==null?void 0:t.plan)==="pro",he={trabajos:o.length,completados:o.filter(M=>M.estado==="terminado"||M.estado==="validado").length,pendientes:o.filter(M=>M.estado==="pendiente"||M.estado==="aceptado").length,ingresos:o.filter(M=>M.estado==="validado").reduce((M,J)=>M+(J.costoTotal||0),0)};return t?E.jsxs("div",{style:Ke.page,children:[E.jsx("style",{children:"@keyframes spin{to{transform:rotate(360deg)}}"}),E.jsxs("div",{style:Ke.header,children:[E.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"14px"},children:[E.jsx("span",{style:Ke.logo,children:"OFICIO"}),E.jsx("span",{style:{color:"rgba(255,255,255,0.5)",fontSize:"13px"},children:"Mi panel"})]}),E.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[E.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"5px"},children:[E.jsx("div",{style:{width:"6px",height:"6px",background:"#22c55e",borderRadius:"50%"}}),E.jsx("span",{style:{color:"rgba(255,255,255,0.6)",fontSize:"12px"},children:t.nombre})]}),E.jsx("button",{onClick:q,style:{...Ke.btnGh,background:"transparent",borderColor:"rgba(255,255,255,0.2)",color:"rgba(255,255,255,0.5)"},children:"Salir"})]})]}),!$&&E.jsxs("div",{style:Ke.banner,children:[E.jsxs("p",{style:{fontSize:"13px",color:"#92400E"},children:[E.jsx("b",{children:"Plan gratuito activo."})," Actualiza a ",E.jsx("b",{children:"Pro por $100 MXN/mes"})," → apareces primero en búsquedas + sin anuncios + estadísticas completas"]}),E.jsx("button",{style:Ke.btnSm,onClick:()=>r("pricing"),children:"Ver Plan Pro →"})]}),E.jsxs("div",{style:Ke.wrap,children:[E.jsx("div",{style:{display:"flex",gap:"4px",background:"#fff",padding:"4px",borderRadius:"14px",border:"1px solid #E5E7EB",marginBottom:"20px",overflowX:"auto"},children:["inicio","trabajos","ia-herramientas","configurar"].map(M=>E.jsx("button",{style:Ke.tab(h===M),onClick:()=>f(M),children:M==="ia-herramientas"?"✨ IA":M.charAt(0).toUpperCase()+M.slice(1)},M))}),h==="inicio"&&E.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[E.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"},children:[{l:"Total trabajos",v:he.trabajos,icon:"🔧"},{l:"Completados",v:he.completados,icon:"✅"},{l:"En proceso",v:he.pendientes,icon:"⏳"},{l:"Ingresos registrados",v:kk(he.ingresos),icon:"💰"}].map(M=>E.jsxs("div",{style:Ke.metric,children:[E.jsx("div",{style:{fontSize:"22px",marginBottom:"6px"},children:M.icon}),E.jsx("div",{style:{fontSize:"20px",fontWeight:800,color:"#D97706"},children:M.v}),E.jsx("div",{style:{fontSize:"11px",color:"#6B7280",marginTop:"2px"},children:M.l})]},M.l))}),E.jsxs("div",{style:Ke.card,children:[E.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[E.jsx("h3",{style:{fontWeight:700,fontSize:"15px"},children:"Solicitudes recientes"}),E.jsx("button",{style:Ke.btnSm,onClick:()=>r("registrarTrabajo"),children:"+ Registrar trabajo"})]}),[{cliente:"Roberto G.",servicio:"Instalación eléctrica",ciudad:"Benito Juárez",hora:"Hace 20 min",nuevo:!0},{cliente:"María T.",servicio:"Revisión tablero",ciudad:"Coyoacán",hora:"Hace 1 hr",nuevo:!0},{cliente:"Luis P.",servicio:"Panel 200A",ciudad:"Tlalpan",hora:"Hace 3 hrs",nuevo:!1}].map((M,J)=>E.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",padding:"12px",background:M.nuevo?"#FFFBEB":"#F9FAFB",borderRadius:"10px",border:`1px solid ${M.nuevo?"#FDE68A":"#E5E7EB"}`,marginBottom:J<2?"8px":0},children:[E.jsxs("div",{style:{flex:1},children:[E.jsxs("div",{style:{display:"flex",gap:"6px",alignItems:"center",marginBottom:"3px"},children:[E.jsx("span",{style:{fontWeight:700,fontSize:"13px"},children:M.cliente}),M.nuevo&&E.jsx("span",{style:{background:"#D97706",color:"#fff",fontSize:"9px",fontWeight:800,padding:"2px 7px",borderRadius:"20px"},children:"NUEVO"})]}),E.jsxs("p",{style:{color:"#6B7280",fontSize:"12px"},children:[M.servicio," · 📍 ",M.ciudad," · ",M.hora]})]}),E.jsx("button",{style:Ke.btnSm,children:"Responder"})]},J))]}),E.jsx("div",{style:Ke.card,children:E.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[E.jsxs("div",{children:[E.jsx("h3",{style:{fontWeight:700,fontSize:"15px"},children:"Posición en búsquedas"}),E.jsxs("p",{style:{color:"#6B7280",fontSize:"12px",marginTop:"3px"},children:['"',t.oficio,'" en ',t.ciudad]})]}),E.jsxs("div",{style:{textAlign:"center"},children:[E.jsx("div",{style:{fontSize:"40px",fontWeight:900,color:"#D97706"},children:"#8"}),!$&&E.jsx("button",{onClick:()=>r("pricing"),style:{color:"#1D4ED8",background:"none",border:"none",fontSize:"11px",fontWeight:700},children:"Subir al #1 con Pro →"})]})]})})]}),h==="trabajos"&&E.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[E.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:"4px"},children:E.jsx("button",{style:Ke.btn,onClick:()=>r("registrarTrabajo"),children:"+ Documentar trabajo"})}),o.length===0?E.jsxs("div",{style:{...Ke.card,textAlign:"center",padding:"48px 24px"},children:[E.jsx("div",{style:{fontSize:"40px",marginBottom:"12px"},children:"🔧"}),E.jsx("p",{style:{fontWeight:700,marginBottom:"6px"},children:"Sin trabajos registrados"}),E.jsx("p",{style:{color:"#6B7280",fontSize:"13px",marginBottom:"16px"},children:"Documenta tus trabajos para construir tu reputación"}),E.jsx("button",{style:Ke.btn,onClick:()=>r("registrarTrabajo"),children:"Documentar mi primer trabajo"})]}):o.map(M=>E.jsxs("div",{style:Ke.card,children:[E.jsx("p",{style:{fontWeight:700,fontSize:"14px",marginBottom:"4px"},children:M.titulo}),E.jsxs("p",{style:{color:"#6B7280",fontSize:"12px"},children:[M.tipo," · ",M.estado," · ",M.ciudad]})]},M.id))]}),h==="ia-herramientas"&&E.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[E.jsxs("div",{style:{background:"#FEF3C7",border:"1px solid #FDE68A",borderRadius:"12px",padding:"14px",display:"flex",gap:"10px",alignItems:"flex-start"},children:[E.jsx("span",{style:{fontSize:"20px"},children:"✨"}),E.jsxs("div",{children:[E.jsx("p",{style:{fontWeight:700,fontSize:"13px",marginBottom:"3px"},children:"Herramientas con Gemini IA"}),E.jsxs("p",{style:{color:"#92400E",fontSize:"12px"},children:["Estas funciones usan la API de Gemini (Google) para ayudarte a trabajar mejor. ",!$&&"Algunas son solo para Plan Pro."]})]})]}),E.jsxs("div",{style:Ke.card,children:[E.jsx("h3",{style:{fontWeight:700,fontSize:"15px",marginBottom:"4px"},children:"💬 Responder solicitudes"}),E.jsx("p",{style:{color:"#6B7280",fontSize:"13px",marginBottom:"14px"},children:"Gemini te ayuda a responder clientes de forma profesional"}),E.jsxs("div",{style:{marginBottom:"10px"},children:[E.jsx("label",{style:{fontSize:"11px",fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",display:"block",marginBottom:"5px"},children:"Solicitud del cliente"}),E.jsx("textarea",{value:A,onChange:M=>O(M.target.value),style:{width:"100%",border:"1px solid #D1D5DB",borderRadius:"10px",padding:"10px 14px",fontSize:"13px",outline:"none",resize:"vertical",minHeight:"70px",background:"#F9FAFB"}})]}),E.jsx("button",{style:Ke.btn,onClick:W,disabled:w,children:w?"Gemini escribiendo...":"✨ Generar respuesta con Gemini"}),g&&E.jsxs("div",{style:{marginTop:"12px",background:"#F0FDF4",border:"1px solid #A7F3D0",borderRadius:"10px",padding:"14px"},children:[E.jsx("p",{style:{fontSize:"11px",fontWeight:700,color:"#059669",marginBottom:"8px"},children:"RESPUESTA SUGERIDA POR GEMINI"}),E.jsx("p",{style:{fontSize:"13px",color:"#111827",lineHeight:"1.6"},children:g}),E.jsx("button",{style:{...Ke.btnSm,background:"#059669",marginTop:"10px"},onClick:()=>{var M;return(M=navigator.clipboard)==null?void 0:M.writeText(g)},children:"Copiar texto"})]})]}),[{icon:"👤",title:"Mejorar mi perfil",desc:"Gemini mejora la descripción de tu perfil para que más clientes te contraten.",pro:!1,action:()=>r("registro",{paso:2})},{icon:"📄",title:"Generar cotización",desc:"Describe el trabajo y Gemini redacta una cotización profesional para enviarle al cliente.",pro:!0},{icon:"📊",title:"Análisis de mercado",desc:"Ve qué servicios tienen más demanda en tu ciudad esta semana.",pro:!0}].map(M=>E.jsxs("div",{style:{...Ke.card,display:"flex",gap:"14px",alignItems:"flex-start",opacity:M.pro&&!$?.6:1},children:[E.jsx("span",{style:{fontSize:"24px"},children:M.icon}),E.jsxs("div",{style:{flex:1},children:[E.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center",marginBottom:"4px"},children:[E.jsx("p",{style:{fontWeight:700,fontSize:"14px"},children:M.title}),M.pro&&E.jsx("span",{style:{background:"#FEF3C7",color:"#92400E",fontSize:"10px",fontWeight:700,padding:"2px 7px",borderRadius:"6px"},children:"PRO"})]}),E.jsx("p",{style:{color:"#6B7280",fontSize:"13px",marginBottom:M.pro&&!$?"8px":0},children:M.desc}),M.pro&&!$&&E.jsx("button",{style:{...Ke.btnSm,background:"#fff",color:"#D97706",border:"1px solid #D97706"},onClick:()=>r("pricing"),children:"Requiere Plan Pro →"}),(!M.pro||$)&&M.action&&E.jsx("button",{style:{...Ke.btnSm,marginTop:"8px"},onClick:M.action,children:"Usar →"})]})]},M.title))]}),h==="configurar"&&E.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px"},children:[E.jsxs("div",{style:Ke.card,children:[E.jsx("h3",{style:{fontWeight:700,fontSize:"15px",marginBottom:"14px"},children:"Mi información"}),[["Nombre",t.nombre],["Oficio",t.oficio],["Ciudad",t.ciudad],["Experiencia",`${t.experiencia} años`],["Plan actual",$?"Pro ⚡":"Gratuito"]].map(([M,J])=>E.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F3F4F6"},children:[E.jsx("span",{style:{color:"#6B7280",fontSize:"13px"},children:M}),E.jsx("span",{style:{fontWeight:600,fontSize:"13px"},children:J})]},M)),E.jsx("button",{style:{...Ke.btn,marginTop:"14px"},children:"Editar perfil"})]}),!$&&E.jsxs("div",{style:{background:"#FEF3C7",border:"1px solid #D97706",borderRadius:"16px",padding:"20px",textAlign:"center"},children:[E.jsx("p",{style:{fontWeight:800,fontSize:"16px",marginBottom:"6px"},children:"Actualiza a Plan Pro"}),E.jsx("p",{style:{color:"#92400E",fontSize:"13px",marginBottom:"16px"},children:"$100 MXN/mes · Aparece primero · Sin anuncios · Herramientas IA completas"}),E.jsx("button",{style:{...Ke.btn,fontSize:"14px",padding:"12px 24px"},onClick:()=>r("pricing"),children:"Activar Plan Pro →"})]})]})]})]}):E.jsxs("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"},children:[E.jsx("div",{style:{width:"36px",height:"36px",border:"3px solid #D97706",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}),E.jsx("style",{children:"@keyframes spin{to{transform:rotate(360deg)}}"})]})}const bk="modulepreload",Dk=function(r){return"/"+r},S_={},Nk=function(e,t,i){let o=Promise.resolve();if(t&&t.length>0){let h=function(_){return Promise.all(_.map(w=>Promise.resolve(w).then(x=>({status:"fulfilled",value:x}),x=>({status:"rejected",reason:x}))))};document.getElementsByTagName("link");const f=document.querySelector("meta[property=csp-nonce]"),g=(f==null?void 0:f.nonce)||(f==null?void 0:f.getAttribute("nonce"));o=h(t.map(_=>{if(_=Dk(_),_ in S_)return;S_[_]=!0;const w=_.endsWith(".css"),x=w?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${_}"]${x}`))return;const A=document.createElement("link");if(A.rel=w?"stylesheet":bk,w||(A.as="script"),A.crossOrigin="",A.href=_,g&&A.setAttribute("nonce",g),document.head.appendChild(A),w)return new Promise((O,W)=>{A.addEventListener("load",O),A.addEventListener("error",()=>W(new Error(`Unable to preload CSS for ${_}`)))})}))}function l(h){const f=new Event("vite:preloadError",{cancelable:!0});if(f.payload=h,window.dispatchEvent(f),!f.defaultPrevented)throw h}return o.then(h=>{for(const f of h||[])f.status==="rejected"&&l(f.reason);return e().catch(l)})},Ok=["pendiente","aceptado","proceso","terminado","validado"],De={page:{minHeight:"100vh",background:"#F4F5F7"},header:{background:"#1E2A3B",color:"#fff",padding:"16px 20px",display:"flex",alignItems:"center",gap:"14px"},logo:{background:"#D97706",color:"#fff",fontWeight:900,fontSize:"15px",padding:"4px 10px",borderRadius:"8px"},wrap:{maxWidth:"680px",margin:"0 auto",padding:"24px 20px"},card:{background:"#fff",border:"1px solid #E5E7EB",borderRadius:"16px",padding:"20px",marginBottom:"14px"},label:{display:"block",fontSize:"11px",fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"5px"},inp:{width:"100%",border:"1px solid #D1D5DB",borderRadius:"10px",padding:"10px 14px",fontSize:"13px",outline:"none",background:"#F9FAFB"},btn:{background:"#D97706",color:"#fff",border:"none",borderRadius:"10px",padding:"12px 20px",fontSize:"14px",fontWeight:700},btnFull:{background:"#D97706",color:"#fff",border:"none",borderRadius:"10px",padding:"12px",fontSize:"14px",fontWeight:700,width:"100%"},grid2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"},chip:r=>({background:r?"#D97706":"#fff",color:r?"#fff":"#374151",border:`1px solid ${r?"#D97706":"#D1D5DB"}`,borderRadius:"20px",padding:"5px 12px",fontSize:"12px",fontWeight:600,cursor:"pointer"}),photo:{background:"#F9FAFB",border:"2px dashed #D1D5DB",borderRadius:"12px",height:"100px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:"6px"}},Vk=["Instalación","Reparación","Mantenimiento","Diagnóstico","Otro"],Lk={pendiente:"Pendiente",aceptado:"Aceptado",proceso:"En proceso",terminado:"Terminado",validado:"Validado ✓"};function Mk({nav:r,user:e}){const[t,i]=Ue.useState({titulo:"",tipo:"Instalación",descripcion:"",problemaDetectado:"",trabajoRealizado:"",materiales:"",tiempoHoras:"",costoTotal:"",ciudad:"",clienteNombre:"",estado:"terminado"}),[o,l]=Ue.useState({antes:null,durante:null,despues:null}),[h,f]=Ue.useState({antes:null,durante:null,despues:null}),[g,_]=Ue.useState(null),[w,x]=Ue.useState(!1),[A,O]=Ue.useState(!1),W=M=>J=>i(re=>({...re,[M]:J.target.value})),q=M=>J=>{const re=J.target.files[0];if(!re)return;l(Ee=>({...Ee,[M]:re}));const Ce=new FileReader;Ce.onload=Ee=>f(D=>({...D,[M]:Ee.target.result})),Ce.readAsDataURL(re)},$=async()=>{const M=`${t.titulo} ${t.descripcion} ${t.problemaDetectado}`;if(M.trim()){O(!0);try{const J=await Ik(M);_(J),J.tipo&&i(re=>({...re,tipo:J.tipo}))}finally{O(!1)}}},he=async()=>{x(!0);try{const M=await IE({...t,tecnicoId:e.uid,costoTotal:parseFloat(t.costoTotal)||0,tiempoHoras:parseFloat(t.tiempoHoras)||0,clasificacionIA:g,evidencias:[]}),J={};for(const[re,Ce]of Object.entries(o))Ce&&(J[re]=await SE(M,Ce,re));if(Object.keys(J).length>0){const{actualizarTrabajo:re}=await Nk(async()=>{const{actualizarTrabajo:Ce}=await Promise.resolve().then(()=>_k);return{actualizarTrabajo:Ce}},void 0);await re(M,{evidencias:J})}r("panel")}catch{alert("Error al guardar. Verifica tu conexión.")}finally{x(!1)}};return E.jsxs("div",{style:De.page,children:[E.jsxs("div",{style:De.header,children:[E.jsx("button",{onClick:()=>r("panel"),style:{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontSize:"13px",fontWeight:600},children:"← Mi panel"}),E.jsx("span",{style:De.logo,children:"OFICIO"}),E.jsx("span",{style:{color:"rgba(255,255,255,0.5)",fontSize:"13px"},children:"Documentar trabajo"})]}),E.jsxs("div",{style:De.wrap,children:[E.jsxs("div",{style:De.card,children:[E.jsx("h3",{style:{fontWeight:700,fontSize:"15px",marginBottom:"14px"},children:"📋 Datos del trabajo"}),E.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px"},children:[E.jsxs("div",{children:[E.jsx("label",{style:De.label,children:"Título del trabajo *"}),E.jsx("input",{style:De.inp,value:t.titulo,onChange:W("titulo"),placeholder:"Ej: Instalación panel eléctrico 200A",onBlur:$})]}),E.jsxs("div",{children:[E.jsx("label",{style:De.label,children:"Tipo de trabajo"}),E.jsx("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap"},children:Vk.map(M=>E.jsx("button",{style:De.chip(t.tipo===M),onClick:()=>i(J=>({...J,tipo:M})),children:M},M))}),A&&E.jsx("p",{style:{color:"#D97706",fontSize:"11px",marginTop:"6px"},children:"✨ Gemini clasificando..."}),g&&E.jsxs("p",{style:{color:"#059669",fontSize:"11px",marginTop:"6px"},children:["✅ Gemini clasificó: ",g.tipo," · ",g.categoria]})]}),E.jsxs("div",{style:De.grid2,children:[E.jsxs("div",{children:[E.jsx("label",{style:De.label,children:"Ciudad"}),E.jsx("input",{style:De.inp,value:t.ciudad,onChange:W("ciudad"),placeholder:"CDMX"})]}),E.jsxs("div",{children:[E.jsx("label",{style:De.label,children:"Cliente (opcional)"}),E.jsx("input",{style:De.inp,value:t.clienteNombre,onChange:W("clienteNombre"),placeholder:"Nombre del cliente"})]})]}),E.jsxs("div",{style:De.grid2,children:[E.jsxs("div",{children:[E.jsx("label",{style:De.label,children:"Tiempo (horas)"}),E.jsx("input",{style:De.inp,type:"number",value:t.tiempoHoras,onChange:W("tiempoHoras"),placeholder:"2.5"})]}),E.jsxs("div",{children:[E.jsx("label",{style:De.label,children:"Costo total ($MXN)"}),E.jsx("input",{style:De.inp,type:"number",value:t.costoTotal,onChange:W("costoTotal"),placeholder:"0.00"})]})]})]})]}),E.jsxs("div",{style:De.card,children:[E.jsx("h3",{style:{fontWeight:700,fontSize:"15px",marginBottom:"6px"},children:"📷 Evidencia fotográfica"}),E.jsx("p",{style:{color:"#6B7280",fontSize:"13px",marginBottom:"14px"},children:"Sube fotos del trabajo. Esto construye tu reputación."}),E.jsx("div",{style:De.grid2,children:[["antes","Antes"],["durante","Durante"],["despues","Después"]].slice(0,2).map(([M,J])=>E.jsxs("div",{children:[E.jsx("label",{style:De.label,children:J}),E.jsxs("label",{style:{...De.photo,border:h[M]?"2px solid #D97706":"2px dashed #D1D5DB"},children:[h[M]?E.jsx("img",{src:h[M],alt:J,style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"10px"}}):E.jsxs(E.Fragment,{children:[E.jsx("span",{style:{fontSize:"24px",opacity:.3},children:"📷"}),E.jsx("span",{style:{fontSize:"11px",color:"#9CA3AF"},children:J})]}),E.jsx("input",{type:"file",accept:"image/*",capture:"environment",style:{display:"none"},onChange:q(M)})]})]},M))}),E.jsxs("div",{style:{marginTop:"10px"},children:[E.jsx("label",{style:De.label,children:"Después"}),E.jsxs("label",{style:{...De.photo,border:h.despues?"2px solid #059669":"2px dashed #D1D5DB"},children:[h.despues?E.jsx("img",{src:h.despues,alt:"después",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"10px"}}):E.jsxs(E.Fragment,{children:[E.jsx("span",{style:{fontSize:"24px",opacity:.3},children:"📷"}),E.jsx("span",{style:{fontSize:"11px",color:"#9CA3AF"},children:"Resultado final"})]}),E.jsx("input",{type:"file",accept:"image/*",capture:"environment",style:{display:"none"},onChange:q("despues")})]})]})]}),E.jsxs("div",{style:De.card,children:[E.jsx("h3",{style:{fontWeight:700,fontSize:"15px",marginBottom:"14px"},children:"🔍 Detalles técnicos"}),E.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px"},children:[E.jsxs("div",{children:[E.jsx("label",{style:De.label,children:"Problema detectado *"}),E.jsx("textarea",{style:{...De.inp,resize:"vertical",minHeight:"70px"},value:t.problemaDetectado,onChange:W("problemaDetectado"),placeholder:"¿Cuál era el problema o qué pidió el cliente?"})]}),E.jsxs("div",{children:[E.jsx("label",{style:De.label,children:"Trabajo realizado *"}),E.jsx("textarea",{style:{...De.inp,resize:"vertical",minHeight:"70px"},value:t.trabajoRealizado,onChange:W("trabajoRealizado"),placeholder:"¿Qué hiciste exactamente?"})]}),E.jsxs("div",{children:[E.jsx("label",{style:De.label,children:"Materiales usados"}),E.jsx("input",{style:De.inp,value:t.materiales,onChange:W("materiales"),placeholder:"Panel Square D, breakers 15A, cable THW..."})]})]})]}),E.jsxs("div",{style:De.card,children:[E.jsx("h3",{style:{fontWeight:700,fontSize:"15px",marginBottom:"12px"},children:"Estado del trabajo"}),E.jsx("div",{style:{display:"flex",gap:"6px",flexWrap:"wrap"},children:Ok.map(M=>E.jsx("button",{style:De.chip(t.estado===M),onClick:()=>i(J=>({...J,estado:M})),children:Lk[M]},M))})]}),E.jsx("button",{style:{...De.btnFull,opacity:w?.7:1},onClick:he,disabled:w||!t.titulo,children:w?"Guardando en Firebase...":"✅ Guardar expediente"}),E.jsx("p",{style:{fontSize:"11px",color:"#9CA3AF",textAlign:"center",marginTop:"10px"},children:"Este trabajo quedará en tu historial profesional y podrá ser visto por clientes potenciales."})]})]})}const jk=`
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', system-ui, sans-serif; background: #F4F5F7; color: #111827; }
input, select, textarea, button { font-family: inherit; }
button { cursor: pointer; }
a { text-decoration: none; color: inherit; }
`;function Fk(){const[r,e]=Ue.useState(void 0),[t,i]=Ue.useState("landing"),[o,l]=Ue.useState({});Ue.useEffect(()=>wE(_=>e(_||null)),[]);const h=(g,_={})=>{i(g),l(_),window.scrollTo(0,0)};if(r===void 0)return E.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"},children:E.jsxs("div",{style:{textAlign:"center"},children:[E.jsx("div",{style:{width:"40px",height:"40px",border:"3px solid #D97706",borderTopColor:"transparent",borderRadius:"50%",margin:"0 auto 12px",animation:"spin 0.8s linear infinite"}}),E.jsx("style",{children:"@keyframes spin{to{transform:rotate(360deg)}}"}),E.jsx("p",{style:{color:"#6B7280",fontSize:"14px"},children:"Cargando Oficio.mx..."})]})});const f={nav:h,user:r};return E.jsxs(E.Fragment,{children:[E.jsx("style",{children:jk}),t==="landing"&&E.jsx(Ek,{...f}),t==="registro"&&E.jsx(Ak,{...f,params:o}),t==="buscar"&&E.jsx(Ck,{...f,params:o}),t==="perfil"&&E.jsx(Rk,{...f,params:o}),t==="panel"&&E.jsx(Pk,{...f}),t==="registrarTrabajo"&&E.jsx(Mk,{...f,params:o})]})}jw.createRoot(document.getElementById("root")).render(E.jsx(bw.StrictMode,{children:E.jsx(Fk,{})}));
