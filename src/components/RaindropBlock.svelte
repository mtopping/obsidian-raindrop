<script lang="ts">
  import { IsFetching, useQuery } from "@sveltestack/svelte-query";
  import { getRaindrops, getRaindropsCollection } from "src/raindrop";
  import RaindropTag from "./RaindropTag.svelte";
  import WaitingIndicator from "./WaitingIndicator.svelte";

  import type { BlockQueryMap } from "../types";
  import type { ObsidianRaindropSettings } from "main";
  import { dataset_dev } from "svelte/internal";

  export let params: BlockQueryMap;
  export let settings: ObsidianRaindropSettings;

  const raindropsCacheKey = [`raindrops`, params];
  let raindrops: any;

  const refetchInterval = settings.bookmarkListRefreshInterval
    ? settings.bookmarkListRefreshInterval * 60000
    : 60000;

  raindrops = useQuery(
    raindropsCacheKey,
    async () => {
      console.log(params);
      return await getRaindrops(params, settings.raindropAccessToken);
    },
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
    {#if params.format === "table"}
      <table cellpadding="0" cellspacing="0" class="raindrop-table">
        {#each $raindrops.data as raindrop}
          <tr>
            <td class="raindrop-link-cell">
              <a href={raindrop.link}>
                {raindrop.title}
              </a>
            </td>
            {#if params.showTags === true}
              <td class="tag-cell">
                <div class="tags">
                  {#each raindrop.tags as tag, i}
                    <RaindropTag text={tag} />
                  {/each}
                </div>
              </td>
            {/if}
          </tr>
          {#if params.highlights === true}
          <tr>
            <td class="highlight-cell" colspan="{params.showTags ? 2 : 1}">
              <ul class="raindrop-highlight-list">
                {#each raindrop.highlights as highlight}
                  <li class="raindrop-highlight-list-item">
                    <figure class="raindrop-highlight-figure">
                      <blockquote
                        class="raindrop-blockquote"
                        cite={highlight.link}
                      >
                        <p>{highlight.text}</p>
                      </blockquote>
                    </figure>
                    {#if highlight.note}
                      <p class="raindrop-highlight-note">{highlight.note}</p>
                    {/if}
                  </li>
                {/each}
              </ul>
            </td>
          </tr>
        {/if}
        {/each}
      </table>
    {:else}
      <ul class="raindrop-list">
        {#each $raindrops.data as raindrop}
          <li class="raindrop-list-item">
            <span class="raindrop-link"
              ><a href={raindrop.link}>{raindrop.title}</a></span
            >
            {#if params.showTags === true && raindrop.tags.length > 0}
              <ul class="raindrop-tag-list">
                {#each raindrop.tags as tag}
                  <li class="raindrop-tag-list-item">
                    <RaindropTag text={tag} />
                  </li>
                {/each}
              </ul>
            {/if}
            {#if params.highlights === true}
              <ul class="raindrop-highlight-list">
                {#each raindrop.highlights as highlight}
                  <li class="raindrop-highlight-list-item">
                    <figure class="raindrop-highlight-figure">
                      <blockquote
                        class="raindrop-blockquote"
                        cite={highlight.link}
                      >
                        <p>{highlight.text}</p>
                      </blockquote>
                    </figure>

                    {#if highlight.note}
                      <p class="raindrop-highlight-note">{highlight.note}</p>
                    {/if}
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
    {#if $raindrops.IsFetching}
      <WaitingIndicator />
    {/if}
  {/if}
</div>

<style lang="scss">
  .raindrop {
    &-table {
      td {
        padding-bottom: 0.25em;
        padding-top: 0.25em;

        &.raindrop-link-cell {
          width: 70%;
        }

        &.raindrop-tag-cell {
          .tags {
            display: flex;
            flex-wrap: wrap;

            & > :global(*) {
              margin-bottom: 0.25em;
              margin-top: 0.25em;
            }
          }
        }
      }
    }

    &-list {
      display: flex;
      flex-direction: column;
      list-style-type: none;
      margin: 0;
      padding-left: 0;
    }

    &-highlight-list {
      margin-bottom: 0;
      margin-top: 1em;
      padding-left: 0;

      &-item {
        margin-bottom: 2em;
      }
    }

    &-list-item,
    &-highlight-list-item {
      display: flex;
      flex-direction: column;
    }

    &-highlight-figure {
      display: flex;
      flex-direction: column;
    }

    &-tag-list {
      display: flex;
      justify-content: flex-start;
      margin: 0;
      padding: 0;
      text-align: right;

      &-item {
        list-style-type: none;
      }
    }

    &-highlight-note {
      font-style: italic;
      padding-left: 2em;
    }
  }

  .raindrop-blockquote,
  .raindrop-highlight-figure {
    margin: 0;
  }

  :global(div[data-mode="source"]) .raindrop-highlight-list {
    padding-left: 0;
  }
</style>
