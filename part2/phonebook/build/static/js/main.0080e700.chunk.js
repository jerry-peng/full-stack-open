(window["webpackJsonpphonebook-ui"]=window["webpackJsonpphonebook-ui"]||[]).push([[0],{14:function(e,n,t){e.exports=t(37)},19:function(e,n,t){},37:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),u=t(13),c=t.n(u),o=(t(19),t(2)),i=function(e){var n=e.newFilter,t=e.setNewFilter;return r.a.createElement("div",null,r.a.createElement("p",null,"filter shown with"),r.a.createElement("input",{value:n,onChange:function(e){t(e.target.value)}}))},l=t(3),s=t.n(l),m="/api/persons",f=function(){return s.a.get(m).then((function(e){return e.data}))},d=function(e){return s.a.post(m,e).then((function(e){return e.data}))},b=function(e,n){return s.a.put("".concat(m,"/").concat(e),n).then((function(e){return e.data}))},v=function(e){return s.a.delete("".concat(m,"/").concat(e))},E=function(e){var n=e.persons,t=e.newName,a=e.newNumber,u=e.setPersons,c=e.setNewName,o=e.setNewNumber,i=e.setConfirmMessage,l=e.setErrorMessage,s=function(e,n){e(n),setTimeout((function(){e(null)}),5e3)},m=function(){var e=!0,n="";return""===t&&(n+="Name field cannot be empty.\n",e=!1),""===a&&(n+="Number field cannot be empty.\n",e=!1),!!e||(alert(n),!1)};return r.a.createElement("form",{onSubmit:function(e){e.preventDefault();var r={name:t,number:a};if(m()){var f="".concat(t," is already added to phonebook, replace the old number with a new one?");if(n.map((function(e){return e.name})).includes(t)&&window.confirm(f))b(n.find((function(e){return e.name===t})).id,r).then((function(e){u(n.map((function(n){return n.id===e.id?e:n})));var t="Updated ".concat(r.name,"'s number to ").concat(r.number);s(i,t)})).catch((function(e){var a="Information of ".concat(r.name," has already been removed from server, creating new information instead");l(a),setTimeout((function(){l(null)}),5e3),d(r).then((function(e){u(n.filter((function(e){return e.name!==t})).concat(e))}))})).finally((function(){c(""),o("")}));else{d(r).then((function(e){return u(n.concat(e))})),c(""),o("");var v="Added ".concat(r.name);s(i,v)}}}},r.a.createElement("div",null,"name: ",r.a.createElement("input",{value:t,onChange:function(e){c(e.target.value)}})),r.a.createElement("div",null,"number: ",r.a.createElement("input",{value:a,onChange:function(e){o(e.target.value)}})),r.a.createElement("div",null,r.a.createElement("button",{type:"submit"},"add")))},p=function(e){var n=e.persons,t=e.newFilter,a=e.setPersons,u=e.setErrorMessage;return r.a.createElement("div",null,n.filter((function(e){return e.name.toLowerCase().includes(t.toLowerCase())})).map((function(e){return r.a.createElement("p",{key:e.name},e.name," ",e.number,r.a.createElement("span",null,r.a.createElement("button",{onClick:(t=e.id,function(){var e=n.find((function(e){return e.id===t})).name;window.confirm("Delete ".concat(e))&&v(t).then((function(){a(n.filter((function(e){return e.id!==t})))})).catch((function(r){var c="Information of ".concat(e," has already been removed from server");u(c),setTimeout((function(){u(null)}),5e3),a(n.filter((function(e){return e.id!==t})))}))})},"delete")));var t})))},w=function(e){var n=e.className,t=e.message;return null===t?null:r.a.createElement("div",{className:n},t)},h=function(e){var n=e.message;return r.a.createElement(w,{className:"confirm",message:n})},g=function(e){var n=e.message;return r.a.createElement(w,{className:"error",message:n})},N=function(){var e=Object(a.useState)([]),n=Object(o.a)(e,2),t=n[0],u=n[1],c=Object(a.useState)(""),l=Object(o.a)(c,2),s=l[0],m=l[1],d=Object(a.useState)(""),b=Object(o.a)(d,2),v=b[0],w=b[1],N=Object(a.useState)(""),j=Object(o.a)(N,2),O=j[0],y=j[1],k=Object(a.useState)(null),C=Object(o.a)(k,2),S=C[0],F=C[1],M=Object(a.useState)(null),P=Object(o.a)(M,2),I=P[0],T=P[1];return Object(a.useEffect)((function(){f().then((function(e){return u(e)}))}),[]),r.a.createElement("div",null,r.a.createElement("h2",null,"Phonebook"),r.a.createElement(h,{message:S}),r.a.createElement(g,{message:I}),r.a.createElement(i,{setNewFilter:y,newFilter:O}),r.a.createElement("h2",null,"Add new numbers"),r.a.createElement(E,{persons:t,newName:s,newNumber:v,setPersons:u,setNewName:m,setNewNumber:w,setConfirmMessage:F,setErrorMessage:T}),r.a.createElement("h2",null,"Numbers"),r.a.createElement(p,{persons:t,newFilter:O,setPersons:u,setErrorMessage:T}))};c.a.render(r.a.createElement(N,null),document.getElementById("root"))}},[[14,1,2]]]);
//# sourceMappingURL=main.0080e700.chunk.js.map