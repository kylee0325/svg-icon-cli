import { describe, it, expect } from 'vitest';
import { path } from 'zx';
import { getPath, toPascalCase, getSvgContent } from '../../src/utils/index';

describe('utils/getPath', () => {
  const relativePath = 'src/test';
  const absolutePath = '/src/test';

  it('给定相对路径，函数执行正确', () => {
    const result = getPath(relativePath);

    expect(result).toEqual(relativePath);
  });

  it('给定绝对路径，函数执行正确', () => {
    const result = getPath(absolutePath);

    expect(result).not.toEqual(absolutePath);
    expect(result).toContain(absolutePath);
  });

  it('给定同目录的相对路径与绝对路径，两者匹配正确', () => {
    const result1 = getPath(relativePath);
    const result2 = getPath(absolutePath);

    expect(path.join(process.cwd(), result1)).toEqual(result2);
  });
});

describe('utils/toPascalCase', () => {
  it('给定多个值，函数执行正确', () => {
    const obj = {
      IconAdd: 'icon-add',
      IconAddSmall: 'icon-add-small',
      IconAddStatic: 'icon-add-static',
    };
    Object.entries(obj).forEach(([key, value]) => {
      expect(toPascalCase(value)).toEqual(key);
    });
  });
});

describe('utils/getSvgContent', () => {
  it('给定内容，函数执行正确', () => {
    const content = `!function(t){var e,o,i,l,n,a='<svg><symbol id="add" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.25 12.75V21H12.75V12.75H21V11.25H12.75V3H11.25V11.25H3V12.75H11.25Z" fill="currentColor"/></symbol><symbol id="zoom-out" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 12.75V11.25H16.5V12.75H7.5Z" fill="currentColor"/><path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12Z" fill="currentColor"/></symbol></svg>',c=(c=document.getElementsByTagName("script"))[c.length-1].getAttribute("data-injectcss"),d=function(t,e){e.parentNode.insertBefore(t,e)};if(!t.__gdicon__svg__cssinject__){t.__gdicon__svg__cssinject__=!0;try{var style = document.createElement("style");const ct=".gdicon{display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}";try{style.appendChild(document.createTextNode(ct));} catch (ex) {style.styleSheet.cssText = ct;}var head = document.getElementsByTagName("head")[0];head.appendChild(style);}catch(t){console&&console.log(t)}}function s(){n||(n=!0,i())}function h(){try{l.documentElement.doScroll("left")}catch(t){return void setTimeout(h,50)}s()}e=function(){var t,e=document.createElement("div");e.innerHTML=a,a=null,(e=e.getElementsByTagName("svg")[0])&&(e.setAttribute("aria-hidden","true"),e.style.position="absolute",e.style.width=0,e.style.height=0,e.style.overflow="hidden",e=e,(t=document.body).firstChild?d(e,t.firstChild):t.appendChild(e))},document.addEventListener?~["complete","loaded","interactive"].indexOf(document.readyState)?setTimeout(e,0):(o=function(){document.removeEventListener("DOMContentLoaded",o,!1),e()},document.addEventListener("DOMContentLoaded",o,!1)):document.attachEvent&&(i=e,l=t.document,n=!1,h(),l.onreadystatechange=function(){"complete"==l.readyState&&(l.onreadystatechange=null,s())})}(window);`;

    const res = `<svg><symbol id="add" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.25 12.75V21H12.75V12.75H21V11.25H12.75V3H11.25V11.25H3V12.75H11.25Z" fill="currentColor"/></symbol><symbol id="zoom-out" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 12.75V11.25H16.5V12.75H7.5Z" fill="currentColor"/><path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12Z" fill="currentColor"/></symbol></svg>`;

    expect(getSvgContent(content)).toEqual(res);
  });
});
