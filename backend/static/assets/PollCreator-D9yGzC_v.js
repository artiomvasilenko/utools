import{r as n,j as e}from"./index-DS7rAa-O.js";import{D as w}from"./Description_component-BOrPI6rN.js";const C=()=>{const[o,x]=n.useState(""),[l,i]=n.useState([""]),[r,h]=n.useState(!1),[u,b]=n.useState(!1),[p,c]=n.useState(""),[d,f]=n.useState(null),j=(s,t)=>{const a=[...l];a[s]=t,i(a),s===l.length-1&&t.trim()!==""&&l.length<10&&i([...a,""])},g=s=>{if(l.length>1){const t=l.filter((a,m)=>m!==s);i(t)}},N=(s,t)=>{s.key==="Enter"&&!s.shiftKey&&(s.preventDefault(),l[t].trim()!==""&&l.length<10&&i([...l,""]))},v=async s=>{if(s.preventDefault(),c(""),!o.trim()){c("Введите вопрос");return}const t=l.filter(a=>a.trim()!=="");if(t.length<2){c("Добавьте минимум 2 варианта ответа");return}b(!0);try{const a=await fetch(window.location.origin+"/api/polls/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:o.trim(),allow_multiple:r,options:t})});if(!a.ok)throw new Error("Ошибка при создании опроса");const m=await a.json();f(m),x(""),i([""]),h(!1)}catch(a){c(a.message)}finally{b(!1)}};return e.jsxs("div",{className:"min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8",children:[e.jsxs("div",{className:"max-w-4xl mx-auto px-4",children:[e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[e.jsx("div",{className:"lg:col-span-1",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl p-6 border border-blue-100 animate-fadeIn",children:[e.jsx("h2",{className:"text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100",children:"Создание опроса"}),d?e.jsxs("div",{className:"text-center py-6 animate-slideUp",children:[e.jsx("div",{className:"mb-4 text-green-500",children:e.jsx("svg",{className:"w-16 h-16 mx-auto",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})})}),e.jsx("h3",{className:"text-xl font-bold text-blue-800 mb-2",children:"Опрос создан!"}),e.jsx("p",{className:"text-blue-600 mb-4",children:"Ссылка для голосования:"}),e.jsx("div",{className:"bg-blue-50 p-3 rounded-lg mb-4",children:e.jsxs("a",{href:`/poll/${d.slug}`,className:"text-teal-600 font-mono break-all hover:underline",children:[window.location.origin,"/poll/",d.slug]})}),e.jsx("button",{onClick:()=>f(null),className:"bg-linear-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg",children:"Создать новый опрос"})]}):e.jsxs("form",{onSubmit:v,children:[e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block text-teal-700 font-semibold mb-2",children:"Вопрос"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",value:o,onChange:s=>x(s.target.value),placeholder:"Введите ваш вопрос...",className:"w-full p-3 pl-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"}),e.jsx("div",{className:"absolute left-3 top-4 text-teal-600",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})})})]})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block text-teal-700 font-semibold mb-2",children:"Варианты ответа (макс. 10)"}),e.jsx("div",{className:"space-y-3",children:l.map((s,t)=>e.jsxs("div",{className:"relative animate-slideIn",style:{animationDelay:`${t*50}ms`},children:[e.jsx("input",{type:"text",value:s,onChange:a=>j(t,a.target.value),onKeyDown:a=>N(a,t),placeholder:`Вариант ${t+1}`,className:"w-full p-3 pl-10 pr-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"}),e.jsx("div",{className:"absolute left-3 top-4 text-teal-600",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M9 5l7 7-7 7"})})}),l.length>1&&s===""&&t!==l.length-1&&e.jsx("button",{type:"button",onClick:()=>g(t),className:"absolute right-3 top-3 text-red-400 hover:text-red-600 transition-colors",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})})})]},t))}),e.jsxs("div",{className:"mt-2 text-sm text-blue-500",children:[e.jsx("span",{className:"font-medium",children:"Добавлено:"})," ",l.filter(s=>s.trim()!=="").length," из 10 вариантов"]})]}),e.jsxs("div",{className:"mb-8",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-teal-700 font-semibold",children:"Выбор нескольких вариантов"}),e.jsx("button",{type:"button",onClick:()=>h(!r),className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${r?"bg-teal-500":"bg-gray-300"}`,children:e.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${r?"translate-x-6":"translate-x-1"}`})})]}),e.jsx("p",{className:"mt-1 text-sm text-blue-500",children:r?"Участники смогут выбрать несколько вариантов":"Участники смогут выбрать только один вариант"})]}),e.jsx("button",{type:"submit",disabled:u,className:"w-full bg-linear-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",children:u?e.jsxs(e.Fragment,{children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Создание..."]}):"Создать опрос"}),p&&e.jsx("div",{className:"mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 animate-shake",children:p})]}),e.jsxs("div",{className:"mt-6 bg-linear-to-r from-cyan-100 to-teal-100 p-4 rounded-lg border border-blue-200",children:[e.jsx("h3",{className:"font-bold text-blue-800 mb-2",children:"ℹ️ Информация"}),e.jsx("p",{className:"text-sm text-blue-700",children:"Создавайте опросы с возможностью выбора одного или нескольких вариантов. Максимальное количество вариантов - 10. После создания вы получите уникальную ссылку для голосования."})]})]})}),e.jsx("div",{className:"lg:col-span-1",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl p-6 border border-blue-100 h-full animate-fadeIn",children:[e.jsx("h2",{className:"text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100",children:"Превью опроса"}),o||l.some(s=>s.trim()!=="")?e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"bg-linear-to-r from-blue-50 to-teal-50 p-4 rounded-lg",children:e.jsx("h3",{className:"text-xl font-semibold text-blue-800",children:o||"Ваш вопрос появится здесь"})}),e.jsx("div",{className:"space-y-3",children:l.filter(s=>s.trim()!=="").map((s,t)=>e.jsxs("div",{className:"flex items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-100 hover:border-teal-200 transition-all animate-slideIn",style:{animationDelay:`${t*50}ms`},children:[r?e.jsx("div",{className:"w-5 h-5 border-2 border-teal-400 rounded mr-3 flex-shrink-0"}):e.jsx("div",{className:"w-5 h-5 border-2 border-teal-400 rounded-full mr-3 flex-shrink-0"}),e.jsx("span",{className:"text-blue-700",children:s})]},t))}),r&&e.jsx("div",{className:"text-sm text-teal-600 bg-teal-50 p-2 rounded-lg",children:"✓ Можно выбрать несколько вариантов"})]}):e.jsxs("div",{className:"text-center py-12 text-blue-400",children:[e.jsx("svg",{className:"w-24 h-24 mx-auto mb-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1",d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),e.jsx("p",{className:"text-lg",children:"Заполните форму слева, чтобы увидеть превью"})]})]})})]}),e.jsxs(w,{children:[e.jsx("p",{className:"font-bold mt-6 text-center",children:"Создание опросов онлайн | Бесплатный инструмент для голосования"}),e.jsxs("p",{className:"mt-6",children:[e.jsx("strong",{children:"Конструктор опросов"})," — это мощный онлайн-инструмент, позволяющий мгновенно создавать интерактивные опросы для различных целей. Наш сервис предлагает"," ",e.jsx("strong",{children:"быстрое создание опросов онлайн"}),"с возможностью настройки всех параметров."]}),e.jsx("p",{className:"mt-6 font-bold",children:"Основные возможности конструктора:"}),e.jsxs("ul",{className:"grid grid-cols-1 md:grid-cols-2 gap-2 mt-3",children:[e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"mr-2 text-teal-500",children:"✓"}),e.jsx("span",{children:"Создание опросов с любыми вопросами"})]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"mr-2 text-teal-500",children:"✓"}),e.jsx("span",{children:"Добавление до 10 вариантов ответа"})]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"mr-2 text-teal-500",children:"✓"}),e.jsx("span",{children:"Выбор одного или нескольких вариантов"})]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"mr-2 text-teal-500",children:"✓"}),e.jsx("span",{children:"Автоматическое добавление новых полей"})]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"mr-2 text-teal-500",children:"✓"}),e.jsx("span",{children:"Мгновенное превью опроса"})]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"mr-2 text-teal-500",children:"✓"}),e.jsx("span",{children:"Уникальная ссылка для каждого опроса"})]})]})]})]}),e.jsx("style",{jsx:!0,children:`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `})]})};export{C as default};
