
// ==UserScript==
// @name        微信编辑器增强🧬(dev)
// @namespace   http://tampermonkey.net/
// @match       *://www.135editor.com/*
// @match       *://bj.96weixin.com/*
// @match       *://www.365editor.com/*
// @match       *://mp.weixin.qq.com/*
// @icon        https://www.135editor.com/img/vip/vip.png
// @require     https://cdn.jsdelivr.net/npm/jscolor-picker@2.0.4/jscolor.min.js
// @require     https://unpkg.com/vue@3.3.4/dist/vue.global.js
// @grant       GM_addStyle
// @version     2.0.2-dev
// @author      ec50n9
// @description 为135、96、365编辑器去除广告，免vip，增加css样式编辑面板等...
// @license     MIT
// ==/UserScript==
      (()=>{var e={989:()=>{GM_addStyle('#ec-window {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 0;\n  height: 0;\n\n  overflow: visible;\n  z-index: 999;\n  font-family: PingFangSC-Regular, "Georgia Pro", Georgia, Times,\n    "Times New Roman", sans-serif;\n}\n')}},o={};function t(n){var i=o[n];if(void 0!==i)return i.exports;var r=o[n]={exports:{}};return e[n](r,r.exports,t),r.exports}(()=>{"use strict";const{h:e}=Vue;function o(o){const t=[{color:"#f59e0b",onClick:()=>{console.log("mini")}},{color:"#ef4444",onClick:()=>{console.log("close")}}],n=({color:o})=>e("div",{style:{width:"1rem",height:"1rem",borderRadius:"50%",backgroundColor:o}});return e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",height:"2rem",padding:"0 0.5rem",borderBottom:"1px solid #e5e7eb",userSelect:"none",cursor:"move"}},[e("div",o.title),e("div",{style:{display:"flex",columnGap:"0.5rem"}},t.map((o=>e(n,o))))])}const n={data:()=>({count:0,x:0,y:0}),mounted(){const{headerEl:e}=this.$refs;e.addEventListener("mousedown",(o=>{const{clientX:t,clientY:n}=o,{left:i,top:r}=e.getBoundingClientRect(),s=t-i,d=n-r,l=e=>{const{clientX:o,clientY:t}=e;this.x=o-s,this.y=t-d},c=()=>{document.removeEventListener("mousemove",l),document.removeEventListener("mouseup",c)};document.addEventListener("mousemove",l),document.addEventListener("mouseup",c)}))},render(){return e("div",{style:{position:"fixed",left:`${this.x}px`,top:`${this.y}px`,display:"flex",flexDirection:"column",width:"24em",maxHeight:"90%",backgroundColor:"#fff",boxShadow:"rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",borderRadius:"1em"},onClick:()=>{this.count++}},[e(o,{ref:"headerEl",title:`x: ${this.x}, y: ${this.y}`}),this.count])}};t(989),console.log("--- inject start ---"),function(){let e=document.createElement("div");e.id="ec-window",document.body.appendChild(e)}(),window.onload=()=>{console.log("页面加载完成"),Vue.createApp(n).mount("#ec-window")},console.log("--- inject end ---")})()})();