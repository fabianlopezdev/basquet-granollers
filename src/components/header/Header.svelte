<script>
    import TopHeader from "./TopHeader.svelte";
    import BottomHeader from "./bottomHeader/BottomHeaderResponsive.svelte";
    import HeaderLineSeparator from "./HeaderLin";
    import BottomHeaderResponsive from "./bottomHeader/BottomHeaderResponsive.svelte";
    import {
      extractNavigation,
      extractTopHeaderContent,
    } from "@utils/helperFunctions";
    import { pages, posts, headerData, socialMediaInfo } from "@data/apiData";
    import { EXCLUDED_PAGES } from "@data/globalConstants";
  
    const {
      content: { rendered: content },
    } = headerData[0];
  
    const topHeaderContent = extractTopHeaderContent(content);
    const bottomHeaderNav = extractNavigation(content);
  
    const pagesToSearch = pages.filter((page) => !EXCLUDED_PAGES.has(page.slug));
    const postsToSearch = posts.filter(
      (post) =>
        post.categories.includes(19) ||
        post.categories.includes(41) ||
        post.categories.includes(42)
    );
  
    postsToSearch.forEach((post) => {
      if (
        (post.categories.includes(19) || post.categories.includes(41)) &&
        !post.slug.includes("noticies")
      ) {
        post.slug = `./noticies/${post.slug}`;
      } else if (
        post.categories.includes(42) &&
        !post.slug.includes("projectes-i-events")
      ) {
        post.slug = `./projectes-i-events/${post.slug}`;
      }
    });
  
    const websiteContent = [...pagesToSearch, ...postsToSearch];
  
    let isScrolling = false;
  
    const handleScroll = () => {
      if (window.scrollY > 0) {
        // Scrolling down
        if (!isScrolling) {
          document.getElementById("bottom-header").style.setProperty("--hg-header-bottom-section", "2.75rem");
          isScrolling = true;
        }
      } else {
        // At the top of the page
        if (isScrolling) {
          document.getElementById("bottom-header").style.setProperty("--hg-header-bottom-section", "");
          isScrolling = false;
        }
      }
    };
  </script>
  
  <svelte:window on:scroll={handleScroll} />
  
  <header>
    <section class="header-top-section">
      <TopHeader {topHeaderContent} />
    </section>
    <section class="header-bottom-section">
      <div class="bottom-header" id="bottom-header">
        <BottomHeader {websiteContent} navigation={bottomHeaderNav} />
      </div>
      <div class="bottom-header responsive">
        <BottomHeaderResponsive
          {websiteContent}
          navigation={bottomHeaderNav}
          {topHeaderContent}
          {socialMediaInfo}
        />
      </div>
    </section>
    <div class="separator-line">
      <HeaderLineSeparator />
    </div>
  </header>
  
  <style>
    header {
      position: sticky;
      top: 0;
      z-index: 10;
    }
  
    .header-top-section {
      min-height: var(--hg-header-top-section);
      background-color: var(--clr-primary);
    }
  
    .bottom-header {
      height: var(--hg-header-bottom-section, 6.3125rem);
      background-color: var(--clr-contrast);
      background-color: rgba(243, 243, 243, 0.9);
      position: relative;
      transition: height 0.5s ease-in-out;
    }
  
    .responsive {
      display: none;
    }
  
    .separator-line {
      height: var(--hg-sponsors-all);
    }
  
    @media (max-width: 1181px) {
      .bottom-header {
        display: none;
        padding-inline: var(--pd-x);
      }
  
      .separator-line {
        height: var(--hg-sponsors-all-responsive);
      }
  
      .responsive {
        display: block;
      }
    }
  
    @media (max-width: 1065px) {
      .bottom-header {
        padding-inline: var(--pd-x-medium);
      }
    }
  
    @media (max-width: 648px) {
      .header-top-section {
        display: none;
      }
  
      .bottom-header {
        padding-inline: var(--pd-x-small);
      }
    }
  </style>