import type { Article, MovieIntelligence } from '../types'
import { supabase } from './supabase'

let cachedArticles: Article[] | null = null

export async function getPublishedArticles(): Promise<Article[]> {
  if (cachedArticles) return cachedArticles

  try {
    if (supabase) {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('publication_date', { ascending: false })
        .limit(50)

      if (data && data.length > 0) {
        cachedArticles = data as Article[]
        return cachedArticles
      }
    }
  } catch {
    // Fall through to static data
  }

  // Fallback: load from static JSON
  try {
    const resp = await fetch('/BriefBeakon/data/articles.json')
    if (resp.ok) {
      const data = await resp.json() as Article[]
      // Filter unique by slug (latest version wins)
      const map = new Map<string, Article>()
      for (const a of data) {
        map.set(a.slug, a)
      }
      cachedArticles = Array.from(map.values())
        .sort((a, b) => b.publication_date.localeCompare(a.publication_date))
      return cachedArticles
    }
  } catch {
    // No data available
  }

  return []
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getPublishedArticles()
  return articles.find(a => a.slug === slug) ?? null
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await getPublishedArticles()
  return articles.filter(a => a.category === category)
}
