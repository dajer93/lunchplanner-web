(()=>{var e={};e.id=697,e.ids=[697],e.modules={440:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n});var a=r(1658);let n=async e=>[{type:"image/x-icon",sizes:"16x16",url:(0,a.fillMetadataSegment)(".",await e.params,"favicon.ico")+""}]},789:(e,t,r)=>{Promise.resolve().then(r.bind(r,3519))},846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1135:()=>{},1297:(e,t,r)=>{"use strict";r.d(t,{B2:()=>x,DR:()=>h,Hg:()=>m,IF:()=>f,NL:()=>y,NV:()=>o,T2:()=>c,XU:()=>p,Zy:()=>d,lu:()=>u,nm:()=>b,rr:()=>g});var a=r(4298);let n=[],i=[],s=[],l=()=>{let e=[],t=new Date;for(let r=0;r<7;r++){let a=new Date(t);a.setDate(t.getDate()+r),e.push({date:a.toISOString().split("T")[0],meals:[]})}return e},d=async()=>{try{return[...n=await a.cQ.getAll()]}catch(e){return console.error("Failed to fetch ingredients:",e),[]}},o=async e=>{try{let t=await a.cQ.create(e);return n.push(t),t}catch(e){throw console.error("Failed to add ingredient:",e),e}},c=async(e,t)=>{try{let r=await a.cQ.update(e,t);return n=n.map(t=>t.id===e?r:t),i=i.map(r=>({...r,ingredients:r.ingredients.map(r=>r.ingredientId===e?{...r,name:t}:r)})),r}catch(e){throw console.error("Failed to update ingredient:",e),e}},u=async e=>{try{await a.cQ.delete(e),n=n.filter(t=>t.id!==e);let t=i.find(t=>t.ingredients.some(t=>t.ingredientId===e));return{success:!t,mealWithIngredient:t}}catch(e){throw console.error("Failed to delete ingredient:",e),e}},h=async()=>{try{return[...i=await a.gw.getAll()]}catch(e){return console.error("Failed to fetch meals:",e),[]}},m=async(e,t)=>{try{let r=await a.gw.create(e,t);return i.push(r),r}catch(e){throw console.error("Failed to add meal:",e),e}},p=async(e,t,r)=>{try{let n=await a.gw.update(e,t,r);return i=i.map(t=>t.id===e?n:t),n}catch(t){throw console.error(`Failed to update meal ${e}:`,t),t}},g=async e=>{try{return await a.gw.delete(e),i=i.filter(t=>t.id!==e),s=s.map(t=>({...t,meals:t.meals.filter(t=>t!==e)})),{success:!0}}catch(t){throw console.error(`Failed to delete meal ${e}:`,t),t}},y=async()=>{try{return[...s=await a.a7.getAll()]}catch(e){return console.error("Failed to fetch meal plan:",e),0===s.length&&(s=l()),[...s]}},x=async(e,t)=>{try{let r=await a.a7.updateDay(e,t);return s=s.map(t=>t.date===e?r:t),r}catch(r){return console.error(`Failed to update plan for ${e}:`,r),(s=s.map(r=>r.date===e?{...r,meals:t}:r)).find(t=>t.date===e)}},f=async()=>{try{return await a.a7.reset(),s=l()}catch(e){return console.error("Failed to reset meal plan:",e),s=l()}},b=async()=>{try{return await a.a7.getShoppingList()}catch(t){console.error("Failed to fetch shopping list:",t);let e=new Map;return s.forEach(t=>{t.meals.forEach(t=>{let r=i.find(e=>e.id===t);r&&r.ingredients.forEach(t=>{e.has(t.ingredientId)?e.get(t.ingredientId)?.quantity.push(t.quantity):e.set(t.ingredientId,{name:t.name,quantity:[t.quantity]})})})}),Array.from(e.entries()).map(([e,{name:t,quantity:r}])=>({ingredientId:e,name:t,quantity:r.join(", ")}))}}},1743:()=>{},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3409:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});var a=r(687),n=r(3210),i=r(1297);function s(){let[e,t]=(0,n.useState)([]),[r,s]=(0,n.useState)([]),[l,d]=(0,n.useState)(null),[o,c]=(0,n.useState)(!1),[u,h]=(0,n.useState)(!1),[m,p]=(0,n.useState)(""),[g,y]=(0,n.useState)([]),[x,f]=(0,n.useState)(""),[b,v]=(0,n.useState)(!1),w=()=>{p(""),y([]),d(null),c(!1),h(!1),f("")},j=e=>{d(e),p(e.title),y([...e.ingredients]),c(!0),h(!0)},P=(e,t,a)=>{let n=[...g];if("ingredientId"===t){let t=r.find(e=>e.id===a);n[e]={...n[e],ingredientId:a,name:t?.name||""}}else n[e]={...n[e],[t]:a};y(n)},N=e=>{let t=[...g];t.splice(e,1),y(t)},S=async()=>{if(!m.trim()){f("Meal title cannot be empty");return}if(0===g.length){f("Meal must have at least one ingredient");return}if(g.find(e=>!e.ingredientId||!e.quantity.trim())){f("All ingredients must have a selected ingredient and quantity");return}v(!0);try{o&&l?await (0,i.XU)(l.id,m.trim(),g.map(e=>({ingredientId:e.ingredientId,quantity:e.quantity.trim()}))):await (0,i.Hg)(m.trim(),g.map(e=>({ingredientId:e.ingredientId,quantity:e.quantity.trim()})));let e=await (0,i.DR)();t(e),w()}catch(e){console.error("Error saving meal:",e),f("Failed to save meal. Please try again.")}finally{v(!1)}},C=async e=>{if(confirm("Are you sure you want to delete this meal?")){v(!0);try{await (0,i.rr)(e);let r=await (0,i.DR)();t(r)}catch(e){console.error("Error deleting meal:",e),f("Failed to delete meal. Please try again.")}finally{v(!1)}}};return(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{children:"Meals"}),(0,a.jsx)("p",{className:"mb-4",children:"Create and manage your meals with ingredients."}),x&&(0,a.jsx)("div",{className:"card",style:{backgroundColor:"#ffebee",marginBottom:"1rem"},children:(0,a.jsx)("p",{style:{color:"var(--error-color)"},children:x})}),(0,a.jsxs)("div",{className:"card",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[(0,a.jsx)("h2",{children:"Meals List"}),(0,a.jsx)("button",{onClick:()=>{w(),h(!0)},disabled:b,children:"Add New Meal"})]}),u&&(0,a.jsxs)("div",{className:"card",style:{backgroundColor:"#f5f5f5"},children:[(0,a.jsx)("h3",{children:o?"Edit Meal":"Add New Meal"}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{htmlFor:"mealTitle",children:"Meal Title"}),(0,a.jsx)("input",{id:"mealTitle",type:"text",value:m,onChange:e=>p(e.target.value),placeholder:"Enter meal title",disabled:b})]}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center",children:[(0,a.jsx)("h4",{children:"Ingredients"}),(0,a.jsx)("button",{className:"secondary",onClick:()=>{y([...g,{ingredientId:"",name:"",quantity:""}])},disabled:b,children:"Add Ingredient"})]}),0===g.length?(0,a.jsx)("p",{children:"No ingredients added yet."}):(0,a.jsx)("ul",{style:{listStyle:"none",padding:0},children:g.map((e,t)=>(0,a.jsxs)("li",{className:"flex gap-2 mb-2",children:[(0,a.jsxs)("select",{value:e.ingredientId,onChange:e=>P(t,"ingredientId",e.target.value),style:{flex:2},disabled:b,children:[(0,a.jsx)("option",{value:"",children:"Select an ingredient"}),r.map(e=>(0,a.jsx)("option",{value:e.id,children:e.name},e.id))]}),(0,a.jsx)("input",{type:"text",value:e.quantity,onChange:e=>P(t,"quantity",e.target.value),placeholder:"Quantity (e.g., '2 cups')",style:{flex:1,marginBottom:0},disabled:b}),(0,a.jsx)("button",{style:{backgroundColor:"var(--error-color)"},onClick:()=>N(t),disabled:b,children:"X"})]},t))})]}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)("button",{onClick:S,disabled:b,children:b?"Saving...":o?"Update Meal":"Create Meal"}),(0,a.jsx)("button",{className:"secondary",onClick:w,disabled:b,children:"Cancel"})]})]}),b&&0===e.length?(0,a.jsx)("p",{children:"Loading meals..."}):0===e.length?(0,a.jsx)("p",{children:"No meals created yet."}):(0,a.jsx)("div",{className:"grid",children:e.map(e=>(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h3",{children:e.title}),(0,a.jsx)("h4",{children:"Ingredients:"}),(0,a.jsx)("ul",{style:{marginBottom:"1rem"},children:e.ingredients.map((e,t)=>(0,a.jsxs)("li",{children:[e.name,": ",e.quantity]},t))}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)("button",{className:"secondary",onClick:()=>j(e),disabled:b,children:"Edit"}),(0,a.jsx)("button",{style:{backgroundColor:"var(--error-color)"},onClick:()=>C(e.id),disabled:b,children:b?"Deleting...":"Delete"})]})]},e.id))})]})]})}},3519:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});let a=(0,r(2907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/martin.varnai/Projects/lunchplanner/lunchplanner-web/src/app/meals/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/martin.varnai/Projects/lunchplanner/lunchplanner-web/src/app/meals/page.tsx","default")},3812:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,6444,23)),Promise.resolve().then(r.t.bind(r,6042,23)),Promise.resolve().then(r.t.bind(r,8170,23)),Promise.resolve().then(r.t.bind(r,9477,23)),Promise.resolve().then(r.t.bind(r,9345,23)),Promise.resolve().then(r.t.bind(r,2089,23)),Promise.resolve().then(r.t.bind(r,6577,23)),Promise.resolve().then(r.t.bind(r,1307,23))},3873:e=>{"use strict";e.exports=require("path")},4298:(e,t,r)=>{"use strict";r.d(t,{R2:()=>l,a7:()=>c,cQ:()=>d,gw:()=>o});let a=()=>null,n=e=>{},i=()=>{},s=async(e,t={})=>{let r=a(),n={"Content-Type":"application/json",...r?{Authorization:`Bearer ${r}`}:{},...t.headers||{}},s=await fetch(`http://localhost:3000/api${e}`,{...t,headers:n});if(401===s.status)throw i(),Error("Unauthorized");let l=await s.json();if(!s.ok)throw Error(l.message||"API request failed");return l},l={register:async(e,t,r)=>{let a=await s("/auth/register",{method:"POST",body:JSON.stringify({name:e,email:t,password:r})});return a.token&&n(a.token),a},login:async(e,t)=>{let r=await s("/auth/login",{method:"POST",body:JSON.stringify({email:e,password:t})});return r.token&&n(r.token),r},logout:()=>{i()},getCurrentUser:async()=>await s("/auth/me"),changePassword:async(e,t)=>await s("/auth/change-password",{method:"POST",body:JSON.stringify({currentPassword:e,newPassword:t})})},d={getAll:async()=>await s("/ingredients"),getById:async e=>await s(`/ingredients/${e}`),create:async e=>await s("/ingredients",{method:"POST",body:JSON.stringify({name:e})}),update:async(e,t)=>await s(`/ingredients/${e}`,{method:"PUT",body:JSON.stringify({name:t})}),delete:async e=>await s(`/ingredients/${e}`,{method:"DELETE"})},o={getAll:async()=>await s("/meals"),getById:async e=>await s(`/meals/${e}`),create:async(e,t)=>await s("/meals",{method:"POST",body:JSON.stringify({title:e,ingredients:t})}),update:async(e,t,r)=>await s(`/meals/${e}`,{method:"PUT",body:JSON.stringify({title:t,ingredients:r})}),delete:async e=>await s(`/meals/${e}`,{method:"DELETE"})},c={getAll:async()=>await s("/plans"),updateDay:async(e,t)=>await s(`/plans/${e}`,{method:"PUT",body:JSON.stringify({mealIds:t})}),reset:async()=>await s("/plans",{method:"DELETE"}),getShoppingList:async()=>await s("/plans/shopping-list")}},4357:(e,t,r)=>{Promise.resolve().then(r.bind(r,3409))},4431:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i,metadata:()=>n});var a=r(7413);r(1135);let n={title:"Lunch Planner",description:"Plan your meals and generate shopping lists"};function i({children:e}){return(0,a.jsx)("html",{lang:"en",children:(0,a.jsxs)("body",{children:[(0,a.jsx)("main",{className:"min-h-screen",children:e}),(0,a.jsx)("footer",{className:"p-4",style:{backgroundColor:"white",borderTop:"1px solid var(--border-color)",textAlign:"center"},children:(0,a.jsx)("div",{className:"container",children:(0,a.jsxs)("p",{children:["\xa9 ",new Date().getFullYear()," Lunch Planner App"]})})})]})})}},4951:()=>{},6964:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,6346,23)),Promise.resolve().then(r.t.bind(r,7924,23)),Promise.resolve().then(r.t.bind(r,5656,23)),Promise.resolve().then(r.t.bind(r,99,23)),Promise.resolve().then(r.t.bind(r,8243,23)),Promise.resolve().then(r.t.bind(r,8827,23)),Promise.resolve().then(r.t.bind(r,2763,23)),Promise.resolve().then(r.t.bind(r,7173,23))},9061:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>s.a,__next_app__:()=>u,pages:()=>c,routeModule:()=>h,tree:()=>o});var a=r(5239),n=r(8088),i=r(8170),s=r.n(i),l=r(893),d={};for(let e in l)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>l[e]);r.d(t,d);let o={children:["",{children:["meals",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,3519)),"/Users/martin.varnai/Projects/lunchplanner/lunchplanner-web/src/app/meals/page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,440))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,4431)),"/Users/martin.varnai/Projects/lunchplanner/lunchplanner-web/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,7398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(r.t.bind(r,9999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(r.t.bind(r,5284,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,440))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]}.children,c=["/Users/martin.varnai/Projects/lunchplanner/lunchplanner-web/src/app/meals/page.tsx"],u={require:r,loadChunk:()=>Promise.resolve()},h=new a.AppPageRouteModule({definition:{kind:n.RouteKind.APP_PAGE,page:"/meals/page",pathname:"/meals",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:o}})},9121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},9551:e=>{"use strict";e.exports=require("url")}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[447,825,658],()=>r(9061));module.exports=a})();