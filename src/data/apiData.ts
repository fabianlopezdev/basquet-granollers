import {
  fetchImagesInPageBySlug,
  fetchPageBySlug,
  fetchPages,
  fetchPosts,
  fetchPostsInCategories,
} from "@utils/apiFunctions";

import type { Post } from "../types";
import {
  COMMON_FIELDS,
  PROJECTS_CATEGORY_ID,
  NEWS_CATEGORY_ID,
  HERO_SLIDES_CATEGORY_ID,
  FEATURED_NEWS_CATEGORY_ID,
  CONFIG_PAGES,
  TEAM_PAGES,
} from "./globalConstants";

export const [
  pages,
  posts,
  projectsAndHeroSlides,
  allNews,
  joinData,
  socialMediaInfo,
  headerData,
  footerData,
  mainSponsorsWhite,
  mainSponsorsBlue,
  otherSponsors, //only blue
  teamsCategories,
  schoolTeamData,
  coachesData,
  wheelchairTeamData,
  maleTeamsData,
  maleSeniorTeamData,
  femaleTeamsData,
  femaleSeniorTeamData,
] = await Promise.all([
  fetchPages(100, COMMON_FIELDS),
  fetchPosts(100, ["categories", ...COMMON_FIELDS]),
  fetchPostsInCategories(
    [PROJECTS_CATEGORY_ID, HERO_SLIDES_CATEGORY_ID],
    ["categories", ...COMMON_FIELDS],
    100,
  ),
  fetchPostsInCategories(
    [NEWS_CATEGORY_ID],
    ["categories", ...COMMON_FIELDS],
    100,
  ),
  //Fetching of Config pages
  fetchPageBySlug(CONFIG_PAGES.homePageJoinSection, ["content"]),
  fetchImagesInPageBySlug(CONFIG_PAGES.socialMedia),
  fetchPageBySlug(CONFIG_PAGES.header, ["content"]),
  fetchPageBySlug(CONFIG_PAGES.footer, ["content"]),
  fetchImagesInPageBySlug(CONFIG_PAGES.homePageMainSponsorsWhite),
  fetchImagesInPageBySlug(CONFIG_PAGES.homePageMainSponsorsBlue),
  fetchImagesInPageBySlug(CONFIG_PAGES.homePageOtherSponsors),
  fetchImagesInPageBySlug(TEAM_PAGES.allTeams),
  fetchImagesInPageBySlug(TEAM_PAGES.school),
  fetchImagesInPageBySlug(TEAM_PAGES.coaches),
  fetchImagesInPageBySlug(TEAM_PAGES.wheelchair),
  fetchImagesInPageBySlug(TEAM_PAGES.maleTeams),
  fetchImagesInPageBySlug(TEAM_PAGES.maleSenior),
  fetchImagesInPageBySlug(TEAM_PAGES.femaleTeams),
  fetchImagesInPageBySlug(TEAM_PAGES.femaleSenior),
]);

async function initializePostTypes(
  allNews: Post[],
  projectsAndHeroSlides: Post[],
) {
  let news: Post[] = [];
  let featuredNews: Post[] = [];
  let projects: Post[] = [];
  let heroSlides: Post[] = [];

  for (let i = 0; i < projectsAndHeroSlides.length; i++) {
    if (Array.isArray(projectsAndHeroSlides[i].categories)) {
      if (
        projectsAndHeroSlides[i].categories.includes(HERO_SLIDES_CATEGORY_ID)
      ) {
        heroSlides.push(projectsAndHeroSlides[i]);
      } else {
        projects.push(projectsAndHeroSlides[i]);
      }
    }
  }

  let newsToRender;
  if (featuredNews) newsToRender = [featuredNews[0], ...news];
  else newsToRender = news;

  return {
    newsToRender,
    projects,
    heroSlides,
  };
}
export const { newsToRender, projects, heroSlides } = await initializePostTypes(
  allNews,
  projectsAndHeroSlides,
);
