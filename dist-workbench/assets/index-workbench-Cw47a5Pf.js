var Eg=Object.defineProperty;var wg=(t,e,n)=>e in t?Eg(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var gt=(t,e,n)=>wg(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();/**
* @vue/shared v3.5.31
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Wu(t){const e=Object.create(null);for(const n of t.split(","))e[n]=1;return n=>n in e}const mt={},ss=[],ti=()=>{},Ip=()=>!1,tl=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),nl=t=>t.startsWith("onUpdate:"),Vt=Object.assign,Xu=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},Tg=Object.prototype.hasOwnProperty,at=(t,e)=>Tg.call(t,e),Be=Array.isArray,os=t=>Uo(t)==="[object Map]",As=t=>Uo(t)==="[object Set]",Gf=t=>Uo(t)==="[object Date]",Xe=t=>typeof t=="function",At=t=>typeof t=="string",ri=t=>typeof t=="symbol",pt=t=>t!==null&&typeof t=="object",Up=t=>(pt(t)||Xe(t))&&Xe(t.then)&&Xe(t.catch),Np=Object.prototype.toString,Uo=t=>Np.call(t),Ag=t=>Uo(t).slice(8,-1),Fp=t=>Uo(t)==="[object Object]",Yu=t=>At(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,to=Wu(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),il=t=>{const e=Object.create(null);return(n=>e[n]||(e[n]=t(n)))},Rg=/-\w/g,On=il(t=>t.replace(Rg,e=>e.slice(1).toUpperCase())),Cg=/\B([A-Z])/g,Dr=il(t=>t.replace(Cg,"-$1").toLowerCase()),Op=il(t=>t.charAt(0).toUpperCase()+t.slice(1)),Tl=il(t=>t?`on${Op(t)}`:""),Zn=(t,e)=>!Object.is(t,e),Ca=(t,...e)=>{for(let n=0;n<t.length;n++)t[n](...e)},Bp=(t,e,n,i=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:i,value:n})},rl=t=>{const e=parseFloat(t);return isNaN(e)?t:e};let Wf;const sl=()=>Wf||(Wf=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function No(t){if(Be(t)){const e={};for(let n=0;n<t.length;n++){const i=t[n],r=At(i)?Ig(i):No(i);if(r)for(const s in r)e[s]=r[s]}return e}else if(At(t)||pt(t))return t}const Pg=/;(?![^(]*\))/g,Dg=/:([^]+)/,Lg=/\/\*[^]*?\*\//g;function Ig(t){const e={};return t.replace(Lg,"").split(Pg).forEach(n=>{if(n){const i=n.split(Dg);i.length>1&&(e[i[0].trim()]=i[1].trim())}}),e}function un(t){let e="";if(At(t))e=t;else if(Be(t))for(let n=0;n<t.length;n++){const i=un(t[n]);i&&(e+=i+" ")}else if(pt(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}const Ug="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Ng=Wu(Ug);function kp(t){return!!t||t===""}function Fg(t,e){if(t.length!==e.length)return!1;let n=!0;for(let i=0;n&&i<t.length;i++)n=Rs(t[i],e[i]);return n}function Rs(t,e){if(t===e)return!0;let n=Gf(t),i=Gf(e);if(n||i)return n&&i?t.getTime()===e.getTime():!1;if(n=ri(t),i=ri(e),n||i)return t===e;if(n=Be(t),i=Be(e),n||i)return n&&i?Fg(t,e):!1;if(n=pt(t),i=pt(e),n||i){if(!n||!i)return!1;const r=Object.keys(t).length,s=Object.keys(e).length;if(r!==s)return!1;for(const o in t){const a=t.hasOwnProperty(o),l=e.hasOwnProperty(o);if(a&&!l||!a&&l||!Rs(t[o],e[o]))return!1}}return String(t)===String(e)}function $u(t,e){return t.findIndex(n=>Rs(n,e))}const zp=t=>!!(t&&t.__v_isRef===!0),Pt=t=>At(t)?t:t==null?"":Be(t)||pt(t)&&(t.toString===Np||!Xe(t.toString))?zp(t)?Pt(t.value):JSON.stringify(t,Hp,2):String(t),Hp=(t,e)=>zp(e)?Hp(t,e.value):os(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[i,r],s)=>(n[Al(i,s)+" =>"]=r,n),{})}:As(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>Al(n))}:ri(e)?Al(e):pt(e)&&!Be(e)&&!Fp(e)?String(e):e,Al=(t,e="")=>{var n;return ri(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.5.31
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let ln;class Og{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.__v_skip=!0,this.parent=ln,!e&&ln&&(this.index=(ln.scopes||(ln.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].pause();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].resume();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].resume()}}run(e){if(this._active){const n=ln;try{return ln=this,e()}finally{ln=n}}}on(){++this._on===1&&(this.prevScope=ln,ln=this)}off(){this._on>0&&--this._on===0&&(ln=this.prevScope,this.prevScope=void 0)}stop(e){if(this._active){this._active=!1;let n,i;for(n=0,i=this.effects.length;n<i;n++)this.effects[n].stop();for(this.effects.length=0,n=0,i=this.cleanups.length;n<i;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,i=this.scopes.length;n<i;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0}}}function Bg(){return ln}let _t;const Rl=new WeakSet;class Vp{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,ln&&ln.active&&ln.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Rl.has(this)&&(Rl.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Wp(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Xf(this),Xp(this);const e=_t,n=Bn;_t=this,Bn=!0;try{return this.fn()}finally{Yp(this),_t=e,Bn=n,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Zu(e);this.deps=this.depsTail=void 0,Xf(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Rl.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Cc(this)&&this.run()}get dirty(){return Cc(this)}}let Gp=0,no,io;function Wp(t,e=!1){if(t.flags|=8,e){t.next=io,io=t;return}t.next=no,no=t}function ju(){Gp++}function qu(){if(--Gp>0)return;if(io){let e=io;for(io=void 0;e;){const n=e.next;e.next=void 0,e.flags&=-9,e=n}}let t;for(;no;){let e=no;for(no=void 0;e;){const n=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(i){t||(t=i)}e=n}}if(t)throw t}function Xp(t){for(let e=t.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function Yp(t){let e,n=t.depsTail,i=n;for(;i;){const r=i.prevDep;i.version===-1?(i===n&&(n=r),Zu(i),kg(i)):e=i,i.dep.activeLink=i.prevActiveLink,i.prevActiveLink=void 0,i=r}t.deps=e,t.depsTail=n}function Cc(t){for(let e=t.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&($p(e.dep.computed)||e.dep.version!==e.version))return!0;return!!t._dirty}function $p(t){if(t.flags&4&&!(t.flags&16)||(t.flags&=-17,t.globalVersion===mo)||(t.globalVersion=mo,!t.isSSR&&t.flags&128&&(!t.deps&&!t._dirty||!Cc(t))))return;t.flags|=2;const e=t.dep,n=_t,i=Bn;_t=t,Bn=!0;try{Xp(t);const r=t.fn(t._value);(e.version===0||Zn(r,t._value))&&(t.flags|=128,t._value=r,e.version++)}catch(r){throw e.version++,r}finally{_t=n,Bn=i,Yp(t),t.flags&=-3}}function Zu(t,e=!1){const{dep:n,prevSub:i,nextSub:r}=t;if(i&&(i.nextSub=r,t.prevSub=void 0),r&&(r.prevSub=i,t.nextSub=void 0),n.subs===t&&(n.subs=i,!i&&n.computed)){n.computed.flags&=-5;for(let s=n.computed.deps;s;s=s.nextDep)Zu(s,!0)}!e&&!--n.sc&&n.map&&n.map.delete(n.key)}function kg(t){const{prevDep:e,nextDep:n}=t;e&&(e.nextDep=n,t.prevDep=void 0),n&&(n.prevDep=e,t.nextDep=void 0)}let Bn=!0;const jp=[];function Pi(){jp.push(Bn),Bn=!1}function Di(){const t=jp.pop();Bn=t===void 0?!0:t}function Xf(t){const{cleanup:e}=t;if(t.cleanup=void 0,e){const n=_t;_t=void 0;try{e()}finally{_t=n}}}let mo=0;class zg{constructor(e,n){this.sub=e,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Ku{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!_t||!Bn||_t===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==_t)n=this.activeLink=new zg(_t,this),_t.deps?(n.prevDep=_t.depsTail,_t.depsTail.nextDep=n,_t.depsTail=n):_t.deps=_t.depsTail=n,qp(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const i=n.nextDep;i.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=i),n.prevDep=_t.depsTail,n.nextDep=void 0,_t.depsTail.nextDep=n,_t.depsTail=n,_t.deps===n&&(_t.deps=i)}return n}trigger(e){this.version++,mo++,this.notify(e)}notify(e){ju();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{qu()}}}function qp(t){if(t.dep.sc++,t.sub.flags&4){const e=t.dep.computed;if(e&&!t.dep.subs){e.flags|=20;for(let i=e.deps;i;i=i.nextDep)qp(i)}const n=t.dep.subs;n!==t&&(t.prevSub=n,n&&(n.nextSub=t)),t.dep.subs=t}}const Pc=new WeakMap,Sr=Symbol(""),Dc=Symbol(""),_o=Symbol("");function $t(t,e,n){if(Bn&&_t){let i=Pc.get(t);i||Pc.set(t,i=new Map);let r=i.get(n);r||(i.set(n,r=new Ku),r.map=i,r.key=n),r.track()}}function bi(t,e,n,i,r,s){const o=Pc.get(t);if(!o){mo++;return}const a=l=>{l&&l.trigger()};if(ju(),e==="clear")o.forEach(a);else{const l=Be(t),c=l&&Yu(n);if(l&&n==="length"){const u=Number(i);o.forEach((f,h)=>{(h==="length"||h===_o||!ri(h)&&h>=u)&&a(f)})}else switch((n!==void 0||o.has(void 0))&&a(o.get(n)),c&&a(o.get(_o)),e){case"add":l?c&&a(o.get("length")):(a(o.get(Sr)),os(t)&&a(o.get(Dc)));break;case"delete":l||(a(o.get(Sr)),os(t)&&a(o.get(Dc)));break;case"set":os(t)&&a(o.get(Sr));break}}qu()}function Fr(t){const e=ot(t);return e===t?e:($t(e,"iterate",_o),Tn(t)?e:e.map(zn))}function ol(t){return $t(t=ot(t),"iterate",_o),t}function $n(t,e){return Li(t)?ds(Mr(t)?zn(e):e):zn(e)}const Hg={__proto__:null,[Symbol.iterator](){return Cl(this,Symbol.iterator,t=>$n(this,t))},concat(...t){return Fr(this).concat(...t.map(e=>Be(e)?Fr(e):e))},entries(){return Cl(this,"entries",t=>(t[1]=$n(this,t[1]),t))},every(t,e){return ci(this,"every",t,e,void 0,arguments)},filter(t,e){return ci(this,"filter",t,e,n=>n.map(i=>$n(this,i)),arguments)},find(t,e){return ci(this,"find",t,e,n=>$n(this,n),arguments)},findIndex(t,e){return ci(this,"findIndex",t,e,void 0,arguments)},findLast(t,e){return ci(this,"findLast",t,e,n=>$n(this,n),arguments)},findLastIndex(t,e){return ci(this,"findLastIndex",t,e,void 0,arguments)},forEach(t,e){return ci(this,"forEach",t,e,void 0,arguments)},includes(...t){return Pl(this,"includes",t)},indexOf(...t){return Pl(this,"indexOf",t)},join(t){return Fr(this).join(t)},lastIndexOf(...t){return Pl(this,"lastIndexOf",t)},map(t,e){return ci(this,"map",t,e,void 0,arguments)},pop(){return zs(this,"pop")},push(...t){return zs(this,"push",t)},reduce(t,...e){return Yf(this,"reduce",t,e)},reduceRight(t,...e){return Yf(this,"reduceRight",t,e)},shift(){return zs(this,"shift")},some(t,e){return ci(this,"some",t,e,void 0,arguments)},splice(...t){return zs(this,"splice",t)},toReversed(){return Fr(this).toReversed()},toSorted(t){return Fr(this).toSorted(t)},toSpliced(...t){return Fr(this).toSpliced(...t)},unshift(...t){return zs(this,"unshift",t)},values(){return Cl(this,"values",t=>$n(this,t))}};function Cl(t,e,n){const i=ol(t),r=i[e]();return i!==t&&!Tn(t)&&(r._next=r.next,r.next=()=>{const s=r._next();return s.done||(s.value=n(s.value)),s}),r}const Vg=Array.prototype;function ci(t,e,n,i,r,s){const o=ol(t),a=o!==t&&!Tn(t),l=o[e];if(l!==Vg[e]){const f=l.apply(t,s);return a?zn(f):f}let c=n;o!==t&&(a?c=function(f,h){return n.call(this,$n(t,f),h,t)}:n.length>2&&(c=function(f,h){return n.call(this,f,h,t)}));const u=l.call(o,c,i);return a&&r?r(u):u}function Yf(t,e,n,i){const r=ol(t),s=r!==t&&!Tn(t);let o=n,a=!1;r!==t&&(s?(a=i.length===0,o=function(c,u,f){return a&&(a=!1,c=$n(t,c)),n.call(this,c,$n(t,u),f,t)}):n.length>3&&(o=function(c,u,f){return n.call(this,c,u,f,t)}));const l=r[e](o,...i);return a?$n(t,l):l}function Pl(t,e,n){const i=ot(t);$t(i,"iterate",_o);const r=i[e](...n);return(r===-1||r===!1)&&tf(n[0])?(n[0]=ot(n[0]),i[e](...n)):r}function zs(t,e,n=[]){Pi(),ju();const i=ot(t)[e].apply(t,n);return qu(),Di(),i}const Gg=Wu("__proto__,__v_isRef,__isVue"),Zp=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(ri));function Wg(t){ri(t)||(t=String(t));const e=ot(this);return $t(e,"has",t),e.hasOwnProperty(t)}class Kp{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,i){if(n==="__v_skip")return e.__v_skip;const r=this._isReadonly,s=this._isShallow;if(n==="__v_isReactive")return!r;if(n==="__v_isReadonly")return r;if(n==="__v_isShallow")return s;if(n==="__v_raw")return i===(r?s?e0:tm:s?em:Qp).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(i)?e:void 0;const o=Be(e);if(!r){let l;if(o&&(l=Hg[n]))return l;if(n==="hasOwnProperty")return Wg}const a=Reflect.get(e,n,jt(e)?e:i);if((ri(n)?Zp.has(n):Gg(n))||(r||$t(e,"get",n),s))return a;if(jt(a)){const l=o&&Yu(n)?a:a.value;return r&&pt(l)?Ic(l):l}return pt(a)?r?Ic(a):Qu(a):a}}class Jp extends Kp{constructor(e=!1){super(!1,e)}set(e,n,i,r){let s=e[n];const o=Be(e)&&Yu(n);if(!this._isShallow){const c=Li(s);if(!Tn(i)&&!Li(i)&&(s=ot(s),i=ot(i)),!o&&jt(s)&&!jt(i))return c||(s.value=i),!0}const a=o?Number(n)<e.length:at(e,n),l=Reflect.set(e,n,i,jt(e)?e:r);return e===ot(r)&&(a?Zn(i,s)&&bi(e,"set",n,i):bi(e,"add",n,i)),l}deleteProperty(e,n){const i=at(e,n);e[n];const r=Reflect.deleteProperty(e,n);return r&&i&&bi(e,"delete",n,void 0),r}has(e,n){const i=Reflect.has(e,n);return(!ri(n)||!Zp.has(n))&&$t(e,"has",n),i}ownKeys(e){return $t(e,"iterate",Be(e)?"length":Sr),Reflect.ownKeys(e)}}class Xg extends Kp{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const Yg=new Jp,$g=new Xg,jg=new Jp(!0);const Lc=t=>t,qo=t=>Reflect.getPrototypeOf(t);function qg(t,e,n){return function(...i){const r=this.__v_raw,s=ot(r),o=os(s),a=t==="entries"||t===Symbol.iterator&&o,l=t==="keys"&&o,c=r[t](...i),u=n?Lc:e?ds:zn;return!e&&$t(s,"iterate",l?Dc:Sr),Vt(Object.create(c),{next(){const{value:f,done:h}=c.next();return h?{value:f,done:h}:{value:a?[u(f[0]),u(f[1])]:u(f),done:h}}})}}function Zo(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function Zg(t,e){const n={get(r){const s=this.__v_raw,o=ot(s),a=ot(r);t||(Zn(r,a)&&$t(o,"get",r),$t(o,"get",a));const{has:l}=qo(o),c=e?Lc:t?ds:zn;if(l.call(o,r))return c(s.get(r));if(l.call(o,a))return c(s.get(a));s!==o&&s.get(r)},get size(){const r=this.__v_raw;return!t&&$t(ot(r),"iterate",Sr),r.size},has(r){const s=this.__v_raw,o=ot(s),a=ot(r);return t||(Zn(r,a)&&$t(o,"has",r),$t(o,"has",a)),r===a?s.has(r):s.has(r)||s.has(a)},forEach(r,s){const o=this,a=o.__v_raw,l=ot(a),c=e?Lc:t?ds:zn;return!t&&$t(l,"iterate",Sr),a.forEach((u,f)=>r.call(s,c(u),c(f),o))}};return Vt(n,t?{add:Zo("add"),set:Zo("set"),delete:Zo("delete"),clear:Zo("clear")}:{add(r){const s=ot(this),o=qo(s),a=ot(r),l=!e&&!Tn(r)&&!Li(r)?a:r;return o.has.call(s,l)||Zn(r,l)&&o.has.call(s,r)||Zn(a,l)&&o.has.call(s,a)||(s.add(l),bi(s,"add",l,l)),this},set(r,s){!e&&!Tn(s)&&!Li(s)&&(s=ot(s));const o=ot(this),{has:a,get:l}=qo(o);let c=a.call(o,r);c||(r=ot(r),c=a.call(o,r));const u=l.call(o,r);return o.set(r,s),c?Zn(s,u)&&bi(o,"set",r,s):bi(o,"add",r,s),this},delete(r){const s=ot(this),{has:o,get:a}=qo(s);let l=o.call(s,r);l||(r=ot(r),l=o.call(s,r)),a&&a.call(s,r);const c=s.delete(r);return l&&bi(s,"delete",r,void 0),c},clear(){const r=ot(this),s=r.size!==0,o=r.clear();return s&&bi(r,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(r=>{n[r]=qg(r,t,e)}),n}function Ju(t,e){const n=Zg(t,e);return(i,r,s)=>r==="__v_isReactive"?!t:r==="__v_isReadonly"?t:r==="__v_raw"?i:Reflect.get(at(n,r)&&r in i?n:i,r,s)}const Kg={get:Ju(!1,!1)},Jg={get:Ju(!1,!0)},Qg={get:Ju(!0,!1)};const Qp=new WeakMap,em=new WeakMap,tm=new WeakMap,e0=new WeakMap;function t0(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function n0(t){return t.__v_skip||!Object.isExtensible(t)?0:t0(Ag(t))}function Qu(t){return Li(t)?t:ef(t,!1,Yg,Kg,Qp)}function i0(t){return ef(t,!1,jg,Jg,em)}function Ic(t){return ef(t,!0,$g,Qg,tm)}function ef(t,e,n,i,r){if(!pt(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const s=n0(t);if(s===0)return t;const o=r.get(t);if(o)return o;const a=new Proxy(t,s===2?i:n);return r.set(t,a),a}function Mr(t){return Li(t)?Mr(t.__v_raw):!!(t&&t.__v_isReactive)}function Li(t){return!!(t&&t.__v_isReadonly)}function Tn(t){return!!(t&&t.__v_isShallow)}function tf(t){return t?!!t.__v_raw:!1}function ot(t){const e=t&&t.__v_raw;return e?ot(e):t}function r0(t){return!at(t,"__v_skip")&&Object.isExtensible(t)&&Bp(t,"__v_skip",!0),t}const zn=t=>pt(t)?Qu(t):t,ds=t=>pt(t)?Ic(t):t;function jt(t){return t?t.__v_isRef===!0:!1}function Ne(t){return nm(t,!1)}function Qr(t){return nm(t,!0)}function nm(t,e){return jt(t)?t:new s0(t,e)}class s0{constructor(e,n){this.dep=new Ku,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?e:ot(e),this._value=n?e:zn(e),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(e){const n=this._rawValue,i=this.__v_isShallow||Tn(e)||Li(e);e=i?e:ot(e),Zn(e,n)&&(this._rawValue=e,this._value=i?e:zn(e),this.dep.trigger())}}function ft(t){return jt(t)?t.value:t}const o0={get:(t,e,n)=>e==="__v_raw"?t:ft(Reflect.get(t,e,n)),set:(t,e,n,i)=>{const r=t[e];return jt(r)&&!jt(n)?(r.value=n,!0):Reflect.set(t,e,n,i)}};function im(t){return Mr(t)?t:new Proxy(t,o0)}class a0{constructor(e,n,i){this.fn=e,this.setter=n,this._value=void 0,this.dep=new Ku(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=mo-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=i}notify(){if(this.flags|=16,!(this.flags&8)&&_t!==this)return Wp(this,!0),!0}get value(){const e=this.dep.track();return $p(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function l0(t,e,n=!1){let i,r;return Xe(t)?i=t:(i=t.get,r=t.set),new a0(i,r,n)}const Ko={},Ha=new WeakMap;let hr;function c0(t,e=!1,n=hr){if(n){let i=Ha.get(n);i||Ha.set(n,i=[]),i.push(t)}}function u0(t,e,n=mt){const{immediate:i,deep:r,once:s,scheduler:o,augmentJob:a,call:l}=n,c=y=>r?y:Tn(y)||r===!1||r===0?Si(y,1):Si(y);let u,f,h,d,_=!1,g=!1;if(jt(t)?(f=()=>t.value,_=Tn(t)):Mr(t)?(f=()=>c(t),_=!0):Be(t)?(g=!0,_=t.some(y=>Mr(y)||Tn(y)),f=()=>t.map(y=>{if(jt(y))return y.value;if(Mr(y))return c(y);if(Xe(y))return l?l(y,2):y()})):Xe(t)?e?f=l?()=>l(t,2):t:f=()=>{if(h){Pi();try{h()}finally{Di()}}const y=hr;hr=u;try{return l?l(t,3,[d]):t(d)}finally{hr=y}}:f=ti,e&&r){const y=f,P=r===!0?1/0:r;f=()=>Si(y(),P)}const m=Bg(),p=()=>{u.stop(),m&&m.active&&Xu(m.effects,u)};if(s&&e){const y=e;e=(...P)=>{y(...P),p()}}let T=g?new Array(t.length).fill(Ko):Ko;const R=y=>{if(!(!(u.flags&1)||!u.dirty&&!y))if(e){const P=u.run();if(r||_||(g?P.some((L,M)=>Zn(L,T[M])):Zn(P,T))){h&&h();const L=hr;hr=u;try{const M=[P,T===Ko?void 0:g&&T[0]===Ko?[]:T,d];T=P,l?l(e,3,M):e(...M)}finally{hr=L}}}else u.run()};return a&&a(R),u=new Vp(f),u.scheduler=o?()=>o(R,!1):R,d=y=>c0(y,!1,u),h=u.onStop=()=>{const y=Ha.get(u);if(y){if(l)l(y,4);else for(const P of y)P();Ha.delete(u)}},e?i?R(!0):T=u.run():o?o(R.bind(null,!0),!0):u.run(),p.pause=u.pause.bind(u),p.resume=u.resume.bind(u),p.stop=p,p}function Si(t,e=1/0,n){if(e<=0||!pt(t)||t.__v_skip||(n=n||new Map,(n.get(t)||0)>=e))return t;if(n.set(t,e),e--,jt(t))Si(t.value,e,n);else if(Be(t))for(let i=0;i<t.length;i++)Si(t[i],e,n);else if(As(t)||os(t))t.forEach(i=>{Si(i,e,n)});else if(Fp(t)){for(const i in t)Si(t[i],e,n);for(const i of Object.getOwnPropertySymbols(t))Object.prototype.propertyIsEnumerable.call(t,i)&&Si(t[i],e,n)}return t}/**
* @vue/runtime-core v3.5.31
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Fo(t,e,n,i){try{return i?t(...i):t()}catch(r){al(r,e,n)}}function si(t,e,n,i){if(Xe(t)){const r=Fo(t,e,n,i);return r&&Up(r)&&r.catch(s=>{al(s,e,n)}),r}if(Be(t)){const r=[];for(let s=0;s<t.length;s++)r.push(si(t[s],e,n,i));return r}}function al(t,e,n,i=!0){const r=e?e.vnode:null,{errorHandler:s,throwUnhandledErrorInProduction:o}=e&&e.appContext.config||mt;if(e){let a=e.parent;const l=e.proxy,c=`https://vuejs.org/error-reference/#runtime-${n}`;for(;a;){const u=a.ec;if(u){for(let f=0;f<u.length;f++)if(u[f](t,l,c)===!1)return}a=a.parent}if(s){Pi(),Fo(s,null,10,[t,l,c]),Di();return}}f0(t,n,r,i,o)}function f0(t,e,n,i=!0,r=!1){if(r)throw t;console.error(t)}const en=[];let Xn=-1;const as=[];let Vi=null,es=0;const rm=Promise.resolve();let Va=null;function sm(t){const e=Va||rm;return t?e.then(this?t.bind(this):t):e}function h0(t){let e=Xn+1,n=en.length;for(;e<n;){const i=e+n>>>1,r=en[i],s=go(r);s<t||s===t&&r.flags&2?e=i+1:n=i}return e}function nf(t){if(!(t.flags&1)){const e=go(t),n=en[en.length-1];!n||!(t.flags&2)&&e>=go(n)?en.push(t):en.splice(h0(e),0,t),t.flags|=1,om()}}function om(){Va||(Va=rm.then(lm))}function d0(t){Be(t)?as.push(...t):Vi&&t.id===-1?Vi.splice(es+1,0,t):t.flags&1||(as.push(t),t.flags|=1),om()}function $f(t,e,n=Xn+1){for(;n<en.length;n++){const i=en[n];if(i&&i.flags&2){if(t&&i.id!==t.uid)continue;en.splice(n,1),n--,i.flags&4&&(i.flags&=-2),i(),i.flags&4||(i.flags&=-2)}}}function am(t){if(as.length){const e=[...new Set(as)].sort((n,i)=>go(n)-go(i));if(as.length=0,Vi){Vi.push(...e);return}for(Vi=e,es=0;es<Vi.length;es++){const n=Vi[es];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}Vi=null,es=0}}const go=t=>t.id==null?t.flags&2?-1:1/0:t.id;function lm(t){try{for(Xn=0;Xn<en.length;Xn++){const e=en[Xn];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),Fo(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;Xn<en.length;Xn++){const e=en[Xn];e&&(e.flags&=-2)}Xn=-1,en.length=0,am(),Va=null,(en.length||as.length)&&lm()}}let wn=null,cm=null;function Ga(t){const e=wn;return wn=t,cm=t&&t.type.__scopeId||null,e}function p0(t,e=wn,n){if(!e||t._n)return t;const i=(...r)=>{i._d&&oh(-1);const s=Ga(e);let o;try{o=t(...r)}finally{Ga(s),i._d&&oh(1)}return o};return i._n=!0,i._c=!0,i._d=!0,i}function yt(t,e){if(wn===null)return t;const n=fl(wn),i=t.dirs||(t.dirs=[]);for(let r=0;r<e.length;r++){let[s,o,a,l=mt]=e[r];s&&(Xe(s)&&(s={mounted:s,updated:s}),s.deep&&Si(o),i.push({dir:s,instance:n,value:o,oldValue:void 0,arg:a,modifiers:l}))}return t}function rr(t,e,n,i){const r=t.dirs,s=e&&e.dirs;for(let o=0;o<r.length;o++){const a=r[o];s&&(a.oldValue=s[o].value);let l=a.dir[i];l&&(Pi(),si(l,n,8,[t.el,a,t,e]),Di())}}function rf(t,e){if(nn){let n=nn.provides;const i=nn.parent&&nn.parent.provides;i===n&&(n=nn.provides=Object.create(i)),n[t]=e}}function Er(t,e,n=!1){const i=hv();if(i||ls){let r=ls?ls._context.provides:i?i.parent==null||i.ce?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:void 0;if(r&&t in r)return r[t];if(arguments.length>1)return n&&Xe(e)?e.call(i&&i.proxy):e}}const m0=Symbol.for("v-scx"),_0=()=>Er(m0);function An(t,e,n){return um(t,e,n)}function um(t,e,n=mt){const{immediate:i,deep:r,flush:s,once:o}=n,a=Vt({},n),l=e&&i||!e&&s!=="post";let c;if(xo){if(s==="sync"){const d=_0();c=d.__watcherHandles||(d.__watcherHandles=[])}else if(!l){const d=()=>{};return d.stop=ti,d.resume=ti,d.pause=ti,d}}const u=nn;a.call=(d,_,g)=>si(d,u,_,g);let f=!1;s==="post"?a.scheduler=d=>{Yt(d,u&&u.suspense)}:s!=="sync"&&(f=!0,a.scheduler=(d,_)=>{_?d():nf(d)}),a.augmentJob=d=>{e&&(d.flags|=4),f&&(d.flags|=2,u&&(d.id=u.uid,d.i=u))};const h=u0(t,e,a);return xo&&(c?c.push(h):l&&h()),h}function g0(t,e,n){const i=this.proxy,r=At(t)?t.includes(".")?fm(i,t):()=>i[t]:t.bind(i,i);let s;Xe(e)?s=e:(s=e.handler,n=e);const o=Oo(this),a=um(r,s.bind(i),n);return o(),a}function fm(t,e){const n=e.split(".");return()=>{let i=t;for(let r=0;r<n.length&&i;r++)i=i[n[r]];return i}}const hm=Symbol("_vte"),v0=t=>t.__isTeleport,ro=t=>t&&(t.disabled||t.disabled===""),x0=t=>t&&(t.defer||t.defer===""),jf=t=>typeof SVGElement<"u"&&t instanceof SVGElement,qf=t=>typeof MathMLElement=="function"&&t instanceof MathMLElement,Uc=(t,e)=>{const n=t&&t.to;return At(n)?e?e(n):null:n},dm={name:"Teleport",__isTeleport:!0,process(t,e,n,i,r,s,o,a,l,c){const{mc:u,pc:f,pbc:h,o:{insert:d,querySelector:_,createText:g,createComment:m}}=c,p=ro(e.props);let{shapeFlag:T,children:R,dynamicChildren:y}=e;if(t==null){const P=e.el=g(""),L=e.anchor=g("");d(P,n,i),d(L,n,i);const M=(v,x)=>{T&16&&u(R,v,x,r,s,o,a,l)},A=()=>{const v=e.target=Uc(e.props,_),x=Nc(v,e,g,d);v&&(o!=="svg"&&jf(v)?o="svg":o!=="mathml"&&qf(v)&&(o="mathml"),r&&r.isCE&&(r.ce._teleportTargets||(r.ce._teleportTargets=new Set)).add(v),p||(M(v,x),Pa(e,!1)))};p&&(M(n,L),Pa(e,!0)),x0(e.props)||s&&s.pendingBranch?(e.el.__isMounted=!1,Yt(()=>{e.el.__isMounted===!1&&(A(),delete e.el.__isMounted)},s)):A()}else{e.el=t.el,e.targetStart=t.targetStart;const P=e.anchor=t.anchor,L=e.target=t.target,M=e.targetAnchor=t.targetAnchor;if(t.el.__isMounted===!1){Yt(()=>{dm.process(t,e,n,i,r,s,o,a,l,c)},s);return}const A=ro(t.props),v=A?n:L,x=A?P:M;if(o==="svg"||jf(L)?o="svg":(o==="mathml"||qf(L))&&(o="mathml"),y?(h(t.dynamicChildren,y,v,r,s,o,a),uf(t,e,!0)):l||f(t,e,v,x,r,s,o,a,!1),p)A?e.props&&t.props&&e.props.to!==t.props.to&&(e.props.to=t.props.to):Jo(e,n,P,c,1);else if((e.props&&e.props.to)!==(t.props&&t.props.to)){const C=e.target=Uc(e.props,_);C&&Jo(e,C,null,c,0)}else A&&Jo(e,L,M,c,1);Pa(e,p)}},remove(t,e,n,{um:i,o:{remove:r}},s){const{shapeFlag:o,children:a,anchor:l,targetStart:c,targetAnchor:u,target:f,props:h}=t;if(f&&(r(c),r(u)),s&&r(l),o&16){const d=s||!ro(h);for(let _=0;_<a.length;_++){const g=a[_];i(g,e,n,d,!!g.dynamicChildren)}}},move:Jo,hydrate:y0};function Jo(t,e,n,{o:{insert:i},m:r},s=2){s===0&&i(t.targetAnchor,e,n);const{el:o,anchor:a,shapeFlag:l,children:c,props:u}=t,f=s===2;if(f&&i(o,e,n),(!f||ro(u))&&l&16)for(let h=0;h<c.length;h++)r(c[h],e,n,2);f&&i(a,e,n)}function y0(t,e,n,i,r,s,{o:{nextSibling:o,parentNode:a,querySelector:l,insert:c,createText:u}},f){function h(m,p){let T=p;for(;T;){if(T&&T.nodeType===8){if(T.data==="teleport start anchor")e.targetStart=T;else if(T.data==="teleport anchor"){e.targetAnchor=T,m._lpa=e.targetAnchor&&o(e.targetAnchor);break}}T=o(T)}}function d(m,p){p.anchor=f(o(m),p,a(m),n,i,r,s)}const _=e.target=Uc(e.props,l),g=ro(e.props);if(_){const m=_._lpa||_.firstChild;e.shapeFlag&16&&(g?(d(t,e),h(_,m),e.targetAnchor||Nc(_,e,u,c,a(t)===_?t:null)):(e.anchor=o(t),h(_,m),e.targetAnchor||Nc(_,e,u,c),f(m&&o(m),e,_,n,i,r,s))),Pa(e,g)}else g&&e.shapeFlag&16&&(d(t,e),e.targetStart=t,e.targetAnchor=o(t));return e.anchor&&o(e.anchor)}const pm=dm;function Pa(t,e){const n=t.ctx;if(n&&n.ut){let i,r;for(e?(i=t.el,r=t.anchor):(i=t.targetStart,r=t.targetAnchor);i&&i!==r;)i.nodeType===1&&i.setAttribute("data-v-owner",n.uid),i=i.nextSibling;n.ut()}}function Nc(t,e,n,i,r=null){const s=e.targetStart=n(""),o=e.targetAnchor=n("");return s[hm]=o,t&&(i(s,t,r),i(o,t,r)),o}const b0=Symbol("_leaveCb");function sf(t,e){t.shapeFlag&6&&t.component?(t.transition=e,sf(t.component.subTree,e)):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function Ut(t,e){return Xe(t)?Vt({name:t.name},e,{setup:t}):t}function mm(t){t.ids=[t.ids[0]+t.ids[2]+++"-",0,0]}function Zf(t,e){let n;return!!((n=Object.getOwnPropertyDescriptor(t,e))&&!n.configurable)}const Wa=new WeakMap;function so(t,e,n,i,r=!1){if(Be(t)){t.forEach((g,m)=>so(g,e&&(Be(e)?e[m]:e),n,i,r));return}if(oo(i)&&!r){i.shapeFlag&512&&i.type.__asyncResolved&&i.component.subTree.component&&so(t,e,n,i.component.subTree);return}const s=i.shapeFlag&4?fl(i.component):i.el,o=r?null:s,{i:a,r:l}=t,c=e&&e.r,u=a.refs===mt?a.refs={}:a.refs,f=a.setupState,h=ot(f),d=f===mt?Ip:g=>Zf(u,g)?!1:at(h,g),_=(g,m)=>!(m&&Zf(u,m));if(c!=null&&c!==l){if(Kf(e),At(c))u[c]=null,d(c)&&(f[c]=null);else if(jt(c)){const g=e;_(c,g.k)&&(c.value=null),g.k&&(u[g.k]=null)}}if(Xe(l))Fo(l,a,12,[o,u]);else{const g=At(l),m=jt(l);if(g||m){const p=()=>{if(t.f){const T=g?d(l)?f[l]:u[l]:_()||!t.k?l.value:u[t.k];if(r)Be(T)&&Xu(T,s);else if(Be(T))T.includes(s)||T.push(s);else if(g)u[l]=[s],d(l)&&(f[l]=u[l]);else{const R=[s];_(l,t.k)&&(l.value=R),t.k&&(u[t.k]=R)}}else g?(u[l]=o,d(l)&&(f[l]=o)):m&&(_(l,t.k)&&(l.value=o),t.k&&(u[t.k]=o))};if(o){const T=()=>{p(),Wa.delete(t)};T.id=-1,Wa.set(t,T),Yt(T,n)}else Kf(t),p()}}}function Kf(t){const e=Wa.get(t);e&&(e.flags|=8,Wa.delete(t))}sl().requestIdleCallback;sl().cancelIdleCallback;const oo=t=>!!t.type.__asyncLoader,_m=t=>t.type.__isKeepAlive;function S0(t,e){gm(t,"a",e)}function M0(t,e){gm(t,"da",e)}function gm(t,e,n=nn){const i=t.__wdc||(t.__wdc=()=>{let r=n;for(;r;){if(r.isDeactivated)return;r=r.parent}return t()});if(ll(e,i,n),n){let r=n.parent;for(;r&&r.parent;)_m(r.parent.vnode)&&E0(i,e,n,r),r=r.parent}}function E0(t,e,n,i){const r=ll(e,t,i,!0);af(()=>{Xu(i[e],r)},n)}function ll(t,e,n=nn,i=!1){if(n){const r=n[t]||(n[t]=[]),s=e.__weh||(e.__weh=(...o)=>{Pi();const a=Oo(n),l=si(e,n,t,o);return a(),Di(),l});return i?r.unshift(s):r.push(s),s}}const Ui=t=>(e,n=nn)=>{(!xo||t==="sp")&&ll(t,(...i)=>e(...i),n)},w0=Ui("bm"),Lr=Ui("m"),T0=Ui("bu"),A0=Ui("u"),of=Ui("bum"),af=Ui("um"),R0=Ui("sp"),C0=Ui("rtg"),P0=Ui("rtc");function vm(t,e=nn){ll("ec",t,e)}const D0=Symbol.for("v-ndc");function ps(t,e,n,i){let r;const s=n,o=Be(t);if(o||At(t)){const a=o&&Mr(t);let l=!1,c=!1;a&&(l=!Tn(t),c=Li(t),t=ol(t)),r=new Array(t.length);for(let u=0,f=t.length;u<f;u++)r[u]=e(l?c?ds(zn(t[u])):zn(t[u]):t[u],u,void 0,s)}else if(typeof t=="number"){r=new Array(t);for(let a=0;a<t;a++)r[a]=e(a+1,a,void 0,s)}else if(pt(t))if(t[Symbol.iterator])r=Array.from(t,(a,l)=>e(a,l,void 0,s));else{const a=Object.keys(t);r=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const u=a[l];r[l]=e(t[u],u,l,s)}}else r=[];return r}const Fc=t=>t?Bm(t)?fl(t):Fc(t.parent):null,ao=Vt(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>Fc(t.parent),$root:t=>Fc(t.root),$host:t=>t.ce,$emit:t=>t.emit,$options:t=>ym(t),$forceUpdate:t=>t.f||(t.f=()=>{nf(t.update)}),$nextTick:t=>t.n||(t.n=sm.bind(t.proxy)),$watch:t=>g0.bind(t)}),Dl=(t,e)=>t!==mt&&!t.__isScriptSetup&&at(t,e),L0={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:i,data:r,props:s,accessCache:o,type:a,appContext:l}=t;if(e[0]!=="$"){const h=o[e];if(h!==void 0)switch(h){case 1:return i[e];case 2:return r[e];case 4:return n[e];case 3:return s[e]}else{if(Dl(i,e))return o[e]=1,i[e];if(r!==mt&&at(r,e))return o[e]=2,r[e];if(at(s,e))return o[e]=3,s[e];if(n!==mt&&at(n,e))return o[e]=4,n[e];Oc&&(o[e]=0)}}const c=ao[e];let u,f;if(c)return e==="$attrs"&&$t(t.attrs,"get",""),c(t);if((u=a.__cssModules)&&(u=u[e]))return u;if(n!==mt&&at(n,e))return o[e]=4,n[e];if(f=l.config.globalProperties,at(f,e))return f[e]},set({_:t},e,n){const{data:i,setupState:r,ctx:s}=t;return Dl(r,e)?(r[e]=n,!0):i!==mt&&at(i,e)?(i[e]=n,!0):at(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(s[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:i,appContext:r,props:s,type:o}},a){let l;return!!(n[a]||t!==mt&&a[0]!=="$"&&at(t,a)||Dl(e,a)||at(s,a)||at(i,a)||at(ao,a)||at(r.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:at(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function Jf(t){return Be(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let Oc=!0;function I0(t){const e=ym(t),n=t.proxy,i=t.ctx;Oc=!1,e.beforeCreate&&Qf(e.beforeCreate,t,"bc");const{data:r,computed:s,methods:o,watch:a,provide:l,inject:c,created:u,beforeMount:f,mounted:h,beforeUpdate:d,updated:_,activated:g,deactivated:m,beforeDestroy:p,beforeUnmount:T,destroyed:R,unmounted:y,render:P,renderTracked:L,renderTriggered:M,errorCaptured:A,serverPrefetch:v,expose:x,inheritAttrs:C,components:G,directives:V,filters:Z}=e;if(c&&U0(c,i,null),o)for(const Q in o){const N=o[Q];Xe(N)&&(i[Q]=N.bind(n))}if(r){const Q=r.call(n,n);pt(Q)&&(t.data=Qu(Q))}if(Oc=!0,s)for(const Q in s){const N=s[Q],ae=Xe(N)?N.bind(n,n):Xe(N.get)?N.get.bind(n,n):ti,pe=!Xe(N)&&Xe(N.set)?N.set.bind(n):ti,Te=Ve({get:ae,set:pe});Object.defineProperty(i,Q,{enumerable:!0,configurable:!0,get:()=>Te.value,set:Fe=>Te.value=Fe})}if(a)for(const Q in a)xm(a[Q],i,n,Q);if(l){const Q=Xe(l)?l.call(n):l;Reflect.ownKeys(Q).forEach(N=>{rf(N,Q[N])})}u&&Qf(u,t,"c");function J(Q,N){Be(N)?N.forEach(ae=>Q(ae.bind(n))):N&&Q(N.bind(n))}if(J(w0,f),J(Lr,h),J(T0,d),J(A0,_),J(S0,g),J(M0,m),J(vm,A),J(P0,L),J(C0,M),J(of,T),J(af,y),J(R0,v),Be(x))if(x.length){const Q=t.exposed||(t.exposed={});x.forEach(N=>{Object.defineProperty(Q,N,{get:()=>n[N],set:ae=>n[N]=ae,enumerable:!0})})}else t.exposed||(t.exposed={});P&&t.render===ti&&(t.render=P),C!=null&&(t.inheritAttrs=C),G&&(t.components=G),V&&(t.directives=V),v&&mm(t)}function U0(t,e,n=ti){Be(t)&&(t=Bc(t));for(const i in t){const r=t[i];let s;pt(r)?"default"in r?s=Er(r.from||i,r.default,!0):s=Er(r.from||i):s=Er(r),jt(s)?Object.defineProperty(e,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:o=>s.value=o}):e[i]=s}}function Qf(t,e,n){si(Be(t)?t.map(i=>i.bind(e.proxy)):t.bind(e.proxy),e,n)}function xm(t,e,n,i){let r=i.includes(".")?fm(n,i):()=>n[i];if(At(t)){const s=e[t];Xe(s)&&An(r,s)}else if(Xe(t))An(r,t.bind(n));else if(pt(t))if(Be(t))t.forEach(s=>xm(s,e,n,i));else{const s=Xe(t.handler)?t.handler.bind(n):e[t.handler];Xe(s)&&An(r,s,t)}}function ym(t){const e=t.type,{mixins:n,extends:i}=e,{mixins:r,optionsCache:s,config:{optionMergeStrategies:o}}=t.appContext,a=s.get(e);let l;return a?l=a:!r.length&&!n&&!i?l=e:(l={},r.length&&r.forEach(c=>Xa(l,c,o,!0)),Xa(l,e,o)),pt(e)&&s.set(e,l),l}function Xa(t,e,n,i=!1){const{mixins:r,extends:s}=e;s&&Xa(t,s,n,!0),r&&r.forEach(o=>Xa(t,o,n,!0));for(const o in e)if(!(i&&o==="expose")){const a=N0[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const N0={data:eh,props:th,emits:th,methods:Ks,computed:Ks,beforeCreate:Zt,created:Zt,beforeMount:Zt,mounted:Zt,beforeUpdate:Zt,updated:Zt,beforeDestroy:Zt,beforeUnmount:Zt,destroyed:Zt,unmounted:Zt,activated:Zt,deactivated:Zt,errorCaptured:Zt,serverPrefetch:Zt,components:Ks,directives:Ks,watch:O0,provide:eh,inject:F0};function eh(t,e){return e?t?function(){return Vt(Xe(t)?t.call(this,this):t,Xe(e)?e.call(this,this):e)}:e:t}function F0(t,e){return Ks(Bc(t),Bc(e))}function Bc(t){if(Be(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function Zt(t,e){return t?[...new Set([].concat(t,e))]:e}function Ks(t,e){return t?Vt(Object.create(null),t,e):e}function th(t,e){return t?Be(t)&&Be(e)?[...new Set([...t,...e])]:Vt(Object.create(null),Jf(t),Jf(e??{})):e}function O0(t,e){if(!t)return e;if(!e)return t;const n=Vt(Object.create(null),t);for(const i in e)n[i]=Zt(t[i],e[i]);return n}function bm(){return{app:null,config:{isNativeTag:Ip,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let B0=0;function k0(t,e){return function(i,r=null){Xe(i)||(i=Vt({},i)),r!=null&&!pt(r)&&(r=null);const s=bm(),o=new WeakSet,a=[];let l=!1;const c=s.app={_uid:B0++,_component:i,_props:r,_container:null,_context:s,_instance:null,version:vv,get config(){return s.config},set config(u){},use(u,...f){return o.has(u)||(u&&Xe(u.install)?(o.add(u),u.install(c,...f)):Xe(u)&&(o.add(u),u(c,...f))),c},mixin(u){return s.mixins.includes(u)||s.mixins.push(u),c},component(u,f){return f?(s.components[u]=f,c):s.components[u]},directive(u,f){return f?(s.directives[u]=f,c):s.directives[u]},mount(u,f,h){if(!l){const d=c._ceVNode||Tt(i,r);return d.appContext=s,h===!0?h="svg":h===!1&&(h=void 0),t(d,u,h),l=!0,c._container=u,u.__vue_app__=c,fl(d.component)}},onUnmount(u){a.push(u)},unmount(){l&&(si(a,c._instance,16),t(null,c._container),delete c._container.__vue_app__)},provide(u,f){return s.provides[u]=f,c},runWithContext(u){const f=ls;ls=c;try{return u()}finally{ls=f}}};return c}}let ls=null;const z0=(t,e)=>e==="modelValue"||e==="model-value"?t.modelModifiers:t[`${e}Modifiers`]||t[`${On(e)}Modifiers`]||t[`${Dr(e)}Modifiers`];function H0(t,e,...n){if(t.isUnmounted)return;const i=t.vnode.props||mt;let r=n;const s=e.startsWith("update:"),o=s&&z0(i,e.slice(7));o&&(o.trim&&(r=n.map(u=>At(u)?u.trim():u)),o.number&&(r=n.map(rl)));let a,l=i[a=Tl(e)]||i[a=Tl(On(e))];!l&&s&&(l=i[a=Tl(Dr(e))]),l&&si(l,t,6,r);const c=i[a+"Once"];if(c){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,si(c,t,6,r)}}const V0=new WeakMap;function Sm(t,e,n=!1){const i=n?V0:e.emitsCache,r=i.get(t);if(r!==void 0)return r;const s=t.emits;let o={},a=!1;if(!Xe(t)){const l=c=>{const u=Sm(c,e,!0);u&&(a=!0,Vt(o,u))};!n&&e.mixins.length&&e.mixins.forEach(l),t.extends&&l(t.extends),t.mixins&&t.mixins.forEach(l)}return!s&&!a?(pt(t)&&i.set(t,null),null):(Be(s)?s.forEach(l=>o[l]=null):Vt(o,s),pt(t)&&i.set(t,o),o)}function cl(t,e){return!t||!tl(e)?!1:(e=e.slice(2).replace(/Once$/,""),at(t,e[0].toLowerCase()+e.slice(1))||at(t,Dr(e))||at(t,e))}function nh(t){const{type:e,vnode:n,proxy:i,withProxy:r,propsOptions:[s],slots:o,attrs:a,emit:l,render:c,renderCache:u,props:f,data:h,setupState:d,ctx:_,inheritAttrs:g}=t,m=Ga(t);let p,T;try{if(n.shapeFlag&4){const y=r||i,P=y;p=jn(c.call(P,y,u,f,d,h,_)),T=a}else{const y=e;p=jn(y.length>1?y(f,{attrs:a,slots:o,emit:l}):y(f,null)),T=e.props?a:G0(a)}}catch(y){lo.length=0,al(y,t,1),p=Tt(Qi)}let R=p;if(T&&g!==!1){const y=Object.keys(T),{shapeFlag:P}=R;y.length&&P&7&&(s&&y.some(nl)&&(T=W0(T,s)),R=ms(R,T,!1,!0))}return n.dirs&&(R=ms(R,null,!1,!0),R.dirs=R.dirs?R.dirs.concat(n.dirs):n.dirs),n.transition&&sf(R,n.transition),p=R,Ga(m),p}const G0=t=>{let e;for(const n in t)(n==="class"||n==="style"||tl(n))&&((e||(e={}))[n]=t[n]);return e},W0=(t,e)=>{const n={};for(const i in t)(!nl(i)||!(i.slice(9)in e))&&(n[i]=t[i]);return n};function X0(t,e,n){const{props:i,children:r,component:s}=t,{props:o,children:a,patchFlag:l}=e,c=s.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return i?ih(i,o,c):!!o;if(l&8){const u=e.dynamicProps;for(let f=0;f<u.length;f++){const h=u[f];if(Mm(o,i,h)&&!cl(c,h))return!0}}}else return(r||a)&&(!a||!a.$stable)?!0:i===o?!1:i?o?ih(i,o,c):!0:!!o;return!1}function ih(t,e,n){const i=Object.keys(e);if(i.length!==Object.keys(t).length)return!0;for(let r=0;r<i.length;r++){const s=i[r];if(Mm(e,t,s)&&!cl(n,s))return!0}return!1}function Mm(t,e,n){const i=t[n],r=e[n];return n==="style"&&pt(i)&&pt(r)?!Rs(i,r):i!==r}function Y0({vnode:t,parent:e,suspense:n},i){for(;e;){const r=e.subTree;if(r.suspense&&r.suspense.activeBranch===t&&(r.suspense.vnode.el=r.el=i,t=r),r===t)(t=e.vnode).el=i,e=e.parent;else break}n&&n.activeBranch===t&&(n.vnode.el=i)}const Em={},wm=()=>Object.create(Em),Tm=t=>Object.getPrototypeOf(t)===Em;function $0(t,e,n,i=!1){const r={},s=wm();t.propsDefaults=Object.create(null),Am(t,e,r,s);for(const o in t.propsOptions[0])o in r||(r[o]=void 0);n?t.props=i?r:i0(r):t.type.props?t.props=r:t.props=s,t.attrs=s}function j0(t,e,n,i){const{props:r,attrs:s,vnode:{patchFlag:o}}=t,a=ot(r),[l]=t.propsOptions;let c=!1;if((i||o>0)&&!(o&16)){if(o&8){const u=t.vnode.dynamicProps;for(let f=0;f<u.length;f++){let h=u[f];if(cl(t.emitsOptions,h))continue;const d=e[h];if(l)if(at(s,h))d!==s[h]&&(s[h]=d,c=!0);else{const _=On(h);r[_]=kc(l,a,_,d,t,!1)}else d!==s[h]&&(s[h]=d,c=!0)}}}else{Am(t,e,r,s)&&(c=!0);let u;for(const f in a)(!e||!at(e,f)&&((u=Dr(f))===f||!at(e,u)))&&(l?n&&(n[f]!==void 0||n[u]!==void 0)&&(r[f]=kc(l,a,f,void 0,t,!0)):delete r[f]);if(s!==a)for(const f in s)(!e||!at(e,f))&&(delete s[f],c=!0)}c&&bi(t.attrs,"set","")}function Am(t,e,n,i){const[r,s]=t.propsOptions;let o=!1,a;if(e)for(let l in e){if(to(l))continue;const c=e[l];let u;r&&at(r,u=On(l))?!s||!s.includes(u)?n[u]=c:(a||(a={}))[u]=c:cl(t.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,o=!0)}if(s){const l=ot(n),c=a||mt;for(let u=0;u<s.length;u++){const f=s[u];n[f]=kc(r,l,f,c[f],t,!at(c,f))}}return o}function kc(t,e,n,i,r,s){const o=t[n];if(o!=null){const a=at(o,"default");if(a&&i===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&Xe(l)){const{propsDefaults:c}=r;if(n in c)i=c[n];else{const u=Oo(r);i=c[n]=l.call(null,e),u()}}else i=l;r.ce&&r.ce._setProp(n,i)}o[0]&&(s&&!a?i=!1:o[1]&&(i===""||i===Dr(n))&&(i=!0))}return i}const q0=new WeakMap;function Rm(t,e,n=!1){const i=n?q0:e.propsCache,r=i.get(t);if(r)return r;const s=t.props,o={},a=[];let l=!1;if(!Xe(t)){const u=f=>{l=!0;const[h,d]=Rm(f,e,!0);Vt(o,h),d&&a.push(...d)};!n&&e.mixins.length&&e.mixins.forEach(u),t.extends&&u(t.extends),t.mixins&&t.mixins.forEach(u)}if(!s&&!l)return pt(t)&&i.set(t,ss),ss;if(Be(s))for(let u=0;u<s.length;u++){const f=On(s[u]);rh(f)&&(o[f]=mt)}else if(s)for(const u in s){const f=On(u);if(rh(f)){const h=s[u],d=o[f]=Be(h)||Xe(h)?{type:h}:Vt({},h),_=d.type;let g=!1,m=!0;if(Be(_))for(let p=0;p<_.length;++p){const T=_[p],R=Xe(T)&&T.name;if(R==="Boolean"){g=!0;break}else R==="String"&&(m=!1)}else g=Xe(_)&&_.name==="Boolean";d[0]=g,d[1]=m,(g||at(d,"default"))&&a.push(f)}}const c=[o,a];return pt(t)&&i.set(t,c),c}function rh(t){return t[0]!=="$"&&!to(t)}const lf=t=>t==="_"||t==="_ctx"||t==="$stable",cf=t=>Be(t)?t.map(jn):[jn(t)],Z0=(t,e,n)=>{if(e._n)return e;const i=p0((...r)=>cf(e(...r)),n);return i._c=!1,i},Cm=(t,e,n)=>{const i=t._ctx;for(const r in t){if(lf(r))continue;const s=t[r];if(Xe(s))e[r]=Z0(r,s,i);else if(s!=null){const o=cf(s);e[r]=()=>o}}},Pm=(t,e)=>{const n=cf(e);t.slots.default=()=>n},Dm=(t,e,n)=>{for(const i in e)(n||!lf(i))&&(t[i]=e[i])},K0=(t,e,n)=>{const i=t.slots=wm();if(t.vnode.shapeFlag&32){const r=e._;r?(Dm(i,e,n),n&&Bp(i,"_",r,!0)):Cm(e,i)}else e&&Pm(t,e)},J0=(t,e,n)=>{const{vnode:i,slots:r}=t;let s=!0,o=mt;if(i.shapeFlag&32){const a=e._;a?n&&a===1?s=!1:Dm(r,e,n):(s=!e.$stable,Cm(e,r)),o=e}else e&&(Pm(t,e),o={default:1});if(s)for(const a in r)!lf(a)&&o[a]==null&&delete r[a]},Yt=iv;function Q0(t){return ev(t)}function ev(t,e){const n=sl();n.__VUE__=!0;const{insert:i,remove:r,patchProp:s,createElement:o,createText:a,createComment:l,setText:c,setElementText:u,parentNode:f,nextSibling:h,setScopeId:d=ti,insertStaticContent:_}=t,g=(D,U,E,re=null,q=null,K=null,te=void 0,oe=null,j=!!U.dynamicChildren)=>{if(D===U)return;D&&!Hs(D,U)&&(re=_e(D),Fe(D,q,K,!0),D=null),U.patchFlag===-2&&(j=!1,U.dynamicChildren=null);const{type:S,ref:b,shapeFlag:I}=U;switch(S){case ul:m(D,U,E,re);break;case Qi:p(D,U,E,re);break;case Da:D==null&&T(U,E,re,te);break;case Ot:G(D,U,E,re,q,K,te,oe,j);break;default:I&1?P(D,U,E,re,q,K,te,oe,j):I&6?V(D,U,E,re,q,K,te,oe,j):(I&64||I&128)&&S.process(D,U,E,re,q,K,te,oe,j,De)}b!=null&&q?so(b,D&&D.ref,K,U||D,!U):b==null&&D&&D.ref!=null&&so(D.ref,null,K,D,!0)},m=(D,U,E,re)=>{if(D==null)i(U.el=a(U.children),E,re);else{const q=U.el=D.el;U.children!==D.children&&c(q,U.children)}},p=(D,U,E,re)=>{D==null?i(U.el=l(U.children||""),E,re):U.el=D.el},T=(D,U,E,re)=>{[D.el,D.anchor]=_(D.children,U,E,re,D.el,D.anchor)},R=({el:D,anchor:U},E,re)=>{let q;for(;D&&D!==U;)q=h(D),i(D,E,re),D=q;i(U,E,re)},y=({el:D,anchor:U})=>{let E;for(;D&&D!==U;)E=h(D),r(D),D=E;r(U)},P=(D,U,E,re,q,K,te,oe,j)=>{if(U.type==="svg"?te="svg":U.type==="math"&&(te="mathml"),D==null)L(U,E,re,q,K,te,oe,j);else{const S=D.el&&D.el._isVueCE?D.el:null;try{S&&S._beginPatch(),v(D,U,q,K,te,oe,j)}finally{S&&S._endPatch()}}},L=(D,U,E,re,q,K,te,oe)=>{let j,S;const{props:b,shapeFlag:I,transition:H,dirs:W}=D;if(j=D.el=o(D.type,K,b&&b.is,b),I&8?u(j,D.children):I&16&&A(D.children,j,null,re,q,Ll(D,K),te,oe),W&&rr(D,null,re,"created"),M(j,D,D.scopeId,te,re),b){for(const he in b)he!=="value"&&!to(he)&&s(j,he,null,b[he],K,re);"value"in b&&s(j,"value",null,b.value,K),(S=b.onVnodeBeforeMount)&&Gn(S,re,D)}W&&rr(D,null,re,"beforeMount");const X=tv(q,H);X&&H.beforeEnter(j),i(j,U,E),((S=b&&b.onVnodeMounted)||X||W)&&Yt(()=>{try{S&&Gn(S,re,D),X&&H.enter(j),W&&rr(D,null,re,"mounted")}finally{}},q)},M=(D,U,E,re,q)=>{if(E&&d(D,E),re)for(let K=0;K<re.length;K++)d(D,re[K]);if(q){let K=q.subTree;if(U===K||Um(K.type)&&(K.ssContent===U||K.ssFallback===U)){const te=q.vnode;M(D,te,te.scopeId,te.slotScopeIds,q.parent)}}},A=(D,U,E,re,q,K,te,oe,j=0)=>{for(let S=j;S<D.length;S++){const b=D[S]=oe?vi(D[S]):jn(D[S]);g(null,b,U,E,re,q,K,te,oe)}},v=(D,U,E,re,q,K,te)=>{const oe=U.el=D.el;let{patchFlag:j,dynamicChildren:S,dirs:b}=U;j|=D.patchFlag&16;const I=D.props||mt,H=U.props||mt;let W;if(E&&sr(E,!1),(W=H.onVnodeBeforeUpdate)&&Gn(W,E,U,D),b&&rr(U,D,E,"beforeUpdate"),E&&sr(E,!0),(I.innerHTML&&H.innerHTML==null||I.textContent&&H.textContent==null)&&u(oe,""),S?x(D.dynamicChildren,S,oe,E,re,Ll(U,q),K):te||N(D,U,oe,null,E,re,Ll(U,q),K,!1),j>0){if(j&16)C(oe,I,H,E,q);else if(j&2&&I.class!==H.class&&s(oe,"class",null,H.class,q),j&4&&s(oe,"style",I.style,H.style,q),j&8){const X=U.dynamicProps;for(let he=0;he<X.length;he++){const le=X[he],fe=I[le],Ie=H[le];(Ie!==fe||le==="value")&&s(oe,le,fe,Ie,q,E)}}j&1&&D.children!==U.children&&u(oe,U.children)}else!te&&S==null&&C(oe,I,H,E,q);((W=H.onVnodeUpdated)||b)&&Yt(()=>{W&&Gn(W,E,U,D),b&&rr(U,D,E,"updated")},re)},x=(D,U,E,re,q,K,te)=>{for(let oe=0;oe<U.length;oe++){const j=D[oe],S=U[oe],b=j.el&&(j.type===Ot||!Hs(j,S)||j.shapeFlag&198)?f(j.el):E;g(j,S,b,null,re,q,K,te,!0)}},C=(D,U,E,re,q)=>{if(U!==E){if(U!==mt)for(const K in U)!to(K)&&!(K in E)&&s(D,K,U[K],null,q,re);for(const K in E){if(to(K))continue;const te=E[K],oe=U[K];te!==oe&&K!=="value"&&s(D,K,oe,te,q,re)}"value"in E&&s(D,"value",U.value,E.value,q)}},G=(D,U,E,re,q,K,te,oe,j)=>{const S=U.el=D?D.el:a(""),b=U.anchor=D?D.anchor:a("");let{patchFlag:I,dynamicChildren:H,slotScopeIds:W}=U;W&&(oe=oe?oe.concat(W):W),D==null?(i(S,E,re),i(b,E,re),A(U.children||[],E,b,q,K,te,oe,j)):I>0&&I&64&&H&&D.dynamicChildren&&D.dynamicChildren.length===H.length?(x(D.dynamicChildren,H,E,q,K,te,oe),(U.key!=null||q&&U===q.subTree)&&uf(D,U,!0)):N(D,U,E,b,q,K,te,oe,j)},V=(D,U,E,re,q,K,te,oe,j)=>{U.slotScopeIds=oe,D==null?U.shapeFlag&512?q.ctx.activate(U,E,re,te,j):Z(U,E,re,q,K,te,j):ee(D,U,j)},Z=(D,U,E,re,q,K,te)=>{const oe=D.component=fv(D,re,q);if(_m(D)&&(oe.ctx.renderer=De),dv(oe,!1,te),oe.asyncDep){if(q&&q.registerDep(oe,J,te),!D.el){const j=oe.subTree=Tt(Qi);p(null,j,U,E),D.placeholder=j.el}}else J(oe,D,U,E,q,K,te)},ee=(D,U,E)=>{const re=U.component=D.component;if(X0(D,U,E))if(re.asyncDep&&!re.asyncResolved){Q(re,U,E);return}else re.next=U,re.update();else U.el=D.el,re.vnode=U},J=(D,U,E,re,q,K,te)=>{const oe=()=>{if(D.isMounted){let{next:I,bu:H,u:W,parent:X,vnode:he}=D;{const ve=Lm(D);if(ve){I&&(I.el=he.el,Q(D,I,te)),ve.asyncDep.then(()=>{Yt(()=>{D.isUnmounted||S()},q)});return}}let le=I,fe;sr(D,!1),I?(I.el=he.el,Q(D,I,te)):I=he,H&&Ca(H),(fe=I.props&&I.props.onVnodeBeforeUpdate)&&Gn(fe,X,I,he),sr(D,!0);const Ie=nh(D),ce=D.subTree;D.subTree=Ie,g(ce,Ie,f(ce.el),_e(ce),D,q,K),I.el=Ie.el,le===null&&Y0(D,Ie.el),W&&Yt(W,q),(fe=I.props&&I.props.onVnodeUpdated)&&Yt(()=>Gn(fe,X,I,he),q)}else{let I;const{el:H,props:W}=U,{bm:X,m:he,parent:le,root:fe,type:Ie}=D,ce=oo(U);sr(D,!1),X&&Ca(X),!ce&&(I=W&&W.onVnodeBeforeMount)&&Gn(I,le,U),sr(D,!0);{fe.ce&&fe.ce._hasShadowRoot()&&fe.ce._injectChildStyle(Ie,D.parent?D.parent.type:void 0);const ve=D.subTree=nh(D);g(null,ve,E,re,D,q,K),U.el=ve.el}if(he&&Yt(he,q),!ce&&(I=W&&W.onVnodeMounted)){const ve=U;Yt(()=>Gn(I,le,ve),q)}(U.shapeFlag&256||le&&oo(le.vnode)&&le.vnode.shapeFlag&256)&&D.a&&Yt(D.a,q),D.isMounted=!0,U=E=re=null}};D.scope.on();const j=D.effect=new Vp(oe);D.scope.off();const S=D.update=j.run.bind(j),b=D.job=j.runIfDirty.bind(j);b.i=D,b.id=D.uid,j.scheduler=()=>nf(b),sr(D,!0),S()},Q=(D,U,E)=>{U.component=D;const re=D.vnode.props;D.vnode=U,D.next=null,j0(D,U.props,re,E),J0(D,U.children,E),Pi(),$f(D),Di()},N=(D,U,E,re,q,K,te,oe,j=!1)=>{const S=D&&D.children,b=D?D.shapeFlag:0,I=U.children,{patchFlag:H,shapeFlag:W}=U;if(H>0){if(H&128){pe(S,I,E,re,q,K,te,oe,j);return}else if(H&256){ae(S,I,E,re,q,K,te,oe,j);return}}W&8?(b&16&&Ee(S,q,K),I!==S&&u(E,I)):b&16?W&16?pe(S,I,E,re,q,K,te,oe,j):Ee(S,q,K,!0):(b&8&&u(E,""),W&16&&A(I,E,re,q,K,te,oe,j))},ae=(D,U,E,re,q,K,te,oe,j)=>{D=D||ss,U=U||ss;const S=D.length,b=U.length,I=Math.min(S,b);let H;for(H=0;H<I;H++){const W=U[H]=j?vi(U[H]):jn(U[H]);g(D[H],W,E,null,q,K,te,oe,j)}S>b?Ee(D,q,K,!0,!1,I):A(U,E,re,q,K,te,oe,j,I)},pe=(D,U,E,re,q,K,te,oe,j)=>{let S=0;const b=U.length;let I=D.length-1,H=b-1;for(;S<=I&&S<=H;){const W=D[S],X=U[S]=j?vi(U[S]):jn(U[S]);if(Hs(W,X))g(W,X,E,null,q,K,te,oe,j);else break;S++}for(;S<=I&&S<=H;){const W=D[I],X=U[H]=j?vi(U[H]):jn(U[H]);if(Hs(W,X))g(W,X,E,null,q,K,te,oe,j);else break;I--,H--}if(S>I){if(S<=H){const W=H+1,X=W<b?U[W].el:re;for(;S<=H;)g(null,U[S]=j?vi(U[S]):jn(U[S]),E,X,q,K,te,oe,j),S++}}else if(S>H)for(;S<=I;)Fe(D[S],q,K,!0),S++;else{const W=S,X=S,he=new Map;for(S=X;S<=H;S++){const me=U[S]=j?vi(U[S]):jn(U[S]);me.key!=null&&he.set(me.key,S)}let le,fe=0;const Ie=H-X+1;let ce=!1,ve=0;const Ce=new Array(Ie);for(S=0;S<Ie;S++)Ce[S]=0;for(S=W;S<=I;S++){const me=D[S];if(fe>=Ie){Fe(me,q,K,!0);continue}let ke;if(me.key!=null)ke=he.get(me.key);else for(le=X;le<=H;le++)if(Ce[le-X]===0&&Hs(me,U[le])){ke=le;break}ke===void 0?Fe(me,q,K,!0):(Ce[ke-X]=S+1,ke>=ve?ve=ke:ce=!0,g(me,U[ke],E,null,q,K,te,oe,j),fe++)}const Oe=ce?nv(Ce):ss;for(le=Oe.length-1,S=Ie-1;S>=0;S--){const me=X+S,ke=U[me],Ge=U[me+1],ct=me+1<b?Ge.el||Im(Ge):re;Ce[S]===0?g(null,ke,E,ct,q,K,te,oe,j):ce&&(le<0||S!==Oe[le]?Te(ke,E,ct,2):le--)}}},Te=(D,U,E,re,q=null)=>{const{el:K,type:te,transition:oe,children:j,shapeFlag:S}=D;if(S&6){Te(D.component.subTree,U,E,re);return}if(S&128){D.suspense.move(U,E,re);return}if(S&64){te.move(D,U,E,De);return}if(te===Ot){i(K,U,E);for(let I=0;I<j.length;I++)Te(j[I],U,E,re);i(D.anchor,U,E);return}if(te===Da){R(D,U,E);return}if(re!==2&&S&1&&oe)if(re===0)oe.beforeEnter(K),i(K,U,E),Yt(()=>oe.enter(K),q);else{const{leave:I,delayLeave:H,afterLeave:W}=oe,X=()=>{D.ctx.isUnmounted?r(K):i(K,U,E)},he=()=>{K._isLeaving&&K[b0](!0),I(K,()=>{X(),W&&W()})};H?H(K,X,he):he()}else i(K,U,E)},Fe=(D,U,E,re=!1,q=!1)=>{const{type:K,props:te,ref:oe,children:j,dynamicChildren:S,shapeFlag:b,patchFlag:I,dirs:H,cacheIndex:W,memo:X}=D;if(I===-2&&(q=!1),oe!=null&&(Pi(),so(oe,null,E,D,!0),Di()),W!=null&&(U.renderCache[W]=void 0),b&256){U.ctx.deactivate(D);return}const he=b&1&&H,le=!oo(D);let fe;if(le&&(fe=te&&te.onVnodeBeforeUnmount)&&Gn(fe,U,D),b&6)de(D.component,E,re);else{if(b&128){D.suspense.unmount(E,re);return}he&&rr(D,null,U,"beforeUnmount"),b&64?D.type.remove(D,U,E,De,re):S&&!S.hasOnce&&(K!==Ot||I>0&&I&64)?Ee(S,U,E,!1,!0):(K===Ot&&I&384||!q&&b&16)&&Ee(j,U,E),re&&it(D)}const Ie=X!=null&&W==null;(le&&(fe=te&&te.onVnodeUnmounted)||he||Ie)&&Yt(()=>{fe&&Gn(fe,U,D),he&&rr(D,null,U,"unmounted"),Ie&&(D.el=null)},E)},it=D=>{const{type:U,el:E,anchor:re,transition:q}=D;if(U===Ot){ie(E,re);return}if(U===Da){y(D);return}const K=()=>{r(E),q&&!q.persisted&&q.afterLeave&&q.afterLeave()};if(D.shapeFlag&1&&q&&!q.persisted){const{leave:te,delayLeave:oe}=q,j=()=>te(E,K);oe?oe(D.el,K,j):j()}else K()},ie=(D,U)=>{let E;for(;D!==U;)E=h(D),r(D),D=E;r(U)},de=(D,U,E)=>{const{bum:re,scope:q,job:K,subTree:te,um:oe,m:j,a:S}=D;sh(j),sh(S),re&&Ca(re),q.stop(),K&&(K.flags|=8,Fe(te,D,U,E)),oe&&Yt(oe,U),Yt(()=>{D.isUnmounted=!0},U)},Ee=(D,U,E,re=!1,q=!1,K=0)=>{for(let te=K;te<D.length;te++)Fe(D[te],U,E,re,q)},_e=D=>{if(D.shapeFlag&6)return _e(D.component.subTree);if(D.shapeFlag&128)return D.suspense.next();const U=h(D.anchor||D.el),E=U&&U[hm];return E?h(E):U};let Pe=!1;const Je=(D,U,E)=>{let re;D==null?U._vnode&&(Fe(U._vnode,null,null,!0),re=U._vnode.component):g(U._vnode||null,D,U,null,null,null,E),U._vnode=D,Pe||(Pe=!0,$f(re),am(),Pe=!1)},De={p:g,um:Fe,m:Te,r:it,mt:Z,mc:A,pc:N,pbc:x,n:_e,o:t};return{render:Je,hydrate:void 0,createApp:k0(Je)}}function Ll({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function sr({effect:t,job:e},n){n?(t.flags|=32,e.flags|=4):(t.flags&=-33,e.flags&=-5)}function tv(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function uf(t,e,n=!1){const i=t.children,r=e.children;if(Be(i)&&Be(r))for(let s=0;s<i.length;s++){const o=i[s];let a=r[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=r[s]=vi(r[s]),a.el=o.el),!n&&a.patchFlag!==-2&&uf(o,a)),a.type===ul&&(a.patchFlag===-1&&(a=r[s]=vi(a)),a.el=o.el),a.type===Qi&&!a.el&&(a.el=o.el)}}function nv(t){const e=t.slice(),n=[0];let i,r,s,o,a;const l=t.length;for(i=0;i<l;i++){const c=t[i];if(c!==0){if(r=n[n.length-1],t[r]<c){e[i]=r,n.push(i);continue}for(s=0,o=n.length-1;s<o;)a=s+o>>1,t[n[a]]<c?s=a+1:o=a;c<t[n[s]]&&(s>0&&(e[i]=n[s-1]),n[s]=i)}}for(s=n.length,o=n[s-1];s-- >0;)n[s]=o,o=e[o];return n}function Lm(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:Lm(e)}function sh(t){if(t)for(let e=0;e<t.length;e++)t[e].flags|=8}function Im(t){if(t.placeholder)return t.placeholder;const e=t.component;return e?Im(e.subTree):null}const Um=t=>t.__isSuspense;function iv(t,e){e&&e.pendingBranch?Be(t)?e.effects.push(...t):e.effects.push(t):d0(t)}const Ot=Symbol.for("v-fgt"),ul=Symbol.for("v-txt"),Qi=Symbol.for("v-cmt"),Da=Symbol.for("v-stc"),lo=[];let vn=null;function Me(t=!1){lo.push(vn=t?null:[])}function rv(){lo.pop(),vn=lo[lo.length-1]||null}let vo=1;function oh(t,e=!1){vo+=t,t<0&&vn&&e&&(vn.hasOnce=!0)}function Nm(t){return t.dynamicChildren=vo>0?vn||ss:null,rv(),vo>0&&vn&&vn.push(t),t}function Re(t,e,n,i,r,s){return Nm(z(t,e,n,i,r,s,!0))}function Kn(t,e,n,i,r){return Nm(Tt(t,e,n,i,r,!0))}function Fm(t){return t?t.__v_isVNode===!0:!1}function Hs(t,e){return t.type===e.type&&t.key===e.key}const Om=({key:t})=>t??null,La=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?At(t)||jt(t)||Xe(t)?{i:wn,r:t,k:e,f:!!n}:t:null);function z(t,e=null,n=null,i=0,r=null,s=t===Ot?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&Om(e),ref:e&&La(e),scopeId:cm,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:wn};return a?(ff(l,n),s&128&&t.normalize(l)):n&&(l.shapeFlag|=At(n)?8:16),vo>0&&!o&&vn&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&vn.push(l),l}const Tt=sv;function sv(t,e=null,n=null,i=0,r=null,s=!1){if((!t||t===D0)&&(t=Qi),Fm(t)){const a=ms(t,e,!0);return n&&ff(a,n),vo>0&&!s&&vn&&(a.shapeFlag&6?vn[vn.indexOf(t)]=a:vn.push(a)),a.patchFlag=-2,a}if(gv(t)&&(t=t.__vccOpts),e){e=ov(e);let{class:a,style:l}=e;a&&!At(a)&&(e.class=un(a)),pt(l)&&(tf(l)&&!Be(l)&&(l=Vt({},l)),e.style=No(l))}const o=At(t)?1:Um(t)?128:v0(t)?64:pt(t)?4:Xe(t)?2:0;return z(t,e,n,i,r,o,s,!0)}function ov(t){return t?tf(t)||Tm(t)?Vt({},t):t:null}function ms(t,e,n=!1,i=!1){const{props:r,ref:s,patchFlag:o,children:a,transition:l}=t,c=e?lv(r||{},e):r,u={__v_isVNode:!0,__v_skip:!0,type:t.type,props:c,key:c&&Om(c),ref:e&&e.ref?n&&s?Be(s)?s.concat(La(e)):[s,La(e)]:La(e):s,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:a,target:t.target,targetStart:t.targetStart,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==Ot?o===-1?16:o|16:o,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:l,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&ms(t.ssContent),ssFallback:t.ssFallback&&ms(t.ssFallback),placeholder:t.placeholder,el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return l&&i&&sf(u,l.clone(u)),u}function Un(t=" ",e=0){return Tt(ul,null,t,e)}function av(t,e){const n=Tt(Da,null,t);return n.staticCount=e,n}function wt(t="",e=!1){return e?(Me(),Kn(Qi,null,t)):Tt(Qi,null,t)}function jn(t){return t==null||typeof t=="boolean"?Tt(Qi):Be(t)?Tt(Ot,null,t.slice()):Fm(t)?vi(t):Tt(ul,null,String(t))}function vi(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:ms(t)}function ff(t,e){let n=0;const{shapeFlag:i}=t;if(e==null)e=null;else if(Be(e))n=16;else if(typeof e=="object")if(i&65){const r=e.default;r&&(r._c&&(r._d=!1),ff(t,r()),r._c&&(r._d=!0));return}else{n=32;const r=e._;!r&&!Tm(e)?e._ctx=wn:r===3&&wn&&(wn.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else Xe(e)?(e={default:e,_ctx:wn},n=32):(e=String(e),i&64?(n=16,e=[Un(e)]):n=8);t.children=e,t.shapeFlag|=n}function lv(...t){const e={};for(let n=0;n<t.length;n++){const i=t[n];for(const r in i)if(r==="class")e.class!==i.class&&(e.class=un([e.class,i.class]));else if(r==="style")e.style=No([e.style,i.style]);else if(tl(r)){const s=e[r],o=i[r];o&&s!==o&&!(Be(s)&&s.includes(o))?e[r]=s?[].concat(s,o):o:o==null&&s==null&&!nl(r)&&(e[r]=o)}else r!==""&&(e[r]=i[r])}return e}function Gn(t,e,n,i=null){si(t,e,7,[n,i])}const cv=bm();let uv=0;function fv(t,e,n){const i=t.type,r=(e?e.appContext:t.appContext)||cv,s={uid:uv++,vnode:t,type:i,parent:e,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Og(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(r.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Rm(i,r),emitsOptions:Sm(i,r),emit:null,emitted:null,propsDefaults:mt,inheritAttrs:i.inheritAttrs,ctx:mt,data:mt,props:mt,attrs:mt,slots:mt,refs:mt,setupState:mt,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=e?e.root:s,s.emit=H0.bind(null,s),t.ce&&t.ce(s),s}let nn=null;const hv=()=>nn||wn;let Ya,zc;{const t=sl(),e=(n,i)=>{let r;return(r=t[n])||(r=t[n]=[]),r.push(i),s=>{r.length>1?r.forEach(o=>o(s)):r[0](s)}};Ya=e("__VUE_INSTANCE_SETTERS__",n=>nn=n),zc=e("__VUE_SSR_SETTERS__",n=>xo=n)}const Oo=t=>{const e=nn;return Ya(t),t.scope.on(),()=>{t.scope.off(),Ya(e)}},ah=()=>{nn&&nn.scope.off(),Ya(null)};function Bm(t){return t.vnode.shapeFlag&4}let xo=!1;function dv(t,e=!1,n=!1){e&&zc(e);const{props:i,children:r}=t.vnode,s=Bm(t);$0(t,i,s,e),K0(t,r,n||e);const o=s?pv(t,e):void 0;return e&&zc(!1),o}function pv(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,L0);const{setup:i}=n;if(i){Pi();const r=t.setupContext=i.length>1?_v(t):null,s=Oo(t),o=Fo(i,t,0,[t.props,r]),a=Up(o);if(Di(),s(),(a||t.sp)&&!oo(t)&&mm(t),a){if(o.then(ah,ah),e)return o.then(l=>{lh(t,l)}).catch(l=>{al(l,t,0)});t.asyncDep=o}else lh(t,o)}else km(t)}function lh(t,e,n){Xe(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:pt(e)&&(t.setupState=im(e)),km(t)}function km(t,e,n){const i=t.type;t.render||(t.render=i.render||ti);{const r=Oo(t);Pi();try{I0(t)}finally{Di(),r()}}}const mv={get(t,e){return $t(t,"get",""),t[e]}};function _v(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,mv),slots:t.slots,emit:t.emit,expose:e}}function fl(t){return t.exposed?t.exposeProxy||(t.exposeProxy=new Proxy(im(r0(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in ao)return ao[n](t)},has(e,n){return n in e||n in ao}})):t.proxy}function gv(t){return Xe(t)&&"__vccOpts"in t}const Ve=(t,e)=>l0(t,e,xo),vv="3.5.31";/**
* @vue/runtime-dom v3.5.31
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Hc;const ch=typeof window<"u"&&window.trustedTypes;if(ch)try{Hc=ch.createPolicy("vue",{createHTML:t=>t})}catch{}const zm=Hc?t=>Hc.createHTML(t):t=>t,xv="http://www.w3.org/2000/svg",yv="http://www.w3.org/1998/Math/MathML",gi=typeof document<"u"?document:null,uh=gi&&gi.createElement("template"),bv={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,i)=>{const r=e==="svg"?gi.createElementNS(xv,t):e==="mathml"?gi.createElementNS(yv,t):n?gi.createElement(t,{is:n}):gi.createElement(t);return t==="select"&&i&&i.multiple!=null&&r.setAttribute("multiple",i.multiple),r},createText:t=>gi.createTextNode(t),createComment:t=>gi.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>gi.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,i,r,s){const o=n?n.previousSibling:e.lastChild;if(r&&(r===s||r.nextSibling))for(;e.insertBefore(r.cloneNode(!0),n),!(r===s||!(r=r.nextSibling)););else{uh.innerHTML=zm(i==="svg"?`<svg>${t}</svg>`:i==="mathml"?`<math>${t}</math>`:t);const a=uh.content;if(i==="svg"||i==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},Sv=Symbol("_vtc");function Mv(t,e,n){const i=t[Sv];i&&(e=(e?[e,...i]:[...i]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const $a=Symbol("_vod"),Hm=Symbol("_vsh"),Il={name:"show",beforeMount(t,{value:e},{transition:n}){t[$a]=t.style.display==="none"?"":t.style.display,n&&e?n.beforeEnter(t):Vs(t,e)},mounted(t,{value:e},{transition:n}){n&&e&&n.enter(t)},updated(t,{value:e,oldValue:n},{transition:i}){!e!=!n&&(i?e?(i.beforeEnter(t),Vs(t,!0),i.enter(t)):i.leave(t,()=>{Vs(t,!1)}):Vs(t,e))},beforeUnmount(t,{value:e}){Vs(t,e)}};function Vs(t,e){t.style.display=e?t[$a]:"none",t[Hm]=!e}const Ev=Symbol(""),wv=/(?:^|;)\s*display\s*:/;function Tv(t,e,n){const i=t.style,r=At(n);let s=!1;if(n&&!r){if(e)if(At(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();n[a]==null&&Ia(i,a,"")}else for(const o in e)n[o]==null&&Ia(i,o,"");for(const o in n)o==="display"&&(s=!0),Ia(i,o,n[o])}else if(r){if(e!==n){const o=i[Ev];o&&(n+=";"+o),i.cssText=n,s=wv.test(n)}}else e&&t.removeAttribute("style");$a in t&&(t[$a]=s?i.display:"",t[Hm]&&(i.display="none"))}const fh=/\s*!important$/;function Ia(t,e,n){if(Be(n))n.forEach(i=>Ia(t,e,i));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const i=Av(t,e);fh.test(n)?t.setProperty(Dr(i),n.replace(fh,""),"important"):t[i]=n}}const hh=["Webkit","Moz","ms"],Ul={};function Av(t,e){const n=Ul[e];if(n)return n;let i=On(e);if(i!=="filter"&&i in t)return Ul[e]=i;i=Op(i);for(let r=0;r<hh.length;r++){const s=hh[r]+i;if(s in t)return Ul[e]=s}return e}const dh="http://www.w3.org/1999/xlink";function ph(t,e,n,i,r,s=Ng(e)){i&&e.startsWith("xlink:")?n==null?t.removeAttributeNS(dh,e.slice(6,e.length)):t.setAttributeNS(dh,e,n):n==null||s&&!kp(n)?t.removeAttribute(e):t.setAttribute(e,s?"":ri(n)?String(n):n)}function mh(t,e,n,i,r){if(e==="innerHTML"||e==="textContent"){n!=null&&(t[e]=e==="innerHTML"?zm(n):n);return}const s=t.tagName;if(e==="value"&&s!=="PROGRESS"&&!s.includes("-")){const a=s==="OPTION"?t.getAttribute("value")||"":t.value,l=n==null?t.type==="checkbox"?"on":"":String(n);(a!==l||!("_value"in t))&&(t.value=l),n==null&&t.removeAttribute(e),t._value=n;return}let o=!1;if(n===""||n==null){const a=typeof t[e];a==="boolean"?n=kp(n):n==null&&a==="string"?(n="",o=!0):a==="number"&&(n=0,o=!0)}try{t[e]=n}catch{}o&&t.removeAttribute(r||e)}function Wi(t,e,n,i){t.addEventListener(e,n,i)}function Rv(t,e,n,i){t.removeEventListener(e,n,i)}const _h=Symbol("_vei");function Cv(t,e,n,i,r=null){const s=t[_h]||(t[_h]={}),o=s[e];if(i&&o)o.value=i;else{const[a,l]=Pv(e);if(i){const c=s[e]=Iv(i,r);Wi(t,a,c,l)}else o&&(Rv(t,a,o,l),s[e]=void 0)}}const gh=/(?:Once|Passive|Capture)$/;function Pv(t){let e;if(gh.test(t)){e={};let i;for(;i=t.match(gh);)t=t.slice(0,t.length-i[0].length),e[i[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):Dr(t.slice(2)),e]}let Nl=0;const Dv=Promise.resolve(),Lv=()=>Nl||(Dv.then(()=>Nl=0),Nl=Date.now());function Iv(t,e){const n=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=n.attached)return;si(Uv(i,n.value),e,5,[i])};return n.value=t,n.attached=Lv(),n}function Uv(t,e){if(Be(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(i=>r=>!r._stopped&&i&&i(r))}else return e}const vh=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,Nv=(t,e,n,i,r,s)=>{const o=r==="svg";e==="class"?Mv(t,i,o):e==="style"?Tv(t,n,i):tl(e)?nl(e)||Cv(t,e,n,i,s):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):Fv(t,e,i,o))?(mh(t,e,i),!t.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&ph(t,e,i,o,s,e!=="value")):t._isVueCE&&(Ov(t,e)||t._def.__asyncLoader&&(/[A-Z]/.test(e)||!At(i)))?mh(t,On(e),i,s,e):(e==="true-value"?t._trueValue=i:e==="false-value"&&(t._falseValue=i),ph(t,e,i,o))};function Fv(t,e,n,i){if(i)return!!(e==="innerHTML"||e==="textContent"||e in t&&vh(e)&&Xe(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&t.tagName==="IFRAME"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const r=t.tagName;if(r==="IMG"||r==="VIDEO"||r==="CANVAS"||r==="SOURCE")return!1}return vh(e)&&At(n)?!1:e in t}function Ov(t,e){const n=t._def.props;if(!n)return!1;const i=On(e);return Array.isArray(n)?n.some(r=>On(r)===i):Object.keys(n).some(r=>On(r)===i)}const _s=t=>{const e=t.props["onUpdate:modelValue"]||!1;return Be(e)?n=>Ca(e,n):e};function Bv(t){t.target.composing=!0}function xh(t){const e=t.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const Ai=Symbol("_assign");function yh(t,e,n){return e&&(t=t.trim()),n&&(t=rl(t)),t}const tn={created(t,{modifiers:{lazy:e,trim:n,number:i}},r){t[Ai]=_s(r);const s=i||r.props&&r.props.type==="number";Wi(t,e?"change":"input",o=>{o.target.composing||t[Ai](yh(t.value,n,s))}),(n||s)&&Wi(t,"change",()=>{t.value=yh(t.value,n,s)}),e||(Wi(t,"compositionstart",Bv),Wi(t,"compositionend",xh),Wi(t,"change",xh))},mounted(t,{value:e}){t.value=e??""},beforeUpdate(t,{value:e,oldValue:n,modifiers:{lazy:i,trim:r,number:s}},o){if(t[Ai]=_s(o),t.composing)return;const a=(s||t.type==="number")&&!/^0\d/.test(t.value)?rl(t.value):t.value,l=e??"";if(a===l)return;const c=t.getRootNode();(c instanceof Document||c instanceof ShadowRoot)&&c.activeElement===t&&t.type!=="range"&&(i&&e===n||r&&t.value.trim()===l)||(t.value=l)}},Fl={deep:!0,created(t,e,n){t[Ai]=_s(n),Wi(t,"change",()=>{const i=t._modelValue,r=yo(t),s=t.checked,o=t[Ai];if(Be(i)){const a=$u(i,r),l=a!==-1;if(s&&!l)o(i.concat(r));else if(!s&&l){const c=[...i];c.splice(a,1),o(c)}}else if(As(i)){const a=new Set(i);s?a.add(r):a.delete(r),o(a)}else o(Vm(t,s))})},mounted:bh,beforeUpdate(t,e,n){t[Ai]=_s(n),bh(t,e,n)}};function bh(t,{value:e,oldValue:n},i){t._modelValue=e;let r;if(Be(e))r=$u(e,i.props.value)>-1;else if(As(e))r=e.has(i.props.value);else{if(e===n)return;r=Rs(e,Vm(t,!0))}t.checked!==r&&(t.checked=r)}const Vc={deep:!0,created(t,{value:e,modifiers:{number:n}},i){const r=As(e);Wi(t,"change",()=>{const s=Array.prototype.filter.call(t.options,o=>o.selected).map(o=>n?rl(yo(o)):yo(o));t[Ai](t.multiple?r?new Set(s):s:s[0]),t._assigning=!0,sm(()=>{t._assigning=!1})}),t[Ai]=_s(i)},mounted(t,{value:e}){Sh(t,e)},beforeUpdate(t,e,n){t[Ai]=_s(n)},updated(t,{value:e}){t._assigning||Sh(t,e)}};function Sh(t,e){const n=t.multiple,i=Be(e);if(!(n&&!i&&!As(e))){for(let r=0,s=t.options.length;r<s;r++){const o=t.options[r],a=yo(o);if(n)if(i){const l=typeof a;l==="string"||l==="number"?o.selected=e.some(c=>String(c)===String(a)):o.selected=$u(e,a)>-1}else o.selected=e.has(a);else if(Rs(yo(o),e)){t.selectedIndex!==r&&(t.selectedIndex=r);return}}!n&&t.selectedIndex!==-1&&(t.selectedIndex=-1)}}function yo(t){return"_value"in t?t._value:t.value}function Vm(t,e){const n=e?"_trueValue":"_falseValue";return n in t?t[n]:e}const kv=["ctrl","shift","alt","meta"],zv={stop:t=>t.stopPropagation(),prevent:t=>t.preventDefault(),self:t=>t.target!==t.currentTarget,ctrl:t=>!t.ctrlKey,shift:t=>!t.shiftKey,alt:t=>!t.altKey,meta:t=>!t.metaKey,left:t=>"button"in t&&t.button!==0,middle:t=>"button"in t&&t.button!==1,right:t=>"button"in t&&t.button!==2,exact:(t,e)=>kv.some(n=>t[`${n}Key`]&&!e.includes(n))},Hv=(t,e)=>{if(!t)return t;const n=t._withMods||(t._withMods={}),i=e.join(".");return n[i]||(n[i]=((r,...s)=>{for(let o=0;o<e.length;o++){const a=zv[e[o]];if(a&&a(r,e))return}return t(r,...s)}))},Vv=Vt({patchProp:Nv},bv);let Mh;function Gv(){return Mh||(Mh=Q0(Vv))}const Wv=((...t)=>{const e=Gv().createApp(...t),{mount:n}=e;return e.mount=i=>{const r=Yv(i);if(!r)return;const s=e._component;!Xe(s)&&!s.render&&!s.template&&(s.template=r.innerHTML),r.nodeType===1&&(r.textContent="");const o=n(r,!1,Xv(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},e});function Xv(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function Yv(t){return At(t)?document.querySelector(t):t}/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */const $v=4,Eh=0,wh=1,jv=2;function Cs(t){let e=t.length;for(;--e>=0;)t[e]=0}const qv=0,Gm=1,Zv=2,Kv=3,Jv=258,hf=29,Bo=256,bo=Bo+1+hf,cs=30,df=19,Wm=2*bo+1,gr=15,Ol=16,Qv=7,pf=256,Xm=16,Ym=17,$m=18,Gc=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),Ua=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),ex=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),jm=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),tx=512,xi=new Array((bo+2)*2);Cs(xi);const co=new Array(cs*2);Cs(co);const So=new Array(tx);Cs(So);const Mo=new Array(Jv-Kv+1);Cs(Mo);const mf=new Array(hf);Cs(mf);const ja=new Array(cs);Cs(ja);function Bl(t,e,n,i,r){this.static_tree=t,this.extra_bits=e,this.extra_base=n,this.elems=i,this.max_length=r,this.has_stree=t&&t.length}let qm,Zm,Km;function kl(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}const Jm=t=>t<256?So[t]:So[256+(t>>>7)],Eo=(t,e)=>{t.pending_buf[t.pending++]=e&255,t.pending_buf[t.pending++]=e>>>8&255},cn=(t,e,n)=>{t.bi_valid>Ol-n?(t.bi_buf|=e<<t.bi_valid&65535,Eo(t,t.bi_buf),t.bi_buf=e>>Ol-t.bi_valid,t.bi_valid+=n-Ol):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=n)},Jn=(t,e,n)=>{cn(t,n[e*2],n[e*2+1])},Qm=(t,e)=>{let n=0;do n|=t&1,t>>>=1,n<<=1;while(--e>0);return n>>>1},nx=t=>{t.bi_valid===16?(Eo(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=t.bi_buf&255,t.bi_buf>>=8,t.bi_valid-=8)},ix=(t,e)=>{const n=e.dyn_tree,i=e.max_code,r=e.stat_desc.static_tree,s=e.stat_desc.has_stree,o=e.stat_desc.extra_bits,a=e.stat_desc.extra_base,l=e.stat_desc.max_length;let c,u,f,h,d,_,g=0;for(h=0;h<=gr;h++)t.bl_count[h]=0;for(n[t.heap[t.heap_max]*2+1]=0,c=t.heap_max+1;c<Wm;c++)u=t.heap[c],h=n[n[u*2+1]*2+1]+1,h>l&&(h=l,g++),n[u*2+1]=h,!(u>i)&&(t.bl_count[h]++,d=0,u>=a&&(d=o[u-a]),_=n[u*2],t.opt_len+=_*(h+d),s&&(t.static_len+=_*(r[u*2+1]+d)));if(g!==0){do{for(h=l-1;t.bl_count[h]===0;)h--;t.bl_count[h]--,t.bl_count[h+1]+=2,t.bl_count[l]--,g-=2}while(g>0);for(h=l;h!==0;h--)for(u=t.bl_count[h];u!==0;)f=t.heap[--c],!(f>i)&&(n[f*2+1]!==h&&(t.opt_len+=(h-n[f*2+1])*n[f*2],n[f*2+1]=h),u--)}},e_=(t,e,n)=>{const i=new Array(gr+1);let r=0,s,o;for(s=1;s<=gr;s++)r=r+n[s-1]<<1,i[s]=r;for(o=0;o<=e;o++){let a=t[o*2+1];a!==0&&(t[o*2]=Qm(i[a]++,a))}},rx=()=>{let t,e,n,i,r;const s=new Array(gr+1);for(n=0,i=0;i<hf-1;i++)for(mf[i]=n,t=0;t<1<<Gc[i];t++)Mo[n++]=i;for(Mo[n-1]=i,r=0,i=0;i<16;i++)for(ja[i]=r,t=0;t<1<<Ua[i];t++)So[r++]=i;for(r>>=7;i<cs;i++)for(ja[i]=r<<7,t=0;t<1<<Ua[i]-7;t++)So[256+r++]=i;for(e=0;e<=gr;e++)s[e]=0;for(t=0;t<=143;)xi[t*2+1]=8,t++,s[8]++;for(;t<=255;)xi[t*2+1]=9,t++,s[9]++;for(;t<=279;)xi[t*2+1]=7,t++,s[7]++;for(;t<=287;)xi[t*2+1]=8,t++,s[8]++;for(e_(xi,bo+1,s),t=0;t<cs;t++)co[t*2+1]=5,co[t*2]=Qm(t,5);qm=new Bl(xi,Gc,Bo+1,bo,gr),Zm=new Bl(co,Ua,0,cs,gr),Km=new Bl(new Array(0),ex,0,df,Qv)},t_=t=>{let e;for(e=0;e<bo;e++)t.dyn_ltree[e*2]=0;for(e=0;e<cs;e++)t.dyn_dtree[e*2]=0;for(e=0;e<df;e++)t.bl_tree[e*2]=0;t.dyn_ltree[pf*2]=1,t.opt_len=t.static_len=0,t.sym_next=t.matches=0},n_=t=>{t.bi_valid>8?Eo(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0},Th=(t,e,n,i)=>{const r=e*2,s=n*2;return t[r]<t[s]||t[r]===t[s]&&i[e]<=i[n]},zl=(t,e,n)=>{const i=t.heap[n];let r=n<<1;for(;r<=t.heap_len&&(r<t.heap_len&&Th(e,t.heap[r+1],t.heap[r],t.depth)&&r++,!Th(e,i,t.heap[r],t.depth));)t.heap[n]=t.heap[r],n=r,r<<=1;t.heap[n]=i},Ah=(t,e,n)=>{let i,r,s=0,o,a;if(t.sym_next!==0)do i=t.pending_buf[t.sym_buf+s++]&255,i+=(t.pending_buf[t.sym_buf+s++]&255)<<8,r=t.pending_buf[t.sym_buf+s++],i===0?Jn(t,r,e):(o=Mo[r],Jn(t,o+Bo+1,e),a=Gc[o],a!==0&&(r-=mf[o],cn(t,r,a)),i--,o=Jm(i),Jn(t,o,n),a=Ua[o],a!==0&&(i-=ja[o],cn(t,i,a)));while(s<t.sym_next);Jn(t,pf,e)},Wc=(t,e)=>{const n=e.dyn_tree,i=e.stat_desc.static_tree,r=e.stat_desc.has_stree,s=e.stat_desc.elems;let o,a,l=-1,c;for(t.heap_len=0,t.heap_max=Wm,o=0;o<s;o++)n[o*2]!==0?(t.heap[++t.heap_len]=l=o,t.depth[o]=0):n[o*2+1]=0;for(;t.heap_len<2;)c=t.heap[++t.heap_len]=l<2?++l:0,n[c*2]=1,t.depth[c]=0,t.opt_len--,r&&(t.static_len-=i[c*2+1]);for(e.max_code=l,o=t.heap_len>>1;o>=1;o--)zl(t,n,o);c=s;do o=t.heap[1],t.heap[1]=t.heap[t.heap_len--],zl(t,n,1),a=t.heap[1],t.heap[--t.heap_max]=o,t.heap[--t.heap_max]=a,n[c*2]=n[o*2]+n[a*2],t.depth[c]=(t.depth[o]>=t.depth[a]?t.depth[o]:t.depth[a])+1,n[o*2+1]=n[a*2+1]=c,t.heap[1]=c++,zl(t,n,1);while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],ix(t,e),e_(n,l,t.bl_count)},Rh=(t,e,n)=>{let i,r=-1,s,o=e[1],a=0,l=7,c=4;for(o===0&&(l=138,c=3),e[(n+1)*2+1]=65535,i=0;i<=n;i++)s=o,o=e[(i+1)*2+1],!(++a<l&&s===o)&&(a<c?t.bl_tree[s*2]+=a:s!==0?(s!==r&&t.bl_tree[s*2]++,t.bl_tree[Xm*2]++):a<=10?t.bl_tree[Ym*2]++:t.bl_tree[$m*2]++,a=0,r=s,o===0?(l=138,c=3):s===o?(l=6,c=3):(l=7,c=4))},Ch=(t,e,n)=>{let i,r=-1,s,o=e[1],a=0,l=7,c=4;for(o===0&&(l=138,c=3),i=0;i<=n;i++)if(s=o,o=e[(i+1)*2+1],!(++a<l&&s===o)){if(a<c)do Jn(t,s,t.bl_tree);while(--a!==0);else s!==0?(s!==r&&(Jn(t,s,t.bl_tree),a--),Jn(t,Xm,t.bl_tree),cn(t,a-3,2)):a<=10?(Jn(t,Ym,t.bl_tree),cn(t,a-3,3)):(Jn(t,$m,t.bl_tree),cn(t,a-11,7));a=0,r=s,o===0?(l=138,c=3):s===o?(l=6,c=3):(l=7,c=4)}},sx=t=>{let e;for(Rh(t,t.dyn_ltree,t.l_desc.max_code),Rh(t,t.dyn_dtree,t.d_desc.max_code),Wc(t,t.bl_desc),e=df-1;e>=3&&t.bl_tree[jm[e]*2+1]===0;e--);return t.opt_len+=3*(e+1)+5+5+4,e},ox=(t,e,n,i)=>{let r;for(cn(t,e-257,5),cn(t,n-1,5),cn(t,i-4,4),r=0;r<i;r++)cn(t,t.bl_tree[jm[r]*2+1],3);Ch(t,t.dyn_ltree,e-1),Ch(t,t.dyn_dtree,n-1)},ax=t=>{let e=4093624447,n;for(n=0;n<=31;n++,e>>>=1)if(e&1&&t.dyn_ltree[n*2]!==0)return Eh;if(t.dyn_ltree[18]!==0||t.dyn_ltree[20]!==0||t.dyn_ltree[26]!==0)return wh;for(n=32;n<Bo;n++)if(t.dyn_ltree[n*2]!==0)return wh;return Eh};let Ph=!1;const lx=t=>{Ph||(rx(),Ph=!0),t.l_desc=new kl(t.dyn_ltree,qm),t.d_desc=new kl(t.dyn_dtree,Zm),t.bl_desc=new kl(t.bl_tree,Km),t.bi_buf=0,t.bi_valid=0,t_(t)},i_=(t,e,n,i)=>{cn(t,(qv<<1)+(i?1:0),3),n_(t),Eo(t,n),Eo(t,~n),n&&t.pending_buf.set(t.window.subarray(e,e+n),t.pending),t.pending+=n},cx=t=>{cn(t,Gm<<1,3),Jn(t,pf,xi),nx(t)},ux=(t,e,n,i)=>{let r,s,o=0;t.level>0?(t.strm.data_type===jv&&(t.strm.data_type=ax(t)),Wc(t,t.l_desc),Wc(t,t.d_desc),o=sx(t),r=t.opt_len+3+7>>>3,s=t.static_len+3+7>>>3,s<=r&&(r=s)):r=s=n+5,n+4<=r&&e!==-1?i_(t,e,n,i):t.strategy===$v||s===r?(cn(t,(Gm<<1)+(i?1:0),3),Ah(t,xi,co)):(cn(t,(Zv<<1)+(i?1:0),3),ox(t,t.l_desc.max_code+1,t.d_desc.max_code+1,o+1),Ah(t,t.dyn_ltree,t.dyn_dtree)),t_(t),i&&n_(t)},fx=(t,e,n)=>(t.pending_buf[t.sym_buf+t.sym_next++]=e,t.pending_buf[t.sym_buf+t.sym_next++]=e>>8,t.pending_buf[t.sym_buf+t.sym_next++]=n,e===0?t.dyn_ltree[n*2]++:(t.matches++,e--,t.dyn_ltree[(Mo[n]+Bo+1)*2]++,t.dyn_dtree[Jm(e)*2]++),t.sym_next===t.sym_end);var hx=lx,dx=i_,px=ux,mx=fx,_x=cx,gx={_tr_init:hx,_tr_stored_block:dx,_tr_flush_block:px,_tr_tally:mx,_tr_align:_x};const vx=(t,e,n,i)=>{let r=t&65535|0,s=t>>>16&65535|0,o=0;for(;n!==0;){o=n>2e3?2e3:n,n-=o;do r=r+e[i++]|0,s=s+r|0;while(--o);r%=65521,s%=65521}return r|s<<16|0};var wo=vx;const xx=()=>{let t,e=[];for(var n=0;n<256;n++){t=n;for(var i=0;i<8;i++)t=t&1?3988292384^t>>>1:t>>>1;e[n]=t}return e},yx=new Uint32Array(xx()),bx=(t,e,n,i)=>{const r=yx,s=i+n;t^=-1;for(let o=i;o<s;o++)t=t>>>8^r[(t^e[o])&255];return t^-1};var Ft=bx,wr={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},ko={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};const{_tr_init:Sx,_tr_stored_block:Xc,_tr_flush_block:Mx,_tr_tally:ji,_tr_align:Ex}=gx,{Z_NO_FLUSH:qi,Z_PARTIAL_FLUSH:wx,Z_FULL_FLUSH:Tx,Z_FINISH:En,Z_BLOCK:Dh,Z_OK:Ht,Z_STREAM_END:Lh,Z_STREAM_ERROR:ni,Z_DATA_ERROR:Ax,Z_BUF_ERROR:Hl,Z_DEFAULT_COMPRESSION:Rx,Z_FILTERED:Cx,Z_HUFFMAN_ONLY:Qo,Z_RLE:Px,Z_FIXED:Dx,Z_DEFAULT_STRATEGY:Lx,Z_UNKNOWN:Ix,Z_DEFLATED:hl}=ko,Ux=9,Nx=15,Fx=8,Ox=29,Bx=256,Yc=Bx+1+Ox,kx=30,zx=19,Hx=2*Yc+1,Vx=15,Ke=3,$i=258,ii=$i+Ke+1,Gx=32,gs=42,_f=57,$c=69,jc=73,qc=91,Zc=103,vr=113,Js=666,rn=1,Ps=2,Tr=3,Ds=4,Wx=3,xr=(t,e)=>(t.msg=wr[e],e),Ih=t=>t*2-(t>4?9:0),Xi=t=>{let e=t.length;for(;--e>=0;)t[e]=0},Xx=t=>{let e,n,i,r=t.w_size;e=t.hash_size,i=e;do n=t.head[--i],t.head[i]=n>=r?n-r:0;while(--e);e=r,i=e;do n=t.prev[--i],t.prev[i]=n>=r?n-r:0;while(--e)};let Yx=(t,e,n)=>(e<<t.hash_shift^n)&t.hash_mask,Zi=Yx;const _n=t=>{const e=t.state;let n=e.pending;n>t.avail_out&&(n=t.avail_out),n!==0&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+n),t.next_out),t.next_out+=n,e.pending_out+=n,t.total_out+=n,t.avail_out-=n,e.pending-=n,e.pending===0&&(e.pending_out=0))},xn=(t,e)=>{Mx(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,_n(t.strm)},nt=(t,e)=>{t.pending_buf[t.pending++]=e},Gs=(t,e)=>{t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=e&255},Kc=(t,e,n,i)=>{let r=t.avail_in;return r>i&&(r=i),r===0?0:(t.avail_in-=r,e.set(t.input.subarray(t.next_in,t.next_in+r),n),t.state.wrap===1?t.adler=wo(t.adler,e,r,n):t.state.wrap===2&&(t.adler=Ft(t.adler,e,r,n)),t.next_in+=r,t.total_in+=r,r)},r_=(t,e)=>{let n=t.max_chain_length,i=t.strstart,r,s,o=t.prev_length,a=t.nice_match;const l=t.strstart>t.w_size-ii?t.strstart-(t.w_size-ii):0,c=t.window,u=t.w_mask,f=t.prev,h=t.strstart+$i;let d=c[i+o-1],_=c[i+o];t.prev_length>=t.good_match&&(n>>=2),a>t.lookahead&&(a=t.lookahead);do if(r=e,!(c[r+o]!==_||c[r+o-1]!==d||c[r]!==c[i]||c[++r]!==c[i+1])){i+=2,r++;do;while(c[++i]===c[++r]&&c[++i]===c[++r]&&c[++i]===c[++r]&&c[++i]===c[++r]&&c[++i]===c[++r]&&c[++i]===c[++r]&&c[++i]===c[++r]&&c[++i]===c[++r]&&i<h);if(s=$i-(h-i),i=h-$i,s>o){if(t.match_start=e,o=s,s>=a)break;d=c[i+o-1],_=c[i+o]}}while((e=f[e&u])>l&&--n!==0);return o<=t.lookahead?o:t.lookahead},vs=t=>{const e=t.w_size;let n,i,r;do{if(i=t.window_size-t.lookahead-t.strstart,t.strstart>=e+(e-ii)&&(t.window.set(t.window.subarray(e,e+e-i),0),t.match_start-=e,t.strstart-=e,t.block_start-=e,t.insert>t.strstart&&(t.insert=t.strstart),Xx(t),i+=e),t.strm.avail_in===0)break;if(n=Kc(t.strm,t.window,t.strstart+t.lookahead,i),t.lookahead+=n,t.lookahead+t.insert>=Ke)for(r=t.strstart-t.insert,t.ins_h=t.window[r],t.ins_h=Zi(t,t.ins_h,t.window[r+1]);t.insert&&(t.ins_h=Zi(t,t.ins_h,t.window[r+Ke-1]),t.prev[r&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=r,r++,t.insert--,!(t.lookahead+t.insert<Ke)););}while(t.lookahead<ii&&t.strm.avail_in!==0)},s_=(t,e)=>{let n=t.pending_buf_size-5>t.w_size?t.w_size:t.pending_buf_size-5,i,r,s,o=0,a=t.strm.avail_in;do{if(i=65535,s=t.bi_valid+42>>3,t.strm.avail_out<s||(s=t.strm.avail_out-s,r=t.strstart-t.block_start,i>r+t.strm.avail_in&&(i=r+t.strm.avail_in),i>s&&(i=s),i<n&&(i===0&&e!==En||e===qi||i!==r+t.strm.avail_in)))break;o=e===En&&i===r+t.strm.avail_in?1:0,Xc(t,0,0,o),t.pending_buf[t.pending-4]=i,t.pending_buf[t.pending-3]=i>>8,t.pending_buf[t.pending-2]=~i,t.pending_buf[t.pending-1]=~i>>8,_n(t.strm),r&&(r>i&&(r=i),t.strm.output.set(t.window.subarray(t.block_start,t.block_start+r),t.strm.next_out),t.strm.next_out+=r,t.strm.avail_out-=r,t.strm.total_out+=r,t.block_start+=r,i-=r),i&&(Kc(t.strm,t.strm.output,t.strm.next_out,i),t.strm.next_out+=i,t.strm.avail_out-=i,t.strm.total_out+=i)}while(o===0);return a-=t.strm.avail_in,a&&(a>=t.w_size?(t.matches=2,t.window.set(t.strm.input.subarray(t.strm.next_in-t.w_size,t.strm.next_in),0),t.strstart=t.w_size,t.insert=t.strstart):(t.window_size-t.strstart<=a&&(t.strstart-=t.w_size,t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,t.insert>t.strstart&&(t.insert=t.strstart)),t.window.set(t.strm.input.subarray(t.strm.next_in-a,t.strm.next_in),t.strstart),t.strstart+=a,t.insert+=a>t.w_size-t.insert?t.w_size-t.insert:a),t.block_start=t.strstart),t.high_water<t.strstart&&(t.high_water=t.strstart),o?Ds:e!==qi&&e!==En&&t.strm.avail_in===0&&t.strstart===t.block_start?Ps:(s=t.window_size-t.strstart,t.strm.avail_in>s&&t.block_start>=t.w_size&&(t.block_start-=t.w_size,t.strstart-=t.w_size,t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,s+=t.w_size,t.insert>t.strstart&&(t.insert=t.strstart)),s>t.strm.avail_in&&(s=t.strm.avail_in),s&&(Kc(t.strm,t.window,t.strstart,s),t.strstart+=s,t.insert+=s>t.w_size-t.insert?t.w_size-t.insert:s),t.high_water<t.strstart&&(t.high_water=t.strstart),s=t.bi_valid+42>>3,s=t.pending_buf_size-s>65535?65535:t.pending_buf_size-s,n=s>t.w_size?t.w_size:s,r=t.strstart-t.block_start,(r>=n||(r||e===En)&&e!==qi&&t.strm.avail_in===0&&r<=s)&&(i=r>s?s:r,o=e===En&&t.strm.avail_in===0&&i===r?1:0,Xc(t,t.block_start,i,o),t.block_start+=i,_n(t.strm)),o?Tr:rn)},Vl=(t,e)=>{let n,i;for(;;){if(t.lookahead<ii){if(vs(t),t.lookahead<ii&&e===qi)return rn;if(t.lookahead===0)break}if(n=0,t.lookahead>=Ke&&(t.ins_h=Zi(t,t.ins_h,t.window[t.strstart+Ke-1]),n=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),n!==0&&t.strstart-n<=t.w_size-ii&&(t.match_length=r_(t,n)),t.match_length>=Ke)if(i=ji(t,t.strstart-t.match_start,t.match_length-Ke),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=Ke){t.match_length--;do t.strstart++,t.ins_h=Zi(t,t.ins_h,t.window[t.strstart+Ke-1]),n=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart;while(--t.match_length!==0);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=Zi(t,t.ins_h,t.window[t.strstart+1]);else i=ji(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(xn(t,!1),t.strm.avail_out===0))return rn}return t.insert=t.strstart<Ke-1?t.strstart:Ke-1,e===En?(xn(t,!0),t.strm.avail_out===0?Tr:Ds):t.sym_next&&(xn(t,!1),t.strm.avail_out===0)?rn:Ps},Or=(t,e)=>{let n,i,r;for(;;){if(t.lookahead<ii){if(vs(t),t.lookahead<ii&&e===qi)return rn;if(t.lookahead===0)break}if(n=0,t.lookahead>=Ke&&(t.ins_h=Zi(t,t.ins_h,t.window[t.strstart+Ke-1]),n=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=Ke-1,n!==0&&t.prev_length<t.max_lazy_match&&t.strstart-n<=t.w_size-ii&&(t.match_length=r_(t,n),t.match_length<=5&&(t.strategy===Cx||t.match_length===Ke&&t.strstart-t.match_start>4096)&&(t.match_length=Ke-1)),t.prev_length>=Ke&&t.match_length<=t.prev_length){r=t.strstart+t.lookahead-Ke,i=ji(t,t.strstart-1-t.prev_match,t.prev_length-Ke),t.lookahead-=t.prev_length-1,t.prev_length-=2;do++t.strstart<=r&&(t.ins_h=Zi(t,t.ins_h,t.window[t.strstart+Ke-1]),n=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart);while(--t.prev_length!==0);if(t.match_available=0,t.match_length=Ke-1,t.strstart++,i&&(xn(t,!1),t.strm.avail_out===0))return rn}else if(t.match_available){if(i=ji(t,0,t.window[t.strstart-1]),i&&xn(t,!1),t.strstart++,t.lookahead--,t.strm.avail_out===0)return rn}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=ji(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<Ke-1?t.strstart:Ke-1,e===En?(xn(t,!0),t.strm.avail_out===0?Tr:Ds):t.sym_next&&(xn(t,!1),t.strm.avail_out===0)?rn:Ps},$x=(t,e)=>{let n,i,r,s;const o=t.window;for(;;){if(t.lookahead<=$i){if(vs(t),t.lookahead<=$i&&e===qi)return rn;if(t.lookahead===0)break}if(t.match_length=0,t.lookahead>=Ke&&t.strstart>0&&(r=t.strstart-1,i=o[r],i===o[++r]&&i===o[++r]&&i===o[++r])){s=t.strstart+$i;do;while(i===o[++r]&&i===o[++r]&&i===o[++r]&&i===o[++r]&&i===o[++r]&&i===o[++r]&&i===o[++r]&&i===o[++r]&&r<s);t.match_length=$i-(s-r),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=Ke?(n=ji(t,1,t.match_length-Ke),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(n=ji(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),n&&(xn(t,!1),t.strm.avail_out===0))return rn}return t.insert=0,e===En?(xn(t,!0),t.strm.avail_out===0?Tr:Ds):t.sym_next&&(xn(t,!1),t.strm.avail_out===0)?rn:Ps},jx=(t,e)=>{let n;for(;;){if(t.lookahead===0&&(vs(t),t.lookahead===0)){if(e===qi)return rn;break}if(t.match_length=0,n=ji(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,n&&(xn(t,!1),t.strm.avail_out===0))return rn}return t.insert=0,e===En?(xn(t,!0),t.strm.avail_out===0?Tr:Ds):t.sym_next&&(xn(t,!1),t.strm.avail_out===0)?rn:Ps};function Wn(t,e,n,i,r){this.good_length=t,this.max_lazy=e,this.nice_length=n,this.max_chain=i,this.func=r}const Qs=[new Wn(0,0,0,0,s_),new Wn(4,4,8,4,Vl),new Wn(4,5,16,8,Vl),new Wn(4,6,32,32,Vl),new Wn(4,4,16,16,Or),new Wn(8,16,32,32,Or),new Wn(8,16,128,128,Or),new Wn(8,32,128,256,Or),new Wn(32,128,258,1024,Or),new Wn(32,258,258,4096,Or)],qx=t=>{t.window_size=2*t.w_size,Xi(t.head),t.max_lazy_match=Qs[t.level].max_lazy,t.good_match=Qs[t.level].good_length,t.nice_match=Qs[t.level].nice_length,t.max_chain_length=Qs[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=Ke-1,t.match_available=0,t.ins_h=0};function Zx(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=hl,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(Hx*2),this.dyn_dtree=new Uint16Array((2*kx+1)*2),this.bl_tree=new Uint16Array((2*zx+1)*2),Xi(this.dyn_ltree),Xi(this.dyn_dtree),Xi(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(Vx+1),this.heap=new Uint16Array(2*Yc+1),Xi(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(2*Yc+1),Xi(this.depth),this.sym_buf=0,this.lit_bufsize=0,this.sym_next=0,this.sym_end=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}const zo=t=>{if(!t)return 1;const e=t.state;return!e||e.strm!==t||e.status!==gs&&e.status!==_f&&e.status!==$c&&e.status!==jc&&e.status!==qc&&e.status!==Zc&&e.status!==vr&&e.status!==Js?1:0},o_=t=>{if(zo(t))return xr(t,ni);t.total_in=t.total_out=0,t.data_type=Ix;const e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap===2?_f:e.wrap?gs:vr,t.adler=e.wrap===2?0:1,e.last_flush=-2,Sx(e),Ht},a_=t=>{const e=o_(t);return e===Ht&&qx(t.state),e},Kx=(t,e)=>zo(t)||t.state.wrap!==2?ni:(t.state.gzhead=e,Ht),l_=(t,e,n,i,r,s)=>{if(!t)return ni;let o=1;if(e===Rx&&(e=6),i<0?(o=0,i=-i):i>15&&(o=2,i-=16),r<1||r>Ux||n!==hl||i<8||i>15||e<0||e>9||s<0||s>Dx||i===8&&o!==1)return xr(t,ni);i===8&&(i=9);const a=new Zx;return t.state=a,a.strm=t,a.status=gs,a.wrap=o,a.gzhead=null,a.w_bits=i,a.w_size=1<<a.w_bits,a.w_mask=a.w_size-1,a.hash_bits=r+7,a.hash_size=1<<a.hash_bits,a.hash_mask=a.hash_size-1,a.hash_shift=~~((a.hash_bits+Ke-1)/Ke),a.window=new Uint8Array(a.w_size*2),a.head=new Uint16Array(a.hash_size),a.prev=new Uint16Array(a.w_size),a.lit_bufsize=1<<r+6,a.pending_buf_size=a.lit_bufsize*4,a.pending_buf=new Uint8Array(a.pending_buf_size),a.sym_buf=a.lit_bufsize,a.sym_end=(a.lit_bufsize-1)*3,a.level=e,a.strategy=s,a.method=n,a_(t)},Jx=(t,e)=>l_(t,e,hl,Nx,Fx,Lx),Qx=(t,e)=>{if(zo(t)||e>Dh||e<0)return t?xr(t,ni):ni;const n=t.state;if(!t.output||t.avail_in!==0&&!t.input||n.status===Js&&e!==En)return xr(t,t.avail_out===0?Hl:ni);const i=n.last_flush;if(n.last_flush=e,n.pending!==0){if(_n(t),t.avail_out===0)return n.last_flush=-1,Ht}else if(t.avail_in===0&&Ih(e)<=Ih(i)&&e!==En)return xr(t,Hl);if(n.status===Js&&t.avail_in!==0)return xr(t,Hl);if(n.status===gs&&n.wrap===0&&(n.status=vr),n.status===gs){let r=hl+(n.w_bits-8<<4)<<8,s=-1;if(n.strategy>=Qo||n.level<2?s=0:n.level<6?s=1:n.level===6?s=2:s=3,r|=s<<6,n.strstart!==0&&(r|=Gx),r+=31-r%31,Gs(n,r),n.strstart!==0&&(Gs(n,t.adler>>>16),Gs(n,t.adler&65535)),t.adler=1,n.status=vr,_n(t),n.pending!==0)return n.last_flush=-1,Ht}if(n.status===_f){if(t.adler=0,nt(n,31),nt(n,139),nt(n,8),n.gzhead)nt(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),nt(n,n.gzhead.time&255),nt(n,n.gzhead.time>>8&255),nt(n,n.gzhead.time>>16&255),nt(n,n.gzhead.time>>24&255),nt(n,n.level===9?2:n.strategy>=Qo||n.level<2?4:0),nt(n,n.gzhead.os&255),n.gzhead.extra&&n.gzhead.extra.length&&(nt(n,n.gzhead.extra.length&255),nt(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(t.adler=Ft(t.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=$c;else if(nt(n,0),nt(n,0),nt(n,0),nt(n,0),nt(n,0),nt(n,n.level===9?2:n.strategy>=Qo||n.level<2?4:0),nt(n,Wx),n.status=vr,_n(t),n.pending!==0)return n.last_flush=-1,Ht}if(n.status===$c){if(n.gzhead.extra){let r=n.pending,s=(n.gzhead.extra.length&65535)-n.gzindex;for(;n.pending+s>n.pending_buf_size;){let a=n.pending_buf_size-n.pending;if(n.pending_buf.set(n.gzhead.extra.subarray(n.gzindex,n.gzindex+a),n.pending),n.pending=n.pending_buf_size,n.gzhead.hcrc&&n.pending>r&&(t.adler=Ft(t.adler,n.pending_buf,n.pending-r,r)),n.gzindex+=a,_n(t),n.pending!==0)return n.last_flush=-1,Ht;r=0,s-=a}let o=new Uint8Array(n.gzhead.extra);n.pending_buf.set(o.subarray(n.gzindex,n.gzindex+s),n.pending),n.pending+=s,n.gzhead.hcrc&&n.pending>r&&(t.adler=Ft(t.adler,n.pending_buf,n.pending-r,r)),n.gzindex=0}n.status=jc}if(n.status===jc){if(n.gzhead.name){let r=n.pending,s;do{if(n.pending===n.pending_buf_size){if(n.gzhead.hcrc&&n.pending>r&&(t.adler=Ft(t.adler,n.pending_buf,n.pending-r,r)),_n(t),n.pending!==0)return n.last_flush=-1,Ht;r=0}n.gzindex<n.gzhead.name.length?s=n.gzhead.name.charCodeAt(n.gzindex++)&255:s=0,nt(n,s)}while(s!==0);n.gzhead.hcrc&&n.pending>r&&(t.adler=Ft(t.adler,n.pending_buf,n.pending-r,r)),n.gzindex=0}n.status=qc}if(n.status===qc){if(n.gzhead.comment){let r=n.pending,s;do{if(n.pending===n.pending_buf_size){if(n.gzhead.hcrc&&n.pending>r&&(t.adler=Ft(t.adler,n.pending_buf,n.pending-r,r)),_n(t),n.pending!==0)return n.last_flush=-1,Ht;r=0}n.gzindex<n.gzhead.comment.length?s=n.gzhead.comment.charCodeAt(n.gzindex++)&255:s=0,nt(n,s)}while(s!==0);n.gzhead.hcrc&&n.pending>r&&(t.adler=Ft(t.adler,n.pending_buf,n.pending-r,r))}n.status=Zc}if(n.status===Zc){if(n.gzhead.hcrc){if(n.pending+2>n.pending_buf_size&&(_n(t),n.pending!==0))return n.last_flush=-1,Ht;nt(n,t.adler&255),nt(n,t.adler>>8&255),t.adler=0}if(n.status=vr,_n(t),n.pending!==0)return n.last_flush=-1,Ht}if(t.avail_in!==0||n.lookahead!==0||e!==qi&&n.status!==Js){let r=n.level===0?s_(n,e):n.strategy===Qo?jx(n,e):n.strategy===Px?$x(n,e):Qs[n.level].func(n,e);if((r===Tr||r===Ds)&&(n.status=Js),r===rn||r===Tr)return t.avail_out===0&&(n.last_flush=-1),Ht;if(r===Ps&&(e===wx?Ex(n):e!==Dh&&(Xc(n,0,0,!1),e===Tx&&(Xi(n.head),n.lookahead===0&&(n.strstart=0,n.block_start=0,n.insert=0))),_n(t),t.avail_out===0))return n.last_flush=-1,Ht}return e!==En?Ht:n.wrap<=0?Lh:(n.wrap===2?(nt(n,t.adler&255),nt(n,t.adler>>8&255),nt(n,t.adler>>16&255),nt(n,t.adler>>24&255),nt(n,t.total_in&255),nt(n,t.total_in>>8&255),nt(n,t.total_in>>16&255),nt(n,t.total_in>>24&255)):(Gs(n,t.adler>>>16),Gs(n,t.adler&65535)),_n(t),n.wrap>0&&(n.wrap=-n.wrap),n.pending!==0?Ht:Lh)},ey=t=>{if(zo(t))return ni;const e=t.state.status;return t.state=null,e===vr?xr(t,Ax):Ht},ty=(t,e)=>{let n=e.length;if(zo(t))return ni;const i=t.state,r=i.wrap;if(r===2||r===1&&i.status!==gs||i.lookahead)return ni;if(r===1&&(t.adler=wo(t.adler,e,n,0)),i.wrap=0,n>=i.w_size){r===0&&(Xi(i.head),i.strstart=0,i.block_start=0,i.insert=0);let l=new Uint8Array(i.w_size);l.set(e.subarray(n-i.w_size,n),0),e=l,n=i.w_size}const s=t.avail_in,o=t.next_in,a=t.input;for(t.avail_in=n,t.next_in=0,t.input=e,vs(i);i.lookahead>=Ke;){let l=i.strstart,c=i.lookahead-(Ke-1);do i.ins_h=Zi(i,i.ins_h,i.window[l+Ke-1]),i.prev[l&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=l,l++;while(--c);i.strstart=l,i.lookahead=Ke-1,vs(i)}return i.strstart+=i.lookahead,i.block_start=i.strstart,i.insert=i.lookahead,i.lookahead=0,i.match_length=i.prev_length=Ke-1,i.match_available=0,t.next_in=o,t.input=a,t.avail_in=s,i.wrap=r,Ht};var ny=Jx,iy=l_,ry=a_,sy=o_,oy=Kx,ay=Qx,ly=ey,cy=ty,uy="pako deflate (from Nodeca project)",uo={deflateInit:ny,deflateInit2:iy,deflateReset:ry,deflateResetKeep:sy,deflateSetHeader:oy,deflate:ay,deflateEnd:ly,deflateSetDictionary:cy,deflateInfo:uy};const fy=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var hy=function(t){const e=Array.prototype.slice.call(arguments,1);for(;e.length;){const n=e.shift();if(n){if(typeof n!="object")throw new TypeError(n+"must be non-object");for(const i in n)fy(n,i)&&(t[i]=n[i])}}return t},dy=t=>{let e=0;for(let i=0,r=t.length;i<r;i++)e+=t[i].length;const n=new Uint8Array(e);for(let i=0,r=0,s=t.length;i<s;i++){let o=t[i];n.set(o,r),r+=o.length}return n},dl={assign:hy,flattenChunks:dy};let c_=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{c_=!1}const To=new Uint8Array(256);for(let t=0;t<256;t++)To[t]=t>=252?6:t>=248?5:t>=240?4:t>=224?3:t>=192?2:1;To[254]=To[254]=1;var py=t=>{if(typeof TextEncoder=="function"&&TextEncoder.prototype.encode)return new TextEncoder().encode(t);let e,n,i,r,s,o=t.length,a=0;for(r=0;r<o;r++)n=t.charCodeAt(r),(n&64512)===55296&&r+1<o&&(i=t.charCodeAt(r+1),(i&64512)===56320&&(n=65536+(n-55296<<10)+(i-56320),r++)),a+=n<128?1:n<2048?2:n<65536?3:4;for(e=new Uint8Array(a),s=0,r=0;s<a;r++)n=t.charCodeAt(r),(n&64512)===55296&&r+1<o&&(i=t.charCodeAt(r+1),(i&64512)===56320&&(n=65536+(n-55296<<10)+(i-56320),r++)),n<128?e[s++]=n:n<2048?(e[s++]=192|n>>>6,e[s++]=128|n&63):n<65536?(e[s++]=224|n>>>12,e[s++]=128|n>>>6&63,e[s++]=128|n&63):(e[s++]=240|n>>>18,e[s++]=128|n>>>12&63,e[s++]=128|n>>>6&63,e[s++]=128|n&63);return e};const my=(t,e)=>{if(e<65534&&t.subarray&&c_)return String.fromCharCode.apply(null,t.length===e?t:t.subarray(0,e));let n="";for(let i=0;i<e;i++)n+=String.fromCharCode(t[i]);return n};var _y=(t,e)=>{const n=e||t.length;if(typeof TextDecoder=="function"&&TextDecoder.prototype.decode)return new TextDecoder().decode(t.subarray(0,e));let i,r;const s=new Array(n*2);for(r=0,i=0;i<n;){let o=t[i++];if(o<128){s[r++]=o;continue}let a=To[o];if(a>4){s[r++]=65533,i+=a-1;continue}for(o&=a===2?31:a===3?15:7;a>1&&i<n;)o=o<<6|t[i++]&63,a--;if(a>1){s[r++]=65533;continue}o<65536?s[r++]=o:(o-=65536,s[r++]=55296|o>>10&1023,s[r++]=56320|o&1023)}return my(s,r)},gy=(t,e)=>{e=e||t.length,e>t.length&&(e=t.length);let n=e-1;for(;n>=0&&(t[n]&192)===128;)n--;return n<0||n===0?e:n+To[t[n]]>e?n:e},Ao={string2buf:py,buf2string:_y,utf8border:gy};function vy(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}var u_=vy;const f_=Object.prototype.toString,{Z_NO_FLUSH:xy,Z_SYNC_FLUSH:yy,Z_FULL_FLUSH:by,Z_FINISH:Sy,Z_OK:qa,Z_STREAM_END:My,Z_DEFAULT_COMPRESSION:Ey,Z_DEFAULT_STRATEGY:wy,Z_DEFLATED:Ty}=ko;function Ho(t){this.options=dl.assign({level:Ey,method:Ty,chunkSize:16384,windowBits:15,memLevel:8,strategy:wy},t||{});let e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new u_,this.strm.avail_out=0;let n=uo.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(n!==qa)throw new Error(wr[n]);if(e.header&&uo.deflateSetHeader(this.strm,e.header),e.dictionary){let i;if(typeof e.dictionary=="string"?i=Ao.string2buf(e.dictionary):f_.call(e.dictionary)==="[object ArrayBuffer]"?i=new Uint8Array(e.dictionary):i=e.dictionary,n=uo.deflateSetDictionary(this.strm,i),n!==qa)throw new Error(wr[n]);this._dict_set=!0}}Ho.prototype.push=function(t,e){const n=this.strm,i=this.options.chunkSize;let r,s;if(this.ended)return!1;for(e===~~e?s=e:s=e===!0?Sy:xy,typeof t=="string"?n.input=Ao.string2buf(t):f_.call(t)==="[object ArrayBuffer]"?n.input=new Uint8Array(t):n.input=t,n.next_in=0,n.avail_in=n.input.length;;){if(n.avail_out===0&&(n.output=new Uint8Array(i),n.next_out=0,n.avail_out=i),(s===yy||s===by)&&n.avail_out<=6){this.onData(n.output.subarray(0,n.next_out)),n.avail_out=0;continue}if(r=uo.deflate(n,s),r===My)return n.next_out>0&&this.onData(n.output.subarray(0,n.next_out)),r=uo.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===qa;if(n.avail_out===0){this.onData(n.output);continue}if(s>0&&n.next_out>0){this.onData(n.output.subarray(0,n.next_out)),n.avail_out=0;continue}if(n.avail_in===0)break}return!0};Ho.prototype.onData=function(t){this.chunks.push(t)};Ho.prototype.onEnd=function(t){t===qa&&(this.result=dl.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};function gf(t,e){const n=new Ho(e);if(n.push(t,!0),n.err)throw n.msg||wr[n.err];return n.result}function Ay(t,e){return e=e||{},e.raw=!0,gf(t,e)}function Ry(t,e){return e=e||{},e.gzip=!0,gf(t,e)}var Cy=Ho,Py=gf,Dy=Ay,Ly=Ry,Iy={Deflate:Cy,deflate:Py,deflateRaw:Dy,gzip:Ly};const ea=16209,Uy=16191;var Ny=function(e,n){let i,r,s,o,a,l,c,u,f,h,d,_,g,m,p,T,R,y,P,L,M,A,v,x;const C=e.state;i=e.next_in,v=e.input,r=i+(e.avail_in-5),s=e.next_out,x=e.output,o=s-(n-e.avail_out),a=s+(e.avail_out-257),l=C.dmax,c=C.wsize,u=C.whave,f=C.wnext,h=C.window,d=C.hold,_=C.bits,g=C.lencode,m=C.distcode,p=(1<<C.lenbits)-1,T=(1<<C.distbits)-1;e:do{_<15&&(d+=v[i++]<<_,_+=8,d+=v[i++]<<_,_+=8),R=g[d&p];t:for(;;){if(y=R>>>24,d>>>=y,_-=y,y=R>>>16&255,y===0)x[s++]=R&65535;else if(y&16){P=R&65535,y&=15,y&&(_<y&&(d+=v[i++]<<_,_+=8),P+=d&(1<<y)-1,d>>>=y,_-=y),_<15&&(d+=v[i++]<<_,_+=8,d+=v[i++]<<_,_+=8),R=m[d&T];n:for(;;){if(y=R>>>24,d>>>=y,_-=y,y=R>>>16&255,y&16){if(L=R&65535,y&=15,_<y&&(d+=v[i++]<<_,_+=8,_<y&&(d+=v[i++]<<_,_+=8)),L+=d&(1<<y)-1,L>l){e.msg="invalid distance too far back",C.mode=ea;break e}if(d>>>=y,_-=y,y=s-o,L>y){if(y=L-y,y>u&&C.sane){e.msg="invalid distance too far back",C.mode=ea;break e}if(M=0,A=h,f===0){if(M+=c-y,y<P){P-=y;do x[s++]=h[M++];while(--y);M=s-L,A=x}}else if(f<y){if(M+=c+f-y,y-=f,y<P){P-=y;do x[s++]=h[M++];while(--y);if(M=0,f<P){y=f,P-=y;do x[s++]=h[M++];while(--y);M=s-L,A=x}}}else if(M+=f-y,y<P){P-=y;do x[s++]=h[M++];while(--y);M=s-L,A=x}for(;P>2;)x[s++]=A[M++],x[s++]=A[M++],x[s++]=A[M++],P-=3;P&&(x[s++]=A[M++],P>1&&(x[s++]=A[M++]))}else{M=s-L;do x[s++]=x[M++],x[s++]=x[M++],x[s++]=x[M++],P-=3;while(P>2);P&&(x[s++]=x[M++],P>1&&(x[s++]=x[M++]))}}else if((y&64)===0){R=m[(R&65535)+(d&(1<<y)-1)];continue n}else{e.msg="invalid distance code",C.mode=ea;break e}break}}else if((y&64)===0){R=g[(R&65535)+(d&(1<<y)-1)];continue t}else if(y&32){C.mode=Uy;break e}else{e.msg="invalid literal/length code",C.mode=ea;break e}break}}while(i<r&&s<a);P=_>>3,i-=P,_-=P<<3,d&=(1<<_)-1,e.next_in=i,e.next_out=s,e.avail_in=i<r?5+(r-i):5-(i-r),e.avail_out=s<a?257+(a-s):257-(s-a),C.hold=d,C.bits=_};const Br=15,Uh=852,Nh=592,Fh=0,Gl=1,Oh=2,Fy=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),Oy=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),By=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),ky=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]),zy=(t,e,n,i,r,s,o,a)=>{const l=a.bits;let c=0,u=0,f=0,h=0,d=0,_=0,g=0,m=0,p=0,T=0,R,y,P,L,M,A=null,v;const x=new Uint16Array(Br+1),C=new Uint16Array(Br+1);let G=null,V,Z,ee;for(c=0;c<=Br;c++)x[c]=0;for(u=0;u<i;u++)x[e[n+u]]++;for(d=l,h=Br;h>=1&&x[h]===0;h--);if(d>h&&(d=h),h===0)return r[s++]=1<<24|64<<16|0,r[s++]=1<<24|64<<16|0,a.bits=1,0;for(f=1;f<h&&x[f]===0;f++);for(d<f&&(d=f),m=1,c=1;c<=Br;c++)if(m<<=1,m-=x[c],m<0)return-1;if(m>0&&(t===Fh||h!==1))return-1;for(C[1]=0,c=1;c<Br;c++)C[c+1]=C[c]+x[c];for(u=0;u<i;u++)e[n+u]!==0&&(o[C[e[n+u]]++]=u);if(t===Fh?(A=G=o,v=20):t===Gl?(A=Fy,G=Oy,v=257):(A=By,G=ky,v=0),T=0,u=0,c=f,M=s,_=d,g=0,P=-1,p=1<<d,L=p-1,t===Gl&&p>Uh||t===Oh&&p>Nh)return 1;for(;;){V=c-g,o[u]+1<v?(Z=0,ee=o[u]):o[u]>=v?(Z=G[o[u]-v],ee=A[o[u]-v]):(Z=96,ee=0),R=1<<c-g,y=1<<_,f=y;do y-=R,r[M+(T>>g)+y]=V<<24|Z<<16|ee|0;while(y!==0);for(R=1<<c-1;T&R;)R>>=1;if(R!==0?(T&=R-1,T+=R):T=0,u++,--x[c]===0){if(c===h)break;c=e[n+o[u]]}if(c>d&&(T&L)!==P){for(g===0&&(g=d),M+=f,_=c-g,m=1<<_;_+g<h&&(m-=x[_+g],!(m<=0));)_++,m<<=1;if(p+=1<<_,t===Gl&&p>Uh||t===Oh&&p>Nh)return 1;P=T&L,r[P]=d<<24|_<<16|M-s|0}}return T!==0&&(r[M+T]=c-g<<24|64<<16|0),a.bits=d,0};var fo=zy;const Hy=0,h_=1,d_=2,{Z_FINISH:Bh,Z_BLOCK:Vy,Z_TREES:ta,Z_OK:Ar,Z_STREAM_END:Gy,Z_NEED_DICT:Wy,Z_STREAM_ERROR:Rn,Z_DATA_ERROR:p_,Z_MEM_ERROR:m_,Z_BUF_ERROR:Xy,Z_DEFLATED:kh}=ko,pl=16180,zh=16181,Hh=16182,Vh=16183,Gh=16184,Wh=16185,Xh=16186,Yh=16187,$h=16188,jh=16189,Za=16190,ui=16191,Wl=16192,qh=16193,Xl=16194,Zh=16195,Kh=16196,Jh=16197,Qh=16198,na=16199,ia=16200,ed=16201,td=16202,nd=16203,id=16204,rd=16205,Yl=16206,sd=16207,od=16208,xt=16209,__=16210,g_=16211,Yy=852,$y=592,jy=15,qy=jy,ad=t=>(t>>>24&255)+(t>>>8&65280)+((t&65280)<<8)+((t&255)<<24);function Zy(){this.strm=null,this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}const Ir=t=>{if(!t)return 1;const e=t.state;return!e||e.strm!==t||e.mode<pl||e.mode>g_?1:0},v_=t=>{if(Ir(t))return Rn;const e=t.state;return t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=e.wrap&1),e.mode=pl,e.last=0,e.havedict=0,e.flags=-1,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new Int32Array(Yy),e.distcode=e.distdyn=new Int32Array($y),e.sane=1,e.back=-1,Ar},x_=t=>{if(Ir(t))return Rn;const e=t.state;return e.wsize=0,e.whave=0,e.wnext=0,v_(t)},y_=(t,e)=>{let n;if(Ir(t))return Rn;const i=t.state;return e<0?(n=0,e=-e):(n=(e>>4)+5,e<48&&(e&=15)),e&&(e<8||e>15)?Rn:(i.window!==null&&i.wbits!==e&&(i.window=null),i.wrap=n,i.wbits=e,x_(t))},b_=(t,e)=>{if(!t)return Rn;const n=new Zy;t.state=n,n.strm=t,n.window=null,n.mode=pl;const i=y_(t,e);return i!==Ar&&(t.state=null),i},Ky=t=>b_(t,qy);let ld=!0,$l,jl;const Jy=t=>{if(ld){$l=new Int32Array(512),jl=new Int32Array(32);let e=0;for(;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(fo(h_,t.lens,0,288,$l,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;fo(d_,t.lens,0,32,jl,0,t.work,{bits:5}),ld=!1}t.lencode=$l,t.lenbits=9,t.distcode=jl,t.distbits=5},S_=(t,e,n,i)=>{let r;const s=t.state;return s.window===null&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new Uint8Array(s.wsize)),i>=s.wsize?(s.window.set(e.subarray(n-s.wsize,n),0),s.wnext=0,s.whave=s.wsize):(r=s.wsize-s.wnext,r>i&&(r=i),s.window.set(e.subarray(n-i,n-i+r),s.wnext),i-=r,i?(s.window.set(e.subarray(n-i,n),0),s.wnext=i,s.whave=s.wsize):(s.wnext+=r,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=r))),0},Qy=(t,e)=>{let n,i,r,s,o,a,l,c,u,f,h,d,_,g,m=0,p,T,R,y,P,L,M,A;const v=new Uint8Array(4);let x,C;const G=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(Ir(t)||!t.output||!t.input&&t.avail_in!==0)return Rn;n=t.state,n.mode===ui&&(n.mode=Wl),o=t.next_out,r=t.output,l=t.avail_out,s=t.next_in,i=t.input,a=t.avail_in,c=n.hold,u=n.bits,f=a,h=l,A=Ar;e:for(;;)switch(n.mode){case pl:if(n.wrap===0){n.mode=Wl;break}for(;u<16;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}if(n.wrap&2&&c===35615){n.wbits===0&&(n.wbits=15),n.check=0,v[0]=c&255,v[1]=c>>>8&255,n.check=Ft(n.check,v,2,0),c=0,u=0,n.mode=zh;break}if(n.head&&(n.head.done=!1),!(n.wrap&1)||(((c&255)<<8)+(c>>8))%31){t.msg="incorrect header check",n.mode=xt;break}if((c&15)!==kh){t.msg="unknown compression method",n.mode=xt;break}if(c>>>=4,u-=4,M=(c&15)+8,n.wbits===0&&(n.wbits=M),M>15||M>n.wbits){t.msg="invalid window size",n.mode=xt;break}n.dmax=1<<n.wbits,n.flags=0,t.adler=n.check=1,n.mode=c&512?jh:ui,c=0,u=0;break;case zh:for(;u<16;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}if(n.flags=c,(n.flags&255)!==kh){t.msg="unknown compression method",n.mode=xt;break}if(n.flags&57344){t.msg="unknown header flags set",n.mode=xt;break}n.head&&(n.head.text=c>>8&1),n.flags&512&&n.wrap&4&&(v[0]=c&255,v[1]=c>>>8&255,n.check=Ft(n.check,v,2,0)),c=0,u=0,n.mode=Hh;case Hh:for(;u<32;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}n.head&&(n.head.time=c),n.flags&512&&n.wrap&4&&(v[0]=c&255,v[1]=c>>>8&255,v[2]=c>>>16&255,v[3]=c>>>24&255,n.check=Ft(n.check,v,4,0)),c=0,u=0,n.mode=Vh;case Vh:for(;u<16;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}n.head&&(n.head.xflags=c&255,n.head.os=c>>8),n.flags&512&&n.wrap&4&&(v[0]=c&255,v[1]=c>>>8&255,n.check=Ft(n.check,v,2,0)),c=0,u=0,n.mode=Gh;case Gh:if(n.flags&1024){for(;u<16;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}n.length=c,n.head&&(n.head.extra_len=c),n.flags&512&&n.wrap&4&&(v[0]=c&255,v[1]=c>>>8&255,n.check=Ft(n.check,v,2,0)),c=0,u=0}else n.head&&(n.head.extra=null);n.mode=Wh;case Wh:if(n.flags&1024&&(d=n.length,d>a&&(d=a),d&&(n.head&&(M=n.head.extra_len-n.length,n.head.extra||(n.head.extra=new Uint8Array(n.head.extra_len)),n.head.extra.set(i.subarray(s,s+d),M)),n.flags&512&&n.wrap&4&&(n.check=Ft(n.check,i,d,s)),a-=d,s+=d,n.length-=d),n.length))break e;n.length=0,n.mode=Xh;case Xh:if(n.flags&2048){if(a===0)break e;d=0;do M=i[s+d++],n.head&&M&&n.length<65536&&(n.head.name+=String.fromCharCode(M));while(M&&d<a);if(n.flags&512&&n.wrap&4&&(n.check=Ft(n.check,i,d,s)),a-=d,s+=d,M)break e}else n.head&&(n.head.name=null);n.length=0,n.mode=Yh;case Yh:if(n.flags&4096){if(a===0)break e;d=0;do M=i[s+d++],n.head&&M&&n.length<65536&&(n.head.comment+=String.fromCharCode(M));while(M&&d<a);if(n.flags&512&&n.wrap&4&&(n.check=Ft(n.check,i,d,s)),a-=d,s+=d,M)break e}else n.head&&(n.head.comment=null);n.mode=$h;case $h:if(n.flags&512){for(;u<16;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}if(n.wrap&4&&c!==(n.check&65535)){t.msg="header crc mismatch",n.mode=xt;break}c=0,u=0}n.head&&(n.head.hcrc=n.flags>>9&1,n.head.done=!0),t.adler=n.check=0,n.mode=ui;break;case jh:for(;u<32;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}t.adler=n.check=ad(c),c=0,u=0,n.mode=Za;case Za:if(n.havedict===0)return t.next_out=o,t.avail_out=l,t.next_in=s,t.avail_in=a,n.hold=c,n.bits=u,Wy;t.adler=n.check=1,n.mode=ui;case ui:if(e===Vy||e===ta)break e;case Wl:if(n.last){c>>>=u&7,u-=u&7,n.mode=Yl;break}for(;u<3;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}switch(n.last=c&1,c>>>=1,u-=1,c&3){case 0:n.mode=qh;break;case 1:if(Jy(n),n.mode=na,e===ta){c>>>=2,u-=2;break e}break;case 2:n.mode=Kh;break;case 3:t.msg="invalid block type",n.mode=xt}c>>>=2,u-=2;break;case qh:for(c>>>=u&7,u-=u&7;u<32;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}if((c&65535)!==(c>>>16^65535)){t.msg="invalid stored block lengths",n.mode=xt;break}if(n.length=c&65535,c=0,u=0,n.mode=Xl,e===ta)break e;case Xl:n.mode=Zh;case Zh:if(d=n.length,d){if(d>a&&(d=a),d>l&&(d=l),d===0)break e;r.set(i.subarray(s,s+d),o),a-=d,s+=d,l-=d,o+=d,n.length-=d;break}n.mode=ui;break;case Kh:for(;u<14;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}if(n.nlen=(c&31)+257,c>>>=5,u-=5,n.ndist=(c&31)+1,c>>>=5,u-=5,n.ncode=(c&15)+4,c>>>=4,u-=4,n.nlen>286||n.ndist>30){t.msg="too many length or distance symbols",n.mode=xt;break}n.have=0,n.mode=Jh;case Jh:for(;n.have<n.ncode;){for(;u<3;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}n.lens[G[n.have++]]=c&7,c>>>=3,u-=3}for(;n.have<19;)n.lens[G[n.have++]]=0;if(n.lencode=n.lendyn,n.lenbits=7,x={bits:n.lenbits},A=fo(Hy,n.lens,0,19,n.lencode,0,n.work,x),n.lenbits=x.bits,A){t.msg="invalid code lengths set",n.mode=xt;break}n.have=0,n.mode=Qh;case Qh:for(;n.have<n.nlen+n.ndist;){for(;m=n.lencode[c&(1<<n.lenbits)-1],p=m>>>24,T=m>>>16&255,R=m&65535,!(p<=u);){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}if(R<16)c>>>=p,u-=p,n.lens[n.have++]=R;else{if(R===16){for(C=p+2;u<C;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}if(c>>>=p,u-=p,n.have===0){t.msg="invalid bit length repeat",n.mode=xt;break}M=n.lens[n.have-1],d=3+(c&3),c>>>=2,u-=2}else if(R===17){for(C=p+3;u<C;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}c>>>=p,u-=p,M=0,d=3+(c&7),c>>>=3,u-=3}else{for(C=p+7;u<C;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}c>>>=p,u-=p,M=0,d=11+(c&127),c>>>=7,u-=7}if(n.have+d>n.nlen+n.ndist){t.msg="invalid bit length repeat",n.mode=xt;break}for(;d--;)n.lens[n.have++]=M}}if(n.mode===xt)break;if(n.lens[256]===0){t.msg="invalid code -- missing end-of-block",n.mode=xt;break}if(n.lenbits=9,x={bits:n.lenbits},A=fo(h_,n.lens,0,n.nlen,n.lencode,0,n.work,x),n.lenbits=x.bits,A){t.msg="invalid literal/lengths set",n.mode=xt;break}if(n.distbits=6,n.distcode=n.distdyn,x={bits:n.distbits},A=fo(d_,n.lens,n.nlen,n.ndist,n.distcode,0,n.work,x),n.distbits=x.bits,A){t.msg="invalid distances set",n.mode=xt;break}if(n.mode=na,e===ta)break e;case na:n.mode=ia;case ia:if(a>=6&&l>=258){t.next_out=o,t.avail_out=l,t.next_in=s,t.avail_in=a,n.hold=c,n.bits=u,Ny(t,h),o=t.next_out,r=t.output,l=t.avail_out,s=t.next_in,i=t.input,a=t.avail_in,c=n.hold,u=n.bits,n.mode===ui&&(n.back=-1);break}for(n.back=0;m=n.lencode[c&(1<<n.lenbits)-1],p=m>>>24,T=m>>>16&255,R=m&65535,!(p<=u);){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}if(T&&(T&240)===0){for(y=p,P=T,L=R;m=n.lencode[L+((c&(1<<y+P)-1)>>y)],p=m>>>24,T=m>>>16&255,R=m&65535,!(y+p<=u);){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}c>>>=y,u-=y,n.back+=y}if(c>>>=p,u-=p,n.back+=p,n.length=R,T===0){n.mode=rd;break}if(T&32){n.back=-1,n.mode=ui;break}if(T&64){t.msg="invalid literal/length code",n.mode=xt;break}n.extra=T&15,n.mode=ed;case ed:if(n.extra){for(C=n.extra;u<C;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}n.length+=c&(1<<n.extra)-1,c>>>=n.extra,u-=n.extra,n.back+=n.extra}n.was=n.length,n.mode=td;case td:for(;m=n.distcode[c&(1<<n.distbits)-1],p=m>>>24,T=m>>>16&255,R=m&65535,!(p<=u);){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}if((T&240)===0){for(y=p,P=T,L=R;m=n.distcode[L+((c&(1<<y+P)-1)>>y)],p=m>>>24,T=m>>>16&255,R=m&65535,!(y+p<=u);){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}c>>>=y,u-=y,n.back+=y}if(c>>>=p,u-=p,n.back+=p,T&64){t.msg="invalid distance code",n.mode=xt;break}n.offset=R,n.extra=T&15,n.mode=nd;case nd:if(n.extra){for(C=n.extra;u<C;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}n.offset+=c&(1<<n.extra)-1,c>>>=n.extra,u-=n.extra,n.back+=n.extra}if(n.offset>n.dmax){t.msg="invalid distance too far back",n.mode=xt;break}n.mode=id;case id:if(l===0)break e;if(d=h-l,n.offset>d){if(d=n.offset-d,d>n.whave&&n.sane){t.msg="invalid distance too far back",n.mode=xt;break}d>n.wnext?(d-=n.wnext,_=n.wsize-d):_=n.wnext-d,d>n.length&&(d=n.length),g=n.window}else g=r,_=o-n.offset,d=n.length;d>l&&(d=l),l-=d,n.length-=d;do r[o++]=g[_++];while(--d);n.length===0&&(n.mode=ia);break;case rd:if(l===0)break e;r[o++]=n.length,l--,n.mode=ia;break;case Yl:if(n.wrap){for(;u<32;){if(a===0)break e;a--,c|=i[s++]<<u,u+=8}if(h-=l,t.total_out+=h,n.total+=h,n.wrap&4&&h&&(t.adler=n.check=n.flags?Ft(n.check,r,h,o-h):wo(n.check,r,h,o-h)),h=l,n.wrap&4&&(n.flags?c:ad(c))!==n.check){t.msg="incorrect data check",n.mode=xt;break}c=0,u=0}n.mode=sd;case sd:if(n.wrap&&n.flags){for(;u<32;){if(a===0)break e;a--,c+=i[s++]<<u,u+=8}if(n.wrap&4&&c!==(n.total&4294967295)){t.msg="incorrect length check",n.mode=xt;break}c=0,u=0}n.mode=od;case od:A=Gy;break e;case xt:A=p_;break e;case __:return m_;case g_:default:return Rn}return t.next_out=o,t.avail_out=l,t.next_in=s,t.avail_in=a,n.hold=c,n.bits=u,(n.wsize||h!==t.avail_out&&n.mode<xt&&(n.mode<Yl||e!==Bh))&&S_(t,t.output,t.next_out,h-t.avail_out),f-=t.avail_in,h-=t.avail_out,t.total_in+=f,t.total_out+=h,n.total+=h,n.wrap&4&&h&&(t.adler=n.check=n.flags?Ft(n.check,r,h,t.next_out-h):wo(n.check,r,h,t.next_out-h)),t.data_type=n.bits+(n.last?64:0)+(n.mode===ui?128:0)+(n.mode===na||n.mode===Xl?256:0),(f===0&&h===0||e===Bh)&&A===Ar&&(A=Xy),A},eb=t=>{if(Ir(t))return Rn;let e=t.state;return e.window&&(e.window=null),t.state=null,Ar},tb=(t,e)=>{if(Ir(t))return Rn;const n=t.state;return(n.wrap&2)===0?Rn:(n.head=e,e.done=!1,Ar)},nb=(t,e)=>{const n=e.length;let i,r,s;return Ir(t)||(i=t.state,i.wrap!==0&&i.mode!==Za)?Rn:i.mode===Za&&(r=1,r=wo(r,e,n,0),r!==i.check)?p_:(s=S_(t,e,n,n),s?(i.mode=__,m_):(i.havedict=1,Ar))};var ib=x_,rb=y_,sb=v_,ob=Ky,ab=b_,lb=Qy,cb=eb,ub=tb,fb=nb,hb="pako inflate (from Nodeca project)",yi={inflateReset:ib,inflateReset2:rb,inflateResetKeep:sb,inflateInit:ob,inflateInit2:ab,inflate:lb,inflateEnd:cb,inflateGetHeader:ub,inflateSetDictionary:fb,inflateInfo:hb};function db(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}var pb=db;const M_=Object.prototype.toString,{Z_NO_FLUSH:mb,Z_FINISH:_b,Z_OK:Ro,Z_STREAM_END:ql,Z_NEED_DICT:Zl,Z_STREAM_ERROR:gb,Z_DATA_ERROR:cd,Z_MEM_ERROR:vb}=ko;function Vo(t){this.options=dl.assign({chunkSize:1024*64,windowBits:15,to:""},t||{});const e=this.options;e.raw&&e.windowBits>=0&&e.windowBits<16&&(e.windowBits=-e.windowBits,e.windowBits===0&&(e.windowBits=-15)),e.windowBits>=0&&e.windowBits<16&&!(t&&t.windowBits)&&(e.windowBits+=32),e.windowBits>15&&e.windowBits<48&&(e.windowBits&15)===0&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new u_,this.strm.avail_out=0;let n=yi.inflateInit2(this.strm,e.windowBits);if(n!==Ro)throw new Error(wr[n]);if(this.header=new pb,yi.inflateGetHeader(this.strm,this.header),e.dictionary&&(typeof e.dictionary=="string"?e.dictionary=Ao.string2buf(e.dictionary):M_.call(e.dictionary)==="[object ArrayBuffer]"&&(e.dictionary=new Uint8Array(e.dictionary)),e.raw&&(n=yi.inflateSetDictionary(this.strm,e.dictionary),n!==Ro)))throw new Error(wr[n])}Vo.prototype.push=function(t,e){const n=this.strm,i=this.options.chunkSize,r=this.options.dictionary;let s,o,a;if(this.ended)return!1;for(e===~~e?o=e:o=e===!0?_b:mb,M_.call(t)==="[object ArrayBuffer]"?n.input=new Uint8Array(t):n.input=t,n.next_in=0,n.avail_in=n.input.length;;){for(n.avail_out===0&&(n.output=new Uint8Array(i),n.next_out=0,n.avail_out=i),s=yi.inflate(n,o),s===Zl&&r&&(s=yi.inflateSetDictionary(n,r),s===Ro?s=yi.inflate(n,o):s===cd&&(s=Zl));n.avail_in>0&&s===ql&&n.state.wrap>0&&t[n.next_in]!==0;)yi.inflateReset(n),s=yi.inflate(n,o);switch(s){case gb:case cd:case Zl:case vb:return this.onEnd(s),this.ended=!0,!1}if(a=n.avail_out,n.next_out&&(n.avail_out===0||s===ql))if(this.options.to==="string"){let l=Ao.utf8border(n.output,n.next_out),c=n.next_out-l,u=Ao.buf2string(n.output,l);n.next_out=c,n.avail_out=i-c,c&&n.output.set(n.output.subarray(l,l+c),0),this.onData(u)}else this.onData(n.output.length===n.next_out?n.output:n.output.subarray(0,n.next_out));if(!(s===Ro&&a===0)){if(s===ql)return s=yi.inflateEnd(this.strm),this.onEnd(s),this.ended=!0,!0;if(n.avail_in===0)break}}return!0};Vo.prototype.onData=function(t){this.chunks.push(t)};Vo.prototype.onEnd=function(t){t===Ro&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=dl.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};function vf(t,e){const n=new Vo(e);if(n.push(t),n.err)throw n.msg||wr[n.err];return n.result}function xb(t,e){return e=e||{},e.raw=!0,vf(t,e)}var yb=Vo,bb=vf,Sb=xb,Mb=vf,Eb={Inflate:yb,inflate:bb,inflateRaw:Sb,ungzip:Mb};const{Deflate:wb,deflate:Tb,deflateRaw:Ab,gzip:Rb}=Iy,{Inflate:Cb,inflate:Pb,inflateRaw:Db,ungzip:Lb}=Eb;var Ib=wb,Ub=Tb,Nb=Ab,Fb=Rb,Ob=Cb,Bb=Pb,kb=Db,zb=Lb,Hb=ko,Vb={Deflate:Ib,deflate:Ub,deflateRaw:Nb,gzip:Fb,Inflate:Ob,inflate:Bb,inflateRaw:kb,ungzip:zb,constants:Hb};const Jc="gzip+base64",Qc={registryId:"air",meta:0};function ml(t){return t.registryId==="air"}function Gb(t){return{registryId:t.registryId,meta:t.meta,facing:t.facing,nbt:t.nbt}}const Wb=["id","label","author","mode","gtnhVersion","structureId","schemaVersion","documentFormat"];function Xb(t){let e="";for(let i=0;i<t.length;i+=32768)e+=String.fromCharCode(...t.subarray(i,i+32768));return btoa(e)}function Yb(t,e){if(t===null||typeof t!="object"||Array.isArray(t))throw new Error("document 须为非 null 对象");return{...t,...e}}function $b(t,e={}){const n=e.metaKeys??Wb,i=t,r={};for(const l of n)Object.prototype.hasOwnProperty.call(i,l)&&(r[l]=i[l]);const s=JSON.stringify(t),o=Vb.gzip(s),a=Xb(o);return{documentFormat:"Compact",payloadEncoding:Jc,meta:r,payload:a}}function ud(t,e,n=!0){const i=n?`${JSON.stringify(e,null,2)}
`:`${JSON.stringify(e)}
`,r=new Blob([i],{type:"application/json;charset=utf-8"}),s=URL.createObjectURL(r),o=document.createElement("a");o.href=s,o.download=t.endsWith(".json")?t:`${t}.json`,o.click(),URL.revokeObjectURL(s)}async function jb(t){var n;if((n=navigator.clipboard)!=null&&n.writeText){await navigator.clipboard.writeText(t);return}const e=document.createElement("textarea");e.value=t,e.style.position="fixed",e.style.left="-9999px",document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e)}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const xf="174",Ri={ROTATE:0,DOLLY:1,PAN:2},ns={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},qb=0,fd=1,Zb=2,E_=1,Kb=2,_i=3,er=0,fn=1,Mi=2,Ki=0,us=1,hd=2,dd=3,pd=4,Jb=5,mr=100,Qb=101,eS=102,tS=103,nS=104,iS=200,rS=201,sS=202,oS=203,eu=204,tu=205,aS=206,lS=207,cS=208,uS=209,fS=210,hS=211,dS=212,pS=213,mS=214,nu=0,iu=1,ru=2,xs=3,su=4,ou=5,au=6,lu=7,w_=0,_S=1,gS=2,Ji=0,vS=1,xS=2,yS=3,bS=4,SS=5,MS=6,ES=7,T_=300,ys=301,bs=302,cu=303,uu=304,_l=306,fu=1e3,Ei=1001,hu=1002,yn=1003,wS=1004,ra=1005,Qn=1006,Kl=1007,yr=1008,Ii=1009,A_=1010,R_=1011,Co=1012,yf=1013,Rr=1014,wi=1015,Go=1016,bf=1017,Sf=1018,Ss=1020,C_=35902,P_=1021,D_=1022,Fn=1023,L_=1024,I_=1025,fs=1026,Ms=1027,U_=1028,Mf=1029,N_=1030,Ef=1031,wf=1033,Na=33776,Fa=33777,Oa=33778,Ba=33779,du=35840,pu=35841,mu=35842,_u=35843,gu=36196,vu=37492,xu=37496,yu=37808,bu=37809,Su=37810,Mu=37811,Eu=37812,wu=37813,Tu=37814,Au=37815,Ru=37816,Cu=37817,Pu=37818,Du=37819,Lu=37820,Iu=37821,ka=36492,Uu=36494,Nu=36495,F_=36283,Fu=36284,Ou=36285,Bu=36286,TS=3200,AS=3201,O_=0,RS=1,Yi="",Qt="srgb",Es="srgb-linear",Ka="linear",ht="srgb",kr=7680,md=519,CS=512,PS=513,DS=514,B_=515,LS=516,IS=517,US=518,NS=519,_d=35044,gd="300 es",Ti=2e3,Ja=2001;class Ur{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let vd=1234567;const ho=Math.PI/180,Po=180/Math.PI;function Ls(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Wt[t&255]+Wt[t>>8&255]+Wt[t>>16&255]+Wt[t>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[n&63|128]+Wt[n>>8&255]+"-"+Wt[n>>16&255]+Wt[n>>24&255]+Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]).toLowerCase()}function qe(t,e,n){return Math.max(e,Math.min(n,t))}function Tf(t,e){return(t%e+e)%e}function FS(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function OS(t,e,n){return t!==e?(n-t)/(e-t):0}function po(t,e,n){return(1-n)*t+n*e}function BS(t,e,n,i){return po(t,e,1-Math.exp(-n*i))}function kS(t,e=1){return e-Math.abs(Tf(t,e*2)-e)}function zS(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function HS(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function VS(t,e){return t+Math.floor(Math.random()*(e-t+1))}function GS(t,e){return t+Math.random()*(e-t)}function WS(t){return t*(.5-Math.random())}function XS(t){t!==void 0&&(vd=t);let e=vd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function YS(t){return t*ho}function $S(t){return t*Po}function jS(t){return(t&t-1)===0&&t!==0}function qS(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function ZS(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function KS(t,e,n,i,r){const s=Math.cos,o=Math.sin,a=s(n/2),l=o(n/2),c=s((e+i)/2),u=o((e+i)/2),f=s((e-i)/2),h=o((e-i)/2),d=s((i-e)/2),_=o((i-e)/2);switch(r){case"XYX":t.set(a*u,l*f,l*h,a*c);break;case"YZY":t.set(l*h,a*u,l*f,a*c);break;case"ZXZ":t.set(l*f,l*h,a*u,a*c);break;case"XZX":t.set(a*u,l*_,l*d,a*c);break;case"YXY":t.set(l*d,a*u,l*_,a*c);break;case"ZYZ":t.set(l*_,l*d,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ts(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function Kt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const ku={DEG2RAD:ho,RAD2DEG:Po,generateUUID:Ls,clamp:qe,euclideanModulo:Tf,mapLinear:FS,inverseLerp:OS,lerp:po,damp:BS,pingpong:kS,smoothstep:zS,smootherstep:HS,randInt:VS,randFloat:GS,randFloatSpread:WS,seededRandom:XS,degToRad:YS,radToDeg:$S,isPowerOfTwo:jS,ceilPowerOfTwo:qS,floorPowerOfTwo:ZS,setQuaternionFromProperEuler:KS,normalize:Kt,denormalize:ts};class We{constructor(e=0,n=0){We.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=qe(this.x,e.x,n.x),this.y=qe(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=qe(this.x,e,n),this.y=qe(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(qe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(qe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class $e{constructor(e,n,i,r,s,o,a,l,c){$e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],f=i[7],h=i[2],d=i[5],_=i[8],g=r[0],m=r[3],p=r[6],T=r[1],R=r[4],y=r[7],P=r[2],L=r[5],M=r[8];return s[0]=o*g+a*T+l*P,s[3]=o*m+a*R+l*L,s[6]=o*p+a*y+l*M,s[1]=c*g+u*T+f*P,s[4]=c*m+u*R+f*L,s[7]=c*p+u*y+f*M,s[2]=h*g+d*T+_*P,s[5]=h*m+d*R+_*L,s[8]=h*p+d*y+_*M,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=u*o-a*c,h=a*l-u*s,d=c*s-o*l,_=n*f+i*h+r*d;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return e[0]=f*g,e[1]=(r*c-u*i)*g,e[2]=(a*i-r*o)*g,e[3]=h*g,e[4]=(u*n-r*l)*g,e[5]=(r*s-a*n)*g,e[6]=d*g,e[7]=(i*l-c*n)*g,e[8]=(o*n-i*s)*g,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(Jl.makeScale(e,n)),this}rotate(e){return this.premultiply(Jl.makeRotation(-e)),this}translate(e,n){return this.premultiply(Jl.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Jl=new $e;function k_(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Do(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function JS(){const t=Do("canvas");return t.style.display="block",t}const xd={};function dr(t){t in xd||(xd[t]=!0,console.warn(t))}function QS(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function eM(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function tM(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const yd=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bd=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function nM(){const t={enabled:!0,workingColorSpace:Es,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===ht&&(r.r=Ci(r.r),r.g=Ci(r.g),r.b=Ci(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ht&&(r.r=hs(r.r),r.g=hs(r.g),r.b=hs(r.b))),r},fromWorkingColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},toWorkingColorSpace:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Yi?Ka:this.spaces[r].transfer},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[Es]:{primaries:e,whitePoint:i,transfer:Ka,toXYZ:yd,fromXYZ:bd,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Qt},outputColorSpaceConfig:{drawingBufferColorSpace:Qt}},[Qt]:{primaries:e,whitePoint:i,transfer:ht,toXYZ:yd,fromXYZ:bd,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Qt}}}),t}const tt=nM();function Ci(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function hs(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let zr;class iM{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{zr===void 0&&(zr=Do("canvas")),zr.width=e.width,zr.height=e.height;const i=zr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=zr}return n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Do("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ci(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Ci(n[i]/255)*255):n[i]=Ci(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let rM=0;class Af{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:rM++}),this.uuid=Ls(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Ql(r[o].image)):s.push(Ql(r[o]))}else s=Ql(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Ql(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?iM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let sM=0;class sn extends Ur{constructor(e=sn.DEFAULT_IMAGE,n=sn.DEFAULT_MAPPING,i=Ei,r=Ei,s=Qn,o=yr,a=Fn,l=Ii,c=sn.DEFAULT_ANISOTROPY,u=Yi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:sM++}),this.uuid=Ls(),this.name="",this.source=new Af(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new We(0,0),this.repeat=new We(1,1),this.center=new We(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==T_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fu:e.x=e.x-Math.floor(e.x);break;case Ei:e.x=e.x<0?0:1;break;case hu:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case fu:e.y=e.y-Math.floor(e.y);break;case Ei:e.y=e.y<0?0:1;break;case hu:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}sn.DEFAULT_IMAGE=null;sn.DEFAULT_MAPPING=T_;sn.DEFAULT_ANISOTROPY=1;class bt{constructor(e=0,n=0,i=0,r=1){bt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],_=l[9],g=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-g)<.01&&Math.abs(_-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+g)<.1&&Math.abs(_+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const R=(c+1)/2,y=(d+1)/2,P=(p+1)/2,L=(u+h)/4,M=(f+g)/4,A=(_+m)/4;return R>y&&R>P?R<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(R),r=L/i,s=M/i):y>P?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=L/r,s=A/r):P<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),i=M/s,r=A/s),this.set(i,r,s,n),this}let T=Math.sqrt((m-_)*(m-_)+(f-g)*(f-g)+(h-u)*(h-u));return Math.abs(T)<.001&&(T=1),this.x=(m-_)/T,this.y=(f-g)/T,this.z=(h-u)/T,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=qe(this.x,e.x,n.x),this.y=qe(this.y,e.y,n.y),this.z=qe(this.z,e.z,n.z),this.w=qe(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=qe(this.x,e,n),this.y=qe(this.y,e,n),this.z=qe(this.z,e,n),this.w=qe(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(qe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class oM extends Ur{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new bt(0,0,e,n),this.scissorTest=!1,this.viewport=new bt(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new sn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const r=Object.assign({},e.textures[n].image);this.textures[n].source=new Af(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Cr extends oM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class z_ extends sn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=yn,this.minFilter=yn,this.wrapR=Ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class aM extends sn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=yn,this.minFilter=yn,this.wrapR=Ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Pr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3];const h=s[o+0],d=s[o+1],_=s[o+2],g=s[o+3];if(a===0){e[n+0]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f;return}if(a===1){e[n+0]=h,e[n+1]=d,e[n+2]=_,e[n+3]=g;return}if(f!==g||l!==h||c!==d||u!==_){let m=1-a;const p=l*h+c*d+u*_+f*g,T=p>=0?1:-1,R=1-p*p;if(R>Number.EPSILON){const P=Math.sqrt(R),L=Math.atan2(P,p*T);m=Math.sin(m*L)/P,a=Math.sin(a*L)/P}const y=a*T;if(l=l*m+h*y,c=c*m+d*y,u=u*m+_*y,f=f*m+g*y,m===1-a){const P=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=P,c*=P,u*=P,f*=P}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[o],h=s[o+1],d=s[o+2],_=s[o+3];return e[n]=a*_+u*f+l*d-c*h,e[n+1]=l*_+u*h+c*f-a*d,e[n+2]=c*_+u*d+a*h-l*f,e[n+3]=u*_-a*f-l*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),f=a(s/2),h=l(i/2),d=l(r/2),_=l(s/2);switch(o){case"XYZ":this._x=h*u*f+c*d*_,this._y=c*d*f-h*u*_,this._z=c*u*_+h*d*f,this._w=c*u*f-h*d*_;break;case"YXZ":this._x=h*u*f+c*d*_,this._y=c*d*f-h*u*_,this._z=c*u*_-h*d*f,this._w=c*u*f+h*d*_;break;case"ZXY":this._x=h*u*f-c*d*_,this._y=c*d*f+h*u*_,this._z=c*u*_+h*d*f,this._w=c*u*f-h*d*_;break;case"ZYX":this._x=h*u*f-c*d*_,this._y=c*d*f+h*u*_,this._z=c*u*_-h*d*f,this._w=c*u*f+h*d*_;break;case"YZX":this._x=h*u*f+c*d*_,this._y=c*d*f+h*u*_,this._z=c*u*_-h*d*f,this._w=c*u*f-h*d*_;break;case"XZY":this._x=h*u*f-c*d*_,this._y=c*d*f-h*u*_,this._z=c*u*_+h*d*f,this._w=c*u*f+h*d*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],f=n[10],h=i+a+f;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(s-c)*d,this._z=(o-r)*d}else if(i>a&&i>f){const d=2*Math.sqrt(1+i-a-f);this._w=(u-l)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+c)/d}else if(a>f){const d=2*Math.sqrt(1+a-i-f);this._w=(s-c)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+f-i-a);this._w=(o-r)/d,this._x=(s+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-n;return this._w=d*o+n*this._w,this._x=d*i+n*this._x,this._y=d*r+n*this._y,this._z=d*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),f=Math.sin((1-n)*u)/c,h=Math.sin(n*u)/c;return this._w=o*f+this._w*h,this._x=i*f+this._x*h,this._y=r*f+this._y*h,this._z=s*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(e=0,n=0,i=0){O.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Sd.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Sd.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*n-s*r),f=2*(s*i-o*n);return this.x=n+l*c+o*f-a*u,this.y=i+l*u+a*c-s*f,this.z=r+l*f+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=qe(this.x,e.x,n.x),this.y=qe(this.y,e.y,n.y),this.z=qe(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=qe(this.x,e,n),this.y=qe(this.y,e,n),this.z=qe(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(qe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ec.copy(this).projectOnVector(e),this.sub(ec)}reflect(e){return this.sub(ec.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(qe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ec=new O,Sd=new Pr;class Wo{constructor(e=new O(1/0,1/0,1/0),n=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Dn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Dn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Dn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Dn):Dn.fromBufferAttribute(s,o),Dn.applyMatrix4(e.matrixWorld),this.expandByPoint(Dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),sa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),sa.copy(i.boundingBox)),sa.applyMatrix4(e.matrixWorld),this.union(sa)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Dn),Dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ws),oa.subVectors(this.max,Ws),Hr.subVectors(e.a,Ws),Vr.subVectors(e.b,Ws),Gr.subVectors(e.c,Ws),Fi.subVectors(Vr,Hr),Oi.subVectors(Gr,Vr),or.subVectors(Hr,Gr);let n=[0,-Fi.z,Fi.y,0,-Oi.z,Oi.y,0,-or.z,or.y,Fi.z,0,-Fi.x,Oi.z,0,-Oi.x,or.z,0,-or.x,-Fi.y,Fi.x,0,-Oi.y,Oi.x,0,-or.y,or.x,0];return!tc(n,Hr,Vr,Gr,oa)||(n=[1,0,0,0,1,0,0,0,1],!tc(n,Hr,Vr,Gr,oa))?!1:(aa.crossVectors(Fi,Oi),n=[aa.x,aa.y,aa.z],tc(n,Hr,Vr,Gr,oa))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(fi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const fi=[new O,new O,new O,new O,new O,new O,new O,new O],Dn=new O,sa=new Wo,Hr=new O,Vr=new O,Gr=new O,Fi=new O,Oi=new O,or=new O,Ws=new O,oa=new O,aa=new O,ar=new O;function tc(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){ar.fromArray(t,s);const a=r.x*Math.abs(ar.x)+r.y*Math.abs(ar.y)+r.z*Math.abs(ar.z),l=e.dot(ar),c=n.dot(ar),u=i.dot(ar);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const lM=new Wo,Xs=new O,nc=new O;class gl{constructor(e=new O,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):lM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Xs.subVectors(e,this.center);const n=Xs.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(Xs,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(nc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Xs.copy(e.center).add(nc)),this.expandByPoint(Xs.copy(e.center).sub(nc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const hi=new O,ic=new O,la=new O,Bi=new O,rc=new O,ca=new O,sc=new O;class vl{constructor(e=new O,n=new O(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=hi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(hi.copy(this.origin).addScaledVector(this.direction,n),hi.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){ic.copy(e).add(n).multiplyScalar(.5),la.copy(n).sub(e).normalize(),Bi.copy(this.origin).sub(ic);const s=e.distanceTo(n)*.5,o=-this.direction.dot(la),a=Bi.dot(this.direction),l=-Bi.dot(la),c=Bi.lengthSq(),u=Math.abs(1-o*o);let f,h,d,_;if(u>0)if(f=o*l-a,h=o*a-l,_=s*u,f>=0)if(h>=-_)if(h<=_){const g=1/u;f*=g,h*=g,d=f*(f+o*h+2*a)+h*(o*f+h+2*l)+c}else h=s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h<=-_?(f=Math.max(0,-(-o*s+a)),h=f>0?-s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c):h<=_?(f=0,h=Math.min(Math.max(-s,-l),s),d=h*(h+2*l)+c):(f=Math.max(0,-(o*s+a)),h=f>0?s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c);else h=o>0?-s:s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(ic).addScaledVector(la,h),d}intersectSphere(e,n){hi.subVectors(e.center,this.origin);const i=hi.dot(this.direction),r=hi.dot(hi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(a=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,hi)!==null}intersectTriangle(e,n,i,r,s){rc.subVectors(n,e),ca.subVectors(i,e),sc.crossVectors(rc,ca);let o=this.direction.dot(sc),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Bi.subVectors(this.origin,e);const l=a*this.direction.dot(ca.crossVectors(Bi,ca));if(l<0)return null;const c=a*this.direction.dot(rc.cross(Bi));if(c<0||l+c>o)return null;const u=-a*Bi.dot(sc);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class lt{constructor(e,n,i,r,s,o,a,l,c,u,f,h,d,_,g,m){lt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,u,f,h,d,_,g,m)}set(e,n,i,r,s,o,a,l,c,u,f,h,d,_,g,m){const p=this.elements;return p[0]=e,p[4]=n,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=_,p[11]=g,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new lt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/Wr.setFromMatrixColumn(e,0).length(),s=1/Wr.setFromMatrixColumn(e,1).length(),o=1/Wr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const h=o*u,d=o*f,_=a*u,g=a*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=d+_*c,n[5]=h-g*c,n[9]=-a*l,n[2]=g-h*c,n[6]=_+d*c,n[10]=o*l}else if(e.order==="YXZ"){const h=l*u,d=l*f,_=c*u,g=c*f;n[0]=h+g*a,n[4]=_*a-d,n[8]=o*c,n[1]=o*f,n[5]=o*u,n[9]=-a,n[2]=d*a-_,n[6]=g+h*a,n[10]=o*l}else if(e.order==="ZXY"){const h=l*u,d=l*f,_=c*u,g=c*f;n[0]=h-g*a,n[4]=-o*f,n[8]=_+d*a,n[1]=d+_*a,n[5]=o*u,n[9]=g-h*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const h=o*u,d=o*f,_=a*u,g=a*f;n[0]=l*u,n[4]=_*c-d,n[8]=h*c+g,n[1]=l*f,n[5]=g*c+h,n[9]=d*c-_,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const h=o*l,d=o*c,_=a*l,g=a*c;n[0]=l*u,n[4]=g-h*f,n[8]=_*f+d,n[1]=f,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=d*f+_,n[10]=h-g*f}else if(e.order==="XZY"){const h=o*l,d=o*c,_=a*l,g=a*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=h*f+g,n[5]=o*u,n[9]=d*f-_,n[2]=_*f-d,n[6]=a*u,n[10]=g*f+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(cM,e,uM)}lookAt(e,n,i){const r=this.elements;return pn.subVectors(e,n),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),ki.crossVectors(i,pn),ki.lengthSq()===0&&(Math.abs(i.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),ki.crossVectors(i,pn)),ki.normalize(),ua.crossVectors(pn,ki),r[0]=ki.x,r[4]=ua.x,r[8]=pn.x,r[1]=ki.y,r[5]=ua.y,r[9]=pn.y,r[2]=ki.z,r[6]=ua.z,r[10]=pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],f=i[5],h=i[9],d=i[13],_=i[2],g=i[6],m=i[10],p=i[14],T=i[3],R=i[7],y=i[11],P=i[15],L=r[0],M=r[4],A=r[8],v=r[12],x=r[1],C=r[5],G=r[9],V=r[13],Z=r[2],ee=r[6],J=r[10],Q=r[14],N=r[3],ae=r[7],pe=r[11],Te=r[15];return s[0]=o*L+a*x+l*Z+c*N,s[4]=o*M+a*C+l*ee+c*ae,s[8]=o*A+a*G+l*J+c*pe,s[12]=o*v+a*V+l*Q+c*Te,s[1]=u*L+f*x+h*Z+d*N,s[5]=u*M+f*C+h*ee+d*ae,s[9]=u*A+f*G+h*J+d*pe,s[13]=u*v+f*V+h*Q+d*Te,s[2]=_*L+g*x+m*Z+p*N,s[6]=_*M+g*C+m*ee+p*ae,s[10]=_*A+g*G+m*J+p*pe,s[14]=_*v+g*V+m*Q+p*Te,s[3]=T*L+R*x+y*Z+P*N,s[7]=T*M+R*C+y*ee+P*ae,s[11]=T*A+R*G+y*J+P*pe,s[15]=T*v+R*V+y*Q+P*Te,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],d=e[14],_=e[3],g=e[7],m=e[11],p=e[15];return _*(+s*l*f-r*c*f-s*a*h+i*c*h+r*a*d-i*l*d)+g*(+n*l*d-n*c*h+s*o*h-r*o*d+r*c*u-s*l*u)+m*(+n*c*f-n*a*d-s*o*f+i*o*d+s*a*u-i*c*u)+p*(-r*a*u-n*l*f+n*a*h+r*o*f-i*o*h+i*l*u)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],d=e[11],_=e[12],g=e[13],m=e[14],p=e[15],T=f*m*c-g*h*c+g*l*d-a*m*d-f*l*p+a*h*p,R=_*h*c-u*m*c-_*l*d+o*m*d+u*l*p-o*h*p,y=u*g*c-_*f*c+_*a*d-o*g*d-u*a*p+o*f*p,P=_*f*l-u*g*l-_*a*h+o*g*h+u*a*m-o*f*m,L=n*T+i*R+r*y+s*P;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const M=1/L;return e[0]=T*M,e[1]=(g*h*s-f*m*s-g*r*d+i*m*d+f*r*p-i*h*p)*M,e[2]=(a*m*s-g*l*s+g*r*c-i*m*c-a*r*p+i*l*p)*M,e[3]=(f*l*s-a*h*s-f*r*c+i*h*c+a*r*d-i*l*d)*M,e[4]=R*M,e[5]=(u*m*s-_*h*s+_*r*d-n*m*d-u*r*p+n*h*p)*M,e[6]=(_*l*s-o*m*s-_*r*c+n*m*c+o*r*p-n*l*p)*M,e[7]=(o*h*s-u*l*s+u*r*c-n*h*c-o*r*d+n*l*d)*M,e[8]=y*M,e[9]=(_*f*s-u*g*s-_*i*d+n*g*d+u*i*p-n*f*p)*M,e[10]=(o*g*s-_*a*s+_*i*c-n*g*c-o*i*p+n*a*p)*M,e[11]=(u*a*s-o*f*s-u*i*c+n*f*c+o*i*d-n*a*d)*M,e[12]=P*M,e[13]=(u*g*r-_*f*r+_*i*h-n*g*h-u*i*m+n*f*m)*M,e[14]=(_*a*r-o*g*r-_*i*l+n*g*l+o*i*m-n*a*m)*M,e[15]=(o*f*r-u*a*r+u*i*l-n*f*l-o*i*h+n*a*h)*M,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,u=o+o,f=a+a,h=s*c,d=s*u,_=s*f,g=o*u,m=o*f,p=a*f,T=l*c,R=l*u,y=l*f,P=i.x,L=i.y,M=i.z;return r[0]=(1-(g+p))*P,r[1]=(d+y)*P,r[2]=(_-R)*P,r[3]=0,r[4]=(d-y)*L,r[5]=(1-(h+p))*L,r[6]=(m+T)*L,r[7]=0,r[8]=(_+R)*M,r[9]=(m-T)*M,r[10]=(1-(h+g))*M,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=Wr.set(r[0],r[1],r[2]).length();const o=Wr.set(r[4],r[5],r[6]).length(),a=Wr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Ln.copy(this);const c=1/s,u=1/o,f=1/a;return Ln.elements[0]*=c,Ln.elements[1]*=c,Ln.elements[2]*=c,Ln.elements[4]*=u,Ln.elements[5]*=u,Ln.elements[6]*=u,Ln.elements[8]*=f,Ln.elements[9]*=f,Ln.elements[10]*=f,n.setFromRotationMatrix(Ln),i.x=s,i.y=o,i.z=a,this}makePerspective(e,n,i,r,s,o,a=Ti){const l=this.elements,c=2*s/(n-e),u=2*s/(i-r),f=(n+e)/(n-e),h=(i+r)/(i-r);let d,_;if(a===Ti)d=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Ja)d=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=Ti){const l=this.elements,c=1/(n-e),u=1/(i-r),f=1/(o-s),h=(n+e)*c,d=(i+r)*u;let _,g;if(a===Ti)_=(o+s)*f,g=-2*f;else if(a===Ja)_=s*f,g=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=g,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const Wr=new O,Ln=new lt,cM=new O(0,0,0),uM=new O(1,1,1),ki=new O,ua=new O,pn=new O,Md=new lt,Ed=new Pr;class oi{constructor(e=0,n=0,i=0,r=oi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],d=r[10];switch(n){case"XYZ":this._y=Math.asin(qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-qe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Md.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Md,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Ed.setFromEuler(this),this.setFromQuaternion(Ed,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}oi.DEFAULT_ORDER="XYZ";class Rf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let fM=0;const wd=new O,Xr=new Pr,di=new lt,fa=new O,Ys=new O,hM=new O,dM=new Pr,Td=new O(1,0,0),Ad=new O(0,1,0),Rd=new O(0,0,1),Cd={type:"added"},pM={type:"removed"},Yr={type:"childadded",child:null},oc={type:"childremoved",child:null};class Bt extends Ur{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fM++}),this.uuid=Ls(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Bt.DEFAULT_UP.clone();const e=new O,n=new oi,i=new Pr,r=new O(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new lt},normalMatrix:{value:new $e}}),this.matrix=new lt,this.matrixWorld=new lt,this.matrixAutoUpdate=Bt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Rf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Xr.setFromAxisAngle(e,n),this.quaternion.multiply(Xr),this}rotateOnWorldAxis(e,n){return Xr.setFromAxisAngle(e,n),this.quaternion.premultiply(Xr),this}rotateX(e){return this.rotateOnAxis(Td,e)}rotateY(e){return this.rotateOnAxis(Ad,e)}rotateZ(e){return this.rotateOnAxis(Rd,e)}translateOnAxis(e,n){return wd.copy(e).applyQuaternion(this.quaternion),this.position.add(wd.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Td,e)}translateY(e){return this.translateOnAxis(Ad,e)}translateZ(e){return this.translateOnAxis(Rd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(di.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?fa.copy(e):fa.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Ys.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?di.lookAt(Ys,fa,this.up):di.lookAt(fa,Ys,this.up),this.quaternion.setFromRotationMatrix(di),r&&(di.extractRotation(r.matrixWorld),Xr.setFromRotationMatrix(di),this.quaternion.premultiply(Xr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Cd),Yr.child=e,this.dispatchEvent(Yr),Yr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(pM),oc.child=e,this.dispatchEvent(oc),oc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),di.multiply(e.parent.matrixWorld)),e.applyMatrix4(di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Cd),Yr.child=e,this.dispatchEvent(Yr),Yr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ys,e,hM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ys,dM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),f=o(e.shapes),h=o(e.skeletons),d=o(e.animations),_=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),_.length>0&&(i.nodes=_)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Bt.DEFAULT_UP=new O(0,1,0);Bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const In=new O,pi=new O,ac=new O,mi=new O,$r=new O,jr=new O,Pd=new O,lc=new O,cc=new O,uc=new O,fc=new bt,hc=new bt,dc=new bt;class Nn{constructor(e=new O,n=new O,i=new O){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),In.subVectors(e,n),r.cross(In);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){In.subVectors(r,n),pi.subVectors(i,n),ac.subVectors(e,n);const o=In.dot(In),a=In.dot(pi),l=In.dot(ac),c=pi.dot(pi),u=pi.dot(ac),f=o*c-a*a;if(f===0)return s.set(0,0,0),null;const h=1/f,d=(c*l-a*u)*h,_=(o*u-a*l)*h;return s.set(1-d-_,_,d)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,mi)===null?!1:mi.x>=0&&mi.y>=0&&mi.x+mi.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,mi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,mi.x),l.addScaledVector(o,mi.y),l.addScaledVector(a,mi.z),l)}static getInterpolatedAttribute(e,n,i,r,s,o){return fc.setScalar(0),hc.setScalar(0),dc.setScalar(0),fc.fromBufferAttribute(e,n),hc.fromBufferAttribute(e,i),dc.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(fc,s.x),o.addScaledVector(hc,s.y),o.addScaledVector(dc,s.z),o}static isFrontFacing(e,n,i,r){return In.subVectors(i,n),pi.subVectors(e,n),In.cross(pi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return In.subVectors(this.c,this.b),pi.subVectors(this.a,this.b),In.cross(pi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Nn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Nn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Nn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Nn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Nn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;$r.subVectors(r,i),jr.subVectors(s,i),lc.subVectors(e,i);const l=$r.dot(lc),c=jr.dot(lc);if(l<=0&&c<=0)return n.copy(i);cc.subVectors(e,r);const u=$r.dot(cc),f=jr.dot(cc);if(u>=0&&f<=u)return n.copy(r);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector($r,o);uc.subVectors(e,s);const d=$r.dot(uc),_=jr.dot(uc);if(_>=0&&d<=_)return n.copy(s);const g=d*c-l*_;if(g<=0&&c>=0&&_<=0)return a=c/(c-_),n.copy(i).addScaledVector(jr,a);const m=u*_-d*f;if(m<=0&&f-u>=0&&d-_>=0)return Pd.subVectors(s,r),a=(f-u)/(f-u+(d-_)),n.copy(r).addScaledVector(Pd,a);const p=1/(m+g+h);return o=g*p,a=h*p,n.copy(i).addScaledVector($r,o).addScaledVector(jr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const H_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zi={h:0,s:0,l:0},ha={h:0,s:0,l:0};function pc(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Ze{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Qt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=tt.workingColorSpace){return this.r=e,this.g=n,this.b=i,tt.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=tt.workingColorSpace){if(e=Tf(e,1),n=qe(n,0,1),i=qe(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=pc(o,s,e+1/3),this.g=pc(o,s,e),this.b=pc(o,s,e-1/3)}return tt.toWorkingColorSpace(this,r),this}setStyle(e,n=Qt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Qt){const i=H_[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ci(e.r),this.g=Ci(e.g),this.b=Ci(e.b),this}copyLinearToSRGB(e){return this.r=hs(e.r),this.g=hs(e.g),this.b=hs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Qt){return tt.fromWorkingColorSpace(Xt.copy(this),e),Math.round(qe(Xt.r*255,0,255))*65536+Math.round(qe(Xt.g*255,0,255))*256+Math.round(qe(Xt.b*255,0,255))}getHexString(e=Qt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=tt.workingColorSpace){tt.fromWorkingColorSpace(Xt.copy(this),n);const i=Xt.r,r=Xt.g,s=Xt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=tt.workingColorSpace){return tt.fromWorkingColorSpace(Xt.copy(this),n),e.r=Xt.r,e.g=Xt.g,e.b=Xt.b,e}getStyle(e=Qt){tt.fromWorkingColorSpace(Xt.copy(this),e);const n=Xt.r,i=Xt.g,r=Xt.b;return e!==Qt?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(zi),this.setHSL(zi.h+e,zi.s+n,zi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(zi),e.getHSL(ha);const i=po(zi.h,ha.h,n),r=po(zi.s,ha.s,n),s=po(zi.l,ha.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xt=new Ze;Ze.NAMES=H_;let mM=0;class Is extends Ur{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:mM++}),this.uuid=Ls(),this.name="",this.type="Material",this.blending=us,this.side=er,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=eu,this.blendDst=tu,this.blendEquation=mr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ze(0,0,0),this.blendAlpha=0,this.depthFunc=xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=md,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=kr,this.stencilZFail=kr,this.stencilZPass=kr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==us&&(i.blending=this.blending),this.side!==er&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==eu&&(i.blendSrc=this.blendSrc),this.blendDst!==tu&&(i.blendDst=this.blendDst),this.blendEquation!==mr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==xs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==md&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==kr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==kr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==kr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class V_ extends Is{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=w_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new O,da=new We;let _M=0;class hn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:_M++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=_d,this.updateRanges=[],this.gpuType=wi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)da.fromBufferAttribute(this,n),da.applyMatrix3(e),this.setXY(n,da.x,da.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyMatrix3(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyMatrix4(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyNormalMatrix(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.transformDirection(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ts(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Kt(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ts(n,this.array)),n}setX(e,n){return this.normalized&&(n=Kt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ts(n,this.array)),n}setY(e,n){return this.normalized&&(n=Kt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ts(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Kt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ts(n,this.array)),n}setW(e,n){return this.normalized&&(n=Kt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Kt(n,this.array),i=Kt(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=Kt(n,this.array),i=Kt(i,this.array),r=Kt(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=Kt(n,this.array),i=Kt(i,this.array),r=Kt(r,this.array),s=Kt(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==_d&&(e.usage=this.usage),e}}class G_ extends hn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class W_ extends hn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class kn extends hn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let gM=0;const Mn=new lt,mc=new Bt,qr=new O,mn=new Wo,$s=new Wo,Nt=new O;class Vn extends Ur{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:gM++}),this.uuid=Ls(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(k_(e)?W_:G_)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new $e().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Mn.makeRotationFromQuaternion(e),this.applyMatrix4(Mn),this}rotateX(e){return Mn.makeRotationX(e),this.applyMatrix4(Mn),this}rotateY(e){return Mn.makeRotationY(e),this.applyMatrix4(Mn),this}rotateZ(e){return Mn.makeRotationZ(e),this.applyMatrix4(Mn),this}translate(e,n,i){return Mn.makeTranslation(e,n,i),this.applyMatrix4(Mn),this}scale(e,n,i){return Mn.makeScale(e,n,i),this.applyMatrix4(Mn),this}lookAt(e){return mc.lookAt(e),mc.updateMatrix(),this.applyMatrix4(mc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qr).negate(),this.translate(qr.x,qr.y,qr.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new kn(i,3))}else{const i=Math.min(e.length,n.count);for(let r=0;r<i;r++){const s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wo);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];mn.setFromBufferAttribute(s),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gl);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){const i=this.boundingSphere.center;if(mn.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];$s.setFromBufferAttribute(a),this.morphTargetsRelative?(Nt.addVectors(mn.min,$s.min),mn.expandByPoint(Nt),Nt.addVectors(mn.max,$s.max),mn.expandByPoint(Nt)):(mn.expandByPoint($s.min),mn.expandByPoint($s.max))}mn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Nt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Nt));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Nt.fromBufferAttribute(a,c),l&&(qr.fromBufferAttribute(e,c),Nt.add(qr)),r=Math.max(r,i.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new hn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let A=0;A<i.count;A++)a[A]=new O,l[A]=new O;const c=new O,u=new O,f=new O,h=new We,d=new We,_=new We,g=new O,m=new O;function p(A,v,x){c.fromBufferAttribute(i,A),u.fromBufferAttribute(i,v),f.fromBufferAttribute(i,x),h.fromBufferAttribute(s,A),d.fromBufferAttribute(s,v),_.fromBufferAttribute(s,x),u.sub(c),f.sub(c),d.sub(h),_.sub(h);const C=1/(d.x*_.y-_.x*d.y);isFinite(C)&&(g.copy(u).multiplyScalar(_.y).addScaledVector(f,-d.y).multiplyScalar(C),m.copy(f).multiplyScalar(d.x).addScaledVector(u,-_.x).multiplyScalar(C),a[A].add(g),a[v].add(g),a[x].add(g),l[A].add(m),l[v].add(m),l[x].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let A=0,v=T.length;A<v;++A){const x=T[A],C=x.start,G=x.count;for(let V=C,Z=C+G;V<Z;V+=3)p(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const R=new O,y=new O,P=new O,L=new O;function M(A){P.fromBufferAttribute(r,A),L.copy(P);const v=a[A];R.copy(v),R.sub(P.multiplyScalar(P.dot(v))).normalize(),y.crossVectors(L,v);const C=y.dot(l[A])<0?-1:1;o.setXYZW(A,R.x,R.y,R.z,C)}for(let A=0,v=T.length;A<v;++A){const x=T[A],C=x.start,G=x.count;for(let V=C,Z=C+G;V<Z;V+=3)M(e.getX(V+0)),M(e.getX(V+1)),M(e.getX(V+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new hn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);const r=new O,s=new O,o=new O,a=new O,l=new O,c=new O,u=new O,f=new O;if(e)for(let h=0,d=e.count;h<d;h+=3){const _=e.getX(h+0),g=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(n,_),s.fromBufferAttribute(n,g),o.fromBufferAttribute(n,m),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(i,_),l.fromBufferAttribute(i,g),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(_,a.x,a.y,a.z),i.setXYZ(g,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=n.count;h<d;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),o.fromBufferAttribute(n,h+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Nt.fromBufferAttribute(e,n),Nt.normalize(),e.setXYZ(n,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,f=a.normalized,h=new c.constructor(l.length*u);let d=0,_=0;for(let g=0,m=l.length;g<m;g++){a.isInterleavedBufferAttribute?d=l[g]*a.data.stride+a.offset:d=l[g]*u;for(let p=0;p<u;p++)h[_++]=c[d++]}return new hn(h,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Vn,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);n.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,f=c.length;u<f;u++){const h=c[u],d=e(h,i);l.push(d)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const d=c[f];u.push(d.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(n))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Dd=new lt,lr=new vl,pa=new gl,Ld=new O,ma=new O,_a=new O,ga=new O,_c=new O,va=new O,Id=new O,xa=new O;class ei extends Bt{constructor(e=new Vn,n=new V_){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){va.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],f=s[l];u!==0&&(_c.fromBufferAttribute(f,e),o?va.addScaledVector(_c,u):va.addScaledVector(_c.sub(n),u))}n.add(va)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),pa.copy(i.boundingSphere),pa.applyMatrix4(s),lr.copy(e.ray).recast(e.near),!(pa.containsPoint(lr.origin)===!1&&(lr.intersectSphere(pa,Ld)===null||lr.origin.distanceToSquared(Ld)>(e.far-e.near)**2))&&(Dd.copy(s).invert(),lr.copy(e.ray).applyMatrix4(Dd),!(i.boundingBox!==null&&lr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,lr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,g=h.length;_<g;_++){const m=h[_],p=o[m.materialIndex],T=Math.max(m.start,d.start),R=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let y=T,P=R;y<P;y+=3){const L=a.getX(y),M=a.getX(y+1),A=a.getX(y+2);r=ya(this,p,e,i,c,u,f,L,M,A),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,d.start),g=Math.min(a.count,d.start+d.count);for(let m=_,p=g;m<p;m+=3){const T=a.getX(m),R=a.getX(m+1),y=a.getX(m+2);r=ya(this,o,e,i,c,u,f,T,R,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,g=h.length;_<g;_++){const m=h[_],p=o[m.materialIndex],T=Math.max(m.start,d.start),R=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let y=T,P=R;y<P;y+=3){const L=y,M=y+1,A=y+2;r=ya(this,p,e,i,c,u,f,L,M,A),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,d.start),g=Math.min(l.count,d.start+d.count);for(let m=_,p=g;m<p;m+=3){const T=m,R=m+1,y=m+2;r=ya(this,o,e,i,c,u,f,T,R,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function vM(t,e,n,i,r,s,o,a){let l;if(e.side===fn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===er,a),l===null)return null;xa.copy(a),xa.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(xa);return c<n.near||c>n.far?null:{distance:c,point:xa.clone(),object:t}}function ya(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,ma),t.getVertexPosition(l,_a),t.getVertexPosition(c,ga);const u=vM(t,e,n,i,ma,_a,ga,Id);if(u){const f=new O;Nn.getBarycoord(Id,ma,_a,ga,f),r&&(u.uv=Nn.getInterpolatedAttribute(r,a,l,c,f,new We)),s&&(u.uv1=Nn.getInterpolatedAttribute(s,a,l,c,f,new We)),o&&(u.normal=Nn.getInterpolatedAttribute(o,a,l,c,f,new O),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new O,materialIndex:0};Nn.getNormal(ma,_a,ga,h.normal),u.face=h,u.barycoord=f}return u}class Xo extends Vn{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],f=[];let h=0,d=0;_("z","y","x",-1,-1,i,n,e,o,s,0),_("z","y","x",1,-1,i,n,-e,o,s,1),_("x","z","y",1,1,e,i,n,r,o,2),_("x","z","y",1,-1,e,i,-n,r,o,3),_("x","y","z",1,-1,e,n,i,r,s,4),_("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new kn(c,3)),this.setAttribute("normal",new kn(u,3)),this.setAttribute("uv",new kn(f,2));function _(g,m,p,T,R,y,P,L,M,A,v){const x=y/M,C=P/A,G=y/2,V=P/2,Z=L/2,ee=M+1,J=A+1;let Q=0,N=0;const ae=new O;for(let pe=0;pe<J;pe++){const Te=pe*C-V;for(let Fe=0;Fe<ee;Fe++){const it=Fe*x-G;ae[g]=it*T,ae[m]=Te*R,ae[p]=Z,c.push(ae.x,ae.y,ae.z),ae[g]=0,ae[m]=0,ae[p]=L>0?1:-1,u.push(ae.x,ae.y,ae.z),f.push(Fe/M),f.push(1-pe/A),Q+=1}}for(let pe=0;pe<A;pe++)for(let Te=0;Te<M;Te++){const Fe=h+Te+ee*pe,it=h+Te+ee*(pe+1),ie=h+(Te+1)+ee*(pe+1),de=h+(Te+1)+ee*pe;l.push(Fe,it,de),l.push(it,ie,de),N+=6}a.addGroup(d,N,v),d+=N,h+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ws(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Jt(t){const e={};for(let n=0;n<t.length;n++){const i=ws(t[n]);for(const r in i)e[r]=i[r]}return e}function xM(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function X_(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const yM={clone:ws,merge:Jt};var bM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,SM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class tr extends Is{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bM,this.fragmentShader=SM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ws(e.uniforms),this.uniformsGroups=xM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Y_ extends Bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new lt,this.projectionMatrix=new lt,this.projectionMatrixInverse=new lt,this.coordinateSystem=Ti}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Hi=new O,Ud=new We,Nd=new We;class gn extends Y_{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Po*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ho*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Po*2*Math.atan(Math.tan(ho*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Hi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Hi.x,Hi.y).multiplyScalar(-e/Hi.z),Hi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Hi.x,Hi.y).multiplyScalar(-e/Hi.z)}getViewSize(e,n){return this.getViewBounds(e,Ud,Nd),n.subVectors(Nd,Ud)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(ho*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Zr=-90,Kr=1;class MM extends Bt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new gn(Zr,Kr,e,n);r.layers=this.layers,this.add(r);const s=new gn(Zr,Kr,e,n);s.layers=this.layers,this.add(s);const o=new gn(Zr,Kr,e,n);o.layers=this.layers,this.add(o);const a=new gn(Zr,Kr,e,n);a.layers=this.layers,this.add(a);const l=new gn(Zr,Kr,e,n);l.layers=this.layers,this.add(l);const c=new gn(Zr,Kr,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const c of n)this.remove(c);if(e===Ti)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ja)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,o),e.setRenderTarget(i,2,r),e.render(n,a),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=g,e.setRenderTarget(i,5,r),e.render(n,u),e.setRenderTarget(f,h,d),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class $_ extends sn{constructor(e,n,i,r,s,o,a,l,c,u){e=e!==void 0?e:[],n=n!==void 0?n:ys,super(e,n,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class EM extends Cr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new $_(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Qn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Xo(5,5,5),s=new tr({name:"CubemapFromEquirect",uniforms:ws(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:fn,blending:Ki});s.uniforms.tEquirect.value=n;const o=new ei(r,s),a=n.minFilter;return n.minFilter===yr&&(n.minFilter=Qn),new MM(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}class br extends Bt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const wM={type:"move"};class gc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new br,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new br,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new br,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const g of e.hand.values()){const m=n.getJointPose(g,i),p=this._getHandJoint(c,g);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,_=.005;c.inputState.pinching&&h>d+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(wM)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new br;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}class j_ extends Bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const vc=new O,TM=new O,AM=new $e;class Gi{constructor(e=new O(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=vc.subVectors(i,n).cross(TM.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(vc),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||AM.getNormalMatrix(e),r=this.coplanarPoint(vc).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const cr=new gl,ba=new O;class Cf{constructor(e=new Gi,n=new Gi,i=new Gi,r=new Gi,s=new Gi,o=new Gi){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Ti){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],f=r[6],h=r[7],d=r[8],_=r[9],g=r[10],m=r[11],p=r[12],T=r[13],R=r[14],y=r[15];if(i[0].setComponents(l-s,h-c,m-d,y-p).normalize(),i[1].setComponents(l+s,h+c,m+d,y+p).normalize(),i[2].setComponents(l+o,h+u,m+_,y+T).normalize(),i[3].setComponents(l-o,h-u,m-_,y-T).normalize(),i[4].setComponents(l-a,h-f,m-g,y-R).normalize(),n===Ti)i[5].setComponents(l+a,h+f,m+g,y+R).normalize();else if(n===Ja)i[5].setComponents(a,f,g,R).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),cr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),cr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(cr)}intersectsSprite(e){return cr.center.set(0,0,0),cr.radius=.7071067811865476,cr.applyMatrix4(e.matrixWorld),this.intersectsSphere(cr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(ba.x=r.normal.x>0?e.max.x:e.min.x,ba.y=r.normal.y>0?e.max.y:e.min.y,ba.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ba)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class q_ extends Is{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Qa=new O,el=new O,Fd=new lt,js=new vl,Sa=new gl,xc=new O,Od=new O;class RM extends Bt{constructor(e=new Vn,n=new q_){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Qa.fromBufferAttribute(n,r-1),el.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Qa.distanceTo(el);e.setAttribute("lineDistance",new kn(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Sa.copy(i.boundingSphere),Sa.applyMatrix4(r),Sa.radius+=s,e.ray.intersectsSphere(Sa)===!1)return;Fd.copy(r).invert(),js.copy(e.ray).applyMatrix4(Fd);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){const d=Math.max(0,o.start),_=Math.min(u.count,o.start+o.count);for(let g=d,m=_-1;g<m;g+=c){const p=u.getX(g),T=u.getX(g+1),R=Ma(this,e,js,l,p,T,g);R&&n.push(R)}if(this.isLineLoop){const g=u.getX(_-1),m=u.getX(d),p=Ma(this,e,js,l,g,m,_-1);p&&n.push(p)}}else{const d=Math.max(0,o.start),_=Math.min(h.count,o.start+o.count);for(let g=d,m=_-1;g<m;g+=c){const p=Ma(this,e,js,l,g,g+1,g);p&&n.push(p)}if(this.isLineLoop){const g=Ma(this,e,js,l,_-1,d,_-1);g&&n.push(g)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Ma(t,e,n,i,r,s,o){const a=t.geometry.attributes.position;if(Qa.fromBufferAttribute(a,r),el.fromBufferAttribute(a,s),n.distanceSqToSegment(Qa,el,xc,Od)>i)return;xc.applyMatrix4(t.matrixWorld);const c=e.ray.origin.distanceTo(xc);if(!(c<e.near||c>e.far))return{distance:c,point:Od.clone().applyMatrix4(t.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:t}}const Bd=new O,kd=new O;class CM extends RM{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)Bd.fromBufferAttribute(n,r),kd.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Bd.distanceTo(kd);e.setAttribute("lineDistance",new kn(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Z_ extends sn{constructor(e,n,i,r,s,o,a,l,c,u=fs){if(u!==fs&&u!==Ms)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===fs&&(i=Rr),i===void 0&&u===Ms&&(i=Ss),super(null,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=a!==void 0?a:yn,this.minFilter=l!==void 0?l:yn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Af(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class xl extends Vn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,f=e/a,h=n/l,d=[],_=[],g=[],m=[];for(let p=0;p<u;p++){const T=p*h-o;for(let R=0;R<c;R++){const y=R*f-s;_.push(y,-T,0),g.push(0,0,1),m.push(R/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let T=0;T<a;T++){const R=T+c*p,y=T+c*(p+1),P=T+1+c*(p+1),L=T+1+c*p;d.push(R,y,L),d.push(y,P,L)}this.setIndex(d),this.setAttribute("position",new kn(_,3)),this.setAttribute("normal",new kn(g,3)),this.setAttribute("uv",new kn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xl(e.width,e.height,e.widthSegments,e.heightSegments)}}class zd extends Is{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=O_,this.normalScale=new We(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class PM extends Is{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=TS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class DM extends Is{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Hd={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(this.files[t]=e)},get:function(t){if(this.enabled!==!1)return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};class LM{constructor(e,n,i){const r=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){const f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){const d=c[f],_=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return _}return null}}}const IM=new LM;class Pf{constructor(e){this.manager=e!==void 0?e:IM,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,n){const i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Pf.DEFAULT_MATERIAL_NAME="__DEFAULT";class UM extends Pf{constructor(e){super(e)}load(e,n,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=Hd.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){n&&n(o),s.manager.itemEnd(e)},0),o;const a=Do("img");function l(){u(),Hd.add(e,this),n&&n(this),s.manager.itemEnd(e)}function c(f){u(),r&&r(f),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}}class NM extends Pf{constructor(e){super(e)}load(e,n,i,r){const s=new sn,o=new UM(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,n!==void 0&&n(s)},i,r),s}}class K_ extends Bt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Ze(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}const yc=new lt,Vd=new O,Gd=new O;class FM{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new We(512,512),this.map=null,this.mapPass=null,this.matrix=new lt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Cf,this._frameExtents=new We(1,1),this._viewportCount=1,this._viewports=[new bt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;Vd.setFromMatrixPosition(e.matrixWorld),n.position.copy(Vd),Gd.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Gd),n.updateMatrixWorld(),yc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(yc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Ts extends Y_{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class OM extends FM{constructor(){super(new Ts(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class zu extends K_{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Bt.DEFAULT_UP),this.updateMatrix(),this.target=new Bt,this.shadow=new OM}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class J_ extends K_{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class BM extends gn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e,this.index=0}}class kM{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Wd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=Wd();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}function Wd(){return performance.now()}const Xd=new lt;class zM{constructor(e,n,i=0,r=1/0){this.ray=new vl(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new Rf,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return Xd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Xd),this}intersectObject(e,n=!0,i=[]){return Hu(e,this,i,n),i.sort(Yd),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Hu(e[r],this,i,n);return i.sort(Yd),i}}function Yd(t,e){return t.distance-e.distance}function Hu(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){const s=t.children;for(let o=0,a=s.length;o<a;o++)Hu(s[o],e,n,!0)}}class Vu{constructor(e=1,n=0,i=0){this.radius=e,this.phi=n,this.theta=i}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=qe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(qe(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class HM extends CM{constructor(e=1){const n=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],r=new Vn;r.setAttribute("position",new kn(n,3)),r.setAttribute("color",new kn(i,3));const s=new q_({vertexColors:!0,toneMapped:!1});super(r,s),this.type="AxesHelper"}setColors(e,n,i){const r=new Ze,s=this.geometry.attributes.color.array;return r.set(e),r.toArray(s,0),r.toArray(s,3),r.set(n),r.toArray(s,6),r.toArray(s,9),r.set(i),r.toArray(s,12),r.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class VM extends Ur{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function $d(t,e,n,i){const r=GM(i);switch(n){case P_:return t*e;case L_:return t*e;case I_:return t*e*2;case U_:return t*e/r.components*r.byteLength;case Mf:return t*e/r.components*r.byteLength;case N_:return t*e*2/r.components*r.byteLength;case Ef:return t*e*2/r.components*r.byteLength;case D_:return t*e*3/r.components*r.byteLength;case Fn:return t*e*4/r.components*r.byteLength;case wf:return t*e*4/r.components*r.byteLength;case Na:case Fa:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Oa:case Ba:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case pu:case _u:return Math.max(t,16)*Math.max(e,8)/4;case du:case mu:return Math.max(t,8)*Math.max(e,8)/2;case gu:case vu:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case xu:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case yu:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case bu:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Su:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Mu:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Eu:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case wu:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Tu:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Au:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Ru:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Cu:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Pu:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Du:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Lu:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Iu:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case ka:case Uu:case Nu:return Math.ceil(t/4)*Math.ceil(e/4)*16;case F_:case Fu:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Ou:case Bu:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function GM(t){switch(t){case Ii:case A_:return{byteLength:1,components:1};case Co:case R_:case Go:return{byteLength:2,components:1};case bf:case Sf:return{byteLength:2,components:4};case Rr:case yf:case wi:return{byteLength:4,components:1};case C_:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xf);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Q_(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function WM(t){const e=new WeakMap;function n(a,l){const c=a.array,u=a.usage,f=c.byteLength,h=t.createBuffer();t.bindBuffer(l,h),t.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=t.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=t.HALF_FLOAT:d=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=t.SHORT;else if(c instanceof Uint32Array)d=t.UNSIGNED_INT;else if(c instanceof Int32Array)d=t.INT;else if(c instanceof Int8Array)d=t.BYTE;else if(c instanceof Uint8Array)d=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function i(a,l,c){const u=l.array,f=l.updateRanges;if(t.bindBuffer(c,a),f.length===0)t.bufferSubData(c,0,u);else{f.sort((d,_)=>d.start-_.start);let h=0;for(let d=1;d<f.length;d++){const _=f[h],g=f[d];g.start<=_.start+_.count+1?_.count=Math.max(_.count,g.start+g.count-_.start):(++h,f[h]=g)}f.length=h+1;for(let d=0,_=f.length;d<_;d++){const g=f[d];t.bufferSubData(c,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var XM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,YM=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,$M=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,jM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ZM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,KM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,JM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,QM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,eE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,nE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,iE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,rE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,sE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,oE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,aE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,uE=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,fE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,hE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,dE=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,pE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,mE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,_E=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,gE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,bE="gl_FragColor = linearToOutputTexel( gl_FragColor );",SE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ME=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,EE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,wE=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,TE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,AE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,RE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,CE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,PE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,DE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,LE=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,IE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,UE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,NE=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,FE=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,OE=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,BE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kE=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,zE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,HE=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,VE=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,GE=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,WE=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,XE=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,YE=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,$E=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jE=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qE=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ZE=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,KE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,JE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,QE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ew=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,iw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ow=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,aw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,cw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,uw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dw=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,pw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_w=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,gw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xw=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,yw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,bw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Sw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ew=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ww=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Tw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Aw=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Rw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Cw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Pw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Dw=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Lw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Iw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Uw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Nw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Fw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ow=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bw=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,kw=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,zw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Gw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ww=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Xw=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$w=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Kw=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Jw=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Qw=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,eT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nT=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,iT=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,sT=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,oT=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,aT=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lT=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,cT=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uT=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fT=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,hT=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dT=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pT=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,mT=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_T=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gT=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vT=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,xT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yT=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bT=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ST=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,MT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,je={alphahash_fragment:XM,alphahash_pars_fragment:YM,alphamap_fragment:$M,alphamap_pars_fragment:jM,alphatest_fragment:qM,alphatest_pars_fragment:ZM,aomap_fragment:KM,aomap_pars_fragment:JM,batching_pars_vertex:QM,batching_vertex:eE,begin_vertex:tE,beginnormal_vertex:nE,bsdfs:iE,iridescence_fragment:rE,bumpmap_pars_fragment:sE,clipping_planes_fragment:oE,clipping_planes_pars_fragment:aE,clipping_planes_pars_vertex:lE,clipping_planes_vertex:cE,color_fragment:uE,color_pars_fragment:fE,color_pars_vertex:hE,color_vertex:dE,common:pE,cube_uv_reflection_fragment:mE,defaultnormal_vertex:_E,displacementmap_pars_vertex:gE,displacementmap_vertex:vE,emissivemap_fragment:xE,emissivemap_pars_fragment:yE,colorspace_fragment:bE,colorspace_pars_fragment:SE,envmap_fragment:ME,envmap_common_pars_fragment:EE,envmap_pars_fragment:wE,envmap_pars_vertex:TE,envmap_physical_pars_fragment:OE,envmap_vertex:AE,fog_vertex:RE,fog_pars_vertex:CE,fog_fragment:PE,fog_pars_fragment:DE,gradientmap_pars_fragment:LE,lightmap_pars_fragment:IE,lights_lambert_fragment:UE,lights_lambert_pars_fragment:NE,lights_pars_begin:FE,lights_toon_fragment:BE,lights_toon_pars_fragment:kE,lights_phong_fragment:zE,lights_phong_pars_fragment:HE,lights_physical_fragment:VE,lights_physical_pars_fragment:GE,lights_fragment_begin:WE,lights_fragment_maps:XE,lights_fragment_end:YE,logdepthbuf_fragment:$E,logdepthbuf_pars_fragment:jE,logdepthbuf_pars_vertex:qE,logdepthbuf_vertex:ZE,map_fragment:KE,map_pars_fragment:JE,map_particle_fragment:QE,map_particle_pars_fragment:ew,metalnessmap_fragment:tw,metalnessmap_pars_fragment:nw,morphinstance_vertex:iw,morphcolor_vertex:rw,morphnormal_vertex:sw,morphtarget_pars_vertex:ow,morphtarget_vertex:aw,normal_fragment_begin:lw,normal_fragment_maps:cw,normal_pars_fragment:uw,normal_pars_vertex:fw,normal_vertex:hw,normalmap_pars_fragment:dw,clearcoat_normal_fragment_begin:pw,clearcoat_normal_fragment_maps:mw,clearcoat_pars_fragment:_w,iridescence_pars_fragment:gw,opaque_fragment:vw,packing:xw,premultiplied_alpha_fragment:yw,project_vertex:bw,dithering_fragment:Sw,dithering_pars_fragment:Mw,roughnessmap_fragment:Ew,roughnessmap_pars_fragment:ww,shadowmap_pars_fragment:Tw,shadowmap_pars_vertex:Aw,shadowmap_vertex:Rw,shadowmask_pars_fragment:Cw,skinbase_vertex:Pw,skinning_pars_vertex:Dw,skinning_vertex:Lw,skinnormal_vertex:Iw,specularmap_fragment:Uw,specularmap_pars_fragment:Nw,tonemapping_fragment:Fw,tonemapping_pars_fragment:Ow,transmission_fragment:Bw,transmission_pars_fragment:kw,uv_pars_fragment:zw,uv_pars_vertex:Hw,uv_vertex:Vw,worldpos_vertex:Gw,background_vert:Ww,background_frag:Xw,backgroundCube_vert:Yw,backgroundCube_frag:$w,cube_vert:jw,cube_frag:qw,depth_vert:Zw,depth_frag:Kw,distanceRGBA_vert:Jw,distanceRGBA_frag:Qw,equirect_vert:eT,equirect_frag:tT,linedashed_vert:nT,linedashed_frag:iT,meshbasic_vert:rT,meshbasic_frag:sT,meshlambert_vert:oT,meshlambert_frag:aT,meshmatcap_vert:lT,meshmatcap_frag:cT,meshnormal_vert:uT,meshnormal_frag:fT,meshphong_vert:hT,meshphong_frag:dT,meshphysical_vert:pT,meshphysical_frag:mT,meshtoon_vert:_T,meshtoon_frag:gT,points_vert:vT,points_frag:xT,shadow_vert:yT,shadow_frag:bT,sprite_vert:ST,sprite_frag:MT},ge={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new We(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new We(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},qn={basic:{uniforms:Jt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:Jt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Ze(0)}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:Jt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:Jt([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:Jt([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new Ze(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:Jt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:Jt([ge.points,ge.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:Jt([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:Jt([ge.common,ge.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:Jt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:Jt([ge.sprite,ge.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distanceRGBA:{uniforms:Jt([ge.common,ge.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distanceRGBA_vert,fragmentShader:je.distanceRGBA_frag},shadow:{uniforms:Jt([ge.lights,ge.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};qn.physical={uniforms:Jt([qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new We(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new We},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new We},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};const Ea={r:0,b:0,g:0},ur=new oi,ET=new lt;function wT(t,e,n,i,r,s,o){const a=new Ze(0);let l=s===!0?0:1,c,u,f=null,h=0,d=null;function _(R){let y=R.isScene===!0?R.background:null;return y&&y.isTexture&&(y=(R.backgroundBlurriness>0?n:e).get(y)),y}function g(R){let y=!1;const P=_(R);P===null?p(a,l):P&&P.isColor&&(p(P,1),y=!0);const L=t.xr.getEnvironmentBlendMode();L==="additive"?i.buffers.color.setClear(0,0,0,1,o):L==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(t.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(R,y){const P=_(y);P&&(P.isCubeTexture||P.mapping===_l)?(u===void 0&&(u=new ei(new Xo(1,1,1),new tr({name:"BackgroundCubeMaterial",uniforms:ws(qn.backgroundCube.uniforms),vertexShader:qn.backgroundCube.vertexShader,fragmentShader:qn.backgroundCube.fragmentShader,side:fn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(L,M,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),ur.copy(y.backgroundRotation),ur.x*=-1,ur.y*=-1,ur.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(ur.y*=-1,ur.z*=-1),u.material.uniforms.envMap.value=P,u.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(ET.makeRotationFromEuler(ur)),u.material.toneMapped=tt.getTransfer(P.colorSpace)!==ht,(f!==P||h!==P.version||d!==t.toneMapping)&&(u.material.needsUpdate=!0,f=P,h=P.version,d=t.toneMapping),u.layers.enableAll(),R.unshift(u,u.geometry,u.material,0,0,null)):P&&P.isTexture&&(c===void 0&&(c=new ei(new xl(2,2),new tr({name:"BackgroundMaterial",uniforms:ws(qn.background.uniforms),vertexShader:qn.background.vertexShader,fragmentShader:qn.background.fragmentShader,side:er,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=P,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=tt.getTransfer(P.colorSpace)!==ht,P.matrixAutoUpdate===!0&&P.updateMatrix(),c.material.uniforms.uvTransform.value.copy(P.matrix),(f!==P||h!==P.version||d!==t.toneMapping)&&(c.material.needsUpdate=!0,f=P,h=P.version,d=t.toneMapping),c.layers.enableAll(),R.unshift(c,c.geometry,c.material,0,0,null))}function p(R,y){R.getRGB(Ea,X_(t)),i.buffers.color.setClear(Ea.r,Ea.g,Ea.b,y,o)}function T(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(R,y=1){a.set(R),l=y,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(R){l=R,p(a,l)},render:g,addToRenderList:m,dispose:T}}function TT(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=h(null);let s=r,o=!1;function a(x,C,G,V,Z){let ee=!1;const J=f(V,G,C);s!==J&&(s=J,c(s.object)),ee=d(x,V,G,Z),ee&&_(x,V,G,Z),Z!==null&&e.update(Z,t.ELEMENT_ARRAY_BUFFER),(ee||o)&&(o=!1,y(x,C,G,V),Z!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(Z).buffer))}function l(){return t.createVertexArray()}function c(x){return t.bindVertexArray(x)}function u(x){return t.deleteVertexArray(x)}function f(x,C,G){const V=G.wireframe===!0;let Z=i[x.id];Z===void 0&&(Z={},i[x.id]=Z);let ee=Z[C.id];ee===void 0&&(ee={},Z[C.id]=ee);let J=ee[V];return J===void 0&&(J=h(l()),ee[V]=J),J}function h(x){const C=[],G=[],V=[];for(let Z=0;Z<n;Z++)C[Z]=0,G[Z]=0,V[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:G,attributeDivisors:V,object:x,attributes:{},index:null}}function d(x,C,G,V){const Z=s.attributes,ee=C.attributes;let J=0;const Q=G.getAttributes();for(const N in Q)if(Q[N].location>=0){const pe=Z[N];let Te=ee[N];if(Te===void 0&&(N==="instanceMatrix"&&x.instanceMatrix&&(Te=x.instanceMatrix),N==="instanceColor"&&x.instanceColor&&(Te=x.instanceColor)),pe===void 0||pe.attribute!==Te||Te&&pe.data!==Te.data)return!0;J++}return s.attributesNum!==J||s.index!==V}function _(x,C,G,V){const Z={},ee=C.attributes;let J=0;const Q=G.getAttributes();for(const N in Q)if(Q[N].location>=0){let pe=ee[N];pe===void 0&&(N==="instanceMatrix"&&x.instanceMatrix&&(pe=x.instanceMatrix),N==="instanceColor"&&x.instanceColor&&(pe=x.instanceColor));const Te={};Te.attribute=pe,pe&&pe.data&&(Te.data=pe.data),Z[N]=Te,J++}s.attributes=Z,s.attributesNum=J,s.index=V}function g(){const x=s.newAttributes;for(let C=0,G=x.length;C<G;C++)x[C]=0}function m(x){p(x,0)}function p(x,C){const G=s.newAttributes,V=s.enabledAttributes,Z=s.attributeDivisors;G[x]=1,V[x]===0&&(t.enableVertexAttribArray(x),V[x]=1),Z[x]!==C&&(t.vertexAttribDivisor(x,C),Z[x]=C)}function T(){const x=s.newAttributes,C=s.enabledAttributes;for(let G=0,V=C.length;G<V;G++)C[G]!==x[G]&&(t.disableVertexAttribArray(G),C[G]=0)}function R(x,C,G,V,Z,ee,J){J===!0?t.vertexAttribIPointer(x,C,G,Z,ee):t.vertexAttribPointer(x,C,G,V,Z,ee)}function y(x,C,G,V){g();const Z=V.attributes,ee=G.getAttributes(),J=C.defaultAttributeValues;for(const Q in ee){const N=ee[Q];if(N.location>=0){let ae=Z[Q];if(ae===void 0&&(Q==="instanceMatrix"&&x.instanceMatrix&&(ae=x.instanceMatrix),Q==="instanceColor"&&x.instanceColor&&(ae=x.instanceColor)),ae!==void 0){const pe=ae.normalized,Te=ae.itemSize,Fe=e.get(ae);if(Fe===void 0)continue;const it=Fe.buffer,ie=Fe.type,de=Fe.bytesPerElement,Ee=ie===t.INT||ie===t.UNSIGNED_INT||ae.gpuType===yf;if(ae.isInterleavedBufferAttribute){const _e=ae.data,Pe=_e.stride,Je=ae.offset;if(_e.isInstancedInterleavedBuffer){for(let De=0;De<N.locationSize;De++)p(N.location+De,_e.meshPerAttribute);x.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let De=0;De<N.locationSize;De++)m(N.location+De);t.bindBuffer(t.ARRAY_BUFFER,it);for(let De=0;De<N.locationSize;De++)R(N.location+De,Te/N.locationSize,ie,pe,Pe*de,(Je+Te/N.locationSize*De)*de,Ee)}else{if(ae.isInstancedBufferAttribute){for(let _e=0;_e<N.locationSize;_e++)p(N.location+_e,ae.meshPerAttribute);x.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let _e=0;_e<N.locationSize;_e++)m(N.location+_e);t.bindBuffer(t.ARRAY_BUFFER,it);for(let _e=0;_e<N.locationSize;_e++)R(N.location+_e,Te/N.locationSize,ie,pe,Te*de,Te/N.locationSize*_e*de,Ee)}}else if(J!==void 0){const pe=J[Q];if(pe!==void 0)switch(pe.length){case 2:t.vertexAttrib2fv(N.location,pe);break;case 3:t.vertexAttrib3fv(N.location,pe);break;case 4:t.vertexAttrib4fv(N.location,pe);break;default:t.vertexAttrib1fv(N.location,pe)}}}}T()}function P(){A();for(const x in i){const C=i[x];for(const G in C){const V=C[G];for(const Z in V)u(V[Z].object),delete V[Z];delete C[G]}delete i[x]}}function L(x){if(i[x.id]===void 0)return;const C=i[x.id];for(const G in C){const V=C[G];for(const Z in V)u(V[Z].object),delete V[Z];delete C[G]}delete i[x.id]}function M(x){for(const C in i){const G=i[C];if(G[x.id]===void 0)continue;const V=G[x.id];for(const Z in V)u(V[Z].object),delete V[Z];delete G[x.id]}}function A(){v(),o=!0,s!==r&&(s=r,c(s.object))}function v(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:A,resetDefaultState:v,dispose:P,releaseStatesOfGeometry:L,releaseStatesOfProgram:M,initAttributes:g,enableAttribute:m,disableUnusedAttributes:T}}function AT(t,e,n){let i;function r(c){i=c}function s(c,u){t.drawArrays(i,c,u),n.update(u,i,1)}function o(c,u,f){f!==0&&(t.drawArraysInstanced(i,c,u,f),n.update(u,i,f))}function a(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,f);let d=0;for(let _=0;_<f;_++)d+=u[_];n.update(d,i,1)}function l(c,u,f,h){if(f===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let _=0;_<c.length;_++)o(c[_],u[_],h[_]);else{d.multiDrawArraysInstancedWEBGL(i,c,0,u,0,h,0,f);let _=0;for(let g=0;g<f;g++)_+=u[g]*h[g];n.update(_,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function RT(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const M=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(M.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(M){return!(M!==Fn&&i.convert(M)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(M){const A=M===Go&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(M!==Ii&&i.convert(M)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&M!==wi&&!A)}function l(M){if(M==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";M="mediump"}return M==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=n.logarithmicDepthBuffer===!0,h=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),p=t.getParameter(t.MAX_VERTEX_ATTRIBS),T=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),R=t.getParameter(t.MAX_VARYING_VECTORS),y=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),P=_>0,L=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:h,maxTextures:d,maxVertexTextures:_,maxTextureSize:g,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:T,maxVaryings:R,maxFragmentUniforms:y,vertexTextures:P,maxSamples:L}}function CT(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new Gi,a=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const d=f.length!==0||h||i!==0||r;return r=h,i=f.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){n=u(f,h,0)},this.setState=function(f,h,d){const _=f.clippingPlanes,g=f.clipIntersection,m=f.clipShadows,p=t.get(f);if(!r||_===null||_.length===0||s&&!m)s?u(null):c();else{const T=s?0:i,R=T*4;let y=p.clippingState||null;l.value=y,y=u(_,h,R,d);for(let P=0;P!==R;++P)y[P]=n[P];p.clippingState=y,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,h,d,_){const g=f!==null?f.length:0;let m=null;if(g!==0){if(m=l.value,_!==!0||m===null){const p=d+g*4,T=h.matrixWorldInverse;a.getNormalMatrix(T),(m===null||m.length<p)&&(m=new Float32Array(p));for(let R=0,y=d;R!==g;++R,y+=4)o.copy(f[R]).applyMatrix4(T,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,m}}function PT(t){let e=new WeakMap;function n(o,a){return a===cu?o.mapping=ys:a===uu&&(o.mapping=bs),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===cu||a===uu)if(e.has(o)){const l=e.get(o).texture;return n(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new EM(l.height);return c.fromEquirectangularTexture(t,o),e.set(o,c),o.addEventListener("dispose",r),n(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const is=4,jd=[.125,.215,.35,.446,.526,.582],_r=20,bc=new Ts,qd=new Ze;let Sc=null,Mc=0,Ec=0,wc=!1;const pr=(1+Math.sqrt(5))/2,Jr=1/pr,Zd=[new O(-pr,Jr,0),new O(pr,Jr,0),new O(-Jr,0,pr),new O(Jr,0,pr),new O(0,pr,-Jr),new O(0,pr,Jr),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],DT=new O;class Kd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100,s={}){const{size:o=256,position:a=DT}=s;Sc=this._renderer.getRenderTarget(),Mc=this._renderer.getActiveCubeFace(),Ec=this._renderer.getActiveMipmapLevel(),wc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ep(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Sc,Mc,Ec),this._renderer.xr.enabled=wc,e.scissorTest=!1,wa(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===ys||e.mapping===bs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Sc=this._renderer.getRenderTarget(),Mc=this._renderer.getActiveCubeFace(),Ec=this._renderer.getActiveMipmapLevel(),wc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Qn,minFilter:Qn,generateMipmaps:!1,type:Go,format:Fn,colorSpace:Es,depthBuffer:!1},r=Jd(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Jd(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=LT(s)),this._blurMaterial=IT(s,e,n)}return r}_compileMaterial(e){const n=new ei(this._lodPlanes[0],e);this._renderer.compile(n,bc)}_sceneToCubeUV(e,n,i,r,s){const l=new gn(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(qd),f.toneMapping=Ji,f.autoClear=!1;const _=new V_({name:"PMREM.Background",side:fn,depthWrite:!1,depthTest:!1}),g=new ei(new Xo,_);let m=!1;const p=e.background;p?p.isColor&&(_.color.copy(p),e.background=null,m=!0):(_.color.copy(qd),m=!0);for(let T=0;T<6;T++){const R=T%3;R===0?(l.up.set(0,c[T],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[T],s.y,s.z)):R===1?(l.up.set(0,0,c[T]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[T],s.z)):(l.up.set(0,c[T],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[T]));const y=this._cubeSize;wa(r,R*y,T>2?y:0,y,y),f.setRenderTarget(r),m&&f.render(g,l),f.render(e,l)}g.geometry.dispose(),g.material.dispose(),f.toneMapping=d,f.autoClear=h,e.background=p}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===ys||e.mapping===bs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ep()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qd());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new ei(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;wa(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,bc)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Zd[(r-s-1)%Zd.length];this._blur(e,s-1,s,o,a)}n.autoClear=i}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new ei(this._lodPlanes[r],c),h=c.uniforms,d=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*_r-1),g=s/_,m=isFinite(s)?1+Math.floor(u*g):_r;m>_r&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_r}`);const p=[];let T=0;for(let M=0;M<_r;++M){const A=M/g,v=Math.exp(-A*A/2);p.push(v),M===0?T+=v:M<m&&(T+=2*v)}for(let M=0;M<p.length;M++)p[M]=p[M]/T;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:R}=this;h.dTheta.value=_,h.mipInt.value=R-i;const y=this._sizeLods[r],P=3*y*(r>R-is?r-R+is:0),L=4*(this._cubeSize-y);wa(n,P,L,3*y,2*y),l.setRenderTarget(n),l.render(f,bc)}}function LT(t){const e=[],n=[],i=[];let r=t;const s=t-is+1+jd.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);n.push(a);let l=1/a;o>t-is?l=jd[o-t+is-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,f=1+c,h=[u,u,f,u,f,f,u,u,f,f,u,f],d=6,_=6,g=3,m=2,p=1,T=new Float32Array(g*_*d),R=new Float32Array(m*_*d),y=new Float32Array(p*_*d);for(let L=0;L<d;L++){const M=L%3*2/3-1,A=L>2?0:-1,v=[M,A,0,M+2/3,A,0,M+2/3,A+1,0,M,A,0,M+2/3,A+1,0,M,A+1,0];T.set(v,g*_*L),R.set(h,m*_*L);const x=[L,L,L,L,L,L];y.set(x,p*_*L)}const P=new Vn;P.setAttribute("position",new hn(T,g)),P.setAttribute("uv",new hn(R,m)),P.setAttribute("faceIndex",new hn(y,p)),e.push(P),r>is&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Jd(t,e,n){const i=new Cr(t,e,n);return i.texture.mapping=_l,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function wa(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function IT(t,e,n){const i=new Float32Array(_r),r=new O(0,1,0);return new tr({name:"SphericalGaussianBlur",defines:{n:_r,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Df(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ki,depthTest:!1,depthWrite:!1})}function Qd(){return new tr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Df(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ki,depthTest:!1,depthWrite:!1})}function ep(){return new tr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Df(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ki,depthTest:!1,depthWrite:!1})}function Df(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function UT(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===cu||l===uu,u=l===ys||l===bs;if(c||u){let f=e.get(a);const h=f!==void 0?f.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return n===null&&(n=new Kd(t)),f=c?n.fromEquirectangular(a,f):n.fromCubemap(a,f),f.texture.pmremVersion=a.pmremVersion,e.set(a,f),f.texture;if(f!==void 0)return f.texture;{const d=a.image;return c&&d&&d.height>0||u&&d&&r(d)?(n===null&&(n=new Kd(t)),f=c?n.fromEquirectangular(a):n.fromCubemap(a),f.texture.pmremVersion=a.pmremVersion,e.set(a,f),a.addEventListener("dispose",s),f.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:o}}function NT(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&dr("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function FT(t,e,n,i){const r={},s=new WeakMap;function o(f){const h=f.target;h.index!==null&&e.remove(h.index);for(const _ in h.attributes)e.remove(h.attributes[_]);h.removeEventListener("dispose",o),delete r[h.id];const d=s.get(h);d&&(e.remove(d),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function a(f,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,n.memory.geometries++),h}function l(f){const h=f.attributes;for(const d in h)e.update(h[d],t.ARRAY_BUFFER)}function c(f){const h=[],d=f.index,_=f.attributes.position;let g=0;if(d!==null){const T=d.array;g=d.version;for(let R=0,y=T.length;R<y;R+=3){const P=T[R+0],L=T[R+1],M=T[R+2];h.push(P,L,L,M,M,P)}}else if(_!==void 0){const T=_.array;g=_.version;for(let R=0,y=T.length/3-1;R<y;R+=3){const P=R+0,L=R+1,M=R+2;h.push(P,L,L,M,M,P)}}else return;const m=new(k_(h)?W_:G_)(h,1);m.version=g;const p=s.get(f);p&&e.remove(p),s.set(f,m)}function u(f){const h=s.get(f);if(h){const d=f.index;d!==null&&h.version<d.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:u}}function OT(t,e,n){let i;function r(h){i=h}let s,o;function a(h){s=h.type,o=h.bytesPerElement}function l(h,d){t.drawElements(i,d,s,h*o),n.update(d,i,1)}function c(h,d,_){_!==0&&(t.drawElementsInstanced(i,d,s,h*o,_),n.update(d,i,_))}function u(h,d,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,h,0,_);let m=0;for(let p=0;p<_;p++)m+=d[p];n.update(m,i,1)}function f(h,d,_,g){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)c(h[p]/o,d[p],g[p]);else{m.multiDrawElementsInstancedWEBGL(i,d,0,s,h,0,g,0,_);let p=0;for(let T=0;T<_;T++)p+=d[T]*g[T];n.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function BT(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function kT(t,e,n){const i=new WeakMap,r=new bt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0;let h=i.get(a);if(h===void 0||h.count!==f){let x=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",x)};var d=x;h!==void 0&&h.texture.dispose();const _=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],T=a.morphAttributes.normal||[],R=a.morphAttributes.color||[];let y=0;_===!0&&(y=1),g===!0&&(y=2),m===!0&&(y=3);let P=a.attributes.position.count*y,L=1;P>e.maxTextureSize&&(L=Math.ceil(P/e.maxTextureSize),P=e.maxTextureSize);const M=new Float32Array(P*L*4*f),A=new z_(M,P,L,f);A.type=wi,A.needsUpdate=!0;const v=y*4;for(let C=0;C<f;C++){const G=p[C],V=T[C],Z=R[C],ee=P*L*4*C;for(let J=0;J<G.count;J++){const Q=J*v;_===!0&&(r.fromBufferAttribute(G,J),M[ee+Q+0]=r.x,M[ee+Q+1]=r.y,M[ee+Q+2]=r.z,M[ee+Q+3]=0),g===!0&&(r.fromBufferAttribute(V,J),M[ee+Q+4]=r.x,M[ee+Q+5]=r.y,M[ee+Q+6]=r.z,M[ee+Q+7]=0),m===!0&&(r.fromBufferAttribute(Z,J),M[ee+Q+8]=r.x,M[ee+Q+9]=r.y,M[ee+Q+10]=r.z,M[ee+Q+11]=Z.itemSize===4?r.w:1)}}h={count:f,texture:A,size:new We(P,L)},i.set(a,h),a.addEventListener("dispose",x)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let _=0;for(let m=0;m<c.length;m++)_+=c[m];const g=a.morphTargetsRelative?1:1-_;l.getUniforms().setValue(t,"morphTargetBaseInfluence",g),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:s}}function zT(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return f}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:o}}const eg=new sn,tp=new Z_(1,1),tg=new z_,ng=new aM,ig=new $_,np=[],ip=[],rp=new Float32Array(16),sp=new Float32Array(9),op=new Float32Array(4);function Us(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=np[r];if(s===void 0&&(s=new Float32Array(r),np[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function Lt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function It(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function yl(t,e){let n=ip[e];n===void 0&&(n=new Int32Array(e),ip[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function HT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function VT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2fv(this.addr,e),It(n,e)}}function GT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Lt(n,e))return;t.uniform3fv(this.addr,e),It(n,e)}}function WT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4fv(this.addr,e),It(n,e)}}function XT(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),It(n,e)}else{if(Lt(n,i))return;op.set(i),t.uniformMatrix2fv(this.addr,!1,op),It(n,i)}}function YT(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),It(n,e)}else{if(Lt(n,i))return;sp.set(i),t.uniformMatrix3fv(this.addr,!1,sp),It(n,i)}}function $T(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),It(n,e)}else{if(Lt(n,i))return;rp.set(i),t.uniformMatrix4fv(this.addr,!1,rp),It(n,i)}}function jT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function qT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2iv(this.addr,e),It(n,e)}}function ZT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Lt(n,e))return;t.uniform3iv(this.addr,e),It(n,e)}}function KT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4iv(this.addr,e),It(n,e)}}function JT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function QT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2uiv(this.addr,e),It(n,e)}}function e1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Lt(n,e))return;t.uniform3uiv(this.addr,e),It(n,e)}}function t1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4uiv(this.addr,e),It(n,e)}}function n1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(tp.compareFunction=B_,s=tp):s=eg,n.setTexture2D(e||s,r)}function i1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||ng,r)}function r1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||ig,r)}function s1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||tg,r)}function o1(t){switch(t){case 5126:return HT;case 35664:return VT;case 35665:return GT;case 35666:return WT;case 35674:return XT;case 35675:return YT;case 35676:return $T;case 5124:case 35670:return jT;case 35667:case 35671:return qT;case 35668:case 35672:return ZT;case 35669:case 35673:return KT;case 5125:return JT;case 36294:return QT;case 36295:return e1;case 36296:return t1;case 35678:case 36198:case 36298:case 36306:case 35682:return n1;case 35679:case 36299:case 36307:return i1;case 35680:case 36300:case 36308:case 36293:return r1;case 36289:case 36303:case 36311:case 36292:return s1}}function a1(t,e){t.uniform1fv(this.addr,e)}function l1(t,e){const n=Us(e,this.size,2);t.uniform2fv(this.addr,n)}function c1(t,e){const n=Us(e,this.size,3);t.uniform3fv(this.addr,n)}function u1(t,e){const n=Us(e,this.size,4);t.uniform4fv(this.addr,n)}function f1(t,e){const n=Us(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function h1(t,e){const n=Us(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function d1(t,e){const n=Us(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function p1(t,e){t.uniform1iv(this.addr,e)}function m1(t,e){t.uniform2iv(this.addr,e)}function _1(t,e){t.uniform3iv(this.addr,e)}function g1(t,e){t.uniform4iv(this.addr,e)}function v1(t,e){t.uniform1uiv(this.addr,e)}function x1(t,e){t.uniform2uiv(this.addr,e)}function y1(t,e){t.uniform3uiv(this.addr,e)}function b1(t,e){t.uniform4uiv(this.addr,e)}function S1(t,e,n){const i=this.cache,r=e.length,s=yl(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let o=0;o!==r;++o)n.setTexture2D(e[o]||eg,s[o])}function M1(t,e,n){const i=this.cache,r=e.length,s=yl(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||ng,s[o])}function E1(t,e,n){const i=this.cache,r=e.length,s=yl(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||ig,s[o])}function w1(t,e,n){const i=this.cache,r=e.length,s=yl(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||tg,s[o])}function T1(t){switch(t){case 5126:return a1;case 35664:return l1;case 35665:return c1;case 35666:return u1;case 35674:return f1;case 35675:return h1;case 35676:return d1;case 5124:case 35670:return p1;case 35667:case 35671:return m1;case 35668:case 35672:return _1;case 35669:case 35673:return g1;case 5125:return v1;case 36294:return x1;case 36295:return y1;case 36296:return b1;case 35678:case 36198:case 36298:case 36306:case 35682:return S1;case 35679:case 36299:case 36307:return M1;case 35680:case 36300:case 36308:case 36293:return E1;case 36289:case 36303:case 36311:case 36292:return w1}}class A1{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=o1(n.type)}}class R1{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=T1(n.type)}}class C1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const Tc=/(\w+)(\])?(\[|\.)?/g;function ap(t,e){t.seq.push(e),t.map[e.id]=e}function P1(t,e,n){const i=t.name,r=i.length;for(Tc.lastIndex=0;;){const s=Tc.exec(i),o=Tc.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){ap(n,c===void 0?new A1(a,t,e):new R1(a,t,e));break}else{let f=n.map[a];f===void 0&&(f=new C1(a),ap(n,f)),n=f}}}class za{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),o=e.getUniformLocation(n,s.name);P1(s,o,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function lp(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const D1=37297;let L1=0;function I1(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}const cp=new $e;function U1(t){tt._getMatrix(cp,tt.workingColorSpace,t);const e=`mat3( ${cp.elements.map(n=>n.toFixed(4))} )`;switch(tt.getTransfer(t)){case Ka:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function up(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+I1(t.getShaderSource(e),o)}else return r}function N1(t,e){const n=U1(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function F1(t,e){let n;switch(e){case vS:n="Linear";break;case xS:n="Reinhard";break;case yS:n="Cineon";break;case bS:n="ACESFilmic";break;case MS:n="AgX";break;case ES:n="Neutral";break;case SS:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Ta=new O;function O1(){tt.getLuminanceCoefficients(Ta);const t=Ta.x.toFixed(4),e=Ta.y.toFixed(4),n=Ta.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function B1(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(eo).join(`
`)}function k1(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function z1(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function eo(t){return t!==""}function fp(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function hp(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const H1=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gu(t){return t.replace(H1,G1)}const V1=new Map;function G1(t,e){let n=je[e];if(n===void 0){const i=V1.get(e);if(i!==void 0)n=je[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Gu(n)}const W1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function dp(t){return t.replace(W1,X1)}function X1(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function pp(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Y1(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===E_?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===Kb?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===_i&&(e="SHADOWMAP_TYPE_VSM"),e}function $1(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case ys:case bs:e="ENVMAP_TYPE_CUBE";break;case _l:e="ENVMAP_TYPE_CUBE_UV";break}return e}function j1(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case bs:e="ENVMAP_MODE_REFRACTION";break}return e}function q1(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case w_:e="ENVMAP_BLENDING_MULTIPLY";break;case _S:e="ENVMAP_BLENDING_MIX";break;case gS:e="ENVMAP_BLENDING_ADD";break}return e}function Z1(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function K1(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=Y1(n),c=$1(n),u=j1(n),f=q1(n),h=Z1(n),d=B1(n),_=k1(s),g=r.createProgram();let m,p,T=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(eo).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(eo).join(`
`),p.length>0&&(p+=`
`)):(m=[pp(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(eo).join(`
`),p=[pp(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Ji?"#define TONE_MAPPING":"",n.toneMapping!==Ji?je.tonemapping_pars_fragment:"",n.toneMapping!==Ji?F1("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,N1("linearToOutputTexel",n.outputColorSpace),O1(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(eo).join(`
`)),o=Gu(o),o=fp(o,n),o=hp(o,n),a=Gu(a),a=fp(a,n),a=hp(a,n),o=dp(o),a=dp(a),n.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",n.glslVersion===gd?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===gd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const R=T+m+o,y=T+p+a,P=lp(r,r.VERTEX_SHADER,R),L=lp(r,r.FRAGMENT_SHADER,y);r.attachShader(g,P),r.attachShader(g,L),n.index0AttributeName!==void 0?r.bindAttribLocation(g,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(g,0,"position"),r.linkProgram(g);function M(C){if(t.debug.checkShaderErrors){const G=r.getProgramInfoLog(g).trim(),V=r.getShaderInfoLog(P).trim(),Z=r.getShaderInfoLog(L).trim();let ee=!0,J=!0;if(r.getProgramParameter(g,r.LINK_STATUS)===!1)if(ee=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,g,P,L);else{const Q=up(r,P,"vertex"),N=up(r,L,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(g,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+G+`
`+Q+`
`+N)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(V===""||Z==="")&&(J=!1);J&&(C.diagnostics={runnable:ee,programLog:G,vertexShader:{log:V,prefix:m},fragmentShader:{log:Z,prefix:p}})}r.deleteShader(P),r.deleteShader(L),A=new za(r,g),v=z1(r,g)}let A;this.getUniforms=function(){return A===void 0&&M(this),A};let v;this.getAttributes=function(){return v===void 0&&M(this),v};let x=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=r.getProgramParameter(g,D1)),x},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(g),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=L1++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=P,this.fragmentShader=L,this}let J1=0;class Q1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new eA(e),n.set(e,i)),i}}class eA{constructor(e){this.id=J1++,this.code=e,this.usedTimes=0}}function tA(t,e,n,i,r,s,o){const a=new Rf,l=new Q1,c=new Set,u=[],f=r.logarithmicDepthBuffer,h=r.vertexTextures;let d=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return c.add(v),v===0?"uv":`uv${v}`}function m(v,x,C,G,V){const Z=G.fog,ee=V.geometry,J=v.isMeshStandardMaterial?G.environment:null,Q=(v.isMeshStandardMaterial?n:e).get(v.envMap||J),N=Q&&Q.mapping===_l?Q.image.height:null,ae=_[v.type];v.precision!==null&&(d=r.getMaxPrecision(v.precision),d!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",d,"instead."));const pe=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,Te=pe!==void 0?pe.length:0;let Fe=0;ee.morphAttributes.position!==void 0&&(Fe=1),ee.morphAttributes.normal!==void 0&&(Fe=2),ee.morphAttributes.color!==void 0&&(Fe=3);let it,ie,de,Ee;if(ae){const ut=qn[ae];it=ut.vertexShader,ie=ut.fragmentShader}else it=v.vertexShader,ie=v.fragmentShader,l.update(v),de=l.getVertexShaderID(v),Ee=l.getFragmentShaderID(v);const _e=t.getRenderTarget(),Pe=t.state.buffers.depth.getReversed(),Je=V.isInstancedMesh===!0,De=V.isBatchedMesh===!0,St=!!v.map,D=!!v.matcap,U=!!Q,E=!!v.aoMap,re=!!v.lightMap,q=!!v.bumpMap,K=!!v.normalMap,te=!!v.displacementMap,oe=!!v.emissiveMap,j=!!v.metalnessMap,S=!!v.roughnessMap,b=v.anisotropy>0,I=v.clearcoat>0,H=v.dispersion>0,W=v.iridescence>0,X=v.sheen>0,he=v.transmission>0,le=b&&!!v.anisotropyMap,fe=I&&!!v.clearcoatMap,Ie=I&&!!v.clearcoatNormalMap,ce=I&&!!v.clearcoatRoughnessMap,ve=W&&!!v.iridescenceMap,Ce=W&&!!v.iridescenceThicknessMap,Oe=X&&!!v.sheenColorMap,me=X&&!!v.sheenRoughnessMap,ke=!!v.specularMap,Ge=!!v.specularColorMap,ct=!!v.specularIntensityMap,F=he&&!!v.transmissionMap,xe=he&&!!v.thicknessMap,ne=!!v.gradientMap,se=!!v.alphaMap,Se=v.alphaTest>0,be=!!v.alphaHash,Ye=!!v.extensions;let Mt=Ji;v.toneMapped&&(_e===null||_e.isXRRenderTarget===!0)&&(Mt=t.toneMapping);const Gt={shaderID:ae,shaderType:v.type,shaderName:v.name,vertexShader:it,fragmentShader:ie,defines:v.defines,customVertexShaderID:de,customFragmentShaderID:Ee,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:d,batching:De,batchingColor:De&&V._colorsTexture!==null,instancing:Je,instancingColor:Je&&V.instanceColor!==null,instancingMorph:Je&&V.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:_e===null?t.outputColorSpace:_e.isXRRenderTarget===!0?_e.texture.colorSpace:Es,alphaToCoverage:!!v.alphaToCoverage,map:St,matcap:D,envMap:U,envMapMode:U&&Q.mapping,envMapCubeUVHeight:N,aoMap:E,lightMap:re,bumpMap:q,normalMap:K,displacementMap:h&&te,emissiveMap:oe,normalMapObjectSpace:K&&v.normalMapType===RS,normalMapTangentSpace:K&&v.normalMapType===O_,metalnessMap:j,roughnessMap:S,anisotropy:b,anisotropyMap:le,clearcoat:I,clearcoatMap:fe,clearcoatNormalMap:Ie,clearcoatRoughnessMap:ce,dispersion:H,iridescence:W,iridescenceMap:ve,iridescenceThicknessMap:Ce,sheen:X,sheenColorMap:Oe,sheenRoughnessMap:me,specularMap:ke,specularColorMap:Ge,specularIntensityMap:ct,transmission:he,transmissionMap:F,thicknessMap:xe,gradientMap:ne,opaque:v.transparent===!1&&v.blending===us&&v.alphaToCoverage===!1,alphaMap:se,alphaTest:Se,alphaHash:be,combine:v.combine,mapUv:St&&g(v.map.channel),aoMapUv:E&&g(v.aoMap.channel),lightMapUv:re&&g(v.lightMap.channel),bumpMapUv:q&&g(v.bumpMap.channel),normalMapUv:K&&g(v.normalMap.channel),displacementMapUv:te&&g(v.displacementMap.channel),emissiveMapUv:oe&&g(v.emissiveMap.channel),metalnessMapUv:j&&g(v.metalnessMap.channel),roughnessMapUv:S&&g(v.roughnessMap.channel),anisotropyMapUv:le&&g(v.anisotropyMap.channel),clearcoatMapUv:fe&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:Ie&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ce&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:ve&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:me&&g(v.sheenRoughnessMap.channel),specularMapUv:ke&&g(v.specularMap.channel),specularColorMapUv:Ge&&g(v.specularColorMap.channel),specularIntensityMapUv:ct&&g(v.specularIntensityMap.channel),transmissionMapUv:F&&g(v.transmissionMap.channel),thicknessMapUv:xe&&g(v.thicknessMap.channel),alphaMapUv:se&&g(v.alphaMap.channel),vertexTangents:!!ee.attributes.tangent&&(K||b),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!ee.attributes.uv&&(St||se),fog:!!Z,useFog:v.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Pe,skinning:V.isSkinnedMesh===!0,morphTargets:ee.morphAttributes.position!==void 0,morphNormals:ee.morphAttributes.normal!==void 0,morphColors:ee.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:Fe,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:t.shadowMap.enabled&&C.length>0,shadowMapType:t.shadowMap.type,toneMapping:Mt,decodeVideoTexture:St&&v.map.isVideoTexture===!0&&tt.getTransfer(v.map.colorSpace)===ht,decodeVideoTextureEmissive:oe&&v.emissiveMap.isVideoTexture===!0&&tt.getTransfer(v.emissiveMap.colorSpace)===ht,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Mi,flipSided:v.side===fn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Ye&&v.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ye&&v.extensions.multiDraw===!0||De)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Gt.vertexUv1s=c.has(1),Gt.vertexUv2s=c.has(2),Gt.vertexUv3s=c.has(3),c.clear(),Gt}function p(v){const x=[];if(v.shaderID?x.push(v.shaderID):(x.push(v.customVertexShaderID),x.push(v.customFragmentShaderID)),v.defines!==void 0)for(const C in v.defines)x.push(C),x.push(v.defines[C]);return v.isRawShaderMaterial===!1&&(T(x,v),R(x,v),x.push(t.outputColorSpace)),x.push(v.customProgramCacheKey),x.join()}function T(v,x){v.push(x.precision),v.push(x.outputColorSpace),v.push(x.envMapMode),v.push(x.envMapCubeUVHeight),v.push(x.mapUv),v.push(x.alphaMapUv),v.push(x.lightMapUv),v.push(x.aoMapUv),v.push(x.bumpMapUv),v.push(x.normalMapUv),v.push(x.displacementMapUv),v.push(x.emissiveMapUv),v.push(x.metalnessMapUv),v.push(x.roughnessMapUv),v.push(x.anisotropyMapUv),v.push(x.clearcoatMapUv),v.push(x.clearcoatNormalMapUv),v.push(x.clearcoatRoughnessMapUv),v.push(x.iridescenceMapUv),v.push(x.iridescenceThicknessMapUv),v.push(x.sheenColorMapUv),v.push(x.sheenRoughnessMapUv),v.push(x.specularMapUv),v.push(x.specularColorMapUv),v.push(x.specularIntensityMapUv),v.push(x.transmissionMapUv),v.push(x.thicknessMapUv),v.push(x.combine),v.push(x.fogExp2),v.push(x.sizeAttenuation),v.push(x.morphTargetsCount),v.push(x.morphAttributeCount),v.push(x.numDirLights),v.push(x.numPointLights),v.push(x.numSpotLights),v.push(x.numSpotLightMaps),v.push(x.numHemiLights),v.push(x.numRectAreaLights),v.push(x.numDirLightShadows),v.push(x.numPointLightShadows),v.push(x.numSpotLightShadows),v.push(x.numSpotLightShadowsWithMaps),v.push(x.numLightProbes),v.push(x.shadowMapType),v.push(x.toneMapping),v.push(x.numClippingPlanes),v.push(x.numClipIntersection),v.push(x.depthPacking)}function R(v,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),v.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reverseDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),v.push(a.mask)}function y(v){const x=_[v.type];let C;if(x){const G=qn[x];C=yM.clone(G.uniforms)}else C=v.uniforms;return C}function P(v,x){let C;for(let G=0,V=u.length;G<V;G++){const Z=u[G];if(Z.cacheKey===x){C=Z,++C.usedTimes;break}}return C===void 0&&(C=new K1(t,x,v,s),u.push(C)),C}function L(v){if(--v.usedTimes===0){const x=u.indexOf(v);u[x]=u[u.length-1],u.pop(),v.destroy()}}function M(v){l.remove(v)}function A(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:P,releaseProgram:L,releaseShaderCache:M,programs:u,dispose:A}}function nA(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,l){t.get(o)[a]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function iA(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function mp(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function _p(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(f,h,d,_,g,m){let p=t[e];return p===void 0?(p={id:f.id,object:f,geometry:h,material:d,groupOrder:_,renderOrder:f.renderOrder,z:g,group:m},t[e]=p):(p.id=f.id,p.object=f,p.geometry=h,p.material=d,p.groupOrder=_,p.renderOrder=f.renderOrder,p.z=g,p.group=m),e++,p}function a(f,h,d,_,g,m){const p=o(f,h,d,_,g,m);d.transmission>0?i.push(p):d.transparent===!0?r.push(p):n.push(p)}function l(f,h,d,_,g,m){const p=o(f,h,d,_,g,m);d.transmission>0?i.unshift(p):d.transparent===!0?r.unshift(p):n.unshift(p)}function c(f,h){n.length>1&&n.sort(f||iA),i.length>1&&i.sort(h||mp),r.length>1&&r.sort(h||mp)}function u(){for(let f=e,h=t.length;f<h;f++){const d=t[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function rA(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new _p,t.set(i,[o])):r>=s.length?(o=new _p,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function sA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new O,color:new Ze};break;case"SpotLight":n={position:new O,direction:new O,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new O,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":n={direction:new O,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":n={color:new Ze,position:new O,halfWidth:new O,halfHeight:new O};break}return t[e.id]=n,n}}}function oA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let aA=0;function lA(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function cA(t){const e=new sA,n=oA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new O);const r=new O,s=new lt,o=new lt;function a(c){let u=0,f=0,h=0;for(let v=0;v<9;v++)i.probe[v].set(0,0,0);let d=0,_=0,g=0,m=0,p=0,T=0,R=0,y=0,P=0,L=0,M=0;c.sort(lA);for(let v=0,x=c.length;v<x;v++){const C=c[v],G=C.color,V=C.intensity,Z=C.distance,ee=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=G.r*V,f+=G.g*V,h+=G.b*V;else if(C.isLightProbe){for(let J=0;J<9;J++)i.probe[J].addScaledVector(C.sh.coefficients[J],V);M++}else if(C.isDirectionalLight){const J=e.get(C);if(J.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const Q=C.shadow,N=n.get(C);N.shadowIntensity=Q.intensity,N.shadowBias=Q.bias,N.shadowNormalBias=Q.normalBias,N.shadowRadius=Q.radius,N.shadowMapSize=Q.mapSize,i.directionalShadow[d]=N,i.directionalShadowMap[d]=ee,i.directionalShadowMatrix[d]=C.shadow.matrix,T++}i.directional[d]=J,d++}else if(C.isSpotLight){const J=e.get(C);J.position.setFromMatrixPosition(C.matrixWorld),J.color.copy(G).multiplyScalar(V),J.distance=Z,J.coneCos=Math.cos(C.angle),J.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),J.decay=C.decay,i.spot[g]=J;const Q=C.shadow;if(C.map&&(i.spotLightMap[P]=C.map,P++,Q.updateMatrices(C),C.castShadow&&L++),i.spotLightMatrix[g]=Q.matrix,C.castShadow){const N=n.get(C);N.shadowIntensity=Q.intensity,N.shadowBias=Q.bias,N.shadowNormalBias=Q.normalBias,N.shadowRadius=Q.radius,N.shadowMapSize=Q.mapSize,i.spotShadow[g]=N,i.spotShadowMap[g]=ee,y++}g++}else if(C.isRectAreaLight){const J=e.get(C);J.color.copy(G).multiplyScalar(V),J.halfWidth.set(C.width*.5,0,0),J.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=J,m++}else if(C.isPointLight){const J=e.get(C);if(J.color.copy(C.color).multiplyScalar(C.intensity),J.distance=C.distance,J.decay=C.decay,C.castShadow){const Q=C.shadow,N=n.get(C);N.shadowIntensity=Q.intensity,N.shadowBias=Q.bias,N.shadowNormalBias=Q.normalBias,N.shadowRadius=Q.radius,N.shadowMapSize=Q.mapSize,N.shadowCameraNear=Q.camera.near,N.shadowCameraFar=Q.camera.far,i.pointShadow[_]=N,i.pointShadowMap[_]=ee,i.pointShadowMatrix[_]=C.shadow.matrix,R++}i.point[_]=J,_++}else if(C.isHemisphereLight){const J=e.get(C);J.skyColor.copy(C.color).multiplyScalar(V),J.groundColor.copy(C.groundColor).multiplyScalar(V),i.hemi[p]=J,p++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ge.LTC_FLOAT_1,i.rectAreaLTC2=ge.LTC_FLOAT_2):(i.rectAreaLTC1=ge.LTC_HALF_1,i.rectAreaLTC2=ge.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=h;const A=i.hash;(A.directionalLength!==d||A.pointLength!==_||A.spotLength!==g||A.rectAreaLength!==m||A.hemiLength!==p||A.numDirectionalShadows!==T||A.numPointShadows!==R||A.numSpotShadows!==y||A.numSpotMaps!==P||A.numLightProbes!==M)&&(i.directional.length=d,i.spot.length=g,i.rectArea.length=m,i.point.length=_,i.hemi.length=p,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.pointShadow.length=R,i.pointShadowMap.length=R,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=T,i.pointShadowMatrix.length=R,i.spotLightMatrix.length=y+P-L,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=L,i.numLightProbes=M,A.directionalLength=d,A.pointLength=_,A.spotLength=g,A.rectAreaLength=m,A.hemiLength=p,A.numDirectionalShadows=T,A.numPointShadows=R,A.numSpotShadows=y,A.numSpotMaps=P,A.numLightProbes=M,i.version=aA++)}function l(c,u){let f=0,h=0,d=0,_=0,g=0;const m=u.matrixWorldInverse;for(let p=0,T=c.length;p<T;p++){const R=c[p];if(R.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(R.matrixWorld),r.setFromMatrixPosition(R.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),f++}else if(R.isSpotLight){const y=i.spot[d];y.position.setFromMatrixPosition(R.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(R.matrixWorld),r.setFromMatrixPosition(R.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),d++}else if(R.isRectAreaLight){const y=i.rectArea[_];y.position.setFromMatrixPosition(R.matrixWorld),y.position.applyMatrix4(m),o.identity(),s.copy(R.matrixWorld),s.premultiply(m),o.extractRotation(s),y.halfWidth.set(R.width*.5,0,0),y.halfHeight.set(0,R.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),_++}else if(R.isPointLight){const y=i.point[h];y.position.setFromMatrixPosition(R.matrixWorld),y.position.applyMatrix4(m),h++}else if(R.isHemisphereLight){const y=i.hemi[g];y.direction.setFromMatrixPosition(R.matrixWorld),y.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:i}}function gp(t){const e=new cA(t),n=[],i=[];function r(u){c.camera=u,n.length=0,i.length=0}function s(u){n.push(u)}function o(u){i.push(u)}function a(){e.setup(n)}function l(u){e.setupView(n,u)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function uA(t){let e=new WeakMap;function n(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new gp(t),e.set(r,[a])):s>=o.length?(a=new gp(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}const fA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hA=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function dA(t,e,n){let i=new Cf;const r=new We,s=new We,o=new bt,a=new PM({depthPacking:AS}),l=new DM,c={},u=n.maxTextureSize,f={[er]:fn,[fn]:er,[Mi]:Mi},h=new tr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new We},radius:{value:4}},vertexShader:fA,fragmentShader:hA}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const _=new Vn;_.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new ei(_,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=E_;let p=this.type;this.render=function(L,M,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||L.length===0)return;const v=t.getRenderTarget(),x=t.getActiveCubeFace(),C=t.getActiveMipmapLevel(),G=t.state;G.setBlending(Ki),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const V=p!==_i&&this.type===_i,Z=p===_i&&this.type!==_i;for(let ee=0,J=L.length;ee<J;ee++){const Q=L[ee],N=Q.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);const ae=N.getFrameExtents();if(r.multiply(ae),s.copy(N.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ae.x),r.x=s.x*ae.x,N.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ae.y),r.y=s.y*ae.y,N.mapSize.y=s.y)),N.map===null||V===!0||Z===!0){const Te=this.type!==_i?{minFilter:yn,magFilter:yn}:{};N.map!==null&&N.map.dispose(),N.map=new Cr(r.x,r.y,Te),N.map.texture.name=Q.name+".shadowMap",N.camera.updateProjectionMatrix()}t.setRenderTarget(N.map),t.clear();const pe=N.getViewportCount();for(let Te=0;Te<pe;Te++){const Fe=N.getViewport(Te);o.set(s.x*Fe.x,s.y*Fe.y,s.x*Fe.z,s.y*Fe.w),G.viewport(o),N.updateMatrices(Q,Te),i=N.getFrustum(),y(M,A,N.camera,Q,this.type)}N.isPointLightShadow!==!0&&this.type===_i&&T(N,A),N.needsUpdate=!1}p=this.type,m.needsUpdate=!1,t.setRenderTarget(v,x,C)};function T(L,M){const A=e.update(g);h.defines.VSM_SAMPLES!==L.blurSamples&&(h.defines.VSM_SAMPLES=L.blurSamples,d.defines.VSM_SAMPLES=L.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),L.mapPass===null&&(L.mapPass=new Cr(r.x,r.y)),h.uniforms.shadow_pass.value=L.map.texture,h.uniforms.resolution.value=L.mapSize,h.uniforms.radius.value=L.radius,t.setRenderTarget(L.mapPass),t.clear(),t.renderBufferDirect(M,null,A,h,g,null),d.uniforms.shadow_pass.value=L.mapPass.texture,d.uniforms.resolution.value=L.mapSize,d.uniforms.radius.value=L.radius,t.setRenderTarget(L.map),t.clear(),t.renderBufferDirect(M,null,A,d,g,null)}function R(L,M,A,v){let x=null;const C=A.isPointLight===!0?L.customDistanceMaterial:L.customDepthMaterial;if(C!==void 0)x=C;else if(x=A.isPointLight===!0?l:a,t.localClippingEnabled&&M.clipShadows===!0&&Array.isArray(M.clippingPlanes)&&M.clippingPlanes.length!==0||M.displacementMap&&M.displacementScale!==0||M.alphaMap&&M.alphaTest>0||M.map&&M.alphaTest>0){const G=x.uuid,V=M.uuid;let Z=c[G];Z===void 0&&(Z={},c[G]=Z);let ee=Z[V];ee===void 0&&(ee=x.clone(),Z[V]=ee,M.addEventListener("dispose",P)),x=ee}if(x.visible=M.visible,x.wireframe=M.wireframe,v===_i?x.side=M.shadowSide!==null?M.shadowSide:M.side:x.side=M.shadowSide!==null?M.shadowSide:f[M.side],x.alphaMap=M.alphaMap,x.alphaTest=M.alphaTest,x.map=M.map,x.clipShadows=M.clipShadows,x.clippingPlanes=M.clippingPlanes,x.clipIntersection=M.clipIntersection,x.displacementMap=M.displacementMap,x.displacementScale=M.displacementScale,x.displacementBias=M.displacementBias,x.wireframeLinewidth=M.wireframeLinewidth,x.linewidth=M.linewidth,A.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const G=t.properties.get(x);G.light=A}return x}function y(L,M,A,v,x){if(L.visible===!1)return;if(L.layers.test(M.layers)&&(L.isMesh||L.isLine||L.isPoints)&&(L.castShadow||L.receiveShadow&&x===_i)&&(!L.frustumCulled||i.intersectsObject(L))){L.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,L.matrixWorld);const V=e.update(L),Z=L.material;if(Array.isArray(Z)){const ee=V.groups;for(let J=0,Q=ee.length;J<Q;J++){const N=ee[J],ae=Z[N.materialIndex];if(ae&&ae.visible){const pe=R(L,ae,v,x);L.onBeforeShadow(t,L,M,A,V,pe,N),t.renderBufferDirect(A,null,V,pe,L,N),L.onAfterShadow(t,L,M,A,V,pe,N)}}}else if(Z.visible){const ee=R(L,Z,v,x);L.onBeforeShadow(t,L,M,A,V,ee,null),t.renderBufferDirect(A,null,V,ee,L,null),L.onAfterShadow(t,L,M,A,V,ee,null)}}const G=L.children;for(let V=0,Z=G.length;V<Z;V++)y(G[V],M,A,v,x)}function P(L){L.target.removeEventListener("dispose",P);for(const A in c){const v=c[A],x=L.target.uuid;x in v&&(v[x].dispose(),delete v[x])}}}const pA={[nu]:iu,[ru]:au,[su]:lu,[xs]:ou,[iu]:nu,[au]:ru,[lu]:su,[ou]:xs};function mA(t,e){function n(){let F=!1;const xe=new bt;let ne=null;const se=new bt(0,0,0,0);return{setMask:function(Se){ne!==Se&&!F&&(t.colorMask(Se,Se,Se,Se),ne=Se)},setLocked:function(Se){F=Se},setClear:function(Se,be,Ye,Mt,Gt){Gt===!0&&(Se*=Mt,be*=Mt,Ye*=Mt),xe.set(Se,be,Ye,Mt),se.equals(xe)===!1&&(t.clearColor(Se,be,Ye,Mt),se.copy(xe))},reset:function(){F=!1,ne=null,se.set(-1,0,0,0)}}}function i(){let F=!1,xe=!1,ne=null,se=null,Se=null;return{setReversed:function(be){if(xe!==be){const Ye=e.get("EXT_clip_control");xe?Ye.clipControlEXT(Ye.LOWER_LEFT_EXT,Ye.ZERO_TO_ONE_EXT):Ye.clipControlEXT(Ye.LOWER_LEFT_EXT,Ye.NEGATIVE_ONE_TO_ONE_EXT);const Mt=Se;Se=null,this.setClear(Mt)}xe=be},getReversed:function(){return xe},setTest:function(be){be?_e(t.DEPTH_TEST):Pe(t.DEPTH_TEST)},setMask:function(be){ne!==be&&!F&&(t.depthMask(be),ne=be)},setFunc:function(be){if(xe&&(be=pA[be]),se!==be){switch(be){case nu:t.depthFunc(t.NEVER);break;case iu:t.depthFunc(t.ALWAYS);break;case ru:t.depthFunc(t.LESS);break;case xs:t.depthFunc(t.LEQUAL);break;case su:t.depthFunc(t.EQUAL);break;case ou:t.depthFunc(t.GEQUAL);break;case au:t.depthFunc(t.GREATER);break;case lu:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}se=be}},setLocked:function(be){F=be},setClear:function(be){Se!==be&&(xe&&(be=1-be),t.clearDepth(be),Se=be)},reset:function(){F=!1,ne=null,se=null,Se=null,xe=!1}}}function r(){let F=!1,xe=null,ne=null,se=null,Se=null,be=null,Ye=null,Mt=null,Gt=null;return{setTest:function(ut){F||(ut?_e(t.STENCIL_TEST):Pe(t.STENCIL_TEST))},setMask:function(ut){xe!==ut&&!F&&(t.stencilMask(ut),xe=ut)},setFunc:function(ut,Cn,li){(ne!==ut||se!==Cn||Se!==li)&&(t.stencilFunc(ut,Cn,li),ne=ut,se=Cn,Se=li)},setOp:function(ut,Cn,li){(be!==ut||Ye!==Cn||Mt!==li)&&(t.stencilOp(ut,Cn,li),be=ut,Ye=Cn,Mt=li)},setLocked:function(ut){F=ut},setClear:function(ut){Gt!==ut&&(t.clearStencil(ut),Gt=ut)},reset:function(){F=!1,xe=null,ne=null,se=null,Se=null,be=null,Ye=null,Mt=null,Gt=null}}}const s=new n,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},f={},h=new WeakMap,d=[],_=null,g=!1,m=null,p=null,T=null,R=null,y=null,P=null,L=null,M=new Ze(0,0,0),A=0,v=!1,x=null,C=null,G=null,V=null,Z=null;const ee=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let J=!1,Q=0;const N=t.getParameter(t.VERSION);N.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(N)[1]),J=Q>=1):N.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),J=Q>=2);let ae=null,pe={};const Te=t.getParameter(t.SCISSOR_BOX),Fe=t.getParameter(t.VIEWPORT),it=new bt().fromArray(Te),ie=new bt().fromArray(Fe);function de(F,xe,ne,se){const Se=new Uint8Array(4),be=t.createTexture();t.bindTexture(F,be),t.texParameteri(F,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(F,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ye=0;Ye<ne;Ye++)F===t.TEXTURE_3D||F===t.TEXTURE_2D_ARRAY?t.texImage3D(xe,0,t.RGBA,1,1,se,0,t.RGBA,t.UNSIGNED_BYTE,Se):t.texImage2D(xe+Ye,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,Se);return be}const Ee={};Ee[t.TEXTURE_2D]=de(t.TEXTURE_2D,t.TEXTURE_2D,1),Ee[t.TEXTURE_CUBE_MAP]=de(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ee[t.TEXTURE_2D_ARRAY]=de(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),Ee[t.TEXTURE_3D]=de(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),_e(t.DEPTH_TEST),o.setFunc(xs),q(!1),K(fd),_e(t.CULL_FACE),E(Ki);function _e(F){u[F]!==!0&&(t.enable(F),u[F]=!0)}function Pe(F){u[F]!==!1&&(t.disable(F),u[F]=!1)}function Je(F,xe){return f[F]!==xe?(t.bindFramebuffer(F,xe),f[F]=xe,F===t.DRAW_FRAMEBUFFER&&(f[t.FRAMEBUFFER]=xe),F===t.FRAMEBUFFER&&(f[t.DRAW_FRAMEBUFFER]=xe),!0):!1}function De(F,xe){let ne=d,se=!1;if(F){ne=h.get(xe),ne===void 0&&(ne=[],h.set(xe,ne));const Se=F.textures;if(ne.length!==Se.length||ne[0]!==t.COLOR_ATTACHMENT0){for(let be=0,Ye=Se.length;be<Ye;be++)ne[be]=t.COLOR_ATTACHMENT0+be;ne.length=Se.length,se=!0}}else ne[0]!==t.BACK&&(ne[0]=t.BACK,se=!0);se&&t.drawBuffers(ne)}function St(F){return _!==F?(t.useProgram(F),_=F,!0):!1}const D={[mr]:t.FUNC_ADD,[Qb]:t.FUNC_SUBTRACT,[eS]:t.FUNC_REVERSE_SUBTRACT};D[tS]=t.MIN,D[nS]=t.MAX;const U={[iS]:t.ZERO,[rS]:t.ONE,[sS]:t.SRC_COLOR,[eu]:t.SRC_ALPHA,[fS]:t.SRC_ALPHA_SATURATE,[cS]:t.DST_COLOR,[aS]:t.DST_ALPHA,[oS]:t.ONE_MINUS_SRC_COLOR,[tu]:t.ONE_MINUS_SRC_ALPHA,[uS]:t.ONE_MINUS_DST_COLOR,[lS]:t.ONE_MINUS_DST_ALPHA,[hS]:t.CONSTANT_COLOR,[dS]:t.ONE_MINUS_CONSTANT_COLOR,[pS]:t.CONSTANT_ALPHA,[mS]:t.ONE_MINUS_CONSTANT_ALPHA};function E(F,xe,ne,se,Se,be,Ye,Mt,Gt,ut){if(F===Ki){g===!0&&(Pe(t.BLEND),g=!1);return}if(g===!1&&(_e(t.BLEND),g=!0),F!==Jb){if(F!==m||ut!==v){if((p!==mr||y!==mr)&&(t.blendEquation(t.FUNC_ADD),p=mr,y=mr),ut)switch(F){case us:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case hd:t.blendFunc(t.ONE,t.ONE);break;case dd:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case pd:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case us:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case hd:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case dd:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case pd:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}T=null,R=null,P=null,L=null,M.set(0,0,0),A=0,m=F,v=ut}return}Se=Se||xe,be=be||ne,Ye=Ye||se,(xe!==p||Se!==y)&&(t.blendEquationSeparate(D[xe],D[Se]),p=xe,y=Se),(ne!==T||se!==R||be!==P||Ye!==L)&&(t.blendFuncSeparate(U[ne],U[se],U[be],U[Ye]),T=ne,R=se,P=be,L=Ye),(Mt.equals(M)===!1||Gt!==A)&&(t.blendColor(Mt.r,Mt.g,Mt.b,Gt),M.copy(Mt),A=Gt),m=F,v=!1}function re(F,xe){F.side===Mi?Pe(t.CULL_FACE):_e(t.CULL_FACE);let ne=F.side===fn;xe&&(ne=!ne),q(ne),F.blending===us&&F.transparent===!1?E(Ki):E(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),s.setMask(F.colorWrite);const se=F.stencilWrite;a.setTest(se),se&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),oe(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?_e(t.SAMPLE_ALPHA_TO_COVERAGE):Pe(t.SAMPLE_ALPHA_TO_COVERAGE)}function q(F){x!==F&&(F?t.frontFace(t.CW):t.frontFace(t.CCW),x=F)}function K(F){F!==qb?(_e(t.CULL_FACE),F!==C&&(F===fd?t.cullFace(t.BACK):F===Zb?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Pe(t.CULL_FACE),C=F}function te(F){F!==G&&(J&&t.lineWidth(F),G=F)}function oe(F,xe,ne){F?(_e(t.POLYGON_OFFSET_FILL),(V!==xe||Z!==ne)&&(t.polygonOffset(xe,ne),V=xe,Z=ne)):Pe(t.POLYGON_OFFSET_FILL)}function j(F){F?_e(t.SCISSOR_TEST):Pe(t.SCISSOR_TEST)}function S(F){F===void 0&&(F=t.TEXTURE0+ee-1),ae!==F&&(t.activeTexture(F),ae=F)}function b(F,xe,ne){ne===void 0&&(ae===null?ne=t.TEXTURE0+ee-1:ne=ae);let se=pe[ne];se===void 0&&(se={type:void 0,texture:void 0},pe[ne]=se),(se.type!==F||se.texture!==xe)&&(ae!==ne&&(t.activeTexture(ne),ae=ne),t.bindTexture(F,xe||Ee[F]),se.type=F,se.texture=xe)}function I(){const F=pe[ae];F!==void 0&&F.type!==void 0&&(t.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function H(){try{t.compressedTexImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function W(){try{t.compressedTexImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function X(){try{t.texSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function he(){try{t.texSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function le(){try{t.compressedTexSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function fe(){try{t.compressedTexSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ie(){try{t.texStorage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ce(){try{t.texStorage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ve(){try{t.texImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ce(){try{t.texImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Oe(F){it.equals(F)===!1&&(t.scissor(F.x,F.y,F.z,F.w),it.copy(F))}function me(F){ie.equals(F)===!1&&(t.viewport(F.x,F.y,F.z,F.w),ie.copy(F))}function ke(F,xe){let ne=c.get(xe);ne===void 0&&(ne=new WeakMap,c.set(xe,ne));let se=ne.get(F);se===void 0&&(se=t.getUniformBlockIndex(xe,F.name),ne.set(F,se))}function Ge(F,xe){const se=c.get(xe).get(F);l.get(xe)!==se&&(t.uniformBlockBinding(xe,se,F.__bindingPointIndex),l.set(xe,se))}function ct(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),u={},ae=null,pe={},f={},h=new WeakMap,d=[],_=null,g=!1,m=null,p=null,T=null,R=null,y=null,P=null,L=null,M=new Ze(0,0,0),A=0,v=!1,x=null,C=null,G=null,V=null,Z=null,it.set(0,0,t.canvas.width,t.canvas.height),ie.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:_e,disable:Pe,bindFramebuffer:Je,drawBuffers:De,useProgram:St,setBlending:E,setMaterial:re,setFlipSided:q,setCullFace:K,setLineWidth:te,setPolygonOffset:oe,setScissorTest:j,activeTexture:S,bindTexture:b,unbindTexture:I,compressedTexImage2D:H,compressedTexImage3D:W,texImage2D:ve,texImage3D:Ce,updateUBOMapping:ke,uniformBlockBinding:Ge,texStorage2D:Ie,texStorage3D:ce,texSubImage2D:X,texSubImage3D:he,compressedTexSubImage2D:le,compressedTexSubImage3D:fe,scissor:Oe,viewport:me,reset:ct}}function _A(t,e,n,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new We,u=new WeakMap;let f;const h=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(S,b){return d?new OffscreenCanvas(S,b):Do("canvas")}function g(S,b,I){let H=1;const W=j(S);if((W.width>I||W.height>I)&&(H=I/Math.max(W.width,W.height)),H<1)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap||typeof VideoFrame<"u"&&S instanceof VideoFrame){const X=Math.floor(H*W.width),he=Math.floor(H*W.height);f===void 0&&(f=_(X,he));const le=b?_(X,he):f;return le.width=X,le.height=he,le.getContext("2d").drawImage(S,0,0,X,he),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+W.width+"x"+W.height+") to ("+X+"x"+he+")."),le}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+W.width+"x"+W.height+")."),S;return S}function m(S){return S.generateMipmaps}function p(S){t.generateMipmap(S)}function T(S){return S.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:S.isWebGL3DRenderTarget?t.TEXTURE_3D:S.isWebGLArrayRenderTarget||S.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function R(S,b,I,H,W=!1){if(S!==null){if(t[S]!==void 0)return t[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let X=b;if(b===t.RED&&(I===t.FLOAT&&(X=t.R32F),I===t.HALF_FLOAT&&(X=t.R16F),I===t.UNSIGNED_BYTE&&(X=t.R8)),b===t.RED_INTEGER&&(I===t.UNSIGNED_BYTE&&(X=t.R8UI),I===t.UNSIGNED_SHORT&&(X=t.R16UI),I===t.UNSIGNED_INT&&(X=t.R32UI),I===t.BYTE&&(X=t.R8I),I===t.SHORT&&(X=t.R16I),I===t.INT&&(X=t.R32I)),b===t.RG&&(I===t.FLOAT&&(X=t.RG32F),I===t.HALF_FLOAT&&(X=t.RG16F),I===t.UNSIGNED_BYTE&&(X=t.RG8)),b===t.RG_INTEGER&&(I===t.UNSIGNED_BYTE&&(X=t.RG8UI),I===t.UNSIGNED_SHORT&&(X=t.RG16UI),I===t.UNSIGNED_INT&&(X=t.RG32UI),I===t.BYTE&&(X=t.RG8I),I===t.SHORT&&(X=t.RG16I),I===t.INT&&(X=t.RG32I)),b===t.RGB_INTEGER&&(I===t.UNSIGNED_BYTE&&(X=t.RGB8UI),I===t.UNSIGNED_SHORT&&(X=t.RGB16UI),I===t.UNSIGNED_INT&&(X=t.RGB32UI),I===t.BYTE&&(X=t.RGB8I),I===t.SHORT&&(X=t.RGB16I),I===t.INT&&(X=t.RGB32I)),b===t.RGBA_INTEGER&&(I===t.UNSIGNED_BYTE&&(X=t.RGBA8UI),I===t.UNSIGNED_SHORT&&(X=t.RGBA16UI),I===t.UNSIGNED_INT&&(X=t.RGBA32UI),I===t.BYTE&&(X=t.RGBA8I),I===t.SHORT&&(X=t.RGBA16I),I===t.INT&&(X=t.RGBA32I)),b===t.RGB&&I===t.UNSIGNED_INT_5_9_9_9_REV&&(X=t.RGB9_E5),b===t.RGBA){const he=W?Ka:tt.getTransfer(H);I===t.FLOAT&&(X=t.RGBA32F),I===t.HALF_FLOAT&&(X=t.RGBA16F),I===t.UNSIGNED_BYTE&&(X=he===ht?t.SRGB8_ALPHA8:t.RGBA8),I===t.UNSIGNED_SHORT_4_4_4_4&&(X=t.RGBA4),I===t.UNSIGNED_SHORT_5_5_5_1&&(X=t.RGB5_A1)}return(X===t.R16F||X===t.R32F||X===t.RG16F||X===t.RG32F||X===t.RGBA16F||X===t.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function y(S,b){let I;return S?b===null||b===Rr||b===Ss?I=t.DEPTH24_STENCIL8:b===wi?I=t.DEPTH32F_STENCIL8:b===Co&&(I=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Rr||b===Ss?I=t.DEPTH_COMPONENT24:b===wi?I=t.DEPTH_COMPONENT32F:b===Co&&(I=t.DEPTH_COMPONENT16),I}function P(S,b){return m(S)===!0||S.isFramebufferTexture&&S.minFilter!==yn&&S.minFilter!==Qn?Math.log2(Math.max(b.width,b.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?b.mipmaps.length:1}function L(S){const b=S.target;b.removeEventListener("dispose",L),A(b),b.isVideoTexture&&u.delete(b)}function M(S){const b=S.target;b.removeEventListener("dispose",M),x(b)}function A(S){const b=i.get(S);if(b.__webglInit===void 0)return;const I=S.source,H=h.get(I);if(H){const W=H[b.__cacheKey];W.usedTimes--,W.usedTimes===0&&v(S),Object.keys(H).length===0&&h.delete(I)}i.remove(S)}function v(S){const b=i.get(S);t.deleteTexture(b.__webglTexture);const I=S.source,H=h.get(I);delete H[b.__cacheKey],o.memory.textures--}function x(S){const b=i.get(S);if(S.depthTexture&&(S.depthTexture.dispose(),i.remove(S.depthTexture)),S.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(b.__webglFramebuffer[H]))for(let W=0;W<b.__webglFramebuffer[H].length;W++)t.deleteFramebuffer(b.__webglFramebuffer[H][W]);else t.deleteFramebuffer(b.__webglFramebuffer[H]);b.__webglDepthbuffer&&t.deleteRenderbuffer(b.__webglDepthbuffer[H])}else{if(Array.isArray(b.__webglFramebuffer))for(let H=0;H<b.__webglFramebuffer.length;H++)t.deleteFramebuffer(b.__webglFramebuffer[H]);else t.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&t.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&t.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let H=0;H<b.__webglColorRenderbuffer.length;H++)b.__webglColorRenderbuffer[H]&&t.deleteRenderbuffer(b.__webglColorRenderbuffer[H]);b.__webglDepthRenderbuffer&&t.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const I=S.textures;for(let H=0,W=I.length;H<W;H++){const X=i.get(I[H]);X.__webglTexture&&(t.deleteTexture(X.__webglTexture),o.memory.textures--),i.remove(I[H])}i.remove(S)}let C=0;function G(){C=0}function V(){const S=C;return S>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+r.maxTextures),C+=1,S}function Z(S){const b=[];return b.push(S.wrapS),b.push(S.wrapT),b.push(S.wrapR||0),b.push(S.magFilter),b.push(S.minFilter),b.push(S.anisotropy),b.push(S.internalFormat),b.push(S.format),b.push(S.type),b.push(S.generateMipmaps),b.push(S.premultiplyAlpha),b.push(S.flipY),b.push(S.unpackAlignment),b.push(S.colorSpace),b.join()}function ee(S,b){const I=i.get(S);if(S.isVideoTexture&&te(S),S.isRenderTargetTexture===!1&&S.version>0&&I.__version!==S.version){const H=S.image;if(H===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ie(I,S,b);return}}n.bindTexture(t.TEXTURE_2D,I.__webglTexture,t.TEXTURE0+b)}function J(S,b){const I=i.get(S);if(S.version>0&&I.__version!==S.version){ie(I,S,b);return}n.bindTexture(t.TEXTURE_2D_ARRAY,I.__webglTexture,t.TEXTURE0+b)}function Q(S,b){const I=i.get(S);if(S.version>0&&I.__version!==S.version){ie(I,S,b);return}n.bindTexture(t.TEXTURE_3D,I.__webglTexture,t.TEXTURE0+b)}function N(S,b){const I=i.get(S);if(S.version>0&&I.__version!==S.version){de(I,S,b);return}n.bindTexture(t.TEXTURE_CUBE_MAP,I.__webglTexture,t.TEXTURE0+b)}const ae={[fu]:t.REPEAT,[Ei]:t.CLAMP_TO_EDGE,[hu]:t.MIRRORED_REPEAT},pe={[yn]:t.NEAREST,[wS]:t.NEAREST_MIPMAP_NEAREST,[ra]:t.NEAREST_MIPMAP_LINEAR,[Qn]:t.LINEAR,[Kl]:t.LINEAR_MIPMAP_NEAREST,[yr]:t.LINEAR_MIPMAP_LINEAR},Te={[CS]:t.NEVER,[NS]:t.ALWAYS,[PS]:t.LESS,[B_]:t.LEQUAL,[DS]:t.EQUAL,[US]:t.GEQUAL,[LS]:t.GREATER,[IS]:t.NOTEQUAL};function Fe(S,b){if(b.type===wi&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Qn||b.magFilter===Kl||b.magFilter===ra||b.magFilter===yr||b.minFilter===Qn||b.minFilter===Kl||b.minFilter===ra||b.minFilter===yr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(S,t.TEXTURE_WRAP_S,ae[b.wrapS]),t.texParameteri(S,t.TEXTURE_WRAP_T,ae[b.wrapT]),(S===t.TEXTURE_3D||S===t.TEXTURE_2D_ARRAY)&&t.texParameteri(S,t.TEXTURE_WRAP_R,ae[b.wrapR]),t.texParameteri(S,t.TEXTURE_MAG_FILTER,pe[b.magFilter]),t.texParameteri(S,t.TEXTURE_MIN_FILTER,pe[b.minFilter]),b.compareFunction&&(t.texParameteri(S,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(S,t.TEXTURE_COMPARE_FUNC,Te[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===yn||b.minFilter!==ra&&b.minFilter!==yr||b.type===wi&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){const I=e.get("EXT_texture_filter_anisotropic");t.texParameterf(S,I.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,r.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function it(S,b){let I=!1;S.__webglInit===void 0&&(S.__webglInit=!0,b.addEventListener("dispose",L));const H=b.source;let W=h.get(H);W===void 0&&(W={},h.set(H,W));const X=Z(b);if(X!==S.__cacheKey){W[X]===void 0&&(W[X]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,I=!0),W[X].usedTimes++;const he=W[S.__cacheKey];he!==void 0&&(W[S.__cacheKey].usedTimes--,he.usedTimes===0&&v(b)),S.__cacheKey=X,S.__webglTexture=W[X].texture}return I}function ie(S,b,I){let H=t.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(H=t.TEXTURE_2D_ARRAY),b.isData3DTexture&&(H=t.TEXTURE_3D);const W=it(S,b),X=b.source;n.bindTexture(H,S.__webglTexture,t.TEXTURE0+I);const he=i.get(X);if(X.version!==he.__version||W===!0){n.activeTexture(t.TEXTURE0+I);const le=tt.getPrimaries(tt.workingColorSpace),fe=b.colorSpace===Yi?null:tt.getPrimaries(b.colorSpace),Ie=b.colorSpace===Yi||le===fe?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie);let ce=g(b.image,!1,r.maxTextureSize);ce=oe(b,ce);const ve=s.convert(b.format,b.colorSpace),Ce=s.convert(b.type);let Oe=R(b.internalFormat,ve,Ce,b.colorSpace,b.isVideoTexture);Fe(H,b);let me;const ke=b.mipmaps,Ge=b.isVideoTexture!==!0,ct=he.__version===void 0||W===!0,F=X.dataReady,xe=P(b,ce);if(b.isDepthTexture)Oe=y(b.format===Ms,b.type),ct&&(Ge?n.texStorage2D(t.TEXTURE_2D,1,Oe,ce.width,ce.height):n.texImage2D(t.TEXTURE_2D,0,Oe,ce.width,ce.height,0,ve,Ce,null));else if(b.isDataTexture)if(ke.length>0){Ge&&ct&&n.texStorage2D(t.TEXTURE_2D,xe,Oe,ke[0].width,ke[0].height);for(let ne=0,se=ke.length;ne<se;ne++)me=ke[ne],Ge?F&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,me.width,me.height,ve,Ce,me.data):n.texImage2D(t.TEXTURE_2D,ne,Oe,me.width,me.height,0,ve,Ce,me.data);b.generateMipmaps=!1}else Ge?(ct&&n.texStorage2D(t.TEXTURE_2D,xe,Oe,ce.width,ce.height),F&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,ce.width,ce.height,ve,Ce,ce.data)):n.texImage2D(t.TEXTURE_2D,0,Oe,ce.width,ce.height,0,ve,Ce,ce.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Ge&&ct&&n.texStorage3D(t.TEXTURE_2D_ARRAY,xe,Oe,ke[0].width,ke[0].height,ce.depth);for(let ne=0,se=ke.length;ne<se;ne++)if(me=ke[ne],b.format!==Fn)if(ve!==null)if(Ge){if(F)if(b.layerUpdates.size>0){const Se=$d(me.width,me.height,b.format,b.type);for(const be of b.layerUpdates){const Ye=me.data.subarray(be*Se/me.data.BYTES_PER_ELEMENT,(be+1)*Se/me.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,be,me.width,me.height,1,ve,Ye)}b.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,0,me.width,me.height,ce.depth,ve,me.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,ne,Oe,me.width,me.height,ce.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ge?F&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,0,me.width,me.height,ce.depth,ve,Ce,me.data):n.texImage3D(t.TEXTURE_2D_ARRAY,ne,Oe,me.width,me.height,ce.depth,0,ve,Ce,me.data)}else{Ge&&ct&&n.texStorage2D(t.TEXTURE_2D,xe,Oe,ke[0].width,ke[0].height);for(let ne=0,se=ke.length;ne<se;ne++)me=ke[ne],b.format!==Fn?ve!==null?Ge?F&&n.compressedTexSubImage2D(t.TEXTURE_2D,ne,0,0,me.width,me.height,ve,me.data):n.compressedTexImage2D(t.TEXTURE_2D,ne,Oe,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ge?F&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,me.width,me.height,ve,Ce,me.data):n.texImage2D(t.TEXTURE_2D,ne,Oe,me.width,me.height,0,ve,Ce,me.data)}else if(b.isDataArrayTexture)if(Ge){if(ct&&n.texStorage3D(t.TEXTURE_2D_ARRAY,xe,Oe,ce.width,ce.height,ce.depth),F)if(b.layerUpdates.size>0){const ne=$d(ce.width,ce.height,b.format,b.type);for(const se of b.layerUpdates){const Se=ce.data.subarray(se*ne/ce.data.BYTES_PER_ELEMENT,(se+1)*ne/ce.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,se,ce.width,ce.height,1,ve,Ce,Se)}b.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,ce.width,ce.height,ce.depth,ve,Ce,ce.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Oe,ce.width,ce.height,ce.depth,0,ve,Ce,ce.data);else if(b.isData3DTexture)Ge?(ct&&n.texStorage3D(t.TEXTURE_3D,xe,Oe,ce.width,ce.height,ce.depth),F&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,ce.width,ce.height,ce.depth,ve,Ce,ce.data)):n.texImage3D(t.TEXTURE_3D,0,Oe,ce.width,ce.height,ce.depth,0,ve,Ce,ce.data);else if(b.isFramebufferTexture){if(ct)if(Ge)n.texStorage2D(t.TEXTURE_2D,xe,Oe,ce.width,ce.height);else{let ne=ce.width,se=ce.height;for(let Se=0;Se<xe;Se++)n.texImage2D(t.TEXTURE_2D,Se,Oe,ne,se,0,ve,Ce,null),ne>>=1,se>>=1}}else if(ke.length>0){if(Ge&&ct){const ne=j(ke[0]);n.texStorage2D(t.TEXTURE_2D,xe,Oe,ne.width,ne.height)}for(let ne=0,se=ke.length;ne<se;ne++)me=ke[ne],Ge?F&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,ve,Ce,me):n.texImage2D(t.TEXTURE_2D,ne,Oe,ve,Ce,me);b.generateMipmaps=!1}else if(Ge){if(ct){const ne=j(ce);n.texStorage2D(t.TEXTURE_2D,xe,Oe,ne.width,ne.height)}F&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,ve,Ce,ce)}else n.texImage2D(t.TEXTURE_2D,0,Oe,ve,Ce,ce);m(b)&&p(H),he.__version=X.version,b.onUpdate&&b.onUpdate(b)}S.__version=b.version}function de(S,b,I){if(b.image.length!==6)return;const H=it(S,b),W=b.source;n.bindTexture(t.TEXTURE_CUBE_MAP,S.__webglTexture,t.TEXTURE0+I);const X=i.get(W);if(W.version!==X.__version||H===!0){n.activeTexture(t.TEXTURE0+I);const he=tt.getPrimaries(tt.workingColorSpace),le=b.colorSpace===Yi?null:tt.getPrimaries(b.colorSpace),fe=b.colorSpace===Yi||he===le?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe);const Ie=b.isCompressedTexture||b.image[0].isCompressedTexture,ce=b.image[0]&&b.image[0].isDataTexture,ve=[];for(let se=0;se<6;se++)!Ie&&!ce?ve[se]=g(b.image[se],!0,r.maxCubemapSize):ve[se]=ce?b.image[se].image:b.image[se],ve[se]=oe(b,ve[se]);const Ce=ve[0],Oe=s.convert(b.format,b.colorSpace),me=s.convert(b.type),ke=R(b.internalFormat,Oe,me,b.colorSpace),Ge=b.isVideoTexture!==!0,ct=X.__version===void 0||H===!0,F=W.dataReady;let xe=P(b,Ce);Fe(t.TEXTURE_CUBE_MAP,b);let ne;if(Ie){Ge&&ct&&n.texStorage2D(t.TEXTURE_CUBE_MAP,xe,ke,Ce.width,Ce.height);for(let se=0;se<6;se++){ne=ve[se].mipmaps;for(let Se=0;Se<ne.length;Se++){const be=ne[Se];b.format!==Fn?Oe!==null?Ge?F&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Se,0,0,be.width,be.height,Oe,be.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Se,ke,be.width,be.height,0,be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ge?F&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Se,0,0,be.width,be.height,Oe,me,be.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Se,ke,be.width,be.height,0,Oe,me,be.data)}}}else{if(ne=b.mipmaps,Ge&&ct){ne.length>0&&xe++;const se=j(ve[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,xe,ke,se.width,se.height)}for(let se=0;se<6;se++)if(ce){Ge?F&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,ve[se].width,ve[se].height,Oe,me,ve[se].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,ke,ve[se].width,ve[se].height,0,Oe,me,ve[se].data);for(let Se=0;Se<ne.length;Se++){const Ye=ne[Se].image[se].image;Ge?F&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Se+1,0,0,Ye.width,Ye.height,Oe,me,Ye.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Se+1,ke,Ye.width,Ye.height,0,Oe,me,Ye.data)}}else{Ge?F&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Oe,me,ve[se]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,ke,Oe,me,ve[se]);for(let Se=0;Se<ne.length;Se++){const be=ne[Se];Ge?F&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Se+1,0,0,Oe,me,be.image[se]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Se+1,ke,Oe,me,be.image[se])}}}m(b)&&p(t.TEXTURE_CUBE_MAP),X.__version=W.version,b.onUpdate&&b.onUpdate(b)}S.__version=b.version}function Ee(S,b,I,H,W,X){const he=s.convert(I.format,I.colorSpace),le=s.convert(I.type),fe=R(I.internalFormat,he,le,I.colorSpace),Ie=i.get(b),ce=i.get(I);if(ce.__renderTarget=b,!Ie.__hasExternalTextures){const ve=Math.max(1,b.width>>X),Ce=Math.max(1,b.height>>X);W===t.TEXTURE_3D||W===t.TEXTURE_2D_ARRAY?n.texImage3D(W,X,fe,ve,Ce,b.depth,0,he,le,null):n.texImage2D(W,X,fe,ve,Ce,0,he,le,null)}n.bindFramebuffer(t.FRAMEBUFFER,S),K(b)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,H,W,ce.__webglTexture,0,q(b)):(W===t.TEXTURE_2D||W>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&W<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,H,W,ce.__webglTexture,X),n.bindFramebuffer(t.FRAMEBUFFER,null)}function _e(S,b,I){if(t.bindRenderbuffer(t.RENDERBUFFER,S),b.depthBuffer){const H=b.depthTexture,W=H&&H.isDepthTexture?H.type:null,X=y(b.stencilBuffer,W),he=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,le=q(b);K(b)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,le,X,b.width,b.height):I?t.renderbufferStorageMultisample(t.RENDERBUFFER,le,X,b.width,b.height):t.renderbufferStorage(t.RENDERBUFFER,X,b.width,b.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,he,t.RENDERBUFFER,S)}else{const H=b.textures;for(let W=0;W<H.length;W++){const X=H[W],he=s.convert(X.format,X.colorSpace),le=s.convert(X.type),fe=R(X.internalFormat,he,le,X.colorSpace),Ie=q(b);I&&K(b)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ie,fe,b.width,b.height):K(b)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ie,fe,b.width,b.height):t.renderbufferStorage(t.RENDERBUFFER,fe,b.width,b.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Pe(S,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,S),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const H=i.get(b.depthTexture);H.__renderTarget=b,(!H.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),ee(b.depthTexture,0);const W=H.__webglTexture,X=q(b);if(b.depthTexture.format===fs)K(b)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,W,0,X):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,W,0);else if(b.depthTexture.format===Ms)K(b)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,W,0,X):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,W,0);else throw new Error("Unknown depthTexture format")}function Je(S){const b=i.get(S),I=S.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==S.depthTexture){const H=S.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),H){const W=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,H.removeEventListener("dispose",W)};H.addEventListener("dispose",W),b.__depthDisposeCallback=W}b.__boundDepthTexture=H}if(S.depthTexture&&!b.__autoAllocateDepthBuffer){if(I)throw new Error("target.depthTexture not supported in Cube render targets");Pe(b.__webglFramebuffer,S)}else if(I){b.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer[H]),b.__webglDepthbuffer[H]===void 0)b.__webglDepthbuffer[H]=t.createRenderbuffer(),_e(b.__webglDepthbuffer[H],S,!1);else{const W=S.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,X=b.__webglDepthbuffer[H];t.bindRenderbuffer(t.RENDERBUFFER,X),t.framebufferRenderbuffer(t.FRAMEBUFFER,W,t.RENDERBUFFER,X)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=t.createRenderbuffer(),_e(b.__webglDepthbuffer,S,!1);else{const H=S.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,W=b.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,W),t.framebufferRenderbuffer(t.FRAMEBUFFER,H,t.RENDERBUFFER,W)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function De(S,b,I){const H=i.get(S);b!==void 0&&Ee(H.__webglFramebuffer,S,S.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),I!==void 0&&Je(S)}function St(S){const b=S.texture,I=i.get(S),H=i.get(b);S.addEventListener("dispose",M);const W=S.textures,X=S.isWebGLCubeRenderTarget===!0,he=W.length>1;if(he||(H.__webglTexture===void 0&&(H.__webglTexture=t.createTexture()),H.__version=b.version,o.memory.textures++),X){I.__webglFramebuffer=[];for(let le=0;le<6;le++)if(b.mipmaps&&b.mipmaps.length>0){I.__webglFramebuffer[le]=[];for(let fe=0;fe<b.mipmaps.length;fe++)I.__webglFramebuffer[le][fe]=t.createFramebuffer()}else I.__webglFramebuffer[le]=t.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){I.__webglFramebuffer=[];for(let le=0;le<b.mipmaps.length;le++)I.__webglFramebuffer[le]=t.createFramebuffer()}else I.__webglFramebuffer=t.createFramebuffer();if(he)for(let le=0,fe=W.length;le<fe;le++){const Ie=i.get(W[le]);Ie.__webglTexture===void 0&&(Ie.__webglTexture=t.createTexture(),o.memory.textures++)}if(S.samples>0&&K(S)===!1){I.__webglMultisampledFramebuffer=t.createFramebuffer(),I.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,I.__webglMultisampledFramebuffer);for(let le=0;le<W.length;le++){const fe=W[le];I.__webglColorRenderbuffer[le]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,I.__webglColorRenderbuffer[le]);const Ie=s.convert(fe.format,fe.colorSpace),ce=s.convert(fe.type),ve=R(fe.internalFormat,Ie,ce,fe.colorSpace,S.isXRRenderTarget===!0),Ce=q(S);t.renderbufferStorageMultisample(t.RENDERBUFFER,Ce,ve,S.width,S.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+le,t.RENDERBUFFER,I.__webglColorRenderbuffer[le])}t.bindRenderbuffer(t.RENDERBUFFER,null),S.depthBuffer&&(I.__webglDepthRenderbuffer=t.createRenderbuffer(),_e(I.__webglDepthRenderbuffer,S,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(X){n.bindTexture(t.TEXTURE_CUBE_MAP,H.__webglTexture),Fe(t.TEXTURE_CUBE_MAP,b);for(let le=0;le<6;le++)if(b.mipmaps&&b.mipmaps.length>0)for(let fe=0;fe<b.mipmaps.length;fe++)Ee(I.__webglFramebuffer[le][fe],S,b,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+le,fe);else Ee(I.__webglFramebuffer[le],S,b,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);m(b)&&p(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(he){for(let le=0,fe=W.length;le<fe;le++){const Ie=W[le],ce=i.get(Ie);n.bindTexture(t.TEXTURE_2D,ce.__webglTexture),Fe(t.TEXTURE_2D,Ie),Ee(I.__webglFramebuffer,S,Ie,t.COLOR_ATTACHMENT0+le,t.TEXTURE_2D,0),m(Ie)&&p(t.TEXTURE_2D)}n.unbindTexture()}else{let le=t.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(le=S.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(le,H.__webglTexture),Fe(le,b),b.mipmaps&&b.mipmaps.length>0)for(let fe=0;fe<b.mipmaps.length;fe++)Ee(I.__webglFramebuffer[fe],S,b,t.COLOR_ATTACHMENT0,le,fe);else Ee(I.__webglFramebuffer,S,b,t.COLOR_ATTACHMENT0,le,0);m(b)&&p(le),n.unbindTexture()}S.depthBuffer&&Je(S)}function D(S){const b=S.textures;for(let I=0,H=b.length;I<H;I++){const W=b[I];if(m(W)){const X=T(S),he=i.get(W).__webglTexture;n.bindTexture(X,he),p(X),n.unbindTexture()}}}const U=[],E=[];function re(S){if(S.samples>0){if(K(S)===!1){const b=S.textures,I=S.width,H=S.height;let W=t.COLOR_BUFFER_BIT;const X=S.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,he=i.get(S),le=b.length>1;if(le)for(let fe=0;fe<b.length;fe++)n.bindFramebuffer(t.FRAMEBUFFER,he.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,he.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let fe=0;fe<b.length;fe++){if(S.resolveDepthBuffer&&(S.depthBuffer&&(W|=t.DEPTH_BUFFER_BIT),S.stencilBuffer&&S.resolveStencilBuffer&&(W|=t.STENCIL_BUFFER_BIT)),le){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,he.__webglColorRenderbuffer[fe]);const Ie=i.get(b[fe]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Ie,0)}t.blitFramebuffer(0,0,I,H,0,0,I,H,W,t.NEAREST),l===!0&&(U.length=0,E.length=0,U.push(t.COLOR_ATTACHMENT0+fe),S.depthBuffer&&S.resolveDepthBuffer===!1&&(U.push(X),E.push(X),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,E)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,U))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),le)for(let fe=0;fe<b.length;fe++){n.bindFramebuffer(t.FRAMEBUFFER,he.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,he.__webglColorRenderbuffer[fe]);const Ie=i.get(b[fe]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,he.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,Ie,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(S.depthBuffer&&S.resolveDepthBuffer===!1&&l){const b=S.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[b])}}}function q(S){return Math.min(r.maxSamples,S.samples)}function K(S){const b=i.get(S);return S.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function te(S){const b=o.render.frame;u.get(S)!==b&&(u.set(S,b),S.update())}function oe(S,b){const I=S.colorSpace,H=S.format,W=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||I!==Es&&I!==Yi&&(tt.getTransfer(I)===ht?(H!==Fn||W!==Ii)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",I)),b}function j(S){return typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement?(c.width=S.naturalWidth||S.width,c.height=S.naturalHeight||S.height):typeof VideoFrame<"u"&&S instanceof VideoFrame?(c.width=S.displayWidth,c.height=S.displayHeight):(c.width=S.width,c.height=S.height),c}this.allocateTextureUnit=V,this.resetTextureUnits=G,this.setTexture2D=ee,this.setTexture2DArray=J,this.setTexture3D=Q,this.setTextureCube=N,this.rebindTextures=De,this.setupRenderTarget=St,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=re,this.setupDepthRenderbuffer=Je,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=K}function gA(t,e){function n(i,r=Yi){let s;const o=tt.getTransfer(r);if(i===Ii)return t.UNSIGNED_BYTE;if(i===bf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Sf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===C_)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===A_)return t.BYTE;if(i===R_)return t.SHORT;if(i===Co)return t.UNSIGNED_SHORT;if(i===yf)return t.INT;if(i===Rr)return t.UNSIGNED_INT;if(i===wi)return t.FLOAT;if(i===Go)return t.HALF_FLOAT;if(i===P_)return t.ALPHA;if(i===D_)return t.RGB;if(i===Fn)return t.RGBA;if(i===L_)return t.LUMINANCE;if(i===I_)return t.LUMINANCE_ALPHA;if(i===fs)return t.DEPTH_COMPONENT;if(i===Ms)return t.DEPTH_STENCIL;if(i===U_)return t.RED;if(i===Mf)return t.RED_INTEGER;if(i===N_)return t.RG;if(i===Ef)return t.RG_INTEGER;if(i===wf)return t.RGBA_INTEGER;if(i===Na||i===Fa||i===Oa||i===Ba)if(o===ht)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Na)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Fa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Oa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ba)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Na)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Fa)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Oa)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ba)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===du||i===pu||i===mu||i===_u)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===du)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pu)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===mu)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===_u)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===gu||i===vu||i===xu)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===gu||i===vu)return o===ht?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===xu)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===yu||i===bu||i===Su||i===Mu||i===Eu||i===wu||i===Tu||i===Au||i===Ru||i===Cu||i===Pu||i===Du||i===Lu||i===Iu)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===yu)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===bu)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Su)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Mu)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Eu)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===wu)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Tu)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Au)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ru)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Cu)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Pu)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Du)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Lu)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Iu)return o===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ka||i===Uu||i===Nu)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===ka)return o===ht?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Uu)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Nu)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===F_||i===Fu||i===Ou||i===Bu)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===ka)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Fu)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ou)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Bu)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ss?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const vA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,xA=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class yA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new sn,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!==i.depthNear||n.depthFar!==i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new tr({vertexShader:vA,fragmentShader:xA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new ei(new xl(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class bA extends Ur{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,_=null;const g=new yA,m=n.getContextAttributes();let p=null,T=null;const R=[],y=[],P=new We;let L=null;const M=new gn;M.viewport=new bt;const A=new gn;A.viewport=new bt;const v=[M,A],x=new BM;let C=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ie){let de=R[ie];return de===void 0&&(de=new gc,R[ie]=de),de.getTargetRaySpace()},this.getControllerGrip=function(ie){let de=R[ie];return de===void 0&&(de=new gc,R[ie]=de),de.getGripSpace()},this.getHand=function(ie){let de=R[ie];return de===void 0&&(de=new gc,R[ie]=de),de.getHandSpace()};function V(ie){const de=y.indexOf(ie.inputSource);if(de===-1)return;const Ee=R[de];Ee!==void 0&&(Ee.update(ie.inputSource,ie.frame,c||o),Ee.dispatchEvent({type:ie.type,data:ie.inputSource}))}function Z(){r.removeEventListener("select",V),r.removeEventListener("selectstart",V),r.removeEventListener("selectend",V),r.removeEventListener("squeeze",V),r.removeEventListener("squeezestart",V),r.removeEventListener("squeezeend",V),r.removeEventListener("end",Z),r.removeEventListener("inputsourceschange",ee);for(let ie=0;ie<R.length;ie++){const de=y[ie];de!==null&&(y[ie]=null,R[ie].disconnect(de))}C=null,G=null,g.reset(),e.setRenderTarget(p),d=null,h=null,f=null,r=null,T=null,it.stop(),i.isPresenting=!1,e.setPixelRatio(L),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ie){s=ie,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ie){a=ie,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(ie){c=ie},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(ie){if(r=ie,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",V),r.addEventListener("selectstart",V),r.addEventListener("selectend",V),r.addEventListener("squeeze",V),r.addEventListener("squeezestart",V),r.addEventListener("squeezeend",V),r.addEventListener("end",Z),r.addEventListener("inputsourceschange",ee),m.xrCompatible!==!0&&await n.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(P),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,_e=null,Pe=null;m.depth&&(Pe=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Ee=m.stencil?Ms:fs,_e=m.stencil?Ss:Rr);const Je={colorFormat:n.RGBA8,depthFormat:Pe,scaleFactor:s};f=new XRWebGLBinding(r,n),h=f.createProjectionLayer(Je),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),T=new Cr(h.textureWidth,h.textureHeight,{format:Fn,type:Ii,depthTexture:new Z_(h.textureWidth,h.textureHeight,_e,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const Ee={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,n,Ee),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),T=new Cr(d.framebufferWidth,d.framebufferHeight,{format:Fn,type:Ii,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),it.setContext(r),it.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ee(ie){for(let de=0;de<ie.removed.length;de++){const Ee=ie.removed[de],_e=y.indexOf(Ee);_e>=0&&(y[_e]=null,R[_e].disconnect(Ee))}for(let de=0;de<ie.added.length;de++){const Ee=ie.added[de];let _e=y.indexOf(Ee);if(_e===-1){for(let Je=0;Je<R.length;Je++)if(Je>=y.length){y.push(Ee),_e=Je;break}else if(y[Je]===null){y[Je]=Ee,_e=Je;break}if(_e===-1)break}const Pe=R[_e];Pe&&Pe.connect(Ee)}}const J=new O,Q=new O;function N(ie,de,Ee){J.setFromMatrixPosition(de.matrixWorld),Q.setFromMatrixPosition(Ee.matrixWorld);const _e=J.distanceTo(Q),Pe=de.projectionMatrix.elements,Je=Ee.projectionMatrix.elements,De=Pe[14]/(Pe[10]-1),St=Pe[14]/(Pe[10]+1),D=(Pe[9]+1)/Pe[5],U=(Pe[9]-1)/Pe[5],E=(Pe[8]-1)/Pe[0],re=(Je[8]+1)/Je[0],q=De*E,K=De*re,te=_e/(-E+re),oe=te*-E;if(de.matrixWorld.decompose(ie.position,ie.quaternion,ie.scale),ie.translateX(oe),ie.translateZ(te),ie.matrixWorld.compose(ie.position,ie.quaternion,ie.scale),ie.matrixWorldInverse.copy(ie.matrixWorld).invert(),Pe[10]===-1)ie.projectionMatrix.copy(de.projectionMatrix),ie.projectionMatrixInverse.copy(de.projectionMatrixInverse);else{const j=De+te,S=St+te,b=q-oe,I=K+(_e-oe),H=D*St/S*j,W=U*St/S*j;ie.projectionMatrix.makePerspective(b,I,H,W,j,S),ie.projectionMatrixInverse.copy(ie.projectionMatrix).invert()}}function ae(ie,de){de===null?ie.matrixWorld.copy(ie.matrix):ie.matrixWorld.multiplyMatrices(de.matrixWorld,ie.matrix),ie.matrixWorldInverse.copy(ie.matrixWorld).invert()}this.updateCamera=function(ie){if(r===null)return;let de=ie.near,Ee=ie.far;g.texture!==null&&(g.depthNear>0&&(de=g.depthNear),g.depthFar>0&&(Ee=g.depthFar)),x.near=A.near=M.near=de,x.far=A.far=M.far=Ee,(C!==x.near||G!==x.far)&&(r.updateRenderState({depthNear:x.near,depthFar:x.far}),C=x.near,G=x.far),M.layers.mask=ie.layers.mask|2,A.layers.mask=ie.layers.mask|4,x.layers.mask=M.layers.mask|A.layers.mask;const _e=ie.parent,Pe=x.cameras;ae(x,_e);for(let Je=0;Je<Pe.length;Je++)ae(Pe[Je],_e);Pe.length===2?N(x,M,A):x.projectionMatrix.copy(M.projectionMatrix),pe(ie,x,_e)};function pe(ie,de,Ee){Ee===null?ie.matrix.copy(de.matrixWorld):(ie.matrix.copy(Ee.matrixWorld),ie.matrix.invert(),ie.matrix.multiply(de.matrixWorld)),ie.matrix.decompose(ie.position,ie.quaternion,ie.scale),ie.updateMatrixWorld(!0),ie.projectionMatrix.copy(de.projectionMatrix),ie.projectionMatrixInverse.copy(de.projectionMatrixInverse),ie.isPerspectiveCamera&&(ie.fov=Po*2*Math.atan(1/ie.projectionMatrix.elements[5]),ie.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(ie){l=ie,h!==null&&(h.fixedFoveation=ie),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=ie)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(x)};let Te=null;function Fe(ie,de){if(u=de.getViewerPose(c||o),_=de,u!==null){const Ee=u.views;d!==null&&(e.setRenderTargetFramebuffer(T,d.framebuffer),e.setRenderTarget(T));let _e=!1;Ee.length!==x.cameras.length&&(x.cameras.length=0,_e=!0);for(let De=0;De<Ee.length;De++){const St=Ee[De];let D=null;if(d!==null)D=d.getViewport(St);else{const E=f.getViewSubImage(h,St);D=E.viewport,De===0&&(e.setRenderTargetTextures(T,E.colorTexture,h.ignoreDepthValues?void 0:E.depthStencilTexture),e.setRenderTarget(T))}let U=v[De];U===void 0&&(U=new gn,U.layers.enable(De),U.viewport=new bt,v[De]=U),U.matrix.fromArray(St.transform.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale),U.projectionMatrix.fromArray(St.projectionMatrix),U.projectionMatrixInverse.copy(U.projectionMatrix).invert(),U.viewport.set(D.x,D.y,D.width,D.height),De===0&&(x.matrix.copy(U.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),_e===!0&&x.cameras.push(U)}const Pe=r.enabledFeatures;if(Pe&&Pe.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&f){const De=f.getDepthInformation(Ee[0]);De&&De.isValid&&De.texture&&g.init(e,De,r.renderState)}}for(let Ee=0;Ee<R.length;Ee++){const _e=y[Ee],Pe=R[Ee];_e!==null&&Pe!==void 0&&Pe.update(_e,de,c||o)}Te&&Te(ie,de),de.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:de}),_=null}const it=new Q_;it.setAnimationLoop(Fe),this.setAnimationLoop=function(ie){Te=ie},this.dispose=function(){}}}const fr=new oi,SA=new lt;function MA(t,e){function n(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,X_(t)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,T,R,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&d(m,p,y)):p.isMeshMatcapMaterial?(s(m,p),_(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),g(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,T,R):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,n(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===fn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,n(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===fn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,n(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,n(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const T=e.get(p),R=T.envMap,y=T.envMapRotation;R&&(m.envMap.value=R,fr.copy(y),fr.x*=-1,fr.y*=-1,fr.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(fr.y*=-1,fr.z*=-1),m.envMapRotation.value.setFromMatrix4(SA.makeRotationFromEuler(fr)),m.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,T,R){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*T,m.scale.value=R*.5,p.map&&(m.map.value=p.map,n(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,T){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===fn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,p){p.matcap&&(m.matcap.value=p.matcap)}function g(m,p){const T=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function EA(t,e,n,i){let r={},s={},o=[];const a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,R){const y=R.program;i.uniformBlockBinding(T,y)}function c(T,R){let y=r[T.id];y===void 0&&(_(T),y=u(T),r[T.id]=y,T.addEventListener("dispose",m));const P=R.program;i.updateUBOMapping(T,P);const L=e.render.frame;s[T.id]!==L&&(h(T),s[T.id]=L)}function u(T){const R=f();T.__bindingPointIndex=R;const y=t.createBuffer(),P=T.__size,L=T.usage;return t.bindBuffer(t.UNIFORM_BUFFER,y),t.bufferData(t.UNIFORM_BUFFER,P,L),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,R,y),y}function f(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(T){const R=r[T.id],y=T.uniforms,P=T.__cache;t.bindBuffer(t.UNIFORM_BUFFER,R);for(let L=0,M=y.length;L<M;L++){const A=Array.isArray(y[L])?y[L]:[y[L]];for(let v=0,x=A.length;v<x;v++){const C=A[v];if(d(C,L,v,P)===!0){const G=C.__offset,V=Array.isArray(C.value)?C.value:[C.value];let Z=0;for(let ee=0;ee<V.length;ee++){const J=V[ee],Q=g(J);typeof J=="number"||typeof J=="boolean"?(C.__data[0]=J,t.bufferSubData(t.UNIFORM_BUFFER,G+Z,C.__data)):J.isMatrix3?(C.__data[0]=J.elements[0],C.__data[1]=J.elements[1],C.__data[2]=J.elements[2],C.__data[3]=0,C.__data[4]=J.elements[3],C.__data[5]=J.elements[4],C.__data[6]=J.elements[5],C.__data[7]=0,C.__data[8]=J.elements[6],C.__data[9]=J.elements[7],C.__data[10]=J.elements[8],C.__data[11]=0):(J.toArray(C.__data,Z),Z+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,G,C.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function d(T,R,y,P){const L=T.value,M=R+"_"+y;if(P[M]===void 0)return typeof L=="number"||typeof L=="boolean"?P[M]=L:P[M]=L.clone(),!0;{const A=P[M];if(typeof L=="number"||typeof L=="boolean"){if(A!==L)return P[M]=L,!0}else if(A.equals(L)===!1)return A.copy(L),!0}return!1}function _(T){const R=T.uniforms;let y=0;const P=16;for(let M=0,A=R.length;M<A;M++){const v=Array.isArray(R[M])?R[M]:[R[M]];for(let x=0,C=v.length;x<C;x++){const G=v[x],V=Array.isArray(G.value)?G.value:[G.value];for(let Z=0,ee=V.length;Z<ee;Z++){const J=V[Z],Q=g(J),N=y%P,ae=N%Q.boundary,pe=N+ae;y+=ae,pe!==0&&P-pe<Q.storage&&(y+=P-pe),G.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=y,y+=Q.storage}}}const L=y%P;return L>0&&(y+=P-L),T.__size=y,T.__cache={},this}function g(T){const R={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(R.boundary=4,R.storage=4):T.isVector2?(R.boundary=8,R.storage=8):T.isVector3||T.isColor?(R.boundary=16,R.storage=12):T.isVector4?(R.boundary=16,R.storage=16):T.isMatrix3?(R.boundary=48,R.storage=48):T.isMatrix4?(R.boundary=64,R.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),R}function m(T){const R=T.target;R.removeEventListener("dispose",m);const y=o.indexOf(R.__bindingPointIndex);o.splice(y,1),t.deleteBuffer(r[R.id]),delete r[R.id],delete s[R.id]}function p(){for(const T in r)t.deleteBuffer(r[T]);o=[],r={},s={}}return{bind:l,update:c,dispose:p}}class rg{constructor(e={}){const{canvas:n=JS(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=o;const _=new Uint32Array(4),g=new Int32Array(4);let m=null,p=null;const T=[],R=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Qt,this.toneMapping=Ji,this.toneMappingExposure=1;const y=this;let P=!1,L=0,M=0,A=null,v=-1,x=null;const C=new bt,G=new bt;let V=null;const Z=new Ze(0);let ee=0,J=n.width,Q=n.height,N=1,ae=null,pe=null;const Te=new bt(0,0,J,Q),Fe=new bt(0,0,J,Q);let it=!1;const ie=new Cf;let de=!1,Ee=!1;this.transmissionResolutionScale=1;const _e=new lt,Pe=new lt,Je=new O,De=new bt,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let D=!1;function U(){return A===null?N:1}let E=i;function re(w,B){return n.getContext(w,B)}try{const w={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${xf}`),n.addEventListener("webglcontextlost",se,!1),n.addEventListener("webglcontextrestored",Se,!1),n.addEventListener("webglcontextcreationerror",be,!1),E===null){const B="webgl2";if(E=re(B,w),E===null)throw re(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let q,K,te,oe,j,S,b,I,H,W,X,he,le,fe,Ie,ce,ve,Ce,Oe,me,ke,Ge,ct,F;function xe(){q=new NT(E),q.init(),Ge=new gA(E,q),K=new RT(E,q,e,Ge),te=new mA(E,q),K.reverseDepthBuffer&&h&&te.buffers.depth.setReversed(!0),oe=new BT(E),j=new nA,S=new _A(E,q,te,j,K,Ge,oe),b=new PT(y),I=new UT(y),H=new WM(E),ct=new TT(E,H),W=new FT(E,H,oe,ct),X=new zT(E,W,H,oe),Oe=new kT(E,K,S),ce=new CT(j),he=new tA(y,b,I,q,K,ct,ce),le=new MA(y,j),fe=new rA,Ie=new uA(q),Ce=new wT(y,b,I,te,X,d,l),ve=new dA(y,X,K),F=new EA(E,oe,K,te),me=new AT(E,q,oe),ke=new OT(E,q,oe),oe.programs=he.programs,y.capabilities=K,y.extensions=q,y.properties=j,y.renderLists=fe,y.shadowMap=ve,y.state=te,y.info=oe}xe();const ne=new bA(y,E);this.xr=ne,this.getContext=function(){return E},this.getContextAttributes=function(){return E.getContextAttributes()},this.forceContextLoss=function(){const w=q.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=q.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(w){w!==void 0&&(N=w,this.setSize(J,Q,!1))},this.getSize=function(w){return w.set(J,Q)},this.setSize=function(w,B,Y=!0){if(ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}J=w,Q=B,n.width=Math.floor(w*N),n.height=Math.floor(B*N),Y===!0&&(n.style.width=w+"px",n.style.height=B+"px"),this.setViewport(0,0,w,B)},this.getDrawingBufferSize=function(w){return w.set(J*N,Q*N).floor()},this.setDrawingBufferSize=function(w,B,Y){J=w,Q=B,N=Y,n.width=Math.floor(w*Y),n.height=Math.floor(B*Y),this.setViewport(0,0,w,B)},this.getCurrentViewport=function(w){return w.copy(C)},this.getViewport=function(w){return w.copy(Te)},this.setViewport=function(w,B,Y,$){w.isVector4?Te.set(w.x,w.y,w.z,w.w):Te.set(w,B,Y,$),te.viewport(C.copy(Te).multiplyScalar(N).round())},this.getScissor=function(w){return w.copy(Fe)},this.setScissor=function(w,B,Y,$){w.isVector4?Fe.set(w.x,w.y,w.z,w.w):Fe.set(w,B,Y,$),te.scissor(G.copy(Fe).multiplyScalar(N).round())},this.getScissorTest=function(){return it},this.setScissorTest=function(w){te.setScissorTest(it=w)},this.setOpaqueSort=function(w){ae=w},this.setTransparentSort=function(w){pe=w},this.getClearColor=function(w){return w.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor(...arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha(...arguments)},this.clear=function(w=!0,B=!0,Y=!0){let $=0;if(w){let k=!1;if(A!==null){const ue=A.texture.format;k=ue===wf||ue===Ef||ue===Mf}if(k){const ue=A.texture.type,ye=ue===Ii||ue===Rr||ue===Co||ue===Ss||ue===bf||ue===Sf,we=Ce.getClearColor(),Ae=Ce.getClearAlpha(),ze=we.r,He=we.g,Le=we.b;ye?(_[0]=ze,_[1]=He,_[2]=Le,_[3]=Ae,E.clearBufferuiv(E.COLOR,0,_)):(g[0]=ze,g[1]=He,g[2]=Le,g[3]=Ae,E.clearBufferiv(E.COLOR,0,g))}else $|=E.COLOR_BUFFER_BIT}B&&($|=E.DEPTH_BUFFER_BIT),Y&&($|=E.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),E.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",se,!1),n.removeEventListener("webglcontextrestored",Se,!1),n.removeEventListener("webglcontextcreationerror",be,!1),Ce.dispose(),fe.dispose(),Ie.dispose(),j.dispose(),b.dispose(),I.dispose(),X.dispose(),ct.dispose(),F.dispose(),he.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",Ff),ne.removeEventListener("sessionend",Of),nr.stop()};function se(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function Se(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const w=oe.autoReset,B=ve.enabled,Y=ve.autoUpdate,$=ve.needsUpdate,k=ve.type;xe(),oe.autoReset=w,ve.enabled=B,ve.autoUpdate=Y,ve.needsUpdate=$,ve.type=k}function be(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Ye(w){const B=w.target;B.removeEventListener("dispose",Ye),Mt(B)}function Mt(w){Gt(w),j.remove(w)}function Gt(w){const B=j.get(w).programs;B!==void 0&&(B.forEach(function(Y){he.releaseProgram(Y)}),w.isShaderMaterial&&he.releaseShaderCache(w))}this.renderBufferDirect=function(w,B,Y,$,k,ue){B===null&&(B=St);const ye=k.isMesh&&k.matrixWorld.determinant()<0,we=vg(w,B,Y,$,k);te.setMaterial($,ye);let Ae=Y.index,ze=1;if($.wireframe===!0){if(Ae=W.getWireframeAttribute(Y),Ae===void 0)return;ze=2}const He=Y.drawRange,Le=Y.attributes.position;let Qe=He.start*ze,rt=(He.start+He.count)*ze;ue!==null&&(Qe=Math.max(Qe,ue.start*ze),rt=Math.min(rt,(ue.start+ue.count)*ze)),Ae!==null?(Qe=Math.max(Qe,0),rt=Math.min(rt,Ae.count)):Le!=null&&(Qe=Math.max(Qe,0),rt=Math.min(rt,Le.count));const Rt=rt-Qe;if(Rt<0||Rt===1/0)return;ct.setup(k,$,we,Y,Ae);let Et,et=me;if(Ae!==null&&(Et=H.get(Ae),et=ke,et.setIndex(Et)),k.isMesh)$.wireframe===!0?(te.setLineWidth($.wireframeLinewidth*U()),et.setMode(E.LINES)):et.setMode(E.TRIANGLES);else if(k.isLine){let Ue=$.linewidth;Ue===void 0&&(Ue=1),te.setLineWidth(Ue*U()),k.isLineSegments?et.setMode(E.LINES):k.isLineLoop?et.setMode(E.LINE_LOOP):et.setMode(E.LINE_STRIP)}else k.isPoints?et.setMode(E.POINTS):k.isSprite&&et.setMode(E.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)dr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),et.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(q.get("WEBGL_multi_draw"))et.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Ue=k._multiDrawStarts,zt=k._multiDrawCounts,st=k._multiDrawCount,Pn=Ae?H.get(Ae).bytesPerElement:1,Nr=j.get($).currentProgram.getUniforms();for(let dn=0;dn<st;dn++)Nr.setValue(E,"_gl_DrawID",dn),et.render(Ue[dn]/Pn,zt[dn])}else if(k.isInstancedMesh)et.renderInstances(Qe,Rt,k.count);else if(Y.isInstancedBufferGeometry){const Ue=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,zt=Math.min(Y.instanceCount,Ue);et.renderInstances(Qe,Rt,zt)}else et.render(Qe,Rt)};function ut(w,B,Y){w.transparent===!0&&w.side===Mi&&w.forceSinglePass===!1?(w.side=fn,w.needsUpdate=!0,jo(w,B,Y),w.side=er,w.needsUpdate=!0,jo(w,B,Y),w.side=Mi):jo(w,B,Y)}this.compile=function(w,B,Y=null){Y===null&&(Y=w),p=Ie.get(Y),p.init(B),R.push(p),Y.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),w!==Y&&w.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights();const $=new Set;return w.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const ue=k.material;if(ue)if(Array.isArray(ue))for(let ye=0;ye<ue.length;ye++){const we=ue[ye];ut(we,Y,k),$.add(we)}else ut(ue,Y,k),$.add(ue)}),p=R.pop(),$},this.compileAsync=function(w,B,Y=null){const $=this.compile(w,B,Y);return new Promise(k=>{function ue(){if($.forEach(function(ye){j.get(ye).currentProgram.isReady()&&$.delete(ye)}),$.size===0){k(w);return}setTimeout(ue,10)}q.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let Cn=null;function li(w){Cn&&Cn(w)}function Ff(){nr.stop()}function Of(){nr.start()}const nr=new Q_;nr.setAnimationLoop(li),typeof self<"u"&&nr.setContext(self),this.setAnimationLoop=function(w){Cn=w,ne.setAnimationLoop(w),w===null?nr.stop():nr.start()},ne.addEventListener("sessionstart",Ff),ne.addEventListener("sessionend",Of),this.render=function(w,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(B),B=ne.getCamera()),w.isScene===!0&&w.onBeforeRender(y,w,B,A),p=Ie.get(w,R.length),p.init(B),R.push(p),Pe.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),ie.setFromProjectionMatrix(Pe),Ee=this.localClippingEnabled,de=ce.init(this.clippingPlanes,Ee),m=fe.get(w,T.length),m.init(),T.push(m),ne.enabled===!0&&ne.isPresenting===!0){const ue=y.xr.getDepthSensingMesh();ue!==null&&El(ue,B,-1/0,y.sortObjects)}El(w,B,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(ae,pe),D=ne.enabled===!1||ne.isPresenting===!1||ne.hasDepthSensing()===!1,D&&Ce.addToRenderList(m,w),this.info.render.frame++,de===!0&&ce.beginShadows();const Y=p.state.shadowsArray;ve.render(Y,w,B),de===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const $=m.opaque,k=m.transmissive;if(p.setupLights(),B.isArrayCamera){const ue=B.cameras;if(k.length>0)for(let ye=0,we=ue.length;ye<we;ye++){const Ae=ue[ye];kf($,k,w,Ae)}D&&Ce.render(w);for(let ye=0,we=ue.length;ye<we;ye++){const Ae=ue[ye];Bf(m,w,Ae,Ae.viewport)}}else k.length>0&&kf($,k,w,B),D&&Ce.render(w),Bf(m,w,B);A!==null&&M===0&&(S.updateMultisampleRenderTarget(A),S.updateRenderTargetMipmap(A)),w.isScene===!0&&w.onAfterRender(y,w,B),ct.resetDefaultState(),v=-1,x=null,R.pop(),R.length>0?(p=R[R.length-1],de===!0&&ce.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function El(w,B,Y,$){if(w.visible===!1)return;if(w.layers.test(B.layers)){if(w.isGroup)Y=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(B);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||ie.intersectsSprite(w)){$&&De.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Pe);const ye=X.update(w),we=w.material;we.visible&&m.push(w,ye,we,Y,De.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||ie.intersectsObject(w))){const ye=X.update(w),we=w.material;if($&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),De.copy(w.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),De.copy(ye.boundingSphere.center)),De.applyMatrix4(w.matrixWorld).applyMatrix4(Pe)),Array.isArray(we)){const Ae=ye.groups;for(let ze=0,He=Ae.length;ze<He;ze++){const Le=Ae[ze],Qe=we[Le.materialIndex];Qe&&Qe.visible&&m.push(w,ye,Qe,Y,De.z,Le)}}else we.visible&&m.push(w,ye,we,Y,De.z,null)}}const ue=w.children;for(let ye=0,we=ue.length;ye<we;ye++)El(ue[ye],B,Y,$)}function Bf(w,B,Y,$){const k=w.opaque,ue=w.transmissive,ye=w.transparent;p.setupLightsView(Y),de===!0&&ce.setGlobalState(y.clippingPlanes,Y),$&&te.viewport(C.copy($)),k.length>0&&$o(k,B,Y),ue.length>0&&$o(ue,B,Y),ye.length>0&&$o(ye,B,Y),te.buffers.depth.setTest(!0),te.buffers.depth.setMask(!0),te.buffers.color.setMask(!0),te.setPolygonOffset(!1)}function kf(w,B,Y,$){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[$.id]===void 0&&(p.state.transmissionRenderTarget[$.id]=new Cr(1,1,{generateMipmaps:!0,type:q.has("EXT_color_buffer_half_float")||q.has("EXT_color_buffer_float")?Go:Ii,minFilter:yr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const ue=p.state.transmissionRenderTarget[$.id],ye=$.viewport||C;ue.setSize(ye.z*y.transmissionResolutionScale,ye.w*y.transmissionResolutionScale);const we=y.getRenderTarget();y.setRenderTarget(ue),y.getClearColor(Z),ee=y.getClearAlpha(),ee<1&&y.setClearColor(16777215,.5),y.clear(),D&&Ce.render(Y);const Ae=y.toneMapping;y.toneMapping=Ji;const ze=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),p.setupLightsView($),de===!0&&ce.setGlobalState(y.clippingPlanes,$),$o(w,Y,$),S.updateMultisampleRenderTarget(ue),S.updateRenderTargetMipmap(ue),q.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let Le=0,Qe=B.length;Le<Qe;Le++){const rt=B[Le],Rt=rt.object,Et=rt.geometry,et=rt.material,Ue=rt.group;if(et.side===Mi&&Rt.layers.test($.layers)){const zt=et.side;et.side=fn,et.needsUpdate=!0,zf(Rt,Y,$,Et,et,Ue),et.side=zt,et.needsUpdate=!0,He=!0}}He===!0&&(S.updateMultisampleRenderTarget(ue),S.updateRenderTargetMipmap(ue))}y.setRenderTarget(we),y.setClearColor(Z,ee),ze!==void 0&&($.viewport=ze),y.toneMapping=Ae}function $o(w,B,Y){const $=B.isScene===!0?B.overrideMaterial:null;for(let k=0,ue=w.length;k<ue;k++){const ye=w[k],we=ye.object,Ae=ye.geometry,ze=$===null?ye.material:$,He=ye.group;we.layers.test(Y.layers)&&zf(we,B,Y,Ae,ze,He)}}function zf(w,B,Y,$,k,ue){w.onBeforeRender(y,B,Y,$,k,ue),w.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),k.onBeforeRender(y,B,Y,$,w,ue),k.transparent===!0&&k.side===Mi&&k.forceSinglePass===!1?(k.side=fn,k.needsUpdate=!0,y.renderBufferDirect(Y,B,$,k,w,ue),k.side=er,k.needsUpdate=!0,y.renderBufferDirect(Y,B,$,k,w,ue),k.side=Mi):y.renderBufferDirect(Y,B,$,k,w,ue),w.onAfterRender(y,B,Y,$,k,ue)}function jo(w,B,Y){B.isScene!==!0&&(B=St);const $=j.get(w),k=p.state.lights,ue=p.state.shadowsArray,ye=k.state.version,we=he.getParameters(w,k.state,ue,B,Y),Ae=he.getProgramCacheKey(we);let ze=$.programs;$.environment=w.isMeshStandardMaterial?B.environment:null,$.fog=B.fog,$.envMap=(w.isMeshStandardMaterial?I:b).get(w.envMap||$.environment),$.envMapRotation=$.environment!==null&&w.envMap===null?B.environmentRotation:w.envMapRotation,ze===void 0&&(w.addEventListener("dispose",Ye),ze=new Map,$.programs=ze);let He=ze.get(Ae);if(He!==void 0){if($.currentProgram===He&&$.lightsStateVersion===ye)return Vf(w,we),He}else we.uniforms=he.getUniforms(w),w.onBeforeCompile(we,y),He=he.acquireProgram(we,Ae),ze.set(Ae,He),$.uniforms=we.uniforms;const Le=$.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Le.clippingPlanes=ce.uniform),Vf(w,we),$.needsLights=yg(w),$.lightsStateVersion=ye,$.needsLights&&(Le.ambientLightColor.value=k.state.ambient,Le.lightProbe.value=k.state.probe,Le.directionalLights.value=k.state.directional,Le.directionalLightShadows.value=k.state.directionalShadow,Le.spotLights.value=k.state.spot,Le.spotLightShadows.value=k.state.spotShadow,Le.rectAreaLights.value=k.state.rectArea,Le.ltc_1.value=k.state.rectAreaLTC1,Le.ltc_2.value=k.state.rectAreaLTC2,Le.pointLights.value=k.state.point,Le.pointLightShadows.value=k.state.pointShadow,Le.hemisphereLights.value=k.state.hemi,Le.directionalShadowMap.value=k.state.directionalShadowMap,Le.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Le.spotShadowMap.value=k.state.spotShadowMap,Le.spotLightMatrix.value=k.state.spotLightMatrix,Le.spotLightMap.value=k.state.spotLightMap,Le.pointShadowMap.value=k.state.pointShadowMap,Le.pointShadowMatrix.value=k.state.pointShadowMatrix),$.currentProgram=He,$.uniformsList=null,He}function Hf(w){if(w.uniformsList===null){const B=w.currentProgram.getUniforms();w.uniformsList=za.seqWithValue(B.seq,w.uniforms)}return w.uniformsList}function Vf(w,B){const Y=j.get(w);Y.outputColorSpace=B.outputColorSpace,Y.batching=B.batching,Y.batchingColor=B.batchingColor,Y.instancing=B.instancing,Y.instancingColor=B.instancingColor,Y.instancingMorph=B.instancingMorph,Y.skinning=B.skinning,Y.morphTargets=B.morphTargets,Y.morphNormals=B.morphNormals,Y.morphColors=B.morphColors,Y.morphTargetsCount=B.morphTargetsCount,Y.numClippingPlanes=B.numClippingPlanes,Y.numIntersection=B.numClipIntersection,Y.vertexAlphas=B.vertexAlphas,Y.vertexTangents=B.vertexTangents,Y.toneMapping=B.toneMapping}function vg(w,B,Y,$,k){B.isScene!==!0&&(B=St),S.resetTextureUnits();const ue=B.fog,ye=$.isMeshStandardMaterial?B.environment:null,we=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Es,Ae=($.isMeshStandardMaterial?I:b).get($.envMap||ye),ze=$.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,He=!!Y.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Le=!!Y.morphAttributes.position,Qe=!!Y.morphAttributes.normal,rt=!!Y.morphAttributes.color;let Rt=Ji;$.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Rt=y.toneMapping);const Et=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,et=Et!==void 0?Et.length:0,Ue=j.get($),zt=p.state.lights;if(de===!0&&(Ee===!0||w!==x)){const qt=w===x&&$.id===v;ce.setState($,w,qt)}let st=!1;$.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==zt.state.version||Ue.outputColorSpace!==we||k.isBatchedMesh&&Ue.batching===!1||!k.isBatchedMesh&&Ue.batching===!0||k.isBatchedMesh&&Ue.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Ue.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Ue.instancing===!1||!k.isInstancedMesh&&Ue.instancing===!0||k.isSkinnedMesh&&Ue.skinning===!1||!k.isSkinnedMesh&&Ue.skinning===!0||k.isInstancedMesh&&Ue.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Ue.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Ue.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Ue.instancingMorph===!1&&k.morphTexture!==null||Ue.envMap!==Ae||$.fog===!0&&Ue.fog!==ue||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==ce.numPlanes||Ue.numIntersection!==ce.numIntersection)||Ue.vertexAlphas!==ze||Ue.vertexTangents!==He||Ue.morphTargets!==Le||Ue.morphNormals!==Qe||Ue.morphColors!==rt||Ue.toneMapping!==Rt||Ue.morphTargetsCount!==et)&&(st=!0):(st=!0,Ue.__version=$.version);let Pn=Ue.currentProgram;st===!0&&(Pn=jo($,B,k));let Nr=!1,dn=!1,ks=!1;const vt=Pn.getUniforms(),bn=Ue.uniforms;if(te.useProgram(Pn.program)&&(Nr=!0,dn=!0,ks=!0),$.id!==v&&(v=$.id,dn=!0),Nr||x!==w){te.buffers.depth.getReversed()?(_e.copy(w.projectionMatrix),eM(_e),tM(_e),vt.setValue(E,"projectionMatrix",_e)):vt.setValue(E,"projectionMatrix",w.projectionMatrix),vt.setValue(E,"viewMatrix",w.matrixWorldInverse);const on=vt.map.cameraPosition;on!==void 0&&on.setValue(E,Je.setFromMatrixPosition(w.matrixWorld)),K.logarithmicDepthBuffer&&vt.setValue(E,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&vt.setValue(E,"isOrthographic",w.isOrthographicCamera===!0),x!==w&&(x=w,dn=!0,ks=!0)}if(k.isSkinnedMesh){vt.setOptional(E,k,"bindMatrix"),vt.setOptional(E,k,"bindMatrixInverse");const qt=k.skeleton;qt&&(qt.boneTexture===null&&qt.computeBoneTexture(),vt.setValue(E,"boneTexture",qt.boneTexture,S))}k.isBatchedMesh&&(vt.setOptional(E,k,"batchingTexture"),vt.setValue(E,"batchingTexture",k._matricesTexture,S),vt.setOptional(E,k,"batchingIdTexture"),vt.setValue(E,"batchingIdTexture",k._indirectTexture,S),vt.setOptional(E,k,"batchingColorTexture"),k._colorsTexture!==null&&vt.setValue(E,"batchingColorTexture",k._colorsTexture,S));const Sn=Y.morphAttributes;if((Sn.position!==void 0||Sn.normal!==void 0||Sn.color!==void 0)&&Oe.update(k,Y,Pn),(dn||Ue.receiveShadow!==k.receiveShadow)&&(Ue.receiveShadow=k.receiveShadow,vt.setValue(E,"receiveShadow",k.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(bn.envMap.value=Ae,bn.flipEnvMap.value=Ae.isCubeTexture&&Ae.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&B.environment!==null&&(bn.envMapIntensity.value=B.environmentIntensity),dn&&(vt.setValue(E,"toneMappingExposure",y.toneMappingExposure),Ue.needsLights&&xg(bn,ks),ue&&$.fog===!0&&le.refreshFogUniforms(bn,ue),le.refreshMaterialUniforms(bn,$,N,Q,p.state.transmissionRenderTarget[w.id]),za.upload(E,Hf(Ue),bn,S)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(za.upload(E,Hf(Ue),bn,S),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&vt.setValue(E,"center",k.center),vt.setValue(E,"modelViewMatrix",k.modelViewMatrix),vt.setValue(E,"normalMatrix",k.normalMatrix),vt.setValue(E,"modelMatrix",k.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const qt=$.uniformsGroups;for(let on=0,wl=qt.length;on<wl;on++){const ir=qt[on];F.update(ir,Pn),F.bind(ir,Pn)}}return Pn}function xg(w,B){w.ambientLightColor.needsUpdate=B,w.lightProbe.needsUpdate=B,w.directionalLights.needsUpdate=B,w.directionalLightShadows.needsUpdate=B,w.pointLights.needsUpdate=B,w.pointLightShadows.needsUpdate=B,w.spotLights.needsUpdate=B,w.spotLightShadows.needsUpdate=B,w.rectAreaLights.needsUpdate=B,w.hemisphereLights.needsUpdate=B}function yg(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(w,B,Y){j.get(w.texture).__webglTexture=B,j.get(w.depthTexture).__webglTexture=Y;const $=j.get(w);$.__hasExternalTextures=!0,$.__autoAllocateDepthBuffer=Y===void 0,$.__autoAllocateDepthBuffer||q.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,B){const Y=j.get(w);Y.__webglFramebuffer=B,Y.__useDefaultFramebuffer=B===void 0};const bg=E.createFramebuffer();this.setRenderTarget=function(w,B=0,Y=0){A=w,L=B,M=Y;let $=!0,k=null,ue=!1,ye=!1;if(w){const Ae=j.get(w);if(Ae.__useDefaultFramebuffer!==void 0)te.bindFramebuffer(E.FRAMEBUFFER,null),$=!1;else if(Ae.__webglFramebuffer===void 0)S.setupRenderTarget(w);else if(Ae.__hasExternalTextures)S.rebindTextures(w,j.get(w.texture).__webglTexture,j.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Le=w.depthTexture;if(Ae.__boundDepthTexture!==Le){if(Le!==null&&j.has(Le)&&(w.width!==Le.image.width||w.height!==Le.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");S.setupDepthRenderbuffer(w)}}const ze=w.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(ye=!0);const He=j.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(He[B])?k=He[B][Y]:k=He[B],ue=!0):w.samples>0&&S.useMultisampledRTT(w)===!1?k=j.get(w).__webglMultisampledFramebuffer:Array.isArray(He)?k=He[Y]:k=He,C.copy(w.viewport),G.copy(w.scissor),V=w.scissorTest}else C.copy(Te).multiplyScalar(N).floor(),G.copy(Fe).multiplyScalar(N).floor(),V=it;if(Y!==0&&(k=bg),te.bindFramebuffer(E.FRAMEBUFFER,k)&&$&&te.drawBuffers(w,k),te.viewport(C),te.scissor(G),te.setScissorTest(V),ue){const Ae=j.get(w.texture);E.framebufferTexture2D(E.FRAMEBUFFER,E.COLOR_ATTACHMENT0,E.TEXTURE_CUBE_MAP_POSITIVE_X+B,Ae.__webglTexture,Y)}else if(ye){const Ae=j.get(w.texture),ze=B;E.framebufferTextureLayer(E.FRAMEBUFFER,E.COLOR_ATTACHMENT0,Ae.__webglTexture,Y,ze)}else if(w!==null&&Y!==0){const Ae=j.get(w.texture);E.framebufferTexture2D(E.FRAMEBUFFER,E.COLOR_ATTACHMENT0,E.TEXTURE_2D,Ae.__webglTexture,Y)}v=-1},this.readRenderTargetPixels=function(w,B,Y,$,k,ue,ye){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=j.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ye!==void 0&&(we=we[ye]),we){te.bindFramebuffer(E.FRAMEBUFFER,we);try{const Ae=w.texture,ze=Ae.format,He=Ae.type;if(!K.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!K.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=w.width-$&&Y>=0&&Y<=w.height-k&&E.readPixels(B,Y,$,k,Ge.convert(ze),Ge.convert(He),ue)}finally{const Ae=A!==null?j.get(A).__webglFramebuffer:null;te.bindFramebuffer(E.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(w,B,Y,$,k,ue,ye){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=j.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ye!==void 0&&(we=we[ye]),we){const Ae=w.texture,ze=Ae.format,He=Ae.type;if(!K.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!K.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=w.width-$&&Y>=0&&Y<=w.height-k){te.bindFramebuffer(E.FRAMEBUFFER,we);const Le=E.createBuffer();E.bindBuffer(E.PIXEL_PACK_BUFFER,Le),E.bufferData(E.PIXEL_PACK_BUFFER,ue.byteLength,E.STREAM_READ),E.readPixels(B,Y,$,k,Ge.convert(ze),Ge.convert(He),0);const Qe=A!==null?j.get(A).__webglFramebuffer:null;te.bindFramebuffer(E.FRAMEBUFFER,Qe);const rt=E.fenceSync(E.SYNC_GPU_COMMANDS_COMPLETE,0);return E.flush(),await QS(E,rt,4),E.bindBuffer(E.PIXEL_PACK_BUFFER,Le),E.getBufferSubData(E.PIXEL_PACK_BUFFER,0,ue),E.deleteBuffer(Le),E.deleteSync(rt),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,B=null,Y=0){w.isTexture!==!0&&(dr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,w=arguments[1]);const $=Math.pow(2,-Y),k=Math.floor(w.image.width*$),ue=Math.floor(w.image.height*$),ye=B!==null?B.x:0,we=B!==null?B.y:0;S.setTexture2D(w,0),E.copyTexSubImage2D(E.TEXTURE_2D,Y,0,0,ye,we,k,ue),te.unbindTexture()};const Sg=E.createFramebuffer(),Mg=E.createFramebuffer();this.copyTextureToTexture=function(w,B,Y=null,$=null,k=0,ue=null){w.isTexture!==!0&&(dr("WebGLRenderer: copyTextureToTexture function signature has changed."),$=arguments[0]||null,w=arguments[1],B=arguments[2],ue=arguments[3]||0,Y=null),ue===null&&(k!==0?(dr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ue=k,k=0):ue=0);let ye,we,Ae,ze,He,Le,Qe,rt,Rt;const Et=w.isCompressedTexture?w.mipmaps[ue]:w.image;if(Y!==null)ye=Y.max.x-Y.min.x,we=Y.max.y-Y.min.y,Ae=Y.isBox3?Y.max.z-Y.min.z:1,ze=Y.min.x,He=Y.min.y,Le=Y.isBox3?Y.min.z:0;else{const Sn=Math.pow(2,-k);ye=Math.floor(Et.width*Sn),we=Math.floor(Et.height*Sn),w.isDataArrayTexture?Ae=Et.depth:w.isData3DTexture?Ae=Math.floor(Et.depth*Sn):Ae=1,ze=0,He=0,Le=0}$!==null?(Qe=$.x,rt=$.y,Rt=$.z):(Qe=0,rt=0,Rt=0);const et=Ge.convert(B.format),Ue=Ge.convert(B.type);let zt;B.isData3DTexture?(S.setTexture3D(B,0),zt=E.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(S.setTexture2DArray(B,0),zt=E.TEXTURE_2D_ARRAY):(S.setTexture2D(B,0),zt=E.TEXTURE_2D),E.pixelStorei(E.UNPACK_FLIP_Y_WEBGL,B.flipY),E.pixelStorei(E.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),E.pixelStorei(E.UNPACK_ALIGNMENT,B.unpackAlignment);const st=E.getParameter(E.UNPACK_ROW_LENGTH),Pn=E.getParameter(E.UNPACK_IMAGE_HEIGHT),Nr=E.getParameter(E.UNPACK_SKIP_PIXELS),dn=E.getParameter(E.UNPACK_SKIP_ROWS),ks=E.getParameter(E.UNPACK_SKIP_IMAGES);E.pixelStorei(E.UNPACK_ROW_LENGTH,Et.width),E.pixelStorei(E.UNPACK_IMAGE_HEIGHT,Et.height),E.pixelStorei(E.UNPACK_SKIP_PIXELS,ze),E.pixelStorei(E.UNPACK_SKIP_ROWS,He),E.pixelStorei(E.UNPACK_SKIP_IMAGES,Le);const vt=w.isDataArrayTexture||w.isData3DTexture,bn=B.isDataArrayTexture||B.isData3DTexture;if(w.isDepthTexture){const Sn=j.get(w),qt=j.get(B),on=j.get(Sn.__renderTarget),wl=j.get(qt.__renderTarget);te.bindFramebuffer(E.READ_FRAMEBUFFER,on.__webglFramebuffer),te.bindFramebuffer(E.DRAW_FRAMEBUFFER,wl.__webglFramebuffer);for(let ir=0;ir<Ae;ir++)vt&&(E.framebufferTextureLayer(E.READ_FRAMEBUFFER,E.COLOR_ATTACHMENT0,j.get(w).__webglTexture,k,Le+ir),E.framebufferTextureLayer(E.DRAW_FRAMEBUFFER,E.COLOR_ATTACHMENT0,j.get(B).__webglTexture,ue,Rt+ir)),E.blitFramebuffer(ze,He,ye,we,Qe,rt,ye,we,E.DEPTH_BUFFER_BIT,E.NEAREST);te.bindFramebuffer(E.READ_FRAMEBUFFER,null),te.bindFramebuffer(E.DRAW_FRAMEBUFFER,null)}else if(k!==0||w.isRenderTargetTexture||j.has(w)){const Sn=j.get(w),qt=j.get(B);te.bindFramebuffer(E.READ_FRAMEBUFFER,Sg),te.bindFramebuffer(E.DRAW_FRAMEBUFFER,Mg);for(let on=0;on<Ae;on++)vt?E.framebufferTextureLayer(E.READ_FRAMEBUFFER,E.COLOR_ATTACHMENT0,Sn.__webglTexture,k,Le+on):E.framebufferTexture2D(E.READ_FRAMEBUFFER,E.COLOR_ATTACHMENT0,E.TEXTURE_2D,Sn.__webglTexture,k),bn?E.framebufferTextureLayer(E.DRAW_FRAMEBUFFER,E.COLOR_ATTACHMENT0,qt.__webglTexture,ue,Rt+on):E.framebufferTexture2D(E.DRAW_FRAMEBUFFER,E.COLOR_ATTACHMENT0,E.TEXTURE_2D,qt.__webglTexture,ue),k!==0?E.blitFramebuffer(ze,He,ye,we,Qe,rt,ye,we,E.COLOR_BUFFER_BIT,E.NEAREST):bn?E.copyTexSubImage3D(zt,ue,Qe,rt,Rt+on,ze,He,ye,we):E.copyTexSubImage2D(zt,ue,Qe,rt,ze,He,ye,we);te.bindFramebuffer(E.READ_FRAMEBUFFER,null),te.bindFramebuffer(E.DRAW_FRAMEBUFFER,null)}else bn?w.isDataTexture||w.isData3DTexture?E.texSubImage3D(zt,ue,Qe,rt,Rt,ye,we,Ae,et,Ue,Et.data):B.isCompressedArrayTexture?E.compressedTexSubImage3D(zt,ue,Qe,rt,Rt,ye,we,Ae,et,Et.data):E.texSubImage3D(zt,ue,Qe,rt,Rt,ye,we,Ae,et,Ue,Et):w.isDataTexture?E.texSubImage2D(E.TEXTURE_2D,ue,Qe,rt,ye,we,et,Ue,Et.data):w.isCompressedTexture?E.compressedTexSubImage2D(E.TEXTURE_2D,ue,Qe,rt,Et.width,Et.height,et,Et.data):E.texSubImage2D(E.TEXTURE_2D,ue,Qe,rt,ye,we,et,Ue,Et);E.pixelStorei(E.UNPACK_ROW_LENGTH,st),E.pixelStorei(E.UNPACK_IMAGE_HEIGHT,Pn),E.pixelStorei(E.UNPACK_SKIP_PIXELS,Nr),E.pixelStorei(E.UNPACK_SKIP_ROWS,dn),E.pixelStorei(E.UNPACK_SKIP_IMAGES,ks),ue===0&&B.generateMipmaps&&E.generateMipmap(zt),te.unbindTexture()},this.copyTextureToTexture3D=function(w,B,Y=null,$=null,k=0){return w.isTexture!==!0&&(dr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Y=arguments[0]||null,$=arguments[1]||null,w=arguments[2],B=arguments[3],k=arguments[4]||0),dr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,B,Y,$,k)},this.initRenderTarget=function(w){j.get(w).__webglFramebuffer===void 0&&S.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?S.setTextureCube(w,0):w.isData3DTexture?S.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?S.setTexture2DArray(w,0):S.setTexture2D(w,0),te.unbindTexture()},this.resetState=function(){L=0,M=0,A=null,te.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ti}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=tt._getDrawingBufferColorSpace(e),n.unpackColorSpace=tt._getUnpackColorSpace()}}function wA(t){const e=atob(t),n=new Uint8Array(e.length);for(let i=0;i<e.length;i++)n[i]=e.charCodeAt(i);return n}async function TA(t){if(typeof DecompressionStream>"u")throw new Error("当前环境不支持 DecompressionStream（gzip），无法解压 Compact 场景");const e=new DecompressionStream("gzip"),n=new Blob([t]).stream().pipeThrough(e),i=await new Response(n).arrayBuffer();return new Uint8Array(i)}function AA(t){return t!==null&&typeof t=="object"&&!Array.isArray(t)&&t.documentFormat==="Compact"}async function sg(t){if(!AA(t))return t;if(t.payloadEncoding!==Jc)throw new Error(`不支持的 payloadEncoding：期望 "${Jc}"，实际为 ${String(t.payloadEncoding)}`);if(typeof t.payload!="string"||t.payload.length===0)throw new Error("Compact 文档缺少非空 payload 字符串");const{meta:e}=t;if(e===null||typeof e!="object"||Array.isArray(e))throw new Error("Compact 文档缺少 meta 对象");const n=wA(t.payload),i=await TA(n),r=new TextDecoder("utf-8").decode(i);let s;try{s=JSON.parse(r)}catch(o){throw new Error(`Compact payload 非合法 JSON：${o instanceof Error?o.message:String(o)}`)}if(s===null||typeof s!="object"||Array.isArray(s))throw new Error("Compact payload 解压后须为 JSON 对象");return{...e,...s}}function og(t){return{locator:t.locator??"minecraft:missingno",kind:t.kind,blend:t.blend,emissive:t.emissive,animation:t.animation}}function RA(t){const e={};for(let n=0;n<t.length;n++)e[String(n)]=og(t[n]);return{materials:e}}function CA(t){return{...t}}function ag(t){var r,s;const e=t.frames.length;if(e===0)return 0;const n=(r=t.playback)==null?void 0:r.defaultFrameIndex,i=n===void 0||!Number.isFinite(n)?0:Math.floor(n);return(s=t.playback)!=null&&s.loop?(i%e+e)%e:Math.max(0,Math.min(e-1,i))}function PA(t,e){return t.frames[e]}function Ns(t){return t==null?void 0:t.structure}function Hn(t){return t!=null&&t.geometryPhase==="baked"}function DA(t){if(!t||typeof t!="object")return{materials:{}};if(Ni(t)){const n={};for(let i=0;i<t.frames.length;i++){const r=Ns(t.frames[i]);if(!Hn(r))continue;const s=r.materialPalette;if(s!=null&&s.length)for(let o=0;o<s.length;o++)n[`${i}:${o}`]=og(s[o])}return{materials:n}}const e=t;return Hn(e)&&Array.isArray(e.materialPalette)&&e.materialPalette.length>0?RA(e.materialPalette):{materials:{}}}function lg(t){if(!t||typeof t!="object")throw new Error("StructureData 无效");const e=t;if(!Hn(e))throw new Error("StructureData 须为 geometryPhase=baked 的终态（含 blockPalette / materialPalette）");return CA(e)}function Ni(t){if(!t||typeof t!="object")return!1;const e=t;return Array.isArray(e.frames)&&typeof e.id=="string"}function LA(t,e){if(!Ni(t))throw new Error("不是 World 文档");const n=t,i=ag(n),r=PA(n,i);if(!r)throw new Error(`World 无帧索引 ${i}`);const s=Ns(r);if(!s)throw new Error(`World.frames[${i}] 无内嵌 structure（仅 structureRef 的帧尚无法加载）`);return lg(s)}function IA(t,e){return Ni(t)?LA(t):lg(t)}function UA(t){if(!t||typeof t!="object")return null;const e=t.textureBlobs;return!Array.isArray(e)||e.length===0||!e.every(n=>typeof n=="string"&&n.length>0)?null:e}function vp(t,e,n){if(Array.isArray(e))for(let i=0;i<e.length;i++){const r=e[i];if(!r||typeof r!="object")throw new Error(`${n}[${i}] 无效`);const s=r.textureBlobIndex;if(typeof s!="number"||!Number.isFinite(s))throw new Error(`${n}[${i}] 缺少有效 textureBlobIndex（须为 SDE 打包后的单文件 JSON）`);const o=Math.floor(s);if(o<0||o>=t.length)throw new Error(`${n}[${i}] textureBlobIndex=${o} 越界（textureBlobs.length=${t.length}）`)}}function NA(t){var i;const e=UA(t);if(!e)throw new Error("场景缺少非空 textureBlobs（须为含 Base64 PNG 池的打包 JSON；旧版仅 locator 已不再支持）");if(Ni(t)){for(let r=0;r<t.frames.length;r++){const s=Ns(t.frames[r]);Hn(s)&&((i=s.materialPalette)!=null&&i.length)&&vp(e,s.materialPalette,`World.frames[${r}].materialPalette`)}return}const n=t;Hn(n)&&Array.isArray(n.materialPalette)&&n.materialPalette.length>0&&vp(e,n.materialPalette,"materialPalette")}function FA(t){if(!t||typeof t!="object")throw new Error("RenderBundle 无效");NA(t.document)}function OA(t,e){const n=t==null?void 0:t.document;let i;return Ni(n)?i=`${ag(n)}:`:i=void 0,{definition:IA(n),materialKeyPrefix:i}}const xp=50;function cg(t,e){if(t<=0||e<=0)return 1;if(e%t!==0)throw new Error(`动画纹理高度须为宽度的整数倍：width=${t} height=${e}`);const n=e/t;return n<1?1:n}function BA(t,e){const n=t.animation;if(!n||e<1)return{frames:[{index:0}],durationMsPerFrame:[xp]};let i=n.frameSequence;i.length===0&&(i=Array.from({length:e},(o,a)=>({index:a})));const r=i.map(o=>({index:(o.index%e+e)%e,timeTicks:o.timeTicks})),s=r.map(o=>(o.timeTicks??n.defaultFrametimeTicks)*xp);return{frames:r,durationMsPerFrame:s}}const yp=2,kA=250,zA=10,HA=245,VA=.008;function GA(t,e){try{return cg(t,e)}catch{return 1}}function WA(t,e,n){const i=Math.max(1,Math.floor(n/GA(e,n))),r=Math.min(e,512),s=Math.min(i,512),o=document.createElement("canvas");o.width=r,o.height=s;const a=o.getContext("2d");if(!a)return null;try{return a.drawImage(t,0,0,e,i,0,0,r,s),a.getImageData(0,0,r,s)}catch{return null}}function XA(t){const{width:e,height:n,data:i}=t;let r=0,s=0,o=0,a=0;for(let c=0;c<n;c+=yp)for(let u=0;u<e;u+=yp){const f=(c*e+u)*4+3,h=i[f]??255;r++,h>=kA?a++:h<=zA?o++:h<HA&&s++}return r===0?"opaque":s/r>=VA?"translucent":o===0&&a===r?"opaque":"cutout"}function YA(t){const e=t.image;if(!e)return"opaque";let n=0,i=0;if("naturalWidth"in e&&e.naturalWidth>0?(n=e.naturalWidth,i=e.naturalHeight||("naturalHeight"in e?e.naturalHeight:0)):"width"in e&&e.width>0&&(n=e.width,i=e.height),n<=0||i<=0)return"opaque";const r=WA(e,n,i);return r?XA(r):"opaque"}function bp(t){const e=t.trim();return e.startsWith("data:")?e:`data:image/png;base64,${e}`}function $A(t){if(!t||typeof t!="object")return[];const n=t.textureBlobs;if(!Array.isArray(n))return[];if(Ni(t)){const o=[];for(let a=0;a<t.frames.length;a++){const l=Ns(t.frames[a]);if(!Hn(l))continue;const c=l.materialPalette;if(c!=null&&c.length)for(let u=0;u<c.length;u++){const h=c[u].textureBlobIndex;if(typeof h!="number"||!Number.isFinite(h))continue;const d=n[Math.floor(h)];typeof d=="string"&&o.push({materialId:`${a}:${u}`,dataUrl:bp(d)})}}return o}const i=t;if(!Hn(i)||!Array.isArray(i.materialPalette))return[];const r=i.materialPalette,s=[];for(let o=0;o<r.length;o++){const l=r[o].textureBlobIndex;if(typeof l!="number"||!Number.isFinite(l))continue;const c=n[Math.floor(l)];typeof c=="string"&&s.push({materialId:String(o),dataUrl:bp(c)})}return s}function jA(t,e){if(!t||typeof t!="object")return;if(Ni(t)){for(let r=0;r<t.frames.length;r++){const s=Ns(t.frames[r]);if(!Hn(s))continue;const o=s.materialPalette;if(o!=null&&o.length)for(let a=0;a<o.length;a++)e(o[a],`${r}:${a}`)}return}const n=t;if(!Hn(n)||!Array.isArray(n.materialPalette))return;const i=n.materialPalette;for(let r=0;r<i.length;r++)e(i[r],String(r))}function qA(t,e){jA(t,(n,i)=>{if(n.blend!==void 0)return;const r=e.get(i);if(!r){n.blend="opaque";return}n.blend=YA(r)})}const ZA="|";function ug(t){const e=t.useVertexColor===!0?"1":"0";return[t.materialId,t.blend,e,t.tint.getHex()].join(ZA)}function KA(t,e,n,i){const r=i?new Ze(16777215):e;if(n==="cutout"||n==="translucent"){const s=n==="cutout";return new zd({map:t,color:r,vertexColors:i,transparent:!0,alphaTest:s?.5:0,depthWrite:!0,roughness:.85,metalness:.05,polygonOffset:!1})}return new zd({map:t,color:r,vertexColors:i,roughness:.85,metalness:.05,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1})}function JA(t,e){if(t.animation){const n=t.animation;return{animation:{defaultFrametimeTicks:n.defaultFrametimeTicks??1,frameSequence:(n.frameSequence??[]).map(i=>({index:i.index,timeTicks:i.timeTicks})),interpolate:n.interpolate===!0}}}return t.kind==="animated"&&e>=2?{animation:{defaultFrametimeTicks:1,frameSequence:[],interpolate:!1}}:{}}function QA(t,e){return e<2?!1:t.animation!==void 0}function eR(t,e,n,i){const{frames:r,durationMsPerFrame:s}=BA(e,n);if(r.length===0)return;t.repeat.set(1,1/n),t.offset.set(0,0);let o=0,a=0;const l=u=>{const f=r[u%r.length].index,h=Math.max(0,Math.min(n-1,f));t.offset.y=h/n};l(0);const c=48;i(u=>{a+=u;const f=r.length;if(f===0)return;let h=0,d=s[o%f];for(d<=0&&(d=1);a>=d&&h<c;)a-=d,o=(o+1)%f,l(o),h++,d=s[o%f],d<=0&&(d=1)})}function tR(t,e,n){t.colorSpace=Qt,t.flipY=!1,t.magFilter=yn,t.minFilter=yn,t.wrapS=Ei,t.wrapT=Ei;const i=t.image,r="naturalWidth"in i&&i.naturalWidth||i.width,s="naturalHeight"in i&&i.naturalHeight||i.height;let o=1;try{o=cg(r,s)}catch{o=1}const a=JA(e,o);QA(a,o)?eR(t,a,o,n):(t.repeat.set(1,1),t.offset.set(0,0))}class nR{constructor(e,n){gt(this,"textureByMaterialId",new Map);gt(this,"materialByBatchKey",new Map);gt(this,"tickFns",[]);gt(this,"disposed",!1);for(const[i,r]of n){const s=e.materials[i];s&&(tR(r,s,o=>this.registerTick(o)),this.textureByMaterialId.set(i,r))}}tick(e){if(this.disposed)return;const n=Math.min(256,Math.max(0,e));for(const i of this.tickFns)i(n)}registerTick(e){this.tickFns.push(e)}async getMaterialForBatch(e){const n=ug(e),i=this.materialByBatchKey.get(n);if(i)return i;const{materialId:r,blend:s,tint:o}=e,a=this.textureByMaterialId.get(r);if(!a)throw new Error(`纹理未预取: ${r}`);const l=KA(a,o,s,e.useVertexColor===!0);return this.materialByBatchKey.set(n,l),l}dispose(){if(!this.disposed){this.disposed=!0,this.tickFns.length=0;for(const e of this.materialByBatchKey.values())e.dispose();this.materialByBatchKey.clear();for(const e of this.textureByMaterialId.values())e.dispose();this.textureByMaterialId.clear()}}}function bl(t){if(t instanceof Error)return t.message;if(typeof t=="string")return t;if(t!=null&&typeof t=="object"){const e=t.message;if(typeof e=="string"&&e.length>0)return e;if(typeof Event<"u"&&t instanceof Event){const n=t,i=[];if(n.type&&i.push(n.type),typeof n.message=="string"&&n.message.length>0&&i.push(n.message),typeof n.filename=="string"&&n.filename.length>0&&i.push(n.filename),i.length>0)return i.join(" · ")}}try{const e=JSON.stringify(t);if(e&&e!=="{}")return e}catch{}return String(t)}const rs="export";function iR(t,e){return new Promise((n,i)=>{t.load(e,n,void 0,i)})}async function rR(t){const e=await sg(t),n={document:e};FA(n);const i=new NM,r=$A(e),s=await Promise.all(r.map(async({materialId:c,dataUrl:u})=>{try{const f=await iR(i,u);return[c,f]}catch(f){throw new Error(`解码 textureBlobs 项失败（materialId=${c}）：${bl(f)}`)}})),o=new Map(s);qA(e,o);const a=DA(e),l=new nR(a,o);return{renderBundle:n,materialLibrary:l}}const sR="Compact",oR="gzip+base64",aR={geometryPhase:"baked",mode:"multiblock",id:"structuredata.exported",label:"structuredata.exported",author:"Developer",gtnhVersion:"MC1710",source:{note:"StructureDataExporter scan"},scanBounds:{minX:-487,maxY:8,minZ:-51}},lR="H4sIAAAAAAAA/+2dW3eiSrCA/0tezTmCouK8dXMRVERAUJwzD4iIKIoKgrrX/u8HzGWyZ4wC6kwy08laERCLpqiurvpS3f7zMHI9c941XCsIrIcvX/952Fi24webPT9++PJgOJuHx4eFFRgPX7DH+L3l2NoI3jg+9QEac2ssbY2xH59iW1581mb/8OWfB2tpemNnacfnjF7PafreUsPjM9fHT3z5+u3fxwfPNN3t2PLBeGaY1jJg47/xexPD9a1/H39sy2rlOtbYWlqb5Khj+qUvgeNa/wuTW6A2lhE4ocUkb+8pbxlsPNe1vjcfv23z/3lYGIG1cQyXj4XujuoJrU3cLOvp7eTQ/8YH98+vh7gJyev2+TV8fh1tHHsaLC3fP8owPdfbPHz5H5Io4RWskmjhhCTsB0lYakn4O5KwqyXhP0hKc3ffElmXFflyKTytIvFKrURWiTdXxH9oNZ5Wk++Lwt4R9a4q04u6qMtTolIq871mZ9BAuVypEARxQaUZ9HBa4Hs2mkIb/xV4qftkEJhTyT8+0HPd7Hzbs3Sz82rN4o7OP/EfJaW5uysVmcFaqzUcI8na7XrtaYFXWOt5gTm83YvAjP41j439t+3vdd00NnZaUmo3lVpSlr54TpH4LayVqJJYiSRvMbpcFJXeQlOLumybJ0SlVGZmq3y/2ZnN8rKo9MNnalEXDfMKZd7kweUMRrM/lxxGfhNryWiZ6ePRX2FOd/AY6ePR6y3zDh3qhuZ0Q5+Zy/lcOQDdYNS4ofu9YX/JNcJ++/cMfQg2208HH0rZHf5pRWFVIiuDOG9aZwTm62IZBKYzs5MCT3W3E0rObo2ZwcQNaEKOjOTSQJCJvKRU5i8DEznS/l8MJnKgk5xKvuzVM95CDgvJhimuNoPLY+K9lJw9d80c012UlNp2U0u6+MRPSMroXxGYyKLIMgITtwMTJ5SJwMQNlZkvTs1lTr8n/btJ8pPRMm/QzW+YS2ePRzODiXso8xeAiSu6+R3BxD27efq4876uPm+seW+f+YeBCQJVRVyw8xOSTnWpE4q85OwzpPnZY4dPXRVxxirvDh9yZJ2fsyoihZKzJDx/b1VEBkUiwHAuLz7jQ9OncheKN7IndCkFXuGYrqQO2cpLUFXEDbMSVBWRO5BGVRGoKgJVRaCqCFQV8dfChxxVEQg+3Kjy4dylcnv5EzKuyV9y+3Xskg/6ndUNfw1gyFHdcNoP/qcC6ErOcElgPqefQmA2139S4L2qG9CUjF9Q+fDzY70WTKQUmC1CzSAwR+dFVRGoKuLzgYkcVREITNywKgKBiY9VFfGHgokcVREITCAw8Y7OMQQmEJg4KwOBCQQmEJi4JiPNF6KlEJgtTMkgMMdTuzuYQBUTCEwgMIHABAITCEzcUZkITNxRmQhM/BVgAkNg4oJxnpB0r0UssRt4+RMyPiaYOGN5CEzcCkykUPJFR5+67Vls4rNNycigyNxZZ/Yw7A+rijjjQ/PY2N+7HgSakpEzVERTMu4MGNCUjJzWgqZk3BkwoCkZOZ0PmpKBAMN9F6p8E/VcuULlu5Iyd6rUkvLgk7stRvnT/wKv808nRV1y9qe7VCpR6XrnD6I+WlVEjtT+F8OHHHgELUaZlUj8eiVnz08zx20XJeXxr2gxyk8FH1B1Q84wElU3fLzqhhua0+9J8W6S4KDFKK+JRz9sdcMV3fyO8OGe3Tx93HlfV5831ry3z/zD4AOGqhsu2PkJSai6IZPaUHUDqm5A1Q1n8sy/CSKc8ZPp0zU0fQJVN6Dqhs8IGFB1Q05rQdUNqLoBVTeg6obPBhhusa7Dz/+zvpIzXBKYz/nn+BrO8xZ7z6/hTBED/6XfhHGLyoc3F7mSSFyUlCfVu5JBnJB0rzUfUjf6T4YPN1k848qpFZlz5uyxxZVTK67MmX/nug65n9ovAxM5ntrvm1ab3obvGxnntdsPXflwRcZyRzBxdcaC1nXIaS1oXYc7gwm0rsMNwQRa1yH3AITAxLlM4O+tfLgJfMg87eK88eaadnGFqHQd/RdNu3jz3BB8QPAhw90h+IDgA4IPCD4g+IDgA4IPCD4g+IDgA4IPaNrFx4UPJxR5gyjyL618OGOVCD5kyZlTKDJHznztt11cua5DboHpXf+95rbkzkhv0GvRgpPvtv29jpym+322NR/QlIycYSSakpHTMNGUDDQl43PDBzQlI6fzQVMyEHxA8AHBBwQfEHxA8OGjwoc3l0LrQaD1IG5UUYPgA4IPCD4g+IDgA4IPCD4g+PDB4AOadnHJOE9Iute0C+wGXv6EjGvyl/stOHmTb7T4aRrHtQtOphSYzbmfEZjPxZ8U+OtmCyD4cPNvtECVDxdy5ptMyfip71wLJlIKvMKhXQsm3hWIvgnjzmACfRNGziwCTcm4M5hAUzLuq0wEJu6oTAQmEJhIqXMMgQkEJs7KQGACgQkEJq7JSPOFaCkEXmHJ14KJTDnz71wrIgdb+ZwVEwhM5AwxEZhAYAKBCQQmEJhAYAKBCTRd4wOBiROKRGDinA86Y3l5bhZNyUDw4Y7wIYOSc2ed2cOwP6wq4owPzeOu0XoQCDDcIFhGUzJyZgNoSsadAQOaknFfZSLAcEdlIsCAAENKnb+JehBgQIABAQYEGBBgyJJnXtNB0ZoPqIIBAQYEGBBgQIABAYbbKhMBhjsqEwGGfIDh2+OrsruGawWBddSw65lGkAg5SRzOwoauF1kba/zw+DB3lgmz8IP4PBOvxkeMwDX8hCkkAhLm4DpLy9g8tSW+Pd8SnNXCWPkvRwJrF2w3VnzB0UvEl+gnTfNeG9ROdOR/b4+xdJJbHudpz9NnHW+ZQJKxNTG2bsBujIUVOAur5yRCknqbSXJIsdZba2k+KdR50/rnbfzNdunNdvnNNvFmu/Jmu/pmu/Zmm3yzXX97rf9c+NjLTugWT6vbdx495bnbxfLOBlDKbABPzfpIZvA7H/3jG2M8bQblK83gXk+eSLyVabluY+PE0r9+/Yo/lo6/5W+PX4lH7PhbObNdfawdf8lv8c7X+vM79XgHe97GzmzjLzs49iE+j7/cPl5K3i2/vEtc2qs8qwGvfosFvdV0Mr4+OBoU5QhrNWwPxD8dRZ0yqh1vwWQXSBAI8QsdlK2mcjwy6CgyxoONT5hVKTkgLyUVj8+mdrMoJHVJTQ52VWanyrIu85LfZPrDxdAxJ2IiV5jO3YBPzmHHbFNUi8kPCQo1XVSj5LAbKax7iDfadHw+FRFQatemUnItOMVkbYqppfpizI2n5kIFaoNdjZbStjfXVJ5Wt4JCYExQWNiJrPbQ7TPuQlHnawDs4zUB9CCUnu5OOd6n/7p/vG/KhiB6vvtkn2Zg/Hq8036y31hw8Fk7xlFk8kO3GoAB1URXgqcDifZiGSfbBpJzmoADTyIjYSZEwAA0iD//onVoJDvJPqWC1x8++Qj19DmoiD07ad93OT0QPZ3nsb21bwBhFCR7GuMykibxfawvKlGZlqBED5Su50mUpS0GNsPMGkWac+euCg7MRNGKK57cbPqFdUFW62thyYB9Ydq3V7vIm4Fds9FcKsKMb+5Nxw0okZuKXWhV9iHJlP1qp0oAuTtihyVTXC+Gx+YwLtubK1tpQVGxIzhvbnR8f/rx+MHqiBnMrWky06EZJUcT0/IVMG6PJ+FRI8aY0fQx2wmHS7msD5ouYOHU6Few9rzCahQsCXsCb8+YnVzsUJ3kI9VmU2ZY1ejUOosNHnAsI0zZethdiNPeVPFAQVirFgTOOJA8qKtbQHLGbh/V7T4DfbHoWZoNolYbFpkR7buzFaeau+JK2PJWWC4Tk5JcL5b6VQ62qajJR/2oqTGKREjrHgDlGkfhjfGctzbytiE1I94zm32w1+wxgIO+6Tv8QlTpuTD0G5NqfTuyVEtv8DiUFnZtDlfEsF48rMhGt1GpGVuuwod7sxaBtkK2pLZC2YFMrQRAT3yzrQ5L0rQaNIghWAJnGrk63exDLO6Ww/2ed/SKJEq7RTQsbkqVoCJXbH2mspRBbyNmGUb9UA7YYutQnIt+G8zpzpwCrteeSx5NQmzT4/AGu+atmbrtg9aBVyV+oZdVoLE011ICZ253GG7TWZHdyRoPh7hlF6qt2BDG0li07GKp1h+vicGoYsbHKCyk5hRme231eh35cFUjG/gWmN1ppEQ+pQhRr0wAMCtHLT8CncIuCuTlkOLW2Gg6p0yqxVGaLbg6JwENX7Z5pzlzQYVujOCyEI4WZZdbQKcjqU1PrIG+VYREZTSxC5M2LzGxalw6jExQFevQE3gwEcyWWinIU2PKERXeBVSwd/kXxcu7vbfWK4CSd6XIKLZL1WCo1Wx+qbGUArZ2ZxlK43DXK+vuIIzYEpwq8qzajZ30JCIpVhrZIm7oBS/yZRoz3H0E+83GDDKHRtWmPI+v9DRfmkPCJodB167V+8FmHNG91n7BA07lerNVdzCbkFWjXuaVCbnDbV2d676tMgHUnZvIH9n93iCQJn6lbPOqq5txp+lAIxau22Jd1y3v4E9p3GD3e9iA7GzKRw3Dpz2er/bcuTzfRTa5mnZi4YOgNhpUe2Vv5QCIQ4yIt/X6eqJG20GpGDsfdmUwvBYAqeFP1QUDwoXIrs0iLwXKzDTnig3ViuLD+SZ23NTWI4aqJpgezesHvVN0a+OS79UjQV5T0yYo61x8JbFMTGv+vezGKtWmpNMmxToz1htss9H16oCBRTriNbgFNW01q86oHdOV14M2YPW5ITA9YbQGLceeuZ3+jpI4h94tsAId4kYpKIOOsGnpx05VoMhi5VDo7coqS7cOZfnoXGFTVivMZt60bfv/thhWHj/9veio40HHTuIC6CzlyT6DoxZe44K3MUGLLFKj43WY15gggqC1XmLJQWoA+f4guZ4vPsUFLAi37LElDU5m+5zcG5WG2LjE7ofxAKf34xSYqoiyJtkdhdi1Z5JSrhp0cn6w0HSlP2wqsR+njg1XQcNm2KfxFraOMqPX/WPM0wLMy/h8/IggMdTrSJ2MMLr5PF7D9etw/SYO2E/jmEK0Yxkn2waSc+bAfBkD98IhjlKSOOGox+N1WS/ZSfab0veQwE4+wj99juUr4rF9r3J2Av10GmVr4nrngd02USdkFFWGGrDHegVWg4HXtOtKsY5BpzzyXbrTDsszfDpnCY4PDeiwWOz4C3og1fhSiHWbbb2ltA4FusBTdXUTlm1sPgnJRsMGWBw69ZT91Cg1guI+usrAPkgkUAueIgFGdEs9dlvuxQExS0/akseUSYUd7WiiSVWUrTDH1dButZetLgs8psjT8Ut3StP9ueMxwAr7REVcDSZLj+TmBb12KBa6AycgF1hxW6vjslTy+M7Umtn0FgJWw2uaPpVix1/3DmW7bXJqBIORLpC0sgDabgIX3tqYebIHedhv7fbUaCpqDVOOBHIaQWvRdbw2IRJrZkLtud2QKBOtiRkJa6ptDHgC1CSV1sYK3vekLuF0DSGIYBniHbBRMLrL4yvQsQb2cN1azAlmzUiAXQcmWBM9XJszJCfwJN9fzUiP2raDFuxGVk+EIbnsbCUwgPUlz5iUya/b6+1OWWEAFuVlyPQJsWJTawcf6tRSkMp2YdaMHx/XcyRKowTouGoIxgZfdSJYoO1GQehqcl+CZY1YAL1Yn9mDbs2VGA12wnZ8gTHfotfbqbGJx01S5sJGn6Bq9n5h4ysdLn0ds8WwLTE421PM+AI8cPA4UBtbzfgCVIGeMwWhrcolFZZZzAVerX6Q2sv6KoKs1BvtdxxYxtFSdeP113UAJ4xc27lbsCWEldcx+mBYa3R4erPHYEdWsSVwJQfwgda2uYFjeT4I7QrsziicGbtgvBs3pZbo1jGqUoyjIVllSqQvR804ohHXVXYdxmrbMRY5HNntLd0y6L5rN6zdTAFVMgA9Ves0o6bK21RbUwiIE8t1G8SPV+oR8YjDDSXOHCgqNZuTRXsi8BOf6KwpWh948YO2JaiNLbzPqyJBxQ+6TlDxgxbAqF+iuwBb2aw5iJIH7VUZAyhAc3zTXhA9V14yZmwKJhisZsQ6Vti2NeWi8cRuTpoHeIhDzfvoqW3BaYfoLWsibdh2ia2KQCQYoA0Ggeaw9BbMSrOuBYJo3AMNPLAPUaelwwFLNgxntRansSu3WX3D8c0tU1GHcfsOew6wVb3QskO75niyDwshG8zE5c6VpBFV5wDDC8YNbSkczbCoPWpMDrRv38leQz2kS9FkGA1VphGFctx/bY9aV/G1L9mTiLGw4SjitvTaAH3Xb1hw0wMtIgSH2JiGGK/yc9BmjQpko+V6I/CEaEoECHpcRWVNztTgJOLUoBkOh86ALRzHYKComii3KpTO86mDhJzwQPkJHizdiqWtjH4SMHh2YEHmv74+Ip6CA5UqEOrxPf28rweJn992YHuy8pI2UqWhNm0O526zZYMjnYBSnJYn7UnayRzvb/S6zx5Picfkl0H6uL8DEv86XMcSVtPoedBueK9j9vdg4A00ONW2ZBAElASjJ5ECzR+EOFR5hRPPSOIFRrjfwwLqGDTYT59TZ3PiGCS8ymEi4em8FlSrm4ZNN2rHNrLHsY5ifXwWMB2bAbxUCDp6i6cbnASb0t6Oe49ZqJLOssuF7kgHNlzogFYqMqgNMabd6UobqgEWGwyz6ybWbPfWW6EhQpUbUtVoXgoKrtY9jCpT1QyMsORPQ2ynrjFgzXulbnFRIKcwGvT9DhFb8Ts29+3f/wdjc2WzaSEBAA==",cR={documentFormat:sR,payloadEncoding:oR,meta:aR,payload:lR},uR=Object.assign({"../../data/scenes/export.json":cR});function fR(t){return(t.split(/[/\\]/).pop()??t).replace(/\.json$/i,"")}const Lf=new Map;for(const[t,e]of Object.entries(uR))Lf.set(fR(t),e);function Lo(){return[...Lf.keys()].sort((t,e)=>t.localeCompare(e))}function hR(t){const e=Lf.get(t);if(e===void 0)throw new Error(`未找到 dev 场景 "${t}"（请将打包 JSON 放入 data/scenes/${t}.json）。已知：${Lo().join(", ")||"（无）"}`);return e}function Fs(t,e){const n=t.replace(/\/+$/,""),i=e.startsWith("/")?e:`/${e}`;return`${n}${i}`}function Os(t){const e={Accept:"application/json"};return t&&(e.Authorization=`Bearer ${t}`),e}async function Bs(t){const e=await t.text();if(!t.ok){let n=e||t.statusText;try{const i=JSON.parse(e);i!=null&&i.error&&(n=i.error)}catch{}throw new Error(n||`HTTP ${t.status}`)}return e?JSON.parse(e):{}}async function dR(t,e){const n=Fs(t,"/api/v1/ping"),i=await fetch(n,{headers:Os(e)});return Bs(i)}async function pR(t,e){const n=Fs(t,"/api/v1/exports"),i=await fetch(n,{headers:Os(e)}),r=await Bs(i);return Array.isArray(r.files)?r.files:[]}async function mR(t,e,n){const i=encodeURIComponent(n),r=Fs(t,`/api/v1/exports/${i}`),s=await fetch(r,{headers:Os(e)});return Bs(s)}async function _R(t,e){const n=Fs(t,"/api/v1/workspace/document"),i=await fetch(n,{headers:Os(e)});return Bs(i)}async function gR(t,e,n){const i=Fs(t,"/api/v1/workspace/document"),r=await fetch(i,{method:"PUT",headers:{...Os(e),"Content-Type":"application/json"},body:JSON.stringify(n)});await Bs(r)}async function vR(t,e,n){const i=Fs(t,"/api/v1/workspace/document"),r=await fetch(i,{method:"PATCH",headers:{...Os(e),"Content-Type":"application/json"},body:JSON.stringify({patch:n})});return Bs(r)}function qs(t){return bl(t)}const Yn={features:{blockStatsSidebar:!1,layerBar:!1,developerPanel:!1},blockIconCacheOptions:{sizePx:128,orthoHalf:.85,clearColor:0,clearAlpha:0},initialLayerWorldY:-1,initialProjectionMode:"orthographic",sceneBackground:5921370,loadingMessage:"正在加载数据与构建网格…",okMessage:t=>`渲染正常 · 模型 ${t} · 左键旋转 · 中键平移目标 · 滚轮/右键拖拽缩放 · 右上：世界轴（红+X 东 绿+Y 上 蓝+Z 南，对照 MC）`},fg="multiblock";function Sp(t){return t==="simple"||t==="multiblock"?t:fg}function xR(t){return!t||typeof t!="object"?fg:(Ni(t),Sp(t.mode))}function yR(t){return t==="simple"?{blockStatsSidebar:!1,layerBar:!1}:{blockStatsSidebar:!0,layerBar:!0}}function bR(t){if(t&&typeof t=="object"&&"id"in t){const e=t.id;if(typeof e=="string"&&e.length>0)return e}return"scene"}async function SR(t){const e=t.ui??{},{document:n}=t.data,{renderBundle:i,materialLibrary:r}=await rR(n),s=xR(i.document),o=yR(s),a={...Yn.features,...o,...t.features};return{sceneId:bR(i.document),renderBundle:i,materialLibrary:r,features:a,blockIconCacheOptions:{...Yn.blockIconCacheOptions,...e.blockIconCacheOptions},initialLayerWorldY:e.initialLayerWorldY??Yn.initialLayerWorldY,initialProjectionMode:e.initialProjectionMode??Yn.initialProjectionMode,sceneBackground:e.sceneBackground??Yn.sceneBackground,loadingMessage:e.loadingMessage??Yn.loadingMessage,okMessage:e.okMessage??Yn.okMessage}}function MR(t){if(t&&typeof t=="object"&&"id"in t){const e=t.id;if(typeof e=="string"&&e.length>0)return e}return"scene"}function ER(t){if(!t||typeof t!="object")return!1;const e=t.textureBlobs;return!Array.isArray(e)||e.length===0?!1:Ni(t)?t.frames.some(n=>{const i=Ns(n);return Hn(i)}):Hn(t)}async function wR(t,e={}){const n={...Yn.features,blockStatsSidebar:!0,layerBar:!0,developerPanel:!0,...e.features},i=await SR({data:{document:t},features:n,ui:{loadingMessage:Yn.loadingMessage,okMessage:Yn.okMessage}}),r=MR(t);return r!==i.sceneId?{...i,sceneId:r}:i}const hg=Symbol("workbenchContext");function Zs(t){return t===null||typeof t!="object"?null:JSON.parse(JSON.stringify(t))}function TR(){if(typeof window>"u")return{apiBase:"",token:""};const t=new URLSearchParams(window.location.search),e=(t.get("apiBase")??t.get("api")??"").trim().replace(/\/+$/,""),n=(t.get("token")??"").trim();return{apiBase:e,token:n}}function AR(){const t=TR(),e=Ne("preview"),n=Ne(!1),i=Ne(t.apiBase?"sde":"local-file"),r=Ne(null),s=Ne(t.apiBase),o=Ne(t.token),a=Ne(null),l=Ne(""),c=Ne([]),u=Ne(!1),f=Ne(null),h=Ne(null),d=Ne(!1),_=Qr(null),g=Ne(!1),m=Ne(null);function p(){h.value=null,d.value=!1,_.value=null,m.value=null,f.value=null,r.value=null}function T(N){e.value=N}function R(N){n.value=N}function y(N){i.value!==N&&(i.value=N,l.value="",a.value=null,c.value=[],u.value=!1,p())}async function P(){const N=h.value;if(m.value=null,_.value=null,!N){m.value="无文档";return}let ae;try{ae=await sg(N)}catch(pe){m.value=qs(pe);return}if(!ER(ae)){m.value="当前文档缺少 textureBlobs 或非 geometryPhase=baked，无法内嵌预览（可继续编辑元数据并导出）。";return}g.value=!0;try{_.value=await wR(JSON.parse(JSON.stringify(N)))}catch(pe){m.value=qs(pe)}finally{g.value=!1}}function L(N){s.value=N.trim().replace(/\/+$/,"")}function M(N){o.value=N.trim()}async function A(){if(a.value=null,l.value="",!s.value){l.value="请填写 API 基址（例如 http://127.0.0.1:37564）",a.value=!1;return}try{await dR(s.value,o.value),a.value=!0,l.value="已连接"}catch(N){a.value=!1,l.value=qs(N)}}async function v(){if(s.value){u.value=!0;try{c.value=await pR(s.value,o.value)}catch(N){c.value=[],l.value=qs(N)}finally{u.value=!1}}}async function x(N){if(!s.value)return;i.value="sde",r.value=null,f.value=N;const ae=await mR(s.value,o.value,N);h.value=Zs(ae),d.value=!1,await P()}async function C(){if(!s.value)return;const N=await _R(s.value,o.value),ae=Zs(N);ae&&Object.keys(ae).length>0&&(h.value=ae,d.value=!1,await P())}async function G(){!s.value||!h.value||(await gR(s.value,o.value,h.value),d.value=!1)}async function V(N){if(!s.value)return;const ae=await vR(s.value,o.value,N);h.value=Zs(ae),d.value=!1,await P()}function Z(N){h.value&&(h.value=Yb(h.value,N),d.value=!0,P())}async function ee(N){const ae=N&&N.length>0?N:rs,pe=hR(ae);i.value="local-bundle",r.value=null,f.value=null,h.value=Zs(pe),r.value=`示例 · ${ae}.json`,d.value=!1,await P()}async function J(N){const ae=await N.text();let pe;try{pe=JSON.parse(ae)}catch(Fe){throw new Error(`JSON 解析失败：${qs(Fe)}`)}const Te=Zs(pe);if(!Te)throw new Error("JSON 根须为对象");i.value="local-file",f.value=null,h.value=Te,r.value=N.name,d.value=!1,await P()}const Q={mainSection:e,settingsOpen:n,workspaceMode:i,localFileName:r,apiBase:s,token:o,connectionOk:a,connectionMessage:l,exportFiles:c,exportsLoading:u,selectedExportName:f,document:h,dirty:d,previewConfig:_,previewBusy:g,previewError:m,setMainSection:T,setSettingsOpen:R,setWorkspaceMode:y,setApiBase:L,setToken:M,testConnection:A,refreshExportList:v,loadExportByName:x,loadWorkspaceFromServer:C,saveWorkspaceFull:G,saveWorkspaceMetadataPatch:V,applyMetadataPatch:Z,refreshPreview:P,loadLocalScene:ee,loadDocumentFromFile:J};return rf(hg,Q),Q}function ai(){const t=Er(hg);if(!t)throw new Error("useWorkbenchContext() 须在 WorkbenchRoot 子树内调用");return t}const RR={class:"wm-panel"},CR={key:0,class:"wm-muted"},PR={key:1,class:"wm-row"},DR=Ut({__name:"ExportActionsPanel",setup(t){const e=ai(),n=Ve(()=>e.document.value),i=Ve(()=>e.apiBase.value.length>0),r=Ve(()=>e.workspaceMode.value==="sde"&&i.value),s=Ve(()=>{var f;const u=(f=n.value)==null?void 0:f.id;return typeof u=="string"&&u.length>0?u:"scene"});function o(){n.value&&ud(`${String(s.value)}-raw`,n.value,!0)}function a(){if(!n.value)return;const u=$b(n.value);ud(`${String(s.value)}-compact`,u,!0)}async function l(){n.value&&(await jb(JSON.stringify(n.value,null,2)),e.connectionMessage.value="已复制 Raw JSON")}async function c(){if(!(!e.apiBase.value||!n.value))try{await e.saveWorkspaceFull(),e.connectionMessage.value="工作区已保存 (PUT)"}catch(u){e.connectionMessage.value=u instanceof Error?u.message:String(u)}}return(u,f)=>(Me(),Re("section",RR,[f[0]||(f[0]=z("h2",{class:"wm-panel__title"},"导出",-1)),n.value?(Me(),Re("div",PR,[z("button",{type:"button",class:"wm-btn",onClick:o},"下载 Raw JSON"),z("button",{type:"button",class:"wm-btn",onClick:a},"下载 Compact"),z("button",{type:"button",class:"wm-btn",onClick:l},"复制 Raw"),r.value?(Me(),Re("button",{key:0,type:"button",class:"wm-btn wm-btn--primary",onClick:c},"保存工作区到 SDE")):wt("",!0)])):(Me(),Re("p",CR,"无文档"))]))}}),kt=(t,e)=>{const n=t.__vccOpts||t;for(const[i,r]of e)n[i]=r;return n},LR=kt(DR,[["__scopeId","data-v-c569ae80"]]),IR={class:"wm-panel"},UR={key:0,class:"wm-muted"},NR={class:"wm-grid"},FR={class:"wm-field"},OR={class:"wm-field"},BR={class:"wm-field"},kR={class:"wm-field"},zR={class:"wm-field"},HR={class:"wm-field"},VR={class:"wm-row"},GR={key:0,class:"wm-dirty"},WR=Ut({__name:"MetadataEditor",setup(t){const e=ai(),n=Ve(()=>e.document.value!=null),i=Ve(()=>e.apiBase.value.length>0),r=Ve(()=>e.dirty.value),s=Ve(()=>e.workspaceMode.value==="sde"&&i.value),o=Ne(""),a=Ne(""),l=Ne(""),c=Ne(""),u=Ne(""),f=Ne("");An(()=>e.document.value,_=>{if(!_){o.value="",a.value="",l.value="",c.value="",u.value="",f.value="";return}o.value=_.id!=null?String(_.id):"",a.value=_.label!=null?String(_.label):"",l.value=_.author!=null?String(_.author):"",c.value=_.mode!=null?String(_.mode):"",u.value=_.gtnhVersion!=null?String(_.gtnhVersion):"",f.value=_.structureId!=null?String(_.structureId):""},{immediate:!0,deep:!0});function h(){const _={};o.value!==""&&(_.id=o.value),a.value!==""&&(_.label=a.value),l.value!==""&&(_.author=l.value),c.value!==""&&(_.mode=c.value),u.value!==""&&(_.gtnhVersion=u.value),f.value!==""&&(_.structureId=f.value),e.applyMetadataPatch(_)}async function d(){if(e.apiBase.value)try{const _={};o.value!==""&&(_.id=o.value),a.value!==""&&(_.label=a.value),l.value!==""&&(_.author=l.value),c.value!==""&&(_.mode=c.value),u.value!==""&&(_.gtnhVersion=u.value),f.value!==""&&(_.structureId=f.value),await e.saveWorkspaceMetadataPatch(_),e.connectionMessage.value="已 PATCH 元数据"}catch(_){e.connectionMessage.value=_ instanceof Error?_.message:String(_)}}return(_,g)=>(Me(),Re("section",IR,[g[12]||(g[12]=z("h2",{class:"wm-panel__title"},"元数据",-1)),n.value?(Me(),Re(Ot,{key:1},[z("div",NR,[z("label",FR,[g[6]||(g[6]=z("span",{class:"wm-field__label"},"id",-1)),yt(z("input",{"onUpdate:modelValue":g[0]||(g[0]=m=>o.value=m),class:"wm-input",type:"text"},null,512),[[tn,o.value]])]),z("label",OR,[g[7]||(g[7]=z("span",{class:"wm-field__label"},"label",-1)),yt(z("input",{"onUpdate:modelValue":g[1]||(g[1]=m=>a.value=m),class:"wm-input",type:"text"},null,512),[[tn,a.value]])]),z("label",BR,[g[8]||(g[8]=z("span",{class:"wm-field__label"},"author",-1)),yt(z("input",{"onUpdate:modelValue":g[2]||(g[2]=m=>l.value=m),class:"wm-input",type:"text"},null,512),[[tn,l.value]])]),z("label",kR,[g[9]||(g[9]=z("span",{class:"wm-field__label"},"mode",-1)),yt(z("input",{"onUpdate:modelValue":g[3]||(g[3]=m=>c.value=m),class:"wm-input",type:"text",placeholder:"multiblock | simple"},null,512),[[tn,c.value]])]),z("label",zR,[g[10]||(g[10]=z("span",{class:"wm-field__label"},"gtnhVersion",-1)),yt(z("input",{"onUpdate:modelValue":g[4]||(g[4]=m=>u.value=m),class:"wm-input",type:"text"},null,512),[[tn,u.value]])]),z("label",HR,[g[11]||(g[11]=z("span",{class:"wm-field__label"},"structureId",-1)),yt(z("input",{"onUpdate:modelValue":g[5]||(g[5]=m=>f.value=m),class:"wm-input",type:"text"},null,512),[[tn,f.value]])])]),z("div",VR,[z("button",{type:"button",class:"wm-btn wm-btn--primary",onClick:h},"应用到预览"),s.value?(Me(),Re("button",{key:0,type:"button",class:"wm-btn",onClick:d},"PATCH 到 SDE")):wt("",!0)]),r.value?(Me(),Re("p",GR,"有未保存的本地修改")):wt("",!0)],64)):(Me(),Re("p",UR,"无文档"))]))}}),XR=kt(WR,[["__scopeId","data-v-c559c7ef"]]),YR={class:"wm-slot",role:"listitem"},$R={key:0,class:"wm-slot-skeleton"},jR=["title"],qR={key:2,class:"wm-slot-count","aria-label":"数量"},ZR=Ut({__name:"BlockSlotPreview",props:{blockId:{},count:{},cache:{}},setup(t){const e=t,n=Ne(0);An(()=>[e.blockId,e.cache],([s,o],a,l)=>{const c=o.subscribe(s,()=>{n.value++});l(()=>c())},{immediate:!0});const i=Ve(()=>(n.value,e.cache.get(e.blockId))),r=Ne(null);return An([i,r],()=>{const s=r.value,o=i.value.canvas;s&&(s.replaceChildren(),i.value.status==="ready"&&o&&(o.classList.add("wm-slot-canvas"),s.appendChild(o)))},{flush:"post"}),(s,o)=>{var a;return Me(),Re("div",YR,[z("div",{ref_key:"iconHost",ref:r,class:"wm-slot-icon","aria-hidden":"true"},null,512),i.value.status==="pending"||i.value.status==="idle"?(Me(),Re("div",$R)):wt("",!0),i.value.status==="error"?(Me(),Re("div",{key:1,class:"wm-slot-fallback",title:((a=i.value.error)==null?void 0:a.message)??"预览失败"},null,8,jR)):wt("",!0),t.count>1?(Me(),Re("span",qR,Pt(t.count),1)):wt("",!0)])}}}),KR=kt(ZR,[["__scopeId","data-v-e9b7effe"]]),JR={class:"wm-block-stats-panel"},QR={key:0,class:"wm-block-stats-empty"},eC={key:1,class:"wm-block-stats-list",role:"list"},tC=["onPointerenter","onPointermove"],nC=36,iC=Ut({__name:"BlockStatsSidebar",props:{entries:{},cache:{}},emits:["tooltip-hover"],setup(t,{emit:e}){const n=t,i=Ve(()=>n.entries.length===0),r=e;function s(l,c){r("tooltip-hover",{blockId:c,clientX:l.clientX,clientY:l.clientY,source:"sidebar"})}function o(l,c){r("tooltip-hover",{blockId:c,clientX:l.clientX,clientY:l.clientY,source:"sidebar"})}function a(){r("tooltip-hover",null)}return(l,c)=>(Me(),Re("aside",{class:"wm-block-stats",style:No({"--wm-slot-px":`${nC}px`}),"aria-label":"方块统计"},[z("div",JR,[i.value?(Me(),Re("p",QR," 无方块数据 ")):(Me(),Re("ul",eC,[(Me(!0),Re(Ot,null,ps(t.entries,u=>(Me(),Re("li",{key:u.blockId,class:"wm-block-stats-row",onPointerenter:f=>s(f,u.blockId),onPointermove:f=>o(f,u.blockId),onPointerleave:a},[Tt(KR,{"block-id":u.blockId,count:u.count,cache:t.cache},null,8,["block-id","count","cache"])],40,tC))),128))]))])],4))}}),rC=kt(iC,[["__scopeId","data-v-9113a7df"]]),sC="wiki-multi-structure-render",oC="module",aC={dev:"vite",build:"vue-tsc --noEmit && npm run build:all","build:lib":"vite build","build:workbench":"vite build --config vite.workbench.config.ts","build:all":"npm run build:lib && npm run build:workbench",preview:"vite preview"},lC={"@types/pako":"^2.0.4",pako:"^2.1.0",three:"^0.174.0",vue:"^3.5.13"},cC={"@types/node":"^25.5.0","@types/three":"^0.183.1","@vitejs/plugin-vue":"^5.2.1",typescript:"~5.7.2",vite:"^6.0.7","vue-tsc":"^2.2.0"},Ac={name:sC,private:!0,type:oC,scripts:aC,dependencies:lC,devDependencies:cC},uC={class:"wm-dev-panel","aria-label":"开发者配置"},fC={class:"wm-dev-panel-inner"},hC={class:"wm-dev-devinfo",role:"region","aria-label":"开发者信息"},dC={class:"wm-dev-field wm-dev-field--full"},pC={class:"wm-dev-link-row"},mC=["value"],_C={class:"wm-dev-panel-grid"},gC={class:"wm-dev-field wm-dev-field--full"},vC={value:""},xC=["value"],yC={class:"wm-dev-field wm-dev-field--row"},bC={class:"wm-dev-field wm-dev-field--row"},SC={class:"wm-dev-field wm-dev-field--row"},MC={class:"wm-dev-field"},EC={class:"wm-dev-field"},wC={class:"wm-dev-field"},TC={class:"wm-dev-field"},AC={class:"wm-dev-field"},RC={class:"wm-dev-field"},CC={class:"wm-dev-field"},PC=Ut({__name:"DeveloperConfigPanel",props:{mergedConfig:{}},setup(t){const e=t,n=Ne([]),i=Ne(!1),r=Ne(!0),s=Ne(!1),o=Ne(-1),a=Ne("orthographic"),l=Ne("#5a5a5a"),c=Ne(128),u=Ne(.85),f=Ne("#000000"),h=Ne(0),d=Ne(""),_=Ve(()=>{const M=e.mergedConfig.sceneId??"";return[`场景 id（解析用）: ${M===""?rs:M}`,`URL sceneId: ${M||"（空=默认）"}`,"场景 JSON: 构建期打包自 data/scenes/<id>.json（须含 textureBlobs；StructureData 或 World）","import.meta.env.MODE: production",`应用版本: ${"version"in Ac&&typeof Ac.version=="string"?Ac.version:"—"}`]}),g=Ve(()=>{const M=new URLSearchParams,A=d.value.trim()||e.mergedConfig.sceneId||rs;M.set("sceneId",A),M.set("layer",String(o.value)),M.set("projection",a.value),M.set("stats",i.value?"1":"0"),M.set("layerBar",r.value?"1":"0"),M.set("devPanel",s.value?"1":"0");const v=p(l.value);v!==null&&M.set("bg",`#${(v>>>0).toString(16).padStart(6,"0")}`);const x=p(f.value);return x!==null&&M.set("clearColor",`#${(x>>>0).toString(16).padStart(6,"0")}`),M.set("clearAlpha",String(h.value)),M.set("iconSizePx",String(Math.round(c.value))),M.set("orthoHalf",String(u.value)),`${typeof window<"u"?`${window.location.origin}${window.location.pathname}`:""}?${M.toString()}`});function m(M){return`#${(M>>>0).toString(16).padStart(6,"0")}`}function p(M){const A=M.trim(),v=/^#?([0-9a-fA-F]{6})$/.exec(A);return v?parseInt(v[1],16):null}function T(){const M=e.mergedConfig;i.value=M.features.blockStatsSidebar,r.value=M.features.layerBar,s.value=M.features.developerPanel,o.value=M.initialLayerWorldY,a.value=M.initialProjectionMode,l.value=m(M.sceneBackground),c.value=M.blockIconCacheOptions.sizePx??128,u.value=M.blockIconCacheOptions.orthoHalf??1.22,f.value=m(M.blockIconCacheOptions.clearColor??0),h.value=M.blockIconCacheOptions.clearAlpha??0}Lr(()=>{try{n.value=Lo()}catch(M){console.error("[DeveloperConfigPanel] listDevSceneIds",M),n.value=[]}T()}),An(()=>e.mergedConfig,T,{deep:!0}),An(()=>e.mergedConfig.sceneId,M=>{d.value=M??""},{immediate:!0});function R(){const M=p(l.value),A=p(f.value);if(M===null||A===null){window.alert("场景背景或清屏色：请输入 #RRGGBB 六位十六进制");return}if(!Number.isFinite(u.value)||u.value<=0){window.alert("orthoHalf 须为正数");return}if(!Number.isFinite(c.value)||c.value<8){window.alert("sizePx 过小");return}const v=h.value;if(!Number.isFinite(v)||v<0||v>1){window.alert("clearAlpha 须在 0～1");return}window.location.assign(g.value)}function y(){const M=typeof window<"u"?`${window.location.pathname}${window.location.hash}`:"/";window.location.assign(M)}function P(){navigator.clipboard.writeText(g.value).then(()=>window.alert("已复制入口链接"),()=>window.alert("复制失败"))}function L(){const M=e.mergedConfig.renderBundle,v=(e.mergedConfig.sceneId??rs).replace(/[/\\:]/g,"_"),x=document.createElement("a");x.href=URL.createObjectURL(new Blob([JSON.stringify(M.document,null,2)],{type:"application/json"})),x.download=`${v}.document.json`,x.click(),URL.revokeObjectURL(x.href)}return(M,A)=>(Me(),Re("section",uC,[z("div",fC,[A[25]||(A[25]=z("h2",{class:"wm-dev-panel-title"}," 开发者配置（URL 参数） ",-1)),A[26]||(A[26]=z("p",{class:"wm-dev-panel-hint"},[Un(" 场景来自仓库 "),z("code",null,"data/scenes/<id>.json"),Un("（SDE 打包：根级 "),z("code",null,"textureBlobs"),Un(" + "),z("code",null,"textureBlobIndex"),Un("）。本面板用查询参数表达「应用并跳转」，不写入 localStorage。开发请使用 "),z("code",null,"npm run dev"),Un("。 ")],-1)),z("div",hC,[A[11]||(A[11]=z("div",{class:"wm-dev-devinfo-title"}," 开发者信息 ",-1)),(Me(!0),Re(Ot,null,ps(_.value,(v,x)=>(Me(),Re("div",{key:x,class:"wm-dev-devinfo-line"},Pt(v),1))),128))]),z("div",dC,[A[12]||(A[12]=z("span",null,"当前入口链接（含 URL 白名单参数）",-1)),z("div",pC,[z("input",{class:"wm-dev-link-input",type:"text",readonly:"",value:g.value},null,8,mC),z("button",{type:"button",class:"wm-dev-btn",onClick:P}," 复制 ")])]),z("div",_C,[z("label",gC,[A[13]||(A[13]=z("span",null,"场景 id（data/scenes/<id>.json，须为打包 JSON）",-1)),yt(z("select",{"onUpdate:modelValue":A[0]||(A[0]=v=>d.value=v)},[z("option",vC," 默认（"+Pt(ft(rs))+"） ",1),(Me(!0),Re(Ot,null,ps(n.value,v=>(Me(),Re("option",{key:v,value:v},Pt(v),9,xC))),128))],512),[[Vc,d.value]])]),z("div",{class:"wm-dev-field wm-dev-field--full wm-dev-upload-row"},[z("button",{type:"button",class:"wm-dev-btn",onClick:L}," 下载当前 document.json ")]),z("label",yC,[yt(z("input",{"onUpdate:modelValue":A[1]||(A[1]=v=>i.value=v),type:"checkbox"},null,512),[[Fl,i.value]]),A[14]||(A[14]=z("span",null,"方块统计侧栏",-1))]),z("label",bC,[yt(z("input",{"onUpdate:modelValue":A[2]||(A[2]=v=>r.value=v),type:"checkbox"},null,512),[[Fl,r.value]]),A[15]||(A[15]=z("span",null,"分层条（Y）",-1))]),z("label",SC,[yt(z("input",{"onUpdate:modelValue":A[3]||(A[3]=v=>s.value=v),type:"checkbox"},null,512),[[Fl,s.value]]),A[16]||(A[16]=z("span",null,"开发者面板",-1))]),z("label",MC,[A[17]||(A[17]=z("span",null,"initialLayerWorldY（-1=全部层）",-1)),yt(z("input",{"onUpdate:modelValue":A[4]||(A[4]=v=>o.value=v),type:"number",step:"1"},null,512),[[tn,o.value,void 0,{number:!0}]])]),z("label",EC,[A[19]||(A[19]=z("span",null,"初始投影",-1)),yt(z("select",{"onUpdate:modelValue":A[5]||(A[5]=v=>a.value=v)},[...A[18]||(A[18]=[z("option",{value:"orthographic"}," orthographic ",-1),z("option",{value:"perspective"}," perspective ",-1)])],512),[[Vc,a.value]])]),z("label",wC,[A[20]||(A[20]=z("span",null,"场景背景 #RRGGBB",-1)),yt(z("input",{"onUpdate:modelValue":A[6]||(A[6]=v=>l.value=v),type:"text",spellcheck:"false"},null,512),[[tn,l.value]])]),z("label",TC,[A[21]||(A[21]=z("span",null,"图标 sizePx",-1)),yt(z("input",{"onUpdate:modelValue":A[7]||(A[7]=v=>c.value=v),type:"number",min:"8",step:"8"},null,512),[[tn,c.value,void 0,{number:!0}]])]),z("label",AC,[A[22]||(A[22]=z("span",null,"图标 orthoHalf（越小越大）",-1)),yt(z("input",{"onUpdate:modelValue":A[8]||(A[8]=v=>u.value=v),type:"number",min:"0.1",step:"0.01"},null,512),[[tn,u.value,void 0,{number:!0}]])]),z("label",RC,[A[23]||(A[23]=z("span",null,"图标清屏色 #RRGGBB",-1)),yt(z("input",{"onUpdate:modelValue":A[9]||(A[9]=v=>f.value=v),type:"text",spellcheck:"false"},null,512),[[tn,f.value]])]),z("label",CC,[A[24]||(A[24]=z("span",null,"图标 clearAlpha（0=透明底）",-1)),yt(z("input",{"onUpdate:modelValue":A[10]||(A[10]=v=>h.value=v),type:"number",min:"0",max:"1",step:"0.05"},null,512),[[tn,h.value,void 0,{number:!0}]])])]),z("div",{class:"wm-dev-panel-actions"},[z("button",{type:"button",class:"wm-dev-btn",onClick:R}," 应用为 URL 并跳转 "),z("button",{type:"button",class:"wm-dev-btn wm-dev-btn--danger",onClick:y}," 清除查询参数并刷新 ")])])]))}}),DC=kt(PC,[["__scopeId","data-v-f2ce0c34"]]);function If(t,e){return e===0?t:`${t}@${e}`}function dg(t,e){for(const n of t.blockPalette)if(If(n.registryId,n.meta)===e||n.registryId===e)return n}function LC(t,e=!1){const n=t[0].index!==null,i=new Set(Object.keys(t[0].attributes)),r=new Set(Object.keys(t[0].morphAttributes)),s={},o={},a=t[0].morphTargetsRelative,l=new Vn;let c=0;for(let u=0;u<t.length;++u){const f=t[u];let h=0;if(n!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in f.attributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;s[d]===void 0&&(s[d]=[]),s[d].push(f.attributes[d]),h++}if(h!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in f.morphAttributes){if(!r.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(f.morphAttributes[d])}if(e){let d;if(n)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,u),c+=d}}if(n){let u=0;const f=[];for(let h=0;h<t.length;++h){const d=t[h].index;for(let _=0;_<d.count;++_)f.push(d.getX(_)+u);u+=t[h].attributes.position.count}l.setIndex(f)}for(const u in s){const f=Mp(s[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,f)}for(const u in o){const f=o[u][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let h=0;h<f;++h){const d=[];for(let g=0;g<o[u].length;++g)d.push(o[u][g][h]);const _=Mp(d);if(!_)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(_)}}return l}function Mp(t){let e,n,i,r=-1,s=0;for(let c=0;c<t.length;++c){const u=t[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(n===void 0&&(n=u.itemSize),n!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*n}const o=new e(s),a=new hn(o,n,i);let l=0;for(let c=0;c<t.length;++c){const u=t[c];if(u.isInterleavedBufferAttribute){const f=l/n;for(let h=0,d=u.count;h<d;h++)for(let _=0;_<n;_++){const g=u.getComponent(h,_);a.setComponent(h+f,_,g)}}else o.set(u.array,l);l+=u.count*n}return r!==void 0&&(a.gpuType=r),a}function IC(t,e){const{sizeColumn:n,sizeRow:i,sizeZSlice:r}=t;for(let s=0;s<r;s++)for(let o=0;o<i;o++)for(let a=0;a<n;a++)if(t.get(a,o,s).registryId===e)return{column:a,row:o,zSlice:s};return null}function Sl(t){var o,a,l;const{cellGrid:e,blockPalette:n}=t,i=e.length,r=((o=e[0])==null?void 0:o.length)??0,s=((l=(a=e[0])==null?void 0:a[0])==null?void 0:l.length)??0;return{sizeColumn:s,sizeRow:r,sizeZSlice:i,get(c,u,f){var d,_;if(c<0||u<0||f<0||c>=s||u>=r||f>=i)return Qc;const h=(_=(d=e[f])==null?void 0:d[u])==null?void 0:_[c];return h===void 0||h<0||h>=n.length?Qc:Gb(n[h])}}}function Ml(t,e){return e-1-t}function Yo(t,e,n,i,r,s){return s==="all"?t.get(e,n,i):Ml(n,r)!==s.worldY?Qc:t.get(e,n,i)}function Ep(t,e,n,i,r,s){const o=Yo(t,e,n,i,r,s);return If(o.registryId,o.meta)}new O(1,0,0),new O(-1,0,0),new O(0,1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1);function UC(t){const e=t.x,n=t.y,i=t.z,r=Math.abs(e),s=Math.abs(n),o=Math.abs(i);return r>=s&&r>=o?e>0?"+x":"-x":s>=r&&s>=o?n>0?"+y":"-y":i>0?"+z":"-z"}function NC(t){const e=t.encoding;if(e==="bakedQuadsJsonV1")return t.quads??[];throw e==="packedQuadsV1"?new Error("packedQuadsV1 尚未实现解码"):new Error(`未知 geometry.encoding: ${String(e)}`)}const FC=new Ze(16777215);function OC(t){if(t===void 0||!Number.isFinite(t))return[1,1,1];const e=t>>>0,n=(e&255)/255,i=(e>>>8&255)/255,r=(e>>>16&255)/255;return[n,i,r]}function BC(t){return t.blend??"opaque"}function pg(t){switch(t){case"+x":return{dc:1,dr:0,dz:0};case"-x":return{dc:-1,dr:0,dz:0};case"+y":return{dc:0,dr:-1,dz:0};case"-y":return{dc:0,dr:1,dz:0};case"+z":return{dc:0,dr:0,dz:1};case"-z":return{dc:0,dr:0,dz:-1}}}function kC(t,e,n,i,r,s,o){const a=t.vertices;if(!a||a.length!==4)return null;const l=Ml(n,s),c=e-r/2,u=l-s/2,f=i-o/2,h=new O(c+.5,u+.5,f+.5),d=[new O,new O,new O,new O];for(let T=0;T<4;T++)d[T].set(a[T].x,a[T].y,a[T].z),d[T].x+=c,d[T].y+=u,d[T].z+=f;const _=d[1].clone().sub(d[0]),g=d[2].clone().sub(d[0]),m=_.cross(g);if(m.lengthSq()<1e-12)return null;m.normalize();const p=d[0].clone().add(d[1]).add(d[2]).add(d[3]).multiplyScalar(.25);return m.dot(p.clone().sub(h))<0&&m.negate(),UC(m)}function zC(t,e,n,i,r,s,o,a){var m,p;const{dc:l,dr:c,dz:u}=pg(a),f=i+l,h=r+c,d=s+u,_=Yo(e,f,h,d,o,n);if(ml(_))return!1;const g=(p=(m=t.cellGrid[d])==null?void 0:m[h])==null?void 0:p[f];return g===void 0||g<0||g>=t.blockPalette.length?!1:t.blockPalette[g].occludesAdjacentFaces===!0}function HC(t,e,n,i,r,s,o,a,l){var T,R;if(t.blockPalette[l].occludesAdjacentFaces===!0)return!1;const{dc:u,dr:f,dz:h}=pg(a),d=i+u,_=r+f,g=s+h,m=Yo(e,d,_,g,o,n);if(ml(m))return!1;const p=(R=(T=t.cellGrid[g])==null?void 0:T[_])==null?void 0:R[d];return!(p===void 0||p<0||p!==l||t.blockPalette[p].occludesAdjacentFaces===!0)}function VC(t,e,n,i,r,s,o,a){const l=t.vertices;if(!l||l.length!==4)return null;const c=Ml(n,s),u=e-r/2,f=c-s/2,h=i-o/2,d=new O,_=new Float32Array(18),g=new Float32Array(12),m=new Float32Array(18),p=[[0,1,2],[0,2,3]];let T=0,R=0,y=0;for(const[L,M,A]of p)for(const v of[L,M,A]){const x=l[v];d.set(x.x,x.y,x.z),_[T++]=d.x+u,_[T++]=d.y+f,_[T++]=d.z+h,g[R++]=x.u,g[R++]=x.v;const C=OC(x.color);m[y++]=C[0],m[y++]=C[1],m[y++]=C[2]}const P=new Vn;return P.setAttribute("position",new hn(_,3)),P.setAttribute("uv",new hn(g,2)),P.setAttribute("color",new hn(m,3)),P.computeVertexNormals(),P.userData.globalQuadIndex=a,P}async function mg(t,e,n){const i=(n==null?void 0:n.layerPreview)??"all",r=n==null?void 0:n.materialKeyPrefix,s=Sl(t),{sizeColumn:o,sizeRow:a,sizeZSlice:l}=s,{blockPalette:c,materialPalette:u}=t;let f=0;const h=[];let d=0,_=0;const g=new Map;for(let M=0;M<l;M++)for(let A=0;A<a;A++)for(let v=0;v<o;v++){const x=Yo(s,v,A,M,a,i);if(ml(x))continue;d++;const C=t.cellGrid[M][A][v],G=c[C];if(G.renderMode==="Special"){_++;const Z=`${G.registryId}@${G.meta}`,ee=g.get(Z);g.set(Z,{registryKey:Z,reason:"special_no_geometry",voxelCount:((ee==null?void 0:ee.voxelCount)??0)+1});continue}let V;try{V=NC(G.geometry)}catch{_++;const Z=`${G.registryId}@${G.meta}`,ee=g.get(Z);g.set(Z,{registryKey:Z,reason:"decode_error",voxelCount:((ee==null?void 0:ee.voxelCount)??0)+1});continue}for(let Z=0;Z<V.length;Z++){const ee=V[Z],J=kC(ee,v,A,M,o,a,l);if(J!==null&&(G.occludesAdjacentFaces===!0&&zC(t,s,i,v,A,M,a,J)||HC(t,s,i,v,A,M,a,J,C)))continue;const Q=ee.materialIndex,N=u[Q],ae=VC(ee,v,A,M,o,a,l,f++);ae&&h.push({materialIndex:Q,geom:ae,quadOrder:ae.userData.globalQuadIndex??0,matPalette:N})}}const m=new Map;for(const M of h){const A={materialId:r!==void 0?`${r}${M.materialIndex}`:String(M.materialIndex),blend:BC(M.matPalette),tint:FC,useVertexColor:!0},v=ug(A);let x=m.get(v);x||(x={descriptor:A,units:[]},m.set(v,x)),x.units.push(M)}for(const M of m.values())M.units.sort((A,v)=>A.quadOrder-v.quadOrder);const p=[...m.entries()].sort(([,M],[,A])=>{var C,G;const v=((C=M.units[0])==null?void 0:C.quadOrder)??0,x=((G=A.units[0])==null?void 0:G.quadOrder)??0;return v-x}),T=new br,R=[];let y=0;for(const[,M]of p){const A=M.units.map(V=>V.geom),v=LC(A,!1);if(!v)continue;const x=await e.getMaterialForBatch(M.descriptor),C=new ei(v,x),G=M.units.reduce((V,Z)=>Math.min(V,Z.quadOrder),Number.POSITIVE_INFINITY);C.renderOrder=Number.isFinite(G)?Math.floor(G):y,T.add(C),R.push(C),y++}const P=()=>{for(const M of R)M.geometry.dispose()},L=[...g.values()].sort((M,A)=>M.registryKey.localeCompare(A.registryKey));return{group:T,dispose:P,stats:{nonAirVoxelCount:d,skippedUnmappedCount:_,unknownVoxelCount:0,undefinedBlockDetails:L}}}const wp=520;function GC(t){if(!t.length)return"";const e=[];for(const i of t){const r=i.reason==="decode_error"?"DECODE":"SPECIAL";e.push(`${r} ${i.registryKey}×${i.voxelCount}`)}let n=` · ${e.join("；")}`;return n.length>wp&&(n=`${n.slice(0,wp-1)}…`),n}const WC="11",Tp=Math.PI/180;function XC(){const t=new lt;return t.identity(),t.multiply(new lt().makeScale(-1,1,1)),t.multiply(new lt().makeRotationZ(Math.PI)),t.multiply(new lt().makeScale(1,1,-1)),t.multiply(new lt().makeRotationX(150*Tp)),t.multiply(new lt().makeRotationY(-45*Tp)),t}function YC(){const t=new br,e=new br;return e.matrixAutoUpdate=!1,e.matrix.copy(XC()),e.updateMatrixWorld(!0),t.add(e),{root:t,meshParent:e}}const $C={registryId:"air",meta:0,occludesAdjacentFaces:!1,renderMode:"BakedQuads",geometry:{encoding:"bakedQuadsJsonV1",quads:[]}};async function jC(t,e,n,i){const s={blockPalette:[$C,{...t,geometry:{...t.geometry,quads:[...t.geometry.quads]}}],materialPalette:e,cellGrid:[[[1]]]},o=await mg(s,n,{layerPreview:"all",materialKeyPrefix:i}),{root:a,meshParent:l}=YC();for(;o.group.children.length>0;){const u=o.group.children[0];o.group.remove(u),l.add(u)}return{group:a,dispose:()=>{o.dispose()}}}function qC(t){return t.blockPalette.map((e,n)=>`${n}:${e.registryId}@${e.meta}`).join("|")}const ZC="1",_g={sizePx:64,orthoHalf:1.22,clearColor:0,clearAlpha:0,materialKeyPrefix:void 0};function KC(t){const e={..._g,...t};return`${e.sizePx}:${e.orthoHalf}:${e.clearColor}:${e.clearAlpha}:${e.materialKeyPrefix??""}`}class JC{constructor(e,n,i){gt(this,"library");gt(this,"structure");gt(this,"opts");gt(this,"renderer",null);gt(this,"map",new Map);gt(this,"pendingQueue",[]);gt(this,"drainRunning",!1);gt(this,"revision","");gt(this,"disposed",!1);gt(this,"listenersById",new Map);this.library=e,this.structure=i??null,this.opts={..._g,...n}}setRevisionKey(e){this.revision!==e&&(this.revision=e,this.clearEntries())}get(e){return this.map.get(e)??{status:"idle"}}subscribe(e,n){let i=this.listenersById.get(e);return i||(i=new Set,this.listenersById.set(e,i)),i.add(n),()=>{i.delete(n),i.size===0&&this.listenersById.delete(e)}}notifyBlock(e){const n=this.listenersById.get(e);if(n)for(const i of n)try{i()}catch{}}notifyAllSubscribers(){for(const e of this.listenersById.values())for(const n of e)try{n()}catch{}}ensure(e){if(this.disposed)return;const n=new Set;for(const i of e){if(n.has(i))continue;n.add(i);const r=this.map.get(i);(r==null?void 0:r.status)==="ready"||(r==null?void 0:r.status)==="pending"||(this.map.set(i,{status:"pending"}),this.pendingQueue.push(i))}this.drainQueue()}async drainQueue(){if(!(this.drainRunning||this.disposed)){this.drainRunning=!0;try{for(;this.pendingQueue.length>0&&!this.disposed;){const e=this.pendingQueue.shift(),n=this.map.get(e);!n||n.status!=="pending"||await this.bakeOne(e)}}finally{this.drainRunning=!1}}}ensureRenderer(){if(this.renderer)return this.renderer;const e=new rg({alpha:this.opts.clearAlpha<1,antialias:!1,preserveDrawingBuffer:!0});e.setPixelRatio(1),e.outputColorSpace=Qt;const n=this.opts.sizePx;return e.setSize(n,n,!1),e.setClearColor(this.opts.clearColor,this.opts.clearAlpha),this.renderer=e,e}async bakeOne(e){if(this.disposed)return;const n=this.structure?dg(this.structure,e):void 0;if(!n){this.map.set(e,{status:"error",error:new Error(`方块未注册: ${e}`)}),this.notifyBlock(e);return}let i=null,r=null;try{const s=await jC(n,this.structure.materialPalette,this.library,this.opts.materialKeyPrefix);i=s.group,r=s.dispose;const o=this.ensureRenderer(),a=this.opts.sizePx,l=new j_;l.add(i);const c=new J_(16777215,.72),u=new zu(16777215,.88);u.position.set(0,0,-6);const f=new zu(16777215,.32);f.position.set(5,8,4),l.add(c,u,f);const h=this.opts.orthoHalf,d=new Ts(-h,h,h,-h,.1,80);d.position.set(0,0,-4.2),d.lookAt(0,0,0),d.updateProjectionMatrix(),o.setClearColor(this.opts.clearColor,this.opts.clearAlpha),o.setSize(a,a,!1),this.library.tick(16),o.render(l,d);const _=o.domElement,g=document.createElement("canvas");g.width=a,g.height=a;const m=g.getContext("2d");if(!m)throw new Error("2D context unavailable");m.drawImage(_,0,0),this.map.set(e,{status:"ready",canvas:g}),this.notifyBlock(e)}catch(s){const o=s instanceof Error?s:new Error(String(s));this.map.set(e,{status:"error",error:o}),this.notifyBlock(e)}finally{r==null||r()}}clearEntries(){for(const e of this.map.values())e.canvas&&(e.canvas.width=0,e.canvas.height=0);this.map.clear(),this.pendingQueue.length=0,this.notifyAllSubscribers()}dispose(){var e,n,i;this.disposed||(this.disposed=!0,this.clearEntries(),(e=this.renderer)==null||e.dispose(),(i=(n=this.renderer)==null?void 0:n.forceContextLoss)==null||i.call(n),this.renderer=null,this.listenersById.clear())}}function QC(t,e="all"){const n=Sl(t),{sizeColumn:i,sizeRow:r,sizeZSlice:s}=n,o=new Map;for(let a=0;a<s;a++)for(let l=0;l<r;l++)for(let c=0;c<i;c++){const u=Yo(n,c,l,a,r,e);if(ml(u))continue;const f=If(u.registryId,u.meta);o.set(f,(o.get(f)??0)+1)}return o}function eP(t,e="all"){const n=QC(t,e),i=[];for(const[r,s]of n)s>0&&i.push({blockId:r,count:s});return i.sort((r,s)=>r.blockId.localeCompare(s.blockId)),i}const Uf=Symbol("PreviewSceneContext");function Ap(t){return bl(t)}function tP(t){const e=Ne("loading"),n=Ne("loading"),i=Ne(t.loadingMessage),r=Ne(t.initialLayerWorldY),s=Ne(!1),o=Ne(t.initialProjectionMode),a=Qr(null),l=Qr(null),c=Qr(null),u=Ne(void 0),f=Qr(null),h=Qr(null);let d=null,_=0;const g=Ve(()=>{var v,x;return((x=(v=a.value)==null?void 0:v.cellGrid[0])==null?void 0:x.length)??0}),m=Ve(()=>{const v=r.value;return v<0?"all":{worldY:v}}),p=Ve(()=>{const v=a.value;return v?eP(v,m.value):[]}),T=Ve(()=>o.value==="perspective"?"透视投影":"正交投影"),R=Ve(()=>r.value<0?"ALL":`Y = ${r.value}`);An([p,c],()=>{const v=c.value;v&&v.ensure(p.value.map(x=>x.blockId))},{flush:"post"});function y(v){f.value=v}async function P(){e.value="loading",n.value="loading",i.value=t.loadingMessage;try{const v=OA(t.renderBundle);a.value=v.definition,u.value=v.materialKeyPrefix,l.value=t.materialLibrary;const x=new JC(t.materialLibrary,{...t.blockIconCacheOptions,materialKeyPrefix:v.materialKeyPrefix},v.definition);x.setRevisionKey(`${v.definition.id}:${qC(v.definition)}:${WC}:${ZC}:${KC({...t.blockIconCacheOptions,materialKeyPrefix:v.materialKeyPrefix})}`),c.value=x,e.value="ok",n.value="ok",i.value="正在构建网格…"}catch(v){e.value="error",n.value="error",i.value=Ap(v),console.error("[WikiMultiStructureRender]",v)}}async function L(){const v=a.value,x=l.value,C=f.value;if(!v||!x||!C)return;const G=++_;s.value=!0;try{const V=h.value;V&&(C.remove(V),d==null||d(),h.value=null,d=null);const Z=await mg(v,x,{layerPreview:m.value,materialKeyPrefix:u.value});if(G!==_){Z.dispose();return}h.value=Z.group,d=Z.dispose,C.add(Z.group);const{stats:ee}=Z,J=Z.group.children.length>0,Q=GC(ee.undefinedBlockDetails),N=ee.undefinedBlockDetails.length>0;J?(n.value=N?"warn":"ok",i.value=t.okMessage(v.id)+` · 非空气体素 ${ee.nonAirVoxelCount}`+Q):ee.nonAirVoxelCount===0?(n.value="ok",i.value="无可视方块：当前分层下无体素或结构全为空气（可调整分层预览或检查 blockPalette）"):(n.value="warn",i.value=`无可见几何：${ee.nonAirVoxelCount} 个非空气体素无有效 BakedQuads（检查 blockPalette.geometry 或 materialPalette 预取）`+Q)}catch(V){n.value="error",i.value=`网格构建失败: ${Ap(V)}`,console.error("[WikiMultiStructureRender] buildBlockMesh",V)}finally{G===_&&(s.value=!1)}}function M(){_++;const v=f.value,x=h.value;x&&v&&v.remove(x),d==null||d(),h.value=null,d=null}function A(){var v,x;(v=c.value)==null||v.dispose(),c.value=null,(x=l.value)==null||x.dispose(),l.value=null,a.value=null,u.value=void 0,f.value=null}return An(r,()=>{!a.value||!f.value||L()}),{showBlockStatsSidebar:t.features.blockStatsSidebar,loadStatus:e,statusBarTone:n,statusMessage:i,layerWorldY:r,meshBusy:s,projectionMode:o,structureDefinition:a,materialLibrary:l,blockIconCache:c,sizeRow:g,layerPreviewMode:m,blockStatsEntries:p,projectionLabel:T,layerPreviewLabel:R,registerScene:y,loadStructureAndResources:P,rebuildContentMesh:L,detachAndDisposeMesh:M,disposeCachesAndLibrary:A,contentGroupRef:h}}const nP={key:0,class:"wm-layer-bar"},iP=["max","disabled"],rP={class:"wm-layer-value","aria-live":"polite"},sP=Ut({__name:"LayerPreviewBar",setup(t){const e=Er(Uf);if(!e)throw new Error("LayerPreviewBar: PreviewSceneContext missing");const{layerPreviewLabel:n,sizeRow:i,meshBusy:r}=e,s=Ve({get:()=>e.layerWorldY.value,set:a=>{e.layerWorldY.value=a}}),o=Ve(()=>Math.max(0,i.value-1));return(a,l)=>ft(i)>0?(Me(),Re("div",nP,[l[1]||(l[1]=z("label",{class:"wm-layer-label",for:"wm-layer-range"},"分层预览",-1)),yt(z("input",{id:"wm-layer-range","onUpdate:modelValue":l[0]||(l[0]=c=>s.value=c),class:"wm-layer-range",type:"range",min:-1,max:o.value,step:"1",disabled:ft(r),"aria-label":"分层预览：ALL 或按世界 Y 单层显示"},null,8,iP),[[tn,s.value,void 0,{number:!0}]]),z("span",rP,Pt(ft(n)),1)])):wt("",!0)}}),oP=kt(sP,[["__scopeId","data-v-8f601de3"]]),aP={"+x":new O(1,0,0),"-x":new O(-1,0,0),"+y":new O(0,1,0),"-y":new O(0,-1,0),"+z":new O(0,0,1),"-z":new O(0,0,-1)},Io=new O(0,1,0),lP=10;function cP(t,e,n,i,r,s,o){const a=Ml(e,r),l=new O;return l.set(t+.5-i/2,a+.5-r/2,n+.5-s/2),l}function uP(t,e){Math.abs(e.dot(Io))>.98?t.up.set(0,0,1):t.up.copy(Io)}function fP(t,e,n){const i=e.target.clone(),r=(n==null?void 0:n.distance)??Math.max(.1,t.position.distanceTo(i)),s=n==null?void 0:n.yawDeg,o=n==null?void 0:n.elevationFromHorizontalDeg,a=ku.degToRad(s),l=Math.PI/2-ku.degToRad(o),c=new O().setFromSpherical(new Vu(r,l,a));t.position.copy(i).add(c),t.up.copy(Io),t.lookAt(i),e.update()}function hP(t,e,n,i,r,s){const o=n.initialCamera;if(!o){e.target.copy(i),t.position.copy(r),t.up.copy(Io),t.lookAt(i);return}const a=Sl(n),l=IC(a,o.focusBlockId);if(!l){e.target.copy(i),t.position.copy(r),t.up.copy(Io),t.lookAt(i);return}const{sizeColumn:c,sizeRow:u,sizeZSlice:f}=a,h=cP(l.column,l.row,l.zSlice,c,u,f),d=aP[o.frontFace].clone(),_=o.distance??lP;uP(t,d),t.position.copy(h).add(d.multiplyScalar(_)),t.lookAt(h),e.target.copy(h)}const Rp="air";function Cp(t,e,n,i){const r=Math.min(e-1,Math.max(0,Math.floor(t.x+e/2))),s=Math.min(n-1,Math.max(0,Math.floor(t.y+n/2))),o=Math.min(i-1,Math.max(0,Math.floor(t.z+i/2)));return{column:r,voxelY:s,zSlice:o}}function dP(t){const{clientX:e,clientY:n,domElement:i,camera:r,contentGroup:s,def:o,layerPreview:a}=t,l=i.getBoundingClientRect(),c=(e-l.left)/l.width*2-1,u=-((n-l.top)/l.height)*2+1,f=new zM;f.setFromCamera(new We(c,u),r);const h=f.intersectObject(s,!0);if(!h.length)return null;const d=h[0];if(!d.face)return null;const _=d.face.normal.clone().transformDirection(d.object.matrixWorld).normalize(),g=d.point.clone().addScaledVector(_,-.002),m=Sl(o),{sizeColumn:p,sizeRow:T,sizeZSlice:R}=m;let{column:y,voxelY:P,zSlice:L}=Cp(g,p,T,R);const M=T-1-P;let A=Ep(m,y,M,L,T,a);if(A===Rp){const v=d.point.clone().addScaledVector(_,-.008);({column:y,voxelY:P,zSlice:L}=Cp(v,p,T,R)),A=Ep(m,y,T-1-P,L,T,a)}return A===Rp?null:A}const Pp={type:"change"},Nf={type:"start"},gg={type:"end"},Aa=new vl,Dp=new Gi,pP=Math.cos(70*ku.DEG2RAD),Dt=new O,an=2*Math.PI,dt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Rc=1e-6;class mP extends VM{constructor(e,n=null){super(e,n),this.state=dt.NONE,this.enabled=!0,this.target=new O,this.cursor=new O,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ri.ROTATE,MIDDLE:Ri.DOLLY,RIGHT:Ri.PAN},this.touches={ONE:ns.ROTATE,TWO:ns.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new O,this._lastQuaternion=new Pr,this._lastTargetPosition=new O,this._quat=new Pr().setFromUnitVectors(e.up,new O(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Vu,this._sphericalDelta=new Vu,this._scale=1,this._panOffset=new O,this._rotateStart=new We,this._rotateEnd=new We,this._rotateDelta=new We,this._panStart=new We,this._panEnd=new We,this._panDelta=new We,this._dollyStart=new We,this._dollyEnd=new We,this._dollyDelta=new We,this._dollyDirection=new O,this._mouse=new We,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=gP.bind(this),this._onPointerDown=_P.bind(this),this._onPointerUp=vP.bind(this),this._onContextMenu=wP.bind(this),this._onMouseWheel=bP.bind(this),this._onKeyDown=SP.bind(this),this._onTouchStart=MP.bind(this),this._onTouchMove=EP.bind(this),this._onMouseDown=xP.bind(this),this._onMouseMove=yP.bind(this),this._interceptControlDown=TP.bind(this),this._interceptControlUp=AP.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Pp),this.update(),this.state=dt.NONE}update(e=null){const n=this.object.position;Dt.copy(n).sub(this.target),Dt.applyQuaternion(this._quat),this._spherical.setFromVector3(Dt),this.autoRotate&&this.state===dt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=an:i>Math.PI&&(i-=an),r<-Math.PI?r+=an:r>Math.PI&&(r-=an),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(Dt.setFromSpherical(this._spherical),Dt.applyQuaternion(this._quatInverse),n.copy(this.target).add(Dt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Dt.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const a=new O(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const c=new O(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Dt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Aa.origin.copy(this.object.position),Aa.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Aa.direction))<pP?this.object.lookAt(this.target):(Dp.setFromNormalAndCoplanarPoint(this.object.up,this.target),Aa.intersectPlane(Dp,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Rc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Rc||this._lastTargetPosition.distanceToSquared(this.target)>Rc?(this.dispatchEvent(Pp),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?an/60*this.autoRotateSpeed*e:an/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Dt.setFromMatrixColumn(n,0),Dt.multiplyScalar(-e),this._panOffset.add(Dt)}_panUp(e,n){this.screenSpacePanning===!0?Dt.setFromMatrixColumn(n,1):(Dt.setFromMatrixColumn(n,0),Dt.crossVectors(this.object.up,Dt)),Dt.multiplyScalar(e),this._panOffset.add(Dt)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;Dt.copy(r).sub(this.target);let s=Dt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*n*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=n-i.top,o=i.width,a=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(an*this._rotateDelta.x/n.clientHeight),this._rotateUp(an*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(an*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-an*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(an*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-an*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(an*this._rotateDelta.x/n.clientHeight),this._rotateUp(an*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+n.x)*.5,a=(e.pageY+n.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new We,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function _P(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function gP(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function vP(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(gg),this.state=dt.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function xP(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ri.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=dt.DOLLY;break;case Ri.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=dt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=dt.ROTATE}break;case Ri.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=dt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=dt.PAN}break;default:this.state=dt.NONE}this.state!==dt.NONE&&this.dispatchEvent(Nf)}function yP(t){switch(this.state){case dt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case dt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case dt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function bP(t){this.enabled===!1||this.enableZoom===!1||this.state!==dt.NONE||(t.preventDefault(),this.dispatchEvent(Nf),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(gg))}function SP(t){this.enabled!==!1&&this._handleKeyDown(t)}function MP(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case ns.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=dt.TOUCH_ROTATE;break;case ns.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=dt.TOUCH_PAN;break;default:this.state=dt.NONE}break;case 2:switch(this.touches.TWO){case ns.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=dt.TOUCH_DOLLY_PAN;break;case ns.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=dt.TOUCH_DOLLY_ROTATE;break;default:this.state=dt.NONE}break;default:this.state=dt.NONE}this.state!==dt.NONE&&this.dispatchEvent(Nf)}function EP(t){switch(this._trackPointer(t),this.state){case dt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case dt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case dt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case dt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=dt.NONE}}function wP(t){this.enabled!==!1&&t.preventDefault()}function TP(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function AP(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const RP=104,Ra=2.2;class CP extends Bt{constructor(n=1.35){super();gt(this,"ortho");gt(this,"viewportBackup",new bt);this.name="WorldAxesGizmo";const i=new HM(n);i.frustumCulled=!1;const r=i.material;r.depthTest=!1,i.renderOrder=999,this.add(i),this.ortho=new Ts(-Ra,Ra,Ra,-Ra,.1,8),this.ortho.position.set(0,0,3),this.ortho.lookAt(0,0,0)}renderOverlay(n,i,r,s,o=RP){const a=Math.max(r,1),l=Math.max(s,1),c=Math.max(32,Math.min(o,Math.floor(Math.min(a,l)*.35)));this.quaternion.copy(i.quaternion).invert(),this.updateMatrixWorld(!0),n.getViewport(this.viewportBackup);const u=n.autoClear;n.autoClear=!1,n.clearDepth();const f=8,h=a-c-f,d=l-c-f;n.setViewport(h,d,c,c),n.setScissor(h,d,c,c),n.setScissorTest(!0),n.render(this,this.ortho),n.setScissorTest(!1),n.autoClear=u,n.setViewport(this.viewportBackup.x,this.viewportBackup.y,this.viewportBackup.z,this.viewportBackup.w)}dispose(){const n=this.children[0];n&&(n.geometry.dispose(),n.material.dispose())}}const Lp=10;class PP{constructor(e){gt(this,"renderer");gt(this,"perspectiveCamera");gt(this,"orthographicCamera");gt(this,"controls");gt(this,"_mode");gt(this,"container");gt(this,"worldAxesGizmo",new CP);gt(this,"rendererCssSize",new We);this.container=e.container;const n=Math.max(e.width,1),i=Math.max(e.height,1),r=n/i;this.renderer=new rg({antialias:!0,alpha:!1}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(n,i),this.renderer.outputColorSpace=Qt,this.perspectiveCamera=new gn(50,r,.1,500);const s=Lp;this.orthographicCamera=new Ts(-s*r/2,s*r/2,s/2,-s/2,.1,500),this._mode="perspective",this.controls=new mP(this.perspectiveCamera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.rotateSpeed=.9,this.controls.enablePan=!0,this.controls.mouseButtons={LEFT:Ri.ROTATE,MIDDLE:Ri.PAN,RIGHT:Ri.DOLLY};const o=this.renderer.domElement;o.addEventListener("pointerdown",a=>{a.button===1&&a.preventDefault()},{capture:!0}),e.container.appendChild(o)}get mode(){return this._mode}get activeCamera(){return this._mode==="perspective"?this.perspectiveCamera:this.orthographicCamera}syncOrthographicFromPerspective(){const e=this.perspectiveCamera,n=this.orthographicCamera;n.position.copy(e.position),n.quaternion.copy(e.quaternion),n.up.copy(e.up),n.updateProjectionMatrix()}setMode(e){if(e===this._mode)return;const n=this.activeCamera;this._mode=e;const i=this.activeCamera;i.position.copy(n.position),i.quaternion.copy(n.quaternion),i.up.copy(n.up),(i instanceof gn||i instanceof Ts)&&i.updateProjectionMatrix(),this.controls.object=i,this.controls.update()}toggleMode(){const e=this._mode==="perspective"?"orthographic":"perspective";return this.setMode(e),this._mode}resize(e,n){const i=Math.max(e,1),r=Math.max(n,1),s=i/r,o=this.perspectiveCamera;o.aspect=s,o.updateProjectionMatrix();const a=Lp,l=this.orthographicCamera;l.left=-a*s/2,l.right=a*s/2,l.top=a/2,l.bottom=-a/2,l.updateProjectionMatrix(),this.renderer.setSize(i,r)}render(e){this.renderer.render(e,this.activeCamera),this.renderer.getSize(this.rendererCssSize),this.worldAxesGizmo.renderOverlay(this.renderer,this.activeCamera,this.rendererCssSize.x,this.rendererCssSize.y)}dispose(){this.worldAxesGizmo.dispose(),this.controls.dispose(),this.renderer.dispose();const e=this.renderer.domElement;e.parentNode===this.container&&this.container.removeChild(e)}}const DP=["title"],LP=Ut({__name:"StructureViewport",props:{definition:{},materialLibrary:{},projectionMode:{},contentGroup:{},layerPreviewMode:{},sceneBackground:{default:1120295}},emits:["ready","update:projectionMode","hover-block"],setup(t,{emit:e}){const n=t,i=e,r=Er(Uf),s=Ne(null);let o=null,a=0,l=null,c=null,u=null,f=!1,h=null;function d(){o&&(o.toggleMode(),i("update:projectionMode",o.mode))}function _(){const p=o,T=n.contentGroup,R=u;if(!p||!T||!R||!h)return;const y=dP({clientX:h.clientX,clientY:h.clientY,domElement:R,camera:p.activeCamera,contentGroup:T,def:n.definition,layerPreview:n.layerPreviewMode});y?i("hover-block",{blockId:y,clientX:h.clientX,clientY:h.clientY,source:"viewport"}):i("hover-block",null)}function g(p){h={clientX:p.clientX,clientY:p.clientY},!f&&(f=!0,requestAnimationFrame(()=>{f=!1,_()}))}function m(){h=null,i("hover-block",null)}return An(()=>n.projectionMode,p=>{o==null||o.setMode(p)}),An([()=>n.contentGroup,()=>n.layerPreviewMode],()=>{h&&_()}),Lr(()=>{const p=s.value;if(!p)return;const T=new j_;T.background=new Ze(n.sceneBackground);const R=new J_(16777215,.55),y=new zu(16777215,.9);y.position.set(6,10,8),T.add(R,y);const P=new PP({container:p,width:p.clientWidth,height:p.clientHeight});o=P,u=P.renderer.domElement,u.addEventListener("pointermove",g),u.addEventListener("pointerleave",m);const L=n.definition,M=new O(0,2,0),A=new O(8,6,10);hP(P.perspectiveCamera,P.controls,L,M,A),fP(P.perspectiveCamera,P.controls,{yawDeg:225,elevationFromHorizontalDeg:15}),P.syncOrthographicFromPerspective(),P.setMode(n.projectionMode),c=()=>{const C=p.clientWidth,G=p.clientHeight;P.resize(C,G)},window.addEventListener("resize",c),l=new ResizeObserver(()=>c==null?void 0:c()),l.observe(p);const v=new kM,x=()=>{a=requestAnimationFrame(x),n.materialLibrary.tick(v.getDelta()*1e3),P.controls.update(),P.render(T)};x(),i("ready",T)}),of(()=>{u&&(u.removeEventListener("pointermove",g),u.removeEventListener("pointerleave",m),u=null),cancelAnimationFrame(a),l&&(l.disconnect(),l=null),c&&(window.removeEventListener("resize",c),c=null),r==null||r.detachAndDisposeMesh(),o==null||o.dispose(),o=null}),(p,T)=>(Me(),Re("div",{ref_key:"container",ref:s,class:"wm-viewport"},[z("button",{type:"button",class:"wm-projection-toggle",title:`当前：${t.projectionMode==="perspective"?"透视投影":"正交投影"}，点击切换`,onClick:d},Pt(t.projectionMode==="perspective"?"透":"正"),9,DP)],512))}}),IP=kt(LP,[["__scopeId","data-v-2a776b64"]]),UP={class:"wm-tooltip-pre"},NP=Ut({__name:"ToolTipBox",props:{text:{},clientX:{},clientY:{}},setup(t){return(e,n)=>(Me(),Kn(pm,{to:"body"},[z("div",{class:"wm-tooltip-box",role:"tooltip",style:No({left:`${t.clientX+12}px`,top:`${t.clientY+12}px`})},[z("pre",UP,Pt(t.text),1)],4)]))}});function FP(){const t=Ne(null);function e(i){const r=t.value;if(r&&r.blockId===i.blockId&&r.source===i.source){r.clientX=i.clientX,r.clientY=i.clientY;return}t.value={...i}}function n(i){const r=t.value;r&&(i===void 0||r.source===i)&&(t.value=null)}return{hover:t,setHover:e,clearHover:n}}function OP(t,e){const n=dg(e,t);return n?`${n.registryId} (meta ${n.meta})`:t}const BP={class:"wm-root"},kP={class:"wm-main-stage"},zP={class:"wm-viewport-column"},HP={class:"wm-status-text"},VP=Ut({__name:"AppShell",props:{mergedConfig:{}},setup(t){const e=t,n=tP(e.mergedConfig);rf(Uf,n);const{hover:i,setHover:r,clearHover:s}=FP(),{showBlockStatsSidebar:o,loadStatus:a,statusBarTone:l,statusMessage:c,structureDefinition:u,materialLibrary:f,blockIconCache:h,blockStatsEntries:d,projectionMode:_,layerPreviewMode:g,contentGroupRef:m}=n,p=Ve(()=>e.mergedConfig.features.layerBar),T=Ve(()=>{const A=u.value,v=i.value;return!A||!(v!=null&&v.blockId)?"":OP(v.blockId,A)}),R=Ve(()=>a.value==="error"?"wm-status-bar wm-status-bar--err":a.value==="loading"?"wm-status-bar wm-status-bar--loading":l.value==="warn"?"wm-status-bar wm-status-bar--warn":"wm-status-bar wm-status-bar--ok");async function y(A){n.registerScene(A);try{await n.rebuildContentMesh()}catch(v){console.error("[WikiMultiStructureRender] onViewportReady",v)}}function P(A){n.projectionMode.value=A}function L(A){A?r(A):s("viewport")}function M(A){A?r(A):s("sidebar")}return Lr(async()=>{await n.loadStructureAndResources()}),of(()=>{n.disposeCachesAndLibrary()}),(A,v)=>(Me(),Re(Ot,null,[z("div",BP,[v[1]||(v[1]=z("p",{class:"wm-title"},"Industrial Electrolyzer — Simple 结构预览（GT5U 数据）",-1)),z("div",kP,[ft(o)&&ft(a)==="ok"&&ft(h)?(Me(),Kn(rC,{key:0,entries:ft(d),cache:ft(h),onTooltipHover:M},null,8,["entries","cache"])):wt("",!0),z("div",zP,[ft(a)==="ok"&&ft(u)&&ft(f)?(Me(),Kn(IP,{key:0,definition:ft(u),"material-library":ft(f),"projection-mode":ft(_),"content-group":ft(m),"layer-preview-mode":ft(g),"scene-background":t.mergedConfig.sceneBackground,onReady:y,"onUpdate:projectionMode":P,onHoverBlock:L},null,8,["definition","material-library","projection-mode","content-group","layer-preview-mode","scene-background"])):wt("",!0),p.value&&ft(a)==="ok"?(Me(),Kn(oP,{key:1})):wt("",!0)])]),z("div",{class:un(R.value),role:"status","aria-live":"polite"},[v[0]||(v[0]=z("span",{class:"wm-status-dot","aria-hidden":"true"},null,-1)),z("span",HP,Pt(ft(c)),1)],2),ft(i)&&T.value?(Me(),Kn(NP,{key:0,text:T.value,"client-x":ft(i).clientX,"client-y":ft(i).clientY},null,8,["text","client-x","client-y"])):wt("",!0)]),t.mergedConfig.features.developerPanel?(Me(),Kn(DC,{key:0,"merged-config":t.mergedConfig},null,8,["merged-config"])):wt("",!0)],64))}}),GP=kt(VP,[["__scopeId","data-v-a66d6900"]]),WP={class:"wm-preview"},XP={key:0,class:"wm-boot"},YP={key:1,class:"wm-boot wm-boot--err"},$P={key:3,class:"wm-boot wm-boot--muted"},jP=Ut({__name:"WorkbenchPreviewPanel",setup(t){const e=ai(),n=Ve(()=>e.previewBusy.value),i=Ve(()=>e.previewError.value),r=Ve(()=>e.previewConfig.value);async function s(){await e.refreshPreview()}return(o,a)=>(Me(),Re("section",WP,[n.value?(Me(),Re("div",XP,"构建预览…")):i.value?(Me(),Re("div",YP,[z("p",null,Pt(i.value),1),z("button",{type:"button",class:"wm-btn",onClick:s},"重试预览")])):r.value?(Me(),Kn(GP,{key:2,"merged-config":r.value},null,8,["merged-config"])):(Me(),Re("div",$P," 请先在右上角「设置」中选择数据源并加载文档（须 geometryPhase=baked 且含 textureBlobs 方可预览）。 "))]))}}),qP=kt(jP,[["__scopeId","data-v-33d76b93"]]),ZP={key:0,class:"wm-panel"},KP={key:0,class:"wm-muted"},JP={key:1,class:"wm-list"},QP=["onClick"],eD={class:"wm-size"},tD={key:2,class:"wm-muted"},nD=Ut({__name:"ExportsListPanel",setup(t){const e=ai(),n=Ve(()=>e.workspaceMode.value==="sde"),i=Ve(()=>e.apiBase.value),r=Ve(()=>e.exportFiles.value),s=Ve(()=>e.exportsLoading.value),o=Ve(()=>e.selectedExportName.value);async function a(l){try{await e.loadExportByName(l),e.connectionMessage.value=`已加载 ${l}`}catch(c){e.connectionMessage.value=String(c instanceof Error?c.message:c)}}return(l,c)=>n.value&&i.value?(Me(),Re("section",ZP,[c[0]||(c[0]=z("h2",{class:"wm-panel__title"},"structure_exports",-1)),s.value?(Me(),Re("div",KP,"加载列表…")):(Me(),Re("ul",JP,[(Me(!0),Re(Ot,null,ps(r.value,u=>(Me(),Re("li",{key:u.name,class:"wm-list__item"},[z("button",{type:"button",class:un(["wm-link",{"wm-link--active":o.value===u.name}]),onClick:f=>a(u.name)},Pt(u.name),11,QP),z("span",eD,Pt(u.size)+" B",1)]))),128))])),!s.value&&r.value.length===0?(Me(),Re("p",tD,"目录下暂无 .json")):wt("",!0)])):wt("",!0)}}),iD=kt(nD,[["__scopeId","data-v-436b396d"]]),rD={class:"dash-card"},sD={class:"dash-field"},oD=["value"],aD=["disabled"],lD={key:0,class:"dash-err"},cD=Ut({__name:"LocalBundlePanel",setup(t){const e=ai(),n=Ve(()=>Lo()),i=Ne(rs),r=Ne(!1),s=Ne("");Lr(()=>{const a=Lo();a.length>0&&!a.includes(i.value)&&(i.value=a[0])});async function o(){r.value=!0,s.value="";try{await e.loadLocalScene(i.value),e.connectionMessage.value=`已加载示例 ${i.value}`}catch(a){s.value=a instanceof Error?a.message:String(a)}finally{r.value=!1}}return(a,l)=>(Me(),Re("section",rD,[l[2]||(l[2]=z("h2",{class:"dash-card__title"},"内置示例场景",-1)),l[3]||(l[3]=z("p",{class:"dash-card__desc"},[Un("来自仓库 "),z("code",{class:"dash-code"},"data/scenes/*.json"),Un("，仅供开发与对照。")],-1)),z("label",sD,[l[1]||(l[1]=z("span",{class:"dash-field__label"},"场景 ID",-1)),yt(z("select",{"onUpdate:modelValue":l[0]||(l[0]=c=>i.value=c),class:"dash-select"},[(Me(!0),Re(Ot,null,ps(n.value,c=>(Me(),Re("option",{key:c,value:c},Pt(c),9,oD))),128))],512),[[Vc,i.value]])]),z("button",{type:"button",class:"dash-btn dash-btn--primary",disabled:r.value||n.value.length===0,onClick:o},Pt(r.value?"加载中…":"加载到工作台"),9,aD),s.value?(Me(),Re("p",lD,Pt(s.value),1)):wt("",!0)]))}}),uD=kt(cD,[["__scopeId","data-v-a3077ce6"]]),fD={class:"dash-card"},hD=["disabled"],dD={key:0,class:"dash-err"},pD=Ut({__name:"LocalFilePanel",setup(t){const e=ai(),n=Ne(null),i=Ne(!1),r=Ne("");function s(){var l;r.value="",(l=n.value)==null||l.click()}async function o(l){var f;const c=l.target,u=(f=c.files)==null?void 0:f[0];if(c.value="",!!u){i.value=!0,r.value="";try{await e.loadDocumentFromFile(u),e.connectionMessage.value=`已打开 ${u.name}`}catch(h){r.value=h instanceof Error?h.message:String(h)}finally{i.value=!1}}}async function a(l){var u,f;l.preventDefault();const c=(f=(u=l.dataTransfer)==null?void 0:u.files)==null?void 0:f[0];if(!c||!c.name.toLowerCase().endsWith(".json")){r.value="请拖入 .json 文件";return}i.value=!0,r.value="";try{await e.loadDocumentFromFile(c),e.connectionMessage.value=`已打开 ${c.name}`}catch(h){r.value=h instanceof Error?h.message:String(h)}finally{i.value=!1}}return(l,c)=>(Me(),Re("section",fD,[c[2]||(c[2]=z("h2",{class:"dash-card__title"},"打开本地 JSON",-1)),c[3]||(c[3]=z("p",{class:"dash-card__desc"},"从磁盘选择 StructureData / World 打包 JSON，数据仅在浏览器内存中处理。",-1)),z("input",{ref_key:"fileInput",ref:n,type:"file",accept:".json,application/json",class:"dash-hidden",onChange:o},null,544),z("div",{class:un(["dash-drop",{"dash-drop--busy":i.value}]),onDragover:c[0]||(c[0]=Hv(()=>{},["prevent"])),onDrop:a},[c[1]||(c[1]=z("p",{class:"dash-drop__hint"},"拖放 .json 到此处，或",-1)),z("button",{type:"button",class:"dash-btn dash-btn--primary",disabled:i.value,onClick:s},Pt(i.value?"读取中…":"选择文件"),9,hD)],34),r.value?(Me(),Re("p",dD,Pt(r.value),1)):wt("",!0)]))}}),mD=kt(pD,[["__scopeId","data-v-06267789"]]),_D={class:"dash-card"},gD={class:"dash-field"},vD={class:"dash-field"},xD={class:"dash-row"},yD=Ut({__name:"SdeConnectionPanel",setup(t){const e=ai(),n=Ve(()=>e.connectionOk.value),i=Ve(()=>e.connectionMessage.value),r=Ve(()=>e.connectionOk.value!==null);async function s(){await e.testConnection(),e.connectionOk.value&&e.apiBase.value&&(await e.refreshExportList(),await e.loadWorkspaceFromServer())}return(o,a)=>(Me(),Re("section",_D,[a[4]||(a[4]=z("h2",{class:"dash-card__title"},"连接 SDE Web",-1)),a[5]||(a[5]=z("p",{class:"dash-card__desc"},[Un("填写游戏内 "),z("code",{class:"dash-code"},"/sde web"),Un(" 打印的地址与 Token，与 "),z("code",{class:"dash-code"},"structure_exports"),Un(" 目录同步。")],-1)),z("label",gD,[a[2]||(a[2]=z("span",{class:"dash-field__label"},"API 基址",-1)),yt(z("input",{"onUpdate:modelValue":a[0]||(a[0]=l=>ft(e).apiBase=l),class:"dash-input",type:"text",autocomplete:"off",placeholder:"http://127.0.0.1:37564"},null,512),[[tn,ft(e).apiBase]])]),z("label",vD,[a[3]||(a[3]=z("span",{class:"dash-field__label"},"Token",-1)),yt(z("input",{"onUpdate:modelValue":a[1]||(a[1]=l=>ft(e).token=l),class:"dash-input",type:"password",autocomplete:"off",placeholder:"Bearer"},null,512),[[tn,ft(e).token]])]),z("div",xD,[z("button",{type:"button",class:"dash-btn dash-btn--primary",onClick:s},"连接并刷新"),r.value?(Me(),Re("span",{key:0,class:un(["dash-hint",{"dash-hint--ok":n.value,"dash-hint--err":n.value===!1}])},Pt(i.value),3)):wt("",!0)])]))}}),bD=kt(yD,[["__scopeId","data-v-ad9d3124"]]),SD={key:0,class:"drawer-root"},MD={class:"drawer-panel",role:"dialog","aria-modal":"true","aria-labelledby":"drawer-title"},ED={class:"drawer-body"},wD={class:"drawer-section"},TD={class:"seg",role:"group","aria-label":"数据源类型"},AD={key:0,class:"drawer-stack"},RD={key:1,class:"drawer-stack"},CD={key:2,class:"drawer-stack"},PD=Ut({__name:"WorkbenchSettingsDrawer",setup(t){const e=ai(),n=Ve(()=>e.settingsOpen.value),i=Ve(()=>e.workspaceMode.value),r=Ve(()=>Lo().length),s=Ve(()=>r.value>0);function o(){e.setSettingsOpen(!1)}function a(c){e.setWorkspaceMode(c)}function l(c){c.key==="Escape"&&o()}return Lr(()=>{window.addEventListener("keydown",l)}),af(()=>{window.removeEventListener("keydown",l)}),(c,u)=>(Me(),Kn(pm,{to:"body"},[n.value?(Me(),Re("div",SD,[z("div",{class:"drawer-backdrop","aria-hidden":"true",onClick:o}),z("aside",MD,[z("header",{class:"drawer-head"},[u[3]||(u[3]=z("h2",{id:"drawer-title",class:"drawer-title"},"设置",-1)),z("button",{type:"button",class:"drawer-close","aria-label":"关闭",onClick:o},"×")]),z("div",ED,[z("section",wD,[u[4]||(u[4]=z("h3",{class:"drawer-h3"},"数据源",-1)),u[5]||(u[5]=z("p",{class:"drawer-lead"},"选择文档来源；切换会清空当前文档与连接状态。",-1)),z("div",TD,[z("button",{type:"button",class:un(["seg__btn",{"seg__btn--on":i.value==="sde"}]),onClick:u[0]||(u[0]=f=>a("sde"))}," SDE 远程 ",2),z("button",{type:"button",class:un(["seg__btn",{"seg__btn--on":i.value==="local-file"}]),onClick:u[1]||(u[1]=f=>a("local-file"))}," 本地文件 ",2),s.value?(Me(),Re("button",{key:0,type:"button",class:un(["seg__btn",{"seg__btn--on":i.value==="local-bundle"}]),onClick:u[2]||(u[2]=f=>a("local-bundle"))}," 内置示例 ",2)):wt("",!0)])]),i.value==="sde"?(Me(),Re("div",AD,[Tt(bD),Tt(iD)])):i.value==="local-file"?(Me(),Re("div",RD,[Tt(mD)])):(Me(),Re("div",CD,[Tt(uD)]))])])])):wt("",!0)]))}}),DD=kt(PD,[["__scopeId","data-v-775d14ed"]]),LD={class:"dash-side"},ID={class:"dash-side__nav","aria-label":"主功能"},UD=Ut({__name:"WorkbenchSidebar",setup(t){const e=ai(),n=Ve(()=>e.mainSection.value);function i(r){e.setMainSection(r)}return(r,s)=>(Me(),Re("aside",LD,[s[6]||(s[6]=av('<div class="dash-side__brand" data-v-aaaee785><span class="dash-side__logo" data-v-aaaee785>SDE</span><div class="dash-side__titles" data-v-aaaee785><div class="dash-side__title" data-v-aaaee785>Structure Workbench</div><div class="dash-side__sub" data-v-aaaee785>场景工作台</div></div></div>',1)),z("nav",ID,[z("button",{type:"button",class:un(["dash-nav-item",{"dash-nav-item--active":n.value==="preview"}]),onClick:s[0]||(s[0]=o=>i("preview"))},[...s[3]||(s[3]=[z("span",{class:"dash-nav-item__icon","aria-hidden":"true"},"◉",-1),z("span",{class:"dash-nav-item__text"},[z("span",{class:"dash-nav-item__label"},"预览"),z("span",{class:"dash-nav-item__hint"},"三维场景与校验状态")],-1)])],2),z("button",{type:"button",class:un(["dash-nav-item",{"dash-nav-item--active":n.value==="edit"}]),onClick:s[1]||(s[1]=o=>i("edit"))},[...s[4]||(s[4]=[z("span",{class:"dash-nav-item__icon","aria-hidden":"true"},"✎",-1),z("span",{class:"dash-nav-item__text"},[z("span",{class:"dash-nav-item__label"},"编辑"),z("span",{class:"dash-nav-item__hint"},"元数据与根字段")],-1)])],2),z("button",{type:"button",class:un(["dash-nav-item",{"dash-nav-item--active":n.value==="export"}]),onClick:s[2]||(s[2]=o=>i("export"))},[...s[5]||(s[5]=[z("span",{class:"dash-nav-item__icon","aria-hidden":"true"},"↓",-1),z("span",{class:"dash-nav-item__text"},[z("span",{class:"dash-nav-item__label"},"导出"),z("span",{class:"dash-nav-item__hint"},"下载、Compact、同步 SDE")],-1)])],2)]),s[7]||(s[7]=z("p",{class:"dash-side__foot"},"数据源与 SDE 连接请使用右上角「设置」。",-1))]))}}),ND=kt(UD,[["__scopeId","data-v-aaaee785"]]),FD={class:"dash-top"},OD={class:"dash-breadcrumb","aria-label":"面包屑"},BD={key:0,class:"dash-breadcrumb__sep","aria-hidden":"true"},kD={class:"dash-top__meta"},zD={key:0,class:"dash-badge"},HD={key:1,class:"dash-badge dash-badge--ok"},VD=Ut({__name:"WorkbenchTopbar",setup(t){const e=ai(),n=Ve(()=>e.dirty.value),i=Ve(()=>e.workspaceMode.value==="sde"&&e.connectionOk.value===!0),r=Ve(()=>{const s=[{label:"工作台"}],o=e.mainSection.value;s.push({label:o==="preview"?"预览":o==="edit"?"编辑":"导出"});const a=e.workspaceMode.value;if(a==="sde"){s.push({label:"SDE 远程"});const l=e.apiBase.value;l&&s.push({label:l.replace(/^https?:\/\//,""),dim:!0});const c=e.connectionOk.value;c===!0?s.push({label:"已连接",dim:!0}):c===!1&&s.push({label:"未连接",dim:!0});const u=e.selectedExportName.value;u?s.push({label:u}):e.document.value&&s.push({label:"工作区文档"})}else if(a==="local-file"){s.push({label:"本地文件"});const l=e.localFileName.value;s.push({label:l??"未选择文件",dim:!l})}else{s.push({label:"内置示例"});const l=e.localFileName.value;l&&s.push({label:l})}return s});return(s,o)=>(Me(),Re("header",FD,[z("nav",OD,[(Me(!0),Re(Ot,null,ps(r.value,(a,l)=>(Me(),Re(Ot,{key:l},[l>0?(Me(),Re("span",BD,"/")):wt("",!0),z("span",{class:un(["dash-breadcrumb__item",{"dash-breadcrumb__item--dim":a.dim}])},Pt(a.label),3)],64))),128))]),z("div",kD,[n.value?(Me(),Re("span",zD,"未保存")):wt("",!0),i.value?(Me(),Re("span",HD,"API")):wt("",!0),z("button",{type:"button",class:"dash-settings",onClick:o[0]||(o[0]=a=>ft(e).setSettingsOpen(!0))},"设置")])]))}}),GD=kt(VD,[["__scopeId","data-v-2997f219"]]),WD={class:"dash-app"},XD={class:"dash-main"},YD={class:"dash-body"},$D={class:"dash-pane dash-pane--preview"},jD={class:"dash-pane dash-pane--narrow"},qD={class:"dash-pane dash-pane--narrow"},ZD=Ut({__name:"WorkbenchRoot",setup(t){const e=AR(),n=Ve(()=>e.mainSection.value);return Lr(async()=>{e.apiBase.value&&(await e.testConnection(),e.connectionOk.value&&(await e.refreshExportList(),await e.loadWorkspaceFromServer()))}),(i,r)=>(Me(),Re("div",WD,[Tt(ND),z("div",XD,[Tt(GD),z("div",YD,[yt(z("div",$D,[Tt(qP)],512),[[Il,n.value==="preview"]]),yt(z("div",jD,[Tt(XR)],512),[[Il,n.value==="edit"]]),yt(z("div",qD,[Tt(LR)],512),[[Il,n.value==="export"]])])]),Tt(DD)]))}}),KD=kt(ZD,[["__scopeId","data-v-8852f842"]]),JD={key:0,class:"wm-boot wm-boot--err"},QD=Ut({__name:"DevApp",setup(t){const e=Ne(null);return vm(n=>(e.value=bl(n),console.error("[WikiMultiStructureRender] WorkbenchRoot",n),!1)),(n,i)=>e.value?(Me(),Re("div",JD,Pt(e.value),1)):(Me(),Kn(KD,{key:1}))}}),e2=kt(QD,[["__scopeId","data-v-f436c961"]]);Wv(e2).mount("#app");
