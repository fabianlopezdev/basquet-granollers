<script>
  export let item;
</script>

{#if item.image}
  <article class="slider-item">
    <a href={`/projectes-i-events/${item.slug}`}>
      <img
        class="image"
        src={item.image.url}
        alt={item.image.alt}
        loading="lazy"
      />
    </a>
  </article>
{/if}

<style>
  .slider-item {
    width: var(--wd-slider-item);
    height: 11.0625rem;
    flex-shrink: 0;
    scroll-snap-align: start;
    background-color: var(--clr-contrast);
  }

  a {
    display: block;
    height: 100%;
  }

  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
