import { Link, RaindropCollection } from "./types";
import { arrayToTree } from "performant-array-to-tree";
import { request } from "obsidian";

const RAINDROP_API_BASE = "https://api.raindrop.io/rest/v1/";
// get this from settings
// const APP_CLIENT_ID = "621ab3b9fd43ef71e9bb66c9";
// const APP_SECRET_TEST = 'd81069c1-568b-4883-9629-eb410e821da0';
// const APP_SECRET_PROD = 'a56a5df0-18a3-499b-b03c-41fc5ad5be92';
// const APP_SECRET = APP_SECRET_TEST;
// const OBSIDIAN_PROTOCOL_HANDLER_ACTION = 'obsidian-raindrop-auth';
// const RAINDROP_REDIRECT_URI = `obsidian://${OBSIDIAN_PROTOCOL_HANDLER_ACTION}`;
// const OAUTH_URL = `https://api.raindrop.io/v1/oauth/authorize?client_id=${APP_CLIENT_ID}&redirect_uri=${RAINDROP_REDIRECT_URI}`;
// enum GRANT_TYPES {
// 	AUTHORIZATION_CODE = 'authorization_code',
//   REFRESH_TOKEN = 'refresh_token'
// }

// const handleRaindropOAuthCallback = (params: any) => {
// 	// https://developer.raindrop.io/v1/authentication/token
// 	console.info("handleRaindropOAuthCallback:");
// 	// expects {code: string} or {error: string}
// 	console.log(params);

// 	// check for error
// 	// 	access_denied (user says no to auth)
// 	// 	invalid_application_status (When your application exceeds the maximum token limit or when your application is being suspended due to abuse)
// 	const authCode = params.code || null;
// 	console.log({ authCode });
// 	if (authCode == null) return null;

// 	// if we have the code then we need to get the token
// 	const accessToken = getAccessToken(authCode);
//   // TODO: STORE ACCESS TOKEN IN USER SETTINGS
//   return accessToken;
// };

// const getAccessToken = (authCode: string) => {
// 	console.info("getAccessToken: ", authCode);
// 	const requestBody = {
// 		grant_type: GRANT_TYPES.AUTHORIZATION_CODE,
// 		code: authCode,
//     client_id: APP_CLIENT_ID,
//     client_secret: APP_SECRET,
//     redirect_uri: RAINDROP_REDIRECT_URI
// 	};

//   console.log({requestBody});
// };

// const refreshAccessToken = () => {
//   const requestBody = {
// 		grant_type: GRANT_TYPES.REFRESH_TOKEN,
//     client_id: APP_CLIENT_ID,
//     client_secret: APP_SECRET,
//     refresh_token: 'TOKEN FROM USER SETTINGS'
// 	};
// }

const getCollections = async (accessToken: string) => {
	// console.info("getCollections");
  // TODO get both root and children collections
  // !!! https://npm.io/package/tree-util
  // https://www.cssscript.com/demo/json-data-tree-view/
  // https://www.cssscript.com/demo/simple-tree-view-component/
  // https://www.cssscript.com/demo/tree-view-nested-list/
  // https://codemyui.com/directory-list-with-collapsible-nested-folders-and-files/
  let collections: Record<string,RaindropCollection>;
  let rootCollections: Record<string,RaindropCollection>;
  let childrenCollections: Record<string,RaindropCollection>;
  let collectionsArr: RaindropCollection[];
  let rootCollectionsArr: RaindropCollection[];
  let childrenCollectionsArr: RaindropCollection[];

  // TODO merge these
	// await fetch(`${RAINDROP_API_BASE}collections/childrens`, {
	await fetch(`${RAINDROP_API_BASE}collections`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})
  .then((res: any) => res.json())
  .then((json: any) => {
    // console.log(json.items)
    const items: any[] = json.items;
    rootCollectionsArr = items.map((collection, i) => {
      return {
        title: collection.title,
        id: collection._id,
        description: collection.description,
        count: collection.count
      } as RaindropCollection;
    });

    rootCollections = items.reduce(
      (map: Record<string,RaindropCollection>, collection: any) => {
        // console.log(collection)
        map[collection._id] = {
          title: collection.title,
          id: collection._id,
          description: collection.description,
          count: collection.count
        } as RaindropCollection;

        return map
      },
      {}
    )
  });

  await fetch(`${RAINDROP_API_BASE}collections/childrens`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})
  .then((res: any) => res.json())
  .then((json: any) => {
    // console.log(json.items)
    const items: any[] = json.items;

    childrenCollectionsArr = 
      items.map((collection, i) => {
      return {
        title: collection.title,
        id: collection._id,
        description: collection.description,
        count: collection.count,
        parentId: collection.parent['$id']
      } as RaindropCollection;
    });


    childrenCollections = items.reduce(
      (map: Record<string,RaindropCollection>, collection: any) => {
        // console.log(collection)
        map[collection._id] = {
          title: collection.title,
          id: collection._id,
          description: collection.description,
          count: collection.count,
          parentId: collection.parent['$id']
        } as RaindropCollection;

        return map
      },
      {}
    )
  });

  collections = {...rootCollections, ...childrenCollections}
  collectionsArr = [...rootCollectionsArr, ...childrenCollectionsArr]

  // console.log(collectionsArr);
  let collectionsTree = arrayToTree(
    collectionsArr,
    { id: "id", parentId: "parentId", childrenField: "children" }
    );
  // console.log(collectionsTree);

  return collectionsTree;
  // return collections;
};

const getRaindrops = async (collectionID: number = 0, search: string, sort: string, accessToken: string) => {
	const authorizationHeader = `Bearer ${accessToken}`;
	let params: Record<string, any> = {
	}
  
  let url = new URL(`${RAINDROP_API_BASE}raindrops/${collectionID}`);
	if(search) params = {search, ...params}
	if(sort) params = {sort, ...params}
  
  url.search = new URLSearchParams(params).toString();

  return await fetch(url.toString(), {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`,
      // ContentType: 'application/json'
		},
	})
  .then((res: any) => res.json())
  .then((json: any) => {
    console.log(json);
    return json;
  });
}

const createRaindrop = (link: Link, accessToken: string) => {
	console.info("createRaindrop");
	// const authorizationHeader = `Bearer ${accessToken}`;
	// let requestBody: Record<string, any> = {
	//   pleaseParse: {},
	//   link: link.url
	// }
	// if(link.text) requestBody.title = link.text;

	// request({
	//   url: `${RAINDROP_API_BASE}raindrop`,
	//   method: 'POST',
	//   contentType: 'application/json',
	//   body: JSON.stringify(requestBody),
	//   headers: {
	//     'Authorization': authorizationHeader
	//   }

	// })
};

const raindropConstants = {
	// OBSIDIAN_PROTOCOL_HANDLER_ACTION
};

export {
	// handleRaindropOAuthCallback,
	// refreshAccessToken,
	getCollections,
	createRaindrop,
  getRaindrops,
	raindropConstants,
};
