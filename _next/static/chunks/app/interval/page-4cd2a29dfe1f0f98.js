(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[248],{7481:function(e,t,n){Promise.resolve().then(n.bind(n,5184))},5184:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return u}});var r=n(7437),a=n(2265),l=n(8630),o=n(2472),s=n(9325),c=n(7979);function u(){let[e,t]=(0,a.useState)(1),[n,u]=(0,a.useState)(4),i=(0,a.useRef)(0),[m,p]=(0,a.useState)(4),[f,d]=(0,a.useState)(Array(2*e)),[g,x]=(0,a.useState)(Array(2*e)),[h,v]=(0,a.useState)(Array(2*e)),N=(0,o.Z)(),A=(0,s.Z)(),[b,S]=(0,a.useState)(Array(e)),C=(0,a.useCallback)(()=>{console.log("new melody"),x((0,c.XY)(e)),v(Array(e)),d(Array(e))},[e]);return(0,a.useEffect)(()=>{let t=(0,c.lX)(),n=(0,c.XY)(e);i.current=t,S(b),x(n)},[b,e]),(0,a.useEffect)(()=>{C()},[C,e]),(0,r.jsxs)("div",{className:"flex flex-col",children:[(0,r.jsx)("h1",{className:"m-auto text-3xl",children:"Interval Trainer"}),(0,r.jsxs)("div",{className:"m-auto flex p-3",children:[(0,r.jsx)("p",{className:"px-2 text-xl",children:"Speed:"}),(0,r.jsx)("input",{className:"w-4/5",type:"range",min:"1",max:"4",value:m,onChange:e=>{p(Number(e.target.value))}}),(0,r.jsx)("span",{className:"px-2 text-xl",children:m})]}),(0,r.jsxs)("div",{className:"m-auto flex p-3",children:[(0,r.jsx)("p",{className:"px-2 text-xl",children:"Octave:"}),(0,r.jsx)("input",{className:"",type:"range",min:"1",max:"5",value:n,onChange:e=>{u(Number(e.target.value))}}),(0,r.jsxs)("span",{className:"px-2 text-xl",children:["C",n]})]}),(0,r.jsxs)("div",{className:"m-auto flex p-3",children:[(0,r.jsx)("p",{className:"px-2 text-xl",children:"Intervals: "}),(0,r.jsx)("input",{className:"w-4/5",type:"range",min:"1",max:"7",value:e,onChange:e=>{t(Number(e.target.value))}}),(0,r.jsx)("span",{className:"px-2 text-xl",children:e})]}),(0,r.jsx)("br",{}),(0,r.jsx)("button",{className:"m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white",onClick:()=>{null!=N&&(0,c.Cl)(N,g,i.current,n,m/4)},children:"Play"}),(0,r.jsx)("button",{className:"m-auto mb-4 w-4/5 bg-blue-300 p-3 text-white",onClick:C,children:"New Interval"}),(0,r.jsxs)("div",{className:"m-auto mt-5 flex w-full flex-col",children:[(0,r.jsx)("center",{children:(0,r.jsx)(l.Z,{pin:h,onPinChanged:(e,t)=>{let n=[...h];e&&(n[t]=e),v(n)},pinLength:2*e,verification:f})}),(0,r.jsx)("button",{onClick:()=>{null!=A&&(0,c.x8)(g,h,d,A,c.g2.INTERVAL)},className:"m-auto mb-4 mt-5 w-4/5 bg-green-300 p-3 text-white",children:"Verify"})]})]})}},8630:function(e,t,n){"use strict";var r=n(7437),a=n(2265);t.Z=e=>{let{pinLength:t,pin:n,verification:l,onPinChanged:o}=e,s=(0,a.useRef)([]),c=e=>{let t=s.current[e];t&&t.focus()},u=(e,t)=>{let n=e.findIndex(e=>e===t);-1!==n&&e.splice(n,1)},i=(e,n)=>{var r;let a=e.target.defaultValue,l=e.target.value.split("");u(l,a);let s=l.pop();if(!s)return;let i=Number(s.trim());(null!==(r=Number.isNaN(i))&&void 0!==r?!r:0!==s.length)&&i>=0&&i<=9&&(o(i,n),n<t-1&&c(n+1))},m=(e,t)=>{"Backspace"===e.nativeEvent.code&&(void 0===n[t]?c(t-1):o(void 0,t))};return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)("div",{children:Array.from({length:t},(e,t)=>{var a;return(0,r.jsx)("input",{type:"number",className:"text-md m-3 w-12 border-2 ".concat(function(e){switch(e){case 0:return"border-red-500";case 1:return"border-green-500";default:return"border-black"}}(null==l?void 0:l[t])," p-3 text-center text-2xl text-black [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"),onKeyDown:e=>m(e,t),ref:e=>{e&&(s.current[t]=e)},onChange:e=>i(e,t),value:null!==(a=n[t])&&void 0!==a?a:""},t)})})})}},8013:function(e,t,n){"use strict";var r,a,l=n(357);class o{print(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];"false"!=l.env.DEBUG&&console[e]("[".concat(e.toUpperCase(),"]"),this.getTime(),...n)}getTime(){let e=new Date,t=e.getFullYear(),n=e.getMonth()+1,r=e.getDate(),a=e.getHours(),l=e.getMinutes(),o=e.getSeconds();return"".concat(t,"-").concat(n,"-").concat(r," ").concat(a,":").concat(l,":").concat(o)}log(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];this.print("log",t)}warn(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];this.print("warn",t)}error(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];this.print("error",t)}}(r=a||(a={})).LOG="log",r.WARNING="warn",r.ERROR="error";let s=Object.freeze(new o);t.Z=s},2472:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});var r=n(2265),a=n(3915),l=n(1965),o=n(8013);function s(){let[e,t]=(0,r.useState)(null);return(0,r.useEffect)(()=>{let e=new a.Z4({urls:{A0:"A0.mp3",C1:"C1.mp3","D#1":"Ds1.mp3","F#1":"Fs1.mp3",A1:"A1.mp3",C2:"C2.mp3","D#2":"Ds2.mp3","F#2":"Fs2.mp3",A2:"A2.mp3",C3:"C3.mp3","D#3":"Ds3.mp3","F#3":"Fs3.mp3",A3:"A3.mp3",C4:"C4.mp3","D#4":"Ds4.mp3","F#4":"Fs4.mp3",A4:"A4.mp3",C5:"C5.mp3","D#5":"Ds5.mp3","F#5":"Fs5.mp3",A5:"A5.mp3",C6:"C6.mp3","D#6":"Ds6.mp3","F#6":"Fs6.mp3",A6:"A6.mp3",C7:"C7.mp3","D#7":"Ds7.mp3","F#7":"Fs7.mp3",A7:"A7.mp3",C8:"C8.mp3"},release:1,baseUrl:"".concat(l.O.NEXT_PUBLIC_BASEPATH,"/sounds/piano/"),onload:()=>{o.Z.log("Piano loaded"),t(e)}}).toDestination();return()=>{e&&(e.releaseAll(),t(null))}},[]),e}},9325:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});var r=n(2265),a=n(8013);let l=[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];class o{save(e,t,n){var r;let a=JSON.parse(null!==(r=localStorage.getItem(e))&&void 0!==r?r:"{}");a.date=n,localStorage.setItem(e,JSON.stringify(a))}get(e,t){var n;let r=JSON.parse(null!==(n=localStorage.getItem(e))&&void 0!==n?n:"{}");return null==r.date?(this.initializeRecord(e,t),l):r.date}increment(e,t,n){var r;let o=JSON.parse(null!==(r=localStorage.getItem(e))&&void 0!==r?r:"{}");null==o.date&&(o.date=l),o.date[t][0]+=n,o.date[t][1]++,localStorage.setItem(e,JSON.stringify(o)),a.Z.log("Incremented "+this.date+" ,type: "+t)}initializeRecord(e,t){var n;let r=JSON.parse(null!==(n=localStorage.getItem(e))&&void 0!==n?n:"{}");r[t]=l,localStorage.setItem(e,JSON.stringify(r))}constructor(){this.date="",this.date=function(){let e=new Date,t=e.getFullYear(),n=e.getMonth()+1,r=e.getDate();return"".concat(t,"-").concat(n,"-").concat(r)}()}}function s(){let[e,t]=(0,r.useState)(null);return(0,r.useEffect)(()=>{let e=new o;return a.Z.log("Storage loaded"),t(e),()=>{e&&t(null)}},[]),e}},7979:function(e,t,n){"use strict";n.d(t,{$c:function(){return u},Cl:function(){return v},DK:function(){return d},XY:function(){return f},g2:function(){return l},iS:function(){return h},lX:function(){return m},rl:function(){return p},x8:function(){return x}});var r,a,l,o,s=n(8013),c=n(3915);let u=["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];(r=l||(l={})).CHORD_PROGRESSION="CHORD_PROGRESSION",r.MELODY="MELODY",r.INTERVAL="INTERVAL";let i=[[1,2,3,4],[1,2,6,4],[1,2,6,5],[1,3,4,5],[1,4,6,5],[1,4,2,5],[1,5,6,4],[2,4,1,5],[2,4,6,5],[2,3,4,5],[2,6,4,5],[2,6,1,5],[3,4,1,5],[3,4,5,1],[3,4,6,5],[4,1,5,6],[4,1,6,5],[4,3,2,1],[4,3,2,5],[4,3,5,1],[4,5,1,6],[4,5,6,1],[4,6,1,5],[4,6,5,1],[5,4,1,6],[5,6,4,1],[5,6,1,4],[6,4,1,5],[6,4,1,7],[6,4,5,1],[6,5,4,1],[6,5,1,4],[6,5,3,4],[6,7,1,4],[6,7,3,4],[7,1,4,4]];function m(){return Math.floor(12*Math.random())}function p(e){let t=[];for(let n=0;n<e;n++){let e=Math.floor(7*Math.random()+1);t.push(e)}return t}function f(e){let t=[];for(let n=0;n<e;n++)t.push(1),t.push(Math.floor(7*Math.random()+1));return t}function d(){var e;let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:4;return(null===(e=i[Math.floor(Math.random()*i.length)])||void 0===e?void 0:e.slice(0,t))||[]}function g(e){let t=[],n=0;for(;n<12;){if(t.push((e+n)%12),4==n){n++;continue}n+=2}return t}function x(e,t,n,r,a){s.Z.log(e,t);let l=[];for(let n=0;n<e.length;n++){let r=t[n]===e[n]?1:0;l[n]=r}n(l)}function h(e,t,n,r,a){let l=g(n),o=(0,c.zO)();t.filter(e=>e).map((t,n)=>{if(!t)return;let c=1;(2==t||3==t||6==t)&&(c=0),7==t&&(c=2);let i=function(e,t,n){let r=1==n?g(e):function(e){let t=[],n=0;for(;n<12;){if(t.push((e+n)%12),2==n||7==n){n++;continue}n+=2}return t}(e),a=[e,r[4],e,r[2]];2==n&&(a[1]=r[4]-1);let l=a.map(e=>u[e]);return[l[0]+t,"".concat(l[1]).concat(e<5?t:t+1),l[2]+(t+1),l[3]+(t+1)]}(l[t-1],r,c);s.Z.log("Playing:",i),e.triggerAttackRelease(i,a,o+a*n)})}function v(e,t,n,r,a){let l=g(n),o=(0,c.zO)();t.map((t,n)=>{s.Z.log("".concat(u[l[t-1]]).concat(r)),e.triggerAttackRelease("".concat(u[l[t-1]]).concat(r),a,o+a*n)})}(a=o||(o={}))[a.MINOR=0]="MINOR",a[a.MAJOR=1]="MAJOR",a[a.DIMINISHED=2]="DIMINISHED"},1965:function(e,t,n){"use strict";n.d(t,{O:function(){return o}});var r=n(2246),a=n(9772),l=n(357);let o=(0,r.D)({server:{NODE_ENV:a.z.enum(["development","test","production"])},client:{NEXT_PUBLIC_BASEPATH:a.z.string().optional()},runtimeEnv:{NODE_ENV:"production",NEXT_PUBLIC_BASEPATH:"/melodie"},skipValidation:!!l.env.SKIP_ENV_VALIDATION,emptyStringAsUndefined:!0})}},function(e){e.O(0,[212,246,971,23,744],function(){return e(e.s=7481)}),_N_E=e.O()}]);