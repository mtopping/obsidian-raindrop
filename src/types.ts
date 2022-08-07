interface Link {
  text?: string
  url: string
}

interface RaindropCollection {
  title: string
  description?: string
  count: number
  id: string
  parentId?: string
}

interface BlockQueryMap {
  highlights: boolean
  raindropIDs?: string | null
  search?: string | null
  format?: string | null
  sort?: string | null
  collection?: number | null
  showTags?: boolean
}

type BlockQueryMapKeys = 'search' | 'format' | 'sort' | 'collection' | 'showTags' | 'raindropIDs' | 'highlights';

export type {
  Link,
  RaindropCollection,
  BlockQueryMap,
  BlockQueryMapKeys
}