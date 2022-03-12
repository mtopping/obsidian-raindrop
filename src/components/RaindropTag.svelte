<script lang="ts">
  export let text: string;
</script>

<style lang="scss">
  .raindrop-tag {
    --raindrop-tag-link-color: var(--text-normal);
    --raindrop-tag-link-color-hover: var(--text-accent-hover);

    align-self: center;
    border-color: inherit;
    border-radius: 1em;
    border-style: solid;
    border-width: 1px;
    color: var(--raindrop-tag-link-color);
    display: inline-block;
    line-height: 1;
    font-size: 0.7em;
    margin-right: 0.5em;
    padding-bottom: 0.15em;
    padding-left: 1em;
    padding-right: 1em;
    padding-top: 0.15em;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      color: var(--raindrop-tag-link-color-hover);
    }

    &:last-child {
      margin-right: 0;
    }
  }
</style>

<a
class="cm-hashtag cm-hashtag-end raindrop-tag"
href={`https://app.raindrop.io/my/0/%23${text}`}>{`#${text}`}</a>