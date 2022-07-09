const RAINDROP_API_BASE = "https://api.raindrop.io/rest/v1/";

const getRaindrops = async (collectionID: number = 0, search: string, sort: string, accessToken: string) => {
  console.info('getRaindrops');
  var myHeaders = new Headers();
  myHeaders.append("Authorization",  `Bearer ${accessToken}`);
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  // console.info('getRaindrops');
	let params: Record<string, any> = {}
  
  let raindrops_url = new URL(`${RAINDROP_API_BASE}raindrops/${collectionID}`);
  let individual_raindrop_url = new URL(`${RAINDROP_API_BASE}raindrop/`);
  
	if(search) params = {search, ...params}
	if(sort) params = {sort, ...params}

  raindrops_url.search = new URLSearchParams(params).toString();

  function fetchRaindropDetails(id: number, index: number) {
    return fetch(individual_raindrop_url.toString() + id, requestOptions)
    .then(response => response.json())
    .then(data => {
        return [index, data];
    });
  }

  function fetchRaindrops() {
    return fetch(raindrops_url.toString(), requestOptions)
    .then(response => response.json())
    .then(data => {
      return data;
    })
  }

  return (async () => {
    const data = await fetchRaindrops();
    const promises = data.items.map((raindrop: any, index: number) => fetchRaindropDetails(raindrop._id, index));
    await Promise.all(promises).then(responses => {
      responses.map(response => {
        data[response[0]] = {...data[response[0]], ...response[1]};
      })
    });
  
  const results = {
    "result": (data.items.length > 0) ? true : false,
    "items": Array<any>(),
    "count": 0,
    "collectionId": collectionID
  }
  
  for (const [key, value] of Object.entries(data)) {
    if (value.item){
      results.items.push(value.item)
      results.count += 1
    }
  }
  return results
  })()
  .then((json: any) => {
    return json;
  });
}

export {
  getRaindrops,
}
