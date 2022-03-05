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

export type {
  Link,
  RaindropCollection
}