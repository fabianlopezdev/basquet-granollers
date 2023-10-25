<script>
  import { closeIcon, magnifyingGlass } from "@assets/icons";
  import { formatHTMLContent } from "@utils/helperFunctions";
  import DOMPurify from "dompurify";
  import { isModalOpen } from "src/svelte/store";
  export let websiteContent = [];

  let filteredContent = websiteContent;
  let searchInput = "";
  let showResults = false;
  let showAside = false;

  // console.log('websiteContent', websiteContent)
  const handleInput = () => {
    const sanitizedInput = DOMPurify.sanitize(searchInput.toLowerCase());
    // Step 1: Filter the content
    const matchingContent = websiteContent.filter((post) => {
      const title = post.title.rendered.toLowerCase();
      const content = post.content.rendered.toLowerCase();
      const slug = post.slug.toLowerCase();
      return (
        title.includes(sanitizedInput) ||
        content.includes(sanitizedInput) ||
        slug.includes(sanitizedInput)
      );
    });
    // Step 2: Sort the filtered content
    filteredContent = matchingContent.sort((a, b) => {
      const aTitle = a.title.rendered.toLowerCase();
      const bTitle = b.title.rendered.toLowerCase();
      const aContent = a.content.rendered.toLowerCase();
      const bContent = b.content.rendered.toLowerCase();
      // Here, we prioritize matches in the title over matches in the content
      if (aTitle.includes(sanitizedInput) && !bTitle.includes(sanitizedInput)) {
        return -1; // a comes first
      }
      if (!aTitle.includes(sanitizedInput) && bTitle.includes(sanitizedInput)) {
        return 1; // b comes first
      }
      // Fallback to original order if both or neither have the search term in the title
      return 0;
    });
    showResults = searchInput.length > 2 && filteredContent.length > 0;
  };

  const toggleForm = () => {
    if ($isModalOpen === "modalSearchMenu") {
      showAside = false;
      isModalOpen.set("noModalOpen");
    } else {
      showAside = true;
      isModalOpen.set("modalSearchMenu");
    }

    if (!showAside) {
      searchInput = "";
      showResults = false;
    }
  };

  $: {
    if ($isModalOpen === "modalMenu" && showAside) {
      showAside = false;
    }
  }
</script>

<button type="button" on:click={toggleForm}>
  {@html magnifyingGlass}
</button>

<aside class="searchModal" class:show={showAside}>
  <form action="" class="form">
    <input
      style="font-family: 'obviously', sans-serif; font-size: var(--font-size-regular); font-weight: 400;"
      type="search"
      min="2"
      max="24"
      name="search"
      id="search"
      placeholder="Buscar"
      bind:value={searchInput}
      on:input={handleInput}
    />

    <button type="button" class="close-icon" on:click={toggleForm}>
      {@html closeIcon}
    </button>
  </form>

  <ul
    class="results-modal"
    class:show={showResults ||
      (searchInput.length > 0 && filteredContent.length === 0)}
  >
    {#if filteredContent.length > 0}
      {#each filteredContent as post}
        <li>
          <a href={`/${post.slug}`}>{formatHTMLContent(post.title.rendered)}</a>
        </li>
      {/each}
    {:else if searchInput.length > 0}
      <li>No s'ha trobat res</li>
    {/if}
  </ul>
</aside>

<style>
  .results-modal {
    display: none;
  }

  .results-modal.show {
    display: flex;
  }

  aside {
    --searchbox-width: 18.875rem;
    position: fixed;
    /* display: none; */
    background-color: rgba(243, 243, 243, 0.9);
    color: var(--clr-contrast);
    top: calc(
      var(--bottom-header-hg) + var(--top-header-hg) +
        var(--header-separator-line-responsive-hg)
    );
    left: 0;
    right: 0;
    bottom: 0;
    padding-inline: var(--padding-inline-tablet);
    padding-block: 2.06rem;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.2s ease-in-out;
    z-index: 5;
    overflow-y: auto;
  }
  aside.show {
    transform: translateX(0);
  }
  form {
    position: relative;
  }
  .close-icon {
    position: absolute;
    /* right: calc(var(--padding-inline-mobile)); */
    right: 1rem;
    top: 0.4rem;
    /* top: 1.25rem; */
    /* width: 1.25rem; */
    /* height: 1.25rem; */
    /* cursor: pointer; */
    /* fill: var(--clr-primary); */
  }

  ul {
    flex-direction: column;
    gap: 0.75rem;
    padding-block: 0.81rem;
  }

  a {
    color: var(--clr-primary);
    font-weight: 500;
  }
  li {
    color: var(--clr-primary);
    font-weight: 500;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background-color: none;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--clr-primary);
    border-radius: 12px;
  }

  input {
    display: flex;
    border-radius: 1.34375rem;
    border: 1px solid var(--clr-primary);
    width: 100%; /* Set initial width to 2rem */
    height: 2.6875rem;
    background-color: transparent;
    padding-inline: 1.5rem;
    color: var(--clr-primary);
    transition: width 0.3s ease-in-out; /* Set transitions for opacity and width */
    font-size: var(--font-size-regular);
    font-weight: 600;
  }

  input:focus {
    outline: 2px solid var(--clr-primary); /* Blue outline */
  }

  input::placeholder {
    color: var(--clr-primary);
  }

  input[type="search"]::-webkit-search-cancel-button {
    display: none;
  }
  @media (width < 1258px) {
    aside {
      padding-inline: var(--padding-inline);
    }
  }

  @media (width < 1065px) {
    aside {
      padding-inline: var(--padding-inline-tablet);
    }
  }
  @media (width < 648px) {
    aside {
      top: calc(
        var(--bottom-header-hg) + var(--header-separator-line-responsive-hg)
      );
      padding-inline: var(--padding-inline-mobile);
    }
  }
</style>