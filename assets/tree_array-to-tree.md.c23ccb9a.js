import{_ as s,L as t,f as p,al as n,K as e,a2 as o}from"./plugin-vue_export-helper.6976b42a.js";const T='{"title":"arrayToTree","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F7F\u7528","slug":"\u4F7F\u7528"},{"level":2,"title":"\u53C2\u6570","slug":"\u53C2\u6570"},{"level":3,"title":"FormatOptions","slug":"formatoptions"},{"level":2,"title":"\u793A\u4F8B","slug":"\u793A\u4F8B"},{"level":2,"title":"\u4EE3\u7801","slug":"\u4EE3\u7801"}],"relativePath":"tree/array-to-tree.md","lastUpdated":1665385937795}',r={},c=n(`<h1 id="arraytotree" tabindex="-1">arrayToTree <a class="header-anchor" href="#arraytotree" aria-hidden="true">#</a></h1><p>\u6241\u5E73\u6570\u7EC4\u8F6C\u6811\u5F62\u7ED3\u6784\u6570\u7EC4\u7684\u51FD\u6570\uFF0C\u53EF\u81EA\u5B9A\u4E49\u7236\u7EA7\u7684\u5B57\u6BB5\u3001id \u7684\u5B57\u6BB5\u3002\u8BE5\u51FD\u6570\u6240\u7528\u7B97\u6CD5\u7684\u590D\u6742\u5EA6\u4E3A O(n)\u3002</p><h2 id="\u4F7F\u7528" tabindex="-1">\u4F7F\u7528 <a class="header-anchor" href="#\u4F7F\u7528" aria-hidden="true">#</a></h2><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> arrayToTree <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;js-treasure&#39;</span>

<span class="token function">arrayToTree</span><span class="token punctuation">(</span>list<span class="token punctuation">,</span> options<span class="token punctuation">)</span>
</code></pre></div><h2 id="\u53C2\u6570" tabindex="-1">\u53C2\u6570 <a class="header-anchor" href="#\u53C2\u6570" aria-hidden="true">#</a></h2><table><thead><tr><th>\u53C2\u6570\u540D</th><th>\u63CF\u8FF0</th><th>\u7C7B\u578B</th><th>\u9ED8\u8BA4\u503C</th></tr></thead><tbody><tr><td>list</td><td>\u6570\u7EC4</td><td>T[]</td><td>[]</td></tr><tr><td>options</td><td>\u914D\u7F6E</td><td>FormatOptions</td><td><code>{ parentKey: &#39;parent_id&#39;, rootId: null, idKey: &#39;id&#39; }</code></td></tr></tbody></table><h3 id="formatoptions" tabindex="-1">FormatOptions <a class="header-anchor" href="#formatoptions" aria-hidden="true">#</a></h3><table><thead><tr><th>\u53C2\u6570\u540D</th><th>\u63CF\u8FF0</th><th>\u7C7B\u578B</th><th>\u9ED8\u8BA4\u503C</th></tr></thead><tbody><tr><td>rootId</td><td>\u6839\u8282\u70B9 ID</td><td>string | number | null</td><td>null</td></tr><tr><td>parentKey</td><td>\u7236\u8282\u70B9 key</td><td>string</td><td><code>parent_id</code></td></tr><tr><td>idKey</td><td>id \u5BF9\u5E94\u7684 key</td><td>string</td><td><code>id</code></td></tr></tbody></table><h2 id="\u793A\u4F8B" tabindex="-1">\u793A\u4F8B <a class="header-anchor" href="#\u793A\u4F8B" aria-hidden="true">#</a></h2>`,9),l=n(`<h2 id="\u4EE3\u7801" tabindex="-1">\u4EE3\u7801 <a class="header-anchor" href="#\u4EE3\u7801" aria-hidden="true">#</a></h2><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> arrayToTree <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;js-treasure&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">parent_id</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
        <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token number">10</span><span class="token punctuation">,</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;10&#39;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">parent_id</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
        <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;1&#39;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">parent_id</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
        <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;2&#39;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">parent_id</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
        <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;3&#39;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">parent_id</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
        <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;4&#39;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">parent_id</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>
        <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;5&#39;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
    <span class="token keyword">const</span> finalTree <span class="token operator">=</span> <span class="token function">arrayToTree</span><span class="token punctuation">(</span>arr<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">childrenKey</span><span class="token operator">:</span> <span class="token string">&#39;child&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre></div>`,2);function i(u,k,d,y,h,_){const a=o("ArrayToTree",!0);return e(),t("div",null,[c,p(a),l])}var g=s(r,[["render",i]]);export{T as __pageData,g as default};
