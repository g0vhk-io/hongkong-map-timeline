<template>
  <li class="node-tree">
    <span class="label">{{ node.place.name.zh_hk }}</span>

    <ul v-if="node.children && node.children.length">
      <node v-for="child in node.children" :node="child" :key="child.place.id"></node>
    </ul>
  </li>
</template>

<script>
export default {
  name: "node",
  props: {
    node: Object
  }
};
</script>