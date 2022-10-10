<template>
  <p>请点击F12看log</p>
  <a-form ref="formRef" :model="formState" :rules="rules" v-bind="layout">
    <a-form-item label="list" name="list">
      <a-textarea v-model:value="formState.list" auto-size />
    </a-form-item>
    <a-form-item label="options" name="options">
      <a-textarea v-model:value="formState.options" auto-size />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">确定</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { ref, reactive, toRaw } from 'vue'

const arrayToTree = (tree) => tree

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
    console.log('🚀 ~  initial list', arr)
    const finalTree = arrayToTree(arr)
    console.log('🚀 ~  initial finalTree', finalTree)

    let checkList = async (rule, value) => {
      if (!value) {
        return Promise.reject('不能为空')
      }

      let arr
      try {
        arr = JSON.parse(value)
      } catch (e) {}

      if (!arr || !Array.isArray(arr)) {
        return Promise.reject('该数组有误，请重新输入')
      }
      Promise.resolve()
    }

    const formRef = ref()

    const initialText = `[{"parent_id":null,"id":"1","name":"Label 1"},{"parent_id":"1","id":"2","name":"Label 2"},{"parent_id":"1","id":"3","name":"Label 3"},{"parent_id":"2","id":"4","name":"Label 4"},{"parent_id":"2","id":"5","name":"Label 5"}]`

    const formState = reactive({
      list: initialText,
      options: `{"parentKey":"parent_id","rootId":null,"idKey":"id"}`
    })

    const rules = {
      list: [{ required: true, whitespace: true, validator: checkList, trigger: 'blur' }]
    }

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          const formData = toRaw(formState)
          const arr = JSON.parse(formData.list)
          console.log('🚀 ~  list', arr)
          let opts
          if (formData.options) {
            try {
              opts = JSON.parse(formData.options)
            } catch (e) {}
          }
          const finalTree = arrayToTree(arr, opts)
          console.log('🚀 ~  finalTree', finalTree)
        })
        .catch((error) => {})
    }

    const resetForm = () => {
      formRef.value.resetFields()
    }

    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }

    return {
      formRef,
      layout,
      formState,
      rules,
      onSubmit,
      resetForm
    }
  }
}
</script>
