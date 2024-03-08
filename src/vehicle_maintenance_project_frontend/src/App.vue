<script setup>
import { ref } from 'vue';
import { vehicle_maintenance_project_backend } from 'declarations/vehicle_maintenance_project_backend/index';
let greeting = ref('');

async function handleSubmit(e) {
  e.preventDefault();
  const target = e.target;
  const name = target.querySelector('#name').value;
  console.log('Name:', name); // Log the name to check if it's correct
  await vehicle_maintenance_project_backend.greet(name).then((response) => {
    console.log('Response:', response); // Log the response to check if it's received correctly
    greeting.value = response;
  });
}
</script>

<template>
  <main>
    <img src="/logo2.svg" alt="DFINITY logo" />
    <br />
    <br />
    <form action="#" @submit="handleSubmit">
      <label for="name">Enter your name: &nbsp;</label>
      <input id="name" alt="Name" type="text" />
      <button type="submit">Click Me!</button>
    </form>
    <section id="greeting">{{ greeting }}</section>
  </main>
</template>
