import{r,j as e}from"./index-Bg-q7TUz.js";import{D as v}from"./Description_component-Dkt6ekwR.js";import{f as k}from"./csrf-DsH81rGv.js";import{u as _,a as S}from"./App-Z55pZjoh.js";const O=()=>{const{slug:d}=_(),x=S(),[s,p]=r.useState(null),[a,m]=r.useState([]),[f,j]=r.useState(!0),[u,h]=r.useState(!1),[c,o]=r.useState("");r.useEffect(()=>{g()},[d]);const g=async()=>{try{const t=await fetch(window.location.origin+`/api/polls/${d}/`);if(!t.ok)throw new Error("Опрос не найден");const l=await t.json();p(l),m(l.allow_multiple?[]:null)}catch(t){o(t.message)}finally{j(!1)}},w=t=>{s.allow_multiple?m(l=>l.includes(t)?l.filter(n=>n!==t):[...l,t]):m(t)},N=async t=>{if(t.preventDefault(),s.allow_multiple&&a.length===0){o("Выберите хотя бы один вариант");return}if(!s.allow_multiple&&a===null){o("Выберите вариант ответа");return}h(!0),o("");try{const l=s.allow_multiple?a:[a],n=await k(window.location.origin+"/api/polls/vote/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({option_ids:l})});if(!n.ok){let b="Ошибка при отправке голоса";try{const i=await n.json();i&&i.error&&(b=i.error)}catch(i){console.error("Не удалось обработать ошибку сервера:",i)}throw new Error(b)}const C=await n.json();x(window.location.origin+`/poll/${d}/results`)}catch(l){o(l.message)}finally{h(!1)}},y=t=>new Date(t).toLocaleString("ru-RU",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});return f?e.jsx("div",{className:"min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8 flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"}),e.jsx("p",{className:"text-blue-600",children:"Загрузка опроса..."})]})}):c?e.jsx("div",{className:"min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8",children:e.jsx("div",{className:"max-w-4xl mx-auto px-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl p-8 text-center",children:[e.jsx("svg",{className:"w-20 h-20 mx-auto text-red-400 mb-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("h2",{className:"text-2xl font-bold text-red-600 mb-2",children:"Ошибка"}),e.jsx("p",{className:"text-blue-600 mb-6",children:c}),e.jsx("button",{onClick:()=>x(window.location.origin+`/poll/${d}/results`),className:"bg-linear-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all",children:"К результатам"})]})})}):e.jsxs("div",{className:"min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8",children:[e.jsxs("div",{className:"max-w-4xl mx-auto px-4",children:[e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[e.jsx("div",{className:"lg:col-span-2",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl p-6 border border-blue-100 animate-fadeIn",children:[e.jsx("div",{className:"mb-6 pb-3 border-b border-blue-100",children:e.jsx("h2",{className:"text-2xl font-bold text-blue-700",children:"Голосование"})}),e.jsxs("form",{onSubmit:N,children:[e.jsx("div",{className:"mb-8",children:e.jsx("div",{className:"bg-linear-to-r from-blue-500 to-teal-500 text-white p-6 rounded-xl shadow-lg",children:e.jsx("h3",{className:"text-2xl font-semibold",children:s.question})})}),e.jsx("div",{className:"space-y-4 mb-8",children:s.options.map((t,l)=>e.jsxs("label",{className:`flex items-center p-4 bg-linear-to-r from-blue-50 to-teal-50 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md animate-slideIn ${(s.allow_multiple?a.includes(t.id):a===t.id)?"border-teal-500 bg-teal-50":"border-blue-100 hover:border-teal-200"}`,style:{animationDelay:`${l*50}ms`},children:[e.jsx("input",{type:s.allow_multiple?"checkbox":"radio",name:"poll-option",checked:s.allow_multiple?a.includes(t.id):a===t.id,onChange:()=>w(t.id),className:"w-5 h-5 text-teal-500 focus:ring-teal-400 cursor-pointer"}),e.jsx("span",{className:"ml-4 text-lg text-blue-800",children:t.option_text})]},t.id))}),e.jsx("button",{type:"submit",disabled:u||(s.allow_multiple?a.length===0:!a),className:"w-full bg-linear-to-r from-blue-500 to-teal-500 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold",children:u?e.jsxs(e.Fragment,{children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-6 w-6 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Отправка..."]}):"Голосовать"}),c&&e.jsx("div",{className:"mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 animate-shake",children:c})]})]})}),e.jsx("div",{className:"lg:col-span-1",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl p-6 border border-blue-100 animate-fadeIn",children:[e.jsx("h2",{className:"text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100",children:"Информация"}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"bg-linear-to-r from-cyan-100 to-teal-100 p-4 rounded-lg",children:e.jsxs("p",{className:"text-sm text-blue-700",children:[e.jsx("span",{className:"font-bold",children:"Дата создания:"}),e.jsx("br",{}),y(s.created_at)]})}),e.jsx("div",{className:"bg-blue-50 p-4 rounded-lg border border-blue-100",children:e.jsxs("p",{className:"text-sm text-blue-700",children:[e.jsx("span",{className:"font-bold",children:"Тип голосования:"}),e.jsx("br",{}),s.allow_multiple?"✓ Можно выбрать несколько вариантов":"✓ Можно выбрать только один вариант"]})}),e.jsx("div",{className:"bg-blue-50 p-4 rounded-lg border border-blue-100",children:e.jsxs("p",{className:"text-sm text-blue-700",children:[e.jsx("span",{className:"font-bold",children:"Всего вариантов:"}),e.jsx("br",{}),s.options.length]})})]}),e.jsxs("div",{className:"mt-6 bg-linear-to-r from-cyan-100 to-teal-100 p-4 rounded-lg border border-blue-200",children:[e.jsx("h3",{className:"font-bold text-blue-800 mb-2",children:"ℹ️ Как голосовать"}),e.jsx("p",{className:"text-sm text-blue-700",children:s.allow_multiple?'Отметьте все подходящие варианты и нажмите "Голосовать"':'Выберите один вариант и нажмите "Голосовать"'})]})]})})]}),e.jsxs(v,{children:[e.jsx("p",{className:"font-bold mt-6 text-center",children:"Голосование в опросе | Примите участие в онлайн-опросе"}),e.jsxs("p",{className:"mt-6",children:[e.jsx("strong",{children:"Система голосования"}),' позволяет легко и удобно участвовать в опросах. Просто выберите подходящий вариант ответа и нажмите кнопку "Голосовать".']})]})]}),e.jsx("style",{jsx:!0,children:`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `})]})};export{O as default};
