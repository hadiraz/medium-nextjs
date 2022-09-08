import {
    createCurrentUserHook,
    createClient,
} from "next-sanity" ;
import imageUrlBuilder from '@sanity/image-url' ;

export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "2021-08-11", // or today's date for latest
    useCdn: process.env.NODE_ENV === false,
  };
  
  export const sanityClient = createClient(config) ;
  export const urlFor = (source) => imageUrlBuilder(config).image(source) ;
  export const useCurrentUser = createCurrentUserHook(config) ;