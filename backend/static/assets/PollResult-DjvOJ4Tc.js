import{r as l,j as e}from"./index-Bg-q7TUz.js";import{D as p}from"./Description_component-Dkt6ekwR.js";import{u as j,a as v}from"./App-Z55pZjoh.js";const y=()=>{const{slug:o}=j(),i=v(),[a,d]=l.useState(null),[c,m]=l.useState(!0),[n,x]=l.useState("");l.useEffect(()=>{u()},[o]);const u=async()=>{try{const t=await fetch(window.location.origin+`/api/polls/${o}/results/`);if(!t.ok)throw new Error("Результаты не найдены");const s=await t.json();d(s)}catch(t){x(t.message)}finally{m(!1)}},h=(t,s)=>s===0?0:(t/s*100).toFixed(1),b=t=>{const s=["from-blue-500 to-cyan-500","from-teal-500 to-green-500","from-purple-500 to-pink-500","from-yellow-500 to-orange-500","from-red-500 to-pink-500","from-indigo-500 to-blue-500"];return s[t%s.length]};return c?e.jsx("div",{className:"min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8 flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"}),e.jsx("p",{className:"text-blue-600",children:"Загрузка результатов..."})]})}):n?e.jsx("div",{className:"min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8",children:e.jsx("div",{className:"max-w-4xl mx-auto px-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl p-8 text-center",children:[e.jsx("svg",{className:"w-20 h-20 mx-auto text-red-400 mb-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("h2",{className:"text-2xl font-bold text-red-600 mb-2",children:"Ошибка"}),e.jsx("p",{className:"text-blue-600 mb-6",children:n}),e.jsx("button",{onClick:()=>i("/"),className:"bg-linear-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all",children:"На главную"})]})})}):e.jsxs("div",{className:"min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8",children:[e.jsxs("div",{className:"max-w-4xl mx-auto px-4",children:[e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[e.jsx("div",{className:"lg:col-span-2",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl p-6 border border-blue-100 animate-fadeIn",children:[e.jsx("div",{className:"flex justify-between items-center mb-6 pb-3 border-b border-blue-100",children:e.jsx("h2",{className:"text-2xl font-bold text-blue-700",children:"Результаты опроса"})}),e.jsx("div",{className:"mb-8",children:e.jsx("div",{className:"bg-linear-to-r from-blue-500 to-teal-500 text-white p-6 rounded-xl shadow-lg",children:e.jsx("h3",{className:"text-2xl font-semibold",children:a.question})})}),e.jsx("div",{className:"space-y-6",children:a.options.map((t,s)=>{const r=h(t.votes_count,a.total_votes),f=b(s);return e.jsxs("div",{className:"space-y-2 animate-slideIn",style:{animationDelay:`${s*100}ms`},children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"font-semibold text-blue-800",children:t.option_text}),e.jsxs("span",{className:"text-sm font-medium text-blue-600",children:[t.votes_count," ",t.votes_count===1?"голос":t.votes_count>1&&t.votes_count<5?"голоса":"голосов",a.total_votes>0&&` (${r}%)`]})]}),e.jsx("div",{className:"relative h-8 bg-gray-100 rounded-lg overflow-hidden",children:e.jsx("div",{className:`absolute top-0 left-0 h-full bg-linear-to-r ${f} transition-all duration-1000 ease-out`,style:{width:`${r}%`,animation:"growBar 1s ease-out"},children:e.jsx("div",{className:"absolute inset-0 flex items-center justify-end px-2 text-white text-sm font-semibold",children:r>10&&`${r}%`})})})]},t.order)})}),a.total_votes===0&&e.jsxs("div",{className:"mt-8 text-center py-8 text-blue-400 border-2 border-dashed border-blue-200 rounded-lg",children:[e.jsx("svg",{className:"w-16 h-16 mx-auto mb-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1",d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),e.jsx("p",{className:"text-lg",children:"Пока нет результатов. Будьте первым, кто проголосует!"})]})]})}),e.jsx("div",{className:"lg:col-span-1",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl p-6 border border-blue-100 animate-fadeIn",children:[e.jsx("h2",{className:"text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100",children:"Статистика"}),e.jsx("div",{className:"space-y-4",children:e.jsxs("div",{className:"bg-linear-to-r from-cyan-100 to-teal-100 p-6 rounded-lg text-center",children:[e.jsx("p",{className:"text-4xl font-bold text-blue-700 mb-2",children:a.total_votes}),e.jsx("p",{className:"text-sm text-blue-600",children:a.total_votes===1?"голос":a.total_votes>1&&a.total_votes<5?"голоса":"голосов"})]})})]})})]}),e.jsxs(p,{children:[e.jsx("p",{className:"font-bold mt-6 text-center",children:"Результаты опроса | Статистика голосования в реальном времени"}),e.jsxs("p",{className:"mt-6",children:[e.jsx("strong",{children:"Аналитика результатов"})," показывает распределение голосов в наглядном виде. Следите за тем, как участники отвечают на вопросы, и анализируйте предпочтения аудитории."]})]})]}),e.jsx("style",{jsx:!0,children:`
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

        @keyframes growBar {
          from {
            width: 0;
          }
          to {
            width: var(--width);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }
      `})]})};export{y as default};
