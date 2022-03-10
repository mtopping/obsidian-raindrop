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
  search?: string | null
  format?: string | null
  sort?: string | null
  collection?: number | null
}

type BlockQueryMapKeys = 'search' | 'format' | 'sort' | 'collection';

export type {
  Link,
  RaindropCollection,
  BlockQueryMap,
  BlockQueryMapKeys
}