# arrayToTree

扁平数组转树形结构数组的函数，可自定义父级的字段、id 的字段。该函数所用算法的复杂度为 O(n)。

## 使用

```js
import { arrayToTree } from 'js-treasure'

arrayToTree(list, options)
```

## 参数

| 参数名  | 描述 | 类型          | 默认值                                                  |
| ------- | ---- | ------------- | ------------------------------------------------------- |
| list    | 数组 | T[]           | []                                                      |
| options | 配置 | FormatOptions | `{ parentKey: 'parent_id', rootId: null, idKey: 'id' }` |

### FormatOptions

| 参数名    | 描述          | 类型                             | 默认值      |
| --------- | ------------- | -------------------------------- | ----------- |
| rootId    | 根节点 ID     | string &#124; number &#124; null | null        |
| parentKey | 父节点 key    | string                           | `parent_id` |
| idKey     | id 对应的 key | string                           | `id`        |

## 示例

<ArrayToTree />

## 代码

```vue
<script>
import { arrayToTree } from 'js-treasure'

export default {
  setup() {
    const arr = [
      {
        parent_id: 2,
        id: 10,
        name: '10'
      },
      {
        parent_id: null,
        id: 1,
        name: '1'
      },
      {
        parent_id: 1,
        id: 2,
        name: '2'
      },
      {
        parent_id: 1,
        id: 3,
        name: '3'
      },
      {
        parent_id: 2,
        id: 4,
        name: '4'
      },
      {
        parent_id: 4,
        id: 5,
        name: '5'
      }
    ]
    const finalTree = arrayToTree(arr, null, { childrenKey: 'child' })
  }
}
</script>
```
