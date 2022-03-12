<script lang="ts">
  import { IsFetching, useQuery } from "@sveltestack/svelte-query";
  import { getRaindrops } from "src/raindrop";
  import RaindropTag from "./RaindropTag.svelte";
  import WaitingIndicator from "./WaitingIndicator.svelte";

  import type { BlockQueryMap } from "../types";
  import type { ObsidianRaindropSettings } from "main";

  export let params: BlockQueryMap;
  export let settings: ObsidianRaindropSettings;

  const raindropsCacheKey = [`raindrops`, params];
  let raindrops: any;

  const refetchInterval = !isNaN(parseInt(settings.bookmarkListRefreshInterval))
    ? parseInt(settings.bookmarkListRefreshInterval) * 60000
    : 60000;

  raindrops = useQuery(
    raindropsCacheKey,
    async () =>
      getRaindrops(
        params["collection"],
        params["search"],
        params["sort"],
        settings.raindropAccessToken
      ),
    {
      retry: false,
      refetchInterval,
      staleTime: Infinity,
      cacheTime: Infinity,
      notifyOnChangeProps: ["data", "error"],
    }
  );
  console.log(params.format);
</script>

<div id="bookmark-block-container" class="container">
  {#if $raindrops.status === "loading"}
    <WaitingIndicator />
  {:else if $raindrops.status === "error"}
    <span>Error: {$raindrops.error.message}</span>
  {:else}
    {#if params.format === "list"}
      <ul>
        {#each $raindrops.data.items as bookmark}
          <li class="">
            <span class="link-wrapper"
              ><a href={bookmark.link}>{bookmark.title}</a></span
            >
            {#if params.showTags === true}
              <span class="tag-wrapper">
                {#each bookmark.tags as tag, i}
                  <RaindropTag text={tag} />
                {/each}
              </span>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <table cellpadding="0" cellspacing="0">
        {#each $raindrops.data.items as bookmark}
          <tr>
            <td class="link-wrapper">
              <a href={bookmark.link}>
                {bookmark.title}
              </a>
            </td>
            {#if params.showTags === true}
              <td class="tag-wrapper">
                {#each bookmark.tags as tag, i}
                  <RaindropTag text={tag} />
                {/each}
              </td>
            {/if}
          </tr>
        {/each}
      </table>
    {/if}
    {#if $raindrops.IsFetching}
      <WaitingIndicator />
    {/if}
  {/if}
</div>

<style lang="scss">
  table {
    width: 100%;
    border-collapse: collapse;

    tr {
      align-items: center;
      display: flex;
      height: 2em;

      .link-wrapper {
        min-width: 70%;
      }
    }

    td {
      display: flex;
      height: 100%;
      width: 100%;

      & > * {
        align-self: center;
      }
    }
  }

  ul {
    li {
      margin-bottom: 1em;
    }
  }

  :global(div[data-mode="source"]) ul {
    padding-left: 1em;
  }

  .link-wrapper {
    display: block;
  }
</style>
