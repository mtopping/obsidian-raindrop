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
            >{#if params.showTags === true}
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
                <div class="tags">
                  {#each bookmark.tags as tag, i}
                    <RaindropTag text={tag} />
                  {/each}
                </div>
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
    // width: 100%;
    // border-collapse: collapse;

    tr {
      // align-items: stretch;
      // display: flex;
    }

    td {
      padding-bottom: 0.25em;
      padding-top: 0.25em;
      // display: flex;

      // flex-wrap: wrap;
      // overflow: hidden;

      & > * {
        // align-self: center;
      }

      &.link-wrapper {
        width: 70%;
      }

      &.tag-wrapper {
        .tags {
          display: flex;
          flex-wrap: wrap;

          & > :global(*) {
            margin-bottom: 0.25em;
            margin-top: 0.25em;
          }
        }
        // justify-content: flex-end;
        // width: 30%;
        // display: flex;
        // flex-wrap: wrap;
      }
    }
  }

  ul {
    li {
      margin-bottom: 1em;

      .link-wrapper {
        display: block;
      }
    }
  }

  :global(div[data-mode="source"]) ul {
    padding-left: 1em;
  }
</style>
