<svelte:options immutable />

<script lang="ts">
	import { onMount } from "svelte";

	import Select from "svelte-select";
	// import Child from './Child.svelte';

	let selectComponent: Select;
	let items = [
		{ value: "chocolate", label: "Chocolate" },
		{ value: "pizza", label: "Pizza" },
		{ value: "cake", label: "Cake" },
		{ value: "chips", label: "Chips" },
		{ value: "ice-cream", label: "Ice Cream" },
	];

	let value = { value: "cake", label: "Cake" };

	// function handleSelect(event:any) {
	//   console.log('selected item', event.detail);
	//   // .. do something here 🙂
	// }

	onMount(() => {
		const selectComponentWrapper = document.createElement("div");
		this.selectComponent = new Select({
			target: document.querySelector('#select-wrapper'),
			// target: selectComponentWrapper,
			props: {
				items,
			},
		});
		// const script = document.curr
		// script.parentNode.insertBefore(selectComponentWrapper, script);
		console.log("here", this);
	});
</script>

<div id="select-wrapper" />
<!-- <Select {items}></Select> -->
<!-- <Select /> -->
<!-- <Child /> -->
