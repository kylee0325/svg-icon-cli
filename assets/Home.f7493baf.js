import{u as y,w as T,N as g}from"./app.2a27ef71.js";import{_ as m,J as h,C as i,M as e,K as o,L as a,Q as _,N as r,P as l,S as x,F as L,Z as I,a2 as C,f as d,$ as k}from"./plugin-vue_export-helper.6976b42a.js";const N={key:0,class:"home-hero"},A={key:0,class:"figure"},B=["src","alt"],w={key:1,id:"main-title",class:"title"},S={key:2,class:"tagline"},V=h({__name:"HomeHero",setup(p){const{site:s,frontmatter:t}=y(),c=i(()=>{const{heroImage:n,heroText:u,tagline:$,actionLink:H,actionText:F}=t.value;return n||u||$||H&&F}),v=i(()=>t.value.heroText||s.value.title),f=i(()=>t.value.tagline||s.value.description);return(n,u)=>e(c)?(o(),a("header",N,[e(t).heroImage?(o(),a("figure",A,[_("img",{class:"image",src:e(T)(e(t).heroImage),alt:e(t).heroAlt},null,8,B)])):r("",!0),e(v)?(o(),a("h1",w,l(e(v)),1)):r("",!0),e(f)?(o(),a("p",S,l(e(f)),1)):r("",!0),e(t).actionLink&&e(t).actionText?(o(),x(g,{key:3,item:{link:e(t).actionLink,text:e(t).actionText},class:"action"},null,8,["item"])):r("",!0),e(t).altActionLink&&e(t).altActionText?(o(),x(g,{key:4,item:{link:e(t).altActionLink,text:e(t).altActionText},class:"action alt"},null,8,["item"])):r("",!0)])):r("",!0)}});var b=m(V,[["__scopeId","data-v-02e83a9a"]]);const D={key:0,class:"home-features"},E={class:"wrapper"},J={class:"container"},K={class:"features"},M={key:0,class:"title"},P={key:1,class:"details"},Q=h({__name:"HomeFeatures",setup(p){const{frontmatter:s}=y(),t=i(()=>s.value.features&&s.value.features.length>0),c=i(()=>s.value.features?s.value.features:[]);return(v,f)=>e(t)?(o(),a("div",D,[_("div",E,[_("div",J,[_("div",K,[(o(!0),a(L,null,I(e(c),(n,u)=>(o(),a("section",{key:u,class:"feature"},[n.title?(o(),a("h2",M,l(n.title),1)):r("",!0),n.details?(o(),a("p",P,l(n.details),1)):r("",!0)]))),128))])])])])):r("",!0)}});var Z=m(Q,[["__scopeId","data-v-0dc590c3"]]);const j={key:0,class:"footer"},q={class:"container"},z={class:"text"},G=h({__name:"HomeFooter",setup(p){const{frontmatter:s}=y();return(t,c)=>e(s).footer?(o(),a("footer",j,[_("div",q,[_("p",z,l(e(s).footer),1)])])):r("",!0)}});var O=m(G,[["__scopeId","data-v-8a26692a"]]);const R={class:"home","aria-labelledby":"main-title"},U={class:"home-content"},W=h({__name:"Home",setup(p){return(s,t)=>{const c=C("Content");return o(),a("main",R,[d(b),k(s.$slots,"hero",{},void 0,!0),d(Z),_("div",U,[d(c)]),k(s.$slots,"features",{},void 0,!0),d(O),k(s.$slots,"footer",{},void 0,!0)])}}});var ee=m(W,[["__scopeId","data-v-7fc3ccea"]]);export{ee as default};
