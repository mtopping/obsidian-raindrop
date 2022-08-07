<script lang="ts">
  import { QueryClientProvider } from "@sveltestack/svelte-query";
  import type { ObsidianRaindropSettings } from "main";
  import type { BlockQueryMap } from "../types";
  import RaindropBlock from "./RaindropBlock.svelte";

  export let params: BlockQueryMap;
  export let settings: ObsidianRaindropSettings;
</script>

<QueryClientProvider>
  <RaindropBlock {params} {settings} />
</QueryClientProvider>
