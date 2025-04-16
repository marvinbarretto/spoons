<template>
  <form @submit.prevent="handleSubmit">
    <label>Name: <input v-model="form.name" /></label>

    <label>
      Postcode:
      <input v-model="postcode" />
      <button type="button" @click="autofillFromPostcode">Lookup</button>
    </label>

    <label>City: <input v-model="form.location.city" /></label>
    <label>Country: <input v-model="form.location.country" /></label>

    <label
      >Latitude:
      <input type="number" step="0.000001" v-model.number="form.location.lat" />
    </label>

    <label
      >Longitude:
      <input type="number" step="0.000001" v-model.number="form.location.lng" />
    </label>

    <button type="submit">{{ isEditing ? 'Update' : 'Create' }} Pub</button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, toRef, computed } from 'vue'
import type { Pub } from '@/types/Pub'
import { usePostcodeLookup } from '@/composables/usePostcodeLookup'

const props = defineProps<{
  initialPub?: Pub | null
  onSubmit: (data: Omit<Pub, 'id'>) => Promise<void>
}>()

const postcode = ref('')
const { lookupPostcode } = usePostcodeLookup()

const form = ref<Omit<Pub, 'id'>>({
  name: '',
  location: {
    city: '',
    country: '',
    lat: 0,
    lng: 0,
  },
})

const isEditing = computed(() => !!props.initialPub)

watch(
  () => props.initialPub,
  (pub) => {
    if (pub) {
      form.value = {
        name: pub.name,
        location: pub.location,
      }
    }
  },
  { immediate: true },
)

async function autofillFromPostcode() {
  const result = await lookupPostcode(postcode.value)
  if (result) {
    form.value.location.city = result.city
    form.value.location.country = result.country
    form.value.location.lat = result.lat
    form.value.location.lng = result.lng
  }
}

async function handleSubmit() {
  await props.onSubmit(form.value)
}
</script>
