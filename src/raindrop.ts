const RAINDROP_API_BASE = "https://api.raindrop.io/rest/v1/";

const getRaindrops = async (collectionID: number = 0, search: string, sort: string, accessToken: string) => {
  // console.info('getRaindrops');
	let params: Record<string, any> = {}
  let url = new URL(`${RAINDROP_API_BASE}raindrops/${collectionID}`);
  
	if(search) params = {search, ...params}
	if(sort) params = {sort, ...params}

  url.search = new URLSearchParams(params).toString();

  return await fetch(url.toString(), {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})
  .then((res: any) => res.json())
  .then((json: any) => {
    return json;
  });
}

export {
  getRaindrops,
}
