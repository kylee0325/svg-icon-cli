export default {
  title: 'svg-icon-cli',
  base: '/svg-icon-cli/',
  lang: 'ZH-CN',
  description:
    'A command-line interface for managing svg icons. It can do many things, such as convert icons from figma/iconfont to svg files/components, generate iconfont file from figma icons, etc.',
  header: [],
  themeConfig: {
    repo: 'kylee0325/svg-icon-cli',
    docsRepo: 'kylee0325/svg-icon-cli',
    docsBranch: 'master',
    docsDir: 'docs',
    editLinks: true,
    nav: [
      {
        text: 'ChangeLog',
        link: 'https://github.com/kylee0325/svg-icon-cli/blob/master/CHANGELOG.md'
      }
    ],
    sidebar: {
      '/': [
        { text: '概述', link: '/' },
        {
          text: 'Tree结构相关',
          children: [{ text: 'arrayToTree', link: '/tree/array-to-tree' }]
        }
      ]
    }
  }
}
