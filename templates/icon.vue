<template>
  <component :is="name" v-bind="$attrs" v-on="$listeners" />
</template>
<script>
import * as icons from "@gdesign/icons";

export default {
  name: "icon",
  components: {
    ...icons,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
};
</script>
