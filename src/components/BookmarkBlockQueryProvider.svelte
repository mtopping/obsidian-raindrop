<script lang="ts">
  import { QueryClientProvider } from "@sveltestack/svelte-query";
  import type { ObsidianRaindropSettings } from "main";
  import type { BlockQueryMap } from "../types";
  import BookmarkBlock from "./BookmarkBlock.svelte";

  export let params: BlockQueryMap;
  export let settings: ObsidianRaindropSettings;
</script>

<QueryClientProvider>
  <BookmarkBlock {params} {settings} />
</QueryClientProvider>
